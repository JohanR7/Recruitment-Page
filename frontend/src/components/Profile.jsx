// src/components/Profile.jsx

import React from 'react';
import { User, Mail, Calendar, Trophy, Star, Target, TrendingUp, Settings } from 'lucide-react';
import { currentUser, challenges } from '../data/mockData';

const Profile = () => {
  const completedChallenges = challenges.filter(c => c.completed).length;
  const totalChallenges = challenges.length;
  const completionRate = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and view your achievements</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-200/80 text-gray-600 rounded-lg hover:bg-gray-300/80 transition-all duration-200 font-medium">
          <Settings className="w-4 h-4" />
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-1">
          <div className="bg-white/60 backdrop-blur-md border border-gray-200/80 rounded-2xl p-6">
            <div className="text-center mb-6">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary"
              />
              <h2 className="text-2xl font-bold text-text mb-1">{currentUser.name}</h2>
              <p className="text-gray-500 mb-4">{currentUser.email}</p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full">
                <Trophy className="w-4 h-4" />
                <span className="font-semibold">Level {currentUser.level}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-100/80 rounded-lg">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-text font-medium">{currentUser.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-100/80 rounded-lg">
                <Calendar className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="text-text font-medium">January 2025</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-100/80 rounded-lg">
                <TrendingUp className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Global Rank</p>
                  <p className="text-text font-medium">#{currentUser.rank}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats and Achievements */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/60 backdrop-blur-md border border-gray-200/80 rounded-xl p-4 text-center">
              <Star className="w-8 h-8 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-text">{currentUser.totalPoints.toLocaleString()}</p>
              <p className="text-gray-500 text-sm">Total Points</p>
            </div>
            <div className="bg-white/60 backdrop-blur-md border border-gray-200/80 rounded-xl p-4 text-center">
              <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-text">{completedChallenges}</p>
              <p className="text-gray-500 text-sm">Completed</p>
            </div>
            <div className="bg-white/60 backdrop-blur-md border border-gray-200/80 rounded-xl p-4 text-center">
              <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-text">{currentUser.level}</p>
              <p className="text-gray-500 text-sm">Current Level</p>
            </div>
            <div className="bg-white/60 backdrop-blur-md border border-gray-200/80 rounded-xl p-4 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-text">{completionRate}%</p>
              <p className="text-gray-500 text-sm">Completion</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/60 backdrop-blur-md border border-gray-200/80 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-100/80 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-text text-sm">Completed "JavaScript Basics" challenge</p>
                  <p className="text-gray-500 text-xs">2 hours ago</p>
                </div>
                <span className="text-green-600 text-sm font-medium">+200 XP</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-100/80 rounded-lg">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-text text-sm">Started "React Framework Mastery"</p>
                  <p className="text-gray-500 text-xs">1 day ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-100/80 rounded-lg">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-text text-sm">Achieved Level 12</p>
                  <p className="text-gray-500 text-xs">3 days ago</p>
                </div>
                <span className="text-secondary text-sm font-medium">Level Up!</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white/60 backdrop-blur-md border border-gray-200/80 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-text mb-4">Achievements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 bg-secondary/10 border border-secondary/20 rounded-lg">
                <Trophy className="w-8 h-8 text-secondary" />
                <div>
                  <p className="text-text font-medium">First Challenge</p>
                  <p className="text-gray-500 text-sm">Complete your first challenge</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
                <Star className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-text font-medium">Quick Learner</p>
                  <p className="text-gray-500 text-sm">Reach Level 10</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-200/60 border border-gray-300/60 rounded-lg opacity-60">
                <Target className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="text-gray-500 font-medium">Challenge Master</p>
                  <p className="text-gray-500 text-sm">Complete 10 challenges</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-200/60 border border-gray-300/60 rounded-lg opacity-60">
                <TrendingUp className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="text-gray-500 font-medium">Top Performer</p>
                  <p className="text-gray-500 text-sm">Reach top 3 on leaderboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;