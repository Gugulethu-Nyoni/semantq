import express from 'express';
import eventController from '../controllers/eventController.js';

const router = express.Router();

// Create record
router.post('/events', eventController.createEvent);
// Get single record by ID
router.get('/events/:id', eventController.getEvent);
// Get all records
router.get('/events', eventController.getAllEvents);
// Update record by ID
router.put('/events/:id', eventController.updateEvent);
// Delete record by ID
router.delete('/events/:id', eventController.deleteEvent);

export default router;