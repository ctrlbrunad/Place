import { Router } from 'express';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { 
  toggleFavoritoController, 
  getMeusFavoritosController,
  getMeusIdsFavoritosController
} from '../Controllers/favoritosController.js';

const router = Router();

// Rota para favoritar/desfavoritar (toggle)
// POST /favoritos/estab123
router.post('/:estabelecimentoId', authMiddleware, toggleFavoritoController);

// Rota para a tela "Meus Favoritos" (lista completa)
// GET /favoritos/me
router.get('/me', authMiddleware, getMeusFavoritosController);

// Rota para a otimização (só os IDs)
// GET /favoritos/me/ids
router.get('/me/ids', authMiddleware, getMeusIdsFavoritosController);

export default router;