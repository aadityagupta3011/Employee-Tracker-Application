import { useEffect, useState } from "react";
import api from "../api/axios";
import EmployeeNavbar from "../components/EmployeeNavbar";

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

  /* 🕒 FORMAT DATE */
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN");

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

    for (let i of intervals) {
      const count = Math.floor(seconds / i.seconds);
      if (count > 0)
        return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
    }

    return "Just now";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EmployeeNavbar />

      <div className="max-w-7xl mx-auto px-6 py-8">

        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          ⚠ My Incidents
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading incidents...</p>
        ) : incidents.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            No incidents detected 🎉
          </div>
        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {incidents.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm border hover:shadow-lg transition p-4 flex flex-col"
              >

                {/* HEADER */}
                <div className="flex items-center justify-between mb-3">

                  <div className="flex items-center gap-3">

                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                      {item.email?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        Incident Detected
                      </p>
                    </div>

                  </div>

                  <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 font-medium">
                    {item.reason.replace("_", " ")}
                  </span>

                </div>

                {/* IMAGE */}
                <div
                  onClick={() => setSelectedImage(item.imageUrl)}
                  className="cursor-pointer overflow-hidden rounded-xl"
                >
                  <img
                    src={item.imageUrl}
                    alt="incident"
                    className="w-full h-52 object-cover hover:scale-105 transition"
                  />
                </div>

                {/* FOOTER */}
                <div className="mt-3 text-xs text-gray-500 space-y-1">

                  <div className="flex justify-between">
                    <span>{formatDate(item.timestamp)}</span>
                    <span>{formatTime(item.timestamp)}</span>
                  </div>

                  <p className="text-right text-gray-400">
                    {timeAgo(item.timestamp)}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}
      </div>

      {/* IMAGE MODAL */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        >
          <img
            src={selectedImage}
            alt="preview"
            className="max-h-[90vh] rounded-xl shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}