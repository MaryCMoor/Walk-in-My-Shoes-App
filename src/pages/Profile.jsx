import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { employees, shadowRequests, shadowOpportunities, organizations } from '../data/mockData';
import { formatDate, getInitials } from '../utils/formatters';

export default function Profile({ userId }) {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const targetUserId = userId || currentUser?.id;
  const user = employees.find(e => e.id === targetUserId);
  const isOwnProfile = targetUserId === currentUser?.id;

  if (!user) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
          <div className="empty-state-icon">👤</div>
          <h3 className="empty-state-title">Profile Not Found</h3>
        </div>
      </div>
    );
  }

  // Get user's requests
  const userRequests = useMemo(() => shadowRequests.filter(r => r.employeeId === user.id), [user.id]);
  
  // Get hosted opportunities
  const hostedOpportunities = useMemo(() => shadowOpportunities.filter(o => o.hostId === user.id), [user.id]);
  
  // Get completed sessions
  const completedRequests = userRequests.filter(r => r.status === 'Completed');
  const upcomingRequests = userRequests.filter(r => r.status === 'Scheduled' || r.status === 'Approved');

  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'requests', label: 'My Requests', icon: '📝', count: userRequests.length },
    { id: 'hosted', label: 'Hosted', icon: '🎤', count: hostedOpportunities.length },
    { id: 'certificates', label: 'Certificates', icon: '🎓', count: completedRequests.length },
    { id: 'feedback', label: 'Feedback', icon: '⭐', count: completedRequests.length }
  ];

  return (
    <div className="page-container">
      {/* Profile Header */}
      <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="card-content" style={{ padding: 'var(--spacing-8)', display: 'flex', gap: 'var(--spacing-8)', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div style={{ flexShrink: 0 }}>
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: 'var(--radius-full)',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 'var(--text-4xl)',
              fontWeight: '700'
            }}>
              {getInitials(user.firstName, user.lastName)}
            </div>
            {isOwnProfile && (
              <button className="btn btn-outline btn-sm" style={{ marginTop: 'var(--spacing-3)', width: '120px' }}>
                Update Photo
              </button>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)', flexWrap: 'wrap' }}>
              <div>
                <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>
                  {user.firstName} {user.lastName}
                </h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', flexWrap: 'wrap', color: 'var(--color-text-tertiary)' }}>
                  <span style={{ fontWeight: '500', fontSize: 'var(--text-lg)', color: 'var(--color-text-secondary)' }}>{user.position}</span>
                  <span>•</span>
                  <span>{user.grade}</span>
                  <span>•</span>
                  <span>{user.yearsExperience} years experience</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {user.role === 'Administrator' && <span className="badge badge-error">Admin</span>}
                {user.role === 'Host' && <span className="badge badge-primary">Host</span>}
                {user.role === 'Employee' && <span className="badge badge-secondary">Employee</span>}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: 'var(--color-text-tertiary)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{organizations.find(o => o.id === user.organizationId)?.name || user.organizationId}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: 'var(--color-text-tertiary)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>{user.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: 'var(--color-text-tertiary)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span>{user.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', color: 'var(--color-text-tertiary)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
                <span>Clearance: {user.clearanceLevel}</span>
              </div>
            </div>

            <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7 }}>{user.biography}</p>
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap' }}>
            <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', minWidth: '100px' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--color-secondary)' }}>{userRequests.length}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Total Requests</div>
            </div>
            <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', minWidth: '100px' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--color-success)' }}>{completedRequests.length}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Completed</div>
            </div>
            <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', minWidth: '100px' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--color-warning)' }}>{upcomingRequests.length}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Upcoming</div>
            </div>
            <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', minWidth: '100px' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--color-accent)' }}>{hostedOpportunities.length}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase' }}>Hosted Opps</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span>{tab.icon}</span>
              {tab.label}
              {tab.count !== undefined && (
                <span className="nav-item-badge">{tab.count}</span>
              )}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content active" id="panel-overview" role="tabpanel" style={{ display: activeTab === 'overview' ? 'block' : 'none' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--spacing-6)' }}>
          {/* Expertise */}
          <div className="card">
            <div className="card-header"><h2 className="card-title">Areas of Expertise</h2></div>
            <div className="card-content">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                {user.expertise.map((skill, i) => (
                  <span key={i} className="badge badge-primary">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="card">
            <div className="card-header"><h2 className="card-title">Certifications</h2></div>
            <div className="card-content">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                {user.certifications.map((cert, i) => (
                  <span key={i} className="badge badge-secondary">{cert}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Current Projects */}
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-header"><h2 className="card-title">Current Projects</h2></div>
            <div className="card-content">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                {user.currentProjects.map((project, i) => (
                  <span key={i} className="badge badge-accent">{project}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="card">
            <div className="card-header"><h2 className="card-title">Skills</h2></div>
            <div className="card-content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {user.skills.map((skill, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-1)' }}>
                      <span style={{ fontWeight: '500' }}>{skill.name}</span>
                      <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>{skill.level}%</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'var(--color-border-light)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{ width: `${skill.level}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))', borderRadius: 'var(--radius-full)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="tab-content" id="panel-requests" role="tabpanel" style={{ display: activeTab === 'requests' ? 'block' : 'none' }}>
        <div className="card">
          <div className="card-content" style={{ padding: 0 }}>
            {userRequests.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Opportunity</th>
                      <th scope="col">Host</th>
                      <th scope="col">Submitted</th>
                      <th scope="col">Status</th>
                      <th scope="col">Scheduled</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userRequests.map(request => {
                      const opp = shadowOpportunities.find(o => o.id === request.opportunityId);
                      const host = employees.find(e => e.id === request.hostId);
                      return (
                        <tr key={request.id}>
                          <td>
                            <div style={{ fontWeight: '500' }}>{opp?.title}</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{opp?.officeSymbol}</div>
                          </td>
                          <td>{host?.firstName} {host?.lastName}</td>
                          <td>{formatDate(request.submittedAt)}</td>
                          <td><span className={`badge ${getStatusBadge(request.status)}`}>{request.status}</span></td>
                          <td>{request.scheduledDate ? formatDate(request.scheduledDate) : '—'}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                              <button className="btn btn-ghost btn-sm" aria-label="View details">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                  <circle cx="12" cy="12" r="3"></circle>
                                </svg>
                              </button>
                              {request.status === 'Completed' && (
                                <button className="btn btn-ghost btn-sm" aria-label="View certificate">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                                    <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                                  </svg>
                                </button>
                              )}
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
                <div className="empty-state-icon">📝</div>
                <h3 className="empty-state-title">No requests yet</h3>
                <p className="empty-state-description">{isOwnProfile ? 'Browse opportunities to submit your first request.' : 'This user has not submitted any requests.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tab-content" id="panel-hosted" role="tabpanel" style={{ display: activeTab === 'hosted' ? 'block' : 'none' }}>
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="card-title">Hosted Opportunities</h2>
              {isOwnProfile && <button className="btn btn-primary btn-sm">Create Opportunity</button>}
            </div>
          </div>
          <div className="card-content" style={{ padding: 0 }}>
            {hostedOpportunities.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Title</th>
                      <th scope="col">Status</th>
                      <th scope="col">Capacity</th>
                      <th scope="col">Requests</th>
                      <th scope="col">Dates</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hostedOpportunities.map(opp => {
                      const reqCount = shadowRequests.filter(r => r.opportunityId === opp.id).length;
                      return (
                        <tr key={opp.id}>
                          <td style={{ fontWeight: '500' }}>{opp.title}</td>
                          <td><span className={`badge ${opp.status === 'Active' ? 'badge-success' : 'badge-secondary'}`}>{opp.status}</span></td>
                          <td>{opp.capacity}</td>
                          <td>{reqCount}</td>
                          <td>{opp.availableDates.length} available</td>
                          <td>
                            <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                              <button className="btn btn-ghost btn-sm" aria-label="Edit">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>
                              <button className="btn btn-ghost btn-sm" aria-label="View requests">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                  <polyline points="14 2 14 8 20 8"></polyline>
                                  <line x1="16" y1="13" x2="8" y2="13"></line>
                                  <line x1="16" y1="17" x2="8" y2="17"></line>
                                  <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                              </button>
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
                <div className="empty-state-icon">🎤</div>
                <h3 className="empty-state-title">No hosted opportunities</h3>
                <p className="empty-state-description">{isOwnProfile ? 'Create your first shadow opportunity to start hosting.' : 'This user is not currently hosting any opportunities.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tab-content" id="panel-certificates" role="tabpanel" style={{ display: activeTab === 'certificates' ? 'block' : 'none' }}>
        <div className="card">
          <div className="card-content" style={{ padding: 0 }}>
            {completedRequests.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-4)', padding: 'var(--spacing-4)' }}>
                {completedRequests.map(request => {
                  const opp = shadowOpportunities.find(o => o.id === request.opportunityId);
                  const host = employees.find(e => e.id === request.hostId);
                  const certNumber = `WIMS-${request.id.slice(-8).toUpperCase()}`;
                  return (
                    <div key={request.id} className="certificate-preview" style={{ 
                      border: '2px solid var(--color-border-light)', 
                      borderRadius: 'var(--radius-lg)', 
                      padding: 'var(--spacing-4)',
                      background: 'linear-gradient(135deg, var(--color-bg-card) 0%, var(--color-bg-secondary) 100%)',
                      position: 'relative'
                    }}>
                      <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-4)' }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--spacing-1)' }}>Certificate of Completion</div>
                        <div style={{ fontSize: 'var(--text-lg)', fontWeight: '700', color: 'var(--color-text-primary)' }}>{opp?.title}</div>
                      </div>
                      <div style={{ borderTop: '1px solid var(--color-border-light)', borderBottom: '1px solid var(--color-border-light)', padding: 'var(--spacing-3) 0', marginBottom: 'var(--spacing-3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                          <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>Presented to</span>
                          <span style={{ fontWeight: '600' }}>{user.firstName} {user.lastName}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-2)' }}>
                          <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>Hosted by</span>
                          <span style={{ fontWeight: '600' }}>{host?.firstName} {host?.lastName}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>Date</span>
                          <span style={{ fontWeight: '600' }}>{formatDate(request.scheduledDate)}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                        <span>Cert #{certNumber}</span>
                        <button className="btn btn-ghost btn-sm">Download</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 'var(--spacing-12)' }}>
                <div className="empty-state-icon">🎓</div>
                <h3 className="empty-state-title">No certificates yet</h3>
                <p className="empty-state-description">{isOwnProfile ? 'Complete shadow sessions to earn certificates.' : 'This user has not earned any certificates yet.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="tab-content" id="panel-feedback" role="tabpanel" style={{ display: activeTab === 'feedback' ? 'block' : 'none' }}>
        <div className="card">
          <div className="card-header"><h2 className="card-title">Feedback Received</h2></div>
          <div className="card-content">
            {completedRequests.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                {completedRequests.map(request => {
                  const opp = shadowOpportunities.find(o => o.id === request.opportunityId);
                  // Mock feedback
                  return (
                    <div key={request.id} style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
                        <h4 style={{ fontWeight: '600' }}>{opp?.title}</h4>
                        <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                          {[1,2,3,4,5].map(star => (
                            <span key={star} style={{ color: 'var(--color-warning)' }}>★</span>
                          ))}
                        </div>
                      </div>
                      <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic', marginBottom: 'var(--spacing-3)' }}>
                        "This was an incredibly valuable experience. The host was knowledgeable and welcoming..."
                      </p>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                        Submitted {formatDate(request.scheduledDate)} • Anonymous
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 'var(--spacing-8)' }}>
                <p className="empty-state-description">No feedback available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusBadge(status) {
  switch (status) {
    case 'Approved': case 'Scheduled': case 'Completed': return 'badge-success';
    case 'Denied': case 'Cancelled': return 'badge-error';
    case 'Pending Review': case 'Submitted': return 'badge-warning';
    default: return 'badge-secondary';
  }
}