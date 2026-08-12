# Technical Blueprint: Digitalisasi Taman Baca (TBM Picuruna)
*Versi 1.0 — Jalur Instan & Anti-Freeze*

---

## Bagian 1: Overview, Tech Stack & Arsitektur

### 1. Project Overview
Aplikasi Web TBM Picuruna dirancang untuk mentransformasi operasional Taman Baca lokal menjadi platform digital yang modern, responsif, dan mudah diakses oleh masyarakat umum. 
* **Prioritas Utama:** Performa tinggi (zero cold-start/anti-freeze), biaya $0/bulan (memaksimalkan *free tier*), praktis dikembangkan oleh *single developer*, dan aman secara bawaan (*secure-by-default*).
* **Fungsi Utama:** Memperkenalkan TBM ke publik, menampilkan katalog buku interaktif (pencarian, filter kategori, status ketersediaan), serta menyediakan Admin Dashboard untuk manajemen buku (CRUD + Upload Cover).

---

### 2. Recommended Tech Stack
| Komponen | Teknologi | Alasan Pemilihan & Keunggulan |
| :--- | :--- | :--- |
| **Framework** | **Next.js (App Router)** | Full-stack React framework dengan SSR/SSG untuk SEO katalog & landing page, Server Actions untuk API cepat tanpa boilerplate route handlers. |
| **Database** | **Turso (libSQL / SQLite)** | Database SQLite distributed/edge. Tanpa cold-start (anti-freeze), latensi super rendah, free tier 9GB storage & 500M read row/bulan. |
| **ORM** | **Drizzle ORM** | Lightweight, type-safe SQL ORM khusus SQLite. Sangat cepat, ukuran bundle kecil, dan definisi schema sederhana. |
| **Auth** | **Clerk Auth (`@clerk/nextjs`)** | Sistem autentikasi instan. Menyediakan komponen visual `<SignIn />`, `<UserButton />`, dan middleware keamanan tanpa perlu membuat tabel auth manual. |
| **Storage** | **Cloudinary (`next-cloudinary`)** | CDN gambar & transformasi instan. Widget upload bawaan, kompresi otomatis WebP/AVIF, free tier 25GB/bulan. |
| **Peta** | **Google Maps Embed (iframe)** | Instan, tanpa perlu setup API Key / billing kompleks, 100% responsif dan teruji di semua perangkat. |
| **Deployment** | **Vercel** | Integrasi bawaan dengan Next.js, CI/CD otomatis dari GitHub, TLS/SSL gratis. |

---

### 3. Arsitektur Sistem

```
+-----------------------------------------------------------------------+
|                            PENGGUNA UTAMA                             |
+-----------------------------------+-----------------------------------+
                                    |
          +-------------------------+-------------------------+
          |                                                   |
          v                                                   v
 [ MASYARAKAT UMUM ]                                 [ ADMIN / PENGELOLA ]
 (Akses Publik / Tanpa Auth)                         (Diwajibkan Login via Clerk)
          |                                                   |
          v                                                   v
   Public Pages                                        Protected Admin Pages
   - / (Landing Page)                                  - /admin (Dashboard CRUD)
   - /katalog (Katalog & Filter)                       - Protected by Next.js Middleware
          |                                                   |
          +-------------------------+-------------------------+
                                    |
                                    v
                         +--------------------+
                         |  Next.js Server    |
                         | (Server Actions &  |
                         | Server Components) |
                         +---------+----------+
                                   |
           +-----------------------+-----------------------+
           |                                               |
           v                                               v
    [ Drizzle ORM ]                               [ next-cloudinary ]
           |                                               |
           v                                               v
    [ Turso Database ]                             [ Cloudinary CDN ]
    (SQLite Edge DB)                               (Cover Buku Images)
```

---

### Decision Log (Pencatatan Keputusan Teknologik)
1. **Mengapa Turso + Drizzle, bukan Supabase Postgres?**
   * *Alasan:* Supabase PostgreSQL pada tier gratis akan mengalami *pause/freeze* (sleep mode) jika tidak ada *traffic* dalam 7 hari. Turso berbasis SQLite edge yang tidak pernah mengalami *freeze* (anti-freeze) dan responsif seketika.
2. **Mengapa Clerk Auth, bukan Custom JWT / NextAuth?**
   * *Alasan:* Clerk menyediakan UI siap pakai (`<SignIn />`) yang menangani session management, password hashing, 2FA, dan CSRF secara otomatis. Menghemat waktu pengerjaan 80%.
3. **Mengapa Google Maps Embed, bukan Leaflet/MapLibre?**
   * *Alasan:* Sangat instan, zero API key configuration, tanpa billing setup, dan ramah untuk pemeliharaan jangka panjang.

---

## Bagian 2: User Flow, Admin Flow & Page Structure

### 4. User Flow (Masyarakat Umum)
```
[ Halaman Utama / ] ──> Lihat Banner, Profil TBM & Google Maps
       │
       └──> Klik CTA "Jelajahi Katalog Buku"
                 │
                 v
       [ /katalog ] ──> Kategori Dropdown / Search Input
                 │
                 ├──> Ketik Judul / Penulis / Nomor Inventaris (Debounced 300ms)
                 ├──> Pilih Kategori (e.g., "Anak", "Novel", "Sains")
                 └──> Lihat Grid Buku (Cover/Placeholder, Judul, Penulis, Status)
                           │
                           └──> Klik Kartu Buku ──> Modal Detail Lengkap Buku
```

---

### 5. Admin Flow (Pengelola TBM)
```
[ /admin ] ──> Dihadang Next.js Middleware
     │
     ├── Jika belum login ──> Redirect ke [ /sign-in ] (Clerk `<SignIn />`)
     │                                │
     │                                └── Login Sukses ──> Redirect back ke /admin
     │
     └── Jika terautentikasi ──> [ Dashboard Admin ]
                                      │
                                      ├── Tab Tabel Buku: Lihat Daftar, Search, Filter
                                      ├── Tombol "Tambah Buku" ──> Form Modal / Page
                                      │     ├── Isi metadata (Judul, Penulis, No. Inventaris, Rak, dll)
                                      │     ├── Upload Cover via `CldUploadWidget` (Opsional)
                                      │     └── Save ──> Server Action revalidatePath('/katalog')
                                      ├── Tombol "Edit Buku" ──> Form Edit + Update Status
                                      └── Tombol "Hapus Buku" ──> Konfirmasi Modal ──> Delete Action
```

---

### 6. Next.js App Router Page Structure
```
app/
├── (public)/
│   ├── page.tsx                  # Landing Page TBM Picuruna (Hero, Profil, Map, CTA)
│   └── katalog/
│       └── page.tsx              # Katalog Publik (Search, Filter, Book Grid, Pagination)
├── (admin)/
│   └── admin/
│       ├── page.tsx              # Dashboard Admin (Tabel CRUD Buku, Stats Ringkas)
│       └── layout.tsx            # Admin Header/Sidebar dengan <UserButton /> Clerk
├── sign-in/
│   └── [[...sign-in]]/
│       └── page.tsx              # Clerk Auth Page (<SignIn routing="path" path="/sign-in" />)
├── api/                          # (Opsional) API Route Handlers jika diperlukan
├── middleware.ts                 # Clerk Middleware protection & Route Matching
└── db/
    ├── index.ts                  # Inisialisasi Turso Client & Drizzle Client
    └── schema.ts                 # Definisi Schema Drizzle (Books, Categories)
```

---

## Bagian 3: Model Data, Auth, Keamanan & Storage

### 7. Database Schema (Drizzle ORM + Turso SQLite)

```typescript
// db/schema.ts
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Tabel Kategori Buku
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(), // e.g. cat_anak, cat_novel
  name: text('name').notNull().unique(), // e.g. "Anak-Anak", "Novel"
  slug: text('slug').notNull().unique(), // e.g. "anak-anak", "novel"
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`),
});

// Tabel Buku (Terstruktur Sesuai Kebutuhan TBM Picuruna)
export const books = sqliteTable('books', {
  id: text('id').primaryKey(), // Primary Key e.g. b_xyz123 (NOT NULL)
  inventoryNumber: text('inventory_number'), // Nomor Inventaris internal (NULLable)
  title: text('title').notNull(), // Judul Buku (NOT NULL)
  author: text('author'), // Penulis (NULLable)
  illustrator: text('illustrator'), // Ilustrator (NULLable)
  publisher: text('publisher'), // Penerbit (NULLable)
  publicationYear: integer('publication_year'), // Tahun Terbit (NULLable)
  numberOfCopies: integer('number_of_copies').default(1).notNull(), // Jumlah Eksemplar (NOT NULL, default 1)
  subject: text('subject'), // Subjek / Topik (NULLable)
  origin: text('origin'), // Asal Buku (misal: Hibah Kemdikbud, Sumbangan Warga) (NULLable)
  isbn: text('isbn'), // ISBN (NULLable)
  synopsis: text('synopsis'), // Ringkasan / Sinopsis (NULLable)
  categoryId: text('category_id').notNull().references(() => categories.id, { onDelete: 'cascade' }), // Relasi Kategori (NOT NULL)
  locationRack: text('location_rack'), // Lokasi Rak (misal: Rak A-01) (NULLable)
  callNumber: text('call_number'), // Nomor Panggil Perpustakaan (misal: 813/AN/s) (NULLable)
  status: text('status', { enum: ['TERSEDIA', 'DIPINJAM'] }).default('TERSEDIA').notNull(), // Status Ketersediaan (NOT NULL)
  coverUrl: text('cover_url'), // URL Gambar Cloudinary (NULLable)
  coverPublicId: text('cover_public_id'), // ID Aset Cloudinary (NULLable)
  createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(CURRENT_TIMESTAMP)`).notNull(),
}, (table) => ({
  categoryIdx: index('idx_books_category').on(table.categoryId),
  statusIdx: index('idx_books_status').on(table.status),
  searchIdx: index('idx_books_title_author').on(table.title, table.author),
  inventoryIdx: index('idx_books_inventory_number').on(table.inventoryNumber),
}));
```

> **Catatan Format Tanggal (`created_at`):**  
> Di database, `created_at` disimpan sebagai timestamp standar. Pada tampilan antarmuka (frontend), tanggal diformat secara otomatis menjadi Bahasa Indonesia (contoh: `"Rabu, 12 Agustus 2026"`) menggunakan standar JavaScript `Intl.DateTimeFormat('id-ID', ...)` agar efisiensi pencarian & pengurutan database tetap optimal.

---

### 8. Authentication & Authorization Strategy
* **Authentication:** Menggunakan `@clerk/nextjs`. Pendaftaran Admin bersifat tertutup (hanya melalui *Clerk Dashboard Invitation*).
* **Route Protection via Middleware:**
  ```typescript
  // middleware.ts
  import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

  const isAdminRoute = createRouteMatcher(['/admin(.*)']);

  export default clerkMiddleware(async (auth, req) => {
    if (isAdminRoute(req)) await auth.protect();
  });
  ```
* **Server Action Guard:** Setiap aksi mutasi (Create, Update, Delete) wajib memverifikasi token admin:
  ```typescript
  const { userId } = await auth();
  if (!userId) throw new Error('Akses ditolak: Anda bukan admin.');
  ```

---

### 9. Practical Security Considerations
1. **Validasi Input:** Menggunakan library `zod` pada Server Actions untuk memastikan tipe data, batas karakter, dan format URL sebelum diproses ke database.
2. **Proteksi SQL Injection:** Drizzle ORM secara bawaan menggunakan *prepared statements* & parameterized queries.
3. **Restriksi Upload Gambar:** Unsigned upload preset Cloudinary dibatasi hanya menerima format `.jpg`, `.png`, `.webp` dengan ukuran maksimum 5MB.
4. **Keamanan Environment Variables:** Seluruh *secret keys* (`TURSO_AUTH_TOKEN`, `CLERK_SECRET_KEY`) disimpan di `.env.local` server-side dan tidak pernah diekspos ke client bundle.

---

### 10. Image Storage Strategy (Cloudinary)
1. **Upload Process:** Admin mengunggah cover melalui `<CldUploadWidget>` dari `next-cloudinary`.
2. **Fallback Gambar (Jika Cover NULL):** Jika `cover_url` bernilai NULL, UI publik & admin akan otomatis menampilkan *fallback cover SVG* yang elegan dengan warna aksen kategori dan judul buku.
3. **Rendering & Optimization:** Gambar ditampilkan menggunakan komponen `<CldImage>` atau Next.js `<Image>` yang secara otomatis mengompres format menjadi WebP/AVIF dan mengatur ukuran sesuai *viewport* perangkat.

---

## Bagian 4: Fitur, UX/UI, MVP & Roadmap

### 11. Search & Filtering Strategy
* **URL Search Params Sync:** Parameter pencarian & filter disinkronkan ke URL (`/katalog?q=laskar&cat=cat_novel&page=1`) menggunakan Next.js `useSearchParams`.
* **Debounced Search Input:** Input pencarian menggunakan *debounce* 300ms untuk mencegah query berlebihan ke database.
* **Server-Side Filtering & Pagination:** Database query mengeksekusi `like(title, %q%)`, `like(author, %q%)`, `like(inventoryNumber, %q%)`, dan `eq(categoryId, cat)` dengan limit 12 item per halaman.

---

### 12. Rekomendasi UX/UI
* **Prinsip Desain:** Clean, minimalis, hangat, dan ramah masyarakat umum.
* **Palette Warna:** Aksesibilitas tinggi dengan warna aksen *Emerald/Forest Green* (mencerminkan lingkungan & literasi), latar belakang *Warm Off-White/Light Gray*, dan teks *Dark Charcoal*.
* **Responsivitas Grid:**
  * Mobile (< 640px): 1-2 kolom grid buku, bottom sheet / drawer untuk filter.
  * Tablet (640px - 1024px): 3 kolom grid buku.
  * Desktop (> 1024px): 4 kolom grid buku dengan sidebar filter.
* **Elemen Interaktif:** Hover zoom halus pada kartu buku, badge status ketersediaan (`TERSEDIA` = Hijau, `DIPINJAM` = Kuning/Amber), dan modal detail buku.

---

### 13. Map Integration Recommendation (Google Maps)
* **Teknologi:** Google Maps Embed API (iframe).
* **Keunggulan:** Zero setup cost, tanpa perlu memasukkan kartu kredit untuk API key, responsif 100%, dan performa pemuatan ringan.

---

### 14. Kesiapan Fitur Masa Depan (*Future Feature Readiness*)
Arsitektur dirancang agar fitur peminjaman buku dapat ditambahkan tanpa merusak data yang ada:
1. **Status Buku:** Enum `status` (`TERSEDIA` | `DIPINJAM`) & `number_of_copies` sudah tersedia di tabel `books`.
2. **Ekstensi Tabel Masa Depan (`borrowings`):**
   Untuk tahap berikutnya, cukup menambahkan tabel baru:
   `borrowings` (`id`, `book_id`, `borrower_name`, `borrower_contact`, `borrow_date`, `due_date`, `return_date`, `status`).

---

### 15. MVP Scope vs Out-of-Scope

#### In-Scope MVP:
* Landing Page TBM Picuruna (Profil, Tujuan, Foto, Peta Google Maps Embed, CTA).
* Katalog Buku Publik (Grid Buku, Search Debounced, Filter Kategori, Sorting, Pagination, Detail Modal).
* Admin Dashboard (Login via Clerk Auth, CRUD Buku lengkap, Upload Cover via Cloudinary, Manajemen Status Ketersediaan).
* Design System Responsif Mobile & Desktop.

#### Out-of-Scope (Fase Selanjutnya):
* Sistem peminjaman mandiri oleh anggota/masyarakat umum online.
* Sistem denda dan riwayat pengembalian buku.
* Reader E-Book / PDF internal.

---

### 16. Recommended Development Roadmap

```
[ FASE 1: Project Setup ] ──> Next.js App Router, Tailwind/CSS, Drizzle ORM, Turso DB, Clerk, Cloudinary
          │
          v
[ FASE 2: Database & Seed Data ] ──> Migration schema, Seed kategori dasar & data dummy buku
          │
          v
[ FASE 3: Landing Page & Katalog Publik ] ──> Hero section, Google Maps iframe, Grid Katalog & Search Params
          │
          v
[ FASE 4: Protected Admin Dashboard ] ──> Clerk Auth Middleware, Form CRUD Buku, Cloudinary Widget Upload
          │
          v
[ FASE 5: QA & Deployment ] ──> Testing responsif, audit performa, & Deploy ke Vercel
```
