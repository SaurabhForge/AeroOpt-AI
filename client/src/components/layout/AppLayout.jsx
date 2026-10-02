import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useSocket } from '../../hooks/useSocket';

const titles = {
  '/': 'Unified Operations Dashboard',
  '/fleet': 'Fleet & Aircraft Management',
  '/crew': 'Crew Management',
  '/tasks': 'Mission Tasks',
  '/optimiser': 'Intelligent Resource Optimiser',
  '/scenarios': 'Scenarios & Dynamic Replanning',
  '/reports': 'Predictive Readiness Reports',
  '/audit': 'Human Approval & Audit Trail',
};

export default function AppLayout() {
  useSocket();
  const { pathname } = useLocation();
  const title = titles[pathname] || 'AeroOpt AI';

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <TopBar title={title} />
      <main className="ml-[72px] pt-16 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
