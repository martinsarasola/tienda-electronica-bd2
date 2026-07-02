# Sistema de Gestión de Inventario y Ventas

Proyecto final/integrador de la materia **Base de Datos II**.

## Descripción

Este proyecto consiste en el diseño y desarrollo de una base de datos NoSQL para una tienda electrónica.

La tienda vende productos como laptops, teléfonos, audífonos y accesorios. El sistema permite gestionar productos, clientes, pedidos, stock e informes de ventas.

El proyecto utiliza una arquitectura separada en frontend, backend y base de datos:

```txt
Frontend React
↓
Backend Node.js + Express
↓
Base de datos MongoDB
```

## Objetivo del proyecto

El objetivo es implementar un sistema funcional para una empresa pequeña, aplicando diseño conceptual, diseño lógico NoSQL, implementación en MongoDB, operaciones CRUD, agregaciones, validaciones, respaldo de datos y mantenimiento.

## Funcionalidades principales

- Gestión de productos.
- Gestión de clientes.
- Registro de pedidos.
- Actualización automática del stock después de cada venta.
- Cambio de estado de pedidos.
- Informes de ventas por producto.
- Informes de ventas por categoría.
- Informes de ventas por mes.
- Validaciones de datos con Mongoose.
- Índices para optimizar consultas.
- Documentación de respaldo con `mongodump`.

## Tecnologías utilizadas

### Frontend

- React
- Vite
- JavaScript
- React Router DOM
- Axios
- CSS

### Backend

- Node.js
- Express
- Mongoose
- CORS
- Dotenv
- Nodemon

### Base de datos

- MongoDB
- MongoDB Compass
- Mongodump para respaldos

## Estructura del proyecto

```txt
tienda-electronica-bd2
├── backend
│   ├── config
│   │   └── db.js
│   ├── models
│   │   ├── Producto.js
│   │   ├── Cliente.js
│   │   └── Pedido.js
│   ├── routes
│   │   ├── productos.routes.js
│   │   ├── clientes.routes.js
│   │   ├── pedidos.routes.js
│   │   └── informes.routes.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend
│   ├── src
│   │   ├── api
│   │   │   └── axios.js
│   │   ├── components
│   │   │   └── Navbar.jsx
│   │   ├── pages
│   │   │   ├── Inicio.jsx
│   │   │   ├── Productos.jsx
│   │   │   ├── Clientes.jsx
│   │   │   ├── NuevoPedido.jsx
│   │   │   ├── Pedidos.jsx
│   │   │   └── Informes.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── documentacion
│   ├── informe-tp.md
│   ├── etapa-1-diseno-conceptual.md
│   ├── etapa-2-diseno-logico-nosql.md
│   └── fase-16-seguridad-mantenimiento.md
│
├── .gitignore
└── README.md
```

## Modelo de datos

El sistema utiliza tres colecciones principales en MongoDB:

```txt
productos
clientes
pedidos
```

## Colección productos

Cada producto representa un artículo disponible en la tienda.

Campos principales:

```txt
nombre
descripcion
precio
stock
categoria
activo
createdAt
updatedAt
```

Ejemplo:

```json
{
  "nombre": "Laptop Dell",
  "descripcion": "Laptop de alto rendimiento",
  "precio": 1200,
  "stock": 10,
  "categoria": "Computadoras",
  "activo": true
}
```

## Colección clientes

Cada cliente representa una persona que puede realizar pedidos.

Campos principales:

```txt
nombre
correo
telefono
direccion
activo
createdAt
updatedAt
```

Ejemplo:

```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "telefono": "123456789",
  "direccion": "Av. Central 123",
  "activo": true
}
```

## Colección pedidos

Cada pedido representa una venta realizada por un cliente.

El pedido guarda datos embebidos del cliente y de los productos comprados. Esto permite conservar una copia histórica de la venta.

Campos principales:

```txt
cliente
productos
fecha_pedido
estado
total
createdAt
updatedAt
```

Ejemplo:

```json
{
  "cliente": {
    "id_cliente": "ID_DEL_CLIENTE",
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "telefono": "123456789",
    "direccion": "Av. Central 123"
  },
  "productos": [
    {
      "id_producto": "ID_DEL_PRODUCTO",
      "nombre": "Laptop Dell",
      "categoria": "Computadoras",
      "precio_unitario": 1200,
      "cantidad": 1,
      "subtotal": 1200
    }
  ],
  "fecha_pedido": "2026-07-01T00:00:00.000Z",
  "estado": "pendiente",
  "total": 1200
}
```

## Diseño NoSQL

El sistema utiliza un diseño parcialmente denormalizado.

En la colección `pedidos`, se guardan datos del cliente y de los productos dentro del mismo documento. Esto facilita las consultas frecuentes de ventas e informes.

Ventajas:

- Permite consultar pedidos sin hacer múltiples búsquedas.
- Conserva el precio histórico del producto al momento de la venta.
- Facilita los informes de ventas por producto, categoría y mes.
- Se adapta al modelo documental de MongoDB.

## Instalación del proyecto

## Requisitos previos

Tener instalado:

- Node.js
- npm
- MongoDB Community Server
- MongoDB Compass, opcional
- Git

Verificar instalación de Node.js:

```bash
node -v
npm -v
```

Verificar MongoDB:

```bash
mongod --version
mongosh --version
```

## Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
cd tienda-electronica-bd2
```

## Instalación del backend

Entrar a la carpeta del backend:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Crear archivo `.env` dentro de `backend`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/tienda_electronica_bd2
```

Ejecutar el backend:

```bash
npm run dev
```

El backend queda disponible en:

```txt
http://localhost:5000
```

Ruta de prueba:

```txt
http://localhost:5000
```

Respuesta esperada:

```txt
API funcionando correctamente
```

## Instalación del frontend

En otra terminal, desde la raíz del proyecto:

```bash
cd frontend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar el frontend:

```bash
npm run dev
```

El frontend queda disponible en:

```txt
http://localhost:5173
```

## Endpoints del backend

## Productos

```txt
GET    /api/productos
GET    /api/productos/:id
POST   /api/productos
PUT    /api/productos/:id
DELETE /api/productos/:id
```

Funcionalidades:

- Listar productos.
- Obtener un producto específico.
- Crear productos.
- Actualizar productos.
- Eliminar productos.

## Clientes

```txt
GET    /api/clientes
GET    /api/clientes/:id
POST   /api/clientes
PUT    /api/clientes/:id
DELETE /api/clientes/:id
```

Funcionalidades:

- Listar clientes.
- Obtener un cliente específico.
- Crear clientes.
- Actualizar clientes.
- Eliminar clientes.

## Pedidos

```txt
GET  /api/pedidos
GET  /api/pedidos/:id
GET  /api/pedidos/cliente/:clienteId
POST /api/pedidos
PUT  /api/pedidos/:id/estado
```

Funcionalidades:

- Listar pedidos.
- Obtener un pedido específico.
- Consultar pedidos de un cliente.
- Crear pedidos.
- Descontar stock automáticamente.
- Cambiar estado del pedido.

Estados permitidos:

```txt
pendiente
enviado
entregado
cancelado
```

## Informes

```txt
GET /api/informes/ventas-producto
GET /api/informes/ventas-categoria
GET /api/informes/ventas-mes
GET /api/informes/resumen-general
```

Funcionalidades:

- Informe de ventas por producto.
- Informe de ventas por categoría.
- Informe de ventas por mes.
- Resumen general de ventas.

## Páginas del frontend

```txt
/                 Inicio
/productos        Gestión de productos
/clientes         Gestión de clientes
/nuevo-pedido     Crear pedido
/pedidos          Gestión de pedidos
/informes         Informes de ventas
```

## Flujo principal del sistema

## 1. Crear productos

Desde la página `Productos`, se cargan productos con:

- Nombre
- Descripción
- Precio
- Stock
- Categoría

## 2. Crear clientes

Desde la página `Clientes`, se cargan clientes con:

- Nombre
- Correo
- Teléfono
- Dirección

## 3. Crear pedidos

Desde la página `Nuevo Pedido`:

1. Se selecciona un cliente.
2. Se seleccionan productos.
3. Se indican cantidades.
4. Se calcula el total.
5. Se crea el pedido.
6. El backend descuenta el stock automáticamente.

## 4. Gestionar pedidos

Desde la página `Pedidos`, se pueden ver los pedidos registrados y cambiar su estado.

## 5. Ver informes

Desde la página `Informes`, se pueden consultar ventas agrupadas por:

- Producto
- Categoría
- Mes

## Validaciones implementadas

## Productos

- El nombre es obligatorio.
- El precio es obligatorio.
- El precio no puede ser negativo.
- El stock es obligatorio.
- El stock no puede ser negativo.
- La categoría es obligatoria.
- La descripción tiene longitud máxima.

## Clientes

- El nombre es obligatorio.
- El correo es obligatorio.
- El correo debe tener formato válido.
- El correo debe ser único.
- El teléfono tiene longitud máxima.
- La dirección tiene longitud máxima.

## Pedidos

- El cliente es obligatorio.
- El pedido debe tener productos.
- Cada producto debe tener cantidad mayor o igual a 1.
- El total no puede ser negativo.
- El estado debe pertenecer a los valores permitidos.

## Control de stock

Cuando se crea un pedido, el backend verifica que exista stock suficiente para cada producto.

Si hay stock suficiente:

1. Se guarda el pedido.
2. Se descuenta la cantidad vendida del stock del producto.

Si no hay stock suficiente:

1. El pedido no se crea.
2. El stock no se modifica.
3. El sistema devuelve un mensaje de error.

## Índices utilizados

Los modelos de Mongoose definen índices para optimizar consultas frecuentes.

## Productos

```txt
categoria
nombre
stock
activo
```

## Clientes

```txt
nombre
activo
correo único
```

## Pedidos

```txt
fecha_pedido
estado
cliente.id_cliente
productos.id_producto
productos.categoria
```

## Respaldo de datos

Para realizar un respaldo de la base de datos se puede utilizar:

```bash
mongodump --db tienda_electronica_bd2 --out ./backup
```

La carpeta `backup` no se sube al repositorio, ya que puede contener datos internos de la base de datos.

Para restaurar una copia de seguridad:

```bash
mongorestore --db tienda_electronica_bd2 ./backup/tienda_electronica_bd2
```

## Seguridad y mantenimiento

Medidas aplicadas:

- Uso de variables de entorno en `.env`.
- `.env` excluido del repositorio mediante `.gitignore`.
- Backup excluido del repositorio.
- Validaciones de datos con Mongoose.
- Estados controlados en pedidos.
- Control de stock antes de registrar ventas.
- Índices para optimizar consultas.
- Documentación de respaldo y restauración.

## Archivos ignorados por Git

El archivo `.gitignore` incluye:

```gitignore
node_modules
.env
dist
build
.DS_Store
backup
backup/
*.bson
```

## Pruebas recomendadas

Para verificar el funcionamiento completo del sistema:

1. Crear productos.
2. Crear clientes.
3. Crear un pedido con uno o más productos.
4. Verificar que el stock se descuente.
5. Cambiar el estado del pedido.
6. Verificar el pedido en MongoDB Compass.
7. Consultar informes de ventas.
8. Crear otro pedido.
9. Verificar que los informes cambien.

## Estado del proyecto

Funcionalidades terminadas:

- Backend con Express.
- Conexión a MongoDB.
- Modelos de Mongoose.
- CRUD de productos.
- CRUD de clientes.
- Creación de pedidos.
- Descuento automático de stock.
- Gestión de estados de pedidos.
- Informes con agregaciones.
- Frontend React.
- Documentación de seguridad, mantenimiento y respaldo.

## Integrantes

 - José Martín Sarasola
 - Maximiliano Exequiel Lorenzi
 - Juan Giribaldi

## Materia

Base de Datos II

## Proyecto

Sistema de Gestión de Inventario y Ventas para una Tienda Electrónica.
