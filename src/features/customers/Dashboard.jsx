import { useAuth } from "../../context/AuthContext";
import CustomerSearch from "./CustomerSearch";
import { Link } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";

function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="flex justify-between items-center p-4 bg-white shadow">
        <div>
          <h1 className="text-lg font-semibold">
            Bienvenido, {user?.nombre || user?.email}
          </h1>
        </div>

        <div className="flex gap-4">
          <Link
            to="/notificaciones"
            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
          >
            Notificaciones
          </Link>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      <main>
        <Breadcrumb/>
        <CustomerSearch />
      </main>
    </div>
  );
}

export default Dashboard;
