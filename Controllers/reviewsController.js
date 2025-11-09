// /Controllers/reviewsController.js (VERSÃO ATUALIZADA)

// 1. ADICIONE 'listarReviewsDoUsuario' AO IMPORT
import { criarReview, listarReviews, listarReviewsDoUsuario } from "../Services/reviewsService.js";

// --- SUA FUNÇÃO EXISTENTE ---
export const criarReviewController = async (req, res) => {
  try {
    const usuarioId = req.user.uid; 
    const { estabelecimentoId, nota, comentario } = req.body;
    const reviewId = await criarReview(usuarioId, estabelecimentoId, nota, comentario);
    res.status(201).json({
      message: "Review criada com sucesso!",
      reviewId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao criar review. Tente novamente.",
      error: error.message,
    });
  }
};

// --- SUA FUNÇÃO EXISTENTE ---
export const listarReviewsController = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params;
    const reviews = await listarReviews(estabelecimentoId);
    res.json({
      message: "Reviews carregadas com sucesso!",
      data: reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao carregar reviews. Tente novamente.",
      error: error.message,
    });
  }
};

// --- ⬇️ ADICIONE ESTA NOVA FUNÇÃO NO FINAL ---
/**
 * Rota: GET /reviews/me
 * Controller para buscar todas as reviews do usuário logado.
 */
export const listarMinhasReviewsController = async (req, res) => {
  try {
    // Pega o ID do usuário do token (via authMiddleware)
    const usuarioId = req.user.uid; 
    
    // 3. CHAMA O NOVO SERVICE
    const reviews = await listarReviewsDoUsuario(usuarioId);

    res.json({
      message: "Reviews do usuário carregadas com sucesso!",
      data: reviews, // Envia os dados para o app
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao carregar suas reviews.",
      error: error.message,
    });
  }
};