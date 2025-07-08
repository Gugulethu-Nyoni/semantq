// public/dashboard/js/dashboard.js

import AppConfig from '../../auth/js/config.js';

    console.log("dashboard js loaded");


async function fetchUserProfile() {
    console.log('Fetching user profile...');
    try {
        const response = await fetch(`${AppConfig.BASE_URL}/profile`, {
            method: 'GET',
            credentials: 'include' // Important to send the HttpOnly cookie
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data && data.data.profile) {
                console.log('User profile fetched:', data.data.profile);
                displayUserProfile(data.data.profile);
            } else {
                console.error('Failed to fetch user profile: Invalid data format', data);
                document.getElementById('dashboard-data').textContent = 'Failed to load profile.';
            }
        } else {
            const errorData = await response.json();
            console.error('Failed to fetch user profile:', errorData.message || 'Unknown error');
            document.getElementById('dashboard-data').textContent = `Error: ${errorData.message || 'Failed to load profile.'}`;
            // If 401/403, might need to redirect to login
            if (response.status === 401 || response.status === 403) {
                console.log('Session expired or invalid, redirecting to login...');
                window.location.href = '/auth/login';
            }
        }
    } catch (error) {
        console.error('Network error during profile fetch:', error);
        document.getElementById('dashboard-data').textContent = 'Network error loading profile.';
    }
}

function displayUserProfile(profile) {
    const dashboardData = document.getElementById('dashboard-data');
    dashboardData.innerHTML = `
        <!-- <p><strong>Email:</strong> ${profile.email}</p> -->
        <p><strong> Hi </strong> ${profile.name || 'Not set'}</p>
        `;
}

// Function to handle logout (existing, but included for completeness)
async function logout() {
    console.log('Attempting logout...');
    try {
        const response = await fetch(`${AppConfig.BASE_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            console.log('Logout successful. Redirecting to login page.');
            window.location.href = 'login';
        } else {
            const errorData = await response.json();
            console.error('Logout failed:', errorData.message || 'Unknown error');
            alert('Logout failed. Please try again.');
        }
    } catch (error) {
        console.error('Network error during logout:', error);
        alert('A network error occurred during logout. Please check your connection.');
    }
}


// Call fetchUserProfile when the dashboard page loads
//document.addEventListener('DOMContentLoaded', fetchUserProfile);

fetchUserProfile();

// Make logout globally accessible (since it's called from onclick)
window.logout = logout;




