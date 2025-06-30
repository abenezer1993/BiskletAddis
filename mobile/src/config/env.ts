import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  GOOGLE_MAPS_API_KEY,
} from '@env';

export const config = {
  supabase: {
    url: SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: SUPABASE_ANON_KEY || 'your-anon-key-here',
  },
  googleMaps: {
    apiKey: GOOGLE_MAPS_API_KEY || 'your-google-maps-api-key',
  },
};