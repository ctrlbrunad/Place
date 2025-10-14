import express from 'express';
const router = express.Router();
import sugestoesAdminController from '../Controllers/sugestoesAdminController.js';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { adminMiddleware } from '../Middlewares/adminMiddleware.js';

router.get('/', [authMiddleware, adminMiddleware], sugestoesAdminController.listarPendentes);
router.post('/:id/aprovar', [authMiddleware, adminMiddleware], sugestoesAdminController.aprovar);
router.post('/:id/rejeitar', [authMiddleware, adminMiddleware], sugestoesAdminController.rejeitar);

export default router;
