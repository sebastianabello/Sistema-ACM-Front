import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

function CustomerSearch() {
  const { token } = useAuth();
  const [form, setForm] = useState({ nombre: "", placa: "", documento: "" });
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBuscar = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const params = new URLSearchParams();
    if (form.nombre) params.append("nombre", form.nombre);
    if (form.placa) params.append("placa", form.placa);
    if (form.documento) params.append("documento", form.documento);

    try {
      const response = await fetch(`http://localhost:3000/api/customers?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Error al buscar clientes");

      const data = await response.json();
      setResultados(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Buscar Cliente</h2>
      <form onSubmit={handleBuscar} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="placa"
          placeholder="Placa"
          value={form.placa}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="documento"
          placeholder="Documento"
          value={form.documento}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded col-span-1 md:col-span-3 hover:bg-blue-700"
        >
          Buscar
        </button>
      </form>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {resultados.length > 0 && (
        <div className="space-y-4">
          {resultados.map((cliente) => (
            <Link to={`/clientes/${cliente.id}`} key={cliente.id}>
              <div className="border p-4 rounded shadow-sm bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                <p><strong>Nombre:</strong> {cliente.nombre}</p>
                <p><strong>Documento:</strong> {cliente.documento}</p>
                <p><strong>Placa:</strong> {cliente.placa}</p>
                <p><strong>Mantenimientos disponibles:</strong> {cliente.mantenimientosDisponibles}</p>
                <p><strong>Vence:</strong> {cliente.fechaVencimiento}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerSearch;
