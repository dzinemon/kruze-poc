import type { Metadata } from "next";
import { Lato } from "next/font/google";
import Link from "next/link";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { SanityLive } from "@/lib/sanity";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kruze POC — Next.js",
  description: "Proof of concept: Next.js + Sanity CMS",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" className={lato.variable} suppressHydrationWarning>
      <head>
        {/* Inline theme init — runs before first paint to prevent FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.classList.toggle('dark',t==='dark');})();`,
          }}
        />
        <link rel="icon" href="/img/favicon.ico" type="image/x-icon" />
        <link rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png" />
      </head>
      <body className="font-sans bg-bg-base text-primary min-h-screen flex flex-col">
        <header className="border-b border-border-subtle">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-black text-primary">
              Kruze POC
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/blog"
                className="text-secondary hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/landing"
                className="text-secondary hover:text-primary transition-colors"
              >
                Pages
              </Link>
              <ThemeToggle />
            </div>
          </nav>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border-subtle mt-auto">
          <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-secondary">
            Kruze POC — Next.js 15 + Sanity CMS
          </div>
        </footer>

        {isDraftMode && <SanityLive />}
        {isDraftMode && <VisualEditing />}
      </body>
    </html>
  );
}
