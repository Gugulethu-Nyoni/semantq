import entityService from '../services/entityService.js';

class EntityController {
  async createEntity(req, res) {
    try {
      const entity = await entityService.createEntity(req.body);
      res.status(201).json(entity);
    } catch (error) {
      console.error(`❌ Failed to create Entity:`, error);
      res.status(400).json({ error: error.message, details: error.stack });
    }
  }

  async getEntity(req, res) {
    try {
      const entity = await entityService.getEntityById(req.params.id);
      res.status(200).json(entity);
    } catch (error) {
      console.error(`❌ Failed to fetch Entity:`, error);
      res.status(404).json({ error: 'Entity not found', details: error.stack });
    }
  }

  async getAllEntitys(req, res) {
    try {
      const entitys = await entityService.getAllEntitys();
      res.status(200).json(entitys);
    } catch (error) {
      console.error(`❌ Failed to fetch all Entitys:`, error);
      res.status(500).json({ error: 'Failed to fetch all records', details: error.stack });
    }
  }

  async updateEntity(req, res) {
    try {
      const entity = await entityService.updateEntity(req.params.id, req.body);
      res.status(200).json(entity);
    } catch (error) {
      console.error(`❌ Failed to update Entity:`, error);
      res.status(400).json({ error: error.message, details: error.stack });
    }
  }

  async deleteEntity(req, res) {
    try {
      await entityService.deleteEntity(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error(`❌ Failed to delete Entity:`, error);
      res.status(400).json({ error: error.message, details: error.stack });
    }
  }
}

export default new EntityController();