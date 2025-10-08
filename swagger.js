// swagger.js
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
  },
  apis: ["./Routes/*.js"], // lê os comentários nas rotas
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
