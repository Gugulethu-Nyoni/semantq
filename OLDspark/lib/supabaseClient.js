// Importing the necessary Supabase package
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project credentials
const SUPABASE_URL = 'https://your-project-id.supabase.co'; // Your Supabase project URL
const SUPABASE_ANON_KEY = 'your-anon-key'; // Your Supabase anonymous key (from the Supabase dashboard)

// Creating the Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
