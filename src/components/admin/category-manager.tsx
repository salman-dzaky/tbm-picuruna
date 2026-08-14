'use client';

import { useState, useTransition, useEffect, useRef } from 'react';
import { Pencil, Plus, Loader2, CheckCircle2, Trash2 } from 'lucide-react';
import type { Category } from '@/src/db/schema';
import { createCategory, updateCategory } from '@/src/app/(admin)/admin/kategori/actions';
import { UNCATEGORIZED_ID } from '@/src/lib/constants';
import { DeleteCategoryDialog } from './delete-category-dialog';
import { cn } from '@/src/lib/utils';

type CategoryManagerProps = {
  categories: Category[];
  filters?: React.ReactNode;
  pagination?: React.ReactNode;
};

export function CategoryManager({ categories, filters, pagination }: CategoryManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  
  // Feedback state
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-hide success message
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setError(null);
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setError(null);
    setSuccessMsg(null);
    
    // Scroll to top on mobile and autofocus the input
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const input = inputRef.current;
      if (input) {
        input.focus();
        // Force cursor to the end of the text
        const length = input.value.length;
        input.setSelectionRange(length, length);
      }
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
    setSuccessMsg(null);
    const formData = new FormData();
    formData.append('name', name);

    startTransition(async () => {
      let res;
      if (editingId) {
        res = await updateCategory(editingId, formData);
      } else {
        res = await createCategory(formData);
      }

      if (res?.error) {
        setError(res.error);
      } else {
        setSuccessMsg(
          editingId
            ? 'Kategori berhasil diperbarui.'
            : 'Kategori baru berhasil ditambahkan.'
        );
        resetForm();
      }
    });
  };

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
      {/* Form Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-card-foreground">
          {editingId ? 'Edit Kategori' : 'Tambah Kategori'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">
              Nama Kategori
            </label>
            <input
              ref={inputRef}
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: Fiksi, Sains..."
              className={cn(
                "h-10 w-full rounded-md border bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                error ? "border-destructive focus-visible:ring-destructive" : "border-input"
              )}
              disabled={isPending}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm font-medium text-destructive">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm font-medium text-status-available">
              <CheckCircle2 className="h-4 w-4" />
              {successMsg}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="inline-flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-green-700 disabled:pointer-events-none disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : editingId ? (
                'Simpan Perubahan'
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Tambah
                </>
              )}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={isPending}
                className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md border border-border bg-card px-4 text-sm font-medium text-card-foreground transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-50"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Right Column: Filters and List Section */}
      <div className="flex flex-col gap-4 lg:col-span-2">
        {filters && (
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:flex-wrap sm:items-center shadow-sm">
            {filters}
          </div>
        )}

        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-card-foreground">Daftar Kategori</h2>
            {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-sm text-muted-foreground">Tidak ada kategori yang ditemukan.</p>
            </div>
          ) : (
            <div className="divide-y divide-border rounded-md border border-border">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-secondary/50"
                >
                  <div>
                    <p className="font-medium text-card-foreground">{cat.name}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Slug: {cat.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(cat)}
                      disabled={isPending || cat.id === UNCATEGORIZED_ID}
                      title={cat.id === UNCATEGORIZED_ID ? 'Kategori bawaan sistem tidak dapat diubah' : 'Edit Kategori'}
                      className={cn(
                        "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-50",
                        editingId === cat.id && "bg-secondary text-foreground ring-2 ring-ring ring-offset-1"
                      )}
                      aria-label="Edit Kategori"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    {cat.id !== UNCATEGORIZED_ID ? (
                      <DeleteCategoryDialog 
                        categoryId={cat.id} 
                        categoryName={cat.name} 
                        onSuccess={() => {
                          if (editingId === cat.id) resetForm();
                        }}
                      />
                    ) : (
                      <button
                        type="button"
                        disabled
                        title="Kategori bawaan sistem tidak dapat dihapus"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-secondary/50 text-muted-foreground/50 cursor-not-allowed"
                        aria-label="Hapus Kategori (Dinonaktifkan)"
                      >
                        <Trash2 className="h-4 w-4 opacity-50" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {pagination && (
        <div className="flex justify-end">
          {pagination}
        </div>
      )}
    </div>
    </div>
  );
}
