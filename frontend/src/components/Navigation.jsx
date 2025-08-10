import logo from '../assets/logo/blue.png';
import React from 'react';
import { NavLink } from 'react-router-dom'; 
import { Home, Trophy, Target, Bell, User, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  return (
    <img src={logo} alt="Logo" />
  );
}

const Navigation = ({ onLogout, unreadNotifications }) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/dashboard' },
    { id: 'challenges', label: 'Challenges', icon: Target, path: '/challenges' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
  ];

  const getNavLinkClass = ({ isActive }) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-primary/10 dark:bg-dark-primary/10 text-primary dark:text-dark-primary font-semibold shadow-inner'
        : 'text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-dark-primary hover:bg-primary/5 dark:hover:bg-dark-primary/5'
    }`;

  return (
    <nav className="bg-white/80 dark:bg-dark-background/80 backdrop-blur-md border-r border-gray-200/80 dark:border-gray-700/80 w-64 min-h-screen p-6 flex flex-col transition-colors duration-300">
      <div className="flex items-center gap-3 mb-10">
        <img src={logo} alt="Logo" className="w-20 h-auto" />
        <h1 className="text-xl font-bold text-cyanblue dark:text-dark-cyanblue">
          Recruitment Portal
        </h1>
      </div>

      <div className="flex-grow space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
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

      <div className="space-y-2 border-t border-gray-200/80 dark:border-gray-700/80 pt-6">
        <NavLink to="/notifications" className={getNavLinkClass}>
          <Bell className="w-5 h-5" />
          <span className="font-medium">Notifications</span>
          {unreadNotifications > 0 && (
            <span className="ml-auto bg-accent dark:bg-dark-accent text-white text-xs rounded-full px-2 py-1">
              {unreadNotifications}
            </span>
          )}
        </NavLink>
        
        <NavLink to="/profile" className={getNavLinkClass}>
          <User className="w-5 h-5" />
          <span className="font-medium">Profile</span>
        </NavLink>
        
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-dark-primary hover:bg-primary/5 dark:hover:bg-dark-primary/5 transition-all duration-200"
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
          <span className="font-medium">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>
        
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-accent dark:text-dark-accent hover:text-white hover:bg-accent dark:hover:bg-dark-accent transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;