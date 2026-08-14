'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

import { ArrowUpDown, ChevronDown } from 'lucide-react';

export function CategorySortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const current = searchParams.get('sort') ?? 'name_asc';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.delete('page'); // Reset to page 1 on sort change
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
        aria-label="Urutkan Kategori"
      >
        <option value="name_asc">Nama (A-Z)</option>
        <option value="name_desc">Nama (Z-A)</option>
        <option value="newest">Ditambahkan (Terbaru)</option>
        <option value="oldest">Ditambahkan (Terlama)</option>
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}
