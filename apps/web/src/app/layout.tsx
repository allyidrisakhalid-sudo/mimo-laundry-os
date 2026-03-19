import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mimolaundry.org"),
  title: {
    default: "Mimo Laundry",
    template: "%s | Mimo Laundry",
  },
  description: "Laundry pickup, care, tracking, and return with a calm, premium experience.",
};

export default function LegacySrcRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
