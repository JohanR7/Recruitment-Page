// src/components/Challenges.jsx

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, Star, Clock, CheckCircle, Circle, Zap, Target, Upload, X, Shield, Play, AlertCircle 
} from 'lucide-react';

// --- Helper Components ---

// Loading Overlay for API calls
const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white border border-gray-200 rounded-xl p-8 flex items-center gap-4 shadow-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="text-text font-medium">Loading...</p>
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white border border-gray-200 rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-text flex items-center gap-2">
            <Target className="text-primary" />
            Submit Quest
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-text">×</button>
        </div>
        
        <div className="mb-4 p-3 bg-gray-100 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-primary mb-2">{event.title}</h4>
          <p className="text-gray-600 text-sm">{event.description}</p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span className="text-secondary flex items-center gap-1">
              <Star size={16} />
              {event.available_points} XP
            </span>
            {event.time_remaining && (
              <span className={`flex items-center gap-1 ${event.is_overdue ? 'text-accent' : 'text-primary'}`}>
                <Clock size={16} />
                {formatTimeRemaining(event.time_remaining)}
              </span>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Solution</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe your approach, solution, or answer..."
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text placeholder-gray-500 focus:border-primary focus:outline-none"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attachment (Optional)</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onSubmit(text, file)}
            disabled={!text.trim() && !file}
            className="flex-1 bg-primary hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Upload size={16} />
            Submit Quest
          </button>
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-text rounded-lg transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
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
  const API_BASE = 'https://aseam.acm.org/LMS/roadmaps/roadmap.php'; // <-- IMPORTANT: UPDATE THIS

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
        // Fetch progress for each roadmap
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
        // Map API 'events' to 'subChallenges' for consistency
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
    const formData = new FormData(); // Use FormData for file uploads
    formData.append('event_id', eventId);
    formData.append('roadmap_id', roadmapId);
    formData.append('user_id', userId);
    formData.append('submission_text', submissionText);
    if (file) formData.append('submission_file', file);

    try {
      const response = await fetch(`${API_BASE}/roadmap/event/submit`, {
        method: 'POST',
        body: formData // Send FormData directly, browser sets the Content-Type
      });
      const data = await response.json();
      if (data.success) {
        fetchChallenge(roadmapId); // Refresh challenge data
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
  }, [userId]); // Re-fetch if userId changes

  // --- Helper Functions ---
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

  // --- Render Logic ---

  if (loading && !selectedChallenge && challenges.length === 0) {
    return <LoadingOverlay />;
  }

  // --- Single Challenge View ---
  if (selectedChallenge) {
    return (
      <div className="p-6">
        {loading && <LoadingOverlay />}
        
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setSelectedChallenge(null)} className="flex items-center gap-2 text-gray-500 hover:text-text">
            <ArrowLeft className="w-5 h-5" /> Back to Challenges
          </button>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-gray-200/80 rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-text mb-2">{selectedChallenge.title}</h1>
          <p className="text-gray-600 mb-4">{selectedChallenge.description}</p>
          
          <div className="space-y-4 mt-8">
            <h3 className="text-xl font-semibold text-text">Quests</h3>
            {selectedChallenge.subChallenges.map((sub, index) => {
              const statusConfig = getStatusConfig(sub);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div key={sub.id} className={`p-4 rounded-xl border transition-all duration-300 ${statusConfig.border} ${statusConfig.bg}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 flex items-start gap-4">
                      <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${statusConfig.bg} border ${statusConfig.border}`}>
                        <StatusIcon className={statusConfig.text} />
                      </div>
                      <div>
                        <h4 className={`font-semibold text-text`}>{sub.title}</h4>
                        <p className="text-gray-500 text-sm mb-2">{sub.description}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className={`px-2 py-1 rounded-full font-medium ${statusConfig.bg} ${statusConfig.text}`}>{sub.status_text}</span>
                          <span className="flex items-center gap-1 text-secondary"><Star size={14} />{sub.available_points} XP</span>
                        </div>
                      </div>
                    </div>
                    {sub.can_submit && (
                       <button onClick={() => setSubmissions({ ...submissions, [sub.id]: true })} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:opacity-90 transition-opacity">
                         <Zap size={16} /> {sub.submission_status === 'rejected' ? 'Resubmit' : 'Submit'}
                       </button>
                    )}
                  </div>
                </div>
              );
            })}
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
      </div>
    );
  }

  // --- All Challenges View ---
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Challenges</h1>
          <p className="text-gray-600">Choose your next adventure and level up your skills</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {challenges.map((challenge) => {
          const progress = userProgress[challenge.id];
          const progressPercentage = getProgressPercentage(progress);

          return (
            <div
              key={challenge.id}
              onClick={() => fetchChallenge(challenge.id)}
              className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02]"
            >
              <h3 className="text-xl font-semibold text-text mb-2 group-hover:text-primary transition-colors duration-200">{challenge.title}</h3>
              <p className="text-gray-500 text-sm mb-4 line-clamp-2">{challenge.description}</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-secondary" />
                  <span>{progress?.total_points || '...'} pts</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{progress?.total_events || '...'} tasks</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Challenges;