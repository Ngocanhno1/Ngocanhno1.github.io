/* Chế độ "Chơi bằng iPad" cho Đua Xe Tia Chớp (phần chạy trên TV).
   - TV tạo phòng (mã 4 số), hiện 2 mã QR: Lucie quét mã hồng, Lucas quét mã xanh -> mở tay-lai.html trên iPad.
   - iPad gửi lệnh (đổi làn, chọn đáp án, ga, nitro) vào Firebase: <phòng>/lenh/<bé>; TV nghe bằng EventSource.
   - TV gửi trạng thái (câu hỏi, kết quả, hạng, tốc độ) vào <phòng>/man/<bé> để iPad hiện.
   - Dùng kho Firebase của gia đình (cùng kho ví CIECAS), REST thuần, không cần thư viện.
   Chạy thử: thêm ?kenhgoc=<URL gốc> vào địa chỉ trang để dùng máy chủ giả. */
(function () {
  if (!window.G2 && typeof G2 === "undefined") return;
  var qs = new URLSearchParams(location.search);
  var GOC = qs.get("kenhgoc") || "https://lucie-lucas-ciecas-default-rtdb.asia-southeast1.firebasedatabase.app/gd_hh1g8b83gym1g74zmily/duaXe/";
  var KIDS = ["lucie", "lucas"];
  var R = { ma: null, base: null, on: false, esL: null, esM: null, lastN: {}, seen: {}, sent: {}, kq: {}, timer: null, hb: null };
  window.__ipad = R;

  // ---------- giao diện ----------
  var css = document.createElement("style");
  css.textContent =
    ".char.ipad{background:linear-gradient(135deg,#0ea5e9 0%,#6366f1 55%,#ec4899 100%);box-shadow:0 8px 0 #3730a3}" +
    ".char.ipad .tab{font-size:2.6em;line-height:1.1}" +
    "#ipadRoom{position:fixed;inset:0;z-index:55;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2vh;padding:3vh 3vw;" +
    "background:radial-gradient(circle at 50% 120%,rgba(56,189,248,.45),transparent 55%),linear-gradient(160deg,#0b1a40 0,#261a6b 60%,#4a1b6b 100%)}" +
    "#ipadRoom h2{font-size:clamp(28px,4.4vw,64px);color:#ffe14d;text-shadow:0 4px 0 #c2410c;text-align:center;line-height:1}" +
    "#ipadRoom .huong{font-size:clamp(15px,1.8vw,26px);text-align:center;max-width:1100px;opacity:.95}" +
    "#ipadRoom .qrs{display:flex;gap:4vw;flex-wrap:wrap;justify-content:center}" +
    ".qrCard{width:clamp(220px,25vw,360px);border-radius:28px;padding:2vh 1.4vw;display:flex;flex-direction:column;align-items:center;gap:1vh;border:5px solid #fff;color:#fff}" +
    ".qrCard.lucie{background:linear-gradient(#ff8fc7,#d6337f)}.qrCard.lucas{background:linear-gradient(#5cc2ff,#1b5fd1)}" +
    ".qrCard .who{display:flex;align-items:center;gap:.6vw;font-weight:800;font-size:clamp(20px,2.4vw,36px)}" +
    ".qrCard .who img{width:clamp(44px,4.6vw,70px);height:clamp(44px,4.6vw,70px);border-radius:50%;object-fit:cover;border:4px solid #fff}" +
    ".qrCard .qr{background:#fff;border-radius:18px;padding:12px;width:clamp(170px,18vw,260px);height:clamp(170px,18vw,260px);display:flex;align-items:center;justify-content:center}" +
    ".qrCard .qr img,.qrCard .qr canvas{width:100%!important;height:100%!important;image-rendering:pixelated}" +
    ".qrCard .qr .ma{color:#1e1b4b;font-weight:800;font-size:clamp(14px,1.4vw,20px);text-align:center;word-break:break-all}" +
    ".qrCard .tt{font-weight:800;font-size:clamp(16px,1.8vw,26px);background:rgba(0,0,0,.25);border-radius:14px;padding:.1em .8em}" +
    ".qrCard.ok .tt{background:#16a34a;box-shadow:0 0 0 4px #bbf7d0}" +
    "#ipadRoom .row{display:flex;gap:1.4vw}" +
    "#ipadRoom .maPhong{font-size:clamp(14px,1.5vw,22px);opacity:.85}" +
    ".pbox .ipadDot{width:.7em;height:.7em;border-radius:50%;background:#94a3b8;display:inline-block;margin-left:.2em}" +
    ".pbox .ipadDot.on{background:#22c55e;box-shadow:0 0 8px #22c55e}" +
    "body.ipadMode .phalf .pkeys{display:none}" +
    "body.ipadMode .phalf .pqbox:before{content:'📱 Trả lời trên iPad';display:block;font-size:clamp(11px,1.1vw,16px);font-weight:800;color:#6366f1;margin-bottom:.2em}";
  document.head.appendChild(css);

  var chars = document.querySelector(".chars");
  var card = document.createElement("button");
  card.className = "char ipad"; card.id = "btnIpad"; card.dataset.c = "ipad";
  card.innerHTML = '<span class="tab">📱📱</span><span>Hai chị em chơi bằng iPad</span><small>Quét mã QR, mỗi bé lái xe trên iPad của mình, cả nhà xem đua trên TV</small><span class="best">2 iPad + 1 TV</span>';
  chars.appendChild(card);
  try { focusList = Array.prototype.slice.call(document.querySelectorAll(".char")); setFoc(0); } catch (e) {}

  var room = document.createElement("div");
  room.id = "ipadRoom"; room.className = "hide";
  room.innerHTML = '<h2>📱 Lấy iPad quét mã nhé!</h2>' +
    '<div class="huong">Mở <b>Camera</b> trên iPad, hướng vào mã QR của mình rồi chạm vào đường link hiện ra. Chị Lucie quét mã <b>hồng</b>, em Lucas quét mã <b>xanh</b>.</div>' +
    '<div class="qrs">' + KIDS.map(function (c) {
      return '<div class="qrCard ' + c + '" id="qr_' + c + '"><div class="who"><img data-face="' + c + '" alt=""><span>' + tenBe(c) + '</span></div><div class="qr" id="qrBox_' + c + '"></div><div class="tt" id="qrTt_' + c + '">⏳ Đang chờ iPad…</div></div>';
    }).join("") + '</div>' +
    '<div class="row"><button class="btn" id="ipadGo">🏁 Bắt đầu đua</button><button class="btn xanh" id="ipadBack">↩ Quay lại</button></div>' +
    '<div class="maPhong" id="ipadMa"></div>';
  document.body.appendChild(room);
  room.querySelectorAll("[data-face]").forEach(function (i) { i.src = faceUrl(i.dataset.face); });

  // ---------- mã QR (thư viện qrcodejs; không tải được thì hiện chữ) ----------
  var qrLib = null;
  function napQR(cb) {
    if (window.QRCode) return cb();
    if (qrLib) return qrLib.push(cb);
    qrLib = [cb];
    var s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload = s.onerror = function () { var a = qrLib; qrLib = null; a.forEach(function (f) { f(); }); };
    document.head.appendChild(s);
  }
  function linkTayLai(c) {
    var u = new URL("tay-lai.html", location.href);
    u.search = "?p=" + R.ma + "&c=" + c + (qs.get("kenhgoc") ? "&kenh=" + encodeURIComponent(R.base) : "");
    return u.href;
  }
  function veQR() {
    KIDS.forEach(function (c) {
      var box = document.getElementById("qrBox_" + c); box.innerHTML = "";
      var link = linkTayLai(c);
      box.dataset.link = link;
      if (window.QRCode) { try { new QRCode(box, { text: link, width: 256, height: 256, correctLevel: QRCode.CorrectLevel.M }); return; } catch (e) {} }
      box.innerHTML = '<div class="ma">' + link.replace(/^https?:\/\//, "") + '</div>';
    });
    document.getElementById("ipadMa").textContent = "Mã phòng: " + R.ma + " · Không quét được thì mở ngocanhno1.github.io/games/dua-xe/tay-lai.html?p=" + R.ma + "&c=lucie (hoặc c=lucas)";
  }

  // ---------- kết nối Firebase ----------
  function put(path, data) { return fetch(R.base + path + ".json", { method: "PUT", body: JSON.stringify(data) }).catch(function () {}); }
  function nghe(path, fn) {
    var es = null, dong = false;
    function mo() {
      if (dong) return;
      es = new EventSource(R.base + path + ".json");
      var xl = function (e) { try { fn(JSON.parse(e.data)); } catch (x) {} };
      es.addEventListener("put", xl); es.addEventListener("patch", xl);
      es.onerror = function () { try { es.close(); } catch (x) {} setTimeout(mo, 2000); };
    }
    mo();
    return { close: function () { dong = true; try { es.close(); } catch (x) {} } };
  }
  function moPhong() {
    dongPhong();
    R.ma = String(1000 + Math.floor(Math.random() * 9000));
    R.base = GOC.replace(/\/?$/, "/") + R.ma;
    R.on = true; R.lastN = {}; R.seen = {}; R.sent = {}; R.kq = {};
    put("", { tao: Date.now(), tv: { trangThai: "cho" } });
    KIDS.forEach(function (c) { guiMan(c, true); });
    R.esL = nghe("/lenh", function (m) { xuLyLenh(m); });
    R.esM = nghe("/may", function (m) {
      if (m.path === "/" && m.data) Object.keys(m.data).forEach(function (c) { R.seen[c] = Date.now(); });
      else { var c = (m.path || "").split("/")[1]; if (c) R.seen[c] = Date.now(); }
      capNhatCho();
    });
    clearInterval(R.timer); R.timer = setInterval(nhip, 350);
    napQR(veQR); veQR();
  }
  function dongPhong() {
    if (R.esL) R.esL.close(); if (R.esM) R.esM.close(); R.esL = R.esM = null;
    clearInterval(R.timer); R.timer = null;
    if (R.base) fetch(R.base + ".json", { method: "DELETE" }).catch(function () {});
    R.on = false;
  }
  function coMay(c) { return R.seen[c] && Date.now() - R.seen[c] < 9000; }
  function capNhatCho() {
    KIDS.forEach(function (c) {
      var ok = coMay(c), card = document.getElementById("qr_" + c);
      card.classList.toggle("ok", ok);
      document.getElementById("qrTt_" + c).textContent = ok ? "✅ iPad đã sẵn sàng!" : "⏳ Đang chờ iPad…";
      var d = document.getElementById("ipadDot" + KIDS.indexOf(c));
      if (d) d.classList.toggle("on", ok);
    });
    var go = document.getElementById("ipadGo");
    go.classList.toggle("foc", coMay("lucie") && coMay("lucas"));
  }

  // ---------- lệnh từ iPad ----------
  function xuLyLenh(m) {
    var ds = [];
    if (m.path === "/" && m.data) Object.keys(m.data).forEach(function (c) { ds.push([c, m.data[c]]); });
    else { var c = (m.path || "").split("/")[1]; if (c && m.data) ds.push([c, m.data]); }
    ds.forEach(function (x) {
      var c = x[0], l = x[1], i = KIDS.indexOf(c);
      if (i < 0 || !l || l.n == null) return;
      if (R.lastN[c] != null && l.n <= R.lastN[c]) return;
      var first = R.lastN[c] == null; R.lastN[c] = l.n;
      R.seen[c] = Date.now();
      if (first && Date.now() - (l.t || 0) > 15000 && l.t) return;   // lệnh cũ còn sót trong phòng
      lam(i, l.a, l.k);
    });
  }
  function lam(i, a, k) {
    if (G.mode !== 2 || !(G2.state === "race" || G2.state === "count")) return;
    var p = G2.players[i]; if (!p) return;
    try {
      if (a === "trai") { p.lane = Math.max(0, p.lane - 1); if (p.active && !p.active.res) markLane2(p); }
      else if (a === "phai") { p.lane = Math.min(2, p.lane + 1); if (p.active && !p.active.res) markLane2(p); }
      else if (a === "dap") { SFX.init(); chooseAnswer2(i, +k); }
      else if (a === "ga1") p.gas = true;
      else if (a === "ga0") p.gas = false;
      else if (a === "nitro") useNitro2(i);
    } catch (e) {}
  }

  // ---------- trạng thái gửi sang iPad ----------
  function trangThai() {
    if (!document.getElementById("ipadRoom").classList.contains("hide")) return "cho";
    if (G.mode !== 2 || !document.body.classList.contains("ipadMode")) return "cho";
    return { count: "dem", race: "dua", pause: "dua", end: "xong" }[G2.state] || "cho";
  }
  function manCua(c) {
    var i = KIDS.indexOf(c), p = G2.players && G2.players[i], tt = trangThai();
    var o = { trangThai: tt, ten: tenBe(c), lop: (window.HS && HS[c] && HS[c].lop) || "", lane: 1, diem: 0, hang: 1, tong: 5, kmh: 0, nitro: 0.35, chang: 1, cau: "", q: null, kq: null, xong: null };
    if (!p || tt === "cho") return o;
    var g = p.active, n = p.gates.length;
    o.lane = p.lane; o.diem = p.score; o.tim = p.tim; o.out = !!p.out; o.kmh = G2.state === "race" ? Math.round(p.speed * 3.6) : 0;
    o.nitro = Math.round(p.nitro * 100) / 100; o.chang = Math.min(N_CHANG, Math.floor(p.d / CHANG_LEN) + 1);
    try { o.hang = p.finished ? p.myRank : rankPlayer2(p); } catch (e) { o.hang = p.myRank || 1; }
    o.cau = Math.min(n, p.asked + (g && !g.res ? 1 : 0)) + "/" + n;
    if (g && g.opts) {
      var id = p.gates.indexOf(g);
      o.q = { id: id, mon: g.q.mon, q: g.q.q, opts: g.opts.slice() };
      if (g.res) R.kq[c] = { id: id, ok: g.res === "ok", chon: g.opts.indexOf(g.opts[p.lane]), dung: g.q.dung, gt: g.q.gt || "" };
    }
    // giữ kết quả câu vừa trả lời cho tới khi có câu mới
    var last = p.gates.filter(function (x) { return x.res; }).pop();
    if (last) {
      var lid = p.gates.indexOf(last);
      if (!R.kq[c] || R.kq[c].id !== lid) R.kq[c] = { id: lid, ok: last.res === "ok", chon: -1, dung: last.q.dung, gt: last.q.gt || "" };
      o.kq = R.kq[c];
      if (!o.q || o.q.id === lid) o.q = { id: lid, mon: last.q.mon, q: last.q.q, opts: (last.opts || []).slice() };
    }
    if (tt === "xong") o.xong = { hang: p.myRank, dung: p.right, tong: p.asked, diem: p.score, hetLuot: !!p.out };
    return o;
  }
  function guiMan(c, ep) {
    if (!R.on) return;
    var o = manCua(c), s = JSON.stringify(o);
    var nhe = s.replace(/"kmh":\d+,/, "");   // chỉ đổi tốc độ thì gửi thưa hơn
    var cu = R.sent[c] || {};
    if (!ep && cu.nhe === nhe && Date.now() - (cu.t || 0) < 1000) return;
    if (!ep && cu.s === s) return;
    R.sent[c] = { s: s, nhe: nhe, t: Date.now() };
    put("/man/" + c, o);
  }
  function nhip() { KIDS.forEach(function (c) { guiMan(c); }); capNhatCho(); }

  // ---------- gắn vào game ----------
  function vaoPhong() {
    SFX.init(); try { if (window.batDauNhac) window.batDauNhac(); } catch (e) {}
    document.getElementById("start").classList.add("hide");
    room.classList.remove("hide");
    moPhong(); capNhatCho();
    try { focusList = [document.getElementById("ipadGo"), document.getElementById("ipadBack")]; setFoc(0); } catch (e) {}
  }
  function batDau() {
    room.classList.add("hide");
    document.body.classList.add("ipadMode");
    startRace2();
    [0, 1].forEach(function (i) {
      var nm = document.getElementById("pname" + i);
      if (nm && !document.getElementById("ipadDot" + i)) { var d = document.createElement("span"); d.className = "ipadDot"; d.id = "ipadDot" + i; d.title = "iPad"; nm.after(d); }
      var pad = document.getElementById("ppad" + i); if (pad) pad.classList.add("hide");
    });
    capNhatCho();
    KIDS.forEach(function (c) { guiMan(c, true); });
  }
  card.onclick = vaoPhong;
  document.getElementById("ipadGo").onclick = batDau;
  document.getElementById("ipadBack").onclick = function () { dongPhong(); room.classList.add("hide"); toMenu(); };

  // TV không đọc to câu hỏi (mỗi bé nghe trên iPad của mình), chỉ đọc lời chào, chặng, kết quả
  var goc = showQuestion2;
  showQuestion2 = function (p, g) { goc(p, g); if (document.body.classList.contains("ipadMode")) { try { Voice.stop(); } catch (e) {} } guiMan(p.child, true); };
  var gocPass = passGate2;
  passGate2 = function (p, g) { gocPass(p, g); guiMan(p.child, true); };
  var gocFin = finish2;
  finish2 = function () { gocFin.apply(this, arguments); setTimeout(function () { KIDS.forEach(function (c) { guiMan(c, true); }); }, 50); };
  var gocMenu = toMenu;
  toMenu = function () { document.body.classList.remove("ipadMode"); gocMenu.apply(this, arguments); if (R.on) KIDS.forEach(function (c) { guiMan(c, true); }); };
  var gocStart = startRace;   // đua 1 người thì thoát chế độ iPad
  startRace = function () { document.body.classList.remove("ipadMode"); return gocStart.apply(this, arguments); };
  // "Đua tiếp" ở màn kết thúc của chế độ iPad: đua lại luôn với 2 iPad đang kết nối
  var again = document.getElementById("eAgain");
  if (again) again.addEventListener("click", function (e) {
    if (document.body.classList.contains("ipadMode") && R.on) { e.stopImmediatePropagation(); document.getElementById("end").classList.add("hide"); batDau(); }
  }, true);
  addEventListener("pagehide", function () { if (R.on && R.base) try { navigator.sendBeacon && fetch(R.base + ".json", { method: "DELETE", keepalive: true }); } catch (e) {} });
})();
