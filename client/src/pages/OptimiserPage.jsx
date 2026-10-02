import { useState } from 'react';
import { Brain, CheckCircle, XCircle, Play } from 'lucide-react';
import api from '../lib/api';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';

export default function OptimiserPage() {
  const [result, setResult] = useState(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState({});

  const runOptimiser = async () => {
    setRunning(true); setError(''); setResult(null);
    try {
      const { data } = await api.post('/optimize');
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Optimisation failed');
    } finally { setRunning(false); }
  };

  const approve = async (id) => {
    setApproving(a => ({ ...a, [id]: 'approving' }));
    try {
      await api.post(`/assignments/${id}/approve`);
      setApproving(a => ({ ...a, [id]: 'approved' }));
    } catch { setApproving(a => ({ ...a, [id]: 'error' })); }
  };

  const reject = async (id) => {
    setApproving(a => ({ ...a, [id]: 'rejecting' }));
    try {
      await api.post(`/assignments/${id}/reject`);
      setApproving(a => ({ ...a, [id]: 'rejected' }));
    } catch { setApproving(a => ({ ...a, [id]: 'error' })); }
  };

  const m = result?.metrics;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <GlassCard neon>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-xl text-text-primary flex items-center gap-2">
              <Brain className="text-primary" size={22} />
              Constraint-Based Resource Optimiser
            </h2>
            <p className="text-text-muted text-sm mt-1 font-mono">Greedy solver with hard constraints: aircraft availability, crew duty hours, weather restrictions, qualification matching.</p>
          </div>
          <button
            onClick={runOptimiser}
            disabled={running}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-canvas font-display font-bold px-6 py-3 rounded transition-all hover:shadow-glow-cyan disabled:opacity-50"
          >
            <Play size={16} />{running ? 'Optimising...' : 'Run Optimisation'}
          </button>
        </div>
      </GlassCard>

      {error && <div className="glass rounded-card p-4 border border-danger/35 text-danger font-mono text-sm">{error}</div>}

      {/* Metrics */}
      {m && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Tasks', value: m.totalTasks, color: 'text-text-primary' },
            { label: 'Assigned', value: m.assignedCount, color: 'text-tertiary' },
            { label: 'Unassigned', value: m.unassignedCount, color: m.unassignedCount > 0 ? 'text-danger' : 'text-tertiary' },
            { label: 'Assignment Rate', value: `${m.assignmentRate}%`, color: 'text-primary-bright' },
            { label: 'Aircraft Util.', value: `${m.aircraftUtilisation}%`, color: 'text-warning' },
          ].map(k => (
            <div key={k.label} className="glass rounded-card p-4 border border-white/[0.08]">
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest">{k.label}</div>
              <div className={`font-mono font-bold text-2xl mt-1 ${k.color}`}>{k.value}</div>
            </div>
          ))}
        </div>
      )}

      {/* Performance */}
      {m && (
        <div className="glass rounded-card p-4 border border-tertiary/20 bg-tertiary/5">
          <div className="font-mono text-xs text-tertiary">
            ✓ Replanning time: <strong>{m.replanningTimeMs}ms</strong> &nbsp;|&nbsp;
            Available aircraft: <strong>{m.availableAircraft}</strong> &nbsp;|&nbsp;
            Available crew: <strong>{m.availableCrew}</strong> &nbsp;|&nbsp;
            Weather restrictions: <strong>{m.activeWeatherRestrictions}</strong>
          </div>
        </div>
      )}

      {/* Proposed Assignments */}
      {result?.assignments?.length > 0 && (
        <GlassCard className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h3 className="font-mono text-[10px] font-bold text-text-muted uppercase tracking-widest">Proposed Assignments — {result.assignments.length} tasks</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Task','Aircraft ID','Crew ID','Start','End','Constraints','Action'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest bg-white/[0.02]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.assignments.map((a, i) => {
                  const state = approving[a._id] || a.status;
                  return (
                    <tr key={a._id || i} className="border-b border-white/[0.04] hover:bg-primary/[0.03]">
                      <td className="px-4 py-3 font-mono text-primary-bright text-xs">{a.taskId?.taskId || 'Task'}</td>
                      <td className="px-4 py-3 font-mono text-text-secondary text-xs">{a.aircraftId?.aircraftId || a.aircraftId}</td>
                      <td className="px-4 py-3 font-mono text-text-secondary text-xs">{a.crewId?.crewId || a.crewId}</td>
                      <td className="px-4 py-3 font-mono text-text-muted text-xs">{a.scheduledStart ? new Date(a.scheduledStart).toLocaleTimeString() : '—'}</td>
                      <td className="px-4 py-3 font-mono text-text-muted text-xs">{a.scheduledEnd ? new Date(a.scheduledEnd).toLocaleTimeString() : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(a.constraintsSatisfied || []).map(c => (
                            <span key={c} className="text-[9px] font-mono bg-tertiary/10 border border-tertiary/20 text-tertiary px-1 py-0.5 rounded">{c}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {state === 'approved' || state === 'APPROVED' ? (
                          <span className="text-tertiary text-xs font-mono">✓ Approved</span>
                        ) : state === 'rejected' || state === 'REJECTED' ? (
                          <span className="text-danger text-xs font-mono">✕ Rejected</span>
                        ) : (
                          <div className="flex gap-2">
                            <button onClick={() => approve(a._id)}
                              className="flex items-center gap-1 text-[10px] font-mono bg-tertiary/10 border border-tertiary/30 text-tertiary hover:bg-tertiary/20 px-2 py-1 rounded transition-colors">
                              <CheckCircle size={10} /> Approve
                            </button>
                            <button onClick={() => reject(a._id)}
                              className="flex items-center gap-1 text-[10px] font-mono bg-danger/10 border border-danger/30 text-danger hover:bg-danger/20 px-2 py-1 rounded transition-colors">
                              <XCircle size={10} /> Reject
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Unassigned */}
      {result?.unassigned?.length > 0 && (
        <GlassCard danger className="p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-danger/20">
            <h3 className="font-mono text-[10px] font-bold text-danger uppercase tracking-widest">Unassigned Tasks — {result.unassigned.length} (resource constraints)</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {['Task ID','Title','Priority','Reason'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest bg-white/[0.02]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.unassigned.map((u, i) => (
                <tr key={i} className="border-b border-white/[0.04]">
                  <td className="px-4 py-3 font-mono text-danger text-xs">{u.task?.taskId}</td>
                  <td className="px-4 py-3 text-text-secondary">{u.task?.title}</td>
                  <td className="px-4 py-3 font-mono font-bold text-warning">P{u.task?.priority}</td>
                  <td className="px-4 py-3 font-mono text-xs text-text-muted">{u.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      )}
    </div>
  );
}
