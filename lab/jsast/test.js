import * as acorn from "acorn";
import * as escodegen from "escodegen";

// Test JavaScript code to parse and regenerate
const testCode = `
import AppConfig from '/public/auth/js/config.js';
import { smQL, Form, Notification } from '@semantq/ql';
import Formique from '@formique/semantq';

// Configuration
const baseUrl = AppConfig.BASE_URL;
const baseOrigin = new URL(baseUrl).origin;
const YOCO_ENDPOINT = \`\${baseOrigin}/yoco/checkout\`;

async function checkCustomerAddresses(userId) {
  console.log(\`Checking shipping address for user ID: \${userId}\`);

  try {
    const response = await api.get(\`/user/users/\${userId}/customer\`);

    if (response._ok) {
      if (response.error) {
        console.log(\`✅ API request successful, but no address found: \${response.error}\`);
        return false;
      }
      console.log('✅ API request successful and a valid address was found!');
      console.log('Shipping address:', response);
      return true;
    }
    
    console.error(\`❌ API request failed with status \${response._status}\`);
    console.error('API Response:', response);
    return false;
  } catch (error) {
    console.error('An unrecoverable error occurred:', error);
    return false;
  }
}

$onMount(async () => {
  const canCheckOut = await checkCustomerAddresses(user.id);

  if (canCheckOut) {
    canCheckOutStatus = '';
  } else {
    const btn = document.getElementById('yoco-checkout');
    if (btn) {
      btn.disabled = true;
      btn.setAttribute('title', 'You need to update your address first to checkout');
    }

    const addressSchema = [
      ['text', 'street', 'Street', { required: true }],
      ['text', 'city', 'City', { required: true }],
      ['text', 'state', 'State', { required: true }],
      ['text', 'postalCode', 'Postal Code', { required: true }],
      ['singleSelect', 'country', 'country', { required: true }, {}, [
        { value: 'south_africa', label: 'South Africa', selected: true }
      ]],
      ['submit', 'submit', 'Submit']
    ];

    const form = new Formique(
      addressSchema,
      { theme: 'light' },
      { action: '#', method: 'POST', id: 'address-form' }
    );

    const addressFormHandler = new Form('address-form');
    addressFormHandler.form.addEventListener('form:captured', async (e) => {
      try {
        console.log('Imported user object:', user);
        console.log('User ID:', user?.id);
        console.log('ENDPOINT', \`/user/users/\${user.id}/shipping\`);

        const response = await api.put(\`/user/users/\${user.id}/shipping\`, e.detail);

        Notification.show({
          type: 'success',
          message: 'Address updated successfully!',
          duration: 3000
        });

        e.target.reset();
      } catch (error) {
        console.error('Address updated failed:', error);
        Notification.show({
          type: 'error',
          message: \`Address updated failed: \${error.message}\`,
          duration: 5000
        });
      }
    });
  }
});

// Cart Management
const cart = JSON.parse(localStorage.getItem('cartiqueCart')) || [];
const subtotal = cart.reduce((sum, item) => {
  const price = parseFloat(item.sale_price || item.price);
  const qty = parseInt(item.cart_quantity) || 1;
  return sum + (price * qty);
}, 0);

// UI Functions
const showLoader = (button) => {
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  button.disabled = true;
};

const showError = (button, message) => {
  button.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error - Try Again';
  button.disabled = false;
  alert(message);
};

const resetButton = (button) => {
  button.innerHTML = '<i class="fas fa-lock"></i> Secure Checkout';
  button.disabled = false;
};

// Checkout Handler
async function initiateYocoCheckout(event) {
  event.preventDefault();
  const checkoutBtn = event.target.closest('#yoco-checkout') || event.target;

  if (subtotal <= 0) {
    showError(checkoutBtn, "Your cart is empty. Please add items before checkout.");
    return;
  }

  const customerId = 1; // Should be replaced with actual user ID

  showLoader(checkoutBtn);

  try {
    const checkoutPayload = {
      customerId: customerId,
      amount: Math.round(subtotal * 100),
      cart: cart,
      metadata: {
        cartItems: cart.map(item => item.id).join(','),
        itemCount: cart.length
      }
    };

    const response = await fetch(YOCO_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutPayload)
    });

    if (!response.ok) throw new Error((await response.json()).error || 'Payment gateway error');
    
    const { redirectUrl } = await response.json();
    if (redirectUrl) window.location.href = redirectUrl;
    else throw new Error('No redirect URL received');

  } catch (error) {
    console.error('Checkout Error:', error);
    showError(checkoutBtn, error.message);
    setTimeout(() => resetButton(checkoutBtn), 3000);
  }
}

$onMount(() => {
  const checkoutBtn = document.getElementById('yoco-checkout');
  if (checkoutBtn) checkoutBtn.addEventListener('click', initiateYocoCheckout);

  const cartIndicator = document.getElementById('cart-indicator');
  if (cartIndicator) cartIndicator.textContent = cart.length;
});
`;

// Parse and regenerate the code
function parseAndRegenerate(code) {
  const ast = acorn.parse(code, {
    ecmaVersion: 2022,
    sourceType: "module",
    allowAwaitOutsideFunction: true,
  });

  return escodegen.generate(ast, {
    format: {
      indent: { style: "  ", adjustMultilineComment: true },
      quotes: "auto",
      escapeless: true,
    },
  });
}

// Execute and output
const regeneratedCode = parseAndRegenerate(testCode);
console.log(regeneratedCode);