import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config(); // Load environment variables

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY; // Store in .env file
const BASE_URL = process.env.BASE_URL; // Dynamic base URL from environment

const productService = {
  // The `buy` function to handle the checkout process
  async buy({ amount, currency, userId, productDetails }) {
    try {
      // Create the checkout
      const response = await axios.post(
        "https://payments.yoco.com/api/checkouts",
        {
          amount, // Amount in cents
          currency, // "ZAR" for South African Rand
          successUrl: `${BASE_URL}/products/buy/success?userId=${userId}`, // Use dynamic base URL
          cancelUrl: `${BASE_URL}/products/buy/cancel`, // Use dynamic base URL
          metadata: {
            userId, // Save the userId in the metadata for tracking
            productDetails: JSON.stringify(productDetails), // Optionally save product details in metadata
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${YOCO_SECRET_KEY}`,
          },
        }
      );

      // Return checkout details including the redirect URL
      console.log("YOCO Response",response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating checkout with Yoco:', error);
      throw new Error(error.message);
    }
  },
};

export { productService };
