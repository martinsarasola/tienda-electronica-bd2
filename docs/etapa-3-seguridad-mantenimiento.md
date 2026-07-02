# Fase 3 - Seguridad, mantenimiento e integridad de datos

## Objetivo

El objetivo de esta fase es documentar y aplicar medidas básicas de seguridad, mantenimiento e integridad para el sistema de gestión de inventario y ventas.

El sistema utiliza MongoDB como base de datos NoSQL, Node.js con Express como backend y Mongoose como ODM para definir modelos, validaciones e índices.

## 1. Validación de datos

Aunque MongoDB permite guardar documentos flexibles, el sistema utiliza Mongoose para definir reglas mínimas de validación.

Esto permite evitar que se guarden datos incompletos o incorrectos.

### Validaciones en productos

El modelo de productos valida:

- El nombre es obligatorio.
- El nombre debe tener al menos 2 caracteres.
- El precio es obligatorio.
- El precio no puede ser negativo.
- El stock es obligatorio.
- El stock no puede ser negativo.
- La categoría es obligatoria.
- La descripción tiene una longitud máxima.

Estas validaciones ayudan a mantener datos consistentes en el inventario.

### Validaciones en clientes

El modelo de clientes valida:

- El nombre es obligatorio.
- El correo electrónico es obligatorio.
- El correo debe tener un formato válido.
- El correo debe ser único.
- El teléfono tiene longitud máxima.
- La dirección tiene longitud máxima.

Estas reglas evitan clientes duplicados por correo y reducen errores de carga.

### Validaciones en pedidos

El modelo de pedidos valida:

- El pedido debe tener un cliente.
- El pedido debe tener productos.
- Cada producto debe tener cantidad mayor o igual a 1.
- El precio unitario no puede ser negativo.
- El subtotal no puede ser negativo.
- El total no puede ser negativo.
- El estado solo puede ser: pendiente, enviado, entregado o cancelado.

Esto permite controlar la integridad de las ventas registradas.

## 2. Control de stock

El sistema actualiza automáticamente el stock después de cada venta.

Cuando se crea un pedido:

1. El backend recibe el cliente y los productos.
2. Busca el cliente en la base de datos.
3. Busca cada producto en la base de datos.
4. Verifica que exista stock suficiente.
5. Calcula subtotal y total.
6. Guarda el pedido.
7. Descuenta el stock de cada producto vendido.

Ejemplo:

Si un producto tiene stock 10 y se venden 2 unidades, el stock final queda en 8.

Esta lógica evita vender más unidades de las disponibles.

## 3. Estados de pedido

Los pedidos tienen un estado controlado.

Estados permitidos:

- pendiente
- enviado
- entregado
- cancelado

El uso de estados controlados evita que se guarden textos inválidos como "listo", "preparando" o "finalizado".

## 4. Índices

El sistema define índices en los modelos de Mongoose para mejorar las consultas frecuentes.

### Índices en productos

- categoria
- nombre
- stock
- activo

Estos índices ayudan a buscar productos por categoría, nombre o estado.

### Índices en clientes

- correo
- nombre
- activo

Estos índices ayudan a buscar clientes por correo o nombre.

### Índices en pedidos

- fecha_pedido
- estado
- cliente.id_cliente
- productos.id_producto
- productos.categoria

Estos índices ayudan a consultar pedidos por fecha, estado, cliente, producto o categoría.

## 5. Respaldo de datos

Para realizar un respaldo de la base de datos se puede utilizar la herramienta `mongodump`.

Comando sugerido:

```bash
mongodump --db tienda_electronica_bd2 --out ./backup
```
