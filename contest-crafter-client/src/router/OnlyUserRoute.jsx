import Swal from "sweetalert2";
import { useUserAuth } from "../contexts/UserAuthProvider";
import { Navigate, useLocation } from "react-router-dom";

const OnlyUserRoute = ({ children }) => {
  const location = useLocation();
  const { userAuth, loading } = useUserAuth();

  
  if (loading) return <span className="loading loading-dots loading-lg"></span>;
  
  else if (!userAuth) {
    Swal.fire({
      title: "You are not authorized",
      text: "Please login to access this page",
      icon: "warning",
      confirmButtonText: "OK",
    });

    return <Navigate to="/login" state={location.pathname} />;
  }
  return children;
};

export default OnlyUserRoute;
