/**
 * @swagger
 * /estabelecimentos:
 *   get:
 *     summary: Retorna todos os estabelecimentos
 */

import { Router } from "express";
import { listarEstabelecimentos, listarTop10 } from "../Controllers/estabelecimentosController.js";

const router = Router();

router.get("/", listarEstabelecimentos);
router.get("/top10/:subcategoriaId", listarTop10);

export default router;

