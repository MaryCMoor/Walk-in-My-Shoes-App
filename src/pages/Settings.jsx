import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { employees, organizations, shadowOpportunities, shadowRequests } from '../data/mockData';

export default function Settings() {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const isAdmin = currentUser?.role === 'Administrator';
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'appearance', label: 'Appearance', icon: '🎨' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    ...(isAdmin ? [
      { id: 'users', label: 'User Management', icon: '👥' },
      { id: 'organizations', label: 'Organizations', icon: '🏢' },
      { id: 'system', label: 'System', icon: '🖥️' }
    ] : [])
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your preferences and application settings</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--spacing-6)' }}>
        {/* Settings Navigation */}
        <div className="card" style={{ height: 'fit-content', position: 'sticky', top: 'calc(var(--header-height) + var(--spacing-6))' }}>
          <div className="card-content" style={{ padding: 'var(--spacing-3)' }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--spacing-3)', 
                    width: '100%', 
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    border: 'none',
                    background: 'transparent',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-sm)',
                    fontWeight: '500',
                    color: activeTab === tab.id ? 'var(--color-secondary)' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <span style={{ fontSize: 'var(--text-lg)' }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div>
          {/* General */}
          <div className="tab-content" style={{ display: activeTab === 'general' ? 'block' : 'none' }}>
            <div className="card">
              <div className="card-header"><h2 className="card-title">General Settings</h2></div>
              <div className="card-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-4)' }}>Default View Preferences</h3>
                    <div className="form-group">
                      <label className="form-label">Default Page on Login</label>
                      <select className="form-select">
                        <option value="dashboard">Dashboard</option>
                        <option value="opportunities">Opportunities</option>
                        <option value="my-requests">My Requests</option>
                        <option value="calendar">Calendar</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Default Opportunity View</label>
                      <select className="form-select">
                        <option value="cards">Cards</option>
                        <option value="table">Table</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Items Per Page</label>
                      <select className="form-select">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--spacing-6)' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-4)' }}>Data & Privacy</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                        <div>
                          <div style={{ fontWeight: '500' }}>Save Search History</div>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Remember your search queries and filters</div>
                        </div>
                        <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--color-secondary)' }} />
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                        <div>
                          <div style={{ fontWeight: '500' }}>Analytics Tracking</div>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Allow anonymous usage analytics</div>
                        </div>
                        <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--color-secondary)' }} />
                      </label>
                      <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                        <div>
                          <div style={{ fontWeight: '500' }}>Auto-save Drafts</div>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Automatically save form drafts</div>
                        </div>
                        <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--color-secondary)' }} />
                      </label>
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--spacing-6)' }}>
                    <button className="btn btn-primary">Save Changes</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="tab-content" style={{ display: activeTab === 'appearance' ? 'block' : 'none' }}>
            <div className="card">
              <div className="card-header"><h2 className="card-title">Appearance</h2></div>
              <div className="card-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-4)' }}>Theme</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-4)' }}>
                      {['light', 'dark', 'system'].map(theme => (
                        <button
                          key={theme}
                          className={`btn btn-block ${state.theme === theme ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => actions.setTheme(theme)}
                          style={{ padding: 'var(--spacing-6)', textAlign: 'center' }}
                        >
                          <div style={{ fontSize: 'var(--text-3xl)', marginBottom: 'var(--spacing-2)' }}>
                            {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '💻'}
                          </div>
                          <div style={{ fontWeight: '600', textTransform: 'capitalize' }}>{theme}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                            {theme === 'light' && 'Light mode'}
                            {theme === 'dark' && 'Dark mode'}
                            {theme === 'system' && 'Match system'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--spacing-6)' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-4)' }}>Color Accent</h3>
                    <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
                      {['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#6366f1'].map(color => (
                        <button
                          key={color}
                          className={`btn btn-ghost ${state.accentColor === color ? 'ring-2 ring-offset-2' : ''}`}
                          onClick={() => actions.setAccentColor(color)}
                          style={{ 
                            width: '48px', 
                            height: '48px', 
                            borderRadius: 'var(--radius-full)', 
                            backgroundColor: color,
                            border: state.accentColor === color ? '3px solid white' : '2px solid var(--color-border-light)',
                            boxShadow: state.accentColor === color ? '0 0 0 3px var(--color-secondary)' : 'none'
                          }}
                          aria-label={`Accent color ${color}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--spacing-6)' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-4)' }}>Density</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--spacing-3)' }}>
                      {['comfortable', 'compact', 'spacious'].map(density => (
                        <button
                          key={density}
                          className={`btn ${state.density === density ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => actions.setDensity(density)}
                        >
                          {density.charAt(0).toUpperCase() + density.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--spacing-6)' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-4)' }}>Animations</h3>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontWeight: '500' }}>Enable Animations</div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Transitions, hover effects, and micro-interactions</div>
                      </div>
                      <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--color-secondary)' }} />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="tab-content" style={{ display: activeTab === 'notifications' ? 'block' : 'none' }}>
            <div className="card">
              <div className="card-header"><h2 className="card-title">Notification Preferences</h2></div>
              <div className="card-content">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                  <div>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-4)' }}>Email Notifications</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                      {[
                        { id: 'requestSubmitted', label: 'Request Submitted', desc: 'When you submit a shadow request' },
                        { id: 'requestApproved', label: 'Request Approved', desc: 'When your request is approved' },
                        { id: 'requestDenied', label: 'Request Denied', desc: 'When your request is denied' },
                        { id: 'requestScheduled', label: 'Session Scheduled', desc: 'When a session is scheduled for you' },
                        { id: 'sessionReminder', label: 'Session Reminders', desc: '24 hours before scheduled sessions' },
                        { id: 'feedbackRequest', label: 'Feedback Requests', desc: 'After completing a session' },
                        { id: 'newOpportunity', label: 'New Opportunities', desc: 'When matching opportunities are posted' },
                        { id: 'weeklyDigest', label: 'Weekly Digest', desc: 'Summary of new opportunities and updates' }
                      ].map(notif => (
                        <label key={notif.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                          <div>
                            <div style={{ fontWeight: '500' }}>{notif.label}</div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>{notif.desc}</div>
                          </div>
                          <input type="checkbox" defaultChecked={notif.id !== 'newOpportunity' && notif.id !== 'weeklyDigest'} style={{ width: '20px', height: '20px', accentColor: 'var(--color-secondary)' }} />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--spacing-6)' }}>
                    <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-4)' }}>In-App Notifications</h3>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontWeight: '500' }}>Show Notification Badge</div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Display count on notification bell</div>
                      </div>
                      <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--color-secondary)' }} />
                    </label>
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--spacing-6)' }}>
                    <button className="btn btn-primary">Save Notification Settings</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile */}
          <div className="tab-content" style={{ display: activeTab === 'profile' ? 'block' : 'none' }}>
            <div className="card">
              <div className="card-header"><h2 className="card-title">Profile Settings</h2></div>
              <div className="card-content">
                <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)', maxWidth: '600px' }}>
                  <div style={{ display: 'flex', gap: 'var(--spacing-6)' }}>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">First Name</label>
                      <input type="text" className="form-input" defaultValue={currentUser?.firstName} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Last Name</label>
                      <input type="text" className="form-input" defaultValue={currentUser?.lastName} />
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" defaultValue={currentUser?.email} />
                  </div>
                  <div>
                    <label className="form-label">Phone</label>
                    <input type="tel" className="form-input" defaultValue={currentUser?.phone} />
                  </div>
                  <div>
                    <label className="form-label">Position</label>
                    <input type="text" className="form-input" defaultValue={currentUser?.position} />
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-4)' }}>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Organization</label>
                      <select className="form-select" defaultValue={currentUser?.organizationId}>
                        {organizations.filter(o => o.type !== 'Agency').map(org => (
                          <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ flex: 1 }}>
                      <label className="form-label">Clearance Level</label>
                      <select className="form-select" defaultValue={currentUser?.clearanceLevel}>
                        <option value="Secret">Secret</option>
                        <option value="Top Secret">Top Secret</option>
                        <option value="Top Secret/SCI">Top Secret/SCI</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="form-label">Biography</label>
                    <textarea className="form-textarea" rows={4} defaultValue={currentUser?.biography} />
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap' }}>
                    {currentUser?.expertise.map((skill, i) => (
                      <span key={i} className="badge badge-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
                        {skill}
                        <button type="button" style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', padding: 0, fontSize: 'var(--text-xs)' }}>×</button>
                      </span>
                    ))}
                    <input type="text" className="form-input" placeholder="Add expertise (press Enter)" style={{ width: 'auto', flex: 1, minWidth: '200px' }} />
                  </div>
                  <div>
                    <button className="btn btn-primary">Save Profile</button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Admin: Users */}
          {isAdmin && (
            <div className="tab-content" style={{ display: activeTab === 'users' ? 'block' : 'none' }}>
              <div className="card">
                <div className="card-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="card-title">User Management</h2>
                    <button className="btn btn-primary btn-sm">Add User</button>
                  </div>
                </div>
                <div className="card-content" style={{ padding: 0 }}>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Email</th>
                          <th scope="col">Role</th>
                          <th scope="col">Organization</th>
                          <th scope="col">Status</th>
                          <th scope="col">Last Active</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map(emp => (
                          <tr key={emp.id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 'var(--text-xs)', fontWeight: '600' }}>
                                  {emp.firstName[0]}{emp.lastName[0]}
                                </div>
                                <div>
                                  <div style={{ fontWeight: '500' }}>{emp.firstName} {emp.lastName}</div>
                                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{emp.position}</div>
                                </div>
                              </div>
                            </td>
                            <td>{emp.email}</td>
                            <td><span className={`badge ${emp.role === 'Administrator' ? 'badge-error' : emp.role === 'Host' ? 'badge-primary' : 'badge-secondary'}`}>{emp.role}</span></td>
                            <td>{organizations.find(o => o.id === emp.organizationId)?.name}</td>
                            <td><span className="badge badge-success">Active</span></td>
                            <td style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>2 hours ago</td>
                            <td>
                              <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                                <button className="btn btn-ghost btn-sm" aria-label="Edit"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                                <button className="btn btn-ghost btn-sm" aria-label="Deactivate"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin: Organizations */}
          {isAdmin && (
            <div className="tab-content" style={{ display: activeTab === 'organizations' ? 'block' : 'none' }}>
              <div className="card">
                <div className="card-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="card-title">Organization Management</h2>
                    <button className="btn btn-primary btn-sm">Add Organization</button>
                  </div>
                </div>
                <div className="card-content" style={{ padding: 0 }}>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">Name</th>
                          <th scope="col">Abbreviation</th>
                          <th scope="col">Type</th>
                          <th scope="col">Parent</th>
                          <th scope="col">Location</th>
                          <th scope="col">Employees</th>
                          <th scope="col">Opportunities</th>
                          <th scope="col">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {organizations.filter(o => o.type !== 'Agency').map(org => (
                          <tr key={org.id}>
                            <td style={{ fontWeight: '500' }}>{org.name}</td>
                            <td><span className="badge badge-secondary">{org.abbreviation}</span></td>
                            <td><span className={`badge ${getOrgTypeBadge(org.type)}`}>{org.type}</span></td>
                            <td>{organizations.find(p => p.id === org.parentId)?.name || '—'}</td>
                            <td>{org.location}</td>
                            <td>{org.employeeCount?.toLocaleString() || '0'}</td>
                            <td>{shadowOpportunities.filter(o => o.organizationId === org.id).length}</td>
                            <td>
                              <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                                <button className="btn btn-ghost btn-sm" aria-label="Edit"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Admin: System */}
          {isAdmin && (
            <div className="tab-content" style={{ display: activeTab === 'system' ? 'block' : 'none' }}>
              <div className="card">
                <div className="card-header"><h2 className="card-title">System Settings</h2></div>
                <div className="card-content">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                    <div>
                      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-4)' }}>Application Configuration</h3>
                      <div className="form-group">
                        <label className="form-label">Application Name</label>
                        <input type="text" className="form-input" defaultValue="Walk In My Shoes" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Session Timeout (minutes)</label>
                        <input type="number" className="form-input" defaultValue="480" min="30" max="1440" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Max File Upload Size (MB)</label>
                        <input type="number" className="form-input" defaultValue="10" min="1" max="100" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Enable Public Registration</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
                            <input type="radio" name="publicReg" defaultChecked />
                            <span>Disabled (Invite Only)</span>
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
                            <input type="radio" name="publicReg" />
                            <span>Enabled</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--spacing-6)' }}>
                      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-4)' }}>Default Values</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)' }}>
                        <div className="form-group">
                          <label className="form-label">Default Opportunity Duration</label>
                          <select className="form-select">
                            <option value="2 hours">2 hours</option>
                            <option value="4 hours" selected>4 hours</option>
                            <option value="Full Day">Full Day</option>
                            <option value="Multi-Day">Multi-Day</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Default Capacity</label>
                          <input type="number" className="form-input" defaultValue="5" min="1" max="50" />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Require Supervisor Approval</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
                              <input type="radio" name="supervisorReq" defaultChecked />
                              <span>Yes</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
                              <input type="radio" name="supervisorReq" />
                              <span>No</span>
                            </label>
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Auto-assign Dates</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
                              <input type="radio" name="autoAssign" defaultChecked />
                              <span>Manual</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
                              <input type="radio" name="autoAssign" />
                              <span>Automatic</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--spacing-6)' }}>
                      <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-4)' }}>Data Management</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
                        <button className="btn btn-secondary">Export All Data</button>
                        <button className="btn btn-secondary">Import Data</button>
                        <button className="btn btn-danger">Reset Application</button>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: 'var(--spacing-6)' }}>
                      <button className="btn btn-primary">Save System Settings</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getOrgTypeBadge(type) {
  switch (type) {
    case 'Agency': return 'badge-primary';
    case 'Directorate': return 'badge-secondary';
    case 'Division': return 'badge-accent';
    case 'Branch': return 'badge-success';
    default: return 'badge-secondary';
  }
}