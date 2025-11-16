import { pool } from "../db.js"; 

export const estabelecimentosService = {
  
  async getEstabelecimentos(searchTerm) { 
    try {
      
      let query = "SELECT * FROM estabelecimentos";
      const values = [];

      if (searchTerm) {
        query += " WHERE nome ILIKE $1"; 
        values.push(`%${searchTerm}%`); 
      }
   
      query += " ORDER BY media_notas DESC, total_avaliacoes DESC";
      
      const res = await pool.query(query, values);
      return res.rows;
    } catch (error) {
      console.error("Erro ao buscar estabelecimentos:", error);
      throw new Error("Erro ao buscar estabelecimentos.");
    }
  },

  async getTop10(categoriaNome) { 
    try {
     
      const query = `
        SELECT * FROM estabelecimentos 
        WHERE categoria = $1 -- CORREÇÃO: Procura na coluna 'categoria'
        ORDER BY media_notas DESC -- Mantém a ordenação por nota
        LIMIT 10
      `;
      
      const res = await pool.query(query, [categoriaNome]); 
      return res.rows;
    } catch (error) {
      console.error(`Erro ao buscar Top 10 para ${categoriaNome}:`, error);
      throw new Error(`Erro ao buscar Top 10 para ${categoriaNome}.`);
    }
  },

  async getEstabelecimentoPorId(id) {
    try {
      const res = await pool.query("SELECT * FROM estabelecimentos WHERE id = $1", [id]);
      
      if (res.rowCount === 0) {
        throw new Error('Estabelecimento não encontrado.');
      }
      
      return res.rows[0];
    } catch (error) {
      console.error("Erro ao buscar estabelecimento por ID:", error);
      throw error;
    }
  }
};