import { BookOpen } from 'lucide-react';
import { StatusBadge } from '@/src/components/ui/status-badge';
import { cn } from '@/src/lib/utils';

type BookCardProps = {
  book: {
    id: string;
    title: string;
    author: string | null;
    publisher: string | null;
    publicationYear: number | null;
    status: 'TERSEDIA' | 'DIPINJAM';
    coverUrl: string | null;
    categoryName: string | null;
  };
};

export function BookCard({ book }: BookCardProps) {
  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow duration-200 hover:shadow-md"
    >
      {/* Cover Image / Placeholder */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={`Sampul buku ${book.title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-muted p-4">
            <BookOpen className="h-10 w-10 text-muted-foreground/50" />
            <span className="text-center text-sm font-medium leading-tight text-muted-foreground/70 line-clamp-3">
              {book.title}
            </span>
          </div>
        )}

        {/* Status Badge Overlay */}
        <div className="absolute top-2 right-2">
          <StatusBadge status={book.status} />
        </div>
      </div>

      {/* Book Info */}
      <div className="flex flex-1 flex-col gap-1.5 p-3.5">
        <h3 className="text-sm font-semibold leading-snug text-card-foreground line-clamp-2">
          {book.title}
        </h3>

        {book.author && (
          <p className="text-xs text-muted-foreground line-clamp-1">
            {book.author}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          {book.categoryName && (
            <span className="rounded-md bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">
              {book.categoryName}
            </span>
          )}
          {book.publicationYear && (
            <span className="text-[11px] text-muted-foreground">
              {book.publicationYear}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
