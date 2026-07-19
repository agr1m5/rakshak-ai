import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrap any route element with <ProtectedRoute> to require login.
// Example: <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-ink-950 text-ink-400 text-sm font-mono">
        Checking session…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
