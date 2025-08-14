import React, { useState, useEffect } from 'react';
import Carousel from './Carousel';
import Roadmap from './Roadmap';
import { useAuth } from '../contexts/AuthContext'; // Import the useAuth hook


const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-background/80 dark:bg-dark-background/80 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-background dark:bg-dark-background border border-secondary dark:border-dark-secondary rounded-xl p-8 flex items-center gap-4 shadow-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-dark-primary"></div>
      <p className="text-text dark:text-dark-text font-medium">Loading...</p>
    </div>
  </div>
);

const Challenges = () => {
  const { auth } = useAuth(); // Get auth context
  const [challenges, setChallenges] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);

  const API_BASE = 'https://aseam.acm.org/LMS/roadmaps/roadmap1.php';

  // Get userId from auth context
const userId = auth?.user?.rollno || auth?.user?.id;

  // Fetch all challenges
  const fetchChallenges = async () => {
    try {
      const response = await fetch(`${API_BASE}/roadmaps`);
      console.log(response);
      const data = await response.json();
      if (data.success) {
        setChallenges(data.roadmaps);
        data.roadmaps.forEach(roadmap => fetchProgress(roadmap.id));
      }
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specific challenge details
const fetchChallenge = async (challengeId) => {
  if (!userId) {
    console.error('No user ID available');
    return;
  }
  
  setLoading(true);
  try {
    const response = await fetch(`${API_BASE}/roadmap?roadmap_id=${challengeId}&user_id=${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (data.success) {
      setSelectedChallenge(data.roadmap);
      console.log('Fetched challenge:', data);
    } else {
      console.error('API returned error:', data.error);
    }
  } catch (error) {
    console.error('Error fetching challenge:', error);
  } finally {
    setLoading(false);
  }
};

  // Fetch progress for a specific challenge
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

  // Submit event
const handleEventSubmission = async (eventId, roadmapId, submissionText, submissionFile) => {
  if (!userId) {
    alert('User not authenticated');
    return;
  }

  try {
    const formData = new FormData();
formData.append('event_id', eventId);
formData.append('roadmap_id', roadmapId);
formData.append('user_id', userId);
formData.append('submission_text', submissionText || ''); // Ensure it's not undefined

if (submissionFile) {
  formData.append('submission_file', submissionFile);
}

// Debug logging
console.log('Submission data:', {
  event_id: eventId,
  roadmap_id: roadmapId,
  user_id: userId,
  submission_text: submissionText,
  has_file: !!submissionFile
});

    const response = await fetch(`${API_BASE}/roadmap/event/submit`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Request failed with status ${response.status}`);
    }

    const result = await response.json();
    
    if (result.success) {
      alert('Submission successful! 🎉');
      // Refresh the roadmap data to update the UI
      await fetchChallenge(roadmapId);
    } else {
      alert(`Submission failed: ${result.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Submission error:', error);
    alert(`Submission failed: ${error.message}`);
  }
};

  // Fetch challenges when userId is available
  useEffect(() => {
    if (userId) {
      fetchChallenges();
    } else if (auth === null) {
      // User is not authenticated
      setLoading(false);
    }
  }, [userId, auth]);

  // Handle back to challenges
  const handleBackToChallenges = () => {
    setSelectedChallenge(null);
  };

  // Handle challenge selection
  const handleChallengeSelect = (challengeId) => {
    fetchChallenge(challengeId);
  };

  // Show loading if we're still determining auth state or fetching data
  if (loading && challenges.length === 0) {
    return <LoadingOverlay />;
  }

  // Show message if user is not authenticated
  if (!auth || !userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text dark:text-dark-text mb-4">
            Authentication Required
          </h2>
          <p className="text-text dark:text-dark-text">
            Please log in to access challenges and track your progress.
          </p>
        </div>
      </div>
    );
  }

  // Show roadmap if a challenge is selected
  if (selectedChallenge) {
    return (
      <Roadmap
        challenge={selectedChallenge}
        userProgress={userProgress[selectedChallenge.id]}
        onBack={handleBackToChallenges}
        onSubmitEvent={handleEventSubmission}

        loading={loading}
      />
    );
  }

  // Show carousel of challenges
  return (
    <Carousel
      challenges={challenges}
      userProgress={userProgress}
      onChallengeSelect={handleChallengeSelect}
    />
  );
};

export default Challenges;