export default function EmptyState({ icon = '📭', title = 'No items found', description = '', action, actionLabel, className = '' }) {
  return (
    <div className={`empty-state ${className}`} style={{ 
      textAlign: 'center', 
      padding: 'var(--spacing-12) var(--spacing-6)',
      color: 'var(--color-text-tertiary)'
    }}>
      <div className="empty-state-icon" style={{ 
        fontSize: '64px', 
        marginBottom: 'var(--spacing-4)',
        opacity: 0.6
      }}>
        {icon}
      </div>
      <h3 className="empty-state-title" style={{ 
        fontSize: 'var(--text-lg)', 
        fontWeight: '600', 
        color: 'var(--color-text-primary)',
        marginBottom: 'var(--spacing-2)'
      }}>
        {title}
      </h3>
      {description && (
        <p className="empty-state-description" style={{ 
          fontSize: 'var(--text-sm)', 
          lineHeight: 1.6,
          maxWidth: '320px',
          margin: '0 auto var(--spacing-6)'
        }}>
          {description}
        </p>
      )}
      {action && actionLabel && (
        <button className="btn btn-primary" onClick={action}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}