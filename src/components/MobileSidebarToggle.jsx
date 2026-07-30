import { useApp } from '../context/AppContext';

export default function MobileSidebarToggle({ isOpen, onToggle }) {
  const { sidebarOpen, setSidebarOpen } = useApp();

  if (window.innerWidth >= 1024) {
    return null;
  }

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onToggle}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgb(0 0 0 / 0.5)',
            zIndex: 399,
            animation: 'fadeIn 0.2s ease'
          }}
        />
      )}
      
      <button
        className={`mobile-menu-btn ${isOpen ? 'open' : ''}`}
        onClick={onToggle}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
        style={{
          position: 'fixed',
          top: 'var(--spacing-4)',
          left: 'var(--spacing-4)',
          zIndex: 401,
          display: window.innerWidth < 1024 ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-full)',
          backgroundColor: 'var(--color-bg-card)',
          border: '1px solid var(--color-border-medium)',
          boxShadow: 'var(--shadow-lg)',
          color: 'var(--color-text-primary)',
          cursor: 'pointer',
          transition: 'all var(--transition-fast)'
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isOpen ? (
            <line x1="18" y1="6" x2="6" y2="18"></line>
          ) : (
            <>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </>
          )}
        </svg>
      </button>
    </>
  );
}