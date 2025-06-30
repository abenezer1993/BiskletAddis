import React, { useState, useEffect } from 'react';
import { 
  Bike, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Battery, 
  Wrench, 
  Edit3,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  X,
  Save
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface BikeData {
  id: string;
  bike_code: string;
  qr_code: string;
  model: string;
  current_location_name?: string;
  current_location_amharic?: string;
  battery_level: number;
  status: 'available' | 'in_use' | 'maintenance' | 'unavailable';
  last_maintenance?: string;
  total_rides: number;
  total_distance_km: number;
  created_at: string;
  updated_at: string;
}

interface NewBikeForm {
  bike_code: string;
  model: string;
  current_location_name: string;
  current_location_amharic: string;
  battery_level: number;
  status: string;
}

const BikeManagement = () => {
  const [bikes, setBikes] = useState<BikeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBikeForm, setNewBikeForm] = useState<NewBikeForm>({
    bike_code: '',
    model: 'Urban Classic',
    current_location_name: '',
    current_location_amharic: '',
    battery_level: 100,
    status: 'available'
  });

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bikes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBikes(data || []);
    } catch (error) {
      console.error('Error fetching bikes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBike = async () => {
    try {
      // Validate required fields
      if (!newBikeForm.bike_code || !newBikeForm.current_location_name) {
        alert('Please fill in all required fields (Bike Code and Location)');
        return;
      }

      // Generate QR code
      const qrCode = `QR-${newBikeForm.bike_code}-${Date.now()}`;

      const { data, error } = await supabase
        .from('bikes')
        .insert({
          bike_code: newBikeForm.bike_code,
          qr_code: qrCode,
          model: newBikeForm.model,
          current_location_name: newBikeForm.current_location_name,
          current_location_amharic: newBikeForm.current_location_amharic || null,
          battery_level: newBikeForm.battery_level,
          status: newBikeForm.status,
          total_rides: 0,
          total_distance_km: 0.00
        })
        .select()
        .single();

      if (error) throw error;

      // Refresh bikes list
      await fetchBikes();

      // Reset form and close modal
      setNewBikeForm({
        bike_code: '',
        model: 'Urban Classic',
        current_location_name: '',
        current_location_amharic: '',
        battery_level: 100,
        status: 'available'
      });
      setShowAddModal(false);

      alert('Bike created successfully!');
    } catch (error) {
      console.error('Error creating bike:', error);
      alert('Failed to create bike. Please check if bike code already exists.');
    }
  };

  const updateBikeStatus = async (bikeId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bikes')
        .update({ status: newStatus })
        .eq('id', bikeId);

      if (error) throw error;

      // Update local state
      setBikes(prev => prev.map(bike => 
        bike.id === bikeId ? { ...bike, status: newStatus as any } : bike
      ));

      alert(`Bike status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating bike status:', error);
      alert('Failed to update bike status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in_use': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBatteryColor = (battery: number) => {
    if (battery > 60) return 'text-green-600';
    if (battery > 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredBikes = bikes.filter(bike => {
    const matchesSearch = bike.bike_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bike.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (bike.current_location_name && bike.current_location_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || bike.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats from real data
  const bikeStats = {
    available: bikes.filter(b => b.status === 'available').length,
    inUse: bikes.filter(b => b.status === 'in_use').length,
    maintenance: bikes.filter(b => b.status === 'maintenance').length,
    lowBattery: bikes.filter(b => b.battery_level < 30).length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-text-secondary">Loading bikes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Bike Management</h1>
          <p className="text-text-secondary mt-2">Manage and monitor all bikes in the fleet</p>
          <p className="text-text-secondary text-sm mt-1">🇪🇹 Total Bikes: {bikes.length} • Real-time data from Supabase</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <button
            onClick={fetchBikes}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Bike</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search bikes by code, model, or location..."
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
              <option value="available">Available</option>
              <option value="in_use">In Use</option>
              <option value="maintenance">Maintenance</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards with Real Data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Bike className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Available</p>
              <p className="text-xl font-bold text-text-primary">{bikeStats.available}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">In Use</p>
              <p className="text-xl font-bold text-text-primary">{bikeStats.inUse}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Wrench className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Maintenance</p>
              <p className="text-xl font-bold text-text-primary">{bikeStats.maintenance}</p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Battery className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-text-secondary text-sm">Low Battery</p>
              <p className="text-xl font-bold text-text-primary">{bikeStats.lowBattery}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bikes Table with Real Data */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Bike Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Battery
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Maintenance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Total Rides
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBikes.map((bike) => (
                <tr key={bike.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-text-primary">{bike.bike_code}</div>
                      <div className="text-sm text-text-secondary">{bike.model}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={bike.status}
                      onChange={(e) => updateBikeStatus(bike.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(bike.status)}`}
                    >
                      <option value="available">Available</option>
                      <option value="in_use">In Use</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Battery className={`w-4 h-4 ${getBatteryColor(bike.battery_level)}`} />
                      <span className={`text-sm font-medium ${getBatteryColor(bike.battery_level)}`}>
                        {bike.battery_level}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4 text-text-secondary" />
                      <div>
                        <span className="text-sm text-text-primary">{bike.current_location_name}</span>
                        {bike.current_location_amharic && (
                          <div className="text-xs text-text-secondary">{bike.current_location_amharic}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    {bike.last_maintenance || 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary font-medium">
                    {bike.total_rides}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-red-500" />
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
        
        {filteredBikes.length === 0 && (
          <div className="text-center py-8 text-text-secondary">
            No bikes found matching your criteria.
          </div>
        )}
      </div>

      {/* Add Bike Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-text-primary">Add New Bike</h3>
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
                    Bike Code *
                  </label>
                  <input
                    type="text"
                    value={newBikeForm.bike_code}
                    onChange={(e) => setNewBikeForm(prev => ({ ...prev, bike_code: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="BK-0001"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Model *
                  </label>
                  <select
                    value={newBikeForm.model}
                    onChange={(e) => setNewBikeForm(prev => ({ ...prev, model: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="Urban Classic">Urban Classic</option>
                    <option value="City Cruiser">City Cruiser</option>
                    <option value="Electric Pro">Electric Pro</option>
                    <option value="EcoBike Standard">EcoBike Standard</option>
                    <option value="EcoBike Pro">EcoBike Pro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Battery Level
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newBikeForm.battery_level}
                    onChange={(e) => setNewBikeForm(prev => ({ ...prev, battery_level: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <p className="text-xs text-text-secondary mt-1">Battery percentage (0-100)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Initial Status
                  </label>
                  <select
                    value={newBikeForm.status}
                    onChange={(e) => setNewBikeForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="available">Available</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-text-primary">Location Information</h4>
                
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Current Location (English) *
                  </label>
                  <select
                    value={newBikeForm.current_location_name}
                    onChange={(e) => {
                      const location = e.target.value;
                      let amharic = '';
                      switch (location) {
                        case 'Meskel Square': amharic = 'መስቀል አደባባይ'; break;
                        case 'Bole Airport': amharic = 'ቦሌ አየር ማረፊያ'; break;
                        case 'Piazza': amharic = 'ፒያሳ'; break;
                        case 'Mexico Square': amharic = 'ሜክሲኮ አደባባይ'; break;
                        case 'Mercato': amharic = 'መርካቶ'; break;
                        case 'Unity Park': amharic = 'አንድነት ፓርክ'; break;
                        case 'Arat Kilo': amharic = 'አራት ኪሎ'; break;
                        case 'Kazanchis': amharic = 'ካዛንቺስ'; break;
                        case 'Stadium': amharic = 'ስታዲየም'; break;
                        case 'Legehar': amharic = 'ለገሃር'; break;
                        default: amharic = '';
                      }
                      setNewBikeForm(prev => ({ 
                        ...prev, 
                        current_location_name: location,
                        current_location_amharic: amharic
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select Location</option>
                    <option value="Meskel Square">Meskel Square</option>
                    <option value="Bole Airport">Bole Airport</option>
                    <option value="Piazza">Piazza</option>
                    <option value="Mexico Square">Mexico Square</option>
                    <option value="Mercato">Mercato</option>
                    <option value="Unity Park">Unity Park</option>
                    <option value="Arat Kilo">Arat Kilo</option>
                    <option value="Kazanchis">Kazanchis</option>
                    <option value="Stadium">Stadium</option>
                    <option value="Legehar">Legehar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Current Location (Amharic)
                  </label>
                  <input
                    type="text"
                    value={newBikeForm.current_location_amharic}
                    onChange={(e) => setNewBikeForm(prev => ({ ...prev, current_location_amharic: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Location in Amharic"
                  />
                  <p className="text-xs text-text-secondary mt-1">Auto-filled for common locations</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h5 className="font-medium text-blue-800 mb-2">🇪🇹 Ethiopian Locations</h5>
                  <p className="text-sm text-blue-700">
                    Select from popular Addis Ababa locations. The Amharic name will be automatically filled for common locations.
                  </p>
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
                onClick={createBike}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Add Bike</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BikeManagement;