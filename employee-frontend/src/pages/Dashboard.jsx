import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function Dashboard(){
  const [stats, setStats] = useState([]);

  useEffect(() => {
    api.get("/admin/activity/today").then(res=>setStats(res.data));
  }, []);

  return(
    <div>
      <h1>Employee Dashboard</h1>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}
