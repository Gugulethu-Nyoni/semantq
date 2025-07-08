import models from '../models/index.js';

const demoModelService = {
  async getDemoModelById(id) {
    return await models.DemoModel.findDemoModelById(id);
  },

  async getAllDemoModels() {
    return await models.DemoModel.findAllDemoModels();
  },

  async createDemoModel(data) {
    return await models.DemoModel.createDemoModel(data);
  },

  async updateDemoModel(id, data) {
    return await models.DemoModel.updateDemoModel(id, data);
  },

  async deleteDemoModel(id) {
    return await models.DemoModel.deleteDemoModel(id);
  }
};

export default demoModelService;
