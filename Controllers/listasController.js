import { listasService } from "../Services/listasService.js";

/**
 * Rota: GET /listas
 * Retorna as listas criadas pelo usuário logado.
 */
export const listarListasController = async (req, res) => {
    try {
        // Agora o service 'listarListas' (modificado)
        // buscará apenas as listas do usuário logado.
        const listas = await listasService.listarListas(req.user.uid);
        res.json(listas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; //

/**
 * Rota: POST /listas
 * Cria uma nova lista.
 */
export const criarListaController = async (req, res) => {
    try {
        const { nome, publica, estabelecimentos } = req.body;
        const lista = await listasService.criarLista({ 
            usuarioId: req.user.uid, 
            nome, 
            publica, 
            estabelecimentos 
        });
        res.status(201).json(lista);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; //

/**
 * Rota: POST /listas/:listaId/estabelecimentos
 * Adiciona um estabelecimento a uma lista.
 */
export const adicionarEstabelecimentoController = async (req, res) => {
    try {
        const { listaId } = req.params;
        const { estabelecimentoId } = req.body;
        const { uid } = req.user;

        await listasService.adicionarEstabelecimento(listaId, estabelecimentoId, uid);

        res.status(200).json({ message: "Estabelecimento adicionado com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erro ao adicionar estabelecimento. Tente novamente.",
            error: error.message,
        });
    }
}; //

/**
 * Rota: DELETE /listas/:listaId/estabelecimentos/:estabelecimentoId
 * Remove um estabelecimento de uma lista.
 */
export const removerEstabelecimentoController = async (req, res) => {
    try {
        const { listaId, estabelecimentoId } = req.params;
        const { uid } = req.user;

        await listasService.removerEstabelecimento(listaId, estabelecimentoId, uid);

        res.status(200).json({ message: "Estabelecimento removido com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Erro ao remover estabelecimento. Tente novamente.",
            error: error.message,
        });
    }
}; //

/**
 * Rota: DELETE /listas/:listaId
 * Deleta uma lista inteira.
 */
export const deletarListaController = async (req, res) => {
    try {
        const { listaId } = req.params;
        const { uid } = req.user;

        await listasService.deletarLista(listaId, uid);

        res.status(200).json({ message: "Lista deletada com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; //


// --- NOVAS FUNÇÕES ADICIONADAS ---


/**
 * Rota: GET /listas/:listaId
 * Controller para buscar detalhes de UMA lista específica.
 */
export const getDetalhesDaListaController = async (req, res) => {
    try {
        const { listaId } = req.params;
        const { uid: usuarioId } = req.user; // ID do usuário logado

        // Chama o novo service
        const lista = await listasService.getDetalhesDaLista(listaId, usuarioId);
        
        res.status(200).json(lista);

    } catch (error) {
        // Trata erros comuns, como "Lista não encontrada" ou "Não autorizado"
        if (error.message === 'Lista não encontrada.' || error.message === 'Não autorizado.') {
            return res.status(404).json({ message: error.message });
        }
        
        console.error("Erro ao buscar detalhes da lista:", error);
        res.status(500).json({ 
            message: "Erro ao buscar detalhes da lista.", 
            error: error.message 
        });
    }
};

/**
 * Rota: GET /listas/public
 * Controller para buscar todas as listas públicas (para aba "Explorar").
 */
export const listarListasPublicasController = async (req, res) => {
    try {
        // Chama o novo service
        const listas = await listasService.listarListasPublicas();
        res.status(200).json(listas);
    } catch (error) {
        console.error("Erro ao listar listas públicas:", error);
        res.status(500).json({ 
            message: "Erro ao listar listas públicas.", 
            error: error.message 
        });
    }
};