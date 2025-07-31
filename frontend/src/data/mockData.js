// src/data/mockData.js

export const currentUser = {
  id: '1',
  name: 'Alex Chen',
  email: 'alex.chen@university.edu',
  avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
  level: 12,
  totalPoints: 2847,
  rank: 3
};

export const challenges = [
  {
    id: '1',
    title: 'Web Development Fundamentals',
    description: 'Master the basics of HTML, CSS, and JavaScript',
    points: 500,
    difficulty: 'easy',
    category: 'Development',
    completed: false,
    progress: 75,
    totalSubChallenges: 4,
    subChallenges: [
      {
        id: '1-1',
        title: 'HTML Structure',
        description: 'Create semantic HTML layouts',
        points: 100,
        completed: true,
        order: 1
      },
      {
        id: '1-2',
        title: 'CSS Styling',
        description: 'Style your HTML with modern CSS',
        points: 150,
        completed: true,
        order: 2
      },
      {
        id: '1-3',
        title: 'JavaScript Basics',
        description: 'Learn JavaScript fundamentals',
        points: 200,
        completed: true,
        order: 3
      },
      {
        id: '1-4',
        title: 'Responsive Design',
        description: 'Make your site mobile-friendly',
        points: 50,
        completed: false,
        order: 4
      }
    ]
  },
  {
    id: '2',
    title: 'React Framework Mastery',
    description: 'Build modern applications with React',
    points: 750,
    difficulty: 'medium',
    category: 'Development',
    completed: false,
    progress: 40,
    totalSubChallenges: 5,
    subChallenges: [
      {
        id: '2-1',
        title: 'Components & Props',
        description: 'Understanding React components',
        points: 150,
        completed: true,
        order: 1
      },
      {
        id: '2-2',
        title: 'State Management',
        description: 'Managing state with hooks',
        points: 200,
        completed: true,
        order: 2
      },
      {
        id: '2-3',
        title: 'API Integration',
        description: 'Fetching and displaying data',
        points: 150,
        completed: false,
        order: 3
      },
      {
        id: '2-4',
        title: 'Routing',
        description: 'Navigate between pages',
        points: 125,
        completed: false,
        order: 4
      },
      {
        id: '2-5',
        title: 'Deployment',
        description: 'Deploy your React app',
        points: 125,
        completed: false,
        order: 5
      }
    ]
  },
  {
    id: '3',
    title: 'Algorithm Design & Analysis',
    description: 'Solve complex problems with efficient algorithms',
    points: 1000,
    difficulty: 'hard',
    category: 'Algorithms',
    completed: false,
    progress: 20,
    totalSubChallenges: 6,
    subChallenges: [
      {
        id: '3-1',
        title: 'Time Complexity',
        description: 'Analyze algorithm efficiency',
        points: 150,
        completed: true,
        order: 1
      },
      {
        id: '3-2',
        title: 'Sorting Algorithms',
        description: 'Implement various sorting methods',
        points: 200,
        completed: false,
        order: 2
      },
      {
        id: '3-3',
        title: 'Graph Algorithms',
        description: 'Navigate complex data structures',
        points: 250,
        completed: false,
        order: 3
      },
      {
        id: '3-4',
        title: 'Dynamic Programming',
        description: 'Optimize recursive solutions',
        points: 200,
        completed: false,
        order: 4
      },
      {
        id: '3-5',
        title: 'Tree Traversal',
        description: 'Master tree data structures',
        points: 100,
        completed: false,
        order: 5
      },
      {
        id: '3-6',
        title: 'Advanced Optimization',
        description: 'Cutting-edge algorithm techniques',
        points: 100,
        completed: false,
        order: 6
      }
    ]
  }
];

export const leaderboard = [
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@university.edu',
    avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    level: 15,
    totalPoints: 3247,
    rank: 1
  },
  {
    id: '3',
    name: 'Michael Rodriguez',
    email: 'mike.r@university.edu',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    level: 14,
    totalPoints: 2956,
    rank: 2
  },
  currentUser,
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.d@university.edu',
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    level: 11,
    totalPoints: 2634,
    rank: 4
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david.k@university.edu',
    avatar: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
    level: 10,
    totalPoints: 2401,
    rank: 5
  }
];

export const notifications = [
  {
    id: '1',
    title: 'New Challenge Available!',
    message: 'Machine Learning Foundations challenge is now live',
    type: 'challenge',
    timestamp: new Date('2025-01-09T10:30:00'),
    read: false
  },
  {
    id: '2',
    title: 'Rank Up!',
    message: 'Congratulations! You reached Level 12',
    type: 'achievement',
    timestamp: new Date('2025-01-08T15:45:00'),
    read: false
  },
  {
    id: '3',
    title: 'Weekly Leaderboard Update',
    message: 'You are currently #3 on the leaderboard',
    type: 'system',
    timestamp: new Date('2025-01-07T09:00:00'),
    read: true
  }
];