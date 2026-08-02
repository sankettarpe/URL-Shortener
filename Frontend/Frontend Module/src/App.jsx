import {Routes, Route} from 'react-router-dom'
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminLinks from "./pages/AdminLinks";
import AdminsList from "./pages/AdminsList";
import AuditLogs from "./pages/AuditLogs";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <History />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/links"
          element={
            <AdminRoute>
              <AdminLinks />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/admins"
          element={
            <AdminRoute>
              <AdminsList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <AdminRoute>
              <AuditLogs />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
