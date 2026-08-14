'use client';

import { useState, useTransition } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteCategory } from '@/src/app/(admin)/admin/kategori/actions';

type DeleteCategoryDialogProps = {
  categoryId: string;
  categoryName: string;
  onSuccess?: () => void;
};

export function DeleteCategoryDialog({ categoryId, categoryName, onSuccess }: DeleteCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const result = await deleteCategory(categoryId);
      if (result?.error) {
        setError(result.error);
      } else {
        setOpen(false);
        if (onSuccess) onSuccess();
      }
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-destructive/20 bg-destructive/10 text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:pointer-events-none disabled:opacity-50"
        aria-label={`Hapus kategori ${categoryName}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Modal Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
          >
            <h3
              id="delete-dialog-title"
              className="text-base font-semibold text-card-foreground"
            >
              Hapus Kategori?
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Anda yakin ingin menghapus kategori{' '}
              <span className="font-medium text-foreground">
                &quot;{categoryName}&quot;
              </span>
              ? Buku yang menggunakan kategori ini mungkin kehilangan referensinya.
            </p>

            {error && (
              <div className="mt-4 rounded-md bg-destructive/10 p-3">
                <p className="text-sm font-medium text-destructive">{error}</p>
              </div>
            )}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="h-9 cursor-pointer rounded-md border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md bg-destructive px-4 text-sm font-medium text-destructive-foreground transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
