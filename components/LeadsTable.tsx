"use client";

import { useState } from "react";
import type { Lead } from "@/lib/leads";

const STATUS_STYLES: Record<string, string> = {
  New:       "bg-blue-100 text-blue-700",
  Contacted: "bg-yellow-100 text-yellow-700",
  Converted: "bg-green-100 text-green-700",
};

interface LeadsTableProps {
  leads: Lead[];
  onEdit:   (lead: Lead) => void;
  onDelete: (lead: Lead) => void;
}

export default function LeadsTable({ leads, onEdit, onDelete }: LeadsTableProps) {
  const [search, setSearch] = useState("");

  const filtered = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase()) ||
      lead.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Search bar */}
      <div className="relative">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="Search by name, email, company, or status…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["#", "Name", "Email", "Company", "Status", "Date Added", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-400">
                  No leads match your search.
                </td>
              </tr>
            ) : (
              filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm text-gray-400">{lead.id}</td>
                  <td className="px-5 py-4 text-sm font-medium text-gray-900">{lead.name}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{lead.email}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{lead.company}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[lead.status] ?? "bg-gray-100 text-gray-700"}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500">{lead.date}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {/* Edit */}
                      <button
                        onClick={() => onEdit(lead)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors"
                      >
                        ✏️ Edit
                      </button>
                      {/* Delete */}
                      <button
                        onClick={() => onDelete(lead)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded-md transition-colors"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 text-right">
        Showing {filtered.length} of {leads.length} leads
      </p>
    </div>
  );
}
