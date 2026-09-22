"use client";

/**
 * app/leads/page.tsx  →  route: /leads
 *
 * Full CRUD leads page — client component.
 * Fetches leads from GET /api/leads on mount, then keeps local state in sync
 * after every create/update/delete operation without needing a full page reload.
 *
 * Data flow:
 *   Mount → GET /api/leads → setLeads
 *   Add   → POST /api/leads          → append to state
 *   Edit  → PUT  /api/leads/[id]     → update in state
 *   Delete→ DELETE /api/leads/[id]   → remove from state
 */

import { useState, useEffect, useCallback } from "react";
import LeadsTable from "@/components/LeadsTable";
import LeadForm   from "@/components/LeadForm";
import Link       from "next/link";
import type { Lead } from "@/lib/leads";

type ModalMode = "add" | "edit" | null;

export default function LeadsPage() {
  const [leads,       setLeads]       = useState<Lead[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [modalMode,   setModalMode]   = useState<ModalMode>(null);
  const [editTarget,  setEditTarget]  = useState<Lead | undefined>(undefined);
  const [saving,      setSaving]      = useState(false);
  const [deleteTarget,setDeleteTarget]= useState<Lead | null>(null);
  const [deleting,    setDeleting]    = useState(false);
  const [toast,       setToast]       = useState<string | null>(null);

  // ── Fetch all leads ──────────────────────────────────────
  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/leads");
      if (!res.ok) throw new Error("Failed to load leads");
      setLeads(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  // ── Toast helper ─────────────────────────────────────────
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  // ── Add lead ─────────────────────────────────────────────
  async function handleAdd(data: Omit<Lead, "id">) {
    setSaving(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to create lead");
      }
      const newLead: Lead = await res.json();
      setLeads((prev) => [...prev, newLead]);
      setModalMode(null);
      showToast(`✅ "${newLead.name}" added successfully`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  // ── Edit lead ────────────────────────────────────────────
  function openEdit(lead: Lead) {
    setEditTarget(lead);
    setModalMode("edit");
  }

  async function handleEdit(data: Omit<Lead, "id">) {
    if (!editTarget) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/leads/${editTarget.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to update lead");
      }
      const updated: Lead = await res.json();
      setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
      setModalMode(null);
      showToast(`✅ "${updated.name}" updated successfully`);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setSaving(false);
    }
  }

  // ── Delete lead ──────────────────────────────────────────
  function openDelete(lead: Lead) {
    setDeleteTarget(lead);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/leads/${deleteTarget.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to delete lead");
      }
      setLeads((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      showToast(`🗑️ "${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setDeleting(false);
    }
  }

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Leads</h1>
          <p className="mt-1 text-sm text-gray-500">
            {loading ? "Loading…" : `${leads.length} leads total`}
          </p>
        </div>

        {/* + Add Lead */}
        <button
          onClick={() => { setEditTarget(undefined); setModalMode("add"); }}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
        >
          <span className="text-lg leading-none">+</span>
          <span>Add Lead</span>
        </button>
      </div>

      {/* Breadcrumb */}
      <nav className="text-xs text-gray-400 flex items-center gap-1">
        <Link href="/" className="hover:text-indigo-600">Dashboard</Link>
        <span>/</span>
        <span className="text-gray-700">All Leads</span>
      </nav>

      {/* States */}
      {loading && (
        <div className="flex items-center justify-center py-20 text-gray-400 text-sm">
          Loading leads…
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
          <span>⚠️ {error}</span>
          <button onClick={fetchLeads} className="underline text-xs">Retry</button>
        </div>
      )}

      {!loading && !error && (
        <LeadsTable
          leads={leads}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      )}

      {/* ── Add / Edit modal ── */}
      {modalMode && (
        <LeadForm
          lead={modalMode === "edit" ? editTarget : undefined}
          onClose={() => setModalMode(null)}
          onSave={modalMode === "edit" ? handleEdit : handleAdd}
          saving={saving}
        />
      )}

      {/* ── Delete confirmation ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 mx-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete Lead</h2>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-medium text-gray-900">{deleteTarget.name}</span>?
              This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 border border-gray-300 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-sm font-medium py-2 rounded-lg transition-colors"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast notification ── */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
