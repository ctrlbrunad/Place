// /Services/userService.js (VERSÃO ATUALIZADA)
import { pool } from "../db.js";
import bcrypt from 'bcryptjs'; // <-- 1. IMPORTE O 'bcryptjs'

export const userService = {

    // ... (sua função 'getUserProfile' existente)
    async getUserProfile(usuarioId) {
        try {
            const query = `
                SELECT 
                    u.id, 
                    u.nome, 
                    u.email, 
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

    // ... (sua função 'updateUserProfile' existente)
    async updateUserProfile(usuarioId, { nome }) {
        try {
            const result = await pool.query(
                `UPDATE users 
                 SET nome = $1 
                 WHERE id = $2
                 RETURNING id, nome, email`,
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
    },

    // --- 2. ADICIONE A NOVA FUNÇÃO DE ATUALIZAR SENHA ---
    async updatePassword(usuarioId, novaSenha) {
        try {
            // Criptografa a nova senha
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