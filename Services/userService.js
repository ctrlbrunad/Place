import { pool } from "../db.js";
import bcrypt from 'bcryptjs';

export const userService = {

    async getUserProfile(usuarioId) {
        try {
            const query = `
                SELECT 
                    u.id, 
                    u.nome, 
                    u.email, 
                    u.avatar_id,
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
            const result = await pool.query(query, [usuarioId]);
            if (result.rowCount === 0) {
                throw new Error("Usuário não encontrado.");
            }
            return result.rows[0];
        } catch (error) {
            console.error("Erro ao buscar perfil do usuário:", error);
            throw error;
        }
    },

    async updateUserProfile(usuarioId, { nome, avatar_id }) { // 1. Adiciona avatar_id
        try {
            
            let query = 'UPDATE users SET';
            const values = [];
            let fieldIndex = 1;

            if (nome) {
                query += ` nome = $${fieldIndex++}`;
                values.push(nome);
            }
            if (avatar_id) {
                query += `${nome ? ',' : ''} avatar_id = $${fieldIndex++}`;
                values.push(avatar_id);
            }

            query += ` WHERE id = $${fieldIndex++} RETURNING id, nome, email, avatar_id`; // 3. Retorna o avatar_id
            values.push(usuarioId);

            const result = await pool.query(query, values);

            if (result.rowCount === 0) {
                throw new Error("Usuário não encontrado para atualização.");
            }
            return result.rows[0];
        } catch (error) {
            console.error("Erro ao atualizar perfil do usuário:", error);
            throw new Error("Não foi possível atualizar o perfil.");
        }
    },
    
    async updatePassword(usuarioId, novaSenha) {
        try {

            const salt = await bcrypt.genSalt(10);
            const senhaHash = await bcrypt.hash(novaSenha, salt);

            // Atualiza o 'senhaHash' no banco de dados
            await pool.query(
                "UPDATE users SET senhaHash = $1 WHERE id = $2",
                [senhaHash, usuarioId]
            );
        } catch (error) {
            console.error("Erro ao atualizar senha:", error);
            throw new Error("Não foi possível atualizar a senha.");
        }
    }
};