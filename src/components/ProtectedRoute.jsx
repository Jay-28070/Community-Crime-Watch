import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loader from './Loader'

// Protects routes from unauthenticated users
function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <Loader message="Checking authentication..." />
    }

    if (!currentUser) {
        // Redirect to login, but save the attempted URL
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    return children
}

// Protects routes based on user role
function RoleBasedRoute({ children, allowedRoles }) {
    const { currentUser, userData, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <Loader message="Checking authorization..." />
    }

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />
    }

    const userRole = userData?.role || 'user'

    if (!allowedRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on role
        const redirectPath = userRole === 'police' ? '/dashboard-police' : '/dashboard'
        return <Navigate to={redirectPath} replace />
    }

    return children
}

// Redirects authenticated users away from auth pages
function PublicRoute({ children }) {
    const { currentUser, userData, loading } = useAuth()

    if (loading) {
        return <Loader message="Loading..." />
    }

    if (currentUser) {
        // Redirect to appropriate dashboard based on role
        const redirectPath = userData?.role === 'police' ? '/dashboard-police' : '/dashboard'
        return <Navigate to={redirectPath} replace />
    }

    return children
}

export { ProtectedRoute, RoleBasedRoute, PublicRoute }
export default ProtectedRoute
