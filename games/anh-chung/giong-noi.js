/* Giọng đọc đồng bộ cho mọi game & Sách Truyện Lucie & Lucas (Bản vá tương thích 100% TV LG webOS & iOS).
   - Không dùng regex lookbehind (tương thích tuyệt đối trình duyệt TV & Safari).
   - Đọc cả danh-sach.json và giong.json nhưng khóa cố định 1 giọng (không random trộn giọng).
   - Tra cứu từng câu theo cả bản gốc lẫn bản chuẩn hóa văn nói để không bỏ sót bất kỳ MP3 nào.
*/
(function () {
  var me = document.currentScript;
  var ROOT_AC = me ? me.src.replace(/giong-noi\.js.*$/, "") : "/games/anh-chung/";
  var BASE = ROOT_AC + "giong/";

  // Tự nạp CSS/JS tối ưu TV & Mobile
  (function napBoToiUu() {
    try {
      var head = document.head || document.documentElement;
      if (head && !document.querySelector('link[href*="toi-uu-tv-muot.css"]')) {
        var lk = document.createElement("link");
        lk.rel = "stylesheet";
        lk.href = ROOT_AC + "toi-uu-tv-muot.css?v=20261127";
        head.appendChild(lk);
      }
      if (head && !window.__toiUuTvMuot && !document.querySelector('script[src*="toi-uu-tv-muot.js"]')) {
        var sc1 = document.createElement("script");
        sc1.src = ROOT_AC + "toi-uu-tv-muot.js?v=20261127";
        sc1.defer = true;
        head.appendChild(sc1);
      }
      if (head && !window.AmThanhChung && !document.querySelector('script[src*="am-thanh-chung.js"]')) {
        var sc2 = document.createElement("script");
        sc2.src = ROOT_AC + "am-thanh-chung.js?v=20261127";
        sc2.defer = true;
        head.appendChild(sc2);
      }
    } catch (e) {}
  })();

  // Chuẩn hóa văn nói tiếng Việt (100% KHÔNG dùng lookbehind để chạy mượt trên mọi TV & iPhone)
  function chuanHoaVanNoi(text) {
    if (!text) return "";
    var s = String(text);
    if (s.normalize) s = s.normalize("NFC");
    s = s.replace(/(\d+)\s*[→➡]\s*(\d+)/g, "từ $1 đến $2");
    s = s.replace(/\s*[→➡]\s*/g, ", suy ra ");
    s = s.replace(/(\d+)\s*[–—]\s*(\d+)/g, "từ $1 đến $2");
    s = s.replace(/(\d+)\s*°\s*C\b/gi, "$1 độ xê");
    s = s.replace(/(\d+)\s*%/g, "$1 phần trăm");
    s = s.replace(/(\d+)\s*km\b/gi, "$1 ki lô mét");
    s = s.replace(/(\d+)\s*dm\b/gi, "$1 đề xi mét");
    s = s.replace(/(\d+)\s*cm\b/gi, "$1 xăng ti mét");
    s = s.replace(/(\d+)\s*mm\b/gi, "$1 mi li mét");
    s = s.replace(/(\d+)\s*kg\b/gi, "$1 ki lô gam");
    s = s.replace(/(\d+)\s*ml\b/gi, "$1 mi li lít");
    s = s.replace(/(\d+)\s*[×xX\*]\s*(\d+)/g, "$1 nhân $2");
    s = s.replace(/(\d+)\s*[÷:]\s*(\d+)/g, "$1 chia $2");
    s = s.replace(/(\d+)\s*\+\s*(\d+)/g, "$1 cộng $2");
    s = s.replace(/(\d+)\s*[\-−]\s*(\d+)/g, "$1 trừ $2");
    s = s.replace(/\s*=\s*\?/g, " bằng mấy?");
    s = s.replace(/\s*=\s*/g, " bằng ");
    s = s.replace(/\bLucie\b/gi, "Lu Xi");
    s = s.replace(/\bLucas\b/gi, "Lu Cát");
    s = s.replace(/\bCIECAS\b/gi, "Xi Cát");
    s = s.replace(/\bdo_kho\b/gi, "độ khó");
    s = s.replace(/\s+/g, " ").trim();
    return s;
  }
  window.chuanHoaVanNoi = chuanHoaVanNoi;

  var ss = window.speechSynthesis;
  if (!ss || window.__giongNoi) return;
  window.__giongNoi = true;
  window.GIONG_MOT = true;

  var CO = null, PHU = [], goc = { speak: ss.speak.bind(ss), cancel: ss.cancel.bind(ss) };
  var VN = /[àáâãèéêìíòóôõùúýăđĩũơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i;
  var CAT = /[.!?…;\n]+\s|\s[—–]\s/;

  var sanSang = Promise.all([
    fetch(BASE + "danh-sach.json", { cache: "no-cache" }).then(function (r) { return r.json(); })
      .then(function (a) { CO = {}; (a || []).forEach(function (k) { CO[k] = 1; }); }).catch(function () { CO = {}; }),
    fetch(BASE + "giong.json", { cache: "no-cache" }).then(function (r) { return r.json(); })
      .then(function (o) {
        Object.keys(o || {}).forEach(function (thu) {
          var arr = (o[thu] && o[thu].co) || [];
          var m = {};
          arr.forEach(function (k) { m[k] = 1; });
          if (arr.length > 0) PHU.push({ thu: thu, co: m, n: arr.length });
        });
        // Sắp xếp cố định ưu tiên bộ giọng đầy đủ nhất (KHÔNG random)
        PHU.sort(function (a, b) { return b.n - a.n; });
      }).catch(function () {})
  ]);

  function chuan(s) {
    if (s.normalize) s = s.normalize("NFC");
    return s.toLowerCase().replace(/["“”'‘’()\[\]«»*_]/g, "").replace(/\s+/g, " ")
      .replace(/^[\s.,!?…;:\-—–]+|[\s.,!?…;:\-—–]+$/g, "");
  }
  function ma(s) {
    var b = new TextEncoder().encode(s), h = 0x811c9dc5;
    for (var i = 0; i < b.length; i++) { h ^= b[i]; h = Math.imul(h, 0x01000193) >>> 0; }
    return ("00000000" + h.toString(16)).slice(-8);
  }
  function coChuSo(p) {
    return /[A-Za-z0-9àáâãèéêìíòóôõùúýăđĩũơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i.test(p);
  }

  function timFileChoCau(p) {
    // Kiểm tra bản gốc trước (khớp 100% MP3 cũ của Sách Truyện), rồi tới bản chuẩn hóa văn nói
    var c1 = chuan(p), k1 = c1 ? ma(c1) : "";
    var p2 = chuanHoaVanNoi(p), c2 = chuan(p2), k2 = c2 ? ma(c2) : "";

    // 1. Ưu tiên tuyệt đối giọng chính CO (đồng bộ 1 giọng duy nhất)
    if (k1 && CO && CO[k1]) return k1;
    if (k2 && CO && CO[k2]) return k2;

    // 2. Nếu giọng chính không có, kiểm tra cố định theo thứ tự trong giong.json (không random)
    for (var i = 0; i < PHU.length; i++) {
      if (k1 && PHU[i].co[k1]) return PHU[i].thu + "/" + k1;
      if (k2 && PHU[i].co[k2]) return PHU[i].thu + "/" + k2;
    }
    return null;
  }

  var hang = null, dangDoc = false, dangPhat = null, luotCho = 0;
  function xong(job) {
    if (hang !== job) return;
    hang = null; dangDoc = false; dangPhat = null;
    try { job.u.dispatchEvent(new Event("end")); } catch (e) {}
  }

  function phatAudio(job, p, thuLai) {
    if (hang !== job) return;
    var au = p.au;
    dangPhat = au;
    au.volume = job.u.volume == null ? 1 : job.u.volume;
    if (job.ds.length && job.ds[0].au) {
      try { job.ds[0].au.load(); } catch (e) {}
    }
    var daXong = false;
    au.onended = function () { if (daXong) return; daXong = true; tiep(job); };
    au.onerror = function () {
      if (daXong) return; daXong = true;
      if (thuLai > 0 && hang === job) {
        setTimeout(function () {
          p.au = new Audio(au.src);
          p.au.preload = "auto";
          phatAudio(job, p, thuLai - 1);
        }, 200);
      } else {
        doiMay(job, p.text);
      }
    };
    var pr = au.play();
    if (pr && pr.catch) {
      pr.catch(function (err) {
        if (daXong) return;
        if (thuLai > 0 && hang === job && (!err || err.name !== "NotAllowedError")) {
          daXong = true;
          setTimeout(function () { phatAudio(job, p, thuLai - 1); }, 200);
        } else {
          daXong = true;
          doiMay(job, p.text);
        }
      });
    }
  }

  function tiep(job) {
    if (hang !== job) return;
    if (!job.ds.length) return xong(job);
    var p = job.ds.shift();
    if (p.au) phatAudio(job, p, 2);
    else doiMay(job, p.text);
  }

  function doiMay(job, text) {
    if (hang !== job) return;
    var u = new SpeechSynthesisUtterance(chuanHoaVanNoi(text)), o = job.u;
    u.lang = o.lang || "vi-VN";
    if (o.voice) u.voice = o.voice;
    u.rate = o.rate || 1;
    u.pitch = o.pitch || 1;
    u.volume = o.volume == null ? 1 : o.volume;
    u.onend = u.onerror = function () { tiep(job); };
    goc.speak(u);
  }

  function thucHienDoc(u) {
    var raw = (u && u.text) || "", lang = (u && u.lang) || "";
    if (!CO || /^en/i.test(lang) || (!/^vi/i.test(lang) && !VN.test(raw))) return goc.speak(u);

    var ds = [], coFile = 0;
    raw.split(CAT).forEach(function (p) {
      p = p.trim();
      if (!p || !coChuSo(p)) return;
      var duongDan = timFileChoCau(p);
      if (duongDan) {
        var au = new Audio(BASE + duongDan + ".mp3");
        au.preload = "auto";
        ds.push({ au: au, text: p });
        coFile++;
      } else {
        ds.push({ text: p });
      }
    });

    if (!coFile) return goc.speak(u);
    ss.cancel();
    var job = { u: u, ds: ds }; hang = job; dangDoc = true;
    try { u.dispatchEvent(new Event("start")); } catch (e) {}
    tiep(job);
  }

  ss.speak = function (u) {
    var myLuot = ++luotCho;
    if (CO) return thucHienDoc(u);
    sanSang.then(function () {
      if (myLuot === luotCho) thucHienDoc(u);
    });
  };
  ss.cancel = function () {
    luotCho++;
    var j = hang; hang = null; dangDoc = false;
    try { if (dangPhat) dangPhat.pause(); } catch (e) {}
    dangPhat = null; goc.cancel();
    if (j) try { j.u.dispatchEvent(new Event("end")); } catch (e) {}
  };
  try {
    Object.defineProperty(ss, "speaking", {
      configurable: true,
      get: function () { return dangDoc || Object.getPrototypeOf(ss).__lookupGetter__("speaking").call(ss); }
    });
  } catch (e) {}
})();
