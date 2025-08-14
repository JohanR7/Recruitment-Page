import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Add this new component after imports
const CountdownTimer = ({ endDate }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const targetDate = new Date(endDate).getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
                setIsExpired(false);
            } else {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                setIsExpired(true);
            }
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);
        return () => clearInterval(timer);
    }, [endDate]);

    if (!endDate) return null;

    return (
        <motion.div
            className="text-center mb-6 sm:mb-8"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
        >
            <p className="text-base sm:text-lg mb-4 font-semibold text-primary dark:text-dark-primary">
                {isExpired ? 'Challenge Ended' : 'Time Remaining:'}
            </p>
            <motion.div
                className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-6 flex-wrap"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
            >
                <div className="text-center">
                    <div className={`text-2xl sm:text-3xl font-bold ${isExpired ? 'text-gray-400' : 'text-primary dark:text-dark-primary'}`}>
                        {timeLeft.days}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-text/60 dark:text-dark-text/60">DAYS</div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-primary dark:text-dark-primary">:</div>
                <div className="text-center">
                    <div className={`text-2xl sm:text-3xl font-bold ${isExpired ? 'text-gray-400' : 'text-primary dark:text-dark-primary'}`}>
                        {timeLeft.hours}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-text/60 dark:text-dark-text/60">HOURS</div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-primary dark:text-dark-primary">:</div>
                <div className="text-center">
                    <div className={`text-2xl sm:text-3xl font-bold ${isExpired ? 'text-gray-400' : 'text-primary dark:text-dark-primary'}`}>
                        {timeLeft.minutes}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-text/60 dark:text-dark-text/60">MINUTES</div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-primary dark:text-dark-primary">:</div>
                <div className="text-center">
                    <div className={`text-2xl sm:text-3xl font-bold ${isExpired ? 'text-gray-400' : 'text-accent dark:text-dark-accent'}`}>
                        {timeLeft.seconds}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-accent dark:text-dark-accent">SECONDS</div>
                </div>
            </motion.div>
        </motion.div>
    );
};
// Challenge Card Component
const ChallengeCard = ({ challenge, progress, onCardClick, isCenter }) => {
    const progressPercentage = progress && progress.completed_events != null && progress.total_events > 0
        ? Math.round((progress.completed_events / progress.total_events) * 100)
        : 0;
    const handleCardClick = () => {
        onCardClick(challenge.id, isCenter);
    };

    return (
        <div
            onClick={handleCardClick}
            className={`relative overflow-hidden cursor-pointer flex flex-col justify-between p-4 sm:p-6 transition-all duration-500 border-2 border-secondary dark:border-dark-secondary rounded-3xl ${isCenter
                ? 'bg-gradient-to-br from-background dark:from-dark-background via-background dark:via-dark-background to-secondary/10 dark:to-dark-secondary/10 shadow-2xl'
                : 'bg-background dark:bg-dark-background shadow-lg'
                }`}
            style={{
                width: '280px',
                height: '400px',
                userSelect: 'none'
            }}
            data-mobile-card
        >
            <div>
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shadow-lg mb-3 sm:mb-4 transition-colors ${isCenter
                    ? 'bg-secondary dark:bg-dark-secondary'
                    : 'bg-primary dark:bg-dark-primary'
                    }`}>
                    <Star className="w-6 h-6 sm:w-8 sm:h-8 text-background dark:text-dark-background" />
                </div>
                <h3 className="text-lg sm:text-2xl font-bold mb-2 text-primary dark:text-dark-primary transition-colors duration-300">
                    {challenge.title}
                </h3>
            </div>

            <div>
                <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs sm:text-sm font-medium text-text dark:text-dark-text">Progress</span>
                        <span className="text-xs sm:text-sm font-bold text-primary dark:text-dark-primary">{progressPercentage}%</span>
                    </div>
                    <div className="relative w-full h-2 rounded-full overflow-hidden bg-secondary/30 dark:bg-dark-secondary/30">
                        <motion.div
                            className="absolute left-0 top-0 h-full rounded-full bg-primary dark:bg-dark-primary"
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm mb-4 sm:mb-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-secondary/20 dark:bg-dark-secondary/20">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-secondary dark:text-dark-secondary" />
                        </div>
                        <span className="font-semibold text-text dark:text-dark-text">{progress?.total_points || '0'} pts</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center bg-primary/20 dark:bg-dark-primary/20">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary dark:text-dark-primary" />
                        </div>
                        <span className="font-semibold text-text dark:text-dark-text">{progress?.total_events || '0'} tasks</span>
                    </div>
                </div>

                <AnimatePresence>
                    {isCenter && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                            className="w-full py-2 sm:py-3 px-4 rounded-xl font-semibold hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg bg-primary dark:bg-dark-primary text-background dark:text-dark-background text-sm sm:text-base"
                        >
                            Start Challenge
                            <ChevronRight className="w-4 h-4 text-secondary dark:text-dark-secondary" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const Carousel = ({ challenges, userProgress, onChallengeSelect }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [lastClickTime, setLastClickTime] = useState(0);
    const [challengeCompletionStatus, setChallengeCompletionStatus] = useState({});


    const CLICK_COOLDOWN = 800;
    const TRANSITION_DURATION = 600;

    const activeChallenge = challenges.length > 0 ? challenges[currentIndex] : null;
    const calculateCompletionStatus = useCallback(() => {
        const completionStatus = {};
        challenges.forEach(challenge => {
            const progress = userProgress[challenge.id];
            if (progress && progress.total_events > 0) {
                completionStatus[challenge.id] = progress.completed_events === progress.total_events;
            } else {
                completionStatus[challenge.id] = false;
            }
        });
        setChallengeCompletionStatus(completionStatus);
    }, [challenges, userProgress]);
    // Update completion status when challenges or progress changes
    useEffect(() => {
        calculateCompletionStatus();
    }, [calculateCompletionStatus]);
    // Calculate completion status for all challenges
    // Calculate progress width based on completed challenges
    const calculateProgressWidth = () => {
        if (challenges.length <= 1) return 100;

        const sortedChallenges = getSortedChallengesForProgressBar();
        const completedChallenges = sortedChallenges.filter(challenge =>
            challengeCompletionStatus[challenge.id] === true
        ).length;

        return (completedChallenges / challenges.length) * 100;
    };
    // Get challenges sorted by completion status for progress bar display
    const getSortedChallengesForProgressBar = () => {
        return [...challenges].sort((a, b) => {
            const aCompleted = challengeCompletionStatus[a.id] === true;
            const bCompleted = challengeCompletionStatus[b.id] === true;

            // Completed challenges first
            if (aCompleted && !bCompleted) return -1;
            if (!aCompleted && bCompleted) return 1;

            // If both have same completion status, maintain original order
            return challenges.indexOf(a) - challenges.indexOf(b);
        });
    };

    // Animation Variants
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

    // Navigation Handlers
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

    const handleCardClick = (challengeId, shouldOpenRoadmap) => {
        const currentTime = Date.now();

        if (currentTime - lastClickTime < CLICK_COOLDOWN) {
            console.log('Click ignored - too fast');
            return;
        }

        if (isTransitioning) {
            console.log('Click ignored - transition in progress');
            return;
        }

        if (shouldOpenRoadmap) {
            onChallengeSelect(challengeId);
        } else {
            const challengeIndex = challenges.findIndex(c => c.id === challengeId);
            if (challengeIndex !== -1 && challengeIndex !== currentIndex) {
                setIsTransitioning(true);
                setLastClickTime(currentTime);
                setCurrentIndex(challengeIndex);

                setTimeout(() => {
                    setIsTransitioning(false);
                }, TRANSITION_DURATION);
            }
        }
    };

    return (
        <div className="min-h-screen relative flex flex-col justify-center overflow-hidden p-4 sm:p-6 lg:p-8 bg-background dark:bg-dark-background text-text dark:text-dark-text">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl rotate-45 blur-sm opacity-60"></div>
                <div className="absolute bottom-32 right-20 w-48 h-48 bg-gradient-to-tl from-accent/15 to-cyanblue/15 rounded-full blur-2xl opacity-50"></div>
                <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-secondary/20 dark:bg-dark-secondary/20 transform rotate-12 rounded-xl blur-sm opacity-40"></div>
                <div className="absolute bottom-20 left-32 w-36 h-36 bg-cyanblue/10 dark:bg-dark-cyanblue/10 rounded-full blur-xl opacity-60"></div>
                {/* Floating squares */}

            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto">
                {/* Countdown Timer */}
                {activeChallenge && (
                    <CountdownTimer endDate={activeChallenge.end_date} />
                )}

                {/* Progress Timeline Bar - only show if more than 1 challenge */}
                {challenges.length > 1 && (
                    <div className="w-full max-w-2xl mx-auto mb-4 sm:mb-6 lg:mb-8">
                        <h1 className="text-center text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-primary dark:text-dark-primary px-4">
                            Choose Your Challenge
                        </h1>

                        <div className="relative flex justify-between items-center px-4">
                            {/* Track container */}
                            <div className="absolute top-1/2 left-4 right-4 h-2 rounded-full bg-primary/10 dark:bg-dark-primary/10 border border-primary/30 dark:border-dark-primary/30 shadow-inner overflow-hidden">
                                {/* Fill inside track */}
                                <motion.div
                                    className="h-2 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/70 shadow-md"
                                    animate={{
                                        width: `${calculateProgressWidth()}%`
                                    }}
                                    transition={cardTransition}
                                />
                            </div>


                            {/* Steps */}
                            {getSortedChallengesForProgressBar().map((challenge, sortedIndex) => {
                                const originalIndex = challenges.findIndex(c => c.id === challenge.id);
                                return (
                                    <div key={challenge.id} className="relative z-10 flex flex-col items-center gap-3">
                                        <div
                                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${challengeCompletionStatus[challenge.id]
                                                ? 'bg-green-500 dark:bg-green-400'
                                                : currentIndex === originalIndex
                                                    ? 'bg-secondary dark:bg-dark-secondary'
                                                    : 'bg-primary/20 dark:bg-dark-primary/20'
                                                }`}
                                        />
                                        <span
                                            className={`mt-2 sm:mt-3 text-xs text-center transition-colors font-medium w-16 sm:w-24 ${currentIndex === originalIndex
                                                ? 'text-primary dark:text-dark-primary'
                                                : 'text-primary/50 dark:text-dark-primary/50'
                                                }`}
                                        >
                                            {challenge.title}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}


                {/* Main Content Area */}
                <main className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-6 lg:gap-12 xl:gap-20">
                    {/* Left Side: Animated Text Content */}
                    <div className="w-full lg:w-1/2 text-center lg:text-left order-2 lg:order-1 flex flex-col justify-center lg:justify-start lg:mt-[-120px] xl:mt-[-140px]"> {/* Increased negative margin from lg:mt-[-80px] xl:mt-[-100px] */}

                        <AnimatePresence mode="wait">
                            {activeChallenge && (
                                <motion.div
                                    key={currentIndex}
                                    variants={textVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    className="px-4 lg:px-0"
                                >
                                    <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-primary dark:text-dark-primary mb-4">
                                        {activeChallenge.title}
                                    </h2>
                                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
                                        {activeChallenge.description}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Side: Carousel with Navigation */}
                    <div className="w-full lg:w-2/3 order-1 lg:order-2">
                        <div className="relative h-[420px] sm:h-[480px] lg:h-[550px] flex items-center justify-center">
                            <div className="relative w-full h-full max-w-[600px] mx-auto">
                                <AnimatePresence>
                                    {(challenges.length === 1 ? [0] : [-1, 0, 1]).map((offset) => {
                                        const index = challenges.length === 1 ? 0 : (currentIndex + offset + challenges.length) % challenges.length;
                                        const challenge = challenges[index];
                                        if (!challenge) return null;

                                        // Mobile: only show center card
                                        if (window.innerWidth < 640 && offset !== 0) return null;

                                        // For single challenge, always treat as center
                                        const isActualCenter = challenges.length === 1 || offset === 0;

                                        return (
                                            <motion.div
                                                key={challenge.id}
                                                className="absolute w-full h-full flex items-center justify-center"
                                                initial={{ x: `${offset * 100}%`, opacity: 0 }}
                                                animate={{
                                                    x: challenges.length === 1 ? 0 : (window.innerWidth < 640 ? 0 : `${offset * 45}%`),
                                                    scale: isActualCenter ? 1 : (window.innerWidth < 640 ? 0 : 0.8),
                                                    opacity: isActualCenter ? 1 : (window.innerWidth < 640 ? 0 : 0.5),
                                                    zIndex: challenges.length - Math.abs(offset),
                                                }}
                                                exit={{ x: `${offset > 0 ? 100 : -100}%`, opacity: 0 }}
                                                transition={cardTransition}
                                            >
                                                <ChallengeCard
                                                    challenge={challenge}
                                                    progress={userProgress[challenge.id]}
                                                    onCardClick={handleCardClick}
                                                    isCenter={isActualCenter}
                                                />
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>

                                {/* Navigation Buttons - only show if more than 1 challenge */}
                                {challenges.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevSlide}
                                            className="absolute top-1/2 left-0 sm:-left-4 lg:-left-8 -translate-y-1/2 z-30 bg-background dark:bg-dark-background hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full transition-colors shadow-md border border-secondary dark:border-dark-secondary"
                                        >
                                            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-primary dark:text-dark-primary" />
                                        </button>
                                        <button
                                            onClick={nextSlide}
                                            className="absolute top-1/2 right-0 sm:-right-4 lg:-right-8 -translate-y-1/2 z-30 bg-background dark:bg-dark-background hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full transition-colors shadow-md border border-secondary dark:border-dark-secondary"
                                        >
                                            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-primary dark:text-dark-primary" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <style jsx>{`
                @media (max-width: 640px) {
                    [data-mobile-card] {
                        width: 260px !important;
                        height: 380px !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Carousel;