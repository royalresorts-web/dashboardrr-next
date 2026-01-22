import { render, screen, fireEvent, act } from '@testing-library/react'
import { UserType } from '@/Context'
import { LoadFileRecord } from './LoadFileRecord';
import { uploadCertificate } from '@/lib'; // Import the actual function to mock it
import { showToast } from 'nextjs-toast-notify';


// Mock the showToast from nextjs-toast-notify as it's used in RecordAddFile
jest.mock('nextjs-toast-notify', () => ({
    showToast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));
jest.mock('@/lib', () => ({
    ...jest.requireActual('@/lib'), // Keep other exports from @/lib if any
    uploadCertificate: jest.fn(),
}));

describe('LoadFileRecord', () => {
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
    beforeEach(() => {
        jest.clearAllMocks();// Use fake timers for tests involving setTimeout
    });

  it('Check if a file is loaded in the modal', async () => {
    const mockHandleStatus = jest.fn(); // This will be called when a file is uploaded or deleted
    const mockSetLoading = jest.fn();

    // 1. Render the component with open={true}
    render(
      <LoadFileRecord
        user={user}
        folio='9864'
        idFolio={1}
        cert={certificate}
        handleStatus={mockHandleStatus}
        setLoading={mockSetLoading}
      />
    );

    // Initially, the component should display the file input prompt
    expect(screen.getByText(/Arrastre o presione para agregar un archivo PDF unicamente/i)).toBeInTheDocument();

    // Create a mock file
    const testFile = new File(['(⌐□_□)'], 'test.pdf', { type: 'application/pdf' });

    // Find the file input element
    // The input has type="file" and is inside a div with class "inputFile"
    const fileInput = screen.getByLabelText(/Arrastre o presione para agregar un archivo PDF unicamente/i);
    expect(fileInput).toBeInTheDocument();

    // Simulate a file selection event
    fireEvent.change(fileInput, {
      target: {
        files: [testFile],
      },
    });

    // After selecting a file, the component should show the file details and upload/delete buttons
    expect(await screen.findByText(/Archivo preparado para subir \/ eliminar/i)).toBeInTheDocument();
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Subir/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Eliminar/i })).toBeInTheDocument();
  });
  it('Check if a file has been loaded succesfully in the modal', async () => {
    const mockHandleStatus = jest.fn(); // This will be called when a file is uploaded or deleted
    const mockSetLoading = jest.fn();

    // 1. Render the component with open={true}
    render(
      <LoadFileRecord
        user={user}
        folio='9864'
        idFolio={1}
        cert={certificate}
        handleStatus={mockHandleStatus}
        setLoading={mockSetLoading}
      />
    );

    // Create a mock file
    const testFile = new File(['(⌐□_□)'], 'test.pdf', { type: 'application/pdf' });
    const fileInput = screen.getByLabelText(/Arrastre o presione para agregar un archivo PDF unicamente/i);
    fireEvent.change(fileInput, {
      target: {
        files: [testFile],
      },
    });

    (uploadCertificate as jest.Mock).mockImplementation((files, email, proyect, name, callback) => {
        callback([{ file: 'TRS_45B.pdf', url: 'http://uploaded.com/TRS_45B.pdf', idOperation: '0', Date: "21/01/2026" }], null);
    });

    const uploadButton = screen.getByRole('button', { name: /Subir/i });
    
    await act(async () => {
        fireEvent.click(uploadButton);
    });
    
    // Assert that the upload function was called with the correct parameters
    expect(uploadCertificate).toHaveBeenCalledTimes(1);
    expect(uploadCertificate).toHaveBeenCalledWith(
        expect.any(Array), // The File array
        'israel.canul@gmail.com',
        0,
        'certificate-9864-icanul@royalresorts.com',
        expect.any(Function)
    );

    // Assert toast notification
    expect(showToast.success).toHaveBeenCalledTimes(1);
    expect(showToast.success).toHaveBeenCalledWith(
        "Archivo subido con éxito, actualizando en la BD...",
        expect.any(Object)
    );
  })
})