import { useEffect, useState } from 'react';
import { Plane, RefreshCw } from 'lucide-react';
import api from '../lib/api';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable from '../components/ui/DataTable';

const statusOptions = ['SERVICEABLE', 'MAINTENANCE', 'GROUNDED', 'MISSION'];

export default function FleetPage() {
  const [aircraft, setAircraft] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const load = () => api.get('/aircraft').then(r => setAircraft(r.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    setUpdating(id);
    await api.patch(`/aircraft/${id}/status`, { availabilityStatus: status });
    await load();
    setUpdating(null);
  };

  const fuelColor = f => f > 70 ? 'text-tertiary' : f > 40 ? 'text-warning' : 'text-danger';

  const columns = [
    { key: 'aircraftId', label: 'ID', render: v => <span className="font-mono text-primary-bright">{v}</span> },
    { key: 'callsign', label: 'Callsign', render: v => <span className="font-mono font-bold text-text-primary">{v}</span> },
    { key: 'type', label: 'Type', render: v => <span className="font-mono text-text-secondary">{v}</span> },
    { key: 'availabilityStatus', label: 'Status', render: v => <StatusBadge status={v} /> },
    { key: 'maintenanceStatus', label: 'Maint.', render: v => <span className="text-xs font-mono text-text-muted">{v}</span> },
    { key: 'fuelLevel', label: 'Fuel', render: v => <span className={`font-mono font-bold ${fuelColor(v)}`}>{v}%</span> },
    { key: 'hoursFlown', label: 'Hrs', render: (v, row) => <span className="font-mono text-text-secondary">{v}/{row.maxHours}</span> },
    {
      key: '_id', label: 'Action',
      render: (id, row) => (
        <select
          value={row.availabilityStatus}
          onChange={e => updateStatus(id, e.target.value)}
          disabled={updating === id}
          className="bg-canvas border border-white/10 text-text-secondary text-xs font-mono rounded px-2 py-1 focus:outline-none focus:border-primary"
        >
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      )
    }
  ];

  if (loading) return <div className="flex items-center justify-center h-96 text-text-muted font-mono">Loading fleet data...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          {['SERVICEABLE','MAINTENANCE','GROUNDED'].map(s => {
            const count = aircraft.filter(a => a.availabilityStatus === s).length;
            return <div key={s} className="glass rounded-card px-4 py-2 border border-white/[0.08]">
              <div className="font-mono font-bold text-2xl text-primary-bright">{count}</div>
              <div className="text-[10px] font-mono text-text-muted">{s}</div>
            </div>;
          })}
        </div>
        <button onClick={load} className="flex items-center gap-2 glass rounded-card px-4 py-2 border border-white/[0.08] text-text-secondary hover:text-primary text-sm font-mono transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3 className="font-mono text-[10px] font-bold text-text-muted uppercase tracking-widest">Fleet Registry — {aircraft.length} Airframes</h3>
        </div>
        <DataTable columns={columns} data={aircraft} />
      </GlassCard>
    </div>
  );
}
