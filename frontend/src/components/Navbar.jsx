import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <h1>Tienda Electrónica BD2</h1>
        <p>Inventario, pedidos e informes</p>
      </div>

      <nav className="navbar__links">
        <NavLink to="/">Inicio</NavLink>
        <NavLink to="/productos">Productos</NavLink>
        <NavLink to="/clientes">Clientes</NavLink>
        <NavLink to="/pedidos">Pedidos</NavLink>
        <NavLink to="/nuevo-pedido">Nuevo Pedido</NavLink>
        <NavLink to="/informes">Informes</NavLink>
      </nav>
    </header>
  );
}

export default Navbar;
