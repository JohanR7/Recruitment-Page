// src/components/Leaderboard.jsx

import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Star, TrendingUp, Crown } from 'lucide-react';

// --- Helper Components ---

// A simple loading spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// A placeholder for user avatars
const PlaceholderAvatar = ({ name, rank }) => {
  const getRankColor = () => {
    if (rank === 1) return 'bg-gradient-to-br from-secondary to-pink-500';
    if (rank === 2) return 'bg-gradient-to-br from-gray-400 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-br from-primary to-purple-700';
    return 'bg-gray-200';
  };
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  
  return (
    <div className={`w-full h-full rounded-full flex items-center justify-center ${getRankColor()}`}>
      <span className="text-white text-3xl font-bold">{initial}</span>
    </div>
  );
};


// --- Main Leaderboard Component ---

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState('');
  const API_BASE = 'https://aseam.acm.org/LMS/roadmaps/roadmap.php'; // <-- IMPORTANT: UPDATE THIS

  // Get user ID from localStorage or set default
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || 'AM.SC.U4AIE23015';
    setUserId(storedUserId);
  }, []);

  // --- API Logic ---
  const fetchLeaderboard = async (currentPage = 1) => {
    setLoading(true);
    try {
      // NOTE: This assumes omitting `roadmap_id` fetches the global leaderboard.
      // Adjust the URL if your API behaves differently.
      const response = await fetch(`${API_BASE}/roadmap/event/leaderboard?page=${currentPage}`);
      const data = await response.json();
      if (data.success) {
        setLeaderboardData(data.leaderboard);
        setPage(data.page);
        setTotalPages(data.total_pages);
      } else {
        setLeaderboardData([]); // Clear data on failure
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboardData([]);
    }
    setLoading(false);
  };

  // Initial fetch when the component mounts
  useEffect(() => {
    fetchLeaderboard(1);
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      fetchLeaderboard(newPage);
    }
  };

  // --- Helper Functions for UI ---
  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-secondary" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-500" />;
    if (rank === 3) return <Award className="w-6 h-6 text-primary" />;
    return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">#{rank}</span>;
  };
  
  const getRankBadge = (rank) => {
    if (rank === 1) return 'bg-gradient-to-r from-secondary to-pink-500 text-white';
    if (rank === 2) return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
    if (rank === 3) return 'bg-gradient-to-r from-primary to-purple-700 text-white';
    return 'bg-gray-200 text-text';
  };

  const topThree = leaderboardData.slice(0, 3);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Hall of Fame</h1>
          <p className="text-gray-600">See how you rank against other recruits</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <TrendingUp className="w-4 h-4" />
          <span>Global Rankings</span>
        </div>
      </div>

      {loading && leaderboardData.length === 0 ? (
        <LoadingSpinner />
      ) : leaderboardData.length === 0 ? (
        <div className="text-center py-20 bg-white/50 border border-gray-200/60 rounded-xl mt-6">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Leaderboard is Empty</h3>
          <p className="text-gray-500">Be the first one to score points!</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
              {/* 2nd Place */}
              {topThree.length > 1 && (
                <div className="flex flex-col items-center order-1 mt-4">
                  <div className="bg-white/60 backdrop-blur-md border border-gray-300/80 rounded-2xl p-6 w-full text-center">
                    <div className="relative mb-4 w-20 h-20 mx-auto">
                       <PlaceholderAvatar name={topThree[1].student_name} rank={2} />
                    </div>
                    <h3 className="text-lg font-semibold text-text mb-1 truncate">{topThree[1].student_name}</h3>
                    <div className="flex items-center justify-center gap-1 text-gray-500">
                      <Star className="w-4 h-4" />
                      <span className="font-bold">{topThree[1].total_points.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full h-16 bg-gradient-to-t from-gray-300 to-gray-200 rounded-b-lg -mt-2"></div>
                </div>
              )}
              {/* 1st Place */}
              {topThree.length > 0 && (
                <div className="flex flex-col items-center order-2">
                  <div className="bg-gradient-to-br from-secondary/20 to-pink-500/20 backdrop-blur-md border border-secondary/50 rounded-2xl p-6 w-full text-center">
                    <div className="relative mb-4 w-24 h-24 mx-auto">
                       <PlaceholderAvatar name={topThree[0].student_name} rank={1} />
                    </div>
                    <h3 className="text-xl font-bold text-text mb-1 truncate">{topThree[0].student_name}</h3>
                    <div className="flex items-center justify-center gap-1 text-secondary">
                      <Star className="w-5 h-5" />
                      <span className="font-bold text-lg">{topThree[0].total_points.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="w-full h-20 bg-gradient-to-t from-secondary/80 to-secondary/60 rounded-b-lg -mt-2"></div>
                </div>
              )}
              {/* 3rd Place */}
              {topThree.length > 2 && (
                 <div className="flex flex-col items-center order-3 mt-4">
                    <div className="bg-white/60 backdrop-blur-md border border-gray-300/80 rounded-2xl p-6 w-full text-center">
                      <div className="relative mb-4 w-20 h-20 mx-auto">
                         <PlaceholderAvatar name={topThree[2].student_name} rank={3} />
                      </div>
                      <h3 className="text-lg font-semibold text-text mb-1 truncate">{topThree[2].student_name}</h3>
                      <div className="flex items-center justify-center gap-1 text-primary">
                        <Star className="w-4 h-4" />
                        <span className="font-bold">{topThree[2].total_points.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="w-full h-12 bg-gradient-to-t from-primary/80 to-primary/60 rounded-b-lg -mt-2"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Full Leaderboard List */}
          <div className="bg-white/60 backdrop-blur-md border border-gray-200/80 rounded-2xl overflow-hidden">
            <div className="divide-y divide-gray-200/80">
              {leaderboardData.map((user, index) => {
                 const rank = (page - 1) * 10 + index + 1; // Assuming 10 per page
                 return (
                   <div key={user.student_id} className={`p-4 md:p-6 hover:bg-primary/5 transition-all duration-200 ${user.student_id === userId ? 'bg-primary/10 border-l-4 border-primary' : ''}`}>
                     <div className="flex items-center gap-4">
                       <div className="flex-shrink-0">{getRankIcon(rank)}</div>
                       <div className="flex-shrink-0 w-12 h-12">
                         <PlaceholderAvatar name={user.student_name} rank={rank} />
                       </div>
                       <div className="flex-1 min-w-0">
                         <h3 className={`font-semibold truncate ${user.student_id === userId ? 'text-primary' : 'text-text'}`}>
                           {user.student_name}
                         </h3>
                         <p className="text-gray-500 text-sm">{user.completed_events} quests completed</p>
                       </div>
                       <div className="flex items-center gap-2 md:gap-6 text-right">
                         <div className="hidden md:block">
                           <div className="flex items-center gap-1 text-secondary">
                             <Star className="w-4 h-4" />
                             <span className="font-bold">{user.total_points.toLocaleString()}</span>
                           </div>
                         </div>
                         <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRankBadge(rank)}`}>
                           #{rank}
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
              <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <span className="text-gray-600 font-medium">Page {page} of {totalPages}</span>
              <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
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