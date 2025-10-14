import { pool } from '../db.js';
import { createEstabelecimento } from './estabelecimentosAdminService.js';

class SugestoesService {
  async criarSugestao({ nome, endereco, subcategoriaId, usuarioId }) {
    const result = await pool.query(
      'INSERT INTO sugestoes (nome, endereco, subcategoria_id, usuario_id, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nome, endereco, subcategoriaId, usuarioId, 'pendente']
    );
    return result.rows[0];
  }

  async listarSugestoesPendentes() {
    const result = await pool.query("SELECT * FROM sugestoes WHERE status = 'pendente'");
    return result.rows;
  }

  async rejeitarSugestao(id) {
    const result = await pool.query(
      "UPDATE sugestoes SET status = 'rejeitada' WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  async aprovarSugestao(id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const sugestaoResult = await client.query('SELECT * FROM sugestoes WHERE id = $1', [id]);
      const sugestao = sugestaoResult.rows[0];

      if (!sugestao) {
        throw new Error('Sugestão não encontrada.');
      }
      if (sugestao.status !== 'pendente') {
        throw new Error('A sugestão já foi processada.');
      }

      const estabelecimentoData = {
        nome: sugestao.nome,
        endereco: sugestao.endereco,
        subcategoriaId: sugestao.subcategoria_id,
        rating: 0,
        total_avaliacoes: 0,
      };

      await createEstabelecimento(estabelecimentoData);

      const updateResult = await client.query(
        "UPDATE sugestoes SET status = 'aprovada' WHERE id = $1 RETURNING *",
        [id]
      );

      await client.query('COMMIT');
      return updateResult.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
}

export default new SugestoesService();
