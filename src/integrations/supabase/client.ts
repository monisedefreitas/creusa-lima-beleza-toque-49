
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://dhvxrgvhtqnqgslalxxd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRodnhyZ3ZodHFucWdzbGFseHhkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTUyMTksImV4cCI6MjA2ODE5MTIxOX0.Bdow1xtdY3gib14vFEz5ajo1Copim-LSfwQMHnp2luI";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
