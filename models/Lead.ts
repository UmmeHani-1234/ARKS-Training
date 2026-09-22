/**
 * models/Lead.ts
 *
 * Mongoose schema and model for a Lead document.
 * The model is cached on the global object to prevent
 * "Cannot overwrite model once compiled" errors during hot reloads.
 */

import mongoose, { Schema, Document, Model } from "mongoose";
import type { LeadStatus } from "@/lib/leads";

// ── Document interface ───────────────────────────────────────
export interface ILead extends Document {
  name:    string;
  email:   string;
  status:  LeadStatus;
  company: string;
  date:    string;
}

// ── Schema ───────────────────────────────────────────────────
const LeadSchema = new Schema<ILead>(
  {
    name:    { type: String, required: true,  trim: true },
    email:   { type: String, required: true,  trim: true, lowercase: true },
    status:  { type: String, required: true,  enum: ["New", "Contacted", "Converted"], default: "New" },
    company: { type: String, required: true,  trim: true },
    date:    { type: String, required: true,  default: () => new Date().toISOString().split("T")[0] },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// ── Model (cached to survive hot reloads) ────────────────────
const LeadModel: Model<ILead> =
  (mongoose.models.Lead as Model<ILead>) ||
  mongoose.model<ILead>("Lead", LeadSchema);

export default LeadModel;
