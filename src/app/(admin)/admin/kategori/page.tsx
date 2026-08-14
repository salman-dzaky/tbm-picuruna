import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronLeft, Tags } from 'lucide-react';
import { getPaginatedCategories } from '@/src/db/queries';
import { CategoryManager } from '@/src/components/admin/category-manager';
import { SearchBar } from '@/src/components/katalog/search-bar';
import { CategorySortSelect } from '@/src/components/admin/category-sort-select';
import { Pagination } from '@/src/components/katalog/pagination';

export const metadata = {
  title: 'Kelola Kategori | Dashboard Admin',
};

type AdminKategoriPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
    sort?: string;
  }>;
};

export default async function AdminKategoriPage({ searchParams }: AdminKategoriPageProps) {
  const params = await searchParams;
  const search = params.q ?? '';
  const sort = params.sort ?? 'name_asc';
  const page = Math.max(1, parseInt(params.page ?? '1', 10) || 1);

  const { categories, pagination } = await getPaginatedCategories({ search, page, sort });

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Kembali ke Dashboard
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-foreground">
            <Tags className="h-6 w-6 text-primary" />
            Kelola Kategori
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Tambah, ubah, atau hapus kategori untuk mengorganisir koleksi buku TBM.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center lg:w-2/3 ml-auto">
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
        <Suspense fallback={null}>
          <CategorySortSelect />
        </Suspense>
      </div>

      <CategoryManager categories={categories} />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-end lg:w-2/3 ml-auto">
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
