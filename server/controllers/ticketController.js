import ticketService from '../services/ticketService.js';

class TicketController {
  async createTicket(req, res) {
    try {
      const ticket = await ticketService.createTicket(req.body);
      res.status(201).json(ticket);
    } catch (error) {
      console.error(`❌ Failed to create Ticket:`, error);
      res.status(400).json({ error: error.message, details: error.stack });
    }
  }

  async getTicket(req, res) {
    try {
      const ticket = await ticketService.getTicketById(req.params.id);
      res.status(200).json(ticket);
    } catch (error) {
      console.error(`❌ Failed to fetch Ticket:`, error);
      res.status(404).json({ error: 'Ticket not found', details: error.stack });
    }
  }

  async getAllTickets(req, res) {
    try {
      const tickets = await ticketService.getAllTickets();
      res.status(200).json(tickets);
    } catch (error) {
      console.error(`❌ Failed to fetch all Tickets:`, error);
      res.status(500).json({ error: 'Failed to fetch all records', details: error.stack });
    }
  }

  async updateTicket(req, res) {
    try {
      const ticket = await ticketService.updateTicket(req.params.id, req.body);
      res.status(200).json(ticket);
    } catch (error) {
      console.error(`❌ Failed to update Ticket:`, error);
      res.status(400).json({ error: error.message, details: error.stack });
    }
  }

  async deleteTicket(req, res) {
    try {
      await ticketService.deleteTicket(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error(`❌ Failed to delete Ticket:`, error);
      res.status(400).json({ error: error.message, details: error.stack });
    }
  }
}

export default new TicketController();