'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useState, useEffect } from 'react';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [jumpPage, setJumpPage] = useState('');

  // Sinkronisasi input jump page dengan current page jika berubah dari luar
  useEffect(() => {
    setJumpPage('');
  }, [currentPage]);

  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    
    const params = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      params.set('page', String(page));
    } else {
      params.delete('page');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(jumpPage, 10);
    if (!isNaN(pageNum)) {
      goToPage(pageNum);
    }
  };

  // Show max 5 page numbers with ellipsis
  const getPageNumbers = (): (number | '...')[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | '...')[] = [1];

    if (currentPage > 3) pages.push('...');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);

    return pages;
  };

  const btnBase =
    'inline-flex h-10 min-w-[40px] items-center justify-center rounded-md border text-sm font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1';

  const showExtendedControls = totalPages > 5;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-end">
      <nav
        className="flex items-center justify-center gap-1.5"
        aria-label="Navigasi halaman katalog"
      >
        {/* First Page */}
        {showExtendedControls && (
          <button
            type="button"
            onClick={() => goToPage(1)}
            disabled={currentPage <= 1}
            className={cn(
              btnBase,
              'border-border bg-card px-2 hover:bg-secondary',
              'disabled:pointer-events-none disabled:opacity-40'
            )}
            aria-label="Halaman pertama"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        )}

        {/* Prev Page */}
        <button
          type="button"
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className={cn(
            btnBase,
            'border-border bg-card px-2 hover:bg-secondary',
            'disabled:pointer-events-none disabled:opacity-40'
          )}
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground" aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => goToPage(p)}
              className={cn(
                btnBase,
                p === currentPage
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card hover:bg-secondary'
              )}
              aria-label={`Halaman ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}

        {/* Next Page */}
        <button
          type="button"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={cn(
            btnBase,
            'border-border bg-card px-2 hover:bg-secondary',
            'disabled:pointer-events-none disabled:opacity-40'
          )}
          aria-label="Halaman berikutnya"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Last Page */}
        {showExtendedControls && (
          <button
            type="button"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage >= totalPages}
            className={cn(
              btnBase,
              'border-border bg-card px-2 hover:bg-secondary',
              'disabled:pointer-events-none disabled:opacity-40'
            )}
            aria-label="Halaman terakhir"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        )}
      </nav>

      {/* Jump to Page */}
      {showExtendedControls && (
        <form 
          onSubmit={handleJumpSubmit}
          className="flex items-center gap-2 border-l border-border pl-4"
        >
          <label htmlFor="jump-page" className="text-sm text-muted-foreground whitespace-nowrap">
            Ke hal:
          </label>
          <div className="flex items-center gap-1.5">
            <input
              id="jump-page"
              type="number"
              min={1}
              max={totalPages}
              value={jumpPage}
              onChange={(e) => setJumpPage(e.target.value)}
              className="h-10 w-16 rounded-md border border-input bg-background px-2 text-center text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              placeholder={String(currentPage)}
              aria-label="Lompat ke halaman"
            />
            <button
              type="submit"
              disabled={!jumpPage.trim() || isNaN(parseInt(jumpPage, 10))}
              className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-green-700 disabled:pointer-events-none disabled:opacity-50"
              aria-label="Pindah halaman"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
