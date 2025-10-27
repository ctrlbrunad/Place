// /Routes/reviewsRoutes.js (CORRIGIDO)

/**
 * @swagger
 * /reviews:
 * get:
 * summary: Retorna todas as reviews de um estabelecimento
 */
import { authMiddleware } from "../Middlewares/authMiddleware.js";
import { Router } from "express";
import { criarReviewController, listarReviewsController } from "../Controllers/reviewsController.js";

const router = Router();

// rotas de reviews
router.get("/:estabelecimentoId", listarReviewsController);

// --- ADICIONE ESTA LINHA QUE FALTAVA ---
router.post("/", authMiddleware, criarReviewController);

export default router;