import { pool } from '../db.js';

export const favoritosService = {

  async toggleFavorito(usuarioId, estabelecimentoId) {
    try {

      const deleteRes = await pool.query(
        "DELETE FROM favoritos WHERE usuario_id = $1 AND estabelecimento_id = $2",
        [usuarioId, estabelecimentoId]
      );

      if (deleteRes.rowCount === 0) {
        await pool.query(
          "INSERT INTO favoritos (usuario_id, estabelecimento_id) VALUES ($1, $2)",
          [usuarioId, estabelecimentoId]
        );
        return { favoritado: true }; 
      }

      return { favoritado: false }; 
      
    } catch (error) {
      console.error("Erro no toggleFavorito:", error);
      throw new Error("Erro ao salvar favorito.");
    }
  },

  async listarMeusFavoritos(usuarioId) {
    try {
      const query = `
        SELECT e.* FROM estabelecimentos e
        JOIN favoritos f ON e.id = f.estabelecimento_id
        WHERE f.usuario_id = $1
        ORDER BY e.nome;
      `;
      const res = await pool.query(query, [usuarioId]);
      return res.rows;
    } catch (error) {
      console.error("Erro ao listar favoritos:", error);
      throw new Error("Erro ao buscar favoritos.");
    }
  },
  
  async listarIdsFavoritos(usuarioId) {
     try {
      const res = await pool.query(
        "SELECT estabelecimento_id FROM favoritos WHERE usuario_id = $1",
        [usuarioId]
      );

      return new Set(res.rows.map(row => row.estabelecimento_id));
    } catch (error) {
      console.error("Erro ao listar IDs de favoritos:", error);
      throw new Error("Erro ao buscar IDs de favoritos.");
    }
  }
};