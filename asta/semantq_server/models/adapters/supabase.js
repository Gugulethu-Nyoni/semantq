import { createClient } from '@supabase/supabase-js';

let supabaseClient = null;

const supabaseAdapter = {
  async init(dbConfig = {}) { // 👈 Default to empty object
    if (supabaseClient) return supabaseClient;

    const supabaseUrl = dbConfig.url || process.env.SUPABASE_URL;
    const supabaseKey = dbConfig.key || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and Key must be provided in config or environment variables.');
    }

    try {
      supabaseClient = createClient(supabaseUrl, supabaseKey);
      console.log('✅ Supabase client initialized successfully!');
      return supabaseClient;
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error);
      throw error;
    }
  },

  from(tableName) {
    if (!supabaseClient) {
      throw new Error('Supabase client not initialized. Call init() first.');
    }
    return supabaseClient.from(tableName);
  }
};

export default supabaseAdapter;
