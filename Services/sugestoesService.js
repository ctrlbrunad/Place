// /Services/sugestoesService.js (CORRIGIDO)

import { pool } from '../db.js';
import { createEstabelecimento } from './estabelecimentosAdminService.js'; // Cuidado com essa importação, não usamos ela aqui.

class SugestoesService {
  
  // CORREÇÃO 1: Espera 'usuarioId' (do controller)
  async criarSugestao({ nome, endereco, subcategoria, usuarioId }) { 
    try {
      // CORREÇÃO 2: A query SQL com 5 colunas e 5 placeholders
      // (Assumindo que você ADICIONOU a coluna 'subcategoria' no NeoDB)
      const query = `
        INSERT INTO sugestoes (nome, endereco, subcategoria, usuario_id, status) 
        VALUES ($1, $2, $3, $4, 'pendente') 
        RETURNING *
      `;
      // CORREÇÃO 3: Passa os 4 valores
      const values = [nome, endereco, subcategoria, usuarioId]; 

      const result = await pool.query(query, values);
      return result.rows[0];

    } catch (error) {
        console.error("Erro no SQL de criarSugestao:", error);
        throw error; 
    }
  }

  // ... (Cole o resto do seu service aqui: listarSugestoesPendentes, etc.) ...
  async listarSugestoesPendentes() {
    // ...
  }
  async rejeitarSugestao(id) {
    // ...
  }
  async aprovarSugestao(id) {
    // ...
  }
}

export default new SugestoesService();