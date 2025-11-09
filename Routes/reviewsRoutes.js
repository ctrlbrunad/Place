// /Routes/reviewsRoutes.js (VERSÃO ATUALIZADA)

import { authMiddleware } from "../Middlewares/authMiddleware.js";
import { Router } from "express";

// 1. ADICIONE 'listarMinhasReviewsController' AO IMPORT
import { 
  criarReviewController, 
  listarReviewsController, 
  listarMinhasReviewsController 
} from "../Controllers/reviewsController.js";

const router = Router();

// --- ⬇️ ADICIONE A NOVA ROTA AQUI (IMPORTANTE!) ---
// Esta rota DEVE vir ANTES de '/:estabelecimentoId'
// para que o roteador não pense que 'me' é um ID.
router.get("/me", authMiddleware, listarMinhasReviewsController);


// --- SUAS ROTAS EXISTENTES ---
router.get("/:estabelecimentoId", listarReviewsController);
router.post("/", authMiddleware, criarReviewController);

export default router;