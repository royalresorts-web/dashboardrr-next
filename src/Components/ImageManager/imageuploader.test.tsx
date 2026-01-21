import { render, screen, fireEvent, act } from '@testing-library/react'
import { Imageuploader } from './imageuploader';
import React from 'react'; // Import React to use its types
import { UserType } from '@/Context';
import { uploadImage } from '@/lib'; // Import the actual function to mock it
import { showToast } from 'nextjs-toast-notify'; // Import the actual module to mock it

// Mock next/image to behave like a standard img tag for testing
jest.mock("next/image", () => ({
    __esModule: true,
    default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
        // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
        return <img {...props} />
    },
}));


jest.mock('@/lib', () => ({
    ...jest.requireActual('@/lib'), // Keep other exports from @/lib if any
    uploadImage: jest.fn(),
}));

// Mock the toast notification library
jest.mock('nextjs-toast-notify', () => ({
    showToast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('Image uploader component', () => {

    const user: UserType = {
            uid: "YIHD784HFD",
            email: "israel.canul@gmail.com",
            photoURL: null,
            displayName: "Israel Canul",
            getIdToken: () => Promise.resolve("token654783")
        }

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers(); // Use fake timers for tests involving setTimeout
    });
    
    it('should display a preview of the selected file after selection', async () => {
        // Mock a File object
        const file = new File([''], 'TRS_45B.jpg', { type: 'image/jpeg' });
        
        render(<Imageuploader 
                user={user} 
                logout={()=> Promise.resolve()} 
                setLoading={()=>{}} 
                proyect='1' 
                updateFiles={()=>{}} 
                share={()=>{}} />);
        
        // Find the file input element using its associated label text
        const fileInput = screen.getByLabelText(/Arrastre o presione para agregar imagenes/i);

        // Simulate selecting a file
        fireEvent.change(fileInput, {
            target: { files: [file] },
        });

        // Assert that the ImagePreview component is rendered with the correct alt text
        const imageRendered = await screen.findByAltText(/preview before upload/i);
        expect(imageRendered).toBeInTheDocument();

    });

    it('should show upload results and a success toast after successful upload', async () => {
        // Mock a File object
        const file = new File([''], 'TRS_45B.jpg', { type: 'image/jpeg' });
        
        // Mock the uploadImage implementation to simulate success
        (uploadImage as jest.Mock).mockImplementation((files, email, proyect, callback) => {
            callback([{ file: 'TRS_45B.jpg', url: 'http://uploaded.com/TRS_45B.jpg', code: '0' }], null);
        });

        // Mock user.getIdToken
        const mockGetIdToken = jest.fn().mockResolvedValue('mock-token');
        const mockUser = {
            ...user,
            getIdToken: mockGetIdToken,
        };

        render(<Imageuploader 
                user={mockUser} // Pass the mock user
                logout={()=> Promise.resolve()} 
                setLoading={()=>{}} 
                proyect='1' 
                updateFiles={()=>{}} 
                share={()=>{}} />);
        
        // 1. Simulate file selection
        const fileInput = screen.getByLabelText(/Arrastre o presione para agregar imagenes/i);
        fireEvent.change(fileInput, {
            target: { files: [file] },
        });

        // Ensure the preview is rendered
        const imageRendered = await screen.findByAltText(/preview before upload/i);
        expect(imageRendered).toBeInTheDocument();

        // 2. Click the upload button
        const buttonUpload = screen.getByRole('button', { name: /subir/i });
        await act(async () => { // Use await act to ensure all asynchronous updates are processed
            fireEvent.click(buttonUpload);
        });

        // Assert that getIdToken and uploadImage were called after the async operations
        expect(mockGetIdToken).toHaveBeenCalledTimes(1); // This should now pass
        expect(uploadImage).toHaveBeenCalledTimes(1); // This should now pass
        expect(uploadImage).toHaveBeenCalledWith(
            expect.any(Array), // The File array
            mockUser.email,
            '1',
            expect.any(Function)
        );

        // Advance timers to trigger the setTimeout callback in clickSubmitImage
        await act(async () => {
            jest.advanceTimersByTime(2000);
        });

        // Assert toast notification
        expect(showToast.success).toHaveBeenCalledTimes(1);
        expect(showToast.success).toHaveBeenCalledWith(
            "Agregado Exitoso : TRS_45B.jpg",
            expect.any(Object)
        );

        // Assert that the uploaded URL is displayed
        const uploadedUrlInput = await screen.findByDisplayValue('http://uploaded.com/TRS_45B.jpg');
        expect(uploadedUrlInput).toBeInTheDocument();

        jest.useRealTimers(); // Restore real timers
    });

    afterEach(() => {
        jest.useRealTimers(); // Ensure real timers are restored after each test
    });
});
