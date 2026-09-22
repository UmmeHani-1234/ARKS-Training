import { NextResponse }  from "next/server";
import { connectDB }     from "@/lib/mongodb";
import LeadModel         from "@/models/Lead";
import type { LeadStatus } from "@/lib/leads";

type Params = { params: Promise<{ id: string }> };

// Helper: convert a Mongoose document to our Lead shape
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDTO(doc: any) {
  return {
    id:      doc._id.toString(),
    name:    doc.name,
    email:   doc.email,
    status:  doc.status,
    company: doc.company,
    date:    doc.date,
  };
}

/**
 * GET /api/leads/[id]
 * 200 – found
 * 404 – not found
 * 500 – DB error
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const lead = await LeadModel.findById(id).lean();
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    return NextResponse.json(toDTO(lead), { status: 200 });
  } catch (err) {
    console.error("GET /api/leads/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 });
  }
}

/**
 * PUT /api/leads/[id]
 * Partial update — only fields present in the body are changed.
 * 200 – updated
 * 400 – invalid status
 * 404 – not found
 * 500 – DB error
 */
export async function PUT(request: Request, { params }: Params) {
  try {
    await connectDB();
    const { id }  = await params;
    const body    = await request.json();

    const validStatuses: LeadStatus[] = ["New", "Contacted", "Converted"];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: `status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const updated = await LeadModel.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(toDTO(updated), { status: 200 });
  } catch (err) {
    console.error("PUT /api/leads/[id] error:", err);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

/**
 * DELETE /api/leads/[id]
 * 200 – deleted
 * 404 – not found
 * 500 – DB error
 */
export async function DELETE(_req: Request, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await LeadModel.findByIdAndDelete(id).lean();

    if (!deleted) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: `Lead "${deleted.name}" deleted successfully` },
      { status: 200 }
    );
  } catch (err) {
    console.error("DELETE /api/leads/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
