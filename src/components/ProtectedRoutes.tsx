import React from 'react';
import { Navigate } from 'react-router-dom';

type PropTypes = {
    children: React.ReactNode;
}

const ProtectedRoutes = ({ children }: PropTypes) => {
    const isAuthenticated = false;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoutes;
