import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { shadowRequests, shadowOpportunities, employees, organizations, analytics } from '../data/mockData';
import { formatDate } from '../utils/formatters';

export default function Reports() {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const isAdmin = currentUser?.role === 'Administrator';

  const [reportType, setReportType] = useState('opportunities');
  const [dateRange, setDateRange] = useState('all');
  const [format, setFormat] = useState('csv');

  const reportTypes = [
    { id: 'opportunities', label: 'Opportunities', icon: '📋', description: 'All shadow opportunities with details' },
    { id: 'requests', label: 'Requests', icon: '📝', description: 'All shadow requests and their statuses' },
    { id: 'participation', label: 'Participation', icon: '👥', description: 'Employee participation metrics' },
    { id: 'feedback', label: 'Feedback Summary', icon: '⭐', description: 'Aggregated feedback and ratings' },
    { id: 'completion', label: 'Completions', icon: '🎓', description: 'Completed sessions and certificates' },
    { id: 'organizations', label: 'Organizations', icon: '🏢', description: 'Organization-level participation' }
  ];

  const dateRanges = [
    { id: 'all', label: 'All Time' },
    { id: 'month', label: 'Last 30 Days' },
    { id: 'quarter', label: 'Last Quarter' },
    { id: 'year', label: 'Last Year' },
    { id: 'custom', label: 'Custom Range' }
  ];

  const generateReportData = () => {
    switch (reportType) {
      case 'opportunities':
        return shadowOpportunities.map(opp => {
          const host = employees.find(e => e.id === opp.hostId);
          const org = organizations.find(o => o.id === opp.organizationId);
          const reqCount = shadowRequests.filter(r => r.opportunityId === opp.id).length;
          return {
            'Opportunity ID': opp.id,
            Title: opp.title,
            Host: host ? `${host.firstName} ${host.lastName}` : 'N/A',
            'Host Position': host?.position || 'N/A',
            Organization: org?.name || 'N/A',
            Directorate: organizations.find(o => o.id === opp.directorateId)?.name || 'N/A',
            Division: organizations.find(o => o.id === opp.divisionId)?.name || 'N/A',
            Branch: organizations.find(o => o.id === opp.branchId)?.name || 'N/A',
            'Office Symbol': opp.officeSymbol,
            Location: opp.location,
            'Virtual Option': opp.virtualOption ? 'Yes' : 'No',
            Duration: opp.duration,
            Capacity: opp.capacity,
            'Remaining Seats': opp.remainingSeats,
            'Experience Level': opp.experienceLevel,
            'Leadership Level': opp.leadershipLevel || 'N/A',
            Status: opp.status,
            'Total Requests': reqCount,
            'Available Dates': opp.availableDates.length,
            'Skill Categories': opp.skillCategories.join('; '),
            Featured: opp.featured ? 'Yes' : 'No'
          };
        });

      case 'requests':
        return shadowRequests.map(req => {
          const opp = shadowOpportunities.find(o => o.id === req.opportunityId);
          const emp = employees.find(e => e.id === req.employeeId);
          const host = employees.find(e => e.id === req.hostId);
          return {
            'Request ID': req.id,
            'Opportunity': opp?.title || 'N/A',
            'Applicant': emp ? `${emp.firstName} ${emp.lastName}` : 'N/A',
            'Applicant Email': emp?.email || 'N/A',
            'Applicant Org': organizations.find(o => o.id === emp?.organizationId)?.name || 'N/A',
            Host: host ? `${host.firstName} ${host.lastName}` : 'N/A',
            'Submitted Date': formatDate(req.submittedAt),
            Status: req.status,
            'Preferred Date': req.preferredDate ? formatDate(req.preferredDate) : 'Flexible',
            'Scheduled Date': req.scheduledDate ? formatDate(req.scheduledDate) : 'Not scheduled',
            'Supervisor Approved': req.supervisorApproved ? 'Yes' : 'No',
            'Reason': req.reason,
            'Learning Objectives': req.learningObjectives,
            Feedback: req.feedbackSubmitted ? 'Submitted' : 'Pending'
          };
        });

      case 'participation':
        return employees.filter(e => e.role === 'Employee').map(emp => {
          const empRequests = shadowRequests.filter(r => r.employeeId === emp.id);
          const completed = empRequests.filter(r => r.status === 'Completed');
          const upcoming = empRequests.filter(r => r.status === 'Scheduled' || r.status === 'Approved');
          const org = organizations.find(o => o.id === emp.organizationId);
          return {
            'Employee ID': emp.id,
            Name: `${emp.firstName} ${emp.lastName}`,
            Position: emp.position,
            Organization: org?.name || 'N/A',
            Email: emp.email,
            'Total Requests': empRequests.length,
            Completed: completed.length,
            Upcoming: upcoming.length,
            'Avg Rating Given': empRequests.filter(r => r.feedbackSubmitted).length > 0 
              ? (empRequests.filter(r => r.feedbackSubmitted).reduce((sum, r) => sum + (r.feedback?.rating || 0), 0) / empRequests.filter(r => r.feedbackSubmitted).length).toFixed(1)
              : 'N/A',
            'First Request': empRequests.length > 0 ? formatDate(empRequests.sort((a,b) => new Date(a.submittedAt) - new Date(b.submittedAt))[0].submittedAt) : 'Never',
            'Last Request': empRequests.length > 0 ? formatDate(empRequests.sort((a,b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0].submittedAt) : 'Never'
          };
        });

      case 'feedback':
        const completedWithFeedback = shadowRequests.filter(r => r.status === 'Completed' && r.feedbackSubmitted);
        return completedWithFeedback.map(req => {
          const opp = shadowOpportunities.find(o => o.id === req.opportunityId);
          const emp = employees.find(e => e.id === req.employeeId);
          const host = employees.find(e => e.id === req.hostId);
          return {
            'Request ID': req.id,
            Opportunity: opp?.title || 'N/A',
            Participant: emp ? `${emp.firstName} ${emp.lastName}` : 'N/A',
            Host: host ? `${host.firstName} ${host.lastName}` : 'N/A',
            'Session Date': formatDate(req.scheduledDate),
            'Overall Rating': req.feedback?.rating || 'N/A',
            'Learning Value': req.feedback?.learningValue || 'N/A',
            'Host Effectiveness': req.feedback?.hostEffectiveness || 'N/A',
            'Would Recommend': req.feedback?.wouldRecommend ? 'Yes' : 'No',
            Comments: req.feedback?.comments || 'N/A',
            Suggestions: req.feedback?.suggestions || 'N/A'
          };
        });

      case 'completion':
        const completed = shadowRequests.filter(r => r.status === 'Completed');
        return completed.map(req => {
          const opp = shadowOpportunities.find(o => o.id === req.opportunityId);
          const emp = employees.find(e => e.id === req.employeeId);
          const host = employees.find(e => e.id === req.hostId);
          const certNumber = `WIMS-PAR-${req.id.slice(-8).toUpperCase()}`;
          return {
            'Certificate Number': certNumber,
            Opportunity: opp?.title || 'N/A',
            Participant: emp ? `${emp.firstName} ${emp.lastName}` : 'N/A',
            'Participant Email': emp?.email || 'N/A',
            Host: host ? `${host.firstName} ${host.lastName}` : 'N/A',
            Organization: organizations.find(o => o.id === emp?.organizationId)?.name || 'N/A',
            'Session Date': formatDate(req.scheduledDate),
            Duration: opp?.duration || 'N/A',
            Location: opp?.location || 'N/A',
            'Issue Date': formatDate(new Date().toISOString()),
            'Feedback Submitted': req.feedbackSubmitted ? 'Yes' : 'No'
          };
        });

      case 'organizations':
        return organizations.filter(o => o.type !== 'Agency').map(org => {
          const orgEmployees = employees.filter(e => e.organizationId === org.id);
          const orgOpps = shadowOpportunities.filter(o => 
            o.organizationId === org.id || o.directorateId === org.id || o.divisionId === org.id || o.branchId === org.id
          );
          const orgRequests = shadowRequests.filter(r => 
            orgOpps.some(o => o.id === r.opportunityId)
          );
          const completed = orgRequests.filter(r => r.status === 'Completed');
          return {
            'Organization ID': org.id,
            Name: org.name,
            Abbreviation: org.abbreviation,
            Type: org.type,
            Location: org.location,
            Employees: orgEmployees.length,
            Hosts: orgEmployees.filter(e => e.role === 'Host').length,
            'Total Opportunities': orgOpps.length,
            'Active Opportunities': orgOpps.filter(o => o.status === 'Active').length,
            'Total Requests': orgRequests.length,
            Completed: completed.length,
            'Completion Rate': orgRequests.length > 0 ? ((completed.length / orgRequests.length) * 100).toFixed(1) + '%' : '0%',
            'Avg Session Duration': orgOpps.length > 0 ? orgOpps.reduce((sum, o) => sum + (parseInt(o.duration) || 0), 0) / orgOpps.length + ' hours' : 'N/A'
          };
        });

      default:
        return [];
    }
  };

  const reportData = generateReportData();

  const exportCSV = () => {
    if (reportData.length === 0) return;
    const headers = Object.keys(reportData[0]);
    const rows = reportData.map(obj => headers.map(h => `"${String(obj[h] || '').replace(/"/g, '""')}"`).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wims-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const exportJSON = () => {
    const json = JSON.stringify(reportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `wims-${reportType}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const printReport = () => {
    const printWindow = window.open('', '_blank');
    const headers = reportData.length > 0 ? Object.keys(reportData[0]) : [];
    printWindow.document.write(`
      <html>
        <head>
          <title>WIMS Report - ${reportTypes.find(t => t.id === reportType)?.label}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #1e3a5f; }
            .meta { color: #6b7280; margin-bottom: 20px; }
            table { border-collapse: collapse; width: 100%; font-size: 11px; }
            th, td { border: 1px solid #d1d5db; padding: 6px; text-align: left; }
            th { background: #1e3a5f; color: white; }
            tr:nth-child(even) { background: #f9fafb; }
          </style>
        </head>
        <body>
          <h1>${reportTypes.find(t => t.id === reportType)?.label} Report</h1>
          <div class="meta">Generated: ${new Date().toLocaleString()} | Records: ${reportData.length} | Range: ${dateRanges.find(d => d.id === dateRange)?.label}</div>
          <table>
            <thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>
            <tbody>
              ${reportData.map(row => `<tr>${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}</tr>`).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!isAdmin) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
          <div className="empty-state-icon" style={{ fontSize: '64px' }}>🔒</div>
          <h3 className="empty-state-title">Administrator Access Required</h3>
          <p className="empty-state-description">Reports and exports are only available to administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--spacing-4)' }}>
        <div>
          <h1 className="page-title">Reports & Export</h1>
          <p className="page-subtitle">Generate and export reports on shadow program activity</p>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="card-header">
          <h2 className="card-title">Report Configuration</h2>
        </div>
        <div className="card-content">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-6)' }}>
            {/* Report Type */}
            <div>
              <label className="form-label">Report Type</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--spacing-2)' }}>
                {reportTypes.map(type => (
                  <button
                    key={type.id}
                    className={`btn ${reportType === type.id ? 'btn-primary' : 'btn-outline'} btn-block`}
                    onClick={() => setReportType(type.id)}
                    style={{ textAlign: 'left', padding: 'var(--spacing-3)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)' }}>
                      <span style={{ fontSize: 'var(--text-lg)' }}>{type.icon}</span>
                      <span style={{ fontWeight: '600' }}>{type.label}</span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range & Format */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
              <div>
                <label className="form-label">Date Range</label>
                <select className="form-select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                  {dateRanges.map(dr => (
                    <option key={dr.id} value={dr.id}>{dr.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Export Format</label>
                <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                  {['csv', 'json', 'print'].map(f => (
                    <button
                      key={f}
                      className={`btn ${format === f ? 'btn-primary' : 'btn-outline'} flex-1`}
                      onClick={() => setFormat(f)}
                    >
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
                <button className="btn btn-primary btn-block" onClick={exportCSV} disabled={reportData.length === 0}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Export CSV
                </button>
                <button className="btn btn-secondary btn-block" onClick={exportJSON} disabled={reportData.length === 0}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  Export JSON
                </button>
                <button className="btn btn-outline btn-block" onClick={printReport} disabled={reportData.length === 0}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 21 18 21 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5"></path>
                    <path d="M18 18h2a2 2 0 0 0 2-2v-5"></path>
                    <line x1="6" y1="14" x2="18" y2="14"></line>
                  </svg>
                  Print Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="card-title">Preview: {reportTypes.find(t => t.id === reportType)?.label} ({reportData.length} records)</h2>
            <span className="badge badge-secondary">{dateRanges.find(d => d.id === dateRange)?.label}</span>
          </div>
        </div>
        <div className="card-content" style={{ padding: 0 }}>
          {reportData.length > 0 ? (
            <div className="table-container" style={{ maxHeight: '500px' }}>
              <table className="table">
                <thead>
                  <tr>
                    {Object.keys(reportData[0]).map(key => (
                      <th key={key} scope="col">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reportData.slice(0, 50).map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.values(row).map((val, colIndex) => (
                        <td key={colIndex} style={{ fontSize: 'var(--text-xs)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {reportData.length > 50 && (
                    <tr>
                      <td colSpan={Object.keys(reportData[0]).length} style={{ textAlign: 'center', padding: 'var(--spacing-4)', color: 'var(--color-text-tertiary)' }}>
                        Showing 50 of {reportData.length} records. Export to view all.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: 'var(--spacing-12)' }}>
              <div className="empty-state-icon">📊</div>
              <h3 className="empty-state-title">No data available</h3>
              <p className="empty-state-description">No records found for the selected report type and date range.</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Export Cards */}
      <div style={{ marginTop: 'var(--spacing-6)' }}>
        <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-4)' }}>Quick Exports</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-4)' }}>
          {[
            { title: 'Monthly Participation Report', desc: 'Participation trends by month', icon: '📈', action: () => { setReportType('participation'); setDateRange('month'); exportCSV(); } },
            { title: 'Executive Summary', desc: 'High-level KPIs and metrics', icon: '📊', action: () => { setReportType('opportunities'); exportJSON(); } },
            { title: 'Pending Requests', desc: 'All requests awaiting action', icon: '⏳', action: () => { setReportType('requests'); exportCSV(); } },
            { title: 'Feedback Analysis', desc: 'Ratings and comments summary', icon: '⭐', action: () => { setReportType('feedback'); exportCSV(); } },
            { title: 'Certificate Registry', desc: 'All issued certificates', icon: '🎓', action: () => { setReportType('completion'); exportCSV(); } },
            { title: 'Organization Health', desc: 'Participation by organization', icon: '🏢', action: () => { setReportType('organizations'); exportCSV(); } }
          ].map((quick, i) => (
            <div key={i} className="card" style={{ cursor: 'pointer', transition: 'all var(--transition-fast)' }} onClick={quick.action}>
              <div className="card-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-2xl)' }}>
                    {quick.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{quick.title}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>{quick.desc}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', color: 'var(--color-text-muted)' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}