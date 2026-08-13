'use server';

import { db } from '@/src/db';
import { categories } from '@/src/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { nanoid } from 'nanoid';
import { z } from 'zod';

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

  try {
    const slug = slugify(parsed.data.name);
    await db.insert(categories).values({
      id: `cat_${nanoid(10)}`,
      name: parsed.data.name,
      slug,
    });

    revalidatePath('/admin/kategori');
    revalidatePath('/admin/buku/baru');
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

  const name = formData.get('name') as string;
  const parsed = categorySchema.safeParse({ name });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
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

  try {
    await db.delete(categories).where(eq(categories.id, id));
    revalidatePath('/admin/kategori');
    revalidatePath('/admin/buku/baru');
    return { success: true };
  } catch (err: any) {
    return { error: 'Gagal menghapus kategori. Pastikan tidak ada buku yang menggunakan kategori ini.' };
  }
}
