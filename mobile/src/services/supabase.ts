import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import { config } from '../config/env';

export const supabase = createClient(config.supabase.url, config.supabase.anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Database types
export interface User {
  id: string;
  email: string;
  phone: string;
  full_name: string;
  full_name_amharic?: string;
  verified: boolean;
  wallet_balance: number;
  total_rides: number;
  preferred_language: 'en' | 'am' | 'or';
  status: 'active' | 'suspended' | 'pending';
  user_role: string;
  user_type: string;
  subscription_type: string;
  subscription_expires_at?: string;
  organization_id?: string;
  student_id?: string;
  employee_id?: string;
  created_at: string;
  last_active: string;
}

export interface Bike {
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
  latitude?: number;
  longitude?: number;
}

export interface Trip {
  id: string;
  user_id: string;
  bike_id: string;
  start_time: string;
  end_time?: string;
  start_location_name?: string;
  end_location_name?: string;
  distance_km: number;
  duration_minutes?: number;
  cost_etb: number;
  payment_method?: string;
  payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
  status: 'active' | 'completed' | 'cancelled';
  bikes?: {
    bike_code: string;
    model: string;
  };
}

export interface Payment {
  id: string;
  user_id: string;
  trip_id?: string;
  amount_etb: number;
  payment_method: 'telebirr' | 'cbe_birr' | 'dashen_bank' | 'awash_bank' | 'cash' | 'wallet';
  transaction_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  payment_type: 'ride' | 'wallet_topup' | 'refund';
  created_at: string;
}

export interface Location {
  id: string;
  name: string;
  name_amharic: string;
  district: string;
  district_amharic?: string;
  latitude: number;
  longitude: number;
  is_popular: boolean;
  bike_capacity: number;
  current_bikes: number;
  demand_level: 'low' | 'medium' | 'high';
}