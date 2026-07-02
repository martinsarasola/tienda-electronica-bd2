import { useEffect, useState } from "react";
import api from "../api/axios";

function Informes() {
  const [ventasProducto, setVentasProducto] = useState([]);
  const [ventasCategoria, setVentasCategoria] = useState([]);
  const [ventasMes, setVentasMes] = useState([]);
  const [resumenGeneral, setResumenGeneral] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let componenteActivo = true;

    const cargarInformesIniciales = async () => {
      try {
        const [
          respuestaProducto,
          respuestaCategoria,
          respuestaMes,
          respuestaResumen,
        ] = await Promise.all([
          api.get("/informes/ventas-producto"),
          api.get("/informes/ventas-categoria"),
          api.get("/informes/ventas-mes"),
          api.get("/informes/resumen-general"),
        ]);

        if (componenteActivo) {
          setVentasProducto(respuestaProducto.data.informe);
          setVentasCategoria(respuestaCategoria.data.informe);
          setVentasMes(respuestaMes.data.informe);
          setResumenGeneral(respuestaResumen.data.resumen);
          setError("");
        }
      } catch (error) {
        if (componenteActivo) {
          setError("No se pudieron cargar los informes");
        }

        console.error(error);
      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    };

    cargarInformesIniciales();

    return () => {
      componenteActivo = false;
    };
  }, []);

  const obtenerInformes = async () => {
    try {
      setCargando(true);
      setError("");

      const [
        respuestaProducto,
        respuestaCategoria,
        respuestaMes,
        respuestaResumen,
      ] = await Promise.all([
        api.get("/informes/ventas-producto"),
        api.get("/informes/ventas-categoria"),
        api.get("/informes/ventas-mes"),
        api.get("/informes/resumen-general"),
      ]);

      setVentasProducto(respuestaProducto.data.informe);
      setVentasCategoria(respuestaCategoria.data.informe);
      setVentasMes(respuestaMes.data.informe);
      setResumenGeneral(respuestaResumen.data.resumen);
    } catch (error) {
      setError("No se pudieron cargar los informes");
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const formatearDinero = (valor) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(valor);
  };

  if (cargando) {
    return (
      <section className="page">
        <h2>Informes</h2>
        <p>Cargando informes...</p>
      </section>
    );
  }

  return (
    <section className="page">
      <h2>Informes de ventas</h2>

      <p>
        En esta sección se muestran reportes generados a partir de los pedidos
        registrados en el sistema.
      </p>

      {error && <div className="alert error">{error}</div>}

      <div className="section-header">
        <h3>Resumen general</h3>

        <button type="button" className="secondary" onClick={obtenerInformes}>
          Actualizar informes
        </button>
      </div>

      {resumenGeneral ? (
        <div className="summary-grid">
          <div className="summary-card">
            <span>Total de pedidos</span>
            <strong>{resumenGeneral.totalPedidos}</strong>
          </div>

          <div className="summary-card">
            <span>Total vendido</span>
            <strong>{formatearDinero(resumenGeneral.totalVendido)}</strong>
          </div>

          <div className="summary-card">
            <span>Promedio por pedido</span>
            <strong>{formatearDinero(resumenGeneral.promedioPorPedido)}</strong>
          </div>
        </div>
      ) : (
        <p>No hay resumen disponible.</p>
      )}

      <div className="report-section">
        <h3>Ventas por producto</h3>

        {ventasProducto.length === 0 ? (
          <p>No hay ventas registradas por producto.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Unidades vendidas</th>
                  <th>Total vendido</th>
                </tr>
              </thead>

              <tbody>
                {ventasProducto.map((item) => (
                  <tr key={item._id}>
                    <td>{item.producto}</td>
                    <td>{item.categoria}</td>
                    <td>{item.totalUnidades}</td>
                    <td>{formatearDinero(item.totalVendido)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="report-section">
        <h3>Ventas por categoría</h3>

        {ventasCategoria.length === 0 ? (
          <p>No hay ventas registradas por categoría.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Categoría</th>
                  <th>Unidades vendidas</th>
                  <th>Total vendido</th>
                </tr>
              </thead>

              <tbody>
                {ventasCategoria.map((item) => (
                  <tr key={item._id}>
                    <td>{item.categoria}</td>
                    <td>{item.totalUnidades}</td>
                    <td>{formatearDinero(item.totalVendido)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="report-section">
        <h3>Ventas por mes</h3>

        {ventasMes.length === 0 ? (
          <p>No hay ventas registradas por mes.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Período</th>
                  <th>Año</th>
                  <th>Mes</th>
                  <th>Total de pedidos</th>
                  <th>Total vendido</th>
                </tr>
              </thead>

              <tbody>
                {ventasMes.map((item) => (
                  <tr key={item.periodo}>
                    <td>{item.periodo}</td>
                    <td>{item.anio}</td>
                    <td>{item.mes}</td>
                    <td>{item.totalPedidos}</td>
                    <td>{formatearDinero(item.totalVendido)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export default Informes;
