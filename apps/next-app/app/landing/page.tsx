import type { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/lib/sanity";
import { blockPagesListQuery } from "@kruze-poc/groq-queries";
import type { BlockPage } from "@kruze-poc/sanity-schemas/src/types";

export const metadata: Metadata = {
  title: "Pages — Kruze POC",
};

export default async function LandingListingPage() {
  const { data: pages } = await sanityFetch({
    query: blockPagesListQuery,
  }) as { data: BlockPage[] };

  return (
    <div className="max-w-container-lg mx-auto px-4 py-16">
      <h1 className="text-4xl font-black text-body mb-8">Pages</h1>

      {pages.length === 0 ? (
        <p className="text-secondary">
          No block pages yet. Create one in Sanity Studio.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {pages.map((page) => (
            <Link
              key={page._id}
              href={`/landing/${page.slug.current}`}
              className="block p-6 border border-gray-200 rounded-lg hover:border-primary transition-colors"
            >
              <h2 className="text-lg font-bold text-primary mb-2">
                {page.title}
              </h2>
              {page.description && (
                <p className="text-sm text-secondary">{page.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
