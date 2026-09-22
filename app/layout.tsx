import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "ARKS Leads Dashboard",
  description: "Phase 1 – ARKS Training: Next.js Leads Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        {/* Top navigation */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Logo mark */}
              <span className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                A
              </span>
              <span className="font-semibold text-gray-900 text-lg">ARKS CRM</span>
            </div>

            <nav className="flex items-center gap-6 text-sm font-medium">
              <Link
                href="/"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/leads"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                All Leads
              </Link>
            </nav>
          </div>
        </header>

        {/* Page content */}
        <main className="max-w-6xl mx-auto px-6 py-10">{children}</main>

        <footer className="border-t border-gray-200 mt-16 py-6 text-center text-xs text-gray-400">
          ARKS Training — Phase 1 Deliverable
        </footer>
      </body>
    </html>
  );
}
