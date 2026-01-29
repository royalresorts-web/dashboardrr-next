
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CertificateRecords } from './certificate-records';
import { fetchCertificates, getUrlForCertificatesExport } from '@/lib';
import { UserType } from '@/Context';
import { certificateType } from './dataset';
import { filter } from '@/app/(routes)/dashboard/disclaimer/page';

// Mock dependencies
jest.mock('@/lib', () => ({
  fetchCertificates: jest.fn(),
  getUrlForCertificatesExport: jest.fn(),
}));

jest.mock('./paginationRecords', () => ({
  Pagination: ({ totalPages, currentPage, onPageChange }: { totalPages: number, currentPage: number, onPageChange: (page: number) => void }) => (
    <div data-testid="pagination">
      <span>Page {currentPage} of {totalPages}</span>
      <button onClick={() => onPageChange(currentPage + 1)}>Next</button>
    </div>
  ),
  RecordDropdownMenu: () => <div data-testid="record-dropdown-menu"></div>,
}));

jest.mock('./recordDropdownMenu', () => ({
  RecordDropdownMenu: () => <div data-testid="record-dropdown-menu"></div>,
}))

jest.mock('lucide-react', () => ({
  FileDown: () => <div data-testid="filedown-icon"></div>,
  Search: () => <div data-testid="search-icon"></div>,
}));

const mockUser: UserType = {
  getIdToken: () => Promise.resolve('test-token'),
  photoURL: "foto.jpg",
  displayName: "test",
  uid: "ada78hkjsu",
  email: 'test@example.com',
};

const mockLogout = jest.fn();
const mockSetLoading = jest.fn();
const mockSetUpdate = jest.fn();
const mockSetFilter = jest.fn();

const mockCertificates: certificateType[] = [
  {
    id: 1,
    folio: 'F001',
    email: 'test1@example.com',
    last_name: 'Doe',
    name: 'John',
    status: 'ACEPTADO',
    fecha: '2023-10-27',
    fecha_enviado: '2023-10-27',
    email_user: 'user1@example.com',
    user: 12,
    url_file: 'file1.pdf'
  },
  {
    id: 2,
    folio: 'F002',
    email: 'test2@example.com',
    last_name: 'Smith',
    name: 'Jane',
    status: 'ENVIADO',
    fecha: '2023-10-28',
    fecha_enviado: '2023-10-28',
    email_user: 'user2@example.com',
    user: 12,
    url_file: 'file2.pdf'
  },
];

const initialFilter: filter = {
  page: 1,
  state: 'TODOS',
  user: null,
  folio: null,
};

const renderComponent = (props = {}) => {
  const defaultProps = {
    user: mockUser,
    logout: mockLogout,
    setLoading: mockSetLoading,
    update: false,
    setUpdate: mockSetUpdate,
    filter: initialFilter,
    setFilter: mockSetFilter,
  };
  return render(<CertificateRecords {...defaultProps} {...props} />);
};

describe('CertificateRecords', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly and shows filters', () => {
    renderComponent();
    expect(screen.getByText('Exportar Filtro')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Id del Folio')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('User Email')).toBeInTheDocument();
    expect(screen.getByText('ACEPTADOS')).toBeInTheDocument();
    expect(screen.getByText('ENVIADOS')).toBeInTheDocument();
    expect(screen.getByText('TODOS')).toBeInTheDocument();
    expect(screen.getByText('Buscar')).toBeInTheDocument();
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('fetches and displays certificates when update is true', async () => {
    (fetchCertificates as jest.Mock).mockImplementation((token, page, filter, callback) => {
      callback({
        certificates: mockCertificates,
        pages: 2,
        page: 1,
        total: 20,
      });
    });

    renderComponent({ update: true });

    await waitFor(() => {
      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(fetchCertificates).toHaveBeenCalledTimes(1);

      // expect(fetchCertificates).toHaveBeenCalledWith('test-token', 1, initialFilter, expect.any(Function), expect.any(Function));
    });

    await waitFor(() => {
      expect(screen.getByText('F001')).toBeInTheDocument();
      expect(screen.getByText('test1@example.com')).toBeInTheDocument();
      expect(screen.getByText('Doe')).toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('ACEPTADO')).toBeInTheDocument();

      expect(screen.getByText('F002')).toBeInTheDocument();
      expect(screen.getByText('test2@example.com')).toBeInTheDocument();
      expect(screen.getByText('Smith')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('ENVIADO')).toBeInTheDocument();

      expect(screen.getAllByTestId('record-dropdown-menu').length).toBe(2);
      expect(mockSetLoading).toHaveBeenCalledWith(false);
      expect(mockSetUpdate).toHaveBeenCalledWith(false);
    });
  });
  it('handles filter input changes', () => {
    renderComponent();
  
    fireEvent.change(screen.getByPlaceholderText('Id del Folio'), { target: { value: 'FOLIO123' } });
    expect(mockSetFilter).toHaveBeenCalledWith({ ...initialFilter, page: 1, folio: 'FOLIO123' });
  
    fireEvent.change(screen.getByPlaceholderText('User Email'), { target: { value: 'user@test.com' } });
    expect(mockSetFilter).toHaveBeenCalledWith({ ...initialFilter, page: 1, user: 'user@test.com' });
  });
  it('calls setUpdate when search button is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Buscar'));
    expect(mockSetUpdate).toHaveBeenCalledWith(true);
  });

  /* 

  it('clears filters when clear button is clicked', () => {
    const filterWithValues: filter = { page: 2, user: 'test', folio: 'f1', state: 'ACEPTADO' };
    renderComponent({ filter: filterWithValues });

    fireEvent.click(screen.getByText('Clear'));
    expect(mockSetFilter).toHaveBeenCalledWith({ ...filterWithValues, page: 1, user: null, folio: null, state: 'TODOS' });
    expect(mockSetUpdate).toHaveBeenCalledWith(true);
  });
  
  it('handles pagination correctly', () => {
    (fetchCertificates as jest.Mock).mockImplementation((token, page, filter, callback) => {
        callback({
          certificates: mockCertificates,
          pages: 5,
          page: 2,
          total: 50,
        });
      });
    
    renderComponent({ update: true });
  
    fireEvent.click(screen.getByText('Next'));
    expect(mockSetFilter).toHaveBeenCalledWith({ ...initialFilter, page: 3 });
    expect(mockSetUpdate).toHaveBeenCalledWith(true);
  });
  it('handles download file action', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            blob: () => Promise.resolve(new Blob(['test content'])),
        })
    ) as jest.Mock;
  
    window.URL.createObjectURL = jest.fn(() => 'blob:http://localhost/test-blob-url');
    window.URL.revokeObjectURL = jest.fn();
    
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
    const linkClick = jest.fn();
  
    // Mock getAttribute and setAttribute on the link element
    const link = {
        click: linkClick,
        setAttribute: jest.fn(),
        getAttribute: jest.fn(), // you might not need this but good to have
        style: {},
    };
    jest.spyOn(document, 'createElement').mockReturnValue(link as unknown as HTMLAnchorElement);
  
    (getUrlForCertificatesExport as jest.Mock).mockReturnValue('http://test-url.com/export');
    
    renderComponent();
  
    fireEvent.click(screen.getByText('Exportar Filtro'));
  
    await waitFor(() => {
      expect(mockUser.getIdToken).toHaveBeenCalled();
      expect(getUrlForCertificatesExport).toHaveBeenCalledWith(initialFilter);
      expect(global.fetch).toHaveBeenCalledWith('http://test-url.com/export', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer test-token`,
        },
      });
      expect(link.setAttribute).toHaveBeenCalledWith('download', 'certificates.csv');
      expect(linkClick).toHaveBeenCalled();
    });
  });
  
  it('shows no records when fetch returns empty array', async () => {
    (fetchCertificates as jest.Mock).mockImplementation((token, page, filter, callback) => {
      callback({
        certificates: [],
        pages: 0,
        page: 1,
        total: 0,
      });
    });
  
    renderComponent({ update: true });
  
    await waitFor(() => {
      expect(screen.queryByText('F001')).not.toBeInTheDocument();
      expect(screen.queryByText('F002')).not.toBeInTheDocument();
    });
  });
  it('calls logout on fetchCertificates token error', async () => {
    (fetchCertificates as jest.Mock).mockImplementation((token, page, filter, successCb, errorCb) => {
      errorCb('token error');
    });
  
    renderComponent({ update: true });
  
    await waitFor(() => {
        expect(mockSetLoading).toHaveBeenCalledWith(true);
        expect(mockSetLoading).toHaveBeenCalledWith(false);
    });
  
  });
  
  it('calls logout on getIdToken failure', async () => {
    (mockUser.getIdToken as jest.Mock).mockRejectedValueOnce(new Error('Auth error'));
    renderComponent({ update: true });
    
    await waitFor(() => {
        expect(mockSetLoading).toHaveBeenCalledWith(false);
        expect(mockLogout).toHaveBeenCalled();
    })
  })*/
});
