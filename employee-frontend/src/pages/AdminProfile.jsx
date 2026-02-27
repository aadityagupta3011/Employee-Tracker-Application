import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

export default function AdminProfile() {

  const [admin, setAdmin] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);

  /* ================= FETCH PROFILE ================= */
  useEffect(() => {
    api.get("/auth/me")
      .then(res => {
        setAdmin(res.data);
        setName(res.data.name);
        setEmail(res.data.email);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= UPDATE PROFILE ================= */
  const handleUpdateProfile = async () => {
    try {
      await api.put("/auth/update-profile", { name, email });
      alert("Profile updated ✅");
    } catch {
      alert("Update failed ❌");
    }
  }; 

  if (loading) return <p className="p-8">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-gray-50">

      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        <h2 className="text-3xl font-bold text-gray-800">
          Profile Settings ⚙
        </h2>

        {/* ================= BASIC INFO ================= */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border space-y-4">

          <h3 className="text-lg font-semibold">👤 Basic Information</h3>

          <div>
            <label className="text-sm text-gray-500">Name</label>
            <input
              value={name} 
              disabled
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Email</label>
            <input
              value={email} 
              disabled
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Role</label>
            <input
              value={admin.role}
              disabled
              className="w-full border rounded-lg p-2 mt-1 bg-gray-100"
            />
          </div>

          <button 
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
          >
            Save Changes
          </button>

        </div>
 
      </div>

    </div>
  );
}