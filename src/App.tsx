import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BikeManagement from './pages/BikeManagement';
import UserManagement from './pages/UserManagement';
import UserTypes from './pages/UserTypes';
import UserPermissions from './pages/UserPermissions';
import FinancialReports from './pages/FinancialReports';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [currentUser, setCurrentUser] = React.useState<any>(null);

  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    
    // Store user data in localStorage for persistence
    localStorage.setItem('bisklet_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('bisklet_user');
  };

  // Check for stored user data on app load
  React.useEffect(() => {
    const storedUser = localStorage.getItem('bisklet_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setCurrentUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('bisklet_user');
      }
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <LanguageProvider>
        <Login onLogin={handleLogin} />
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <Router>
        <Layout currentUser={currentUser} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bikes" element={<BikeManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/user-types" element={<UserTypes />} />
            <Route path="/user-permissions" element={<UserPermissions />} />
            <Route path="/reports" element={<FinancialReports />} />
          </Routes>
        </Layout>
      </Router>
    </LanguageProvider>
  );
}

export default App;