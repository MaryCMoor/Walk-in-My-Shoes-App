import { useApp } from '../context/AppContext';

export default function StatCard({ title, value, description, icon, color = 'primary', onClick }) {
  const iconColors = {
    primary: 'var(--color-secondary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
    accent: 'var(--color-accent)',
    info: 'var(--color-secondary)'
  };

  const iconBgColors = {
    primary: 'rgba(59, 130, 246, 0.1)',
    success: 'rgba(16, 185, 129, 0.1)',
    warning: 'rgba(245, 158, 11, 0.1)',
    error: 'rgba(239, 68, 68, 0.1)',
    accent: 'rgba(139, 92, 246, 0.1)',
    info: 'rgba(6, 182, 212, 0.1)'
  };

  return (
    <article 
      className="card stat-card" 
      onClick={onClick}
      style={{ 
        cursor: onClick ? 'pointer' : 'default',
        textAlign: 'center',
        padding: 'var(--spacing-6)'
      }}
    >
      <div className="stat-icon" style={{ 
        width: '48px', 
        height: '48px', 
        borderRadius: 'var(--radius-lg)', 
        backgroundColor: iconBgColors[color],
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        margin: '0 auto var(--spacing-4)',
        color: iconColors[color]
      }}>
        {icon && typeof icon === 'string' && icon.length < 3 ? (
          <span style={{ fontSize: 'var(--text-xl)' }}>{icon}</span>
        ) : icon ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px' }}>
            {icon}
          </span>
        ) : null}
      </div>
      <p className="stat-value" style={{ 
        fontSize: 'var(--text-2xl)', 
        fontWeight: '700', 
        color: 'var(--color-text-primary)',
        marginBottom: 'var(--spacing-1)',
        fontVariantNumeric: 'tabular-nums'
      }}>
        {value}
      </p>
      <p className="stat-title" style={{ 
        fontSize: 'var(--text-sm)', 
        fontWeight: '600', 
        color: 'var(--color-text-secondary)',
        marginBottom: 'var(--spacing-1)'
      }}>
        {title}
      </p>
      {description && (
        <p className="stat-description" style={{ 
          fontSize: 'var(--text-xs)', 
          color: 'var(--color-text-tertiary)',
          lineHeight: 1.5
        }}>
          {description}
        </p>
      )}
    </article>
  );
}