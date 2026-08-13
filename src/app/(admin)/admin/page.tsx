import Link from 'next/link';
import { Plus, BookOpen, BookX, Library } from 'lucide-react';
import { db } from '@/src/db';
import { books, categories } from '@/src/db/schema';
import { eq, count, sql } from 'drizzle-orm';
import { BookTable } from '@/src/components/admin/book-table';

export const metadata = {
  title: 'Dashboard Admin',
};

export default async function AdminDashboard() {
  // Parallel data fetch: stats + book list
  const [
    [totalBooks],
    [availableBooks],
    [borrowedBooks],
    bookList,
  ] = await Promise.all([
    db.select({ total: count() }).from(books),
    db.select({ total: count() }).from(books).where(eq(books.status, 'TERSEDIA')),
    db.select({ total: count() }).from(books).where(eq(books.status, 'DIPINJAM')),
    db
      .select({
        id: books.id,
        title: books.title,
        author: books.author,
        status: books.status,
        coverUrl: books.coverUrl,
        locationRack: books.locationRack,
        categoryName: categories.name,
      })
      .from(books)
      .leftJoin(categories, eq(books.categoryId, categories.id))
      .orderBy(sql`${books.createdAt} DESC`)
      .limit(50),
  ]);

  const stats = [
    {
      icon: Library,
      label: 'Total Buku',
      value: totalBooks.total,
      color: 'text-primary' as const,
      bg: 'bg-accent' as const,
    },
    {
      icon: BookOpen,
      label: 'Tersedia',
      value: availableBooks.total,
      color: 'text-status-available' as const,
      bg: 'bg-green-50' as const,
    },
    {
      icon: BookX,
      label: 'Dipinjam',
      value: borrowedBooks.total,
      color: 'text-status-borrowed' as const,
      bg: 'bg-amber-50' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Dashboard Admin
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Kelola koleksi buku Taman Baca Masyarakat Picuruna.
          </p>
        </div>
        <Link
          href="/admin/buku/baru"
          className="inline-flex h-9 items-center gap-2 self-start rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-green-700"
        >
          <Plus className="h-4 w-4" />
          Tambah Buku
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Book Table */}
      <BookTable books={bookList} />
    </div>
  );
}
