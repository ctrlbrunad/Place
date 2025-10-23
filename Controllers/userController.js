// /Controllers/userController.js

import { userService } from '../Services/userService.js';

/**
 * Controller para buscar os dados do usuário logado.
 * Rota: GET /users/me (ou /users/profile)
 * * Esta rota deve ser protegida por um middleware de autenticação
 * que extrai o ID do usuário do token JWT e o coloca em 'req.user.uid'.
 */
export const getMyProfileController = async (req, res) => {
    try {
        // 1. O ID do usuário vem do middleware de autenticação (não do body ou params)
        const usuarioId = req.user.uid;

        if (!usuarioId) {
            return res.status(401).json({ message: 'Não autorizado. Token inválido ou ausente.' });
        }

        // 2. Chamar o service para buscar o usuário no banco
        // O service deve ter o cuidado de NUNCA retornar o 'senhaHash'
        const perfil = await userService.getUserProfile(usuarioId);

        if (!perfil) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        // 3. Enviar os dados do perfil para o app
        res.status(200).json(perfil);

    } catch (error) {
        console.error('Erro no getMyProfileController:', error);
        res.status(500).json({ 
            message: 'Erro ao buscar perfil do usuário.', 
            error: error.message 
        });
    }
};

/**
 * (Opcional, mas recomendado)
 * Controller para atualizar os dados do usuário logado (ex: nome).
 * Rota: PUT /users/me
 */
export const updateMyProfileController = async (req, res) => {
    try {
        const usuarioId = req.user.uid;
        const { nome } = req.body; // Permitir que o usuário atualize o nome

        if (!nome) {
            return res.status(400).json({ message: 'O campo "nome" é obrigatório.' });
        }

        // Chamar o service para atualizar o usuário
        const perfilAtualizado = await userService.updateUserProfile(usuarioId, { nome });

        res.status(200).json({
            message: 'Perfil atualizado com sucesso!',
            usuario: perfilAtualizado,
        });

    } catch (error) {
        console.error('Erro no updateMyProfileController:', error);
        res.status(500).json({ 
            message: 'Erro ao atualizar perfil.', 
            error: error.message 
        });
    }
};