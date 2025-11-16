import { criarReview, listarReviews, listarReviewsDoUsuario } from "../Services/reviewsService.js";

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

export const listarMinhasReviewsController = async (req, res) => {
  try {
    
    const usuarioId = req.user.uid; 
    
    const reviews = await listarReviewsDoUsuario(usuarioId);

    res.json({
      message: "Reviews do usuário carregadas com sucesso!",
      data: reviews, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao carregar suas reviews.",
      error: error.message,
    });
  }
};