'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="text-sm font-bold tracking-tight text-foreground">
            TBM Picuruna
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground",
              pathname === '/' 
                ? "bg-secondary text-foreground" 
                : "text-muted-foreground"
            )}
          >
            Beranda
          </Link>
          <Link
            href="/katalog"
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground",
              pathname?.startsWith('/katalog')
                ? "bg-secondary text-foreground" 
                : "text-muted-foreground"
            )}
          >
            Katalog
          </Link>
        </nav>
      </div>
    </header>
  );
}
