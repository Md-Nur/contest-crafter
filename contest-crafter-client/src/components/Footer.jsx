import { FaFacebook, FaLinkedin } from "react-icons/fa";
import logo from "../assets/logo.png";
const Footer = () => {
  return (
    <footer className="footer items-center p-4 bg-neutral text-neutral-content">
      <aside className="items-center grid-flow-col">
        <img src={logo} alt="logo" className="h-10 rounded-md" />
        <p>Copyright © 2024 - All right reserved</p>
      </aside>
      <nav className="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a className="cursor-pointer">
          <FaFacebook className="w-9 h-9" />
        </a>
        <a className="cursor-pointer">
          <FaLinkedin className="w-9 h-9" />
        </a>
      </nav>
    </footer>
  );
};

export default Footer;
