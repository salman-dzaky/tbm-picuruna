import { describe, it, expect } from 'vitest';
import { generateBookId, generateCategoryId } from './nanoid';

describe('nanoid generator', () => {
  it('should generate a book id with correct prefix', () => {
    const id = generateBookId();
    expect(id.startsWith('b_')).toBe(true);
    expect(id.length).toBeGreaterThan(5);
  });

  it('should generate a category id with correct prefix', () => {
    const id = generateCategoryId('fiksi');
    expect(id.startsWith('cat_fiksi')).toBe(true);
  });
});
