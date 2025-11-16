import { authMiddleware } from "../Middlewares/authMiddleware.js";
import { Router } from "express";

import { 
  criarReviewController, 
  listarReviewsController, 
  listarMinhasReviewsController 
} from "../Controllers/reviewsController.js";

const router = Router();

router.get("/me", authMiddleware, listarMinhasReviewsController);
router.get("/:estabelecimentoId", listarReviewsController);
router.post("/", authMiddleware, criarReviewController);

export default router;