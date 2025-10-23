// /Services/reviewsService.js (VERSÃO CORRIGIDA)

import { pool } from '../db.js';
// import { getFirestore } from './firebaseService.js'; // NÃO PRECISA MAIS DO FIRESTORE

export async function criarReview(usuarioId, estabelecimentoId, nota, comentario) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Inicia uma transação

    // 1. Insere a nova review no PostgreSQL (como já fazia)
    const query = `
      INSERT INTO reviews (usuario_id, estabelecimento_id, nota, comentario, data)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id
    `;
    const res = await client.query(query, [usuarioId, estabelecimentoId, nota, comentario]);
    const reviewId = res.rows[0].id;

    // 2. Calcula a nova média e total de avaliações a partir do PostgreSQL (como já fazia)
    const statsQuery = `
      SELECT 
        AVG(nota)::numeric(10,2) as media_notas, 
        COUNT(*) as total_avaliacoes 
      FROM reviews 
      WHERE estabelecimento_id = $1
    `;
    const statsRes = await client.query(statsQuery, [estabelecimentoId]);
    const { media_notas, total_avaliacoes } = statsRes.rows[0];

    // 3. ATUALIZADO: Atualiza a tabela 'estabelecimentos' no PostgreSQL
    const updateQuery = `
      UPDATE estabelecimentos
      SET 
        rating = $1,
        total_avaliacoes = $2
      WHERE id = $3
    `;
    await client.query(updateQuery, [
      parseFloat(media_notas), 
      parseInt(total_avaliacoes, 10), 
      estabelecimentoId
    ]);

    await client.query('COMMIT'); // Confirma a transação
    return reviewId;

  } catch (error) {
    await client.query('ROLLBACK'); // Desfaz a transação em caso de erro
    console.error("Erro na transação de criar review:", error);
    throw new Error("Não foi possível registrar a avaliação.");
  } finally {
    client.release(); // Libera o cliente de volta para o pool
  }
}

// lista todas as reviews de um estabelecimento (isto já estava correto)
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