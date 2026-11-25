/* The next drop is every Friday at 20:00 Dubai time. */

const dubai = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Dubai",
  hourCycle: "h23",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

/** Dubai wall-clock time, expressed as a UTC timestamp. */
function dubaiWall(now: Date) {
  const o = Object.fromEntries(dubai.formatToParts(now).map((p) => [p.type, p.value]));
  return Date.UTC(+o.year, +o.month - 1, +o.day, +o.hour, +o.minute, +o.second);
}

export function nextDrop(now = new Date()) {
  const wall = dubaiWall(now);
  const offset = wall - Math.floor(now.getTime() / 1000) * 1000;
  const d = new Date(wall);
  const add = (5 - d.getUTCDay() + 7) % 7;
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + add, 20, 0, 0));
  if (target.getTime() <= wall) target.setUTCDate(target.getUTCDate() + 7);
  return target.getTime() - offset;
}

export function splitTime(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}
