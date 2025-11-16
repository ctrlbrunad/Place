import { estabelecimentosService } from '../Services/estabelecimentosService.js';

/**
 * Rota: GET /estabelecimentos
 * Lista todos os estabelecimentos (para a tela de subcategoria).
 */
export const listarEstabelecimentos = async (req, res) => {
    
    const { search } = req.query; 

    console.log(`>>> ${new Date().toISOString()} - ROTA GET /estabelecimentos FOI CHAMADA! (Busca: ${search})`); 
    try {
    
        const estabelecimentos = await estabelecimentosService.getEstabelecimentos(search);
        res.json(estabelecimentos);
    } catch (error) {

    }
};

/**
 * Rota: GET /estabelecimentos/top10/:subcategoriaId
 * Lista o ranking Top 10 (para a tela de início).
 */
export const listarTop10 = async (req, res) => {
    const { subcategoriaId } = req.params;
    console.log(`>>> ${new Date().toISOString()} - ROTA GET /estabelecimentos/top10/${subcategoriaId} FOI CHAMADA!`);

    try {
        const top10 = await estabelecimentosService.getTop10(subcategoriaId); 
        res.json(top10);
    } catch (error) {
        console.error(`!!! Erro em listarTop10 para ${subcategoriaId}: ${error.message}`);
        res.status(500).json({ 
            message: `Erro ao buscar Top 10 para ${subcategoriaId}.`, // Mensagem mais específica
            error: error.message 
        });
    }
}; //

/**
 * Rota: GET /estabelecimentos/:id
 * Busca os detalhes de UM estabelecimento específico.
 */
export const getEstabelecimentoPorIdController = async (req, res) => {

    const { id } = req.params;
    console.log(`>>> ${new Date().toISOString()} - ROTA GET /estabelecimentos/${id} FOI CHAMADA!`);
   
    try {
        const estabelecimento = await estabelecimentosService.getEstabelecimentoPorId(id);
        
        res.status(200).json(estabelecimento);

    } catch (error) {
        console.error(`!!! Erro em getEstabelecimentoPorId para ${id}: ${error.message}`);
        if (error.message === 'Estabelecimento não encontrado.') {
            return res.status(404).json({ message: error.message });
        }
        
        res.status(500).json({ 
            message: "Erro ao buscar detalhes do estabelecimento.", 
            error: error.message 
        });
    }
};