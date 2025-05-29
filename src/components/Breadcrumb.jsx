import { Link, useLocation } from "react-router-dom";

function Breadcrumb() {
  const location = useLocation();
  const parts = location.pathname.split("/").filter(Boolean);

  const crumbs = parts.map((part, index) => {
    const path = "/" + parts.slice(0, index + 1).join("/");
    const label = part.charAt(0).toUpperCase() + part.slice(1);

    return (
      <span key={path} className="flex items-center">
        <span className="mx-2 text-gray-400">/</span>
        <Link to={path} className="text-blue-600 hover:underline capitalize">
          {isNaN(label) ? label : "Detalle"}
        </Link>
      </span>
    );
  });

  return (
    <nav className="text-sm text-gray-600 py-3 px-4">
      <div className="flex items-center">
        <Link to="/" className="text-blue-600 hover:underline">Inicio</Link>
        {crumbs}
      </div>
    </nav>
  );
}

export default Breadcrumb;
