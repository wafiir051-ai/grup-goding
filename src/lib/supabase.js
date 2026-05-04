import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const noop = {
  from: () => ({ select: () => ({ order: () => Promise.resolve({ data: [] }), single: () => Promise.resolve({ data: null }) }) }),
  auth: { getUser: () => Promise.resolve({ data: { user: null } }), getSession: () => Promise.resolve({ data: { session: null } }) }
};

export const supabase = (supabaseUrl && supabaseAnonKey && supabaseAnonKey.startsWith('eyJ'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : noop;
