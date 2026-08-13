import { BookCard } from './book-card';
import { BookX } from 'lucide-react';

type BookData = {
  id: string;
  title: string;
  author: string | null;
  publisher: string | null;
  publicationYear: number | null;
  status: 'TERSEDIA' | 'DIPINJAM';
  coverUrl: string | null;
  categoryName: string | null;
};

type BookGridProps = {
  books: BookData[];
};

export function BookGrid({ books }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card px-6 py-16 text-center">
        <BookX className="h-12 w-12 text-muted-foreground/40" />
        <div>
          <p className="font-medium text-card-foreground">
            Buku tidak ditemukan
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Coba ubah kata kunci pencarian atau filter kategori.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
