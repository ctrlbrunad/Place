import { pool } from "../db.js"; 

export const createEstabelecimento = async (estabelecimentoData) => {
    try {

        const { nome, endereco, subcategoriaId, rating = 0, total_avaliacoes = 0 } = estabelecimentoData;
        
        const query = `
            INSERT INTO estabelecimentos (nome, endereco, subcategoria_id, rating, total_avaliacoes) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING * `;
        
        const res = await pool.query(query, [nome, endereco, subcategoriaId, rating, total_avaliacoes]);
        
        return res.rows[0];
    } catch (error) {
        console.error("Erro ao criar estabelecimento:", error);
        throw new Error("Não foi possível criar o estabelecimento.");
    }
};

export const updateEstabelecimento = async (id, estabelecimentoData) => {
    try {
        const { nome, endereco, subcategoriaId } = estabelecimentoData;
        
        const query = `
            UPDATE estabelecimentos 
            SET nome = $1, endereco = $2, subcategoria_id = $3
            WHERE id = $4
            RETURNING *
        `;
        
        const res = await pool.query(query, [nome, endereco, subcategoriaId, id]);
        
        if (res.rowCount === 0) {
            throw new Error('Estabelecimento não encontrado para atualização.');
        }
        
        return res.rows[0];
    } catch (error) {
        console.error("Erro ao atualizar estabelecimento:", error);
        throw new Error("Não foi possível atualizar o estabelecimento.");
    }
};

export const deleteEstabelecimento = async (id) => {
    try {
        const res = await pool.query("DELETE FROM estabelecimentos WHERE id = $1", [id]);
        
        if (res.rowCount === 0) {
            throw new Error('Estabelecimento não encontrado para exclusão.');
        }

    } catch (error) {
        console.error("Erro ao deletar estabelecimento:", error);
        throw new Error("Não foi possível deletar o estabelecimento.");
    }
};