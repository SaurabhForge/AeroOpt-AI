import { useEffect, useState } from 'react';
import api from '../lib/api';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable from '../components/ui/DataTable';

const availOptions = ['AVAILABLE', 'ON_DUTY', 'REST', 'SICK', 'LEAVE'];

export default function CrewPage() {
  const [crew, setCrew] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/crew').then(r => setCrew(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/crew/${id}/status`, { availabilityStatus: status });
    load();
  };

  const fatigueColor = (h, max) => {
    const pct = h / max;
    return pct > 0.8 ? 'text-danger' : pct > 0.5 ? 'text-warning' : 'text-tertiary';
  };

  const columns = [
    { key: 'crewId', label: 'ID', render: v => <span className="font-mono text-primary-bright">{v}</span> },
    { key: 'name', label: 'Name', render: v => <span className="font-bold text-text-primary">{v}</span> },
    { key: 'rank', label: 'Rank', render: v => <span className="text-xs text-text-secondary">{v}</span> },
    { key: 'availabilityStatus', label: 'Status', render: v => <StatusBadge status={v} /> },
    { key: 'qualifications', label: 'Qualifications', render: v => (
      <div className="flex flex-wrap gap-1">
        {v.map(q => <span key={q} className="text-[10px] font-mono bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded">{q}</span>)}
      </div>
    )},
    { key: 'hoursLast7Days', label: 'Duty Hrs (7d)', render: (v, row) => (
      <span className={`font-mono font-bold ${fatigueColor(v, row.maxDutyHours)}`}>{v}/{row.maxDutyHours}h</span>
    )},
    { key: '_id', label: 'Action', render: (id, row) => (
      <select value={row.availabilityStatus} onChange={e => updateStatus(id, e.target.value)}
        className="bg-canvas border border-white/10 text-text-secondary text-xs font-mono rounded px-2 py-1 focus:outline-none focus:border-primary">
        {availOptions.map(s => <option key={s} value={s}>{s}</option>)}
      </select>
    )}
  ];

  if (loading) return <div className="flex items-center justify-center h-96 text-text-muted font-mono">Loading crew data...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-3">
        {['AVAILABLE','ON_DUTY','REST','SICK'].map(s => {
          const count = crew.filter(c => c.availabilityStatus === s).length;
          return <div key={s} className="glass rounded-card px-4 py-2 border border-white/[0.08]">
            <div className="font-mono font-bold text-2xl text-primary-bright">{count}</div>
            <div className="text-[10px] font-mono text-text-muted">{s}</div>
          </div>;
        })}
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3 className="font-mono text-[10px] font-bold text-text-muted uppercase tracking-widest">Crew Registry — {crew.length} Personnel</h3>
        </div>
        <DataTable columns={columns} data={crew} />
      </GlassCard>
    </div>
  );
}
