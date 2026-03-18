import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="border-b border-white/10 bg-[var(--color-midnight)] text-[var(--color-silk)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-base font-semibold tracking-wide">
          Mimo
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          <Link href="/track" className="text-sm text-[var(--color-cloud)] hover:text-[var(--color-silk)]">
            Track
          </Link>
          <Link href="/partners" className="text-sm text-[var(--color-cloud)] hover:text-[var(--color-silk)]">
            Partners
          </Link>
          <Link href="/help" className="text-sm text-[var(--color-cloud)] hover:text-[var(--color-silk)]">
            Help
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-full border border-white/10 px-3 py-2 text-sm text-[var(--color-cloud)]"
            aria-label="Switch language"
          >
            EN / SW
          </button>
          <Link href="/login" className="hidden text-sm text-[var(--color-cloud)] hover:text-[var(--color-silk)] sm:inline-flex">
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-[var(--color-silk)] px-4 py-2 text-sm font-medium text-[var(--color-midnight)]"
          >
            Start now
          </Link>
        </div>
      </div>
    </header>
  );
}
