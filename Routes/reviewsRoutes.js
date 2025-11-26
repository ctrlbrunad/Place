import { authMiddleware } from "../Middlewares/authMiddleware.js";
import { Router } from "express";
import { 
    criarReviewController, 
    listarReviewsController, 
    listarMinhasReviewsController,
    deletarReviewController // <-- IMPORTE ISSO
} from "../Controllers/reviewsController.js";

const router = Router();

router.get("/me", authMiddleware, listarMinhasReviewsController);
router.get("/:estabelecimentoId", listarReviewsController);
router.post("/", authMiddleware, criarReviewController);

// --- NOVA ROTA ---
router.delete("/:reviewId", authMiddleware, deletarReviewController);

export default router;