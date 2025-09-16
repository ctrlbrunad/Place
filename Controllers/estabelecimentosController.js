import { getEstabelecimentos, getTop10 } from "../Services/estabelecimentosService.js";

export async function listarEstabelecimentos(req, res) {
  try {
    const estabelecimentos = await getEstabelecimentos();
    res.json(estabelecimentos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

export async function listarTop10(req, res) {
  try {
    const { subcategoriaId } = req.params;
    const top10 = await getTop10(subcategoriaId);
    res.json(top10);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}
