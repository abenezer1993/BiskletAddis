import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Bike, 
  Users, 
  UserCheck,
  Shield,
  FileText, 
  Menu, 
  X,
  Bell,
  User,
  LogOut,
  Crown,
  Settings,
  Building
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

interface LayoutProps {
  children: React.ReactNode;
  currentUser?: any;
  onLogout?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/bikes', icon: Bike, label: 'Bike Management' },
    { path: '/users', icon: Users, label: 'User Management' },
    { path: '/user-types', icon: UserCheck, label: 'User Types' },
    { path: '/user-permissions', icon: Shield, label: 'User Permissions' },
    { path: '/reports', icon: FileText, label: 'Financial Reports' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case 'admin': return <Crown className="w-4 h-4 text-red-600" />;
      case 'staff': return <Settings className="w-4 h-4 text-blue-600" />;
      case 'partner': return <Building className="w-4 h-4 text-purple-600" />;
      default: return <User className="w-4 h-4 text-green-600" />;
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'staff': return 'bg-blue-100 text-blue-800';
      case 'partner': return 'bg-purple-100 text-purple-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-bg-light">
      {/* Mobile menu overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Bike className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">Bisklet</h1>
              <p className="text-sm text-text-secondary">Admin Portal</p>
              <p className="text-xs text-text-secondary">🇪🇹 Serving Addis Ababa</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Current User Info */}
        {currentUser && (
          <div className="absolute bottom-4 left-4 right-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {currentUser.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {currentUser.full_name || 'User'}
                </p>
                <div className="flex items-center space-x-1">
                  {getUserTypeIcon(currentUser.user_type)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUserTypeColor(currentUser.user_type)}`}>
                    {currentUser.user_type}
                  </span>
                </div>
                <p className="text-xs text-text-secondary truncate">
                  {currentUser.user_role?.replace(/_/g, ' ')}
                </p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-4">
              <LanguageSelector />
              <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="w-5 h-5 text-text-secondary" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full"></span>
              </button>
              
              {currentUser && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {currentUser.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                    </span>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-text-primary">
                      {currentUser.full_name || 'User'}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              )}
              
              {onLogout && (
                <button 
                  onClick={onLogout}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5 text-text-secondary" />
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;