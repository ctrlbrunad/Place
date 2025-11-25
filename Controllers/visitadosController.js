import { visitadosService } from '../Services/visitadosService.js';

export const toggleVisitadoController = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params;
    const usuarioId = req.user.uid;

    const resultado = await visitadosService.toggleVisitado(usuarioId, estabelecimentoId);
    
    res.status(200).json({ 
      message: `Local marcado como ${resultado.visitado ? 'visitado' : 'não visitado'}.`,
      visitado: resultado.visitado 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMeusVisitadosController = async (req, res) => {
  try {
    const usuarioId = req.user.uid;
    const visitados = await visitadosService.listarMeusVisitados(usuarioId);
    res.status(200).json(visitados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMeusIdsVisitadosController = async (req, res) => {
   try {
    const usuarioId = req.user.uid;
    const ids = await visitadosService.listarIdsVisitados(usuarioId);
    res.status(200).json(Array.from(ids));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}