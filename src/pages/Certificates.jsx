import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { shadowRequests, shadowOpportunities, employees, organizations } from '../data/mockData';
import { formatDate, getInitials } from '../utils/formatters';

export default function Certificates() {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const [selectedCert, setSelectedCert] = useState(null);
  const [showPrint, setShowPrint] = useState(false);

  // Get completed requests for current user
  const completedRequests = useMemo(() => {
    if (!currentUser) return [];
    return shadowRequests.filter(r => r.employeeId === currentUser.id && r.status === 'Completed');
  }, [currentUser]);

  // Also get certificates where user was the host
  const hostedCompleted = useMemo(() => {
    if (!currentUser) return [];
    const myOpps = shadowOpportunities.filter(o => o.hostId === currentUser.id);
    return shadowRequests.filter(r => myOpps.some(o => o.id === r.opportunityId) && r.status === 'Completed');
  }, [currentUser]);

  const [activeTab, setActiveTab] = useState('earned'); // 'earned', 'hosted'

  const certificates = activeTab === 'earned' 
    ? completedRequests.map(r => ({ request: r, type: 'earned' }))
    : hostedCompleted.map(r => ({ request: r, type: 'hosted' }));

  const renderCertificate = (cert) => {
    const { request, type } = cert;
    const opp = shadowOpportunities.find(o => o.id === request.opportunityId);
    const host = employees.find(e => e.id === request.hostId);
    const participant = employees.find(e => e.id === request.employeeId);
    const certNumber = `WIMS-${type === 'earned' ? 'PAR' : 'HST'}-${request.id.slice(-8).toUpperCase()}`;
    const certDate = new Date(request.scheduledDate || request.submittedAt);
    const issueDate = new Date();

    return (
      <div 
        className="certificate"
        style={{
          width: '100%',
          maxWidth: '800px',
          margin: '0 auto',
          background: 'white',
          border: '8px solid #1e3a5f',
          borderRadius: '16px',
          padding: '60px 40px',
          fontFamily: '"Georgia", serif',
          color: '#1a1a2e',
          position: 'relative',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
        }}
      >
        {/* Decorative border */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          right: '20px',
          bottom: '20px',
          border: '2px solid #1e3a5f',
          borderRadius: '8px',
          pointerEvents: 'none'
        }} />
        
        <div style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          right: '30px',
          bottom: '30px',
          border: '1px solid #d4a574',
          borderRadius: '4px',
          pointerEvents: 'none'
        }} />

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
          <div style={{ 
            fontSize: '14px', 
            letterSpacing: '0.3em', 
            textTransform: 'uppercase', 
            color: '#1e3a5f', 
            fontWeight: '600',
            marginBottom: '8px'
          }}>
            CERTIFICATE OF COMPLETION
          </div>
          
          {/* Logo/Seal */}
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #1e3a5f, #3b82f6)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            border: '3px solid #d4a574'
          }}>
            <span style={{ fontSize: '28px', fontWeight: 'bold', color: 'white' }}>★</span>
          </div>

          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: '700', 
            color: '#1a1a2e',
            marginBottom: '8px',
            fontFamily: '"Georgia", serif'
          }}>
            {opp?.title}
          </h1>
          
          <div style={{ 
            fontSize: '18px', 
            color: '#3b82f6', 
            fontWeight: '500',
            marginBottom: '4px'
          }}>
            {type === 'earned' ? 'Presented to' : 'Hosted by'}
          </div>

          <div style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#1e3a5f',
            fontFamily: '"Georgia", serif',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '24px'
          }}>
            {type === 'earned' 
              ? `${participant?.firstName} ${participant?.lastName}`
              : `${host?.firstName} ${host?.lastName}`}
          </div>

          <div style={{ 
            fontSize: '14px', 
            color: '#6b7280',
            marginBottom: '4px'
          }}>
            {type === 'earned' ? 'Participant' : 'Host'} • {host?.organization || 'Organization'}
          </div>
        </div>

        {/* Body */}
        <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#374151', marginBottom: '16px' }}>
            {type === 'earned' 
              ? 'has successfully completed the shadow opportunity'
              : 'has successfully hosted the shadow opportunity'}
          </p>
          
          <p style={{ fontSize: '16px', lineHeight: 1.8, color: '#374151', marginBottom: '24px' }}>
            <strong>{opp?.title}</strong>
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e3a5f' }}>
                {formatDate(request.scheduledDate).replace(',', '')}
              </div>
              <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280' }}>
                Session Date
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e3a5f' }}>
                {opp?.duration}
              </div>
              <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280' }}>
                Duration
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#1e3a5f' }}>
                {opp?.location}
              </div>
              <div style={{ fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6b7280' }}>
                Location
              </div>
            </div>
          </div>

          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8fafc', 
            borderRadius: '8px', 
            border: '1px solid #e2e8f0',
            maxWidth: '500px',
            margin: '0 auto 24px'
          }}>
            <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#374151', fontStyle: 'italic' }}>
              "{opp?.description?.substring(0, 200)}..."
            </p>
          </div>
        </div>

        {/* Signatures */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', width: '200px' }}>
            <div style={{ 
              borderTop: '2px solid #1e3a5f', 
              paddingTop: '8px',
              marginBottom: '4px'
            }} />
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a5f' }}>
              {host?.firstName} {host?.lastName}
            </div>
            <div style={{ fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b7280' }}>
              {type === 'earned' ? 'Host & Mentor' : 'Participant'}
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
              {host?.position}
            </div>
          </div>

          <div style={{ textAlign: 'center', width: '200px' }}>
            <div style={{ 
              borderTop: '2px solid #1e3a5f', 
              paddingTop: '8px',
              marginBottom: '4px'
            }} />
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a5f' }}>
              Program Director
            </div>
            <div style={{ fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b7280' }}>
              Walk In My Shoes Program
            </div>
          </div>

          <div style={{ textAlign: 'center', width: '200px' }}>
            <div style={{ 
              borderTop: '2px solid #1e3a5f', 
              paddingTop: '8px',
              marginBottom: '4px'
            }} />
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a5f' }}>
              {formatDate(issueDate.toISOString()).replace(',', '')}
            </div>
            <div style={{ fontSize: '11px', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#6b7280' }}>
              Date Issued
            </div>
          </div>
        </div>

        {/* Certificate Number & Seal */}
        <div style={{ 
          position: 'absolute', 
          bottom: '30px', 
          right: '40px',
          textAlign: 'right',
          zIndex: 1
        }}>
          <div style={{ 
            fontSize: '11px', 
            letterSpacing: '0.1em', 
            textTransform: 'uppercase', 
            color: '#9ca3af',
            marginBottom: '4px'
          }}>
            Certificate Number
          </div>
          <div style={{ 
            fontSize: '14px', 
            fontWeight: '700', 
            color: '#1e3a5f',
            fontFamily: '"Courier New", monospace',
            letterSpacing: '0.1em'
          }}>
            {certNumber}
          </div>
          
          <div style={{ marginTop: '16px' }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              border: '2px solid #d4a574',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginLeft: 'auto'
            }}>
              <span style={{ fontSize: '20px', color: '#1e3a5f' }}>✓</span>
            </div>
            <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginTop: '4px' }}>
              Verified
            </div>
          </div>
        </div>

        {/* QR Code placeholder */}
        <div style={{ 
          position: 'absolute', 
          bottom: '30px', 
          left: '40px',
          textAlign: 'left',
          zIndex: 1
        }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            backgroundColor: '#f3f4f6',
            border: '1px solid #d1d5db',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            color: '#9ca3af'
          }}>
            QR Code
          </div>
          <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9ca3af', marginTop: '4px' }}>
            Verify at wims.gov
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--spacing-4)' }}>
        <div>
          <h1 className="page-title">Certificates</h1>
          <p className="page-subtitle">
            {activeTab === 'earned' 
              ? `Your earned certificates (${certificates.length})`
              : `Certificates for sessions you hosted (${certificates.length})`
            }
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          {activeTab === 'earned' && certificates.length > 0 && (
            <button className="btn btn-primary" onClick={() => setShowPrint(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 21 18 21 18 9"></polyline>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5"></path>
                <path d="M18 18h2a2 2 0 0 0 2-2v-5"></path>
                <line x1="6" y1="14" x2="18" y2="14"></line>
              </svg>
              Print All
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" role="tablist" style={{ marginBottom: 'var(--spacing-6)' }}>
        <button
          role="tab"
          aria-selected={activeTab === 'earned'}
          className={`tab ${activeTab === 'earned' ? 'active' : ''}`}
          onClick={() => setActiveTab('earned')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <span>🎓</span>
            Earned
            <span className="nav-item-badge">{completedRequests.length}</span>
          </span>
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'hosted'}
          className={`tab ${activeTab === 'hosted' ? 'active' : ''}`}
          onClick={() => setActiveTab('hosted')}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <span>🎤</span>
            Hosted
            <span className="nav-item-badge">{hostedCompleted.length}</span>
          </span>
        </button>
      </div>

      {/* Certificates Grid */}
      {certificates.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          {certificates.map((cert, index) => (
            <div key={cert.request.id}>
              {renderCertificate(cert)}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-3)', marginTop: 'var(--spacing-4)' }}>
                <button className="btn btn-primary" onClick={() => { /* print single */ }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 21 18 21 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5"></path>
                    <path d="M18 18h2a2 2 0 0 0 2-2v-5"></path>
                    <line x1="6" y1="14" x2="18" y2="14"></line>
                  </svg>
                  Print
                </button>
                <button className="btn btn-secondary">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  Download PDF
                </button>
                <button className="btn btn-ghost">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                  Share
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
          <div className="empty-state-icon" style={{ fontSize: '64px' }}>
            {activeTab === 'earned' ? '🎓' : '🎤'}
          </div>
          <h3 className="empty-state-title">
            {activeTab === 'earned' ? 'No certificates earned yet' : 'No hosted sessions completed'}
          </h3>
          <p className="empty-state-description">
            {activeTab === 'earned' 
              ? 'Complete shadow sessions to earn certificates of completion.'
              : 'Host and complete shadow sessions to receive hosting certificates.'
            }
          </p>
          {activeTab === 'earned' && (
            <button className="btn btn-primary" style={{ marginTop: 'var(--spacing-4)' }} onClick={() => actions.setActivePage('opportunities')}>
              Browse Opportunities
            </button>
          )}
        </div>
      )}

      {/* Print Modal */}
      {showPrint && (
        <div className="modal-overlay" onClick={() => setShowPrint(false)}>
          <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Print Certificates</h2>
              <button className="modal-close" onClick={() => setShowPrint(false)} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: 'var(--spacing-4)' }}>Select certificates to print:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)', maxHeight: '300px', overflow: 'auto' }}>
                {certificates.map((cert, index) => (
                  <label key={cert.request.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: 'var(--color-secondary)' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500' }}>
                        {shadowOpportunities.find(o => o.id === cert.request.opportunityId)?.title}
                      </div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                        {formatDate(cert.request.scheduledDate)} • {cert.type === 'earned' ? 'Earned' : 'Hosted'}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowPrint(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { window.print(); setShowPrint(false); }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 21 18 21 18 9"></polyline>
                  <path d="M6 18H4a2 2 0 0 1-2-2v-5"></path>
                  <path d="M18 18h2a2 2 0 0 0 2-2v-5"></path>
                  <line x1="6" y1="14" x2="18" y2="14"></line>
                </svg>
                Print Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}