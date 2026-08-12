import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'TBM Picuruna — Taman Baca Masyarakat',
    template: '%s | TBM Picuruna',
  },
  description:
    'Taman Baca Masyarakat Picuruna — Jelajahi koleksi buku kami dan temukan inspirasi membaca untuk semua kalangan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="id" className={`${inter.variable} antialiased`}>
        <body className="min-h-dvh flex flex-col bg-background text-foreground font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
