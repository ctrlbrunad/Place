// /swagger.js (VERSÃO FINAL)
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Place API",
      version: "1.0.0",
      description: "API para gerenciar listas, reviews e estabelecimentos",
    },

    // --- DEFINIÇÃO DAS TAGS ---
    // Centraliza as "categorias" da sua API
    tags: [
      {
        name: "Auth",
        description: "Endpoints de Autenticação (Cadastro e Login)"
      },
      {
        name: "Listas",
        description: "API para gerenciamento de listas de estabelecimentos"
      },
      {
        name: "Reviews",
        description: "Endpoints para criar e listar avaliações"
      }
      // Adicione outras tags aqui (ex: "Estabelecimentos", "Usuários")
    ],
    
    // --- COMPONENTS SECTION ---
    // Contém a definição de segurança E todos os schemas
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // Schemas do Auth
        NovoUsuario: {
          type: "object",
          required: ["nome", "email", "senha"],
          properties: {
            nome: { type: "string" },
            email: { type: "string" },
            senha: { type: "string", format: "password" },
          },
        },
        LoginUsuario: {
          type: "object",
          required: ["email", "senha"],
          properties: {
            email: { type: "string" },
            senha: { type: "string", format: "password" },
          },
        },
        TokenResposta: {
          type: "object",
          properties: {
            message: { type: "string" },
            token: { type: "string" },
            usuario: { type: "object" },
          },
        },
        // Schemas das Listas
        Lista: {
          type: "object",
          properties: {
            id: { type: "integer" },
            nome: { type: "string" },
            publica: { type: "boolean" },
            estabelecimentos: { type: "array", items: { type: "string" } },
          },
        },
        NovaLista: {
          type: "object",
          required: ["nome", "publica"],
          properties: {
            nome: { type: "string" },
            publica: { type: "boolean" },
            estabelecimentos: { type: "array", items: { type: "string" } },
          },
        },
      }, // Fim de schemas
    }, // Fim de components
    
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  
  // Voltamos ao padrão "glob" que é mais simples
  // Agora vai funcionar pois não há mais conflitos
  apis: ["./Routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}