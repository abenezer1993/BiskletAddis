import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, Eye, UserCheck, Building, GraduationCap, Briefcase, Settings, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserTypeData {
  user_role: string;
  user_type: string;
  count: number;
  organization_name?: string;
  subscription_type?: string;
}

const UserTypes = () => {
  const [userTypes, setUserTypes] = useState<UserTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    fetchUserTypes();
  }, []);

  const fetchUserTypes = async () => {
    try {
      setLoading(true);
      
      // Query to get user type distribution
      const { data, error } = await supabase
        .from('users')
        .select(`
          user_role,
          user_type,
          subscription_type,
          organizations(name)
        `);

      if (error) throw error;

      // Process data to get counts by user_role and user_type
      const typeMap = new Map();
      
      data?.forEach(user => {
        const key = `${user.user_role}-${user.user_type}`;
        if (typeMap.has(key)) {
          typeMap.set(key, {
            ...typeMap.get(key),
            count: typeMap.get(key).count + 1
          });
        } else {
          typeMap.set(key, {
            user_role: user.user_role,
            user_type: user.user_type,
            count: 1,
            organization_name: user.organizations?.name,
            subscription_type: user.subscription_type
          });
        }
      });

      setUserTypes(Array.from(typeMap.values()));
    } catch (error) {
      console.error('Error fetching user types:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeIcon = (userType: string, userRole: string) => {
    if (userType === 'admin') return <Shield className="w-5 h-5 text-red-600" />;
    if (userType === 'staff') return <Settings className="w-5 h-5 text-blue-600" />;
    if (userType === 'partner') return <Building className="w-5 h-5 text-purple-600" />;
    if (userType === 'system') return <Settings className="w-5 h-5 text-gray-600" />;
    if (userRole === 'student') return <GraduationCap className="w-5 h-5 text-green-600" />;
    if (userRole === 'corporate_user') return <Briefcase className="w-5 h-5 text-orange-600" />;
    return <Users className="w-5 h-5 text-blue-500" />;
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'staff': return 'bg-blue-100 text-blue-800';
      case 'partner': return 'bg-purple-100 text-purple-800';
      case 'system': return 'bg-gray-100 text-gray-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getUserRoleDescription = (userRole: string) => {
    const descriptions: Record<string, string> = {
      // End Users
      'customer': 'Regular bike-sharing users',
      'premium_customer': 'Premium subscription users',
      'student': 'University/school students',
      'corporate_user': 'Company employees',
      'tourist': 'Visiting tourists',
      
      // Administrative Users
      'super_admin': 'Full system administrator',
      'operations_manager': 'Operations and fleet manager',
      'finance_manager': 'Financial operations manager',
      'customer_support': 'Customer service representative',
      'data_analyst': 'Data analysis and reporting',
      
      // Operational Staff
      'field_technician': 'Bike maintenance technician',
      'redistributor': 'Bike redistribution staff',
      'charging_staff': 'Battery charging staff',
      'quality_inspector': 'Quality assurance inspector',
      
      // Business Partners
      'payment_partner': 'Payment service provider',
      'location_partner': 'Location/parking partner',
      'corporate_partner': 'Corporate partnership',
      'government_official': 'Government liaison',
      
      // System Accounts
      'api_service': 'API service account',
      'automated_system': 'Automated system account',
      'test_account': 'Testing account'
    };
    
    return descriptions[userRole] || 'Unknown role';
  };

  const filteredUserTypes = userTypes.filter(type => {
    const matchesSearch = type.user_role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         type.user_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || type.user_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalUsers = userTypes.reduce((sum, type) => sum + type.count, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-text-secondary">Loading user types...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-text-primary">User Types & Roles</h1>
        <p className="text-text-secondary mt-2">Complete overview of all user types in the Bisklet system</p>
        <p className="text-text-secondary text-sm mt-1">🇪🇹 Total Users: {totalUsers.toLocaleString()}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {['end_user', 'admin', 'staff', 'partner', 'system'].map(type => {
          const count = userTypes.filter(ut => ut.user_type === type).reduce((sum, ut) => sum + ut.count, 0);
          return (
            <div key={type} className="card p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getUserTypeColor(type)}`}>
                  {getUserTypeIcon(type, '')}
                </div>
                <div>
                  <p className="text-text-secondary text-sm capitalize">{type.replace('_', ' ')}</p>
                  <p className="text-xl font-bold text-text-primary">{count}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search user roles or types..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-text-secondary" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="end_user">End Users</option>
              <option value="admin">Administrators</option>
              <option value="staff">Staff</option>
              <option value="partner">Partners</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Types Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  User Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  User Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Count
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUserTypes.map((type, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      {getUserTypeIcon(type.user_type, type.user_role)}
                      <div>
                        <div className="text-sm font-medium text-text-primary capitalize">
                          {type.user_role.replace(/_/g, ' ')}
                        </div>
                        {type.subscription_type && (
                          <div className="text-xs text-text-secondary">
                            {type.subscription_type} subscription
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeColor(type.user_type)}`}>
                      {type.user_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text-primary">
                      {getUserRoleDescription(type.user_role)}
                    </div>
                    {type.organization_name && (
                      <div className="text-xs text-text-secondary mt-1">
                        Organization: {type.organization_name}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text-primary">
                      {type.count.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text-primary">
                      {((type.count / totalUsers) * 100).toFixed(1)}%
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(type.count / totalUsers) * 100}%` }}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUserTypes.length === 0 && (
          <div className="text-center py-8 text-text-secondary">
            No user types found matching your criteria.
          </div>
        )}
      </div>

      {/* User Role Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* End Users */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>End Users (Mobile App)</span>
          </h3>
          <div className="space-y-2">
            {['customer', 'premium_customer', 'student', 'corporate_user', 'tourist'].map(role => {
              const count = userTypes.find(ut => ut.user_role === role)?.count || 0;
              return (
                <div key={role} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm text-text-primary capitalize">{role.replace(/_/g, ' ')}</span>
                  <span className="text-sm font-medium text-text-primary">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Administrative Users */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Administrative Users</span>
          </h3>
          <div className="space-y-2">
            {['super_admin', 'operations_manager', 'finance_manager', 'customer_support', 'data_analyst'].map(role => {
              const count = userTypes.find(ut => ut.user_role === role)?.count || 0;
              return (
                <div key={role} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm text-text-primary capitalize">{role.replace(/_/g, ' ')}</span>
                  <span className="text-sm font-medium text-text-primary">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Operational Staff */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Operational Staff</span>
          </h3>
          <div className="space-y-2">
            {['field_technician', 'redistributor', 'charging_staff', 'quality_inspector'].map(role => {
              const count = userTypes.find(ut => ut.user_role === role)?.count || 0;
              return (
                <div key={role} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm text-text-primary capitalize">{role.replace(/_/g, ' ')}</span>
                  <span className="text-sm font-medium text-text-primary">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Business Partners */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
            <Building className="w-5 h-5" />
            <span>Business Partners</span>
          </h3>
          <div className="space-y-2">
            {['payment_partner', 'location_partner', 'corporate_partner', 'government_official'].map(role => {
              const count = userTypes.find(ut => ut.user_role === role)?.count || 0;
              return (
                <div key={role} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="text-sm text-text-primary capitalize">{role.replace(/_/g, ' ')}</span>
                  <span className="text-sm font-medium text-text-primary">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTypes;