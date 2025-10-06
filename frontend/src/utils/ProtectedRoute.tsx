import { Navigate } from 'react-router-dom';
import { useAuthStore, UserRole } from '../store/auth';

interface ProtectedRouteProps {
  roles?: UserRole[];
  children: JSX.Element;
}

const ProtectedRoute = ({ roles, children }: ProtectedRouteProps) => {
  const { user } = useAuthStore();
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
