import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

export const showSuccess = (message) =>
  MySwal.fire({
    icon: "success",
    title: "Éxito",
    text: message,
    confirmButtonColor: "#3085d6"
  });

export const showError = (message) =>
  MySwal.fire({
    icon: "error",
    title: "Error",
    text: message,
    confirmButtonColor: "#d33"
  });

export const showConfirm = async (message) =>
  MySwal.fire({
    title: "¿Estás seguro?",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#aaa",
    confirmButtonText: "Sí, confirmar",
    cancelButtonText: "Cancelar"
  });
