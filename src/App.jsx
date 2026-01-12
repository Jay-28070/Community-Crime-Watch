import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute, RoleBasedRoute, PublicRoute } from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import DashboardPolice from './pages/DashboardPolice'
import Map from './pages/Map'
import Report from './pages/Report'
import Alerts from './pages/Alerts'
import Safety from './pages/Safety'
import Trends from './pages/Trends'
import './App.css'

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    } />
                    <Route path="/signup" element={
                        <PublicRoute>
                            <Signup />
                        </PublicRoute>
                    } />

                    {/* Protected routes - Regular Users */}
                    <Route path="/dashboard" element={
                        <RoleBasedRoute allowedRoles={['user']}>
                            <Dashboard />
                        </RoleBasedRoute>
                    } />

                    {/* Protected routes - Police */}
                    <Route path="/dashboard-police" element={
                        <RoleBasedRoute allowedRoles={['police']}>
                            <DashboardPolice />
                        </RoleBasedRoute>
                    } />

                    {/* Protected routes - Both roles */}
                    <Route path="/map" element={
                        <ProtectedRoute>
                            <Map />
                        </ProtectedRoute>
                    } />
                    <Route path="/report" element={
                        <ProtectedRoute>
                            <Report />
                        </ProtectedRoute>
                    } />
                    <Route path="/alerts" element={
                        <ProtectedRoute>
                            <Alerts />
                        </ProtectedRoute>
                    } />
                    <Route path="/safety" element={
                        <ProtectedRoute>
                            <Safety />
                        </ProtectedRoute>
                    } />
                    <Route path="/trends" element={
                        <ProtectedRoute>
                            <Trends />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
