import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function EmployeeNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navLink = (path, label) => (
    <Link
      to={path}
      onClick={() => setOpen(false)}
      className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium
      ${
        location.pathname === path
          ? "bg-indigo-600 text-white"
          : "text-gray-300 hover:text-white hover:bg-white/10"
      }`}
    >
      {label}
    </Link>
  );

  const userName = localStorage.getItem("name") || "E";

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* LOGO */}
        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          WorkTrack Employee
        </h1>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-2">
          {navLink("/employee-dashboard", "Dashboard")}
          {navLink("/employee-incidents", "My Incidents")}
          {navLink("/employee-profile", "Profile")}
        </div>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-4">

          {/* AVATAR */}
          <div className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-600 text-white font-semibold">
            {userName[0].toUpperCase()}
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-gray-300"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-2 bg-gray-900/95 backdrop-blur-lg">

          {navLink("/employee-dashboard", "Dashboard")}
          {navLink("/employee-incidents", "My Incidents")}
          {navLink("/employee-profile", "Profile")}

          <button
            onClick={handleLogout}
            className="mt-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm font-medium transition"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}