export default function GlassCard({ children, className = '', neon = false, danger = false }) {
  let border = 'border-white/[0.08]';
  if (neon) border = 'border-primary/40';
  if (danger) border = 'border-danger/35';
  return (
    <div className={`glass rounded-card p-5 border ${border} ${className}`}>
      {children}
    </div>
  );
}
