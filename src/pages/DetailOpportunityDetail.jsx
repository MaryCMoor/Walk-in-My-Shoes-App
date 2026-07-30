import { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { detailOpportunities, organizations, employees } from '../data/mockData';
import { formatDate } from '../utils/formatters';

export default function DetailOpportunityDetail({ opportunityId }) {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  
  // Find the opportunity by ID from URL params or use first one as fallback
  const opportunity = useMemo(() => {
    return detailOpportunities.find(opp => opp.id === opportunityId) || detailOpportunities[0];
  }, [opportunityId]);

  if (!opportunity) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
          <h2>Detail Opportunity Not Found</h2>
          <button className="btn btn-primary" onClick={() => actions.setActivePage('detail-opportunities')}>
            Back to Detail Opportunities
          </button>
        </div>
      </div>
    );
  }

  const hostOrg = organizations.find(o => o.id === opportunity.organizationId);
  const hostDirectorate = organizations.find(o => o.id === opportunity.directorateId);
  const hostDivision = organizations.find(o => o.id === opportunity.divisionId);
  const hostBranch = organizations.find(o => o.id === opportunity.branchId);
  
  const availableSeats = opportunity.capacity - opportunity.filledPositions;
  const isSaved = currentUser?.savedOpportunities?.includes(opportunity.id);
  const userRequest = currentUser ? 
    state.requests?.find(r => r.opportunityId === opportunity.id && r.employeeId === currentUser.id) : null;

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <nav className="breadcrumb" style={{ marginBottom: 'var(--spacing-6)' }} aria-label="Breadcrumb">
        <ol style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
          <li><button className="btn btn-ghost btn-sm" onClick={() => actions.setActivePage('dashboard')}>Dashboard</button></li>
          <li style={{ color: 'var(--color-text-muted)' }}>/</li>
          <li><button className="btn btn-ghost btn-sm" onClick={() => actions.setActivePage('detail-opportunities')}>Detail Opportunities</button></li>
          <li style={{ color: 'var(--color-text-muted)' }}>/</li>
          <li aria-current="page" style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>
            {opportunity.title.length > 50 ? opportunity.title.substring(0, 50) + '...' : opportunity.title}
          </li>
        </ol>
      </nav>

      {/* Header Section */}
      <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="card-content" style={{ padding: 'var(--spacing-6)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                {opportunity.featured && (
                  <span className="badge badge-primary">Featured</span>
                )}
                <span className={`badge ${getDetailTypeBadge(opportunity.detailType)}`}>{opportunity.detailType}</span>
                {opportunity.virtualOption && (
                  <span className="badge badge-secondary">Virtual Option</span>
                )}
                {opportunity.returnToPosition && (
                  <span className="badge badge-success">Return to Position Guaranteed</span>
                )}
              </div>
              <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: 'var(--color-text-primary)', lineHeight: 1.2, marginBottom: 'var(--spacing-2)' }}>
                {opportunity.title}
              </h1>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-base)' }}>
                <span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', marginRight: 'var(--spacing-1)', verticalAlign: 'middle' }}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {opportunity.location}
                </span>
                <span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', marginRight: 'var(--spacing-1)', verticalAlign: 'middle' }}>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  {opportunity.duration} ({opportunity.durationMonths} months)
                </span>
                <span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', marginRight: 'var(--spacing-1)', verticalAlign: 'middle' }}>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  {opportunity.hostInfo.name} • {opportunity.hostInfo.organization}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', alignItems: 'flex-end' }}>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <button
                  className={`btn btn-ghost btn-icon ${isSaved ? 'text-warning' : ''}`}
                  onClick={() => {
                    if (isSaved) {
                      actions.unsaveOpportunity(opportunity.id);
                    } else {
                      actions.saveOpportunity(opportunity.id);
                    }
                  }}
                  aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
                <button className="btn btn-ghost btn-icon" aria-label="Share opportunity">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                </button>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                {currentUser && !userRequest && availableSeats > 0 && (
                  <button className="btn btn-primary" style={{ padding: 'var(--spacing-3) var(--spacing-6)' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--spacing-2)' }}>
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    Apply Now
                  </button>
                )}
                {userRequest && (
                  <span className={`badge ${getStatusBadge(userRequest.status)}`} style={{ fontSize: 'var(--text-base)', padding: 'var(--spacing-2) var(--spacing-4)' }}>
                    {userRequest.status}
                  </span>
                )}
                {currentUser && userRequest && (
                  <span className="badge badge-secondary" style={{ fontSize: 'var(--text-base)', padding: 'var(--spacing-2) var(--spacing-4)' }}>
                    Applied: {formatDate(userRequest.submittedAt)}
                  </span>
                )}
                {availableSeats === 0 && (
                  <span className="badge badge-error" style={{ fontSize: 'var(--text-base)', padding: 'var(--spacing-2) var(--spacing-4)' }}>
                    Full - Waitlist Available
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
            gap: 'var(--spacing-4)',
            padding: 'var(--spacing-4)',
            background: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-lg)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', color: availableSeats > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                {availableSeats}/{opportunity.capacity}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Positions Available</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--color-primary)' }}>
                {opportunity.durationMonths}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Months Duration</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--color-secondary)' }}>
                {opportunity.availableStartDates.length}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Available Start Dates</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--color-accent)' }}>
                {opportunity.skillCategories.length}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Skill Categories</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--spacing-6)' }}>
        <div>
          {/* Description */}
          <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
            <div className="card-header">
              <h2 className="card-title">About This Detail</h2>
            </div>
            <div className="card-content">
              <p style={{ fontSize: 'var(--text-base)', lineHeight: 1.7, color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>
                {opportunity.description}
              </p>
              
              {/* Organization Info */}
              <div style={{ marginTop: 'var(--spacing-6)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-border)' }}>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-3)' }}>Host Organization</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-3)' }}>
                  {hostOrg && (
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Organization</div>
                      <div style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>{hostOrg.name}</div>
                    </div>
                  )}
                  {hostDirectorate && (
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Directorate</div>
                      <div style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>{hostDirectorate.name}</div>
                    </div>
                  )}
                  {hostDivision && (
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Division</div>
                      <div style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>{hostDivision.name}</div>
                    </div>
                  )}
                  {hostBranch && (
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Branch</div>
                      <div style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>{hostBranch.name}</div>
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Office Symbol</div>
                    <div style={{ fontWeight: '500', color: 'var(--color-text-primary)', fontFamily: 'monospace' }}>{opportunity.officeSymbol}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Objectives & Learning */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-6)' }}>
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Objectives</h2>
              </div>
              <div className="card-content">
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {opportunity.objectives.map((obj, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)', paddingLeft: 'var(--spacing-1)' }}>
                      <div style={{ 
                        width: '24px', height: '24px', borderRadius: '50%', 
                        background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: '2px'
                      }}>
                        <span style={{ fontSize: 'var(--text-xs)', fontWeight: '700', color: 'white' }}>{idx + 1}</span>
                      </div>
                      <span style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">What You Will Learn</h2>
              </div>
              <div className="card-content">
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {opportunity.whatYouWillLearn.map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)', paddingLeft: 'var(--spacing-1)' }}>
                      <div style={{ 
                        width: '24px', height: '24px', borderRadius: '50%', 
                        background: 'linear-gradient(135deg, var(--color-accent), var(--color-info))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: '2px'
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
            <div className="card-header">
              <h2 className="card-title">Prerequisites</h2>
            </div>
            <div className="card-content">
              <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-3)' }}>
                {opportunity.prerequisites.map((prereq, idx) => (
                  <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Additional Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-6)' }}>
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Security & Requirements</h2>
              </div>
              <div className="card-content">
                <div style={{ marginBottom: 'var(--spacing-4)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Security Clearance</div>
                  <div style={{ color: 'var(--color-text-secondary)' }}>{opportunity.securityRequirements}</div>
                </div>
                <div style={{ marginBottom: 'var(--spacing-4)' }}>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Dress Code</div>
                  <div style={{ color: 'var(--color-text-secondary)' }}>{opportunity.dressCode}</div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Pay Status</div>
                  <div style={{ color: 'var(--color-text-secondary)' }}>{opportunity.payStatus}</div>
                </div>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">Host Contact</h2>
              </div>
              <div className="card-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 'var(--text-xl)', fontWeight: '600' }}>
                    {opportunity.hostInfo.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: 'var(--text-lg)', color: 'var(--color-text-primary)' }}>
                      {opportunity.hostInfo.name}
                    </div>
                    <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
                      {opportunity.hostInfo.position}
                    </div>
                    <div style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>
                      {opportunity.hostInfo.organization}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <a href={`mailto:${opportunity.hostInfo.email}`} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--spacing-2)' }}>
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                    {opportunity.hostInfo.email}
                  </a>
                  <a href={`tel:${opportunity.hostInfo.phone}`} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--spacing-2)' }}>
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                    {opportunity.hostInfo.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Skill Categories */}
          <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
            <div className="card-header">
              <h2 className="card-title">Skill Categories</h2>
            </div>
            <div className="card-content">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                {opportunity.skillCategories.map((cat, idx) => (
                  <span key={idx} className="skill-tag" style={{ background: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)' }}>
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Available Start Dates */}
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Available Start Dates</h2>
            </div>
            <div className="card-content">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                {opportunity.availableStartDates.map((date, idx) => (
                  <button key={idx} className="btn btn-outline" style={{ padding: 'var(--spacing-2) var(--spacing-4)' }}>
                    {formatDate(date)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Apply Card */}
          <div className="card" style={{ position: 'sticky', top: 'var(--spacing-6)', marginBottom: 'var(--spacing-6)' }}>
            <div className="card-header">
              <h2 className="card-title">Apply for Detail</h2>
            </div>
            <div className="card-content">
              {currentUser ? (
                userRequest ? (
                  <div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-4)' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Application Submitted</h3>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                      Status: <strong>{userRequest.status}</strong>
                    </p>
                    <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                      Submitted: {formatDate(userRequest.submittedAt)}
                    </p>
                  </div>
                ) : availableSeats > 0 ? (
                  <div>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                      Ready to serve in a new role and build cross-functional skills? Submit your application for this {opportunity.durationMonths}-month detail assignment.
                    </p>
                    <button className="btn btn-primary" style={{ width: '100%', padding: 'var(--spacing-3)' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--spacing-2)' }}>
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      Apply Now
                    </button>
                    <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textAlign: 'center', marginTop: 'var(--spacing-3)' }}>
                      Requires supervisor approval
                    </p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--color-bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-4)' }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>
                    </div>
                    <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Positions Filled</h3>
                    <p style={{ color: 'var(--color-text-secondary)' }}>
                      All {opportunity.capacity} positions are currently filled.
                    </p>
                    <button className="btn btn-outline" style={{ marginTop: 'var(--spacing-4)', width: '100%' }}>
                      Join Waitlist
                    </button>
                  </div>
                )
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>
                  <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-4)' }}>
                    Please log in to apply for detail opportunities.
                  </p>
                  <button className="btn btn-primary" style={{ width: '100%' }}>
                    Log In to Apply
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Key Details Card */}
          <div className="card" style={{ position: 'sticky', top: 'calc(var(--spacing-6) + 400px)' }}>
            <div className="card-header">
              <h2 className="card-title">Key Details</h2>
            </div>
            <div className="card-content">
              <dl style={{ display: 'grid', gap: 'var(--spacing-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border)' }}>
                  <dt style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>Experience Level</dt>
                  <dd style={{ fontWeight: '500' }}><span className={`badge ${getLevelBadge(opportunity.experienceLevel)}`}>{opportunity.experienceLevel}</span></dd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border)' }}>
                  <dt style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>Detail Type</dt>
                  <dd style={{ fontWeight: '500' }}><span className={`badge ${getDetailTypeBadge(opportunity.detailType)}`}>{opportunity.detailType}</span></dd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border)' }}>
                  <dt style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>Duration</dt>
                  <dd style={{ fontWeight: '500' }}>{opportunity.duration}</dd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border)' }}>
                  <dt style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>Return to Position</dt>
                  <dd style={{ fontWeight: '500' }}>{opportunity.returnToPosition ? 'Yes' : 'No'}</dd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border)' }}>
                  <dt style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>Virtual Option</dt>
                  <dd style={{ fontWeight: '500' }}>{opportunity.virtualOption ? 'Yes' : 'No'}</dd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 'var(--spacing-3)', borderBottom: '1px solid var(--color-border)' }}>
                  <dt style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>Status</dt>
                  <dd style={{ fontWeight: '500' }}><span className="badge badge-success">{opportunity.status}</span></dd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <dt style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>Posted</dt>
                  <dd style={{ fontWeight: '500', color: 'var(--color-text-secondary)' }}>{formatDate(opportunity.createdAt)}</dd>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <dt style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>Updated</dt>
                  <dd style={{ fontWeight: '500', color: 'var(--color-text-secondary)' }}>{formatDate(opportunity.updatedAt)}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getDetailTypeBadge(type) {
  switch (type) {
    case 'Rotational': return 'badge-primary';
    case 'Operational': return 'badge-accent';
    case 'Strategic': return 'badge-warning';
    case 'Innovation': return 'badge-info';
    default: return 'badge-secondary';
  }
}

function getLevelBadge(level) {
  switch (level) {
    case 'All Levels': return 'badge-secondary';
    case 'Entry': return 'badge-success';
    case 'Intermediate': return 'badge-primary';
    case 'Advanced': return 'badge-warning';
    case 'Senior': return 'badge-accent';
    default: return 'badge-secondary';
  }
}

function getStatusBadge(status) {
  switch (status) {
    case 'Approved': return 'badge-success';
    case 'Pending': return 'badge-warning';
    case 'Rejected': return 'badge-error';
    case 'Cancelled': return 'badge-secondary';
    default: return 'badge-secondary';
  }
}