// export const listarListas = (req, res) => {
  // por enquanto vai retornar exemplo fixo
  // const listas = [
   // { id: 1, nome: "Melhores sorveterias" },
   // { id: 2, nome: "Rolê gastronômico" }
  //];
  //res.json(listas);
//};

//export const criarLista = (req, res) => {
  //const novaLista = req.body;
  // isso vai ser útil para salvar no db futuramente
  //res.status(201).json({ message: "Lista criada!", data: novaLista });
//};

// controller retornando apenas dados criados ou listados: 
// import { criarLista, listarListas } from "../Services/listasService.js";

// export const criarListaController = async (req, res) => {
  //try {
    //const lista = await criarLista(req.body);
    //res.status(201).json(lista);
  //} catch (error) {
    //res.status(500).json({ error: error.message });
  //}
//};

//export const listarListasController = async (req, res) => {
  //try {
    //const listas = await listarListas();
   // res.json(listas);
  //} catch (error) {
    //res.status(500).json({ error: error.message });
  //}
//};
import { criarLista, listarListas } from "../Services/listasService.js";
import { criarOuObterUsuario } from "../Services/userService.js";

// Criar lista
export const criarListaController = async (req, res) => {
  try {
    // Pegando os dados do usuário autenticado pelo Firebase
    const usuario = await criarOuObterUsuario(
      req.user.uid,
      req.user.name,
      req.user.email
    );

    const { nome, estabelecimentos } = req.body;

    const listaId = await criarLista(nome, usuario.id, estabelecimentos);

    res.status(201).json({
      message: "Lista criada com sucesso!",
      listaId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao criar lista. Tente novamente.",
      error: error.message,
    });
  }
};

// Listar listas
export const listarListasController = async (req, res) => {
  try {
    const usuario = await criarOuObterUsuario(
      req.user.uid,
      req.user.name,
      req.user.email
    );

    const listas = await listarListas(usuario.id);

    res.json({
      message: "Listas carregadas com sucesso!",
      data: listas,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erro ao carregar listas. Tente novamente.",
      error: error.message,
    });
  }
};

