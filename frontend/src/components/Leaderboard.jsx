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

// --- Mock Data ---
const mockLeaderboardData = [
  {
    student_id: 'AM.SC.U4AIE23001',
    student_name: 'Alex Johnson',
    total_points: 15420,
    completed_events: 28
  },
  {
    student_id: 'AM.SC.U4AIE23002',
    student_name: 'Sarah Williams',
    total_points: 14850,
    completed_events: 25
  },
  {
    student_id: 'AM.SC.U4AIE23003',
    student_name: 'Michael Chen',
    total_points: 14200,
    completed_events: 24
  },
  {
    student_id: 'AM.SC.U4AIE23004',
    student_name: 'Emma Davis',
    total_points: 13750,
    completed_events: 22
  },
  {
    student_id: 'AM.SC.U4AIE23015',
    student_name: 'You (Current User)',
    total_points: 13500,
    completed_events: 21
  },
  {
    student_id: 'AM.SC.U4AIE23006',
    student_name: 'James Wilson',
    total_points: 13200,
    completed_events: 20
  },
  {
    student_id: 'AM.SC.U4AIE23007',
    student_name: 'Olivia Brown',
    total_points: 12900,
    completed_events: 19
  },
  {
    student_id: 'AM.SC.U4AIE23008',
    student_name: 'David Martinez',
    total_points: 12650,
    completed_events: 18
  },
  {
    student_id: 'AM.SC.U4AIE23009',
    student_name: 'Sophia Garcia',
    total_points: 12400,
    completed_events: 17
  },
  {
    student_id: 'AM.SC.U4AIE23010',
    student_name: 'Ryan Anderson',
    total_points: 12100,
    completed_events: 16
  },
  {
    student_id: 'AM.SC.U4AIE23011',
    student_name: 'Ava Thompson',
    total_points: 11800,
    completed_events: 15
  },
  {
    student_id: 'AM.SC.U4AIE23012',
    student_name: 'Noah Rodriguez',
    total_points: 11500,
    completed_events: 14
  },
  {
    student_id: 'AM.SC.U4AIE23013',
    student_name: 'Isabella Lewis',
    total_points: 11200,
    completed_events: 13
  },
  {
    student_id: 'AM.SC.U4AIE23014',
    student_name: 'Liam Walker',
    total_points: 10950,
    completed_events: 12
  },
  {
    student_id: 'AM.SC.U4AIE23016',
    student_name: 'Mia Hall',
    total_points: 10700,
    completed_events: 11
  },
  {
    student_id: 'AM.SC.U4AIE23017',
    student_name: 'Ethan Allen',
    total_points: 10450,
    completed_events: 10
  },
  {
    student_id: 'AM.SC.U4AIE23018',
    student_name: 'Charlotte Young',
    total_points: 10200,
    completed_events: 9
  },
  {
    student_id: 'AM.SC.U4AIE23019',
    student_name: 'Benjamin King',
    total_points: 9950,
    completed_events: 8
  },
  {
    student_id: 'AM.SC.U4AIE23020',
    student_name: 'Amelia Wright',
    total_points: 9700,
    completed_events: 7
  },
  {
    student_id: 'AM.SC.U4AIE23021',
    student_name: 'Lucas Lopez',
    total_points: 9450,
    completed_events: 6
  },
  {
    student_id: 'AM.SC.U4AIE23022',
    student_name: 'Harper Hill',
    total_points: 9200,
    completed_events: 5
  },
  {
    student_id: 'AM.SC.U4AIE23023',
    student_name: 'Mason Scott',
    total_points: 8950,
    completed_events: 4
  }
];

// --- Main Leaderboard Component ---

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState('');
  const itemsPerPage = 10;
  // const API_BASE = 'https://aseam.acm.org/LMS/roadmaps/roadmap.php'; // <-- COMMENTED OUT FOR TESTING

  // Get user ID from localStorage or set default
  useEffect(() => {
    // const storedUserId = localStorage.getItem('userId') || 'AM.SC.U4AIE23015'; // <-- COMMENTED OUT FOR TESTING
    const storedUserId = 'AM.SC.U4AIE23015'; // <-- MOCK USER ID
    setUserId(storedUserId);
  }, []);

  // --- COMMENTED OUT API Logic ---
  /*
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
  */

  // --- Mock Data Logic ---
  const fetchLeaderboard = async (currentPage = 1) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      // Mock pagination logic
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = mockLeaderboardData.slice(startIndex, endIndex);
      
      setLeaderboardData(paginatedData);
      setPage(currentPage);
      setTotalPages(Math.ceil(mockLeaderboardData.length / itemsPerPage));
    } catch (error) {
      console.error('Error with mock data:', error);
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

  const topThree = mockLeaderboardData.slice(0, 3);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Hall of Fame</h1>
          <p className="text-gray-600">See how you rank against other recruits</p>
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
                <div className="flex flex-col items-center order-1 mt-4 group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  <div className="relative bg-white/70 backdrop-blur-lg border border-pink-300/60 rounded-2xl p-6 w-full text-center 
                                  hover:shadow-2xl hover:shadow-pink-500/20 
                                  hover:bg-gradient-to-br hover:from-pink-50 hover:to-pink-100/80 hover:border-pink-400/80
                                  before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-pink-400/20 before:to-pink-500/20 
                                  before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500">
                    <div className="relative z-10">
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-700 rounded-full 
                                      flex items-center justify-center shadow-lg transform transition-all duration-300 
                                      group-hover:scale-110 group-hover:rotate-12">
                        <Medal className="w-4 h-4 text-white" />
                      </div>
                      <div className="relative mb-4 w-20 h-20 mx-auto transform transition-all duration-300 group-hover:scale-110">
                        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/30 to-pink-500/30 rounded-full blur-lg 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <PlaceholderAvatar name={topThree[1].student_name} rank={2} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate transition-colors duration-300 group-hover:text-pink-700">
                        {topThree[1].student_name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 text-pink-600 transition-all duration-300 group-hover:text-pink-700">
                        <Star className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                        <span className="font-bold">{topThree[1].total_points.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-full h-16 bg-gradient-to-t from-pink-500/80 to-pink-400/60 rounded-b-lg -mt-2 
                                  transform transition-all duration-500 group-hover:from-pink-600/90 group-hover:to-pink-500/70 
                                  group-hover:shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                    transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                                    transition-transform duration-1000 delay-200"></div>
                  </div>
                </div>
              )}
              {/* 1st Place */}
              {topThree.length > 0 && (
                <div className="flex flex-col items-center order-2 group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:-translate-y-3">
                  <div className="relative bg-gradient-to-br from-purple-50/80 to-purple-100/80 backdrop-blur-lg 
                                  border border-purple-300/60 rounded-2xl p-6 w-full text-center 
                                  hover:shadow-2xl hover:shadow-purple-500/30 
                                  hover:bg-gradient-to-br hover:from-purple-100/90 hover:to-purple-200/90 hover:border-purple-400/80
                                  before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-purple-400/20 before:to-purple-500/20 
                                  before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500
                                  after:absolute after:inset-0 after:rounded-2xl after:shadow-inner after:shadow-purple-300/50 
                                  after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-500">
                    <div className="relative z-10">
                      <div className="absolute -top-4 -right-4 w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full 
                                      flex items-center justify-center shadow-xl transform transition-all duration-300 
                                      group-hover:scale-125 group-hover:rotate-45 group-hover:shadow-purple-500/50">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
                      <div className="relative mb-4 w-24 h-24 mx-auto transform transition-all duration-300 group-hover:scale-125">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/40 to-purple-600/40 rounded-full blur-xl 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                        <PlaceholderAvatar name={topThree[0].student_name} rank={1} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1 truncate transition-colors duration-300 group-hover:text-purple-800">
                        {topThree[0].student_name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 text-purple-600 transition-all duration-300 group-hover:text-purple-700">
                        <Star className="w-5 h-5 transition-transform duration-300 group-hover:rotate-180 group-hover:scale-125" />
                        <span className="font-bold text-lg">{topThree[0].total_points.toLocaleString()}</span>
                      </div>
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400/0 via-purple-400/10 to-purple-400/0 
                                      opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    </div>
                  </div>
                  <div className="w-full h-20 bg-gradient-to-t from-purple-700/80 to-purple-600/60 rounded-b-lg -mt-2 
                                  transform transition-all duration-500 group-hover:from-purple-800/90 group-hover:to-purple-700/70 
                                  group-hover:shadow-xl group-hover:shadow-purple-500/40 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                                    transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                                    transition-transform duration-1000 delay-300"></div>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-purple-300 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-400"></div>
                  </div>
                </div>
              )}
                            {/* 3rd Place */}
              {topThree.length > 2 && (
                <div className="flex flex-col items-center order-3 mt-4 group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2">
                  {/* Main Card */}
                  <div className="relative bg-white/70 backdrop-blur-lg border border-red-300/60 rounded-2xl p-6 w-full text-center 
                                  group-hover:shadow-2xl group-hover:shadow-red-500/20 
                                  group-hover:bg-gradient-to-br group-hover:from-red-50/80 group-hover:to-red-100/80 group-hover:border-red-400/80
                                  transition-all duration-500
                                  before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-red-400/20 before:to-red-500/20 
                                  before:opacity-0 group-hover:before:opacity-100 before:transition-opacity before:duration-500">
                    <div className="relative z-10">
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-full 
                                      flex items-center justify-center shadow-lg transform transition-all duration-300 
                                      group-hover:scale-110 group-hover:rotate-12">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <div className="relative mb-4 w-20 h-20 mx-auto transform transition-all duration-300 group-hover:scale-110">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-red-600/30 rounded-full blur-lg 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <PlaceholderAvatar name={topThree[2].student_name} rank={3} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate transition-colors duration-300 group-hover:text-red-700">
                        {topThree[2].student_name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 text-red-600 transition-all duration-300 group-hover:text-red-700">
                        <Star className="w-4 h-4 transition-transform duration-300 group-hover:rotate-12" />
                        <span className="font-bold">{topThree[2].total_points.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  {/* Card Base */}
                  <div className="w-full h-16 bg-gradient-to-t from-red-600/80 to-red-500/60 rounded-b-lg -mt-2 
                                  transform transition-all duration-500 group-hover:from-red-700/90 group-hover:to-red-600/70 
                                  group-hover:shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                                    transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                                    transition-transform duration-1000 delay-200"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Full Leaderboard List */}
          <div className="bg-white/60 backdrop-blur-md border border-gray-200/80 rounded-2xl overflow-hidden">
            <div className="divide-y divide-gray-200/80">
              {leaderboardData.map((user, index) => {
                 const rank = (page - 1) * itemsPerPage + index + 1;
                 return (
                   <div key={user.student_id} className={`p-4 md:p-6 hover:bg-purple-50/50 transition-all duration-200 ${user.student_id === userId ? 'bg-purple-100/70 border-l-4 border-purple-700' : ''}`}>
                     <div className="flex items-center gap-4">
                       <div className="flex-shrink-0">{getRankIcon(rank)}</div>
                       <div className="flex-shrink-0 w-12 h-12">
                         <PlaceholderAvatar name={user.student_name} rank={rank} />
                       </div>
                       <div className="flex-1 min-w-0">
                         <h3 className={`font-semibold truncate ${user.student_id === userId ? 'text-purple-700' : 'text-gray-800'}`}>
                           {user.student_name}
                         </h3>
                         <p className="text-gray-500 text-sm">{user.completed_events} quests completed</p>
                       </div>
                       <div className="flex items-center gap-2 md:gap-6 text-right">
                         <div className="hidden md:block">
                           <div className="flex items-center gap-1 text-pink-600">
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
              <button 
                onClick={() => handlePageChange(page - 1)} 
                disabled={page === 1} 
                className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
              >
                Previous
              </button>
              <span className="text-gray-600 font-medium px-4">Page {page} of {totalPages}</span>
              <button 
                onClick={() => handlePageChange(page + 1)} 
                disabled={page === totalPages} 
                className="px-6 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
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