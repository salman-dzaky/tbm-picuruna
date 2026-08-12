import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';

export default function PublicPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-primary">
              TBM Picuruna
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="rounded-md bg-secondary px-3.5 py-1.5 text-sm font-medium text-secondary-foreground hover:bg-secondary/80">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="rounded-md bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Sign Up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          TBM Picuruna
        </h1>
        <p className="max-w-lg text-lg text-muted-foreground">
          Taman Baca Masyarakat — Selamat datang! Situs sedang dalam tahap
          pengembangan.
        </p>
      </main>
    </div>
  );
}
