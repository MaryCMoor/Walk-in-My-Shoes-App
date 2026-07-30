import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { shadowOpportunities, employees, organizations } from '../data/mockData';

export default function RequestForm({ opportunityId, onClose }) {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const opportunity = shadowOpportunities.find(o => o.id === opportunityId);
  const host = employees.find(e => e.id === opportunity?.hostId);

  const [formData, setFormData] = useState({
    reason: '',
    careerGoals: '',
    learningObjectives: '',
    preferredDate: '',
    supervisorApproved: false,
    accommodations: '',
    comments: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const maxSteps = 3;

  useEffect(() => {
    if (opportunity?.availableDates.length > 0) {
      setFormData(prev => ({ ...prev, preferredDate: opportunity.availableDates[0] }));
    }
  }, [opportunity]);

  const validateStep = (stepNum) => {
    const newErrors = {};
    if (stepNum === 1) {
      if (!formData.reason.trim()) newErrors.reason = 'Reason for shadowing is required';
      if (!formData.careerGoals.trim()) newErrors.careerGoals = 'Career goals are required';
      if (!formData.learningObjectives.trim()) newErrors.learningObjectives = 'Learning objectives are required';
    }
    if (stepNum === 2) {
      if (!formData.preferredDate) newErrors.preferredDate = 'Preferred date is required';
      if (!formData.supervisorApproved) newErrors.supervisorApproved = 'Supervisor approval is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(2)) return;

    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newRequest = {
      id: `req-${Date.now()}`,
      employeeId: currentUser.id,
      opportunityId: opportunity.id,
      hostId: opportunity.hostId,
      status: 'Submitted',
      submittedAt: new Date().toISOString(),
      preferredDate: formData.preferredDate,
      reason: formData.reason,
      careerGoals: formData.careerGoals,
      learningObjectives: formData.learningObjectives,
      supervisorApproved: formData.supervisorApproved,
      accommodations: formData.accommodations,
      comments: formData.comments,
      feedbackSubmitted: false
    };

    actions.addRequest(newRequest);
    actions.saveOpportunity(opportunity.id); // Auto-save when applying
    
    setSubmitting(false);
    if (onClose) onClose();
    
    // Show success toast
    alert('Request submitted successfully! Your request is now pending review.');
  };

  const nextStep = () => {
    if (validateStep(step) && step < maxSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (!opportunity || !currentUser) {
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
            <p>Unable to load opportunity details.</p>
          </div>
        </div>
      </div>
    );
  }

  const isStepValid = step === 1 ? (formData.reason && formData.careerGoals && formData.learningObjectives) : 
                     step === 2 ? (formData.preferredDate && formData.supervisorApproved) : true;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-lg" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}>
        <div className="modal-header">
          <div style={{ flex: 1 }}>
            <h2 className="modal-title">Request Shadow Opportunity</h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginTop: 'var(--spacing-1)' }}>
              {opportunity.title}
            </p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', padding: 'var(--spacing-4) var(--spacing-6)', borderBottom: '1px solid var(--color-border-light)', backgroundColor: 'var(--color-bg-secondary)' }}>
          {[1, 2, 3].map((stepNum, i) => (
            <div key={stepNum} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: 'var(--radius-full)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: '600',
                fontSize: 'var(--text-sm)',
                backgroundColor: step <= stepNum ? 'var(--color-secondary)' : 'var(--color-border-light)',
                color: step <= stepNum ? 'white' : 'var(--color-text-tertiary)',
                border: step === stepNum ? '3px solid var(--color-secondary)' : 'none',
                transition: 'all var(--transition-fast)'
              }}>
                {stepNum}
              </div>
              {i < 2 && (
                <div style={{ 
                  flex: 1, 
                  height: '2px', 
                  backgroundColor: step > stepNum + 1 ? 'var(--color-secondary)' : 'var(--color-border-light)',
                  marginLeft: 'var(--spacing-2)',
                  marginRight: 'var(--spacing-2)'
                }} />
              )}
              <div style={{ 
                marginLeft: 'var(--spacing-2)',
                fontSize: 'var(--text-xs)',
                fontWeight: step === stepNum ? '600' : '400',
                color: step >= stepNum ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                whiteSpace: 'nowrap'
              }}>
                {stepNum === 1 && 'Details'}
                {stepNum === 2 && 'Scheduling'}
                {stepNum === 3 && 'Review'}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: 'var(--spacing-6)' }}>
            {/* Step 1: Personal Statement */}
            {step === 1 && (
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-1)' }}>Tell Us About Your Interest</h3>
                <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--spacing-6)' }}>
                    Help the host understand why you want to participate and what you hope to gain.
                </p>

                <div className="form-group">
                  <label className="form-label required">Why do you want to shadow this opportunity?</label>
                  <textarea
                    className={`form-textarea ${errors.reason ? 'error' : ''}`}
                    placeholder="Explain your motivation for requesting this shadow opportunity..."
                    rows={4}
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  />
                  {errors.reason && <p className="form-error">{errors.reason}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label required">Career Goals</label>
                  <textarea
                    className={`form-textarea ${errors.careerGoals ? 'error' : ''}`}
                    placeholder="How does this shadow opportunity align with your career development goals?"
                    rows={3}
                    value={formData.careerGoals}
                    onChange={(e) => setFormData(prev => ({ ...prev, careerGoals: e.target.value }))}
                  />
                  {errors.careerGoals && <p className="form-error">{errors.careerGoals}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label required">Desired Learning Objectives</label>
                  <textarea
                    className={`form-textarea ${errors.learningObjectives ? 'error' : ''}`}
                    placeholder="What specific skills, knowledge, or experiences do you hope to gain?"
                    rows={3}
                    value={formData.learningObjectives}
                    onChange={(e) => setFormData(prev => ({ ...prev, learningObjectives: e.target.value }))}
                  />
                  {errors.learningObjectives && <p className="form-error">{errors.learningObjectives}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Scheduling */}
            {step === 2 && (
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-1)' }}>Scheduling & Approval</h3>
                <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--spacing-6)' }}>
                    Select your preferred date and confirm supervisor approval.
                </p>

                <div className="form-group">
                  <label className="form-label required">Preferred Date</label>
                  <select
                    className={`form-select ${errors.preferredDate ? 'error' : ''}`}
                    value={formData.preferredDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, preferredDate: e.target.value }))}
                  >
                    <option value="">Select a date...</option>
                    {opportunity.availableDates.map(date => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </option>
                    ))}
                  </select>
                  {errors.preferredDate && <p className="form-error">{errors.preferredDate}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label required">
                    <input
                      type="checkbox"
                      checked={formData.supervisorApproved}
                      onChange={(e) => setFormData(prev => ({ ...prev, supervisorApproved: e.target.checked }))}
                      style={{ width: '20px', height: '20px', accentColor: 'var(--color-secondary)', marginRight: 'var(--spacing-2)' }}
                    />
                    I confirm that my supervisor has approved this shadow request
                  </label>
                  {errors.supervisorApproved && <p className="form-error" style={{ marginLeft: 'calc(20px + var(--spacing-2))' }}>{errors.supervisorApproved}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Special Accommodations</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Any accessibility needs, dietary restrictions, or other accommodations required..."
                    rows={3}
                    value={formData.accommodations}
                    onChange={(e) => setFormData(prev => ({ ...prev, accommodations: e.target.value }))}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', marginBottom: 'var(--spacing-1)' }}>Review Your Request</h3>
                <p style={{ color: 'var(--color-text-tertiary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--spacing-6)' }}>
                    Please review your information before submitting.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                  <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
                    <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-3)', color: 'var(--color-text-primary)' }}>Opportunity Details</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--spacing-3)', fontSize: 'var(--text-sm)' }}>
                      <div><span style={{ color: 'var(--color-text-tertiary)' }}>Title:</span> <span style={{ fontWeight: '500' }}>{opportunity.title}</span></div>
                      <div><span style={{ color: 'var(--color-text-tertiary)' }}>Host:</span> <span style={{ fontWeight: '500' }}>{host?.firstName} {host?.lastName}</span></div>
                      <div><span style={{ color: 'var(--color-text-tertiary)' }}>Organization:</span> <span style={{ fontWeight: '500' }}>{organizations.find(o => o.id === opportunity.organizationId)?.name}</span></div>
                      <div><span style={{ color: 'var(--color-text-tertiary)' }}>Date:</span> <span style={{ fontWeight: '500' }}>{formData.preferredDate ? new Date(formData.preferredDate).toLocaleDateString() : 'Not selected'}</span></div>
                      <div><span style={{ color: 'var(--color-text-tertiary)' }}>Duration:</span> <span style={{ fontWeight: '500' }}>{opportunity.duration}</span></div>
                      <div><span style={{ color: 'var(--color-text-tertiary)' }}>Location:</span> <span style={{ fontWeight: '500' }}>{opportunity.location}</span></div>
                    </div>
                  </div>

                  <div style={{ padding: 'var(--spacing-4)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-light)' }}>
                    <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-3)', color: 'var(--color-text-primary)' }}>Your Responses</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Reason for Shadowing</div>
                        <p style={{ color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>{formData.reason}</p>
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Career Goals</div>
                        <p style={{ color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>{formData.careerGoals}</p>
                      </div>
                      <div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Learning Objectives</div>
                        <p style={{ color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>{formData.learningObjectives}</p>
                      </div>
                      {formData.accommodations && (
                        <div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Accommodations</div>
                          <p style={{ color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>{formData.accommodations}</p>
                        </div>
                      )}
                      {formData.comments && (
                        <div>
                          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--spacing-1)' }}>Additional Comments</div>
                          <p style={{ color: 'var(--color-text-secondary)', whiteSpace: 'pre-wrap' }}>{formData.comments}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Additional Comments (Optional)</label>
                    <textarea
                      className="form-textarea"
                      placeholder="Any final notes for the host or review team..."
                      rows={3}
                      value={formData.comments}
                      onChange={(e) => setFormData(prev => ({ ...prev, comments: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            {step > 1 && (
              <button type="button" className="btn btn-secondary" onClick={prevStep} disabled={submitting}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 'var(--spacing-2)' }}>
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Back
              </button>
            )}
            <div style={{ flex: 1 }} />
            {step < maxSteps ? (
              <button type="button" className="btn btn-primary" onClick={nextStep} disabled={submitting || !isStepValid}>
                Next
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'var(--spacing-2)' }}>
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            ) : (
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
                  <>
                    Submit Request
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'var(--spacing-2)' }}>
                      <path d="M22 2L11 13"></path>
                      <path d="M22 2L15 22 11 13 2 9 22 2z"></path>
                    </svg>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}