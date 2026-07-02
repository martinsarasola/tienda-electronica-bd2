import { useEffect, useState } from "react";
import api from "../api/axios";

const formularioInicial = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  categoria: "",
};

function Productos() {
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [productoEditando, setProductoEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let componenteActivo = true;

    const cargarProductosIniciales = async () => {
      try {
        const respuesta = await api.get("/productos");

        if (componenteActivo) {
          setProductos(respuesta.data.productos);
          setError("");
        }
      } catch (error) {
        if (componenteActivo) {
          setError("No se pudieron obtener los productos");
        }

        console.error(error);
      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    };

    cargarProductosIniciales();

    return () => {
      componenteActivo = false;
    };
  }, []);

  const obtenerProductos = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await api.get("/productos");

      setProductos(respuesta.data.productos);
    } catch (error) {
      setError("No se pudieron obtener los productos");
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  const manejarCambio = (evento) => {
    const { name, value } = evento.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });
  };

  const limpiarFormulario = () => {
    setFormulario(formularioInicial);
    setProductoEditando(null);
  };

  const manejarSubmit = async (evento) => {
    evento.preventDefault();

    try {
      setMensaje("");
      setError("");

      const datosProducto = {
        nombre: formulario.nombre,
        descripcion: formulario.descripcion,
        precio: Number(formulario.precio),
        stock: Number(formulario.stock),
        categoria: formulario.categoria,
      };

      if (productoEditando) {
        await api.put(`/productos/${productoEditando}`, datosProducto);
        setMensaje("Producto actualizado correctamente");
      } else {
        await api.post("/productos", datosProducto);
        setMensaje("Producto creado correctamente");
      }

      limpiarFormulario();
      obtenerProductos();
    } catch (error) {
      setError("Error al guardar el producto");
      console.error(error);
    }
  };

  const cargarProductoParaEditar = (producto) => {
    setProductoEditando(producto._id);

    setFormulario({
      nombre: producto.nombre,
      descripcion: producto.descripcion || "",
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria,
    });

    setMensaje("");
    setError("");
  };

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este producto?",
    );

    if (!confirmar) {
      return;
    }

    try {
      setMensaje("");
      setError("");

      await api.delete(`/productos/${id}`);

      setMensaje("Producto eliminado correctamente");
      obtenerProductos();
    } catch (error) {
      setError("Error al eliminar el producto");
      console.error(error);
    }
  };

  return (
    <section className="page">
      <h2>Gestión de productos</h2>

      <p>
        En esta sección se pueden crear, listar, editar y eliminar productos del
        inventario.
      </p>

      {mensaje && <div className="alert success">{mensaje}</div>}
      {error && <div className="alert error">{error}</div>}

      <form className="form" onSubmit={manejarSubmit}>
        <h3>{productoEditando ? "Editar producto" : "Crear producto"}</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              placeholder="Ej: Laptop Dell"
              required
            />
          </div>

          <div className="form-group">
            <label>Categoría</label>
            <input
              type="text"
              name="categoria"
              value={formulario.categoria}
              onChange={manejarCambio}
              placeholder="Ej: Computadoras"
              required
            />
          </div>

          <div className="form-group">
            <label>Precio</label>
            <input
              type="number"
              name="precio"
              value={formulario.precio}
              onChange={manejarCambio}
              placeholder="Ej: 1200"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={formulario.stock}
              onChange={manejarCambio}
              placeholder="Ej: 10"
              min="0"
              required
            />
          </div>

          <div className="form-group form-group-full">
            <label>Descripción</label>
            <textarea
              name="descripcion"
              value={formulario.descripcion}
              onChange={manejarCambio}
              placeholder="Ej: Laptop de alto rendimiento"
              rows="3"
            />
          </div>
        </div>

        <div className="actions">
          <button type="submit">
            {productoEditando ? "Guardar cambios" : "Crear producto"}
          </button>

          {productoEditando && (
            <button
              type="button"
              className="secondary"
              onClick={limpiarFormulario}
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <div className="section-header">
        <h3>Lista de productos</h3>

        <button type="button" className="secondary" onClick={obtenerProductos}>
          Actualizar lista
        </button>
      </div>

      {cargando ? (
        <p>Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p>No hay productos cargados.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {productos.map((producto) => (
                <tr key={producto._id}>
                  <td>{producto.nombre}</td>
                  <td>{producto.categoria}</td>
                  <td>${producto.precio}</td>
                  <td>{producto.stock}</td>
                  <td>{producto.descripcion}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="small"
                        onClick={() => cargarProductoParaEditar(producto)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="small danger"
                        onClick={() => eliminarProducto(producto._id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Productos;
