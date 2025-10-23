
/**
 * @swagger
 * /listas:
 *   get:
 *     summary: Retorna todas as reviews de um estabelecimento
 */
import { Router } from "express";
import { 
    criarListaController, 
    listarListasController, 
    deletarListaController, 
    adicionarEstabelecimentoController, 
    removerEstabelecimentoController,
    getDetalhesDaListaController,
    listarListasPublicasController
} from "../Controllers/listasController.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js"; 

const router = Router();

// Rota para listas públicas (deve vir antes de /:listaId)
router.get("/public", listarListasPublicasController);

// Rotas para listas
router.get("/", authMiddleware, listarListasController);
router.post("/", authMiddleware, criarListaController);

// Rotas para UMA lista (com :listaId)
router.get("/:listaId", authMiddleware, getDetalhesDaListaController);
router.delete("/:listaId", authMiddleware, deletarListaController);

// Rotas para estabelecimentos dentro de uma lista
router.post("/:listaId/estabelecimentos", authMiddleware, adicionarEstabelecimentoController);
router.delete("/:listaId/estabelecimentos/:estabelecimentoId", authMiddleware, removerEstabelecimentoController);

export default router;