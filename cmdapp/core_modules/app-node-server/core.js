import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Handle API requests
app.all('/api', (req, res) => {
  const { method, endPoint, queryParams, body, apiKey } = req.body;

  if (!endPoint) {
    console.log('Error: Endpoint is missing');
    return res.status(400).json({ message: 'Endpoint is required' });
  }

  const url = `${endPoint}${Object.keys(queryParams).length ? '?' : ''}${new URLSearchParams(queryParams).toString()}`;

  const config = {
    method,
    url,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (apiKey) {
    config.headers['apiKey'] = apiKey;
  }

  if (method !== 'GET') {
    config.data = body;
  }

  axios(config)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).json({ message: 'Error making API request' });
    });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
