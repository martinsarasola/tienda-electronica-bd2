# Informe del Proyecto - Base de Datos II

## Nombre del proyecto

Sistema de Gestión de Inventario y Ventas para una Tienda Electrónica.

## Descripción general

El proyecto consiste en diseñar e implementar una base de datos NoSQL utilizando MongoDB para una tienda de productos electrónicos.

La tienda necesita gestionar productos, clientes, pedidos, inventario y reportes de ventas.

## Objetivo del sistema

El objetivo del sistema es permitir que una tienda electrónica pueda registrar sus productos, administrar clientes, crear pedidos, actualizar automáticamente el stock luego de cada venta y generar informes de ventas.

## Tecnologías propuestas

- MongoDB como base de datos NoSQL.
- Node.js y Express para el backend.
- React para el frontend.
- Mongoose para la conexión entre Node.js y MongoDB.

## Seguridad, mantenimiento e integridad

El sistema implementa validaciones mediante Mongoose para productos, clientes y pedidos. También utiliza índices para optimizar consultas frecuentes, control de stock para evitar ventas inválidas y variables de entorno para separar configuraciones sensibles.

Además, se propone el uso de `mongodump` para realizar respaldos periódicos de la base de datos y `mongorestore` para restaurar copias de seguridad.

La documentación completa de esta fase se encuentra en:

`documentacion/fase-3-seguridad-mantenimiento.md`
