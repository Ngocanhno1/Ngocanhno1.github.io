/* Nhạc nền tự tổng hợp (Web Audio) cho các game của Lucie & Lucas.
   Cách gắn: <script src="../anh-chung/nhac-nen.js" data-bpm="120" data-goc="C" data-not="C5 E5 G5 ..." data-kieu="marimba"></script>
   - Giai điệu, nhịp và nhạc cụ theo gợi ý của Gemini cho từng game.
   - Bắt đầu sau cú bấm đầu tiên; nút tròn góc dưới bên trái để tắt/bật (máy nhớ lựa chọn). */
(function () {
  if (window.__nhacNen) return; window.__nhacNen = true;
  var me = document.currentScript, d = (me && me.dataset) || {};
  var BPM = +d.bpm || 112, KIEU = d.kieu || "marimba", AM = +(d.am || 0.11);
  var NOTES = (d.not || "C5 D5 E5 G5 A5 G5 E5 D5 C5 E5 G5 A5 G5 E5 D5 C5").trim().split(/\s+/);
  var NAMES = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  function freq(n) { var m = /^([A-G])(#|b)?(\d)$/.exec(n); if (!m) return 0; var s = NAMES[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) + (+m[3] + 1) * 12; return 440 * Math.pow(2, (s - 69) / 12); }
  var root = NAMES[(d.goc || NOTES[0] || "C")[0]] || 0;
  var BASS = [0, 7, 9, 5].map(function (s) { return 440 * Math.pow(2, (root + s + 36 - 69) / 12); });   // I - V - vi - IV, quãng tám thấp
  var RHY = [1, 1, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 2];   // nhịp móc đơn/đen xen kẽ cho đỡ đều
  var ctx, out, on = true, timer = null, nextT = 0, i = 0, beat = 0, pass = 0;
  try { on = localStorage.getItem("nhacNen") !== "tat"; } catch (e) {}

  function voice(t, f, dur, vol) {
    if (!f) return;
    var o = ctx.createOscillator(), g = ctx.createGain(), o2, g2;
    if (KIEU === "dantranh") {   // đàn tranh: tiếng gảy, rung nhẹ
      o.type = "sawtooth"; var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(f * 6, t); lp.frequency.exponentialRampToValueAtTime(f * 1.5, t + 0.4);
      o.frequency.setValueAtTime(f * 1.01, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.08);
      o.connect(lp); lp.connect(g);
    } else { o.type = KIEU === "glock" ? "sine" : "triangle"; o.frequency.value = f; o.connect(g); }
    var dec = KIEU === "glock" ? 1.2 : KIEU === "kalimba" ? 0.9 : 0.55;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(dur, dec));
    g.connect(out); o.start(t); o.stop(t + Math.max(dur, dec) + 0.05);
    o2 = ctx.createOscillator(); g2 = ctx.createGain(); o2.type = "sine";   // bồi âm cho tiếng ấm, giống gõ gỗ/kim loại
    o2.frequency.value = f * (KIEU === "glock" ? 2.76 : KIEU === "xylophone" ? 3 : 4);
    g2.gain.setValueAtTime(vol * 0.35, t); g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);
    o2.connect(g2); g2.connect(out); o2.start(t); o2.stop(t + 0.15);
  }
  function hat(t, v) {
    var b = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate), a = b.getChannelData(0);
    for (var k = 0; k < a.length; k++) a[k] = (Math.random() * 2 - 1) * (1 - k / a.length);
    var s = ctx.createBufferSource(), h = ctx.createBiquadFilter(), g = ctx.createGain(); s.buffer = b; h.type = "highpass"; h.frequency.value = 6000; g.gain.value = v;
    s.connect(h); h.connect(g); g.connect(out); s.start(t);
  }
  function tick() {
    var spb = 60 / BPM;
    while (nextT < ctx.currentTime + 0.25) {
      var len = RHY[i % RHY.length] * spb, n = NOTES[i % NOTES.length], f = freq(n);
      if (pass % 4 === 3 && i % 2 === 1) f *= 0.5;   // lượt thứ 4 đổi màu giai điệu cho đỡ nhàm
      voice(nextT, f, len * 0.9, 0.5);
      var b0 = Math.floor(beat), b1 = Math.floor(beat + RHY[i % RHY.length]);
      for (var b = b0; b < b1; b++) {
        var tb = nextT + (b - beat) * spb;
        if (b % 4 === 0) voice(tb, BASS[Math.floor(b / 4) % 4], spb * 3.5, 0.35);
        hat(tb + spb / 2, 0.06);
      }
      beat += RHY[i % RHY.length]; nextT += len; i++;
      if (i % NOTES.length === 0) { pass++; nextT += spb; beat += 1; }   // nghỉ 1 phách giữa các câu nhạc
    }
  }
  function play() {
    if (!on) return;
    if (!ctx) { var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; ctx = new AC(); out = ctx.createGain(); out.gain.value = AM; out.connect(ctx.destination); }
    if (ctx.state === "suspended") ctx.resume();
    if (!timer) { nextT = ctx.currentTime + 0.1; timer = setInterval(tick, 60); }
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } if (ctx) ctx.suspend(); }
  var btn = document.createElement("button");
  btn.setAttribute("aria-label", "Bật hoặc tắt nhạc nền"); btn.setAttribute("data-giu-icon", "");
  btn.style.cssText = "position:fixed;" + (d.vitri || "left:14px;bottom:14px") + ";z-index:9999;width:50px;height:50px;border-radius:50%;border:3px solid #f7c948;background:rgba(30,15,60,.82);color:#ffe066;display:grid;place-items:center;cursor:pointer;padding:0";
  function draw() {
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M9 17.5A2.5 2.5 0 1 1 7 15V5l12-2v11.5a2.5 2.5 0 1 1-2-2.45V7.2l-8 1.35z"/>' +
      (on ? "" : '<path d="M3 3l18 18" stroke="#ff6b6b" stroke-width="2.6"/>') + "</svg>";
    btn.title = on ? "Đang bật nhạc nền" : "Đã tắt nhạc nền";
  }
  btn.onclick = function (e) { e.stopPropagation(); on = !on; try { localStorage.setItem("nhacNen", on ? "bat" : "tat"); } catch (x) {} draw(); on ? play() : stop(); };
  draw();
  function mount() { document.body.appendChild(btn); }
  if (document.body) mount(); else document.addEventListener("DOMContentLoaded", mount);
  ["pointerdown", "keydown"].forEach(function (ev) { document.addEventListener(ev, function first() { document.removeEventListener(ev, first, true); play(); }, true); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) { if (ctx) ctx.suspend(); } else if (on && timer && ctx) ctx.resume(); });
})();
