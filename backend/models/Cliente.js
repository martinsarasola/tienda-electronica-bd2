const mongoose = require("mongoose");

const ClienteSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del cliente es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [100, "El nombre no puede superar los 100 caracteres"],
    },

    correo: {
      type: String,
      required: [true, "El correo del cliente es obligatorio"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "El correo electrónico no tiene un formato válido",
      ],
    },

    telefono: {
      type: String,
      trim: true,
      maxlength: [30, "El teléfono no puede superar los 30 caracteres"],
    },

    direccion: {
      type: String,
      trim: true,
      maxlength: [200, "La dirección no puede superar los 200 caracteres"],
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

ClienteSchema.index({ nombre: 1 });
ClienteSchema.index({ activo: 1 });

module.exports = mongoose.model("Cliente", ClienteSchema);
