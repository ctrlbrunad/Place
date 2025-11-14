import { pool } from '../db.js';

export const favoritosService = {

  /**
   * Adiciona ou remove um favorito (toggle).
   */
  async toggleFavorito(usuarioId, estabelecimentoId) {
    try {
      // 1. Tenta deletar primeiro (se já existir)
      const deleteRes = await pool.query(
        "DELETE FROM favoritos WHERE usuario_id = $1 AND estabelecimento_id = $2",
        [usuarioId, estabelecimentoId]
      );

      // 2. Se nada foi deletado (rowCount === 0), significa que não existia,
      // então devemos INSERIR.
      if (deleteRes.rowCount === 0) {
        await pool.query(
          "INSERT INTO favoritos (usuario_id, estabelecimento_id) VALUES ($1, $2)",
          [usuarioId, estabelecimentoId]
        );
        return { favoritado: true }; // Retorna o novo estado
      }

      return { favoritado: false }; // Retorna o novo estado
      
    } catch (error) {
      console.error("Erro no toggleFavorito:", error);
      throw new Error("Erro ao salvar favorito.");
    }
  },

  /**
   * Lista todos os estabelecimentos favoritados por um usuário.
   */
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
  
  /**
   * (Opcional, mas OTIMIZA a tela de lista)
   * Retorna apenas os IDs dos favoritos do usuário.
   */
  async listarIdsFavoritos(usuarioId) {
     try {
      const res = await pool.query(
        "SELECT estabelecimento_id FROM favoritos WHERE usuario_id = $1",
        [usuarioId]
      );
      // Retorna um Set (ex: {'estab1', 'estab7'}) para busca rápida
      return new Set(res.rows.map(row => row.estabelecimento_id));
    } catch (error) {
      console.error("Erro ao listar IDs de favoritos:", error);
      throw new Error("Erro ao buscar IDs de favoritos.");
    }
  }
};