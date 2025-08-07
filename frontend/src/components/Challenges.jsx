import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Star, Clock, CheckCircle, Circle, Zap, Target, Upload, X, Shield, Play, AlertCircle, ChevronLeft, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Helper Components ---

// Loading Overlay for API calls
const LoadingOverlay = () => (
  <div style={{ background: 'rgba(248,242,253,0.8)' }} className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
    <div style={{ background: '#f8f2fd', borderColor: '#e26f9b' }} className="border rounded-xl p-8 flex items-center gap-4 shadow-lg">
      <div style={{ borderColor: '#4e1a7f' }} className="animate-spin rounded-full h-8 w-8 border-b-2"></div>
      <p style={{ color: '#0e0515' }} className="font-medium">Loading...</p>
    </div>
  </div>
);

// Submission Modal
const SubmissionModal = ({ event, onClose, onSubmit }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);

  const formatTimeRemaining = (seconds) => {
    if (!seconds || seconds <= 0) return 'Overdue';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <div style={{ background: 'rgba(14,5,21,0.6)' }} className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div style={{ background: '#f8f2fd', borderColor: '#e26f9b' }} className="border rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ color: '#4e1a7f' }} className="text-xl font-bold flex items-center gap-2">
            <Target style={{ color: '#4e1a7f' }} />
            Submit Quest
          </h3>
          <button onClick={onClose} style={{ color: '#c3282a' }} className="hover:text-primary">×</button>
        </div>
        <div style={{ background: '#f8f2fd', borderColor: '#e26f9b' }} className="mb-4 p-3 rounded-lg border">
          <h4 style={{ color: '#4e1a7f' }} className="font-semibold mb-2">{event.title}</h4>
          <p style={{ color: '#0e0515' }} className="text-sm">{event.description}</p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span style={{ color: '#e26f9b' }} className="flex items-center gap-1">
              <Star size={16} />
              {event.available_points} XP
            </span>
            {event.time_remaining && (
              <span className="flex items-center gap-1" style={{ color: event.is_overdue ? '#c3282a' : '#4e1a7f' }}>
                <Clock size={16} />
                {formatTimeRemaining(event.time_remaining)}
              </span>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label style={{ color: '#0e0515' }} className="block text-sm font-medium mb-2">Your Solution</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe your approach, solution, or answer..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text placeholder-gray-500 focus:border-primary focus:outline-none"
              rows={4}
              style={{ color: '#0e0515', background: '#f8f2fd', borderColor: '#e26f9b' }}
            />
          </div>
          <div>
            <label style={{ color: '#0e0515' }} className="block text-sm font-medium mb-2">Attachment (Optional)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
              style={{ color: '#e26f9b', background: '#f8f2fd', borderColor: '#e26f9b' }}
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSubmit(text, file)}
            disabled={!text.trim() && !file}
            className="flex-1 bg-primary hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            style={{ background: '#4e1a7f', color: '#f8f2fd' }}
          >
            <Upload size={16} />
            Submit Quest
          </button>
          <button onClick={onClose} style={{ background: '#e26f9b', color: '#f8f2fd' }} className="px-4 py-2 rounded-lg transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Carousel Challenge Card
const ChallengeCard = ({ challenge, progress, onClick, isCenter = false, cardIndex, currentIndex, totalCards }) => {
  const progressPercentage = progress ? Math.round((progress.completed_events / progress.total_events) * 100) : 0;

  // Calculate position offset from center
  const offset = cardIndex - currentIndex;

  // Handle click - if center card, proceed to roadmap; if side card, rotate to center
  const handleCardClick = () => {
    if (isCenter) {
      // Center card clicked - proceed to challenge details
      onClick(challenge.id, true); // Pass true to indicate this should open the roadmap
    } else {
      // Side card clicked - rotate to center
      onClick(challenge.id, false); // Pass false to indicate this should just rotate to center
    }
  };

  return (
    <>
      {/* Description text - only show for center card */}
      <AnimatePresence mode="wait">
        {isCenter && (
          <motion.div
            key="description"
            className="absolute left-10 w-[35%]"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h3 style={{ color: '#4e1a7f' }} className="text-4xl font-bold mb-3">
              {challenge.title}
            </h3>
            <p style={{ color: '#0e0515' }} className="text-lg leading-relaxed mt-4">
              {challenge.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card */}
      <motion.div
        layout
        className={`relative cursor-pointer ${isCenter ? 'z-10' : 'z-0'
          }`}
        onClick={handleCardClick}
        animate={{
          scale: isCenter ? 1.1 : 0.8,
          opacity: isCenter ? 1 : 0.6,
        }}
        whileHover={{
          scale: isCenter ? 1.15 : 0.85,
          opacity: isCenter ? 1 : 0.8,
        }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
          layout: { duration: 0.5 }
        }}
      >
        <div
          style={{
            border: `2px solid #e26f9b`,
            borderRadius: '1.5rem',
            background: isCenter ? 'linear-gradient(135deg, #f8f2fd 90%, #e26f9b 10%)' : '#f8f2fd'
          }}
          className={`
            relative overflow-hidden transition-all duration-500
            ${isCenter
              ? 'shadow-2xl'
              : 'shadow-lg hover:shadow-xl'
            }
          `}>
          {/* Floating icon/symbol */}
          <div
            className={`absolute top-4 w-72 h-48 rounded-2xl mt-4 ml-2 transition-all duration-500 ${isCenter ? 'bg-white/20 backdrop-blur-md' : 'bg-white/10'
              }`}
          >
            <div
              style={{ background: isCenter ? '#e26f9b' : '#4e1a7f' }}
              className={`w-60 h-36 rounded-xl flex items-center justify-center ml-7 shadow-lg`}
            >
              <Star style={{ color: '#f8f2fd' }} className="w-5 h-5" />
            </div>
          </div>

          {/* Main content */}
          <div className="p-4 pt-64">
            <div className="mb-4">
              <h3 style={{ color: '#4e1a7f' }} className="text-lg font-bold mb-3 transition-colors duration-300">
                {challenge.title}
              </h3>
            </div>

            {/* Progress Section */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-3">
                <span style={{ color: '#0e0515' }} className="text-sm font-medium">
                  Progress
                </span>
                <span style={{ color: '#4e1a7f' }} className="text-sm font-bold">
                  {progressPercentage}%
                </span>
              </div>
              <div style={{ background: '#e26f9b' }} className="relative w-full h-2 rounded-full overflow-hidden">
                <motion.div
                  style={{ background: '#4e1a7f' }}
                  className="absolute left-0 top-0 h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: isCenter ? 0.2 : 0 }}
                />
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div style={{ background: '#e26f9b' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Star style={{ color: '#f8f2fd' }} className="w-4 h-4" />
                </div>
                <span style={{ color: '#0e0515' }} className="text-sm font-semibold">
                  {progress?.total_points || '...'} pts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div style={{ background: '#4e1a7f' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
                  <Clock style={{ color: '#f8f2fd' }} className="w-4 h-4" />
                </div>
                <span style={{ color: '#0e0515' }} className="text-sm font-semibold">
                  {progress?.total_events || '...'} tasks
                </span>
              </div>
            </div>

            {/* Call to action for center card */}
            <AnimatePresence>
              {isCenter && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mt-4 pt-4 border-t"
                  style={{ borderColor: '#e26f9b' }}
                >
                  <motion.button
                    style={{ background: '#4e1a7f', color: '#f8f2fd' }}
                    className="w-full py-3 px-4 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    animate={{
                      boxShadow: ["0 4px 6px rgba(78, 26, 127, 0.3)", "0 8px 15px rgba(78, 26, 127, 0.4)", "0 4px 6px rgba(78, 26, 127, 0.3)"]
                    }}
                    transition={{
                      boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    Start Journey
                    <ChevronRight style={{ color: '#e26f9b' }} className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reward badge */}
          <AnimatePresence>
            {isCenter && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotate: 0,
                  y: [0, -5, 0]
                }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{
                  duration: 0.5,
                  y: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
                style={{ background: '#e26f9b', color: '#f8f2fd' }}
                className="absolute top-56 left-4 px-3 py-1 rounded-full text-xs font-bold shadow-lg"
              >
                GET REWARD
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
};

// --- Main Challenges Component ---

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const API_BASE = 'https://aseam.acm.org/LMS/roadmaps/roadmap1.php';

  // Get user ID from localStorage or set a default one for testing
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || 'AM.SC.U4AIE23015';
    setUserId(storedUserId);
  }, []);

  // Fetch all challenges (roadmaps)
  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/roadmaps`);
      const data = await response.json();
      if (data.success) {
        setChallenges(data.roadmaps);
        data.roadmaps.forEach(roadmap => fetchProgress(roadmap.id));
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
    setLoading(false);
  };

  // Fetch a single challenge with its sub-challenges (events)
  const fetchChallenge = async (challengeId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/roadmap?roadmap_id=${challengeId}&user_id=${userId}`);
      const data = await response.json();
      if (data.success) {
        data.roadmap.subChallenges = data.roadmap.events;
        setSelectedChallenge(data.roadmap);
      }
    } catch (error) {
      console.error('Error fetching challenge:', error);
    }
    setLoading(false);
  };

  // Fetch user progress for a specific challenge
  const fetchProgress = async (challengeId) => {
    if (!userId) return;
    try {
      const response = await fetch(`${API_BASE}/roadmap/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roadmap_id: challengeId, user_id: userId })
      });
      const data = await response.json();
      if (data.success) {
        setUserProgress(prev => ({ ...prev, [challengeId]: data.progress }));
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  // Submit a sub-challenge (event)
  const submitEvent = async (eventId, roadmapId, submissionText, file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('event_id', eventId);
    formData.append('roadmap_id', roadmapId);
    formData.append('user_id', userId);
    formData.append('submission_text', submissionText);
    if (file) formData.append('submission_file', file);

    try {
      const response = await fetch(`${API_BASE}/roadmap/event/submit`, {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        fetchChallenge(roadmapId);
        alert('Submission successful!');
      } else {
        alert('Submission failed: ' + data.error);
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Submission failed due to a network error.');
    }
    setLoading(false);
  };

  // Load initial data on component mount
  useEffect(() => {
    fetchChallenges();
  }, [userId]);

  // Carousel navigation
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % challenges.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + challenges.length) % challenges.length);
  };

  // Handle card click - either rotate to center or open roadmap
  const handleCardClick = (challengeId, shouldOpenRoadmap) => {
    if (shouldOpenRoadmap) {
      // Center card clicked - open the roadmap
      fetchChallenge(challengeId);
    } else {
      // Side card clicked - rotate it to center
      const challengeIndex = challenges.findIndex(c => c.id === challengeId);
      if (challengeIndex !== -1) {
        setCurrentIndex(challengeIndex);
      }
    }
  };

  // Helper Functions
  const getProgressPercentage = (progress) => {
    if (!progress || !progress.total_events) return 0;
    return Math.round((progress.completed_events / progress.total_events) * 100);
  };

  const getStatusConfig = (event) => {
    const configs = {
      green: { bg: 'bg-green-500/10', text: 'text-green-600', icon: CheckCircle, border: 'border-green-500/20' },
      yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-600', icon: Clock, border: 'border-yellow-500/20' },
      red: { bg: 'bg-accent/10', text: 'text-accent', icon: X, border: 'border-accent/20' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', icon: Play, border: 'border-blue-500/20' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-600', icon: AlertCircle, border: 'border-orange-500/20' },
      gray: { bg: 'bg-gray-200', text: 'text-gray-500', icon: Shield, border: 'border-gray-300' }
    };
    return configs[event.status_color] || configs.gray;
  };

  if (loading && !selectedChallenge && challenges.length === 0) {
    return <LoadingOverlay />;
  }

  // --- Single Challenge View (Timeline Roadmap) ---
  if (selectedChallenge) {
    const progress = userProgress[selectedChallenge.id];
    const completedTasks = progress?.completed_events || 0;
    const totalTasks = progress?.total_points || selectedChallenge.subChallenges?.length || 0;

    return (
      <div style={{ background: '#f8f2fd', color: '#0e0515' }} className="min-h-screen relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>

          {/* Floating circles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animation: 'float 6s ease-in-out infinite'
              }}
            />
          ))}
        </div>

        <div className="relative z-10 p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setSelectedChallenge(null)}
              style={{ color: '#4e1a7f', borderColor: '#4e1a7f', background: '#f8f2fd' }}
              className="flex items-center gap-2 transition-colors border px-4 py-2 rounded-lg"
            >
              <ArrowLeft style={{ color: '#4e1a7f' }} className="w-5 h-5" /> Back to Challenges
            </button>
          </div>

          {/* Title and Progress */}
          <div className="text-center mb-12">
            <h1 style={{ color: '#4e1a7f' }} className="text-4xl md:text-5xl font-bold mb-4">
              {selectedChallenge.title}
            </h1>
            <p style={{ color: '#0e0515' }} className="text-lg max-w-3xl mx-auto mb-8">
              {selectedChallenge.description}
            </p>

            {/* Countdown/Progress Display */}
            <div className="text-center mb-8">
              <p style={{ color: '#4e1a7f' }} className="text-lg mb-4 font-semibold">Challenge Progress:</p>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <div style={{ color: '#4e1a7f' }} className="text-3xl font-bold">{completedTasks}</div>
                  <div style={{ color: '#e26f9b' }} className="text-sm font-semibold">COMPLETED</div>
                </div>
                <div style={{ color: '#4e1a7f' }} className="text-2xl font-bold">:</div>
                <div className="text-center">
                  <div style={{ color: '#4e1a7f' }} className="text-3xl font-bold">{totalTasks - completedTasks}</div>
                  <div style={{ color: '#e26f9b' }} className="text-sm font-semibold">REMAINING</div>
                </div>
                <div style={{ color: '#4e1a7f' }} className="text-2xl font-bold">:</div>
                <div className="text-center">
                  <div style={{ color: '#4e1a7f' }} className="text-3xl font-bold">{totalTasks}</div>
                  <div style={{ color: '#e26f9b' }} className="text-sm font-semibold">TOTAL</div>
                </div>
                <div style={{ color: '#4e1a7f' }} className="text-2xl font-bold">:</div>
                <div className="text-center">
                  <div style={{ color: '#c3282a' }} className="text-3xl font-bold">{progress?.total_points || 0}</div>
                  <div style={{ color: '#c3282a' }} className="text-sm font-semibold">XP</div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="max-w-6xl mx-auto relative">
            {/* Central Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 opacity-60"
              style={{ height: `${selectedChallenge.subChallenges.length * 300 + 100}px` }}>
            </div>

            {/* Timeline Items */}
            <div className="space-y-16">
              {selectedChallenge.subChallenges.map((quest, index) => {
                const statusConfig = getStatusConfig(quest);
                const isLeft = index % 2 === 0;
                const StatusIcon = statusConfig.icon;

                return (
                  <div key={quest.id} className="relative">
                    {/* Timeline Dot */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
                      <motion.div className={`w-12 h-12 rounded-full border-4 border-white flex items-center justify-center shadow-lg ${quest.status_color === 'green' ? 'bg-green-500' :
                          quest.status_color === 'yellow' ? 'bg-yellow-500' :
                            quest.status_color === 'red' ? 'bg-red-500' :
                              quest.status_color === 'blue' ? 'bg-blue-500' :
                                'bg-gray-400'
                        }`}
                        initial={{ opacity: 0, y:20, scale: 0.5}} whileInView={{opacity:1, y:0, scale:1}} transition={{ duration: 1, ease: 'easeInOut' }} viewport={{ amount: 0.7 }}>
                        <StatusIcon className="w-6 h-6 text-white" />
                      </motion.div>
                    </div>

                    {/* Timeline Date */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-16 z-10">
                      <motion.div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1"
                        initial={{ opacity: 0, y:-40, scale: 0.5}} whileInView={{opacity:1, y:0, scale:1}} transition={{ duration: 2, ease: 'easeInOut' }} viewport={{ amount: 0.7 }}>
                        <span
                          className="text-sm font-medium"
                          style={{ color: '#e26f9b' }}
                        >
                          Quest {index + 1}
                        </span>
                      </motion.div>
                    </div>

                    {/* Content Card */}
                    <div className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`}>
                      <div className={`w-80 ${isLeft ? 'mr-8' : 'ml-8'} mt-8`}>
                        {/* Current Stage Highlight */}
                        {quest.status_color === 'yellow' && (
                          <div className="mb-4">
                            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md border border-pink-500/30 rounded-xl p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-pink-500 rounded-md flex items-center justify-center">
                                  <Play className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-pink-300 font-semibold text-sm">Current Stage</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <motion.div
                          style={{
                            border: '2px solid #e26f9b',
                            borderRadius: '1rem',
                            background: '#f8f2fd'
                          }}
                          className="bg-white/90 backdrop-blur-md p-6 shadow-xl border border-white/20"
                          initial={isLeft ? ({ opacity: 0, x: 300 }):({opacity:0, x:-300})} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1.5, ease: 'easeInOut' }}
                          viewport={{amount: 0.7 }}
                          >
                          {/* Duration Badge */}
                          {quest.time_remaining && (
                            <div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">
                              {quest.time_remaining > 86400 ? `${Math.ceil(quest.time_remaining / 86400)} Days` :
                                quest.time_remaining > 3600 ? `${Math.ceil(quest.time_remaining / 3600)} Hours` :
                                  `${Math.ceil(quest.time_remaining / 60)} Minutes`}
                            </div>
                          )}

                          <h3 className="text-xl font-bold text-gray-800 mb-3">{quest.title}</h3>
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{quest.description}</p>

                          {/* Status and Points */}
                          <div className="flex items-center justify-between mb-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                              {quest.status_text}
                            </span>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-semibold">{quest.available_points} XP</span>
                            </div>
                          </div>

                          {/* Action Button */}
                          {quest.can_submit && (
                            <button
                              onClick={() => setSubmissions({ ...submissions, [quest.id]: true })}
                              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                              <Zap size={16} />
                              {quest.submission_status === 'rejected' ? 'Resubmit Quest' : 'Start Quest'}
                            </button>
                          )}

                          <div className="mt-3 text-right">
                            <button className="text-pink-500 hover:text-pink-600 text-sm font-medium transition-colors">
                              LEARN MORE
                            </button>
                          </div>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Render Submission Modals */}
        {Object.entries(submissions).map(([eventId, isOpen]) => {
          if (!isOpen) return null;
          const event = selectedChallenge.subChallenges.find(e => e.id == eventId);
          if (!event) return null;
          return (
            <SubmissionModal
              key={eventId}
              event={event}
              onClose={() => setSubmissions({ ...submissions, [eventId]: false })}
              onSubmit={(text, file) => {
                submitEvent(eventId, selectedChallenge.id, text, file);
                setSubmissions({ ...submissions, [eventId]: false });
              }}
            />
          );
        })}

        <style jsx>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </div>
    );
  }

  // --- Carousel Challenges View ---
  return (
    <div style={{ background: '#f8f2fd', color: '#0e0515' }} className="min-h-screen relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 style={{ color: '#4e1a7f' }} className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Challenge
          </h1>
          <p style={{ color: '#0e0515' }} className="text-lg max-w-2xl mx-auto">
            Embark on epic quests and level up your skills. Each challenge offers unique rewards and experiences.
          </p>
        </div>

        {/* Carousel */}
        {challenges.length > 0 && (
          <div className="relative max-w-8xl mx-auto mr-36">
            {/* Navigation Buttons */}
            <motion.button
              onClick={prevSlide}
              style={{ background: '#4e1a7f', color: '#f8f2fd', borderColor: '#4e1a7f' }}
              className="fixed right-[32%] bottom-16 z-20 w-12 h-12 border rounded-full flex items-center justify-center hover:opacity-90 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronLeft style={{ color: '#f8f2fd' }} className="w-6 h-6" />
            </motion.button>
            <motion.button
              onClick={nextSlide}
              style={{ background: '#4e1a7f', color: '#f8f2fd', borderColor: '#4e1a7f' }}
              className="fixed right-[20%] bottom-16 z-20 w-12 h-12 border rounded-full flex items-center justify-center hover:opacity-90 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ChevronRight style={{ color: '#f8f2fd' }} className="w-6 h-6" />
            </motion.button>

            {/* Carousel Container */}
            <div className="flex items-center justify-center gap-2 px-20 py-24 max-w-xl justify-self-end">
              {[-1, 0, 1].map((offset) => {
                const index = (currentIndex + offset + challenges.length) % challenges.length;
                const challenge = challenges[index];
                const progress = userProgress[challenge?.id];

                return challenge ? (
                  <div key={`${challenge.id}-${index}`} className="flex-shrink-0 w-80">
                    <ChallengeCard
                      challenge={challenge}
                      progress={progress}
                      onClick={handleCardClick}
                      isCenter={offset === 0}
                      cardIndex={index}
                      currentIndex={currentIndex}
                      totalCards={challenges.length}
                    />
                  </div>
                ) : null;
              })}
            </div>

            {/* Dots Indicator */}
            <div className="absolute top-0 z-10 flex justify-center justify-around w-full ml-20 md-4">
              {challenges.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  style={{
                    background: index === currentIndex ? '#e26f9b' : '#4e1a7f',
                  }}
                  className="w-3 h-3 rounded-full transition-all duration-300"
                  animate={{
                    scale: index === currentIndex ? 1.4 : 1,
                    boxShadow: index === currentIndex
                      ? '0 0 8px #e26f9b'
                      : '0 0 0px transparent'
                  }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        )}

        {loading && <LoadingOverlay />}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default Challenges;