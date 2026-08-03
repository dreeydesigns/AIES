export const studentMetrics = [
  { time: '09:00', heartRate: 75, attention: 85, movement: 20 },
  { time: '10:00', heartRate: 82, attention: 90, movement: 15 },
  { time: '11:00', heartRate: 78, attention: 70, movement: 45 },
  { time: '12:00', heartRate: 85, attention: 60, movement: 60 },
  { time: '13:00', heartRate: 72, attention: 85, movement: 25 },
  { time: '14:00', heartRate: 76, attention: 95, movement: 10 },
  { time: '15:00', heartRate: 80, attention: 80, movement: 30 },
];

export const learningPathways = [
  { id: 1, title: 'Introduction to VR Ecosystems', progress: 100, status: 'completed', type: 'VR Experience' },
  { id: 2, title: 'Advanced Algorithms', progress: 65, status: 'in-progress', type: 'Gamified Module' },
  { id: 3, title: '3D Modeling Basics', progress: 0, status: 'not-started', type: '3D Lab' },
];

export const gamification = {
  points: 4520,
  level: 12,
  badges: [
    { id: 1, name: 'Fast Learner', icon: 'Zap' },
    { id: 2, name: 'Team Player', icon: 'Users' },
    { id: 3, name: 'VR Explorer', icon: 'Headset' },
  ]
};

export const teacherStudents = [
  { id: 1, name: 'Alice Johnson', attention: 92, status: 'Engaged', risk: 'Low' },
  { id: 2, name: 'Bob Smith', attention: 45, status: 'Fatigued', risk: 'High' },
  { id: 3, name: 'Charlie Davis', attention: 78, status: 'Normal', risk: 'Low' },
  { id: 4, name: 'Diana Evans', attention: 88, status: 'Engaged', risk: 'Low' },
];
