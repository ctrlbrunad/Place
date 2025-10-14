import sugestoesService from '../Services/sugestoesService.js';

class SugestoesAdminController {
  async listarPendentes(req, res) {
    try {
      const sugestoes = await sugestoesService.listarSugestoesPendentes();
      res.status(200).json(sugestoes);
    } catch (error) {
      console.error('Erro ao listar sugestões pendentes:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async aprovar(req, res) {
    try {
      const { id } = req.params;
      const sugestaoAprovada = await sugestoesService.aprovarSugestao(id);
      res.status(200).json(sugestaoAprovada);
    } catch (error) {
      console.error('Erro ao aprovar sugestão:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }

  async rejeitar(req, res) {
    try {
      const { id } = req.params;
      const sugestaoRejeitada = await sugestoesService.rejeitarSugestao(id);
      res.status(200).json(sugestaoRejeitada);
    } catch (error) {
      console.error('Erro ao rejeitar sugestão:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  }
}

export default new SugestoesAdminController();
