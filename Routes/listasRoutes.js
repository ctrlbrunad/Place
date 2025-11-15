// /Routes/listasRoutes.js (VERSÃO ATUALIZADA)
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

// --- ROTA ATUALIZADA ---
// Rota para listas públicas (agora requer autenticação para filtrar)
router.get("/public", authMiddleware, listarListasPublicasController);

// --- ROTAS EXISTENTES ---
router.get("/", authMiddleware, listarListasController);
router.post("/", authMiddleware, criarListaController);
router.get("/:listaId", authMiddleware, getDetalhesDaListaController);
router.delete("/:listaId", authMiddleware, deletarListaController);
router.post("/:listaId/estabelecimentos", authMiddleware, adicionarEstabelecimentoController);
router.delete("/:listaId/estabelecimentos/:estabelecimentoId", authMiddleware, removerEstabelecimentoController);

export default router;