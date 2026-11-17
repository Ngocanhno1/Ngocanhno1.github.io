/* Nền "thạch" kiểu Antigravity cho trang của Lucie & Lucas (tự viết lại, không dùng mã của Google).
   - Nền: chấm xám li ti đứng yên.
   - Quanh con trỏ: một vành tròn lớn gồm các vạch màu chĩa ra từ tâm (xanh dương -> tím -> đỏ cam).
   - Vành đi theo con trỏ bằng lò xo có nảy, vòng ngoài trễ hơn vòng trong -> rung rinh như thạch.
   - Không có chuột (TV) thì vành tự lượn chậm; tab ẩn thì dừng; máy bật "giảm chuyển động" thì đứng yên. */
(function () {
  if (window.__nenHat) return; window.__nenHat = true;
  var cv = document.createElement("canvas"), dotsCv = document.createElement("canvas");
  cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;z-index:-1;pointer-events:none";
  var g = cv.getContext("2d"), gd = dotsCv.getContext("2d");
  var W = 0, H = 0, DPR = 1, P = [], R = [], RMAX = 400, still = false;
  try { still = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var mouse = { x: 0, y: 0, t: 0 };
  var C = { x: 0, y: 0, vx: 0, vy: 0 };   // tâm vành: lò xo nảy đuổi theo con trỏ

  function sstep(a, b, x) { x = Math.max(0, Math.min(1, (x - a) / (b - a))); return x * x * (3 - 2 * x); }
  function build() {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    W = innerWidth; H = innerHeight;
    [cv, dotsCv].forEach(function (c) { c.width = W * DPR; c.height = H * DPR; });
    g.setTransform(DPR, 0, 0, DPR, 0, 0); gd.setTransform(DPR, 0, 0, DPR, 0, 0);
    gd.clearRect(0, 0, W, H); gd.fillStyle = "rgba(70,70,90,.32)";   // chấm xám nền, vẽ sẵn một lần
    var n = Math.round(W * H / 2600);
    for (var i = 0; i < n; i++) { gd.beginPath(); gd.arc(Math.random() * W, Math.random() * H, 0.5 + Math.random() * 0.7, 0, 6.283); gd.fill(); }
    RMAX = Math.min(W, H) * 0.56;
    var gap = W < 700 ? 24 : 32, spacing = W < 700 ? 24 : 34;
    if (!C.x) { C.x = W * 0.6; C.y = H * 0.55; }
    P = []; R = [];
    var rings = Math.ceil(RMAX / gap);
    for (var k = 0; k <= rings; k++) R.push({ x: C.x, y: C.y });
    for (k = 1; k <= rings; k++) {
      var r = k * gap, m = Math.max(8, Math.round(2 * Math.PI * r / spacing)), sp = (k % 2 ? 1 : -1) * 0.025, off = Math.random() * 6.283;
      for (var j = 0; j < m; j++) P.push({ k: k, r: r + (Math.random() - 0.5) * 6, a: off + j / m * 6.283 + (Math.random() - 0.5) * 0.06, sp: sp, ph: Math.random() * 6.283, s: 0.8 + Math.random() * 0.5 });
    }
  }
  function hue(a) { return 228 + 128 * (1 + Math.cos(a + Math.PI / 4)) / 2; }   // trái-dưới xanh dương, trên-phải đỏ cam

  var last = 0;
  function frame(ts) {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    var dt = Math.min(0.033, (ts - last) / 1000 || 0.016); last = ts;
    var t = ts / 1000, idle = !mouse.t || ts - mouse.t > 5000;
    var tx = idle ? W * (0.55 + 0.17 * Math.sin(t * 0.21)) : mouse.x, ty = idle ? H * (0.55 + 0.13 * Math.sin(t * 0.17 + 1)) : mouse.y;
    C.vx += (tx - C.x) * 95 * dt; C.vy += (ty - C.y) * 95 * dt;   // lò xo nảy: vượt quá một chút rồi rung về như thạch
    var damp = Math.exp(-9 * dt); C.vx *= damp; C.vy *= damp;
    C.x += C.vx * dt; C.y += C.vy * dt;
    R[0].x = C.x; R[0].y = C.y;
    for (var q = 1; q < R.length; q++) {   // vòng ngoài đuổi vòng trong: lan sóng, kéo giãn như thạch
      var lag = Math.min(1, dt * (16 - 11 * q / R.length));
      R[q].x += (R[q - 1].x - R[q].x) * lag; R[q].y += (R[q - 1].y - R[q].y) * lag;
    }
    g.clearRect(0, 0, W, H);
    g.drawImage(dotsCv, 0, 0, W, H);
    g.lineCap = "round";
    var inner = Math.min(W, H) * 0.12, peak = Math.min(W, H) * 0.26;
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      var w = sstep(inner * 0.4, peak, p.r) * (1 - sstep(RMAX * 0.5, RMAX, p.r));   // vành tròn: thưa ở tâm, mờ dần ra ngoài
      if (w < 0.03) continue;
      if (!still) p.a += p.sp * dt;
      var c = R[p.k], rr = p.r * (1 + 0.035 * Math.sin(t * 1.6 - p.r * 0.018) + 0.012 * Math.sin(t * 3 + p.ph));
      var ca = Math.cos(p.a), sa = Math.sin(p.a);
      var x = c.x + ca * rr, y = c.y + sa * rr;
      if (x < -10 || y < -10 || x > W + 10 || y > H + 10) continue;
      var L = (1.2 + 3.3 * w) * p.s, lw = (1 + 1.5 * w) * p.s;
      g.strokeStyle = "hsla(" + hue(p.a).toFixed(0) + ",88%,56%," + (0.85 * w).toFixed(2) + ")";
      g.lineWidth = lw;
      g.beginPath(); g.moveTo(x - ca * L, y - sa * L); g.lineTo(x + ca * L, y + sa * L); g.stroke();
    }
  }
  function mv(x, y) { mouse.x = x; mouse.y = y; mouse.t = performance.now(); }
  addEventListener("pointermove", function (e) { mv(e.clientX, e.clientY); }, { passive: true });
  addEventListener("touchmove", function (e) { var t = e.touches[0]; if (t) mv(t.clientX, t.clientY); }, { passive: true });
  addEventListener("resize", build);
  function start() { document.body.insertBefore(cv, document.body.firstChild); build(); requestAnimationFrame(frame); }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
