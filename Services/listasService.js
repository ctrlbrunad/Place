import { pool } from "../db.js";

// Criar uma nova lista (COM TRANSAÇÃO)
export async function criarLista(nome, usuarioId, estabelecimentos) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN'); // Inicia a transação

    const queryLista = `
      INSERT INTO listas (nome, usuario_id, publica)
      VALUES ($1, $2, true) RETURNING id
    `;
    const res = await client.query(queryLista, [nome, usuarioId]);
    const listaId = res.rows[0].id;

    // Prepara uma única query para inserir todos os estabelecimentos
    const queryEstab = `
      INSERT INTO lista_estabelecimentos (lista_id, estabelecimento_id)
      SELECT $1, unnest($2::text[])
    `;
    await client.query(queryEstab, [listaId, estabelecimentos]);

    await client.query('COMMIT'); // Confirma a transação
    return listaId;

  } catch (error) {
    await client.query('ROLLBACK'); // Desfaz tudo em caso de erro
    console.error("Erro na transação de criar lista:", error);
    throw new Error("Não foi possível criar a lista.");
  } finally {
    client.release(); // Libera o cliente de volta para o pool
  }
}

// Listar listas (COM QUERY OTIMIZADA)
export async function listarListas(usuarioId) {
  // Esta única query busca as listas e já agrega os estabelecimentos em um JSON
  const query = `
    SELECT
      l.id,
      l.nome,
      l.usuario_id,
      u.name AS usuario_nome,
      COALESCE(
        (SELECT json_agg(json_build_object('id', e.id, 'nome', e.nome))
         FROM lista_estabelecimentos le
         JOIN estabelecimentos e ON le.estabelecimento_id = e.id
         WHERE le.lista_id = l.id),
        '[]'::json
      ) AS estabelecimentos
    FROM listas l
    JOIN users u ON l.usuario_id = u.id
    WHERE l.usuario_id = $1 OR l.publica = true
    ORDER BY l.id DESC
  `;
  const res = await pool.query(query, [usuarioId]);
  return res.rows;
}
