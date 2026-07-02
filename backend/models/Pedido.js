const mongoose = require("mongoose");

const PedidoSchema = new mongoose.Schema(
  {
    cliente: {
      id_cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cliente",
        required: true,
      },

      nombre: {
        type: String,
        required: true,
      },

      correo: {
        type: String,
        required: true,
      },

      telefono: {
        type: String,
      },

      direccion: {
        type: String,
      },
    },

    productos: [
      {
        id_producto: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Producto",
          required: true,
        },

        nombre: {
          type: String,
          required: true,
        },

        categoria: {
          type: String,
          required: true,
        },

        precio_unitario: {
          type: Number,
          required: true,
          min: 0,
        },

        cantidad: {
          type: Number,
          required: true,
          min: 1,
        },

        subtotal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    fecha_pedido: {
      type: Date,
      default: Date.now,
    },

    estado: {
      type: String,
      enum: ["pendiente", "enviado", "entregado", "cancelado"],
      default: "pendiente",
    },

    total: {
      type: Number,
      required: true,
      min: 0,
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
