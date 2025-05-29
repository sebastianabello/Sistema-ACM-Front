import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { showSuccess, showError, showConfirm } from "../../utils/alerts";
import Breadcrumb from "../../components/Breadcrumb.jsx";

function CustomerDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [cliente, setCliente] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formEdit, setFormEdit] = useState({ nombre: "", email: "" });
  const [historial, setHistorial] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const fetchCliente = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/customers/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setCliente(data);
    } catch (err) {
      setError("Error al obtener cliente");
    }
  };

  const fetchHistorial = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/customers/${id}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setHistorial(data.historial);
    } catch (err) {
      setError("Error al obtener historial");
    }
  };

  const consumirMantenimiento = async () => {
    const confirmar = await showConfirm("¿Registrar un mantenimiento para este cliente?");

    if (!confirmar.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:3000/api/customers/${id}/consume`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sede: "Cali" }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al registrar mantenimiento");
      }

      await fetchCliente();
      await fetchHistorial();
      showSuccess("Mantenimiento registrado correctamente.");
    } catch (err) {
      showError(err.message);
    }
  };

  const handleEliminarHistorial = async () => {
    const resultado = await showConfirm("Esto eliminará el historial del cliente (modo demo)");

    if (!resultado.isConfirmed) return;

    try {
      const res = await fetch(`http://localhost:3000/api/customers/${id}/history`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("No se pudo eliminar el historial");

      showSuccess("Historial eliminado correctamente.");
      await fetchHistorial();
    } catch (err) {
      showError(err.message);
    }
  };

  const handleGuardarCambios = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`http://localhost:3000/api/customers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: formEdit.nombre,
          email: formEdit.email
        })
      });

      if (!res.ok) throw new Error("Error al actualizar el cliente");

      await fetchCliente();
      showSuccess("Datos actualizados correctamente.");
      setEditando(false);
    } catch (err) {
      showError(err.message);
    }
  };


  useEffect(() => {
    fetchCliente();
    fetchHistorial();
  }, [id]);

  if (!cliente) return <p className="p-4">Cargando cliente...</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white shadow rounded p-6">
      <Breadcrumb/>
      <h2 className="text-xl font-bold mb-2">
        Cliente: {cliente.nombre}
      </h2>

      {!editando ? (
        <>
          <p><strong>Email:</strong> {cliente.email}</p>
          <p><strong>Documento:</strong> {cliente.documento}</p>
          <p><strong>Placa:</strong> {cliente.placa}</p>

          <button
            onClick={() => {
              setEditando(true);
              setFormEdit({ nombre: cliente.nombre, email: cliente.email || "" });
            }}
            className="mt-2 bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
          >
            Editar nombre y correo
          </button>
        </>
      ) : (
        <form
          onSubmit={handleGuardarCambios}
          className="mt-2 bg-yellow-50 p-4 rounded shadow-inner space-y-2"
        >
          <input
            type="text"
            name="nombre"
            value={formEdit.nombre}
            onChange={(e) => setFormEdit({ ...formEdit, nombre: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Nombre"
            required
          />
          <input
            type="email"
            name="email"
            value={formEdit.email}
            onChange={(e) => setFormEdit({ ...formEdit, email: e.target.value })}
            className="w-full p-2 border rounded"
            placeholder="Correo electrónico"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setEditando(false)}
              className="bg-gray-400 text-white px-4 py-1 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <p><strong>Mantenimientos disponibles:</strong> {cliente.mantenimientosDisponibles}</p>
      <p><strong>Vencimiento:</strong> {cliente.fechaVencimiento}</p>

      <button
        onClick={consumirMantenimiento}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Registrar mantenimiento
      </button>

      {mensaje && <p className="text-green-600 mt-2">{mensaje}</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <h3 className="text-lg font-semibold mt-6">Historial</h3>
      <ul className="mt-2 space-y-2">
        {historial.length > 0 ? (
          historial.map((h, index) => (
            <li key={index} className="border p-2 rounded bg-gray-50">
              {h.fecha} — {h.sede}
            </li>
          ))
        ) : (
          <p>No hay historial registrado.</p>
        )}
      </ul>
      <button
        onClick={handleEliminarHistorial}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Eliminar historial (modo demo)
      </button>

    </div>
  );
}

export default CustomerDetail;
