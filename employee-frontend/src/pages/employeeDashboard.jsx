import React, { useEffect, useState } from "react";
import EmployeeNavbar from "../components/EmployeeNavbar";
import api from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ================= TIME FORMAT ================= */
const formatTime = (seconds) => {
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) return `${hours} hr ${minutes} min`;
  if (hours > 0) return `${hours} hr`;
  return `${minutes} min`;
};

export default function EmployeeDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/employee")
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EmployeeNavbar />
        <p className="p-6">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50">
        <EmployeeNavbar />
        <p className="p-6 text-gray-500">No data found</p>
      </div>
    );
  }

  const total = data.activeSeconds + data.idleSeconds;
  const focus =
    total > 0 ? ((data.activeSeconds / total) * 100).toFixed(2) : 0;

  /* ================= CHART DATA ================= */

  const chartData = Object.entries(data.appUsage || {})
    .map(([app, seconds]) => ({
      name: app.replace("_exe", "").replace("(neutral)", "").slice(0, 12),
      minutes: (seconds / 60).toFixed(1),
    }))
    .sort((a, b) => b.minutes - a.minutes);

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeNavbar />

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        <h2 className="text-3xl font-bold text-gray-800">
          My Activity Dashboard
        </h2>

        {/* ===== STATS ===== */}
        <div className="grid md:grid-cols-3 gap-6">

          <StatCard
            title="Active Time"
            value={formatTime(data.activeSeconds)}
            color="green"
          />

          <StatCard
            title="Idle Time"
            value={formatTime(data.idleSeconds)}
            color="red"
          />

          <StatCard
            title="Focus Score"
            value={`${focus}%`}
            color="indigo"
          />

        </div>

        {/* ===== CHART ===== */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h3 className="font-bold mb-4">App Usage</h3>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} barCategoryGap={25}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="minutes"
                fill="#6366f1"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

/* ================= TOOLTIP ================= */

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow">
        {payload[0].payload.name} : {payload[0].value} min
      </div>
    );
  }
  return null;
};

/* ================= CARD ================= */

function StatCard({ title, value, color }) {
  const colors = {
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    indigo: "bg-indigo-100 text-indigo-600",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center hover:shadow-md transition">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>

      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold ${colors[color]}`}
      >
        {title.charAt(0)}
      </div>
    </div>
  );
}