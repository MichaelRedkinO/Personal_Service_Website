export const STATUS = ["busy", "full", "away"];
export const LABEL = {open: "open", busy: "busy, small work only", full: "fully booked", away: "away"};
const pad = n => String(n).padStart(2, "0");
export const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayKey = () => keyOf(new Date());

const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
};

// Draws 3 months into `box`. Pass onPick(key) to make days tappable (admin page).
export function renderCalendar(box, map, onPick) {
  box.textContent = "";
  const now = new Date(), today = todayKey();
  for (let m = 0; m < 3; m++) {
    const first = new Date(now.getFullYear(), now.getMonth() + m, 1);
    const title = first.toLocaleString("en-IE", {month: "long", year: "numeric"});
    const month = el("div", "month"), grid = el("div", "grid");
    month.append(el("h3", "", title), grid);
    "MTWTFSS".split("").forEach(c => { const d = el("div", "dn", c); d.setAttribute("aria-hidden", "true"); grid.append(d); });
    for (let i = 0; i < (first.getDay() + 6) % 7; i++) grid.append(el("div"));
    const len = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
    for (let d = 1; d <= len; d++) {
      const key = keyOf(new Date(first.getFullYear(), first.getMonth(), d));
      const s = STATUS.includes(map[key]) ? map[key] : "";
      const day = el(onPick ? "button" : "div", "day " + s + (key < today ? " past" : "") + (key === today ? " today" : ""), String(d));
      day.setAttribute("aria-label", `${d} ${title}, ${LABEL[s || "open"]}`);
      if (onPick) { day.type = "button"; day.addEventListener("click", () => onPick(key)); }
      grid.append(day);
    }
    box.append(month);
  }
}
