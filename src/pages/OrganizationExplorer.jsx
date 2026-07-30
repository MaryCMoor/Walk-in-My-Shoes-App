import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { organizations, shadowOpportunities, employees } from '../data/mockData';
import OrganizationTreeView from '../components/OrganizationTreeView';

export default function OrganizationExplorer() {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const [selectedOrgId, setSelectedOrgId] = useState(null);

  const selectedOrg = organizations.find(o => o.id === selectedOrgId);

  const getOrgColor = (type) => {
    switch (type) {
      case 'Agency': return 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))';
      case 'Directorate': return 'linear-gradient(135deg, var(--color-secondary), var(--color-secondary-dark))';
      case 'Division': return 'linear-gradient(135deg, var(--color-accent), var(--color-accent-dark))';
      case 'Branch': return 'linear-gradient(135deg, var(--color-success), var(--color-success-light))';
      default: return 'linear-gradient(135deg, var(--color-text-tertiary), var(--color-text-muted))';
    }
  };

  const getOrgIcon = (type) => {
    switch (type) {
      case 'Agency': return '🏛️';
      case 'Directorate': return '🏢';
      case 'Division': return '🏬';
      case 'Branch': return '🏪';
      default: return '📁';
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'Agency': return 'badge-primary';
      case 'Directorate': return 'badge-secondary';
      case 'Division': return 'badge-accent';
      case 'Branch': return 'badge-success';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--spacing-4)' }}>
        <div>
          <h1 className="page-title">Organization Explorer</h1>
          <p className="page-subtitle">Navigate the organizational hierarchy and discover shadow opportunities</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: 'var(--spacing-6)' }}>
        {/* Left Panel - Tree */}
        <div className="card" style={{ height: 'calc(100vh - var(--header-height) - 200px)', display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <h2 className="card-title">Organization Tree</h2>
          </div>
          <div className="card-content" style={{ padding: 0, flex: 1, overflow: 'hidden' }}>
            <OrganizationTreeView onSelectOrg={setSelectedOrgId} />
          </div>
        </div>

        {/* Right Panel - Details */}
        <div>
          {selectedOrg ? (
            <>
              {/* Organization Header */}
              <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
                <div className="card-content" style={{ display: 'flex', gap: 'var(--spacing-6)', flexWrap: 'wrap' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: 'var(--radius-xl)',
                    background: getOrgColor(selectedOrg.type),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 'var(--text-3xl)',
                    fontWeight: '700',
                    flexShrink: 0
                  }}>
                    {getOrgIcon(selectedOrg.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                      <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: '700' }}>{selectedOrg.name}</h2>
                      <span className="badge badge-secondary">{selectedOrg.abbreviation}</span>
                      <span className={'badge ' + getTypeBadge(selectedOrg.type)}>{selectedOrg.type}</span>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-3)' }}>{selectedOrg.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                      <div><strong>Location:</strong> {selectedOrg.location}</div>
                      <div><strong>Employees:</strong> {selectedOrg.employeeCount?.toLocaleString() || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="kpi-grid" style={{ marginBottom: 'var(--spacing-6)' }}>
                <div className="kpi-card">
                  <div className="kpi-card-header"><div className="kpi-card-icon primary">📋</div></div>
                  <div className="kpi-card-value">{shadowOpportunities.filter(o => o.organizationId === selectedOrg.id || o.directorateId === selectedOrg.id || o.divisionId === selectedOrg.id || o.branchId === selectedOrg.id).length}</div>
                  <div className="kpi-card-label">Total Opportunities</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-card-header"><div className="kpi-card-icon success">✅</div></div>
                  <div className="kpi-card-value">{shadowOpportunities.filter(o => o.status === 'Active' && (o.organizationId === selectedOrg.id || o.directorateId === selectedOrg.id || o.divisionId === selectedOrg.id || o.branchId === selectedOrg.id)).length}</div>
                  <div className="kpi-card-label">Active Opportunities</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-card-header"><div className="kpi-card-icon secondary">👤</div></div>
                  <div className="kpi-card-value">{employees.filter(e => e.organizationId === selectedOrg.id).length}</div>
                  <div className="kpi-card-label">Employees</div>
                </div>
                <div className="kpi-card">
                  <div className="kpi-card-header"><div className="kpi-card-icon accent">⭐</div></div>
                  <div className="kpi-card-value">{employees.filter(e => e.role === 'Host' && e.organizationId === selectedOrg.id).length}</div>
                  <div className="kpi-card-label">Available Hosts</div>
                </div>
              </div>

              {/* Tabs for details */}
              <div className="tabs" role="tablist">
                {['opportunities', 'hosts', 'members', 'children'].map(tab => (
                  <button
                    key={tab}
                    role="tab"
                    className="tab"
                    onClick={() => {}}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Opportunities */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Shadow Opportunities</h2>
                </div>
                <div className="card-content">
                  {(() => {
                    const orgOpps = shadowOpportunities.filter(o => 
                      o.organizationId === selectedOrg.id || 
                      o.directorateId === selectedOrg.id || 
                      o.divisionId === selectedOrg.id || 
                      o.branchId === selectedOrg.id
                    );
                    
                    if (orgOpps.length === 0) {
                      return (
                        <div className="empty-state" style={{ padding: 'var(--spacing-8)' }}>
                          <div className="empty-state-icon">📋</div>
                          <p className="empty-state-description">No shadow opportunities in this organization yet.</p>
                        </div>
                      );
                    }
                    
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                        {orgOpps.map(opp => (
                          <div key={opp.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
                            <div className="kpi-card-icon secondary" style={{ width: '40px', height: '40px', fontSize: 'var(--text-lg)' }}>
                              {opp.leadershipLevel ? '⭐' : '📋'}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontWeight: '600', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {opp.title}
                              </div>
                              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                                {opp.hostInfo.name + ' \u2022 ' + opp.remainingSeats + '/' + opp.capacity + ' seats'}
                              </div>
                            </div>
                            <span className={'badge ' + (opp.status === 'Active' ? 'badge-success' : 'badge-secondary')}>{opp.status}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </>
          ) : (
            <div className="card" style={{ height: 'calc(100vh - var(--header-height) - 200px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="empty-state">
                <div className="empty-state-icon">🏢</div>
                <h3 className="empty-state-title">Select an Organization</h3>
                <p className="empty-state-description">Choose an organization from the tree to view details, opportunities, hosts, and members.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
