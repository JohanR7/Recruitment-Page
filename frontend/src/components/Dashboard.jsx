import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Clipboard, Zap, TrendingUp, Star, Calendar, Clock, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from "react-router-dom";


const Dashboard = () => {
  const { auth } = useAuth();

  const [dashboardData, setDashboardData] = useState({
    roadmaps: [],
    userProgress: {},
    userStats: {
      completedChallenges: 0,
      totalPoints: 0,
      currentLevel: 1,
      globalRank: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // API Configuration
  const API_BASE = 'https://aseam.acm.org/LMS/roadmaps/roadmap1.php';
  const userId = auth?.user?.id || auth?.user?.student_id || '1003';

  // API Helper with proper error handling
  const apiCall = useCallback(async (url, options = {}) => {
    const requestOptions = { ...options };
    if (!(options.body instanceof FormData)) {
      requestOptions.headers = {
        'Content-Type': 'application/json',
        ...(auth?.token && { 'Authorization': `Bearer ${auth.token}` }),
        ...options.headers
      };
    }

    try {
      const response = await fetch(url, requestOptions);
      const responseData = await response.json();

      if (!response.ok) {
        const errorMsg = responseData.error || `Request failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      return responseData;
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  }, [auth?.token]);

  // Fetch functions (keeping the same logic but removing logging for brevity)
  const fetchRoadmaps = useCallback(async () => {
    try {
      const data = await apiCall(`${API_BASE}/roadmaps`);
      return data.success ? data.roadmaps : [];
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      return [];
    }
  }, [apiCall]);

  const fetchAllProgress = useCallback(async (roadmaps) => {
    const progressPromises = roadmaps.map(async (roadmap) => {
      const url = `${API_BASE}/roadmap/progress`;
      const body = JSON.stringify({ roadmap_id: roadmap.id, user_id: userId });

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body
        });
        const progressData = await response.json();

        return {
          roadmapId: roadmap.id,
          progress: progressData.success ? progressData.progress : null
        };
      } catch (err) {
        return { roadmapId: roadmap.id, progress: null };
      }
    });

    const results = await Promise.all(progressPromises);
    const progressMap = {};
    results.forEach(({ roadmapId, progress }) => {
      if (progress) {
        progressMap[roadmapId] = progress;
      }
    });

    return progressMap;
  }, [userId]);



  // New function to fetch user rank directly from API
  const fetchUserRank = useCallback(async () => {
    try {
      const data = await apiCall(`${API_BASE}/student/rank?id=${userId}`);
      return data.success ? (data.rank || 0) : 0;
    } catch (error) {
      console.error('Error fetching user rank:', error);
      return 0;
    }
  }, [apiCall, userId]);

  const calculateUserStats = useCallback((progressData, userRank) => {
    let totalCompletedEvents = 0;
    let totalPoints = 0;
    let totalEvents = 0;

    Object.values(progressData).forEach(progress => {
      if (progress) {
        totalCompletedEvents += parseInt(progress.completed_events) || 0;
        totalPoints += parseInt(progress.total_points) || 0;
        totalEvents += parseInt(progress.total_events) || 0;
      }
    });

    const currentLevel = Math.floor(totalPoints / 250) + 1;

    return {
      completedChallenges: totalCompletedEvents,
      totalPoints,
      currentLevel,
      globalRank: userRank,
      totalEvents
    };
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [roadmaps, userRank] = await Promise.all([
        fetchRoadmaps(),
        fetchUserRank()
      ]);

      const userProgress = await fetchAllProgress(roadmaps);
      const userStats = calculateUserStats(userProgress, userRank);

      setDashboardData({
        roadmaps,
        userProgress,
        userStats
      });

    } catch (err) {
      setError(`Failed to load dashboard data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [fetchRoadmaps, fetchUserRank, fetchAllProgress, calculateUserStats]);

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, userId]);

  // Helper functions
  const getProgressPercentage = (progress) => {
    if (!progress || !progress.total_events || progress.total_events === 0) return 0;
    return Math.round((progress.completed_events / progress.total_events) * 100);
  };

  const getLevelProgress = () => {
    const { totalPoints, currentLevel } = dashboardData.userStats;
    const pointsInCurrentLevel = totalPoints % 250;
    return Math.round((pointsInCurrentLevel / 250) * 100);
  };

  const getRecentChallenges = () => {
    return dashboardData.roadmaps.slice(0, 3).map(roadmap => {
      const progress = dashboardData.userProgress[roadmap.id];
      return {
        id: roadmap.id,
        title: roadmap.title,
        progress: getProgressPercentage(progress),
        completed: progress && progress.completed_events > 0,
      };
    });
  };

  if (loading) {
    return (
      <div className="p-6 bg-background dark:bg-dark-background text-text dark:text-dark-text min-h-screen transition-colors duration-300">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-dark-primary mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-background dark:bg-dark-background text-text dark:text-dark-text min-h-screen transition-colors duration-300">
        <div className="bg-red-500/20 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-500/50 dark:border-red-700/50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Error Loading Dashboard</h3>
          <p>{error}</p>
          <button
            onClick={fetchDashboardData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { userStats, roadmaps, userProgress } = dashboardData;
  const levelProgress = getLevelProgress();
  const recentChallenges = getRecentChallenges();
  const nextLevelPoints = (userStats.currentLevel) * 250;

  const statsCards = [
    { icon: Clipboard, label: 'Challenges', value: userStats.completedChallenges, unit: 'Completed', color: 'primary' },
    { icon: Star, label: 'Total Points', value: userStats.totalPoints.toLocaleString(), unit: 'Earned', color: 'secondary' },
    { icon: TrendingUp, label: 'Current Level', value: userStats.currentLevel, unit: `Next in ${nextLevelPoints - userStats.totalPoints} pts`, color: 'primary' },
    { icon: Trophy, label: 'Rank', value: userStats.globalRank > 0 ? `#${userStats.globalRank}` : 'N/A', unit: userStats.globalRank > 0 ? 'Global Position' : 'Not Ranked', color: 'secondary' }
  ];

  return (
    <div className="ml-1 space-y-5 bg-background dark:bg-dark-background text-text dark:text-dark-text transition-colors duration-300">

      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 dark:from-dark-primary/10 to-secondary/10 dark:to-dark-secondary/10 backdrop-blur-sm border border-primary/20 dark:border-dark-primary/20 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/20 dark:bg-dark-primary/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary dark:text-dark-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text dark:text-dark-text">
              Welcome back, {auth?.user?.name || auth?.user?.student_name || 'Student'}!
            </h1>
            <p className="text-primary dark:text-dark-primary">Ready to tackle new challenges today?</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white/60 dark:bg-dark-background/50 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/60 rounded-xl p-6 hover:border-primary/50 dark:hover:border-dark-primary/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color === 'primary'
                ? 'bg-primary/20 dark:bg-dark-primary/20'
                : 'bg-secondary/20 dark:bg-dark-secondary/20'
                }`}>
                <stat.icon className={`w-5 h-5 ${stat.color === 'primary'
                  ? 'text-primary dark:text-dark-primary'
                  : 'text-secondary dark:text-dark-secondary'
                  }`} />
              </div>
              <span className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-text dark:text-dark-text">{stat.value}</p>
            <p className={`text-sm font-medium ${stat.color === 'primary'
              ? 'text-primary dark:text-dark-primary'
              : 'text-secondary dark:text-dark-secondary'
              }`}>{stat.unit}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Level Progress */}
        <div className="bg-white/60 dark:bg-dark-background/50 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/60 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text dark:text-dark-text">Level Progress</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">Level {userStats.currentLevel}</span>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>{userStats.totalPoints % 250} / 250 XP</span>
              <span>{levelProgress}%</span>
            </div>
            <div className="w-full bg-gray-200/80 dark:bg-gray-700/80 rounded-full h-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary dark:from-dark-primary to-secondary dark:to-dark-secondary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Complete more challenges to reach Level {userStats.currentLevel + 1}!
          </p>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/60 dark:bg-dark-background/50 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/60 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text dark:text-dark-text">Recent Quest Lines</h2>
            <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentChallenges.length > 0 ? (
              recentChallenges.map((challenge) => (
                <div key={challenge.id} className="flex items-center gap-3 p-3 bg-gray-100/70 dark:bg-gray-800/70 rounded-lg hover:bg-gray-200/90 dark:hover:bg-gray-700/90 transition-all duration-200">
                  <div className={`w-2 h-2 rounded-full ${challenge.completed
                    ? 'bg-primary dark:bg-dark-primary'
                    : 'bg-secondary dark:bg-dark-secondary'
                    }`}></div>
                  <div className="flex-1">
                    <p className="text-text dark:text-dark-text text-sm font-medium">{challenge.title}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{challenge.progress || 0}% complete</p>
                  </div>

                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No quest lines available</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/60 dark:bg-dark-background/50 backdrop-blur-sm border border-gray-200/80 dark:border-gray-700/60 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text dark:text-dark-text mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-3 p-4 bg-primary/10 dark:bg-dark-primary/10 border border-primary/20 dark:border-dark-primary/20 rounded-lg hover:bg-primary/20 dark:hover:bg-dark-primary/20 transition-all duration-200 group"
          >
            <Zap className="w-6 h-6 text-primary dark:text-dark-primary group-hover:scale-110 transition-transform duration-200" />
            <div className="text-left">
              <p className="text-text dark:text-dark-text font-medium">Refresh Data</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Update dashboard info</p>
            </div>
          </button>

          <Link
            to="/leaderboard"
            className="flex items-center gap-3 p-4 bg-secondary/10 dark:bg-dark-secondary/10 
                   border border-secondary/20 dark:border-dark-secondary/20 rounded-lg 
                   hover:bg-secondary/20 dark:hover:bg-dark-secondary/20 
                   transition-all duration-200 group"
          >
            <Trophy className="w-6 h-6 text-secondary dark:text-dark-secondary group-hover:scale-110 transition-transform duration-200" />
            <div className="text-left">
              <p className="text-text dark:text-dark-text font-medium">View Leaderboard</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">See your ranking</p>
            </div>
          </Link>
          <Link
            to="/challenges"
            className="flex items-center gap-3 p-4 bg-accent/10 dark:bg-dark-accent/10 
                   border border-accent/20 dark:border-dark-accent/20 rounded-lg 
                   hover:bg-accent/20 dark:hover:bg-dark-accent/20 
                   transition-all duration-200 group"
          >
            <Calendar className="w-6 h-6 text-accent dark:text-dark-accent group-hover:scale-110 transition-transform duration-200" />
            <div className="text-left">
              <p className="text-text dark:text-dark-text font-medium">Quest Lines</p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Available: {roadmaps.length}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;