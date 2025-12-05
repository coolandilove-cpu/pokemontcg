import { initializeApp, getApps, FirebaseApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:abcdef",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase is properly configured
const isFirebaseConfigured: boolean = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== "demo-api-key"
);

// Initialize Firebase only if configured
let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;

if (isFirebaseConfigured) {
  try {
    // Only initialize if not already initialized
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
      authInstance = getAuth(app);
      dbInstance = getFirestore(app);
    } else {
      app = getApps()[0];
      authInstance = getAuth(app);
      dbInstance = getFirestore(app);
    }
  } catch (error) {
    console.warn("Firebase initialization failed:", error);
    console.warn("Continuing without Firebase features");
  }
} else {
  console.warn("Firebase not configured. Some features may not be available.");
  console.warn("To enable Firebase, set NEXT_PUBLIC_FIREBASE_API_KEY and other env variables in .env.local");
}

// Export with fallback - create mock objects if Firebase is not configured
export const auth = authInstance || ({} as Auth);
export const db = dbInstance || ({} as Firestore);
export { isFirebaseConfigured };
// export const analytics = getAnalytics();
