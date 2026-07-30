import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { shadowOpportunities, detailOpportunities, organizations, skillCategories, experienceLevels } from '../data/mockData';
import { formatDate, search, filterBy } from '../utils/formatters';

export default function Opportunities() {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    opportunityType: 'Shadow', // 'Shadow' or 'Detail'
    organization: 'All',
    directorate: 'All',
    division: 'All',
    experienceLevel: 'All',
    skillCategory: 'All',
    virtualOption: false,
    leadershipOnly: false,
    availableOnly: true
  });
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Get unique filter options
  const directorates = useMemo(() => 
    [...new Set(organizations.filter(o => o.type === 'Directorate').map(o => o.name))], []);
  
  const divisions = useMemo(() => 
    [...new Set(organizations.filter(o => o.type === 'Division').map(o => o.name))], []);

  const getOpportunities = () => filters.opportunityType === 'Detail' ? detailOpportunities : shadowOpportunities;
  const opportunities = getOpportunities();

  const orgNames = useMemo(() => 
    [...new Set(opportunities.map(o => {
      const org = organizations.find(org => org.id === o.organizationId);
      return org?.name || o.organizationId;
    }))], [opportunities]);

  // Filter and search opportunities
  const filteredOpportunities = useMemo(() => {
    let result = opportunities.filter(o => o.status === 'Active' || !filters.availableOnly);
    
    // Search
    if (searchQuery) {
      result = search(result, searchQuery, ['title', 'description', 'objectives', 'hostInfo.name', 'skillCategories', 'tags']);
    }
    
    // Filters
    if (filters.organization !== 'All') {
      result = result.filter(o => {
        const org = organizations.find(org => org.id === o.organizationId);
        return org?.name === filters.organization;
      });
    }
    
    if (filters.directorate !== 'All') {
      result = result.filter(o => {
        const dir = organizations.find(org => org.id === o.directorateId);
        return dir?.name === filters.directorate;
      });
    }
    
    if (filters.division !== 'All') {
      result = result.filter(o => {
        const div = organizations.find(org => org.id === o.divisionId);
        return div?.name === filters.division;
      });
    }
    
    if (filters.experienceLevel !== 'All') {
      result = result.filter(o => o.experienceLevel === filters.experienceLevel);
    }
    
    if (filters.skillCategory !== 'All') {
      result = result.filter(o => o.skillCategories.includes(filters.skillCategory));
    }
    
    if (filters.virtualOption) {
      result = result.filter(o => o.virtualOption);
    }
    
    if (filters.leadershipOnly) {
      result = result.filter(o => o.leadershipLevel);
    }
    
    // Sort
    result.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [searchQuery, filters, sortBy, sortDirection]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const clearFilters = () => {
    setFilters({
      organization: 'All',
      directorate: 'All',
      division: 'All',
      experienceLevel: 'All',
      skillCategory: 'All',
      virtualOption: false,
      leadershipOnly: false,
      availableOnly: true
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== 'All' && v !== false && v !== true);

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--spacing-4)' }}>
        <div>
          <h1 className="page-title">Opportunity Catalog</h1>
          <p className="page-subtitle">
            {filters.opportunityType === 'Detail' 
              ? `Browse and discover detail opportunities (3-6 month rotational assignments). {filteredOpportunities.length} detail opportunity${filteredOpportunities.length !== 1 ? 's' : ''} found.`
              : `Browse and discover shadow opportunities across the organization. ${filteredOpportunities.length} shadow opportunity${filteredOpportunities.length !== 1 ? 's' : ''} found.`}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
          {currentUser?.role === 'Host' && (
            <button className="btn btn-primary" onClick={() => actions.setActivePage('opportunities')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Opportunity
            </button>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card" style={{ marginBottom: 'var(--spacing-6)' }}>
        <div className="card-content" style={{ padding: 'var(--spacing-4) var(--spacing-6)' }}>
          {/* Search Bar */}
          <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="search"
                className="search-input"
                placeholder="Search by title, host, organization, skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 'var(--spacing-10)' }}
              />
            </div>
            <button className="btn btn-outline" onClick={clearFilters} disabled={!hasActiveFilters}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3h18v18H3z"></path>
                <path d="M19 3v18"></path>
                <path d="M3 21h18"></path>
              </svg>
              Clear Filters
            </button>
          </div>

          {/* Filter Row */}
          <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label className="form-label">Opportunity Type</label>
              <select className="form-select" value={filters.opportunityType} onChange={(e) => handleFilterChange('opportunityType', e.target.value)}>
                <option value="Shadow">Shadow Opportunities</option>
                <option value="Detail">Detail Opportunities (3-6 months)</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label className="form-label">Organization</label>
              <select className="form-select" value={filters.organization} onChange={(e) => handleFilterChange('organization', e.target.value)}>
                <option value="All">All Organizations</option>
                {orgNames.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label className="form-label">Directorate</label>
              <select className="form-select" value={filters.directorate} onChange={(e) => handleFilterChange('directorate', e.target.value)}>
                <option value="All">All Directorates</option>
                {directorates.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <label className="form-label">Division</label>
              <select className="form-select" value={filters.division} onChange={(e) => handleFilterChange('division', e.target.value)}>
                <option value="All">All Divisions</option>
                {divisions.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label className="form-label">Experience Level</label>
              <select className="form-select" value={filters.experienceLevel} onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}>
                <option value="All">All Levels</option>
                {experienceLevels.map(level => <option key={level} value={level}>{level}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label className="form-label">Skill Category</label>
              <select className="form-select" value={filters.skillCategory} onChange={(e) => handleFilterChange('skillCategory', e.target.value)}>
                <option value="All">All Categories</option>
                {skillCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* Checkbox Filters */}
          <div style={{ display: 'flex', gap: 'var(--spacing-6)', marginTop: 'var(--spacing-4)', flexWrap: 'wrap', alignItems: 'center' }}>
            <label className="checkbox-group">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={filters.virtualOption}
                onChange={(e) => handleFilterChange('virtualOption', e.target.checked)}
              />
              <span className="checkbox-label">Virtual Option Available</span>
            </label>
            <label className="checkbox-group">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={filters.leadershipOnly}
                onChange={(e) => handleFilterChange('leadershipOnly', e.target.checked)}
              />
              <span className="checkbox-label">Leadership Shadows Only</span>
            </label>
            <label className="checkbox-group">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={filters.availableOnly}
                onChange={(e) => handleFilterChange('availableOnly', e.target.checked)}
              />
              <span className="checkbox-label">Available Seats Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="card" style={{ marginBottom: 'var(--spacing-4)' }}>
        <div className="card-content" style={{ padding: 'var(--spacing-3) var(--spacing-4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--spacing-3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <button
              className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('cards')}
              aria-pressed={viewMode === 'cards'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                <rect x="14" y="14" width="7" height="7" rx="1"></rect>
              </svg>
              Cards
            </button>
            <button
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setViewMode('table')}
              aria-pressed={viewMode === 'table'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="3" x2="21" y2="3"></line>
                <line x1="3" y1="9" x2="21" y2="9"></line>
                <line x1="3" y1="15" x2="21" y2="15"></line>
                <line x1="3" y1="21" x2="21" y2="21"></line>
                <line x1="3" y1="3" x2="3" y2="21"></line>
                <line x1="9" y1="3" x2="9" y2="21"></line>
                <line x1="15" y1="3" x2="15" y2="21"></line>
              </svg>
              Table
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)' }}>
            <label style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>Sort by:</label>
            <select
              className="form-select"
              style={{ width: 'auto', minWidth: '180px' }}
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
            >
              <option value="createdAt">Newest First</option>
              <option value="title">Title A-Z</option>
              <option value="organizationId">Organization</option>
              <option value="experienceLevel">Experience Level</option>
              <option value="duration">Duration</option>
              <option value="remainingSeats">Seats Available</option>
            </select>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              aria-label={sortDirection === 'asc' ? 'Sort descending' : 'Sort ascending'}
            >
              {sortDirection === 'asc' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="15" x2="12" y2="9"></line>
                  <line x1="12" y1="9" x2="6" y2="15"></line>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="6" y1="9" x2="12" y2="15"></line>
                  <line x1="12" y1="15" x2="18" y2="9"></line>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {viewMode === 'cards' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: 'var(--spacing-4)' }}>
          {filteredOpportunities.map((opp, index) => (
            <OpportunityCard key={opp.id} opportunity={opp} index={index} />
          ))}
        </div>
      ) : (
        <div className="table-container">
          <table className="table" role="grid">
            <thead>
              <tr>
                <th scope="col" style={{ width: '40px' }}>
                  <input type="checkbox" className="checkbox-input" />
                </th>
                <th scope="col" onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                  Title {sortBy === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope="col" onClick={() => handleSort('organizationId')} style={{ cursor: 'pointer' }}>
                  Organization {sortBy === 'organizationId' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope="col">Host</th>
                <th scope="col" onClick={() => handleSort('experienceLevel')} style={{ cursor: 'pointer' }}>
                  Level {sortBy === 'experienceLevel' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope="col" onClick={() => handleSort('duration')} style={{ cursor: 'pointer' }}>
                  Duration {sortBy === 'duration' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope="col" onClick={() => handleSort('remainingSeats')} style={{ cursor: 'pointer' }}>
                  Seats {sortBy === 'remainingSeats' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope="col">Location</th>
                <th scope="col">Dates</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpportunities.map((opp) => (
                <tr key={opp.id}>
                  <td><input type="checkbox" className="checkbox-input" /></td>
                  <td>
                    <div style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>
                      {opp.leadershipLevel && <span className="badge badge-accent" style={{ marginRight: 'var(--spacing-2)', fontSize: 'var(--text-xs)' }}>★ Leadership</span>}
                      {opp.title}
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{opp.officeSymbol}</div>
                  </td>
                  <td>
                    <div>{organizations.find(o => o.id === opp.organizationId)?.name || opp.organizationId}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{opp.directorateId}</div>
                  </td>
                  <td>{opp.hostInfo.name}</td>
                  <td>
                    <span className={`badge ${getLevelBadge(opp.experienceLevel)}`}>{opp.experienceLevel}</span>
                  </td>
                  <td>{opp.duration}</td>
                  <td>
                    <span style={{ fontWeight: '600', color: opp.remainingSeats > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
                      {opp.remainingSeats}/{opp.capacity}
                    </span>
                  </td>
                  <td>
                    <div>{opp.location}</div>
                    {opp.virtualOption && <span className="badge badge-secondary" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--spacing-1)' }}>Virtual Available</span>}
                  </td>
                  <td>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                      {opp.availableDates.length} dates available
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      First: {formatDate(opp.availableDates[0])}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                      <button className="btn btn-ghost btn-sm" aria-label="View details">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                      <button className="btn btn-ghost btn-sm" aria-label="Save opportunity">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredOpportunities.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 'var(--spacing-12)' }}>
          <div className="empty-state-icon" style={{ margin: '0 auto var(--spacing-4)' }}>🔍</div>
          <h3 className="empty-state-title">No opportunities found</h3>
          <p className="empty-state-description">Try adjusting your search or filters to find what you're looking for.</p>
          <button className="btn btn-outline" onClick={clearFilters}>Clear All Filters</button>
        </div>
      )}

      {/* Pagination */}
      {filteredOpportunities.length > 20 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-6)' }}>
          <button className="btn btn-outline btn-sm" disabled>Previous</button>
          <button className="btn btn-primary btn-sm">1</button>
          <button className="btn btn-outline btn-sm">2</button>
          <button className="btn btn-outline btn-sm">3</button>
          <span style={{ color: 'var(--color-text-muted)' }}>...</span>
          <button className="btn btn-outline btn-sm">10</button>
          <button className="btn btn-outline btn-sm">Next</button>
        </div>
      )}
    </div>
  );
}

function OpportunityCard({ opportunity, index }) {
  const { actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const isSaved = currentUser?.savedOpportunities?.includes(opportunity.id);
  const hasApplied = false; // Would check requests

  const hostOrg = organizations.find(o => o.id === opportunity.organizationId);

  return (
    <div className="card" style={{ 
      display: 'flex', 
      flexDirection: 'column',
      animation: 'fadeInUp 0.4s ease forwards',
      opacity: 0,
      animationDelay: `${index * 50}ms`
    }}>
      <div style={{ 
        height: '4px', 
        background: opportunity.leadershipLevel 
          ? 'linear-gradient(90deg, var(--color-warning), var(--color-accent))' 
          : 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))'
      }} />
      
      <div className="card-content" style={{ padding: 'var(--spacing-4)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)', flexWrap: 'wrap' }}>
              {opportunity.leadershipLevel && (
                <span className="badge badge-accent" style={{ fontSize: 'var(--text-xs)' }}>★ Leadership</span>
              )}
              {opportunity.featured && (
                <span className="badge badge-primary" style={{ fontSize: 'var(--text-xs)' }}>Featured</span>
              )}
              {opportunity.virtualOption && (
                <span className="badge badge-secondary" style={{ fontSize: 'var(--text-xs)' }}>Virtual</span>
              )}
            </div>
            <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: '600', color: 'var(--color-text-primary)', lineHeight: 1.3 }}>
              {opportunity.title}
            </h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)', marginTop: 'var(--spacing-1)' }}>
              {opportunity.hostInfo.name} • {opportunity.hostInfo.organization}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
            <button
              className={`btn btn-ghost btn-icon-sm ${isSaved ? 'text-warning' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                if (isSaved) {
                  actions.unsaveOpportunity(opportunity.id);
                } else {
                  actions.saveOpportunity(opportunity.id);
                }
              }}
              aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--spacing-3)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {opportunity.description}
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-3)' }}>
          {opportunity.skillCategories.slice(0, 4).map(skill => (
            <span key={skill} className="badge badge-secondary" style={{ fontSize: 'var(--text-xs)' }}>{skill}</span>
          ))}
          {opportunity.skillCategories.length > 4 && (
            <span className="badge badge-secondary" style={{ fontSize: 'var(--text-xs)' }}>
              +{opportunity.skillCategories.length - 4} more
            </span>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)', fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{opportunity.availableDates.length} dates</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>{opportunity.duration}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span style={{ fontWeight: '600', color: opportunity.remainingSeats > 0 ? 'var(--color-success)' : 'var(--color-error)' }}>
              {opportunity.remainingSeats}/{opportunity.capacity}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-1)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{hostOrg?.name || opportunity.organizationId}</span>
          </div>
        </div>
      </div>

      <div className="card-footer" style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
        <button className="btn btn-primary btn-block" style={{ flex: 1 }} onClick={() => { /* navigate to detail */ }}>
          View Details
        </button>
        {opportunity.remainingSeats > 0 && !hasApplied && (
          <button className="btn btn-success" style={{ flex: 1 }}>
            Request Shadow
          </button>
        )}
        {hasApplied && (
          <button className="btn btn-secondary" style={{ flex: 1 }} disabled>
            Applied
          </button>
        )}
        {opportunity.remainingSeats === 0 && (
          <button className="btn btn-secondary" style={{ flex: 1 }} disabled>
            Full
          </button>
        )}
      </div>
    </div>
  );
}

function getLevelBadge(level) {
  switch (level) {
    case 'Senior': return 'badge-error';
    case 'Advanced': return 'badge-warning';
    case 'Intermediate': return 'badge-primary';
    case 'Entry': return 'badge-success';
    default: return 'badge-secondary';
  }
}