import React from 'react';
import { Outlet } from 'react-router-dom'; 
import Navigation from './Navigation';

const AppLayout = ({ onLogout, unreadNotifications }) => {
  return (
    // Fixed CSS variable syntax to work with flattened color structure
    <div className="relative min-h-screen bg-background dark:bg-dark-background [--pattern-color:theme(colors.primary)] dark:[--pattern-color:theme(colors.dark-primary)] transition-colors duration-300">
      
      {/* Background pattern with theme-aware coloring */}
      <div 
        className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22currentColor%22 fill-opacity=%220.04%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm-24 0v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 6V2H4v4H0v2h4v4h2V8h4V6H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] text-[--pattern-color] opacity-100 dark:opacity-80 transition-all duration-300">
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex">
        <Navigation
          onLogout={onLogout}
          unreadNotifications={unreadNotifications}
        />
        
        {/* Content area with proper scrolling */}
        <main className="flex-1 overflow-y-auto h-screen bg-gradient-to-br from-transparent via-background/50 to-background/80 dark:from-transparent dark:via-dark-background/50 dark:to-dark-background/80">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AppLayout;