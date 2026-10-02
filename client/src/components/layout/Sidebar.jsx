import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Plane, Users, ClipboardList,
  Brain, FlaskConical, BarChart3, Shield, LogOut
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Overview' },
  { to: '/fleet', icon: Plane, label: 'Fleet' },
  { to: '/crew', icon: Users, label: 'Crew' },
  { to: '/tasks', icon: ClipboardList, label: 'Tasks' },
  { to: '/optimiser', icon: Brain, label: 'Optimiser' },
  { to: '/scenarios', icon: FlaskConical, label: 'Scenarios' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/audit', icon: Shield, label: 'Audit' },
];

export default function Sidebar() {
  const { user, logout } = useAppStore();
  return (
    <aside className="fixed left-0 top-0 h-screen w-[72px] bg-canvas border-r border-white/[0.06] flex flex-col items-center py-4 z-50">
      {/* Logo */}
      <div className="mb-6">
        <div className="w-10 h-10 rounded-card bg-primary/20 border border-primary/40 flex items-center justify-center">
          <span className="text-primary font-mono font-bold text-xs">AO</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 flex flex-col gap-1 w-full px-2">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            title={label}
            className={({ isActive }) =>
              `group relative flex items-center justify-center w-full h-11 rounded-card transition-all ${
                isActive
                  ? 'bg-primary/10 border-l-2 border-primary text-primary shadow-glow-cyan'
                  : 'text-text-muted hover:text-text-secondary hover:bg-white/[0.04]'
              }`
            }
          >
            <Icon size={18} />
            {/* Tooltip */}
            <span className="absolute left-16 bg-surface-card text-text-primary text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-white/10 z-50">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="flex flex-col items-center gap-2 mt-auto">
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <span className="text-primary-bright text-[10px] font-mono font-bold">
            {user?.name?.slice(0, 2).toUpperCase() || 'OP'}
          </span>
        </div>
        <button
          onClick={logout}
          title="Logout"
          className="text-text-muted hover:text-danger transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
}
