# TBM Picuruna - Taman Baca Masyarakat

![TBM Picuruna](https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop)

Sebuah platform aplikasi web sederhana yang dibangun dalam waktu **4 hari** sebagai upaya digitalisasi dan modernisasi akses sumber literasi untuk masyarakat lokal melalui **Taman Baca Masyarakat (TBM) Picuruna**. Platform ini bertujuan untuk memudahkan masyarakat menjelajahi koleksi buku yang tersedia dan memudahkan pengelola (admin) dalam manajemen inventaris perpustakaan.

## 🚀 Fitur Utama

### Untuk Masyarakat (Publik)
- **Katalog Terbuka**: Akses mudah ke ratusan koleksi buku TBM Picuruna.
- **Pencarian Cerdas & Filter**: Kemampuan mencari buku berdasarkan judul, penulis, serta memfilter berdasarkan kategori dan urutan.
- **Informasi Status Real-time**: Mengetahui apakah sebuah buku sedang "Tersedia" di rak atau sedang "Dipinjam".
- **Aksesibilitas Perangkat**: Desain antarmuka yang 100% responsif, rapi diakses melalui *smartphone*, *tablet*, maupun *desktop*.

### Untuk Pengelola (Admin)
- **Dashboard Analitik**: Tinjauan cepat metrik buku (total buku, tersedia, dipinjam).
- **Manajemen Buku (CRUD)**: Tambah, edit, hapus, dan kelola inventaris buku lengkap dengan unggah sampul buku.
- **Manajemen Kategori**: Buat dan atur kategori buku secara dinamis.
- **Keamanan (Authentication)**: Sistem masuk (login) yang diamankan menggunakan otentikasi biometrik/password-less.

## 💻 Tech Stack

Proyek ini dibangun di atas pondasi teknologi web modern, mengedepankan prinsip arsitektur yang solid, *secure-by-default*, dan performa tinggi:

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server Components, Server Actions)
- **Database**: [Turso](https://turso.tech/) (Edge SQLite) + [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Media Storage**: [Cloudinary](https://cloudinary.com/) (terintegrasi dengan Next-Cloudinary)
- **Styling**: Vanilla [Tailwind CSS](https://tailwindcss.com/)
- **Testing**: [Vitest](https://vitest.dev/) + React Testing Library

## 🛠️ Panduan Pengembangan Lokal (*Local Setup*)

### Prasyarat
- Node.js (versi 18.17 atau lebih baru)
- Akun Turso, Clerk, dan Cloudinary

### Langkah Instalasi

1. **Clone repository ini**
   ```bash
   git clone https://github.com/salman-dzaky/tbm-picuruna.git
   cd tbm-picuruna
   ```

2. **Instal dependensi**
   ```bash
   npm install
   ```

3. **Atur Environment Variables**
   Buat file `.env` di direktori *root* dan isi dengan parameter rahasia dari layanan eksternal yang digunakan:
   ```env
    # --- Clerk Auth ---
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
    CLERK_SECRET_KEY=sk_test_...
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

    NEXT_PUBLIC_CLERK_TELEMETRY_DISABLED=1

    # --- Turso Database ---
    TURSO_DATABASE_URL=libsql://your-db-name.turso.io
    TURSO_AUTH_TOKEN=your_turso_auth_token

    # --- Cloudinary ---
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=tbm_covers_unsigned
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Migrasi Database**
   Push skema database ke Turso (hanya pada tahap development):
   ```bash
   npx drizzle-kit push
   ```

5. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses di `http://localhost:3000`.

## 🧪 Testing

Proyek ini dilengkapi dengan *unit*, *component*, dan *integration test* terotomatisasi.

```bash
npm test
```

## 📝 Lisensi

Dibangun secara *open-source* untuk tujuan sosial dan pendidikan. 
Hak cipta © 2026 TBM Picuruna.
