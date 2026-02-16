import { createClient } from "@sanity/client";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import matter from "gray-matter";

const JEKYLL_ROOT = join(import.meta.dirname, "../../kruzeconsulting.com");

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

interface FrontMatter {
  _uid: string;
  name: string;
  title: string;
  permalink: string;
}

function readMarkdownFiles(dir: string): FrontMatter[] {
  const fullPath = join(JEKYLL_ROOT, dir);
  const files = readdirSync(fullPath).filter((f) => f.endsWith(".md"));

  return files.map((file) => {
    const content = readFileSync(join(fullPath, file), "utf-8");
    const { data } = matter(content);
    return data as FrontMatter;
  });
}

function slugFromPermalink(permalink: string): string {
  // "/category/startup-accounting/" → "startup-accounting"
  return permalink.replace(/^\/(?:category|tag)\//, "").replace(/\/$/, "");
}

async function migrate() {
  console.log("Reading categories from _topic_categories/...");
  const categories = readMarkdownFiles("_topic_categories");
  console.log(`Found ${categories.length} categories\n`);

  console.log("Reading tags from _topic_tags/...");
  const tags = readMarkdownFiles("_topic_tags");
  console.log(`Found ${tags.length} tags\n`);

  // Build a single transaction for all documents
  const tx = client.transaction();

  for (const cat of categories) {
    const slug = slugFromPermalink(cat.permalink);
    const doc = {
      _id: cat._uid, // Preserve Jekyll UUID as Sanity document ID
      _type: "category" as const,
      title: cat.name,
      slug: { _type: "slug" as const, current: slug },
    };
    tx.createOrReplace(doc);
    console.log(`  + category: ${cat.name} (${slug})`);
  }

  console.log("");

  for (const tag of tags) {
    const slug = slugFromPermalink(tag.permalink);
    const doc = {
      _id: tag._uid,
      _type: "tag" as const,
      title: tag.name,
      slug: { _type: "slug" as const, current: slug },
    };
    tx.createOrReplace(doc);
    console.log(`  + tag: ${tag.name} (${slug})`);
  }

  console.log(`\nCommitting ${categories.length} categories + ${tags.length} tags...`);

  const result = await tx.commit();
  console.log(`Done! Transaction ID: ${result.transactionId}`);
  console.log(`Documents created/updated: ${result.documentIds.length}`);
}

migrate().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
