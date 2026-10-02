import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAppStore from './store/useAppStore';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FleetPage from './pages/FleetPage';
import CrewPage from './pages/CrewPage';
import TasksPage from './pages/TasksPage';
import OptimiserPage from './pages/OptimiserPage';
import ScenariosPage from './pages/ScenariosPage';
import ReportsPage from './pages/ReportsPage';
import AuditPage from './pages/AuditPage';

function ProtectedRoute({ children }) {
  const token = useAppStore(s => s.token);
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="fleet" element={<FleetPage />} />
          <Route path="crew" element={<CrewPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="optimiser" element={<OptimiserPage />} />
          <Route path="scenarios" element={<ScenariosPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="audit" element={<AuditPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
