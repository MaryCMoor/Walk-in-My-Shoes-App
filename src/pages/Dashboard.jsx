import { useApp } from '../context/AppContext';
import { useCurrentUser } from '../context/AppContext';
import { analytics, shadowOpportunities, shadowRequests, organizations } from '../data/mockData';
import { formatDate } from '../utils/formatters';

export default function Dashboard() {
  const { state, actions } = useApp();
  const currentUser = useCurrentUser();
  
  // Calculate KPIs based on user role
  const myRequests = shadowRequests.filter(r => r.employeeId === currentUser?.id);
  const pendingRequests = myRequests.filter(r => r.status === 'Pending Review' || r.status === 'Submitted').length;
  const approvedRequests = myRequests.filter(r => r.status === 'Approved' || r.status === 'Scheduled').length;
  const completedRequests = myRequests.filter(r => r.status === 'Completed').length;
  
  const hostedOpportunities = shadowOpportunities.filter(o => o.hostId === currentUser?.id);
  const activeHosted = hostedOpportunities.filter(o => o.status === 'Active').length;
  const myApplicants = shadowRequests.filter(r => hostedOpportunities.some(o => o.id === r.opportunityId));
  const pendingReview = myApplicants.filter(r => r.status === 'Pending Review' || r.status === 'Submitted').length;

  const kpis = currentUser?.role === 'Host' || currentUser?.role === 'Administrator' ? [
    { label: 'Active Opportunities', value: activeHosted, icon: '📋', color: 'primary', trend: '+2', trendPositive: true },
    { label: 'Pending Reviews', value: pendingReview, icon: '⏳', color: 'warning', trend: '+3', trendPositive: false },
    { label: 'Total Applicants', value: myApplicants.length, icon: '👥', color: 'secondary', trend: '+12%', trendPositive: true },
    { label: 'Completed Sessions', value: myApplicants.filter(r => r.status === 'Completed').length, icon: '✅', color: 'success', trend: '+5', trendPositive: true },
  ] : [
    { label: 'Pending Requests', value: pendingRequests, icon: '⏳', color: 'warning', trend: '+1', trendPositive: false },
    { label: 'Approved', value: approvedRequests, icon: '✅', color: 'success', trend: '+2', trendPositive: true },
    { label: 'Completed Shadows', value: completedRequests, icon: '🎓', color: 'primary', trend: '+3', trendPositive: true },
    { label: 'Saved Opportunities', value: currentUser?.savedOpportunities?.length || 0, icon: '💾', color: 'accent', trend: '+2', trendPositive: true },
  ];

  const upcomingSessions = myRequests
    .filter(r => r.scheduledDate && (r.status === 'Approved' || r.status === 'Scheduled'))
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
    .slice(0, 5);

  const recentOpportunities = shadowOpportunities
    .filter(o => o.status === 'Active')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">
          Welcome back, {currentUser?.firstName}. Here's what's happening with your shadow opportunities.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" role="region" aria-label="Key performance indicators">
        {kpis.map((kpi, index) => (
          <div key={kpi.label} className="kpi-card" style={{ animationDelay: `${index * 100}ms` }}>
            <div className="kpi-card-header">
              <div className={`kpi-card-icon ${kpi.color}`}>{kpi.icon}</div>
              <span className={`kpi-card-trend ${kpi.trendPositive ? 'positive' : 'negative'}`}>
                {kpi.trend}
              </span>
            </div>
            <div className="kpi-card-value">{kpi.value}</div>
            <div className="kpi-card-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 'var(--spacing-6)' }}>
        {/* Upcoming Sessions */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Upcoming Sessions</h2>
            <a href="#" onClick={(e) => { e.preventDefault(); actions.setActivePage('my-requests'); }} className="btn btn-ghost btn-sm">
              View All
            </a>
          </div>
          <div className="card-content">
            {upcomingSessions.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {upcomingSessions.map(request => {
                  const opportunity = shadowOpportunities.find(o => o.id === request.opportunityId);
                  return (
                    <div key={request.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-4)',
                      padding: 'var(--spacing-3)',
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-light)'
                    }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: request.status === 'Scheduled' ? 'var(--color-success)' : 'var(--color-secondary)'
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: '600', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {opportunity?.title}
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                          {formatDate(request.scheduledDate)} • {opportunity?.duration}
                        </div>
                      </div>
                      <span className={`badge ${request.status === 'Scheduled' ? 'badge-success' : 'badge-primary'}`}>
                        {request.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 'var(--spacing-8)' }}>
                <div className="empty-state-icon">📅</div>
                <p className="empty-state-description">No upcoming sessions scheduled. Browse opportunities to get started!</p>
                <button className="btn btn-primary" onClick={() => actions.setActivePage('opportunities')}>
                  Browse Opportunities
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Opportunities / Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              {currentUser?.role === 'Host' ? 'My Opportunities' : 'Recommended Opportunities'}
            </h2>
            <a href="#" onClick={(e) => { e.preventDefault(); actions.setActivePage('opportunities'); }} className="btn btn-ghost btn-sm">
              View All
            </a>
          </div>
          <div className="card-content">
            {recentOpportunities.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                {recentOpportunities.map(opp => (
                  <div key={opp.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-4)',
                    padding: 'var(--spacing-3)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-light)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }} onClick={() => { actions.setActivePage('opportunity-detail'); /* would need to pass opp id */ }}>
                    <div className="kpi-card-icon secondary" style={{ width: '40px', height: '40px', fontSize: 'var(--text-lg)' }}>
                      {opp.leadershipLevel ? '⭐' : '📋'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {opp.title}
                      </div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                        {opp.organizationId} • {opp.remainingSeats}/{opp.capacity} seats • {opp.duration}
                      </div>
                    </div>
                    <span className={`badge ${opp.featured ? 'badge-accent' : 'badge-secondary'}`}>
                      {opp.featured ? 'Featured' : 'Available'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 'var(--spacing-8)' }}>
                <div className="empty-state-icon">🔍</div>
                <p className="empty-state-description">No active opportunities at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Organization Participation / Quick Stats */}
      <div style={{ marginTop: 'var(--spacing-6)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--spacing-6)' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Organization Participation</h2>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {analytics.popularOrganizations.slice(0, 6).map((org, index) => (
                <div key={org.organization} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 'var(--text-xs)',
                    fontWeight: '700',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '500', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {org.organization}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                      {org.count} shadow requests
                    </div>
                  </div>
                  <div style={{
                    width: '60px',
                    height: '6px',
                    backgroundColor: 'var(--color-bg-tertiary)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(org.count / analytics.popularOrganizations[0].count) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))',
                      borderRadius: 'var(--radius-full)',
                      transition: 'width var(--transition-slow)'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Quick Actions</h2>
          </div>
          <div className="card-content">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--spacing-3)' }}>
              <button className="btn btn-outline" onClick={() => actions.setActivePage('opportunities')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span>Browse Opportunities</span>
              </button>
              <button className="btn btn-outline" onClick={() => actions.setActivePage('my-requests')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span>My Requests</span>
              </button>
              <button className="btn btn-outline" onClick={() => actions.setActivePage('calendar')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>View Calendar</span>
              </button>
              <button className="btn btn-outline" onClick={() => actions.setActivePage('organizations')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 21V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v13"></path>
                  <path d="M22 16.92V21"></path>
                  <path d="M12 2V6"></path>
                  <path d="M2 16.92V21"></path>
                  <path d="M12 22V16.92"></path>
                </svg>
                <span>Explore Orgs</span>
              </button>
              {currentUser?.role === 'Host' && (
                <>
                  <button className="btn btn-outline" onClick={() => actions.setActivePage('approval-dashboard')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 11l3 3L22 4"></path>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                    </svg>
                    <span>Review Requests</span>
                  </button>
                  <button className="btn btn-primary" onClick={() => actions.setActivePage('opportunities')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    <span>Create Opportunity</span>
                  </button>
                </>
              )}
              {currentUser?.role === 'Administrator' && (
                <>
                  <button className="btn btn-outline" onClick={() => actions.setActivePage('analytics')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"></line>
                      <line x1="12" y1="20" x2="12" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    <span>View Analytics</span>
                  </button>
                  <button className="btn btn-outline" onClick={() => actions.setActivePage('reports')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                      <polyline points="8 13 12 17 16 13"></polyline>
                      <line x1="12" y1="8" x2="12" y2="17"></line>
                    </svg>
                    <span>Export Reports</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Announcements */}
      {state.announcements.length > 0 && (
        <div className="card" style={{ marginTop: 'var(--spacing-6)' }}>
          <div className="card-header">
            <h2 className="card-title">Announcements</h2>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              {state.announcements.slice(0, 3).map(ann => (
                <div key={ann.id} style={{
                  padding: 'var(--spacing-4)',
                  backgroundColor: 'var(--color-bg-secondary)',
                  borderRadius: 'var(--radius-md)',
                  borderLeft: `4px solid ${ann.priority === 'High' ? 'var(--color-error)' : ann.priority === 'Medium' ? 'var(--color-warning)' : 'var(--color-secondary)'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-2)' }}>
                    <h3 style={{ fontSize: 'var(--text-base)', fontWeight: '600', color: 'var(--color-text-primary)' }}>{ann.title}</h3>
                    <span className={`badge ${ann.priority === 'High' ? 'badge-error' : ann.priority === 'Medium' ? 'badge-warning' : 'badge-primary'}`}>
                      {ann.priority}
                    </span>
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--spacing-2)' }}>{ann.content}</p>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                    {ann.author} • {formatDate(ann.date)} • Audience: {ann.audience}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}