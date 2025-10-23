// ... (imports)
import { Router } from "express";
import { 
    listarEstabelecimentos, 
    listarTop10, 
    getEstabelecimentoPorIdController // <- Importe o novo controller
} from "../Controllers/estabelecimentosController.js";

const router = Router();

router.get("/", listarEstabelecimentos);
router.get("/top10/:subcategoriaId", listarTop10);

// ROTA NOVA:
// @route   GET /estabelecimentos/:id
// @desc    Busca detalhes de um estabelecimento específico
router.get("/:id", getEstabelecimentoPorIdController); // <- Adicione esta linha

export default router;