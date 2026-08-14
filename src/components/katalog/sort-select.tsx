'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ArrowUpDown, ChevronDown } from 'lucide-react';

export function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const current = searchParams.get('sort') ?? 'newest';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    const val = e.target.value;
    if (val && val !== 'newest') {
      params.set('sort', val);
    } else {
      params.delete('sort');
    }
    params.delete('page'); // Reset to page 1 on filter change
    
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative w-full sm:w-auto">
      <ArrowUpDown
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <select
        value={current}
        onChange={handleChange}
        className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-border bg-card pl-10 pr-10 text-sm transition-colors focus:border-primary focus:outline-none"
        aria-label="Urutkan berdasarkan"
      >
        <option value="newest">Terbaru</option>
        <option value="oldest">Terlama</option>
        <option value="title_asc">Judul (A-Z)</option>
        <option value="title_desc">Judul (Z-A)</option>
        <option value="author_asc">Penulis (A-Z)</option>
        <option value="author_desc">Penulis (Z-A)</option>
        <option value="year_desc">Tahun (Terbaru)</option>
        <option value="year_asc">Tahun (Terlama)</option>
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}
