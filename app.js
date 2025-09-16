import express from "express";
import cors from "cors";
import { initializeFirebase } from "./Services/firebaseService.js";
import estabelecimentosRoutes from "./Routes/estabelecimentosRoutes.js";
import listasRoutes from "./Routes/listasRoutes.js";
import reviewsRoutes from "./Routes/reviewsRoutes.js";

// IMPORTA O SWAGGER
import { setupSwagger } from "./swagger.js";

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// inicializa Firebase
initializeFirebase();

// ATIVA O SWAGGER
setupSwagger(app); // <-- adiciona isso

// rotas
import authRoutes from "./Routes/authRoutes.js";
// essas são as rotas utilizadas atualmente
app.use("/auth", authRoutes); // 👈 NOVA ROTA
app.use("/estabelecimentos", estabelecimentosRoutes);
app.use("/listas", listasRoutes);
app.use("/reviews", reviewsRoutes);


app.get("/", (req, res) => {
  res.send("API do Rankify funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`📄 Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
});
