import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkBadges } from '../utils/badge-manager';
import { initAuth, db } from '../lib/firebase';
import { collection, doc, updateDoc, setDoc } from 'firebase/firestore';
import { useFirestoreUsers, useFirestoreCourses } from '../hooks/useFirestore';

export type Role = 'student' | 'teacher' | 'parent' | 'admin' | null;

export interface User {
  id: string;
  name: string;
  role: Role;
  avatar?: string;
  points?: number;
  level?: number;
  streak?: number;
  childIds?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'reading' | 'quiz' | 'vr';
  quizId?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthReady: boolean;
  users: User[];
  courses: Course[];
  quizzes: Record<string, Quiz>;
  completedLessons: string[];
  completeLesson: (lessonId: string, pointsEarned: number, quizScore?: number) => void;
  earnedBadges: string[];
  awardBadge: (badgeId: string) => void;
  leaderboard: User[];
  messages: any[];
  addLesson: (courseId: string, lesson: Lesson) => void;
  addQuiz: (quizId: string, quiz: Quiz) => void;
}

const mockQuizzes: Record<string, Quiz> = {
  'q1': {
    id: 'q1',
    title: 'Cell Structure Quiz',
    questions: [
      { id: 'qq1', text: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Mitochondria', 'Ribosome', 'Endoplasmic Reticulum'], correctAnswer: 1 },
      { id: 'qq2', text: 'Which organelle contains the genetic material?', options: ['Nucleus', 'Golgi Apparatus', 'Lysosome', 'Chloroplast'], correctAnswer: 0 }
    ]
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  
  const [quizzes, setQuizzes] = useState<Record<string, Quiz>>(mockQuizzes);
  
  const users = useFirestoreUsers();
  const courses = useFirestoreCourses();

  useEffect(() => {
    const unsubscribeAuth = initAuth(
      (user) => {
        // Auth state is ready, but we wait for user doc to load
        setIsAuthReady(true);
      },
      () => {
        setCurrentUser(null);
        setIsAuthReady(true);
      }
    );

    return () => {
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    // Update currentUser if it changed in Firestore
    if (currentUser) {
      const updatedMe = users.find(u => u.id === currentUser.id);
      if (updatedMe && JSON.stringify(updatedMe) !== JSON.stringify(currentUser)) {
        setCurrentUser(updatedMe);
      }
    }
  }, [users, currentUser]);

  const addLesson = async (courseId: string, lesson: Lesson) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const newLessons = [...course.lessons, lesson];
      await updateDoc(doc(db, 'courses', courseId), { lessons: newLessons });
    }
  };

  const addQuiz = (quizId: string, quiz: Quiz) => {
    setQuizzes(prev => ({ ...prev, [quizId]: quiz }));
  };

  const completeLesson = async (lessonId: string, pointsEarned: number, quizScore?: number) => {
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId];
      setCompletedLessons(newCompleted);
      
      if (currentUser && currentUser.role === 'student') {
        const updatedPoints = (currentUser.points || 0) + pointsEarned;
        const updatedLevel = Math.floor(updatedPoints / 500) + 1; // 500 pts per level
        
        await updateDoc(doc(db, 'users', currentUser.id), {
          points: updatedPoints,
          level: updatedLevel
        });
        
        // Check badges
        const earned = checkBadges({
          points: updatedPoints,
          completedCount: newCompleted.length,
          lastQuizScore: quizScore,
          streak: currentUser.streak
        });
        earned.forEach(b => awardBadge(b));
      }
    }
  };

  const awardBadge = (badgeId: string) => {
    if (!earnedBadges.includes(badgeId)) {
      setEarnedBadges(prev => [...prev, badgeId]);
    }
  };

  const leaderboard = users
    .filter(u => u.role === 'student')
    .sort((a, b) => (b.points || 0) - (a.points || 0));

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      isAuthReady,
      users,
      courses,
      quizzes,
      completedLessons,
      completeLesson,
      earnedBadges,
      awardBadge,
      leaderboard,
      messages: [],
      addLesson,
      addQuiz
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
