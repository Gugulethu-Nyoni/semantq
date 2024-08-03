/*
const endPoint = 'https://fakerapi.it/api/v1/products?_quantity=1&_taxes=12&_categories_type=uuid';

// Make a POST request to the proxy server
fetch('http://localhost:3000/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ endPoint }),
})
  .then(response => response.json())
  .then(data => {
    // Handle response data
    console.log(data);
  })
  .catch(error => {
    // Handle errors
    console.error('Error:', error);
  });
*/

/* 
https://fakerapi.it/api/v1/products
https://v6.exchangerate-api.com/
https://v6.exchangerate-api.com/v6/a0d331a7f4e730eebefe6b16/latest/USD

*/



// Define the parameters
const params = {
  method: 'POST', // HTTP method (GET, POST)
  endPoint: 'https://fakestoreapi.com/products', // API endpoint URL
  queryParams: { // Query parameters (if any)
    apiKey:null,
    /*_quantity: 3, // optional for demo
    _taxes: 12, // optional for demo
    _categories_type: 'uuid' // optional for demo */
  },
  body: JSON.stringify(
                {
                    title: 'test product',
                    price: 13.5,
                    description: 'lorem ipsum set',
                    image: 'https://i.pravatar.cc',
                    category: 'electronic'
                }
            ) // Request body (if applicable)
};

// Make the request to the proxy server
fetch('http://localhost:3000/api', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(params)
})
  .then(response => response.json())
  .then(data => {
    // Handle response data
    console.log("client side response:");
    console.log(data);
  })
  .catch(error => {
    // Handle errors
    console.error('Error:', error);
  });
