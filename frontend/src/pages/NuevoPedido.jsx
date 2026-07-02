import { useEffect, useState } from "react";
import api from "../api/axios";

function NuevoPedido() {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);

  const [clienteId, setClienteId] = useState("");
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);

  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let componenteActivo = true;

    const cargarDatosIniciales = async () => {
      try {
        const [respuestaClientes, respuestaProductos] = await Promise.all([
          api.get("/clientes"),
          api.get("/productos"),
        ]);

        if (componenteActivo) {
          setClientes(respuestaClientes.data.clientes);
          setProductos(respuestaProductos.data.productos);
          setError("");
        }
      } catch (error) {
        if (componenteActivo) {
          setError("No se pudieron cargar los clientes o productos");
        }

        console.error(error);
      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    };

    cargarDatosIniciales();

    return () => {
      componenteActivo = false;
    };
  }, []);

  const productoElegido = productos.find(
    (producto) => producto._id === productoId,
  );

  const agregarProductoAlPedido = () => {
    setMensaje("");
    setError("");

    if (!productoId) {
      setError("Seleccioná un producto");
      return;
    }

    if (!cantidad || Number(cantidad) <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }

    if (!productoElegido) {
      setError("Producto no encontrado");
      return;
    }

    if (Number(cantidad) > productoElegido.stock) {
      setError(
        `Stock insuficiente. Disponible: ${productoElegido.stock} unidades`,
      );
      return;
    }

    const productoYaAgregado = productosSeleccionados.find(
      (item) => item.productoId === productoId,
    );

    if (productoYaAgregado) {
      const nuevaCantidad =
        Number(productoYaAgregado.cantidad) + Number(cantidad);

      if (nuevaCantidad > productoElegido.stock) {
        setError(
          `No podés agregar esa cantidad. Stock disponible: ${productoElegido.stock}`,
        );
        return;
      }

      const listaActualizada = productosSeleccionados.map((item) => {
        if (item.productoId === productoId) {
          return {
            ...item,
            cantidad: nuevaCantidad,
            subtotal: nuevaCantidad * item.precio,
          };
        }

        return item;
      });

      setProductosSeleccionados(listaActualizada);
    } else {
      const nuevoItem = {
        productoId: productoElegido._id,
        nombre: productoElegido.nombre,
        categoria: productoElegido.categoria,
        precio: productoElegido.precio,
        stockDisponible: productoElegido.stock,
        cantidad: Number(cantidad),
        subtotal: productoElegido.precio * Number(cantidad),
      };

      setProductosSeleccionados([...productosSeleccionados, nuevoItem]);
    }

    setProductoId("");
    setCantidad(1);
  };

  const quitarProductoDelPedido = (productoId) => {
    const listaFiltrada = productosSeleccionados.filter(
      (item) => item.productoId !== productoId,
    );

    setProductosSeleccionados(listaFiltrada);
  };

  const cambiarCantidadProducto = (productoId, nuevaCantidad) => {
    const cantidadNumerica = Number(nuevaCantidad);

    if (cantidadNumerica <= 0) {
      return;
    }

    const listaActualizada = productosSeleccionados.map((item) => {
      if (item.productoId === productoId) {
        if (cantidadNumerica > item.stockDisponible) {
          setError(
            `Stock insuficiente para ${item.nombre}. Disponible: ${item.stockDisponible}`,
          );

          return item;
        }

        setError("");

        return {
          ...item,
          cantidad: cantidadNumerica,
          subtotal: cantidadNumerica * item.precio,
        };
      }

      return item;
    });

    setProductosSeleccionados(listaActualizada);
  };

  const totalPedido = productosSeleccionados.reduce((total, item) => {
    return total + item.subtotal;
  }, 0);

  const crearPedido = async (evento) => {
    evento.preventDefault();

    try {
      setMensaje("");
      setError("");

      if (!clienteId) {
        setError("Seleccioná un cliente");
        return;
      }

      if (productosSeleccionados.length === 0) {
        setError("Agregá al menos un producto al pedido");
        return;
      }

      const datosPedido = {
        clienteId,
        productos: productosSeleccionados.map((item) => ({
          productoId: item.productoId,
          cantidad: item.cantidad,
        })),
      };

      const respuesta = await api.post("/pedidos", datosPedido);

      setMensaje(respuesta.data.mensaje || "Pedido creado correctamente");

      setClienteId("");
      setProductoId("");
      setCantidad(1);
      setProductosSeleccionados([]);

      const respuestaProductos = await api.get("/productos");
      setProductos(respuestaProductos.data.productos);
    } catch (error) {
      const mensajeError =
        error.response?.data?.mensaje || "Error al crear el pedido";

      setError(mensajeError);
      console.error(error);
    }
  };

  if (cargando) {
    return (
      <section className="page">
        <h2>Nuevo Pedido</h2>
        <p>Cargando datos...</p>
      </section>
    );
  }

  return (
    <section className="page">
      <h2>Nuevo Pedido</h2>

      <p>
        En esta sección se puede registrar una venta seleccionando un cliente y
        los productos comprados.
      </p>

      {mensaje && <div className="alert success">{mensaje}</div>}
      {error && <div className="alert error">{error}</div>}

      <form className="form" onSubmit={crearPedido}>
        <h3>Datos del pedido</h3>

        <div className="form-grid">
          <div className="form-group form-group-full">
            <label>Cliente</label>
            <select
              value={clienteId}
              onChange={(evento) => setClienteId(evento.target.value)}
              required
            >
              <option value="">Seleccionar cliente</option>

              {clientes.map((cliente) => (
                <option key={cliente._id} value={cliente._id}>
                  {cliente.nombre} - {cliente.correo}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Producto</label>
            <select
              value={productoId}
              onChange={(evento) => setProductoId(evento.target.value)}
            >
              <option value="">Seleccionar producto</option>

              {productos.map((producto) => (
                <option key={producto._id} value={producto._id}>
                  {producto.nombre} - ${producto.precio} - Stock:{" "}
                  {producto.stock}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Cantidad</label>
            <input
              type="number"
              min="1"
              value={cantidad}
              onChange={(evento) => setCantidad(evento.target.value)}
            />
          </div>
        </div>

        {productoElegido && (
          <div className="product-preview">
            <strong>Producto seleccionado:</strong> {productoElegido.nombre} |
            Precio: ${productoElegido.precio} | Stock disponible:{" "}
            {productoElegido.stock}
          </div>
        )}

        <div className="actions">
          <button type="button" onClick={agregarProductoAlPedido}>
            Agregar producto
          </button>
        </div>

        <div className="section-header">
          <h3>Productos del pedido</h3>
        </div>

        {productosSeleccionados.length === 0 ? (
          <p>No hay productos agregados al pedido.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio unitario</th>
                  <th>Cantidad</th>
                  <th>Subtotal</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {productosSeleccionados.map((item) => (
                  <tr key={item.productoId}>
                    <td>{item.nombre}</td>
                    <td>{item.categoria}</td>
                    <td>${item.precio}</td>
                    <td>
                      <input
                        className="input-small"
                        type="number"
                        min="1"
                        max={item.stockDisponible}
                        value={item.cantidad}
                        onChange={(evento) =>
                          cambiarCantidadProducto(
                            item.productoId,
                            evento.target.value,
                          )
                        }
                      />
                    </td>
                    <td>${item.subtotal}</td>
                    <td>
                      <button
                        type="button"
                        className="small danger"
                        onClick={() => quitarProductoDelPedido(item.productoId)}
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="total-box">
          <span>Total del pedido:</span>
          <strong>${totalPedido}</strong>
        </div>

        <div className="actions">
          <button type="submit">Crear pedido</button>
        </div>
      </form>
    </section>
  );
}

export default NuevoPedido;
