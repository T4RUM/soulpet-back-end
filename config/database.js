import { config } from "dotenv";
config(); // Carrega as variáveis do .env para nossa aplicação

import { Sequelize } from "sequelize";

// Objeto usado na conexão com banco de dados
export const connection = new Sequelize(
  process.env.DB_NAME, // Acessa o valor da variavel DB_NAME
  process.env.DB_USER, // Acessa o valor da variavel DB_USER
  process.env.DB_PASSWORD, // Acessa o valor da variavel DB_PASSWORD
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
  }
);

export async function authenticate(connection) {
  // Tentar a conexão com o banco mysql
  try {
    await connection.authenticate();
    console.log("A conexão foi feita com sucesso!");
  } catch (err) {
    // Se houver algum erro na conexão
    console.log("Um erro aconteceu: ", err);
  }
}

