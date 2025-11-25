import { Router } from 'express';
import { authMiddleware } from '../Middlewares/authMiddleware.js';
import { 
  toggleVisitadoController, 
  getMeusVisitadosController,
  getMeusIdsVisitadosController
} from '../Controllers/visitadosController.js';

const router = Router();

router.post('/:estabelecimentoId', authMiddleware, toggleVisitadoController);
router.get('/me', authMiddleware, getMeusVisitadosController);
router.get('/me/ids', authMiddleware, getMeusIdsVisitadosController);

export default router;