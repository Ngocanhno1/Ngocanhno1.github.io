/* Giọng đọc đồng bộ 1 giọng duy nhất cho mọi game & sách truyện Lucie & Lucas.
   Nâng cấp:
   1. Khóa cứng 1 giọng chính duy nhất (không random trộn giọng phụ giữa chừng -> hết cảnh giọng này nối giọng kia).
   2. Tích hợp sẵn chuanHoaVanNoi() chuyển phép tính, đơn vị đo, tên Lu Xi / Lu Cát thành văn nói tự nhiên trước khi tra MP3.
   3. Bỏ hoàn toàn cơ chế cắt câu dài ghép từng từ đơn gây giật cục trên TV LG webOS.
   4. Đệm sẵn (preload) file MP3 câu tiếp theo ngay khi đang phát câu hiện tại để chuyển câu liền mạch.
   5. Tự nạp bộ tối ưu hiển thị TV/Mobile (toi-uu-tv-muot.css/js) và âm thanh chung (am-thanh-chung.js).
*/
(function () {
  var me = document.currentScript;
  var ROOT_AC = me ? me.src.replace(/giong-noi\.js.*$/, "") : "/games/anh-chung/";
  var BASE = ROOT_AC + "giong/";

  // Tự nạp CSS & JS tối ưu hiển thị TV/Mobile và âm thanh chung cho mọi trang đang dùng giong-noi.js
  (function napBoToiUu() {
    try {
      var head = document.head || document.documentElement;
      if (head && !document.querySelector('link[href*="toi-uu-tv-muot.css"]')) {
        var lk = document.createElement("link");
        lk.rel = "stylesheet";
        lk.href = ROOT_AC + "toi-uu-tv-muot.css?v=20261126";
        head.appendChild(lk);
      }
      if (head && !window.__toiUuTvMuot && !document.querySelector('script[src*="toi-uu-tv-muot.js"]')) {
        var sc1 = document.createElement("script");
        sc1.src = ROOT_AC + "toi-uu-tv-muot.js?v=20261126";
        sc1.defer = true;
        head.appendChild(sc1);
      }
      if (head && !window.AmThanhChung && !document.querySelector('script[src*="am-thanh-chung.js"]')) {
        var sc2 = document.createElement("script");
        sc2.src = ROOT_AC + "am-thanh-chung.js?v=20261126";
        sc2.defer = true;
        head.appendChild(sc2);
      }
    } catch (e) {}
  })();

  // Bộ chuẩn hóa văn nói tiếng Việt (đồng nhất 100% với bản Python sinh MP3)
  function chuanHoaVanNoi(text) {
    if (!text) return "";
    var s = String(text).normalize("NFC");
    s = s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F\u200D]/gu, " ");
    s = s.replace(/(^|[^\d])(\d{1,3}(?:\.\d{3})+)(?!\d)/g, function (_, pre, num) {
      return pre + num.replace(/\./g, "");
    });
    s = s.replace(/(\d+)\s*[→➡]\s*(\d+)/g, "từ $1 đến $2");
    s = s.replace(/\s*[→➡]\s*/g, ", suy ra ");
    s = s.replace(/(\d+)\s*[–—]\s*(\d+)/g, "từ $1 đến $2");
    s = s.replace(/(\d+)\s*°\s*C(?![\p{L}\p{N}])/giu, "$1 độ xê");
    s = s.replace(/(\d+)\s*%/g, "$1 phần trăm");
    s = s.replace(/(\d+)\s*km(?![\p{L}\p{N}])/giu, "$1 ki lô mét");
    s = s.replace(/(\d+)\s*dm(?![\p{L}\p{N}])/giu, "$1 đề xi mét");
    s = s.replace(/(\d+)\s*cm(?![\p{L}\p{N}])/giu, "$1 xăng ti mét");
    s = s.replace(/(\d+)\s*mm(?![\p{L}\p{N}])/giu, "$1 mi li mét");
    s = s.replace(/(\d+)\s*kg(?![\p{L}\p{N}])/giu, "$1 ki lô gam");
    s = s.replace(/(\d+)\s*ml(?![\p{L}\p{N}])/giu, "$1 mi li lít");
    s = s.replace(/(\d+)\s*m(?![\p{L}\p{N}])/gu, "$1 mét");
    s = s.replace(/(\d+)\s*g(?![\p{L}\p{N}])/gu, "$1 gam");
    s = s.replace(/(\d+)\s*l(?![\p{L}\p{N}])/gu, "$1 lít");
    s = s.replace(/(\d+)\s*h\s*(\d{1,2})(?!\d)/giu, "$1 giờ $2 phút");
    s = s.replace(/(\d+)\s*h(?![\p{L}\p{N}])/giu, "$1 giờ");
    s = s.replace(/(\d+)\s*(?:VNĐ|VND|đ)(?![\p{L}\p{N}])/giu, "$1 đồng");
    s = s.replace(/(\d+)\s*[×xX\*]\s*(\d+)/g, "$1 nhân $2");
    s = s.replace(/(\d+)\s*[÷:]\s*(\d+)/g, "$1 chia $2");
    s = s.replace(/(\d+)\s*\+\s*(\d+)/g, "$1 cộng $2");
    s = s.replace(/(\d+)\s*[\-−]\s*(\d+)/g, "$1 trừ $2");
    s = s.replace(/\s*=\s*\?/g, " bằng mấy?");
    s = s.replace(/\s*=\s*(?:_{2,}|\.{3,})/g, " bằng mấy");
    s = s.replace(/\s*=\s*/g, " bằng ");
    s = s.replace(/\s*>\s*/g, " lớn hơn ");
    s = s.replace(/\s*<\s*/g, " bé hơn ");
    s = s.replace(/_{2,}/g, " chỗ trống ");
    var tuDien = [
      [/(?<![\p{L}\p{N}])Fun\s+for\s+Flyers(?![\p{L}\p{N}])/giu, "Phăn pho Flai ơ"],
      [/(?<![\p{L}\p{N}])Lucie(?![\p{L}\p{N}])/giu, "Lu Xi"],
      [/(?<![\p{L}\p{N}])Lucas(?![\p{L}\p{N}])/giu, "Lu Cát"],
      [/(?<![\p{L}\p{N}])CIECAS(?![\p{L}\p{N}])/giu, "Xi Cát"],
      [/(?<![\p{L}\p{N}])do_kho(?![\p{L}\p{N}])/giu, "độ khó"],
      [/(?<![\p{L}\p{N}])level\s*(\d+)(?!\d)/giu, "màn $1"],
      [/(?<![\p{L}\p{N}])lv\.?\s*(\d+)(?!\d)/giu, "màn $1"],
      [/(?<![\p{L}\p{N}])level(?![\p{L}\p{N}])/giu, "màn"],
      [/(?<![\p{L}\p{N}])game(?![\p{L}\p{N}])/giu, "trò chơi"],
      [/(?<![\p{L}\p{N}])combo(?![\p{L}\p{N}])/giu, "chuỗi đúng liên tiếp"],
      [/(?<![\p{L}\p{N}])HK1(?![\p{L}\p{N}])/gu, "học kỳ một"],
      [/(?<![\p{L}\p{N}])HK2(?![\p{L}\p{N}])/gu, "học kỳ hai"]
    ];
    for (var i = 0; i < tuDien.length; i++) s = s.replace(tuDien[i][0], tuDien[i][1]);
    s = s.replace(/_/g, " ").replace(/\s*\(\s*/g, ", ").replace(/\s*\)\s*/g, ", ");
    s = s.replace(/["“”'‘’\[\]«»*]/g, "");
    s = s.replace(/\s+([.,!?;:])/g, "$1").replace(/,\s*([.,!?;:])/g, "$1").replace(/([.!?;:])\s*,/g, "$1 ");
    return s.replace(/\s+/g, " ").replace(/^,\s*|\s*,$/g, "").trim();
  }
  window.chuanHoaVanNoi = chuanHoaVanNoi;

  var ss = window.speechSynthesis;
  if (!ss || window.__giongNoi) return;
  window.__giongNoi = true;

  // Khóa mặc định 1 giọng duy nhất đồng bộ toàn hệ thống (không trộn giọng phụ ngẫu nhiên)
  window.GIONG_MOT = true;

  var CO = null, goc = { speak: ss.speak.bind(ss), cancel: ss.cancel.bind(ss) };
  var VN = /[àáâãèéêìíòóôõùúýăđĩũơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i;
  var CAT = /[.!?…;\n]+\s|\s[—–]\s/;

  var sanSang = fetch(BASE + "danh-sach.json", { cache: "no-cache" })
    .then(function (r) { return r.json(); })
    .then(function (a) { CO = {}; a.forEach(function (k) { CO[k] = 1; }); })
    .catch(function () { CO = {}; });

  function chuan(s) {
    return s.normalize("NFC").toLowerCase().replace(/["“”'‘’()\[\]«»*_]/g, "").replace(/\s+/g, " ")
      .replace(/^[\s.,!?…;:\-—–]+|[\s.,!?…;:\-—–]+$/g, "");
  }
  function ma(s) {
    var b = new TextEncoder().encode(s), h = 0x811c9dc5;
    for (var i = 0; i < b.length; i++) { h ^= b[i]; h = Math.imul(h, 0x01000193) >>> 0; }
    return ("00000000" + h.toString(16)).slice(-8);
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
    // Đệm sẵn câu kế tiếp trong lúc đang phát câu hiện tại để chuyển câu mượt không khựng
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
    var u = new SpeechSynthesisUtterance(text), o = job.u;
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

    // Thử cả bản nguyên gốc (khớp MP3 cũ đã sinh) lẫn bản đã chuẩn hóa văn nói (khớp MP3 mới)
    var ds = [], coFile = 0;
    function clip(duongDan, text) {
      var au = new Audio(BASE + duongDan + ".mp3");
      au.preload = "auto";
      ds.push({ au: au, text: text });
      coFile++;
    }

    var textChuan = chuanHoaVanNoi(raw);
    textChuan.split(CAT).forEach(function (p) {
      p = p.trim();
      if (!p || !/[\p{L}\p{N}]/u.test(p)) return;
      var c = chuan(p), k = ma(c);
      if (c && CO[k]) return clip(k, p);
      // Không cắt câu dài thành từng từ đơn nữa — chỉ giữ nguyên câu đọc liền mạch
      ds.push({ text: p });
    });

    // Nếu bản chuẩn hóa không khớp MP3 nào nhưng bản gốc lại khớp MP3 cũ đã sinh sẵn -> ưu tiên dùng MP3 đồng bộ 1 giọng!
    if (!coFile && textChuan !== raw) {
      var dsGoc = [], coGoc = 0;
      raw.split(CAT).forEach(function (p) {
        p = p.trim();
        if (!p || !/[\p{L}\p{N}]/u.test(p)) return;
        var c = chuan(p), k = ma(c);
        if (c && CO[k]) {
          var au = new Audio(BASE + k + ".mp3");
          au.preload = "auto";
          dsGoc.push({ au: au, text: p });
          coGoc++;
        } else {
          dsGoc.push({ text: chuanHoaVanNoi(p) });
        }
      });
      if (coGoc > 0) { ds = dsGoc; coFile = coGoc; }
    }

    if (!coFile) {
      var uChuan = new SpeechSynthesisUtterance(textChuan);
      uChuan.lang = u.lang || "vi-VN";
      uChuan.rate = u.rate || 1;
      uChuan.pitch = u.pitch || 1;
      uChuan.volume = u.volume == null ? 1 : u.volume;
      return goc.speak(uChuan);
    }

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
