import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Public client (for frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client (for server-side operations)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Types
export type City = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  zoom_level: number;
  created_at: string;
};

export type SiteStatus = 'available' | 'booked' | 'maintenance';
export type SiteType = 'hoarding' | 'unipole' | 'bus_shelter' | 'gantry' | 'wall_painting';

export type Site = {
  id: string;
  city_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  size: string;
  type: SiteType;
  rate_monthly: number;
  rate_yearly: number;
  status: SiteStatus;
  image_url: string | null;
  description: string;
  facing: string;
  traffic_info: string;
  illumination: boolean;
  booked_by: string | null;
  booked_until: string | null;
  created_at: string;
  updated_at: string;
  cities?: City;
};

export type InquiryStatus = 'new' | 'contacted' | 'confirmed' | 'rejected';

export type Inquiry = {
  id: string;
  site_id: string | null;
  client_name: string;
  client_phone: string;
  client_email: string | null;
  message: string | null;
  status: InquiryStatus;
  created_at: string;
  sites?: Site;
};
