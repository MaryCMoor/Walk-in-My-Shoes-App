import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function FeedbackForm({ requestId, onClose, onSubmit: onSubmitCallback }) {
  const { state, actions } = useApp();
  const { shadowRequests } = state;
  const request = shadowRequests.find(r => r.id === requestId);

  const [formData, setFormData] = useState({
    rating: 0,
    learningValue: 0,
    hostEffectiveness: 0,
    wouldRecommend: true,
    comments: '',
    suggestions: '',
    strengths: '',
    improvements: ''
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.rating === 0) {
      alert('Please provide an overall rating');
      return;
    }

    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    actions.submitFeedback(requestId, formData);
    
    if (onSubmitCallback) onSubmitCallback();
    if (onClose) onClose();
  };

  const StarRating = ({ label, value, onChange, name }) => (
    <div className="form-group">
      <label className="form-label required">{label}</label>
      <div style={{ display: 'flex', gap: 'var(--spacing-1)', flexWrap: 'wrap' }}>
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            style={{
              padding: 'var(--spacing-2)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: value >= star ? '#fbbf24' : '#d1d5db',
              fontSize: '28px',
              lineHeight: 1,
              transition: 'transform var(--transition-fast)'
            }}
            onMouseEnter={() => onChange(star)}
          >
            ★
          </button>
        ))}
        <span style={{ alignSelf: 'center', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginLeft: 'var(--spacing-2)' }}>
          {value} of 5
        </span>
      </div>
    </div>
  );

  if (!request) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h2 className="modal-title">Error</h2>
            <button className="modal-close" onClick={onClose} aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div className="modal-body">
            <p>Unable to load request details.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="modal-header">
          <div style={{ flex: 1 }}>
            <h2 className="modal-title">Submit Feedback</h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginTop: 'var(--spacing-1)' }}>
              {request.opportunityTitle || 'Shadow Session'} • {new Date(request.scheduledDate).toLocaleDateString()}
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: 'var(--spacing-6)' }}>
            <p style={{ marginBottom: 'var(--spacing-6)', color: 'var(--color-text-secondary)' }}>
              Your feedback helps improve the shadow program and provides valuable insights for hosts.
              All feedback is anonymous when shared with hosts.
            </p>

            <div style={{ marginBottom: 'var(--spacing-8)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-4)' }}>Ratings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
                <StarRating
                  label="Overall Experience"
                  value={formData.rating}
                  onChange={(v) => setFormData(prev => ({ ...prev, rating: v }))}
                  name="rating"
                />
                <StarRating
                  label="Learning Value"
                  value={formData.learningValue}
                  onChange={(v) => setFormData(prev => ({ ...prev, learningValue: v }))}
                  name="learningValue"
                />
                <StarRating
                  label="Host Effectiveness"
                  value={formData.hostEffectiveness}
                  onChange={(v) => setFormData(prev => ({ ...prev, hostEffectiveness: v }))}
                  name="hostEffectiveness"
                />
              </div>
            </div>

            <div style={{ marginBottom: 'var(--spacing-8)', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: '600' }}>Would you recommend this opportunity?</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                    Your response helps other employees find valuable experiences
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--spacing-3)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="recommend"
                      value={true}
                      checked={formData.wouldRecommend}
                      onChange={(e) => setFormData(prev => ({ ...prev, wouldRecommend: e.target.value === 'true' }))}
                      style={{ width: '20px', height: '20px', accentColor: 'var(--color-secondary)' }}
                    />
                    <span style={{ fontWeight: '500' }}>Yes</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="recommend"
                      value={false}
                      checked={!formData.wouldRecommend}
                      onChange={(e) => setFormData(prev => ({ ...prev, wouldRecommend: e.target.value === 'true' }))}
                      style={{ width: '20px', height: '20px', accentColor: 'var(--color-secondary)' }}
                    />
                    <span style={{ fontWeight: '500' }}>No</span>
                  </label>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 'var(--spacing-8)' }}>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-4)' }}>Written Feedback</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                <div className="form-group">
                  <label className="form-label">What did you enjoy most? (Strengths)</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe the most valuable aspects of your shadow experience..."
                    rows={3}
                    value={formData.strengths}
                    onChange={(e) => setFormData(prev => ({ ...prev, strengths: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">What could be improved?</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Suggestions for improving future shadow sessions..."
                    rows={3}
                    value={formData.improvements}
                    onChange={(e) => setFormData(prev => ({ ...prev, improvements: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Additional Comments</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Any other feedback, observations, or comments..."
                    rows={3}
                    value={formData.comments}
                    onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Suggestions for Future Participants</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Advice for others considering this shadow opportunity..."
                    rows={3}
                    value={formData.suggestions}
                    onChange={(e) => setFormData(prev => ({ ...prev, suggestions: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div style={{ padding: 'var(--spacing-4)', backgroundColor: '#fef3c7', borderRadius: 'var(--radius-lg)', border: '1px solid #fde68a' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px', color: '#f59e0b' }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                <div style={{ fontSize: 'var(--text-sm)', color: '#92400e' }}>
                  <strong>Privacy Note:</strong> Your written feedback will be shared anonymously with the host. 
                  Your name will not be associated with comments. Ratings are aggregated in reports.
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--spacing-2)' }}>
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25"></circle>
                    <path d="M12 2a10 10 0 0 1 10 10" strokeOpacity="1"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Feedback'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}