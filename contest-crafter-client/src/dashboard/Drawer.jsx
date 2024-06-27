import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useUserAuth } from "../contexts/UserAuthProvider";
import AdminSlider from "./admin/AdminSlider";
import CreatorSlider from "./creator/CreatorSlider";
import UserSlider from "./user/UserSlider";
import Swal from "sweetalert2";

const Drawer = () => {
  const { userAuth, loading } = useUserAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (userAuth?.isBlocked) {
    Swal.fire({
      icon: "error",
      title: "You are blocked",
      text: "You are blocked by the admin",
    });
    navigate("/");
  }

  return (
    <div className="drawer md:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-evenly">
        <label
          htmlFor="my-drawer-2"
          className="btn btn-primary drawer-button md:hidden"
        >
          Open drawer
        </label>
        <Outlet />
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-auto min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <li>
            <Link
              to="/dashboard"
              className={location.pathname === "/dashboard" ? "active" : ""}
            >
              Profile
            </Link>
          </li>
          {!loading && userAuth?.isAdmin ? (
            <AdminSlider />
          ) : userAuth?.isCreator ? (
            <CreatorSlider />
          ) : (
            <UserSlider />
          )}
        </ul>
      </div>
    </div>
  );
};

export default Drawer;
