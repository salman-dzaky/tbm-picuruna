import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge tailwind classes correctly', () => {
      const result = cn('text-red-500', 'bg-blue-500');
      expect(result).toBe('text-red-500 bg-blue-500');
    });

    it('should resolve tailwind class conflicts', () => {
      const result = cn('px-2 py-1', 'p-4');
      // p-4 overrides px-2 py-1 in tailwind-merge
      expect(result).toBe('p-4');
    });

    it('should handle conditional classes', () => {
      const isActive = true;
      const isDisabled = false;
      
      const result = cn(
        'base-class',
        isActive && 'active-class',
        isDisabled && 'disabled-class'
      );
      
      expect(result).toBe('base-class active-class');
    });
  });
});
