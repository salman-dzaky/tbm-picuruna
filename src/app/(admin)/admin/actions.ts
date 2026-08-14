'use server';

/**
 * Server Actions — CRUD Buku
 *
 * Semua operasi mutasi database berjalan di server.
 * Dilindungi oleh Clerk middleware (hanya admin yang bisa akses /admin).
 */

import { db } from '@/src/db';
import { books } from '@/src/db/schema';
import { eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { generateBookId } from '@/src/lib/nanoid';
import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';

// ============================================================
// CLOUDINARY HELPER
// ============================================================

async function deleteCloudinaryImage(publicId: string) {
  try {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) return;

    const timestamp = Math.floor(Date.now() / 1000).toString();
    
    // Cloudinary requires signature parameters to be alphabetically sorted
    const payload = `invalidate=true&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    
    // Create SHA-1 signature using Web Crypto API (Edge compatible)
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const formData = new FormData();
    formData.append('public_id', publicId);
    formData.append('timestamp', timestamp);
    formData.append('invalidate', 'true');
    formData.append('api_key', apiKey);
    formData.append('signature', signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('Cloudinary API error:', await response.text());
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
}

// ============================================================
// ZOD VALIDATION SCHEMA
// ============================================================

const bookSchema = z.object({
  title: z.string().min(1, 'Judul buku wajib diisi').max(255),
  author: z.string().max(255).optional().or(z.literal('')),
  illustrator: z.string().max(255).optional().or(z.literal('')),
  publisher: z.string().max(255).optional().or(z.literal('')),
  publicationYear: z
    .union([z.coerce.number().int().min(1800).max(new Date().getFullYear()), z.literal(0), z.nan()])
    .optional()
    .transform((v) => (v && !isNaN(v) && v > 0 ? v : null)),
  numberOfCopies: z.coerce.number().int().min(1).default(1),
  subject: z.string().max(255).optional().or(z.literal('')),
  origin: z.string().max(255).optional().or(z.literal('')),
  isbn: z.string().max(20).optional().or(z.literal('')),
  synopsis: z.string().max(2000).optional().or(z.literal('')),
  categoryId: z.string().min(1, 'Kategori wajib dipilih'),
  locationRack: z.string().max(50).optional().or(z.literal('')),
  callNumber: z.string().max(50).optional().or(z.literal('')),
  inventoryNumber: z.string().max(50).optional().or(z.literal('')),
  status: z.enum(['TERSEDIA', 'DIPINJAM']).default('TERSEDIA'),
  coverUrl: z.string().url().optional().or(z.literal('')).or(z.literal(undefined)),
  coverPublicId: z.string().optional().or(z.literal('')).or(z.literal(undefined)),
});

// ============================================================
// RESPONSE TYPE
// ============================================================

export type ActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

// ============================================================
// CREATE BOOK
// ============================================================

export async function createBook(formData: FormData): Promise<ActionResult> {
  await auth.protect();
  
  const raw = Object.fromEntries(formData.entries());
  const parsed = bookSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Data tidak valid. Periksa kembali formulir.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;

  try {
    await db.insert(books).values({
      id: generateBookId(),
      title: data.title,
      author: data.author || null,
      illustrator: data.illustrator || null,
      publisher: data.publisher || null,
      publicationYear: data.publicationYear ?? null,
      numberOfCopies: data.numberOfCopies,
      subject: data.subject || null,
      origin: data.origin || null,
      isbn: data.isbn || null,
      synopsis: data.synopsis || null,
      categoryId: data.categoryId,
      locationRack: data.locationRack || null,
      callNumber: data.callNumber || null,
      inventoryNumber: data.inventoryNumber || null,
      status: data.status,
      coverUrl: data.coverUrl || null,
      coverPublicId: data.coverPublicId || null,
    });

    revalidatePath('/admin');
    revalidatePath('/katalog');

    return { success: true, message: 'Buku berhasil ditambahkan.' };
  } catch (error) {
    console.error('Create book error:', error);
    return { success: false, message: 'Gagal menambahkan buku. Silakan coba lagi.' };
  }
}

// ============================================================
// UPDATE BOOK
// ============================================================

export async function updateBook(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  await auth.protect();

  const raw = Object.fromEntries(formData.entries());
  const parsed = bookSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      message: 'Data tidak valid. Periksa kembali formulir.',
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;

  try {
    // Check existing book for old cover
    const existingBook = await db.query.books.findFirst({
      where: (books, { eq }) => eq(books.id, id),
      columns: { coverPublicId: true },
    });

    await db
      .update(books)
      .set({
        title: data.title,
        author: data.author || null,
        illustrator: data.illustrator || null,
        publisher: data.publisher || null,
        publicationYear: data.publicationYear ?? null,
        numberOfCopies: data.numberOfCopies,
        subject: data.subject || null,
        origin: data.origin || null,
        isbn: data.isbn || null,
        synopsis: data.synopsis || null,
        categoryId: data.categoryId,
        locationRack: data.locationRack || null,
        callNumber: data.callNumber || null,
        inventoryNumber: data.inventoryNumber || null,
        status: data.status,
        coverUrl: data.coverUrl || null,
        coverPublicId: data.coverPublicId || null,
        updatedAt: sql`(CURRENT_TIMESTAMP)`,
      })
      .where(eq(books.id, id));

    // Delete old image from Cloudinary if it was changed or removed
    if (
      existingBook?.coverPublicId &&
      existingBook.coverPublicId !== data.coverPublicId
    ) {
      await deleteCloudinaryImage(existingBook.coverPublicId);
    }

    revalidatePath('/admin');
    revalidatePath('/katalog');

    return { success: true, message: 'Buku berhasil diperbarui.' };
  } catch (error) {
    console.error('Update book error:', error);
    return { success: false, message: 'Gagal memperbarui buku. Silakan coba lagi.' };
  }
}

// ============================================================
// DELETE BOOK
// ============================================================

export async function deleteBook(id: string): Promise<ActionResult> {
  await auth.protect();

  try {
    // Get the book first to check for Cloudinary asset
    const book = await db.query.books.findFirst({
      where: (books, { eq }) => eq(books.id, id),
      columns: { coverPublicId: true },
    });

    if (!book) {
      return { success: false, message: 'Buku tidak ditemukan.' };
    }

    // Delete from database
    await db.delete(books).where(eq(books.id, id));

    // If book has a Cloudinary cover, delete it too
    if (book.coverPublicId) {
      await deleteCloudinaryImage(book.coverPublicId);
    }

    revalidatePath('/admin');
    revalidatePath('/katalog');

    return { success: true, message: 'Buku berhasil dihapus.' };
  } catch (error) {
    console.error('Delete book error:', error);
    return { success: false, message: 'Gagal menghapus buku. Silakan coba lagi.' };
  }
}
