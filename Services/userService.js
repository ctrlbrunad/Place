import { pool } from "../db.js";

/**
 * Verifica se um usuário com o UID fornecido existe no banco de dados.
 * Se não existir, cria um novo registro.
 * Esta função garante que o banco de dados local esteja sincronizado
 * com os usuários autenticados pelo Firebase.
 *
 * @param {string} uid - O ID único do usuário do Firebase Auth.
 * @param {string} name - O nome do usuário.
 * @param {string} email - O email do usuário.
 * @returns {Promise<object>} Os dados do usuário do banco de dados (incluindo is_admin).
 */
export async function criarOuObterUsuario(uid, name, email) {
  try {
    // tenta encontrar o usuário no banco de dados
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [uid]);

    // caso o usuário já exista, retorna os dados dele
    if (result.rows.length > 0) {
      return result.rows[0];
    }

    // caso o usuário não existe, cria um novo registro
    const insertResult = await pool.query(
      "INSERT INTO users (id, name, email) VALUES ($1, $2, $3) RETURNING *",
      [uid, name, email]
    );

    return insertResult.rows[0];
  } catch (error) {
    console.error("Erro ao criar ou obter usuário:", error);
    // exibe o erro para ser tratado pelo controller
    throw error;
  }
}
