import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { shadowRequests, shadowOpportunities, employees, organizations } from '../data/mockData';
import { formatDate } from '../utils/formatters';

export default function Calendar() {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'month', 'week', 'day'
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);

  // Get user's events
  const userEvents = useMemo(() => {
    if (!currentUser) return [];
    
    const myRequests = shadowRequests.filter(r => r.employeeId === currentUser.id);
    const hostedOpps = shadowOpportunities.filter(o => o.hostId === currentUser.id);
    const hostedRequests = shadowRequests.filter(r => hostedOpps.some(o => o.id === r.opportunityId));
    
    return [
      ...myRequests.filter(r => r.scheduledDate).map(r => ({
        id: `req-${r.id}`,
        title: shadowOpportunities.find(o => o.id === r.opportunityId)?.title || 'Shadow Session',
        date: r.scheduledDate,
        type: 'attending',
        status: r.status,
        opportunityId: r.opportunityId
      })),
      ...hostedRequests.filter(r => r.scheduledDate).map(r => ({
        id: `host-${r.id}`,
        title: `Host: ${shadowOpportunities.find(o => o.id === r.opportunityId)?.title || 'Shadow Session'}`,
        date: r.scheduledDate,
        type: 'hosting',
        status: r.status,
        opportunityId: r.opportunityId
      }))
    ];
  }, [currentUser]);

  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const startingDay = firstDay.getDay(); // 0 = Sunday
    const totalDays = lastDay.getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, currentMonth: false, date: new Date(year, month - 1, daysInPrevMonth - i) });
    }
    
    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(year, month, i);
      days.push({ day: i, currentMonth: true, date });
    }
    
    // Next month days to fill grid
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ day: i, currentMonth: false, date: new Date(year, month + 1, i) });
    }
    
    return days;
  }, [currentMonth]);

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return userEvents.filter(e => e.date === dateStr);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--spacing-4)' }}>
        <div>
          <h1 className="page-title">Calendar</h1>
          <p className="page-subtitle">View and manage your shadow sessions and commitments</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
          <button className={`btn ${viewMode === 'month' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setViewMode('month')}>Month</button>
          <button className={`btn ${viewMode === 'week' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setViewMode('week')}>Week</button>
          <button className={`btn ${viewMode === 'day' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setViewMode('day')}>Day</button>
        </div>
      </div>

      {/* Month View */}
      {viewMode === 'month' && (
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className="card-title" style={{ margin: 0 }}>
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setCurrentMonth(d => { const nd = new Date(d); nd.setMonth(nd.getMonth() - 1); return nd; })}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <button className="btn btn-ghost btn-sm" onClick={() => setCurrentMonth(new Date())}>Today</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setCurrentMonth(d => { const nd = new Date(d); nd.setMonth(nd.getMonth() + 1); return nd; })}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="card-content" style={{ padding: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} style={{ padding: 'var(--spacing-3)', textAlign: 'center', fontWeight: '600', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', borderBottom: '1px solid var(--color-border-light)', backgroundColor: 'var(--color-bg-secondary)' }}>
                  {day}
                </div>
              ))}
              {daysInMonth.map((dayObj, index) => {
                const dayEvents = getEventsForDate(dayObj.date);
                const isToday = dayObj.date.getTime() === today.getTime();
                const isSelected = selectedDate && dayObj.date.getTime() === selectedDate.getTime();
                
                return (
                  <div
                    key={index}
                    style={{
                      minHeight: '100px',
                      borderRight: index % 7 !== 6 ? '1px solid var(--color-border-light)' : 'none',
                      borderBottom: index >= 35 ? 'none' : '1px solid var(--color-border-light)',
                      backgroundColor: isToday ? 'rgb(59 130 246 / 0.05)' : dayObj.currentMonth ? 'var(--color-bg-card)' : 'var(--color-bg-tertiary)',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background-color var(--transition-fast)'
                    }}
                    onClick={() => setSelectedDate(dayObj.date)}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      margin: 'var(--spacing-2) auto 0',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: isToday ? '700' : '500',
                      color: dayObj.currentMonth ? (isToday ? 'var(--color-secondary)' : 'var(--color-text-primary)') : 'var(--color-text-muted)',
                      backgroundColor: isToday ? 'rgb(59 130 246 / 0.1)' : isSelected ? 'var(--color-secondary)' : 'transparent',
                      fontSize: 'var(--text-sm)'
                    }}>
                      {dayObj.day}
                    </div>
                    
                    <div style={{ padding: '0 var(--spacing-2) var(--spacing-2)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event.id}
                          style={{
                            padding: '2px var(--spacing-2)',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: '500',
                            backgroundColor: event.type === 'hosting' ? 'rgb(59 130 246 / 0.2)' : 'rgb(16 185 129 / 0.2)',
                            color: event.type === 'hosting' ? 'var(--color-secondary)' : 'var(--color-success)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            borderLeft: `3px solid ${event.type === 'hosting' ? 'var(--color-secondary)' : 'var(--color-success)'}`
                          }}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && (
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                          +{dayEvents.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Week View */}
      {viewMode === 'week' && (
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 className="card-title" style={{ margin: 0 }}>
                Week of {formatDate(currentMonth)}
              </h2>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setCurrentMonth(d => { const nd = new Date(d); nd.setDate(nd.getDate() - 7); return nd; })}>Previous</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setCurrentMonth(new Date())}>This Week</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setCurrentMonth(d => { const nd = new Date(d); nd.setDate(nd.getDate() + 7); return nd; })}>Next</button>
              </div>
            </div>
          </div>
          <div className="card-content" style={{ padding: 0 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)' }}>
              {/* Time column */}
              <div style={{ borderRight: '1px solid var(--color-border-light)' }}>
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} style={{ height: '60px', borderBottom: '1px solid var(--color-border-light)', fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', padding: 'var(--spacing-1)', textAlign: 'right' }}>
                    {i.toString().padStart(2, '0')}:00
                  </div>
                ))}
              </div>
              {/* Days */}
              {Array.from({ length: 7 }, (_, i) => {
                const day = new Date(currentMonth);
                day.setDate(day.getDate() - day.getDay() + i);
                const dayEvents = getEventsForDate(day);
                const isToday = day.getTime() === today.getTime();
                
                return (
                  <div key={i} style={{ borderRight: i !== 6 ? '1px solid var(--color-border-light)' : 'none', minHeight: '1440px', position: 'relative', backgroundColor: isToday ? 'rgb(59 130 246 / 0.02)' : 'transparent' }}>
                    <div style={{ height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--color-border-light)', backgroundColor: isToday ? 'rgb(59 130 246 / 0.1)' : 'var(--color-bg-secondary)', fontWeight: '600' }}>
                      {day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        style={{
                          position: 'absolute',
                          top: `${60 + (new Date(event.date).getHours() * 60)}px`,
                          left: 'var(--spacing-2)',
                          right: 'var(--spacing-2)',
                          height: '60px',
                          backgroundColor: event.type === 'hosting' ? 'var(--color-secondary)' : 'var(--color-success)',
                          color: 'white',
                          borderRadius: 'var(--radius-sm)',
                          padding: 'var(--spacing-2)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: '500',
                          overflow: 'hidden',
                          zIndex: 10
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Events List for Selected Date */}
      {selectedDate && (
        <div className="card" style={{ marginTop: 'var(--spacing-6)' }}>
          <div className="card-header">
            <h2 className="card-title">Events on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h2>
            <button className="btn btn-ghost btn-sm" onClick={() => setSelectedDate(null)}>Clear</button>
          </div>
          <div className="card-content">
            {getEventsForDate(selectedDate).map(event => (
              <div key={event.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)', padding: 'var(--spacing-4)', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-3)' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: 'var(--radius-full)', backgroundColor: event.type === 'hosting' ? 'var(--color-secondary)' : 'var(--color-success)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600' }}>{event.title}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
                    {event.type === 'hosting' ? 'Hosting' : 'Attending'} • {event.status}
                  </div>
                </div>
                <span className={`badge ${event.type === 'hosting' ? 'badge-primary' : 'badge-success'}`}>
                  {event.type === 'hosting' ? 'Host' : 'Attendee'}
                </span>
              </div>
            ))}
            {getEventsForDate(selectedDate).length === 0 && (
              <div className="empty-state" style={{ padding: 'var(--spacing-8)' }}>
                <p style={{ color: 'var(--color-text-tertiary)' }}>No events scheduled for this day.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="card" style={{ marginTop: 'var(--spacing-6)' }}>
        <div className="card-content">
          <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: '600', marginBottom: 'var(--spacing-3)' }}>Legend</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-secondary)' }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Hosting</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-success)' }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Attending</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-warning)' }} />
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Pending</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: 'var(--radius-full)', backgroundColor: 'rgb(59 130 246 / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', color: 'var(--color-secondary)', fontSize: 'var(--text-sm)' }}>1</div>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}