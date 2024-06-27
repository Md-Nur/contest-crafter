import { MdMenu } from "react-icons/md";
import logo from "../assets/logo.png";
import { Link, NavLink } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useUserAuth } from "../contexts/UserAuthProvider";
import Logout from "./Logout";

const NavRoute = () => {
  const { userAuth } = useUserAuth();
  return (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/all-contests">All Contests</NavLink>
      </li>
      {!userAuth ? (
        <>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
          <li>
            <NavLink to="/register">Register</NavLink>
          </li>
        </>
      ) : (
        <li>
          <Logout />
        </li>
      )}
    </>
  );
};

const NavbarComponent = () => {
  const [theme, setTheme] = useState();
  const { loading, userAuth } = useUserAuth();
  useEffect(() => {
    if (!theme) {
      setTheme(
        localStorage.getItem("theme") ||
          document.getElementsByTagName("html")[0].getAttribute("data-theme")
      );
    } else {
      document
        .getElementsByTagName("html")[0]
        .setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const handleThemeChange = () => {
    // console.log(theme);
    if (theme === "night") {
      setTheme("lofi");
    } else {
      setTheme("night");
    }
  };

  return (
    <nav className="navbar bg-base-300 justify-center gap-5">
      <div className="navbar-start w-auto">
        <div className="dropdown dropdown-end mx-2">
          {userAuth && !loading && (
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-12 rounded-full">
                <img src={userAuth.photoURL} alt={userAuth.displayName} />
              </div>
            </div>
          )}
          <ul
            tabIndex={0}
            className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-200 rounded-box w-52"
          >
            <li>
              <span>{userAuth ? userAuth.displayName : "Profile"}</span>
            </li>
            <li className={userAuth?.isBlocked ? "hidden" : ""}>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Logout />
            </li>
          </ul>
        </div>
        <button className="mx-1" onClick={handleThemeChange}>
          {/* this hidden checkbox controls the state */}

          {theme === "night" ? (
            <FaSun className="swap-off fill-current w-6 h-6" />
          ) : (
            <FaMoon className="swap-on fill-current w-6 h-6" />
          )}
        </button>
      </div>
      <div className="navbar-center w-auto">
        <Link to="/" className="cursor-pointer h-10 text-xl">
          <img src={logo} alt="logo" className="rounded h-full" />
        </Link>
      </div>
      <div className="navbar-end w-auto">
        <ul className="hidden lg:flex menu menu-horizontal px-1 space-x-2">
          <NavRoute />
        </ul>
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <MdMenu className="text-2xl" />
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <NavRoute />
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavbarComponent;
