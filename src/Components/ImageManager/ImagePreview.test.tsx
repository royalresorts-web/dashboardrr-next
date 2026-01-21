import { render, screen, fireEvent } from '@testing-library/react'
import { ImagePreview } from './ImagePreview';
import React from 'react'; // Import React to use its types



describe('Image previewer before upload component', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
   
    it('Checking if the preview image component is rendered properly', async () => {
        // Mock a File object
        const file = new File([''], 'TRS_45B.jpg', { type: 'image/jpeg' });
        render(<ImagePreview file={file} tipo='img' />);
      
        const imageRendered = await screen.findByAltText(/preview before upload/i);

        expect(imageRendered).toBeInTheDocument();
    });
})