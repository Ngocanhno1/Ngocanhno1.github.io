/* Đồng hồ giờ chơi của Lucie & Lucas — gắn vào mọi trò chơi.
   - Chỉ đếm khi con đang thật sự chơi (trang đang mở trước mặt và có chạm/bấm trong 2 phút gần nhất).
   - Biết bé nào đang chơi nhờ nhật ký câu trả lời (giaDinh_nhatKy); trước câu đầu tiên thì tạm giữ, có tên rồi mới cộng.
   - Mỗi máy ghi riêng "gioChoi_<mã máy>", dong-bo.js gửi lên mạng, nên cộng được giờ chơi trên mọi máy mà không đè nhau.
   - Còn 5 phút: nhắc nhẹ. Hết giờ: màn "Nghỉ mắt", bố mẹ giải một phép nhân để cho thêm 15 phút.
   Giới hạn mặc định ở GIOI_HAN; bố mẹ đổi được trên trang Bảng thành tích (khóa "gioiHanChoi"). */
(function () {
  if (window.DemGio) return;
  var GIOI_HAN = { lucie: 45, lucas: 30 };                // phút mỗi ngày
  var NGHI = 120, BUOC = 5;                             // không chạm quá 120 giây thì thôi đếm
  var TEN = { lucie: "Tường San", lucas: "Tường Minh" };
  var LS = localStorage;
  function rd(k, d) { try { var v = JSON.parse(LS.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function ngay(t) { var d = new Date(t || Date.now()); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }
  var may = LS.getItem("_db_may"); if (!may) { may = Math.random().toString(36).slice(2, 10); LS.setItem("_db_may", may); }
  var KHOA = "gioChoi_" + may;

  function gioiHan(c) { var g = rd("gioiHanChoi", {}); return (g[c] || GIOI_HAN[c] || 45); }
  function themGio(c) { var x = rd("gioThem", {}); return (x[ngay()] || {})[c] || 0; }
  // Tổng giây hôm nay của bé c trên mọi máy
  function giayHomNay(c, t) {
    var k = ngay(t), s = 0;
    for (var i = 0; i < LS.length; i++) { var key = LS.key(i); if (key && key.indexOf("gioChoi_") === 0) s += ((rd(key, {})[k] || {})[c] || 0); }
    return s;
  }
  function congGiay(c, n) {
    var o = rd(KHOA, {}), k = ngay(); o[k] = o[k] || {}; o[k][c] = (o[k][c] || 0) + n;
    var ks = Object.keys(o); if (ks.length > 14) ks.sort(function (a, b) { return new Date(a) - new Date(b); }).slice(0, ks.length - 14).forEach(function (x) { delete o[x]; });
    LS.setItem(KHOA, JSON.stringify(o));
  }

  // Bé nào đang chơi?
  var t0 = Date.now(), be = null, choGiay = 0;
  function timBe() {
    var a = rd("giaDinh_nhatKy", []), e = a[a.length - 1];
    if (e && (e.c === "lucie" || e.c === "lucas") && (e.t >= t0 - 1000 || Date.now() - e.t < 20 * 60000)) return e.c;
    try { if (typeof appState !== "undefined" && appState.currentProfile) { var p = String(appState.currentProfile).toLowerCase(); if (p === "lucie" || p === "lucas") return p; } } catch (x) {}   // Fun for Flyers
    if (e && choGiay >= 180 && (e.c === "lucie" || e.c === "lucas")) return e.c;   // chơi lâu mà chưa rõ: lấy bé chơi gần nhất
    return null;
  }

  var chamCuoi = Date.now();
  ["pointerdown", "keydown", "touchstart", "wheel"].forEach(function (ev) { addEventListener(ev, function () { chamCuoi = Date.now(); }, { capture: true, passive: true }); });

  // Đồng hồ nhỏ góc dưới bên phải
  var nut, man, daNhac = {}, daKhoa = false, tamGhi = 0;
  function dung() {
    if (nut || !document.body) return;
    var st = document.createElement("style");
    st.textContent = "#demGio{position:fixed;right:12px;bottom:12px;z-index:2147483000;pointer-events:none;font:800 15px/1 'Baloo 2',system-ui,sans-serif;color:#fff;background:rgba(60,40,120,.72);padding:7px 12px;border-radius:999px;box-shadow:0 3px 10px rgba(0,0,0,.2);display:flex;align-items:center;gap:6px;transition:background .4s}" +
      "#demGio img{width:22px;height:22px;border-radius:50%;object-fit:cover;border:2px solid #fff}#demGio.sap{background:rgba(232,89,12,.92);animation:dgNhay 1s infinite alternate}@keyframes dgNhay{to{transform:scale(1.08)}}" +
      "#dgNhac{position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:2147483001;background:#fff7d6;color:#7c2d12;font:800 clamp(18px,2.6vw,28px) 'Baloo 2',system-ui,sans-serif;padding:14px 26px;border-radius:24px;box-shadow:0 10px 30px rgba(0,0,0,.25);text-align:center;max-width:90vw}" +
      "#dgMan{position:fixed;inset:0;z-index:2147483002;background:linear-gradient(160deg,#a5d8ff,#d0bfff 55%,#ffd8e8);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;font-family:'Baloo 2',system-ui,sans-serif;color:#2b2140;padding:20px}" +
      "#dgMan h1{margin:0;font-size:clamp(34px,6vw,64px)}#dgMan p{margin:0;font-size:clamp(18px,2.6vw,28px);max-width:760px}#dgMan img{width:140px;height:140px;border-radius:50%;object-fit:cover;border:6px solid #fff;box-shadow:0 8px 24px rgba(0,0,0,.2)}" +
      "#dgMan .bm{margin-top:18px;font-size:16px;background:#fff;border-radius:18px;padding:12px 16px;display:flex;gap:8px;align-items:center;flex-wrap:wrap;justify-content:center}#dgMan input{width:110px;font:700 20px system-ui;padding:6px 8px;border-radius:10px;border:2px solid #b197fc}#dgMan button{font:800 18px 'Baloo 2',system-ui;border:0;border-radius:999px;padding:8px 18px;background:#7c4dff;color:#fff;cursor:pointer}#dgMan a{color:#5f3dc4;font-weight:800;font-size:20px}";
    document.head.appendChild(st);
    nut = document.createElement("div"); nut.id = "demGio"; nut.setAttribute("data-giu-icon", ""); nut.style.display = "none";
    document.body.appendChild(nut);
  }
  function mmss(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + ("0" + s % 60).slice(-2); }
  function noi(cau) { try { var u = new SpeechSynthesisUtterance(cau); u.lang = "vi-VN"; speechSynthesis.speak(u); } catch (e) {} }
  function veDongHo(c) {
    dung(); if (!nut) return;
    var dung_ = giayHomNay(c), han = (gioiHan(c) + themGio(c)) * 60, con = han - dung_;
    var anh = window.MatThat ? MatThat.url(c) : "/img/" + c + ".webp";
    nut.innerHTML = '<img src="' + anh + '" alt="">⏱ ' + Math.floor(dung_ / 60) + "/" + Math.round(han / 60) + " phút";
    nut.style.display = "flex"; nut.className = con <= 300 ? "sap" : "";
    if (con <= 300 && con > 0 && !daNhac[c + ngay()]) {
      daNhac[c + ngay()] = 1;
      var d = document.createElement("div"); d.id = "dgNhac";
      d.textContent = "⏰ " + TEN[c] + " ơi, còn " + Math.ceil(con / 60) + " phút nữa là đến giờ nghỉ mắt rồi nhé!";
      document.body.appendChild(d); setTimeout(function () { d.remove(); }, 7000);
      noi(TEN[c] + " ơi, còn " + Math.ceil(con / 60) + " phút nữa là đến giờ nghỉ mắt rồi nhé!");
    }
    if (con <= 0) khoa(c); else if (daKhoa) moKhoa();
  }
  function khoa(c) {
    if (daKhoa) return; daKhoa = true;
    try { speechSynthesis.cancel(); } catch (e) {}
    document.querySelectorAll("audio,video").forEach(function (m) { try { m.pause(); } catch (e) {} });
    try { if (window.AudioContext && window.__nhacCtx) window.__nhacCtx.suspend(); } catch (e) {}
    var a = 10 + Math.floor(Math.random() * 40), b = 12 + Math.floor(Math.random() * 40);
    man = document.createElement("div"); man.id = "dgMan"; man.setAttribute("data-giu-icon", "");
    var anh = window.MatThat ? MatThat.url(c) : "/img/" + c + ".webp";
    man.innerHTML = '<img src="' + anh + '" alt=""><h1>🌙 Giờ nghỉ mắt rồi!</h1>' +
      "<p>Hôm nay " + TEN[c] + " đã chơi đủ " + (gioiHan(c) + themGio(c)) + " phút. Con giỏi lắm! Mình nhìn ra xa, uống nước, vận động một chút nhé. Mai mình chơi tiếp, game đã lưu sẵn rồi.</p>" +
      '<a href="/">🏠 Về trang chủ</a>' +
      '<div class="bm">👨‍👩‍👧 Bố mẹ cho thêm 15 phút: ' + a + " × " + b + ' = <input inputmode="numeric" id="dgDap"><button id="dgOk">Đồng ý</button></div>';
    document.body.appendChild(man);
    noi("Giờ nghỉ mắt rồi! Hôm nay " + TEN[c] + " đã chơi đủ rồi. Mai mình chơi tiếp nhé!");
    man.querySelector("#dgOk").onclick = function () {
      var ip = man.querySelector("#dgDap");
      if (Number(ip.value) === a * b) { var k = ngay(), x = {}; x[k] = rd("gioThem", {})[k] || {}; x[k][c] = (x[k][c] || 0) + 15; LS.setItem("gioThem", JSON.stringify(x)); moKhoa(); veDongHo(c); }
      else { ip.value = ""; ip.placeholder = "Chưa đúng"; }
    };
    man.addEventListener("keydown", function (e) { e.stopPropagation(); }, true);
  }
  function moKhoa() { daKhoa = false; if (man) { man.remove(); man = null; } try { if (window.__nhacCtx) window.__nhacCtx.resume(); } catch (e) {} }

  setInterval(function () {
    var cB = timBe(); if (cB) be = cB;
    var dangChoi = document.visibilityState === "visible" && Date.now() - chamCuoi < NGHI * 1000 && !daKhoa;
    if (dangChoi) { if (be) { tamGhi += BUOC + choGiay; choGiay = 0; } else choGiay += BUOC; }
    if (be && tamGhi >= 15) { congGiay(be, tamGhi); tamGhi = 0; }
    if (be) veDongHo(be);
  }, BUOC * 1000);
  addEventListener("pagehide", function () { if (be && tamGhi) { congGiay(be, tamGhi); tamGhi = 0; } });
  window.DemGio = { giayHomNay: giayHomNay, gioiHan: gioiHan, GIOI_HAN: GIOI_HAN };
})();
