export const RAD = Math.PI / 180;
export const DEG = 180 / Math.PI;
export const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
export const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
export const cross = (a, b) => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
export const norm = a => Math.hypot(...a);
export const unit = a => { const n = norm(a); return n ? a.map(v => v / n) : [0, 0, 1]; };
export const qMul = (a, b) => [
  a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1],
  a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0],
  a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3],
  a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]
];
export const qInv = q => [-q[0], -q[1], -q[2], q[3]];
export const qAxis = (axis, a) => [...axis.map(x => x * Math.sin(a/2)), Math.cos(a/2)];
// Right-handed frame: +Y up, +Z nominal forward. q = yaw(Y) pitch(X) roll(Z).
export const attitude = (roll, pitch, yaw) => qMul(qMul(qAxis([0,1,0], yaw*RAD), qAxis([1,0,0], pitch*RAD)), qAxis([0,0,1], roll*RAD));
export function rotate(v, q) {
  const r = qMul(qMul(q, [...v, 0]), qInv(q));
  return r.slice(0,3);
}
export const direction = (az, el) => [Math.sin(az)*Math.cos(el), Math.sin(el), Math.cos(az)*Math.cos(el)];
export const angles = v => [Math.atan2(v[0], v[2]), Math.asin(clamp(unit(v)[1], -1, 1))];
export const separation = (a, b) => Math.acos(clamp(dot(unit(a), unit(b)), -1, 1)) * DEG;
export function rayBox(origin, dir, min, max) {
  let near = 0, far = Infinity;
  for (let i = 0; i < 3; i++) {
    if (Math.abs(dir[i]) < 1e-12) { if (origin[i] < min[i] || origin[i] > max[i]) return false; }
    else {
      let a = (min[i]-origin[i])/dir[i], b = (max[i]-origin[i])/dir[i];
      if (a > b) [a,b] = [b,a];
      near = Math.max(near, a); far = Math.min(far, b);
      if (near > far) return false;
    }
  }
  return far > 1e-6;
}
export function seededRandom(seed) {
  let a = seed >>> 0;
  return () => { a += 0x6D2B79F5; let t = a; t = Math.imul(t ^ t>>>15, t | 1); t ^= t + Math.imul(t ^ t>>>7, t | 61); return ((t ^ t>>>14) >>> 0) / 4294967296; };
}
