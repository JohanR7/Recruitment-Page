import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Medal, Award, Star, TrendingUp, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; 

const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// A placeholder for user avatars
const PlaceholderAvatar = ({ name, rank }) => {
  const getRankColor = () => {
    if (rank === 1) return 'bg-gradient-to-br from-purple-700 to-purple-900'; // Primary color
    if (rank === 2) return 'bg-gradient-to-br from-pink-500 to-pink-700'; // Secondary color
    if (rank === 3) return 'bg-gradient-to-br from-red-600 to-red-800'; // Accent color
    return 'bg-gray-200';
  };
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  
  return (
    <div className={`w-full h-full rounded-full flex items-center justify-center ${getRankColor()}`}>
      <span className="text-white text-3xl font-bold">{initial}</span>
    </div>
  );
};



const Leaderboard = () => {
  const { auth } = useAuth(); 
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const API_BASE = 'https://aseam.acm.org/LMS/roadmaps/roadmap1.php';

  // Get current user info from auth context
  const currentUser = auth?.user;
  const currentUserId = currentUser?.id || currentUser?.student_id || currentUser?.user_id;
  const currentUserName = currentUser?.name || currentUser?.student_name || currentUser?.username;

  // Debug logging for auth info
  console.log('🔐 Auth Context Data:', auth);
  console.log('👤 Current User:', currentUser);
  console.log('🆔 Current User ID:', currentUserId);
  console.log('📝 Current User Name:', currentUserName);

  


  const handleRefresh = () => {
    window.location.reload();
  };
  const apiCall = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError('');
    
    const requestOptions = { 
      ...options,
      headers: {
        ...options.headers,
        ...(auth?.token && { 'Authorization': `Bearer ${auth.token}` }),
      }
    };
    
    if (!(options.body instanceof FormData)) {
      requestOptions.headers['Content-Type'] = 'application/json';
    }
    
    try {
      console.log('🌐 Making API request to:', url);
      console.log('🔑 Using auth token:', auth?.token ? 'Present' : 'Not present');
      
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Request failed with status ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      console.error('API Error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [auth?.token]);

  // Fetch leaderboard with API integration and logging
  const fetchLeaderboard = useCallback(async (currentPage = 1) => {
    try {
      console.log(`🚀 Fetching leaderboard - Page: ${currentPage}`);
      const data = await apiCall(`${API_BASE}/leaderboard?page=${currentPage}&limit=10`);
      
      console.log('📊 Leaderboard API Response:', JSON.stringify(data, null, 2));
      
      if (data.success) {
        console.log('✅ Leaderboard fetch successful');
        console.log('📋 Leaderboard data:', data.leaderboard);
        console.log('📄 Pagination info:', data.pagination);
        
        setLeaderboardData(data.leaderboard);
        setPage(data.pagination.current_page);
        setTotalPages(data.pagination.total_pages);
      } else {
        console.warn('⚠️ Leaderboard API returned success: false');
        setLeaderboardData([]);
      }
    } catch (error) {
      console.error('❌ Error fetching leaderboard:', error);
      setLeaderboardData([]);
    }
  }, [apiCall]);

  // Initial fetch when the component mounts
  useEffect(() => {
    fetchLeaderboard(1);
  }, [fetchLeaderboard]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      console.log(`📄 Changing to page: ${newPage}`);
      fetchLeaderboard(newPage);
    }
  };

  // Helper function to check if a user is the current user
  const isCurrentUser = (user) => {
    if (!currentUserId) return false;
    
    // Check multiple possible ID fields
    return user.student_id?.toString() === currentUserId?.toString() ||
           user.id?.toString() === currentUserId?.toString() ||
           user.user_id?.toString() === currentUserId?.toString();
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-purple-700" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-pink-500" />;
    if (rank === 3) return <Award className="w-6 h-6 text-red-600" />;
    return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</span>;
  };
  
  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-purple-700 to-purple-900 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-pink-500 to-pink-700 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-red-600 to-red-800 text-white';
    return 'bg-gray-200 text-gray-700';
  };

  // Get top 3 from current leaderboard data
  const topThree = leaderboardData.slice(0, 3);

  // Find current user in leaderboard
  const currentUserInLeaderboard = leaderboardData.find(user => isCurrentUser(user));

  // Debug logging for render
  console.log('🎯 Rendering Leaderboard Component');
  console.log('Current leaderboard state:', leaderboardData);
  console.log('Current page:', page);
  console.log('Total pages:', totalPages);
  console.log('Current user in leaderboard:', currentUserInLeaderboard);

return (
    <div className="p-6 bg-background dark:bg-dark-background text-text dark:text-dark-text transition-colors duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text dark:text-dark-text mb-2">Hall of Fame</h1>
          <p className="text-gray-600 dark:text-gray-400">
            {currentUserName ? `Welcome back, ${currentUserName}! ` : ''}
            See how you rank against other recruits
          </p>
          {currentUserInLeaderboard && (
            <div className="mt-2 text-sm text-primary dark:text-dark-primary font-medium">
              🎯 Your current rank: #{currentUserInLeaderboard.rank_position} with {currentUserInLeaderboard.total_points.toLocaleString()} points
            </div>
          )}
        </div>
        <button
          onClick={handleRefresh}
          className="bg-primary dark:bg-dark-primary hover:bg-primary/90 dark:hover:bg-dark-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 dark:bg-red-900/30 text-red-700 dark:text-red-300 border border-red-500/50 dark:border-red-700/50 rounded-lg mb-6">
          Error: {error}
        </div>
      )}

      {loading && leaderboardData.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary dark:border-dark-primary"></div>
        </div>
      ) : leaderboardData.length === 0 ? (
        <div className="text-center py-20 bg-white/50 dark:bg-dark-background/50 border border-gray-200/60 dark:border-gray-700/60 rounded-xl mt-6">
          <Trophy className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">Leaderboard is Empty</h3>
          <p className="text-gray-500 dark:text-gray-500">Be the first one to score points!</p>
        </div>
      ) : (
        <>
          {/* Current User Highlight Card */}
          {currentUserInLeaderboard && currentUserInLeaderboard.rank_position > 3 && page > 1 && (
            <div className="mb-6 bg-gradient-to-r from-primary/10 dark:from-dark-primary/10 to-primary/20 dark:to-dark-primary/20 border-2 border-primary/30 dark:border-dark-primary/30 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-primary dark:text-dark-primary mb-2">Your Position</h3>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">{getRankIcon(currentUserInLeaderboard.rank_position)}</div>
                <div className="flex-shrink-0 w-12 h-12">
                  <PlaceholderAvatar name={currentUserInLeaderboard.student_name} rank={currentUserInLeaderboard.rank_position} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-primary dark:text-dark-primary truncate">
                    {currentUserInLeaderboard.student_name}
                  </h4>
                  <p className="text-primary/80 dark:text-dark-primary/80 text-sm">{currentUserInLeaderboard.completed_events} quests completed</p>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <div className="flex items-center gap-1 text-primary dark:text-dark-primary">
                    <Star className="w-4 h-4" />
                    <span className="font-bold">{currentUserInLeaderboard.total_points.toLocaleString()}</span>
                  </div>
                  <div className="px-3 py-1 rounded-full text-sm font-semibold bg-primary dark:bg-dark-primary text-white">
                    #{currentUserInLeaderboard.rank_position}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top 3 Podium */}
          {topThree.length >= 3 && (
            <div className="mb-8">
              <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
                {/* 2nd Place */}
                <div className={`flex flex-col items-center order-1 mt-4 group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${isCurrentUser(topThree[1]) ? 'ring-2 ring-primary/50 dark:ring-dark-primary/50 ring-offset-2 ring-offset-background dark:ring-offset-dark-background' : ''}`}>
                  <div className="relative bg-white/70 dark:bg-dark-background/70 backdrop-blur-lg border border-secondary/30 dark:border-dark-secondary/30 rounded-2xl p-6 w-full text-center 
                                  hover:shadow-2xl hover:shadow-secondary/20 dark:hover:shadow-dark-secondary/20 
                                  hover:bg-gradient-to-br hover:from-secondary/5 dark:hover:from-dark-secondary/5 hover:to-secondary/10 dark:hover:to-dark-secondary/10 hover:border-secondary/50 dark:hover:border-dark-secondary/50
                                  before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-secondary/10 dark:before:from-dark-secondary/10 before:to-secondary/20 dark:before:to-dark-secondary/20
                                  before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500">
                    <div className="relative z-10">
                      {isCurrentUser(topThree[1]) && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary dark:bg-dark-primary text-white text-xs px-2 py-1 rounded-full font-bold">
                          YOU
                        </div>
                      )}
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-secondary dark:from-dark-secondary to-secondary/80 dark:to-dark-secondary/80 rounded-full 
                                      flex items-center justify-center shadow-lg transform transition-all duration-300 
                                      group-hover:scale-110 group-hover:rotate-12">
                        <Medal className="w-4 h-4 text-white" />
                      </div>
                      <div className="relative mb-4 w-20 h-20 mx-auto transform transition-all duration-300 group-hover:scale-110">
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary/30 dark:from-dark-secondary/30 to-secondary/50 dark:to-dark-secondary/50 rounded-full blur-lg 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <PlaceholderAvatar name={topThree[1].student_name} rank={2} />
                      </div>
                      <h3 className="text-lg font-semibold text-text dark:text-dark-text mb-1 truncate transition-colors duration-300 group-hover:text-secondary dark:group-hover:text-dark-secondary">
                        {topThree[1].student_name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 text-secondary dark:text-dark-secondary transition-all duration-300">
                        <Star className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                        <span className="font-bold">{topThree[1].total_points.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-16 bg-gradient-to-t from-secondary/80 dark:from-dark-secondary/80 to-secondary/60 dark:to-dark-secondary/60 rounded-b-lg -mt-2 
                                  transform transition-all duration-500 group-hover:from-secondary/90 dark:group-hover:from-dark-secondary/90 group-hover:to-secondary/70 dark:group-hover:to-dark-secondary/70 
                                  group-hover:shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                    transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                                    transition-transform duration-1000 delay-200"></div>
                  </div>
                </div>

                {/* 1st Place */}
                <div className={`flex flex-col items-center order-2 group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-3 ${isCurrentUser(topThree[0]) ? 'ring-2 ring-primary/50 dark:ring-dark-primary/50 ring-offset-2 ring-offset-background dark:ring-offset-dark-background' : ''}`}>
                  <div className="relative bg-gradient-to-br from-primary/5 dark:from-dark-primary/5 to-primary/10 dark:to-dark-primary/10 backdrop-blur-lg 
                                  border border-primary/30 dark:border-dark-primary/30 rounded-2xl p-6 w-full text-center 
                                  hover:shadow-2xl hover:shadow-primary/30 dark:hover:shadow-dark-primary/30 
                                  hover:bg-gradient-to-br hover:from-primary/10 dark:hover:from-dark-primary/10 hover:to-primary/20 dark:hover:to-dark-primary/20 hover:border-primary/50 dark:hover:border-dark-primary/50
                                  before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-primary/10 dark:before:from-dark-primary/10 before:to-primary/20 dark:before:to-dark-primary/20
                                  before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
                                  after:absolute after:inset-0 after:rounded-2xl after:shadow-inner after:shadow-primary/20 dark:after:shadow-dark-primary/20
                                  after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500">
                    <div className="relative z-10">
                      {isCurrentUser(topThree[0]) && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary dark:bg-dark-primary text-white text-xs px-2 py-1 rounded-full font-bold">
                          YOU
                        </div>
                      )}
                      <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br from-primary dark:from-dark-primary to-primary/80 dark:to-dark-primary/80 rounded-full 
                                      flex items-center justify-center shadow-xl transform transition-all duration-300 
                                      group-hover:scale-125 group-hover:rotate-45 group-hover:shadow-primary/50 dark:group-hover:shadow-dark-primary/50">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div className="relative mb-4 w-24 h-24 mx-auto transform transition-all duration-300 group-hover:scale-125">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 dark:from-dark-primary/40 to-primary/60 dark:to-dark-primary/60 rounded-full blur-xl 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        <PlaceholderAvatar name={topThree[0].student_name} rank={1} />
                      </div>
                      <h3 className="text-xl font-bold text-text dark:text-dark-text mb-1 truncate transition-colors duration-300 group-hover:text-primary dark:group-hover:text-dark-primary">
                        {topThree[0].student_name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 text-primary dark:text-dark-primary transition-all duration-300">
                        <Star className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180 group-hover:scale-125" />
                        <span className="font-bold text-lg">{topThree[0].total_points.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-20 bg-gradient-to-t from-primary/80 dark:from-dark-primary/80 to-primary/60 dark:to-dark-primary/60 rounded-b-lg -mt-2 
                                  transform transition-all duration-500 group-hover:from-primary/90 dark:group-hover:from-dark-primary/90 group-hover:to-primary/70 dark:group-hover:to-dark-primary/70 
                                  group-hover:shadow-xl group-hover:shadow-primary/40 dark:group-hover:shadow-dark-primary/40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                                    transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                                    transition-transform duration-1000 delay-300"></div>
                  </div>
                </div>

                {/* 3rd Place */}
                <div className={`flex flex-col items-center order-3 mt-4 group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2 ${isCurrentUser(topThree[2]) ? 'ring-2 ring-primary/50 dark:ring-dark-primary/50 ring-offset-2 ring-offset-background dark:ring-offset-dark-background' : ''}`}>
                  <div className="relative bg-white/70 dark:bg-dark-background/70 backdrop-blur-lg border border-accent/30 dark:border-dark-accent/30 rounded-2xl p-6 w-full text-center 
                                  group-hover:shadow-2xl group-hover:shadow-accent/20 dark:group-hover:shadow-dark-accent/20 
                                  group-hover:bg-gradient-to-br group-hover:from-accent/5 dark:group-hover:from-dark-accent/5 group-hover:to-accent/10 dark:group-hover:to-dark-accent/10 group-hover:border-accent/50 dark:group-hover:border-dark-accent/50
                                  transition-all duration-500
                                  before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-accent/10 dark:before:from-dark-accent/10 before:to-accent/20 dark:before:to-dark-accent/20
                                  before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500">
                    <div className="relative z-10">
                      {isCurrentUser(topThree[2]) && (
                        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-primary dark:bg-dark-primary text-white text-xs px-2 py-1 rounded-full font-bold">
                          YOU
                        </div>
                      )}
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-accent dark:from-dark-accent to-accent/80 dark:to-dark-accent/80 rounded-full 
                                      flex items-center justify-center shadow-lg transform transition-all duration-300 
                                      group-hover:scale-110 group-hover:rotate-12">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <div className="relative mb-4 w-20 h-20 mx-auto transform transition-all duration-300 group-hover:scale-110">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent/30 dark:from-dark-accent/30 to-accent/60 dark:to-dark-accent/60 rounded-full blur-lg 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <PlaceholderAvatar name={topThree[2].student_name} rank={3} />
                      </div>
                      <h3 className="text-lg font-semibold text-text dark:text-dark-text mb-1 truncate transition-colors duration-300 group-hover:text-accent dark:group-hover:text-dark-accent">
                        {topThree[2].student_name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 text-accent dark:text-dark-accent transition-all duration-300">
                        <Star className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                        <span className="font-bold">{topThree[2].total_points.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-16 bg-gradient-to-t from-accent/80 dark:from-dark-accent/80 to-accent/60 dark:to-dark-accent/60 rounded-b-lg -mt-2 
                                  transform transition-all duration-500 group-hover:from-accent/90 dark:group-hover:from-dark-accent/90 group-hover:to-accent/70 dark:group-hover:to-dark-accent/70 
                                  group-hover:shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                    transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                                    transition-transform duration-1000 delay-200"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Full Leaderboard List */}
          <div className="bg-white/60 dark:bg-dark-background/60 backdrop-blur-md border border-gray-200/80 dark:border-gray-700/80 rounded-2xl overflow-hidden">
            <div className="divide-y divide-gray-200/80 dark:divide-gray-700/80">
              {leaderboardData.map((user) => {
                const isCurrent = isCurrentUser(user);
                console.log('👤 Rendering player:', user, 'Is current user:', isCurrent);
                
                return (
                  <div key={user.student_id} className={`p-4 md:p-6 hover:bg-primary/5 dark:hover:bg-dark-primary/5 transition-all duration-200 ${isCurrent ? 'bg-primary/10 dark:bg-dark-primary/10 border-l-4 border-primary dark:border-dark-primary' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">{getRankIcon(user.rank_position)}</div>
                      <div className="flex-shrink-0 w-12 h-12">
                        <PlaceholderAvatar name={user.student_name} rank={user.rank_position} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold truncate ${isCurrent ? 'text-primary dark:text-dark-primary' : 'text-text dark:text-dark-text'}`}>
                          {user.student_name} {isCurrent && <span className="text-xs bg-primary dark:bg-dark-primary text-white px-2 py-1 rounded-full ml-2">YOU</span>}
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">{user.completed_events} quests completed</p>
                      </div>
                      <div className="flex items-center gap-2 md:gap-6 text-right">
                        <div className="hidden md:block">
                          <div className="flex items-center gap-1 text-secondary dark:text-dark-secondary">
                            <Star className="w-4 h-4" />
                            <span className="font-bold">{user.total_points.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRankBadge(user.rank_position)}`}>
                          #{user.rank_position}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-6 gap-4">
              <button 
                onClick={() => {
                  console.log('⬅️ Previous page clicked, current page:', page);
                  handlePageChange(page - 1);
                }} 
                disabled={page === 1 || loading} 
                className="px-6 py-2 bg-white dark:bg-dark-background border border-gray-300 dark:border-gray-600 text-text dark:text-dark-text rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                Previous
              </button>
              <span className="text-gray-600 dark:text-gray-400 font-medium px-4">Page {page} of {totalPages}</span>
              <button 
                onClick={() => {
                  console.log('➡️ Next page clicked, current page:', page);
                  handlePageChange(page + 1);
                }} 
                disabled={page === totalPages || loading} 
                className="px-6 py-2 bg-white dark:bg-dark-background border border-gray-300 dark:border-gray-600 text-text dark:text-dark-text rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Leaderboard;