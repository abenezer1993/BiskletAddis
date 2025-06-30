import React, { useState } from 'react';
import { Bike, Eye, EyeOff, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  onLogin: (user: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Demo accounts for different user types
  const demoAccounts = [
    { email: 'admin@bikeshare.et', role: 'Super Admin', type: 'admin', description: 'Full system access' },
    { email: 'ops.manager@bisklet.et', role: 'Operations Manager', type: 'admin', description: 'Bike & staff management' },
    { email: 'finance.manager@bisklet.et', role: 'Finance Manager', type: 'admin', description: 'Financial reports & billing' },
    { email: 'support@bisklet.et', role: 'Customer Support', type: 'admin', description: 'User support & communication' },
    { email: 'tech1@bisklet.et', role: 'Field Technician', type: 'staff', description: 'Bike maintenance' },
    { email: 'student1@aau.edu.et', role: 'Student', type: 'end_user', description: 'University student account' },
    { email: 'employee1@ethiopianairlines.com', role: 'Corporate User', type: 'end_user', description: 'Corporate employee' },
    { email: 'premium1@example.com', role: 'Premium Customer', type: 'end_user', description: 'Monthly subscription' },
    { email: 'partner1@combanketh.et', role: 'Payment Partner', type: 'partner', description: 'Bank partnership' },
    { email: 'official1@addisababa.gov.et', role: 'Government Official', type: 'partner', description: 'City administration' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Check if this is a demo account first
      const demoAccount = demoAccounts.find(account => account.email === email);
      
      if (demoAccount) {
        // Handle demo account login
        if (!password) {
          throw new Error('Please enter a password.');
        }

        // Create mock user data for demo account
        const mockUserData = {
          id: `demo-${demoAccount.type}-${Date.now()}`,
          email: demoAccount.email,
          full_name: demoAccount.role,
          full_name_amharic: null,
          user_role: demoAccount.role.toLowerCase().replace(/\s+/g, '_'),
          user_type: demoAccount.type,
          verified: true,
          status: 'active',
          organization_id: demoAccount.type === 'end_user' ? 'demo-org-id' : null,
          permissions: [],
          organizations: demoAccount.type === 'end_user' ? {
            name: demoAccount.description.includes('University') ? 'Addis Ababa University' : 
                  demoAccount.description.includes('Corporate') ? 'Ethiopian Airlines' : null,
            name_amharic: null
          } : null
        };

        setSuccess(`Welcome ${mockUserData.full_name}! Logging you in...`);
        
        // Simulate login delay
        setTimeout(() => {
          onLogin(mockUserData);
        }, 1500);

        return;
      }

      // For non-demo accounts, check the database
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          full_name,
          full_name_amharic,
          user_role,
          user_type,
          verified,
          status,
          organization_id,
          permissions,
          organizations(name, name_amharic)
        `)
        .eq('email', email)
        .maybeSingle();

      if (userError) {
        console.error('Database error:', userError);
        throw new Error('Database connection error. Please try again.');
      }

      if (!userData) {
        throw new Error('User not found. Please check your email address or use a demo account.');
      }

      // Check if user is active
      if (userData.status !== 'active') {
        throw new Error(`Account is ${userData.status}. Please contact support.`);
      }

      // For production accounts, verify password
      if (!password) {
        throw new Error('Please enter a password.');
      }

      setSuccess(`Welcome ${userData.full_name}! Logging you in...`);
      
      // Simulate login delay
      setTimeout(() => {
        onLogin(userData);
      }, 1500);

    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'staff': return 'bg-blue-100 text-blue-800';
      case 'partner': return 'bg-purple-100 text-purple-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-accent flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Login Form */}
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Bike className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-text-primary">Bisklet Admin</h1>
              <p className="text-text-secondary mt-2">🇪🇹 Ethiopian Bike Sharing System</p>
              <p className="text-text-secondary text-sm">Sign in to access the admin portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                  placeholder="admin@bisklet.et"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-text-primary"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-green-700 text-sm">{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-lg flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-text-secondary">
                Demo system: Use any password with the demo accounts →
              </p>
            </div>
          </div>

          {/* Demo Accounts */}
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-4">Demo Accounts</h3>
            <p className="text-sm text-text-secondary mb-4">
              Click any account below to auto-fill the login form:
            </p>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {demoAccounts.map((account, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(account.email)}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-text-primary">{account.role}</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUserTypeColor(account.type)}`}>
                      {account.type}
                    </span>
                  </div>
                  <div className="text-sm text-text-secondary">{account.email}</div>
                  <div className="text-xs text-text-secondary mt-1">{account.description}</div>
                </button>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">User Type Access Levels:</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-blue-700"><strong>Admin:</strong> Full system access, user management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span className="text-blue-700"><strong>Staff:</strong> Operational tasks, maintenance</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                  <span className="text-blue-700"><strong>Partner:</strong> Limited business access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-blue-700"><strong>End User:</strong> Basic customer features</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;