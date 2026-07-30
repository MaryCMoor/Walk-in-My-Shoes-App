import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { shadowRequests, shadowOpportunities, employees } from '../data/mockData';
import { formatDate, formatRelativeTime, getInitials } from '../utils/formatters';

export default function MyRequests() {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const myRequests = useMemo(() => {
    if (!currentUser) return [];
    return shadowRequests.filter(r => r.employeeId === currentUser.id);
  }, [currentUser]);

  const filteredRequests = useMemo(() => {
    let result = myRequests;
    if (statusFilter !== 'All') {
      result = result.filter(r => r.status === statusFilter);
    }
    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [myRequests, statusFilter, sortBy, sortDirection]);

  const statuses = ['All', 'Submitted', 'Pending Review', 'Approved', 'Denied', 'Scheduled', 'Completed', 'Cancelled'];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': case 'Scheduled': case 'Completed': return 'badge-success';
      case 'Denied': case 'Cancelled': return 'badge-error';
      case 'Pending Review': case 'Submitted': return 'badge-warning';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--spacing-4)' }}>
        <div>
          <h1 className="page-title">My Requests</h1>
          <p className="page-subtitle">
            Track the status of your shadow opportunity requests. {myRequests.length} total request{myRequests.length !== 1 ? 's' : ''}.
          </p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-6)', flexWrap: 'wrap' }}>
        {statuses.map(status => (
          <button
            key={status}
            className={`btn ${statusFilter === status ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setStatusFilter(status)}
            style={{ fontSize: 'var(--text-sm)' }}
          >
            {status}
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
                    <th scope="col" onClick={() => { if(sortBy==='title') setSortDirection(d=>d==='asc'?'desc':'asc'); else setSortBy('title'); }} style={{ cursor: 'pointer' }}>
                      Opportunity {sortBy==='title' && (sortDirection==='asc'?'↑':'↓')}
                    </th>
                    <th scope="col">Host</th>
                    <th scope="col" onClick={() => { if(sortBy==='submittedAt') setSortDirection(d=>d==='asc'?'desc':'asc'); else setSortBy('submittedAt'); }} style={{ cursor: 'pointer' }}>
                      Submitted {sortBy==='submittedAt' && (sortDirection==='asc'?'↑':'↓')}
                    </th>
                    <th scope="col">Status</th>
                    <th scope="col">Scheduled Date</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request, index) => {
                    const opportunity = shadowOpportunities.find(o => o.id === request.opportunityId);
                    const host = employees.find(e => e.id === request.hostId);
                    return (
                      <tr key={request.id}>
                        <td style={{ fontWeight: '600', color: 'var(--color-text-tertiary)' }}>{index + 1}</td>
                        <td>
                          <div style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>{opportunity?.title}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{opportunity?.officeSymbol}</div>
                        </td>
                        <td>
                          <div>{host?.firstName} {host?.lastName}</div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{host?.position}</div>
                        </td>
                        <td>{formatDate(request.submittedAt)}</td>
                        <td>
                          <span className={`badge ${getStatusBadge(request.status)}`}>{request.status}</span>
                        </td>
                        <td>
                          {request.scheduledDate ? (
                            <>
                              <div>{formatDate(request.scheduledDate)}</div>
                              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                                {formatRelativeTime(request.scheduledDate)}
                              </div>
                            </>
                          ) : (
                            <span style={{ color: 'var(--color-text-muted)' }}>Not scheduled</span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                            <button className="btn btn-ghost btn-sm" aria-label="View details">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </button>
                            {request.status === 'Approved' && (
                              <button className="btn btn-ghost btn-sm" aria-label="View certificate">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                                  <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                                </svg>
                              </button>
                            )}
                            {request.status === 'Completed' && (
                              <button className="btn btn-ghost btn-sm" aria-label="View feedback">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
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
              <div className="empty-state-icon">📋</div>
              <h3 className="empty-state-title">No requests found</h3>
              <p className="empty-state-description">
                {statusFilter !== 'All' ? 'Try changing your filter.' : 'You haven\'t submitted any shadow requests yet.'}
              </p>
              {statusFilter === 'All' && (
                <button className="btn btn-primary" onClick={() => actions.setActivePage('opportunities')}>
                  Browse Opportunities
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Request Details Modal would go here */}
    </div>
  );
}