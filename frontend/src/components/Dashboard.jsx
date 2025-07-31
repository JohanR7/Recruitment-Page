// src/components/Dashboard.jsx

import React from 'react';
import { Trophy, Target, Zap, TrendingUp, Star, Calendar, Clock } from 'lucide-react';
import { currentUser, challenges, leaderboard, notifications } from '../data/mockData';

const Dashboard = () => {
  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalPoints = currentUser.totalPoints;
  const currentLevel = currentUser.level;
  const nextLevelPoints = (currentLevel + 1) * 250;
  const levelProgress = ((totalPoints % 250) / 250) * 100;
  const recentChallenges = challenges.slice(0, 3);
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-full border-2 border-primary"
          />
          <div>
            <h1 className="text-2xl font-bold text-text">Welcome back, {currentUser.name}!</h1>
            <p className="text-primary">Ready to tackle new challenges today?</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <span className="text-gray-600 text-sm">Challenges</span>
          </div>
          <p className="text-2xl font-bold text-text">{completedChallenges}</p>
          <p className="text-primary text-sm font-medium">Completed</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-6 hover:border-secondary/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-gray-600 text-sm">Total Points</span>
          </div>
          <p className="text-2xl font-bold text-text">{totalPoints.toLocaleString()}</p>
          <p className="text-secondary text-sm font-medium">Earned</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="text-gray-600 text-sm">Current Level</span>
          </div>
          <p className="text-2xl font-bold text-text">{currentLevel}</p>
          <p className="text-primary text-sm font-medium">Level {currentLevel + 1} in {nextLevelPoints - totalPoints} pts</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-6 hover:border-secondary/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-gray-600 text-sm">Global Rank</span>
          </div>
          <p className="text-2xl font-bold text-text">#{currentUser.rank}</p>
          <p className="text-secondary text-sm font-medium">Top 10%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Level Progress */}
        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text">Level Progress</h2>
            <span className="text-sm text-gray-500">Level {currentLevel}</span>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{totalPoints % 250} / 250 XP</span>
              <span>{Math.round(levelProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200/80 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            Complete more challenges to reach Level {currentLevel + 1}!
          </p>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text">Recent Challenges</h2>
            <Clock className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {recentChallenges.map((challenge) => (
              <div key={challenge.id} className="flex items-center gap-3 p-3 bg-gray-100/70 rounded-lg hover:bg-gray-200/90 transition-all duration-200">
                <div className={`w-2 h-2 rounded-full ${challenge.completed ? 'bg-primary' : 'bg-secondary'}`}></div>
                <div className="flex-1">
                  <p className="text-text text-sm font-medium">{challenge.title}</p>
                  <p className="text-gray-500 text-xs">{challenge.progress}% complete</p>
                </div>
                <span className={`text-xs px-2 py-1 font-medium rounded-full ${
                  challenge.difficulty === 'easy' ? 'bg-green-500/20 text-green-600' :
                  challenge.difficulty === 'medium' ? 'bg-secondary/20 text-secondary' :
                  'bg-accent/20 text-accent'
                }`}>
                  {challenge.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-all duration-200 group">
            <Zap className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-200" />
            <div className="text-left">
              <p className="text-text font-medium">Start New Challenge</p>
              <p className="text-gray-500 text-sm">Begin your next adventure</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-secondary/10 border border-secondary/20 rounded-lg hover:bg-secondary/20 transition-all duration-200 group">
            <Trophy className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform duration-200" />
            <div className="text-left">
              <p className="text-text font-medium">View Leaderboard</p>
              <p className="text-gray-500 text-sm">See your ranking</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-all duration-200 group">
            <Calendar className="w-6 h-6 text-green-600 group-hover:scale-110 transition-transform duration-200" />
            <div className="text-left">
              <p className="text-text font-medium">Upcoming Events</p>
              <p className="text-gray-500 text-sm">Check what's coming</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;