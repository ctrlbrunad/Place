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

router.get("/public", authMiddleware, listarListasPublicasController);
router.get("/", authMiddleware, listarListasController);
router.post("/", authMiddleware, criarListaController);
router.get("/:listaId", authMiddleware, getDetalhesDaListaController);
router.delete("/:listaId", authMiddleware, deletarListaController);
router.post("/:listaId/estabelecimentos", authMiddleware, adicionarEstabelecimentoController);
router.delete("/:listaId/estabelecimentos/:estabelecimentoId", authMiddleware, removerEstabelecimentoController);

export default router;