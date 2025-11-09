// /Controllers/estabelecimentosController.js (COM CONSOLE.LOG ADICIONADO)

import { estabelecimentosService } from '../Services/estabelecimentosService.js';

/**
 * Rota: GET /estabelecimentos
 * Lista todos os estabelecimentos (para a tela de subcategoria).
 */
export const listarEstabelecimentos = async (req, res) => {
    // 1. Pega o parâmetro de busca da URL (ex: ?search=barto)
    const { search } = req.query; 

    console.log(`>>> ${new Date().toISOString()} - ROTA GET /estabelecimentos FOI CHAMADA! (Busca: ${search})`); 
    try {
        // 2. Passa o termo de busca para o service
        const estabelecimentos = await estabelecimentosService.getEstabelecimentos(search);
        res.json(estabelecimentos);
    } catch (error) {
        // ... (seu 'catch' existente)
    }
};

/**
 * Rota: GET /estabelecimentos/top10/:subcategoriaId
 * Lista o ranking Top 10 (para a tela de início).
 */
export const listarTop10 = async (req, res) => {
    // --- ADICIONADO PARA DEBUG ---
    const { subcategoriaId } = req.params;
    console.log(`>>> ${new Date().toISOString()} - ROTA GET /estabelecimentos/top10/${subcategoriaId} FOI CHAMADA!`);
    // --------------------------
    try {
        // Passa o parâmetro para o service
        const top10 = await estabelecimentosService.getTop10(subcategoriaId); 
        res.json(top10);
    } catch (error) {
         // Loga o erro no backend também
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
    // --- ADICIONADO PARA DEBUG ---
    const { id } = req.params;
    console.log(`>>> ${new Date().toISOString()} - ROTA GET /estabelecimentos/${id} FOI CHAMADA!`);
    // --------------------------
    try {
        const estabelecimento = await estabelecimentosService.getEstabelecimentoPorId(id);
        
        res.status(200).json(estabelecimento);

    } catch (error) {
        // Loga o erro no backend também
        console.error(`!!! Erro em getEstabelecimentoPorId para ${id}: ${error.message}`);
        // Se o service retornar "Estabelecimento não encontrado."
        if (error.message === 'Estabelecimento não encontrado.') {
            return res.status(404).json({ message: error.message });
        }
        
        res.status(500).json({ 
            message: "Erro ao buscar detalhes do estabelecimento.", 
            error: error.message 
        });
    }
};