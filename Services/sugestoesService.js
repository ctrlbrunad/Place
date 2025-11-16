import { pool } from '../db.js';
import { createEstabelecimento } from './estabelecimentosAdminService.js';

class SugestoesService {
  

  async criarSugestao({ nome, endereco, subcategoria, usuarioId }) { 
    try {

      const query = `
        INSERT INTO sugestoes (nome, endereco, subcategoria, usuario_id, status) 
        VALUES ($1, $2, $3, $4, 'pendente') 
        RETURNING *
      `;

      const values = [nome, endereco, subcategoria, usuarioId]; 

      const result = await pool.query(query, values);
      return result.rows[0];

    } catch (error) {
        console.error("Erro no SQL de criarSugestao:", error);
        throw error; 
    }
  }

    async listarSugestoesPendentes() {
    
  }
  async rejeitarSugestao(id) {
    
  }
  async aprovarSugestao(id) {
    
  }
}

export default new SugestoesService();