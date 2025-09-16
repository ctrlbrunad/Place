// Middlewares/authMiddleware.js
import { verificarToken } from "../Services/firebaseService.js";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token não fornecido." });
    }

    const token = authHeader.split(" ")[1];
    const decodedUser = await verificarToken(token);

    if (!decodedUser) {
      return res.status(401).json({ message: "Token inválido ou expirado." });
    }

    req.user = decodedUser; // adiciona os dados do usuário à requisição
    next();
  } catch (error) {
    console.error("Erro no middleware de autenticação:", error);
    res.status(500).json({ message: "Erro ao autenticar usuário." });
  }
}
