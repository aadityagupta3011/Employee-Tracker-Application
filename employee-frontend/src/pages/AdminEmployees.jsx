import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import EmployeeDetailsModal from "./EmployeeDetailsModal.jsx";
import Navbar from "../components/Navbar.jsx";

const formatMinutes = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export default function AdminEmployees() {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("focus");
  const [sortOrder, setSortOrder] = useState("desc");

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["adminEmployees"],
    queryFn: async () => {
      const res = await api.get("/dashboard/admin");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const handleSort = (type) => {
    if (sortBy === type) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(type);
      setSortOrder("desc");
    }
  };

  const filteredEmployees = [...employees]
    .filter((emp) => {
      const query = search.toLowerCase();
      return (
        emp.name?.toLowerCase().includes(query) || emp.email?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      let value = 0;
      if (sortBy === "active") value = (a.activeSeconds || 0) - (b.activeSeconds || 0);
      if (sortBy === "idle") value = (a.idleSeconds || 0) - (b.idleSeconds || 0);
      if (sortBy === "focus") value = (a.focusScore || 0) - (b.focusScore || 0);
      if (sortBy === "name") value = (a.name || "").localeCompare(b.name || "");
      return sortOrder === "asc" ? value : -value;
    });

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-wrap space-y-6">
        <div className="page-header">
          <div>
            <span className="eyebrow">Employees</span>
            <h1 className="page-title mt-4">Directory with activity context</h1>
            <p className="page-subtitle mt-3">
              Search by name, sort by focus or time, and open a detailed usage
              breakdown for any employee.
            </p>
          </div>

          <div className="w-full max-w-sm">
            <input
              type="text"
              placeholder="Search employee"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
            />
          </div>
        </div>

        <section className="surface-card">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              Sort by
            </span>
            <SortButton active={sortBy === "focus"} onClick={() => handleSort("focus")}>
              Focus %
            </SortButton>
            <SortButton active={sortBy === "active"} onClick={() => handleSort("active")}>
              Active time
            </SortButton>
            <SortButton active={sortBy === "idle"} onClick={() => handleSort("idle")}>
              Idle time
            </SortButton>
            <SortButton active={sortBy === "name"} onClick={() => handleSort("name")}>
              A-Z
            </SortButton>
            <span className="pill">{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
          </div>
        </section>

        <section className="hidden md:block">
          <div className="table-shell">
            <table>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Active</th>
                  <th>Idle</th>
                  <th>Focus</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center text-stone-500">
                      Loading employees...
                    </td>
                  </tr>
                ) : (
                  filteredEmployees.map((emp) => (
                    <tr key={emp.employeeId} className="transition hover:bg-[rgba(248,243,235,0.72)]">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7e3c4] text-sm font-bold text-[#8d591d]">
                            {emp.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <p className="font-semibold text-stone-900">{emp.name}</p>
                            <p className="text-xs text-stone-500">{emp.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="font-semibold text-stone-700">
                        {formatMinutes(Math.floor((emp.activeSeconds || 0) / 60))}
                      </td>
                      <td className="text-stone-500">
                        {formatMinutes(Math.floor((emp.idleSeconds || 0) / 60))}
                      </td>
                      <td>
                        <span className="pill">{emp.focusScore || 0}% focus</span>
                      </td>
                      <td className="text-right">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="btn-primary !px-4 !py-2.5"
                        >
                          View details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4 md:hidden">
          {isLoading ? (
            <div className="empty-state">Loading employees...</div>
          ) : (
            filteredEmployees.map((emp) => (
              <div key={emp.employeeId} className="surface-card !p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-bold tracking-tight text-stone-900">
                      {emp.name}
                    </p>
                    <p className="text-sm text-stone-500">{emp.email}</p>
                  </div>
                  <span className="pill">{emp.focusScore || 0}%</span>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm text-stone-600">
                  <span>Active: {formatMinutes(Math.floor((emp.activeSeconds || 0) / 60))}</span>
                  <span>Idle: {formatMinutes(Math.floor((emp.idleSeconds || 0) / 60))}</span>
                </div>

                <button
                  onClick={() => setSelectedEmployee(emp)}
                  className="btn-primary mt-4 w-full"
                >
                  View details
                </button>
              </div>
            ))
          )}
        </section>
      </main>

      {selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}
    </div>
  );
}

function SortButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-[#1f3a33] text-white"
          : "border border-[rgba(83,61,39,0.12)] bg-white/70 text-stone-700 hover:bg-white"
      }`}
    >
      {children}
    </button>
  );
}
