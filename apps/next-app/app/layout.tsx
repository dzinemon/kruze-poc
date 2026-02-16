import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kruze POC — Next.js",
  description: "Proof of concept: Next.js + Sanity CMS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans text-body bg-white min-h-screen flex flex-col">
        <header className="border-b border-gray-200">
          <nav className="max-w-container-lg mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-black text-primary">
              Kruze POC
            </Link>
            <div className="flex gap-6">
              <Link
                href="/blog"
                className="text-body hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/landing"
                className="text-body hover:text-primary transition-colors"
              >
                Pages
              </Link>
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-gray-200 mt-auto">
          <div className="max-w-container-lg mx-auto px-4 py-6 text-center text-sm text-muted">
            Kruze POC — Next.js 15 + Sanity CMS
          </div>
        </footer>
      </body>
    </html>
  );
}
