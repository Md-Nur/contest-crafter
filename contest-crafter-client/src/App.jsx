import { Outlet } from "react-router-dom";

import Footer from "./components/Footer";
import NavbarComponent from "./components/NavbarComponent";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    document.title = "Contest Crafter";

    const theme = localStorage.getItem("theme");
    if (theme) {
      document
        .getElementsByTagName("html")[0]
        .setAttribute("data-theme", theme);
    }
  }, []);
  return (
    <>
      <NavbarComponent />
      <main className="flex flex-col justify-center items-center min-h-[calc(100vh-140.61px)] mx-auto">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default App;
