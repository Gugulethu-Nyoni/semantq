import AppConfig from './config.js';

const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const statusDiv = document.getElementById('auth-status');
    const successActions = document.getElementById('success-actions');
    const errorActions = document.getElementById('error-actions');
    const retryButton = document.getElementById('retry-button');

    function showSuccess(message) {
      statusDiv.innerHTML = `
        <div class="success-icon">✅</div>
        <p>${message}</p>
      `;
      statusDiv.className = 'success';
      successActions.classList.remove('hidden');
    }

    function showError(message) {
      statusDiv.innerHTML = `
        <div class="error-icon">❌</div>
        <p>${message}</p>
      `;
      statusDiv.className = 'error';
      errorActions.classList.remove('hidden');
    }

 function verifyToken() {
  if (!token) {
    showError('Invalid confirmation link');
    return;
  }

  fetch(`${AppConfig.BASE_URL}/confirm`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token })
})
  .then(async (response) => {
    const data = await response.json();
    if (!response.ok) {
      // Handle HTTP errors (4xx, 5xx)
      throw new Error(data.error || 'Request failed');
    }
    return data;
  })
  .then(data => {
    if (data.success) {
      showSuccess(data.message || 'Email verified successfully!');
    } else {
      showError(data.error || 'Email confirmation failed');
    }
  })
  .catch(err => {
    showError(err.message || 'An error occurred. Please try again.');
  });
}



    // Initial verification
    verifyToken();

    // Retry handler
    retryButton.addEventListener('click', () => {
      statusDiv.innerHTML = `
        <div class="spinner"></div>
        <p>Please wait while we try again</p>
      `;
      statusDiv.className = 'loading';
      errorActions.classList.add('hidden');
      verifyToken();
    });