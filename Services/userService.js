// Services/userService.js
import { pool } from "../db.js";

export async function criarOuObterUsuario(uid, name, email) {
  try {
    // tenta encontrar o usuário no banco
    const result = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [uid]
    );

    if (result.rows.length > 0) {
      return result.rows[0]; // usuário já existe
    }

    // se não existir ele vai criar
    const insertResult = await pool.query(
      "INSERT INTO users (id, name, email) VALUES ($1, $2, $3) RETURNING *",
      [uid, name, email]
    );

    return insertResult.rows[0];
  } catch (error) {
    console.error("Erro ao criar/obter usuário:", error);
    throw error;
  }
}
