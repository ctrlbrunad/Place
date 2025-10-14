import { pool } from '../db.js';

export const adminAuthMiddleware = async (req, res, next) => {
    const { uid } = req.user;

    try {
        const userRes = await pool.query('SELECT is_admin FROM users WHERE id = $1', [uid]);

        if (userRes.rowCount === 0) {
            return res.status(403).json({ message: 'Acesso negado. Usuário não encontrado.' });
        }

        const { is_admin } = userRes.rows[0];

        if (!is_admin) {
            return res.status(403).json({ message: 'Acesso negado. Requer privilégios de administrador.' });
        }

        next();
    } catch (error) {
        console.error('Erro no middleware de admin:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};
