import { useEffect, useState } from 'react';
import { Plane, Users, ClipboardList, Cloud, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../lib/api';
import KPICard from '../components/ui/KPICard';
import GlassCard from '../components/ui/GlassCard';
import StatusBadge from '../components/ui/StatusBadge';
import useAppStore from '../store/useAppStore';

export default function DashboardPage() {
  const [aircraft, setAircraft] = useState([]);
  const [crew, setCrew] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const liveEvents = useAppStore(s => s.liveEvents);

  useEffect(() => {
    Promise.all([
      api.get('/aircraft'), api.get('/crew'),
      api.get('/tasks'), api.get('/weather')
    ]).then(([ac, cr, tk, wx]) => {
      setAircraft(ac.data); setCrew(cr.data);
      setTasks(tk.data); setWeather(wx.data);
    }).finally(() => setLoading(false));
  }, []);

  const serviceable = aircraft.filter(a => a.availabilityStatus === 'SERVICEABLE').length;
  const maintenance = aircraft.filter(a => a.availabilityStatus === 'MAINTENANCE').length;
  const grounded = aircraft.filter(a => a.availabilityStatus === 'GROUNDED').length;
  const crewAvail = crew.filter(c => c.availabilityStatus === 'AVAILABLE').length;
  const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;

  const pieData = [
    { name: 'Serviceable', value: serviceable, color: '#10b981' },
    { name: 'Maintenance', value: maintenance, color: '#f59e0b' },
    { name: 'Grounded', value: grounded, color: '#ef4444' },
  ];

  const priorityTasks = [...tasks].sort((a,b) => b.priority - a.priority).slice(0, 6);

  const priorityColor = p => p >= 5 ? 'text-danger' : p >= 4 ? 'text-warning' : p >= 3 ? 'text-primary' : 'text-text-muted';

  if (loading) return <div className="flex items-center justify-center h-96 text-text-muted font-mono">Loading operations data...</div>;

  return (
    <div className="p-6 space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total Aircraft" value={aircraft.length} icon={Plane} color="primary" />
        <KPICard label="Serviceable" value={serviceable} icon={Plane} color="green" delta={serviceable > 7 ? 5 : -10} />
        <KPICard label="Crew Available" value={crewAvail} icon={Users} color="primary" />
        <KPICard label="Pending Tasks" value={pendingTasks} icon={ClipboardList} color={pendingTasks > 8 ? 'amber' : 'green'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Status Chart */}
        <GlassCard className="flex flex-col">
          <h3 className="font-mono text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Fleet Readiness</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', color: '#dee2f6', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-around mt-2">
            {pieData.map(d => (
              <div key={d.name} className="text-center">
                <div className="font-mono font-bold text-xl" style={{ color: d.color }}>{d.value}</div>
                <div className="text-[10px] font-mono text-text-muted">{d.name}</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Priority Tasks */}
        <GlassCard className="col-span-1 lg:col-span-2">
          <h3 className="font-mono text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">High Priority Tasks</h3>
          <div className="space-y-2">
            {priorityTasks.map(t => (
              <div key={t._id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold text-lg ${priorityColor(t.priority)}`}>P{t.priority}</span>
                  <div>
                    <div className="text-sm text-text-primary font-medium">{t.title}</div>
                    <div className="text-[11px] text-text-muted font-mono">{t.missionType} · {t.sector} · {t.requiredAircraftType}</div>
                  </div>
                </div>
                <StatusBadge status={t.status} />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weather */}
        <GlassCard>
          <h3 className="font-mono text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Weather & Airspace</h3>
          <div className="space-y-3">
            {weather.map(w => (
              <div key={w._id} className={`p-3 rounded border ${
                w.restrictionLevel >= 3 ? 'border-danger/35 bg-danger/10' :
                w.restrictionLevel >= 1 ? 'border-warning/35 bg-warning/10' :
                'border-white/[0.06] bg-white/[0.02]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">{w.regionName}</span>
                  <span className={`text-xs font-mono ${
                    w.restrictionLevel >= 3 ? 'text-danger' :
                    w.restrictionLevel >= 1 ? 'text-warning' : 'text-tertiary'
                  }`}>{w.condition}</span>
                </div>
                {w.notes && <p className="text-[11px] text-text-muted mt-1 font-mono">{w.notes}</p>}
                <div className="text-[10px] text-text-muted mt-1 font-mono">Restriction Level: {w.restrictionLevel}/5</div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Live Events Feed */}
        <GlassCard className="col-span-1 lg:col-span-2">
          <h3 className="font-mono text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center gap-2">
            <Activity size={12} className="text-primary" />
            Live Events Feed
          </h3>
          {liveEvents.length === 0 ? (
            <div className="text-text-muted text-xs font-mono py-4 text-center">No live events yet. Run the optimiser to see updates.</div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
              {liveEvents.map((e, i) => (
                <div key={i} className="flex items-start gap-2 text-xs font-mono py-1.5 border-b border-white/[0.04]">
                  <span className="text-primary-bright shrink-0">[{new Date(e.timestamp).toLocaleTimeString()}]</span>
                  <span className="text-warning font-bold shrink-0">{e.event}</span>
                  <span className="text-text-muted truncate">{JSON.stringify(e.data).slice(0, 60)}</span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
