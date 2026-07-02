const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del cliente es obligatorio"],
      trim: true,
    },

    correo: {
      type: String,
      required: [true, "El correo del cliente es obligatorio"],
      trim: true,
      lowercase: true,
      unique: true,
    },

    telefono: {
      type: String,
      trim: true,
    },

    direccion: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

ClienteSchema.index({ correo: 1 });

module.exports = mongoose.model("Cliente", ClienteSchema);
