
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import type { TrendData } from '../types';

interface ActivityChartProps {
  data: TrendData[];
}

export const ActivityChart: React.FC<ActivityChartProps> = ({ data }) => {
  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', height: '400px', display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
        Weekly Activity Trends
      </h3>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillLessons" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="fillQuizzes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F97316" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="fillAssessments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
            <XAxis 
              dataKey="week_start_date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: 'none', 
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                background: '#FFFFFF',
                color: 'var(--text-primary)',
                fontSize: '0.875rem'
              }} 
            />
            <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}/>
            <Area type="monotone" dataKey="lessons" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#fillLessons)" dot={false} />
            <Area type="monotone" dataKey="quizzes" stroke="#F97316" strokeWidth={2} fillOpacity={1} fill="url(#fillQuizzes)" dot={false} />
            <Area type="monotone" dataKey="assessments" stroke="var(--accent-primary)" strokeWidth={2} fillOpacity={1} fill="url(#fillAssessments)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
