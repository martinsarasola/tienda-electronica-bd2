# Etapa 2 - Diseño Lógico NoSQL con MongoDB

## Proyecto

**Sistema de Gestión de Inventario y Ventas para una Tienda Electrónica**

## Objetivo de esta etapa

El objetivo de esta etapa es transformar el diseño conceptual del sistema en un diseño lógico NoSQL utilizando MongoDB.

En la etapa anterior se definieron las entidades principales del sistema: Producto, Cliente, Pedido y DetallePedido. En esta etapa se decide cómo se van a guardar esos datos dentro de MongoDB.

MongoDB no trabaja con tablas como una base de datos relacional tradicional. MongoDB trabaja con colecciones y documentos.

Una colección puede entenderse como un conjunto de documentos del mismo tipo. Un documento es un objeto con datos, parecido a un JSON.

Por ejemplo:

- La colección `productos` guardará documentos de productos.
- La colección `clientes` guardará documentos de clientes.
- La colección `pedidos` guardará documentos de pedidos.

---

# 1. Modelo lógico propuesto

Para este sistema se proponen tres colecciones principales:

```txt
productos
clientes
pedidos
```

Aunque en el diseño conceptual existe la entidad DetallePedido, en MongoDB no se creará una colección separada llamada `detalle_pedidos`.

En lugar de eso, los productos comprados se guardarán dentro del documento del pedido, usando un arreglo llamado `productos`.

Esto es común en MongoDB y permite consultar un pedido completo de manera más simple.

---

# 2. Colección productos

## Descripción

La colección `productos` almacena los productos que vende la tienda electrónica.

Cada producto debe tener información básica como nombre, descripción, precio, stock y categoría.

## Campos del documento producto

| Campo | Tipo de dato | Obligatorio | Descripción |
|---|---|---|---|
| `_id` | ObjectId | Sí | Identificador automático generado por MongoDB. |
| `nombre` | String | Sí | Nombre del producto. |
| `descripcion` | String | No | Descripción del producto. |
| `precio` | Number | Sí | Precio del producto. |
| `stock` | Number | Sí | Cantidad disponible en inventario. |
| `categoria` | String | Sí | Categoría a la que pertenece el producto. |
| `fecha_creacion` | Date | Sí | Fecha en la que se registró el producto. |

## Ejemplo de documento producto

```json
{
  "_id": "665f1a2b8c12345678900001",
  "nombre": "Laptop Dell Inspiron",
  "descripcion": "Laptop de alto rendimiento con procesador Intel Core i5 y 16GB de RAM",
  "precio": 1200,
  "stock": 10,
  "categoria": "Computadoras",
  "fecha_creacion": "2025-03-01T00:00:00.000Z"
}
```

## Justificación

La colección `productos` se mantiene separada porque el stock puede cambiar constantemente. Cada vez que se registra una venta, el sistema debe actualizar la cantidad disponible del producto.

---

# 3. Colección clientes

## Descripción

La colección `clientes` almacena la información de las personas que realizan compras en la tienda.

## Campos del documento cliente

| Campo | Tipo de dato | Obligatorio | Descripción |
|---|---|---|---|
| `_id` | ObjectId | Sí | Identificador automático generado por MongoDB. |
| `nombre` | String | Sí | Nombre completo del cliente. |
| `correo` | String | Sí | Correo electrónico del cliente. |
| `telefono` | String | No | Teléfono del cliente. |
| `direccion` | String | No | Dirección del cliente. |
| `fecha_creacion` | Date | Sí | Fecha en la que se registró el cliente. |

## Ejemplo de documento cliente

```json
{
  "_id": "665f1a2b8c12345678900002",
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "telefono": "123456789",
  "direccion": "Av. Central 123",
  "fecha_creacion": "2025-03-01T00:00:00.000Z"
}
```

## Justificación

La colección `clientes` se mantiene separada para poder registrar, consultar, modificar o eliminar clientes de manera independiente.

---

# 4. Colección pedidos

## Descripción

La colección `pedidos` almacena las compras realizadas por los clientes.

Cada pedido contiene los datos del cliente, los productos comprados, la cantidad comprada de cada producto, el precio unitario al momento de la compra, la fecha del pedido, el estado y el total.

## Campos del documento pedido

| Campo | Tipo de dato | Obligatorio | Descripción |
|---|---|---|---|
| `_id` | ObjectId | Sí | Identificador automático generado por MongoDB. |
| `cliente` | Object | Sí | Datos del cliente que realizó el pedido. |
| `productos` | Array | Sí | Lista de productos comprados. |
| `fecha_pedido` | Date | Sí | Fecha en la que se realizó el pedido. |
| `estado` | String | Sí | Estado del pedido: pendiente, enviado, entregado o cancelado. |
| `total` | Number | Sí | Importe total del pedido. |

---

# 5. Cliente embebido dentro del pedido

Dentro de cada pedido se guardará una copia de los datos principales del cliente.

## Estructura del cliente dentro del pedido

```json
"cliente": {
  "id_cliente": "665f1a2b8c12345678900002",
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "telefono": "123456789",
  "direccion": "Av. Central 123"
}
```

## Justificación

Se guarda una copia de los datos del cliente dentro del pedido para conservar la información histórica de la venta.

Por ejemplo, si el cliente cambia su dirección más adelante, los pedidos anteriores seguirán mostrando la dirección que tenía al momento de comprar.

Además, esto permite consultar un pedido completo sin tener que hacer una búsqueda adicional en la colección `clientes`.

---

# 6. Productos embebidos dentro del pedido

Dentro de cada pedido se guardará un arreglo con los productos comprados.

## Estructura de los productos dentro del pedido

```json
"productos": [
  {
    "id_producto": "665f1a2b8c12345678900001",
    "nombre": "Laptop Dell Inspiron",
    "categoria": "Computadoras",
    "precio_unitario": 1200,
    "cantidad": 1,
    "subtotal": 1200
  },
  {
    "id_producto": "665f1a2b8c12345678900003",
    "nombre": "Mouse Logitech",
    "categoria": "Accesorios",
    "precio_unitario": 50,
    "cantidad": 2,
    "subtotal": 100
  }
]
```

## Justificación

Los productos se guardan dentro del pedido para representar directamente el detalle de la compra.

Esto reemplaza a la entidad conceptual `DetallePedido`.

También permite conservar el precio del producto al momento de la compra. Esto es importante porque el precio de un producto puede cambiar en el futuro, pero el pedido debe mantener el precio original de la venta.

---

# 7. Ejemplo completo de documento pedido

```json
{
  "_id": "665f1a2b8c12345678900004",
  "cliente": {
    "id_cliente": "665f1a2b8c12345678900002",
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "telefono": "123456789",
    "direccion": "Av. Central 123"
  },
  "productos": [
    {
      "id_producto": "665f1a2b8c12345678900001",
      "nombre": "Laptop Dell Inspiron",
      "categoria": "Computadoras",
      "precio_unitario": 1200,
      "cantidad": 1,
      "subtotal": 1200
    },
    {
      "id_producto": "665f1a2b8c12345678900003",
      "nombre": "Mouse Logitech",
      "categoria": "Accesorios",
      "precio_unitario": 50,
      "cantidad": 2,
      "subtotal": 100
    }
  ],
  "fecha_pedido": "2025-03-01T00:00:00.000Z",
  "estado": "pendiente",
  "total": 1300
}
```

---

# 8. Decisión de diseño: denormalización

En bases de datos relacionales, normalmente se crean tablas separadas para clientes, productos, pedidos y detalles de pedidos.

En MongoDB se puede usar un diseño más flexible. Para este proyecto se utilizará una estructura parcialmente denormalizada.

Esto significa que algunos datos se repiten dentro de otros documentos para facilitar las consultas.

En este sistema, los pedidos guardan:

- Una copia de los datos principales del cliente.
- Una copia de los datos principales de los productos comprados.

## Ventajas

- Permite consultar un pedido completo más rápido.
- Reduce la necesidad de hacer varias consultas separadas.
- Conserva información histórica de la venta.
- Facilita la generación de informes.

## Desventajas

- Algunos datos quedan repetidos.
- Si cambia un producto o cliente, los pedidos anteriores no se actualizan automáticamente.

En este sistema, esa desventaja es aceptable porque un pedido debe guardar los datos tal como eran al momento de la venta.

---

# 9. Actualización del stock

El stock se manejará en la colección `productos`.

Cuando se cree un pedido, el sistema deberá restar automáticamente del stock la cantidad vendida de cada producto.

## Ejemplo

Stock inicial:

```txt
Laptop Dell Inspiron: 10 unidades
```

Pedido realizado:

```txt
Laptop Dell Inspiron: 1 unidad
```

Stock final:

```txt
Laptop Dell Inspiron: 9 unidades
```

## Operación esperada en MongoDB

```js
db.productos.updateOne(
  { _id: ObjectId("665f1a2b8c12345678900001") },
  { $inc: { stock: -1 } }
);
```

---

# 10. Estados del pedido

Cada pedido tendrá un estado para representar en qué etapa se encuentra.

Los estados propuestos son:

```txt
pendiente
enviado
entregado
cancelado
```

## Significado de cada estado

| Estado | Significado |
|---|---|
| `pendiente` | El pedido fue creado pero todavía no fue enviado. |
| `enviado` | El pedido ya fue despachado. |
| `entregado` | El cliente ya recibió el pedido. |
| `cancelado` | El pedido fue anulado. |

El trabajo práctico menciona los estados pendiente, enviado y entregado. Se agrega el estado cancelado para contemplar pedidos anulados.

---

# 11. Consultas frecuentes del sistema

El diseño lógico se pensó para resolver fácilmente estas consultas:

## Consultar todos los productos

```js
db.productos.find();
```

## Consultar productos por categoría

```js
db.productos.find({ categoria: "Computadoras" });
```

## Consultar todos los clientes

```js
db.clientes.find();
```

## Consultar pedidos de un cliente específico

```js
db.pedidos.find({ "cliente.id_cliente": "665f1a2b8c12345678900002" });
```

## Consultar pedidos por estado

```js
db.pedidos.find({ estado: "pendiente" });
```

## Consultar pedidos por fecha

```js
db.pedidos.find({
  fecha_pedido: {
    $gte: ISODate("2025-03-01T00:00:00.000Z"),
    $lte: ISODate("2025-03-31T23:59:59.999Z")
  }
});
```

---

# 12. Informes requeridos

El sistema debe permitir generar informes de ventas.

Los informes principales son:

```txt
Ventas por producto
Ventas por categoría
Ventas por mes
```

---

## 12.1. Informe de ventas por producto

Este informe permite saber cuántas unidades se vendieron de cada producto y cuánto dinero generó cada uno.

Consulta esperada:

```js
db.pedidos.aggregate([
  { $unwind: "$productos" },
  {
    $group: {
      _id: "$productos.nombre",
      totalUnidades: { $sum: "$productos.cantidad" },
      totalVendido: { $sum: "$productos.subtotal" }
    }
  },
  {
    $sort: { totalVendido: -1 }
  }
]);
```

Resultado esperado:

```json
[
  {
    "_id": "Laptop Dell Inspiron",
    "totalUnidades": 5,
    "totalVendido": 6000
  },
  {
    "_id": "Mouse Logitech",
    "totalUnidades": 10,
    "totalVendido": 500
  }
]
```

---

## 12.2. Informe de ventas por categoría

Este informe permite saber cuánto se vendió por cada categoría de productos.

Consulta esperada:

```js
db.pedidos.aggregate([
  { $unwind: "$productos" },
  {
    $group: {
      _id: "$productos.categoria",
      totalUnidades: { $sum: "$productos.cantidad" },
      totalVendido: { $sum: "$productos.subtotal" }
    }
  },
  {
    $sort: { totalVendido: -1 }
  }
]);
```

Resultado esperado:

```json
[
  {
    "_id": "Computadoras",
    "totalUnidades": 8,
    "totalVendido": 9600
  },
  {
    "_id": "Accesorios",
    "totalUnidades": 15,
    "totalVendido": 750
  }
]
```

---

## 12.3. Informe de ventas por mes

Este informe permite conocer el total vendido en cada mes.

Consulta esperada:

```js
db.pedidos.aggregate([
  {
    $group: {
      _id: {
        anio: { $year: "$fecha_pedido" },
        mes: { $month: "$fecha_pedido" }
      },
      totalPedidos: { $sum: 1 },
      totalVendido: { $sum: "$total" }
    }
  },
  {
    $sort: {
      "_id.anio": 1,
      "_id.mes": 1
    }
  }
]);
```

Resultado esperado:

```json
[
  {
    "_id": {
      "anio": 2025,
      "mes": 3
    },
    "totalPedidos": 10,
    "totalVendido": 15000
  }
]
```

---

# 13. Índices propuestos

Los índices ayudan a que las consultas sean más rápidas.

Para este sistema se proponen los siguientes índices:

## Índice por categoría de producto

```js
db.productos.createIndex({ categoria: 1 });
```

Sirve para buscar productos por categoría.

## Índice por correo de cliente

```js
db.clientes.createIndex({ correo: 1 }, { unique: true });
```

Sirve para buscar clientes por correo y evitar correos duplicados.

## Índice por fecha de pedido

```js
db.pedidos.createIndex({ fecha_pedido: 1 });
```

Sirve para informes por fecha o por mes.

## Índice por cliente dentro del pedido

```js
db.pedidos.createIndex({ "cliente.id_cliente": 1 });
```

Sirve para consultar pedidos realizados por un cliente específico.

## Índice por estado del pedido

```js
db.pedidos.createIndex({ estado: 1 });
```

Sirve para filtrar pedidos pendientes, enviados, entregados o cancelados.

---

# 14. Validaciones propuestas

Aunque MongoDB es flexible, se deben definir validaciones para mantener la calidad de los datos.

## Validaciones de productos

- El nombre es obligatorio.
- El precio es obligatorio.
- El precio no puede ser negativo.
- El stock es obligatorio.
- El stock no puede ser negativo.
- La categoría es obligatoria.

## Validaciones de clientes

- El nombre es obligatorio.
- El correo es obligatorio.
- El correo no debe repetirse.

## Validaciones de pedidos

- El pedido debe tener un cliente.
- El pedido debe tener al menos un producto.
- Cada producto debe tener cantidad mayor a 0.
- El total debe ser mayor o igual a 0.
- El estado debe ser uno de los valores permitidos.

---

# 15. Relación entre diseño conceptual y diseño lógico

| Diseño conceptual | Diseño lógico en MongoDB |
|---|---|
| Producto | Colección `productos` |
| Cliente | Colección `clientes` |
| Pedido | Colección `pedidos` |
| DetallePedido | Arreglo `productos` dentro de cada pedido |
| Relación Cliente-Pedido | Cliente embebido dentro del pedido |
| Relación Pedido-Producto | Productos embebidos dentro del pedido |

---

# 16. Conclusión de la etapa

En esta etapa se definió cómo se organizarán los datos del sistema en MongoDB.

El diseño elegido usa tres colecciones principales: `productos`, `clientes` y `pedidos`.

La colección `pedidos` utiliza documentos embebidos para guardar los datos del cliente y los productos comprados. Esta decisión permite consultar los pedidos de forma más simple, conservar datos históricos de las ventas y facilitar la generación de informes.

Este diseño cumple con los requerimientos del sistema porque permite:

- Gestionar productos.
- Gestionar clientes.
- Registrar pedidos.
- Actualizar stock después de cada venta.
- Generar informes por producto, categoría y mes.

---

# Checklist de la Etapa 2

- [x] Definir colecciones principales.
- [x] Diseñar documento de producto.
- [x] Diseñar documento de cliente.
- [x] Diseñar documento de pedido.
- [x] Explicar documentos embebidos.
- [x] Explicar denormalización.
- [x] Definir actualización de stock.
- [x] Definir estados del pedido.
- [x] Proponer consultas frecuentes.
- [x] Proponer informes con agregaciones.
- [x] Proponer índices.
- [x] Proponer validaciones.
