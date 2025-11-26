// /Services/reviewsService.js
import { pool } from '../db.js';

export async function criarReview(usuarioId, estabelecimentoId, nota, comentario) {
  const client = await pool.connect();
  try {
    // 1. VERIFICAÇÃO DE DUPLICIDADE (REGRA NOVA)
    const checkQuery = "SELECT id FROM reviews WHERE usuario_id = $1 AND estabelecimento_id = $2";
    const checkRes = await client.query(checkQuery, [usuarioId, estabelecimentoId]);
    
    if (checkRes.rowCount > 0) {
      throw new Error("Você já avaliou este estabelecimento. Exclua sua avaliação anterior para enviar uma nova.");
    }

    await client.query('BEGIN'); 

    const query = `
      INSERT INTO reviews (usuario_id, estabelecimento_id, nota, comentario, data)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id
    `;
    const res = await client.query(query, [usuarioId, estabelecimentoId, nota, comentario]);
    const reviewId = res.rows[0].id;

    // Recalcula média
    await atualizarMediaEstabelecimento(client, estabelecimentoId);

    await client.query('COMMIT'); 
    return reviewId;
  } catch (error) {
    await client.query('ROLLBACK'); 
    console.error("Erro ao criar review:", error);
    throw error; // Repassa o erro (inclusive o de duplicidade)
  } finally {
    client.release(); 
  }
}

export async function listarReviews(estabelecimentoId) {
  const query = `
    SELECT r.id, r.usuario_id, u.nome AS usuario_nome, r.nota, r.comentario, r.data
    FROM reviews r
    JOIN users u ON r.usuario_id = u.id
    WHERE r.estabelecimento_id = $1
    ORDER BY r.data DESC
  `;
  const res = await pool.query(query, [estabelecimentoId]);
  return res.rows;
}

export async function listarReviewsDoUsuario(usuarioId) {
  try {
    const query = `
      SELECT r.id, r.nota, r.comentario, r.data, e.nome AS estabelecimento_nome, e.id AS estabelecimento_id
      FROM reviews r
      JOIN estabelecimentos e ON r.estabelecimento_id = e.id
      WHERE r.usuario_id = $1
      ORDER BY r.data DESC;
    `;
    const res = await pool.query(query, [usuarioId]);
    return res.rows;
  } catch (error) {
    console.error("Erro ao buscar reviews do usuário:", error);
    throw new Error("Não foi possível buscar as avaliações.");
  }
}

// --- 2. NOVA FUNÇÃO DE DELETAR ---
export async function deletarReview(reviewId, usuarioId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Pega o estabelecimento_id antes de deletar (para recalcular a média depois)
        const getReviewQuery = "SELECT estabelecimento_id FROM reviews WHERE id = $1 AND usuario_id = $2";
        const reviewRes = await client.query(getReviewQuery, [reviewId, usuarioId]);

        if (reviewRes.rowCount === 0) {
            throw new Error("Avaliação não encontrada ou você não tem permissão.");
        }
        const estabelecimentoId = reviewRes.rows[0].estabelecimento_id;

        // Deleta
        await client.query("DELETE FROM reviews WHERE id = $1", [reviewId]);

        // Recalcula média
        await atualizarMediaEstabelecimento(client, estabelecimentoId);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
}

// Função auxiliar para recalcular média (usada no criar e no deletar)
async function atualizarMediaEstabelecimento(client, estabelecimentoId) {
    const statsQuery = `
      SELECT AVG(nota)::numeric(10,2) as media_notas, COUNT(*) as total_avaliacoes 
      FROM reviews WHERE estabelecimento_id = $1
    `;
    const statsRes = await client.query(statsQuery, [estabelecimentoId]);
    // Se não tiver mais reviews, volta para 0
    const media_notas = statsRes.rows[0]?.media_notas || 0;
    const total_avaliacoes = statsRes.rows[0]?.total_avaliacoes || 0;

    const updateQuery = `
      UPDATE estabelecimentos SET media_notas = $1, total_avaliacoes = $2 WHERE id = $3
    `;
    await client.query(updateQuery, [parseFloat(media_notas), parseInt(total_avaliacoes, 10), estabelecimentoId]);
}