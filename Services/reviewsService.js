// /Services/reviewsService.js (VERSÃO FINAL E SEGURA)

import { pool } from '../db.js';

// --- FUNÇÃO AUXILIAR: RECALCULAR MÉDIA ---
async function atualizarMediaEstabelecimento(client, estabelecimentoId) {
    // Calcula a nova média (AVG) e o novo total (COUNT)
    const statsQuery = `
      SELECT 
        AVG(nota)::numeric(10,2) as media_notas, 
        COUNT(*) as total_avaliacoes 
      FROM reviews 
      WHERE estabelecimento_id = $1
    `;
    const statsRes = await client.query(statsQuery, [estabelecimentoId]);
    
    const media_notas = statsRes.rows[0]?.media_notas || 0;
    const total_avaliacoes = statsRes.rows[0]?.total_avaliacoes || 0;

    // Atualiza a tabela 'estabelecimentos'
    const updateQuery = `
      UPDATE estabelecimentos 
      SET media_notas = $1, total_avaliacoes = $2 
      WHERE id = $3
    `;
    await client.query(updateQuery, [parseFloat(media_notas), parseInt(total_avaliacoes, 10), estabelecimentoId]);
}
// ------------------------------------------

// --- FUNÇÃO DE CRIAÇÃO (COM VERIFICAÇÃO DE DUPLICIDADE) ---
export async function criarReview(usuarioId, estabelecimentoId, nota, comentario) {
  const client = await pool.connect();
  try {
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

    await atualizarMediaEstabelecimento(client, estabelecimentoId);

    await client.query('COMMIT'); 
    return reviewId;
  } catch (error) {
    await client.query('ROLLBACK'); 
    throw error;
  } finally {
    client.release(); 
  }
}

// --- FUNÇÃO DE DELETAR (CORRIGIDA) ---
export async function deletarReview(reviewId, usuarioId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const reviewIdInt = parseInt(reviewId, 10); 
        
        // 1. VERIFICA AUTORIZAÇÃO E PEGA O ID DO ESTABELECIMENTO
        const getReviewQuery = `
          SELECT estabelecimento_id 
          FROM reviews 
          WHERE id = $1 AND usuario_id = $2
        `;
        const reviewRes = await client.query(getReviewQuery, [reviewIdInt, usuarioId]); 

        if (reviewRes.rowCount === 0) {
            throw new Error("Avaliação não encontrada ou você não tem permissão para excluí-la.");
        }
        const estabelecimentoId = reviewRes.rows[0].estabelecimento_id;

        // 2. DELETA SOMENTE A REVIEW COM O ID FORNECIDO
        await client.query("DELETE FROM reviews WHERE id = $1", [reviewIdInt]);

        // 3. RECALCULA MÉDIA
        await atualizarMediaEstabelecimento(client, estabelecimentoId);

        await client.query('COMMIT');
    } catch (error) {
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release(); 
    }
}

// --- FUNÇÃO CORRIGIDA (O ERRO ESTAVA AQUI!) ---
export async function listarReviewsDoUsuario(usuarioId) {
  try {
    const query = `
      SELECT 
        r.id, 
        r.usuario_id, 
        u.nome AS usuario_nome, -- Nome do usuário
        r.nota, 
        r.comentario, 
        r.data, 
        e.nome AS estabelecimento_nome, 
        e.id AS estabelecimento_id
      FROM reviews r
      JOIN estabelecimentos e ON r.estabelecimento_id = e.id
      JOIN users u ON r.usuario_id = u.id -- <--- CORREÇÃO: Junta com a tabela de usuários
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

// --- FUNÇÃO EXISTENTE ---
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