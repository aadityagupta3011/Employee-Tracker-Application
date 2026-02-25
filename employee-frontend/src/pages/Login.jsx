import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      if (role === "ADMIN") navigate("/dashboard");
      else navigate("/employee-dashboard");
    }
  }, []);

  const handleLogin = async () => {
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
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md">
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back 👋
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Login to your admin panel
        </p>

        <div className="space-y-5">
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition duration-200 font-semibold shadow-md"
          >
            Sign In
          </button>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          © 2026 Employee Tracker
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 mt-4 text-sm">
  
  {/* Admin Card */}
  <div className="bg-gray-50 border rounded-xl p-4 shadow-sm w-full">
    <h3 className="font-semibold text-gray-700 mb-2">Admin Credentials</h3>

    <p className="text-gray-600">
      <span className="font-medium">Email:</span> admin@test.com
    </p>
    <p className="text-gray-600">
      <span className="font-medium">Password:</span> admin123
    </p>
  </div>

  {/* Employee Card */}
  <div className="bg-gray-50 border rounded-xl p-4 shadow-sm w-full">
    <h3 className="font-semibold text-gray-700 mb-2">Employee Credentials</h3>

    <p className="text-gray-600">
      <span className="font-medium">Email:</span> aaditya@company.com
    </p>
    <p className="text-gray-600">
      <span className="font-medium">Password:</span> emp123
    </p>
  </div>

</div>

      </div>
    </div>
  );
}
