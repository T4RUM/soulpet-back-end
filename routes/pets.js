import { Pets } from "../models/pet.js";
import { Cliente } from "../models/cliente.js";
import { Router } from "express";

// Criar o módulo de rotas
export const petsRouters = Router();

// Criar os endpoints no backend:
// Listar todos os pets

petsRouters.get("/pets", async (req, resp) => {
  const listaPets = await Pets.findAll({
    include: [{ model: Cliente, attributes: ["id", "nome"] }],
  });
  resp.json(listaPets);
});

// Listar um pet específico
petsRouters.get("/pets/:id", async (req, resp) => {
  const listaPet = await Pets.findOne({
    where: { id: req.params.id },
    // PROJEÇÃO
    attributes: { exclude: ["createdAt", "updatedAt"] }, // Aqui estamos removendo atributos dentro do objeto pet
    include: [{ model: Cliente, attributes: ["id", "nome"] }], // Aqui eu falo que vai ser mostrado apenas
    // include: [{ model: Cliente, attributes: {exclude: ["senha"]} }], Desa maneira eu retiro apenas um obejeto
  });
  if (listaPet) {
    resp.json(listaPet);
  } else {
    resp.status(404).json({ message: "Pet não encontrado" });
  }
});

// Deletar um Pet Especifico
petsRouters.delete("/pets/:id", async (req, resp) => {
  const idPet = req.params.id;

  try {
    const pet = await Pets.findOne({ where: { id: idPet } });
    if (pet) {
      await pet.destroy();
      resp.json({ message: "Pet removido com sucesso." });
    } else {
      resp.status(404).json({ message: "Pet não encontrado." });
    }
  } catch {
    resp.status(500).json({ message: "Ocorreu um erro ao deletar o Pet." });
  }
});

// [POST] / pets -> Inserir um novo pet (É necessario ter um cliente para inserir um pet, quem depende de quem?)
petsRouters.post("/pets/", async (req, resp) => {
  const { nome, tipo, porte, dataNasc, clienteId } = req.body;
  try {
    const cliente = await Cliente.findByPk(clienteId);
    if (cliente) {
      await Pets.create({ nome, tipo, porte, dataNasc, clienteId });
      resp.json({ message: "Pet adicionado com sucesso." });
    } else {
      resp.status(404).json({ message: "Dono do pet não encontrado." });
    }
  } catch {
    resp.status(500).json({ message: "Ocorreu um erro ao adicionar o Pet." });
  }
});

// [PUT] /pets/:id -> Atualizar um pet

petsRouters.put("/pets/:id", async (req, resp) => {
  const { nome, tipo, porte, dataNasc } = req.body;

  try {
    const pet = await Pets.findByPk(req.params.id);
    if (pet) {
      await pet.update({ nome, tipo, porte, dataNasc });
      resp.json({ message: "Pet atualizado com sucesso!" });
    } else {
      resp.status(404).json({ message: "Pet não encontrado." });
    }
  } catch {
    resp
      .status(500)
      .json({ message: "Ocorreu um erro ao atualizar os dados do Pet." });
  }
});
