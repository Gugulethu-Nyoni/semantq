import models from '../models/index.js';

const userService = {
  async getUserById(id) {
    return await models.User.findUserById(id);
  },

  async getAllUsers() {
    return await models.User.findAllUsers();
  },

  async createUser(data) {
    return await models.User.createUser(data);
  },

  async updateUser(id, data) {
    return await models.User.updateUser(id, data);
  },

  async deleteUser(id) {
    return await models.User.deleteUser(id);
  }
};

export default userService;
