import { useApp } from '../context/AppContext';
import { organizations, employees } from '../data/mockData';
import { formatDate, getInitials } from '../utils/formatters';

export default function OpportunityCard({ opportunity, onClick, onSave, onRequest, onViewDetails, variant = 'default' }) {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const isSaved = currentUser?.savedOpportunities?.includes(opportunity.id) || false;
  const isHost = currentUser?.role === 'Host' && opportunity.hostId === currentUser.id;
  const isAdmin = currentUser?.role === 'Administrator';

  const host = employees.find(e => e.id === opportunity.hostId);
  const org = organizations.find(o => o.id === opportunity.organizationId);
  const directorate = organizations.find(o => o.id === opportunity.directorateId);
  const division = organizations.find(o => o.id === opportunity.divisionId);
  const reqCount = state.shadowRequests.filter(r => r.opportunityId === opportunity.id).length;

  const handleSave = (e) => {
    e.stopPropagation();
    if (currentUser) {
      actions.toggleSaveOpportunity(opportunity.id);
    }
  };

  const handleRequest = (e) => {
    e.stopPropagation();
    if (onRequest) onRequest(opportunity.id);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    if (onViewDetails) onViewDetails(opportunity.id);
  };

  if (variant === 'compact') {
    return (
      <div className="card opportunity-card-compact" onClick={() => onClick?.(opportunity.id)} style={{ cursor: onClick ? 'pointer' : 'default' }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: 'var(--radius-lg)', 
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: 'var(--text-xl)',
            flexShrink: 0
          }}>
            {getInitials(opportunity.title)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
              <h4 style={{ fontWeight: '600', fontSize: 'var(--text-base)', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {opportunity.title}
              </h4>
              {opportunity.featured && <span className="badge badge-accent" style={{ fontSize: 'var(--text-xs)' }}>⭐ Featured</span>}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--spacing-2)' }}>
              <span>{host ? `${host.firstName} ${host.lastName}` : 'Unknown Host'}</span>
              <span>{org?.name}</span>
              <span>{opportunity.duration}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
              {opportunity.skillCategories.slice(0, 3).map(skill => (
                <span key={skill} className="badge badge-secondary" style={{ fontSize: 'var(--text-xs)' }}>{skill}</span>
              ))}
              {opportunity.skillCategories.length > 3 && (
                <span className="badge badge-secondary" style={{ fontSize: 'var(--text-xs)' }}>+{opportunity.skillCategories.length - 3} more</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <article className="card opportunity-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
        <div style={{ 
          width: '56px', 
          height: '56px', 
          borderRadius: 'var(--radius-lg)', 
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: '700',
          fontSize: 'var(--text-lg)',
          flexShrink: 0
        }}>
          {getInitials(opportunity.title)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontWeight: '600', fontSize: 'var(--text-lg)', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {opportunity.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-1)' }}>
                {opportunity.featured && <span className="badge badge-accent">⭐ Featured</span>}
                {opportunity.leadershipLevel && <span className="badge badge-primary">{opportunity.leadershipLevel}</span>}
                <span className={`badge ${getStatusBadge(opportunity.status)}`}>{opportunity.status}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
              <button 
                className={`btn btn-ghost btn-sm ${isSaved ? 'text-yellow-500' : ''}`} 
                onClick={handleSave}
                aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
              >
                {isSaved ? '★' : '☆'}
              </button>
              {!isHost && !isAdmin && (
                <button className="btn btn-primary btn-sm" onClick={handleRequest}>
                  Request
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              {host ? `${host.firstName} ${host.lastName}` : 'Unknown Host'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              {org?.name}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              {opportunity.duration}
            </span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.6, marginBottom: 'var(--spacing-4)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {opportunity.description}
      </p>

      {/* Metadata */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
        {opportunity.experienceLevel && (
          <span className={`badge ${getExperienceBadge(opportunity.experienceLevel)}`}>{opportunity.experienceLevel}</span>
        )}
        <span className="badge badge-secondary">{opportunity.virtualOption ? 'Virtual Available' : 'In-Person Only'}</span>
        <span className="badge badge-secondary">{opportunity.remainingSeats} of {opportunity.capacity} seats</span>
        <span className="badge badge-secondary">{reqCount} requests</span>
      </div>

      {/* Skills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-4)' }}>
        {opportunity.skillCategories.slice(0, 5).map(skill => (
          <span key={skill} className="badge badge-secondary" style={{ fontSize: 'var(--text-xs)' }}>
            {skill}
          </span>
        ))}
        {opportunity.skillCategories.length > 5 && (
          <span className="badge badge-secondary" style={{ fontSize: 'var(--text-xs)' }}>
            +{opportunity.skillCategories.length - 5} more
          </span>
        )}
      </div>

      {/* Footer Actions */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        paddingTop: 'var(--spacing-4)',
        borderTop: '1px solid var(--color-border-light)',
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <button 
            className="btn btn-ghost btn-sm" 
            onClick={handleSave}
            aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
          <button className="btn btn-ghost btn-sm" onClick={handleViewDetails}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>Details</span>
          </button>
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
          {opportunity.availableDates.length > 0 
            ? `Next: ${formatDate(opportunity.availableDates[0])}` 
            : 'Dates TBD'}
        </div>
      </div>
    </article>
  );
}

function getStatusBadge(status) {
  switch (status) {
    case 'Active': return 'badge-success';
    case 'Draft': return 'badge-secondary';
    case 'Closed': return 'badge-error';
    case 'Full': return 'badge-warning';
    default: return 'badge-secondary';
  }
}

function getExperienceBadge(level) {
  switch (level) {
    case 'Entry': return 'badge-success';
    case 'Intermediate': return 'badge-primary';
    case 'Advanced': return 'badge-warning';
    case 'Expert': return 'badge-error';
    default: return 'badge-secondary';
  }
}