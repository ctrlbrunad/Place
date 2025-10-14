import { getFirestore } from "./firebaseService.js";

const getCollection = () => getFirestore().collection("estabelecimentos");

export const estabelecimentosService = {
  async getEstabelecimentos() {
    const snapshot = await getCollection().get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async getTop10(subcategoriaId) {
    const snapshot = await getCollection()
      .where("subcategoriaId", "==", subcategoriaId)
      .orderBy("rating", "desc")
      .limit(10)
      .get();

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },
};