import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider, useAuth } from './contexts/AuthContext'; 
import { ThemeProvider } from './contexts/ThemeContext.jsx';

import AppLayout from './components/AppLayout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Challenges from './components/Challenges';
import Leaderboard from './components/Leaderboard';
// import Notifications from './components/Notifications';
// import Profile from './components/Profile';
import { notifications } from './data/mockData';

function AppRoutes() {
  const { auth, logout } = useAuth();
  // const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <Routes>
      {/* Public Login Route */}
      <Route
        path="/login"
        element={auth ? <Navigate to="/dashboard" /> : <Login />}
      />

      {/* Protected Application Routes */}
      <Route
        path="/"
        element={
          auth ? (
            <AppLayout
              onLogout={logout}
              // unreadNotifications={unreadNotifications}
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        {/* Default child route for "/" */}
        <Route index element={<Navigate to="/dashboard" />} /> 
        
        {/* Nested routes that will render inside AppLayout's <Outlet> */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="challenges" element={<Challenges />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        {/* <Route path="notifications" element={<Notifications />} /> */}
        {/* <Route path="profile" element={<Profile />} /> */}
      </Route>

      {/* Catch-all route */}
      <Route path="*" element={<Navigate to={auth ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

function App() {
  return (
    // 1. Nest all your providers at the top level.
    // The order usually doesn't matter unless one provider depends on another.
    <ThemeProvider>
      <AuthProvider>
        {/* 2. Use BrowserRouter for web projects. It's common to alias it as Router. */}
        <Router>
          {/* 3. Your routes component remains inside. */}
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;