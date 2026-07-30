import { useApp } from '../context/AppContext';

export default function KPICard({ title, value, subtitle, icon, trend, trendLabel, color = 'primary', onClick }) {
  const { theme } = useApp(state => state);

  const iconColors = {
    primary: 'var(--color-secondary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    accent: 'var(--color-accent)',
    info: 'var(--color-secondary)'
  };

  const iconBgColors = {
    primary: 'rgba(59, 130, 246, 0.15)',
    success: 'rgba(16, 185, 129, 0.15)',
    warning: 'rgba(245, 158, 11, 0.15)',
    error: 'rgba(239, 68, 68, 0.15)',
    accent: 'rgba(139, 92, 246, 0.15)',
    info: 'rgba(6, 182, 212, 0.15)'
  };

  const trendColor = trend?.startsWith('+') ? 'var(--color-success)' : trend?.startsWith('-') ? 'var(--color-error)' : 'var(--color-text-tertiary)';

  return (
    <article 
      className="card kpi-card" 
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform var(--transition-fast), box-shadow var(--transition-fast)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '4px',
        background: `linear-gradient(90deg, ${iconColors[color]}, ${iconColors.accent})`
      }} />
      
      <div className="card-content" style={{ padding: 'var(--spacing-6)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="kpi-title" style={{ 
              fontSize: 'var(--text-sm)', 
              fontWeight: '500', 
              color: 'var(--color-text-tertiary)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: 'var(--spacing-2)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {title}
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
              <p className="kpi-value" style={{ 
                fontSize: 'var(--text-3xl)', 
                fontWeight: '700', 
                color: 'var(--color-text-primary)',
                lineHeight: 1.2,
                fontVariantNumeric: 'tabular-nums'
              }}>
                {value}
              </p>
              {trend && (
                <span className="kpi-trend" style={{ 
                  fontSize: 'var(--text-sm)', 
                  fontWeight: '600', 
                  color: trendColor,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--spacing-1)'
                }}>
                  {trend.startsWith('+') ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                  ) : trend.startsWith('-') ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 6 10.5 15.5 15.5 10.5 23 18"></polyline><polyline points="7 6 1 6 1 12"></polyline></svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  )}
                  {trendLabel || trend}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="kpi-subtitle" style={{ 
                fontSize: 'var(--text-xs)', 
                color: 'var(--color-text-tertiary)', 
                marginTop: 'var(--spacing-1)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {subtitle}
              </p>
            )}
          </div>
          
          <div className="kpi-icon" style={{ 
            width: '56px', 
            height: '56px', 
            borderRadius: 'var(--radius-xl)', 
            backgroundColor: iconBgColors[color],
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0,
            color: iconColors[color]
          }}>
            {icon && typeof icon === 'string' && icon.length < 3 ? (
              <span style={{ fontSize: 'var(--text-2xl)' }}>{icon}</span>
            ) : icon ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px' }}>
                {icon}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}