import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { shadowRequests, shadowOpportunities, employees, organizations } from '../data/mockData';
import { formatDate } from '../utils/formatters';

export default function Feedback() {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const [activeTab, setActiveTab] = useState('received'); // 'received', 'given', 'write'
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Get completed requests for current user
  const completedRequests = useMemo(() => {
    if (!currentUser) return [];
    return shadowRequests.filter(r => r.employeeId === currentUser.id && r.status === 'Completed');
  }, [currentUser]);

  // Get hosted opportunities with completed requests
  const hostedCompleted = useMemo(() => {
    if (!currentUser) return [];
    const myOpps = shadowOpportunities.filter(o => o.hostId === currentUser.id);
    return shadowRequests.filter(r => myOpps.some(o => o.id === r.opportunityId) && r.status === 'Completed');
  }, [currentUser]);

  const tabs = [
    { id: 'received', label: 'Feedback Received', icon: '📥', count: hostedCompleted.length },
    { id: 'given', label: 'Feedback Given', icon: '📤', count: completedRequests.length },
    { id: 'write', label: 'Write Feedback', icon: '✍️', count: completedRequests.filter(r => !r.feedbackSubmitted).length }
  ];

  const handleWriteFeedback = (request) => {
    setSelectedRequest(request);
    setShowWriteModal(true);
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--spacing-4)' }}>
        <div>
          <h1 className="page-title">Feedback Center</h1>
          <p className="page-subtitle">Share and review feedback from shadow experiences</p>
        </div>
      </div>

      {/* Stats */}
      <div className="kpi-grid" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="kpi-card">
          <div className="kpi-card-header"><div className="kpi-card-icon primary">📥</div></div>
          <div className="kpi-card-value">{hostedCompleted.length}</div>
          <div className="kpi-card-label">Feedback Received</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header"><div className="kpi-card-icon secondary">📤</div></div>
          <div className="kpi-card-value">{completedRequests.length}</div>
          <div className="kpi-card-label">Feedback Given</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header"><div className="kpi-card-icon success">✅</div></div>
          <div className="kpi-card-value">{completedRequests.filter(r => r.feedbackSubmitted).length}</div>
          <div className="kpi-card-label">Completed Reviews</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header"><div className="kpi-card-icon warning">⏳</div></div>
          <div className="kpi-card-value">{completedRequests.filter(r => !r.feedbackSubmitted).length}</div>
          <div className="kpi-card-label">Pending Reviews</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" role="tablist">
        {tabs.map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <span>{tab.icon}</span>
              {tab.label}
              {tab.count > 0 && <span className="nav-item-badge">{tab.count}</span>}
            </span>
          </button>
        ))}
      </div>

      {/* Feedback Received (Host View) */}
      <div className="tab-content" style={{ display: activeTab === 'received' ? 'block' : 'none' }}>
        <div className="card">
          <div className="card-content">
            {hostedCompleted.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                {hostedCompleted.map(request => {
                  const opp = shadowOpportunities.find(o => o.id === request.opportunityId);
                  const participant = employees.find(e => e.id === request.employeeId);
                  // Mock feedback data
                  const feedback = request.feedback || {
                    rating: 5,
                    learningValue: 5,
                    hostEffectiveness: 5,
                    comments: 'Excellent experience! The host was very knowledgeable and made time to answer all my questions.',
                    wouldRecommend: true,
                    submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
                  };

                  return (
                    <div key={request.id} style={{ padding: 'var(--spacing-6)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-4)' }}>
                        <div>
                          <h3 style={{ fontWeight: '600', marginBottom: 'var(--spacing-1)' }}>{opp?.title}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                            <span>{participant?.firstName} {participant?.lastName}</span>
                            <span>•</span>
                            <span>{formatDate(request.scheduledDate)}</span>
                            <span>•</span>
                            <span>Submitted {formatDate(feedback.submittedAt)}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                          <span className="badge badge-primary">Overall: {feedback.rating}/5</span>
                          <span className="badge badge-secondary">Learning: {feedback.learningValue}/5</span>
                          <span className="badge badge-accent">Host: {feedback.hostEffectiveness}/5</span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }}>
                        <div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Learning Value</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                            <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--color-border-light)', borderRadius: 'var(--radius-full)' }}>
                              <div style={{ width: `${(feedback.learningValue/5)*100}%`, height: '100%', backgroundColor: 'var(--color-success)', borderRadius: 'var(--radius-full)' }} />
                            </div>
                            <span style={{ fontWeight: '600' }}>{feedback.learningValue}/5</span>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Host Effectiveness</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                            <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--color-border-light)', borderRadius: 'var(--radius-full)' }}>
                              <div style={{ width: `${(feedback.hostEffectiveness/5)*100}%`, height: '100%', backgroundColor: 'var(--color-secondary)', borderRadius: 'var(--radius-full)' }} />
                            </div>
                            <span style={{ fontWeight: '600' }}>{feedback.hostEffectiveness}/5</span>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Would Recommend</div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                            <span className={`badge ${feedback.wouldRecommend ? 'badge-success' : 'badge-error'}`}>
                              {feedback.wouldRecommend ? 'Yes' : 'No'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--color-secondary)' }}>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Comments</div>
                        <p style={{ color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>"{feedback.comments}"</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 'var(--spacing-12)' }}>
                <div className="empty-state-icon">📥</div>
                <h3 className="empty-state-title">No feedback received yet</h3>
                <p className="empty-state-description">Feedback from participants will appear here after they complete their shadow sessions.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Given (Employee View) */}
      <div className="tab-content" style={{ display: activeTab === 'given' ? 'block' : 'none' }}>
        <div className="card">
          <div className="card-content">
            {completedRequests.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                {completedRequests.map(request => {
                  const opp = shadowOpportunities.find(o => o.id === request.opportunityId);
                  const host = employees.find(e => e.id === request.hostId);
                  const hasFeedback = request.feedbackSubmitted;

                  return (
                    <div key={request.id} style={{ padding: 'var(--spacing-6)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-4)' }}>
                        <div>
                          <h3 style={{ fontWeight: '600', marginBottom: 'var(--spacing-1)' }}>{opp?.title}</h3>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                            Hosted by {host?.firstName} {host?.lastName} • {formatDate(request.scheduledDate)}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
                          {hasFeedback ? (
                            <span className="badge badge-success">Submitted</span>
                          ) : (
                            <button className="btn btn-primary btn-sm" onClick={() => handleWriteFeedback(request)}>
                              Write Feedback
                            </button>
                          )}
                        </div>
                      </div>

                      {hasFeedback && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--spacing-4)' }}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--color-secondary)' }}>{request.feedback?.rating || 5}/5</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Overall</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--color-success)' }}>{request.feedback?.learningValue || 5}/5</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Learning Value</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', color: 'var(--color-accent)' }}>{request.feedback?.hostEffectiveness || 5}/5</div>
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Host Effectiveness</div>
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <span className={`badge ${request.feedback?.wouldRecommend ? 'badge-success' : 'badge-error'}`}>
                              {request.feedback?.wouldRecommend ? 'Would Recommend' : 'Would Not Recommend'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 'var(--spacing-12)' }}>
                <div className="empty-state-icon">📤</div>
                <h3 className="empty-state-title">No completed sessions yet</h3>
                <p className="empty-state-description">Complete shadow sessions to provide feedback.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Write Feedback */}
      <div className="tab-content" style={{ display: activeTab === 'write' ? 'block' : 'none' }}>
        <div className="card">
          <div className="card-content">
            {completedRequests.filter(r => !r.feedbackSubmitted).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                {completedRequests.filter(r => !r.feedbackSubmitted).map(request => {
                  const opp = shadowOpportunities.find(o => o.id === request.opportunityId);
                  const host = employees.find(e => e.id === request.hostId);
                  const [formData, setFormData] = useState({
                    rating: 5,
                    learningValue: 5,
                    hostEffectiveness: 5,
                    comments: '',
                    wouldRecommend: true,
                    suggestions: ''
                  });

                  return (
                    <div style={{ padding: 'var(--spacing-6)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
                      <div style={{ marginBottom: 'var(--spacing-4)' }}>
                        <h3 style={{ fontWeight: '600', marginBottom: 'var(--spacing-1)' }}>{opp?.title}</h3>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                          Hosted by {host?.firstName} {host?.lastName} • {formatDate(request.scheduledDate)}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-6)' }}>
                        <div>
                          <label className="form-label">Overall Rating</label>
                          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                            {[1,2,3,4,5].map(star => (
                              <button
                                key={star}
                                type="button"
                                className={`btn btn-ghost ${formData.rating >= star ? 'text-warning' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, rating: star }))}
                                style={{ fontSize: 'var(--text-2xl)', padding: 'var(--spacing-1)' }}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="form-label">Learning Value</label>
                          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                            {[1,2,3,4,5].map(star => (
                              <button
                                key={star}
                                type="button"
                                className={`btn btn-ghost ${formData.learningValue >= star ? 'text-success' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, learningValue: star }))}
                                style={{ fontSize: 'var(--text-2xl)', padding: 'var(--spacing-1)' }}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="form-label">Host Effectiveness</label>
                          <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                            {[1,2,3,4,5].map(star => (
                              <button
                                key={star}
                                type="button"
                                className={`btn btn-ghost ${formData.hostEffectiveness >= star ? 'text-primary' : ''}`}
                                onClick={() => setFormData(prev => ({ ...prev, hostEffectiveness: star }))}
                                style={{ fontSize: 'var(--text-2xl)', padding: 'var(--spacing-1)' }}
                              >
                                ★
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Comments</label>
                        <textarea
                          className="form-textarea"
                          placeholder="Share your experience, what you learned, and any highlights..."
                          rows={4}
                          value={formData.comments}
                          onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
                          <input
                            type="checkbox"
                            checked={formData.wouldRecommend}
                            onChange={(e) => setFormData(prev => ({ ...prev, wouldRecommend: e.target.checked }))}
                            style={{ width: '18px', height: '18px', accentColor: 'var(--color-secondary)' }}
                          />
                          <span style={{ fontWeight: '500' }}>I would recommend this shadow opportunity to others</span>
                        </label>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Suggestions for Improvement (Optional)</label>
                        <textarea
                          className="form-textarea"
                          placeholder="Any suggestions for the host or program improvements..."
                          rows={3}
                          value={formData.suggestions}
                          onChange={(e) => setFormData(prev => ({ ...prev, suggestions: e.target.value }))}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-3)' }}>
                        <button className="btn btn-secondary">Save Draft</button>
                        <button className="btn btn-primary" onClick={() => { /* submit */ alert('Feedback submitted!'); }}>
                          Submit Feedback
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: 'var(--spacing-12)', textAlign: 'center' }}>
                <div className="empty-state-icon">✅</div>
                <h3 className="empty-state-title">All caught up!</h3>
                <p className="empty-state-description">You have submitted feedback for all your completed sessions.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}