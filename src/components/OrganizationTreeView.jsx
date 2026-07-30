import { useState } from 'react';
import { useApp, useCurrentUser } from '../context/AppContext';
import { organizations, employees } from '../data/mockData';

function ChevronRightIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}

function ChevronDownIcon({ className }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  );
}

function BuildingIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 21V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 2 8v13"></path>
      <path d="M22 16.92V21"></path>
      <path d="M12 2V6"></path>
      <path d="M2 16.92V21"></path>
      <path d="M12 22V16.92"></path>
      <path d="M16 21.72V22"></path>
      <path d="M8 21.72V22"></path>
      <path d="M2 11h20"></path>
    </svg>
  );
}

function UserIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5"></circle>
      <path d="M20 21a8 8 0 0 0-16 0"></path>
    </svg>
  );
}

function UsersIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

function SearchIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
}

function FilterIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
    </svg>
  );
}

function MoreVerticalIcon({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1"></circle>
      <circle cx="12" cy="5" r="1"></circle>
      <circle cx="12" cy="19" r="1"></circle>
    </svg>
  );
}

export default function OrganizationTreeView({ onSelectOrg }) {
  const { state } = useApp();
  const currentUser = useCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set(['org-1', 'org-2']));
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const buildTree = () => {
    return organizations.map(org => {
      const orgEmployees = employees.filter(e => e.organizationId === org.id);
      const departments = [...new Set(orgEmployees.map(e => e.department).filter(Boolean))];
      
      return {
        id: `org-${org.id}`,
        type: 'organization',
        label: org.name,
        subtitle: `${orgEmployees.length} employees`,
        icon: BuildingIcon,
        color: org.color || '#3b82f6',
        children: departments.map(dept => {
          const deptEmployees = orgEmployees.filter(e => e.department === dept);
          const teams = [...new Set(deptEmployees.map(e => e.team).filter(Boolean))];
          
          return {
            id: `dept-${org.id}-${dept.replace(/\s+/g, '-')}`,
            type: 'department',
            label: dept,
            subtitle: `${deptEmployees.length} employees`,
            icon: UsersIcon,
            color: org.color || '#3b82f6',
            children: teams.length > 0 ? teams.map(team => {
              const teamEmployees = deptEmployees.filter(e => e.team === team);
              return {
                id: `team-${org.id}-${dept.replace(/\s+/g, '-')}-${team.replace(/\s+/g, '-')}`,
                type: 'team',
                label: team,
                subtitle: `${teamEmployees.length} members`,
                icon: UsersIcon,
                color: org.color || '#3b82f6',
                children: teamEmployees.map(emp => ({
                  id: `emp-${emp.id}`,
                  type: 'employee',
                  label: `${emp.firstName} ${emp.lastName}`,
                  subtitle: emp.title,
                  icon: UserIcon,
                  color: '#6b7280',
                  data: emp,
                  children: []
                }))
              };
            }) : deptEmployees.map(emp => ({
              id: `emp-${emp.id}`,
              type: 'employee',
              label: `${emp.firstName} ${emp.lastName}`,
              subtitle: emp.title,
              icon: UserIcon,
              color: '#6b7280',
              data: emp,
              children: []
            }))
          };
        })
      };
    });
  };

  const treeData = buildTree();

  const flattenTree = (nodes, parentId = null, depth = 0) => {
    let result = [];
    nodes.forEach(node => {
      const nodeWithMeta = { ...node, parentId, depth };
      result.push(nodeWithMeta);
      if (node.children && node.children.length > 0) {
        result = result.concat(flattenTree(node.children, node.id, depth + 1));
      }
    });
    return result;
  };

  const allNodes = flattenTree(treeData);

  const filteredNodes = allNodes.filter(node => {
    const matchesSearch = searchQuery === '' || 
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.subtitle && node.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || node.type === filterType;
    
    const showParent = searchQuery !== '' && node.children && node.children.length > 0;
    
    return matchesSearch && matchesFilter || showParent;
  });

  const toggleNode = (nodeId) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const isExpanded = (nodeId) => expandedNodes.has(nodeId);

  const hasVisibleChildren = (nodeId) => {
    return allNodes.some(n => n.parentId === nodeId && filteredNodes.includes(n));
  };

  const renderNode = (node, depth = 0) => {
    const expanded = isExpanded(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const hasVisChildren = hasVisibleChildren(node.id);
    const isSelected = selectedNode === node.id;
    const Icon = node.icon;

    const isFiltered = !filteredNodes.includes(node);
    if (isFiltered && !hasVisChildren) return null;

    return (
      <div key={node.id} className="org-tree-node">
        <div 
          className={`org-tree-node-header ${isSelected ? 'selected' : ''}`}
          style={{ paddingLeft: `${12 + depth * 20}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleNode(node.id);
            }
            setSelectedNode(node.id);
            if (node.type === 'organization' && onSelectOrg) {
              onSelectOrg(node.id.replace('org-', ''));
            }
          }}
          onDoubleClick={() => {
            if (node.type === 'employee' && node.data) {
              // Navigate to profile
            }
          }}
        >
          {hasChildren && hasVisChildren && (
            <button
              className="org-tree-expand"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              aria-label={expanded ? `Collapse ${node.label}` : `Expand ${node.label}`}
              aria-expanded={expanded}
            >
              <ChevronDownIcon className={expanded ? 'expanded' : ''} />
            </button>
          )}
          {!hasChildren || !hasVisChildren && <span className="org-tree-spacer" />}
          
          <div className="org-tree-node-content" style={{ borderLeftColor: node.color }}>
            <span className="org-tree-node-icon" style={{ color: node.color }}>
              <Icon />
            </span>
            <div className="org-tree-node-info">
              <span className="org-tree-node-label">{node.label}</span>
              {node.subtitle && <span className="org-tree-node-subtitle">{node.subtitle}</span>}
            </div>
            <span className="org-tree-node-type">{node.type}</span>
          </div>
          
          {node.type === 'employee' && node.data && (
            <div className="org-tree-node-actions">
              <button className="org-tree-action-btn" title="Message" aria-label="Message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
              <button className="org-tree-action-btn" title="View Profile" aria-label="View Profile">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="5"></circle>
                  <path d="M20 21a8 8 0 0 0-16 0"></path>
                </svg>
              </button>
            </div>
          )}
        </div>
        
        {hasChildren && expanded && hasVisChildren && (
          <div className="org-tree-children" role="group" aria-label={`${node.label} children`}>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="org-tree-view">
      <div className="org-tree-toolbar">
        <div className="org-tree-search">
          <SearchIcon />
          <input
            type="text"
            placeholder="Search organizations, departments, teams, people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search organization tree"
          />
        </div>
        <div className="org-tree-filters">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            aria-label="Filter by type"
            className="org-tree-filter-select"
          >
            <option value="all">All</option>
            <option value="organization">Organizations</option>
            <option value="department">Departments</option>
            <option value="team">Teams</option>
            <option value="employee">People</option>
          </select>
          <button className="org-tree-expand-all" onClick={() => {
            const allIds = new Set(allNodes.filter(n => n.children && n.children.length > 0).map(n => n.id));
            setExpandedNodes(allIds);
          }}>
            Expand All
          </button>
          <button className="org-tree-collapse-all" onClick={() => setExpandedNodes(new Set())}>
            Collapse All
          </button>
        </div>
      </div>
      
      <div className="org-tree-stats">
        <span>{organizations.length} Organizations</span>
        <span>{employees.length} Employees</span>
        <span>{allNodes.filter(n => n.type === 'department').length} Departments</span>
        <span>{allNodes.filter(n => n.type === 'team').length} Teams</span>
      </div>

      <div className="org-tree-container" role="tree" aria-label="Organization hierarchy">
        {treeData.map(node => renderNode(node))}
      </div>
      
      {searchQuery && filteredNodes.length === 0 && (
        <div className="org-tree-empty">
          <SearchIcon className="org-tree-empty-icon" />
          <p>No results found for "{searchQuery}"</p>
        </div>
      )}
    </div>
  );
}
