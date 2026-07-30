import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { employees, shadowRequests, shadowOpportunities, organizations } from '../data/mockData';
import { formatDate, getInitials } from '../utils/formatters';
import OpportunityCard from '../components/OpportunityCard';

export default function EmployeeProfile({ employeeId }) {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const targetId = employeeId || currentUser?.id;
  const employee = employees.find(e => e.id === targetId);
  
  if (!employee) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
          <div className="empty-state-icon" style={{ fontSize: '64px' }}>👤</div>
          <h3 className="empty-state-title">Employee Not Found</h3>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.id === employee.id;
  const isAdmin = currentUser?.role === 'Administrator';

  // Get employee's requests
  const myRequests = useMemo(() => 
    shadowRequests.filter(r => r.employeeId === employee.id)
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)),
  [employee.id]);

  // Get employee's hosted opportunities
  const hostedOpportunities = useMemo(() => 
    shadowOpportunities.filter(o => o.hostId === employee.id),
  [employee.id]);

  // Get completed requests for certificates
  const completedRequests = myRequests.filter(r => r.status === 'Completed');

  // Get upcoming requests
  const upcomingRequests = myRequests.filter(r => r.status === 'Scheduled' || r.status === 'Approved');

  // Stats
  const stats = {
    totalRequests: myRequests.length,
    completed: completedRequests.length,
    upcoming: upcomingRequests.length,
    hosted: hostedOpportunities.length,
    avgRating: completedRequests.filter(r => r.feedbackSubmitted).length > 0
      ? (completedRequests.filter(r => r.feedbackSubmitted).reduce((sum, r) => sum + (r.feedback?.rating || 0), 0) / completedRequests.filter(r => r.feedbackSubmitted).length).toFixed(1)
      : 'N/A'
  };

  const org = organizations.find(o => o.id === employee.organizationId);

  return (
    <div className="page-container">
      {/* Profile Header */}
      <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-6)', padding: 'var(--spacing-6)' }}>
          <div style={{ 
            width: '120px', 
            height: '120px', 
            borderRadius: 'var(--radius-full)', 
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: '700',
            fontSize: 'var(--text-4xl)',
            flexShrink: 0
          }}>
            {getInitials(`${employee.firstName} ${employee.lastName}`)}
          </div>
          
          <div style={{ flex: 1, minWidth: '250px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>
                  {employee.firstName} {employee.lastName}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)' }}>{employee.position}</span>
                  <span className={`badge ${employee.role === 'Administrator' ? 'badge-error' : employee.role === 'Host' ? 'badge-primary' : 'badge-secondary'}`}>{employee.role}</span>
                  <span className="badge badge-secondary">{employee.clearanceLevel}</span>
                </div>
              </div>
              {(!isOwnProfile || isAdmin) && (
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                  <button className="btn btn-secondary">Message</button>
                  <button className="btn btn-primary">Request Shadow</button>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                {org?.name}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,14 2,6"></polyline></svg>
                {employee.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                {employee.phone}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {employee.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-6)' }}>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: 'var(--color-secondary)' }}>{stats.totalRequests}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Total Requests</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: 'var(--color-success)' }}>{stats.completed}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Completed</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: 'var(--color-warning)' }}>{stats.upcoming}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Upcoming</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: 'var(--color-accent)' }}>{stats.hosted}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Hosted Sessions</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-6)' }}>
          <div style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: 'var(--color-primary)' }}>{stats.avgRating}</div>
          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Avg Rating</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" role="tablist" style={{ marginBottom: 'var(--spacing-6)' }}>
        <button role="tab" aria-selected={true} className="tab active">
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <span>📋</span> Requests
          </span>
        </button>
        <button role="tab" aria-selected={false} className="tab">
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <span>🎓</span> Certificates ({completedRequests.length})
          </span>
        </button>
        <button role="tab" aria-selected={false} className="tab">
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <span>🎤</span> Hosted ({hostedOpportunities.length})
          </span>
        </button>
        <button role="tab" aria-selected={false} className="tab">
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <span>📊</span> Activity
          </span>
        </button>
      </div>

      {/* Requests Table */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
            <h2 className="card-title">Shadow Requests</h2>
            {isOwnProfile && (
              <button className="btn btn-primary btn-sm" onClick={() => actions.setActivePage('opportunities')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--spacing-1)' }}>
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Browse Opportunities
              </button>
            )}
          </div>
        </div>
        <div className="card-content" style={{ padding: 0 }}>
          {myRequests.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Opportunity</th>
                    <th scope="col">Host</th>
                    <th scope="col">Organization</th>
                    <th scope="col">Submitted</th>
                    <th scope="col">Status</th>
                    <th scope="col">Session Date</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myRequests.map(req => {
                    const opp = shadowOpportunities.find(o => o.id === req.opportunityId);
                    const host = employees.find(e => e.id === req.hostId);
                    return (
                      <tr key={req.id}>
                        <td>
                          <div style={{ fontWeight: '500' }}>{opp?.title || 'Unknown'}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{opp?.duration}</div>
                        </td>
                        <td>{host ? `${host.firstName} ${host.lastName}` : 'Unknown'}</td>
                        <td>{organizations.find(o => o.id === opp?.organizationId)?.name || 'N/A'}</td>
                        <td style={{ fontSize: 'var(--text-sm)' }}>{formatDate(req.submittedAt)}</td>
                        <td><span className={`badge ${getStatusBadge(req.status)}`}>{req.status}</span></td>
                        <td style={{ fontSize: 'var(--text-sm)' }}>{req.scheduledDate ? formatDate(req.scheduledDate) : '—'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                            {req.status === 'Completed' && !req.feedbackSubmitted && (
                              <button className="btn btn-primary btn-sm" onClick={() => {/* open feedback modal */}}>
                                Feedback
                              </button>
                            )}
                            {req.status === 'Completed' && req.feedbackSubmitted && (
                              <span className="badge badge-success" style={{ fontSize: 'var(--text-xs)', padding: 'var(--spacing-1) var(--spacing-2)' }}>Feedback ✓</span>
                            )}
                            <button className="btn btn-ghost btn-sm" aria-label="View details"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 'var(--spacing-12)' }}>
              <div className="empty-state-icon">📋</div>
              <h3 className="empty-state-title">No requests yet</h3>
              <p className="empty-state-description">
                {isOwnProfile 
                  ? 'Start exploring shadow opportunities to build your professional network.'
                  : `${employee.firstName} hasn't submitted any shadow requests yet.`
                }
              </p>
              {isOwnProfile && (
                <button className="btn btn-primary" style={{ marginTop: 'var(--spacing-4)' }} onClick={() => actions.setActivePage('opportunities')}>
                  Browse Opportunities
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Biography Section */}
      {employee.biography && (
        <div className="card" style={{ marginTop: 'var(--spacing-6)' }}>
          <div className="card-header">
            <h2 className="card-title">Biography</h2>
          </div>
          <div className="card-content">
            <p style={{ lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>{employee.biography}</p>
          </div>
        </div>
      )}

      {/* Expertise */}
      {employee.expertise.length > 0 && (
        <div className="card" style={{ marginTop: 'var(--spacing-6)' }}>
          <div className="card-header">
            <h2 className="card-title">Areas of Expertise</h2>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
              {employee.expertise.map((skill, i) => (
                <span key={i} className="badge badge-primary">{skill}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certifications */}
      {employee.certifications && employee.certifications.length > 0 && (
        <div className="card" style={{ marginTop: 'var(--spacing-6)' }}>
          <div className="card-header">
            <h2 className="card-title">Certifications</h2>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
              {employee.certifications.map((cert, i) => (
                <span key={i} className="badge badge-accent">{cert}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Years Experience */}
      <div className="card" style={{ marginTop: 'var(--spacing-6)' }}>
        <div className="card-header">
          <h2 className="card-title">Experience</h2>
        </div>
        <div className="card-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: 'var(--radius-xl)', 
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: '700',
              fontSize: 'var(--text-4xl)'
            }}>
              {employee.yearsExperience}
            </div>
            <div>
              <div style={{ fontSize: 'var(--text-xl)', fontWeight: '600' }}>Years of Experience</div>
              <div style={{ color: 'var(--color-text-tertiary)' }}>Dedicated to professional growth and organizational excellence</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusBadge(status) {
  switch (status) {
    case 'Submitted': return 'badge-secondary';
    case 'Pending Review': return 'badge-warning';
    case 'Approved': return 'badge-primary';
    case 'Denied': return 'badge-error';
    case 'Scheduled': return 'badge-accent';
    case 'Completed': return 'badge-success';
    case 'Cancelled': return 'badge-secondary';
    default: return 'badge-secondary';
  }
}