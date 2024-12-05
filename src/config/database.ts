import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../modules/users/user.entity";
import { env } from "./env";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  synchronize: env.NODE_ENV === 'development', // Apenas em desenvolvimento
  // logging: env.NODE_ENV === 'development',
  logging: false,
  entities: [User],
  migrations: ["src/migrations/*.ts"],
});