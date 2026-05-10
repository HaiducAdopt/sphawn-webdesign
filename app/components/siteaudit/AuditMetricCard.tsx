type AuditMetricCardProps = {
  label: string;
  value: string;
};

export default function AuditMetricCard({ label, value }: AuditMetricCardProps) {
  return (
    <div className="rounded-2xl bg-black/25 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">
        {label}
      </p>

      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}