// packages/semantq-api/services/apiProxyService.js
import axios from 'axios';

const apiProxyService = {
  /**
   * Makes an outbound API call.
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE, etc.)
   * @param {string} url - The full URL of the external API endpoint.
   * @param {object} [data] - Request body for POST/PUT requests.
   * @param {object} [headers] - Additional headers to send with the request.
   * @returns {Promise<object>} - The response data from the external API.
   */
  async makeOutboundCall(method, url, data = null, headers = {}) {
    try {
      const response = await axios({
        method: method,
        url: url,
        data: data,
        headers: headers,
        // You might want to add timeout, proxy settings, etc. here
        validateStatus: function (status) {
          return status >= 200 && status < 500; // Resolve only if status is less than 500
        },
      });

      return {
        status: response.status,
        data: response.data,
        headers: response.headers,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Axios error (e.g., network error, 4xx/5xx status that wasn't caught by validateStatus)
        console.error(`Error proxying API call to ${url}:`, error.message);
        return {
          status: error.response ? error.response.status : 500,
          data: error.response ? error.response.data : { message: 'Proxy request failed due to network error or upstream issue.' },
          headers: error.response ? error.response.headers : {},
        };
      } else {
        // Other unexpected errors
        console.error('Unexpected error in apiProxyService:', error);
        throw new Error('An unexpected error occurred during proxying.');
      }
    }
  },
};

export default apiProxyService;