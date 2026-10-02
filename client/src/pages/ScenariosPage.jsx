import { useEffect, useState } from 'react';
import { FlaskConical, Play, AlertTriangle } from 'lucide-react';
import api from '../lib/api';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';

const DISRUPTION_TYPES = [
  { value: 'AIRCRAFT_UNAVAILABLE', label: 'Aircraft Unavailable' },
  { value: 'CREW_SHORTAGE', label: 'Crew Shortage' },
  { value: 'WEATHER_RESTRICTION', label: 'Weather Restriction' },
  { value: 'COMBINED', label: 'Combined Disruption' },
];

export default function ScenariosPage() {
  const [scenarios, setScenarios] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', disruptionType: 'AIRCRAFT_UNAVAILABLE', parameters: { aircraftId: 'AO-03' } });
  const [running, setRunning] = useState({});
  const [results, setResults] = useState({});
  const [creating, setCreating] = useState(false);

  const load = () => api.get('/scenarios').then(r => setScenarios(r.data));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault(); setCreating(true);
    await api.post('/scenarios', form);
    await load(); setCreating(false);
    setForm({ name: '', description: '', disruptionType: 'AIRCRAFT_UNAVAILABLE', parameters: { aircraftId: 'AO-03' } });
  };

  const runScenario = async (id) => {
    setRunning(r => ({ ...r, [id]: true }));
    try {
      const { data } = await api.post(`/scenarios/${id}/run`);
      setResults(r => ({ ...r, [id]: data }));
    } catch(err) { console.error(err); }
    setRunning(r => ({ ...r, [id]: false }));
    load();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Create Form */}
      <GlassCard>
        <h3 className="font-display font-bold text-text-primary mb-4 flex items-center gap-2">
          <FlaskConical className="text-primary" size={18} /> Create Disruption Scenario
        </h3>
        <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
            placeholder="Scenario name (e.g. Storm + AO-03 grounded)"
            className="bg-canvas border border-white/[0.12] rounded px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary font-mono col-span-full" />
          <textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
            placeholder="Description"
            rows={2}
            className="bg-canvas border border-white/[0.12] rounded px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary font-mono col-span-full resize-none" />
          <select value={form.disruptionType} onChange={e => setForm(f => ({...f, disruptionType: e.target.value}))}
            className="bg-canvas border border-white/[0.12] rounded px-3 py-2.5 text-sm text-text-secondary focus:outline-none focus:border-primary font-mono">
            {DISRUPTION_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
          <input value={JSON.stringify(form.parameters)}
            onChange={e => { try { setForm(f => ({...f, parameters: JSON.parse(e.target.value)})); } catch {} }}
            placeholder='{"aircraftId": "AO-03"}'
            className="bg-canvas border border-white/[0.12] rounded px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary font-mono" />
          <button type="submit" disabled={creating}
            className="col-span-full bg-primary/15 border border-primary/40 text-primary hover:bg-primary/25 font-mono font-bold py-2.5 rounded transition-colors">
            {creating ? 'Creating...' : 'Save Scenario'}
          </button>
        </form>
      </GlassCard>

      {/* Scenarios List */}
      <div className="space-y-4">
        {scenarios.map(s => (
          <GlassCard key={s._id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-bold text-text-primary">{s.name}</span>
                  <StatusBadge status={s.status} />
                  <span className="text-[10px] font-mono text-text-muted border border-white/10 px-1.5 py-0.5 rounded">{s.disruptionType}</span>
                </div>
                <p className="text-text-muted text-sm">{s.description}</p>
                <div className="text-[11px] font-mono text-text-muted mt-1">Parameters: {JSON.stringify(s.parameters)}</div>
              </div>
              <button onClick={() => runScenario(s._id)} disabled={running[s._id]}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-canvas font-mono font-bold px-4 py-2 rounded transition-all hover:shadow-glow-cyan disabled:opacity-50 shrink-0">
                <Play size={14} />{running[s._id] ? 'Running...' : 'Run'}
              </button>
            </div>

            {/* Results */}
            {results[s._id] && (
              <div className="mt-4 pt-4 border-t border-white/[0.06]">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Baseline Assigned', v: results[s._id].baseline?.assignedCount, color: 'text-tertiary' },
                    { label: 'After Disruption', v: results[s._id].result?.assignedCount, color: results[s._id].result?.assignedCount < results[s._id].baseline?.assignedCount ? 'text-danger' : 'text-tertiary' },
                    { label: 'Tasks Affected', v: results[s._id].scenario?.metrics?.affectedTasks ?? '—', color: 'text-warning' },
                    { label: 'Replanning Time', v: `${results[s._id].result?.replanningTimeMs}ms`, color: 'text-primary-bright' },
                  ].map(k => (
                    <div key={k.label} className="glass rounded px-3 py-2 border border-white/[0.06]">
                      <div className="text-[10px] font-mono text-text-muted">{k.label}</div>
                      <div className={`font-mono font-bold text-xl ${k.color}`}>{k.v}</div>
                    </div>
                  ))}
                </div>
                {results[s._id].unassigned?.length > 0 && (
                  <div className="mt-3 p-3 bg-danger/10 border border-danger/30 rounded">
                    <div className="text-danger text-xs font-mono font-bold mb-1">Unassigned after disruption:</div>
                    {results[s._id].unassigned.map((u, i) => (
                      <div key={i} className="text-[11px] font-mono text-text-muted">
                        ⚠ {u.task?.taskId} — {u.task?.title}: {u.reason}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
