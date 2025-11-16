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
    ],
    
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        
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
      }, 
    }, 
    
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  
  apis: ["./Routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}