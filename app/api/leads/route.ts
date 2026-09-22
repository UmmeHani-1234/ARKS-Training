import { NextResponse } from "next/server";
import { connectDB }    from "@/lib/mongodb";
import LeadModel        from "@/models/Lead";
import type { LeadStatus } from "@/lib/leads";

/**
 * GET /api/leads
 * Returns all leads from MongoDB, sorted newest first.
 * 200 – success
 * 500 – DB error
 */
export async function GET() {
  try {
    await connectDB();
    const leads = await LeadModel.find().sort({ createdAt: -1 }).lean();

    // Transform _id → id for the frontend
    const data = leads.map((l) => ({
      id:      l._id.toString(),
      name:    l.name,
      email:   l.email,
      status:  l.status,
      company: l.company,
      date:    l.date,
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("GET /api/leads error:", err);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

/**
 * POST /api/leads
 * Creates a new lead in MongoDB.
 * Body: { name, email, status, company, date? }
 * 201 – created
 * 400 – validation error
 * 500 – DB error
 */
export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, status, company, date } = body;

    // Manual validation (Mongoose will also validate, but we return friendly errors)
    if (!name || !email || !status || !company) {
      return NextResponse.json(
        { error: "name, email, status, and company are required" },
        { status: 400 }
      );
    }

    const validStatuses: LeadStatus[] = ["New", "Contacted", "Converted"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const lead = await LeadModel.create({
      name,
      email,
      status,
      company,
      date: date ?? new Date().toISOString().split("T")[0],
    });

    return NextResponse.json(
      {
        id:      lead._id.toString(),
        name:    lead.name,
        email:   lead.email,
        status:  lead.status,
        company: lead.company,
        date:    lead.date,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/leads error:", err);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
