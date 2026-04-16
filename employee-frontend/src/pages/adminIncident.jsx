import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const formatDate = (date) => new Date(date).toLocaleDateString("en-IN");

const formatTime = (date) =>
  new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count > 0) {
      return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
    }
  }

  return "Just now";
};

export default function AdminIncidents() {
  const [selectedImage, setSelectedImage] = useState(null);

  const { data: incidents = [], isLoading: incidentsLoading } = useQuery({
    queryKey: ["incidents"],
    queryFn: async () => {
      const res = await api.get("/dashboard/admin/incidents");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["adminEmployees"],
    queryFn: async () => {
      const res = await api.get("/dashboard/admin");
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const getEmployee = (id) => users.find((user) => user.employeeId === id);

  return (
    <div className="app-shell">
      <Navbar />

      <main className="page-wrap space-y-6">
        <div className="page-header">
          <div>
            <span className="eyebrow">Incidents</span>
            <h1 className="page-title mt-4">Incident review board</h1>
            <p className="page-subtitle mt-3">
              Browse captured incidents with employee details, image evidence,
              and exact event timing.
            </p>
          </div>
        </div>

        {incidentsLoading || usersLoading ? (
          <div className="empty-state">Loading incidents...</div>
        ) : incidents.length === 0 ? (
          <div className="empty-state">No incidents detected.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {incidents.map((item) => {
              const employee = getEmployee(item.employeeId);
              return (
                <article key={item._id} className="surface-card !p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f7e3c4] text-sm font-bold text-[#8d591d]">
                        {employee?.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-stone-900">
                          {employee?.name || "Unknown employee"}
                        </p>
                        <p className="break-words text-xs text-stone-500">{item.email}</p>
                      </div>
                    </div>
                    <span className="w-fit rounded-full bg-[#fde2e2] px-3 py-1 text-xs font-semibold text-[#9f3d34]">
                      {item.reason?.replaceAll("_", " ")}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedImage(item.imageUrl)}
                    className="mt-4 block w-full overflow-hidden rounded-[22px]"
                  >
                    <img
                      src={item.imageUrl}
                      alt="incident"
                      className="h-56 w-full object-cover transition duration-300 hover:scale-[1.03]"
                    />
                  </button>

                  <div className="mt-4 rounded-[20px] bg-[#f8f3eb] p-4 text-sm text-stone-600">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <span>{formatDate(item.timestamp)}</span>
                      <span>{formatTime(item.timestamp)}</span>
                    </div>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">
                      {timeAgo(item.timestamp)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {selectedImage && (
        <div className="modal-backdrop cursor-pointer" onClick={() => setSelectedImage(null)}>
          <img
            src={selectedImage}
            alt="incident preview"
            className="max-h-[90vh] rounded-[28px] shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}
