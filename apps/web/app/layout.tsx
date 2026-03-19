import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../src/app/globals.css";
import { PublicFooter } from "./(public)/components/PublicFooter";
import { PublicHeader } from "./(public)/components/PublicHeader";

export const metadata: Metadata = {
  metadataBase: new URL("https://mimolaundry.org"),
  title: {
    default: "Mimo Laundry",
    template: "%s | Mimo Laundry",
  },
  description: "Laundry pickup, care, tracking, and return with a calm, premium experience.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[var(--color-midnight)] text-[var(--color-silk)]">
          <PublicHeader />
          <main>{children}</main>
          <PublicFooter />
        </div>
      </body>
    </html>
  );
}
