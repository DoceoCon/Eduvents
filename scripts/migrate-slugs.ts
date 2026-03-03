/**
 * One-time migration script to generate slugs for existing events.
 *
 * Usage:
 *   npx tsx scripts/migrate-slugs.ts
 *
 * Make sure MONGODB_URI is set in your .env file.
 */

import fs from "fs";
import path from "path";

// Load .env.local (Next.js convention) from the project root
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !(key in process.env)) process.env[key] = value;
  }
}
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in environment variables");
  process.exit(1);
}

function generateSlug(title: string): string {
  return title
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 100);
}

async function migrate() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db;
  if (!db) {
    console.error("Failed to get database connection");
    process.exit(1);
  }

  const collection = db.collection("events");
  const events = await collection
    .find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }] })
    .toArray();

  console.log(`Found ${events.length} events without slugs`);

  const usedSlugs = new Set<string>();

  // First, collect all existing slugs
  const existingSlugs = await collection
    .find({ slug: { $exists: true, $nin: [null, ""] } })
    .project({ slug: 1 })
    .toArray();
  for (const e of existingSlugs) {
    usedSlugs.add(e.slug);
  }

  let migrated = 0;
  for (const event of events) {
    const baseSlug = generateSlug(event.title);
    let slug = baseSlug;
    let counter = 1;

    while (usedSlugs.has(slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    usedSlugs.add(slug);
    await collection.updateOne({ _id: event._id }, { $set: { slug } });
    console.log(`  ${event.title} → ${slug}`);
    migrated++;
  }

  console.log(`\nMigrated ${migrated} events`);
  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
