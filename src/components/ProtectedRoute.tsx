import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import type { Role } from '../auth/roles';
import { hasAnyRole } from '../auth/roles';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: Role[]; // список ролей, любая из которых подходит
  requireAuth?: boolean;
}

const ProtectedRoute = ({ children, requireAuth = true, requiredRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuthContext();
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

  // Role-based access check
  if (requiredRoles && requiredRoles.length > 0) {
    const userRoles = user?.roles || [];
    if (!hasAnyRole(userRoles, requiredRoles)) {
      // Нет доступа — перенаправляем в кабинет или главную
      return <Navigate to="/cabinet" replace />;
    }
  }

  // If route doesn't require auth but user is authenticated (like login page)
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/cabinet" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
