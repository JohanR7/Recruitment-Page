// src/App.jsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import your new Layout and page components
import AppLayout from './components/AppLayout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Challenges from './components/Challenges';
import Leaderboard from './components/Leaderboard';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import { notifications } from './data/mockData';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    // No need to set currentPage anymore, router handles it.
  };

  return (
    <Router>
      <Routes>
        {/* Public Login Route */}
        {/* If the user is already logged in, redirect them from /login to the dashboard */}
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />}
        />

        {/* Protected Application Routes */}
        {/* If the user is logged in, show the AppLayout and its nested routes. */}
        {/* Otherwise, redirect them to the /login page. */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <AppLayout
                onLogout={handleLogout}
                unreadNotifications={unreadNotifications}
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
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Optional: A catch-all route to redirect any unknown paths */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;