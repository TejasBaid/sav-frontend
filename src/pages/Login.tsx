import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';
import type { FC } from 'react';

export const Login: FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('https://sav-backend-1.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login(data.token, data.username, data.role);

      if (data.role === 'superuser') {
        navigate('/superuser');
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-center" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 800,
            letterSpacing: '-0.05em',
            background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--metric-green-icon) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            SAVRA.
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Admin Insights Portal</p>
        </div>

        <form onSubmit={handleLogin} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--metric-red)', color: 'var(--metric-red-icon)', fontSize: '0.875rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div style={{ position: 'relative' }}>
            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--bg-tertiary)',
                backgroundColor: 'var(--bg-secondary)',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--bg-tertiary)',
                backgroundColor: 'var(--bg-secondary)',
                fontSize: '0.875rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.875rem', marginTop: '0.5rem' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p style={{ marginTop: '2rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Hint: Use <strong style={{ color: 'var(--text-secondary)' }}>admin</strong> / <strong style={{ color: 'var(--text-secondary)' }}>savra2026</strong>
        </p>
      </div>
    </div>
  );
};
