import Link from "next/link";
import { PublicSupportCta } from "./PublicSupportCta";

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-[var(--color-midnight)] text-[var(--color-silk)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="space-y-3">
          <div className="text-base font-semibold">Mimo</div>
          <p className="max-w-sm text-sm text-[var(--color-cloud)]">
            Laundry pickup, care, and return with calm tracking and clear support.
          </p>
          <PublicSupportCta context="footer" />
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-cloud)]">
            Explore
          </div>
          <div className="grid gap-2 text-sm">
            <Link href="/">Home</Link>
            <Link href="/track">Track Order</Link>
            <Link href="/partners">Partners</Link>
            <Link href="/help">Help</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </div>
        </div>

        <div>
          <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-cloud)]">
            Legal
          </div>
          <div className="grid gap-2 text-sm">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/refund-policy">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
