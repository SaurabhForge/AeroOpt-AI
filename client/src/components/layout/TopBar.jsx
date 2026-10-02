import { useState, useEffect } from 'react';
import { Wifi, Bell, Database } from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import api from '../../lib/api';

export default function TopBar({ title }) {
  const [time, setTime] = useState(new Date());
  const [redisInfo, setRedisInfo] = useState({ active: true, latency: '< 1ms' });
  const { liveEvents, user } = useAppStore();
  const alerts = liveEvents.filter(e => e.event === 'schedule:proposed').length;

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    api.get('/system/status')
      .then(res => {
        if (res.data?.redis) {
          setRedisInfo({
            active: true,
            latency: res.data.redis.latency || '< 1ms',
            engine: res.data.redis.activeEngine === 'REDIS_LIVE_SERVER' ? 'LIVE' : 'EMULATED'
          });
        }
      })
      .catch(() => {});
  }, []);

  const zuluTime = time.toUTCString().split(' ')[4];

  return (
    <header className="fixed top-0 left-[72px] right-0 h-16 bg-canvas/90 backdrop-blur-md border-b border-white/[0.06] flex items-center px-6 z-40 gap-4">
      <h1 className="font-display font-bold text-text-primary text-lg flex-1">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Redis Status Pill */}
        <div
          title={`Redis Cache Engine Active (${redisInfo.latency} latency)`}
          className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 border border-cyan-500/30 bg-cyan-950/40 px-2.5 py-1 rounded-full shadow-sm"
        >
          <Database size={11} className="text-cyan-400" />
          <span>REDIS: CACHED</span>
          <span className="text-[10px] text-cyan-500">({redisInfo.latency})</span>
        </div>

        {/* AI Core Active */}
        <div className="flex items-center gap-1 text-xs font-mono text-tertiary border border-tertiary/30 bg-tertiary/10 px-2 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse-dot"></span>
          AI CORE ACTIVE
        </div>

        {/* Uplink Telemetry */}
        <div className="hidden sm:flex items-center gap-1 text-xs font-mono text-text-muted border border-white/10 bg-white/[0.04] px-2 py-1 rounded-full">
          <Wifi size={10} />
          UPLINK: 98.4 Gbps
        </div>

        {/* Zulu UTC Clock */}
        <div className="text-xs font-mono text-text-secondary whitespace-nowrap">
          ZULU {zuluTime}
        </div>

        {/* Alerts Badge */}
        <button className="relative text-text-muted hover:text-primary transition-colors">
          <Bell size={18} />
          {alerts > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-warning text-canvas text-[9px] font-bold rounded-full flex items-center justify-center">
              {alerts}
            </span>
          )}
        </button>

        {/* User Identity */}
        <div className="text-xs text-text-secondary border-l border-white/10 pl-4 whitespace-nowrap">
          <span className="text-text-muted">OPS: </span>
          <span className="text-primary-bright font-mono">{user?.name || 'Sqn Ldr Patel'}</span>
        </div>
      </div>
    </header>
  );
}
