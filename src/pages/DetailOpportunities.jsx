import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { detailOpportunities, organizations, skillCategories, experienceLevels } from '../data/mockData';
import { formatDate, search } from '../utils/formatters';

export default function DetailOpportunities() {
  const { state, actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    organization: 'All',
    directorate: 'All',
    division: 'All',
    experienceLevel: 'All',
    skillCategory: 'All',
    detailType: 'All',
    virtualOption: false,
    availableOnly: true
  });
  const [viewMode, setViewMode] = useState('cards');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Get unique filter options
  const directorates = useMemo(() => 
    [...new Set(organizations.filter(o => o.type === 'Directorate').map(o => o.name))], []);
  
  const divisions = useMemo(() => 
    [...new Set(organizations.filter(o => o.type === 'Division').map(o => o.name))], []);

  const orgNames = useMemo(() => 
    [...new Set(detailOpportunities.map(o => {
      const org = organizations.find(org => org.id === o.organizationId);
      return org?.name || o.organizationId;
    }))], []);

  const detailTypes = useMemo(() => 
    [...new Set(detailOpportunities.map(o => o.detailType))], []);

  // Filter and search opportunities
  const filteredOpportunities = useMemo(() => {
    let result = detailOpportunities.filter(o => o.status === 'Active' || !filters.availableOnly);
    
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
    
    if (filters.detailType !== 'All') {
      result = result.filter(o => o.detailType === filters.detailType);
    }
    
    if (filters.virtualOption) {
      result = result.filter(o => o.virtualOption);
    }
    
    if (filters.availableOnly) {
      result = result.filter(o => o.filledPositions < o.capacity);
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
      detailType: 'All',
      virtualOption: false,
      availableOnly: true
    });
    setSearchQuery('');
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== 'All' && v !== false && v !== true);

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 'var(--spacing-4)' }}>
        <div>
          <h1 className="page-title">Detail Opportunities</h1>
          <p className="page-subtitle">
            Browse 3-6 month rotational assignments. Serve in a different role, build cross-functional skills, then return to your position.
            {filteredOpportunities.length} detail opportunit{filteredOpportunities.length !== 1 ? 'ies' : 'y'} found.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--spacing-3)', flexWrap: 'wrap' }}>
          {currentUser?.role === 'Host' && (
            <button className="btn btn-primary" onClick={() => actions.setActivePage('create-detail-opportunity')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Create Detail Opportunity
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
                placeholder="Search by title, host, organization, skills, detail type..."
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

          {/* Filter Row 1 */}
          <div style={{ display: 'flex', gap: 'var(--spacing-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
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

          {/* Filter Row 2 */}
          <div style={{ display: 'flex', gap: 'var(--spacing-4)', marginTop: 'var(--spacing-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label className="form-label">Detail Type</label>
              <select className="form-select" value={filters.detailType} onChange={(e) => handleFilterChange('detailType', e.target.value)}>
                <option value="All">All Types</option>
                {detailTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label className="form-label">Duration</label>
              <select className="form-select" value={filters.duration || 'All'} onChange={(e) => handleFilterChange('duration', e.target.value)}>
                <option value="All">All Durations</option>
                <option value="3">3 months</option>
                <option value="4">4 months</option>
                <option value="5">5 months</option>
                <option value="6">6 months</option>
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
                checked={filters.availableOnly}
                onChange={(e) => handleFilterChange('availableOnly', e.target.checked)}
              />
              <span className="checkbox-label">Available Positions Only</span>
            </label>
            <label className="checkbox-group">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={filters.featuredOnly}
                onChange={(e) => handleFilterChange('featuredOnly', e.target.checked)}
              />
              <span className="checkbox-label">Featured Only</span>
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
              <option value="durationMonths">Duration (months)</option>
              <option value="detailType">Detail Type</option>
              <option value="capacity">Capacity</option>
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
            <DetailOpportunityCard key={opp.id} opportunity={opp} index={index} />
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
                <th scope="col" onClick={() => handleSort('detailType')} style={{ cursor: 'pointer' }}>
                  Type {sortBy === 'detailType' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope="col" onClick={() => handleSort('experienceLevel')} style={{ cursor: 'pointer' }}>
                  Level {sortBy === 'experienceLevel' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope="col" onClick={() => handleSort('durationMonths')} style={{ cursor: 'pointer' }}>
                  Duration {sortBy === 'durationMonths' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope="col" onClick={() => handleSort('capacity')} style={{ cursor: 'pointer' }}>
                  Seats {sortBy === 'capacity' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope="col">Location</th>
                <th scope="col">Start Dates</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpportunities.map((opp) => (
                <tr key={opp.id}>
                  <td><input type="checkbox" className="checkbox-input" /></td>
                  <td>
                    <div style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>
                      {opp.featured && <span className="badge badge-primary" style={{ marginRight: 'var(--spacing-2)', fontSize: 'var(--text-xs)' }}>★ Featured</span>}
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
                    <span className={`badge ${getDetailTypeBadge(opp.detailType)}`}>{opp.detailType}</span>
                  </td>
                  <td>
                    <span className={`badge ${getLevelBadge(opp.experienceLevel)}`}>{opp.experienceLevel}</span>
                  </td>
                  <td>{opp.duration} ({opp.durationMonths} months)</td>
                  <td>
                    <span style={{ fontWeight: '600', color: opp.filledPositions < opp.capacity ? 'var(--color-success)' : 'var(--color-error)' }}>
                      {opp.capacity - opp.filledPositions}/{opp.capacity}
                    </span>
                  </td>
                  <td>
                    <div>{opp.location}</div>
                    {opp.virtualOption && <span className="badge badge-secondary" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--spacing-1)' }}>Virtual Available</span>}
                  </td>
                  <td>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                      {opp.availableStartDates.length} start dates
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                      First: {formatDate(opp.availableStartDates[0])}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 'var(--spacing-1)' }}>
                      <button className="btn btn-ghost btn-sm" aria-label="View details" onClick={() => actions.setActivePage('detail-opportunity-detail')}>
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
          <h3 className="empty-state-title">No detail opportunities found</h3>
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

function DetailOpportunityCard({ opportunity, index }) {
  const { actions } = useApp();
  const currentUser = useApp(state => state.currentUser);
  const isSaved = currentUser?.savedOpportunities?.includes(opportunity.id);
  const availableSeats = opportunity.capacity - opportunity.filledPositions;

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
        background: opportunity.featured
          ? 'linear-gradient(90deg, var(--color-warning), var(--color-accent))'
          : 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))'
      }} />
      
      <div className="card-content" style={{ padding: 'var(--spacing-4)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--spacing-3)' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-1)', flexWrap: 'wrap' }}>
              {opportunity.featured && (
                <span className="badge badge-primary" style={{ fontSize: 'var(--text-xs)' }}>Featured</span>
              )}
              <span className={`badge ${getDetailTypeBadge(opportunity.detailType)}`} style={{ fontSize: 'var(--text-xs)' }}>{opportunity.detailType}</span>
              {opportunity.virtualOption && (
                <span className="badge badge-secondary" style={{ fontSize: 'var(--text-xs)' }}>Virtual</span>
              )}
              {opportunity.returnToPosition && (
                <span className="badge badge-success" style={{ fontSize: 'var(--text-xs)' }}>Return to Position</span>
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

        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', lineHeight: 1.5, flex: 1 }}>
          {opportunity.description.substring(0, 150)}...
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-2)', marginTop: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
          <span className="skill-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {opportunity.durationMonths} months
          </span>
          <span className="skill-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {opportunity.location}
          </span>
          {opportunity.virtualOption && (
            <span className="skill-tag">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              Virtual
            </span>
          )}
        </div>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingTop: 'var(--spacing-3)',
          borderTop: '1px solid var(--color-border)',
          marginTop: 'auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-2)' }}>
            <span className={`badge ${getLevelBadge(opportunity.experienceLevel)}`}>{opportunity.experienceLevel}</span>
            {availableSeats > 0 ? (
              <span className="badge badge-success">{availableSeats} seats open</span>
            ) : (
              <span className="badge badge-error">Full</span>
            )}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Starts: {formatDate(opportunity.availableStartDates[0])}
          </div>
        </div>
      </div>
    </div>
  );
}

function getDetailTypeBadge(type) {
  switch (type) {
    case 'Rotational': return 'badge-primary';
    case 'Operational': return 'badge-accent';
    case 'Strategic': return 'badge-warning';
    case 'Innovation': return 'badge-info';
    default: return 'badge-secondary';
  }
}

function getLevelBadge(level) {
  switch (level) {
    case 'All Levels': return 'badge-secondary';
    case 'Entry': return 'badge-success';
    case 'Intermediate': return 'badge-primary';
    case 'Advanced': return 'badge-warning';
    case 'Senior': return 'badge-accent';
    default: return 'badge-secondary';
  }
}