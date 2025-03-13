import Router from './core_modules/routing/router.js';




const toggleButton = document.getElementById('toggle-theme');
if (toggleButton) {
  // Adding the event listener for the 'click' event
  toggleButton.addEventListener('click', toggleTheme); 
}

// Toggle dropdown menu
    function toggleDropdown() {
      const dropdown = document.getElementById("dropdown");
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    }

    // Close dropdown when clicking outside
    window.onclick = function(event) {
      if (!event.target.matches('.profile img')) {
        const dropdown = document.getElementById("dropdown");
        if (dropdown.style.display === "block") {
          dropdown.style.display = "none";
        }
      }
    };

    // Toggle sidebar collapse
    function toggleSidebar() {
      const sidebar = document.getElementById("sidebar");
      sidebar.classList.toggle("collapsed");
    }

    // Toggle dark/light theme
    function toggleTheme() {
      const body = document.body;
      const themeToggle = document.querySelector(".theme-toggle");
      body.classList.toggle("light-theme");

      // Change the icon based on the theme
      if (body.classList.contains("light-theme")) {
        themeToggle.textContent = "☀️"; // Sun icon for light theme
      } else {
        themeToggle.textContent = "🌙"; // Moon icon for dark theme
      }
    }