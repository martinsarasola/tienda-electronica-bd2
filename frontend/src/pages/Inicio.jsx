function Inicio() {
  return (
    <section className="page">
      <h2>Sistema de Gestión de Inventario y Ventas</h2>

      <p>
        Esta aplicación permite administrar productos, clientes, pedidos,
        actualización de stock e informes de ventas para una tienda electrónica.
      </p>

      <div className="grid">
        <div className="card">
          <h3>Productos</h3>
          <p>Gestionar nombre, descripción, precio, stock y categoría.</p>
        </div>

        <div className="card">
          <h3>Clientes</h3>
          <p>Registrar clientes con nombre, correo, teléfono y dirección.</p>
        </div>

        <div className="card">
          <h3>Pedidos</h3>
          <p>Crear ventas, guardar productos comprados y actualizar stock.</p>
        </div>

        <div className="card">
          <h3>Informes</h3>
          <p>Consultar ventas por producto, categoría y mes.</p>
        </div>
      </div>
    </section>
  );
}

export default Inicio;
