import express from 'express';
import demoModelController from '../controllers/demoModelController.js';

const router = express.Router();

// 🟢 Public DemoModel Routes (for demo purposes)
router.get('/demomodels', demoModelController.getAllDemoModels);
router.get('/demomodels/:id', demoModelController.getDemoModelById);
router.post('/demomodels', demoModelController.createDemoModel);
router.put('/demomodels/:id', demoModelController.updateDemoModel);
router.delete('/demomodels/:id', demoModelController.deleteDemoModel);

export default router;
