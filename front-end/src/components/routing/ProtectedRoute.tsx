import { Navigate, useLocation } from "react-router-dom";
import { PropsWithChildren } from "react";
import { useAuth, UserRole } from "@/lib/auth";

type ProtectedRouteProps = PropsWithChildren<{
  roles?: UserRole[];
}>;

export const ProtectedRoute = ({ roles = [], children }: ProtectedRouteProps) => {
  const { user, initialized } = useAuth();
  const location = useLocation();

  if (!initialized) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">
        Se verifică sesiunea...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
