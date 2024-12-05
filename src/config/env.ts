import dotenv from "dotenv";
import path from "path";

// Carrega o arquivo .env
dotenv.config({ path: path.join(__dirname, "../../.env") });

export const env = {
  // Servidor
  PORT: parseInt(process.env.PORT || "3000"),
  NODE_ENV: process.env.NODE_ENV || "development",

  // Banco de dados
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: parseInt(process.env.DB_PORT || "5432"),
  DB_USERNAME: process.env.DB_USERNAME || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
  DB_DATABASE: process.env.DB_DATABASE || "database",
};
