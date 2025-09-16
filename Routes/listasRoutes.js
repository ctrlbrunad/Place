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
import { criarListaController, listarListasController } from "../Controllers/listasController.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

const router = Router();

// agora todas as rotas exigem que o usuário esteja logado
router.get("/", authMiddleware, listarListasController);
router.post("/", authMiddleware, criarListaController);

export default router;
