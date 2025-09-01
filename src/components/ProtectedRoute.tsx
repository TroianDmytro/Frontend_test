import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: string[];
  requireAuth?: boolean;
}

const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#121212]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#B400F0]"></div>
      </div>
    );
  }

  // If route requires auth but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route doesn't require auth but user is authenticated (like login page)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/cabinet" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
