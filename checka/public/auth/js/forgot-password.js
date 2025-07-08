import AppConfig from './config.js';

console.log('✅ Forgot Password script initialized');

// Constants for API path
const PATHS = {
  FORGOT_PASSWORD_API: `${AppConfig.BASE_URL}/forgot-password`,
  LOGIN_PAGE: '/login'
};

// DOM Elements
const form = document.getElementById('forgot-password-form');
const emailInput = document.getElementById('reset-email');
const statusDiv = document.getElementById('auth-status');
const submitBtn = form.querySelector('button[type="submit"]');

// UI Utilities
function showStatus(message, isError = false) {
  console.log(`UI Status: ${message}`);
  statusDiv.textContent = message;
  statusDiv.className = isError ? 'error' : 'success';
  statusDiv.classList.remove('hidden');
}

function setLoadingState(isLoading) {
  submitBtn.disabled = isLoading;
  submitBtn.textContent = isLoading ? 'Sending...' : 'Send Reset Link';
  form.classList.toggle('loading', isLoading);
}

// Form Submission Handler
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('📝 Forgot Password form submission started');
  setLoadingState(true);
  statusDiv.classList.add('hidden');

  const email = emailInput.value.trim();

  if (!email) {
    console.log('❌ Validation failed - email missing');
    showStatus('Please enter your email address.', true);
    setLoadingState(false);
    return;
  }

  if (!/\S+@\S+\.\S+/.test(email)) {
    console.log('❌ Validation failed - invalid email format');
    showStatus('Please enter a valid email address.', true);
    setLoadingState(false);
    return;
  }

  showStatus('Sending reset link...');
  console.log('📧 Attempting to send password reset link for:', email);

  try {
    const response = await fetch(PATHS.FORGOT_PASSWORD_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    console.log('Backend response:', data);

    if (response.ok) {
      showStatus(data.message || 'If an account with that email exists, a password reset link has been sent.');
      emailInput.value = '';
    } else {
      showStatus(data.message || 'Failed to send reset link. Please try again.', true);
    }

  } catch (err) {
    console.error('❌ Forgot password request error:', err);
    showStatus('An unexpected error occurred. Please try again later.', true);
  } finally {
    setLoadingState(false);
  }
});

// Auto-focus email field on load
emailInput.focus();
console.log('📄 Forgot Password form ready');
