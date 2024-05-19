import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/authContext';

const ProtectedRoute = () => {
    const { user } = useAuth()

    if (!user) {
        return <Navigate to="/sign-in" />
    }

  return <Outlet />;
};

export default ProtectedRoute;
