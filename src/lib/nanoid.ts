import { nanoid } from 'nanoid';

export function generateBookId(): string {
  return `b_${nanoid(12)}`;
}

export function generateCategoryId(slug: string): string {
  return `cat_${slug}`;
}
