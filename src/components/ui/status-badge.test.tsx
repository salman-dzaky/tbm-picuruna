import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge } from './status-badge';

describe('StatusBadge', () => {
  it('renders correctly for TERSEDIA status', () => {
    render(<StatusBadge status="TERSEDIA" />);
    const badge = screen.getByText('Tersedia');
    expect(badge).toBeInTheDocument();
    
    // Check if it has the available color classes
    expect(badge.className).toContain('text-status-available');
  });

  it('renders correctly for DIPINJAM status', () => {
    render(<StatusBadge status="DIPINJAM" />);
    const badge = screen.getByText('Dipinjam');
    expect(badge).toBeInTheDocument();
    
    // Check if it has the borrowed color classes
    expect(badge.className).toContain('text-status-borrowed');
  });
});
