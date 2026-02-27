import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login.jsx";
import Navbar from "./components/Navbar.jsx";
import AdminHome from "./pages/AdminHome";
import AdminEmployees from "./pages/AdminEmployees";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProfile from "./pages/AdminProfile";
import AdminIncidents from "./pages/adminIncident.jsx";
import EmployeeNavbar from "./components/EmployeeNavbar.jsx";
import EmployeeDashboard from "./pages/employeeDashboard.jsx";
import EmployeeProfile from "./pages/EmployeeProfile.jsx";
import EmployeeIncidents from "./pages/EmployeeIncidents.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employees"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminEmployees />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/indident"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminIncidents />
            </ProtectedRoute>
          }
        />
<Route
  path="/employee-dashboard"
  element={
    <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
      <>
        <EmployeeDashboard />
      </>
    </ProtectedRoute>
  }
/>
<Route
  path="/employee-profile"
  element={
    <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
      <> 
        <EmployeeProfile />
      </>
    </ProtectedRoute>
  }
/>

<Route
  path="/employee-incidents"
  element={
    <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
      <> 
        <EmployeeIncidents />
      </>
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;
