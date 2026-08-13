'use client';

import { useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save } from 'lucide-react';
import { CoverUpload } from './cover-upload';
import { cn } from '@/src/lib/utils';
import type { Book, Category } from '@/src/db/schema';
import type { ActionResult } from '@/src/app/(admin)/admin/actions';

type BookFormProps = {
  categories: Pick<Category, 'id' | 'name'>[];
  book?: Book | null;
  action: (formData: FormData) => Promise<ActionResult>;
};

const initialState: ActionResult = {
  success: false,
  message: '',
};

export function BookForm({ categories, book, action }: BookFormProps) {
  const router = useRouter();
  const [coverUrl, setCoverUrl] = useState(book?.coverUrl ?? '');
  const [coverPublicId, setCoverPublicId] = useState(
    book?.coverPublicId ?? ''
  );

  const formAction = async (
    _prev: ActionResult,
    formData: FormData
  ): Promise<ActionResult> => {
    const result = await action(formData);
    if (result.success) {
      router.push('/admin');
      router.refresh();
    }
    return result;
  };

  const [state, dispatch, isPending] = useActionState(formAction, initialState);

  const inputClass =
    'h-9 w-full rounded-md border border-border bg-card px-3 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50';
  const labelClass = 'block text-sm font-medium text-foreground';
  const errorClass = 'mt-0.5 text-xs text-destructive';

  return (
    <form action={dispatch} className="space-y-8">
      {/* Status message */}
      {state.message && !state.success && (
        <div className="rounded-lg border border-destructive/20 bg-destructive-foreground px-4 py-3 text-sm text-destructive">
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        {/* Left column — Form fields */}
        <div className="space-y-6 rounded-xl border border-border bg-card p-5 sm:p-6">
          <h2 className="text-base font-semibold text-card-foreground">
            Informasi Buku
          </h2>

          {/* Title (required) */}
          <div>
            <label htmlFor="title" className={labelClass}>
              Judul Buku <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={book?.title ?? ''}
              required
              className={inputClass}
              placeholder="Masukkan judul buku"
            />
            {state.errors?.title && (
              <p className={errorClass}>{state.errors.title[0]}</p>
            )}
          </div>

          {/* Author + Illustrator */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="author" className={labelClass}>
                Penulis
              </label>
              <input
                type="text"
                id="author"
                name="author"
                defaultValue={book?.author ?? ''}
                className={inputClass}
                placeholder="Nama penulis"
              />
            </div>
            <div>
              <label htmlFor="illustrator" className={labelClass}>
                Ilustrator
              </label>
              <input
                type="text"
                id="illustrator"
                name="illustrator"
                defaultValue={book?.illustrator ?? ''}
                className={inputClass}
                placeholder="Nama ilustrator"
              />
            </div>
          </div>

          {/* Publisher + Year */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="publisher" className={labelClass}>
                Penerbit
              </label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                defaultValue={book?.publisher ?? ''}
                className={inputClass}
                placeholder="Nama penerbit"
              />
            </div>
            <div>
              <label htmlFor="publicationYear" className={labelClass}>
                Tahun Terbit
              </label>
              <input
                type="number"
                id="publicationYear"
                name="publicationYear"
                defaultValue={book?.publicationYear ?? ''}
                min={1800}
                max={new Date().getFullYear()}
                className={inputClass}
                placeholder="cth: 2024"
              />
            </div>
          </div>

          {/* Category (required) + Status */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="categoryId" className={labelClass}>
                Kategori <span className="text-destructive">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                defaultValue={book?.categoryId ?? ''}
                required
                className={cn(inputClass, 'cursor-pointer appearance-none')}
              >
                <option value="">Pilih kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {state.errors?.categoryId && (
                <p className={errorClass}>{state.errors.categoryId[0]}</p>
              )}
            </div>
            <div>
              <label htmlFor="status" className={labelClass}>
                Status
              </label>
              <select
                id="status"
                name="status"
                defaultValue={book?.status ?? 'TERSEDIA'}
                className={cn(inputClass, 'cursor-pointer appearance-none')}
              >
                <option value="TERSEDIA">Tersedia</option>
                <option value="DIPINJAM">Dipinjam</option>
              </select>
            </div>
          </div>

          {/* Number of copies + ISBN */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="numberOfCopies" className={labelClass}>
                Jumlah Eksemplar <span className="text-destructive">*</span>
              </label>
              <input
                type="number"
                id="numberOfCopies"
                name="numberOfCopies"
                defaultValue={book?.numberOfCopies ?? 1}
                min={1}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="isbn" className={labelClass}>
                ISBN
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                defaultValue={book?.isbn ?? ''}
                className={inputClass}
                placeholder="978-xxx-xxx-xxx-x"
              />
            </div>
          </div>

          {/* Location + Call Number + Inventory */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="locationRack" className={labelClass}>
                Lokasi Rak
              </label>
              <input
                type="text"
                id="locationRack"
                name="locationRack"
                defaultValue={book?.locationRack ?? ''}
                className={inputClass}
                placeholder="cth: Rak A-01 atau Baris Atas"
              />
            </div>
            <div>
              <label htmlFor="callNumber" className={labelClass}>
                Nomor Panggil
              </label>
              <input
                type="text"
                id="callNumber"
                name="callNumber"
                defaultValue={book?.callNumber ?? ''}
                className={inputClass}
                placeholder="cth: 813 EMI i"
              />
            </div>
            <div>
              <label htmlFor="inventoryNumber" className={labelClass}>
                No. Inventaris
              </label>
              <input
                type="text"
                id="inventoryNumber"
                name="inventoryNumber"
                defaultValue={book?.inventoryNumber ?? ''}
                className={inputClass}
                placeholder="cth: INV-2024-001"
              />
            </div>
          </div>

          {/* Subject + Origin */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="subject" className={labelClass}>
                Subjek
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                defaultValue={book?.subject ?? ''}
                className={inputClass}
                placeholder="cth: Ekonomi Makro"
              />
            </div>
            <div>
              <label htmlFor="origin" className={labelClass}>
                Asal Buku
              </label>
              <input
                type="text"
                id="origin"
                name="origin"
                defaultValue={book?.origin ?? ''}
                className={inputClass}
                placeholder="cth: Sumbangan Warga atau Perpusnas"
              />
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <label htmlFor="synopsis" className={labelClass}>
              Sinopsis
            </label>
            <textarea
              id="synopsis"
              name="synopsis"
              defaultValue={book?.synopsis ?? ''}
              rows={4}
              className={cn(inputClass, 'h-auto py-2')}
              placeholder="Ringkasan singkat isi buku (opsional)"
            />
          </div>
        </div>

        {/* Right column — Cover Upload */}
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5 sm:p-6">
            <CoverUpload
              coverUrl={coverUrl}
              coverPublicId={coverPublicId}
              onUpload={(url, publicId) => {
                setCoverUrl(url);
                setCoverPublicId(publicId);
              }}
              onRemove={() => {
                setCoverUrl('');
                setCoverPublicId('');
              }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="h-9 cursor-pointer rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-green-700 disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          {book ? 'Simpan Perubahan' : 'Tambah Buku'}
        </button>
      </div>
    </form>
  );
}
