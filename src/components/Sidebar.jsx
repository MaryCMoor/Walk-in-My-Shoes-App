import { useApp, useCurrentUser, useActivePage, useSidebar, useSidebarState } from '../context/AppContext';
import { useEffect, useRef } from 'react';
import { organizations } from '../data/mockData';

function Tooltip({ children, label }) {
  // Use a span wrapper instead of div to avoid button-in-button issues
  return (
    <span className="tooltip-wrapper" style={{ position: 'relative', display: 'inline-flex' }}>
      {children}
      {label && (
        <div className="tooltip" role="tooltip">
          {label}
        </div>
      )}
    </span>
  );
}

const navSections = [
  {
    title: 'Main',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
      { id: 'my-requests', label: 'My Requests', icon: ClipboardListIcon },
      { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    ]
  },
  {
    title: 'Discover',
    items: [
      { 
        id: 'organizations', 
        label: 'Organizations', 
        icon: BuildingOfficeIcon,
        children: [
          { id: 'org-explorer', label: 'Explore Organizations', icon: BuildingOfficeIcon },
          { id: 'org-chart', label: 'Organization Chart', icon: UserGroupIcon },
          { id: 'org-leadership', label: 'Leadership Directory', icon: UserCircleIcon },
        ]
      },
      { 
        id: 'opportunities', 
        label: 'Opportunities', 
        icon: BriefcaseIcon,
        children: [
          { id: 'detail-opportunities', label: 'Detail Opportunities (3-6 mo)', icon: BriefcaseIcon },
          { id: 'shadow-opportunities', label: 'Shadow Opportunities', icon: BriefcaseIcon },
          { id: 'leadership', label: 'Leadership Shadows', icon: UserGroupIcon },
        ]
      },
      { id: 'profile', label: 'My Profile', icon: UserCircleIcon },
    ]
  },
  {
    title: 'Host Tools',
    items: [
      { id: 'approval-dashboard', label: 'Approval Dashboard', icon: CheckBadgeIcon },
      { 
        id: 'host-management', 
        label: 'Host Management', 
        icon: BuildingOfficeIcon,
        children: [
          { id: 'my-opportunities', label: 'My Opportunities', icon: BriefcaseIcon },
          { id: 'create-opportunity', label: 'Create Opportunity', icon: CheckBadgeIcon },
          { id: 'manage-requests', label: 'Manage Requests', icon: ClipboardListIcon },
        ]
      },
    ],
    roles: ['Host', 'Administrator']
  },
  {
    title: 'Administration',
    items: [
      { id: 'analytics', label: 'Analytics', icon: ChartBarIcon },
      { id: 'feedback', label: 'Feedback', icon: ChatBubbleLeftRightIcon },
      { id: 'certificates', label: 'Certificates', icon: DocumentTextIcon },
      { id: 'reports', label: 'Reports', icon: DocumentArrowDownIcon },
      { 
        id: 'settings', 
        label: 'Settings', 
        icon: Cog6ToothIcon,
        children: [
          { id: 'general-settings', label: 'General', icon: Cog6ToothIcon },
          { id: 'appearance', label: 'Appearance', icon: ChartBarIcon },
          { id: 'notifications', label: 'Notifications', icon: ChatBubbleLeftRightIcon },
          { id: 'account', label: 'Account', icon: UserCircleIcon },
        ]
      },
    ],
    roles: ['Administrator']
  }
];

// SVG Icons
function HomeIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  );
}

function BriefcaseIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  );
}

function ClipboardListIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      <line x1="9" y1="12" x2="19" y2="12"></line>
      <line x1="9" y1="16" x2="15" y2="16"></line>
      <line x1="9" y1="20" x2="15" y2="20"></line>
    </svg>
  );
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

function BuildingOfficeIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

function UserGroupIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

function UserCircleIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="10" r="3"></circle>
      <path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"></path>
    </svg>
  );
}

function CheckBadgeIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11l3 3L22 4"></path>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
  );
}

function ChartBarIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"></line>
      <line x1="12" y1="20" x2="12" y2="4"></line>
      <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
  );
}

function ChatBubbleLeftRightIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      <path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5l-4 4z"></path>
    </svg>
  );
}

function DocumentTextIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
      <line x1="8" y1="10" x2="16" y2="10"></line>
      <line x1="8" y1="14" x2="16" y2="14"></line>
      <line x1="8" y1="18" x2="10" y2="18"></line>
    </svg>
  );
}

function DocumentArrowDownIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
      <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
      <polyline points="8 13 12 17 16 13"></polyline>
      <line x1="12" y1="8" x2="12" y2="17"></line>
    </svg>
  );
}

function Cog6ToothIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  );
}

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

export default function Sidebar({ isOpen, onClose }) {
  const { state, actions } = useApp();
  const currentUser = useCurrentUser();
  const { activePage, setActivePage } = useActivePage();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { expandedItems, expandedSections, toggleItem, toggleSection } = useSidebarState();
  
  const navItemsRef = useRef([]);
  const activeItemIndex = useRef(-1);
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      const visibleItems = navItemsRef.current.filter(el => 
        el.offsetParent !== null && !el.classList.contains('nav-section-expand')
      );
      
      if (visibleItems.length === 0) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          activeItemIndex.current = Math.min(activeItemIndex.current + 1, visibleItems.length - 1);
          visibleItems[activeItemIndex.current]?.focus();
          break;
        case 'ArrowUp':
          e.preventDefault();
          activeItemIndex.current = Math.max(activeItemIndex.current - 1, 0);
          visibleItems[activeItemIndex.current]?.focus();
          break;
        case 'ArrowRight':
          e.preventDefault();
          const currentItem = visibleItems[activeItemIndex.current];
          if (currentItem?.classList.contains('has-children') && !expandedItems.includes(currentItem.dataset.itemId)) {
            toggleItem(currentItem.dataset.itemId);
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          const currentItemLeft = visibleItems[activeItemIndex.current];
          if (currentItemLeft?.classList.contains('has-children') && expandedItems.includes(currentItemLeft.dataset.itemId)) {
            toggleItem(currentItemLeft.dataset.itemId);
          } else if (currentItemLeft?.dataset.depth > 0) {
            // Navigate to parent
            const parentId = currentItemLeft.dataset.parentId;
            if (parentId) {
              const parentEl = document.querySelector(`[data-item-id="${parentId}"]`);
              parentEl?.focus();
            }
          }
          break;
        case 'Enter':
        case ' ':
          e.preventDefault();
          visibleItems[activeItemIndex.current]?.click();
          break;
        case 'Escape':
          if (window.innerWidth < 1024) {
            onClose();
          }
          break;
        case 'Home':
          e.preventDefault();
          activeItemIndex.current = 0;
          visibleItems[0]?.focus();
          break;
        case 'End':
          e.preventDefault();
          activeItemIndex.current = visibleItems.length - 1;
          visibleItems[visibleItems.length - 1]?.focus();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, sidebarOpen, expandedItems, toggleItem, onClose]);

  const handleNavClick = (pageId, event) => {
    // Don't navigate if clicking on expand/collapse area
    if (event.target.closest('.nav-item-expand')) {
      return;
    }
    
    // Find the item to check if it has children
    const findItem = (sections, id) => {
      for (const section of sections) {
        for (const item of section.items) {
          if (item.id === id) return item;
          if (item.children) {
            const found = item.children.find(c => c.id === id);
            if (found) return found;
          }
        }
      }
      return null;
    };
    
    const item = findItem(navSections, pageId);
    // If item has children, just expand/collapse instead of navigating
    if (item && item.children && item.children.length > 0) {
      toggleItem(pageId);
      return;
    }
    
    setActivePage(pageId);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const filteredSections = navSections.filter(section => {
    if (!section.roles) return true;
    return currentUser && section.roles.includes(currentUser.role);
  });

  const renderNavItem = (item, depth = 0) => {
    const isActive = activePage === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const Icon = item.icon;

    // Tooltip only for top-level items in collapsed mode
    const showTooltip = !sidebarOpen && depth === 0;

    return (
      <div key={item.id} className={`nav-item-wrapper ${depth > 0 ? 'nav-item-nested' : ''}`}>
        <div className="nav-item-container" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          {showTooltip ? (
            <Tooltip label={item.label}>
              <button
                ref={(el) => { if (el) navItemsRef.current.push(el); }}
                data-item-id={item.id}
                data-depth={depth}
                data-parent-id={depth > 0 ? 'parent' : ''}
                className={`nav-item ${isActive ? 'active' : ''} ${hasChildren ? 'has-children' : ''} ${depth > 0 ? 'nav-item-indented' : ''}`}
                onClick={(e) => handleNavClick(item.id, e)}
                role="menuitem"
                aria-current={isActive ? 'page' : undefined}
                aria-expanded={hasChildren ? isExpanded : undefined}
                aria-label={item.label}
                tabIndex={isActive ? 0 : -1}
                style={{ paddingLeft: `${12 + depth * 16}px`, flex: '1', textAlign: 'left', width: '100%' }}
              >
                <span className="nav-item-icon">
                  <Icon />
                </span>
                <span className="nav-item-text">{item.label}</span>
                {item.id === 'my-requests' && (
                  <span className="nav-item-badge">3</span>
                )}
                {item.id === 'approval-dashboard' && currentUser?.role === 'Host' && (
                  <span className="nav-item-badge warning">5</span>
                )}
              </button>
            </Tooltip>
          ) : (
            <button
              ref={(el) => { if (el) navItemsRef.current.push(el); }}
              data-item-id={item.id}
              data-depth={depth}
              data-parent-id={depth > 0 ? 'parent' : ''}
              className={`nav-item ${isActive ? 'active' : ''} ${hasChildren ? 'has-children' : ''} ${depth > 0 ? 'nav-item-indented' : ''}`}
              onClick={(e) => handleNavClick(item.id, e)}
              role="menuitem"
              aria-current={isActive ? 'page' : undefined}
              aria-expanded={hasChildren ? isExpanded : undefined}
              tabIndex={isActive ? 0 : -1}
              style={{ paddingLeft: `${12 + depth * 16}px`, flex: '1', textAlign: 'left', width: '100%' }}
            >
              <span className="nav-item-icon">
                <Icon />
              </span>
              <span className="nav-item-text">{item.label}</span>
              {item.id === 'my-requests' && (
                <span className="nav-item-badge">3</span>
              )}
              {item.id === 'approval-dashboard' && currentUser?.role === 'Host' && (
                <span className="nav-item-badge warning">5</span>
              )}
            </button>
          )}
          {hasChildren && (
            <button
              className="nav-item-expand"
              onClick={(e) => {
                e.stopPropagation();
                toggleItem(item.id);
              }}
              aria-label={isExpanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
              style={{ marginLeft: 'auto', flexShrink: 0, padding: '4px' }}
            >
              <ChevronDownIcon className={isExpanded ? 'rotate-180' : ''} />
            </button>
          )}
        </div>
        
        {hasChildren && isExpanded && (
          <div className="nav-item-children" role="group" aria-label={`${item.label} submenu`}>
            {item.children.map(child => renderNavItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside 
      className={`app-sidebar ${isOpen ? 'open' : ''} ${!sidebarOpen ? 'collapsed' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="sidebar-header">
        <a href="#" className="sidebar-logo" onClick={(e) => { e.preventDefault(); handleNavClick('dashboard'); }}>
          <div className="sidebar-logo-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </div>
          <span className="sidebar-logo-text">Walk In My Shoes</span>
        </a>
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={sidebarOpen}
        >
          <ChevronRightIcon className={sidebarOpen ? 'rotate-180' : ''} />
        </button>
      </div>

      <nav className="sidebar-nav" aria-label="Navigation menu">
        {filteredSections.map((section) => {
          const isSectionExpanded = expandedSections.includes(section.title);
          
          return (
            <div key={section.title} className="nav-section">
              <div className="nav-section-header">
                <div className="nav-section-title">{section.title}</div>
                <button
                  className="nav-section-expand"
                  onClick={() => toggleSection(section.title)}
                  aria-label={isSectionExpanded ? `Collapse ${section.title}` : `Expand ${section.title}`}
                  aria-expanded={isSectionExpanded}
                >
                  <ChevronDownIcon className={isSectionExpanded ? 'rotate-180' : ''} />
                </button>
              </div>
              <div className={isSectionExpanded ? 'nav-section-content' : 'nav-section-content collapsed'}>
                {section.items.map((item) => renderNavItem(item))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {currentUser && (
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">
              {currentUser.firstName[0]}{currentUser.lastName[0]}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">
                {currentUser.firstName} {currentUser.lastName}
              </div>
              <div className="sidebar-user-role">{currentUser.role.toLowerCase()}</div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}