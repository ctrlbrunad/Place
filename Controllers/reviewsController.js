// /Controllers/reviewsController.js
import { criarReview, listarReviews, listarReviewsDoUsuario, deletarReview } from "../Services/reviewsService.js"; // <-- Importe deletarReview

export const criarReviewController = async (req, res) => {
  try {
    const usuarioId = req.user.uid; 
    const { estabelecimentoId, nota, comentario } = req.body;

    const reviewId = await criarReview(usuarioId, estabelecimentoId, nota, comentario);

    res.status(201).json({ message: "Review criada com sucesso!", reviewId });
  } catch (error) {
    console.error(error);
    // Retorna erro 409 (Conflict) se for duplicado, ou 500 para outros erros
    const status = error.message.includes("já avaliou") ? 409 : 500;
    res.status(status).json({ message: error.message });
  }
};

export const listarReviewsController = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params;
    const reviews = await listarReviews(estabelecimentoId);
    res.json({ message: "Reviews carregadas!", data: reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao carregar reviews.", error: error.message });
  }
};

export const listarMinhasReviewsController = async (req, res) => {
  try {
    const usuarioId = req.user.uid; 
    const reviews = await listarReviewsDoUsuario(usuarioId);
    res.json({ message: "Reviews carregadas!", data: reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao carregar suas reviews.", error: error.message });
  }
};

// --- NOVO CONTROLLER ---
export const deletarReviewController = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const usuarioId = req.user.uid;

        await deletarReview(reviewId, usuarioId);
        res.status(200).json({ message: "Avaliação excluída com sucesso." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};