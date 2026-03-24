import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://dscyqpakiomrewvhmzpi.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzY3lxcGFraW9tcmV3dmhtenBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyMzM3NDQsImV4cCI6MjA3NzgwOTc0NH0.jx7aJn-Z1zE8IrtlnfASeRCIt5_DQmg35gNGcS9_w_Q";

// Create Supabase client without generic typing for now
// You can add proper Database typing after running migrations
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});
