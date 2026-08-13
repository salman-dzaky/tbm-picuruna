import { UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await auth.protect();

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Admin Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-primary">
              TBM Picuruna
            </span>
            <span className="rounded-md bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
              Admin
            </span>
          </div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-8 w-8',
              },
            }}
          />
        </div>
      </header>

      {/* Admin Content */}
      <main className="flex-1 bg-secondary">
        <div className="mx-auto max-w-screen-xl px-4 py-6 sm:px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
