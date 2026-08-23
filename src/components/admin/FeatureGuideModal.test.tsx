import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FeatureGuideModal } from './FeatureGuideModal';

describe('FeatureGuideModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    const { container } = render(<FeatureGuideModal isOpen={false} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the guide with the first entry expanded by default', () => {
    render(<FeatureGuideModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Portal Feature Guide')).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/six-tab charter/i)).toBeInTheDocument();
  });

  it('toggles accordion entries on click', () => {
    render(<FeatureGuideModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.queryByText(/freezes the current departments/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Versions & snapshots/i }));
    expect(screen.getByText(/freezes the current departments/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Versions & snapshots/i }));
    expect(screen.queryByText(/freezes the current departments/i)).not.toBeInTheDocument();
  });

  it('covers every major feature area', () => {
    render(<FeatureGuideModal isOpen={true} onClose={vi.fn()} />);
    for (const topic of [
      /Viewing & finding roles/i,
      /Comparing roles/i,
      /Adding a role/i,
      /Editing or deleting a role/i,
      /Departments/i,
      /Excel \/ CSV vs JSON imports/i,
      /Publishing to GitHub/i,
      /Admin access/i,
    ]) {
      expect(screen.getByRole('button', { name: topic })).toBeInTheDocument();
    }
  });

  it('closes via backdrop or close button', () => {
    const onClose = vi.fn();
    const { container } = render(<FeatureGuideModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText(/close feature guide/i));
    expect(onClose).toHaveBeenCalledOnce();

    const backdrop = container.querySelector('.fixed.inset-0');
    fireEvent.click(backdrop!);
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
