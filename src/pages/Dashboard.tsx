import { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { MetricCard } from '../components/MetricCard';
import { ActivityChart } from '../components/ActivityChart';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  FileCheck2,
  GraduationCap,
  Search,
  LogOut
} from 'lucide-react';
import { fetchDashboardSummary, fetchTeachers, fetchTrends } from '../services/api';
import type { DashboardSummary, Teacher, TrendData } from '../types';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers().then(setAllTeachers).catch(console.error);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [sumData, , trendData] = await Promise.all([
          fetchDashboardSummary(selectedGrade, selectedSubject),
          fetchTeachers(selectedGrade, selectedSubject),
          fetchTrends(undefined, selectedGrade, selectedSubject)
        ]);
        setSummary(sumData);
        setTrends(trendData);
      } catch (err) {
        console.error(err);
        logout();
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [logout, navigate, selectedGrade, selectedSubject]);


  const availableGrades = Array.from(new Set(allTeachers.flatMap(t => (t as any).total_classes?.toString().split(',') || [])))
    .map(c => typeof c === 'string' ? c.trim() : '')
    .filter(c => Boolean(c) && c !== 'Unassigned')
    .sort((a, b) => parseInt(a) - parseInt(b));

  const availableSubjects = Array.from(new Set(allTeachers.flatMap(t => (t as any).total_subjects?.toString().split(',') || [])))
    .map(c => typeof c === 'string' ? c.trim() : '')
    .filter(Boolean)
    .sort();

  if (loading || !summary) {
    return (
      <div className="flex-center" style={{ height: '100vh', width: '100vw', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ color: 'var(--accent-primary)', fontSize: '1.25rem', fontWeight: 600, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
          Loading Savra Insights...
        </div>
      </div>
    );
  }


  const filteredTrends = trends.slice(timeRange === 'week' ? -1 : timeRange === 'month' ? -4 : 0);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">

        {/* Header Section */}
        <header className="flex-between" style={{ marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Insights Overview</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>See what's happening across your school today.</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Ask Savra AI..."
                style={{
                  padding: '0.5rem 1rem 0.5rem 2.5rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--bg-tertiary)',
                  backgroundColor: 'var(--bg-secondary)',
                  width: '240px',
                  fontSize: '0.875rem',
                  outline: 'none',
                  boxShadow: 'var(--shadow-sm)'
                }}
              />
            </div>

            {/* Functional Pill Filters */}
            <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-light)', padding: '0.25rem', alignItems: 'center' }}>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: selectedGrade !== 'ALL' ? 'white' : 'var(--text-primary)', backgroundColor: selectedGrade !== 'ALL' ? 'var(--accent-primary)' : 'transparent', borderRadius: 'var(--radius-full)', cursor: 'pointer', border: 'none', outline: 'none', appearance: 'none' }}
              >
                <option value="ALL">All Grades ▾</option>
                {availableGrades.map(g => (
                  <option key={g} value={g}>Grade {g}</option>
                ))}
              </select>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: selectedSubject !== 'ALL' ? 'white' : 'var(--text-secondary)', backgroundColor: selectedSubject !== 'ALL' ? 'var(--accent-primary)' : 'transparent', borderRadius: 'var(--radius-full)', cursor: 'pointer', border: 'none', outline: 'none', appearance: 'none' }}
              >
                <option value="ALL">All Subjects ▾</option>
                {availableSubjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <button onClick={() => { logout(); navigate('/login'); }} className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)' }} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* Top Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem'
        }}>
          <MetricCard
            title="Active Teachers"
            value={summary.activeTeachers}
            icon={Users}
            colorKey="purple"
            pulse
          />
          <MetricCard
            title="Lessons Created"
            value={summary.lessonsCreated}
            icon={BookOpen}
            colorKey="green"
          />
          <MetricCard
            title="Assessments Made"
            value={summary.assessmentsMade}
            icon={FileCheck2}
            colorKey="orange"
          />
          <MetricCard
            title="Quizzes Conducted"
            value={summary.quizzesConducted}
            icon={GraduationCap}
            colorKey="gray"
          />
        </div>

        {/* Charts & AI Pulse Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="flex-between">
              <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Weekly Activity</h3>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <span onClick={() => setTimeRange('week')} style={{ color: timeRange === 'week' ? 'var(--accent-primary)' : 'inherit', fontWeight: timeRange === 'week' ? 600 : 400, cursor: 'pointer' }}>This Week</span>
                <span onClick={() => setTimeRange('month')} style={{ color: timeRange === 'month' ? 'var(--accent-primary)' : 'inherit', fontWeight: timeRange === 'month' ? 600 : 400, cursor: 'pointer' }}>This Month</span>
                <span onClick={() => setTimeRange('year')} style={{ color: timeRange === 'year' ? 'var(--accent-primary)' : 'inherit', fontWeight: timeRange === 'year' ? 600 : 400, cursor: 'pointer' }}>This Year</span>
              </div>
            </div>
            <ActivityChart data={filteredTrends} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>AI Pulse Summary</h3>
            <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-secondary)' }}>

              <div className="flex-between">
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Real-time insights from your data</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-light)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Anita" alt="Avatar" style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    <strong>Lorem Ipsum</strong> Dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
