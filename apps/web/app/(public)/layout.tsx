import { ReactNode } from "react";
import { PublicFooter } from "./components/PublicFooter";
import { PublicHeader } from "./components/PublicHeader";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-midnight)] text-[var(--color-silk)]">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
    </div>
  );
}
