import { useEffect, useState } from "react";
import EmployeeNavbar from "../components/EmployeeNavbar";
import api from "../api/axios";

export default function EmployeeProfile() {

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    api.get("/auth/me")
      .then(res => {
        setEmployee(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EmployeeNavbar />
        <p className="p-8">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <EmployeeNavbar />

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        <h2 className="text-3xl font-bold text-gray-800">
          My Profile 👤
        </h2>

        <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">

          <h3 className="text-lg font-semibold">
            Basic Information
          </h3>

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-500">Name</label>
            <input
              value={name}
              disabled
              className="w-full border rounded-lg p-2 mt-1 bg-gray-100"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              value={email}
              disabled
              className="w-full border rounded-lg p-2 mt-1 bg-gray-100"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm text-gray-500">Role</label>
            <input
              value={employee.role}
              disabled
              className="w-full border rounded-lg p-2 mt-1 bg-gray-100"
            />
          </div>

          {/* EMPLOYEE ID */}
          <div>
            <label className="text-sm text-gray-500">Employee ID</label>
            <input
              value={employee.employeeId}
              disabled
              className="w-full border rounded-lg p-2 mt-1 bg-gray-100"
            />
          </div>

          {/* JOINING DATE */}
          <div>
            <label className="text-sm text-gray-500">Joined On</label>
            <input
              value={new Date(employee.createdAt).toLocaleDateString("en-IN")}
              disabled
              className="w-full border rounded-lg p-2 mt-1 bg-gray-100"
            />
          </div>

        </div>

      </div>

    </div>
  );
}