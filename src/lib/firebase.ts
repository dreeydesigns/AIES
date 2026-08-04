import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { initializeFirestore, doc, setDoc } from 'firebase/firestore';
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Use the explicit databaseId from config if available, otherwise default
export const db = firebaseConfig.firestoreDatabaseId 
  ? initializeFirestore(app, { experimentalForceLongPolling: true }, firebaseConfig.firestoreDatabaseId)
  : initializeFirestore(app, { experimentalForceLongPolling: true });

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.readonly');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) onAuthSuccess(user);
    } else {
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    if (error.code === 'auth/popup-blocked') { alert('Popup was blocked by the browser. Please open this app in a new tab (using the button in the top right) to sign in.'); } console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};


export const emailSignIn = async (email: string, password: string): Promise<User> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const emailSignUp = async (email: string, password: string, role: string, linkCode?: string): Promise<{user: User, userData: any}> => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const uid = result.user.uid;
  const userData = {
    name: 'New User',
    role: role,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${uid}`,
    points: role === 'student' ? 0 : undefined,
    level: role === 'student' ? 1 : undefined,
    streak: role === 'student' ? 0 : undefined,
    linkCode: role === 'student' ? (linkCode || Math.random().toString(36).substring(2, 8).toUpperCase()) : undefined,
  };
  
  
  await setDoc(doc(db, 'users', uid), userData);
  
  return { user: result.user, userData };
};
