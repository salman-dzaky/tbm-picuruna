import { getCategories } from '@/src/db/queries';
import { BookForm } from '@/src/components/admin/book-form';
import { createBook } from '@/src/app/(admin)/admin/actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Tambah Buku Baru',
};

export default async function NewBookPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Kembali ke dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Tambah Buku Baru
          </h1>
          <p className="text-sm text-muted-foreground">
            Isi informasi buku untuk menambahkan ke koleksi.
          </p>
        </div>
      </div>

      <BookForm categories={categories} action={createBook} />
    </div>
  );
}
