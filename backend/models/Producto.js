const mongoose = require("mongoose");

const ProductoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [100, "El nombre no puede superar los 100 caracteres"],
    },

    descripcion: {
      type: String,
      trim: true,
      maxlength: [500, "La descripción no puede superar los 500 caracteres"],
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
      minlength: [2, "La categoría debe tener al menos 2 caracteres"],
      maxlength: [80, "La categoría no puede superar los 80 caracteres"],
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

ProductoSchema.index({ categoria: 1 });
ProductoSchema.index({ nombre: 1 });
ProductoSchema.index({ stock: 1 });
ProductoSchema.index({ activo: 1 });

module.exports = mongoose.model("Producto", ProductoSchema);
