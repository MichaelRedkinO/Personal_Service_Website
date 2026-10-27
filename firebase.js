// Paste your Firebase web config here (Project settings > Your apps > Web app).
// These values are safe to be public. Your database rules are what protect your data.
export const firebaseConfig = {
  apiKey: "PASTE_API_KEY",
  authDomain: "PASTE_PROJECT.firebaseapp.com",
  databaseURL: "https://PASTE_PROJECT-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "PASTE_PROJECT",
  appId: "PASTE_APP_ID"
};
export const configured = !firebaseConfig.apiKey.startsWith("PASTE");
