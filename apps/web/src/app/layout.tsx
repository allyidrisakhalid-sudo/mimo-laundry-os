import "@mimo/ui/styles.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Laundry OS",
  description: "Laundry OS web app",
};

export default function RootLayout({
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
