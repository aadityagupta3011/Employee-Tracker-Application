import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function AdminProfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { data: admin, isLoading } = useQuery({
    queryKey: ["adminProfile"],
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (admin) {
      setName(admin.name);
      setEmail(admin.email);
      localStorage.setItem("name", admin.name);
    }
  }, [admin]);

  if (isLoading) {
    return (
      <div className="app-shell">
        <Navbar />
        <main className="page-wrap">
          <div className="empty-state">Loading profile...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-wrap space-y-6">
        <div className="page-header">
          <div>
            <span className="eyebrow">Profile</span>
            <h1 className="page-title mt-4">Administrator details</h1>
            <p className="page-subtitle mt-3">
              A clean read-only view of your account information for this panel.
            </p>
          </div>
        </div>

        <section className="surface-card grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-[24px] bg-[#1f3a33] p-6 text-white">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 text-2xl font-bold">
              {name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <h2 className="mt-5 text-2xl font-extrabold tracking-tight">{name}</h2>
            <p className="mt-2 text-sm text-stone-200">{email}</p>
            <div className="mt-8 space-y-3 text-sm text-stone-200">
              <p>Role: {admin.role}</p>
              <p>Employee ID: {admin.employeeId || "Not assigned"}</p>
              <p>
                Joined:{" "}
                {admin.createdAt
                  ? new Date(admin.createdAt).toLocaleDateString("en-IN")
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ProfileField label="Name" value={name} onChange={setName} />
            <ProfileField label="Email" value={email} onChange={setEmail} />
            <ProfileField label="Role" value={admin.role} disabled />
            <ProfileField label="Employee ID" value={admin.employeeId || "N/A"} disabled />
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
