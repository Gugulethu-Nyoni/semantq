import express from 'express';
import entityController from '../controllers/entityController.js';

const router = express.Router();

// Create record
router.post('/entities', entityController.createEntity);
// Get single record by ID
router.get('/entities/:id', entityController.getEntity);
// Get all records
router.get('/entities', entityController.getAllEntitys);
// Update record by ID
router.put('/entities/:id', entityController.updateEntity);
// Delete record by ID
router.delete('/entities/:id', entityController.deleteEntity);

export default router;