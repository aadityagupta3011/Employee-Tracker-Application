import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const formatMinutes = (seconds = 0) => `${Math.floor(seconds / 60)} min`;

export default function AdminDashboard() {
  const dropdownRef = useRef(null);
  const queryClient = useQueryClient();

  const [selected, setSelected] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [empName, setEmpName] = useState("");
  const [empEmail, setEmpEmail] = useState("");
  const [empPassword, setEmpPassword] = useState("");
  const [empDept, setEmpDept] = useState("");
  const [creating, setCreating] = useState(false);

  const { data: employees = [], isLoading } = useQuery({
    queryKey: ["adminEmployees"],
    queryFn: async () => {
      const res = await api.get("/dashboard/admin");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sortedByFocus = useMemo(
    () => [...employees].sort((a, b) => (b.focusScore || 0) - (a.focusScore || 0)),
    [employees],
  );

  const topFive = sortedByFocus.slice(0, 5);
  const lowFive = [...sortedByFocus].reverse().slice(0, 5);
  const averageFocus = employees.length
    ? Math.round(
        employees.reduce((sum, emp) => sum + (emp.focusScore || 0), 0) / employees.length,
      )
    : 0;
  const totalActiveHours = (
    employees.reduce((sum, emp) => sum + (emp.activeSeconds || 0), 0) / 3600
  ).toFixed(1);

  const filteredEmployees = employees.filter((emp) => {
    const query = searchTerm.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(query) || emp.email?.toLowerCase().includes(query)
    );
  });

  const sendMail = async () => {
    await api.post("/admin/send-mail", {
      to: selected.map((emp) => emp.email),
      subject,
      message,
    });

    alert("Mail sent.");
    setSelected([]);
    setSubject("");
    setMessage("");
  };

  const handleCreateEmployee = async () => {
    if (!empName || !empEmail || !empPassword || !empDept) {
      alert("All fields are required.");
      return;
    }

    try {
      setCreating(true);
      await api.post("/auth/register-employee", {
        name: empName,
        email: empEmail,
        password: empPassword,
        department: empDept,
      });

      alert("Employee created.");
      setEmpName("");
      setEmpEmail("");
      setEmpPassword("");
      setEmpDept("");
      queryClient.invalidateQueries({ queryKey: ["adminEmployees"] });
    } catch (err) {
      alert(err.response?.data?.message || "Creation failed.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-wrap space-y-8">
        <div className="page-header">
          <div>
            <span className="eyebrow">Analytics</span>
            <h1 className="page-title mt-4">Team performance at a glance</h1>
            <p className="page-subtitle mt-3">
              High performers, low engagement, quick communication, and employee
              onboarding, all from one screen.
            </p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Employees tracked" value={employees.length} detail="Current roster" />
          <MetricCard label="Average focus" value={`${averageFocus}%`} detail="Across all employees" />
          <MetricCard label="Active hours logged" value={totalActiveHours} detail="Combined total" />
        </section>

        {isLoading ? (
          <div className="empty-state">Loading dashboard data...</div>
        ) : (
          <section className="dashboard-grid">
            <div className="space-y-6 lg:col-span-5">
              <Leaderboard title="Top performers" data={topFive} tone="positive" />
              <Leaderboard title="Needs attention" data={lowFive} tone="alert" />
            </div>

            <div className="space-y-6 lg:col-span-7">
              <div className="surface-card relative">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="eyebrow">Quick mail</span>
                    <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-stone-900">
                      Reach employees fast
                    </h2>
                  </div>
                  <span className="pill">{selected.length} selected</span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="relative" ref={dropdownRef}>
                    <label className="mb-2 block text-sm font-semibold text-stone-700">
                      Recipients
                    </label>
                    <div
                      onClick={() => setShowDropdown(true)}
                      className="input-field flex min-h-[56px] flex-wrap items-center gap-2 !py-2"
                    >
                      {selected.length === 0 && (
                        <span className="text-sm text-stone-400">Choose one or more employees</span>
                      )}
                      {selected.map((emp) => (
                        <span
                          key={emp.employeeId}
                          className="inline-flex items-center gap-2 rounded-full bg-[#f7e3c4] px-3 py-1.5 text-xs font-semibold text-[#8d591d]"
                        >
                          {emp.name}
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelected((prev) =>
                                prev.filter((item) => item.employeeId !== emp.employeeId),
                              );
                            }}
                          >
                            x
                          </button>
                        </span>
                      ))}
                    </div>

                    {showDropdown && (
                      <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-[24px] border border-[rgba(83,61,39,0.12)] bg-white shadow-[0_20px_40px_rgba(44,32,20,0.12)]">
                        <div className="flex flex-col gap-3 border-b border-[rgba(83,61,39,0.08)] p-3 sm:flex-row">
                          <input
                            placeholder="Search employee"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field !py-2.5"
                          />
                          <button
                            onClick={() => setSelected(employees)}
                            className="btn-secondary shrink-0 !py-2.5"
                          >
                            Select all
                          </button>
                        </div>

                        <div className="max-h-64 overflow-y-auto p-2">
                          {filteredEmployees.map((emp) => {
                            const alreadySelected = selected.some(
                              (item) => item.employeeId === emp.employeeId,
                            );

                            return (
                              <button
                                key={emp.employeeId}
                                onClick={() => {
                                  if (!alreadySelected) {
                                    setSelected((prev) => [...prev, emp]);
                                  }
                                }}
                                disabled={alreadySelected}
                                className="flex w-full items-start justify-between rounded-2xl px-3 py-3 text-left transition hover:bg-[#f8f3eb] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <span>
                                  <span className="block text-sm font-semibold text-stone-800">
                                    {emp.name}
                                  </span>
                                  <span className="block text-xs text-stone-500">{emp.email}</span>
                                </span>
                                <span className="text-xs font-semibold text-[#8d591d]">
                                  {alreadySelected ? "Added" : "Add"}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-stone-700">
                      Subject
                    </span>
                    <input
                      placeholder="Weekly follow-up"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="input-field"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold text-stone-700">
                      Message
                    </span>
                    <textarea
                      rows="5"
                      placeholder="Write a short update or feedback note"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="textarea-field"
                    />
                  </label>

                  <button onClick={sendMail} className="btn-primary w-full">
                    Send mail
                  </button>
                </div>
              </div>

              <div className="surface-card">
                <span className="eyebrow">New employee</span>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-stone-900">
                  Add a new account
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <input
                    placeholder="Full name"
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    className="input-field"
                  />
                  <input
                    placeholder="Email address"
                    value={empEmail}
                    onChange={(e) => setEmpEmail(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={empPassword}
                    onChange={(e) => setEmpPassword(e.target.value)}
                    className="input-field"
                  />
                  <input
                    placeholder="Department"
                    value={empDept}
                    onChange={(e) => setEmpDept(e.target.value)}
                    className="input-field"
                  />
                </div>

                <button
                  onClick={handleCreateEmployee}
                  disabled={creating}
                  className="btn-primary mt-5 w-full md:w-auto"
                >
                  {creating ? "Creating..." : "Create employee"}
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function MetricCard({ label, value, detail }) {
  return (
    <div className="metric-card">
      <p className="text-sm font-semibold text-stone-500">{label}</p>
      <div className="metric-value">{value}</div>
      <p className="mt-2 text-sm text-stone-500">{detail}</p>
    </div>
  );
}

function Leaderboard({ title, data, tone }) {
  const toneStyles =
    tone === "alert"
      ? {
          badge: "bg-[#fde2e2] text-[#9f3d34]",
          rank: "text-[#9f3d34]",
          avatar: "bg-[#fde2e2] text-[#9f3d34]",
          score: "text-[#9f3d34]",
        }
      : {
          badge: "bg-[#f7e3c4] text-[#8d591d]",
          rank: "text-[#8d591d]",
          avatar: "bg-[#f7e3c4] text-[#8d591d]",
          score: "text-[#1f3a33]",
        };

  return (
    <div className="surface-card">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-stone-900">
          {title}
        </h2>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${toneStyles.badge}`}>
          {data.length} people
        </span>
      </div>

      <div className="mt-5 space-y-3">
        {data.length === 0 ? (
          <p className="text-sm text-stone-500">No data available right now.</p>
        ) : (
          data.map((emp, index) => (
            <div
              key={emp.employeeId}
              className="flex items-center justify-between gap-3 rounded-[22px] bg-white/70 p-4"
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 text-sm font-extrabold ${toneStyles.rank}`}>
                  #{index + 1}
                </span>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${toneStyles.avatar}`}
                >
                  {emp.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-semibold text-stone-900">{emp.name}</p>
                  <p className="text-xs text-stone-500">{emp.email}</p>
                </div>
              </div>

              <div className="text-right">
                <p className={`text-lg font-extrabold ${toneStyles.score}`}>
                  {emp.focusScore || 0}%
                </p>
                <p className="text-xs text-stone-500">{formatMinutes(emp.activeSeconds)}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
