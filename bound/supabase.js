const supabaseUrl='http://127.0.0.1:54321';
const supabaseAnonKey='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

import { createClient } from '@supabase/supabase-js';
const supabase = createClient(supabaseUrl, supabaseAnonKey);


export default supabase;