import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import api from '../lib/api';
import GlassCard from '../components/ui/GlassCard';

const riskColor = r => r === 'HIGH' ? '#ef4444' : r === 'MEDIUM' ? '#f59e0b' : '#10b981';

export default function ReportsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/readiness').then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-96 text-text-muted font-mono">Loading readiness data...</div>;

  const TooltipStyle = { background: '#1a1f2e', border: '1px solid rgba(255,255,255,0.08)', color: '#dee2f6', fontSize: '12px', borderRadius: '4px' };

  return (
    <div className="p-6 space-y-6">
      {/* Aircraft Risk */}
      <GlassCard>
        <h3 className="font-mono text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Aircraft Maintenance Risk Index</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data?.aircraft} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <XAxis dataKey="callsign" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            <YAxis domain={[0,100]} tick={{ fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TooltipStyle} formatter={v => [`${v}%`, 'Risk']} />
            <Bar dataKey="maintenanceRisk" radius={[2,2,0,0]}>
              {data?.aircraft?.map((entry, i) => <Cell key={i} fill={riskColor(entry.riskLevel)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-3 gap-4 mt-4">
          {['HIGH','MEDIUM','LOW'].map(r => (
            <div key={r} className="glass rounded px-3 py-2 border border-white/[0.06] text-center">
              <div className="font-mono font-bold text-2xl" style={{ color: riskColor(r) }}>
                {data?.aircraft?.filter(a => a.riskLevel === r).length}
              </div>
              <div className="text-[10px] font-mono text-text-muted">{r} RISK</div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Crew Fatigue */}
      <GlassCard>
        <h3 className="font-mono text-[10px] font-bold text-text-muted uppercase tracking-widest mb-4">Crew Fatigue Index (7-day duty hours)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data?.crew} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
            <XAxis dataKey="crewId" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
            <YAxis domain={[0,100]} tick={{ fill: '#64748b', fontSize: 10 }} />
            <Tooltip contentStyle={TooltipStyle} formatter={v => [`${v}%`, 'Fatigue']} />
            <Bar dataKey="fatigueIndex" radius={[2,2,0,0]}>
              {data?.crew?.map((entry, i) => <Cell key={i} fill={riskColor(entry.riskLevel)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 space-y-2">
          {data?.crew?.filter(c => c.riskLevel === 'HIGH').map(c => (
            <div key={c.crewId} className="flex items-center justify-between p-2 bg-danger/10 border border-danger/25 rounded text-xs font-mono">
              <span className="text-text-primary">{c.name} ({c.crewId})</span>
              <span className="text-danger">{c.hoursLast7Days}/{c.maxDutyHours}h — FATIGUE RISK</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
