import { useEffect, useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { fetchTeachers } from '../services/api';
import type { Teacher } from '../types';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Search } from 'lucide-react';

export function TeachersList() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTeachers();
        setTeachers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex-center" style={{ height: '100vh', width: '100vw', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ color: 'var(--accent-primary)', fontSize: '1.25rem', fontWeight: 600, animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
          Loading Teachers...
        </div>
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <header className="flex-between" style={{ marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Faculty Roster</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Select a teacher to view their analytics.</p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <div style={{ position: 'relative' }}>
               <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
               <input 
                 type="text" 
                 placeholder="Search teacher..." 
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
             
               {user?.role === 'superuser' && (
                <button onClick={() => navigate('/superuser')} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
                  <PlusCircle size={18} />
                  Add Faculty
                </button>
             )}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
           {teachers.map(teacher => (
             <div 
               key={teacher.teacher_id}
               onClick={() => navigate(`/teacher/${teacher.teacher_id}`)}
               className="glass-panel"
               style={{ 
                 padding: '1.5rem', 
                 cursor: 'pointer',
                 transition: 'transform 0.2s, box-shadow 0.2s',
                 backgroundColor: 'var(--bg-secondary)',
                 border: '1px solid var(--border-light)'
               }}
             >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                   <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', color: 'var(--accent-primary)', fontWeight: 600 }}>
                     {teacher.teacher_name.charAt(0)}
                   </div>
                   <div>
                     <h3 style={{ fontWeight: 600 }}>{teacher.teacher_name}</h3>
                     <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {teacher.teacher_id}</p>
                   </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', backgroundColor: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                   <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Lessons</p>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{teacher.total_lessons}</p>
                   </div>
                   <div style={{ width: '1px', backgroundColor: 'var(--border-light)' }}></div>
                   <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quizzes</p>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{teacher.total_quizzes}</p>
                   </div>
                   <div style={{ width: '1px', backgroundColor: 'var(--border-light)' }}></div>
                   <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Assessments</p>
                      <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{teacher.total_assessments}</p>
                   </div>
                </div>
             </div>
           ))}
        </div>

      </main>
    </div>
  );
}
