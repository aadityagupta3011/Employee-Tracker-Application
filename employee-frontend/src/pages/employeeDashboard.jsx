import React, { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import EmployeeNavbar from "../components/EmployeeNavbar";
import api from "../api/axios";

const formatTime = (seconds = 0) => {
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
    api
      .get("/dashboard/employee")
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  const chartData = useMemo(() => {
    if (!data?.appUsage) return [];

    return Object.entries(data.appUsage)
      .map(([app, seconds]) => ({
        name: app.replace("_exe", "").replace("(neutral)", "").slice(0, 12),
        minutes: Number((seconds / 60).toFixed(1)),
      }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [data]);

  if (loading) {
    return (
      <div className="app-shell">
        <EmployeeNavbar />
        <main className="page-wrap">
          <div className="empty-state">Loading activity...</div>
        </main>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="app-shell">
        <EmployeeNavbar />
        <main className="page-wrap">
          <div className="empty-state">No activity data found.</div>
        </main>
      </div>
    );
  }

  const total = (data.activeSeconds || 0) + (data.idleSeconds || 0);
  const focus = total > 0 ? ((data.activeSeconds / total) * 100).toFixed(1) : 0;

  return (
    <div className="app-shell">
      <EmployeeNavbar />

      <main className="page-wrap space-y-8">
        <div className="page-header">
          <div>
            <span className="eyebrow">My Dashboard</span>
            <h1 className="page-title mt-4">Your daily activity summary</h1>
            <p className="page-subtitle mt-3">
              A simple view of active time, idle time, focus score, and your top
              application usage.
            </p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <StatCard title="Active time" value={formatTime(data.activeSeconds)} />
          <StatCard title="Idle time" value={formatTime(data.idleSeconds)} />
          <StatCard title="Focus score" value={`${focus}%`} />
        </section>

        <section className="surface-card">
          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="eyebrow">App Usage</span>
              <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-stone-900">
                Where your time went
              </h2>
            </div>
          </div>

          <div className="mt-8 h-[340px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap={18}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbcdb9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} />
                <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="minutes" fill="#1f3a33" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-2xl bg-[#1f3a33] px-3 py-2 text-sm text-white shadow-lg">
        {payload[0].payload.name}: {payload[0].value} min
      </div>
    );
  }

  return null;
};

function StatCard({ title, value }) {
  return (
    <div className="metric-card">
      <p className="text-sm font-semibold text-stone-500">{title}</p>
      <div className="metric-value">{value}</div>
    </div>
  );
}
