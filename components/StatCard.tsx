interface StatCardProps {
  label: string;
  value: number;
  color?: string; // Tailwind text color class e.g. "text-blue-600"
}

/**
 * StatCard — displays a single stat (e.g. "Total Leads: 10")
 * Used on the home dashboard page.
 */
export default function StatCard({ label, value, color = "text-gray-800" }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <span className={`text-4xl font-bold ${color}`}>{value}</span>
    </div>
  );
}
