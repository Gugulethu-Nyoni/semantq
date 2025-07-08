// DOM Elements
const forms = {
  signup: document.getElementById('signup-form'),
  login: document.getElementById('login-form'),
  forgotPassword: document.getElementById('forgot-password-form'),
  resetPassword: document.getElementById('reset-password-form')
};


// Toggle forms
document.getElementById('show-signup')?.addEventListener('click', (e) => {
  e.preventDefault();
  forms.login.classList.add('hidden');
  forms.signup.classList.remove('hidden');
});

document.getElementById('show-login')?.addEventListener('click', (e) => {
  e.preventDefault();
  forms.signup.classList.add('hidden');
  forms.login.classList.remove('hidden');
});


// Form Handlers
const handleAuth = async (form, endpoint) => {
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.textContent;

  try {
    if (!validateForm(form, endpoint)) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner"></span> Processing...';

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData);

    if (window.csrfToken) {
      payload._csrf = window.csrfToken;
    }

    const res = await fetch(`/auth/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      const errorMessage = data.error?.message ||
        data.message ||
        data.error ||
        `Request failed with status ${res.status}`;
      throw new Error(errorMessage);
    }

    // ✅ Success handling
    if (endpoint === 'login') {
      // Store JWT token in localStorage
      if (data.data?.token) {
        localStorage.setItem('authToken', data.data.token);
      }

      // Redirect to dashboard
      window.location.href = '/dashboard';
      return;
    }

    if (data.redirect) {
      window.location.href = data.redirect;
    } else if (data.message) {
      showAlert(form, data.message, 'success');
      if (endpoint === 'signup') {
        form.reset();
      }
    }

  } catch (err) {
    console.error(`Auth error (${endpoint}):`, err);
    showAlert(form, err.message, 'error');

    if (window.grecaptcha && endpoint === 'signup') {
      grecaptcha.reset();
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
};






// Form Validation
const validateForm = (form, endpoint) => {
  const inputs = form.querySelectorAll('input[required]');
  let isValid = true;
  
  // Clear previous errors
  form.querySelectorAll('.input-error').forEach(el => el.remove());
  
  // Validate each required field
  inputs.forEach(input => {
    if (!input.value.trim()) {
      showFieldError(input, 'This field is required');
      isValid = false;
    } else if (input.type === 'email' && !isValidEmail(input.value)) {
      showFieldError(input, 'Please enter a valid email');
      isValid = false;
    } else if (input.type === 'password' && input.value.length < 8) {
      showFieldError(input, 'Password must be at least 8 characters');
      isValid = false;
    }
  });
  
  // Special validation for signup
  if (endpoint === 'signup') {
    const password = form.querySelector('#password');
    const confirmPassword = form.querySelector('#confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      showFieldError(confirmPassword, 'Passwords do not match');
      isValid = false;
    }
  }
  
  return isValid;
};

// Helper: Email validation
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Helper: Show field-specific error
const showFieldError = (input, message) => {
  const errorEl = document.createElement('p');
  errorEl.className = 'input-error text-error text-sm mt-1';
  errorEl.textContent = message;
  input.classList.add('border-error');
  input.insertAdjacentElement('afterend', errorEl);
  
  // Clear error on input
  input.addEventListener('input', () => {
    errorEl.remove();
    input.classList.remove('border-error');
  }, { once: true });
};

// Alert System
const showAlert = (form, message, type) => {
  // Remove existing alerts
  form.querySelectorAll('.form-alert').forEach(el => el.remove());
  
  const alertEl = document.createElement('div');
  alertEl.className = `form-alert p-3 mb-4 rounded text-${type} bg-${type}-light`;
  alertEl.innerHTML = `
    <div class="flex items-center">
      <span class="mr-2">${type === 'error' ? '⚠️' : '✓'}</span>
      <span>${message}</span>
    </div>
  `;
  
  form.prepend(alertEl);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => {
    alertEl.classList.add('opacity-0', 'transition-opacity', 'duration-300');
    setTimeout(() => alertEl.remove(), 300);
  }, 5000);
};

// Attach Form Events
Object.entries(forms).forEach(([key, form]) => {
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      handleAuth(form, key);
    });
    
    // Add input clearing for better UX
    form.querySelectorAll('input').forEach(input => {
      input.addEventListener('focus', () => {
        if (input.value && input.type !== 'password') {
          input.select();
        }
      });
    });
  }
});

// Password visibility toggle (if you have eye icons)
document.querySelectorAll('.password-toggle').forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    const input = toggle.previousElementSibling;
    const isPassword = input.type === 'password';
    
    input.type = isPassword ? 'text' : 'password';
    toggle.innerHTML = isPassword ? '👁️' : '👁️‍🗨️';
    toggle.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  });
});