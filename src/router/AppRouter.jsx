import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/Login";
import Dashboard from "../features/customers/Dashboard"; // futura vista
import { useAuth } from "../context/AuthContext";
import CustomerDetail from "../features/customers/CustomerDetail";
import NotificationPage from "../features/notifications/NotificationPage";



function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Ruta protegida */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/clientes/:id"
          element={
            <PrivateRoute>
              <CustomerDetail />
            </PrivateRoute>
          }
        />

        <Route
          path="/notificaciones"
          element={
            <PrivateRoute>
              <NotificationPage />
            </PrivateRoute>
          }
        />


      </Routes>
    </Router>
  );
}

export default AppRouter;
