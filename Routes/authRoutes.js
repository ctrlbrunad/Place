import { Router } from "express";
import { authMiddleware } from "../Middlewares/authMiddleware.js";
import { criarOuObterUsuario } from "../Services/userService.js";

const router = Router();

// ✅ Endpoint para verificar se o token está funcionando e retornar dados do usuário
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const usuario = await criarOuObterUsuario(
      req.user.uid,
      req.user.name,
      req.user.email
    );

    res.json({
      message: "Usuário autenticado com sucesso ✅",
      data: usuario,
    });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({
      message: "Erro ao buscar usuário",
      error: error.message,
    });
  }
});

export default router;
