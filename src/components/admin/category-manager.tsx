'use client';

import { useState, useTransition } from 'react';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import type { Category } from '@/src/db/schema';
import { createCategory, updateCategory, deleteCategory } from '@/src/app/(admin)/admin/kategori/actions';

type CategoryManagerProps = {
  categories: Category[];
};

export function CategoryManager({ categories }: CategoryManagerProps) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setError(null);
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setName(category.name);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setError(null);
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
        resetForm();
      }
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus kategori ini? Buku yang menggunakan kategori ini mungkin akan kehilangan referensinya jika tidak ditangani.')) {
      return;
    }

    startTransition(async () => {
      const res = await deleteCategory(id);
      if (res?.error) {
        alert(res.error);
      } else if (editingId === id) {
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
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Misal: Fiksi, Sains..."
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isPending}
            />
          </div>
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending || !name.trim()}
              className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-green-700 disabled:pointer-events-none disabled:opacity-50"
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
                className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-card px-4 text-sm font-medium text-card-foreground transition-colors hover:bg-secondary disabled:pointer-events-none disabled:opacity-50"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="rounded-xl border border-border bg-card shadow-sm lg:col-span-2">
        <div className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-card-foreground">Daftar Kategori</h2>
          {categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada kategori yang ditambahkan.</p>
          ) : (
            <div className="divide-y divide-border rounded-md border border-border">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-4 transition-colors hover:bg-secondary/50"
                >
                  <div>
                    <p className="font-medium text-card-foreground">{cat.name}</p>
                    <p className="text-xs text-muted-foreground">Slug: {cat.slug}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(cat)}
                      disabled={isPending}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
                      aria-label="Edit Kategori"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      disabled={isPending}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-destructive/20 bg-destructive/10 text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:pointer-events-none disabled:opacity-50"
                      aria-label="Hapus Kategori"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
