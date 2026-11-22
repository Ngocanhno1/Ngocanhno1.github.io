/* Trận đánh BOSS cuối mỗi bài — Thợ Mỏ Nhí. Nửa trên: đấu trường khối vuông; nửa dưới: câu hỏi. */
(function () {
  const BOSSES = [
    { ten: "Slime Lá Xanh", than: "#4ade80", toi: "#15803d", mat: "#052e16", cao: 5, rong: 6, kieu: "slime" },
    { ten: "Bọ Cạp Cát", than: "#e9b45a", toi: "#a16207", mat: "#3b2106", cao: 5, rong: 7, kieu: "bo" },
    { ten: "Người Tuyết Khổng Lồ", than: "#f1f5f9", toi: "#94a3b8", mat: "#0f172a", cao: 8, rong: 6, kieu: "tuyet" },
    { ten: "Khỉ Đá Rừng Rậm", than: "#78716c", toi: "#44403c", mat: "#fde047", cao: 7, rong: 6, kieu: "khi" },
    { ten: "Bạch Tuộc Biển Sâu", than: "#c084fc", toi: "#7e22ce", mat: "#1e1b4b", cao: 7, rong: 7, kieu: "tuoc" },
    { ten: "Rồng Dung Nham Con", than: "#ef4444", toi: "#991b1b", mat: "#fde047", cao: 8, rong: 8, kieu: "rong" },
    { ten: "Gấu Kẹo Dẻo", than: "#f472b6", toi: "#be185d", mat: "#3b0764", cao: 8, rong: 7, kieu: "gau" },
    { ten: "Golem Pha Lê", than: "#67e8f9", toi: "#0e7490", mat: "#f0abfc", cao: 9, rong: 8, kieu: "golem" },
    { ten: "Robot Mặt Trăng", than: "#cbd5e1", toi: "#64748b", mat: "#22d3ee", cao: 9, rong: 7, kieu: "robot" },
    { ten: "Vua Thiên Hà", than: "#6366f1", toi: "#312e81", mat: "#fde047", cao: 10, rong: 9, kieu: "vua" }
  ];
  const CANH = [["#8fd3ff", "#5dbb3c", "#8b5a2b"], ["#ffd98f", "#e8cf8a", "#c49a5a"], ["#dff1ff", "#f4f8ff", "#9aa7b8"], ["#9be7b0", "#2fae3a", "#5a3a1a"],
    ["#1e6fa8", "#e9d9a8", "#2d5a7a"], ["#ff9a6a", "#5a2a1a", "#3a1414"], ["#ffe0f4", "#ffd1ec", "#e88ab8"], ["#2a1a55", "#c8a8ff", "#3a2a6a"],
    ["#0b0b22", "#dcdce6", "#6a6a7a"], ["#140a2e", "#7ae87a", "#5a4ab8"]];
  const MON_MAU = { "Toán": "#2563eb", "Tiếng Việt": "#dc2626", "Tiếng Anh": "#16a34a" };
  const coChuAnh = s => /[a-z]{3,}/i.test(s) && !/[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(s.replace(/'[^']*'|"[^"]*"/g, ""));
  const tron = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  function start(o) {
    const B = BOSSES[Math.max(0, Math.min(9, (o.man || 1) - 1))], C = CANH[Math.max(0, Math.min(9, (o.man || 1) - 1))];
    const at = o.amThanh || {}, kb = k => { try { at[k] && at[k](); } catch (e) {} };
    const noi = (t, l) => { try { o.noi && o.noi(t, l); } catch (e) {} };
    const tim0 = o.child === "lucas" ? 4 : 3;
    const S = { mauQuai: o.soCau, mauQuaiMax: o.soCau, tim: tim0, idx: 0, hang: o.cauHoi.slice(), sai: [], ds: [], khoa: true, xong: false,
      anim: null, t0: performance.now(), hat: [], so: [], rung: 0, chop: 0, chopDo: 0, ketThuc: null };

    const root = document.createElement("div");
    root.style.cssText = "position:fixed;inset:0;z-index:99990;display:flex;flex-direction:column;background:#120c06;font-family:'Baloo 2',system-ui,sans-serif;color:#fff;user-select:none";
    root.innerHTML = `<canvas style="display:block;width:100%;flex:0 0 auto;image-rendering:pixelated"></canvas>
<div class="bq" style="flex:1;display:flex;flex-direction:column;gap:1.2vh;padding:1.4vh 2vw 2vh;background:#3b2a1a;border-top:6px solid #1b120a;box-shadow:inset 0 0 0 4px #7a5530;min-height:0">
 <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span class="bm" style="border-radius:8px;padding:2px 12px;font-weight:800;font-size:clamp(14px,1.8vw,22px)"></span>
  <span class="bt" style="font-weight:700;color:#fde68a;font-size:clamp(14px,1.8vw,22px)"></span><span style="flex:1"></span>
  <button class="bd" style="font:inherit;font-weight:800;font-size:clamp(14px,1.7vw,20px);border:4px solid #1b120a;border-radius:8px;background:linear-gradient(#9a9a9a,#6b6b6b);color:#fff;padding:2px 14px;cursor:pointer">🔊 Đọc</button></div>
 <div class="bc" style="font-weight:800;font-size:clamp(18px,2.6vw,34px);line-height:1.25;text-shadow:0 2px 0 #000"></div>
 <div class="ba" style="display:grid;grid-template-columns:1fr 1fr;gap:1.2vh 1.4vw;flex:1;min-height:0"></div>
 <div class="bg" style="min-height:1.4em;font-weight:700;font-size:clamp(14px,1.8vw,22px)"></div></div>`;
    document.body.appendChild(root);
    const cv = root.querySelector("canvas"), g = cv.getContext("2d"), q$ = s => root.querySelector(s);
    let W = 0, H = 0, P = 1;
    function doCo() {
      const dt = innerWidth < 700 ? 0.42 : 0.5; H = Math.round(innerHeight * dt); W = innerWidth; P = Math.min(2, devicePixelRatio || 1);
      cv.width = W * P; cv.height = H * P; cv.style.height = H + "px"; g.setTransform(P, 0, 0, P, 0, 0); g.imageSmoothingEnabled = false;
    }
    doCo(); addEventListener("resize", doCo);
    const mat = new Image(); if (o.faceUrl) mat.src = o.faceUrl;

    /* ---------- vẽ ---------- */
    const o_ = (x, y, w, h, c) => { g.fillStyle = c; g.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h)); };
    function nen(t) {
      const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, C[0]); gr.addColorStop(1, "#000"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      if (o.man >= 9) for (let i = 0; i < 40; i++) o_((i * 97) % W, (i * 53) % (H * 0.6), 2, 2, i % 3 ? "#fff" : "#fde047");
      const s = Math.max(16, H / 9), y0 = H * 0.78;
      for (let x = 0; x < W + s; x += s) { o_(x, y0, s, s * 0.35, C[1]); o_(x, y0 + s * 0.35, s, H, C[2]); o_(x + s * 0.2, y0 + s * 0.6, s * 0.2, s * 0.2, "rgba(0,0,0,.18)"); o_(x, y0, 1, H, "rgba(0,0,0,.15)"); }
    }
    function nguoi(x, y, s, t) {
      const nhun = Math.sin(t * 6) * s * 0.03, ao = o.mauAo || "#3b82f6";
      o_(x - s * 0.18, y - s * 0.45, s * 0.16, s * 0.45, "#1e293b"); o_(x + s * 0.02, y - s * 0.45, s * 0.16, s * 0.45, "#1e293b");
      o_(x - s * 0.24, y - s * 0.95 + nhun, s * 0.48, s * 0.52, ao); o_(x - s * 0.24, y - s * 0.95 + nhun, s * 0.48, s * 0.06, "rgba(255,255,255,.25)");
      // tay cầm cuốc
      const vung = S.anim && S.anim.k === "danh" ? Math.sin(Math.min(1, S.anim.p * 2) * Math.PI) : 0;
      g.save(); g.translate(x + s * 0.24, y - s * 0.85 + nhun); g.rotate(-0.9 + vung * 2.2);
      o_(-s * 0.06, 0, s * 0.12, s * 0.38, ao); o_(-s * 0.03, s * 0.2, s * 0.06, s * 0.55, "#7a5230");
      o_(-s * 0.22, s * 0.68, s * 0.44, s * 0.1, o.mauCuoc || "#5decf5"); o_(-s * 0.26, s * 0.62, s * 0.08, s * 0.12, o.mauCuoc || "#5decf5"); o_(s * 0.18, s * 0.62, s * 0.08, s * 0.12, o.mauCuoc || "#5decf5");
      g.restore();
      o_(x - s * 0.36, y - s * 0.9 + nhun, s * 0.12, s * 0.4, ao);
      const hx = x - s * 0.26, hy = y - s * 1.47 + nhun, hs = s * 0.52;
      o_(hx, hy, hs, hs, "#3b2314");
      if (mat.complete && mat.naturalWidth) { g.save(); g.beginPath(); g.rect(hx + hs * 0.08, hy + hs * 0.1, hs * 0.84, hs * 0.84); g.clip(); g.drawImage(mat, hx + hs * 0.08, hy + hs * 0.1, hs * 0.84, hs * 0.84); g.restore(); }
      else { o_(hx + hs * 0.1, hy + hs * 0.25, hs * 0.8, hs * 0.65, "#f1c27d"); o_(hx + hs * 0.25, hy + hs * 0.45, hs * 0.12, hs * 0.12, "#000"); o_(hx + hs * 0.63, hy + hs * 0.45, hs * 0.12, hs * 0.12, "#000"); }
    }
    function quai(x, y, s, t) {
      if (S.mauQuai <= 0 && S.ketThuc) return;
      const u = s / 8, R = B.rong * u, Hh = B.cao * u, nhun = Math.abs(Math.sin(t * 3.2)) * u * 0.6, x0 = x - R / 2, y0 = y - Hh - nhun;
      const trang = S.chop > 0 && Math.floor(t * 20) % 2 === 0;
      const th = trang ? "#fff" : B.than, toi = trang ? "#fff" : B.toi;
      if (B.kieu === "slime") { o_(x0, y0 + Hh * 0.25, R, Hh * 0.75, th); o_(x0 + u, y0, R - 2 * u, Hh * 0.3, th); o_(x0 + u * 0.6, y0 + Hh * 0.35, u, u, "rgba(255,255,255,.5)"); o_(x0 + R * 0.3, y0 - u * 0.8, u * 0.6, u, "#16a34a"); o_(x0 + R * 0.38, y0 - u * 1.2, u * 1.4, u * 0.6, "#4ade80"); }
      else if (B.kieu === "tuyet") { o_(x0 + u, y0 + Hh * 0.45, R - 2 * u, Hh * 0.55, th); o_(x0 + u * 1.5, y0, R - 3 * u, Hh * 0.45, th); o_(x0 + u * 1.3, y0 - u * 0.8, R - 2.6 * u, u, "#1e293b"); o_(x0 + R / 2 - u * 0.3, y0 + Hh * 0.25, u * 1.6, u * 0.5, "#f97316"); o_(x0 - u * 0.8, y0 + Hh * 0.5, u * 1.8, u * 0.4, "#7a5230"); o_(x0 + R - u, y0 + Hh * 0.5, u * 1.8, u * 0.4, "#7a5230"); }
      else if (B.kieu === "tuoc") { o_(x0, y0, R, Hh * 0.6, th); for (let i = 0; i < 5; i++) o_(x0 + i * R / 5 + u * 0.1, y0 + Hh * 0.6, R / 5 - u * 0.3, Hh * 0.4 * (0.7 + 0.3 * Math.sin(t * 5 + i)), toi); }
      else {
        o_(x0 + u * 0.5, y0 + Hh * 0.4, R - u, Hh * 0.6, th); o_(x0 + u, y0, R - 2 * u, Hh * 0.45, th); o_(x0 + u * 1.5, y0 + Hh * 0.55, R - 3 * u, Hh * 0.3, toi);
        o_(x0 - u * 0.4, y0 + Hh * 0.45, u * 1.2, Hh * 0.35, toi); o_(x0 + R - u * 0.8, y0 + Hh * 0.45, u * 1.2, Hh * 0.35, toi);
        if (B.kieu === "bo") { o_(x0 + R - u, y0 - u * 2, u, u * 2.4, toi); o_(x0 + R - u * 2, y0 - u * 2.6, u * 2, u, "#7c2d12"); }
        if (B.kieu === "khi" || B.kieu === "gau") { o_(x0 + u * 0.6, y0 - u * 0.8, u * 1.4, u * 1.2, toi); o_(x0 + R - u * 2, y0 - u * 0.8, u * 1.4, u * 1.2, toi); }
        if (B.kieu === "rong") { o_(x0 + u * 1.2, y0 - u * 1.4, u * 0.8, u * 1.6, "#fde047"); o_(x0 + R - u * 2, y0 - u * 1.4, u * 0.8, u * 1.6, "#fde047"); const c = Math.sin(t * 4) * u; o_(x0 - u * 2, y0 + Hh * 0.2 + c, u * 2, u * 2.4, "#f97316"); o_(x0 + R, y0 + Hh * 0.2 - c, u * 2, u * 2.4, "#f97316"); }
        if (B.kieu === "golem") for (let i = 0; i < 4; i++) o_(x0 + u * (1 + i * 1.6), y0 - u * (0.6 + (i % 2)), u * 0.9, u * (1 + (i % 2)), "#f0abfc");
        if (B.kieu === "robot") { o_(x0 + R / 2 - u * 0.15, y0 - u * 1.8, u * 0.3, u * 1.8, toi); o_(x0 + R / 2 - u * 0.5, y0 - u * 2.4, u, u, Math.floor(t * 3) % 2 ? "#ef4444" : "#fca5a5"); o_(x0 + u * 1.6, y0 + Hh * 0.62, R - 3.2 * u, u * 0.8, "#22d3ee"); }
        if (B.kieu === "vua") { o_(x0 + u, y0 - u * 0.8, R - 2 * u, u * 0.8, "#fde047"); for (let i = 0; i < 4; i++) o_(x0 + u + i * (R - 3 * u) / 3, y0 - u * 2, u, u * 1.4, "#fde047"); o_(x0 + R / 2 - u * 0.4, y0 - u * 1.6, u * 0.8, u * 0.8, "#ef4444"); }
      }
      // mắt chớp + miệng
      const chop = (t % 3.2) < 0.15, my = y0 + Hh * (B.kieu === "tuoc" ? 0.25 : 0.18);
      [x0 + R * 0.28, x0 + R * 0.6].forEach(ex => { o_(ex, my, u * 1.2, chop ? u * 0.25 : u * 1.2, "#fff"); if (!chop) o_(ex + u * 0.4, my + u * 0.35, u * 0.6, u * 0.6, B.mat); });
      o_(x0 + R * 0.36, my + u * 1.9, R * 0.3, u * 0.45, "#1b120a");
      o_(x0 + R * 0.4, my + u * 1.9, u * 0.4, u * 0.4, "#fff"); o_(x0 + R * 0.58, my + u * 1.9, u * 0.4, u * 0.4, "#fff");
    }
    function thanhMau(x, y, w, ten, a, b, mau, la) {
      g.font = `800 ${Math.max(12, H * 0.055)}px 'Baloo 2',system-ui`; g.fillStyle = "#fff"; g.textAlign = la ? "left" : "right";
      g.fillText(ten, la ? x : x + w, y - 6);
      o_(x, y, w, H * 0.045, "#1b120a"); o_(x + 3, y + 3, (w - 6) * Math.max(0, a / b), H * 0.045 - 6, mau);
      for (let i = 1; i < b; i++) o_(x + 3 + (w - 6) * i / b, y + 3, 2, H * 0.045 - 6, "rgba(0,0,0,.35)");
    }
    function chu(text, size, mau, y, dich) {
      g.save(); g.font = `800 ${size}px 'Baloo 2',system-ui`; g.textAlign = "center"; g.lineWidth = size * 0.14; g.strokeStyle = "#1b120a";
      g.strokeText(text, W / 2 + (dich || 0), y); g.fillStyle = mau; g.fillText(text, W / 2 + (dich || 0), y); g.restore();
    }
    let raf = 0, tTruoc = performance.now();
    function khung(now) {
      raf = requestAnimationFrame(khung);
      const dt = Math.min(0.05, (now - tTruoc) / 1000); tTruoc = now; const t = now / 1000;
      g.save(); if (S.rung > 0) { S.rung -= dt; g.translate((Math.random() - 0.5) * 10 * S.rung * 3, (Math.random() - 0.5) * 8 * S.rung * 3); }
      nen(t);
      const s = H * 0.42, nenY = H * 0.78; let px = W * 0.25, qx = W * 0.72;
      if (S.anim) { S.anim.p += dt / S.anim.d; const p = Math.min(1, S.anim.p), lao = Math.sin(p * Math.PI);
        if (S.anim.k === "danh") px += lao * (qx - px - s * 0.7); else if (S.anim.k === "huc") qx -= lao * (qx - px - s * 0.6);
        if (p >= 1) { const f = S.anim.f; S.anim = null; f && f(); } }
      nguoi(px, nenY, s, t);
      quai(qx, nenY, s * 1.15, t);
      if (S.chop > 0) S.chop -= dt;
      for (let i = S.hat.length - 1; i >= 0; i--) { const h = S.hat[i]; h.vy += 900 * dt; h.x += h.vx * dt; h.y += h.vy * dt; h.l -= dt; o_(h.x, h.y, h.s, h.s, h.c); if (h.l <= 0) S.hat.splice(i, 1); }
      for (let i = S.so.length - 1; i >= 0; i--) { const n = S.so[i]; n.y -= 60 * dt; n.l -= dt; g.globalAlpha = Math.max(0, n.l); chu(n.t, H * 0.11, n.c, n.y, n.x - W / 2); g.globalAlpha = 1; if (n.l <= 0) S.so.splice(i, 1); }
      g.restore();
      if (S.chopDo > 0) { S.chopDo -= dt; g.fillStyle = `rgba(239,68,68,${S.chopDo})`; g.fillRect(0, 0, W, H); }
      const bw = Math.min(W * 0.38, 420);
      thanhMau(W * 0.03, H * 0.1, bw, (o.child === "lucas" ? "Lucas" : "Lucie") + " ♥ " + S.tim, S.tim, tim0, "#ef4444", true);
      thanhMau(W * 0.97 - bw, H * 0.1, bw, B.ten, S.mauQuai, S.mauQuaiMax, "#a855f7", false);
      const vao = (now - S.t0) / 1000;
      if (vao < 1.6) { const k = Math.min(1, vao / 0.4); g.fillStyle = `rgba(0,0,0,${0.5 * (1 - Math.max(0, vao - 1.2) / 0.4)})`; g.fillRect(0, 0, W, H);
        chu("BOSS MÀN " + o.man, H * 0.13, "#fde047", H * 0.42, (1 - k) * -W); chu(B.ten, H * 0.1, "#fff", H * 0.58, (1 - k) * W); if (vao > 0.4 && vao < 1) S.rung = 0.1; }
      if (S.ketThuc) chu(S.ketThuc.text, H * 0.16, S.ketThuc.mau, H * 0.45 + Math.sin(t * 5) * 6);
    }
    raf = requestAnimationFrame(khung);
    function no(x, y, mau, n, manh) { for (let i = 0; i < n; i++) S.hat.push({ x, y, vx: (Math.random() - 0.5) * 600 * (manh || 1), vy: -Math.random() * 500 * (manh || 1), l: 0.9 + Math.random() * 0.5, s: 4 + Math.random() * 8, c: mau[i % mau.length] }); }

    /* ---------- câu hỏi ---------- */
    let Q = null, foc = 0;
    function hienCau() {
      if (S.idx >= S.hang.length) { if (!S.sai.length) S.sai = o.cauHoi.slice(); S.hang = S.hang.concat(tron(S.sai)); S.sai = []; }
      Q = S.hang[S.idx]; window.__bossQ = Q; const opts = tron([Q.dung, ...Q.sai.filter(x => x && x !== Q.dung).slice(0, 3)]); Q.opts = opts;
      const bm = q$(".bm"); bm.textContent = Q.mon; bm.style.background = MON_MAU[Q.mon] || "#7c3aed";
      q$(".bt").textContent = "Câu " + (S.mauQuaiMax - S.mauQuai + 1) + "/" + S.mauQuaiMax + " · Đánh bại " + B.ten + "!";
      q$(".bc").textContent = Q.q; q$(".bg").textContent = "";
      const box = q$(".ba"); box.innerHTML = "";
      opts.forEach((x, i) => { const b = document.createElement("button");
        b.style.cssText = "font:inherit;font-weight:800;font-size:clamp(16px,2.2vw,30px);border:4px solid #1b120a;border-radius:10px;background:linear-gradient(#a3a3a3,#737373);color:#fff;text-shadow:0 2px 0 #000;cursor:pointer;display:flex;align-items:center;gap:10px;padding:4px 14px;text-align:left;min-height:0";
        b.innerHTML = `<i style="font-style:normal;background:#1b120a;border-radius:6px;padding:0 10px;color:#fde047">${i + 1}</i><span></span>`; b.querySelector("span").textContent = x;
        b.onclick = () => chon(i); box.appendChild(b); });
      datFoc(0); S.khoa = false;
      if (o.tuDoc) doc();
    }
    function datFoc(i) { const bs = [...q$(".ba").children]; foc = (i + 4) % bs.length; bs.forEach((b, k) => b.style.outline = k === foc ? "5px solid #fde047" : "none"); }
    function doc() { if (!Q) return; const t = Q.q + ". " + Q.opts.map((x, i) => "Số " + (i + 1) + ": " + x).join(". "); noi(t, Q.mon === "Tiếng Anh" && coChuAnh(Q.q) ? "en-US" : "vi-VN"); }
    q$(".bd").onclick = doc;
    function chon(i) {
      if (S.khoa || !Q || S.xong) return; S.khoa = true;
      const ok = Q.opts[i] === Q.dung, bs = [...q$(".ba").children];
      bs.forEach((b, k) => { b.style.outline = "none"; if (Q.opts[k] === Q.dung) b.style.background = "linear-gradient(#4ade80,#16a34a)"; else if (k === i) b.style.background = "linear-gradient(#f87171,#b91c1c)"; else b.style.opacity = ".5"; });
      S.ds.push({ q: Q.q, ok }); S.idx++;
      if (ok) {
        q$(".bg").textContent = "Chính xác! Tấn công!"; q$(".bg").style.color = "#86efac";
        S.anim = { k: "danh", p: 0, d: 0.7, f: () => {} };
        setTimeout(() => { kb("hit"); S.mauQuai--; S.chop = 0.4; S.rung = 0.25; no(W * 0.68, H * 0.5, [B.than, B.toi, "#fff", "#fde047"], 26);
          S.so.push({ t: "-1", x: W * 0.72, y: H * 0.35, l: 1, c: "#fde047" });
          if (S.mauQuai <= 0) thang(); else setTimeout(hienCau, 650); }, 330);
      } else {
        S.sai.push(Q); kb("wrong");
        q$(".bg").textContent = "Chưa đúng. " + (Q.giai || ("Đáp án: " + Q.dung)); q$(".bg").style.color = "#fca5a5";
        S.anim = { k: "huc", p: 0, d: 0.7 };
        setTimeout(() => { kb("hurt"); S.tim--; S.chopDo = 0.45; S.rung = 0.3; S.so.push({ t: "-1 ♥", x: W * 0.28, y: H * 0.35, l: 1, c: "#f87171" });
          if (S.tim <= 0) thua(); else setTimeout(hienCau, 1300); }, 350);
      }
    }
    function thang() {
      S.xong = true; S.ketThuc = { text: "CHIẾN THẮNG!", mau: "#fde047" }; kb("win"); noi("Chiến thắng! Con đã đánh bại " + B.ten + "!", "vi-VN");
      no(W * 0.72, H * 0.55, [B.than, B.toi, "#fff"], 70, 1.4);
      let k = 0; const ph = setInterval(() => { no(W * (0.2 + Math.random() * 0.6), H * (0.2 + Math.random() * 0.3), ["#fde047", "#f472b6", "#60a5fa", "#4ade80"], 30); if (++k > 6) clearInterval(ph); }, 300);
      setTimeout(() => ket(true), 2800);
    }
    function thua() { S.xong = true; S.ketThuc = { text: "Thử lại nhé!", mau: "#fca5a5" }; setTimeout(() => ket(false), 2200); }
    function ket(thangKQ) {
      cancelAnimationFrame(raf); removeEventListener("resize", doCo); removeEventListener("keydown", phim, true); root.remove();
      try { o.onDone && o.onDone({ thang: thangKQ, dung: S.ds.filter(x => x.ok).length, tong: o.soCau, ds: S.ds }); } catch (e) { console.warn(e); }
    }
    function phim(e) {
      const k = e.key; e.stopPropagation();
      if (/^[1-4]$/.test(k)) { e.preventDefault(); chon(+k - 1); return; }
      if (k === "ArrowLeft" || k === "ArrowRight") { e.preventDefault(); datFoc(foc ^ 1); return; }
      if (k === "ArrowUp" || k === "ArrowDown") { e.preventDefault(); datFoc(foc ^ 2); return; }
      if (k === "Enter" || k === " ") { e.preventDefault(); chon(foc); }
    }
    addEventListener("keydown", phim, true);
    setTimeout(hienCau, 1600);
  }
  window.BossFight = { start };
  window.__bossTest = function () { start({ child: "lucie", faceUrl: "", man: 6, bai: 20, soCau: 3, cauHoi: [{ mon: "Toán", q: "2 + 3 = ?", dung: "5", sai: ["4", "6", "7"], giai: "2 + 3 = 5" }, { mon: "Tiếng Việt", q: "Từ nào chỉ màu sắc?", dung: "Xanh", sai: ["Chạy", "Bàn", "Nhanh"], giai: "Xanh là màu" }, { mon: "Tiếng Anh", q: "'cat' là con gì?", dung: "Con mèo", sai: ["Con chó", "Con gà", "Con cá"], giai: "cat = con mèo" }], mauAo: "#ff5fa8", mauCuoc: "#5decf5", noi: function () {}, amThanh: {}, tuDoc: false, onDone: function (k) { window.__bossKQ = k; } }); };
})();
