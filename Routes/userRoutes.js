// /Routes/userRoutes.js (VERSÃO ATUALIZADA)
import { Router } from 'express';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { 
    getMyProfileController, 
    updateMyProfileController,
    updateMyPasswordController // <-- 1. IMPORTE O NOVO CONTROLLER
} from '../Controllers/userController.js';

const router = Router();

// Rotas de perfil (que você já tem)
router.get('/me', authMiddleware, getMyProfileController);
router.put('/me', authMiddleware, updateMyProfileController);

// --- 2. ADICIONE A NOVA ROTA DE SENHA ---
router.put('/me/senha', authMiddleware, updateMyPasswordController);

export default router;