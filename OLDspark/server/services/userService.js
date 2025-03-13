import User from '../models/User.js';

class UserService {
  async createUser(data) {
    return await User.createRecord(data);
  }

  async getUserById(id) {
    return await User.findById(id);
  }

  async getAllUsers() {
    return await User.getAllRecords();
  }

  async updateUser(id, data) {
    return await User.updateRecord(id, data);
  }

  async deleteUser(id) {
    return await User.deleteRecord(id);
  }
}

export default new UserService();