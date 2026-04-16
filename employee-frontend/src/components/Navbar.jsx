import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { path: "/", label: "Overview" },
  { path: "/employees", label: "Employees" },
  { path: "/dashboard", label: "Analytics" },
  { path: "/indident", label: "Incidents" },
  { path: "/profile", label: "Profile" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const adminName = localStorage.getItem("name") || "Admin";
  const initials = useMemo(
    () =>
      adminName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("") || "A",
    [adminName],
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navLinkClass = (path) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition break-words ${
      location.pathname === path
        ? "bg-[#1f3a33] text-white shadow-[0_12px_24px_rgba(31,58,51,0.18)]"
        : "text-stone-600 hover:bg-white/80 hover:text-stone-900"
    }`;

  return (
    <nav className="sticky top-0 z-40 border-b border-[rgba(83,61,39,0.08)] bg-[rgba(248,243,235,0.78)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f3a33] text-sm font-bold tracking-[0.2em] text-white">
            WT
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-extrabold tracking-tight text-stone-900 sm:text-lg">
              WorkTrack Admin
            </p>
            <p className="truncate text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500 sm:text-xs">
              Operations Console
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-[rgba(83,61,39,0.08)] bg-white/70 p-1.5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={navLinkClass(item.path)}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex items-center gap-3 rounded-full border border-[rgba(83,61,39,0.1)] bg-white/80 px-3 py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7e3c4] text-sm font-bold text-[#8d591d]">
              {initials}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-stone-800">{adminName}</p>
              <p className="text-xs text-stone-500">Administrator</p>
            </div>
          </div>

          <button onClick={handleLogout} className="btn-secondary !rounded-full !px-4 !py-2.5">
            Logout
          </button>
        </div>

        <button
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[rgba(83,61,39,0.12)] bg-white/75 text-stone-700 lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[rgba(83,61,39,0.08)] px-4 pb-4 lg:hidden sm:px-6">
          <div className="surface-card mt-2 space-y-3 !rounded-[24px] !p-4">
            <div className="flex items-center gap-3 rounded-2xl bg-[#f8f3eb] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7e3c4] text-sm font-bold text-[#8d591d]">
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">{adminName}</p>
                <p className="text-xs text-stone-500">Administrator</p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={navLinkClass(item.path)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <button onClick={handleLogout} className="btn-secondary w-full">
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
