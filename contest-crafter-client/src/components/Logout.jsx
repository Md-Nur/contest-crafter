import { getAuth, signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import app from "../firebase/config";
import { useUserAuth } from "../contexts/UserAuthProvider";

const Logout = () => {
  const navigate = useNavigate();
  const auth = getAuth(app);
  const { setUserAuth, setLoading } = useUserAuth();
  const location = useLocation();
  return (
    <button
      onClick={() => {
        setLoading(true);
        Swal.fire({
          title: "Logging out...",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        signOut(auth)
          .then(() => {
            setUserAuth(null);
            localStorage.removeItem("access-token");
            setLoading(false);
            navigate("/login", { state: location.pathname });
            Swal.fire({
              icon: "success",
              title: "Logged out successfully",
              showConfirmButton: false,
              timer: 1500,
            });
          })
          .catch((err) => {
            Swal.fire({
              icon: "error",
              title: err.message,
              showConfirmButton: false,
              timer: 1500,
            });
          });
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
