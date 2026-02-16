import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityClient } from "@/lib/sanity";
import { blockPageQuery } from "@kruze-poc/groq-queries";
import type { BlockPage } from "@kruze-poc/sanity-schemas/src/types";
import { SectionRenderer } from "@/components/section-renderer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pages = await sanityClient.fetch<{ slug: { current: string } }[]>(
    `*[_type == "blockPage"]{ slug }`
  );
  return pages.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await sanityClient.fetch<BlockPage>(blockPageQuery, { slug });
  if (!page) return { title: "Not Found" };
  return {
    title: `${page.title} — Kruze POC`,
    description: page.description,
  };
}

export default async function LandingPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await sanityClient.fetch<BlockPage>(blockPageQuery, { slug });
  if (!page) notFound();

  return (
    <div>
      {page.sections?.map((section) => (
        <SectionRenderer key={section._key} section={section} />
      ))}
    </div>
  );
}
