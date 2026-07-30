import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  employees as initialEmployees,
  shadowOpportunities as initialOpportunities,
  detailOpportunities as initialDetailOpportunities,
  shadowRequests as initialRequests,
  feedback as initialFeedback,
  announcements as initialAnnouncements,
  certificates as initialCertificates
} from '../data/mockData';

// Action types
const ActionTypes = {
  // Auth
  SET_CURRENT_USER: 'SET_CURRENT_USER',
  LOGOUT: 'LOGOUT',
  
  // Shadow Opportunities
  CREATE_OPPORTUNITY: 'CREATE_OPPORTUNITY',
  UPDATE_OPPORTUNITY: 'UPDATE_OPPORTUNITY',
  DELETE_OPPORTUNITY: 'DELETE_OPPORTUNITY',
  
  // Detail Opportunities
  CREATE_DETAIL_OPPORTUNITY: 'CREATE_DETAIL_OPPORTUNITY',
  UPDATE_DETAIL_OPPORTUNITY: 'UPDATE_DETAIL_OPPORTUNITY',
  DELETE_DETAIL_OPPORTUNITY: 'DELETE_DETAIL_OPPORTUNITY',
  
  // Requests
  CREATE_REQUEST: 'CREATE_REQUEST',
  UPDATE_REQUEST: 'UPDATE_REQUEST',
  UPDATE_REQUEST_STATUS: 'UPDATE_REQUEST_STATUS',
  
  // Feedback
  CREATE_FEEDBACK: 'CREATE_FEEDBACK',
  
  // Employees
  UPDATE_EMPLOYEE: 'UPDATE_EMPLOYEE',
  SAVE_OPPORTUNITY: 'SAVE_OPPORTUNITY',
  UNSAVE_OPPORTUNITY: 'UNSAVE_OPPORTUNITY',
  
  // Announcements
  CREATE_ANNOUNCEMENT: 'CREATE_ANNOUNCEMENT',
  
  // Certificates
  CREATE_CERTIFICATE: 'CREATE_CERTIFICATE',
  
  // Theme
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_THEME: 'SET_THEME',
  
  // UI
  SET_SIDEBAR_OPEN: 'SET_SIDEBAR_OPEN',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_ACTIVE_PAGE: 'SET_ACTIVE_PAGE',
  TOGGLE_SIDEBAR_ITEM: 'TOGGLE_SIDEBAR_ITEM',
  TOGGLE_SIDEBAR_SECTION: 'TOGGLE_SIDEBAR_SECTION',
  
  // Data initialization
  INITIALIZE_DATA: 'INITIALIZE_DATA'
};

// Initial state
const initialState = {
  currentUser: null,
  employees: initialEmployees,
  opportunities: initialOpportunities,
  detailOpportunities: initialDetailOpportunities,
  requests: initialRequests,
  feedback: initialFeedback,
  announcements: initialAnnouncements,
  certificates: initialCertificates,
  theme: 'light',
  sidebarOpen: true,
  searchQuery: '',
  activePage: 'dashboard',
  initialized: false,
  expandedSidebarItems: [],
  expandedSidebarSections: []
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_USER:
      return { ...state, currentUser: action.payload };
    
    case ActionTypes.LOGOUT:
      return { ...state, currentUser: null };
    
    case ActionTypes.CREATE_OPPORTUNITY:
      return {
        ...state,
        opportunities: [...state.opportunities, action.payload]
      };
    
    case ActionTypes.UPDATE_OPPORTUNITY:
      return {
        ...state,
        opportunities: state.opportunities.map(opp =>
          opp.id === action.payload.id ? action.payload : opp
        )
      };
    
    case ActionTypes.DELETE_OPPORTUNITY:
      return {
        ...state,
        opportunities: state.opportunities.filter(opp => opp.id !== action.payload)
      };
    
    case ActionTypes.CREATE_DETAIL_OPPORTUNITY:
      return {
        ...state,
        detailOpportunities: [...state.detailOpportunities, action.payload]
      };
    
    case ActionTypes.UPDATE_DETAIL_OPPORTUNITY:
      return {
        ...state,
        detailOpportunities: state.detailOpportunities.map(opp =>
          opp.id === action.payload.id ? action.payload : opp
        )
      };
    
    case ActionTypes.DELETE_DETAIL_OPPORTUNITY:
      return {
        ...state,
        detailOpportunities: state.detailOpportunities.filter(opp => opp.id !== action.payload)
      };
    
    case ActionTypes.CREATE_REQUEST:
      return {
        ...state,
        requests: [...state.requests, action.payload]
      };
    
    case ActionTypes.UPDATE_REQUEST:
      return {
        ...state,
        requests: state.requests.map(req =>
          req.id === action.payload.id ? action.payload : req
        )
      };
    
    case ActionTypes.UPDATE_REQUEST_STATUS:
      return {
        ...state,
        requests: state.requests.map(req =>
          req.id === action.payload.requestId
            ? { ...req, status: action.payload.status, updatedAt: new Date().toISOString().split('T')[0] }
            : req
        )
      };
    
    case ActionTypes.CREATE_FEEDBACK:
      return {
        ...state,
        feedback: [...state.feedback, action.payload]
      };
    
    case ActionTypes.UPDATE_EMPLOYEE:
      return {
        ...state,
        employees: state.employees.map(emp =>
          emp.id === action.payload.id ? action.payload : emp
        ),
        currentUser: state.currentUser?.id === action.payload.id ? action.payload : state.currentUser
      };
    
    case ActionTypes.SAVE_OPPORTUNITY:
      if (!state.currentUser) return state;
      const savedOps = state.currentUser.savedOpportunities || [];
      if (savedOps.includes(action.payload)) return state;
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          savedOpportunities: [...savedOps, action.payload]
        },
        employees: state.employees.map(emp =>
          emp.id === state.currentUser.id
            ? { ...emp, savedOpportunities: [...savedOps, action.payload] }
            : emp
        )
      };
    
    case ActionTypes.UNSAVE_OPPORTUNITY:
      if (!state.currentUser) return state;
      const savedOps2 = (state.currentUser.savedOpportunities || []).filter(id => id !== action.payload);
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          savedOpportunities: savedOps2
        },
        employees: state.employees.map(emp =>
          emp.id === state.currentUser.id
            ? { ...emp, savedOpportunities: savedOps2 }
            : emp
        )
      };
    
    case ActionTypes.CREATE_ANNOUNCEMENT:
      return {
        ...state,
        announcements: [action.payload, ...state.announcements]
      };
    
    case ActionTypes.CREATE_CERTIFICATE:
      return {
        ...state,
        certificates: [...state.certificates, action.payload]
      };
    
    case ActionTypes.TOGGLE_THEME:
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    
    case ActionTypes.SET_THEME:
      return { ...state, theme: action.payload };
    
    case ActionTypes.SET_SIDEBAR_OPEN:
      return { ...state, sidebarOpen: action.payload };
    
    case ActionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    
    case ActionTypes.SET_ACTIVE_PAGE:
      return { ...state, activePage: action.payload };
    
    case ActionTypes.TOGGLE_SIDEBAR_ITEM:
      return {
        ...state,
        expandedSidebarItems: state.expandedSidebarItems.includes(action.payload)
          ? state.expandedSidebarItems.filter(id => id !== action.payload)
          : [...state.expandedSidebarItems, action.payload]
      };
    
    case ActionTypes.TOGGLE_SIDEBAR_SECTION:
      return {
        ...state,
        expandedSidebarSections: state.expandedSidebarSections.includes(action.payload)
          ? state.expandedSidebarSections.filter(id => id !== action.payload)
          : [...state.expandedSidebarSections, action.payload]
      };
    
    case ActionTypes.INITIALIZE_DATA:
      return { ...state, initialized: true };
    
    default:
      return state;
  }
}

// Context
const AppContext = createContext(null);

// Provider
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('wims-theme');
    const savedUser = localStorage.getItem('wims-current-user');
    const savedSidebar = localStorage.getItem('wims-sidebar-open');
    
    if (savedTheme) {
      dispatch({ type: ActionTypes.SET_THEME, payload: savedTheme });
    }
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: user });
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }
    if (savedSidebar !== null) {
      dispatch({ type: ActionTypes.SET_SIDEBAR_OPEN, payload: savedSidebar === 'true' });
    }
    
    dispatch({ type: ActionTypes.INITIALIZE_DATA });
  }, []);

  // Persist theme
  useEffect(() => {
    localStorage.setItem('wims-theme', state.theme);
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Persist current user
  useEffect(() => {
    if (state.currentUser) {
      localStorage.setItem('wims-current-user', JSON.stringify(state.currentUser));
    } else {
      localStorage.removeItem('wims-current-user');
    }
  }, [state.currentUser]);

  // Persist sidebar
  useEffect(() => {
    localStorage.setItem('wims-sidebar-open', state.sidebarOpen.toString());
  }, [state.sidebarOpen]);

  // Actions
    const actions = {
      login: (user) => dispatch({ type: ActionTypes.SET_CURRENT_USER, payload: user }),
      logout: () => dispatch({ type: ActionTypes.LOGOUT }),
      createOpportunity: (opp) => dispatch({ type: ActionTypes.CREATE_OPPORTUNITY, payload: opp }),
      updateOpportunity: (opp) => dispatch({ type: ActionTypes.UPDATE_OPPORTUNITY, payload: opp }),
      deleteOpportunity: (id) => dispatch({ type: ActionTypes.DELETE_OPPORTUNITY, payload: id }),
      createDetailOpportunity: (opp) => dispatch({ type: ActionTypes.CREATE_DETAIL_OPPORTUNITY, payload: opp }),
      updateDetailOpportunity: (opp) => dispatch({ type: ActionTypes.UPDATE_DETAIL_OPPORTUNITY, payload: opp }),
      deleteDetailOpportunity: (id) => dispatch({ type: ActionTypes.DELETE_DETAIL_OPPORTUNITY, payload: id }),
      createRequest: (req) => dispatch({ type: ActionTypes.CREATE_REQUEST, payload: req }),
      updateRequest: (req) => dispatch({ type: ActionTypes.UPDATE_REQUEST, payload: req }),
      updateRequestStatus: (requestId, status) =>
        dispatch({ type: ActionTypes.UPDATE_REQUEST_STATUS, payload: { requestId, status } }),
      createFeedback: (fb) => dispatch({ type: ActionTypes.CREATE_FEEDBACK, payload: fb }),
      updateEmployee: (emp) => dispatch({ type: ActionTypes.UPDATE_EMPLOYEE, payload: emp }),
      saveOpportunity: (oppId) => dispatch({ type: ActionTypes.SAVE_OPPORTUNITY, payload: oppId }),
      unsaveOpportunity: (oppId) => dispatch({ type: ActionTypes.UNSAVE_OPPORTUNITY, payload: oppId }),
      createAnnouncement: (ann) => dispatch({ type: ActionTypes.CREATE_ANNOUNCEMENT, payload: ann }),
      createCertificate: (cert) => dispatch({ type: ActionTypes.CREATE_CERTIFICATE, payload: cert }),
      toggleTheme: () => dispatch({ type: ActionTypes.TOGGLE_THEME }),
      setTheme: (theme) => dispatch({ type: ActionTypes.SET_THEME, payload: theme }),
      setSidebarOpen: (open) => dispatch({ type: ActionTypes.SET_SIDEBAR_OPEN, payload: open }),
      setSearchQuery: (query) => dispatch({ type: ActionTypes.SET_SEARCH_QUERY, payload: query }),
      setActivePage: (page) => dispatch({ type: ActionTypes.SET_ACTIVE_PAGE, payload: page }),
      toggleSidebarItem: (itemId) => dispatch({ type: ActionTypes.TOGGLE_SIDEBAR_ITEM, payload: itemId }),
      toggleSidebarSection: (sectionTitle) => dispatch({ type: ActionTypes.TOGGLE_SIDEBAR_SECTION, payload: sectionTitle })
    };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Selectors
export function useCurrentUser() {
  const { state } = useApp();
  return state.currentUser;
}

export function useOpportunities() {
  const { state } = useApp();
  return state.opportunities;
}

export function useDetailOpportunities() {
  const { state } = useApp();
  return state.detailOpportunities;
}

export function useRequests() {
  const { state } = useApp();
  return state.requests;
}

export function useFeedback() {
  const { state } = useApp();
  return state.feedback;
}

export function useEmployees() {
  const { state } = useApp();
  return state.employees;
}

export function useAnnouncements() {
  const { state } = useApp();
  return state.announcements;
}

export function useCertificates() {
  const { state } = useApp();
  return state.certificates;
}

export function useTheme() {
  const { state, actions } = useApp();
  return { theme: state.theme, toggleTheme: actions.toggleTheme, setTheme: actions.setTheme };
}

export function useSidebar() {
  const { state, actions } = useApp();
  return { sidebarOpen: state.sidebarOpen, setSidebarOpen: actions.setSidebarOpen };
}

export function useSearch() {
  const { state, actions } = useApp();
  return { searchQuery: state.searchQuery, setSearchQuery: actions.setSearchQuery };
}

export function useActivePage() {
  const { state, actions } = useApp();
  return { activePage: state.activePage, setActivePage: actions.setActivePage };
}

export function useSidebarState() {
  const { state, actions } = useApp();
  return {
    expandedItems: state.expandedSidebarItems || [],
    expandedSections: state.expandedSidebarSections || [],
    toggleItem: actions.toggleSidebarItem,
    toggleSection: actions.toggleSidebarSection
  };
}