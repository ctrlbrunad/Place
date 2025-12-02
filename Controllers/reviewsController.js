import { criarReview, listarReviews, listarReviewsDoUsuario, deletarReview } from "../Services/reviewsService.js";

/**
 * Rota: POST /reviews
 * Cria uma nova review com verificação de duplicidade.
 */
export const criarReviewController = async (req, res) => {
  try {
    const usuarioId = req.user.uid; 
    const { estabelecimentoId, nota, comentario } = req.body;

    const reviewId = await criarReview(usuarioId, estabelecimentoId, nota, comentario);

    res.status(201).json({ message: "Review criada com sucesso!", reviewId });
  } catch (error) {
    // Retorna erro 409 (Conflict) se for duplicado
    const status = error.message.includes("já avaliou") ? 409 : 500;
    res.status(status).json({ message: error.message });
  }
};

/**
 * Rota: GET /reviews/:estabelecimentoId
 * Lista todas as reviews de um estabelecimento.
 */
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

/**
 * Rota: GET /reviews/me
 * Lista todas as reviews do usuário logado (para "Minhas Avaliações").
 */
export const listarMinhasReviewsController = async (req, res) => {
  try {
    const usuarioId = req.user.uid; 
    const reviews = await listarReviewsDoUsuario(usuarioId);
    res.json({ message: "Reviews carregadas!", data: reviews });
  } catch (error) {
    res.status(500).json({ message: "Erro ao carregar suas reviews.", error: error.message });
  }
};

/**
 * Rota: DELETE /reviews/:reviewId
 * Deleta uma avaliação (requer que o usuário logado seja o dono).
 */
export const deletarReviewController = async (req, res) => {
    try {
        // 1. Pega o ID da review dos parâmetros da URL
        const { reviewId } = req.params; 
        // 2. Pega o ID do usuário do token (para autorização)
        const usuarioId = req.user.uid; 

        // 3. Chama o service que verifica a permissão e deleta
        await deletarReview(reviewId, usuarioId);
        
        res.status(200).json({ message: "Avaliação excluída com sucesso." });
    } catch (error) {
        // Se o erro do service contiver "permissão", retorna 403 (Forbidden)
        if (error.message.includes("permissão")) {
             return res.status(403).json({ message: error.message });
        }
        res.status(500).json({ message: error.message });
    }
};