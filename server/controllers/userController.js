import userService from '../services/userService.js';

class UserController {
  async createUser(req, res) {
    try {
      const user = await userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error(`❌ Failed to create User:`, error);
      res.status(400).json({ error: error.message, details: error.stack });
    }
  }

  async getUser(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      console.error(`❌ Failed to fetch User:`, error);
      res.status(404).json({ error: 'User not found', details: error.stack });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error(`❌ Failed to fetch all Users:`, error);
      res.status(500).json({ error: 'Failed to fetch all records', details: error.stack });
    }
  }

  async updateUser(req, res) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      res.status(200).json(user);
    } catch (error) {
      console.error(`❌ Failed to update User:`, error);
      res.status(400).json({ error: error.message, details: error.stack });
    }
  }

  async deleteUser(req, res) {
    try {
      await userService.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error(`❌ Failed to delete User:`, error);
      res.status(400).json({ error: error.message, details: error.stack });
    }
  }
}

export default new UserController();