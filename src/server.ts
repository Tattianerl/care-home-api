import express from "express";
import cors from "cors";
import { authRoutes } from "./routes/auth.routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

const app = express();

app.use(cors({
  origin: "*", 
  exposedHeaders: ["Content-Disposition"] // Libera o cabeçalho para o Axios ler o nome do arquivo
}));

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (request, response) => {
  return response.json({
    message: "API funcionando 🚀",
  });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});