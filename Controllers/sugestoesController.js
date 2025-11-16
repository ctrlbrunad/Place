import sugestoesService from '../Services/sugestoesService.js';

class SugestoesController {
  async criarSugestao(req, res) {
    try {

      const { nome, endereco, subcategoria } = req.body; 
      const usuarioId = req.user.uid;

      if (!nome || !endereco || !subcategoria) { 
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
      }

      const novaSugestao = await sugestoesService.criarSugestao({
        nome,
        endereco,
        subcategoria, 
        usuarioId 
      });

      res.status(201).json(novaSugestao);
    } catch (error) {
      console.error('Erro ao criar sugestão:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}

export default new SugestoesController();