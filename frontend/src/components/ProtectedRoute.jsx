import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ role }) {
    const { user, token } = useAuth();

    if (!token) return <Navigate to="/" replace />;
    if (role && user.role !== role) return <Navigate to="/landing" replace />;

    return <Outlet context={{ user }} />;
}
