const express = require("express");
const Producto = require("../models/Producto");

const router = express.Router();

/*
  GET /api/productos
  Obtener todos los productos
*/
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });

    res.json({
      mensaje: "Productos obtenidos correctamente",
      cantidad: productos.length,
      productos,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener productos",
      error: error.message,
    });
  }
});

/*
  GET /api/productos/:id
  Obtener un producto por ID
*/
router.get("/:id", async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);

    if (!producto) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.json({
      mensaje: "Producto obtenido correctamente",
      producto,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener el producto",
      error: error.message,
    });
  }
});

/*
  POST /api/productos
  Crear un nuevo producto
*/
router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body;

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio,
      stock,
      categoria,
    });

    const productoGuardado = await nuevoProducto.save();

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      producto: productoGuardado,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al crear el producto",
      error: error.message,
    });
  }
});

/*
  PUT /api/productos/:id
  Actualizar un producto
*/
router.put("/:id", async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, categoria } = req.body;

    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        descripcion,
        precio,
        stock,
        categoria,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!productoActualizado) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.json({
      mensaje: "Producto actualizado correctamente",
      producto: productoActualizado,
    });
  } catch (error) {
    res.status(400).json({
      mensaje: "Error al actualizar el producto",
      error: error.message,
    });
  }
});

/*
  DELETE /api/productos/:id
  Eliminar un producto
*/
router.delete("/:id", async (req, res) => {
  try {
    const productoEliminado = await Producto.findByIdAndDelete(req.params.id);

    if (!productoEliminado) {
      return res.status(404).json({
        mensaje: "Producto no encontrado",
      });
    }

    res.json({
      mensaje: "Producto eliminado correctamente",
      producto: productoEliminado,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar el producto",
      error: error.message,
    });
  }
});

module.exports = router;
