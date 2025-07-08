import demoModelService from '../services/demoModelService.js';

const demoModelController = {
  async getAllDemoModels(req, res) {
    try {
      const demoModels = await demoModelService.getAllDemoModels();
      res.json({ success: true, data: demoModels });
    } catch (err) {
      console.error('💥 getAllDemoModels error:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch demo models' });
    }
  },

  async getDemoModelById(req, res) {
    try {
      const demoModel = await demoModelService.getDemoModelById(req.params.id);
      if (!demoModel) {
        return res.status(404).json({ success: false, message: 'DemoModel not found' });
      }
      res.json({ success: true, data: demoModel });
    } catch (err) {
      console.error('💥 getDemoModelById error:', err);
      res.status(500).json({ success: false, message: 'Failed to fetch demo model' });
    }
  },

  async createDemoModel(req, res) {
    try {
      const newDemoModel = await demoModelService.createDemoModel(req.body);
      res.status(201).json({ success: true, data: newDemoModel });
    } catch (err) {
      console.error('💥 createDemoModel error:', err);
      res.status(500).json({ success: false, message: 'Failed to create demo model' });
    }
  },

  async updateDemoModel(req, res) {
    try {
      const updatedDemoModel = await demoModelService.updateDemoModel(req.params.id, req.body);
      res.json({ success: true, data: updatedDemoModel });
    } catch (err) {
      console.error('💥 updateDemoModel error:', err);
      res.status(500).json({ success: false, message: 'Failed to update demo model' });
    }
  },

  async deleteDemoModel(req, res) {
    try {
      const deleted = await demoModelService.deleteDemoModel(req.params.id);
      if (deleted) {
        res.status(200).json({ success: true, message: 'DemoModel deleted successfully' });
      } else {
        res.status(404).json({ success: false, message: 'DemoModel not found or already deleted' });
      }
    } catch (err) {
      console.error('💥 deleteDemoModel error:', err);
      res.status(500).json({ success: false, message: 'Failed to delete demo model' });
    }
  }
};

export default demoModelController;
