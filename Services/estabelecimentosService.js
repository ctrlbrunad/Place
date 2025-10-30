// /Services/estabelecimentosService.js (VERSÃO CORRIGIDA - BUSCA POR CATEGORIA)

import { pool } from "../db.js"; 

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

  // A Rota ainda é /top10/... mas agora ela busca na coluna CATEGORIA
  async getTop10(categoriaNome) { // O parâmetro agora é o nome da Categoria
    try {
      // --- CORREÇÃO AQUI ---
      const query = `
        SELECT * FROM estabelecimentos 
        WHERE categoria = $1 -- CORREÇÃO: Procura na coluna 'categoria'
        ORDER BY media_notas DESC -- Mantém a ordenação por nota
        LIMIT 10
      `;
      // Passa o NOME da categoria (ex: 'Hamburgueria')
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