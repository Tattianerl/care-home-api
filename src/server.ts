import express from "express";
import { authRoutes } from "./routes/auth.routes";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

const app = express();

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use(express.json());
app.use(
  "/files",
  express.static(
    path.resolve(__dirname, "../uploads")
  )
);
app.use("/auth", authRoutes);

app.get("/", (request, response) => {
  return response.json({
    message: "API funcionando 🚀",
  });
});

app.listen(3333, () => {
  console.log("Servidor rodando na porta 3333");
});