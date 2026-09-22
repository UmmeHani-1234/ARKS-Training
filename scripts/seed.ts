/**
 * scripts/seed.ts
 *
 * Populates MongoDB with 10 sample leads.
 * Run once with:  npx tsx scripts/seed.ts
 *
 * Safe to run multiple times — clears existing data first.
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env.local");
  process.exit(1);
}

const LeadSchema = new mongoose.Schema({
  name:    String,
  email:   String,
  status:  String,
  company: String,
  date:    String,
}, { timestamps: true });

const Lead = mongoose.models.Lead || mongoose.model("Lead", LeadSchema);

const seedData = [
  { name: "Aisha Rahman",  email: "aisha@gmail.com",  status: "New",       company: "TechVentures", date: "2024-09-01" },
  { name: "Rahul Singh",   email: "rahul@gmail.com",  status: "Contacted", company: "BuildSpace",   date: "2024-09-03" },
  { name: "Sara Malik",    email: "sara@gmail.com",   status: "Converted", company: "GrowFast",     date: "2024-09-05" },
  { name: "James Carter",  email: "james@outlook.com",status: "New",       company: "NovaBiz",      date: "2024-09-07" },
  { name: "Fatima Noor",   email: "fatima@gmail.com", status: "Contacted", company: "StartupHub",   date: "2024-09-08" },
  { name: "Leo Zhang",     email: "leo@yahoo.com",    status: "Converted", company: "DevForge",     date: "2024-09-10" },
  { name: "Priya Sharma",  email: "priya@gmail.com",  status: "New",       company: "CloudPath",    date: "2024-09-11" },
  { name: "Omar Abdullah", email: "omar@gmail.com",   status: "Converted", company: "DataPeak",     date: "2024-09-12" },
  { name: "Chloe Martin",  email: "chloe@gmail.com",  status: "New",       company: "LaunchPad",    date: "2024-09-14" },
  { name: "Hassan Ahmed",  email: "hassan@gmail.com", status: "Contacted", company: "NextWave",     date: "2024-09-15" },
];

async function seed() {
  try {
    console.log("🔌 Connecting to MongoDB…");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected");

    console.log("🗑️  Clearing existing leads…");
    await Lead.deleteMany({});

    console.log("🌱 Inserting seed data…");
    const inserted = await Lead.insertMany(seedData);
    console.log(`✅ Inserted ${inserted.length} leads`);

    inserted.forEach((l: { name: string; status: string }) =>
      console.log(`   • ${l.name} (${l.status})`)
    );
  } catch (err) {
    console.error("❌ Seed failed:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected");
  }
}

seed();
