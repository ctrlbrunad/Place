import {
    createEstabelecimento as createEstabelecimentoService,
    updateEstabelecimento as updateEstabelecimentoService,
    deleteEstabelecimento as deleteEstabelecimentoService
} from '../Services/estabelecimentosAdminService.js';

export const createEstabelecimento = async (req, res) => {
    try {
        const estabelecimento = await createEstabelecimentoService(req.body);
        res.status(201).json(estabelecimento);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateEstabelecimento = async (req, res) => {
    try {
        const estabelecimento = await updateEstabelecimentoService(req.params.id, req.body);
        res.status(200).json(estabelecimento);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteEstabelecimento = async (req, res) => {
    try {
        await deleteEstabelecimentoService(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};