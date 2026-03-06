import type { DashboardSummary, Teacher, TeacherDetail, TrendData } from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'https://sav-backend-1.onrender.com/api';

const getHeaders = () => {
  const token = localStorage.getItem('savra_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const fetchDashboardSummary = async (grade?: string, subject?: string): Promise<DashboardSummary> => {
  const params = new URLSearchParams();
  if (grade && grade !== 'ALL') params.append('grade', grade);
  if (subject && subject !== 'ALL') params.append('subject', subject);
  
  const url = `${API_BASE}/dashboard/summary?${params.toString()}`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
};

export const fetchTeachers = async (grade?: string, subject?: string): Promise<Teacher[]> => {
  const params = new URLSearchParams();
  if (grade && grade !== 'ALL') params.append('grade', grade);
  if (subject && subject !== 'ALL') params.append('subject', subject);
  
  const url = `${API_BASE}/teachers?${params.toString()}`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch teachers');
  return res.json();
};

export const fetchTeacherDetail = async (id: string): Promise<TeacherDetail> => {
  const res = await fetch(`${API_BASE}/teachers/${id}`, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch teacher detail');
  return res.json();
};

export const fetchTrends = async (teacherId?: string, grade?: string, subject?: string): Promise<TrendData[]> => {
  const params = new URLSearchParams();
  if (teacherId) params.append('teacher_id', teacherId);
  if (grade && grade !== 'ALL') params.append('grade', grade);
  if (subject && subject !== 'ALL') params.append('subject', subject);

  const url = `${API_BASE}/trends?${params.toString()}`;
  const res = await fetch(url, { headers: getHeaders() });
  if (!res.ok) throw new Error('Failed to fetch trends');
  return res.json();
};
