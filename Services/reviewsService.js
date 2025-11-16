import { pool } from '../db.js';

export async function criarReview(usuarioId, estabelecimentoId, nota, comentario) {
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); 
    const query = `
      INSERT INTO reviews (usuario_id, estabelecimento_id, nota, comentario, data)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id
    `;
    const res = await client.query(query, [usuarioId, estabelecimentoId, nota, comentario]);
    const reviewId = res.rows[0].id;
    const statsQuery = `
      SELECT 
        AVG(nota)::numeric(10,2) as media_notas, 
        COUNT(*) as total_avaliacoes 
      FROM reviews 
      WHERE estabelecimento_id = $1
    `;
    const statsRes = await client.query(statsQuery, [estabelecimentoId]);
    const { media_notas, total_avaliacoes } = statsRes.rows[0];
    const updateQuery = `
      UPDATE estabelecimentos
      SET 
        media_notas = $1,
        total_avaliacoes = $2
      WHERE id = $3
    `;
    await client.query(updateQuery, [
      parseFloat(media_notas), 
      parseInt(total_avaliacoes, 10), 
      estabelecimentoId
    ]);
    await client.query('COMMIT'); 
    return reviewId;
  } catch (error) {
    await client.query('ROLLBACK'); 
    console.error("Erro na transação de criar review:", error);
    throw new Error("Não foi possível registrar a avaliação.");
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
      SELECT 
        r.id, 
        r.nota, 
        r.comentario, 
        r.data,
        e.nome AS estabelecimento_nome,
        e.id AS estabelecimento_id
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