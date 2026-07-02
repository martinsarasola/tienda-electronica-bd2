const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema(
  {
    cliente: {
      id_cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
        required: [true, "El ID del cliente es obligatorio"],
      },

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

    productos: [
      {
        id_producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: [true, "El ID del producto es obligatorio"],
        },

        nombre: {
          type: String,
          required: [true, "El nombre del producto es obligatorio"],
          trim: true,
        },

        categoria: {
          type: String,
          required: [true, "La categoría del producto es obligatoria"],
          trim: true,
        },

        precio_unitario: {
          type: Number,
          required: [true, "El precio unitario es obligatorio"],
          min: [0, "El precio unitario no puede ser negativo"],
        },

        cantidad: {
          type: Number,
          required: [true, "La cantidad es obligatoria"],
          min: [1, "La cantidad debe ser al menos 1"],
        },

        subtotal: {
          type: Number,
          required: [true, "El subtotal es obligatorio"],
          min: [0, "El subtotal no puede ser negativo"],
        },
      },
    ],

    fecha_pedido: {
      type: Date,
      default: Date.now,
    },

    estado: {
      type: String,
      enum: {
        values: ["pendiente", "enviado", "entregado", "cancelado"],
        message: "El estado debe ser pendiente, enviado, entregado o cancelado",
      },
      default: "pendiente",
    },

    total: {
      type: Number,
      required: [true, "El total del pedido es obligatorio"],
      min: [0, "El total no puede ser negativo"],
    },
  },
  {
    timestamps: true,
  },
);

PedidoSchema.index({ fecha_pedido: 1 });
PedidoSchema.index({ estado: 1 });
PedidoSchema.index({ "cliente.id_cliente": 1 });
PedidoSchema.index({ "productos.id_producto": 1 });
PedidoSchema.index({ "productos.categoria": 1 });

module.exports = mongoose.model("Pedido", PedidoSchema);
