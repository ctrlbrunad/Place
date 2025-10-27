// /Controllers/sugestoesController.js (CORRIGIDO)

import sugestoesService from '../Services/sugestoesService.js';

class SugestoesController {
  async criarSugestao(req, res) {
    try {
      // CORREÇÃO 1: Ler 'subcategoria' (não 'subcategoriaId')
      const { nome, endereco, subcategoria } = req.body; 
      const usuarioId = req.user.uid;

      // CORREÇÃO 2: Validar 'subcategoria' (não 'subcategoriaId')
      if (!nome || !endereco || !subcategoria) { 
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
      }

      // CORREÇÃO 3: Passar 'subcategoria' (que agora existe)
      const novaSugestao = await sugestoesService.criarSugestao({
        nome,
        endereco,
        subcategoria, 
        usuarioId // <-- Você esqueceu de passar isso!
      });

      res.status(201).json(novaSugestao);
    } catch (error) {
      console.error('Erro ao criar sugestão:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}

export default new SugestoesController();