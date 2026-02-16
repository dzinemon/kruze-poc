import Link from "next/link";

export default function HomePage() {
  return (
    <div className="max-w-container-lg mx-auto px-4 py-16">
      <h1 className="text-4xl font-black text-body mb-4">Kruze POC</h1>
      <p className="text-lg text-secondary mb-8">
        Next.js 15 + Sanity CMS proof of concept. Evaluating the editor
        experience for content-driven pages.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 max-w-md">
        <Link
          href="/blog"
          className="block p-6 border border-gray-200 rounded-lg hover:border-primary transition-colors"
        >
          <h2 className="text-xl font-bold text-primary mb-2">Blog</h2>
          <p className="text-sm text-secondary">
            Blog posts with Portable Text, charts, and custom blocks.
          </p>
        </Link>

        <Link
          href="/landing"
          className="block p-6 border border-gray-200 rounded-lg hover:border-primary transition-colors"
        >
          <h2 className="text-xl font-bold text-primary mb-2">Pages</h2>
          <p className="text-sm text-secondary">
            Block pages with section-based page builder.
          </p>
        </Link>
      </div>
    </div>
  );
}
