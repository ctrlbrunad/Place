import express from "express";
import cors from "cors";
import estabelecimentosRoutes from "./Routes/estabelecimentosRoutes.js";
import listasRoutes from "./Routes/listasRoutes.js";
import reviewsRoutes from "./Routes/reviewsRoutes.js";
import sugestoesRoutes from "./Routes/sugestoesRoutes.js";
import sugestoesAdminRoutes from "./Routes/sugestoesAdminRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import estabelecimentosAdminRoutes from "./Routes/estabelecimentosAdminRoutes.js";
import favoritosRoutes from "./Routes/favoritosRoutes.js"; 
import visitadosRoutes from "./Routes/visitadosRoutes.js";

// IMPORTA O SWAGGER
import { setupSwagger } from "./swagger.js";

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());

// ATIVA O SWAGGER
setupSwagger(app);

// --- Rotas ---
app.use("/auth", authRoutes); 
app.use("/users", userRoutes); 
app.use("/estabelecimentos", estabelecimentosRoutes);
app.use("/listas", listasRoutes);
app.use("/reviews", reviewsRoutes);
app.use("/sugestoes", sugestoesRoutes);
app.use("/admin/estabelecimentos", estabelecimentosAdminRoutes);
app.use("/admin/sugestoes", sugestoesAdminRoutes);
app.use("/favoritos", favoritosRoutes); 
app.use("/visitados", visitadosRoutes);


app.get("/", (req, res) => {
  res.send("API do Place funcionando!");
});

app.listen(PORT, '0.0.0.0', () => { 
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`📄 Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
});