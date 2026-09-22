/**
 * app/page.tsx  →  route: /
 *
 * Home / Dashboard page.
 * This is a SERVER component — it fetches data from our own API
 * at build/request time without any client-side JavaScript.
 *
 * Data flow:
 *   Server renders page  →  calls GET /api/leads  →  receives JSON  →  renders stats
 */

import StatCard from "@/components/StatCard";
import Link from "next/link";
import type { Lead } from "@/lib/leads";

async function getLeads(): Promise<Lead[]> {
  // Absolute URL required for server-side fetch in Next.js
  const res = await fetch("http://localhost:3000/api/leads", {
    // No caching — always fresh data (important for Phase 2 when DB updates happen)
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch leads: ${res.status}`);
  }

  return res.json();
}

export default async function DashboardPage() {
  const leads = await getLeads();

  // Compute stats from the API response
  const total     = leads.length;
  const newLeads  = leads.filter((l) => l.status === "New").length;
  const contacted = leads.filter((l) => l.status === "Contacted").length;
  const converted = leads.filter((l) => l.status === "Converted").length;

  return (
    <div className="flex flex-col gap-10">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of all leads in your pipeline.
          </p>
        </div>
        <Link
          href="/leads"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <span>View All Leads</span>
          <span>→</span>
        </Link>
      </div>

      {/* Stat cards */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard label="Total Leads" value={total}     color="text-indigo-600" />
          <StatCard label="New"         value={newLeads}  color="text-blue-600"   />
          <StatCard label="Contacted"   value={contacted} color="text-yellow-600" />
          <StatCard label="Converted"   value={converted} color="text-green-600"  />
        </div>
      </section>

      {/* Recent leads preview */}
      <section>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Recent Leads
        </h2>
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm divide-y divide-gray-100">
          {leads.slice(0, 5).map((lead) => (
            <div
              key={lead.id}
              className="flex items-center justify-between px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{lead.name}</p>
                <p className="text-xs text-gray-500">{lead.email} · {lead.company}</p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  lead.status === "New"
                    ? "bg-blue-100 text-blue-700"
                    : lead.status === "Contacted"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {lead.status}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-right">
          <Link href="/leads" className="text-sm text-indigo-600 hover:underline">
            View all {total} leads →
          </Link>
        </div>
      </section>
    </div>
  );
}
