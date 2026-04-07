import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { SanityLive } from "@/lib/sanity";
import { DraftModeBanner } from "@/components/draft-mode-banner";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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
      <body className="font-sans bg-base text-primary min-h-screen flex flex-col">
        <SiteHeader />

        <main className="flex-1">{children}</main>

        <SiteFooter />

        {isDraftMode && <SanityLive />}
        {isDraftMode && <VisualEditing />}
        <DraftModeBanner
          isDraftMode={isDraftMode}
          isVercelPreview={process.env.VERCEL_ENV === "preview"}
        />
      </body>
    </html>
  );
}
