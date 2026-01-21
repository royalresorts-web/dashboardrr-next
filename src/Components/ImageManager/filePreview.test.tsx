import { render, screen, fireEvent, within } from '@testing-library/react'
import {FilePreview} from './filePreview';
import React from 'react'; // Import React to use its types

// Mock next/image to behave like a standard img tag for testing
jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img {...props} />
    },
}));

describe('Image previewer component', () => {
    const urlImage = "https://royalresorts.mobi/api/images/standa2r/TRS_45B.jpg";
    const handleCopy = jest.fn();
    const handleDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Check if the image of the param is rendered properly', ()=>{
        render(<FilePreview id="2" type='ss' url={urlImage} name='Mi image' copyHandler={handleCopy} deleteHandler={handleDelete} updateFiles={()=>{}} />);

        const image = screen.getByAltText(/preview image/i) as HTMLImageElement;
        // With the mock, the src should match exactly without Next.js transformations
        expect(image.src).toBe(urlImage);
    });
    it('Checking if the copy icon is working', ()=>{
        render(<FilePreview id="2" type='ss' url={urlImage} name='Mi image' copyHandler={handleCopy} deleteHandler={handleDelete} updateFiles={()=>{}} />);
        fireEvent.click(screen.getByAltText(/copy_Icon/i));
        expect(handleCopy).toHaveBeenCalledTimes(1);
    });
    it('Checking if the delete modal is working', async ()=>{
        render(<FilePreview id="2" type='ss' url={urlImage} name='Mi image' copyHandler={handleCopy} deleteHandler={handleDelete} updateFiles={()=>{}} />);
        
        fireEvent.click(screen.getByAltText(/delete_Icon/i) as HTMLImageElement);
        
        // Use findByText to wait for the modal to render (async/portal behavior)
        const deleteModal = await screen.findByText(/desea eliminar el registro/i);

        expect(deleteModal).toBeInTheDocument();
    });

    it('Checking if the preview modal is working', async ()=>{
        render(<FilePreview id="2" type='ss' url={urlImage} name='Mi image' copyHandler={handleCopy} deleteHandler={handleDelete} updateFiles={()=>{}} />);
        
        fireEvent.click(screen.getByAltText(/preview image mi image/i) as HTMLImageElement);
        
        // Wait for the modal dialog to appear (it has role="dialog")
        const dialog = await screen.findByRole('dialog');
        expect(dialog).toBeInTheDocument();

        // Now, use `within` to scope the search to the dialog and find the image with the exact alt text
        const infoModalImage = await within(dialog).findByAltText('Mi image');
        expect(infoModalImage).toBeInTheDocument();

        // Optionally, you can also check for the close button within the dialog
        const closeButton = await within(dialog).findByRole('button', { name: /cerrar/i });
        expect(closeButton).toBeInTheDocument();
    });
})