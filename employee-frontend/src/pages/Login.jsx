import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const employeeAccounts = [
  "aaditya@company.com",
  "ekta@company.com",
  "virat@company.com",
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isWaking, setIsWaking] = useState(false);
  const [serverAwake, setServerAwake] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
      navigate(role === "ADMIN" ? "/dashboard" : "/employee-dashboard");
    }
  }, [navigate]);

  useEffect(() => {
    if (!isWaking || countdown <= 0) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(intervalId);
          setIsWaking(false);
          setServerAwake(true);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isWaking, countdown]);

  const wakeServer = async () => {
    setServerAwake(false);
    setIsWaking(true);
    setCountdown(12);

    try {
      await api.get("/auth/me");
    } catch {
      // Render instances can return an error while the service is waking up.
    }
  };

  const handleLogin = async () => {
    if (!serverAwake) {
      alert("Please wake the server first.");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      if (res.data.name) localStorage.setItem("name", res.data.name);

      navigate(res.data.role === "ADMIN" ? "/dashboard" : "/employee-dashboard");
    } catch {
      alert("Invalid credentials.");
    }
  };

  const formatCountdown = (value) => `00:${String(value).padStart(2, "0")}`;

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4 py-8 sm:px-6">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="surface-card relative overflow-hidden !p-5 sm:!p-8 lg:!p-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(197,127,50,0.24),transparent_60%)]" />

          <div className="relative">
            <span className="eyebrow">Employee Tracker</span>
            <h1 className="mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-[#1d2b28] sm:text-4xl lg:text-5xl">
              Professional visibility into employee activity and incidents.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600">
              WorkTrack is an internal operations console designed to help teams
              review productivity, incidents, and employee activity through a
              clear and structured interface.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <FeatureBlock title="Activity monitoring" value="Live visibility into usage and engagement" />
              <FeatureBlock title="Incident tracking" value="Captured events with timestamps and evidence" />
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <CredentialCard
                title="Admin Login"
                lines={["admin@test.com", "Password: admin123"]}
              />
              <CredentialCard
                title="Employee Login"
                lines={employeeAccounts}
                footer="Password: emp123"
              />
            </div>
          </div>
        </section>

        <section className="surface-card !p-5 sm:!p-8 lg:!p-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8d591d]">
                Secure Access
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-stone-900">
                Sign in
              </h2>
            </div>
            <div className="pill">
              {serverAwake ? "Server ready" : isWaking ? `Ready in ${formatCountdown(countdown)}` : "Wake required"}
            </div>
          </div>

          <div className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Email
              </span>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-stone-700">
                Password
              </span>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </label>

            {!serverAwake && (
              <div className="space-y-3">
                <button
                  onClick={wakeServer}
                  disabled={isWaking}
                  className="btn-secondary w-full"
                >
                  {isWaking ? `Server starting: ${formatCountdown(countdown)}` : "Wake server"}
                </button>
                {isWaking ? (
                  <p className="text-sm text-stone-500">
                    The login button will become available when the countdown reaches zero.
                  </p>
                ) : null}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={!serverAwake}
              className="btn-primary w-full"
            >
              Enter dashboard
            </button>
          </div>

          <div className="mt-8 rounded-[24px] border border-[rgba(83,61,39,0.1)] bg-[#f8f3eb] p-4 text-sm leading-6 text-stone-600">
            If the backend is idle, start it once and wait for the countdown to
            finish before entering the dashboard.
          </div>
        </section>
      </div>
    </div>
  );
}

function FeatureBlock({ title, value }) {
  return (
    <div className="subtle-card">
      <p className="text-sm font-semibold text-stone-500">{title}</p>
      <p className="mt-3 text-lg font-bold tracking-tight text-stone-900">{value}</p>
    </div>
  );
}

function CredentialCard({ title, lines, footer }) {
  return (
    <div className="subtle-card h-full">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8d591d]">
        {title}
      </p>
      <div className="mt-3 space-y-2 text-sm leading-6 text-stone-600">
        {lines.map((line) => (
          <p key={line} className="break-words">
            {line}
          </p>
        ))}
        {footer ? <p className="pt-1 font-medium text-stone-700">{footer}</p> : null}
      </div>
    </div>
  );
}
