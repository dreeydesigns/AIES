export const BADGES_DATA: Record<string, { name: string, icon: string, description: string }> = {
  '1000_points_club': { name: '1K Club', icon: 'Trophy', description: 'Earned 1000 points' },
  '5000_points_club': { name: '5K Club', icon: 'Star', description: 'Earned 5000 points' },
  'first_lesson': { name: 'First Steps', icon: 'CheckCircle', description: 'Completed first lesson' },
  'five_lessons': { name: 'Five Alive', icon: 'Zap', description: 'Completed 5 lessons' },
  'perfect_score': { name: 'Perfect Score', icon: 'Star', description: 'Scored 100% on a quiz' },
  'streak_5': { name: '5 Day Streak', icon: 'Zap', description: 'Maintained a 5-day learning streak' },
};

export interface AchievementEvent {
  points: number;
  completedCount: number;
  lastQuizScore?: number;
  streak?: number;
}

export const checkBadges = (event: AchievementEvent): string[] => {
  const newBadges: string[] = [];
  
  if (event.points >= 1000) newBadges.push('1000_points_club');
  if (event.points >= 5000) newBadges.push('5000_points_club');
  
  if (event.completedCount >= 1) newBadges.push('first_lesson');
  if (event.completedCount >= 5) newBadges.push('five_lessons');

  if (event.lastQuizScore === 100) newBadges.push('perfect_score');
  if (event.streak && event.streak >= 5) newBadges.push('streak_5');
  
  return newBadges;
};
