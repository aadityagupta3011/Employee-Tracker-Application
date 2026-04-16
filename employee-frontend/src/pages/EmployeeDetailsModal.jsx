import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import api from "../api/axios";

export default function EmployeeDetailsModal({ employee, onClose }) {
  const [chartData, setChartData] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          `/dashboard/admin/employee/${employee.employeeId}/app-usage`,
        );

        const usage = res.data.appUsage || {};
        const formatted = Object.entries(usage)
          .map(([app, seconds]) => ({
            name: app.replace("_exe", "").slice(0, 12),
            minutes: Number((seconds / 60).toFixed(2)),
          }))
          .sort((a, b) => b.minutes - a.minutes);

        setChartData(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [employee]);

  const totalMinutes = useMemo(
    () => Math.round(chartData.reduce((sum, app) => sum + app.minutes, 0)),
    [chartData],
  );

  return (
    <div className="modal-backdrop">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[28px] border border-[rgba(83,61,39,0.08)] bg-[#fbf7f0] p-4 shadow-2xl sm:rounded-[32px] sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f7e3c4] text-xl font-bold text-[#8d591d]">
              {employee.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-2xl font-extrabold tracking-tight text-stone-900">
                {employee.name}
              </h2>
              <p className="break-words text-sm text-stone-500">{employee.email}</p>
            </div>
          </div>

          <button onClick={onClose} className="btn-secondary self-end sm:self-auto">
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <StatCard
            title="Active"
            value={formatMinutes(Math.floor((employee.activeSeconds || 0) / 60))}
          />
          <StatCard
            title="Idle"
            value={formatMinutes(Math.floor((employee.idleSeconds || 0) / 60))}
          />
          <StatCard title="Total" value={formatMinutes(totalMinutes)} />
        </div>

        <div className="mt-8 h-[320px] w-full rounded-[28px] bg-white/75 p-4 sm:h-[420px] sm:p-6">
          <ResponsiveContainer>
            <BarChart data={chartData} barSize={isMobile ? 22 : 40}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dbcdb9" />
              <XAxis
                dataKey="name"
                angle={isMobile ? 0 : -16}
                textAnchor={isMobile ? "middle" : "end"}
                tick={{ fontSize: isMobile ? 10 : 12, fill: "#6b7280" }}
              />
              <YAxis hide={isMobile} tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="minutes" radius={[10, 10, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={getBarColor(entry.name)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

const formatMinutes = (mins) => {
  if (!mins) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

const getBarColor = (name) => {
  if (name.includes("productive")) return "#2d6a4f";
  if (name.includes("distracting")) return "#b45146";
  return "#1f3a33";
};

function StatCard({ title, value }) {
  return (
    <div className="metric-card text-center">
      <p className="text-sm font-semibold text-stone-500">{title}</p>
      <div className="metric-value !mt-2 !text-2xl">{value}</div>
    </div>
  );
}
