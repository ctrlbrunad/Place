// /Routes/listasRoutes.js
import { Router } from "express";
import { 
    criarListaController, 
    listarListasController, 
    listarListasFavoritasController, // <-- IMPORTE
    deletarListaController, 
    adicionarEstabelecimentoController, 
    removerEstabelecimentoController,
    getDetalhesDaListaController,
    listarListasPublicasController,
    toggleFavoritoListaController
} from "../Controllers/listasController.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js"; 

const router = Router();

router.get("/public", authMiddleware, listarListasPublicasController);
// --- NOVA ROTA ---
router.get("/favoritas", authMiddleware, listarListasFavoritasController);
// -----------------

router.get("/", authMiddleware, listarListasController);
router.post("/", authMiddleware, criarListaController);
router.get("/:listaId", authMiddleware, getDetalhesDaListaController);
router.delete("/:listaId", authMiddleware, deletarListaController);
router.post("/:listaId/estabelecimentos", authMiddleware, adicionarEstabelecimentoController);
router.delete("/:listaId/estabelecimentos/:estabelecimentoId", authMiddleware, removerEstabelecimentoController);
router.post("/:listaId/favoritar", authMiddleware, toggleFavoritoListaController);

export default router;