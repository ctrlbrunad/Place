// /Services/authService.js (VERSÃO COMPLETA E CORRIGIDA)

import { pool } from "../db.js";
import { v4 as uuidv4 } from 'uuid'; // Importa o gerador de ID

export const authService = {
    /**
     * Encontra um usuário pelo email.
     * Essencial para o login e para verificar duplicados no registro.
     */
    async findUserByEmail(email) {
        try {
            const result = await pool.query(
                "SELECT * FROM users WHERE email = $1",
                [email]
            );
            
            // Retorna o primeiro usuário encontrado (ou undefined)
            return result.rows[0]; 

        } catch (error) {
            console.error("Erro ao buscar usuário por email:", error);
            throw new Error("Erro ao acessar o banco de dados.");
        }
    },

    /**
     * Cria um novo usuário no banco de dados.
     * Recebe os dados já validados do controller.
     */
    async createUser({ nome, email, senha }) {
        try {
            // 1. Gera um ID único
            const id = uuidv4(); 

            // 2. Query inclui o 'id'
            const query = `
                INSERT INTO users (id, nome, email, senha) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id, nome, email
            `;
            // 3. Passa os 4 valores
            const values = [id, nome, email, senha];
            
            const result = await pool.query(query, values);

            return result.rows[0];

        } catch (error) {
            console.error("Erro ao criar usuário:", error);
            if (error.code === '23505') { 
                throw new Error("Este email já está em uso.");
            }
            throw new Error("Erro ao registrar novo usuário.");
        }
    }
};