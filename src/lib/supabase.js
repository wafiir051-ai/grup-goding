import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const noop = {
  from: () => ({
    select: () => ({
      single: () => Promise.resolve({ data: null, error: null }),
      order: () => Promise.resolve({ data: [], error: null }),
      eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
    }),
    eq: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
    order: () => Promise.resolve({ data: [], error: null }),
    insert: () => Promise.resolve({ data: null, error: null }),
    upsert: () => Promise.resolve({ data: null, error: null }),
  }),
  auth: {
    signIn: () => Promise.resolve({ error: null }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getSession: () => Promise.resolve({ data: { session: null } }),
  },
  channel: () => ({ on: () => ({ subscribe: () => {} }) }),
};

export const supabase = (supabaseUrl && supabaseAnonKey && supabaseAnonKey.startsWith('eyJ'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : noop;
