import AppConfig from './config.js';

console.log('✅ Login script initialized');

// Constants
const PATHS = {
  DASHBOARD: `${AppConfig.DASHBOARD}`,
  LOGIN_API: `${AppConfig.BASE_URL}/login`,
  VALIDATE_SESSION: `${AppConfig.BASE_URL}/validate-session`
};

// DOM Elements
const form = document.getElementById('login-form');
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
  form.classList.toggle('loading', isLoading);
}

// Session Validation
async function verifySession() {
  console.log('🔒 Starting session verification...');
  try {
    const startTime = performance.now();
    const res = await fetch(PATHS.VALIDATE_SESSION, {
      method: 'GET',
      credentials: 'include'
    });
    const duration = (performance.now() - startTime).toFixed(2);

    console.log(`Session verification: ${res.status} (${duration}ms)`);

    if (!res.ok) {
      console.log('❌ Validation failed - response not OK');
      return false;
    }

    const data = await res.json();
    console.log('Validation response:', data);
    return data.success && data.data?.valid === true;

  } catch (err) {
    console.error('❌ Session verification error:', err);
    return false;
  }
}

// Safe Redirect
async function redirectToDashboard() {
  console.log('➡️ Verifying dashboard accessibility...');
  try {
    const check = await fetch(PATHS.DASHBOARD, { 
      method: 'HEAD',
      credentials: 'include'
    });
    
    if (!check.ok) {
      throw new Error(`Dashboard ${PATHS.DASHBOARD} unavailable`);
    }

    console.log('✅ Dashboard verified - redirecting...');
    window.location.replace(PATHS.DASHBOARD);

  } catch (err) {
    console.error('❌ Dashboard redirect failed:', err);
    showStatus(`Dashboard ${PATHS.DASHBOARD} unavailable. Please contact support.`, true);
    setLoadingState(false);
  }
}

// Form Submission Handler
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('📝 Form submission started');
  setLoadingState(true);

  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) {
    console.log('❌ Validation failed - missing fields');
    showStatus('Please enter both email and password.', true);
    setLoadingState(false);
    return;
  }

  showStatus('Authenticating...');
  console.log('🔐 Attempting authentication...');

  try {
    const loginStart = performance.now();
    const loginRes = await fetch(PATHS.LOGIN_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const loginDuration = (performance.now() - loginStart).toFixed(2);

    console.log(`Login response: ${loginRes.status} (${loginDuration}ms)`);

    if (!loginRes.ok) {
      const errorData = await loginRes.json();
      console.error('❌ Login failed:', errorData);
      throw new Error(errorData.message || 'Authentication failed');
    }

    const loginData = await loginRes.json();
    console.log('✅ Auth successful:', loginData);

    console.log('🔍 Verifying session...');
    const isSessionValid = await verifySession();

    if (!isSessionValid) {
      throw new Error('Session validation failed');
    }

    showStatus('Login successful! Redirecting...');
    console.log('➡️ Preparing dashboard redirect');
    setTimeout(redirectToDashboard, 1500);

  } catch (err) {
    console.error('❌ Authentication error:', {
      message: err.message,
      stack: err.stack
    });
    showStatus(err.message || 'Authentication failed. Please try again.', true);
    setLoadingState(false);
  }
});

// Auto-focus email field on load
form.email.focus();
console.log('📄 Login form ready');
