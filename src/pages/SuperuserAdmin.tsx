import { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, PlusCircle, ShieldCheck } from 'lucide-react';

export function SuperuserAdmin() {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  // Route guarding explicitly handled here since App.tsx might only check general Auth
  if (user?.role !== 'superuser') {
    return (
      <div className="flex-center" style={{ height: '100vh', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-primary)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)' }}>You do not have permission to view the Superuser portal.</p>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">Return to Dashboard</button>
      </div>
    );
  }

  const handleCreateFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormMsg('');
    try {
      const res = await fetch('https://sav-backend-1.onrender.com/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('savra_token')}`
        },
        body: JSON.stringify({ username: newUsername, password: newPassword })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setIsSuccess(true);
      setFormMsg('User created successfully! They can now log in.');
      setNewUsername('');
      setNewPassword('');
    } catch (err: any) {
      setIsSuccess(false);
      setFormMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">

        <header className="flex-between" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => navigate('/teachers')} className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)', border: 'none', backgroundColor: 'var(--bg-secondary)' }}>
              <ChevronLeft size={20} />
            </button>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck color="var(--accent-primary)" />
                Superuser Administration
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                Create and manage Faculty (Admin) accounts for the platform.
              </p>
            </div>
          </div>
        </header>

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', backgroundColor: 'var(--bg-secondary)', padding: '2.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
              <div className="flex-center" style={{ width: '56px', height: '56px', backgroundColor: 'var(--metric-purple)', borderRadius: '50%', marginBottom: '1rem' }}>
                <PlusCircle size={28} color="var(--accent-primary)" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Provision New Faculty</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                Generate credentials for a new School Administrator. They will use this to sign into the Savra Dashboard.
              </p>
            </div>

            <form onSubmit={handleCreateFaculty} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Username</label>
                <input
                  type="text"
                  placeholder="e.g. principal_smith"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outlineOffset: '2px', outlineColor: 'var(--accent-primary)' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Secure Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', outlineOffset: '2px', outlineColor: 'var(--accent-primary)' }}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.875rem', marginTop: '1rem', fontWeight: 600 }}>
                {loading ? 'Processing...' : 'Create Account'}
              </button>

              {formMsg && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSuccess ? 'var(--metric-green)' : 'var(--metric-red)',
                  border: `1px solid ${isSuccess ? '#BBF7D0' : '#FECACA'}`,
                  color: isSuccess ? '#166534' : '#991B1B',
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  fontWeight: 500
                }}>
                  {formMsg}
                </div>
              )}
            </form>
          </div>
        </div>

      </main>
    </div>
  );
}
