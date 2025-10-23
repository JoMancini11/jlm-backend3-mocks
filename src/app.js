import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

import mocksRouter from "./routes/mocks.router.js";
import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionRouter from "./routes/adoption.router.js";

const app = express();
app.use(express.json());

// Swagger (documentamos Users y Mocks por JSDoc en routes/*.js)
const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Backend 3 API",
      version: "1.0.0",
      description: "Documentación Swagger del módulo Users y endpoints de Mocks"
    },
    servers: [{ url: "/api" }]
  },
  apis: ["./src/routes/*.js"]
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routers
app.use("/api/mocks", mocksRouter);
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoption", adoptionRouter);

// Health
app.get("/health", (_req, res) => res.status(200).json({ ok: true }));

// Error handler
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ status: "error", message: err.message, path: req.originalUrl });
});

export default app;
