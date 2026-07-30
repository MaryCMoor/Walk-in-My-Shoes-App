import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { shadowRequests, shadowOpportunities, employees } from '../data/mockData';
import { formatDate, getInitials } from '../utils/formatters';

export default function ApprovalDashboard() {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState('');

  // Get opportunities hosted by current user
  const myOpportunities = useMemo(() => {
    if (!currentUser) return [];
    return shadowOpportunities.filter(o => o.hostId === currentUser.id);
  }, [currentUser]);

  // Get requests for my opportunities
  const myRequests = useMemo(() => {
    return shadowRequests.filter(r => 
      myOpportunities.some(o => o.id === r.opportunityId)
    );
  }, [myOpportunities]);

  const filteredRequests = useMemo(() => {
    let result = myRequests;
    if (statusFilter !== 'All') {
      result = result.filter(r => r.status === statusFilter);
    }
    return result.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  }, [myRequests, statusFilter]);

  const pendingCount = myRequests.filter(r => r.status === 'Pending Review' || r.status === 'Submitted').length;

  const statuses = ['All', 'Submitted', 'Pending Review', 'Approved', 'Denied', 'Scheduled', 'Completed', 'Cancelled'];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': case 'Scheduled': case 'Completed': return 'badge-success';
      case 'Denied': case 'Cancelled': return 'badge-error';
      case 'Pending Review': case 'Submitted': return 'badge-warning';
      default: return 'badge-secondary';
    }
  };

  const handleAction = (request, action) => {
    setSelectedRequest(request);
    setActionType(action);
    setShowModal(true);
  };

  const confirmAction = () => {
    if (!selectedRequest) return;
    
    let newStatus;
    switch (actionType) {
      case 'approve': newStatus = 'Approved'; break;
      case 'deny': newStatus = 'Denied'; break;
      case 'schedule': newStatus = 'Scheduled'; break;
      case 'more-info': newStatus = 'Pending Review'; break;
      default: return;
    }
    
    actions.updateRequestStatus(selectedRequest.id, newStatus);
    setShowModal(false);
    setSelectedRequest(null);
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--spacing-4)' }}>
        <div>
          <h1 className="page-title">Approval Dashboard</h1>
          <p className="page-subtitle">
            Review and manage shadow requests for your opportunities. {pendingCount} pending review{pendingCount !== 1 ? 's' : ''}.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
          <button className="btn btn-primary" onClick={() => actions.setActivePage('opportunities')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Opportunity
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="kpi-grid" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <div className="kpi-card-icon warning">⏳</div>
          </div>
          <div className="kpi-card-value">{pendingCount}</div>
          <div className="kpi-card-label">Pending Review</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <div className="kpi-card-icon success">✅</div>
          </div>
          <div className="kpi-card-value">{myRequests.filter(r => r.status === 'Approved' || r.status === 'Scheduled').length}</div>
          <div className="kpi-card-label">Approved</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <div className="kpi-card-icon secondary">👥</div>
          </div>
          <div className="kpi-card-value">{myRequests.length}</div>
          <div className="kpi-card-label">Total Requests</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <div className="kpi-card-icon primary">📋</div>
          </div>
          <div className="kpi-card-value">{myOpportunities.length}</div>
          <div className="kpi-card-label">Active Opportunities</div>
        </div>
      </div>

      {/* Status Filter */}
      <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)', flexWrap: 'wrap' }}>
        {statuses.map(status => (
          <button
            key={status}
            className={`btn ${statusFilter === status ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter(status)}
            style={{ fontSize: 'var(--text-sm)' }}
          >
            {status} {status !== 'All' && myRequests.filter(r => r.status === status).length > 0 && (
              <span className="nav-item-badge" style={{ fontSize: 'var(--text-xs)' }}>{myRequests.filter(r => r.status === status).length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      <div className="card">
        <div className="card-content" style={{ padding: 0 }}>
          {filteredRequests.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: '50px' }}>#</th>
                    <th scope="col">Applicant</th>
                    <th scope="col">Opportunity</th>
                    <th scope="col">Submitted</th>
                    <th scope="col">Status</th>
                    <th scope="col">Preferred Date</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request, index) => {
                    const opportunity = shadowOpportunities.find(o => o.id === request.opportunityId);
                    const applicant = employees.find(e => e.id === request.employeeId);
                    return (
                      <tr key={request.id}>
                        <td style={{ fontWeight: '600', color: 'var(--color-text-tertiary)' }}>{index + 1}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                            <div style={{
                              width: '32px', height: '32px', borderRadius: 'var(--radius-full)',
                              background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white', fontSize: 'var(--text-xs)', fontWeight: '600'
                            }}>
                              {getInitials(applicant?.firstName, applicant?.lastName)}
                            </div>
                            <div>
                              <div style={{ fontWeight: '500' }}>{applicant?.firstName} {applicant?.lastName}</div>
                              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{applicant?.position} • {applicant?.organizationId}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: '500' }}>{opportunity?.title}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{opportunity?.officeSymbol}</div>
                        </td>
                        <td>{formatDate(request.submittedAt)}</td>
                        <td><span className={`badge ${getStatusBadge(request.status)}`}>{request.status}</span></td>
                        <td>{request.preferredDate ? formatDate(request.preferredDate) : 'Flexible'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                            <button 
                              className="btn btn-ghost btn-sm" 
                              onClick={() => handleAction(request, 'approve')}
                              disabled={request.status !== 'Pending Review' && request.status !== 'Submitted'}
                              aria-label="Approve"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </button>
                            <button 
                              className="btn btn-ghost btn-sm" 
                              onClick={() => handleAction(request, 'deny')}
                              disabled={request.status !== 'Pending Review' && request.status !== 'Submitted'}
                              aria-label="Deny"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                            <button 
                              className="btn btn-ghost btn-sm" 
                              onClick={() => handleAction(request, 'more-info')}
                              disabled={request.status !== 'Pending Review' && request.status !== 'Submitted'}
                              aria-label="Request more info"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-warning)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                              </svg>
                            </button>
                            {(request.status === 'Approved' || request.status === 'Scheduled') && (
                              <button 
                                className="btn btn-ghost btn-sm" 
                                onClick={() => handleAction(request, 'schedule')}
                                aria-label="Schedule"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                  <line x1="16" y1="2" x2="16" y2="6"></line>
                                  <line x1="8" y1="2" x2="8" y2="6"></line>
                                  <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                              </button>
                            )}
                            <button className="btn btn-ghost btn-sm" aria-label="View details">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
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
              <div className="empty-state-icon">📋</div>
              <h3 className="empty-state-title">No requests found</h3>
              <p className="empty-state-description">
                {statusFilter !== 'All' ? 'Try changing your filter.' : 'No requests for your opportunities yet.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {showModal && selectedRequest && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {actionType === 'approve' ? 'Approve Request' : 
                 actionType === 'deny' ? 'Deny Request' : 
                 actionType === 'schedule' ? 'Schedule Session' : 'Request More Information'}
              </h2>
              <button className="modal-close" onClick={() => setShowModal(false)} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: 'var(--spacing-4)' }}>
                {actionType === 'approve' && 'Approve this request? The applicant will be notified and can be scheduled.'}
                {actionType === 'deny' && 'Deny this request? The applicant will be notified with the reason provided.'}
                {actionType === 'schedule' && 'Schedule this approved request for a specific date?'}
                {actionType === 'more-info' && 'Request additional information from the applicant?'}
              </p>
              
              {actionType === 'deny' && (
                <div className="form-group">
                  <label className="form-label required">Reason for denial</label>
                  <textarea className="form-textarea" placeholder="Provide a reason for denying this request..." rows={3} />
                </div>
              )}
              
              {actionType === 'more-info' && (
                <div className="form-group">
                  <label className="form-label required">Information needed</label>
                  <textarea className="form-textarea" placeholder="What additional information do you need from the applicant?" rows={3} />
                </div>
              )}
              
              {actionType === 'schedule' && (
                <div className="form-group">
                  <label className="form-label required">Scheduled Date</label>
                  <input type="date" className="form-input" />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className={`btn ${actionType === 'deny' ? 'btn-danger' : 'btn-primary'}`} onClick={confirmAction}>
                {actionType === 'approve' ? 'Approve' : actionType === 'deny' ? 'Deny' : actionType === 'schedule' ? 'Schedule' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}