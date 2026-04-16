import { useEffect, useState } from "react";
import EmployeeNavbar from "../components/EmployeeNavbar";
import api from "../api/axios";

export default function EmployeeProfile() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => {
        setEmployee(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
        localStorage.setItem("name", res.data.name);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="app-shell">
        <EmployeeNavbar />
        <main className="page-wrap">
          <div className="empty-state">Loading profile...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <EmployeeNavbar />

      <main className="page-wrap space-y-6">
        <div className="page-header">
          <div>
            <span className="eyebrow">Profile</span>
            <h1 className="page-title mt-4">Your account details</h1>
            <p className="page-subtitle mt-3">
              A simple summary of the details attached to your employee account.
            </p>
          </div>
        </div>

        <section className="surface-card grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[24px] bg-[#1f3a33] p-6 text-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl font-bold">
              {name?.charAt(0)?.toUpperCase() || "E"}
            </div>
            <h2 className="mt-5 text-2xl font-extrabold tracking-tight">{name}</h2>
            <p className="mt-2 text-sm text-stone-200">{email}</p>
            <div className="mt-8 space-y-3 text-sm text-stone-200">
              <p>Role: {employee.role}</p>
              <p>Employee ID: {employee.employeeId}</p>
              <p>Joined: {new Date(employee.createdAt).toLocaleDateString("en-IN")}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ProfileField label="Name" value={name} onChange={setName} />
            <ProfileField label="Email" value={email} onChange={setEmail} />
            <ProfileField label="Role" value={employee.role} disabled />
            <ProfileField label="Employee ID" value={employee.employeeId} disabled />
            <div className="md:col-span-2">
              <ProfileField
                label="Joined On"
                value={new Date(employee.createdAt).toLocaleDateString("en-IN")}
                disabled
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function ProfileField({ label, value, onChange, disabled = true }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-stone-700">{label}</span>
      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="input-field disabled:cursor-not-allowed disabled:bg-[#f5f0e8] disabled:text-stone-600"
      />
    </label>
  );
}
