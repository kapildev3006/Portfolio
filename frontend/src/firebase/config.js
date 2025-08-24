import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Fallback configuration if environment variables are not set
const fallbackConfig = {
  apiKey: "demo-api-key",
  authDomain: "demo-project.firebaseapp.com",
  projectId: "demo-project",
  storageBucket: "demo-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id",
  measurementId: "demo-measurement-id"
};

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || fallbackConfig.apiKey,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || fallbackConfig.authDomain,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || fallbackConfig.projectId,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || fallbackConfig.storageBucket,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || fallbackConfig.messagingSenderId,
  appId: process.env.REACT_APP_FIREBASE_APP_ID || fallbackConfig.appId,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || fallbackConfig.measurementId
};

// Check if we're in demo mode
const isDemoMode = !process.env.REACT_APP_FIREBASE_API_KEY || 
                   process.env.REACT_APP_FIREBASE_API_KEY === 'demo-api-key';

if (isDemoMode) {
  console.warn('Firebase configuration not found. Running in demo mode without Firebase features.');
}

let app, db, auth;

try {
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  
  // Initialize Firestore
  db = getFirestore(app);
  
  // Initialize Auth
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  
  // Create mock objects for demo mode
  if (isDemoMode) {
    db = {
      collection: () => ({
        getDocs: async () => ({ docs: [] }),
        addDoc: async () => ({ id: 'demo-id' }),
        updateDoc: async () => ({}),
        deleteDoc: async () => ({}),
        doc: () => ({}),
        orderBy: () => ({}),
        query: () => ({})
      })
    };
    
    auth = {
      onAuthStateChanged: (callback) => {
        callback(null);
        return () => {};
      },
      signInWithEmailAndPassword: async () => {
        throw new Error('Demo mode: Authentication not available');
      },
      signOut: async () => ({}),
      sendPasswordResetEmail: async () => {
        throw new Error('Demo mode: Password reset not available');
      }
    };
  } else {
    throw error;
  }
}

export { db, auth };
export default app;
