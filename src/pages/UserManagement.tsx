import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Phone, 
  Mail,
  CreditCard,
  MapPin,
  MoreHorizontal,
  Eye,
  Shield,
  Edit3,
  Trash2,
  Plus,
  Download,
  RefreshCw,
  Building,
  GraduationCap,
  Briefcase,
  Crown,
  X,
  Save
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface UserData {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  full_name_amharic?: string;
  user_role: string;
  user_type: string;
  verified: boolean;
  wallet_balance: number;
  total_rides: number;
  subscription_type: string;
  subscription_expires_at?: string;
  status: 'active' | 'suspended' | 'pending';
  created_at: string;
  last_active: string;
  organization_id?: string;
  student_id?: string;
  employee_id?: string;
  organizations?: {
    name: string;
    name_amharic?: string;
  };
}

interface Organization {
  id: string;
  name: string;
  name_amharic?: string;
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
  subscription_type: string;
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showUserDetails, setShowUserDetails] = useState<UserData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
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
    subscription_type: 'pay_per_ride'
  });
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    pending: 0,
    suspended: 0
  });

  useEffect(() => {
    fetchUsers();
    fetchOrganizations();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          email,
          phone,
          full_name,
          full_name_amharic,
          user_role,
          user_type,
          verified,
          wallet_balance,
          total_rides,
          subscription_type,
          subscription_expires_at,
          status,
          created_at,
          last_active,
          organization_id,
          student_id,
          employee_id,
          organizations(name, name_amharic)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data || []);
      
      // Calculate stats
      const total = data?.length || 0;
      const verified = data?.filter(u => u.verified).length || 0;
      const pending = data?.filter(u => u.status === 'pending').length || 0;
      const suspended = data?.filter(u => u.status === 'suspended').length || 0;
      
      setStats({ total, verified, pending, suspended });
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name, name_amharic')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setOrganizations(data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
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

      const { data, error } = await supabase
        .from('users')
        .insert({
          full_name: newUserForm.full_name,
          full_name_amharic: newUserForm.full_name_amharic || null,
          email: newUserForm.email,
          phone: newUserForm.phone,
          user_role: newUserForm.user_role,
          user_type: newUserForm.user_type,
          organization_id: newUserForm.organization_id || null,
          student_id: newUserForm.student_id || null,
          employee_id: newUserForm.employee_id || null,
          subscription_type: newUserForm.subscription_type,
          verified: false,
          status: 'pending',
          wallet_balance: 0.00,
          total_rides: 0
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh users list
      await fetchUsers();

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
        subscription_type: 'pay_per_ride'
      });
      setShowAddModal(false);

      alert('User created successfully!');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Please check if email or phone already exists.');
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: newStatus })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, status: newStatus as any } : user
      ));

      alert(`User status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Failed to update user status');
    }
  };

  const toggleUserVerification = async (userId: string, currentVerified: boolean) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ verified: !currentVerified })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, verified: !currentVerified } : user
      ));

      alert(`User ${!currentVerified ? 'verified' : 'unverified'} successfully`);
    } catch (error) {
      console.error('Error updating user verification:', error);
      alert('Failed to update user verification');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUserTypeIcon = (userType: string, userRole: string) => {
    if (userType === 'admin') return <Crown className="w-4 h-4 text-red-600" />;
    if (userType === 'staff') return <Shield className="w-4 h-4 text-blue-600" />;
    if (userType === 'partner') return <Building className="w-4 h-4 text-purple-600" />;
    if (userRole === 'student') return <GraduationCap className="w-4 h-4 text-green-600" />;
    if (userRole === 'corporate_user') return <Briefcase className="w-4 h-4 text-orange-600" />;
    return <Users className="w-4 h-4 text-blue-500" />;
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'staff': return 'bg-blue-100 text-blue-800';
      case 'partner': return 'bg-purple-100 text-purple-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return `${Math.floor(diffInHours / 168)} weeks ago`;
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm) ||
                         user.user_role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesType = typeFilter === 'all' || user.user_type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const exportUsers = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Role', 'Type', 'Status', 'Verified', 'Wallet Balance', 'Total Rides', 'Organization', 'Created At'].join(','),
      ...filteredUsers.map(user => [
        user.full_name,
        user.email,
        user.phone,
        user.user_role,
        user.user_type,
        user.status,
        user.verified ? 'Yes' : 'No',
        user.wallet_balance,
        user.total_rides,
        user.organizations?.name || 'None',
        formatDate(user.created_at)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bisklet-users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-text-secondary">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">User Management</h1>
          <p className="text-text-secondary mt-2">Manage user accounts, verification, and support</p>
          <p className="text-text-secondary text-sm mt-1">🇪🇹 Total Users: {stats.total} • Real-time data from Supabase</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={fetchUsers}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportUsers}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Stats Cards with Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Total Users</p>
              <p className="text-xl font-bold text-text-primary">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Verified</p>
              <p className="text-xl font-bold text-text-primary">{stats.verified}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Pending</p>
              <p className="text-xl font-bold text-text-primary">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Suspended</p>
              <p className="text-xl font-bold text-text-primary">{stats.suspended}</p>
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
              placeholder="Search users by name, email, phone, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-text-secondary" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="admin">Administrators</option>
              <option value="staff">Staff</option>
              <option value="partner">Partners</option>
              <option value="end_user">End Users</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table with Real Data */}
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
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Wallet & Rides
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
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
                        <div className="text-xs text-text-secondary">Joined {formatDate(user.created_at)}</div>
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
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-4 h-4 text-text-secondary" />
                        <span className="text-sm text-text-primary">{user.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="w-4 h-4 text-text-secondary" />
                        <span className="text-sm text-text-primary">{user.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                      {user.verified && (
                        <div className="flex items-center space-x-1">
                          <UserCheck className="w-3 h-3 text-green-500" />
                          <span className="text-xs text-green-600">Verified</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.organizations ? (
                      <div>
                        <div className="text-sm text-text-primary">{user.organizations.name}</div>
                        {user.organizations.name_amharic && (
                          <div className="text-xs text-text-secondary">{user.organizations.name_amharic}</div>
                        )}
                        {user.student_id && (
                          <div className="text-xs text-text-secondary">Student: {user.student_id}</div>
                        )}
                        {user.employee_id && (
                          <div className="text-xs text-text-secondary">Employee: {user.employee_id}</div>
                        )}
                      </div>
                    ) : (
                      <span className="text-text-secondary text-sm">No organization</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1">
                        <CreditCard className="w-4 h-4 text-text-secondary" />
                        <span className="text-sm font-medium text-text-primary">
                          ETB {user.wallet_balance.toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-text-secondary">
                        {user.total_rides} rides
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {formatTimeAgo(user.last_active)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => setShowUserDetails(user)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => toggleUserVerification(user.id, user.verified)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title={user.verified ? "Unverify User" : "Verify User"}
                      >
                        <UserCheck className={`w-4 h-4 ${user.verified ? 'text-green-500' : 'text-gray-400'}`} />
                      </button>
                      <button 
                        onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'suspended' : 'active')}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                        title={user.status === 'active' ? "Suspend User" : "Activate User"}
                      >
                        <Shield className={`w-4 h-4 ${user.status === 'active' ? 'text-red-500' : 'text-green-500'}`} />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
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
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">Add New User</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-text-primary">Basic Information</h4>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Full Name (English) *
                  </label>
                  <input
                    type="text"
                    value={newUserForm.full_name}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, full_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
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
                  <input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+251911234567"
                    required
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
                    onChange={(e) => {
                      const role = e.target.value;
                      let userType = 'end_user';
                      if (['super_admin', 'operations_manager', 'finance_manager', 'customer_support', 'data_analyst'].includes(role)) {
                        userType = 'admin';
                      } else if (['field_technician', 'redistributor', 'charging_staff', 'quality_inspector'].includes(role)) {
                        userType = 'staff';
                      } else if (['payment_partner', 'location_partner', 'corporate_partner', 'government_official'].includes(role)) {
                        userType = 'partner';
                      }
                      setNewUserForm(prev => ({ ...prev, user_role: role, user_type: userType }));
                    }}
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
                  <select
                    value={newUserForm.organization_id}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, organization_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">No Organization</option>
                    {organizations.map(org => (
                      <option key={org.id} value={org.id}>
                        {org.name} {org.name_amharic && `(${org.name_amharic})`}
                      </option>
                    ))}
                  </select>
                </div>

                {newUserForm.user_role === 'student' && (
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Student ID
                    </label>
                    <input
                      type="text"
                      value={newUserForm.student_id}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, student_id: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Student ID Number"
                    />
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

            {/* Actions */}
            <div className="flex space-x-3 pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
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

      {/* User Details Modal */}
      {showUserDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">User Details</h3>
              <button
                onClick={() => setShowUserDetails(null)}
                className="text-text-secondary hover:text-text-primary"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-xl">
                    {showUserDetails.full_name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-text-primary">{showUserDetails.full_name}</h4>
                  {showUserDetails.full_name_amharic && (
                    <p className="text-text-secondary">{showUserDetails.full_name_amharic}</p>
                  )}
                  <p className="text-text-secondary">Member since {formatDate(showUserDetails.created_at)}</p>
                </div>
              </div>

              {/* Contact & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h5 className="font-medium text-text-primary">Contact Information</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-text-secondary" />
                      <span className="text-sm">{showUserDetails.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-text-secondary" />
                      <span className="text-sm">{showUserDetails.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-medium text-text-primary">Account Status</h5>
                  <div className="space-y-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(showUserDetails.status)}`}>
                      {showUserDetails.status}
                    </span>
                    <div className="flex items-center space-x-2">
                      {showUserDetails.verified ? (
                        <>
                          <UserCheck className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-green-600">Verified Account</span>
                        </>
                      ) : (
                        <>
                          <UserX className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-red-600">Unverified Account</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Role & Organization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h5 className="font-medium text-text-primary">Role & Type</h5>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      {getUserTypeIcon(showUserDetails.user_type, showUserDetails.user_role)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getUserTypeColor(showUserDetails.user_type)}`}>
                        {showUserDetails.user_type}
                      </span>
                    </div>
                    <div className="text-sm text-text-secondary capitalize">
                      {showUserDetails.user_role.replace(/_/g, ' ')}
                    </div>
                    <div className="text-sm text-text-secondary">
                      Subscription: {showUserDetails.subscription_type}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium text-text-primary">Organization</h5>
                  {showUserDetails.organizations ? (
                    <div>
                      <div className="text-sm font-medium text-text-primary">{showUserDetails.organizations.name}</div>
                      {showUserDetails.organizations.name_amharic && (
                        <div className="text-xs text-text-secondary">{showUserDetails.organizations.name_amharic}</div>
                      )}
                      {showUserDetails.student_id && (
                        <div className="text-xs text-text-secondary">Student ID: {showUserDetails.student_id}</div>
                      )}
                      {showUserDetails.employee_id && (
                        <div className="text-xs text-text-secondary">Employee ID: {showUserDetails.employee_id}</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-text-secondary text-sm">No organization</span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-4 text-center">
                  <CreditCard className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-text-primary">ETB {showUserDetails.wallet_balance.toFixed(2)}</p>
                  <p className="text-text-secondary text-sm">Wallet Balance</p>
                </div>
                <div className="card p-4 text-center">
                  <MapPin className="w-8 h-8 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-bold text-text-primary">{showUserDetails.total_rides}</p>
                  <p className="text-text-secondary text-sm">Total Rides</p>
                </div>
                <div className="card p-4 text-center">
                  <Users className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-2xl font-bold text-text-primary">{formatTimeAgo(showUserDetails.last_active)}</p>
                  <p className="text-text-secondary text-sm">Last Active</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                {!showUserDetails.verified && (
                  <button 
                    onClick={() => {
                      toggleUserVerification(showUserDetails.id, showUserDetails.verified);
                      setShowUserDetails(null);
                    }}
                    className="btn-primary flex-1"
                  >
                    Verify Account
                  </button>
                )}
                <button 
                  onClick={() => {
                    updateUserStatus(showUserDetails.id, showUserDetails.status === 'active' ? 'suspended' : 'active');
                    setShowUserDetails(null);
                  }}
                  className={`flex-1 ${showUserDetails.status === 'active' ? 'btn-secondary' : 'btn-primary'}`}
                >
                  {showUserDetails.status === 'active' ? 'Suspend User' : 'Activate User'}
                </button>
                <button className="btn-secondary flex-1">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;