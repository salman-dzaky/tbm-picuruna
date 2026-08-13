'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ListFilter, ChevronDown } from 'lucide-react';
import type { Category } from '@/src/db/schema';

type CategoryFilterProps = {
  categories: Pick<Category, 'id' | 'name'>[];
};

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const current = searchParams.get('kategori') ?? '';

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set('kategori', e.target.value);
    } else {
      params.delete('kategori');
    }
    params.delete('page'); // Reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <ListFilter
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
      <select
        value={current}
        onChange={handleChange}
        className="h-10 cursor-pointer appearance-none rounded-lg border border-border bg-card pl-10 pr-10 text-sm transition-colors focus:border-primary focus:outline-none"
        aria-label="Filter berdasarkan kategori"
      >
        <option value="">Semua Kategori</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  );
}
