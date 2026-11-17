/* Nền hạt màu xoáy theo con chuột (kiểu trang Google Antigravity).
   Gắn: <script src="games/anh-chung/nen-hat.js"></script> — tự vẽ một lớp nền phía sau nội dung.
   - Hàng nghìn vạch màu xếp thành các vòng tròn, xoay chậm; tâm vòng xoáy trôi theo chuột / ngón tay.
   - Chuột đi qua thì hạt dạt ra như gợn nước. Không có chuột (TV) thì tâm tự lượn chậm.
   - Tab ẩn thì dừng vẽ cho đỡ tốn pin; máy bật "giảm chuyển động" thì đứng yên. */
(function () {
  if (window.__nenHat) return; window.__nenHat = true;
  var cv = document.createElement("canvas");
  cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100vw;height:100vh;z-index:-1;pointer-events:none";
  var g = cv.getContext("2d");
  var W = 0, H = 0, DPR = 1, P = [], still = false;
  try { still = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var mouse = { x: -9999, y: -9999, t: 0 }, C = { x: 0, y: 0 }, T = { x: 0, y: 0 };

  function build() {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    W = innerWidth; H = innerHeight;
    cv.width = W * DPR; cv.height = H * DPR; g.setTransform(DPR, 0, 0, DPR, 0, 0);
    P = [];
    var maxR = Math.hypot(W, H) * 0.62, gap = W < 700 ? 22 : 28, budget = Math.min(900, Math.round(W * H / 1500));
    var rings = Math.floor(maxR / gap), per = budget / rings;
    for (var k = 1; k <= rings; k++) {
      var r = k * gap, n = Math.max(6, Math.round(per * (0.35 + 1.3 * k / rings))), sp = (k % 2 ? 1 : -1) * (0.05 + 0.12 / Math.sqrt(k));
      for (var i = 0; i < n; i++) {
        P.push({ r: r + (Math.random() - 0.5) * gap * 0.5, a: (i / n) * Math.PI * 2 + Math.random() * 0.3, sp: sp * (0.8 + Math.random() * 0.4),
          len: 2 + Math.random() * 3.2, w: 1.3 + Math.random() * 1.3, ox: 0, oy: 0, dot: Math.random() < 0.18 });
      }
    }
    if (!C.x) { C.x = T.x = W * 0.55; C.y = T.y = H * 0.42; }
  }
  function color(a, r, dot) {
    if (dot) return "rgba(60,60,80," + 0.35 * fade(r) + ")";
    var h = (230 + ((Math.cos(a) + 1) / 2) * 140) % 360;   // xanh dương bên trái -> tím -> đỏ cam bên phải
    return "hsla(" + h.toFixed(0) + ",85%,58%," + (0.75 * fade(r)).toFixed(3) + ")";
  }
  function fade(r) { var m = Math.min(W, H) * 0.95; return r < 40 ? r / 40 : Math.max(0, 1 - Math.pow(r / m, 2.2)); }

  var last = 0;
  function frame(ts) {
    requestAnimationFrame(frame);
    if (document.hidden) return;
    var dt = Math.min(0.05, (ts - last) / 1000 || 0.016); last = ts;
    var idle = ts - mouse.t > 4000;
    if (idle) { T.x = W * (0.5 + 0.18 * Math.sin(ts / 5200)); T.y = H * (0.42 + 0.12 * Math.sin(ts / 3900)); }
    else { T.x = mouse.x; T.y = mouse.y; }
    C.x += (T.x - C.x) * Math.min(1, dt * 1.6); C.y += (T.y - C.y) * Math.min(1, dt * 1.6);
    g.clearRect(0, 0, W, H);
    g.lineCap = "round";
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      if (!still) p.a += p.sp * dt;
      var ca = Math.cos(p.a), sa = Math.sin(p.a);
      var x = C.x + ca * p.r, y = C.y + sa * p.r * 0.92;
      var dx = x - mouse.x, dy = y - mouse.y, d2 = dx * dx + dy * dy;   // chuột đẩy hạt dạt ra
      if (!idle && d2 < 14400) { var d = Math.sqrt(d2) || 1, f = (120 - d) / 120 * 26; p.ox += (dx / d * f - p.ox) * 0.2; p.oy += (dy / d * f - p.oy) * 0.2; }
      else { p.ox *= 0.92; p.oy *= 0.92; }
      x += p.ox; y += p.oy;
      if (x < -10 || y < -10 || x > W + 10 || y > H + 10) continue;
      g.strokeStyle = color(p.a, p.r, p.dot);
      g.lineWidth = p.dot ? 1.4 : p.w;
      var L = p.dot ? 0.6 : p.len;
      g.beginPath(); g.moveTo(x - sa * L, y + ca * L); g.lineTo(x + sa * L, y - ca * L); g.stroke();
    }
  }
  function mv(x, y) { mouse.x = x; mouse.y = y; mouse.t = performance.now(); }
  addEventListener("pointermove", function (e) { mv(e.clientX, e.clientY); }, { passive: true });
  addEventListener("touchmove", function (e) { var t = e.touches[0]; if (t) mv(t.clientX, t.clientY); }, { passive: true });
  addEventListener("resize", build);
  function start() { document.body.insertBefore(cv, document.body.firstChild); build(); requestAnimationFrame(frame); }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
