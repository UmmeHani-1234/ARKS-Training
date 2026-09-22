/**
 * app/leads/page.tsx  →  route: /leads
 *
 * All Leads page.
 * This is also a SERVER component — fetches lead data from the API,
 * then passes it to the client-side <LeadsTable> which handles search.
 *
 * Why separate from app/page.tsx?
 *   Next.js App Router maps the file system to URLs:
 *   - app/page.tsx          → /
 *   - app/leads/page.tsx    → /leads
 *   Each route has its own layout, loading, and error boundaries.
 */

import LeadsTable from "@/components/LeadsTable";
import Link from "next/link";
import type { Lead } from "@/lib/leads";

async function getLeads(): Promise<Lead[]> {
  const res = await fetch("http://localhost:3000/api/leads", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch leads: ${res.status}`);
  }

  return res.json();
}

export default async function LeadsPage() {
  const leads = await getLeads();

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            {leads.length} leads total — use the search bar to filter.
          </p>
        </div>

        {/* + Add Lead button — placeholder for Phase 2 (POST /api/leads) */}
        <button
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors cursor-not-allowed opacity-80"
          title="Full CRUD coming in Phase 2"
          disabled
        >
          <span>+</span>
          <span>Add Lead</span>
        </button>
      </div>

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 flex items-center gap-1">
        <Link href="/" className="hover:text-indigo-600">Dashboard</Link>
        <span>/</span>
        <span className="text-gray-700">All Leads</span>
      </nav>

      {/* Searchable leads table — client component */}
      <LeadsTable leads={leads} />

      {/* Phase 2 callout */}
      <div className="rounded-lg border border-dashed border-indigo-300 bg-indigo-50 px-5 py-4 text-sm text-indigo-700">
        <strong>Phase 2:</strong> This page will support full CRUD — Create, Read, Update, Delete leads — backed by a real database.
      </div>
    </div>
  );
}
