// /middlewares/authMiddleware.js

import jwt from 'jsonwebtoken';

// Esta deve ser a MESMA Chave Secreta do seu authController.js
// Coloque-a em um arquivo .env
const JWT_SECRET = 'SUA_CHAVE_SECRETA_MUITO_FORTE_AQUI'; 

export const authMiddleware = (req, res, next) => {
    try {
        // 1. Pegar o token do cabeçalho
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' });
        }

        const token = authHeader.split(' ')[1]; // Pega só o token, sem "Bearer "

        // 2. Verificar o token
        const payload = jwt.verify(token, JWT_SECRET);

        // 3. Anexar o payload do token (que tem o uid) ao request
        req.user = payload; // Agora req.user.uid estará disponível nos controllers

        next(); // Continua para o controller
        
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirou.' });
        }
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Token inválido.' });
        }
        res.status(500).json({ message: 'Erro interno no middleware de autenticação.' });
    }
};