import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App global search shortcut', () => {
  it('defaults to the Home view, where the Roles search box is not present', () => {
    render(<App />);
    expect(screen.queryByPlaceholderText(/search by role, skill, accountability/i)).toBeNull();
  });

  it('Cmd+K from anywhere in the app navigates to Roles > Charters, where the search box lives', () => {
    render(<App />);
    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(screen.getByPlaceholderText(/search by role, skill, accountability/i)).toBeInTheDocument();
  });

  it('Ctrl+K also navigates to Roles > Charters (non-Mac users)', () => {
    render(<App />);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(screen.getByPlaceholderText(/search by role, skill, accountability/i)).toBeInTheDocument();
  });

  it('pressing "/" while not focused in a text field also navigates to Roles > Charters', () => {
    render(<App />);
    fireEvent.keyDown(window, { key: '/' });
    expect(screen.getByPlaceholderText(/search by role, skill, accountability/i)).toBeInTheDocument();
  });

  it('typing a query on Home and pressing Enter in the search box navigates to filtered Roles results', () => {
    render(<App />);
    const homeSearch = screen.getByPlaceholderText(/search by role, skill, function or keyword/i);
    fireEvent.change(homeSearch, { target: { value: 'Engineer' } });
    fireEvent.keyDown(homeSearch, { key: 'Enter' });
    expect(screen.getByPlaceholderText(/search by role, skill, accountability/i)).toBeInTheDocument();
  });
});
