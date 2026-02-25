import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell
} from "recharts";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function EmployeeDetailsModal({ employee, onClose }) {

  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(
          `/dashboard/admin/employee/${employee.employeeId}/app-usage`
        );

        const usage = res.data.appUsage;

        const formatted = Object.entries(usage)
          .map(([app, seconds]) => ({
            name: app.replace("_exe", "").slice(0, 12), // shorter for mobile
            minutes: +(seconds / 60).toFixed(2)
          }))
          .sort((a, b) => b.minutes - a.minutes);

        setChartData(formatted);

        setStats({
          active: Math.floor(employee.activeSeconds / 60),
          idle: Math.floor(employee.idleSeconds / 60),
        });

      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [employee]);

  const totalMinutes = chartData.reduce((sum, app) => sum + app.minutes, 0);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex md:items-center md:justify-center">

      {/* MODAL */}
      <div className="bg-white w-full h-full md:h-auto md:max-w-5xl md:rounded-3xl p-5 md:p-8 overflow-y-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 font-bold">
              {employee.name?.charAt(0)}
            </div>

            <div>
              <h2 className="text-lg md:text-2xl font-bold">
                {employee.name}
              </h2>
              <p className="text-sm text-gray-500">{employee.email}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="self-end md:self-auto text-sm bg-red-100 text-red-600 px-4 py-1.5 rounded-lg"
          >
            Close
          </button>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <StatCard title="Active" value={formatMinutes(stats?.active)} />
          <StatCard title="Idle" value={formatMinutes(stats?.idle)} />
          <StatCard title="Total" value={formatMinutes(totalMinutes)} />
        </div>

        {/* CHART */}
        <div className="w-full h-[320px] md:h-[420px]">

          <ResponsiveContainer>
            <BarChart
              data={chartData}
              barSize={isMobile ? 22 : 42}
            >

              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="name"
                angle={isMobile ? 0 : -18}
                textAnchor={isMobile ? "middle" : "end"}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />

              <YAxis hide={isMobile} />

              <Tooltip />

              <Bar dataKey="minutes" radius={[10, 10, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={getBarColor(entry.name)} />
                ))}
              </Bar>

            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>
    </div>
  );
}

/* TIME FORMAT */
const formatMinutes = (mins) => {
  if (!mins) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

/* COLORS */
const getBarColor = (name) => {
  if (name.includes("productive")) return "#22c55e";
  if (name.includes("distracting")) return "#ef4444";
  return "#6366f1";
};

/* STAT CARD */
function StatCard({ title, value }) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 
                    border border-gray-100 p-4 rounded-xl text-center">

      <p className="text-xs text-gray-500">{title}</p>
      <h3 className="text-lg md:text-xl font-bold">{value}</h3>
    </div>
  );
}
