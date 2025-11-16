import { Router } from 'express';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { 
    getMyProfileController, 
    updateMyProfileController,
    updateMyPasswordController 
} from '../Controllers/userController.js';

const router = Router();

router.get('/me', authMiddleware, getMyProfileController);
router.put('/me', authMiddleware, updateMyProfileController);

router.put('/me/senha', authMiddleware, updateMyPasswordController);

export default router;