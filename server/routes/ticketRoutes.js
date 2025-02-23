import express from 'express';
import ticketController from '../controllers/ticketController.js';

const router = express.Router();

// Create record
router.post('/tickets', ticketController.createTicket);
// Get single record by ID
router.get('/tickets/:id', ticketController.getTicket);
// Get all records
router.get('/tickets', ticketController.getAllTickets);
// Update record by ID
router.put('/tickets/:id', ticketController.updateTicket);
// Delete record by ID
router.delete('/tickets/:id', ticketController.deleteTicket);

export default router;