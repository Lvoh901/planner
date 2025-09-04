import { createClient } from "@supabase/supabase-js";

const VITE_SUPABASE_URL='https://qttkwpzpmqymfyxseejy.supabase.co';
const VITE_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0dGt3cHpwbXF5bWZ5eHNlZWp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY4MjE3NjgsImV4cCI6MjA3MjM5Nzc2OH0.T1JAKqdHlqIVd8IoCQwQt2CaAvGBT80XNCCfaN_ag4A';

// For Vite + TypeScript, environment variables must be prefixed with VITE_
// and are always strings or undefined.
const supabaseUrl = VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;