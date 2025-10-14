import express from 'express';
import {
    createEstabelecimento,
    updateEstabelecimento,
    deleteEstabelecimento
} from '../Controllers/estabelecimentosAdminController.js';
import { adminAuthMiddleware } from '../Middlewares/adminAuthMiddleware.js';

const router = express.Router();

router.post('/', adminAuthMiddleware, createEstabelecimento);
router.put('/:id', adminAuthMiddleware, updateEstabelecimento);
router.delete('/:id', adminAuthMiddleware, deleteEstabelecimento);

export default router;