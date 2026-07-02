import { useEffect, useState } from "react";
import api from "../api/axios";

const formularioInicial = {
  nombre: "",
  correo: "",
  telefono: "",
  direccion: "",
};

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let componenteActivo = true;

    const cargarClientesIniciales = async () => {
      try {
        const respuesta = await api.get("/clientes");

        if (componenteActivo) {
          setClientes(respuesta.data.clientes);
          setError("");
        }
      } catch (error) {
        if (componenteActivo) {
          setError("No se pudieron obtener los clientes");
        }

        console.error(error);
      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    };

    cargarClientesIniciales();

    return () => {
      componenteActivo = false;
    };
  }, []);

  const obtenerClientes = async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await api.get("/clientes");

      setClientes(respuesta.data.clientes);
    } catch (error) {
      setError("No se pudieron obtener los clientes");
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
    setClienteEditando(null);
  };

  const manejarSubmit = async (evento) => {
    evento.preventDefault();

    try {
      setMensaje("");
      setError("");

      const datosCliente = {
        nombre: formulario.nombre,
        correo: formulario.correo,
        telefono: formulario.telefono,
        direccion: formulario.direccion,
      };

      if (clienteEditando) {
        await api.put(`/clientes/${clienteEditando}`, datosCliente);
        setMensaje("Cliente actualizado correctamente");
      } else {
        await api.post("/clientes", datosCliente);
        setMensaje("Cliente creado correctamente");
      }

      limpiarFormulario();
      obtenerClientes();
    } catch (error) {
      setError("Error al guardar el cliente");
      console.error(error);
    }
  };

  const cargarClienteParaEditar = (cliente) => {
    setClienteEditando(cliente._id);

    setFormulario({
      nombre: cliente.nombre,
      correo: cliente.correo,
      telefono: cliente.telefono || "",
      direccion: cliente.direccion || "",
    });

    setMensaje("");
    setError("");
  };

  const eliminarCliente = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este cliente?",
    );

    if (!confirmar) {
      return;
    }

    try {
      setMensaje("");
      setError("");

      await api.delete(`/clientes/${id}`);

      setMensaje("Cliente eliminado correctamente");
      obtenerClientes();
    } catch (error) {
      setError("Error al eliminar el cliente");
      console.error(error);
    }
  };

  return (
    <section className="page">
      <h2>Gestión de clientes</h2>

      <p>
        En esta sección se pueden crear, listar, editar y eliminar clientes de
        la tienda.
      </p>

      {mensaje && <div className="alert success">{mensaje}</div>}
      {error && <div className="alert error">{error}</div>}

      <form className="form" onSubmit={manejarSubmit}>
        <h3>{clienteEditando ? "Editar cliente" : "Crear cliente"}</h3>

        <div className="form-grid">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              placeholder="Ej: Juan Pérez"
              required
            />
          </div>

          <div className="form-group">
            <label>Correo electrónico</label>
            <input
              type="email"
              name="correo"
              value={formulario.correo}
              onChange={manejarCambio}
              placeholder="Ej: juan@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input
              type="text"
              name="telefono"
              value={formulario.telefono}
              onChange={manejarCambio}
              placeholder="Ej: 3804555666"
            />
          </div>

          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              name="direccion"
              value={formulario.direccion}
              onChange={manejarCambio}
              placeholder="Ej: Av. Central 123"
            />
          </div>
        </div>

        <div className="actions">
          <button type="submit">
            {clienteEditando ? "Guardar cambios" : "Crear cliente"}
          </button>

          {clienteEditando && (
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
        <h3>Lista de clientes</h3>

        <button type="button" className="secondary" onClick={obtenerClientes}>
          Actualizar lista
        </button>
      </div>

      {cargando ? (
        <p>Cargando clientes...</p>
      ) : clientes.length === 0 ? (
        <p>No hay clientes cargados.</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Dirección</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente._id}>
                  <td>{cliente.nombre}</td>
                  <td>{cliente.correo}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.direccion}</td>
                  <td>
                    <div className="table-actions">
                      <button
                        type="button"
                        className="small"
                        onClick={() => cargarClienteParaEditar(cliente)}
                      >
                        Editar
                      </button>

                      <button
                        type="button"
                        className="small danger"
                        onClick={() => eliminarCliente(cliente._id)}
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

export default Clientes;
