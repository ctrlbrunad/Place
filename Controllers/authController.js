import { authService } from '../Services/authService.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'SUA_CHAVE_SECRETA_MUITO_FORTE_AQUI'; 

/**
 * Controller para registrar um novo usuário.
 * Rota: POST /auth/register
 */
export const registerController = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // 1. Validação básica de entrada
        if (!nome || !email || !senha) {
            return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
        }

        // 2. Verificar se o usuário já existe (o service fará isso)
        const existingUser = await authService.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Este email já está em uso.' });
        }

        // 3. Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);

        // 4. Chamar o service para criar o usuário no banco
        const novoUsuario = await authService.createUser({
            nome,
            email,
            senha: senhaHash, 
        }); 

        
        res.status(201).json({
            message: 'Usuário registrado com sucesso!',
            usuarioId: novoUsuario.id,
        });

    } catch (error) {
        console.error('Erro no registerController:', error);
        res.status(500).json({ 
            message: 'Erro ao registrar usuário.', 
            error: error.message 
        });
    }
};

/**
 * Controller para autenticar (logar) um usuário.
 * Rota: POST /auth/login
 */
export const loginController = async (req, res) => {
    try {
        const { email, senha } = req.body;

        // 1. Validação básica
        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
        }

        // 2. Buscar o usuário no banco
        const usuario = await authService.findUserByEmail(email);
        if (!usuario) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

       
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        const payload = {
            uid: usuario.id,
            email: usuario.email,
        };

        const token = jwt.sign(
            payload, 
            JWT_SECRET, 
            { expiresIn: '7d' } 
        );

        res.status(200).json({
            message: 'Login bem-sucedido!',
            token: token,
            usuario: { 
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (error) {
        console.error('Erro no loginController:', error);
        res.status(500).json({ 
            message: 'Erro ao tentar fazer login.', 
            error: error.message 
        });
    }
};