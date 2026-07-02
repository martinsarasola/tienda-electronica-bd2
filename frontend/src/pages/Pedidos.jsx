import { useEffect, useState } from "react";
import api from "../api/axios";

const estadosPedido = ["pendiente", "enviado", "entregado", "cancelado"];

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let componenteActivo = true;

    const cargarPedidosIniciales = async () => {
      try {
        const respuesta = await api.get("/pedidos");

        if (componenteActivo) {
          setPedidos(respuesta.data.pedidos);
          setError("");
        }
      } catch (error) {
        if (componenteActivo) {
          setError("No se pudieron obtener los pedidos");
        }

        console.error(error);
      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    };

    cargarPedidosIniciales();

    return () => {
      componenteActivo = false;
    };
  }, []);

  const obtenerPedidos = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await api.get("/pedidos");

      setPedidos(respuesta.data.pedidos);
    } catch (error) {
      setError("No se pudieron obtener los pedidos");
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
    try {
      setMensaje("");
      setError("");

      const respuesta = await api.put(`/pedidos/${pedidoId}/estado`, {
        estado: nuevoEstado,
      });

      setMensaje(respuesta.data.mensaje || "Estado actualizado correctamente");

      setPedidos((pedidosActuales) =>
        pedidosActuales.map((pedido) => {
          if (pedido._id === pedidoId) {
            return respuesta.data.pedido;
          }

          return pedido;
        }),
      );
    } catch (error) {
      const mensajeError =
        error.response?.data?.mensaje ||
        "No se pudo actualizar el estado del pedido";

      setError(mensajeError);
      console.error(error);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (cargando) {
    return (
      <section className="page">
        <h2>Pedidos</h2>
        <p>Cargando pedidos...</p>
      </section>
    );
  }

  return (
    <section className="page">
      <h2>Gestión de pedidos</h2>

      <p>
        En esta sección se pueden visualizar los pedidos registrados y modificar
        su estado.
      </p>

      {mensaje && <div className="alert success">{mensaje}</div>}
      {error && <div className="alert error">{error}</div>}

      <div className="section-header">
        <h3>Lista de pedidos</h3>

        <button type="button" className="secondary" onClick={obtenerPedidos}>
          Actualizar lista
        </button>
      </div>

      {pedidos.length === 0 ? (
        <p>No hay pedidos registrados.</p>
      ) : (
        <div className="orders-list">
          {pedidos.map((pedido) => (
            <article className="order-card" key={pedido._id}>
              <div className="order-card__header">
                <div>
                  <h3>Pedido #{pedido._id.slice(-6).toUpperCase()}</h3>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {formatearFecha(pedido.fecha_pedido)}
                  </p>
                </div>

                <div className={`status-badge status-${pedido.estado}`}>
                  {pedido.estado}
                </div>
              </div>

              <div className="order-card__content">
                <div className="order-section">
                  <h4>Cliente</h4>
                  <p>
                    <strong>Nombre:</strong> {pedido.cliente.nombre}
                  </p>
                  <p>
                    <strong>Correo:</strong> {pedido.cliente.correo}
                  </p>
                  <p>
                    <strong>Teléfono:</strong>{" "}
                    {pedido.cliente.telefono || "Sin teléfono"}
                  </p>
                  <p>
                    <strong>Dirección:</strong>{" "}
                    {pedido.cliente.direccion || "Sin dirección"}
                  </p>
                </div>

                <div className="order-section">
                  <h4>Estado del pedido</h4>

                  <div className="form-group">
                    <label>Cambiar estado</label>
                    <select
                      value={pedido.estado}
                      onChange={(evento) =>
                        cambiarEstadoPedido(pedido._id, evento.target.value)
                      }
                    >
                      {estadosPedido.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Categoría</th>
                      <th>Precio unitario</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pedido.productos.map((producto) => (
                      <tr key={producto._id}>
                        <td>{producto.nombre}</td>
                        <td>{producto.categoria}</td>
                        <td>${producto.precio_unitario}</td>
                        <td>{producto.cantidad}</td>
                        <td>${producto.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="order-total">
                <span>Total:</span>
                <strong>${pedido.total}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default Pedidos;
