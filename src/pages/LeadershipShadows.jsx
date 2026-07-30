import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { shadowOpportunities, employees, organizations, skillCategories, experienceLevels } from '../data/mockData';
import { formatDate } from '../utils/formatters';

export default function LeadershipShadows() {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const [viewMode, setViewMode] = useState('cards'); // 'cards', 'table'
  const [filterLevel, setFilterLevel] = useState('All');

  // Filter for leadership opportunities
  const leadershipOpportunities = useMemo(() => {
    return shadowOpportunities.filter(o => o.leadershipLevel);
  }, []);

  const filteredOpportunities = useMemo(() => {
    let result = leadershipOpportunities;
    if (filterLevel !== 'All') {
      result = result.filter(o => o.leadershipLevel === filterLevel);
    }
    return result.sort((a, b) => {
      const levelOrder = { 'Executive': 0, 'Director': 1, 'Deputy Director': 2, 'Division Chief': 3, 'Branch Chief': 4, 'Project Manager': 5, 'Technical Lead': 6 };
      return (levelOrder[a.leadershipLevel] || 99) - (levelOrder[b.leadershipLevel] || 99);
    });
  }, [leadershipOpportunities, filterLevel]);

  const leadershipLevels = ['All', 'Executive', 'Director', 'Deputy Director', 'Division Chief', 'Branch Chief', 'Project Manager', 'Technical Lead'];

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--spacing-4)' }}>
        <div>
          <h1 className="page-title">Leadership Shadow Opportunities</h1>
          <p className="page-subtitle">Exclusive shadow opportunities with senior leaders and executives across the organization</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <button className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setViewMode('cards')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"></rect>
              <rect x="14" y="3" width="7" height="7"></rect>
              <rect x="3" y="14" width="7" height="7"></rect>
              <rect x="14" y="14" width="7" height="7"></rect>
            </svg>
          </button>
          <button className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setViewMode('table')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="3" x2="21" y2="3"></line>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="3" y1="15" x2="21" y2="15"></line>
              <line x1="3" y1="21" x2="21" y2="21"></line>
              <line x1="3" y1="3" x2="3" y2="21"></line>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <line x1="15" y1="3" x2="15" y2="21"></line>
            </svg>
          </button>
        </div>
      </div>

      {/* Featured Leadership Stats */}
      <div className="kpi-grid" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="kpi-card featured">
          <div className="kpi-card-header">
            <div className="kpi-card-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>⭐</div>
          </div>
          <div className="kpi-card-value">{leadershipOpportunities.length}</div>
          <div className="kpi-card-label">Leadership Opportunities</div>
        </div>
        <div className="kpi-card featured">
          <div className="kpi-card-header">
            <div className="kpi-card-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>👑</div>
          </div>
          <div className="kpi-card-value">{leadershipOpportunities.filter(o => o.leadershipLevel === 'Executive' || o.leadershipLevel === 'Director').length}</div>
          <div className="kpi-card-label">Executive & Director Level</div>
        </div>
        <div className="kpi-card featured">
          <div className="kpi-card-header">
            <div className="kpi-card-icon" style={{ background: 'linear-gradient(135deg, #ec4899, #db2777)' }}>🎯</div>
          </div>
          <div className="kpi-card-value">{leadershipOpportunities.filter(o => o.remainingSeats > 0).length}</div>
          <div className="kpi-card-label">Currently Available</div>
        </div>
        <div className="kpi-card featured">
          <div className="kpi-card-header">
            <div className="kpi-card-icon" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>🏛️</div>
          </div>
          <div className="kpi-card-value">{new Set(leadershipOpportunities.map(o => o.organizationId)).size}</div>
          <div className="kpi-card-label">Organizations Represented</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)', flexWrap: 'wrap' }}>
        {leadershipLevels.map(level => (
          <button
            key={level}
            className={`btn ${filterLevel === level ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setFilterLevel(level)}
            style={{ fontSize: 'var(--text-sm)' }}
          >
            {level === 'All' ? 'All Levels' : level}
            <span className="nav-item-badge" style={{ fontSize: 'var(--text-xs)' }}>
              {leadershipOpportunities.filter(o => level === 'All' || o.leadershipLevel === level).length}
            </span>
          </button>
        ))}
      </div>

      {/* Opportunities Grid */}
      {viewMode === 'cards' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 'var(--spacing-6)' }}>
          {filteredOpportunities.map(opportunity => {
            const host = employees.find(e => e.id === opportunity.hostId);
            const org = organizations.find(o => o.id === opportunity.organizationId);
            const isSaved = currentUser?.savedOpportunities?.includes(opportunity.id);
            const canRequest = opportunity.remainingSeats > 0 && currentUser?.role === 'Employee';

            return (
              <article key={opportunity.id} className="card opportunity-card featured" style={{ 
                border: '2px solid var(--color-border-light)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Featured Badge */}
                {opportunity.featured && (
                  <div style={{ 
                    position: 'absolute', 
                    top: 'var(--spacing-3)', 
                    right: 'var(--spacing-3)',
                    zIndex: 10
                  }}>
                    <span className="badge badge-warning">⭐ Featured</span>
                  </div>
                )}

                {/* Leadership Level Badge */}
                <div style={{ 
                  position: 'absolute', 
                  top: 'var(--spacing-3)', 
                  left: 'var(--spacing-3)',
                  zIndex: 10
                }}>
                  <span className="badge badge-primary" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white' }}>
                    ★ {opportunity.leadershipLevel}
                  </span>
                </div>

                <div className="card-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  {/* Header */}
                  <div style={{ marginBottom: 'var(--spacing-4)' }}>
                    <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>
                      {opportunity.title}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', flexWrap: 'wrap', marginBottom: 'var(--spacing-2)' }}>
                      <span className={`badge ${getLevelBadge(opportunity.experienceLevel)}`}>{opportunity.experienceLevel}</span>
                      {opportunity.virtualOption && <span className="badge badge-secondary">🌐 Virtual Available</span>}
                      <span className="badge badge-accent">{opportunity.duration}</span>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                      {opportunity.description.substring(0, 150)}...
                    </p>
                  </div>

                  {/* Host Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-4)' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-full)',
                      background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 'var(--text-lg)',
                      fontWeight: '700'
                    }}>
                      {host?.firstName[0]}{host?.lastName[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{host?.firstName} {host?.lastName}</div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-secondary)', fontWeight: '500' }}>{host?.position}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{org?.name}</div>
                    </div>
                  </div>

                  {/* Learning Outcomes */}
                  <div style={{ marginBottom: 'var(--spacing-4)' }}>
                    <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: '600', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-2)' }}>What You'll Learn</h4>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                      {opportunity.whatYouWillLearn.slice(0, 3).map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                      {opportunity.whatYouWillLearn.length > 3 && (
                        <li style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                          +{opportunity.whatYouWillLearn.length - 3} more outcomes...
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Quick Stats */}
                  <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-border-light)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                      <span>{opportunity.remainingSeats}/{opportunity.capacity}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <span>{opportunity.availableDates.length} dates</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{opportunity.location}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginTop: 'auto' }}>
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => actions.setActivePage('opportunity-detail', { opportunityId: opportunity.id })}
                      disabled={!canRequest}
                    >
                      {canRequest ? 'Request Shadow' : 'Full'}
                    </button>
                    <button
                      className={`btn btn-ghost ${isSaved ? 'text-warning' : ''}`}
                      onClick={() => isSaved ? actions.unsaveOpportunity(opportunity.id) : actions.saveOpportunity(opportunity.id)}
                      aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="card">
          <div className="card-content" style={{ padding: 0 }}>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: '60px' }}>Level</th>
                    <th scope="col">Opportunity</th>
                    <th scope="col">Leader</th>
                    <th scope="col">Organization</th>
                    <th scope="col">Duration</th>
                    <th scope="col">Seats</th>
                    <th scope="col">Dates</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOpportunities.map(opportunity => {
                    const host = employees.find(e => e.id === opportunity.hostId);
                    const org = organizations.find(o => o.id === opportunity.organizationId);
                    const isSaved = currentUser?.savedOpportunities?.includes(opportunity.id);
                    const canRequest = opportunity.remainingSeats > 0 && currentUser?.role === 'Employee';

                    return (
                      <tr key={opportunity.id} style={{ borderLeft: '4px solid', borderLeftColor: getLevelColor(opportunity.leadershipLevel) }}>
                        <td>
                          <span className="badge badge-primary" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', fontSize: 'var(--text-xs)' }}>
                            ★ {opportunity.leadershipLevel}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: '600' }}>{opportunity.title}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{opportunity.officeSymbol}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                            <div style={{
                              width: '28px', height: '28px', borderRadius: 'var(--radius-full)',
                              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontSize: 'var(--text-xs)', fontWeight: '700'
                            }}>
                              {host?.firstName[0]}{host?.lastName[0]}
                            </div>
                            <div>
                              <div style={{ fontWeight: '500' }}>{host?.firstName} {host?.lastName}</div>
                              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{host?.position}</div>
                            </div>
                          </div>
                        </td>
                        <td>{org?.name}</td>
                        <td>{opportunity.duration}</td>
                        <td>
                          <span style={{ fontWeight: '600', color: opportunity.remainingSeats > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                            {opportunity.remainingSeats}/{opportunity.capacity}
                          </span>
                        </td>
                        <td>{opportunity.availableDates.length} available</td>
                        <td>
                          <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                            <button className="btn btn-primary btn-sm" onClick={() => actions.setActivePage('opportunity-detail', { opportunityId: opportunity.id })} disabled={!canRequest}>
                              {canRequest ? 'Request' : 'Full'}
                            </button>
                            <button className={`btn btn-ghost btn-sm ${isSaved ? 'text-warning' : ''}`} onClick={() => isSaved ? actions.unsaveOpportunity(opportunity.id) : actions.saveOpportunity(opportunity.id)} aria-label={isSaved ? 'Unsave' : 'Save'}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {filteredOpportunities.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
          <div className="empty-state-icon">⭐</div>
          <h3 className="empty-state-title">No leadership opportunities match your filter</h3>
          <p className="empty-state-description">Try adjusting your filter or check back later for new opportunities.</p>
        </div>
      )}

      {/* Leadership Spotlight */}
      <div className="card" style={{ marginTop: 'var(--spacing-6)' }}>
        <div className="card-header">
          <h2 className="card-title">Leadership Spotlight</h2>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-6)' }}>
            {[
              { title: 'Strategic Decision Making', desc: 'Learn how senior leaders approach complex organizational decisions, balance competing priorities, and navigate uncertainty.', icon: '🧭', color: 'var(--color-primary)' },
              { title: 'Cross-Functional Leadership', desc: 'Observe how leaders coordinate across directorates, divisions, and branches to achieve enterprise-wide objectives.', icon: '🤝', color: 'var(--color-secondary)' },
              { title: 'Innovation & Transformation', desc: 'Experience how executives drive innovation, manage change, and build cultures of continuous improvement.', icon: '🚀', color: 'var(--color-accent)' },
              { title: 'Talent Development', desc: 'See how leaders mentor, coach, and develop the next generation of organizational talent.', icon: '🌱', color: 'var(--color-success)' }
            ].map((spotlight, i) => (
              <div key={i} style={{ padding: 'var(--spacing-6)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', backgroundColor: `${spotlight.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-2xl)', marginBottom: 'var(--spacing-4)' }}>
                  {spotlight.icon}
                </div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-2)' }}>{spotlight.title}</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{spotlight.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getLevelBadge(level) {
  switch (level) {
    case 'Senior': return 'badge-error';
    case 'Advanced': return 'badge-warning';
    case 'Intermediate': return 'badge-primary';
    case 'Entry': return 'badge-success';
    default: return 'badge-secondary';
  }
}

function getLevelColor(level) {
  switch (level) {
    case 'Executive': return '#f59e0b';
    case 'Director': return '#8b5cf6';
    case 'Deputy Director': return '#ec4899';
    case 'Division Chief': return '#3b82f6';
    case 'Branch Chief': return '#10b981';
    case 'Project Manager': return '#06b6d4';
    case 'Technical Lead': return '#6366f1';
    default: return '#6b7280';
  }
}