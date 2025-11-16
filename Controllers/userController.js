// /Controllers/userController.js (VERSÃO ATUALIZADA)
import { userService } from '../Services/userService.js';
import bcrypt from 'bcryptjs'; // <-- 1. IMPORTE O 'bcryptjs'

// ... (sua função 'getMyProfileController' existente)
export const getMyProfileController = async (req, res) => {
    try {
        const usuarioId = req.user.uid;
        if (!usuarioId) {
            return res.status(401).json({ message: 'Não autorizado.' });
        }
        const perfil = await userService.getUserProfile(usuarioId);
        if (!perfil) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
        res.status(200).json(perfil);
    } catch (error) {
        console.error('Erro no getMyProfileController:', error);
        res.status(500).json({ 
            message: 'Erro ao buscar perfil do usuário.', 
            error: error.message 
        });
    }
};

// ... (sua função 'updateMyProfileController' existente)
export const updateMyProfileController = async (req, res) => {
    try {
        const usuarioId = req.user.uid;
        const { nome, avatar_id } = req.body; // 1. Pega o avatar_id do body

        if (!nome && !avatar_id) { // 2. Verifica se pelo menos um foi enviado
            return res.status(400).json({ message: 'Nenhum dado para atualizar.' });
        }

        const perfilAtualizado = await userService.updateUserProfile(usuarioId, { nome, avatar_id }); // 3. Passa para o service

        res.status(200).json({
            message: 'Perfil atualizado com sucesso!',
            usuario: perfilAtualizado,
        });
    } catch (error) {
        // ... (seu 'catch'
    }
};

// --- 2. ADICIONE O NOVO CONTROLLER DE SENHA ---
export const updateMyPasswordController = async (req, res) => {
    try {
        const usuarioId = req.user.uid;
        const { novaSenha } = req.body;

        if (!novaSenha || novaSenha.length < 6) {
            return res.status(400).json({ message: 'A nova senha deve ter pelo menos 6 caracteres.' });
        }

        await userService.updatePassword(usuarioId, novaSenha);

        res.status(200).json({ message: 'Senha atualizada com sucesso!' });

    } catch (error) {
        console.error('Erro no updateMyPasswordController:', error);
        res.status(500).json({ 
            message: 'Erro ao atualizar senha.', 
            error: error.message 
        });
    }
};