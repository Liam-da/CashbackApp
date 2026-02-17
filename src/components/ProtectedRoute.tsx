import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useConvexAuth } from 'convex/react';
import { useEnsureUser } from '../hooks/use-ensure-user';

export default function ProtectedRoute() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const location = useLocation();
  useEnsureUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
