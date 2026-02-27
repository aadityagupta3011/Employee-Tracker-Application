import { useEffect, useState } from "react";
import api from "../api/axios";
import EmployeeDetailsModal from "./EmployeeDetailsModal.jsx";
import Navbar from "../components/Navbar.jsx";

export default function AdminEmployees() {

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState("focus");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    api.get("/dashboard/admin")
      .then(res => setEmployees(res.data))
      .finally(() => setLoading(false));
  }, []);

  const formatMinutes = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  const handleSort = (type) => {
    if (sortBy === type) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortBy(type);
      setSortOrder("desc");
    }
  };

  const sortedEmployees = [...employees]
    .filter(emp =>
      emp.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {

      let value = 0;

      if (sortBy === "active") value = a.activeSeconds - b.activeSeconds;
      if (sortBy === "idle") value = a.idleSeconds - b.idleSeconds;
      if (sortBy === "focus") value = a.focusScore - b.focusScore;
      if (sortBy === "name") value = a.name.localeCompare(b.name);

      return sortOrder === "asc" ? value : -value;
    });

  const SortButton = ({ type, label }) => (
    <button
      onClick={() => handleSort(type)}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition
      ${sortBy === type
          ? "bg-indigo-600 text-white"
          : "bg-white border hover:bg-gray-50"}
      `}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">

          <h2 className="text-3xl font-bold text-gray-800">
            Employees
          </h2>

          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-xl px-4 py-2 w-full md:w-72 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

        </div>
{/* SORT BUTTONS */}
<div className="flex flex-wrap items-center gap-3 mb-4">

  <span className="font-semibold text-gray-700 whitespace-nowrap">
    Sort:
  </span>

  <SortButton type="focus" label="Focus %" />
  <SortButton type="active" label="Active Time" />
  <SortButton type="idle" label="Idle Time" />
  <SortButton type="name" label="A–Z" />

</div>

        {/* DESKTOP TABLE */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm border">

          <table className="w-full">

            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="p-4 text-left">Employee</th>
                <th className="p-4">Active</th>
                <th className="p-4">Idle</th>
                <th className="p-4">Focus</th>
                <th className="p-4"></th>
              </tr>
            </thead>

            <tbody>

              {loading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    Loading employees...
                  </td>
                </tr>
              ) : sortedEmployees.map(emp => (

                <tr key={emp.employeeId} className="border-t hover:bg-gray-50">

                  <td className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{emp.name}</p>
                      <p className="text-sm text-gray-500">{emp.email}</p>
                    </div>
                  </td>

                  <td className="p-4 text-center font-medium">
                    {formatMinutes(Math.floor(emp.activeSeconds / 60))}
                  </td>

                  <td className="p-4 text-center text-gray-500">
                    {formatMinutes(Math.floor(emp.idleSeconds / 60))}
                  </td>

                  <td className="p-4 text-center">
                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-600 font-semibold">
                      {emp.focusScore}%
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedEmployee(emp)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm shadow"
                    >
                      View Details
                    </button>
                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        </div>

        {/* MOBILE CARDS */}
        <div className="md:hidden space-y-4">

          {sortedEmployees.map(emp => (

            <div key={emp.employeeId} className="bg-white p-4 rounded-2xl shadow-sm border">

              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="font-semibold">{emp.name}</p>
                  <p className="text-sm text-gray-500">{emp.email}</p>
                </div>

                <span className="text-green-600 font-bold">
                  {emp.focusScore}%
                </span>
              </div>

              <div className="flex justify-between text-sm text-gray-600 mb-3">
                <p>Active: {formatMinutes(Math.floor(emp.activeSeconds / 60))}</p>
                <p>Idle: {formatMinutes(Math.floor(emp.idleSeconds / 60))}</p>
              </div>

              <button
                onClick={() => setSelectedEmployee(emp)}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg"
              >
                View Details
              </button>

            </div>

          ))}

        </div>

      </div>

      {selectedEmployee && (
        <EmployeeDetailsModal
          employee={selectedEmployee}
          onClose={() => setSelectedEmployee(null)}
        />
      )}

    </div>
  );
}