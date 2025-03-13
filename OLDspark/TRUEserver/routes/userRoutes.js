import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

//console.log('User routes loaded');

// Define the POST route for user registration
//router.post('/register', userController.register);


router.post('/register', (req, res, next) => {
  //console.log('Registration request received');
  userController.register(req, res, next);
});


// User Login Route
router.post('/login', (req, res, next) => {
  userController.login(req, res, next);
});



// User get all  Route
router.get('/all', (req, res, next) => {
  userController.getUsers(req, res, next);
});




// You can define other user-related routes here (e.g., update, get, delete)

export default router;
