import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

// Create record
router.post('/users', userController.createUser);
// Get single record by ID
router.get('/users/:id', userController.getUser);
// Get all records
router.get('/users', userController.getAllUsers);
// Update record by ID
router.put('/users/:id', userController.updateUser);
// Delete record by ID
router.delete('/users/:id', userController.deleteUser);

export default router;