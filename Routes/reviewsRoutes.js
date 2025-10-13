/**
 * @swagger
 * /reviews:
 *   get:
 *     summary: Retorna todas as reviews de um estabelecimento
 */

import { Router } from "express";
import { criarReviewController, listarReviewsController } from "../Controllers/reviewsController.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

// CORREÇÃO: A criação do router deve vir ANTES do seu uso.
const router = Router();

// rotas de reviews
router.get("/:estabelecimentoId", listarReviewsController); // lista todas as reviews de um estabelecimento

// CORREÇÃO DE SEGURANÇA: Adicionando o authMiddleware para proteger a rota de criação.
router.post("/", authMiddleware, criarReviewController); // cria uma nova review

export default router;