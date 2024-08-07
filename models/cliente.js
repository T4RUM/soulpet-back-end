import { connection } from "../config/database.js";
import { DataTypes } from "sequelize";
import { Endereco } from "./endereco.js";
import { Pets } from "./pet.js";

export const Cliente = connection.define("cliente", {
  nome: {
    type: DataTypes.STRING(130),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  hooks: {
    beforeSave: (cliente) => {
      if (cliente.nome) {
        cliente.nome = cliente.nome.trim();
      }
      if (cliente.email) {
        cliente.email = cliente.email.trim();
      }
      if (cliente.telefone) {
        cliente.telefone = cliente.telefone.trim();
      }
    },
  },
});

// Associação 1:1 (Cliente-Endereço)
Cliente.hasOne(Endereco, { onDelete: "CASCADE" });
Endereco.belongsTo(Cliente);

// Associação 1:N (Cliente-Pets)
Cliente.hasMany(Pets, { onDelete: "CASCADE" });
Pets.belongsTo(Cliente);
