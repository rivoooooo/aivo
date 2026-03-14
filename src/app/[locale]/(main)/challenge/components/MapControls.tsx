'use client';

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFitView: () => void;
}

export function MapControls({ onZoomIn, onZoomOut, onReset, onFitView }: Props) {
  const btnStyle: React.CSSProperties = {
    width: 32,
    height: 32,
    background: 'var(--card)',
    border: '1px solid var(--border)',
    borderTop: 'none',
    color: 'var(--foreground)',
    cursor: 'pointer',
    fontSize: 14,
    fontFamily: 'JetBrains Mono, monospace',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 100ms, color 100ms',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--border)',
      }}
    >
      {[
        { label: '+', action: onZoomIn, title: 'Zoom in' },
        { label: '─', action: onZoomOut, title: 'Zoom out' },
        { label: '⌂', action: onReset, title: 'Reset view' },
        { label: '⊞', action: onFitView, title: 'Fit all' },
      ].map(({ label, action, title }, i) => (
        <button
          key={label}
          onClick={action}
          title={title}
          style={{
            ...btnStyle,
            borderTop: i === 0 ? '1px solid var(--border)' : 'none',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--primary)';
            (e.currentTarget as HTMLElement).style.color =
              'var(--primary-foreground)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'var(--card)';
            (e.currentTarget as HTMLElement).style.color = 'var(--foreground)';
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
