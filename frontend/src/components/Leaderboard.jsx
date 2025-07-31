// src/components/Leaderboard.jsx

import React from 'react';
import { Trophy, Medal, Award, Star, TrendingUp } from 'lucide-react';
import { leaderboard, currentUser } from '../data/mockData';

const Leaderboard = () => {
  // Helper to get the icon for the rank
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <Trophy className="w-6 h-6 text-secondary" />;
      case 2: return <Medal className="w-6 h-6 text-gray-500" />;
      case 3: return <Award className="w-6 h-6 text-primary" />;
      default: return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</span>;
    }
  };

  // Helper to get the badge color for the rank
  const getRankBadge = (rank) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-secondary to-pink-500 text-white';
      case 2: return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
      case 3: return 'bg-gradient-to-r from-primary to-purple-700 text-white';
      default: return 'bg-gray-200 text-text';
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Leaderboard</h1>
          <p className="text-gray-600">See how you rank against other recruits</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>Updated in real-time</span>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="mb-8">
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {/* 2nd Place */}
          <div className="flex flex-col items-center order-1 mt-4">
            <div className="bg-white/60 backdrop-blur-md border border-gray-300/80 rounded-2xl p-6 w-full text-center transform hover:scale-105 transition-all duration-300">
              <div className="relative mb-4">
                <img
                  src={leaderboard[1].avatar}
                  alt={leaderboard[1].name}
                  className="w-20 h-20 rounded-full mx-auto border-4 border-gray-400"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-text mb-1">{leaderboard[1].name}</h3>
              <p className="text-gray-500 text-sm mb-2">Level {leaderboard[1].level}</p>
              <div className="flex items-center justify-center gap-1 text-gray-500">
                <Star className="w-4 h-4" />
                <span className="font-bold">{leaderboard[1].totalPoints.toLocaleString()}</span>
              </div>
            </div>
            <div className="w-full h-16 bg-gradient-to-t from-gray-300 to-gray-200 rounded-b-lg -mt-2"></div>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center order-2">
            <div className="bg-gradient-to-br from-secondary/20 to-pink-500/20 backdrop-blur-md border border-secondary/50 rounded-2xl p-6 w-full text-center transform hover:scale-105 transition-all duration-300">
              <div className="relative mb-4">
                <img
                  src={leaderboard[0].avatar}
                  alt={leaderboard[0].name}
                  className="w-24 h-24 rounded-full mx-auto border-4 border-secondary shadow-lg shadow-secondary/40"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <Trophy className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-text mb-1">{leaderboard[0].name}</h3>
              <p className="text-secondary text-sm mb-2 font-medium">Level {leaderboard[0].level}</p>
              <div className="flex items-center justify-center gap-1 text-secondary">
                <Star className="w-5 h-5" />
                <span className="font-bold text-lg">{leaderboard[0].totalPoints.toLocaleString()}</span>
              </div>
            </div>
            <div className="w-full h-20 bg-gradient-to-t from-secondary/80 to-secondary/60 rounded-b-lg -mt-2"></div>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center order-3 mt-4">
            <div className="bg-white/60 backdrop-blur-md border border-gray-300/80 rounded-2xl p-6 w-full text-center transform hover:scale-105 transition-all duration-300">
              <div className="relative mb-4">
                <img
                  src={leaderboard[2].avatar}
                  alt={leaderboard[2].name}
                  className="w-20 h-20 rounded-full mx-auto border-4 border-primary"
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-text mb-1">{leaderboard[2].name}</h3>
              <p className="text-gray-500 text-sm mb-2">Level {leaderboard[2].level}</p>
              <div className="flex items-center justify-center gap-1 text-primary">
                <Star className="w-4 h-4" />
                <span className="font-bold">{leaderboard[2].totalPoints.toLocaleString()}</span>
              </div>
            </div>
            <div className="w-full h-12 bg-gradient-to-t from-primary/80 to-primary/60 rounded-b-lg -mt-2"></div>
          </div>
        </div>
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white/60 backdrop-blur-md border border-gray-200/80 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-200/80">
          <h2 className="text-xl font-semibold text-text">Full Rankings</h2>
        </div>
        
        <div className="divide-y divide-gray-200/80">
          {leaderboard.map((user) => (
            <div
              key={user.id}
              className={`p-4 md:p-6 hover:bg-primary/5 transition-all duration-200 ${
                user.id === currentUser.id ? 'bg-primary/10 border-l-4 border-primary' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">{getRankIcon(user.rank)}</div>
                <div className="flex-shrink-0">
                  <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className={`font-semibold ${user.id === currentUser.id ? 'text-primary' : 'text-text'}`}>
                      {user.name}
                    </h3>
                    {user.id === currentUser.id && (
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">Level {user.level}</p>
                </div>
                <div className="flex items-center gap-2 md:gap-6 text-right">
                  <div className="hidden md:block">
                    <div className="flex items-center gap-1 text-secondary">
                      <Star className="w-4 h-4" />
                      <span className="font-bold">{user.totalPoints.toLocaleString()}</span>
                    </div>
                    <p className="text-gray-500 text-xs">Total Points</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRankBadge(user.rank)}`}>
                    #{user.rank}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/60 backdrop-blur-md border border-gray-200/80 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-text">{leaderboard.length}</p>
          <p className="text-gray-500 text-sm">Total Participants</p>
        </div>
        <div className="bg-white/60 backdrop-blur-md border border-gray-200/80 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-secondary">{leaderboard[0].totalPoints.toLocaleString()}</p>
          <p className="text-gray-500 text-sm">Highest Score</p>
        </div>
        <div className="bg-white/60 backdrop-blur-md border border-gray-200/80 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-primary">#{currentUser.rank}</p>
          <p className="text-gray-500 text-sm">Your Rank</p>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;