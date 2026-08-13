'use client';

import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import { Pencil, BookOpen } from 'lucide-react';
import { StatusBadge } from '@/src/components/ui/status-badge';
import { DeleteDialog } from './delete-dialog';

type BookRow = {
  id: string;
  title: string;
  author: string | null;
  status: 'TERSEDIA' | 'DIPINJAM';
  categoryName: string | null;
  coverUrl: string | null;
  locationRack: string | null;
};

type BookTableProps = {
  books: BookRow[];
};

export function BookTable({ books }: BookTableProps) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <BookOpen className="h-10 w-10 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">
          Belum ada buku terdaftar. Mulai tambahkan buku pertama.
        </p>
        <Link
          href="/admin/buku/baru"
          className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-green-700"
        >
          Tambah Buku
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Buku
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">
                Kategori
              </th>
              <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground md:table-cell">
                Rak
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Status
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {books.map((book) => (
              <tr
                key={book.id}
                className="transition-colors hover:bg-secondary/30"
              >
                {/* Book title + author */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {book.coverUrl ? (
                      <div className="hidden relative h-10 w-7 shrink-0 sm:block">
                        <CldImage
                          src={book.coverUrl}
                          alt=""
                          fill
                          sizes="30px"
                          className="rounded border border-border object-cover"
                        />
                      </div>
                    ) : (
                      <div className="hidden h-10 w-7 shrink-0 items-center justify-center rounded border border-border bg-secondary sm:flex">
                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground/50" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-medium text-card-foreground">
                        {book.title}
                      </p>
                      {book.author && (
                        <p className="truncate text-xs text-muted-foreground">
                          {book.author}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="hidden px-4 py-3 sm:table-cell">
                  {book.categoryName && (
                    <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                      {book.categoryName}
                    </span>
                  )}
                </td>

                {/* Location */}
                <td className="hidden px-4 py-3 text-xs text-muted-foreground md:table-cell">
                  {book.locationRack ?? '—'}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={book.status} />
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/buku/${book.id}/edit`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                      aria-label={`Edit buku ${book.title}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteDialog bookId={book.id} bookTitle={book.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
