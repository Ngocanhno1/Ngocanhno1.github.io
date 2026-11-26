/* Hệ thống Âm thanh dùng chung cho toàn bộ game Lucie & Lucas
   Giải quyết triệt để:
   1. Tự mở khóa nhạc nền 100% trên LG webOS TV & Mobile (bắt cả click, touchstart, pointerdown, keydown phím remote).
   2. Auto-ducking: Tự hạ nhỏ nhạc nền xuống 22% khi giọng đọc VieNeu-TTS phát, tự tăng mượt lại khi đọc xong.
   3. Hiệu ứng âm thanh tổng hợp nhẹ (Web Audio API, 0 KB tải mạng): bấm nút, đúng tăng tông theo combo, sai nhẹ nhàng, thắng màn, cộng xu CIECAS.
   4. Lưu trạng thái tắt/bật nhạc nền & hiệu ứng đồng bộ qua localStorage.
*/
(function (root) {
  if (root.AmThanhChung) return;

  var KEY_NHAC = "ll_nhac_nen_bat";
  var KEY_SFX = "ll_sfx_bat";
  var batNhac = localStorage.getItem(KEY_NHAC) !== "0";
  var batSfx = localStorage.getItem(KEY_SFX) !== "0";

  var ctx = null;
  var bgm = null;
  var bgmUrl = "";
  var bgmVolGoc = 0.28;
  var dangHaNho = false;
  var daMoKhoa = false;
  var fadeTimer = null;

  function layCtx() {
    if (!ctx) {
      var AC = root.AudioContext || root.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === "suspended") {
      try { ctx.resume(); } catch (e) {}
    }
    return ctx;
  }

  function datAmLuongMuot(mucTieu, ms) {
    if (!bgm) return;
    clearInterval(fadeTimer);
    var batDau = bgm.volume;
    var buoc = Math.max(1, Math.round((ms || 250) / 25));
    var i = 0;
    fadeTimer = setInterval(function () {
      i++;
      var v = batDau + (mucTieu - batDau) * (i / buoc);
      bgm.volume = Math.max(0, Math.min(1, v));
      if (i >= buoc) clearInterval(fadeTimer);
    }, 25);
  }

  function thuPhatNhac() {
    if (!bgm || !batNhac || document.hidden) return;
    bgm.volume = dangHaNho ? bgmVolGoc * 0.22 : bgmVolGoc;
    var p = bgm.play();
    if (p && p.then) {
      p.then(function () { daMoKhoa = true; }).catch(function () {
        // Chờ tương tác người dùng kế tiếp để tự phát lại
      });
    }
  }

  function moKhoaAmThanh() {
    layCtx();
    if (!daMoKhoa && bgm && batNhac) thuPhatNhac();
  }

  // Bắt mọi thao tác trên TV remote (keydown), điện thoại (touchstart/pointerdown), chuột (click)
  ["pointerdown", "touchstart", "click", "keydown"].forEach(function (ev) {
    document.addEventListener(ev, moKhoaAmThanh, { passive: true, capture: true });
  });

  // Tự tạm dừng khi ẩn tab / chuyển ứng dụng TV và tự phát lại khi quay lại
  document.addEventListener("visibilitychange", function () {
    if (!bgm) return;
    if (document.hidden) {
      try { bgm.pause(); } catch (e) {}
    } else if (batNhac) {
      thuPhatNhac();
    }
  });

  // Tự động lắng nghe trạng thái giọng đọc (auto-ducking với giong-noi.js)
  setInterval(function () {
    if (!bgm || !batNhac || bgm.paused) return;
    var dangNoi = false;
    try { dangNoi = !!(root.speechSynthesis && root.speechSynthesis.speaking); } catch (e) {}
    if (dangNoi && !dangHaNho) {
      dangHaNho = true;
      datAmLuongMuot(bgmVolGoc * 0.22, 220);
    } else if (!dangNoi && dangHaNho) {
      dangHaNho = false;
      datAmLuongMuot(bgmVolGoc, 350);
    }
  }, 180);

  // Hàm tạo nốt nhạc Web Audio nhẹ, trong trẻo
  function not(tanSo, tre, thoiLuong, kieu, amLuong) {
    if (!batSfx) return;
    var c = layCtx();
    if (!c) return;
    var t0 = c.currentTime + (tre || 0);
    var osc = c.createOscillator();
    var g = c.createGain();
    osc.type = kieu || "sine";
    osc.frequency.setValueAtTime(tanSo, t0);
    g.gain.setValueAtTime(0.001, t0);
    g.gain.exponentialRampToValueAtTime(amLuong || 0.16, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + (thoiLuong || 0.18));
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t0);
    osc.stop(t0 + (thoiLuong || 0.18) + 0.02);
  }

  root.AmThanhChung = {
    datNhacNen: function (url, amLuong) {
      if (typeof amLuong === "number") bgmVolGoc = Math.max(0.05, Math.min(0.8, amLuong));
      if (bgm && bgmUrl === url) { thuPhatNhac(); return; }
      if (bgm) { try { bgm.pause(); } catch (e) {} }
      bgmUrl = url;
      bgm = new Audio(url);
      bgm.loop = true;
      bgm.preload = "auto";
      bgm.volume = bgmVolGoc;
      bgm.addEventListener("canplay", function () {
        if (batNhac && bgm.paused) thuPhatNhac();
      }, { once: true });
      thuPhatNhac();
    },
    tatMoNhac: function (bat) {
      batNhac = typeof bat === "boolean" ? bat : !batNhac;
      localStorage.setItem(KEY_NHAC, batNhac ? "1" : "0");
      if (bgm) {
        if (batNhac) thuPhatNhac();
        else try { bgm.pause(); } catch (e) {}
      }
      return batNhac;
    },
    tatMoSfx: function (bat) {
      batSfx = typeof bat === "boolean" ? bat : !batSfx;
      localStorage.setItem(KEY_SFX, batSfx ? "1" : "0");
      return batSfx;
    },
    dangBatNhac: function () { return batNhac; },
    dangBatSfx: function () { return batSfx; },

    // Hiệu ứng âm thanh chuẩn cho mọi game
    bam: function () { not(520, 0, 0.06, "triangle", 0.12); },
    dung: function (combo) {
      var bac = Math.min(Math.max(1, combo || 1), 6);
      var thang = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0];
      var f = thang[bac - 1];
      not(f, 0, 0.14, "triangle", 0.18);
      not(f * 1.25, 0.09, 0.22, "sine", 0.18);
    },
    sai: function () {
      not(260, 0, 0.14, "sine", 0.14);
      not(210, 0.11, 0.20, "sine", 0.13);
    },
    xu: function () {
      not(987.77, 0, 0.08, "sine", 0.16);
      not(1318.51, 0.07, 0.22, "sine", 0.16);
    },
    thang: function () {
      [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
        not(f, i * 0.1, 0.28, "triangle", 0.18);
      });
    }
  };
})(window);
