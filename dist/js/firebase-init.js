// firebase-init.js - central Firebase initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
import { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBlJGO4YqRL2CtMq9hpYOWMuesnpDRbyR4",
  authDomain: "signup-6c531.firebaseapp.com",
  projectId: "signup-6c531",
  storageBucket: "signup-6c531.firebasestorage.app",
  messagingSenderId: "1075553175213",
  appId: "1:1075553175213:web:257c58be44959c48b7e824",
  measurementId: "G-L47L95383V"
};

// Initialize app and analytics
const app = initializeApp(firebaseConfig);
try {
  // analytics may fail in some non-browser contexts; safe to ignore
  getAnalytics(app);
} catch (e) {
  // ignore analytics errors in environments that don't support it
}

// Create auth instance and set local persistence early
const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence).catch((err) => {
  console.warn('firebase-init: could not set browserLocalPersistence', err && err.message ? err.message : err);
});

// Export provider for Google sign-in flows
const provider = new GoogleAuthProvider();

export { app, auth, provider };
