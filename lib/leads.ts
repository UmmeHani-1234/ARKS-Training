// Shared TypeScript types — used across API routes, models, and UI
export type LeadStatus = "New" | "Contacted" | "Converted";

export interface Lead {
  id: string;       // MongoDB _id as string
  name: string;
  email: string;
  status: LeadStatus;
  company: string;
  date: string;     // ISO date string e.g. "2024-09-01"
}
