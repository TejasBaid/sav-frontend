import type { FC } from 'react';

export const SavraPreloader: FC = () => {
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#F8FAFA',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        backgroundImage: `
          linear-gradient(rgba(20, 140, 114, 0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(20, 140, 114, 0.06) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }}
    >
      <div style={{ position: 'relative', display: 'inline-block', textAlign: 'center' }}>
        <h1 
          style={{ 
            fontSize: 'clamp(4rem, 12vw, 9rem)', 
            fontWeight: 900, 
            letterSpacing: '-0.04em',
            color: '#111827',
            lineHeight: 1,
            fontFamily: "'Inter', system-ui, sans-serif",
            animation: 'savraFadeIn 0.8s ease-out forwards'
          }}
        >
          SAVRA.
        </h1>
        <div style={{
          height: '2px',
          width: '0%',
          backgroundColor: 'var(--accent-primary)',
          margin: '1.25rem auto 0',
          borderRadius: '999px',
          animation: 'savraExpand 1.4s 0.2s ease-out forwards'
        }} />
      </div>
      <style>{`
        @keyframes savraFadeIn {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes savraExpand {
          0% { width: 0%; opacity: 0; }
          40% { opacity: 1; }
          100% { width: 55%; }
        }
      `}</style>
    </div>
  );
};
