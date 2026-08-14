import { Suspense } from 'react';
import { getBooks, getCategories } from '@/src/db/queries';
import { BookGrid } from '@/src/components/katalog/book-grid';
import { SearchBar } from '@/src/components/katalog/search-bar';
import { CategoryFilter } from '@/src/components/katalog/category-filter';
import { SortSelect } from '@/src/components/katalog/sort-select';
import { Pagination } from '@/src/components/katalog/pagination';
import { Library } from 'lucide-react';

export const metadata = {
  title: 'Katalog Buku',
  description:
    'Jelajahi koleksi buku Taman Baca Masyarakat Picuruna. Cari berdasarkan judul, penulis, atau filter berdasarkan kategori.',
};

type KatalogPageProps = {
  searchParams: Promise<{
    q?: string;
    kategori?: string;
    page?: string;
    sort?: string;
  }>;
};

export default async function KatalogPage({ searchParams }: KatalogPageProps) {
  const params = await searchParams;

  const search = params.q ?? '';
  const category = params.kategori ?? '';
  const sort = params.sort ?? 'newest';
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  // Parallel data fetching
  const [{ books, pagination }, categories] = await Promise.all([
    getBooks({ search, category, page, sort }),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5">
          <Library className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Katalog Buku
          </h1>
        </div>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Temukan buku yang sesuai dengan minat dan kebutuhan Anda.
          {pagination.total > 0 && (
            <span className="ml-1 font-medium text-foreground">
              {pagination.total} buku ditemukan.
            </span>
          )}
        </p>
      </div>

      {/* Filters Bar */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
        <Suspense fallback={null}>
          <CategoryFilter categories={categories} />
        </Suspense>
        <Suspense fallback={null}>
          <SortSelect />
        </Suspense>
      </div>

      {/* Active Filters Indicator */}
      {(search || category) && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Filter aktif:</span>
          {search && (
            <span className="rounded-md bg-accent px-2 py-0.5 font-medium text-accent-foreground">
              &quot;{search}&quot;
            </span>
          )}
          {category && (
            <span className="rounded-md bg-accent px-2 py-0.5 font-medium text-accent-foreground">
              {categories.find((c) => c.id === category)?.name ?? category}
            </span>
          )}
        </div>
      )}

      {/* Book Grid */}
      <BookGrid books={books} />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8">
          <Suspense fallback={null}>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
