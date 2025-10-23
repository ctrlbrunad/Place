// /Routes/userRoutes.js (CRIE ESTE NOVO ARQUIVO)

import { Router } from "express";
import { getMyProfileController, updateMyProfileController } from "../Controllers/userController.js";
import { authMiddleware } from "../Middlewares/authMiddleware.js";

const router = Router();

router.get("/me", authMiddleware, getMyProfileController);


router.put("/me", authMiddleware, updateMyProfileController);

export default router;