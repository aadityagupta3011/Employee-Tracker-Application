import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function AdminDashboard() {

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/admin")
      .then(res => setEmployees(res.data))
      .finally(() => setLoading(false));
  }, []);

  /* ================= KPI CALCULATIONS ================= */

  const totalEmployees = employees.length;

  const totalTimeTracked = employees.reduce(
    (sum, emp) => sum + emp.activeSeconds + emp.idleSeconds,
    0
  );

  const avgFocus =
    employees.reduce((sum, emp) => sum + emp.focusScore, 0) /
    (employees.length || 1);

  const idleMoreThan30 = employees.filter(
    emp => emp.idleSeconds > 1800
  ).length;

  const mostProductive = [...employees].sort(
    (a, b) => b.focusScore - a.focusScore
  )[0];

  const leastProductive = [...employees].sort(
    (a, b) => a.focusScore - b.focusScore
  )[0];

  /* ================= FORMAT TIME ================= */

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const h = Math.floor(mins / 60);
    const m = mins % 60;

    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Analytics Dashboard 📊
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading analytics...</p>
        ) : (

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">

            <KpiCard title="Employees" value={totalEmployees} />

            <KpiCard
              title="Total Time"
              value={formatTime(totalTimeTracked)}
            />

            <KpiCard
              title="Avg Focus"
              value={`${avgFocus.toFixed(1)}%`}
            />

            <KpiCard
              title="Idle > 30m"
              value={idleMoreThan30}
              danger
            />

            <KpiCard
              title="Top Performer"
              value={mostProductive?.name || "-"}
              subtitle={`${mostProductive?.focusScore || 0}% focus`}
              success
            />

            <KpiCard
              title="Needs Attention"
              value={leastProductive?.name || "-"}
              subtitle={`${leastProductive?.focusScore || 0}% focus`}
              warning
            />

          </div>

        )}

      </div>
    </div>
  );
}

/* ================= KPI CARD ================= */

function KpiCard({ title, value, subtitle, danger, success, warning }) {

  const color =
    danger ? "border-red-200 bg-red-50" :
    success ? "border-green-200 bg-green-50" :
    warning ? "border-yellow-200 bg-yellow-50" :
    "border-gray-100 bg-white";

  return (
    <div className={`p-5 rounded-2xl border shadow-sm ${color}`}>

      <p className="text-sm text-gray-500">{title}</p>

      <h3 className="text-xl font-bold mt-1 text-gray-800">
        {value}
      </h3>

      {subtitle && (
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      )}

    </div>
  );
}