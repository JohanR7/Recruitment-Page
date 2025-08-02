// src/components/Navigation.jsx
import logo from '../assets/logo/blue.png'
import React from 'react';
// Import NavLink instead of just Link to get active styling
import { NavLink } from 'react-router-dom'; 
import { Home, Trophy, Target, Bell, User, LogOut } from 'lucide-react';


function MyComponent() {
  return (
    <img src={logo} alt="Logo" />
  );
}
// No longer needs currentPage or onPageChange
const Navigation = ({ onLogout, unreadNotifications }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'challenges', label: 'Challenges', icon: Target, path: '/challenges' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
  ];

  // Define the active and default styles for NavLink
  const getNavLinkClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-primary/10 text-primary font-semibold shadow-inner shadow-primary/5'
        : 'text-gray-600 hover:text-primary hover:bg-primary/5'
    }`;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-r border-gray-200/80 w-64 min-h-screen p-6 flex flex-col">
      <div className="flex items-center gap-3 mb-10">
          <img src={logo} alt="Logo" className="w-20 h-auto" />
        <h1 className="text-xl font-bold  text-cyanblue">Recruitment Portal</h1>

      </div>

      <div className="flex-grow space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            // Use NavLink instead of button
            <NavLink
              key={item.id}
              to={item.path}
              className={getNavLinkClass}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="space-y-2 border-t border-gray-200/80 pt-6">
        {/* These can also be NavLinks */}
        <NavLink to="/notifications" className={getNavLinkClass}>
          <Bell className="w-5 h-5" />
          <span className="font-medium">Notifications</span>
          {unreadNotifications > 0 && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadNotifications}
            </span>
          )}
        </NavLink>
        
        <NavLink to="/profile" className={getNavLinkClass}>
          <User className="w-5 h-5" />
          <span className="font-medium">Profile</span>
        </NavLink>
        
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