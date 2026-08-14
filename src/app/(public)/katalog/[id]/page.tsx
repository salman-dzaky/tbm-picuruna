import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CloudinaryImage } from '@/src/components/ui/cloudinary-image';
import { ChevronLeft, BookOpen, MapPin, Hash, Building2, Calendar, BookType } from 'lucide-react';
import { getBookById } from '@/src/db/queries';
import { StatusBadge } from '@/src/components/ui/status-badge';

type BookDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: BookDetailPageProps) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    return { title: 'Buku Tidak Ditemukan' };
  }

  return {
    title: `${book.title} | TBM Picuruna`,
    description: book.synopsis || `Detail buku ${book.title} di TBM Picuruna.`,
  };
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Back Button */}
      <Link
        href="/katalog"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[300px_1fr] lg:gap-12">
        {/* Left Column: Cover */}
        <div className="space-y-6">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-border bg-secondary shadow-sm">
            {book.coverUrl ? (
              <CloudinaryImage
                src={book.coverUrl}
                alt={`Sampul buku ${book.title}`}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-secondary to-muted p-6">
                <BookOpen className="h-16 w-16 text-muted-foreground/50" />
                <span className="text-center text-sm font-medium text-muted-foreground/70">
                  Tidak Ada Sampul
                </span>
              </div>
            )}
            
            <div className="absolute right-3 top-3">
              <StatusBadge status={book.status} />
            </div>
          </div>
          
          {/* Availability Card */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="font-semibold text-card-foreground">Informasi Peminjaman</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Lokasi Rak</p>
                  <p className="text-sm font-medium text-foreground">{book.locationRack || 'Tidak ditentukan'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Hash className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Nomor Panggil</p>
                  <p className="text-sm font-medium text-foreground">{book.callNumber || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {book.title}
            </h1>
            {book.author && (
              <p className="mt-2 text-lg text-muted-foreground">
                Oleh <span className="font-medium text-foreground">{book.author}</span>
              </p>
            )}
          </div>

          {/* Quick Info Badges */}
          <div className="mb-8 flex flex-wrap items-center gap-3">
            {book.category && (
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                <BookType className="h-4 w-4" />
                {book.category.name}
              </div>
            )}
            {book.publicationYear && (
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                <Calendar className="h-4 w-4" />
                {book.publicationYear}
              </div>
            )}
            {book.publisher && (
              <div className="flex items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                <Building2 className="h-4 w-4" />
                {book.publisher}
              </div>
            )}
          </div>

          {/* Synopsis */}
          <div className="mb-10">
            <h2 className="mb-3 text-lg font-bold text-foreground">Sinopsis</h2>
            {book.synopsis ? (
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p className="leading-relaxed">{book.synopsis}</p>
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                Sinopsis belum tersedia untuk buku ini.
              </p>
            )}
          </div>

          {/* Detailed Metadata Grid */}
          <div>
            <h2 className="mb-4 text-lg font-bold text-foreground">Detail Buku</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 rounded-xl border border-border bg-card p-5">
              {[
                { label: 'Penulis', value: book.author },
                { label: 'Ilustrator', value: book.illustrator },
                { label: 'Penerbit', value: book.publisher },
                { label: 'Tahun Terbit', value: book.publicationYear },
                { label: 'Subjek', value: book.subject },
                { label: 'ISBN', value: book.isbn },
                { label: 'Jumlah Salinan', value: `${book.numberOfCopies} Eksemplar` },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-sm font-medium text-card-foreground">
                    {item.value || '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
