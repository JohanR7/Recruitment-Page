// src/components/Navigation.jsx

import React from 'react';
import { Home, Trophy, Target, Bell, User, LogOut } from 'lucide-react';

const Navigation = ({ 
  currentPage, 
  onPageChange, 
  onLogout, 
  unreadNotifications 
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md border-r border-gray-200/80 w-64 min-h-screen p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-md shadow-primary/20">
          <Target className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-text">TechRecruit</h1>
      </div>

      <div className="flex-grow space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold shadow-inner shadow-primary/5'
                  : 'text-gray-600 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-2 border-t border-gray-200/80 pt-6">
        <button
          onClick={() => onPageChange('notifications')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 transition-all duration-200 relative"
        >
          <Bell className="w-5 h-5" />
          <span className="font-medium">Notifications</span>
          {unreadNotifications > 0 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </button>
        
        <button
          onClick={() => onPageChange('profile')}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:text-primary hover:bg-primary/5 transition-all duration-200"
        >
          <User className="w-5 h-5" />
          <span className="font-medium">Profile</span>
        </button>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-accent hover:text-white hover:bg-accent transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;