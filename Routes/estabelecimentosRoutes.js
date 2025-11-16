import { Router } from "express";
import { 
    listarEstabelecimentos, 
    listarTop10, 
    getEstabelecimentoPorIdController 
} from "../Controllers/estabelecimentosController.js";

const router = Router();

router.get("/", listarEstabelecimentos);
router.get("/top10/:subcategoriaId", listarTop10);
router.get("/:id", getEstabelecimentoPorIdController); 

export default router;