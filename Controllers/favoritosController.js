import { favoritosService } from '../Services/favoritosService.js';

export const toggleFavoritoController = async (req, res) => {
  try {
    const { estabelecimentoId } = req.params;
    const usuarioId = req.user.uid;

    const resultado = await favoritosService.toggleFavorito(usuarioId, estabelecimentoId);
    
    res.status(200).json({ 
      message: `Favorito ${resultado.favoritado ? 'adicionado' : 'removido'}.`,
      favoritado: resultado.favoritado 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMeusFavoritosController = async (req, res) => {
  try {
    const usuarioId = req.user.uid;
    const favoritos = await favoritosService.listarMeusFavoritos(usuarioId);
    res.status(200).json(favoritos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller para a otimização
export const getMeusIdsFavoritosController = async (req, res) => {
   try {
    const usuarioId = req.user.uid;
    const ids = await favoritosService.listarIdsFavoritos(usuarioId);
    res.status(200).json(Array.from(ids)); // Converte o Set em Array
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}