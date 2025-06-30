import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types (generated from Supabase schema)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          phone: string;
          full_name: string;
          full_name_amharic?: string;
          government_id?: string;
          verified: boolean;
          wallet_balance: number;
          total_rides: number;
          profile_image_url?: string;
          preferred_language: 'en' | 'am' | 'or';
          status: 'active' | 'suspended' | 'pending';
          created_at: string;
          updated_at: string;
          last_active: string;
          user_role: string;
          user_type: string;
          subscription_type: string;
          subscription_expires_at?: string;
          organization_id?: string;
          student_id?: string;
          employee_id?: string;
          permissions: string[];
          emergency_contact?: any;
        };
        Insert: {
          email: string;
          phone: string;
          full_name: string;
          full_name_amharic?: string;
          government_id?: string;
          verified?: boolean;
          wallet_balance?: number;
          total_rides?: number;
          profile_image_url?: string;
          preferred_language?: 'en' | 'am' | 'or';
          status?: 'active' | 'suspended' | 'pending';
          user_role?: string;
          user_type?: string;
          subscription_type?: string;
          subscription_expires_at?: string;
          organization_id?: string;
          student_id?: string;
          employee_id?: string;
          permissions?: string[];
          emergency_contact?: any;
        };
        Update: {
          email?: string;
          phone?: string;
          full_name?: string;
          full_name_amharic?: string;
          government_id?: string;
          verified?: boolean;
          wallet_balance?: number;
          total_rides?: number;
          profile_image_url?: string;
          preferred_language?: 'en' | 'am' | 'or';
          status?: 'active' | 'suspended' | 'pending';
          last_active?: string;
          user_role?: string;
          user_type?: string;
          subscription_type?: string;
          subscription_expires_at?: string;
          organization_id?: string;
          student_id?: string;
          employee_id?: string;
          permissions?: string[];
          emergency_contact?: any;
        };
      };
      bikes: {
        Row: {
          id: string;
          bike_code: string;
          qr_code: string;
          model: string;
          current_location?: any; // PostGIS geography type
          current_location_name?: string;
          current_location_amharic?: string;
          battery_level: number;
          status: 'available' | 'in_use' | 'maintenance' | 'unavailable';
          last_maintenance?: string;
          total_rides: number;
          total_distance_km: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          bike_code: string;
          qr_code: string;
          model: string;
          current_location?: any;
          current_location_name?: string;
          current_location_amharic?: string;
          battery_level?: number;
          status?: 'available' | 'in_use' | 'maintenance' | 'unavailable';
          last_maintenance?: string;
          total_rides?: number;
          total_distance_km?: number;
        };
        Update: {
          bike_code?: string;
          qr_code?: string;
          model?: string;
          current_location?: any;
          current_location_name?: string;
          current_location_amharic?: string;
          battery_level?: number;
          status?: 'available' | 'in_use' | 'maintenance' | 'unavailable';
          last_maintenance?: string;
          total_rides?: number;
          total_distance_km?: number;
        };
      };
      locations: {
        Row: {
          id: string;
          name: string;
          name_amharic: string;
          district: string;
          district_amharic?: string;
          coordinates: any; // PostGIS geography type
          is_popular: boolean;
          bike_capacity: number;
          current_bikes: number;
          demand_level: 'low' | 'medium' | 'high';
          created_at: string;
        };
      };
      trips: {
        Row: {
          id: string;
          user_id: string;
          bike_id: string;
          start_time: string;
          end_time?: string;
          start_location?: any;
          end_location?: any;
          start_location_name?: string;
          end_location_name?: string;
          distance_km: number;
          duration_minutes?: number;
          cost_etb: number;
          payment_method?: string;
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
          status: 'active' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
      };
      payments: {
        Row: {
          id: string;
          user_id: string;
          trip_id?: string;
          amount_etb: number;
          payment_method: 'telebirr' | 'cbe_birr' | 'dashen_bank' | 'awash_bank' | 'cash' | 'wallet';
          transaction_id?: string;
          external_reference?: string;
          status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
          payment_type: 'ride' | 'wallet_topup' | 'refund';
          metadata?: any;
          processed_at?: string;
          created_at: string;
        };
      };
      system_alerts: {
        Row: {
          id: string;
          alert_type: 'low_battery' | 'maintenance_due' | 'high_demand' | 'system_error' | 'payment_issue' | 'holiday_preparation';
          title: string;
          message: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          entity_type?: 'bike' | 'user' | 'location' | 'payment' | 'system';
          entity_id?: string;
          is_resolved: boolean;
          resolved_at?: string;
          resolved_by?: string;
          created_at: string;
        };
      };
      ethiopian_holidays: {
        Row: {
          id: string;
          name: string;
          name_amharic: string;
          date: string;
          holiday_type: 'religious' | 'cultural' | 'national';
          description?: string;
          impact_on_operations?: string;
          is_recurring: boolean;
          created_at: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          name_amharic?: string;
          organization_type: 'corporate' | 'educational' | 'government' | 'partner' | 'ngo';
          contact_email: string;
          contact_phone: string;
          address?: string;
          address_amharic?: string;
          contract_start_date?: string;
          contract_end_date?: string;
          discount_rate: number;
          monthly_credit_limit: number;
          is_active: boolean;
          metadata?: any;
          created_at: string;
          updated_at: string;
        };
      };
      user_permissions: {
        Row: {
          id: string;
          user_id: string;
          permission_name: string;
          resource_type?: string;
          resource_id?: string;
          granted_by: string;
          granted_at: string;
          expires_at?: string;
          is_active: boolean;
        };
      };
      staff_schedules: {
        Row: {
          id: string;
          staff_id: string;
          shift_start: string;
          shift_end: string;
          assigned_area?: string;
          assigned_area_amharic?: string;
          shift_type?: 'maintenance' | 'redistribution' | 'charging' | 'inspection' | 'support';
          status: 'scheduled' | 'active' | 'completed' | 'cancelled';
          notes?: string;
          created_at: string;
        };
      };
    };
  };
}

// Helper functions for common database operations
export const dbHelpers = {
  // Users
  async getUsers(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },

  async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // User Permissions
  async getUserPermissions(userId: string) {
    const { data, error } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);
    
    if (error) throw error;
    return data;
  },

  async grantPermission(userId: string, permissionName: string, grantedBy: string, resourceType?: string, expiresAt?: string) {
    const { data, error } = await supabase
      .from('user_permissions')
      .insert({
        user_id: userId,
        permission_name: permissionName,
        resource_type: resourceType,
        granted_by: grantedBy,
        expires_at: expiresAt
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async revokePermission(permissionId: string) {
    const { data, error } = await supabase
      .from('user_permissions')
      .update({ is_active: false })
      .eq('id', permissionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Organizations
  async getOrganizations() {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data;
  },

  // Bikes
  async getBikes(status?: string) {
    let query = supabase
      .from('bikes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  async updateBikeStatus(id: string, status: string, location?: string) {
    const updates: any = { status };
    if (location) updates.current_location_name = location;
    
    const { data, error } = await supabase
      .from('bikes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Trips
  async getTrips(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        users(full_name, full_name_amharic),
        bikes(bike_code, model)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },

  // Payments
  async getPayments(limit = 50, offset = 0) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        users(full_name, full_name_amharic)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
  },

  // Locations
  async getLocations() {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('is_popular', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // System Alerts
  async getSystemAlerts(resolved = false) {
    const { data, error } = await supabase
      .from('system_alerts')
      .select('*')
      .eq('is_resolved', resolved)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async resolveAlert(id: string, resolvedBy: string) {
    const { data, error } = await supabase
      .from('system_alerts')
      .update({
        is_resolved: true,
        resolved_at: new Date().toISOString(),
        resolved_by: resolvedBy
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Ethiopian Holidays
  async getEthiopianHolidays() {
    const { data, error } = await supabase
      .from('ethiopian_holidays')
      .select('*')
      .order('date', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Analytics
  async getDashboardStats() {
    const [
      { count: totalUsers },
      { count: totalBikes },
      { count: activeTrips },
      { data: recentPayments }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('bikes').select('*', { count: 'exact', head: true }),
      supabase.from('trips').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('payments')
        .select('amount_etb')
        .eq('status', 'completed')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    ]);

    const dailyRevenue = recentPayments?.reduce((sum, payment) => sum + payment.amount_etb, 0) || 0;

    return {
      totalUsers: totalUsers || 0,
      totalBikes: totalBikes || 0,
      activeTrips: activeTrips || 0,
      dailyRevenue
    };
  }
};