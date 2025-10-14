/**
 * @swagger
 * tags:
 *   name: Listas
 *   description: API para gerenciamento de listas de estabelecimentos
 *
 * components:
 *   schemas:
 *     Lista:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nome:
 *           type: string
 *         publica:
 *           type: boolean
 *         estabelecimentos:
 *           type: array
 *           items:
 *             type: string
 *     NovaLista:
 *       type: object
 *       required:
 *         - nome
 *         - publica
 *       properties:
 *         nome:
 *           type: string
 *         publica:
 *           type: boolean
 *         estabelecimentos:
 *           type: array
 *           items:
 *             type: string
 *
 * /listas:
 *   get:
 *     summary: Retorna as listas do usuário e listas públicas
 *     tags: [Listas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Uma lista de listas.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Lista'
 *   post:
 *     summary: Cria uma nova lista
 *     tags: [Listas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NovaLista'
 *     responses:
 *       201:
 *         description: Lista criada com sucesso
 *
 * /listas/{listaId}:
 *   delete:
 *     summary: Deleta uma lista
 *     tags: [Listas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listaId
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID da lista a ser deletada
 *     responses:
 *       200:
 *         description: Lista deletada com sucesso
 *       403:
 *         description: Usuário não autorizado a deletar esta lista
 *       404:
 *         description: Lista não encontrada
 *
 * /listas/{listaId}/estabelecimentos:
 *   post:
 *     summary: Adiciona um estabelecimento a uma lista
 *     tags: [Listas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listaId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estabelecimentoId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estabelecimento adicionado com sucesso
 *
 * /listas/{listaId}/estabelecimentos/{estabelecimentoId}:
 *   delete:
 *     summary: Remove um estabelecimento de uma lista
 *     tags: [Listas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listaId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: estabelecimentoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estabelecimento removido com sucesso
 */

import { Router } from "express";
import { criarListaController, listarListasController, deletarListaController, adicionarEstabelecimentoController, removerEstabelecimentoController } from "../Controllers/listasController.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

const router = Router();

// As rotas abaixo exigem que o usuário esteja logado

// Rotas para listas
router.get("/", authMiddleware, listarListasController);
router.post("/", authMiddleware, criarListaController);
router.delete("/:listaId", authMiddleware, deletarListaController);

// Rotas para estabelecimentos dentro de uma lista
router.post("/:listaId/estabelecimentos", authMiddleware, adicionarEstabelecimentoController);
router.delete("/:listaId/estabelecimentos/:estabelecimentoId", authMiddleware, removerEstabelecimentoController);

export default router;
