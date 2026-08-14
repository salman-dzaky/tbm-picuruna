import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

process.env.TURSO_DATABASE_URL = 'http://localhost:8080';
process.env.TURSO_AUTH_TOKEN = 'dummy_token';

// Mock Next.js router
vi.mock('next/navigation', () => {
  return {
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      refresh: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  };
});

// Mock react's useActionState for React 19 testing (if needed)
vi.mock('react', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react')>();
  return {
    ...mod,
    useActionState: vi.fn().mockReturnValue([{ success: false, message: '' }, vi.fn(), false]),
  };
});

// Mock next-cloudinary
vi.mock('next-cloudinary', () => {
  return {
    CldImage: (props: any) => {
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      return <img {...props} />;
    },
    CldUploadWidget: ({ children }: any) => {
      return children({ open: vi.fn() });
    },
  };
});
