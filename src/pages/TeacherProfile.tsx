import { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { MetricCard } from '../components/MetricCard';
import { ActivityChart } from '../components/ActivityChart';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  BookOpen, 
  FileCheck2, 
  GraduationCap, 
  Search,
  ChevronLeft,
  Download,
  TrendingUp
} from 'lucide-react';
import { fetchTeacherDetail, fetchTrends } from '../services/api';
import type { TeacherDetail, TrendData } from '../types';

export function TeacherProfile() {
  const { id } = useParams<{ id: string }>();
  const [teacher, setTeacher] = useState<TeacherDetail | null>(null);
  const [trends, setTrends] = useState<TrendData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedGrade, setSelectedGrade] = useState('ALL');
  const [selectedSubject, setSelectedSubject] = useState('ALL');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    
    const loadTeacherInfo = async () => {
      setLoading(true);
      try {
        const tData = await fetchTeacherDetail(id);
        setTeacher(tData);
      } catch (err) {
        console.error(err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadTeacherInfo();
  }, [id, navigate]);

  useEffect(() => {
    if (!id) return;
    const loadTrends = async () => {
      try {
        const trendData = await fetchTrends(id, selectedGrade, selectedSubject);
        setTrends(trendData);
      } catch (err) {
        console.error(err);
      }
    };
    loadTrends();
  }, [id, selectedGrade, selectedSubject]);

  if (loading || !teacher) {
    return (
      <div className="flex-center" style={{ height: '100vh', width: '100vw', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ color: 'var(--accent-primary)', fontSize: '1.25rem', fontWeight: 600, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
          Loading Teacher Profile...
        </div>
      </div>
    );
  }

  // Calculate engagement rate mock explicitly requested in mockup
  const classCount = teacher.classes ? teacher.classes.split(',').length : 1;
  const engagementRate = Math.max(0, 100 - (classCount * 5.5)).toFixed(0); 

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        
        {/* Header Section */}
        <header className="flex-between" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
             <button onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: 'var(--radius-full)', border: 'none', backgroundColor: 'var(--bg-secondary)' }}>
               <ChevronLeft size={20} />
             </button>
             <div>
               <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 {teacher.teacher_name} <span style={{ fontSize: '0.75rem', fontWeight: 500, padding: '0.2rem 0.5rem', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)' }}>Performance Overview</span>
               </h2>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                 Subject: <strong style={{color: 'var(--text-secondary)'}}>{teacher.subjects}</strong> • 
                 Grade Taught: <strong style={{color: 'var(--text-secondary)'}}>{teacher.classes.split(',').filter(c => c !== 'Unassigned').map(c => `Class ${c}`).join(', ') || 'N/A'}</strong>
               </p>
             </div>
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
            
            <div style={{ display: 'flex', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--bg-tertiary)', padding: '0.25rem' }}>
               <select 
                 value={selectedGrade}
                 onChange={(e) => setSelectedGrade(e.target.value)}
                 style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 600, color: selectedGrade !== 'ALL' ? 'white' : 'var(--text-primary)', backgroundColor: selectedGrade !== 'ALL' ? 'var(--accent-primary)' : 'transparent', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: 'none', outline: 'none', appearance: 'none' }}
               >
                 <option value="ALL">All Grades ▾</option>
                 {teacher.classes.split(',').filter(c => c !== 'Unassigned').map(c => (
                   <option key={c} value={c}>Grade {c}</option>
                 ))}
               </select>

               <select 
                 value={selectedSubject}
                 onChange={(e) => setSelectedSubject(e.target.value)}
                 style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', fontWeight: 500, color: selectedSubject !== 'ALL' ? 'white' : 'var(--text-secondary)', backgroundColor: selectedSubject !== 'ALL' ? 'var(--accent-primary)' : 'transparent', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: 'none', outline: 'none', appearance: 'none' }}
               >
                 <option value="ALL">All Subjects ▾</option>
                 {teacher.subjects.split(',').filter(Boolean).map(s => (
                   <option key={s} value={s}>{s}</option>
                 ))}
               </select>
            </div>
          </div>
        </header>

        {/* Top Metric Cards strictly matching mockup text */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr 1fr 1fr', 
          gap: '1.5rem',
          marginBottom: '1.5rem'
        }}>
          <MetricCard 
            title="Lessons" 
            value={teacher.total_lessons} 
            icon={BookOpen} 
            colorKey="purple"
          />
          <MetricCard 
            title="Quizzes" 
            value={teacher.total_quizzes} 
            icon={FileCheck2} 
            colorKey="green" 
          />
          <MetricCard 
            title="Assessments" 
            value={teacher.total_assessments} 
            icon={GraduationCap} 
            colorKey="orange" 
          />
          <MetricCard 
            title="Engagement Rate" 
            value={`${engagementRate}%`} 
            icon={TrendingUp} 
            colorKey="red" 
          />
        </div>

        {/* Activity & Breakdown Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          
          <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Class-wise Breakdown</h3>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', marginBottom: '1rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)'}}></span> Avg Score</div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--metric-orange-icon)'}}></span> Completion</div>
            </div>
            
            <div style={{ flex: 1, height: '300px' }}>
                <ActivityChart data={trends} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', flex: 1 }}>
               <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1rem' }}>Recent Activity</h3>
               <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--metric-gray)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={16} color="var(--text-muted)" />
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>No Recent Activity</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No sessions or materials created yet.</p>
                  </div>
               </div>
             </div>

             <button className="btn" style={{ 
               backgroundColor: 'var(--metric-orange-icon)', 
               color: 'white', 
               fontWeight: 600, 
               padding: '1rem',
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               gap: '0.5rem',
               borderRadius: 'var(--radius-md)'
             }}>
               <Download size={18} />
               Export Report (CSV)
             </button>
          </div>
        </div>

      </main>
    </div>
  );
}
