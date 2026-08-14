import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CategoryManager } from './category-manager';
import { UNCATEGORIZED_ID } from '@/src/lib/constants';

const mockCategories = [
  { id: 'cat_1', name: 'Sains', slug: 'sains', bookCount: 0, createdAt: new Date() },
  { id: 'cat_2', name: 'Sejarah', slug: 'sejarah', bookCount: 5, createdAt: new Date() },
  { id: UNCATEGORIZED_ID, name: 'Tanpa Kategori', slug: 'tanpa-kategori', bookCount: 1, createdAt: new Date() },
];

describe('CategoryManager', () => {
  it('renders list of categories', () => {
    render(<CategoryManager categories={mockCategories} filters={null} />);
    
    expect(screen.getByText('Sains')).toBeInTheDocument();
    expect(screen.getByText('Sejarah')).toBeInTheDocument();
    expect(screen.getByText('Tanpa Kategori')).toBeInTheDocument();
  });

  it('switches to edit mode when edit button is clicked', () => {
    render(<CategoryManager categories={mockCategories} filters={null} />);
    
    // Get all edit buttons (should be 3, uncategorized one is disabled)
    const editButtons = screen.getAllByLabelText(/Edit kategori/i);
    expect(editButtons.length).toBe(3);

    // Click the first edit button (Sains)
    fireEvent.click(editButtons[0]);

    // The form title should change to 'Edit Kategori'
    expect(screen.getByText('Edit Kategori')).toBeInTheDocument();
    
    // The input should be populated with 'Sains'
    const input = screen.getByLabelText(/Nama Kategori/i) as HTMLInputElement;
    expect(input.value).toBe('Sains');
  });

  it('protects Tanpa Kategori from being edited or deleted', () => {
    render(<CategoryManager categories={mockCategories} filters={null} />);
    
    const disabledButtons = screen.getAllByTitle(/Kategori bawaan/i);
    expect(disabledButtons.length).toBe(2); // One for edit, one for delete
  });
});
