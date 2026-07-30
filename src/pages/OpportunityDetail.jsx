import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { shadowOpportunities, organizations, employees } from '../data/mockData';
import { formatDate, formatRelativeTime } from '../utils/formatters';

export default function OpportunityDetail() {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const [activeTab, setActiveTab] = useState('overview');
  
  // In a real app, this would come from URL params
  const opportunity = shadowOpportunities[0]; // Default to first for demo
  const host = employees.find(e => e.id === opportunity.hostId);
  const hostOrg = organizations.find(o => o.id === opportunity.organizationId);
  const directorate = organizations.find(o => o.id === opportunity.directorateId);
  const division = organizations.find(o => o.id === opportunity.divisionId);
  const branch = organizations.find(o => o.id === opportunity.branchId);
  
  const isSaved = currentUser?.savedOpportunities?.includes(opportunity.id);
  const userRequest = currentUser ? shadowOpportunities[0] : null; // Would check requests
  const canRequest = opportunity.remainingSeats > 0 && currentUser?.role === 'Employee';
  const hasApplied = false; // Would check actual requests

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📋' },
    { id: 'agenda', label: 'Agenda', icon: '📅' },
    { id: 'details', label: 'Details', icon: 'ℹ️' },
    { id: 'host', label: 'Host', icon: '👤' },
    { id: 'faq', label: 'FAQ', icon: '❓' }
  ];

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <nav style={{ marginBottom: 'var(--spacing-4)' }} aria-label="Breadcrumb">
        <ol style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
          <li><a href="#" onClick={(e) => { e.preventDefault(); actions.setActivePage('opportunities'); }} style={{ color: 'var(--color-secondary)' }}>Opportunities</a></li>
          <li style={{ color: 'var(--color-text-muted)' }}>/</li>
          <li aria-current="page" style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>{opportunity.title}</li>
        </ol>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 'var(--spacing-6)' }}>
        {/* Main Content */}
        <div>
          {/* Header */}
          <div style={{ marginBottom: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                  {opportunity.leadershipLevel && <span className="badge badge-accent">★ Leadership Shadow</span>}
                  {opportunity.featured && <span className="badge badge-primary">Featured</span>}
                  {opportunity.virtualOption && <span className="badge badge-secondary">Virtual Option Available</span>}
                  <span className={`badge ${getLevelBadge(opportunity.experienceLevel)}`}>{opportunity.experienceLevel}</span>
                </div>
                <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-1)' }}>
                  {opportunity.title}
                </h1>
                <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-lg)' }}>
                  {opportunity.hostInfo.name} • {opportunity.hostInfo.organization}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                <button
                  className={`btn btn-ghost ${isSaved ? 'text-warning' : ''}`}
                  onClick={() => isSaved ? actions.unsaveOpportunity(opportunity.id) : actions.saveOpportunity(opportunity.id)}
                  aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>
                <button className="btn btn-ghost" aria-label="Share opportunity">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>{opportunity.availableDates.length} available dates</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span>{opportunity.duration}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span style={{ fontWeight: '600', color: opportunity.remainingSeats > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                  {opportunity.remainingSeats}/{opportunity.capacity} seats
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{opportunity.location}</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="tabs" role="tablist">
            {tabs.map(tab => (
              <button
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
                className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                  <span>{tab.icon}</span>
                  {tab.label}
                </span>
              </button>
            ))}
          </div>

          {/* Tab Panels */}
          <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" className={`tab-content ${activeTab === 'overview' ? 'active' : ''}`}>
            <div className="card" style={{ marginBottom: 'var(--spacing-4)' }}>
              <div className="card-header"><h2 className="card-title">Description</h2></div>
              <div className="card-content">
                <p style={{ lineHeight: 1.7, color: 'var(--color-text-secondary)' }}>{opportunity.description}</p>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 'var(--spacing-4)' }}>
              <div className="card-header"><h2 className="card-title">Objectives</h2></div>
              <div className="card-content">
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  {opportunity.objectives.map((obj, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                      <span style={{ flexShrink: 0, width: '24px', height: '24px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 'var(--text-xs)', fontWeight: '700' }}>{i + 1}</span>
                      <span style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 'var(--spacing-4)' }}>
              <div className="card-header"><h2 className="card-title">What You Will Learn</h2></div>
              <div className="card-content">
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  {opportunity.whatYouWillLearn.map((item, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div id="panel-agenda" role="tabpanel" aria-labelledby="tab-agenda" className={`tab-content ${activeTab === 'agenda' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-header"><h2 className="card-title">Detailed Agenda</h2></div>
              <div className="card-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  {opportunity.agenda.map((item, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      gap: 'var(--spacing-4)',
                      padding: 'var(--spacing-4)',
                      backgroundColor: 'var(--color-bg-secondary)',
                      borderRadius: 'var(--radius-md)',
                      borderLeft: '4px solid var(--color-secondary)'
                    }}>
                      <div style={{ 
                        flexShrink: 0, 
                        width: '80px', 
                        fontWeight: '600', 
                        color: 'var(--color-secondary)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'var(--text-sm)'
                      }}>
                        {item.time}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>{item.activity}</div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 'var(--spacing-1)' }}>
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                          {item.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div id="panel-details" role="tabpanel" aria-labelledby="tab-details" className={`tab-content ${activeTab === 'details' ? 'active' : ''}`}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-4)' }}>
              <div className="card">
                <div className="card-header"><h2 className="card-title">Prerequisites</h2></div>
                <div className="card-content">
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    {opportunity.prerequisites.map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-2)', color: 'var(--color-text-secondary)' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="card">
                <div className="card-header"><h2 className="card-title">Security Requirements</h2></div>
                <div className="card-content">
                  <p style={{ color: 'var(--color-text-secondary)' }}>{opportunity.securityRequirements}</p>
                </div>
              </div>

              <div className="card">
                <div className="card-header"><h2 className="card-title">Dress Code</h2></div>
                <div className="card-content">
                  <p style={{ color: 'var(--color-text-secondary)' }}>{opportunity.dressCode}</p>
                </div>
              </div>

              <div className="card">
                <div className="card-header"><h2 className="card-title">Organization Details</h2></div>
                <div className="card-content">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    <div><strong>Directorate:</strong> {directorate?.name || 'N/A'}</div>
                    <div><strong>Division:</strong> {division?.name || 'N/A'}</div>
                    <div><strong>Branch:</strong> {branch?.name || 'N/A'}</div>
                    <div><strong>Office Symbol:</strong> {opportunity.officeSymbol}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="panel-host" role="tabpanel" aria-labelledby="tab-host" className={`tab-content ${activeTab === 'host' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-content" style={{ display: 'flex', gap: 'var(--spacing-6)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 'var(--text-3xl)',
                    fontWeight: '700',
                    margin: '0 auto var(--spacing-4)'
                  }}>
                    {host?.firstName[0]}{host?.lastName[0]}
                  </div>
                  <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: '600' }}>{host?.firstName} {host?.lastName}</h3>
                  <p style={{ color: 'var(--color-secondary)', fontWeight: '500' }}>{host?.position}</p>
                  <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>{host?.organization}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-3)' }}>Biography</h4>
                  <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, marginBottom: 'var(--spacing-4)' }}>{host?.biography}</p>
                  
                  <div style={{ marginBottom: 'var(--spacing-4)' }}>
                    <h5 style={{ fontWeight: '600', marginBottom: 'var(--spacing-2)' }}>Areas of Expertise</h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                      {host?.expertise.map((skill, i) => (
                        <span key={i} className="badge badge-primary">{skill}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 'var(--spacing-4)' }}>
                    <h5 style={{ fontWeight: '600', marginBottom: 'var(--spacing-2)' }}>Certifications</h5>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
                      {host?.certifications.map((cert, i) => (
                        <span key={i} className="badge badge-secondary">{cert}</span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-3)' }}>
                    <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Years Experience</div>
                      <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--color-text-primary)' }}>{host?.yearsExperience}</div>
                    </div>
                    <div style={{ padding: 'var(--spacing-3)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Grade</div>
                      <div style={{ fontSize: 'var(--text-xl)', fontWeight: '600', color: 'var(--color-text-primary)' }}>{host?.grade}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="panel-faq" role="tabpanel" aria-labelledby="tab-faq" className={`tab-content ${activeTab === 'faq' ? 'active' : ''}`}>
            <div className="card">
              <div className="card-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  {[
                    { q: 'Can I attend virtually?', a: opportunity.virtualOption ? 'Yes, this opportunity offers a virtual attendance option via Microsoft Teams. You will receive the meeting link upon approval.' : 'No, this opportunity requires in-person attendance only.' },
                    { q: 'What if I need to cancel?', a: 'You can cancel your request up to 48 hours before the scheduled date. Please notify the host as soon as possible so the seat can be offered to another participant.' },
                    { q: 'Is supervisor approval required?', a: 'Yes, all shadow requests require supervisor approval before they can be reviewed by the host.' },
                    { q: 'What should I bring?', a: 'Bring a notebook, pen, and your government ID badge. For field exercises, appropriate field gear is required as specified in the dress code.' },
                    { q: 'Will I receive a certificate?', a: 'Yes, upon successful completion you will receive a professional completion certificate with a unique certificate number.' },
                    { q: 'Can I request a specific date?', a: 'You can indicate your preferred date in the request form. The host will make the final scheduling decision based on availability.' }
                  ].map((faq, i) => (
                    <details key={i} style={{ border: '1px solid var(--color-border-light)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      <summary style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-bg-secondary)', cursor: 'pointer', fontWeight: '500', color: 'var(--color-text-primary)', listStyle: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        {faq.q}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </summary>
                      <div style={{ padding: 'var(--spacing-4)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>{faq.a}</div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Action Card */}
          <div className="card" style={{ position: 'sticky', top: 'calc(var(--header-height) + var(--spacing-6))', marginBottom: 'var(--spacing-6)' }}>
            <div className="card-header"><h2 className="card-title">Request Shadow</h2></div>
            <div className="card-content">
              {hasApplied ? (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-4)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', backgroundColor: 'rgb(5 150 105 / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--spacing-3)', color: 'var(--color-success)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h3 style={{ marginBottom: 'var(--spacing-1)' }}>Request Submitted</h3>
                  <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)' }}>Your request is pending review.</p>
                </div>
              ) : canRequest ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                  <button className="btn btn-primary btn-lg btn-block" onClick={() => { /* open request modal */ }}>
                    Submit Request
                  </button>
                  <button className="btn btn-outline btn-block" onClick={() => actions.saveOpportunity(opportunity.id)}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--spacing-2)' }}>
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                    {isSaved ? 'Saved' : 'Save for Later'}
                  </button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-4)', color: 'var(--color-text-tertiary)' }}>
                  <p style={{ marginBottom: 'var(--spacing-2)' }}>This opportunity is currently full.</p>
                  <button className="btn btn-ghost btn-sm">Join Waitlist</button>
                </div>
              )}

              <div style={{ marginTop: 'var(--spacing-4)', paddingTop: 'var(--spacing-4)', borderTop: '1px solid var(--color-border-light)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)', fontSize: 'var(--text-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-tertiary)' }}>Available Dates</span>
                    <span style={{ fontWeight: '600' }}>{opportunity.availableDates.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-tertiary)' }}>Next Available</span>
                    <span style={{ fontWeight: '600' }}>{formatDate(opportunity.availableDates[0])}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-tertiary)' }}>Duration</span>
                    <span style={{ fontWeight: '600' }}>{opportunity.duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Card */}
          <div className="card">
            <div className="card-header"><h2 className="card-title">Quick Info</h2></div>
            <div className="card-content">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Experience Level</div>
                  <span className={`badge ${getLevelBadge(opportunity.experienceLevel)}`}>{opportunity.experienceLevel}</span>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Skill Categories</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-1)' }}>
                    {opportunity.skillCategories.map(skill => (
                      <span key={skill} className="badge badge-secondary" style={{ fontSize: 'var(--text-xs)' }}>{skill}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Host Contact</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                    <div>{opportunity.hostInfo.email}</div>
                    <div>{opportunity.hostInfo.phone}</div>
                  </div>
                </div>
                {opportunity.virtualLink && (
                  <div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Virtual Link</div>
                    <a href={opportunity.virtualLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm btn-block">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--spacing-2)' }}>
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      Join Virtual Session
                    </a>
                  </div>
                )}
              </div>
            </div>
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