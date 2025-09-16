import { pool } from '../db.js'; // importa a conexão com o banco

// cria uma nova review
export async function criarReview(usuarioId, estabelecimentoId, nota, comentario) {
  // insere a review
  const query = `
    INSERT INTO reviews (usuario_id, estabelecimento_id, nota, comentario, data)
    VALUES ($1, $2, $3, $4, NOW())
    RETURNING id
  `;
  const res = await pool.query(query, [usuarioId, estabelecimentoId, nota, comentario]);
  const reviewId = res.rows[0].id;

  // atualiza média de notas e total de avaliações no estabelecimento
  const mediaQuery = `
    UPDATE estabelecimentos
    SET media_notas = (
      SELECT AVG(nota) FROM reviews WHERE estabelecimento_id = $1
    ),
    total_avaliacoes = (
      SELECT COUNT(*) FROM reviews WHERE estabelecimento_id = $1
    )
    WHERE id = $1
  `;
  await pool.query(mediaQuery, [estabelecimentoId]);

  return reviewId;
}

// lista todas as reviews de um estabelecimento
export async function listarReviews(estabelecimentoId) {
  const query = `
    SELECT r.id, r.usuario_id, u.name AS usuario_nome, r.nota, r.comentario, r.data
    FROM reviews r
    JOIN users u ON r.usuario_id = u.id
    WHERE r.estabelecimento_id = $1
    ORDER BY r.data DESC
  `;
  const res = await pool.query(query, [estabelecimentoId]);
  return res.rows;
}
