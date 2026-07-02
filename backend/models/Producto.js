const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
    },

    descripcion: {
      type: String,
      trim: true,
    },

    precio: {
      type: Number,
      required: [true, "El precio del producto es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },

    stock: {
      type: Number,
      required: [true, "El stock del producto es obligatorio"],
      min: [0, "El stock no puede ser negativo"],
      default: 0,
    },

    categoria: {
      type: String,
      required: [true, "La categoría del producto es obligatoria"],
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

ProductoSchema.index({ categoria: 1 });
ProductoSchema.index({ nombre: 1 });

module.exports = mongoose.model("Producto", ProductoSchema);
