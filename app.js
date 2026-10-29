import { firebaseConfig, configured } from "./firebase-config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";
import { renderCalendar, todayKey } from "./calendar.js";

/* EDIT HERE: your email and prices */
const EMAIL = "michaelredkinservices.com";
const SERVICES = [
  {id: "site", name: "Fast website", desc: "Clear, mobile-friendly, easy to contact.", price: 400, time: "1-2 weeks"},
  {id: "seo", name: "Local SEO audit", desc: "Why nearby customers can’t find you, and the fix.", price: 150, time: "3-5 days"},
  {id: "ai", name: "AI enquiry assistant", desc: "Answers common questions, passes enquiries to you.", price: 300, time: "1 week"},
  {id: "custom", name: "Custom request", desc: "Have a specific idea? Let's discuss a solution.", price: 0, time: "TBD"}
];

const $ = id => document.getElementById(id);
const eur = n => "€" + n.toLocaleString("en-IE");

/* quote builder */
const opts = $("opts");
SERVICES.forEach(s => opts.insertAdjacentHTML("beforeend",
  `<label class="opt">
    <input type="checkbox" value="${s.id}">
    <span>
      <b>${s.name} <small style="color:var(--accent)">(${s.time})</small></b>
      <small>${s.desc}</small>
    </span>
    <span class="pr">${s.price > 0 ? 'from ' + eur(s.price) : 'Discuss'}</span>
  </label>`));

/* live availability from Firebase (read only) */
const months = $("months");
let map = {};
const draw = () => {
  renderCalendar(months, map);
  const cur = map[todayKey()];
  const text = {busy: "Busy, but taking small projects", full: "Fully booked right now", away: "Away at the moment"}[cur] || "Open for new projects";
  $("status-text").textContent = text;
  $("dot").style.background = cur ? `var(--${cur})` : "var(--open)";
};
draw();
if (configured) {
  const db = getDatabase(initializeApp(firebaseConfig));
  onValue(ref(db, "availability"), snap => { map = snap.val() || {}; $("cal-msg").textContent = ""; draw(); },
    () => { $("cal-msg").textContent = "Live availability is unavailable right now. Please just ask me."; });
} else {
  $("cal-msg").textContent = "Calendar not connected yet.";
}

/* before / after */
const ba = $("ba");
ba.querySelector("input").addEventListener("input", e => ba.style.setProperty("--pos", e.target.value + "%"));

/* contact */
$("mail").textContent = EMAIL; $("mail").href = "mailto:" + EMAIL;
$("form").addEventListener("submit", e => {
  e.preventDefault();
  const sel = picked();
  const lines = ["Hi Michael,", "", $("f-msg").value.trim(), "",
    "Name: " + $("f-name").value.trim(),
    "Business: " + ($("f-biz").value.trim() || "n/a"),
    "Email: " + $("f-email").value.trim()];
  if (sel.length) lines.push("", "Services I’m interested in: " + sel.map(s => s.name).join(", ") + " (estimate " + $("total").textContent + ")");
  location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent("Enquiry from " + $("f-name").value.trim()) + "&body=" + encodeURIComponent(lines.join("\n"));
  $("toast").textContent = "Your email app should open now. If it doesn’t, copy my address below and write to me directly.";
});
$("copy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(EMAIL); $("toast").textContent = "Email address copied."; }
  catch { $("toast").textContent = "Couldn’t copy automatically. My address is " + EMAIL + "."; }
});

/* theme */
const root = document.documentElement;
try { const t = localStorage.getItem("theme"); if (t) root.dataset.theme = t; } catch {}
$("theme").addEventListener("click", () => {
  const dark = (root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")) === "dark";
  root.dataset.theme = dark ? "light" : "dark";
  try { localStorage.setItem("theme", root.dataset.theme); } catch {}
});
$("yr").textContent = new Date().getFullYear();
