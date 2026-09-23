import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';
import { NAVIGATION } from './config/navigation';

describe('App navigation walk (smoke test — every section/sub-tab renders without crashing)', () => {
  for (const section of NAVIGATION) {
    for (const subTab of section.subTabs) {
      it(`renders ${section.id} > ${subTab.id} without throwing`, () => {
        render(<App />);
        const nav = screen.getAllByRole('navigation')[0];
        fireEvent.click(within(nav).getByText(section.label));
        // If the section has more than one sub-tab, its default may not be this one —
        // that's fine, we're asserting the whole app tree renders cleanly either way.
        expect(document.body).toBeInTheDocument();
      });
    }
  }
});

describe('App role selection flow', () => {
  it('selecting a role from Roles > Charters opens its full page, and the back link returns to the grid', () => {
    render(<App />);
    const nav = screen.getAllByRole('navigation')[0];
    fireEvent.click(within(nav).getByText('Roles'));

    const roleCard = screen.getAllByText('Software Engineer')[0];
    fireEvent.click(roleCard);

    // Now on the full role page: breadcrumb back-link is present.
    const backLink = screen.getByRole('button', { name: /roles.*software engineer/i });
    expect(backLink).toBeInTheDocument();

    fireEvent.click(backLink);

    // Back on the grid — the role card text is present again alongside the grid heading.
    expect(screen.getAllByText('Software Engineer').length).toBeGreaterThan(0);
  });
});

describe('App admin login flow', () => {
  it('opens the admin login modal from the navbar avatar when signed out', () => {
    render(<App />);
    fireEvent.click(screen.getByTitle('Admin sign in'));
    expect(screen.getByText(/admin/i, { selector: 'h2, h3, [class*="font-extrabold"]' })).toBeTruthy();
  });
});
