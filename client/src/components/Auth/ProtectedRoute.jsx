import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/UserContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // While auth state is loading, show nothing (avoids flash redirect)
  if (loading) return null;

  // Not logged in → redirect to auth page
  if (!user) return <Navigate to="/auth" replace />;

  return children;
}

export default ProtectedRoute;
