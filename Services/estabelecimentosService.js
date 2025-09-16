import { getFirestore } from "./firebaseService.js";

export async function getEstabelecimentos() {
  const db = getFirestore();
  const snapshot = await db.collection("estabelecimentos").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function getTop10(subcategoriaId) {
  const db = getFirestore();
  const snapshot = await db.collection("estabelecimentos")
    .where("subcategoriaId", "==", subcategoriaId)
    .orderBy("rating", "desc")
    .limit(10)
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
