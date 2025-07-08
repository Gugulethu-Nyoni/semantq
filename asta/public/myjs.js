// Config
const API_BASE = 'http://localhost:3003';

const PATHS = {
  DASHBOARD: '/auth/dashboard',
  LOGIN_API: `${API_BASE}/api/login`,
  VALIDATE_SESSION: `${API_BASE}/api/validate-session`
};

console.log('✅ Login script initialized');

// DOM Elements
const form = document.getElementById('login-form');
const statusDiv = document.getElementById('auth-status');
const submitBtn = form.querySelector('button[type="submit"]');

// UI Feedback
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

// Validate session with backend
async function verifySession() {
  console.log('🔒 Verifying session...');
  try {
    const startTime = performance.now();
    const res = await fetch(PATHS.VALIDATE_SESSION, {
      method: 'GET',
      credentials: 'include'
    });
    const duration = (performance.now() - startTime).toFixed(2);
    console.log(`Session check: ${res.status} (${duration}ms)`);

    if (!res.ok) return false;
    const data = await res.json();
    return data.success && data.data?.valid === true;
  } catch (err) {
    console.error('❌ Session validation failed:', err);
    return false;
  }
}

// Safe redirect to dashboard
async function redirectToDashboard() {
  console.log('➡️ Checking dashboard accessibility...');
  try {
    const check = await fetch(PATHS.DASHBOARD, {
      method: 'HEAD',
      credentials: 'include'
    });

    if (!check.ok) throw new Error('Dashboard unreachable');

    console.log('✅ Dashboard reachable. Redirecting...');
    window.location.replace(PATHS.DASHBOARD);
  } catch (err) {
    console.error('❌ Dashboard check failed:', err);
    showStatus('Dashboard is unavailable. Please contact support.', true);
    setLoadingState(false);
  }
}

// Handle form submit
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('📝 Submitting login form');
  setLoadingState(true);

  const email = form.email.value.trim();
  const password = form.password.value;

  if (!email || !password) {
    showStatus('Please enter both email and password.', true);
    setLoadingState(false);
    return;
  }

  showStatus('Authenticating...');
  console.log('🔐 Sending login request...');

  try {
    const loginStart = performance.now();
    const res = await fetch(PATHS.LOGIN_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password })
    });
    const duration = (performance.now() - loginStart).toFixed(2);
    console.log(`Login response: ${res.status} (${duration}ms)`);

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Authentication failed');
    }

    const loginData = await res.json();
    console.log('✅ Login successful:', loginData);

    const sessionValid = await verifySession();
    if (!sessionValid) throw new Error('Session validation failed');

    showStatus('Login successful! Redirecting...');
    setTimeout(redirectToDashboard, 1500);

  } catch (err) {
    console.error('❌ Login error:', err);
    showStatus(err.message || 'Authentication failed. Try again.', true);
    setLoadingState(false);
  }
});

// Autofocus email field
form.email.focus();
console.log('📄 Login form ready');