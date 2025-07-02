// packages/semantq-api/controllers/apiProxyController.js
// (assuming your package directory is named 'semantq-api')

import apiProxyService from '../services/apiProxyService.js';

const apiProxyController = {
  async proxyRequest(req, res) {
    // Destructure 'targetUrl', 'method' (renamed to externalMethod to avoid conflict),
    // and 'payload' from the request body.
    const { targetUrl, method: externalMethod, payload } = req.body;
    const clientHeaders = req.headers; // Get headers from the incoming client request

    // IMPORTANT SECURITY NOTE:
    // This example allows ANY URL to be proxied. In a real application,
    // you MUST implement a whitelist of allowed domains/APIs to prevent
    // your server from being used for malicious purposes (e.g., SSRF attacks).
    if (!targetUrl || typeof targetUrl !== 'string') {
      return res.status(400).json({ success: false, message: 'Invalid or missing targetUrl in request body.' });
    }

    // Determine the final HTTP method for the *outbound* external API call.
    // It defaults to 'GET' if not specified in the body, or uses the method
    // from the incoming request (req.method) if you prefer that as a fallback.
    // I'm explicitly checking for a method from the body first.
    const finalMethod = externalMethod ? String(externalMethod).toUpperCase() : 'GET'; // Default to GET if not provided in body
    const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];
    if (!allowedMethods.includes(finalMethod)) {
      return res.status(400).json({ success: false, message: `Invalid HTTP method '${finalMethod}' specified for external API.` });
    }

    // Filter out headers that might cause issues or are not relevant for the outbound call.
    // Axios usually handles Content-Type and Content-Length correctly based on the data.
    const headersToSend = { ...clientHeaders };
    delete headersToSend['host'];          // Avoids proxying to self
    delete headersToSend['connection'];    // Handled by HTTP agent
    delete headersToSend['user-agent'];    // Axios sets its own
    delete headersToSend['content-length'];// Axios calculates
    delete headersToSend['content-type'];  // Axios sets based on data/if data exists
    // You might also want to delete authorization headers if they are for your proxy,
    // not for the external API, or if you will add a new auth header for the external API.

    try {
      // Make the outbound API call using the determined method and payload
      const result = await apiProxyService.makeOutboundCall(finalMethod, targetUrl, payload, headersToSend);

      // Forward the status and headers from the external API response back to the client
      for (const headerName in result.headers) {
          // Exclude headers that Node/Express manage or could cause issues
          if (headerName.toLowerCase() !== 'transfer-encoding' &&
              headerName.toLowerCase() !== 'content-length' &&
              headerName.toLowerCase() !== 'connection' &&
              headerName.toLowerCase() !== 'keep-alive') {
              res.set(headerName, result.headers[headerName]);
          }
      }

      // Send back the status and data received from the external API
      res.status(result.status).send(result.data);
    } catch (err) {
      console.error('💥 API Proxy Request Error:', err);
      // Send a 500 Internal Server Error for unhandled proxy errors
      res.status(500).json({ success: false, message: 'Server failed to proxy the request.', error: err.message });
    }
  }
};

export default apiProxyController;