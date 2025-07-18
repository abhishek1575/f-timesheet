import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthService from '../../service/AuthService';

const ProtectedRoute = ({ allowedRoles }) => {
  const currentUser = AuthService.getCurrentUser();
  const isLoggedIn = sessionStorage.getItem("isLoggedIn") === 'true';

  if (!isLoggedIn) {
    return <Navigate to="/Login" replace />;
  }

  const userRole = currentUser.role;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to a default page based on role if not authorized
    switch (userRole) {
      case 'MANAGER':
        return <Navigate to="/mdashboard" replace />;
      case 'EMPLOYEE':
        return <Navigate to="/edashboard" replace />;
      case 'ADMIN':
        return <Navigate to="/adashboard" replace />;
      default:
        return <Navigate to="/Login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
