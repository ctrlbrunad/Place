import { pool } from '../db.js';

class SugestoesService {
  async criarSugestao({ nome, endereco, subcategoriaId, usuarioId }) {
    const result = await pool.query(
      'INSERT INTO sugestoes (nome, endereco, subcategoria_id, usuario_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome, endereco, subcategoriaId, usuarioId, 'pendente']
    );
    return result.rows[0];
  }
}

export default new SugestoesService();