import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Users, 
  Settings,
  Building,
  Eye,
  UserCheck,
  Clock,
  AlertCircle,
  UserPlus,
  Save,
  Mail,
  Phone,
  User,
  Building2,
  GraduationCap
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  full_name: string;
  full_name_amharic?: string;
  email: string;
  phone: string;
  user_role: string;
  user_type: string;
  organization_id?: string;
  permissions: string[];
  verified: boolean;
  status: string;
  organizations?: {
    name: string;
    name_amharic?: string;
  };
}

interface Organization {
  id: string;
  name: string;
  name_amharic?: string;
  organization_type: string;
}

interface Permission {
  id: string;
  user_id: string;
  permission_name: string;
  resource_type?: string;
  resource_id?: string;
  granted_by: string;
  granted_at: string;
  expires_at?: string;
  is_active: boolean;
  users: {
    full_name: string;
    email: string;
  };
  granted_by_user: {
    full_name: string;
    email: string;
  };
}

interface NewUserForm {
  full_name: string;
  full_name_amharic: string;
  email: string;
  phone: string;
  user_role: string;
  user_type: string;
  organization_id: string;
  student_id: string;
  employee_id: string;
  government_id: string;
  subscription_type: string;
  permissions: string[];
}

const UserPermissions = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [showUserPermissions, setShowUserPermissions] = useState<User | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    full_name: '',
    full_name_amharic: '',
    email: '',
    phone: '',
    user_role: 'customer',
    user_type: 'end_user',
    organization_id: '',
    student_id: '',
    employee_id: '',
    government_id: '',
    subscription_type: 'pay_per_ride',
    permissions: []
  });

  // Available permissions by category
  const availablePermissions = {
    'System Administration': [
      'all',
      'user_management',
      'system_administration',
      'organization_management',
      'permission_management'
    ],
    'Bike Management': [
      'bike_management',
      'manage_bikes',
      'view_bike_status',
      'bike_maintenance',
      'bike_redistribution'
    ],
    'User Management': [
      'view_user_profiles',
      'edit_user_profiles',
      'suspend_users',
      'verify_users',
      'user_support'
    ],
    'Financial Operations': [
      'financial_reports',
      'payment_management',
      'organization_billing',
      'export_financial_data',
      'view_transactions'
    ],
    'Operations': [
      'location_management',
      'staff_management',
      'manage_staff_schedules',
      'view_operational_reports',
      'manage_system_alerts'
    ],
    'Analytics & Reporting': [
      'analytics',
      'reporting',
      'data_export',
      'create_custom_reports',
      'access_analytics_dashboard'
    ],
    'Communication': [
      'send_notifications',
      'communication',
      'issue_resolution',
      'customer_support'
    ],
    'Technical': [
      'api_access',
      'data_sync',
      'external_integration',
      'scheduled_tasks',
      'monitoring',
      'alerts'
    ]
  };

  // User role definitions with default permissions
  const userRoleDefinitions = {
    // End Users
    'customer': { type: 'end_user', permissions: [] },
    'premium_customer': { type: 'end_user', permissions: [] },
    'student': { type: 'end_user', permissions: [] },
    'corporate_user': { type: 'end_user', permissions: [] },
    'tourist': { type: 'end_user', permissions: [] },
    
    // Administrative Users
    'super_admin': { type: 'admin', permissions: ['all'] },
    'operations_manager': { type: 'admin', permissions: ['bike_management', 'location_management', 'staff_management', 'analytics'] },
    'finance_manager': { type: 'admin', permissions: ['financial_reports', 'payment_management', 'organization_billing'] },
    'customer_support': { type: 'staff', permissions: ['user_support', 'communication', 'issue_resolution'] },
    'data_analyst': { type: 'staff', permissions: ['analytics', 'reporting', 'data_export'] },
    
    // Operational Staff
    'field_technician': { type: 'staff', permissions: ['bike_maintenance', 'view_bike_status'] },
    'redistributor': { type: 'staff', permissions: ['bike_redistribution', 'location_management'] },
    'charging_staff': { type: 'staff', permissions: ['bike_maintenance', 'view_bike_status'] },
    'quality_inspector': { type: 'staff', permissions: ['bike_management', 'view_operational_reports'] },
    
    // Business Partners
    'payment_partner': { type: 'partner', permissions: ['payment_management', 'view_transactions'] },
    'location_partner': { type: 'partner', permissions: ['location_management'] },
    'corporate_partner': { type: 'partner', permissions: ['organization_billing', 'view_user_profiles'] },
    'government_official': { type: 'partner', permissions: ['analytics', 'reporting', 'view_operational_reports'] },
    
    // System Accounts
    'api_service': { type: 'system', permissions: ['api_access', 'data_sync'] },
    'automated_system': { type: 'system', permissions: ['scheduled_tasks', 'monitoring'] },
    'test_account': { type: 'system', permissions: [] }
  };

  useEffect(() => {
    fetchUsers();
    fetchOrganizations();
    fetchPermissions();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          full_name,
          full_name_amharic,
          email,
          phone,
          user_role,
          user_type,
          organization_id,
          permissions,
          verified,
          status,
          organizations(name, name_amharic)
        `)
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name, name_amharic, organization_type')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('user_permissions')
        .select(`
          id,
          user_id,
          permission_name,
          resource_type,
          resource_id,
          granted_by,
          granted_at,
          expires_at,
          is_active,
          users!user_permissions_user_id_fkey(full_name, email),
          granted_by_user:users!user_permissions_granted_by_fkey(full_name, email)
        `)
        .eq('is_active', true)
        .order('granted_at', { ascending: false });

      if (error) throw error;
      setPermissions(data || []);
    } catch (error) {
      console.error('Error fetching permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    try {
      // Validate required fields
      if (!newUserForm.full_name || !newUserForm.email || !newUserForm.phone) {
        alert('Please fill in all required fields (Name, Email, Phone)');
        return;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newUserForm.email)) {
        alert('Please enter a valid email address');
        return;
      }

      // Phone validation (Ethiopian format)
      const phoneRegex = /^\+251[0-9]{9}$/;
      if (!phoneRegex.test(newUserForm.phone)) {
        alert('Please enter a valid Ethiopian phone number (+251XXXXXXXXX)');
        return;
      }

      // Get role definition
      const roleDefinition = userRoleDefinitions[newUserForm.user_role as keyof typeof userRoleDefinitions];
      const defaultPermissions = roleDefinition?.permissions || [];

      // Create user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert({
          full_name: newUserForm.full_name,
          full_name_amharic: newUserForm.full_name_amharic || null,
          email: newUserForm.email,
          phone: newUserForm.phone,
          user_role: newUserForm.user_role,
          user_type: roleDefinition?.type || newUserForm.user_type,
          organization_id: newUserForm.organization_id || null,
          student_id: newUserForm.student_id || null,
          employee_id: newUserForm.employee_id || null,
          government_id: newUserForm.government_id || null,
          subscription_type: newUserForm.subscription_type,
          permissions: [...defaultPermissions, ...newUserForm.permissions],
          verified: false,
          status: 'pending'
        })
        .select()
        .single();

      if (userError) throw userError;

      // Grant additional granular permissions if any
      const currentUser = await supabase.auth.getUser();
      if (newUserForm.permissions.length > 0 && currentUser.data.user) {
        const permissionInserts = newUserForm.permissions.map(permission => ({
          user_id: userData.id,
          permission_name: permission,
          granted_by: currentUser.data.user!.id
        }));

        const { error: permissionError } = await supabase
          .from('user_permissions')
          .insert(permissionInserts);

        if (permissionError) {
          console.error('Error granting permissions:', permissionError);
          // Don't fail the user creation, just log the error
        }
      }

      // Refresh data
      await fetchUsers();
      await fetchPermissions();

      // Reset form and close modal
      setNewUserForm({
        full_name: '',
        full_name_amharic: '',
        email: '',
        phone: '',
        user_role: 'customer',
        user_type: 'end_user',
        organization_id: '',
        student_id: '',
        employee_id: '',
        government_id: '',
        subscription_type: 'pay_per_ride',
        permissions: []
      });
      setShowAddUserModal(false);

      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please check if email or phone already exists.');
    }
  };

  const grantPermission = async (userId: string, permissionName: string, resourceType?: string, expiresAt?: string) => {
    try {
      const currentUser = await supabase.auth.getUser();
      if (!currentUser.data.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('user_permissions')
        .insert({
          user_id: userId,
          permission_name: permissionName,
          resource_type: resourceType,
          granted_by: currentUser.data.user.id,
          expires_at: expiresAt || null
        });

      if (error) throw error;

      // Refresh data
      fetchPermissions();
      setShowGrantModal(false);
      alert('Permission granted successfully!');
    } catch (error) {
      console.error('Error granting permission:', error);
      alert('Failed to grant permission. Please try again.');
    }
  };

  const revokePermission = async (permissionId: string) => {
    try {
      const { error } = await supabase
        .from('user_permissions')
        .update({ is_active: false })
        .eq('id', permissionId);

      if (error) throw error;

      // Refresh data
      fetchPermissions();
      alert('Permission revoked successfully!');
    } catch (error) {
      console.error('Error revoking permission:', error);
      alert('Failed to revoke permission. Please try again.');
    }
  };

  const getUserTypeIcon = (userType: string, userRole: string) => {
    if (userType === 'admin') return <Shield className="w-4 h-4 text-red-600" />;
    if (userType === 'staff') return <Settings className="w-4 h-4 text-blue-600" />;
    if (userType === 'partner') return <Building className="w-4 h-4 text-purple-600" />;
    if (userType === 'system') return <Settings className="w-4 h-4 text-gray-600" />;
    return <Users className="w-4 h-4 text-green-600" />;
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.user_role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || user.user_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getUserPermissions = (userId: string) => {
    return permissions.filter(p => p.user_id === userId && p.is_active);
  };

  const togglePermission = (permission: string) => {
    setNewUserForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleRoleChange = (role: string) => {
    const roleDefinition = userRoleDefinitions[role as keyof typeof userRoleDefinitions];
    setNewUserForm(prev => ({
      ...prev,
      user_role: role,
      user_type: roleDefinition?.type || 'end_user',
      permissions: roleDefinition?.permissions || []
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-text-secondary">Loading permissions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">User Permission Management</h1>
          <p className="text-text-secondary mt-2">Create users and manage permissions for all user types</p>
          <p className="text-text-secondary text-sm mt-1">🇪🇹 Total Users: {users.length} • Active Permissions: {permissions.length}</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={() => setShowAddUserModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <UserPlus className="w-5 h-5" />
            <span>Add User</span>
          </button>
          <button
            onClick={() => setShowGrantModal(true)}
            className="btn-secondary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Grant Permission</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Administrators</p>
              <p className="text-xl font-bold text-text-primary">
                {users.filter(u => u.user_type === 'admin').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Staff Members</p>
              <p className="text-xl font-bold text-text-primary">
                {users.filter(u => u.user_type === 'staff').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Partners</p>
              <p className="text-xl font-bold text-text-primary">
                {users.filter(u => u.user_type === 'partner').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Active Permissions</p>
              <p className="text-xl font-bold text-text-primary">{permissions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search users by name, email, or role..."
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
              <option value="all">All User Types</option>
              <option value="admin">Administrators</option>
              <option value="staff">Staff</option>
              <option value="partner">Partners</option>
              <option value="end_user">End Users</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Role & Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Current Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const userPermissions = getUserPermissions(user.id);
                return (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.full_name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text-primary">{user.full_name}</div>
                          {user.full_name_amharic && (
                            <div className="text-xs text-text-secondary">{user.full_name_amharic}</div>
                          )}
                          <div className="text-xs text-text-secondary">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getUserTypeIcon(user.user_type, user.user_role)}
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getUserTypeColor(user.user_type)}`}>
                            {user.user_type}
                          </span>
                          <div className="text-xs text-text-secondary mt-1 capitalize">
                            {user.user_role.replace(/_/g, ' ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.organizations ? (
                        <div>
                          <div className="text-sm text-text-primary">{user.organizations.name}</div>
                          {user.organizations.name_amharic && (
                            <div className="text-xs text-text-secondary">{user.organizations.name_amharic}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-text-secondary text-sm">No organization</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.permissions && user.permissions.length > 0 ? (
                          user.permissions.slice(0, 3).map((permission, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {permission}
                            </span>
                          ))
                        ) : (
                          <span className="text-text-secondary text-sm">No permissions</span>
                        )}
                        {user.permissions && user.permissions.length > 3 && (
                          <span className="text-xs text-text-secondary">
                            +{user.permissions.length - 3} more
                          </span>
                        )}
                      </div>
                      {userPermissions.length > 0 && (
                        <div className="text-xs text-text-secondary mt-1">
                          {userPermissions.length} granular permissions
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setShowUserPermissions(user)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="View Permissions"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedUser(user);
                            setShowGrantModal(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Grant Permission"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button 
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Edit Role"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 text-text-secondary">
            No users found matching your criteria.
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">Add New User</h3>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-text-primary">Basic Information</h4>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Full Name (English) *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                    <input
                      type="text"
                      value={newUserForm.full_name}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, full_name: e.target.value }))}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Full Name (Amharic)
                  </label>
                  <input
                    type="text"
                    value={newUserForm.full_name_amharic}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, full_name_amharic: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="ጆን ዶ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                    <input
                      type="email"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                    <input
                      type="tel"
                      value={newUserForm.phone}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="+251911234567"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Government ID
                  </label>
                  <input
                    type="text"
                    value={newUserForm.government_id}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, government_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ethiopian ID Number"
                  />
                </div>
              </div>

              {/* Role and Organization */}
              <div className="space-y-4">
                <h4 className="font-medium text-text-primary">Role & Organization</h4>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    User Role *
                  </label>
                  <select
                    value={newUserForm.user_role}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <optgroup label="End Users">
                      <option value="customer">Customer</option>
                      <option value="premium_customer">Premium Customer</option>
                      <option value="student">Student</option>
                      <option value="corporate_user">Corporate User</option>
                      <option value="tourist">Tourist</option>
                    </optgroup>
                    <optgroup label="Administrative">
                      <option value="super_admin">Super Admin</option>
                      <option value="operations_manager">Operations Manager</option>
                      <option value="finance_manager">Finance Manager</option>
                      <option value="customer_support">Customer Support</option>
                      <option value="data_analyst">Data Analyst</option>
                    </optgroup>
                    <optgroup label="Operational Staff">
                      <option value="field_technician">Field Technician</option>
                      <option value="redistributor">Redistributor</option>
                      <option value="charging_staff">Charging Staff</option>
                      <option value="quality_inspector">Quality Inspector</option>
                    </optgroup>
                    <optgroup label="Business Partners">
                      <option value="payment_partner">Payment Partner</option>
                      <option value="location_partner">Location Partner</option>
                      <option value="corporate_partner">Corporate Partner</option>
                      <option value="government_official">Government Official</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    User Type
                  </label>
                  <input
                    type="text"
                    value={newUserForm.user_type}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-text-secondary"
                  />
                  <p className="text-xs text-text-secondary mt-1">Automatically set based on role</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Organization
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                    <select
                      value={newUserForm.organization_id}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, organization_id: e.target.value }))}
                      className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">No Organization</option>
                      {organizations.map(org => (
                        <option key={org.id} value={org.id}>
                          {org.name} {org.name_amharic && `(${org.name_amharic})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {newUserForm.user_role === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Student ID
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
                      <input
                        type="text"
                        value={newUserForm.student_id}
                        onChange={(e) => setNewUserForm(prev => ({ ...prev, student_id: e.target.value }))}
                        className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Student ID Number"
                      />
                    </div>
                  </div>
                )}

                {newUserForm.user_role === 'corporate_user' && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      value={newUserForm.employee_id}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, employee_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Employee ID Number"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Subscription Type
                  </label>
                  <select
                    value={newUserForm.subscription_type}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, subscription_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="pay_per_ride">Pay Per Ride</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                    <option value="corporate">Corporate</option>
                    <option value="student">Student</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Permissions Section */}
            <div className="mt-6">
              <h4 className="font-medium text-text-primary mb-4">Additional Permissions</h4>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-blue-800">
                  <strong>Default permissions for {newUserForm.user_role}:</strong> {
                    userRoleDefinitions[newUserForm.user_role as keyof typeof userRoleDefinitions]?.permissions.join(', ') || 'None'
                  }
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(availablePermissions).map(([category, perms]) => (
                  <div key={category} className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-text-primary mb-3">{category}</h5>
                    <div className="space-y-2">
                      {perms.map(permission => (
                        <label key={permission} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={newUserForm.permissions.includes(permission)}
                            onChange={() => togglePermission(permission)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-text-primary">{permission.replace(/_/g, ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={createUser}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Create User</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grant Permission Modal */}
      {showGrantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">
                Grant Permission {selectedUser && `to ${selectedUser.full_name}`}
              </h3>
              <button
                onClick={() => {
                  setShowGrantModal(false);
                  setSelectedUser(null);
                }}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* User Selection */}
              {!selectedUser && (
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Select User</label>
                  <select 
                    onChange={(e) => {
                      const user = users.find(u => u.id === e.target.value);
                      setSelectedUser(user || null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Choose a user...</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.full_name} ({user.email}) - {user.user_role}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Permission Categories */}
              {selectedUser && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-text-primary">Selected User</h4>
                    <p className="text-sm text-text-secondary">
                      {selectedUser.full_name} ({selectedUser.email})
                    </p>
                    <p className="text-sm text-text-secondary">
                      Role: {selectedUser.user_role} | Type: {selectedUser.user_type}
                    </p>
                  </div>

                  {Object.entries(availablePermissions).map(([category, perms]) => (
                    <div key={category} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-text-primary mb-3">{category}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {perms.map(permission => (
                          <button
                            key={permission}
                            onClick={() => grantPermission(selectedUser.id, permission)}
                            className="text-left p-2 text-sm border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                          >
                            {permission.replace(/_/g, ' ')}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* User Permissions Detail Modal */}
      {showUserPermissions && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">
                Permissions for {showUserPermissions.full_name}
              </h3>
              <button
                onClick={() => setShowUserPermissions(null)}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* User Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {showUserPermissions.full_name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{showUserPermissions.full_name}</h4>
                    <p className="text-sm text-text-secondary">{showUserPermissions.email}</p>
                    <p className="text-sm text-text-secondary">
                      {showUserPermissions.user_role} • {showUserPermissions.user_type}
                    </p>
                  </div>
                </div>
              </div>

              {/* Role-based Permissions */}
              <div>
                <h4 className="font-medium text-text-primary mb-3">Role-based Permissions</h4>
                <div className="flex flex-wrap gap-2">
                  {showUserPermissions.permissions && showUserPermissions.permissions.length > 0 ? (
                    showUserPermissions.permissions.map((permission, index) => (
                      <span key={index} className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                        {permission.replace(/_/g, ' ')}
                      </span>
                    ))
                  ) : (
                    <span className="text-text-secondary">No role-based permissions</span>
                  )}
                </div>
              </div>

              {/* Granular Permissions */}
              <div>
                <h4 className="font-medium text-text-primary mb-3">Granular Permissions</h4>
                <div className="space-y-2">
                  {getUserPermissions(showUserPermissions.id).map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-text-primary">
                          {permission.permission_name.replace(/_/g, ' ')}
                        </div>
                        <div className="text-sm text-text-secondary">
                          Granted by: {permission.granted_by_user.full_name}
                        </div>
                        <div className="text-xs text-text-secondary">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {new Date(permission.granted_at).toLocaleDateString()}
                          {permission.expires_at && (
                            <span className="ml-2">
                              <AlertCircle className="w-3 h-3 inline mr-1" />
                              Expires: {new Date(permission.expires_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => revokePermission(permission.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Revoke Permission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {getUserPermissions(showUserPermissions.id).length === 0 && (
                    <span className="text-text-secondary">No granular permissions granted</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPermissions;