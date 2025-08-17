import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import HelpPage from './pages/HelpPage';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* public */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<HomePage />} />

        {/* student-only */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route path="/help" element={<HelpPage />} />
        </Route>

        {/* admin-only */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* unknown path → login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
