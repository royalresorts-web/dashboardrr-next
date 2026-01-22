import { render, screen } from '@testing-library/react'
import { RecordAddFile } from './AddFileToRecord'
import { UserType } from '@/Context'

// Mock the showToast from nextjs-toast-notify as it's used in RecordAddFile
jest.mock('nextjs-toast-notify', () => ({
    showToast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe('Certificate - Add file component', () => {
    const certificate = {
        "id": 2,
        "folio": "9864",
        "name": "israel",
        "last_name": "canul",
        "email": "icanul@royalresorts.com",
        "email_user": "israel.canul@gmail.com",
        "status": "Enviado",
        "fecha": "01/20/2026",
        "fecha_enviado": "01/20/2026",
        "user": 1,
        "url_file": "https://royalresorts.mobi/api/images/disclaimer/certificate-233875-therisingeagle@breezelineohio.net.pdf",
    }
    const user: UserType = {
        uid: "YIHD784HFD",
        email: "israel.canul@gmail.com",
        photoURL: null,
        displayName: "Israel Canul",
        getIdToken: () => Promise.resolve("token654783")
    }

  it('should open the modal when `open` prop is true and close it when `open` prop becomes false', async () => {
    const mockOnOpenChange = jest.fn();
    const mockHandleStatus = jest.fn();
    const mockSetLoading = jest.fn();

    // 1. Render the component with open={true}
    const { rerender } = render(
      <RecordAddFile
        user={user}
        folio='9864'
        idFolio={1}
        cert={certificate}
        handleStatus={mockHandleStatus}
        open={true} // Initially open
        onOpenChange={mockOnOpenChange}
        setLoading={mockSetLoading}
      />
    );

    // Assert that the modal content is visible when open is true
    const modalTitle = await screen.findByText(/9864/i); // Using folio as a unique identifier in the title
    expect(modalTitle).toBeInTheDocument();
    expect(screen.getByText(/hay un archivo cargado para este registro/i)).toBeInTheDocument();

    // 2. Re-render the component with open={false}
    rerender(
      <RecordAddFile
        user={user}
        folio='9864'
        idFolio={1}
        cert={certificate}
        handleStatus={mockHandleStatus}
        open={false} // Now closed
        onOpenChange={mockOnOpenChange}
        setLoading={mockSetLoading}
      />
    );

    // Assert that the modal content is no longer visible
    expect(screen.queryByText(/hay un archivo cargado para este registro/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/9864/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('If the certificate has a file, it will be shown in the modal.', async () => {
    const mockOnOpenChange = jest.fn();
    const mockHandleStatus = jest.fn();
    const mockSetLoading = jest.fn();

    const { rerender } = render(<RecordAddFile user={user} folio='9864' idFolio={1} cert={certificate} handleStatus={mockHandleStatus} open={true} onOpenChange={mockOnOpenChange} setLoading={mockSetLoading} />);
    
    const fileRendered = await screen.findByAltText(/pdf file/i);
    expect(fileRendered).toBeInTheDocument();

    const iconCopy = await screen.getByTestId("copy-file-button") ;
    expect(iconCopy).toBeInTheDocument();

    const iconTrash = await screen.getByTestId("remove-file-button") ;
    expect(iconTrash).toBeInTheDocument();

    //removing the url_file from the certificate and rerender the component
    certificate.url_file = "";
    rerender(
      <RecordAddFile
        user={user}
        folio='9864'
        idFolio={1}
        cert={certificate}
        handleStatus={mockHandleStatus}
        open={true} // Keep it open to test the content
        onOpenChange={mockOnOpenChange}
        setLoading={mockSetLoading}
      />
    );

    const noFileInCertificate = await screen.getByTestId('thereisno-file-certificate');
    expect(noFileInCertificate).toBeInTheDocument();

  });
})