import { useEffect, useState } from "react";
import api from "../api/axios";
import EmployeeNavbar from "../components/EmployeeNavbar";

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

export default function EmployeeIncidents() {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    api
      .get("/dashboard/employee/incidents")
      .then((res) => setIncidents(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-shell">
      <EmployeeNavbar />

      <main className="page-wrap space-y-6">
        <div className="page-header">
          <div>
            <span className="eyebrow">My Incidents</span>
            <h1 className="page-title mt-4">Review flagged moments</h1>
            <p className="page-subtitle mt-3">
              Every incident includes the reason, image snapshot, and the exact
              time it was captured.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">Loading incidents...</div>
        ) : incidents.length === 0 ? (
          <div className="empty-state">No incidents detected.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {incidents.map((item) => (
              <article key={item._id} className="surface-card !p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="break-words font-semibold text-stone-900">{item.email}</p>
                    <p className="text-xs text-stone-500">Incident detected</p>
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
            ))}
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
