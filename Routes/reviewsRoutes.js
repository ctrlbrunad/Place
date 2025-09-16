/**
 * @swagger
 * /listas:
 *   get:
 *     summary: Retorna todas as listas
 *     responses:
 *       200:
 *         description: Lista de listas.
 *   post:
 *     summary: Cria uma nova lista
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               usuarioId:
 *                 type: string
 *               estabelecimentos:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Lista criada com sucesso
 */

import { Router } from "express";
import { criarReviewController, listarReviewsController } from "../Controllers/reviewsController.js";

const router = Router();

// rotaa de reviews
router.get("/:estabelecimentoId", listarReviewsController); // lista todas as reviews de um estabelecimento
router.post("/", criarReviewController); // cria uma nova review

export default router;
