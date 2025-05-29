import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { showSuccess, showError, showConfirm } from "../../utils/alerts";
import Breadcrumb from "../../components/Breadcrumb.jsx";

function NotificationPage() {
  const { token } = useAuth();
  const [cargando, setCargando] = useState(false);

  const enviarNotificaciones = async () => {
    const confirmar = await showConfirm("¿Deseas ejecutar la revisión de vencimientos y enviar notificaciones?");
    if (!confirmar.isConfirmed) return;

    setCargando(true);
    try {
      const res = await fetch("http://localhost:3000/api/notifications/proximos-vencimientos", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Error al enviar notificaciones");

      const data = await res.json();
      showSuccess(`Notificados: ${data.totalClientesNotificados}\n${data.clientes.join(", ")}`);
    } catch (err) {
      showError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white p-6 rounded shadow">
      <Breadcrumb/>
      <h2 className="text-xl font-bold mb-4">Enviar Notificaciones de Vencimiento</h2>
      <p className="mb-4">Este botón ejecutará el proceso para notificar por correo a los clientes que cumplen con condiciones de vencimiento.</p>

      <button
        onClick={enviarNotificaciones}
        disabled={cargando}
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
      >
        {cargando ? "Enviando..." : "Ejecutar notificaciones"}
      </button>
    </div>
  );
}

export default NotificationPage;
