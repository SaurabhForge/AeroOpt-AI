const variants = {
  SERVICEABLE: 'bg-tertiary/10 border-tertiary/35 text-tertiary',
  AVAILABLE: 'bg-tertiary/10 border-tertiary/35 text-tertiary',
  OPTIMIZED: 'bg-tertiary/10 border-tertiary/35 text-tertiary',
  APPROVED: 'bg-tertiary/10 border-tertiary/35 text-tertiary',
  COMPLETE: 'bg-tertiary/10 border-tertiary/35 text-tertiary',
  MAINTENANCE: 'bg-warning/10 border-warning/35 text-warning',
  ON_DUTY: 'bg-warning/10 border-warning/35 text-warning',
  PROPOSED: 'bg-warning/10 border-warning/35 text-warning',
  PENDING: 'bg-warning/10 border-warning/35 text-warning',
  IN_PROGRESS: 'bg-primary/10 border-primary/35 text-primary',
  ASSIGNED: 'bg-primary/10 border-primary/35 text-primary',
  GROUNDED: 'bg-danger/10 border-danger/35 text-danger',
  SICK: 'bg-danger/10 border-danger/35 text-danger',
  REST: 'bg-surface-high border-white/20 text-text-muted',
  FAILED: 'bg-danger/10 border-danger/35 text-danger',
  REJECTED: 'bg-danger/10 border-danger/35 text-danger',
  CANCELLED: 'bg-surface-high border-white/20 text-text-muted',
};

export default function StatusBadge({ status }) {
  const cls = variants[status] || 'bg-surface-high border-white/20 text-text-secondary';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold border ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80"></span>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}
