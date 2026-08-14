'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

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
    <div className="flex-1 sm:max-w-[200px]">
      <select
        value={current}
        onChange={handleChange}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Urutkan Kategori"
      >
        <option value="name_asc">Nama (A-Z)</option>
        <option value="name_desc">Nama (Z-A)</option>
        <option value="newest">Ditambahkan (Terbaru)</option>
        <option value="oldest">Ditambahkan (Terlama)</option>
      </select>
    </div>
  );
}
