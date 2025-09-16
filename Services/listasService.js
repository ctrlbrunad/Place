import { pool } from "../db.js";

// Criar uma nova lista
export async function criarLista(nome, usuarioId, estabelecimentos) {
  // Inserir nova lista
  const queryLista = `
    INSERT INTO listas (nome, usuario_id, publica)
    VALUES ($1, $2, true)
    RETURNING id
  `;
  const res = await pool.query(queryLista, [nome, usuarioId]);
  const listaId = res.rows[0].id;

  // Inserir relacionamentos lista_estabelecimentos
  const queryEstab = `
    INSERT INTO lista_estabelecimentos (lista_id, estabelecimento_id)
    VALUES ($1, $2)
  `;
  for (const estabId of estabelecimentos) {
    await pool.query(queryEstab, [listaId, estabId]);
  }

  return listaId;
}

// listar todas as listas de um usuário (ou listas públicas)
export async function listarListas(usuarioId) {
  const queryListas = `
    SELECT l.id, l.nome, l.usuario_id, u.name AS usuario_nome
    FROM listas l
    JOIN users u ON l.usuario_id = u.id
    WHERE l.usuario_id = $1 OR l.publica = true
    ORDER BY l.id DESC
  `;
  const listasRes = await pool.query(queryListas, [usuarioId]);
  const listas = [];

  for (const lista of listasRes.rows) {
    // buscar estabelecimentos da lista
    const queryEstabs = `
      SELECT e.id, e.nome
      FROM lista_estabelecimentos le
      JOIN estabelecimentos e ON le.estabelecimento_id = e.id
      WHERE le.lista_id = $1
    `;
    const estabsRes = await pool.query(queryEstabs, [lista.id]);
    listas.push({
      id: lista.id,
      nome: lista.nome,
      usuarioId: lista.usuario_id,
      usuarioNome: lista.usuario_nome,
      estabelecimentos: estabsRes.rows,
    });
  }

  return listas;
}
