import express from 'express';
const router = express.Router();
import sugestoesController from '../Controllers/sugestoesController.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';

router.post('/', authMiddleware, sugestoesController.criarSugestao);

export default router;