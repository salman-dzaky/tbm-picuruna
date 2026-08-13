import Link from 'next/link';
import { ChevronLeft, Tags } from 'lucide-react';
import { getCategories } from '@/src/db/queries';
import { CategoryManager } from '@/src/components/admin/category-manager';

export const metadata = {
  title: 'Kelola Kategori | Dashboard Admin',
};

export default async function AdminKategoriPage() {
  const categories = await getCategories();

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

      <CategoryManager categories={categories} />
    </div>
  );
}
