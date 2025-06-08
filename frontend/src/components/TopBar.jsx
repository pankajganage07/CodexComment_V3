import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="w-full bg-gray-900 shadow-md">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <Link className="text-3xl font-bold text-cyan-500 whitespace-nowrap" to="/">
          CodexComment
        </Link>

        <nav className="flex space-x-8">
          <NavItem to="/mainPage" label="Home" currentPath={location.pathname} exact />
          <NavItem to="/mainPage/history" label="History" currentPath={location.pathname} />
          <NavItem to="/mainPage/uploadFile" label="Upload File" currentPath={location.pathname} />
        </nav>

        <button
          className="px-5 py-2 bg-cyan-500 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-400 transition duration-300 hover:scale-105"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/signin");
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

function NavItem({ to, label, currentPath, exact = false }) {
  // Normalize to remove trailing slashes for consistency
  const normalize = (path) => path.replace(/\/+$/, "");

  const normalizedCurrent = normalize(currentPath);
  const normalizedTo = normalize(to);

  let isActive;

  if (exact) {
    // Active only if exactly matches
    isActive = normalizedCurrent === normalizedTo;
  } else {
    // Active if current path starts with nav path + '/'
    isActive =
      normalizedCurrent === normalizedTo ||
      normalizedCurrent.startsWith(normalizedTo + "/");
  }

  return (
    <Link
      to={to}
      className={`relative text-lg font-medium pb-1 transition duration-300 ${
        isActive ? "text-cyan-300 font-bold" : "text-cyan-500 hover:text-cyan-300"
      }`}
    >
      {label}
      <span
        className={`absolute left-0 bottom-0 h-[3px] w-full transition-all duration-300 rounded-lg ${
          isActive ? "bg-cyan-300 scale-100" : "bg-transparent scale-0"
        }`}
      />
    </Link>
  );
}
