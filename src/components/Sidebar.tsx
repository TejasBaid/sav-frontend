import type { FC, ElementType } from 'react';
import { LayoutDashboard, Users, GraduationCap, FileBarChart, Settings, ShieldCheck } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Sidebar: FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  return (
    <aside className="sidebar">
      <div style={{ marginBottom: '3rem', paddingLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className="flex-center" style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'var(--accent-primary)', color: 'white' }}>
          <LayoutDashboard size={18} />
        </div>
        <div>
          <h1 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 800, 
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
          }}>
            SAVRA
          </h1>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <NavItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" active={location.pathname === '/dashboard'} />
        <NavItem icon={Users} label="Teachers" to="/teachers" active={location.pathname === '/teachers' || location.pathname.startsWith('/teacher/')} />
        <NavItem icon={GraduationCap} label="Classrooms" active={false} />
        <NavItem icon={FileBarChart} label="Reports" active={false} />
        {user?.role === 'superuser' && (
          <NavItem icon={ShieldCheck} label="Admin Portal" to="/superuser" active={location.pathname === '/superuser'} />
        )}
      </nav>

      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--bg-tertiary)', paddingTop: '1.5rem' }}>
        <NavItem icon={Settings} label="Settings" active={false} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', padding: '0.5rem' }}>
           <div className="flex-center" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FACC15', color: '#854D0E', fontWeight: 600, fontSize: '0.875rem' }}>
             {user?.username ? user.username.charAt(0).toUpperCase() : 'A'}
           </div>
           <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{user?.role === 'superuser' ? 'SUPERUSER' : 'SCHOOL ADMIN'}</p>
              <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.username === 'admin' ? 'Shauryaman Ray' : user?.username}</p>
           </div>
        </div>
      </div>
    </aside>
  );
};

const NavItem: FC<{ icon: ElementType, label: string, to?: string, active?: boolean }> = ({ icon: Icon, label, to, active }) => {
  const navigate = useNavigate();
  return (
    <div 
      onClick={() => to && navigate(to)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem 1rem',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        backgroundColor: active ? 'var(--accent-light)' : 'transparent',
        color: active ? 'var(--accent-primary)' : 'var(--text-secondary)',
        fontWeight: active ? 600 : 500,
        boxShadow: 'none',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if(!active) e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)';
      }}
      onMouseLeave={(e) => {
        if(!active) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <Icon size={20} color={active ? 'var(--accent-primary)' : 'var(--text-muted)'} />
      <span style={{ color: active ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>{label}</span>
    </div>
  );
};
