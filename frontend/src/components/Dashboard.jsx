import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Target, Zap, TrendingUp, Star, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

const Dashboard = () => {
  const { auth } = useAuth();
  
  const [dashboardData, setDashboardData] = useState({
    roadmaps: [],
    userProgress: {},
    leaderboard: [],
    userStats: {
      completedChallenges: 0,
      totalPoints: 0,
      currentLevel: 1,
      globalRank: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiLogs, setApiLogs] = useState([]);

  // API Configuration
  const API_BASE = 'https://aseam.acm.org/LMS/roadmaps/roadmap1.php';
  const userId = auth?.user?.id || auth?.user?.student_id || '1003'; // Fallback for demo

  // API Helper
  const apiCall = useCallback(async (url, options = {}) => {
    const method = options.method || 'GET';
    const apiType = url.split('/').pop() || 'unknown';
    
    const requestOptions = { ...options };
    if (!(options.body instanceof FormData)) {
      requestOptions.headers = { 
        'Content-Type': 'application/json', 
        ...(auth?.token && { 'Authorization': `Bearer ${auth.token}` }),
        ...options.headers 
      };
    }
    
    logApiCall(apiType, url, method, options.body, null, null);
    
    try {
      const response = await fetch(url, requestOptions);
      const responseData = await response.json();
      
      if (!response.ok) {
        const errorMsg = responseData.error || `Request failed with status ${response.status}`;
        logApiCall(apiType, url, method, options.body, responseData, errorMsg);
        throw new Error(errorMsg);
      }
      
      logApiCall(apiType, url, method, options.body, responseData, null);
      return responseData;
    } catch (err) {
      console.error('API Error:', err);
      logApiCall(apiType, url, method, options.body, null, err.message);
      throw err;
    }
  }, [auth?.token]);

  // Fetch Roadmaps
  const fetchRoadmaps = useCallback(async () => {
    try {
      const data = await apiCall(`${API_BASE}/roadmaps`);
      if (data.success) {
        return data.roadmaps;
      }
      return [];
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
      return [];
    }
  }, [apiCall]);

  // Fetch User Progress for all roadmaps
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
        
        logApiCall('progress', url, 'POST', body, progressData, progressData.success ? null : 'Failed to fetch progress');
        
        return {
          roadmapId: roadmap.id,
          progress: progressData.success ? progressData.progress : null
        };
      } catch (err) {
        logApiCall('progress', url, 'POST', body, null, err.message);
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

  // Fetch Leaderboard
  const fetchLeaderboard = useCallback(async () => {
    try {
      const data = await apiCall(`${API_BASE}/leaderboard?page=1&limit=10`);
      if (data.success) {
        return data.leaderboard;
      }
      return [];
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }, [apiCall]);

  // Calculate user stats from progress data
  const calculateUserStats = useCallback((progressData, leaderboardData) => {
    let totalCompletedEvents = 0;
    let totalPoints = 0;
    let totalEvents = 0;

    // Sum up progress from all roadmaps
    Object.values(progressData).forEach(progress => {
      if (progress) {
        totalCompletedEvents += parseInt(progress.completed_events) || 0;
        totalPoints += parseInt(progress.total_points) || 0;
        totalEvents += parseInt(progress.total_events) || 0;
      }
    });

    // Calculate level (assuming 250 points per level)
    const currentLevel = Math.floor(totalPoints / 250) + 1;

    // Find user's rank in leaderboard
    const userRank = leaderboardData.findIndex(player => player.student_id === userId) + 1;

    return {
      completedChallenges: totalCompletedEvents,
      totalPoints,
      currentLevel,
      globalRank: userRank || 0,
      totalEvents
    };
  }, [userId]);

  // Main data fetching function
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch all data concurrently
      const [roadmaps, leaderboard] = await Promise.all([
        fetchRoadmaps(),
        fetchLeaderboard()
      ]);

      // Fetch progress for all roadmaps
      const userProgress = await fetchAllProgress(roadmaps);

      // Calculate user statistics
      const userStats = calculateUserStats(userProgress, leaderboard);

      setDashboardData({
        roadmaps,
        userProgress,
        leaderboard,
        userStats
      });

    } catch (err) {
      setError(`Failed to load dashboard data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [fetchRoadmaps, fetchLeaderboard, fetchAllProgress, calculateUserStats]);

  // Load data on component mount
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
        difficulty: 'medium' // Default since not provided by API
      };
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-500/20 text-red-700 border border-red-500/50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-2">Error Loading Dashboard</h3>
          <p>{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { userStats } = dashboardData;
  const levelProgress = getLevelProgress();
  const recentChallenges = getRecentChallenges();
  const nextLevelPoints = (userStats.currentLevel) * 250;

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm border border-primary/20 rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">
              Welcome back, {auth?.user?.name || auth?.user?.student_name || 'Student'}!
            </h1>
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
          <p className="text-2xl font-bold text-text">{userStats.completedChallenges}</p>
          <p className="text-primary text-sm font-medium">Completed</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-6 hover:border-secondary/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-gray-600 text-sm">Total Points</span>
          </div>
          <p className="text-2xl font-bold text-text">{userStats.totalPoints.toLocaleString()}</p>
          <p className="text-secondary text-sm font-medium">Earned</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <span className="text-gray-600 text-sm">Current Level</span>
          </div>
          <p className="text-2xl font-bold text-text">{userStats.currentLevel}</p>
          <p className="text-primary text-sm font-medium">
            Level {userStats.currentLevel + 1} in {nextLevelPoints - userStats.totalPoints} pts
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-6 hover:border-secondary/50 transition-all duration-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-secondary" />
            </div>
            <span className="text-gray-600 text-sm">Global Rank</span>
          </div>
          <p className="text-2xl font-bold text-text">
            #{userStats.globalRank || 'N/A'}
          </p>
          <p className="text-secondary text-sm font-medium">
            {dashboardData.leaderboard.length > 0 ? 'On Leaderboard' : 'Not Ranked'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Level Progress */}
        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text">Level Progress</h2>
            <span className="text-sm text-gray-500">Level {userStats.currentLevel}</span>
          </div>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{userStats.totalPoints % 250} / 250 XP</span>
              <span>{levelProgress}%</span>
            </div>
            <div className="w-full bg-gray-200/80 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${levelProgress}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-500 text-sm">
            Complete more challenges to reach Level {userStats.currentLevel + 1}!
          </p>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-text">Recent Quest Lines</h2>
            <Clock className="w-5 h-5 text-gray-500" />
          </div>
          <div className="space-y-3">
            {recentChallenges.length > 0 ? (
              recentChallenges.map((challenge) => (
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
              ))
            ) : (
              <p className="text-gray-500 text-sm">No quest lines available</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-text mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-lg hover:bg-primary/20 transition-all duration-200 group"
          >
            <Zap className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-200" />
            <div className="text-left">
              <p className="text-text font-medium">Refresh Data</p>
              <p className="text-gray-500 text-sm">Update dashboard info</p>
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
              <p className="text-text font-medium">Quest Lines</p>
              <p className="text-gray-500 text-sm">Available: {dashboardData.roadmaps.length}</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;