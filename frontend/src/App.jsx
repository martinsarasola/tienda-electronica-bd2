import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";

import Inicio from "./pages/Inicio";
import Productos from "./pages/Productos";
import Clientes from "./pages/Clientes";
import Pedidos from "./pages/Pedidos";
import NuevoPedido from "./pages/NuevoPedido";
import Informes from "./pages/Informes";

function App() {
  return (
    <>
      <Navbar />

      <main className="container">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/nuevo-pedido" element={<NuevoPedido />} />
          <Route path="/informes" element={<Informes />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
