import { useState, useEffect } from 'react';
import { useApp, useCurrentUser, useTheme, useSidebar } from './context/AppContext';
import { employees } from './data/mockData';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Opportunities from './pages/Opportunities';
import DetailOpportunities from './pages/DetailOpportunities';
import DetailOpportunityDetail from './pages/DetailOpportunityDetail';
import OpportunityDetail from './pages/OpportunityDetail';
import MyRequests from './pages/MyRequests';
import ApprovalDashboard from './pages/ApprovalDashboard';
import Calendar from './pages/Calendar';
import OrganizationExplorer from './pages/OrganizationExplorer';
import EmployeeProfile from './pages/EmployeeProfile';
import LeadershipShadows from './pages/LeadershipShadows';
import Analytics from './pages/Analytics';
import Feedback from './pages/Feedback';
import Certificates from './pages/Certificates';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './components/Login';
import MobileSidebarToggle from './components/MobileSidebarToggle';

function App() {
  const { state, actions } = useApp();
  const currentUser = useCurrentUser();
  const { theme } = useTheme();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(!currentUser);

  // Handle login
  const handleLogin = (userId) => {
    const user = employees.find(e => e.id === userId);
    if (user) {
      actions.login(user);
      setShowLogin(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    actions.logout();
    setShowLogin(true);
  };

  // Render page based on active page
  const renderPage = () => {
    const { activePage } = state;
    
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'detail-opportunities':
        return <DetailOpportunities />;
      case 'detail-opportunity-detail':
        return <DetailOpportunityDetail />;
      case 'opportunities':
        return <Opportunities />;
      case 'opportunity-detail':
        return <OpportunityDetail />;
      case 'my-requests':
        return <MyRequests />;
      case 'approval-dashboard':
        return <ApprovalDashboard />;
      case 'calendar':
        return <Calendar />;
      case 'organizations':
        return <OrganizationExplorer />;
      case 'profile':
        return <EmployeeProfile />;
      case 'leadership':
        return <LeadershipShadows />;
      case 'analytics':
        return <Analytics />;
      case 'feedback':
        return <Feedback />;
      case 'certificates':
        return <Certificates />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  if (showLogin) {
    return <Login onLogin={handleLogin} employees={employees} />;
  }

  return (
    <div className="app-layout" data-theme={theme}>
      <MobileSidebarToggle 
        isOpen={mobileSidebarOpen} 
        onToggle={setMobileSidebarOpen} 
      />
      
      <Sidebar 
        isOpen={mobileSidebarOpen} 
        onClose={() => setMobileSidebarOpen(false)} 
      />
      
      <Header 
        onMenuClick={() => setMobileSidebarOpen(true)}
        onLogout={handleLogout}
      />
      
      <main className={`app-main ${mobileSidebarOpen ? 'sidebar-open' : ''}`}>
        {renderPage()}
      </main>
    </div>
  );
}

export default App;