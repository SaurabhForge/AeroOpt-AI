import { useEffect, useState } from 'react';
import { Shield, RefreshCw } from 'lucide-react';
import api from '../lib/api';
import GlassCard from '../components/ui/GlassCard';

export default function AuditPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get('/audit').then(r => setLogs(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const actionColor = a => {
    if (a?.includes('APPROVED')) return 'text-tertiary';
    if (a?.includes('REJECTED') || a?.includes('ROLLBACK')) return 'text-danger';
    if (a?.includes('OPTIMIZER') || a?.includes('OPTIMIZE')) return 'text-primary-bright';
    return 'text-text-secondary';
  };

  if (loading) return <div className="flex items-center justify-center h-96 text-text-muted font-mono">Loading audit logs...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="glass rounded-card px-4 py-2 border border-white/[0.08]">
          <span className="font-mono text-primary-bright font-bold text-2xl">{logs.length}</span>
          <span className="font-mono text-text-muted text-xs ml-2">Total Audit Events</span>
        </div>
        <button onClick={load} className="flex items-center gap-2 glass rounded-card px-4 py-2 border border-white/[0.08] text-text-secondary hover:text-primary text-sm font-mono transition-colors">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      <GlassCard className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
          <Shield size={14} className="text-primary" />
          <h3 className="font-mono text-[10px] font-bold text-text-muted uppercase tracking-widest">Immutable Audit Trail</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Timestamp','User','Action','Method','Path','Details'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest bg-white/[0.02]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-text-muted font-mono text-xs">No audit events yet. Run the optimiser or approve a schedule.</td></tr>
              )}
              {logs.map((log, i) => (
                <tr key={log._id || i} className={`border-b border-white/[0.04] ${i % 2 === 1 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="px-4 py-3 font-mono text-[11px] text-text-muted whitespace-nowrap">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-xs text-primary-bright">{log.userEmail}</td>
                  <td className="px-4 py-3">
                    <span className={`font-mono text-xs font-bold ${actionColor(log.action)}`}>{log.action}</span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-text-muted">{log.method}</td>
                  <td className="px-4 py-3 font-mono text-xs text-text-muted">{log.path}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-text-muted max-w-xs truncate">{JSON.stringify(log.payload || {}).slice(0, 60)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
