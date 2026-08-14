import Link from 'next/link';
import { BookOpen, MapPin, Clock, Users, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'TBM Picuruna — Taman Baca Masyarakat',
  description:
    'Taman Baca Masyarakat Picuruna — Jelajahi koleksi buku kami dan temukan inspirasi membaca untuk semua kalangan.',
};

export default function HomePage() {
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-green-800 to-green-900">
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />

        <div className="relative mx-auto max-w-screen-xl px-4 py-20 sm:px-6 sm:py-28 lg:py-36">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-green-100 backdrop-blur-sm">
              <BookOpen className="h-4 w-4" />
              <span>Taman Baca Masyarakat</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              TBM{' '}
              <span className="text-green-200">Picuruna</span>
            </h1>

            <p className="mt-5 text-base leading-relaxed text-green-100/90 sm:text-lg">
              Menyediakan akses buku gratis untuk seluruh masyarakat.
              Jelajahi koleksi kami dan temukan inspirasi membaca
              untuk semua kalangan.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/katalog"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-6 text-sm font-semibold text-primary shadow-sm transition-all duration-200 hover:bg-green-50 hover:shadow-md"
              >
                Jelajahi Katalog
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#tentang"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/25 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Tentang Kami
              </a>
            </div>
          </div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 56"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 56h1440V28C1240 4 960 0 720 0S200 4 0 28v28z"
              fill="var(--color-background)"
            />
          </svg>
        </div>
      </section>

      {/* ===== STATS / QUICK INFO ===== */}
      <section className="relative z-10 -mt-1">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: BookOpen,
                label: 'Koleksi Buku',
                value: '1000+',
                desc: 'Beragam genre & kategori',
              },
              {
                icon: Users,
                label: 'Pembaca Aktif',
                value: '200+',
                desc: 'Dari berbagai kalangan',
              },
              {
                icon: Clock,
                label: 'Jam Buka',
                value: '08.00 – 17.00',
                desc: 'Senin – Sabtu',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3.5 rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                  <item.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-lg font-bold text-card-foreground leading-tight">
                    {item.value}
                  </p>
                  <p className="text-sm font-medium text-card-foreground">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TENTANG KAMI ===== */}
      <section id="tentang" className="scroll-mt-20 py-16 sm:py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Tentang TBM Picuruna
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Taman Baca Masyarakat (TBM) Picuruna adalah ruang baca komunitas
              yang didirikan untuk meningkatkan minat baca dan literasi
              masyarakat lokal. Kami menyediakan koleksi buku yang beragam —
              dari buku anak-anak, fiksi, non-fiksi, hingga ensiklopedia —
              semuanya dapat dibaca dan dipinjam secara gratis.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Akses Gratis',
                desc: 'Semua koleksi buku dapat dibaca dan dipinjam tanpa biaya, terbuka untuk seluruh masyarakat.',
              },
              {
                title: 'Beragam Koleksi',
                desc: 'Mulai dari buku anak-anak, novel, buku pelajaran, hingga referensi dan ensiklopedia.',
              },
              {
                title: 'Ruang Belajar',
                desc: 'Tersedia ruang yang nyaman untuk membaca, belajar, dan berdiskusi bersama.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <h3 className="font-semibold text-card-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALERI KEGIATAN ===== */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Galeri Kegiatan
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Momen-momen inspiratif, ruang baca, dan kegiatan literasi bersama masyarakat di TBM Picuruna.
            </p>
          </div>
          
          {/* Aesthetic Bento Grid - Responsive */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:grid-rows-[250px_250px] sm:gap-4">
            {/* Foto Utama (Large) - 1:1 / 4:3 */}
            <div className="group relative col-span-2 row-span-2 overflow-hidden rounded-2xl bg-secondary shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1200&auto=format&fit=crop" 
                alt="Ruang baca utama TBM" 
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
            
            {/* Foto Kecil 1 (Top Right 1) */}
            <div className="group relative col-span-2 sm:col-span-1 overflow-hidden rounded-2xl bg-secondary shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop" 
                alt="Koleksi buku bacaan" 
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            {/* Foto Kecil 2 (Top Right 2) */}
            <div className="group relative col-span-2 sm:col-span-1 overflow-hidden rounded-2xl bg-secondary shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600&auto=format&fit=crop" 
                alt="Kegiatan literasi" 
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            {/* Foto Medium (Bottom Right) - 16:9 / Landscape */}
            <div className="group relative col-span-2 sm:col-span-2 overflow-hidden rounded-2xl bg-secondary shadow-sm">
              <img 
                src="https://images.unsplash.com/photo-1577416412292-747c6607f055?q=80&w=1000&auto=format&fit=crop" 
                alt="Fasilitas dan lingkungan TBM" 
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-xs text-muted-foreground italic">
              *Gambar saat ini menggunakan placeholder. Anda dapat menggantinya dengan foto asli dari Cloudinary atau /public nanti.
            </p>
          </div>
        </div>
      </section>

      {/* ===== LOKASI & GOOGLE MAPS ===== */}
      <section className="bg-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Lokasi Kami
            </h2>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              Kelurahan Pattallassang, Kecamatan Pattallassang, Kabupaten Takalar, Sulawesi Selatan
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-xl border border-border shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248.24051254772186!2d119.4312343817892!3d-5.440009942544405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dbed76a423d5f61%3A0x5a057f3218b0627a!2sRumah%20daengsiang!5e0!3m2!1sid!2sid!4v1786575816748!5m2!1sid!2sid"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi TBM Picuruna di Google Maps"
              className="w-full"
            />
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            * Koordinat peta bersifat ilustratif. Silakan hubungi kami untuk
            petunjuk arah yang lebih detail.
          </p>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6">
          <div className="mx-auto max-w-lg rounded-2xl border border-border bg-card p-8 text-center shadow-sm sm:p-10">
            <BookOpen className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-xl font-bold text-card-foreground sm:text-2xl">
              Mulai Jelajahi Koleksi Kami
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Temukan buku yang sesuai dengan minat dan kebutuhan Anda.
            </p>
            <Link
              href="/katalog"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-200 hover:bg-green-700 hover:shadow-md"
            >
              Lihat Katalog Buku
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
