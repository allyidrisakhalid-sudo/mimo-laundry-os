import Link from "next/link";
import { LanguageToggle } from "@/components/LanguageToggle";

const links = [
  {
    href: "/customer",
    label: "Customer Portal",
    note: "Track and inspect production customer orders",
  },
  { href: "/affiliate", label: "Affiliate Portal", note: "Affiliate order and commission surface" },
  { href: "/driver", label: "Driver Portal", note: "Driver task and stop surface" },
  { href: "/hub", label: "Hub Portal", note: "Hub operations and intake surface" },
  { href: "/admin", label: "Admin Portal", note: "Admin reporting and audit surface" },
  { href: "/components", label: "Component Gallery", note: "Existing component gallery" },
  { href: "/ui-demo", label: "UI Demo", note: "Existing UI demo page" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-neutral-400">Mimo Laundry OS</p>
            <h1 className="text-4xl font-semibold">Production Operations Home</h1>
            <p className="mt-3 text-neutral-300">
              This deployment now exposes role-specific production surfaces instead of a single
              walking skeleton shell.
            </p>
          </div>
          <LanguageToggle />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 hover:border-neutral-600"
            >
              <div className="text-xl font-medium">{link.label}</div>
              <div className="mt-2 text-sm text-neutral-300">{link.note}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
