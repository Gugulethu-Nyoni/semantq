import AppConfig from './config.js';

console.log('✅ Reset Password script initialized');

// Constants
const PATHS = {
  RESET_PASSWORD_API: `${AppConfig.BASE_URL}/reset-password`,
  LOGIN_PAGE: 'login'
};

// DOM Elements
const form = document.getElementById('reset-password-form');
const newPasswordField = document.getElementById('new-password');
const confirmPasswordField = document.getElementById('confirm-password');
const statusDiv = document.getElementById('auth-status');
const submitBtn = form.querySelector('button[type="submit"]');

let resetToken = null;

// UI Utilities
function showStatus(message, isError = false) {
  console.log(`UI Status: ${message}`);
  statusDiv.textContent = message;
  statusDiv.className = isError ? 'error' : 'success';
  statusDiv.classList.remove('hidden');
}

function setLoadingState(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? 'Resetting...' : 'Reset Password';
  form.classList.toggle('loading', isLoading);
}

// Extract token from URL
function extractTokenFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  if (!token) {
    showStatus('Password reset link is invalid or expired. Please request a new one.', true);
    console.error('❌ Token not found in URL.');
    setLoadingState(true);
  } else {
    resetToken = token;
    console.log('✅ Token extracted from URL.');
  }
}

// Form Submission Handler
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('📝 Reset Password form submission started');
  setLoadingState(true);
  statusDiv.classList.add('hidden');

  if (!resetToken) {
    showStatus('Missing reset token. Please use the link from your email.', true);
    setLoadingState(false);
    return;
  }

  const newPassword = newPasswordField.value;
  const confirmPassword = confirmPasswordField.value;

  if (!newPassword || !confirmPassword) {
    showStatus('Please fill in both password fields.', true);
    setLoadingState(false);
    return;
  }

  if (newPassword !== confirmPassword) {
    showStatus('Passwords do not match.', true);
    setLoadingState(false);
    return;
  }

  if (newPassword.length < 8) {
    showStatus('Password must be at least 8 characters long.', true);
    setLoadingState(false);
    return;
  }

  showStatus('Attempting to reset password...');
  console.log('🔐 Sending password reset request...');

  try {
    const response = await fetch(PATHS.RESET_PASSWORD_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: resetToken, newPassword })
    });

    const data = await response.json();
    console.log('Backend response:', data);

    if (response.ok) {
      showStatus(data.message || 'Your password has been successfully reset. Redirecting to login...');
      newPasswordField.value = '';
      confirmPasswordField.value = '';
      setTimeout(() => {
        window.location.replace(PATHS.LOGIN_PAGE);
      }, 2000);
    } else {
      showStatus(data.message || 'Failed to reset password. Please try again.', true);
    }

  } catch (err) {
    console.error('❌ Password reset request error:', err);
    showStatus('An unexpected error occurred. Please try again later.', true);
  } finally {
    setLoadingState(false);
  }
});

// On page load:
extractTokenFromUrl();
newPasswordField.focus();
console.log('📄 Reset Password form ready');
