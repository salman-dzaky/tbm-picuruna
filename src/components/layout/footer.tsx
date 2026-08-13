export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-screen-xl flex-col items-center gap-2 px-4 py-6 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <p className="text-xs text-muted-foreground">
          © {currentYear} Taman Baca Masyarakat Picuruna. Hak cipta dilindungi.
        </p>
        <p className="text-xs text-muted-foreground">
          Dibangun dengan ❤ untuk literasi Indonesia.
        </p>
      </div>
    </footer>
  );
}
