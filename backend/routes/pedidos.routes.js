const express = require("express");
const Cliente = require("../models/Cliente");
const Producto = require("../models/Producto");
const Pedido = require("../models/Pedido");

const router = express.Router();

/*
  POST /api/pedidos
  Crear un pedido y descontar stock automáticamente
*/
router.post("/", async (req, res) => {
  try {
    const { clienteId, productos } = req.body;

    if (!clienteId) {
      return res.status(400).json({
        mensaje: "El clienteId es obligatorio",
      });
    }

    if (!productos || !Array.isArray(productos) || productos.length === 0) {
      return res.status(400).json({
        mensaje: "El pedido debe tener al menos un producto",
      });
    }

    const clienteEncontrado = await Cliente.findById(clienteId);

    if (!clienteEncontrado) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado",
      });
    }

    const productosDelPedido = [];
    let totalPedido = 0;

    for (const item of productos) {
      const { productoId, cantidad } = item;

      if (!productoId) {
        return res.status(400).json({
          mensaje: "Cada producto debe tener un productoId",
        });
      }

      if (!cantidad || cantidad <= 0) {
        return res.status(400).json({
          mensaje: "La cantidad debe ser mayor a 0",
        });
      }

      const productoEncontrado = await Producto.findById(productoId);

      if (!productoEncontrado) {
        return res.status(404).json({
          mensaje: `Producto no encontrado: ${productoId}`,
        });
      }

      if (productoEncontrado.stock < cantidad) {
        return res.status(400).json({
          mensaje: `Stock insuficiente para el producto: ${productoEncontrado.nombre}`,
          stockDisponible: productoEncontrado.stock,
          cantidadSolicitada: cantidad,
        });
      }

      const subtotal = productoEncontrado.precio * cantidad;

      productosDelPedido.push({
        id_producto: productoEncontrado._id,
        nombre: productoEncontrado.nombre,
        categoria: productoEncontrado.categoria,
        precio_unitario: productoEncontrado.precio,
        cantidad,
        subtotal,
      });

      totalPedido += subtotal;
    }

    const nuevoPedido = new Pedido({
      cliente: {
        id_cliente: clienteEncontrado._id,
        nombre: clienteEncontrado.nombre,
        correo: clienteEncontrado.correo,
        telefono: clienteEncontrado.telefono,
        direccion: clienteEncontrado.direccion,
      },
      productos: productosDelPedido,
      estado: "pendiente",
      total: totalPedido,
    });

    const pedidoGuardado = await nuevoPedido.save();

    for (const item of productosDelPedido) {
      await Producto.findByIdAndUpdate(item.id_producto, {
        $inc: { stock: -item.cantidad },
      });
    }

    res.status(201).json({
      mensaje: "Pedido creado correctamente y stock actualizado",
      pedido: pedidoGuardado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al crear el pedido",
      error: error.message,
    });
  }
});

module.exports = router;
