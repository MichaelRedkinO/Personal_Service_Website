// Paste your Firebase web config here (Project settings > Your apps > Web app).
// These values are safe to be public. Your database rules are what protect your data.
export const firebaseConfig = {
  apiKey: "AIzaSyCWTxtq1dGK3zEITbF2-ATPc6kDzwXuTq0",
  authDomain: "michael-calendar-a5d69.firebaseapp.com",
  databaseURL: "https://michael-calendar-a5d69-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "michael-calendar-a5d69",
  storageBucket: "michael-calendar-a5d69.firebasestorage.app",
  messagingSenderId: "765228739616",
  appId: "1:765228739616:web:94a6223b132f1da93a2045",
  measurementId: "G-NBXPGSGT11"
};

export const configured = !firebaseConfig.apiKey.startsWith("PASTE");
