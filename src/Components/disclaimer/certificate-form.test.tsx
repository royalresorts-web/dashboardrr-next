import { render, screen, fireEvent } from "@testing-library/react";
import { CertificateFinder } from "./certificate-finder";
import { UserType } from "@/Context";
import { folioDisclaimerType, objToSaveCertificate, objToSendEmailCertificate, sendEmailForDisclaimer, setInfoCertificate } from "@/lib";
import { CertificateForm } from "./certificate-form";
import { act } from "react";
import { showToast } from "nextjs-toast-notify";

// Mock the toast notification library
jest.mock('nextjs-toast-notify', () => ({
    showToast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

jest.mock('@/lib', () => ({
     ...jest.requireActual('@/lib'), // Keep other exports from @/lib if any
     sendEmailForDisclaimer: jest.fn(),
     setInfoCertificate: jest.fn(),
}));

describe('Certificate Info form', () => {
     const MOCK_DATE = new Date('2026-01-23T10:00:00.000Z');
     const options: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
     };
     const formattedDate = MOCK_DATE.toLocaleDateString('en-US', options);

     beforeAll(() => {
          jest.useFakeTimers();
          jest.setSystemTime(MOCK_DATE);
     });

     afterAll(() => {
          jest.useRealTimers();
     });

     const user: UserType = {
          uid: "YIHD784HFD",
          email: "israel.canul@gmail.com",
          photoURL: null,
          displayName: "Israel Canul",
          getIdToken: () => Promise.resolve("token654783")
     }

     const exampleObjToSaveCertificate: objToSaveCertificate = {
        "action": "add",
        "id": null,
        "folio": "F-00012345",
        "name": "John D.",
        "last_name": "Doe",
        "email": "john.doe@example.com",
        "email_user": "israel.canul@gmail.com",
        "status": "ENVIADO",
        "fecha": formattedDate,
        "fecha_enviado": formattedDate,
        "user": "",
        "url_file": ""
    };
     const exampleFolioDisclaimer: folioDisclaimerType = {
          "attributes": {
               "type": "RRC_FolioDisclaimer__c",
               "url": "/services/data/v58.0/sobjects/RRC_FolioDisclaimer__c/a03XXXXXXXXXXXXXXX"
          },
          "RRC_IsAcceptedTA__c": true,
          "RRC_AcceptedTADate__c": "2023-01-15T10:00:00.000Z",
          "RRC_CertificateType__c": "Type A",
          "RRC_IsActive__c": true,
          "RRC_ExpDate__c": "2024-01-15",
          "Id": "a03XXXXXXXXXXXXXXX",
          "RRC_Folio__c": "F-00012345",
          "RRC_Contract__r": {
               "attributes": {
                    "type": "Contract",
                    "url": "/services/data/v58.0/sobjects/Contract/800XXXXXXXXXXXXXXX"
               },
               "RRC_Legacy_Contract_ID__c": "LC-98765",
               "Account": {
                    "attributes": {
                         "type": "Account",
                         "url": "/services/data/v58.0/sobjects/Account/001XXXXXXXXXXXXXXX"
                    },
                    "PersonContactId": "003XXXXXXXXXXXXXXX",
                    "RRC_PeopleId__c": "P-54321",
                    "FirstName": "John",
                    "MiddleName": "D.",
                    "PersonEmail": "john.doe@example.com",
                    "LastName": "Doe"
               }
          }
     };

     const exampleObjToSendEmailCertificate: objToSendEmailCertificate = {
        messageKey: "certificate_disclaimer_email",
        keyDefinition: "DisclaimerEmail",
        to: "recipient@example.com",
        contactKey: "003XXXXXXXXXXXXXXX",
        vars: {
            Email: "john.doe@example.com",
            Folio: "F-00012345",
            Nombre: "John",
            Apellido: "Doe",
            Estatus: "Accepted",
            Fecha: new Date("2023-01-15T10:00:00.000Z"),
        },
    };

     beforeEach(() => {
          jest.clearAllMocks();
     });


     it('Check if the component is redered', () => {
          render(<CertificateForm folio="F-00012345" cert={exampleFolioDisclaimer} user={user} logout={() => Promise.resolve()} setLoading={() => { }} setUpdate={() => { }} />)

            const text = screen.getByText(exampleFolioDisclaimer.RRC_Folio__c);
            expect(text).toBeInTheDocument();

            const buttonEmailEn = screen.getByRole('button', { name: /send/i })
            expect(buttonEmailEn).toBeInTheDocument();

            const buttonEmailEs = screen.getByRole('button', { name: /enviar/i })
            expect(buttonEmailEs).toBeInTheDocument();
     });

    it('should show a success toast when email is sent and certificate is saved successfully', async () => {
        const mockGetIdToken = jest.fn().mockResolvedValue('mock-token');
        const mockUser = {
            ...user,
            getIdToken: mockGetIdToken,
        };

        render(<CertificateForm folio="F-00012345" cert={exampleFolioDisclaimer} user={mockUser} logout={() => Promise.resolve()} setLoading={() => { }} setUpdate={() => { }} />);

        const buttonEmailEn = screen.getByRole('button', { name: /send/i });

        (sendEmailForDisclaimer as jest.Mock).mockImplementation((_,callback) => {
            callback(true, null);
        });
        (setInfoCertificate as jest.Mock).mockImplementation((objToSend, token, callback) => {
            callback(true, null);
        });

        await act(async () => {
            fireEvent.click(buttonEmailEn);
        });

        expect(sendEmailForDisclaimer).toHaveBeenCalledTimes(1);
        expect(setInfoCertificate).toHaveBeenCalledTimes(1);
        expect(setInfoCertificate).toHaveBeenCalledWith(
            exampleObjToSaveCertificate,
            'mock-token',
            expect.any(Function)
        );
        expect(showToast.success).toHaveBeenCalledTimes(1);
        expect(showToast.success).toHaveBeenCalledWith(
            "¡La operación se realizó con éxito!",
            expect.any(Object)
        );
        expect(showToast.error).not.toHaveBeenCalled();
    });

    it('should show an error toast when sending the email fails', async () => {
        const mockGetIdToken = jest.fn().mockResolvedValue('mock-token');
        const mockUser = { ...user, getIdToken: mockGetIdToken };
        render(<CertificateForm folio="F-00012345" cert={exampleFolioDisclaimer} user={mockUser} logout={() => Promise.resolve()} setLoading={() => { }} setUpdate={() => { }} />)
        const buttonEmailEn = screen.getByRole('button', { name: /send/i });

        (sendEmailForDisclaimer as jest.Mock).mockImplementation((exampleObjToSendEmailCertificate, callback) => {
            callback(false, "Error sending email");
        });

        await act(async () => {
            fireEvent.click(buttonEmailEn);
        });

        expect(sendEmailForDisclaimer).toHaveBeenCalledTimes(1);
        expect(setInfoCertificate).not.toHaveBeenCalled();
        expect(showToast.error).toHaveBeenCalledTimes(1);
        expect(showToast.error).toHaveBeenCalledWith(
            "hubo un error: Error sending email",
            expect.any(Object)
        );
        expect(showToast.success).not.toHaveBeenCalled();
    });

    it('should show an error toast when saving the certificate fails after sending email', async () => {
        const mockGetIdToken = jest.fn().mockResolvedValue('mock-token');
        const mockUser = { ...user, getIdToken: mockGetIdToken };
        render(<CertificateForm folio="F-00012345" cert={exampleFolioDisclaimer} user={mockUser} logout={() => Promise.resolve()} setLoading={() => { }} setUpdate={() => { }} />)
        const buttonEmailEn = screen.getByRole('button', { name: /send/i });

        (sendEmailForDisclaimer as jest.Mock).mockImplementation((_, callback) => callback(true, null));
        (setInfoCertificate as jest.Mock).mockImplementation((objToSend, token, callback) => {
            callback(false, "Error setting the cert");
        });
        await act(async () => {
            fireEvent.click(buttonEmailEn);
        });
        expect(showToast.error).toHaveBeenCalledTimes(1);
        expect(sendEmailForDisclaimer).toHaveBeenCalledTimes(1);
        expect(setInfoCertificate).toHaveBeenCalledTimes(1);
        expect(showToast.error).toHaveBeenCalledWith(
            "Hubo un error en la operacion",
            expect.any(Object)
        );
        expect(showToast.success).not.toHaveBeenCalled();
    });

})