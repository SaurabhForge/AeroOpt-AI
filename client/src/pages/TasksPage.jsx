import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../lib/api';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import DataTable from '../components/ui/DataTable';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const load = () => api.get('/tasks').then(r => setTasks(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const priorityColor = p => p >= 5 ? 'text-danger' : p >= 4 ? 'text-warning' : p >= 3 ? 'text-primary' : 'text-text-muted';

  const statuses = ['ALL', 'PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETE', 'CANCELLED'];
  const filtered = filter === 'ALL' ? tasks : tasks.filter(t => t.status === filter);

  const columns = [
    { key: 'taskId', label: 'Task ID', render: v => <span className="font-mono text-primary-bright">{v}</span> },
    { key: 'title', label: 'Mission Title', render: v => <span className="font-medium text-text-primary">{v}</span> },
    { key: 'priority', label: 'Priority', render: v => <span className={`font-mono font-bold text-lg ${priorityColor(v)}`}>P{v}</span> },
    { key: 'missionType', label: 'Type', render: v => <span className="text-xs font-mono text-text-secondary">{v}</span> },
    { key: 'requiredAircraftType', label: 'Aircraft Req.', render: v => <span className="text-xs font-mono text-primary">{v}</span> },
    { key: 'sector', label: 'Sector', render: v => <span className="font-mono text-text-muted">{v}</span> },
    { key: 'status', label: 'Status', render: v => <StatusBadge status={v} /> },
    { key: 'deadline', label: 'Deadline', render: v => <span className="text-xs font-mono text-text-muted">{new Date(v).toLocaleTimeString()}</span> },
    { key: 'weatherSensitive', label: 'WX', render: v => <span className={`text-xs font-mono ${v ? 'text-warning' : 'text-text-muted'}`}>{v ? '⚠ WX' : '—'}</span> },
  ];

  if (loading) return <div className="flex items-center justify-center h-96 text-text-muted font-mono">Loading tasks...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded text-xs font-mono border transition-colors ${
                filter === s ? 'bg-primary/15 border-primary/40 text-primary' : 'border-white/[0.08] text-text-muted hover:text-text-secondary'
              }`}>{s} {s === 'ALL' ? `(${tasks.length})` : `(${tasks.filter(t => t.status === s).length})`}
            </button>
          ))}
        </div>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3 className="font-mono text-[10px] font-bold text-text-muted uppercase tracking-widest">Mission Tasks — {filtered.length} records</h3>
        </div>
        <DataTable columns={columns} data={filtered} />
      </GlassCard>
    </div>
  );
}
