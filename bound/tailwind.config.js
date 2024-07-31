/** @type {import('tailwindcss').Config} */
export default {
  content: [

// For development
    "./src/**/*.{html,js}",

    // For production
    "./build/**/*.{html,js}",

    ],
  theme: {
    extend: {
      colors: {
        // Add custom colors to your theme
"primary-color": "#0C1A53",
      },
    },
  },
  plugins: [
    // Add any Tailwind CSS plugins you want to use
// For example, you can add `@tailwindcss/forms` plugin for styling forms
//import("@tailwindcss/forms"),
  ],
};
