import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title and description', () => {
    render(<EmptyState title="Not documented" description="No source coverage yet." />);
    expect(screen.getByText('Not documented')).toBeInTheDocument();
    expect(screen.getByText('No source coverage yet.')).toBeInTheDocument();
  });

  it('calls onSuggestChange when the button is clicked', () => {
    const onSuggestChange = vi.fn();
    render(<EmptyState title="Not documented" onSuggestChange={onSuggestChange} />);
    fireEvent.click(screen.getByText('Suggest a change'));
    expect(onSuggestChange).toHaveBeenCalledTimes(1);
  });

  it('omits the suggest-change button when no handler is passed', () => {
    render(<EmptyState title="Not documented" />);
    expect(screen.queryByText('Suggest a change')).not.toBeInTheDocument();
  });
});
