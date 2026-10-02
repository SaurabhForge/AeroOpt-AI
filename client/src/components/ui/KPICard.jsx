export default function KPICard({ label, value, unit = '', delta, icon: Icon, color = 'primary' }) {
  const colorMap = {
    primary: 'text-primary-bright',
    green: 'text-tertiary',
    amber: 'text-warning',
    red: 'text-danger',
  };
  return (
    <div className="glass rounded-card p-5 border border-white/[0.08] flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest">{label}</span>
        {Icon && <Icon size={16} className={colorMap[color]} />}
      </div>
      <div className={`font-mono font-bold text-3xl ${colorMap[color]}`}>
        {value}<span className="text-sm text-text-muted ml-1">{unit}</span>
      </div>
      {delta !== undefined && (
        <div className={`text-xs font-mono ${delta >= 0 ? 'text-tertiary' : 'text-danger'}`}>
          {delta >= 0 ? '▲' : '▼'} {Math.abs(delta)}% vs previous
        </div>
      )}
    </div>
  );
}
