import express from "express";
import cors from "cors";

// --- Imports de Rotas (Todos juntos no topo) ---
import estabelecimentosRoutes from "./Routes/estabelecimentosRoutes.js";
import listasRoutes from "./Routes/listasRoutes.js";
import reviewsRoutes from "./Routes/reviewsRoutes.js";
import sugestoesRoutes from "./Routes/sugestoesRoutes.js";
import sugestoesAdminRoutes from "./Routes/sugestoesAdminRoutes.js";
import authRoutes from "./Routes/authRoutes.js"; // <-- Importado SÓ UMA VEZ
import userRoutes from "./Routes/userRoutes.js";
import estabelecimentosAdminRoutes from "./Routes/estabelecimentosAdminRoutes.js"; // <-- Movido para cá

// IMPORTA O SWAGGER
import { setupSwagger } from "./swagger.js";

const app = express();
const PORT = process.env.PORT || 3000;

// middlewaresnpm install uuid
app.use(cors());
app.use(express.json());

// ATIVA O SWAGGER
setupSwagger(app);

// --- Rotas ---
app.use("/auth", authRoutes); 
app.use("/users", userRoutes); // <-- ADICIONADO (para as rotas de perfil)
app.use("/estabelecimentos", estabelecimentosRoutes);
app.use("/listas", listasRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/sugestoes", sugestoesRoutes);
app.use("/admin/estabelecimentos", estabelecimentosAdminRoutes);
app.use("/admin/sugestoes", sugestoesAdminRoutes);


app.get("/", (req, res) => {
  res.send("API do Place funcionando!");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`📄 Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
});