import React from 'react';
import { 
  Bike, 
  Users, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Battery,
  AlertTriangle,
  Clock
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Mock data for charts
  const revenueData = [
    { date: 'Jan', revenue: 12000, users: 450 },
    { date: 'Feb', revenue: 19000, users: 680 },
    { date: 'Mar', revenue: 25000, users: 920 },
    { date: 'Apr', revenue: 32000, users: 1200 },
    { date: 'May', revenue: 28000, users: 1050 },
    { date: 'Jun', revenue: 35000, users: 1380 },
  ];

  const bikeStatusData = [
    { name: 'Available', value: 856, color: '#2ECC71' },
    { name: 'In Use', value: 234, color: '#3498DB' },
    { name: 'Maintenance', value: 89, color: '#F39C12' },
    { name: 'Unavailable', value: 55, color: '#E74C3C' },
  ];

  const recentActivity = [
    { id: 1, user: 'አበበ ከበደ (Abebe Kebede)', action: 'Started ride', bike: 'BK-1234', time: '2 min ago', location: 'Meskel Square' },
    { id: 2, user: 'ሃና ታደሰ (Hanna Tadesse)', action: 'Ended ride', bike: 'BK-5678', time: '5 min ago', location: 'Bole Airport' },
    { id: 3, user: 'ዳዊት መኮንን (Dawit Mekonen)', action: 'Payment completed', bike: 'BK-9012', time: '8 min ago', location: 'Piazza' },
    { id: 4, user: 'ሳራ አህመድ (Sara Ahmed)', action: 'Started ride', bike: 'BK-3456', time: '12 min ago', location: 'Mexico Square' },
  ];

  const stats = [
    { 
      label: 'Total Bikes', 
      value: '1,234', 
      change: '+12%', 
      icon: Bike, 
      color: 'bg-primary' 
    },
    { 
      label: 'Active Users', 
      value: '8,567', 
      change: '+8%', 
      icon: Users, 
      color: 'bg-accent' 
    },
    { 
      label: 'Daily Revenue', 
      value: 'ETB 45,230', 
      change: '+15%', 
      icon: DollarSign, 
      color: 'bg-success' 
    },
    { 
      label: 'Active Rides', 
      value: '234', 
      change: '+23%', 
      icon: TrendingUp, 
      color: 'bg-warning' 
    },
  ];

  const alerts = [
    { id: 1, type: 'low_battery', title: 'Low Battery Alert', message: '15 bikes need charging in the next 2 hours', severity: 'high' },
    { id: 2, type: 'maintenance', title: 'Maintenance Due', message: '8 bikes require scheduled maintenance this week', severity: 'medium' },
    { id: 3, type: 'high_demand', title: 'High Demand Area', message: 'Bole area needs more bikes - current demand exceeds supply', severity: 'medium' },
    { id: 4, type: 'holiday', title: 'Timkat Preparation', message: 'Extra bikes needed at Meskel Square for upcoming Timkat celebration', severity: 'low' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-text-secondary mt-2">Welcome back! Here's what's happening with Bisklet today.</p>
          <p className="text-text-secondary text-sm mt-1">🇪🇹 Serving Addis Ababa • {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">{stat.label}</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{stat.value}</p>
                  <p className="text-success text-sm font-medium mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Daily Revenue (ETB)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`ETB ${value.toLocaleString()}`, 'Daily Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#2ECC71" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bike Status Chart */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Bike Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bikeStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {bikeStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-4 mt-4">
            {bikeStatusData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <span className="text-sm text-text-secondary">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-text-primary font-medium">{activity.user}</p>
                  <p className="text-text-secondary text-sm">{activity.action} • {activity.bike}</p>
                  <p className="text-text-secondary text-xs flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {activity.location}
                  </p>
                </div>
                <div className="text-text-secondary text-sm">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Alerts */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">System Alerts</h3>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className={`flex items-start space-x-3 p-3 rounded-lg ${
                alert.severity === 'high' ? 'bg-red-50' :
                alert.severity === 'medium' ? 'bg-yellow-50' : 'bg-blue-50'
              }`}>
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                  alert.severity === 'high' ? 'text-red-500' :
                  alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{alert.title}</p>
                  <p className="text-xs text-text-secondary">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;