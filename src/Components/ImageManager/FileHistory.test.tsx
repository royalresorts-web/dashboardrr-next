import { render, screen, fireEvent, within } from '@testing-library/react'
import { FileHistory } from './FileHistory';
import React from 'react';
import { UserType } from '@/Context'; // Assuming UserType is correctly imported
import { useFilesByEmail } from '@/Hooks';

// Mock the useFilesByEmail custom hook
const mockFiles = [
    { ID: "1", Name: "image1.jpg", Type: "image/jpeg", link: "http://example.com/image1.jpg", Proyect: "1" },
    { ID: "2", Name: "image2.png", Type: "image/png", link: "http://example.com/image2.png", Proyect: "1" },
    { ID: "3", Name: "image3.gif", Type: "image/gif", link: "http://example.com/image3.gif", Proyect: "2" },
];

const mockFetchFiles = jest.fn();

jest.mock('@/Hooks', () => ({
    useFilesByEmail: jest.fn(() => ({
        files: mockFiles,
        fetchFiles: mockFetchFiles,
    })),
}));

describe('FileHistory component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
   
    const user: UserType = {
        uid: "YIHD784HFD",
        email: "israel.canul@gmail.com",
        photoURL: null,
        displayName: "Israel Canul",
        getIdToken: () => Promise.resolve("token654783")
    }

    // Import the mocked hook to reset its behavior before each test
    // const { useFilesByEmail } = require('@/Hooks');

    it('renders images filtered by project inside files_wrapper', async () => {  
      const currentProyect = '1';

      // Ensure the mock returns the expected data for this test
      (useFilesByEmail as jest.Mock).mockReturnValue({ files: mockFiles, fetchFiles: mockFetchFiles });
      const { container } = render(<FileHistory email={user.email!} proyect={currentProyect} update={false} updateFiles={()=>{}} share={()=>{}} user={user} setLoading={()=>{}} />);
      
      // Find the div with the class "files_wrapper" using querySelector
      const filesWrapper = container.querySelector('.files_wrapper');
      expect(filesWrapper).toBeInTheDocument();
      expect(filesWrapper).toHaveClass('files_wrapper');

      // Now, use `within` to search for images inside this specific wrapper
      const imageRendered1 = await within(filesWrapper as HTMLElement).findByAltText(/preview image image1.jpg/i);
      const imageRendered2 = await within(filesWrapper as HTMLElement).findByAltText(/preview image image2.png/i);
      
      // image3.gif belongs to Proyect '2', so it should not be rendered when proyect='1'
      const imageRendered3 = within(filesWrapper as HTMLElement).queryByAltText(`preview image image3.gif`);

      expect(imageRendered1).toBeInTheDocument();
      expect(imageRendered2).toBeInTheDocument();
      expect(imageRendered3).not.toBeInTheDocument();
    });

    it('renders no images when no files match the project', async () => {
        const share = jest.fn();
        const currentProyect = '99'; // A project with no matching files
        
        (useFilesByEmail as jest.Mock).mockReturnValue({ files: mockFiles, fetchFiles: mockFetchFiles });
        const { container } = render(<FileHistory email={user.email!} proyect={currentProyect} update={false} updateFiles={()=>{}} share={share} user={user} setLoading={()=>{}} />);
        
        const filesWrapper = container.querySelector('.files_wrapper');
        expect(filesWrapper).toBeInTheDocument();

        // Expect no images to be present within the wrapper
        expect(within(filesWrapper as HTMLElement).queryByAltText(/preview image/i)).not.toBeInTheDocument();
    });

    it('shows more files when "Show More" button is clicked', async () => {
        const share = jest.fn();
        const currentProyect = '1';
        
        // Create more mock files for the same project to test "Show More"
        const allMockFilesForProject1 = [];
        for (let i = 1; i <= 18; i++) { // Create 18 files for project 1
            allMockFilesForProject1.push({
                ID: String(i),
                Name: `image${i}.jpg`,
                Type: "image/jpeg",
                link: `http://example.com/image${i}.jpg`,
                Proyect: "1"
            });
        }
        // Sort by ID descending as in FileHistory.tsx (e.g., 18, 17, ..., 1)
        const extendedMockFilesForProject1 = allMockFilesForProject1.sort((a, b) => parseInt(b.ID) - parseInt(a.ID));

        (useFilesByEmail as jest.Mock).mockReturnValue({ files: extendedMockFilesForProject1, fetchFiles: mockFetchFiles });
        const { container } = render(<FileHistory email={user.email!} proyect={currentProyect} update={false} updateFiles={()=>{}} share={share} user={user} setLoading={()=>{}} />);

        const filesWrapper = container.querySelector('.files_wrapper');
        expect(filesWrapper).toBeInTheDocument();

        // Initially, 17 files should be visible (numberFilesPerPage is 16, so indices 0-16 are rendered)
        // This means files with ID 18 down to 2 should be present.
        for (let i = 18; i >= 2; i--) {
            expect(within(filesWrapper as HTMLElement).queryByAltText(`preview image image${i}.jpg`)).toBeInTheDocument();
        }
        expect(within(filesWrapper as HTMLElement).queryByAltText(`preview image image1.jpg`)).not.toBeInTheDocument();

        const showMoreButton = screen.getByRole('button', { name: /show more/i });
        expect(showMoreButton).toBeInTheDocument();

        fireEvent.click(showMoreButton);

        // After clicking, all 18 files should be visible (ID 18 down to 1)
        for (const file of extendedMockFilesForProject1) {
            expect(await within(filesWrapper as HTMLElement).findByAltText(`preview image ${file.Name}`)).toBeInTheDocument();
        }
        expect(showMoreButton).not.toBeInTheDocument(); // Button should disappear if all files are shown
    });
})