
# 📖 Semantq API Proxy Developer Usage Guide

This guide explains how to safely and consistently route outbound API calls from your frontend through the **Semantq Server’s built-in API proxy**.

> **No need to install or configure the API proxy separately** — it's baked into the Semantq server.



## Why Use the API Proxy?

✔️ **Security** — Hide sensitive API keys from the frontend
✔️ **CORS bypass** — Avoid browser cross-origin issues
✔️ **Centralized rate limiting** — Control outbound traffic
✔️ **Data transformation** — Modify requests/responses server-side
✔️ **Decoupling** — Frontend never talks to external APIs directly



## How It Works

Your frontend always sends a `POST` request to your local Semantq server’s proxy endpoint:

```
http://localhost:3000/semantq-api
```

Inside that POST’s JSON body, you tell the proxy:

| Field       | Description                             |
| -- |  |
| `targetUrl` | The external API URL you want to call   |
| `method`    | HTTP method for the external API call   |
| `payload`   | (Optional) JSON data for POST/PUT/PATCH |



## Proxy Call Helper (Recommended)

Define this utility function in your frontend project (e.g. `/js/apiProxy.js`):

```javascript
export async function proxyApiRequest(targetUrl, method, payload = null) {
  const response = await fetch('http://localhost:3000/semantq-api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ targetUrl, method, payload })
  });

  return response.json();
}
```



## Usage Examples (By HTTP Method)

### GET Request (with query parameters)

```javascript
proxyApiRequest(
  'https://api.example.com/users?limit=5&sort=name',
  'GET'
).then(data => console.log(data));
```

✔️ No payload needed
✔️ Query params go in `targetUrl`



### POST Request (with JSON body)

```javascript
proxyApiRequest(
  'https://api.example.com/users',
  'POST',
  { name: 'John Doe', email: 'joed@example.com' }
).then(data => console.log(data));
```

✔️ JSON body passed via `payload`



### PUT Request (update resource)

```javascript
proxyApiRequest(
  'https://api.example.com/users/123',
  'PUT',
  { email: 'newemail@example.com' }
).then(data => console.log(data));
```

✔️ Updates existing record with new data



### PATCH Request (partial update)

```javascript
proxyApiRequest(
  'https://api.example.com/users/123',
  'PATCH',
  { status: 'active' }
).then(data => console.log(data));
```

✔️ Partial update payload



### DELETE Request

```javascript
proxyApiRequest(
  'https://api.example.com/users/123',
  'DELETE'
).then(data => console.log(data));
```

✔️ Usually no payload



## Example: Signup Form Integration (`signup.js`)

```javascript
import { proxyApiRequest } from './apiProxy.js';

async function signupUser(userData) {
  const result = await proxyApiRequest(
    'https://api.example.com/users',
    'POST',
    userData
  );

  console.log('Signup response:', result);
}

// Example call:
signupUser({
  name: 'Joe Doe',
  email: 'jdoe@example.com',
  password: 'Secret123!'
});
```



## Security Reminder

For production use, ensure the backend implements a **whitelist of allowed domains** to prevent SSRF (server-side request forgery) attacks.

Example (already supported in Semantq proxy controller):

```javascript
const ALLOWED_PROXY_DOMAINS = [
  'api.example.com'
];
```



## Summary

| Action                                      | Value                               |
| : | :- |
| Proxy endpoint URL                          | `http://localhost:3000/semantq-api` |
| Proxy HTTP method (frontend → proxy)        | `POST`                              |
| Outbound HTTP method (proxy → external API) | `method` field in JSON body         |
| Outbound target URL                         | `targetUrl` field in JSON body      |
| Outbound JSON body (if needed)              | `payload` field in JSON body        |



## Plug & Play

Once Semantq Server is running, you can safely proxy all your frontend API calls this way — no CORS issues, no exposing keys, and controlled outbound traffic management.

[⬅️ Back to Main Repository](../README.md)


