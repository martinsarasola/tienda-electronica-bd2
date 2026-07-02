# Etapa 1 - Diseño Conceptual del Sistema

## Proyecto

**Sistema de Gestión de Inventario y Ventas para una Tienda Electrónica**

## Descripción general

El proyecto consiste en diseñar y desarrollar una base de datos NoSQL para una tienda de productos electrónicos.

La tienda vende productos como laptops, teléfonos, audífonos, teclados, mouse y accesorios. Los clientes pueden realizar compras en línea o en la tienda física.

El sistema debe permitir gestionar productos, administrar clientes, registrar pedidos, controlar el stock disponible y generar informes de ventas.

## Objetivo de la etapa

El objetivo de esta etapa es definir el diseño conceptual del sistema antes de comenzar con la implementación técnica.

En esta etapa se identifican las entidades principales, sus atributos y las relaciones que existen entre ellas.

Este diseño sirve como base para luego construir el modelo lógico en MongoDB.

---

# 1. Entidades principales

Una entidad representa un objeto importante del sistema sobre el cual necesitamos guardar información.

Para este proyecto se identifican las siguientes entidades principales:

- Producto
- Cliente
- Pedido
- DetallePedido

---

# 2. Entidad Producto

## Descripción

La entidad **Producto** representa cada artículo que la tienda vende.

Ejemplos de productos pueden ser laptops, celulares, auriculares, teclados, mouse, cargadores o accesorios electrónicos.

Cada producto debe tener información básica como nombre, descripción, precio, stock disponible y categoría.

## Atributos

| Atributo | Descripción |
|---|---|
| id_producto | Identificador único del producto. |
| nombre | Nombre del producto. |
| descripcion | Descripción general del producto. |
| precio | Precio de venta del producto. |
| stock | Cantidad disponible en inventario. |
| categoria | Categoría a la que pertenece el producto. |

## Ejemplo

| Atributo | Valor |
|---|---|
| id_producto | P001 |
| nombre | Laptop Dell |
| descripcion | Laptop de alto rendimiento |
| precio | 1200 |
| stock | 10 |
| categoria | Computadoras |

## Importancia en el sistema

La entidad Producto es fundamental porque permite controlar qué artículos vende la tienda, cuánto cuestan y cuántas unidades hay disponibles.

Además, esta entidad se relaciona directamente con los pedidos, ya que cada pedido puede incluir uno o más productos.

---

# 3. Entidad Cliente

## Descripción

La entidad **Cliente** representa a las personas que realizan compras en la tienda.

El sistema debe guardar los datos principales del cliente para poder asociarlo con sus pedidos.

## Atributos

| Atributo | Descripción |
|---|---|
| id_cliente | Identificador único del cliente. |
| nombre | Nombre completo del cliente. |
| correo | Correo electrónico del cliente. |
| telefono | Número de teléfono del cliente. |
| direccion | Dirección del cliente. |

## Ejemplo

| Atributo | Valor |
|---|---|
| id_cliente | C001 |
| nombre | Juan Pérez |
| correo | juan@example.com |
| telefono | 123456789 |
| direccion | Av. Central 123 |

## Importancia en el sistema

La entidad Cliente permite registrar quién realiza cada compra.

Un cliente puede tener varios pedidos asociados a lo largo del tiempo, por lo tanto, es necesario almacenar sus datos para consultar su historial de compras.

---

# 4. Entidad Pedido

## Descripción

La entidad **Pedido** representa una compra realizada por un cliente.

Un pedido debe guardar qué cliente realizó la compra, la fecha del pedido, su estado y el total de la venta.

## Atributos

| Atributo | Descripción |
|---|---|
| id_pedido | Identificador único del pedido. |
| cliente_id | Identificador del cliente que realizó el pedido. |
| fecha | Fecha en la que se realizó el pedido. |
| estado | Estado actual del pedido. |
| total | Importe total del pedido. |

## Estados posibles del pedido

El pedido puede tener los siguientes estados:

| Estado | Descripción |
|---|---|
| pendiente | El pedido fue creado, pero todavía no fue enviado. |
| enviado | El pedido fue despachado al cliente. |
| entregado | El pedido llegó al cliente. |

## Ejemplo

| Atributo | Valor |
|---|---|
| id_pedido | PED001 |
| cliente_id | C001 |
| fecha | 2025-03-01 |
| estado | pendiente |
| total | 1300 |

## Importancia en el sistema

La entidad Pedido es importante porque representa la venta realizada.

Cada vez que se registra un pedido, el sistema debe actualizar el stock de los productos vendidos.

También permite generar informes de ventas por producto, categoría y mes.

---

# 5. Entidad DetallePedido

## Descripción

La entidad **DetallePedido** representa los productos específicos que forman parte de un pedido.

Un pedido puede incluir varios productos, y cada producto puede tener una cantidad diferente.

Por ejemplo, un cliente puede comprar una laptop y dos mouse en el mismo pedido.

## Atributos

| Atributo | Descripción |
|---|---|
| id_pedido | Identificador del pedido al que pertenece el detalle. |
| id_producto | Identificador del producto comprado. |
| cantidad | Cantidad comprada de ese producto. |
| precio_unitario | Precio del producto al momento de la compra. |

## Ejemplo

| id_pedido | id_producto | cantidad | precio_unitario |
|---|---|---|---|
| PED001 | P001 | 1 | 1200 |
| PED001 | P002 | 2 | 50 |

## Importancia en el sistema

La entidad DetallePedido permite representar la relación entre pedidos y productos.

Es necesaria porque un pedido puede contener muchos productos, y un mismo producto puede aparecer en distintos pedidos.

Además, permite calcular el total de cada pedido y generar informes de ventas.

---

# 6. Relaciones entre entidades

Las relaciones indican cómo se conectan las entidades entre sí.

---

## 6.1. Relación entre Cliente y Pedido

Un cliente puede realizar muchos pedidos.

Pero cada pedido pertenece a un solo cliente.

Esto se representa como una relación de uno a muchos.

```txt
Cliente 1 ----- N Pedido
```

## Ejemplo

Un cliente llamado Juan Pérez puede realizar varios pedidos:

```txt
Juan Pérez
├── Pedido PED001
├── Pedido PED002
└── Pedido PED003
```

## Explicación

Esta relación permite consultar todos los pedidos realizados por un cliente específico.

Por ejemplo, el sistema podría buscar todos los pedidos del cliente con id_cliente C001.

---

## 6.2. Relación entre Pedido y DetallePedido

Un pedido puede tener muchos detalles de pedido.

Cada detalle pertenece a un solo pedido.

Esto se representa como una relación de uno a muchos.

```txt
Pedido 1 ----- N DetallePedido
```

## Ejemplo

```txt
Pedido PED001
├── Producto P001, cantidad 1
└── Producto P002, cantidad 2
```

## Explicación

Esta relación permite saber qué productos fueron comprados dentro de un pedido.

También permite calcular el total del pedido sumando los subtotales de cada producto.

---

## 6.3. Relación entre Producto y DetallePedido

Un producto puede aparecer en muchos detalles de pedido.

Cada detalle de pedido hace referencia a un solo producto.

Esto se representa como una relación de uno a muchos desde Producto hacia DetallePedido.

```txt
Producto 1 ----- N DetallePedido
```

## Ejemplo

El producto Laptop Dell puede aparecer en distintos pedidos:

```txt
Laptop Dell
├── Pedido PED001
├── Pedido PED005
└── Pedido PED010
```

## Explicación

Esta relación permite saber cuántas veces se vendió un producto y en qué pedidos apareció.

También es necesaria para generar informes de ventas por producto.

---

# 7. Representación general del modelo conceptual

El modelo conceptual completo puede representarse de la siguiente forma:

```txt
Cliente 1 ----- N Pedido 1 ----- N DetallePedido N ----- 1 Producto
```

Otra forma de leerlo es:

```txt
Un cliente puede hacer muchos pedidos.
Un pedido puede tener muchos productos.
Un producto puede aparecer en muchos pedidos.
```

---

# 8. Diagrama textual del sistema

```txt
+----------------+
|    Cliente     |
+----------------+
| id_cliente     |
| nombre         |
| correo         |
| telefono       |
| direccion      |
+----------------+
        |
        | 1
        |
        | N
+----------------+
|     Pedido     |
+----------------+
| id_pedido      |
| cliente_id     |
| fecha          |
| estado         |
| total          |
+----------------+
        |
        | 1
        |
        | N
+-------------------+
|   DetallePedido   |
+-------------------+
| id_pedido         |
| id_producto       |
| cantidad          |
| precio_unitario   |
+-------------------+
        |
        | N
        |
        | 1
+----------------+
|    Producto    |
+----------------+
| id_producto    |
| nombre         |
| descripcion    |
| precio         |
| stock          |
| categoria      |
+----------------+
```

---

# 9. Reglas del negocio

Las reglas del negocio son condiciones que el sistema debe respetar.

## Regla 1: Cada producto debe tener un identificador único

No pueden existir dos productos con el mismo id_producto.

Esto permite identificar correctamente cada producto dentro del sistema.

## Regla 2: Cada cliente debe tener un identificador único

No pueden existir dos clientes con el mismo id_cliente.

Esto permite asociar correctamente los pedidos con cada cliente.

## Regla 3: Un pedido debe pertenecer a un cliente existente

No se debe registrar un pedido si el cliente no existe en el sistema.

## Regla 4: Un pedido debe tener al menos un producto

No tiene sentido crear un pedido vacío.

Por lo tanto, cada pedido debe contener uno o más productos.

## Regla 5: No se puede vender más cantidad que el stock disponible

Antes de registrar una venta, el sistema debe verificar que haya stock suficiente.

Por ejemplo, si hay 3 laptops en stock, el sistema no debe permitir vender 5.

## Regla 6: El stock debe actualizarse después de cada venta

Cuando se registra un pedido, el sistema debe descontar automáticamente las unidades vendidas.

Por ejemplo:

```txt
Stock inicial: 10 laptops
Venta: 2 laptops
Stock final: 8 laptops
```

## Regla 7: El total del pedido debe calcularse automáticamente

El total del pedido se calcula sumando el subtotal de cada producto.

```txt
Subtotal = precio_unitario * cantidad
Total = suma de todos los subtotales
```

Ejemplo:

```txt
Laptop Dell: 1 x 1200 = 1200
Mouse Logitech: 2 x 50 = 100
Total del pedido = 1300
```

## Regla 8: El estado del pedido debe estar controlado

El estado del pedido solo puede ser uno de los valores permitidos:

```txt
pendiente
enviado
entregado
```

---

# 10. Casos de uso principales

Un caso de uso representa una acción importante que el usuario puede realizar en el sistema.

## Caso de uso 1: Registrar producto

El usuario carga los datos de un nuevo producto.

Datos necesarios:

- Nombre
- Descripción
- Precio
- Stock
- Categoría

Resultado esperado:

El producto queda guardado en la base de datos.

---

## Caso de uso 2: Registrar cliente

El usuario carga los datos de un nuevo cliente.

Datos necesarios:

- Nombre
- Correo
- Teléfono
- Dirección

Resultado esperado:

El cliente queda guardado en la base de datos.

---

## Caso de uso 3: Crear pedido

El usuario selecciona un cliente y uno o más productos.

También indica la cantidad de cada producto.

Resultado esperado:

El pedido queda registrado, se calcula el total y se descuenta el stock correspondiente.

---

## Caso de uso 4: Consultar pedidos de un cliente

El usuario busca los pedidos realizados por un cliente específico.

Resultado esperado:

El sistema muestra el historial de pedidos del cliente.

---

## Caso de uso 5: Actualizar estado de pedido

El usuario cambia el estado de un pedido.

Ejemplo:

```txt
pendiente → enviado → entregado
```

Resultado esperado:

El pedido queda actualizado con su nuevo estado.

---

## Caso de uso 6: Generar informes de ventas

El usuario solicita informes de ventas.

El sistema debe poder generar informes por:

- Producto
- Categoría
- Mes

Resultado esperado:

El sistema muestra información resumida sobre las ventas realizadas.

---

# 11. Conclusión de la etapa

En esta etapa se definió el diseño conceptual del sistema de gestión de inventario y ventas para una tienda electrónica.

Se identificaron las entidades principales: Producto, Cliente, Pedido y DetallePedido.

También se definieron sus atributos, relaciones, reglas de negocio y casos de uso principales.

Este diseño conceptual será la base para la siguiente etapa, donde se transformará el modelo a una estructura lógica NoSQL utilizando MongoDB.
