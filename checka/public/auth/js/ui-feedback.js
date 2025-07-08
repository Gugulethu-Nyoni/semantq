// ui/js/ui-feedback.js

export const showFieldError = (input, message) => {
  const errorEl = document.createElement('p');
  errorEl.className = 'input-error text-red-600 text-sm mt-1';
  errorEl.textContent = message;
  input.classList.add('border-red-500');
  input.insertAdjacentElement('afterend', errorEl);
};

export const clearFieldErrors = (form) => {
  form.querySelectorAll('.input-error').forEach(el => el.remove());
  form.querySelectorAll('input').forEach(input => input.classList.remove('border-red-500'));
};

export const showAlert = (target, message, type, options = {}) => {
  const container = options.container || target;
  container.querySelectorAll('.form-alert').forEach(el => el.remove());

  const alertEl = document.createElement('div');
  alertEl.className = `form-alert auth-feedback ${type === 'error' ? 'error' : 'success'}`;
  alertEl.textContent = message;

  container.prepend(alertEl);

  if (options.dismissAfter) {
    setTimeout(() => alertEl.remove(), options.dismissAfter);
  }

  return alertEl;
};

