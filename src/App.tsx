import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { TeachersList } from './pages/TeachersList';
import { TeacherProfile } from './pages/TeacherProfile';
import { Login } from './pages/Login';
import { SuperuserAdmin } from './pages/SuperuserAdmin';
import { useAuth, AuthProvider } from './context/AuthContext';
import { SavraPreloader } from './components/SavraPreloader';
import { useState, useEffect } from 'react';
import type { FC } from 'react';

const ProtectedRoute: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teachers" 
        element={
          <ProtectedRoute>
            <TeachersList />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/superuser" 
        element={
          <ProtectedRoute>
            <SuperuserAdmin />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/teacher/:id" 
        element={
          <ProtectedRoute>
            <TeacherProfile />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

function App() {
  const [loadingApp, setLoadingApp] = useState(true);

  useEffect(() => {
    // Artificial delay to show off the Savra preloader per UI mockup request
    const timer = setTimeout(() => {
      setLoadingApp(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loadingApp) {
    return <SavraPreloader />;
  }

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
