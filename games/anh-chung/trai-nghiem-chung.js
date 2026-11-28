/* Tối ưu Trải Nghiệm Chung + Nhạc Nền Tự Động Thông Minh cho toàn bộ kho game Lucie & Lucas
   1. Nhạc nền tự động hoàn toàn:
      - Tự động tạm tắt/hạ êm nhạc nền (kể cả nhạc Web Audio marimba của nhac-nen.js lẫn file MP3) ngay khi
        giọng đọc Hoài My / giọng kể cất lên, rồi tự mở lại mượt khi đọc xong -> không cần tự tay bấm tắt!
      - Tự động tạm dừng khi ẩn tab / khóa màn hình điện thoại.
   2. Hỗ trợ điều khiển Remote TV (phím mũi tên di chuyển rõ giữa các nút đáp án).
   3. Hiện dải "Mục tiêu hôm nay & Chuỗi ngày chăm chỉ" gọn nhẹ trên trang chủ.
*/
(function () {
  if (window.__traiNghiemChungV2) return;
  window.__traiNghiemChungV2 = true;

  // === PHẦN 1: NHẠC NỀN TỰ ĐỘNG THÔNG MINH (AUTO-MUTE / AUTO-DUCK KHI CÓ GIỌNG ĐỌC) ===
  var tatCaAudioCtx = [];
  var OrigAC = window.AudioContext || window.webkitAudioContext;
  if (OrigAC && !window.__daBocAC) {
    window.__daBocAC = true;
    var WrappedAC = function () {
      var inst = new OrigAC();
      tatCaAudioCtx.push(inst);
      return inst;
    };
    WrappedAC.prototype = OrigAC.prototype;
    try { window.AudioContext = WrappedAC; } catch (e) {}
    try { window.webkitAudioContext = WrappedAC; } catch (e) {}
  }

  var dangTamTatViGiong = false;
  var timerMoLai = null;
  var nutNhacDaTatTuDong = false;

  function dangCoGiongDoc() {
    try {
      if (window.speechSynthesis && window.speechSynthesis.speaking) return true;
    } catch (e) {}
    return false;
  }

  function timNutNhacCu() {
    // Tìm nút nốt nhạc 🎵 của nhac-nen.js (thường có textContent chứa 🎵 hoặc ♫ hoặc id/class nhac)
    var btns = document.querySelectorAll("button");
    for (var i = 0; i < btns.length; i++) {
      var b = btns[i];
      var txt = (b.textContent || "").trim();
      var aria = (b.getAttribute("aria-label") || "") + " " + (b.title || "") + " " + (b.id || "");
      if (txt === "🎵" || txt === "♫" || txt === "🎶" || txt === "🔊" || /nhac/i.test(aria)) {
        return b;
      }
    }
    return null;
  }

  function tamDungNhacNen() {
    if (dangTamTatViGiong) return;
    dangTamTatViGiong = true;
    clearTimeout(timerMoLai);

    // 1. Tạm dừng mọi AudioContext (nhạc nền marimba tổng hợp của nhac-nen.js)
    for (var i = 0; i < tatCaAudioCtx.length; i++) {
      try {
        if (tatCaAudioCtx[i].state === "running") tatCaAudioCtx[i].suspend();
      } catch (e) {}
    }

    // 2. Hạ nhỏ/tạm dừng mọi thẻ <audio> nhạc nền (không chạm vào audio giọng đọc trong /giong/)
    var auds = document.querySelectorAll("audio");
    for (var j = 0; j < auds.length; j++) {
      var a = auds[j];
      var src = (a.currentSrc || a.src || "");
      if (/\/giong\//i.test(src)) continue;
      if (!a.paused) {
        a.dataset.llPausedByVoice = "1";
        try { a.pause(); } catch (e) {}
      }
    }

    // 3. Nếu đang ở Sách Truyện / Kỹ Năng và nhac-nen.js dùng AudioContext tạo trước khi script này nạp -> bấm tắt nhẹ nút nhạc
    if (/(sach-truyen|ky-nang)/i.test(location.href) && tatCaAudioCtx.length === 0) {
      var nut = timNutNhacCu();
      if (nut && !nut.classList.contains("tat") && !/tắt|muted|off/i.test((nut.title || "") + " " + (nut.className || ""))) {
        // Chỉ tự tắt nếu nhạc đang bật
        if ((nut.textContent || "").indexOf("🔇") === -1) {
          nutNhacDaTatTuDong = true;
          try { nut.click(); } catch (e) {}
        }
      }
    }
  }

  function khoiPhucNhacNen() {
    if (!dangTamTatViGiong) return;
    clearTimeout(timerMoLai);
    timerMoLai = setTimeout(function () {
      if (dangCoGiongDoc() || document.hidden) return;
      dangTamTatViGiong = false;

      // Ở Sách Truyện & Trường Kỹ Năng giữ yên tĩnh cho dễ tập trung đọc; các game khác tự mở lại nhạc nền vui tươi!
      var laDocTruyen = /(sach-truyen|ky-nang)/i.test(location.href);
      if (!laDocTruyen) {
        for (var i = 0; i < tatCaAudioCtx.length; i++) {
          try {
            if (tatCaAudioCtx[i].state === "suspended") tatCaAudioCtx[i].resume();
          } catch (e) {}
        }
        var auds = document.querySelectorAll("audio");
        for (var j = 0; j < auds.length; j++) {
          if (auds[j].dataset && auds[j].dataset.llPausedByVoice === "1") {
            delete auds[j].dataset.llPausedByVoice;
            try { var p = auds[j].play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
          }
        }
      }
      nutNhacDaTatTuDong = false;
    }, 1100);
  }

  setInterval(function () {
    if (document.hidden) { tamDungNhacNen(); return; }
    if (dangCoGiongDoc()) tamDungNhacNen();
    else khoiPhucNhacNen();
  }, 180);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) tamDungNhacNen();
    else khoiPhucNhacNen();
  });

  // === PHẦN 2: ĐIỀU KHIỂN REMOTE TV TRONG CÁC GAME CON ===
  if (location.pathname.indexOf("/games/") !== -1) {
    document.addEventListener("keydown", function (e) {
      if (e.defaultPrevented) return;
      var k = e.key;
      if (k !== "ArrowRight" && k !== "ArrowLeft" && k !== "ArrowDown" && k !== "ArrowUp") return;
      var btns = Array.prototype.slice.call(document.querySelectorAll("button:not([disabled]), a[href], [role='button']"))
        .filter(function (el) { return el.offsetParent !== null && el.offsetWidth > 24 && el.offsetHeight > 24; });
      if (btns.length < 2) return;
      var idx = btns.indexOf(document.activeElement);
      var step = (k === "ArrowRight" || k === "ArrowDown") ? 1 : -1;
      var next = idx < 0 ? 0 : (idx + step + btns.length) % btns.length;
      btns[next].focus();
    });
  }

  // === PHẦN 3: DẢI MỤC TIÊU HÔM NAY & CHUỖI CHĂM CHỈ TRÊN TRANG CHỦ ===
  function ganDaiTrangChu() {
    var laTrangChu = (location.pathname === "/" || /\/index\.html$/i.test(location.pathname)) && location.pathname.indexOf("/games/") === -1;
    if (!laTrangChu) return;
    if (document.getElementById("ll-dai-nhiem-vu")) return;
    var header = document.querySelector("header");
    if (!header || !header.parentNode) return;

    function docStreak(be) {
      try {
        var o = JSON.parse(localStorage.getItem("ll_nv_ngay_" + be) || "null");
        return (o && o.streak) ? o.streak : 0;
      } catch (e) { return 0; }
    }
    var stL = docStreak("lucie"), stM = docStreak("lucas");

    var bar = document.createElement("div");
    bar.id = "ll-dai-nhiem-vu";
    bar.style.cssText = [
      "max-width:960px;margin:10px auto 14px;padding:10px 16px;",
      "background:#ffffff;border-radius:16px;border:2px solid #e2e8f0;",
      "display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px;",
      "font:700 14px/1.4 system-ui,-apple-system,sans-serif;color:#1e293b;"
    ].join("");
    bar.innerHTML =
      "<span>🎯 <b>Mục tiêu hôm nay:</b> Chơi 1 màn (+5 CIECAS) · Đúng 5 câu (+5) · Nghe 1 truyện (+10)</span>" +
      "<span style='color:#d97706'>🔥 Chuỗi chăm chỉ: Lucie " + stL + " ngày · Lucas " + stM + " ngày</span>";
    header.parentNode.insertBefore(bar, header.nextSibling);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ganDaiTrangChu);
  else ganDaiTrangChu();
})();
