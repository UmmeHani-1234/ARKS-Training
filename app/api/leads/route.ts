import { NextResponse } from "next/server";
import { leads } from "@/lib/leads";

/**
 * GET /api/leads
 * Returns the full list of mock leads as JSON.
 *
 * Example response:
 * [
 *   { "id": 1, "name": "Aisha Rahman", "email": "aisha@gmail.com", "status": "New", ... },
 *   ...
 * ]
 *
 * Status codes:
 *   200 – success
 *   500 – unexpected server error (handled by Next.js error boundary)
 */
export async function GET() {
  // In Phase 2 this will be: const leads = await db.query("SELECT * FROM leads")
  return NextResponse.json(leads, { status: 200 });
}
