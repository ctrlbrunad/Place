import { listasService } from "../Services/listasService.js";

export const listarListasController = async (req, res) => {
    try {
        const listas = await listasService.listarListas(req.user.uid);
        res.json(listas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

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
};

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
};

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
};

export const deletarListaController = async (req, res) => {
    try {
        const { listaId } = req.params;
        const { uid } = req.user;

        await listasService.deletarLista(listaId, uid);

        res.status(200).json({ message: "Lista deletada com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};