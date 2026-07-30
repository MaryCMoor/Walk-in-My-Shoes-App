import { useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { shadowRequests, shadowOpportunities, employees, organizations, analytics } from '../data/mockData';
import { formatDate } from '../utils/formatters';

export default function Analytics() {
  const { state } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const isAdmin = currentUser?.role === 'Administrator';

  // Refs for charts
  const chartRefs = useRef({
    monthly: null,
    org: null,
    status: null,
    duration: null,
    engagement: null
  });

  // Draw charts
  useEffect(() => {
    if (!isAdmin) return;
    
    // Monthly Participation Chart
    drawMonthlyChart();
    drawOrgChart();
    drawStatusChart();
    drawDurationChart();
    drawEngagementChart();
  }, [isAdmin]);

  const drawMonthlyChart = () => {
    const canvas = chartRefs.current.monthly;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const data = analytics.monthlyParticipation;
    const maxVal = Math.max(...data.map(d => d.value)) * 1.2;
    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'var(--color-border-light)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      const val = Math.round(maxVal * (1 - i / 5));
      ctx.fillStyle = 'var(--color-text-tertiary)';
      ctx.font = '11px var(--font-sans)';
      ctx.textAlign = 'right';
      ctx.fillText(val.toLocaleString(), padding - 8, y + 4);
    }

    // Draw area
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgb(59 130 246 / 0.3)');
    gradient.addColorStop(1, 'rgb(59 130 246 / 0)');
    
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    data.forEach((d, i) => {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const y = height - padding - (d.value / maxVal) * chartHeight;
      if (i === 0) ctx.lineTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(width - padding, height - padding);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw line
    ctx.beginPath();
    ctx.strokeStyle = 'var(--color-secondary)';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    data.forEach((d, i) => {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const y = height - padding - (d.value / maxVal) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw points
    data.forEach((d, i) => {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      const y = height - padding - (d.value / maxVal) * chartHeight;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = 'var(--color-secondary)';
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // X-axis labels
    ctx.fillStyle = 'var(--color-text-tertiary)';
    ctx.font = '11px var(--font-sans)';
    ctx.textAlign = 'center';
    data.forEach((d, i) => {
      const x = padding + (chartWidth / (data.length - 1)) * i;
      ctx.fillText(d.month, x, height - padding + 20);
    });
  };

  const drawOrgChart = () => {
    const canvas = chartRefs.current.org;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const data = analytics.topOrganizations;
    const maxVal = Math.max(...data.map(d => d.value));
    const width = rect.width;
    const height = rect.height;
    const padding = 120; // left padding for labels

    ctx.clearRect(0, 0, width, height);

    const barHeight = (height - 40) / data.length * 0.7;
    const gap = (height - 40) / data.length * 0.3;

    data.forEach((d, i) => {
      const y = 20 + i * (barHeight + gap);
      const barWidth = (d.value / maxVal) * (width - padding - 20);
      
      // Bar background
      ctx.fillStyle = 'var(--color-border-light)';
      ctx.roundRect(padding, y, width - padding - 20, barHeight, 4);
      ctx.fill();
      
      // Bar value
      const gradient = ctx.createLinearGradient(padding, 0, padding + barWidth, 0);
      gradient.addColorStop(0, 'var(--color-primary)');
      gradient.addColorStop(1, 'var(--color-secondary)');
      ctx.fillStyle = gradient;
      ctx.roundRect(padding, y, barWidth, barHeight, 4);
      ctx.fill();

      // Label
      ctx.fillStyle = 'var(--color-text-primary)';
      ctx.font = '12px var(--font-sans)';
      ctx.textAlign = 'right';
      ctx.fillText(d.label, padding - 10, y + barHeight / 2 + 4);

      // Value
      ctx.fillStyle = 'var(--color-text-secondary)';
      ctx.font = '11px var(--font-sans)';
      ctx.textAlign = 'left';
      ctx.fillText(d.value.toLocaleString(), padding + barWidth + 8, y + barHeight / 2 + 4);
    });
  };

  const drawStatusChart = () => {
    const canvas = chartRefs.current.status;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const data = analytics.requestsByStatus;
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const width = rect.width;
    const height = rect.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    ctx.clearRect(0, 0, width, height);

    let startAngle = -Math.PI / 2;
    const colors = {
      'Submitted': '#f59e0b',
      'Pending Review': '#f97316',
      'Approved': '#10b981',
      'Denied': '#ef4444',
      'Scheduled': '#3b82f6',
      'Completed': '#8b5cf6',
      'Cancelled': '#6b7280'
    };

    data.forEach(d => {
      const sliceAngle = (d.value / total) * Math.PI * 2;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[d.label] || '#6b7280';
      ctx.fill();

      // Label
      const midAngle = startAngle + sliceAngle / 2;
      const labelX = centerX + Math.cos(midAngle) * (radius * 0.7);
      const labelY = centerY + Math.sin(midAngle) * (radius * 0.7);
      
      if (sliceAngle > 0.2) {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 11px var(--font-sans)';
        ctx.textAlign = 'center';
        ctx.fillText(`${d.label}\n${d.value}`, labelX, labelY);
      }

      startAngle += sliceAngle;
    });

    // Center text
    ctx.fillStyle = 'var(--color-text-primary)';
    ctx.font = 'bold 18px var(--font-sans)';
    ctx.textAlign = 'center';
    ctx.fillText(total.toLocaleString(), centerX, centerY - 4);
    ctx.font = '11px var(--font-sans)';
    ctx.fillStyle = 'var(--color-text-tertiary)';
    ctx.fillText('Total Requests', centerX, centerY + 16);
  };

  const drawDurationChart = () => {
    const canvas = chartRefs.current.duration;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const data = analytics.durationDistribution;
    const maxVal = Math.max(...data.map(d => d.value));
    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = 'var(--color-border-light)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    const barWidth = chartWidth / data.length * 0.6;

    data.forEach((d, i) => {
      const x = padding + (chartWidth / data.length) * i + (chartWidth / data.length - barWidth) / 2;
      const barHeight = (d.value / maxVal) * chartHeight;
      const y = height - padding - barHeight;

      const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
      gradient.addColorStop(0, 'var(--color-accent)');
      gradient.addColorStop(1, 'var(--color-accent-dark)');
      ctx.fillStyle = gradient;
      ctx.roundRect(x, y, barWidth, barHeight, 4);
      ctx.fill();

      // Label
      ctx.fillStyle = 'var(--color-text-tertiary)';
      ctx.font = '11px var(--font-sans)';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, x + barWidth / 2, height - padding + 18);

      // Value
      ctx.fillStyle = 'var(--color-text-secondary)';
      ctx.font = 'bold 11px var(--font-sans)';
      ctx.fillText(d.value.toString(), x + barWidth / 2, y - 6);
    });
  };

  const drawEngagementChart = () => {
    const canvas = chartRefs.current.engagement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const data = analytics.engagementTrends;
    const width = rect.width;
    const height = rect.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    ctx.clearRect(0, 0, width, height);

    // Find max value across all series
    const allValues = data.flatMap(d => d.data);
    const maxVal = Math.max(...allValues) * 1.2;

    const colors = {
      'Employees': 'var(--color-secondary)',
      'Hosts': 'var(--color-accent)',
      'Sessions': 'var(--color-success)'
    };

    // Grid
    ctx.strokeStyle = 'var(--color-border-light)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    // Draw each series
    data.forEach((series, seriesIndex) => {
      ctx.beginPath();
      ctx.strokeStyle = colors[series.label] || 'var(--color-text-secondary)';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      series.data.forEach((value, i) => {
        const x = padding + (chartWidth / (series.data.length - 1)) * i;
        const y = height - padding - (value / maxVal) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Points
      series.data.forEach((value, i) => {
        const x = padding + (chartWidth / (series.data.length - 1)) * i;
        const y = height - padding - (value / maxVal) * chartHeight;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = colors[series.label] || 'var(--color-text-secondary)';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });

    // X-axis labels
    ctx.fillStyle = 'var(--color-text-tertiary)';
    ctx.font = '11px var(--font-sans)';
    ctx.textAlign = 'center';
    data[0].data.forEach((_, i) => {
      const x = padding + (chartWidth / (data[0].data.length - 1)) * i;
      const month = new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' });
      ctx.fillText(month, x, height - padding + 20);
    });

    // Legend
    ctx.font = '11px var(--font-sans)';
    data.forEach((series, i) => {
      const x = padding + i * 120;
      const y = padding - 20;
      ctx.fillStyle = colors[series.label];
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'var(--color-text-secondary)';
      ctx.textAlign = 'left';
      ctx.fillText(series.label, x + 10, y + 4);
    });
  };

  if (!isAdmin) {
    return (
      <div className="page-container">
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
          <div className="empty-state-icon" style={{ fontSize: '64px' }}>🔒</div>
          <h3 className="empty-state-title">Administrator Access Required</h3>
          <p className="empty-state-description">The analytics dashboard is only available to administrators.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--spacing-4)' }}>
        <div>
          <h1 className="page-title">Analytics Dashboard</h1>
          <p className="page-subtitle">Executive insights into shadow program participation and outcomes</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <button className="btn btn-secondary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Export Report
          </button>
          <button className="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 16 7 22 7"></polyline>
              <path d="M6.03 18.12a2.82 2.82 0 0 1 0 3.75L6 23l5-3 5 3-.28.87a2.82 2.82 0 0 1-3.75 0L6 19.34l-5 3-.28-.87a2.82 2.82 0 0 1 0-3.75l5.31-3.18"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <div className="kpi-card-icon primary">📋</div>
          </div>
          <div className="kpi-card-value">{analytics.totalRequests.toLocaleString()}</div>
          <div className="kpi-card-label">Total Requests</div>
          <div className="kpi-card-trend positive">+12% vs last month</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <div className="kpi-card-icon success">✅</div>
          </div>
          <div className="kpi-card-value">{analytics.approvalRate}%</div>
          <div className="kpi-card-label">Approval Rate</div>
          <div className="kpi-card-trend positive">+2.3% vs last month</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <div className="kpi-card-icon secondary">👥</div>
          </div>
          <div className="kpi-card-value">{analytics.participationRate}%</div>
          <div className="kpi-card-label">Participation Rate</div>
          <div className="kpi-card-trend positive">+5.1% vs last month</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <div className="kpi-card-icon accent">⭐</div>
          </div>
          <div className="kpi-card-value">{analytics.completedSessions}</div>
          <div className="kpi-card-label">Completed Sessions</div>
          <div className="kpi-card-trend positive">+8 this month</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <div className="kpi-card-icon warning">📅</div>
          </div>
          <div className="kpi-card-value">{analytics.upcomingSessions}</div>
          <div className="kpi-card-label">Upcoming Sessions</div>
          <div className="kpi-card-trend neutral">3 this week</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-card-header">
            <div className="kpi-card-icon secondary">⏱️</div>
          </div>
          <div className="kpi-card-value">{analytics.avgSessionDuration}</div>
          <div className="kpi-card-label">Avg Session Duration</div>
          <div className="kpi-card-trend neutral">No change</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: 'var(--spacing-6)', marginBottom: 'var(--spacing-6)' }}>
        {/* Monthly Participation */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Monthly Participation</h2>
          </div>
          <div className="card-content" style={{ height: '300px', position: 'relative' }}>
            <canvas ref={el => chartRefs.current.monthly = el} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>

        {/* Top Organizations */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Top Organizations by Requests</h2>
          </div>
          <div className="card-content" style={{ height: '300px', position: 'relative' }}>
            <canvas ref={el => chartRefs.current.org = el} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>

        {/* Requests by Status */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Requests by Status</h2>
          </div>
          <div className="card-content" style={{ height: '300px', position: 'relative' }}>
            <canvas ref={el => chartRefs.current.status = el} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>

        {/* Session Duration Distribution */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Session Duration Distribution</h2>
          </div>
          <div className="card-content" style={{ height: '300px', position: 'relative' }}>
            <canvas ref={el => chartRefs.current.duration = el} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>

        {/* Engagement Trends */}
        <div className="card" style={{ gridColumn: '1 / -1' }}>
          <div className="card-header">
            <h2 className="card-title">Engagement Trends</h2>
          </div>
          <div className="card-content" style={{ height: '300px', position: 'relative' }}>
            <canvas ref={el => chartRefs.current.engagement = el} style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      </div>

      {/* Additional Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--spacing-6)' }}>
        {/* Cross-Directorate Collaboration */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Cross-Directorate Collaboration</h2>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {analytics.crossDirectorateCollaboration.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
                  <div style={{ width: '80px', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>{item.from}</div>
                  <div style={{ flex: 1, height: '8px', backgroundColor: 'var(--color-border-light)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${item.percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))', borderRadius: 'var(--radius-full)' }} />
                  </div>
                  <div style={{ width: '50px', textAlign: 'right', fontWeight: '600', fontSize: 'var(--text-sm)' }}>{item.percentage}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Hosts */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Most Requested Hosts</h2>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {analytics.topHosts.map((host, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: 'var(--radius-full)', background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 'var(--text-sm)', fontWeight: '700' }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: '600', color: 'var(--color-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {host.name}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                      {host.position} • {host.organization}
                    </div>
                  </div>
                  <span className="badge badge-primary">{host.requests} requests</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Category Demand */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Skill Category Demand</h2>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)' }}>
              {analytics.skillDemand.map((skill, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', padding: 'var(--spacing-2) var(--spacing-3)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <span style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>{skill.category}</span>
                  <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--color-border-light)', borderRadius: 'var(--radius-full)' }}>
                    <div style={{ width: `${skill.percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-accent), var(--color-accent-dark))', borderRadius: 'var(--radius-full)' }} />
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: '600', color: 'var(--color-secondary)' }}>{skill.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Activity</h2>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              {[
                { type: 'request', text: 'New shadow request submitted for "Strategic Leadership Shadow"', time: '2 hours ago', icon: '📋', color: 'var(--color-secondary)' },
                { type: 'approval', text: 'Request approved for "Cyber Operations Division Shadow"', time: '4 hours ago', icon: '✅', color: 'var(--color-success)' },
                { type: 'completion', text: 'Shadow session completed: "Data Analytics Branch Experience"', time: '1 day ago', icon: '🎓', color: 'var(--color-accent)' },
                { type: 'feedback', text: 'Feedback received for "Executive Leadership Shadow Program"', time: '2 days ago', icon: '⭐', color: 'var(--color-warning)' },
                { type: 'new_opp', text: 'New opportunity created: "Acquisition Program Management Shadow"', time: '3 days ago', icon: '➕', color: 'var(--color-primary)' },
              ].map((activity, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--spacing-3)', padding: 'var(--spacing-3)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-full)', backgroundColor: `${activity.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--text-lg)', flexShrink: 0 }}>
                    {activity.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>{activity.text}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--spacing-1)' }}>{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}