import { useEffect, useState } from "react";
import api from "../api/axios";

export default function EmployeeDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/dashboard/employee").then(res => setData(res.data));
  }, []);

  if (!data) return <p>No activity yet</p>;

  return (
    <div>      
      
      <h2>Your Dashboard</h2>
      <p>Active: {Math.floor(data.activeSeconds / 60)} min</p>
      <p>Idle: {Math.floor(data.idleSeconds / 60)} min</p>
    </div>
  );
}
