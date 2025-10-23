// /Services/estabelecimentosService.js

import { pool } from "../db.js"; // Importa o pool do Neon DB

export const estabelecimentosService = {
  
  async getEstabelecimentos() {
    try {
      const res = await pool.query("SELECT * FROM estabelecimentos ORDER BY nome");
      return res.rows;
    } catch (error) {
      console.error("Erro ao buscar estabelecimentos:", error);
      throw new Error("Erro ao buscar estabelecimentos.");
    }
  },

  async getTop10(subcategoriaId) {
    try {
      const query = `
        SELECT * FROM estabelecimentos 
        WHERE subcategoria_id = $1 
        ORDER BY rating DESC 
        LIMIT 10
      `;
      const res = await pool.query(query, [subcategoriaId]);
      return res.rows;
    } catch (error) {
      console.error("Erro ao buscar Top 10:", error);
      throw new Error("Erro ao buscar Top 10.");
    }
  },

  /**
   * NOVO - Função essencial para a tela de detalhes do estabelecimento.
   */
  async getEstabelecimentoPorId(id) {
    try {
      const res = await pool.query("SELECT * FROM estabelecimentos WHERE id = $1", [id]);
      
      if (res.rowCount === 0) {
        throw new Error('Estabelecimento não encontrado.');
      }
      
      return res.rows[0];
    } catch (error) {
      console.error("Erro ao buscar estabelecimento por ID:", error);
      throw error; // Repassa o erro (pode ser o 'não encontrado')
    }
  }
};