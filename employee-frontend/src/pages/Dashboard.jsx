import { useEffect, useState } from "react";
import api from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";

export default function Dashboard(){
  const [stats, setStats] = useState([]);

  useEffect(() => {
    api.get("/admin/activity/today").then(res=>setStats(res.data));
  }, []);

  return(
    <div>
            <Navbar />
      
      <h1 className="text-3xl">Employee Dashboard</h1>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}
