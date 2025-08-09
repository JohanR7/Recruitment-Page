import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowLeft, Star, Clock, CheckCircle, Zap, Target, Upload, X, Shield, Play, AlertCircle, ChevronLeft, ChevronRight, LifeBuoy,
  Download,Eye
} from 'lucide-react';
import { motion, AnimatePresence,useInView, spring } from 'framer-motion';

// --- Helper Components (SubmissionModal, LoadingOverlay) are unchanged ---

const LoadingOverlay = () => (
    <div style={{ background: 'rgba(248,242,253,0.8)' }} className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <div style={{ background: '#f8f2fd', borderColor: '#e26f9b' }} className="border rounded-xl p-8 flex items-center gap-4 shadow-lg">
        <div style={{ borderColor: '#4e1a7f' }} className="animate-spin rounded-full h-8 w-8 border-b-2"></div>
        <p style={{ color: '#0e0515' }} className="font-medium">Loading...</p>
      </div>
    </div>
);

const SubmissionModal = ({ event, onClose, onSubmit }) => {
    // ... (This component remains exactly the same as in your original code)
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const formatTimeRemaining = (seconds) => {
        if (!seconds || seconds <= 0) return 'Overdue';
        const hours = Math.floor(seconds / 3600); const minutes = Math.floor((seconds % 3600) / 60);
        if (hours > 24) { const days = Math.floor(hours / 24); return `${days}d ${hours % 24}h`; }
        return `${hours}h ${minutes}m`;
    };
    return (
        <div style={{ background: 'rgba(14,5,21,0.6)' }} className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div style={{ background: '#f8f2fd', borderColor: '#e26f9b' }} className="border rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{ color: '#4e1a7f' }} className="text-xl font-bold flex items-center gap-2"><Target style={{ color: '#4e1a7f' }} />Submit Quest</h3>
              <button onClick={onClose} style={{ color: '#c3282a' }} className="text-3xl font-bold hover:text-red-700">×</button>
            </div>
            <div style={{ background: '#f8f2fd', borderColor: '#e26f9b' }} className="mb-4 p-3 rounded-lg border">
              <h4 style={{ color: '#4e1a7f' }} className="font-semibold mb-2">{event.title}</h4>
              <p style={{ color: '#0e0515' }} className="text-sm">{event.description}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span style={{ color: '#e26f9b' }} className="flex items-center gap-1"><Star size={16} />{event.available_points} XP</span>
                {event.time_remaining && (<span className="flex items-center gap-1" style={{ color: event.is_overdue ? '#c3282a' : '#4e1a7f' }}><Clock size={16} />{formatTimeRemaining(event.time_remaining)}</span>)}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label style={{ color: '#0e0515' }} className="block text-sm font-medium mb-2">Your Solution</label>
                <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Describe your approach, solution, or answer..." className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-text placeholder-gray-500 focus:border-primary focus:outline-none" rows={4} style={{ color: '#0e0515', background: '#f8f2fd', borderColor: '#e26f9b' }}/>
              </div>
              <div>
                <label style={{ color: '#0e0515' }} className="block text-sm font-medium mb-2">Attachment (Optional)</label>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer" style={{ color: '#e26f9b', background: '#f8f2fd', borderColor: '#e26f9b' }}/>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => onSubmit(text, file)} disabled={!text.trim() && !file} className="flex-1 bg-primary hover:bg-opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2" style={{ background: '#4e1a7f', color: '#f8f2fd' }}><Upload size={16} />Submit Quest</button>
              <button onClick={onClose} style={{ background: '#e26f9b', color: '#f8f2fd' }} className="px-4 py-2 rounded-lg transition-colors">Cancel</button>
            </div>
          </div>
        </div>
    );
};


// --- REFACTORED Challenge Card ---
// It is now a simpler component responsible only for rendering the card's appearance.
// The animation logic is handled by its parent.
const ChallengeCard = ({ challenge, progress, onCardClick, isCenter }) => {
  const progressPercentage = progress ? Math.round((progress.completed_events / progress.total_events) * 100) : 0;
  
  const handleCardClick = () => {
    onCardClick(challenge.id, isCenter);
  };
  
  return (
    <div
      onClick={handleCardClick}
      style={{
        border: `2px solid #e26f9b`,
        borderRadius: '1.5rem',
        background: isCenter ? 'linear-gradient(135deg, #f8f2fd 90%, #e26f9b 10%)' : '#f8f2fd',
        width: '350px',
        height: '480px',
        userSelect: 'none'
      }}
      className={`relative overflow-hidden cursor-pointer flex flex-col justify-between p-6 transition-all duration-500 ${isCenter ? 'shadow-2xl' : 'shadow-lg'}`}
    >
      <div>
        <div style={{ background: isCenter ? '#e26f9b' : '#4e1a7f' }} className={`w-16 h-16 rounded-xl flex items-center justify-center shadow-lg mb-4 transition-colors`}>
          <Star style={{ color: '#f8f2fd' }} className="w-8 h-8" />
        </div>
        <h3 style={{ color: '#4e1a7f' }} className="text-2xl font-bold mb-2 transition-colors duration-300">
          {challenge.title}
        </h3>
      </div>

      <div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span style={{ color: '#0e0515' }} className="text-sm font-medium">Progress</span>
            <span style={{ color: '#4e1a7f' }} className="text-sm font-bold">{progressPercentage}%</span>
          </div>
          <div style={{ background: '#e26f9b' }} className="relative w-full h-2 rounded-full overflow-hidden">
            <motion.div
              style={{ background: '#4e1a7f' }}
              className="absolute left-0 top-0 h-full rounded-full"
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm mb-6">
          <div className="flex items-center gap-2">
            <div style={{ background: '#e26f9b' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Star style={{ color: '#f8f2fd' }} className="w-4 h-4" />
            </div>
            <span style={{ color: '#0e0515' }} className="font-semibold">{progress?.total_points || '...'} pts</span>
          </div>
          <div className="flex items-center gap-2">
            <div style={{ background: '#4e1a7f' }} className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Clock style={{ color: '#f8f2fd' }} className="w-4 h-4" />
            </div>
            <span style={{ color: '#0e0515' }} className="font-semibold">{progress?.total_events || '...'} tasks</span>
          </div>
        </div>

        <AnimatePresence>
          {isCenter && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              style={{ background: '#4e1a7f', color: '#f8f2fd' }}
              className="w-full py-3 px-4 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
            >
              Start Journey
              <ChevronRight style={{ color: '#e26f9b' }} className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Section Tracker Component
const SectionTracker = ({ children, index, onVisibilityChange }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { threshold: 0.3, margin: "0px 0px -50% 0px" });
  
  useEffect(() => {
    onVisibilityChange(index, isInView);
  }, [isInView, index, onVisibilityChange]);
  
  return (
    <div ref={ref}>
      {children}
    </div>
  );
};


// --- Main Challenges Component with New Layout and Animations ---

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true); // Start with loading true
  const [userId, setUserId] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());
  const containerRef = useRef(null);
  // Configuration for rate limiting
  const CLICK_COOLDOWN = 800; // Milliseconds between allowed clicks
  const TRANSITION_DURATION = 600; // Duration of the card transition animatio

  const API_BASE = 'https://aseam.acm.org/LMS/roadmaps/roadmap1.php';
  const activeChallenge = challenges.length > 0 ? challenges[currentIndex] : null;

  // --- Animation Variants ---
  const textVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeInOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeInOut" } },
  };
  const cardTransition = {
  type: "spring",
  stiffness: 60,    
  damping: 25,      
  mass: 1.2,        
  
  scale: {
    type: "spring",
    stiffness: 50,  
    damping: 28,
    mass: 1.3
  },

  opacity: {
    type: "tween",
    duration: 0.6,  
    ease: "easeInOut"
  },
  
  layout: {
    type: "spring",
    stiffness: 45,  
    damping: 30,
    mass: 1.4
  }
  };
  

    // Handle visibility change for sections
const handleVisibilityChange = useCallback((index, isVisible) => {
    setVisibleSections(prev => {
      const newSet = new Set(prev);
      if (isVisible) {
        newSet.add(index);
      } else {
        newSet.delete(index);
      }
      // Only update if the set actually changed
      if (newSet.size !== prev.size || ![...newSet].every(val => prev.has(val))) {
        return newSet;
      }
      return prev;
    });
  }, []);

  // Calculate the progress line height based on the highest visible section
  const getProgressLineHeight = () => {
    if (visibleSections.size === 0) return 0;
    
    const maxVisibleIndex = Math.max(...Array.from(visibleSections));
    const totalSections = selectedChallenge?.subChallenges?.length || 0;
    
    // Calculate height: each section takes ~400px, plus some buffer
    const baseHeight = (maxVisibleIndex + 1) * 400+100;
    const maxHeight = totalSections * 400 + 100;
    
    return Math.min(baseHeight, maxHeight);
  };


  // --- API and Data Fetching (Unchanged) ---
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId') || 'AM.SC.U4AIE23015';
    setUserId(storedUserId);
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch(`${API_BASE}/roadmaps`);
      const data = await response.json();
      if (data.success) {
        setChallenges(data.roadmaps);
        // Fetch progress for all challenges after getting the list
        data.roadmaps.forEach(roadmap => fetchProgress(roadmap.id));
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
        setLoading(false); // Set loading to false after the fetch completes
    }
  };

  const fetchChallenge = async (challengeId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/roadmap?roadmap_id=${challengeId}&user_id=${userId}`);
      const data = await response.json();
      if (data.success) {
        data.roadmap.subChallenges = data.roadmap.events;
        setSelectedChallenge(data.roadmap);
        console.log('Fetched challenge:', data);
      }
    } catch (error) {
      console.error('Error fetching challenge:', error);
    }
    setLoading(false);
  };
  
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

  const submitEvent = async (eventId, roadmapId, submissionText, file) => {
    // ... (This function remains exactly the same)
    setLoading(true);
    const formData = new FormData();
    formData.append('event_id', eventId); formData.append('roadmap_id', roadmapId); formData.append('user_id', userId);
    formData.append('submission_text', submissionText);
    if (file) formData.append('submission_file', file);
    try {
      const response = await fetch(`${API_BASE}/roadmap/event/submit`, { method: 'POST', body: formData });
      const data = await response.json();
      console.log('Submission response:', data);
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

  useEffect(() => {
    if (userId) {
        fetchChallenges();
    }
  }, [userId]);


  // --- Navigation Handlers ---
  const nextSlide = () => {
  const currentTime = Date.now();
  
  if (currentTime - lastClickTime < CLICK_COOLDOWN || isTransitioning) {
    return;
  }
  
  setIsTransitioning(true);
  setLastClickTime(currentTime);
  setCurrentIndex((prev) => (prev + 1) % challenges.length);
  
  setTimeout(() => {
    setIsTransitioning(false);
  }, TRANSITION_DURATION);
};

const prevSlide = () => {
  const currentTime = Date.now();
  
  if (currentTime - lastClickTime < CLICK_COOLDOWN || isTransitioning) {
    return;
  }
  
  setIsTransitioning(true);
  setLastClickTime(currentTime);
  setCurrentIndex((prev) => (prev - 1 + challenges.length) % challenges.length);
  
  setTimeout(() => {
    setIsTransitioning(false);
  }, TRANSITION_DURATION);
};

  // Modified handleCardClick function with rate limiting
const handleCardClick = (challengeId, shouldOpenRoadmap) => {
  const currentTime = Date.now();
  
  // Check if we're still in cooldown period
  if (currentTime - lastClickTime < CLICK_COOLDOWN) {
    console.log('Click ignored - too fast');
    return;
  }

  // Check if a transition is already in progress
  if (isTransitioning) {
    console.log('Click ignored - transition in progress');
    return;
  }

  if (shouldOpenRoadmap) {
    // Center card clicked - open the roadmap (no rate limit needed for this action)
    fetchChallenge(challengeId);
  } else {
    // Side card clicked - rotate it to center with rate limiting
    const challengeIndex = challenges.findIndex(c => c.id === challengeId);
    if (challengeIndex !== -1 && challengeIndex !== currentIndex) {
      setIsTransitioning(true);
      setLastClickTime(currentTime);
      setCurrentIndex(challengeIndex);
      
      // Clear the transition lock after animation completes
      setTimeout(() => {
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    }
  }
};


  // --- Helper Functions for Timeline View ---
  const getStatusConfig = (event) => {
    
      // ... (This function remains exactly the same)
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
  
  if (loading && challenges.length === 0) {
    return <LoadingOverlay />;
  }

  // --- Single Challenge View (Timeline Roadmap) ---
  if (selectedChallenge) {
    // ... (This entire view remains exactly the same as in your original code)
    const progress = userProgress[selectedChallenge.id];
    const API_BASE2 = 'https://aseam.acm.org/LMS/roadmaps';
    const completedTasks = progress?.completed_events || 0;
    const totalTasks = progress?.total_events || selectedChallenge.subChallenges?.length || 0;
    const progressHeight = getProgressLineHeight();
    return (
      <div style={{ background: '#f8f2fd', color: '#0e0515' }} className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
          {[...Array(15)].map((_, i) => (<div key={i} className="absolute w-2 h-2 bg-white/20 rounded-full" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, animation: `float 6s ease-in-out ${Math.random() * 5}s infinite` }} />))}
        </div>
        <div className="relative z-10 p-8">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setSelectedChallenge(null)} style={{ color: '#4e1a7f', borderColor: '#4e1a7f', background: '#f8f2fd' }} className="flex items-center gap-2 transition-colors border px-4 py-2 rounded-lg"><ArrowLeft style={{ color: '#4e1a7f' }} className="w-5 h-5" /> Back to Challenges</button>
          </div>
          <div className="text-center mb-12">
            <div>
            <motion.h1 style={{ color: '#4e1a7f' }} className="text-4xl md:text-5xl font-bold mb-4" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 2.5, type:spring }} viewport={{ once: true }}>{selectedChallenge.title}</motion.h1>
            <motion.p style={{ color: '#0e0515' }} className="text-lg max-w-3xl mx-auto mb-8" initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 2.5,delay:1.2, type:spring }} viewport={{ once: true }}>{selectedChallenge.description}</motion.p>
            </div>
            <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 2.5, delay:0.4, type:spring}} viewport={{ once: true }}>
              <p style={{ color: '#4e1a7f' }} className="text-lg mb-4 font-semibold">Challenge Progress:</p>
              <motion.div className="flex items-center justify-center gap-8" initial={{ opacity: 0, y: -50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 2,delay:1.2, type:spring }} viewport={{ once: true }}>
                <div className="text-center"><div style={{ color: '#4e1a7f' }} className="text-3xl font-bold">{completedTasks}</div><div style={{ color: '#e26f9b' }} className="text-sm font-semibold">COMPLETED</div></div>
                <div style={{ color: '#4e1a7f' }} className="text-2xl font-bold">:</div>
                <div className="text-center"><div style={{ color: '#4e1a7f' }} className="text-3xl font-bold">{totalTasks - completedTasks}</div><div style={{ color: '#e26f9b' }} className="text-sm font-semibold">REMAINING</div></div>
                <div style={{ color: '#4e1a7f' }} className="text-2xl font-bold">:</div>
                <div className="text-center"><div style={{ color: '#4e1a7f' }} className="text-3xl font-bold">{totalTasks}</div><div style={{ color: '#e26f9b' }} className="text-sm font-semibold">TOTAL</div></div>
                <div style={{ color: '#4e1a7f' }} className="text-2xl font-bold">:</div>
                <div className="text-center"><div style={{ color: '#c3282a' }} className="text-3xl font-bold">{progress?.total_points || 0}</div><div style={{ color: '#c3282a' }} className="text-sm font-semibold">XP</div></div>
              </motion.div>
            </motion.div>
          </div>
          <div className="max-w-6xl mx-auto relative mt-8" ref={containerRef}>
            {/* Line animation */}
             <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 opacity-30" style={{ height: `${selectedChallenge.subChallenges.length * 400 + 100}px` }}></div>
             <motion.div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-blue-500 z-10" initial={{ height: 0 }} animate={{ height: progressHeight }} transition={{ duration: 1, ease: "easeInOut" }}></motion.div>
              <div className="space-y-8">
              {selectedChallenge.subChallenges.map((quest, index) => {
                const statusConfig = getStatusConfig(quest); const isLeft = index % 2 === 0; const StatusIcon = statusConfig.icon;
                // --- URL for the document ---
                const document = `${API_BASE2}/${quest.event_image}`;

                return (
                  // --- Quest Card ---
                  <SectionTracker key={quest.id} index={index} onVisibilityChange={handleVisibilityChange}>
                  <div key={quest.id} className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 translate-y-36 z-20"><div className={`w-12 h-12 rounded-full border-4 border-white flex items-center justify-center shadow-lg ${quest.status_color === 'green' ? 'bg-green-500' : quest.status_color === 'yellow' ? 'bg-yellow-500' : quest.status_color === 'red' ? 'bg-red-500' : quest.status_color === 'blue' ? 'bg-purple-800' : 'bg-gray-400' }`}><StatusIcon className="w-6 h-6 text-white" /></div></div>
                    <div className={`absolute top-36 translate-y-1/4 z-10 ${isLeft ? 'left-1/2 ml-8':'right-1/2 mr-8'}`}><motion.div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1`} initial={{ opacity:0, x:isLeft? -100 : 100 }} whileInView={{opacity: 1, x:0}} transition={{duration:1.5, type:spring}} viewport={{once:false, amount:0.5}}><span className="text-sm font-medium" style={{ color: '#e26f9b' }}>{quest.title}</span></motion.div></div>
                    <motion.div className={`flex ${isLeft ? 'justify-start' : 'justify-end'}`} initial={{ opacity: 0, y:100 }} whileInView={{opacity: 1, y: 0 }} transition={{ duration: 1.2}} viewport={{amount: 0.25}}>
                      <div className={`w-full md:w-5/12 ${isLeft ? 'mr-8' : 'ml-8'} mt-8`}>
                        {quest.status_color === 'yellow' && (<div className="mb-4"><div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md border border-pink-500/30 rounded-xl p-3"><div className="flex items-center gap-2 mb-2"><div className="w-6 h-6 bg-pink-500 rounded-md flex items-center justify-center"><Play className="w-3 h-3 text-white" /></div><span className="text-pink-300 font-semibold text-sm">Current Stage</span></div></div></div>)}
                        <div style={{ border: '2px solid #e26f9b', borderRadius: '1rem', background: '#f8f2fd' }} className={`bg-white/90 backdrop-blur-md p-6 shadow-xl border border-white/20 w-full flex ${isLeft ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className='w-28 h-52 overflow-hidden'><LifeBuoy className={`h-52 w-64 text-purple-800 ${isLeft? '-translate-x-[10%]': '-translate-x-[55%]'} `}/></div>
                          <div className="w-full">
                          {quest.time_remaining && (<div className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold mb-4">{quest.time_remaining > 86400 ? `${Math.ceil(quest.time_remaining / 86400)} Days` : quest.time_remaining > 3600 ? `${Math.ceil(quest.time_remaining / 3600)} Hours` : `${Math.ceil(quest.time_remaining / 60)} Minutes`}</div>)}
                          <h3 className="text-xl font-bold text-gray-800 mb-3">{quest.title}</h3><pre className="text-gray-600 text-sm mb-4 leading-relaxed"><code>{quest.description}</code></pre>
                          {/* Viewing & Downloading the document */}
                          {quest.event_image != null && (
                          <div style={{color:'purple', fontSize:'90%'}} className='flex flex-row gap-4 justify-start mb-4 ml-4'>
                          <a href={document} target="_blank" rel="noopener noreferrer" className='flex flex-row gap-1 items-center '> View File <Eye/></a>
                          <a href={document} download><Download/></a>
                          </div>)}
                          <div className="flex items-center justify-between mb-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>{quest.status_text}</span><div className="flex items-center gap-1 text-gray-600"><Star className="w-4 h-4 text-yellow-500" /><span className="font-semibold">{quest.available_points} XP</span></div></div>
                          {quest.can_submit && (<button onClick={() => setSubmissions({ ...submissions, [quest.id]: true })} className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"><Zap size={16} />{quest.submission_status === 'rejected' ? 'Resubmit Quest' : 'Start Quest'}</button>)}
                          <div className="mt-3 text-right"><button className="text-pink-500 hover:text-pink-600 text-sm font-medium transition-colors">LEARN MORE</button></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  </SectionTracker>
                );
              })}
            </div>
          </div>
        </div>
        {Object.entries(submissions).map(([eventId, isOpen]) => {
          if (!isOpen) return null; const event = selectedChallenge.subChallenges.find(e => e.id == eventId); if (!event) return null;
          return (<SubmissionModal key={eventId} event={event} onClose={() => setSubmissions({ ...submissions, [eventId]: false })} onSubmit={(text, file) => { submitEvent(eventId, selectedChallenge.id, text, file); setSubmissions({ ...submissions, [eventId]: false }); }} />);
        })}
        {/* <style jsx>{` @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } } `}</style> */}
      </div>
    );
  }

  // --- NEW Carousel Challenges View ---
  return (
    <div style={{ background: '#f8f2fd', color: '#0e0515' }} className="min-h-screen relative flex flex-col justify-center overflow-hidden p-8">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl opacity-50"></div>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto">
        {/* NEW: Progress Timeline Bar */}
        {challenges.length > 0 && (
            <div className="w-full max-w-3xl mx-auto mb-16">
                <h1 style={{ color: '#4e1a7f' }} className="text-center text-4xl md:text-5xl font-bold mb-8">Choose Your Challenge</h1>
                <div className="relative flex justify-between items-center">
                    <div className="absolute top-1/2 left-0 w-full h-0.5" style={{ background: 'rgba(78, 26, 127, 0.2)' }}/>
                    <motion.div className="absolute top-1/2 left-0 h-0.5" style={{ background: '#e26f9b' }}
                        animate={{ width: `${(currentIndex / (challenges.length - 1)) * 100}%` }}
                        transition={cardTransition}
                    />
                    {challenges.map((challenge, index) => (
                        <div key={challenge.id} className="relative z-10 flex flex-col items-center">
                            <div className={`w-3 h-3 rounded-full transition-colors ${currentIndex >= index ? 'bg-[#e26f9b]' : 'bg-[#4e1a7f]/20'}`} />
                            <span className={`mt-3 text-xs md:text-sm text-center transition-colors font-medium w-24 ${currentIndex === index ? 'text-[#4e1a7f]' : 'text-[#4e1a7f]/50'}`}>{challenge.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Main Content Area */}
        <main className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Side: Animated Text Content */}
            <div className="w-full md:w-1/2 text-center md:text-left">
              <AnimatePresence mode="wait">
                {activeChallenge && (
                  <motion.div
                    key={currentIndex}
                    variants={textVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <h2 className="text-4xl md:text-5xl font-bold" style={{ color: '#4e1a7f' }}>{activeChallenge.title}</h2>
                    <p className="text-lg text-gray-600 mt-4 leading-relaxed">{activeChallenge.description}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Side: Carousel with Navigation */}
            <div className="w-full md:w-2/3 h-[550px] flex items-center justify-center">
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {[-1, 0, 1].map((offset) => {
                    const index = (currentIndex + offset + challenges.length) % challenges.length;
                    const challenge = challenges[index];
                    if (!challenge) return null;

                    return (
                      <motion.div
                        key={challenge.id}
                        className="absolute w-full h-full flex items-center justify-center"
                        initial={{ x: `${offset * 100}%`, opacity: 0 }}
                        animate={{
                          x: `${offset * 47}%`,
                          scale: offset === 0 ? 1 : 0.8,
                          opacity: offset === 0 ? 1 : 0.5,
                          zIndex: challenges.length - Math.abs(offset),
                        }}
                        exit={{ x: `${offset > 0 ? 100 : -100}%`, opacity: 0 }}
                        transition={cardTransition}
                      >
                        <ChallengeCard
                          challenge={challenge}
                          progress={userProgress[challenge.id]}
                          onCardClick={handleCardClick}
                          isCenter={offset === 0}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {/* Navigation Buttons */}
                <button onClick={prevSlide} className="absolute top-1/2 -left-8 -translate-y-1/2 z-30 bg-[#f8f2fd] hover:bg-white p-2 rounded-full transition-colors shadow-md border border-[#e26f9b]">
                  <ChevronLeft className="h-6 w-6" style={{ color: '#4e1a7f' }} />
                </button>
                <button onClick={nextSlide} className="absolute top-1/2 -right-8 -translate-y-1/2 z-30 bg-[#f8f2fd] hover:bg-white p-2 rounded-full transition-colors shadow-md border border-[#e26f9b]">
                  <ChevronRight className="h-6 w-6" style={{ color: '#4e1a7f' }} />
                </button>
              </div>
            </div>
        </main>
      </div>

      {/* <style jsx>{` @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } } `}</style> */}
    </div>
  );
};

export default Challenges;