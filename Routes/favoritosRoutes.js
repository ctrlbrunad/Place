import { Router } from 'express';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { 
  toggleFavoritoController, 
  getMeusFavoritosController,
  getMeusIdsFavoritosController
} from '../Controllers/favoritosController.js';

const router = Router();

router.post('/:estabelecimentoId', authMiddleware, toggleFavoritoController);
router.get('/me', authMiddleware, getMeusFavoritosController);
router.get('/me/ids', authMiddleware, getMeusIdsFavoritosController);

export default router;