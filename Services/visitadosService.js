import { pool } from '../db.js';

export const visitadosService = {
  async toggleVisitado(usuarioId, estabelecimentoId) {
    try {
      const deleteRes = await pool.query(
        "DELETE FROM visitados WHERE usuario_id = $1 AND estabelecimento_id = $2",
        [usuarioId, estabelecimentoId]
      );

      if (deleteRes.rowCount === 0) {
        await pool.query(
          "INSERT INTO visitados (usuario_id, estabelecimento_id) VALUES ($1, $2)",
          [usuarioId, estabelecimentoId]
        );
        return { visitado: true };
      }
      return { visitado: false };
    } catch (error) {
      console.error("Erro no toggleVisitado:", error);
      throw new Error("Erro ao salvar visita.");
    }
  },

  async listarMeusVisitados(usuarioId) {
    try {
      const query = `
        SELECT e.* FROM estabelecimentos e
        JOIN visitados v ON e.id = v.estabelecimento_id
        WHERE v.usuario_id = $1
        ORDER BY v.data_visita DESC;
      `;
      const res = await pool.query(query, [usuarioId]);
      return res.rows;
    } catch (error) {
      console.error("Erro ao listar visitados:", error);
      throw new Error("Erro ao buscar locais visitados.");
    }
  },
  
  async listarIdsVisitados(usuarioId) {
     try {
      const res = await pool.query(
        "SELECT estabelecimento_id FROM visitados WHERE usuario_id = $1",
        [usuarioId]
      );
      return new Set(res.rows.map(row => row.estabelecimento_id));
    } catch (error) {
      console.error("Erro ao listar IDs de visitados:", error);
      throw new Error("Erro ao buscar IDs de visitados.");
    }
  }
};