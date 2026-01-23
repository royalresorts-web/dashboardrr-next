import { render, screen, fireEvent } from "@testing-library/react";
import { CertificateFinder } from "./certificate-finder";
import { UserType } from "@/Context";
import { fetchCertificateByFolio, folioDisclaimerType } from "@/lib";
import { CertificateForm } from "./certificate-form";
import { act } from "react";

jest.mock('./certificate-form', () => ({
    CertificateForm: jest.fn(() => <div>Mocked CertificateForm</div>),
}));

jest.mock('@/lib', () => ({
     ...jest.requireActual('@/lib'), // Keep other exports from @/lib if any
     fetchCertificateByFolio: jest.fn(),
}));

describe('Certificate Finder', () => {
     const user: UserType = {
          uid: "YIHD784HFD",
          email: "israel.canul@gmail.com",
          photoURL: null,
          displayName: "Israel Canul",
          getIdToken: () => Promise.resolve("token654783")
     }
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

     beforeEach(() => {
          jest.clearAllMocks();
     });


     it('Check if the component is redered', () => {
          render(<CertificateFinder update={false} user={user} logout={() => Promise.resolve()} setLoading={() => { }} setUpdate={() => { }} />)

          const text = screen.getByText(/agrege un folio válido en el buscador para continuar/i)
          expect(text).toBeInTheDocument()

     });


     it('Check if the component show the info when the client make a search',async () => {
          // Mock user.getIdToken
           const mockGetIdToken = jest.fn().mockResolvedValue('mock-token');
           const mockUser = {
               ...user,
               getIdToken: mockGetIdToken,
          };

          render(<CertificateFinder update={false} user={mockUser} logout={() => Promise.resolve()} setLoading={() => { }} setUpdate={() => { }} />)

          const input = screen.getByPlaceholderText(/id del folio/i)
          expect(input).toBeInTheDocument();         
          
          (fetchCertificateByFolio as jest.Mock).mockImplementation((folio, token, callback) => {
               callback(exampleFolioDisclaimer, null);
          });

          const button = screen.getByRole('button', { name: /buscar/i })
          expect(button).toBeInTheDocument()

          fireEvent.change(input, {
               target: {
                    value: 1987
               }
          });
          await act(async () => {
               fireEvent.click(button);
          });
          expect(mockGetIdToken).toHaveBeenCalledTimes(1);
          expect(fetchCertificateByFolio).toHaveBeenCalledTimes(1);
          expect(fetchCertificateByFolio).toHaveBeenCalledWith(
               '1987',
               'mock-token',
               expect.any(Function)
          );

          expect(CertificateForm).toHaveBeenCalledTimes(1);
     });
})