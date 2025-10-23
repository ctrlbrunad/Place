// /middlewares/adminMiddleware.js
import { pool } from '../db.js';

export const adminMiddleware = async (req, res, next) => {
    try {
        // Importante: Este middleware DEVE rodar DEPOIS do authMiddleware.
        // Ele espera que req.user já exista.
        const usuarioId = req.user.uid;

        if (!usuarioId) {
            return res.status(401).json({ message: 'Autenticação necessária.' });
        }

        // Verifica no banco se o usuário é admin
        const result = await pool.query('SELECT is_admin FROM users WHERE id = $1', [usuarioId]);

        if (result.rowCount === 0 || !result.rows[0].is_admin) {
            return res.status(403).json({ message: 'Acesso negado. Rota exclusiva para administradores.' });
        }

        // Usuário é admin, pode continuar
        next();

    } catch (error) {
        console.error("Erro no adminAutMiddleware:", error);
        res.status(500).json({ message: 'Erro ao verificar permissões de administrador.' });
    }
};