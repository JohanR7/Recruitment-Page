// src/App.jsx

import React, { useState } from 'react';
import Login from './components/Login';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import Challenges from './components/Challenges';
import Leaderboard from './components/Leaderboard';
import Notifications from './components/Notifications';
import Profile from './components/Profile';
import { notifications } from './data/mockData';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'challenges':
        return <Challenges />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'notifications':
        return <Notifications />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  // If the user is not logged in, show the Login component.
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Once logged in, show the main application layout.
  return (
    // Main container now uses the light 'bg-background' and a subtle pattern.
    <div className="min-h-screen bg-background">
      {/* Background pattern matching the login screen for consistency. */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%234e1a7f%22 fill-opacity=%220.04%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm-24 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 6V2H4v4H0v2h4v4h2V8h4V6H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
      
      {/* The main layout is positioned relatively to appear above the background pattern. */}
      <div className="relative z-10 flex">
        <Navigation
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onLogout={handleLogout}
          unreadNotifications={unreadNotifications}
        />
        
        {/* The main content area takes the remaining space and handles scrolling. */}
        <main className="flex-1 overflow-y-auto h-screen">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}

export default App;