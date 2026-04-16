import React from "react";
import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "../components/ProtectedRoute.jsx";

// pages
import Login from "../pages/Login.jsx";

import AdminHome from "../pages/AdminHome.jsx";
import AdminEmployees from "../pages/AdminEmployees.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import AdminProfile from "../pages/AdminProfile.jsx";
import AdminIncidents from "../pages/adminIncident.jsx";

import EmployeeDashboard from "../pages/employeeDashboard.jsx";
import EmployeeProfile from "../pages/EmployeeProfile.jsx";
import EmployeeIncidents from "../pages/EmployeeIncidents.jsx";

export default function AppRouter() {
  return (
    <Routes>

      {/* PUBLIC ROUTE */}
      <Route path="/login" element={<Login />} />

      {/* ADMIN ROUTES */}
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

      {/* EMPLOYEE ROUTES */}
      <Route
        path="/employee-dashboard"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee-profile"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <EmployeeProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/employee-incidents"
        element={
          <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
            <EmployeeIncidents />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
}