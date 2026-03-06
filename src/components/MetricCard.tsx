import type { FC, ElementType } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ElementType;
  colorKey: 'primary' | 'red' | 'green' | 'orange' | 'purple' | 'gray';
  pulse?: boolean;
}

export const MetricCard: FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  colorKey,
  pulse = false 
}) => {
  const bgColor = `var(--metric-${colorKey})`;
  const iconColor = `var(--metric-${colorKey}-icon)`;

  return (
    <div 
      className="glass-panel animate-fade-in" 
      style={{ 
        padding: '1.5rem', 
        display: 'flex', 
        flexDirection: 'column',
        gap: '0.75rem',
        background: 'var(--bg-secondary)', 
        position: 'relative', 
        overflow: 'hidden',
        borderLeft: `4px solid ${iconColor}`
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {title}
        </span>
        <div 
          className="flex-center" 
          style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            backgroundColor: bgColor,
            color: iconColor,
            position: 'relative',
            flexShrink: 0
          }}
        >
          {pulse && (
            <span style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: iconColor,
              boxShadow: `0 0 0 2px white, 0 0 6px ${iconColor}`
            }}></span>
          )}
          <Icon size={18} />
        </div>
      </div>

      <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1, letterSpacing: '-0.02em' }}>
        {value}
      </div>

      <div style={{ 
        display: 'inline-flex', 
        alignSelf: 'flex-start',
        padding: '0.2rem 0.65rem', 
        borderRadius: '999px', 
        backgroundColor: bgColor, 
        color: iconColor, 
        fontSize: '0.72rem', 
        fontWeight: 700,
        letterSpacing: '0.02em'
      }}>
        This week
      </div>
    </div>
  );
};
