import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isWaking, setIsWaking] = useState(false);
  const [serverAwake, setServerAwake] = useState(false);

  const navigate = useNavigate();

  /* ================= AUTO REDIRECT ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "ADMIN") navigate("/dashboard");
      else navigate("/employee-dashboard");
    }
  }, []);

  /* ================= WAKE SERVER ================= */
  const wakeServer = async () => {
    try {
      setIsWaking(true);

      // hit backend (even error is fine)
      await api.get("/auth/me");

      // wait for backend to fully wake
      setTimeout(() => {
        setServerAwake(true);
        setIsWaking(false);
      }, 12000);
    } catch (err) {
      setTimeout(() => {
        setServerAwake(true);
        setIsWaking(false);
      }, 12000);
    }
  };

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    if (!serverAwake) {
      alert("Please wake the server first ⚡");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      if (res.data.role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/employee-dashboard");
      }
    } catch (err) {
      alert("Invalid credentials ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome 👋
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Login
        </p>

        <div className="space-y-5">
          
          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="abc@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* WAKE BUTTON */}
          {!serverAwake && (
            <button
              onClick={wakeServer}
              disabled={isWaking}
              className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition font-semibold"
            >
              {isWaking ? "Waking server... ⏳" : "Wake Server ⚡ (Click once)"}
            </button>
          )}

          {/* LOGIN BUTTON */}
          <button
            onClick={handleLogin}
            disabled={!serverAwake}
            className={`w-full py-2 rounded-lg font-semibold shadow-md transition
              ${
                serverAwake
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            Sign In
          </button>

        </div>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-400 mt-6">
          © 2026 Employee Tracker
        </p>

        {/* DEMO CREDS */}
        <div className="flex flex-col md:flex-row gap-4 mt-4 text-sm">
          
          <div className="bg-gray-50 border rounded-xl p-4 shadow-sm w-full">
            <h3 className="font-semibold text-gray-700 mb-2">
              Admin Credentials
            </h3>
            <p>Email: admin@test.com</p>
            <p>Password: admin123</p>
          </div>

          <div className="bg-gray-50 border rounded-xl p-4 shadow-sm w-full">
            <h3 className="font-semibold text-gray-700 mb-2">
              Employee Credentials
            </h3>
            <p className="text-xs break-words">
              aaditya@company.com, ekta@company.com, virat@company.com
            </p>
            <p>Password: emp123</p>
          </div>

        </div>

      </div>
    </div>
  );
}