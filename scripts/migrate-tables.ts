/**
 * Migration script: richTableBlock → advancedTableBlock
 *
 * Run: npx tsx scripts/migrate-tables.ts
 *
 * Requires env vars: SANITY_PROJECT_ID, SANITY_DATASET, SANITY_WRITE_TOKEN
 */
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: "2024-01-01",
  useCdn: false,
});

function genKey(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 16; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

function migrateCell(cell: any) {
  return {
    _type: "advancedTableCell",
    _key: cell._key || genKey(),
    content: cell.content || [],
    colspan: 1,
    rowspan: 1,
  };
}

function migrateRow(row: any) {
  return {
    _type: "advancedTableRow",
    _key: row._key || genKey(),
    cells: (row.cells || []).map(migrateCell),
  };
}

function migrateTable(block: any) {
  const rows = (block.rows || []).map(migrateRow);
  const columnCount = Math.max(
    ...rows.map((r: any) => (r.cells || []).length),
    1
  );

  return {
    _type: "advancedTableBlock",
    _key: block._key || genKey(),
    hasHeaderRow: block.hasColumnTitles ?? true,
    columnCount,
    rows,
  };
}

function migrateBlocks(blocks: any[]): { blocks: any[]; changed: boolean } {
  let changed = false;
  const newBlocks = blocks.map((block) => {
    if (block._type === "richTableBlock") {
      changed = true;
      return migrateTable(block);
    }
    return block;
  });
  return { blocks: newBlocks, changed };
}

async function main() {
  console.log("Querying documents with richTableBlock...");

  // Find all documents that contain richTableBlock in any array field
  const query = `*[
    body[]._type == "richTableBlock" ||
    sections[].content[]._type == "richTableBlock"
  ]{ _id, _type, body, sections }`;

  const docs = await client.fetch(query);
  console.log(`Found ${docs.length} document(s) with richTableBlock.`);

  if (docs.length === 0) {
    console.log("Nothing to migrate.");
    return;
  }

  const transaction = client.transaction();

  for (const doc of docs) {
    const patches: Record<string, any> = {};

    // Migrate body field
    if (doc.body && Array.isArray(doc.body)) {
      const result = migrateBlocks(doc.body);
      if (result.changed) {
        patches.body = result.blocks;
      }
    }

    // Migrate sections[].content fields
    if (doc.sections && Array.isArray(doc.sections)) {
      let sectionsChanged = false;
      const newSections = doc.sections.map((section: any) => {
        if (section.content && Array.isArray(section.content)) {
          const result = migrateBlocks(section.content);
          if (result.changed) {
            sectionsChanged = true;
            return { ...section, content: result.blocks };
          }
        }
        return section;
      });

      if (sectionsChanged) {
        patches.sections = newSections;
      }
    }

    if (Object.keys(patches).length > 0) {
      console.log(`  Patching ${doc._id} (${doc._type})...`);
      transaction.patch(doc._id, (p) => p.set(patches));
    }
  }

  console.log("Committing transaction...");
  const result = await transaction.commit();
  console.log(`Done. Transaction ID: ${result.transactionId}`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
