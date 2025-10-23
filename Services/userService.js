// /Services/userService.js

import { pool } from "../db.js";

export const userService = {
    /**
     * Busca os dados de perfil de um usuário pelo ID.
     * Usado pela "Tela de Perfil".
     */
    async getUserProfile(usuarioId) {
        try {
            // Seleciona explicitamente os campos para NUNCA retornar o senhaHash
            const result = await pool.query(
                "SELECT id, nome, email, is_admin FROM users WHERE id = $1",
                [usuarioId]
            );

            if (result.rowCount === 0) {
                throw new Error("Usuário não encontrado.");
            }

            return result.rows[0];

        } catch (error) {
            console.error("Erro ao buscar perfil do usuário:", error);
            throw error;
        }
    },

    /**
     * Atualiza os dados de perfil de um usuário (ex: nome).
     */
    async updateUserProfile(usuarioId, { nome }) {
        try {
            const result = await pool.query(
                `UPDATE users 
                 SET nome = $1 
                 WHERE id = $2
                 RETURNING id, nome, email, is_admin`, // Retorna os dados atualizados
                [nome, usuarioId]
            );

            if (result.rowCount === 0) {
                throw new Error("Usuário não encontrado para atualização.");
            }

            return result.rows[0];

        } catch (error) {
            console.error("Erro ao atualizar perfil do usuário:", error);
            throw new Error("Não foi possível atualizar o perfil.");
        }
    }
};