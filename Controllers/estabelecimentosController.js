import { estabelecimentosService } from '../Services/estabelecimentosService.js';

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
};

export const listarTop10 = async (req, res) => {
    try {
        const { subcategoriaId } = req.params;
        const top10 = await estabelecimentosService.getTop10(subcategoriaId);
        res.json(top10);
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};