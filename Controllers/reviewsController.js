// export const listarReviews = (req, res) => {
// const reviews = [
//    { id: 1, usuario: "Flávio", nota: 5 },
  //  { id: 2, usuario: "Bruna", nota: 4 }
 // ];
  //res.json(reviews);
//};

//export const criarReview = (req, res) => {
//  const novaReview = req.body;
  //res.status(201).json({ message: "Review registrada!", data: novaReview });
//};


// import { criarReview, listarReviews } from "../Services/reviewsService.js";

//export const criarReviewController = async (req, res) => {
//  try {
//    const review = await criarReview(req.body);
///    res.status(201).json(review);
//  } catch (error) {
//   res.status(500).json({ error: error.message });
//  }
//};

//export const listarReviewsController = async (req, res) => {
//  try {
///    const { estabelecimentoId } = req.params;
 //   const reviews = await listarReviews(estabelecimentoId);
//    res.json(reviews);
//  } catch (error) {
//    res.status(500).json({ error: error.message });
//  }
// };
import { criarReview, listarReviews } from "../Services/reviewsService.js";

export const criarReviewController = async (req, res) => {
  try {
    const { usuarioId, estabelecimentoId, nota, comentario } = req.body;

// isso chama o service para criar a review (professor juro que sou eu que to comentando nao o chatgpt)
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

// controller pra listar reviews de um estabelecimento
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
