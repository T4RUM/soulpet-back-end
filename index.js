import { connection, authenticate } from "./config/database.js";
import express from "express";
import { clientesRouter } from "./routes/clientes.js";
import { petsRouters } from "./routes/pets.js";
import cors from "cors";

authenticate(connection).then(() => {
  // Após conectar no banco de dados, ele irá sincronizar os models
  // no banco, ou seja, irá gerar as tabelas caso necessário

  // // force: true -> irá dropar tudo e criar do zero novamente (É uma opção util quando estamos em um ambiente de desenvolvimetno)
  // connection.sync({ force: true });
  connection.sync();
});

// Definir a aplicação backend em Express
// Recursos pré-configurados
const app = express();

// Garantir que todas requisições que tem body sejam lidas como JSON
app.use(express.json());


// Configuração do CORS / Em origin coloque a URL do Front-End
app.use(cors({origin: "http://localhost:5173"}))


// Definir os endpoints do backend
app.use(clientesRouter);
app.use(petsRouters);

// Rodar a aplicação backend
app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000/");
});

// Métodos: GET (Leitura), POST(Inserção), PUT(Altereção), DELETE (Remoção)
// // (Estou explicitando nessa função anonima os objetos do express/get que vou utilizar ) [ req e resp -> get -> express]
// app.get("/hello", (req, resp) => {
//   // Manipulador de rota
//   resp.send("Hello World!!"); // Enviando a resposta para quem solicitou
// });
