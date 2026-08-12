/**
 * Seed Script — TBM Picuruna
 *
 * Mengisi database dengan kategori dasar dan data dummy buku
 * untuk keperluan pengembangan dan demonstrasi.
 *
 * Penggunaan:
 *   npm run db:seed
 *
 * Prasyarat:
 *   - .env.local sudah terisi (TURSO_DATABASE_URL, TURSO_AUTH_TOKEN)
 *   - Schema sudah di-push ke database (npm run db:push)
 */

import { config } from 'dotenv';
config({ path: '.env' });
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { categories, books } from '../db/schema';
import { generateBookId, generateCategoryId } from '../lib/nanoid';
import { sql } from 'drizzle-orm';

// --- Inisialisasi DB Client (standalone, tidak bergantung pada Next.js) ---
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const db = drizzle(client);

// ============================================================
// DATA KATEGORI
// ============================================================
const CATEGORIES = [
  { name: 'Fiksi', slug: 'fiksi' },
  { name: 'Non-Fiksi', slug: 'non-fiksi' },
  { name: 'Anak-Anak', slug: 'anak-anak' },
  { name: 'Sains & Teknologi', slug: 'sains-teknologi' },
  { name: 'Sejarah', slug: 'sejarah' },
  { name: 'Agama & Spiritualitas', slug: 'agama-spiritualitas' },
  { name: 'Pendidikan', slug: 'pendidikan' },
  { name: 'Keterampilan & Hobi', slug: 'keterampilan-hobi' },
  { name: 'Komik & Manga', slug: 'komik-manga' },
  { name: 'Ensiklopedia & Referensi', slug: 'ensiklopedia-referensi' },
  { name: 'Pelajaran', slug: 'pelajaran' },
  { name: 'Seni & Budaya', slug: 'seni-budaya' },
] as const;

// ============================================================
// DATA BUKU DUMMY
// ============================================================
function createDummyBooks() {
  return [
    // --- Fiksi ---
    {
      id: generateBookId(),
      title: 'Laskar Pelangi',
      author: 'Andrea Hirata',
      publisher: 'Bentang Pustaka',
      publicationYear: 2005,
      numberOfCopies: 2,
      subject: 'Novel Indonesia',
      origin: 'Sumbangan Warga',
      isbn: '9789793062792',
      synopsis:
        'Kisah perjuangan anak-anak Belitung dalam meraih pendidikan di tengah keterbatasan.',
      categoryId: generateCategoryId('fiksi'),
      locationRack: 'Rak A-01',
      callNumber: '899.221/HIR/l',
      status: 'TERSEDIA' as const,
    },
    {
      id: generateBookId(),
      title: 'Bumi Manusia',
      author: 'Pramoedya Ananta Toer',
      publisher: 'Hasta Mitra',
      publicationYear: 1980,
      numberOfCopies: 1,
      subject: 'Novel Sejarah',
      origin: 'Hibah Kemdikbud',
      isbn: '9789799731234',
      synopsis:
        'Novel pertama dari Tetralogi Buru yang berlatar belakang era kolonial Hindia Belanda.',
      categoryId: generateCategoryId('fiksi'),
      locationRack: 'Rak A-01',
      callNumber: '899.221/TOE/b',
      status: 'TERSEDIA' as const,
    },
    {
      id: generateBookId(),
      title: 'Perahu Kertas',
      author: 'Dee Lestari',
      publisher: 'Bentang Pustaka',
      publicationYear: 2009,
      numberOfCopies: 1,
      subject: 'Novel Remaja',
      origin: 'Sumbangan Warga',
      categoryId: generateCategoryId('fiksi'),
      locationRack: 'Rak A-02',
      callNumber: '899.221/LES/p',
      status: 'DIPINJAM' as const,
    },

    // --- Non-Fiksi ---
    {
      id: generateBookId(),
      title: 'Filosofi Teras',
      author: 'Henry Manampiring',
      publisher: 'Kompas Gramedia',
      publicationYear: 2018,
      numberOfCopies: 2,
      subject: 'Filsafat Stoik',
      origin: 'Pembelian Dana Desa',
      isbn: '9786024125967',
      synopsis:
        'Pengantar filsafat Stoa yang dikemas ringan dan relevan untuk kehidupan modern.',
      categoryId: generateCategoryId('non-fiksi'),
      locationRack: 'Rak B-01',
      callNumber: '188/MAN/f',
      status: 'TERSEDIA' as const,
    },
    {
      id: generateBookId(),
      title: 'Atomic Habits',
      author: 'James Clear',
      publisher: 'Gramedia Pustaka Utama',
      publicationYear: 2019,
      numberOfCopies: 1,
      subject: 'Pengembangan Diri',
      origin: 'Sumbangan Warga',
      isbn: '9786020633176',
      synopsis:
        'Panduan praktis membangun kebiasaan baik dan menghilangkan kebiasaan buruk.',
      categoryId: generateCategoryId('non-fiksi'),
      locationRack: 'Rak B-01',
      callNumber: '158.1/CLE/a',
      status: 'TERSEDIA' as const,
    },

    // --- Anak-Anak ---
    {
      id: generateBookId(),
      title: 'Si Kancil dan Buaya',
      author: 'Dian K.',
      illustrator: 'Arief Rachman',
      publisher: 'Erlangga for Kids',
      publicationYear: 2015,
      numberOfCopies: 3,
      subject: 'Cerita Rakyat',
      origin: 'Hibah Kemdikbud',
      categoryId: generateCategoryId('anak-anak'),
      locationRack: 'Rak C-01',
      callNumber: '398.2/DIA/s',
      status: 'TERSEDIA' as const,
    },
    {
      id: generateBookId(),
      title: 'Seri Mengenal Hewan: Kucing',
      author: 'Tim Penulis Erlangga',
      illustrator: 'Studio Komik',
      publisher: 'Erlangga for Kids',
      publicationYear: 2018,
      numberOfCopies: 2,
      subject: 'Pengetahuan Hewan',
      origin: 'Pembelian Dana Desa',
      categoryId: generateCategoryId('anak-anak'),
      locationRack: 'Rak C-01',
      callNumber: '636.8/TIM/s',
      status: 'TERSEDIA' as const,
    },

    // --- Sains & Teknologi ---
    {
      id: generateBookId(),
      title: 'Sapiens: Riwayat Singkat Umat Manusia',
      author: 'Yuval Noah Harari',
      publisher: 'Gramedia Pustaka Utama',
      publicationYear: 2017,
      numberOfCopies: 1,
      subject: 'Antropologi',
      origin: 'Sumbangan Warga',
      isbn: '9786020332932',
      synopsis:
        'Perjalanan Homo sapiens dari zaman prasejarah hingga revolusi ilmiah.',
      categoryId: generateCategoryId('sains-teknologi'),
      locationRack: 'Rak D-01',
      callNumber: '599.93/HAR/s',
      status: 'TERSEDIA' as const,
    },

    // --- Sejarah ---
    {
      id: generateBookId(),
      title: 'Sejarah Indonesia Modern',
      author: 'M.C. Ricklefs',
      publisher: 'Gadjah Mada University Press',
      publicationYear: 2008,
      numberOfCopies: 1,
      subject: 'Sejarah Indonesia',
      origin: 'Hibah Kemdikbud',
      isbn: '9789794204672',
      synopsis:
        'Survei komprehensif sejarah Indonesia dari abad ke-13 hingga era Reformasi.',
      categoryId: generateCategoryId('sejarah'),
      locationRack: 'Rak E-01',
      callNumber: '959.8/RIC/s',
      status: 'DIPINJAM' as const,
    },

    // --- Agama & Spiritualitas ---
    {
      id: generateBookId(),
      title: 'Tafsir Al-Misbah (Jilid 1)',
      author: 'M. Quraish Shihab',
      publisher: 'Lentera Hati',
      publicationYear: 2002,
      numberOfCopies: 1,
      subject: 'Tafsir Al-Quran',
      origin: 'Wakaf Warga',
      isbn: '9789799633718',
      categoryId: generateCategoryId('agama-spiritualitas'),
      locationRack: 'Rak F-01',
      callNumber: '297.122/SHI/t',
      status: 'TERSEDIA' as const,
    },

    // --- Pendidikan ---
    {
      id: generateBookId(),
      title: 'Matematika SMP Kelas 7',
      author: 'Tim Kemdikbud',
      publisher: 'Pusat Kurikulum dan Perbukuan',
      publicationYear: 2021,
      numberOfCopies: 5,
      subject: 'Matematika',
      origin: 'Hibah Kemdikbud',
      categoryId: generateCategoryId('pendidikan'),
      locationRack: 'Rak G-01',
      callNumber: '510/TIM/m',
      status: 'TERSEDIA' as const,
    },

    // --- Keterampilan & Hobi ---
    {
      id: generateBookId(),
      title: 'Resep Masakan Nusantara',
      author: 'Sisca Soewitomo',
      publisher: 'Gramedia Pustaka Utama',
      publicationYear: 2016,
      numberOfCopies: 1,
      subject: 'Masakan Indonesia',
      origin: 'Sumbangan Warga',
      categoryId: generateCategoryId('keterampilan-hobi'),
      locationRack: 'Rak H-01',
      callNumber: '641.5/SOE/r',
      status: 'TERSEDIA' as const,
    },

    // --- Komik & Manga ---
    {
      id: generateBookId(),
      title: 'Si Juki: Lika-Liku Anak Kos',
      author: 'Faza Meonk',
      illustrator: 'Faza Meonk',
      publisher: 'Bukune',
      publicationYear: 2014,
      numberOfCopies: 2,
      subject: 'Komik Humor',
      origin: 'Sumbangan Warga',
      categoryId: generateCategoryId('komik-manga'),
      locationRack: 'Rak I-01',
      callNumber: '741.5/MEO/s',
      status: 'TERSEDIA' as const,
    },

    // --- Ensiklopedia & Referensi ---
    {
      id: generateBookId(),
      inventoryNumber: 'INV-2024-001',
      title: 'Ensiklopedia Indonesia untuk Pelajar',
      author: 'Tim Penulis',
      publisher: 'PT Ichtiar Baru van Hoeve',
      publicationYear: 2010,
      numberOfCopies: 1,
      subject: 'Ensiklopedia Umum',
      origin: 'Hibah Kemdikbud',
      isbn: '9789794051234',
      synopsis:
        'Kumpulan pengetahuan umum yang disusun khusus untuk pelajar Indonesia.',
      categoryId: generateCategoryId('ensiklopedia-referensi'),
      locationRack: 'Rak J-01',
      callNumber: '030/TIM/e',
      status: 'TERSEDIA' as const,
    },
  ];
}

// ============================================================
// MAIN SEED FUNCTION
// ============================================================
async function seed() {
  console.log('🌱 Memulai seeding database TBM Picuruna...\n');

  // 1. Seed Kategori
  console.log('📂 Memasukkan data kategori...');
  const categoryData = CATEGORIES.map((cat) => ({
    id: generateCategoryId(cat.slug),
    name: cat.name,
    slug: cat.slug,
  }));

  await db
    .insert(categories)
    .values(categoryData)
    .onConflictDoNothing({ target: categories.id });

  console.log(`   ✅ ${categoryData.length} kategori berhasil dimasukkan.`);

  // 2. Seed Buku Dummy
  console.log('📚 Memasukkan data buku dummy...');
  const bookData = createDummyBooks();

  // Insert satu per satu untuk menghindari konflik ID
  for (const book of bookData) {
    await db.insert(books).values(book).onConflictDoNothing({ target: books.id });
  }

  console.log(`   ✅ ${bookData.length} buku berhasil dimasukkan.`);

  // 3. Verifikasi
  console.log('\n📊 Verifikasi data:');
  const [catCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(categories);
  const [bookCount] = await db
    .select({ count: sql<number>`count(*)` })
    .from(books);

  console.log(`   Kategori: ${catCount.count}`);
  console.log(`   Buku:     ${bookCount.count}`);

  console.log('\n✨ Seeding selesai!');
}

// ============================================================
// RUN
// ============================================================
seed()
  .catch((error) => {
    console.error('❌ Seeding gagal:', error);
    process.exit(1);
  })
  .finally(() => {
    client.close();
  });
