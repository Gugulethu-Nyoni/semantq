import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

//console.log('User routes loaded');

// Define the POST route for user registration
//router.post('/register', userController.register);


router.post('/buy', (req, res, next) => {
  //console.log('Registration request received');
  productController.buy(req, res, next);
});


// You can define other user-related routes here (e.g., update, get, delete)

export default router;
