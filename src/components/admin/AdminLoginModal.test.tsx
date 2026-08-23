import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AdminLoginModal } from './AdminLoginModal';
import { useKRA } from '../../context/KRAContext';

vi.mock('../../context/KRAContext', () => ({
  useKRA: vi.fn(),
}));

const mockedUseKRA = vi.mocked(useKRA);

beforeEach(() => {
  mockedUseKRA.mockReset();
  mockedUseKRA.mockReturnValue({ loginAdmin: vi.fn().mockReturnValue(false) } as never);
});

describe('AdminLoginModal', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<AdminLoginModal isOpen={false} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the passcode form when open', () => {
    render(<AdminLoginModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByPlaceholderText(/enter passcode/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /authenticate/i })).toBeInTheDocument();
  });

  it('shows a validation error for an empty passcode', () => {
    render(<AdminLoginModal isOpen={true} onClose={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /authenticate/i }));
    expect(screen.getByText(/provide administrative passcode/i)).toBeInTheDocument();
    expect(mockedUseKRA().loginAdmin).not.toHaveBeenCalled();
  });

  it('shows a generic error and keeps the modal open on a wrong passcode', async () => {
    render(<AdminLoginModal isOpen={true} onClose={vi.fn()} />);
    const input = screen.getByPlaceholderText(/enter passcode/i);
    fireEvent.change(input, { target: { value: 'wrong-code' } });
    fireEvent.click(screen.getByRole('button', { name: /authenticate/i }));
    await waitFor(() => expect(mockedUseKRA().loginAdmin).toHaveBeenCalledWith('wrong-code'));
    expect(await screen.findByText(/invalid admin passcode/i)).toBeInTheDocument();
  });

  it('clears the field and closes the modal on successful auth', async () => {
    const onClose = vi.fn();
    mockedUseKRA.mockReturnValue({ loginAdmin: vi.fn().mockResolvedValue(true) } as never);
    render(<AdminLoginModal isOpen={true} onClose={onClose} />);
    const input = screen.getByPlaceholderText(/enter passcode/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'taazaa2026' } });
    fireEvent.click(screen.getByRole('button', { name: /authenticate/i }));
    await waitFor(() => expect(onClose).toHaveBeenCalledOnce());
  });

  it('does not leak the demo passcode in production builds', () => {
    vi.stubEnv('DEV', false);
    try {
      render(<AdminLoginModal isOpen={true} onClose={vi.fn()} />);
      expect(document.body.textContent).not.toContain('taazaa2026');
    } finally {
      vi.unstubAllEnvs();
    }
  });
});
