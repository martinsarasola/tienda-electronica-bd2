const express = require("express");
const Pedido = require("../models/Pedido");

const router = express.Router();

/*
  GET /api/informes/ventas-producto
  Informe de ventas agrupadas por producto
*/
router.get("/ventas-producto", async (req, res) => {
  try {
    const informe = await Pedido.aggregate([
      {
        $unwind: "$productos",
      },
      {
        $group: {
          _id: "$productos.id_producto",
          producto: { $first: "$productos.nombre" },
          categoria: { $first: "$productos.categoria" },
          totalUnidades: { $sum: "$productos.cantidad" },
          totalVendido: { $sum: "$productos.subtotal" },
        },
      },
      {
        $sort: {
          totalVendido: -1,
        },
      },
    ]);

    res.json({
      mensaje: "Informe de ventas por producto generado correctamente",
      cantidad: informe.length,
      informe,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al generar informe de ventas por producto",
      error: error.message,
    });
  }
});

/*
  GET /api/informes/ventas-categoria
  Informe de ventas agrupadas por categoría
*/
router.get("/ventas-categoria", async (req, res) => {
  try {
    const informe = await Pedido.aggregate([
      {
        $unwind: "$productos",
      },
      {
        $group: {
          _id: "$productos.categoria",
          categoria: { $first: "$productos.categoria" },
          totalUnidades: { $sum: "$productos.cantidad" },
          totalVendido: { $sum: "$productos.subtotal" },
        },
      },
      {
        $sort: {
          totalVendido: -1,
        },
      },
    ]);

    res.json({
      mensaje: "Informe de ventas por categoría generado correctamente",
      cantidad: informe.length,
      informe,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al generar informe de ventas por categoría",
      error: error.message,
    });
  }
});

/*
  GET /api/informes/ventas-mes
  Informe de ventas agrupadas por mes
*/
router.get("/ventas-mes", async (req, res) => {
  try {
    const informe = await Pedido.aggregate([
      {
        $group: {
          _id: {
            anio: { $year: "$fecha_pedido" },
            mes: { $month: "$fecha_pedido" },
          },
          totalPedidos: { $sum: 1 },
          totalVendido: { $sum: "$total" },
        },
      },
      {
        $sort: {
          "_id.anio": 1,
          "_id.mes": 1,
        },
      },
      {
        $project: {
          _id: 0,
          anio: "$_id.anio",
          mes: "$_id.mes",
          periodo: {
            $concat: [
              { $toString: "$_id.anio" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.mes", 10] },
                  { $concat: ["0", { $toString: "$_id.mes" }] },
                  { $toString: "$_id.mes" },
                ],
              },
            ],
          },
          totalPedidos: 1,
          totalVendido: 1,
        },
      },
    ]);

    res.json({
      mensaje: "Informe de ventas por mes generado correctamente",
      cantidad: informe.length,
      informe,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al generar informe de ventas por mes",
      error: error.message,
    });
  }
});

/*
  GET /api/informes/resumen-general
  Resumen general opcional del sistema
*/
router.get("/resumen-general", async (req, res) => {
  try {
    const resumen = await Pedido.aggregate([
      {
        $group: {
          _id: null,
          totalPedidos: { $sum: 1 },
          totalVendido: { $sum: "$total" },
          promedioPorPedido: { $avg: "$total" },
        },
      },
      {
        $project: {
          _id: 0,
          totalPedidos: 1,
          totalVendido: 1,
          promedioPorPedido: { $round: ["$promedioPorPedido", 2] },
        },
      },
    ]);

    res.json({
      mensaje: "Resumen general generado correctamente",
      resumen: resumen[0] || {
        totalPedidos: 0,
        totalVendido: 0,
        promedioPorPedido: 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al generar resumen general",
      error: error.message,
    });
  }
});

module.exports = router;
