import admin from "firebase-admin";
import { createRequire } from "module";

// colocamos essa createRequire para permitir usar require() dentro de um projeto que usa import/export
const require = createRequire(import.meta.url);

// credenciais JSON usando require()
const serviceAccount = require("../Keys/serviceAccountKey.json");

let db;

export function initializeFirebase() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  db = admin.firestore();
  console.log("🔥 Firebase inicializado com sucesso!");
}

export function getFirestore() {
  if (!db) throw new Error("Firestore não inicializado");
  return db;
}

export async function verificarToken(token) {
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    return decoded; // retorna o payload do usuário autenticado no Firebase auth
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return null;
  }
}
