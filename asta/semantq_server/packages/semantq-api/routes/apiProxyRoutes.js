// packages/semantq-api/routes/apiProxyRoutes.js
// (assuming your package directory is named 'semantq-api')

import express from 'express';
import apiProxyController from '../controllers/apiProxyController.js';
const router = express.Router();
router.all('/', apiProxyController.proxyRequest); // This route remains correct
export default router;