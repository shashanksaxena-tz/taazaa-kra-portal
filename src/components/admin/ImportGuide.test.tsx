import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ImportGuide } from './ImportGuide';

describe('ImportGuide', () => {
  it('renders the merge-safety section expanded by default', () => {
    render(<ImportGuide />);
    expect(screen.getByText(/How Excel \/ CSV import works/i)).toBeInTheDocument();
    expect(screen.getByText(/merged into matching departments/i)).toBeInTheDocument();
  });

  it('keeps the JSON replace warning collapsed until clicked', () => {
    render(<ImportGuide />);
    const trigger = screen.getByRole('button', { name: /JSON import REPLACES everything/i });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/replaces ALL data/i)).toBeInTheDocument();
  });

  it('shows column format rules when expanded', () => {
    render(<ImportGuide />);
    fireEvent.click(screen.getByRole('button', { name: /Column format reference/i }));
    expect(screen.getByText(/Never edit an existing Role ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Quality:Escaped defects:<2%:Quarterly/)).toBeInTheDocument();
  });

  it('documents the golden rules', () => {
    render(<ImportGuide />);
    fireEvent.click(screen.getByRole('button', { name: /Golden rules/i }));
    expect(screen.getByText(/exactly one Accountable/i)).toBeInTheDocument();
  });
});
