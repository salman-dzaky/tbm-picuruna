import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Pagination } from './pagination';

describe('Pagination Component', () => {
  it('renders correctly with 1 page', () => {
    const { container } = render(<Pagination currentPage={1} totalPages={1} />);
    // When totalPages <= 1, it renders null
    expect(container.firstChild).toBeNull();
  });

  it('enables next button when there are multiple pages (totalPages <= 5)', () => {
    render(<Pagination currentPage={1} totalPages={3} />);
    
    const nextButton = screen.getByLabelText('Halaman berikutnya');
    expect(nextButton).not.toBeDisabled();
    
    // First/Last buttons are not rendered if totalPages <= 5
    expect(screen.queryByLabelText('Halaman terakhir')).not.toBeInTheDocument();
    
    // First page, so prev should still be disabled
    const prevButton = screen.getByLabelText('Halaman sebelumnya');
    expect(prevButton).toBeDisabled();
  });

  it('enables previous button when on middle page', () => {
    render(<Pagination currentPage={2} totalPages={3} />);
    
    expect(screen.getByLabelText('Halaman sebelumnya')).not.toBeDisabled();
    expect(screen.getByLabelText('Halaman berikutnya')).not.toBeDisabled();
  });

  it('renders first and last buttons when totalPages > 5', () => {
    render(<Pagination currentPage={3} totalPages={10} />);
    expect(screen.getByLabelText('Halaman pertama')).toBeInTheDocument();
    expect(screen.getByLabelText('Halaman terakhir')).toBeInTheDocument();
  });
});
