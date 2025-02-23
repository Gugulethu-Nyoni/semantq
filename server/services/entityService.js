import Entity from '../models/Entity.js';

class EntityService {
  async createEntity(data) {
    return await Entity.createRecord(data);
  }

  async getEntityById(id) {
    return await Entity.findById(id);
  }

  async getAllEntities() {
    return await Entity.getAllRecords();
  }

  async updateEntity(id, data) {
    return await Entity.updateRecord(id, data);
  }

  async deleteEntity(id) {
    return await Entity.deleteRecord(id);
  }
}

export default new EntityService();