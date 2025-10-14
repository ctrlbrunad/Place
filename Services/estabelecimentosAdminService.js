import { getFirestore } from "./firebaseService.js";

const getCollection = () => getFirestore().collection("estabelecimentos");

export const createEstabelecimento = async (estabelecimentoData) => {
    const docRef = await getCollection().add(estabelecimentoData);
    return { id: docRef.id, ...estabelecimentoData };
};

export const updateEstabelecimento = async (id, estabelecimentoData) => {
    await getCollection().doc(id).update(estabelecimentoData);
    return { id, ...estabelecimentoData };
};

export const deleteEstabelecimento = async (id) => {
    await getCollection().doc(id).delete();
};
