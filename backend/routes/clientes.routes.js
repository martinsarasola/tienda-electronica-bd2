const express = require("express");
const Cliente = require("../models/Cliente");

const router = express.Router();

/*
  GET /api/clientes
  Obtener todos los clientes
*/
router.get("/", async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ createdAt: -1 });

    res.json({
      mensaje: "Clientes obtenidos correctamente",
      cantidad: clientes.length,
      clientes,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener clientes",
      error: error.message,
    });
  }
});

/*
  GET /api/clientes/:id
  Obtener un cliente por ID
*/
router.get("/:id", async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);

    if (!cliente) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado",
      });
    }

    res.json({
      mensaje: "Cliente obtenido correctamente",
      cliente,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el cliente",
      error: error.message,
    });
  }
});

/*
  POST /api/clientes
  Crear un nuevo cliente
*/
router.post("/", async (req, res) => {
  try {
    const { nombre, correo, telefono, direccion } = req.body;

    const nuevoCliente = new Cliente({
      nombre,
      correo,
      telefono,
      direccion,
    });

    const clienteGuardado = await nuevoCliente.save();

    res.status(201).json({
      mensaje: "Cliente creado correctamente",
      cliente: clienteGuardado,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al crear el cliente",
      error: error.message,
    });
  }
});

/*
  PUT /api/clientes/:id
  Actualizar un cliente
*/
router.put("/:id", async (req, res) => {
  try {
    const { nombre, correo, telefono, direccion } = req.body;

    const clienteActualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        correo,
        telefono,
        direccion,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!clienteActualizado) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado",
      });
    }

    res.json({
      mensaje: "Cliente actualizado correctamente",
      cliente: clienteActualizado,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar el cliente",
      error: error.message,
    });
  }
});

/*
  DELETE /api/clientes/:id
  Eliminar un cliente
*/
router.delete("/:id", async (req, res) => {
  try {
    const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);

    if (!clienteEliminado) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado",
      });
    }

    res.json({
      mensaje: "Cliente eliminado correctamente",
      cliente: clienteEliminado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el cliente",
      error: error.message,
    });
  }
});

module.exports = router;
