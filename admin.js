import { firebaseConfig, configured } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, onValue, set, remove } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { renderCalendar } from "./calendar.js";

const $ = id => document.getElementById(id);
if (!configured) {
  $("login").classList.remove("hidden");
  $("login-msg").textContent = "Add your Firebase config to firebase-config.js first.";
  throw new Error("Firebase not configured");
}
const app = initializeApp(firebaseConfig), db = getDatabase(app), auth = getAuth(app);
let brush = "open", map = {}, unsub = null;
const draw = () => renderCalendar($("months"), map, pick);

async function pick(key) {
  $("save-msg").textContent = "Saving…";
  try {
    if (brush === "open") await remove(ref(db, "availability/" + key));
    else await set(ref(db, "availability/" + key), brush);
    $("save-msg").textContent = "Saved.";
  } catch {
    $("save-msg").textContent = "Couldn’t save. Check you’re signed in with the right account and your database rules.";
  }
}

$("brush").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  brush = b.dataset.s;
  document.querySelectorAll("#brush button").forEach(x => x.setAttribute("aria-pressed", x === b));
});

$("login").addEventListener("submit", async e => {
  e.preventDefault(); $("login-msg").textContent = "";
  try { await signInWithEmailAndPassword(auth, $("email").value, $("pass").value); }
  catch { $("login-msg").textContent = "Sign in failed. Check your email and password."; }
});
$("out").addEventListener("click", () => signOut(auth));

onAuthStateChanged(auth, user => {
  $("login").classList.toggle("hidden", !!user);
  $("panel").classList.toggle("hidden", !user);
  if (unsub) { unsub(); unsub = null; }
  if (user) {
    $("uid").textContent = user.uid;
    unsub = onValue(ref(db, "availability"), s => { map = s.val() || {}; draw(); });
  }
});
