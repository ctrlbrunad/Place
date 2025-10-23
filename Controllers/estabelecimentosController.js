import { estabelecimentosService } from '../Services/estabelecimentosService.js';

/**
 * Rota: GET /estabelecimentos
 * Lista todos os estabelecimentos (para a tela de subcategoria).
 */
export const listarEstabelecimentos = async (req, res) => {
    try {
        const estabelecimentos = await estabelecimentosService.getEstabelecimentos();
        res.json(estabelecimentos);
    } catch (error) {
        res.status(500).json({ 
            message: "Erro ao buscar estabelecimentos.", 
            error: error.message 
        });
    }
}; //

/**
 * Rota: GET /estabelecimentos/top10/:subcategoriaId
 * Lista o ranking Top 10 (para a tela de início).
 */
export const listarTop10 = async (req, res) => {
    try {
        const { subcategoriaId } = req.params;
        const top10 = await estabelecimentosService.getTop10(subcategoriaId);
        res.json(top10);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
}; //


// --- NOVA FUNÇÃO ADICIONADA ---


/**
 * Rota: GET /estabelecimentos/:id
 * Busca os detalhes de UM estabelecimento específico.
 * (Alimenta a tela "Tela Avalia + Salva", ex: "Chapa's Burgers")
 */
export const getEstabelecimentoPorIdController = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Chama o service para buscar o estabelecimento
        const estabelecimento = await estabelecimentosService.getEstabelecimentoPorId(id);
        
        // (O service já trata o erro 'não encontrado', então se chegarmos aqui, está tudo OK)
        
        res.status(200).json(estabelecimento);

    } catch (error) {
        // Se o service retornar "Estabelecimento não encontrado."
        if (error.message === 'Estabelecimento não encontrado.') {
            return res.status(404).json({ message: error.message });
        }
        
        console.error("Erro ao buscar estabelecimento por ID:", error);
        res.status(500).json({ 
            message: "Erro ao buscar detalhes do estabelecimento.", 
            error: error.message 
        });
    }
};