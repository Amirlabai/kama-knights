import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import UserApp from './pages/UserApp';
import AdminDashboard from './pages/AdminDashboard';
import React from 'react'; // Added React import for React.ReactNode

// Protected Route Component
const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'admin' | 'user' }) => {
  const { user, token, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />; // Simple redirect for wrong role

  return <>{children}</>;
};

function AppRoutes() {
  useAuth(); // Just to keeping the hook if needed or remove it. Actually remove user destructuring.

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute role="admin">
          <AdminDashboard />
        </ProtectedRoute>
      } />

      {/* User App Routes - Default */}
      <Route path="/*" element={
        <ProtectedRoute>
          {/* If admin goes here, they can see the user view too, or redirect */}
          <UserApp />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
