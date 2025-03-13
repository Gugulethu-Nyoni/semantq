import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import argon2 from 'argon2';

dotenv.config(); // Load environment variables

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const userService = {
  // Create user with hashed password
  async createUser({ first_name, surname, mobile, email, password }) {
    try {

      const referrer = 4; 
      // Step 1: Hash the password using argon2
      const hashedPassword = await argon2.hash(password);

      // Step 2: Fetch referrer data from Supabase (fetch user with given referrer UID)
      const { data: upline, error: uplineError } = await supabase
        .from('users')
        .select('*')
        .eq('uid', referrer) // Assuming `referrer` is the `uid` of the referrer user
        .single();  // Assuming there is only one matching referrer

      if (uplineError) {
        throw new Error(uplineError.message);
      }

      console.log("Upline",upline);

      // Step 3: Set levels based on the referrer
      const upline1 = referrer;
      const upline2 = upline?.level_1;
      const upline3 = upline?.level_2;
      const upline4 = upline?.level_3;
      const upline5 = upline?.level_4;
      const upline6 = upline?.level_5;
      const upline7 = upline?.level_6;
      const upline8 = upline?.level_7;

      // Step 4: Insert user data into the "users" table with hashed password
      const { data, error } = await supabase.from('users').insert([
        {
          access_level: 1,
          first_name,
          surname,
          mobile,
          email,
          password: hashedPassword, // Store hashed password
          member_status: 0,
          level_1: upline1,
          level_2: upline2,
          level_3: upline3,
          level_4: upline4,
          level_5: upline5,
          level_6: upline6,
          level_7: upline7,
          level_8: upline8,
        },
      ]);

      console.log('Insert Response:', data, error); // Log to check for issues

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error creating user:', error); // Log any errors that happen
      throw new Error(error.message);
    }
  },


  async loginUser({ email }) {
  try {
    // Simulate user login for the specific email address
    if (email === 'sparktechs@gmail.com') {
      console.log("Fake login successful for:", email);
      // Return a mock user object (no need to check a database)
      return { id: 1, email, role: 'admin' };
    } else {
      throw new Error('User not found');
    }
  } catch (error) {
    console.error("Error logging in user:", error);  // Log any errors
    throw new Error(error.message);
  }
},



// Get all users from the database
  async getUsers() {
    try {
      const { data, error } = await supabase.from('users').select('*');

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw new Error(error.message);
    }
  },


};

export { userService };
