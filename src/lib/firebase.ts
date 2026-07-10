import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Import config directly
import config from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

let app;
let db: any;
let auth: any;
let isFirebaseAvailable = false;

try {
  if (firebaseConfig.apiKey && firebaseConfig.projectId) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseAvailable = true;
    console.log('Firebase initialized successfully with project:', firebaseConfig.projectId);
  } else {
    console.warn('Firebase configuration keys are missing. Falling back to local storage.');
  }
} catch (error) {
  console.error('Failed to initialize Firebase:', error);
}

export { app, db, auth, isFirebaseAvailable };
