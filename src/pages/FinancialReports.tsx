import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  CreditCard,
  Smartphone,
  Building
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import PaymentMethods from '../components/PaymentMethods';

const FinancialReports = () => {
  const [dateRange, setDateRange] = useState('7d');
  const [reportType, setReportType] = useState('revenue');

  // Mock data with Ethiopian context
  const revenueData = [
    { date: '2024-01-01', revenue: 12450, rides: 245, users: 89 },
    { date: '2024-01-02', revenue: 15230, rides: 298, users: 112 },
    { date: '2024-01-03', revenue: 18900, rides: 356, users: 134 },
    { date: '2024-01-04', revenue: 16780, rides: 289, users: 98 },
    { date: '2024-01-05', revenue: 21340, rides: 412, users: 156 },
    { date: '2024-01-06', revenue: 19560, rides: 378, users: 143 },
    { date: '2024-01-07', revenue: 23120, rides: 445, users: 167 }
  ];

  const paymentMethodData = [
    { name: 'Telebirr', value: 45, amount: 125340, color: '#2ECC71' },
    { name: 'CBE Birr', value: 28, amount: 78920, color: '#3498DB' },
    { name: 'Dashen Bank', value: 15, amount: 42150, color: '#F39C12' },
    { name: 'Awash Bank', value: 8, amount: 22480, color: '#9B59B6' },
    { name: 'Cash', value: 4, amount: 11250, color: '#E74C3C' }
  ];

  const monthlyComparison = [
    { month: 'Oct', current: 45000, previous: 38000 },
    { month: 'Nov', current: 52000, previous: 42000 },
    { month: 'Dec', current: 48000, previous: 45000 },
    { month: 'Jan', current: 67000, previous: 48000 }
  ];

  const kpiData = [
    {
      label: 'Total Revenue',
      value: 'ETB 847,230',
      change: '+15.2%',
      isPositive: true,
      icon: DollarSign,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Average Transaction',
      value: 'ETB 23.45',
      change: '+3.1%',
      isPositive: true,
      icon: CreditCard,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Transaction Volume',
      value: '36,124',
      change: '+8.7%',
      isPositive: true,
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Refund Rate',
      value: '2.1%',
      change: '-0.3%',
      isPositive: true,
      icon: TrendingDown,
      color: 'bg-red-100 text-red-600'
    }
  ];

  const topLocations = [
    { location: 'Meskel Square (መስቀል አደባባይ)', revenue: 45230, rides: 892 },
    { location: 'Bole Airport (ቦሌ አየር ማረፊያ)', revenue: 38940, rides: 756 },
    { location: 'Piazza (ፒያሳ)', revenue: 32150, rides: 634 },
    { location: 'Mexico Square (ሜክሲኮ አደባባይ)', revenue: 28750, rides: 567 },
    { location: 'Mercato (መርካቶ)', revenue: 25430, rides: 498 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Financial Reports</h1>
          <p className="text-text-secondary mt-2">Monitor revenue, transactions, and financial performance</p>
          <p className="text-text-secondary text-sm mt-1">🇪🇹 Ethiopian Birr (ETB) • Addis Ababa Market</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="3m">Last 3 months</option>
            <option value="1y">Last year</option>
          </select>
          <button className="btn-primary flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-secondary text-sm font-medium">{kpi.label}</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">{kpi.value}</p>
                  <p className={`text-sm font-medium mt-1 ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </p>
                </div>
                <div className={`w-12 h-12 ${kpi.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Revenue Trend (ETB)</h3>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-text-secondary" />
              <span className="text-sm text-text-secondary">Daily Revenue</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).getDate().toString()} />
              <YAxis />
              <Tooltip formatter={(value) => [`ETB ${value.toLocaleString()}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#2ECC71" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Ethiopian Payment Methods</h3>
          <div className="flex items-center space-x-8">
            <ResponsiveContainer width="60%" height={250}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Usage']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3">
              {paymentMethodData.map((method, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: method.color }}></div>
                    <span className="text-sm font-medium text-text-primary">{method.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-text-primary">ETB {method.amount.toLocaleString()}</p>
                    <p className="text-xs text-text-secondary">{method.value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Component */}
      <PaymentMethods />

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Comparison */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Monthly Comparison (ETB)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`ETB ${value.toLocaleString()}`, '']} />
              <Bar dataKey="previous" fill="#E5E7EB" name="Previous Year" />
              <Bar dataKey="current" fill="#2ECC71" name="Current Year" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-300 rounded"></div>
              <span className="text-sm text-text-secondary">Previous Year</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span className="text-sm text-text-secondary">Current Year</span>
            </div>
          </div>
        </div>

        {/* Top Locations */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Top Revenue Locations</h3>
          <div className="space-y-4">
            {topLocations.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{location.location}</p>
                    <p className="text-xs text-text-secondary">{location.rides} rides</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-text-primary">ETB {location.revenue.toLocaleString()}</p>
                  <p className="text-xs text-text-secondary">
                    ETB {Math.round(location.revenue / location.rides)} avg
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Recent Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Amount (ETB)
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Method
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { id: 'TXN-001', user: 'አበበ ከበደ (Abebe Kebede)', amount: 25.50, method: 'Telebirr', status: 'completed', date: '2024-01-07 14:30' },
                { id: 'TXN-002', user: 'ሃና ታደሰ (Hanna Tadesse)', amount: 18.75, method: 'CBE Birr', status: 'completed', date: '2024-01-07 14:25' },
                { id: 'TXN-003', user: 'ዳዊት መኮንን (Dawit Mekonen)', amount: 32.00, method: 'Dashen Bank', status: 'pending', date: '2024-01-07 14:20' },
                { id: 'TXN-004', user: 'ሳራ አህመድ (Sara Ahmed)', amount: 15.25, method: 'Telebirr', status: 'completed', date: '2024-01-07 14:15' },
                { id: 'TXN-005', user: 'ሚካኤል በቀለ (Michael Bekele)', amount: 22.50, method: 'Awash Bank', status: 'failed', date: '2024-01-07 14:10' }
              ].map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                    {transaction.id}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">
                    {transaction.user}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-text-primary">
                    ETB {transaction.amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-text-primary">
                    <div className="flex items-center space-x-1">
                      {transaction.method === 'Telebirr' && <Smartphone className="w-4 h-4 text-green-500" />}
                      {transaction.method.includes('Bank') && <Building className="w-4 h-4 text-blue-500" />}
                      {transaction.method === 'CBE Birr' && <Building className="w-4 h-4 text-blue-500" />}
                      <span>{transaction.method}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {transaction.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialReports;