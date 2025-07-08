import { showFieldError, clearFieldErrors, showAlert } from './ui-feedback.js';
import AppConfig from './config.js';

//console.log(AppConfig.BASE_URL);

// Password visibility toggle
document.querySelector('.password-toggle').addEventListener('click', function() {
  const passwordInput = document.querySelector('#signup-password');
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
});

// Form submit handler
const signupForm = document.getElementById('signupForm');

const validateForm = (form) => {
  const inputs = form.querySelectorAll('input[required]');
  let isValid = true;

  clearFieldErrors(form);

  inputs.forEach(input => {
    if (!input.value.trim()) {
      showFieldError(input, 'This field is required');
      isValid = false;
    } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      showFieldError(input, 'Please enter a valid email');
      isValid = false;
    } else if (input.type === 'password' && input.value.length < 8) {
      showFieldError(input, 'Password must be at least 8 characters');
      isValid = false;
    }
  });

  return isValid;
};

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!validateForm(signupForm)) return;

  const formData = new FormData(signupForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch(`${AppConfig.BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || 'Signup failed.');

   // Show persistent success message outside form, then hide form
showAlert(signupForm, 'Signup successful! Please check your email to confirm your account.', 'success', {
  container: document.getElementById('signup-feedback'),
  dismissAfter: null
});


    signupForm.classList.add('hidden');

  } catch (err) {
    showAlert(signupForm, err.message, 'error', {
      container: document.getElementById('signup-feedback'),
      dismissAfter: 5000
    });
  }
});

}
