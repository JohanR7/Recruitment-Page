// src/components/Challenges.jsx

import React, { useState } from 'react';
import { ArrowLeft, Star, Clock, CheckCircle, Circle, Trophy, Zap } from 'lucide-react';
import { challenges } from '../data/mockData'; // Assuming mockData is still available

const Challenges = () => {
  const [selectedChallenge, setSelectedChallenge] = useState(null);

  // Note: These helper functions now use the custom colors from your tailwind.config.js
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-secondary bg-secondary/20 border-secondary/30';
      case 'hard': return 'text-accent bg-accent/20 border-accent/30';
      default: return 'text-gray-500 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Development': return 'text-primary bg-primary/20';
      case 'Algorithms': return 'text-purple-500 bg-purple-500/20'; // Using a distinct color for variety
      default: return 'text-gray-500 bg-gray-500/20';
    }
  };

  if (selectedChallenge) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setSelectedChallenge(null)}
            className="flex items-center gap-2 text-gray-500 hover:text-text transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Challenges
          </button>
        </div>

        <div className="bg-white/60 backdrop-blur-md border border-gray-200/80 rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">{selectedChallenge.title}</h1>
              <p className="text-gray-600 mb-4">{selectedChallenge.description}</p>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(selectedChallenge.difficulty)}`}>
                  {selectedChallenge.difficulty}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedChallenge.category)}`}>
                  {selectedChallenge.category}
                </span>
                <div className="flex items-center gap-1 text-secondary">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-semibold">{selectedChallenge.points} pts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-text">Progress</h2>
              <span className="text-gray-500">{selectedChallenge.progress}% Complete</span>
            </div>
            
            <div className="relative overflow-hidden">
              <div 
                className="relative h-24 bg-gray-200/50 rounded-2xl transform -skew-x-12 border border-gray-300/50"
                style={{ perspective: '1000px' }}
              >
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-secondary rounded-2xl transition-all duration-1000 ease-out"
                  style={{ width: `${selectedChallenge.progress}%` }}
                ></div>
                
                <div className="absolute inset-0 flex items-center justify-between px-8">
                  {selectedChallenge.subChallenges.map((subChallenge, index) => {
                    const position = (index / (selectedChallenge.subChallenges.length - 1)) * 100;
                    const isCompleted = subChallenge.completed;
                    const isCurrent = !isCompleted && index === selectedChallenge.subChallenges.findIndex(sc => !sc.completed);
                    
                    return (
                      <div
                        key={subChallenge.id}
                        className="absolute transform skew-x-12 flex flex-col items-center"
                        style={{ left: `${position}%`, transform: 'translateX(-50%) skewX(12deg)' }}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          isCompleted 
                            ? 'bg-primary border-primary/50 shadow-lg shadow-primary/30' 
                            : isCurrent
                            ? 'bg-secondary border-secondary/50 shadow-lg shadow-secondary/30 animate-pulse'
                            : 'bg-gray-300 border-gray-400'
                        }`}>
                          {isCompleted ? <CheckCircle className="w-4 h-4 text-white" /> : <Circle className="w-4 h-4 text-gray-500" />}
                        </div>
                        <div className="mt-2 text-xs text-center min-w-max">
                          <p className={`font-medium ${isCompleted ? 'text-primary' : isCurrent ? 'text-secondary' : 'text-gray-500'}`}>
                            {subChallenge.title}
                          </p>
                          <p className="text-gray-400">{subChallenge.points} pts</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Sub-challenges List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-text">Sub-challenges</h3>
            {selectedChallenge.subChallenges.map((subChallenge) => (
              <div
                key={subChallenge.id}
                className={`p-4 rounded-xl border transition-all duration-300 ${
                  subChallenge.completed
                    ? 'bg-primary/10 border-primary/20 hover:bg-primary/20'
                    : 'bg-white/50 border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {subChallenge.completed ? (
                      <CheckCircle className="w-6 h-6 text-primary" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${subChallenge.completed ? 'text-primary' : 'text-text'}`}>
                      {subChallenge.title}
                    </h4>
                    <p className="text-gray-500 text-sm">{subChallenge.description}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="flex items-center gap-1 text-secondary">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">{subChallenge.points}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <button className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:opacity-90 transition-all duration-200 transform hover:scale-105">
              <Zap className="w-5 h-5" />
              Continue Challenge
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Challenges</h1>
          <p className="text-gray-600">Choose your next adventure and level up your skills</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            onClick={() => setSelectedChallenge(challenge)}
            className="bg-white/60 backdrop-blur-sm border border-gray-200/80 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer group transform hover:scale-[1.02]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text mb-2 group-hover:text-primary transition-colors duration-200">
                  {challenge.title}
                </h3>
                <p className="text-gray-500 text-sm mb-3">{challenge.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(challenge.category)}`}>
                    {challenge.category}
                  </span>
                </div>
              </div>
              {challenge.completed && (
                <Trophy className="w-6 h-6 text-secondary flex-shrink-0" />
              )}
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-500 mb-1">
                <span>Progress</span>
                <span>{challenge.progress}%</span>
              </div>
              <div className="w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${challenge.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-secondary" />
                  <span>{challenge.points} pts</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{challenge.subChallenges.length} tasks</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {challenge.subChallenges.filter(sc => sc.completed).length} / {challenge.subChallenges.length}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Challenges;