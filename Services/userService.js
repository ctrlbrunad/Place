import { pool } from "../db.js";

export const userService = {
    /**
     * Busca os dados de perfil de um usuário pelo ID,
     * incluindo as contagens de listas e reviews.
     */
    async getUserProfile(usuarioId) {
        try {
            // --- ESTA É A MUDANÇA ---
            // Usamos subconsultas (SELECT COUNT(*)) para pegar as contagens
            // das tabelas 'reviews' e 'listas'
            const query = `
                SELECT 
                    u.id, 
                    u.nome, 
                    u.email, 
                    u.is_admin,
                    (
                        SELECT COUNT(*) 
                        FROM reviews r 
                        WHERE r.usuario_id = u.id
                    ) AS "reviewsCount",
                    (
                        SELECT COUNT(*) 
                        FROM listas l 
                        WHERE l.usuario_id = u.id
                    ) AS "listsCount"
                FROM 
                    users u
                WHERE 
                    u.id = $1;
            `;
            // -------------------------

            const result = await pool.query(query, [usuarioId]);

            if (result.rowCount === 0) {
                throw new Error("Usuário não encontrado.");
            }

            // Agora, result.rows[0] terá:
            // { id, nome, email, is_admin, reviewsCount, listsCount }
            return result.rows[0];

        } catch (error) {
            console.error("Erro ao buscar perfil do usuário:", error);
            throw error;
        }
    },

    /**
     * Atualiza os dados de perfil de um usuário (ex: nome).
     * (Esta função permanece a mesma)
     */
    async updateUserProfile(usuarioId, { nome }) {
        try {
            const result = await pool.query(
                `UPDATE users 
                 SET nome = $1 
                 WHERE id = $2
                 RETURNING id, nome, email, is_admin`,
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