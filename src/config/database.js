import dotenv from 'dotenv';
dotenv.config();
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "microservice",
  process.env.DB_USER || "app",
  process.env.DB_PASSWORD || "app",
  {
    host: process.env.DB_HOST || "db",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    dialect: "mysql",
    logging: false,
  }
);

export default sequelize;