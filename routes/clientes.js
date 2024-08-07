import { Cliente } from "../models/cliente.js";
import { Endereco } from "../models/endereco.js";
import { Router } from "express";

// Criar o módulo de rotas
export const clientesRouter = Router();

// Listagem de todos os clientes

clientesRouter.get("/clientes", async (req, resp) => {
  // SELECT * FROM clientes;
  const listaClientes = await Cliente.findAll();
  // Array que vai ser retornado os clientes (poderia ser qualquer nome (Lista Clientes))
  // Utilizamos .json ao invez de send para que ele não precise fazer a validação e ir mais rapido
  resp.json(listaClientes);
});

// Listagem de um cliente especifico (ID = ?)
// :id => Parametro de rota
// Código para testar as buscas com id
// console.log(req.params.id);
// resp.send("Clientes " + req.params.id);

clientesRouter.get("/clientes/:id", async (req, resp) => {
  // SELECT * FROM clientes WHERE id = 1
  const cliente = await Cliente.findOne({
    where: { id: req.params.id },
    include: [Endereco], // Vai juntar os dados do cliente com seu respectivo endereço
  });
  if (cliente) {
    resp.json(cliente);
  } else {
    resp.status(404).json({ message: "Cliente não encontrado" });
  }
});

// DEBUG
//console.log(req.body); // Dados do corpo da requisição
// resp.json("Resposta");

clientesRouter.post("/clientes", async (req, resp) => {
  // Extraimos os dados do body que serão usados na inserção (Desestruturação)
  const { nome, email, telefone, endereco } = req.body;
  try {
    // Tentativa de insirir o cliente
    await Cliente.create(
      {
        nome,
        email,
        telefone,
        endereco,
      },
      { include: Endereco } // Indicamos que o endereço será salvo e associado ao cliente
    );
    resp.status(201).json({ message: "Cliente criado com sucesso." });
  } catch (err) {
    // podemos dar um console.log(err) para verificar por que deu o erro se foi dados que ja existem no banco e estão como UNIQUE ou NOTNULL dentre outros problema que podem ocorrer
    // Tratamento caso ocorra algum erro
    // 500 -> Internal Error (Lado do servidor)
    resp.status(500).json({ message: "Um erro ocorreu ao inserir o cliente." });
  }
});

clientesRouter.put("/clientes/:id", async (req, resp) => {
  // Um async serve para toda a função, por isso só definimos aqui
  // Verifica se estamos pegando os dados
  // console.log(req.params); // Vamos precisar do dado do ID
  // console.log(req.body); // Vamos precisar dos dados do Body também
  // Checar se o cliente existe

  const idCLiente = req.params.id;
  const { nome, email, telefone, endereco } = req.body;

  try {
    const cliente = await Cliente.findOne({ where: { id: idCLiente } });
    if (cliente) {
      // Seguir com a atualização
      // Atualiza a linha do endereço que for igual o ID do cliente sendo atualizado
      await Endereco.update(endereco, { where: { clienteID: idCLiente } });
      await cliente.update({ nome, email, telefone });
      resp.json({ message: "Cliente atualizado" });
    } else {
      // 404
      resp.status(404).json({ message: "O cliente não encontrado" });
    }
  } catch (err) {
    resp
      .status(500)
      .json({ message: "Ocorreu um erro ao atualizar o cliente." });
  }
});

clientesRouter.delete("/clientes/:id", async (req, resp) => {
  const idCliente = req.params.id;

  try {
    const cliente = await Cliente.findOne({ where: { id: idCliente } });
    if (cliente) {
      // Apagar o cliente
      await cliente.destroy();
      resp.json({ message: "Cliente removido com sucesso." });
    } else {
      resp.status(404).json({ message: "Cliente não encontrado." });
    }
  } catch (err) {
    resp.status(500).json({ message: "Ocorreu um erro ao deletar o cliente." });
  }
});
