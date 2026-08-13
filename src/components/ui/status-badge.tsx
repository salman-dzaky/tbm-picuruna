import { cn } from '@/src/lib/utils';

type StatusBadgeProps = {
  status: 'TERSEDIA' | 'DIPINJAM';
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        status === 'TERSEDIA'
          ? 'bg-green-50 text-status-available ring-1 ring-green-600/20 ring-inset'
          : 'bg-amber-50 text-status-borrowed ring-1 ring-amber-600/20 ring-inset',
        className
      )}
    >
      {status === 'TERSEDIA' ? 'Tersedia' : 'Dipinjam'}
    </span>
  );
}
