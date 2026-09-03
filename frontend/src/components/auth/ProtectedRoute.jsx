import { Navigate, useLocation } from "react-router-dom";

/**
 * Wrap any route that should only be reachable when logged in.
 *
 * Usage in App.jsx:
 *   <Route
 *     path="/dashboard"
 *     element={
 *       <ProtectedRoute>
 *         <Dashboard />
 *       </ProtectedRoute>
 *     }
 *   />
 *
 * If there is no token in localStorage, the user is redirected to
 * /login instead of the protected page ever rendering. This stops
 * pages from mounting (and firing API calls that will 401) before
 * the user has actually logged in.
 */
function ProtectedRoute({ children }) {
  const location = useLocation();

  const token = localStorage.getItem("token");

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
