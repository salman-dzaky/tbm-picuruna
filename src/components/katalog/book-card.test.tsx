import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BookCard } from './book-card';

const mockBook = {
  id: 'book_123',
  title: 'Harry Potter',
  author: 'J.K. Rowling',
  publisher: 'Bloomsbury',
  publicationYear: 1997,
  status: 'TERSEDIA' as const,
  coverUrl: null,
  categoryName: 'Fiksi',
};

describe('BookCard', () => {
  it('renders book information correctly', () => {
    render(<BookCard book={mockBook} />);
    
    expect(screen.getAllByText('Harry Potter').length).toBeGreaterThan(0);
    expect(screen.getByText('J.K. Rowling')).toBeInTheDocument();
    expect(screen.getByText('1997')).toBeInTheDocument();
    expect(screen.getByText('Fiksi')).toBeInTheDocument();
    expect(screen.getByText('Tersedia')).toBeInTheDocument();
  });

  it('renders fallback icon when coverUrl is null', () => {
    const { container } = render(<BookCard book={mockBook} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders cover image when coverUrl is provided', () => {
    render(<BookCard book={{ ...mockBook, coverUrl: 'https://example.com/cover.jpg' }} />);
    const img = screen.getByAltText('Sampul buku Harry Potter');
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe('https://example.com/cover.jpg');
  });
});
