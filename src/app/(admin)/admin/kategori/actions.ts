'use server';

import { db } from '@/src/db';
import { categories, books } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { UNCATEGORIZED_ID } from '@/src/lib/constants';

type ActionResult = {
  success?: boolean;
  error?: string;
};

const categorySchema = z.object({
  name: z.string().min(1, 'Nama kategori wajib diisi.').max(50, 'Maksimal 50 karakter.'),
});

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export async function createCategory(formData: FormData): Promise<ActionResult> {
  await auth.protect();

  const name = formData.get('name') as string;
  const parsed = categorySchema.safeParse({ name });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  if (name.toLowerCase() === 'tanpa kategori') {
    return { error: 'Nama "Tanpa Kategori" dicadangkan oleh sistem.' };
  }

  try {
    const slug = slugify(parsed.data.name);
    await db.insert(categories).values({
      id: `cat_${nanoid(10)}`,
      name: parsed.data.name,
      slug,
    });

    revalidatePath('/admin/kategori');
    revalidatePath('/admin/buku/baru');
    revalidatePath('/katalog');
    return { success: true };
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) {
      return { error: 'Kategori dengan nama tersebut sudah ada.' };
    }
    return { error: 'Gagal menambahkan kategori.' };
  }
}

export async function updateCategory(id: string, formData: FormData): Promise<ActionResult> {
  await auth.protect();

  if (id === UNCATEGORIZED_ID) {
    return { error: 'Kategori "Tanpa Kategori" tidak dapat diubah.' };
  }

  const name = formData.get('name') as string;
  const parsed = categorySchema.safeParse({ name });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  if (name.toLowerCase() === 'tanpa kategori') {
    return { error: 'Nama "Tanpa Kategori" dicadangkan oleh sistem.' };
  }

  try {
    const slug = slugify(parsed.data.name);
    await db
      .update(categories)
      .set({
        name: parsed.data.name,
        slug,
      })
      .where(eq(categories.id, id));

    revalidatePath('/admin/kategori');
    revalidatePath('/admin/buku/baru');
    revalidatePath('/katalog');
    return { success: true };
  } catch (err: any) {
    if (err.message?.includes('UNIQUE')) {
      return { error: 'Kategori dengan nama tersebut sudah ada.' };
    }
    return { error: 'Gagal memperbarui kategori.' };
  }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await auth.protect();

  if (id === UNCATEGORIZED_ID) {
    return { error: 'Kategori "Tanpa Kategori" tidak dapat dihapus.' };
  }

  try {
    // 1. Cek apakah ada kategori dengan slug "tanpa-kategori" (mungkin dibuat manual sebelumnya)
    const existingUncategorized = await db.query.categories.findFirst({
      where: (cat, { eq }) => eq(cat.slug, 'tanpa-kategori'),
    });

    if (existingUncategorized && existingUncategorized.id !== UNCATEGORIZED_ID) {
      // Kasus: User pernah membuat "Tanpa Kategori" secara manual.
      // Kita harus menggantinya dengan ID bawaan sistem tanpa menghapus bukunya.
      
      // a. Ubah nama sementara agar tidak bentrok dengan UNIQUE constraint
      await db.update(categories)
        .set({ name: 'Temp Uncategorized', slug: `temp-${nanoid(5)}` })
        .where(eq(categories.id, existingUncategorized.id));
      
      // b. Buat kategori bawaan sistem yang resmi
      await db.insert(categories).values({
        id: UNCATEGORIZED_ID,
        name: 'Tanpa Kategori',
        slug: 'tanpa-kategori',
      });

      // c. Pindahkan semua buku dari kategori manual lama ke yang resmi
      await db.update(books)
        .set({ categoryId: UNCATEGORIZED_ID })
        .where(eq(books.categoryId, existingUncategorized.id));

      // d. Hapus kategori manual yang sudah kosong
      await db.delete(categories).where(eq(categories.id, existingUncategorized.id));
    } else if (!existingUncategorized) {
      // Kasus: Belum ada sama sekali, buat baru
      await db.insert(categories).values({
        id: UNCATEGORIZED_ID,
        name: 'Tanpa Kategori',
        slug: 'tanpa-kategori',
      });
    }

    // 2. Pindahkan semua buku di kategori target penghapusan ke "Tanpa Kategori" resmi
    await db
      .update(books)
      .set({ categoryId: UNCATEGORIZED_ID })
      .where(eq(books.categoryId, id));

    // 3. Hapus kategori target
    await db.delete(categories).where(eq(categories.id, id));

    revalidatePath('/admin/kategori');
    revalidatePath('/admin/buku/baru');
    revalidatePath('/katalog');
    return { success: true };
  } catch (err: any) {
    console.error('Error deleting category:', err);
    return { error: `Gagal menghapus kategori: ${err.message}` };
  }
}
