import express from 'express';
import {
    createEstabelecimento,
    updateEstabelecimento,
    deleteEstabelecimento
} from '../Controllers/estabelecimentosAdminController.js';
import { adminMiddleware } from '../Middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/', adminMiddleware, createEstabelecimento);
router.put('/:id', adminMiddleware, updateEstabelecimento);
router.delete('/:id', adminMiddleware, deleteEstabelecimento);

export default router;