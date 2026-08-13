import { notFound } from 'next/navigation';
import { getBookById, getCategories } from '@/src/db/queries';
import { BookForm } from '@/src/components/admin/book-form';
import { updateBook } from '@/src/app/(admin)/admin/actions';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Edit Buku',
};

type EditBookPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBookPage({ params }: EditBookPageProps) {
  const { id } = await params;

  const [book, categories] = await Promise.all([
    getBookById(id),
    getCategories(),
  ]);

  if (!book) {
    notFound();
  }

  // Bind the book ID to the updateBook action
  const boundUpdateBook = updateBook.bind(null, id);

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
            Edit Buku
          </h1>
          <p className="text-sm text-muted-foreground">
            {book.title}
          </p>
        </div>
      </div>

      <BookForm
        categories={categories}
        book={book}
        action={boundUpdateBook}
      />
    </div>
  );
}
