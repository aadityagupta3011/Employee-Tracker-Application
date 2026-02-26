import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function AdminDashboard() {
  const dropdownRef = useRef(null);

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  /* ================= FETCH EMPLOYEES ================= */
  useEffect(() => {
    api
      .get("/dashboard/admin")
      .then((res) => setEmployees(res.data))
      .finally(() => setLoading(false));
  }, []);

  /* ================= CLOSE DROPDOWN ================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= SORTING ================= */
  const sortedByFocus = [...employees].sort(
    (a, b) => (b.focusScore || 0) - (a.focusScore || 0),
  );

  const topFive = sortedByFocus.slice(0, 5);
  const lowFive = [...sortedByFocus].reverse().slice(0, 5);

  /* ================= SEND MAIL ================= */
  const sendMail = async () => {
    await api.post("/admin/send-mail", {
      to: selected.map((e) => e.email),
      subject,
      message,
    });

    alert("Mail sent ✅");

    setSelected([]);
    setSubject("");
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Analytics Dashboard 📊
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* LEFT SIDE — LEADERBOARDS */}
            <div className="space-y-8">
              {/* TOP */}
              <Leaderboard
                title="🏆 Top Performers"
                data={topFive}
                type="top"
              />

              {/* LOW */}
              <Leaderboard
                title="⚠ Needs Attention"
                data={lowFive}
                type="low"
              />
            </div>

            {/* RIGHT SIDE — QUICK MAIL */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border relative">
              <h3 className="text-lg font-bold mb-4">✉️ Quick Mail</h3>

              {/* TO FIELD */}
              <div className="mb-3 relative" ref={dropdownRef}>
                <label className="text-sm text-gray-600">
                  To {selected.length > 0 && `(${selected.length})`}
                </label>

                <div
                  onClick={() => setShowDropdown(true)}
                  className="border rounded-lg p-2 min-h-[42px] flex flex-wrap gap-2 cursor-text">
                  {selected.map((emp) => (
                    <span
                      key={emp.employeeId}
                      className="flex items-center gap-1 bg-indigo-100 px-2 py-1 rounded text-xs">
                      {emp.name}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected((prev) =>
                            prev.filter((x) => x.employeeId !== emp.employeeId),
                          );
                        }}
                        className="font-bold hover:text-red-500">
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {showDropdown && (
                  <div className="absolute z-50 bg-white border mt-1 rounded-lg w-full max-h-64 overflow-y-auto shadow">
                    <div className="flex">
                      <input
                        placeholder="Search employee..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2 border-b outline-none"
                      />

                      {/* SELECT ALL */}
                      <div
                        onClick={() => setSelected(employees)}
                        className="p-2 text-sm font-medium text-indigo-600 cursor-pointer hover:bg-indigo-50 border-b">
                        Select All
                      </div>
                    </div>

                    {employees
                      .filter(
                        (emp) =>
                          emp.name
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                          emp.email
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()),
                      )
                      .map((emp) => {
                        const alreadySelected = selected.some(
                          (e) => e.employeeId === emp.employeeId,
                        );

                        return (
                          <div
                            key={emp.employeeId}
                            onClick={() => {
                              if (!alreadySelected) {
                                setSelected((prev) => [...prev, emp]);
                              }
                            }}
                            className={`p-2 text-sm cursor-pointer hover:bg-gray-100
                            ${alreadySelected && "opacity-40 pointer-events-none"}`}>
                            {emp.name} — {emp.email}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              <input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border rounded-lg p-2 mb-3"
              />

              <textarea
                rows="4"
                placeholder="Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded-lg p-2 mb-3"
              />

              <button
                onClick={sendMail}
                className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700">
                Send Mail
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= LEADERBOARD ================= */

function Leaderboard({ title, data, type }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <h3
        className={`text-lg font-bold mb-4 ${type === "low" && "text-red-600"}`}>
        {title}
      </h3>

      {data.length === 0 ? (
        <p className="text-sm text-gray-400">No data available</p>
      ) : (
        data.map((emp, index) => (
          <PerformerRow
            key={emp.employeeId}
            emp={emp}
            rank={index + 1}
            type={type}
          />
        ))
      )}
    </div>
  );
}

/* ================= ROW ================= */

function PerformerRow({ emp, rank, type }) {
  const isTop = type === "top";

  return (
    <div className="flex items-center justify-between py-3 border-b last:border-none">
      <div className="flex items-center gap-3">
        <span
          className={`font-bold ${isTop ? "text-indigo-600" : "text-red-500"}`}>
          #{rank}
        </span>

        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold
        ${isTop ? "bg-indigo-100 text-indigo-600" : "bg-red-100 text-red-600"}`}>
          {emp.name?.charAt(0)}
        </div>

        <div>
          <p className="font-medium">{emp.name}</p>
          <p className="text-xs text-gray-500">{emp.email}</p>
        </div>
      </div>

      <div className="text-right">
        <p
          className={`font-semibold ${isTop ? "text-green-600" : "text-red-600"}`}>
          {emp.focusScore || 0}%
        </p>

        <p className="text-xs text-gray-500">
          {Math.floor((emp.activeSeconds || 0) / 60)} min active
        </p>
      </div>
    </div>
  );
}
