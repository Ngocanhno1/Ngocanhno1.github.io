/* Giọng đọc tự nhiên VieNeu-TTS cho mọi game của Lucie & Lucas.
   Phát liền mạch bằng Web Audio API (cắt im lặng đầu/cuối, đệm LRU ~300 mục,
   tải song song có ngưỡng chờ 1,5s, tự quay về Audio/giọng máy khi lỗi). */
/* ==== Bộ chuẩn hóa văn nói (bản sao y nguyên games/anh-chung/chuan-hoa-van-noi.js) ==== */
/* Bộ chuẩn hóa văn nói tiếng Việt trước khi đọc (VieNeu-TTS & Web Speech)
   Dùng chung cho mọi game & sách truyện của Lucie & Lucas.
   Nguyên tắc: Mọi chuỗi tiếng Việt đều đi qua chuanHoaVanNoi(text) TRƯỚC KHI
   tách câu, tính mã hash FNV-1a tra danh-sach.json, hoặc phát âm thanh.
*/
(function (root) {
  function chuanHoaVanNoi(text) {
    if (!text) return "";
    var s = String(text).normalize("NFC");

    // 1. Bỏ emoji / ký hiệu trang trí không đọc được
    s = s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F\u200D]/gu, " ");

    // 2. Dấu ngăn cách hàng nghìn kiểu Việt (VD: 3.600 -> 3600, 12.000đ -> 12000đ)
    s = s.replace(/(^|[^\d])(\d{1,3}(?:\.\d{3})+)(?!\d)/g, function (_, pre, num) {
      return pre + num.replace(/\./g, "");
    });

    // 3. Mũi tên và khoảng số (VD: 13–19 -> từ 13 đến 19, 1→5 -> từ 1 đến 5)
    s = s.replace(/(\d+)\s*[→➡]\s*(\d+)/g, "từ $1 đến $2");
    s = s.replace(/\s*[→➡]\s*/g, ", suy ra ");
    s = s.replace(/(\d+)\s*[–—]\s*(\d+)/g, "từ $1 đến $2");

    // 4. Đơn vị đo & tiền tệ đi sau số (Unicode-safe, không dính chữ có dấu như "lỗi", "mét")
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

    // 5. Phép tính & ký hiệu toán học
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

    // 6. Tên riêng, thuật ngữ game & từ viết tắt sang văn nói tiếng Việt
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
    for (var i = 0; i < tuDien.length; i++) {
      s = s.replace(tuDien[i][0], tuDien[i][1]);
    }

    // 7. Làm mượt dấu ngoặc & dấu gạch dưới kỹ thuật thành nhịp nghỉ tự nhiên
    s = s.replace(/_/g, " ");
    s = s.replace(/\s*\(\s*/g, ", ");
    s = s.replace(/\s*\)\s*/g, ", ");
    s = s.replace(/["“”'‘’\[\]«»*]/g, "");

    // 8. Dọn dấu phẩy/khoảng trắng thừa
    s = s.replace(/\s+([.,!?;:])/g, "$1");
    s = s.replace(/,\s*([.,!?;:])/g, "$1");
    s = s.replace(/([.!?;:])\s*,/g, "$1 ");
    s = s.replace(/\s+/g, " ").trim();
    s = s.replace(/^,\s*|\s*,$/g, "").trim();

    return s;
  }

  root.chuanHoaVanNoi = chuanHoaVanNoi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { chuanHoaVanNoi: chuanHoaVanNoi };
  }
})(typeof window !== "undefined" ? window : globalThis);

/* ==== hết bộ chuẩn hóa ==== */
(function () {
  var ss = window.speechSynthesis;
  if (!ss || window.__giongNoi) return;
  window.__giongNoi = true;

  var me = document.currentScript;
  var BASE = me ? me.src.replace(/giong-noi\.js.*$/, "giong/") : "/games/anh-chung/giong/";
  var CO = null, PHU = [], goc = { speak: ss.speak.bind(ss), cancel: ss.cancel.bind(ss) };
  var VN = /[àáâãèéêìíòóôõùúýăđĩũơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i;
  var CAT = /[.!?…;:\n]+|\s\/\s|\s[-–—]\s/; // giống hệt CAT trong tools/doc_giong.py

  var MAX_CACHE = 300;
  var NGUONG_IM_LANG = 0.01;
  var CHUA_IM_LANG = 0.02;  // 20ms
  var NGHI_CHU_GHEP = 0.06; // 60ms giữa các chữ ghép
  var NGHI_GIUA_CAU = 0.18; // 180ms giữa các đoạn/câu
  var HAN_CHO_TAI = 1500;   // 1,5 giây

  var sanSang = Promise.all([
    fetch(BASE + "danh-sach.json", { cache: "no-cache" }).then(function (r) { return r.json(); })
      .then(function (a) { CO = {}; a.forEach(function (k) { CO[k] = 1; }); }).catch(function () { CO = {}; }),
    fetch(BASE + "giong.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (o) {
      Object.keys(o).forEach(function (thu) {
        var m = {};
        (o[thu].co || []).forEach(function (k) { m[k] = 1; });
        if (o[thu].co && o[thu].co.length > 50) PHU.push({ thu: thu, co: m });
      });
    }).catch(function () {})
  ]);

  function coGiongViet() {
    try { return ss.getVoices().some(function (v) { return /^vi/i.test(v.lang); }); } catch (e) { return false; }
  }

  function chuan(s) {
    return s.normalize("NFC").toLowerCase().replace(/["“”'‘’()\[\]«»*_]/g, "").replace(/\s+/g, " ")
      .replace(/^[\s.,!?…;:\-—–]+|[\s.,!?…;:\-—–]+$/g, "");
  }
  function ma(s) {
    var b = new TextEncoder().encode(s), h = 0x811c9dc5;
    for (var i = 0; i < b.length; i++) { h ^= b[i]; h = Math.imul(h, 0x01000193) >>> 0; }
    return ("00000000" + h.toString(16)).slice(-8);
  }

  /* ==== Web Audio API: AudioContext dùng chung, mở khóa, cắt im lặng, bộ nhớ đệm LRU ==== */
  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  var ctx = null, webAudioHong = !AudioCtx;
  var bufCache = new Map(); // duongDan -> { buffer, start, duration }
  var dangTai = new Map();  // duongDan -> Promise

  function layCtx() {
    if (webAudioHong) return null;
    if (!ctx) {
      try { ctx = new AudioCtx(); } catch (e) { webAudioHong = true; return null; }
    }
    return ctx;
  }

  function moKhoaCtx() {
    var c = layCtx();
    if (!c) return;
    if (c.state === "suspended") {
      try { c.resume().catch(function () {}); } catch (e) {}
    }
    // Phát 1 mẫu im lặng để mở khóa chắc chắn trên iPad Safari & LG webOS
    try {
      var b = c.createBuffer(1, 1, c.sampleRate || 22050);
      var s = c.createBufferSource();
      s.buffer = b;
      s.connect(c.destination);
      s.start(0);
    } catch (e) {}
    if (c.state === "running") goSuKienMoKhoa();
  }

  var suKienMoKhoa = ["pointerdown", "touchstart", "mousedown", "keydown", "click"];
  function goSuKienMoKhoa() {
    suKienMoKhoa.forEach(function (ev) {
      window.removeEventListener(ev, moKhoaCtx, true);
    });
  }
  if (!webAudioHong) {
    suKienMoKhoa.forEach(function (ev) {
      window.addEventListener(ev, moKhoaCtx, { capture: true, passive: true });
    });
  }

  function giaiMaAudio(c, arr) {
    return new Promise(function (resolve, reject) {
      var xongRoi = false;
      function ok(b) { if (!xongRoi) { xongRoi = true; resolve(b); } }
      function loi(e) { if (!xongRoi) { xongRoi = true; reject(e); } }
      try {
        var p = c.decodeAudioData(arr, ok, loi);
        if (p && typeof p.then === "function") p.then(ok, loi);
      } catch (e) {
        loi(e);
      }
    });
  }

  function catImLang(buffer) {
    var sr = buffer.sampleRate, len = buffer.length, ch = buffer.numberOfChannels;
    var dau = len, cuoi = -1;
    for (var k = 0; k < ch; k++) {
      var d = buffer.getChannelData(k);
      for (var i = 0; i < dau; i++) {
        if (Math.abs(d[i]) >= NGUONG_IM_LANG) { dau = i; break; }
      }
      for (var j = len - 1; j > cuoi; j--) {
        if (Math.abs(d[j]) >= NGUONG_IM_LANG) { cuoi = j; break; }
      }
    }
    if (dau >= len || cuoi < dau) {
      return { buffer: buffer, start: 0, duration: buffer.duration };
    }
    var pad = Math.round(CHUA_IM_LANG * sr);
    var sIdx = Math.max(0, dau - pad);
    var eIdx = Math.min(len, cuoi + 1 + pad);
    var start = sIdx / sr;
    var dur = Math.max(0.01, (eIdx - sIdx) / sr);
    return { buffer: buffer, start: start, duration: dur };
  }

  function layTuCache(key) {
    if (!bufCache.has(key)) return null;
    var v = bufCache.get(key);
    bufCache.delete(key);
    bufCache.set(key, v);
    return v;
  }

  function luuVaoCache(key, val) {
    if (bufCache.has(key)) bufCache.delete(key);
    bufCache.set(key, val);
    while (bufCache.size > MAX_CACHE) {
      bufCache.delete(bufCache.keys().next().value);
    }
  }

  function taiBuffer(duongDan) {
    var coSan = layTuCache(duongDan);
    if (coSan) return Promise.resolve(coSan);
    if (dangTai.has(duongDan)) return dangTai.get(duongDan);
    var c = layCtx();
    if (!c) return Promise.resolve(null);

    var pr = fetch(BASE + duongDan + ".mp3")
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.arrayBuffer();
      })
      .then(function (arr) { return giaiMaAudio(c, arr); })
      .then(function (buf) {
        var muc = catImLang(buf);
        luuVaoCache(duongDan, muc);
        dangTai.delete(duongDan);
        return muc;
      })
      .catch(function () {
        dangTai.delete(duongDan);
        return null;
      });
    dangTai.set(duongDan, pr);
    return pr;
  }

  function damBaoCtxChay() {
    var c = layCtx();
    if (!c) return Promise.resolve(false);
    if (c.state === "running") return Promise.resolve(true);
    return new Promise(function (resolve) {
      var daTra = false;
      function tra(ok) { if (!daTra) { daTra = true; resolve(ok); } }
      var t = setTimeout(function () { tra(c.state === "running"); }, 120);
      try {
        var p = c.resume();
        if (p && p.then) {
          p.then(function () { clearTimeout(t); tra(c.state === "running"); })
           .catch(function () { clearTimeout(t); tra(false); });
        } else {
          clearTimeout(t);
          tra(c.state === "running");
        }
      } catch (e) {
        clearTimeout(t);
        tra(false);
      }
    });
  }

  /* ==== Bộ điều phối phát & hàng đợi ==== */
  var hang = null, dangDoc = false, dangPhatCu = null, luotCho = 0;

  function dungNguonWebAudio(job) {
    if (!job) return;
    if (job.sources && job.sources.length) {
      job.sources.forEach(function (src) {
        try { src.onended = null; src.stop(0); } catch (e) {}
        try { src.disconnect(); } catch (e) {}
      });
      job.sources.length = 0;
    }
    if (job.gain) {
      try { job.gain.gain.value = 0; job.gain.disconnect(); } catch (e) {}
      job.gain = null;
    }
    job.activeCount = 0;
    job.nextTime = 0;
  }

  function xong(job) {
    if (hang !== job) return;
    dungNguonWebAudio(job);
    hang = null;
    dangDoc = false;
    dangPhatCu = null;
    try { job.u.dispatchEvent(new Event("end")); } catch (e) {}
  }

  // Fallback bằng new Audio khi Web Audio không dùng được hoặc decode lỗi
  function phatAudioCu(job, item, thuLai) {
    if (hang !== job) return;
    var au = new Audio(BASE + item.duongDan + ".mp3");
    au.preload = "auto";
    dangPhatCu = au;
    au.volume = job.u.volume == null ? 1 : job.u.volume;
    var daXong = false;
    au.onended = function () {
      if (daXong) return;
      daXong = true;
      if (dangPhatCu === au) dangPhatCu = null;
      chayTiep(job);
    };
    au.onerror = function () {
      if (daXong) return;
      daXong = true;
      if (dangPhatCu === au) dangPhatCu = null;
      if (thuLai > 0 && hang === job) {
        setTimeout(function () { phatAudioCu(job, item, thuLai - 1); }, 250);
      } else {
        doiMay(job, item.text);
      }
    };
    var pr = au.play();
    if (pr && pr.catch) {
      pr.catch(function (err) {
        if (daXong) return;
        if (thuLai > 0 && hang === job && (!err || err.name !== "NotAllowedError")) {
          daXong = true;
          setTimeout(function () { phatAudioCu(job, item, thuLai - 1); }, 220);
        } else {
          daXong = true;
          if (dangPhatCu === au) dangPhatCu = null;
          doiMay(job, item.text);
        }
      });
    }
  }

  function doiMay(job, text) {
    if (hang !== job) return;
    var u = new SpeechSynthesisUtterance(text), o = job.u;
    u.lang = o.lang || "vi-VN";
    if (o.voice) u.voice = o.voice;
    u.rate = o.rate || 1;
    u.pitch = o.pitch || 1;
    u.volume = o.volume == null ? 1 : o.volume;
    u.onend = u.onerror = function () { chayTiep(job); };
    goc.speak(u);
  }

  function xepLichWebAudio(job, c, item) {
    if (!job.gain) {
      job.gain = c.createGain();
      job.gain.gain.value = job.u.volume == null ? 1 : job.u.volume;
      job.gain.connect(c.destination);
    }
    var muc = item.muc;
    var now = c.currentTime + 0.02;
    var batDau = job.nextTime > c.currentTime ? job.nextTime : now;
    var src = c.createBufferSource();
    src.buffer = muc.buffer;
    src.connect(job.gain);
    job.sources.push(src);
    job.activeCount++;
    job.nextTime = batDau + muc.duration + (item.gapAfter || 0);

    src.onended = function () {
      var viTri = job.sources.indexOf(src);
      if (viTri >= 0) job.sources.splice(viTri, 1);
      job.activeCount--;
      if (hang !== job) return;
      if (job.idx >= job.ds.length && job.activeCount <= 0) {
        xong(job);
      } else if (job.activeCount <= 0 && job.choXa) {
        job.choXa = false;
        job.nextTime = 0;
        chayTiep(job);
      }
    };
    src.start(batDau, muc.start, muc.duration);
  }

  function chayTiep(job) {
    if (hang !== job) return;
    if (job.idx >= job.ds.length) {
      if (job.activeCount <= 0) xong(job);
      return;
    }

    var item = job.ds[job.idx];

    // Mục giọng máy: chờ các nguồn Web Audio đang chạy phát xong rồi mới đọc
    if (item.loai === "may") {
      if (job.activeCount > 0) { job.choXa = true; return; }
      job.idx++;
      doiMay(job, item.text);
      return;
    }

    // Không dùng được Web Audio -> phát bằng new Audio như cũ
    if (!job.dungWebAudio) {
      job.idx++;
      phatAudioCu(job, item, 2);
      return;
    }

    // Mục Web Audio chưa tải xong -> chờ mục này tải xong rồi xếp lịch tiếp
    if (!item.daTai) {
      if (!item.dangDoi) {
        item.dangDoi = true;
        item.promise.then(function () {
          if (hang === job) chayTiep(job);
        });
      }
      return;
    }

    // Tải hoặc decode lỗi -> chờ xả Web Audio rồi quay về new Audio cho mục này
    if (!item.muc) {
      if (job.activeCount > 0) { job.choXa = true; return; }
      job.idx++;
      phatAudioCu(job, item, 2);
      return;
    }

    // Xếp lịch liền mạch toàn bộ chuỗi mục Web Audio đã sẵn sàng
    var c = layCtx();
    if (!c || c.state !== "running") {
      damBaoCtxChay().then(function (ok) {
        if (hang !== job) return;
        if (!ok) {
          job.dungWebAudio = false;
          chayTiep(job);
          return;
        }
        chayTiep(job);
      });
      return;
    }

    while (job.idx < job.ds.length) {
      var cur = job.ds[job.idx];
      if (cur.loai !== "clip" || !cur.daTai || !cur.muc) break;
      xepLichWebAudio(job, c, cur);
      job.idx++;
    }

    // Nếu còn mục phía sau: nếu là clip đang tải thì nối tiếp ngay khi tải xong; nếu là máy/lỗi thì chờ xả
    if (job.idx < job.ds.length) {
      var ke = job.ds[job.idx];
      if (ke.loai === "clip" && !ke.daTai) {
        if (!ke.dangDoi) {
          ke.dangDoi = true;
          ke.promise.then(function () {
            if (hang === job) chayTiep(job);
          });
        }
      } else {
        job.choXa = true;
      }
    }
  }

  function thucHienDoc(u) {
    var text = (u && u.text) || "", lang = (u && u.lang) || "";
    if (!CO || /^en/i.test(lang) || (!/^vi/i.test(lang) && !VN.test(text))) return goc.speak(u);

    var ds = [], coFile = 0, viMay = coGiongViet();
    var chon = (PHU.length && !window.GIONG_MOT) ? Math.floor(Math.random() * (PHU.length + 1)) - 1 : -1;
    var g = chon >= 0 ? PHU[chon] : null;
    if (window.chuanHoaVanNoi) text = window.chuanHoaVanNoi(text); // văn nói tự nhiên, khớp mã với máy chủ

    function timTu(t) {
      var kt = ma(t);
      if (g && g.co[kt]) return g.thu + "/" + kt;
      if (CO[kt]) return kt;
      return null;
    }
    function themClip(duongDan, txt, gapAfter) {
      ds.push({ loai: "clip", duongDan: duongDan, text: txt, gapAfter: gapAfter, daTai: false, muc: null, promise: null, dangDoi: false });
      coFile++;
    }

    text.split(CAT).forEach(function (p) {
      p = p.trim();
      if (!p || !/[\p{L}\p{N}]/u.test(p)) return;
      var c = chuan(p), k = ma(c);
      if (c && g && g.co[k]) return themClip(g.thu + "/" + k, p, NGHI_GIUA_CAU);
      if (c && CO[k]) return themClip(k, p, NGHI_GIUA_CAU);

      var tu = c.match(/[\p{L}\p{N}]+/gu) || [];
      if (tu.length && tu.length <= 3 && tu.every(function (t) { return !!timTu(t); })) {
        tu.forEach(function (t, i) {
          themClip(timTu(t), t, i < tu.length - 1 ? NGHI_CHU_GHEP : NGHI_GIUA_CAU);
        });
        return;
      }
      // Đoạn >3 chữ không có tệp: dùng giọng máy, nhưng nếu máy không có giọng Việt thì ghép từng chữ qua Web Audio
      if (!viMay && tu.length && tu.some(function (t) { return !!timTu(t); })) {
        tu.forEach(function (t, i) {
          var dd = timTu(t);
          if (dd) themClip(dd, t, i < tu.length - 1 ? NGHI_CHU_GHEP : NGHI_GIUA_CAU);
          else ds.push({ loai: "may", text: t });
        });
        return;
      }
      ds.push({ loai: "may", text: p });
    });

    if (!coFile) return goc.speak(u);
    if (ds.length && ds[ds.length - 1].loai === "clip") ds[ds.length - 1].gapAfter = 0;

    ss.cancel();
    var dungWA = !webAudioHong && !!layCtx();
    var job = {
      u: u,
      ds: ds,
      idx: 0,
      dungWebAudio: dungWA,
      sources: [],
      gain: null,
      activeCount: 0,
      nextTime: 0,
      choXa: false
    };
    hang = job;
    dangDoc = true;
    try { u.dispatchEvent(new Event("start")); } catch (e) {}

    if (!dungWA) {
      chayTiep(job);
      return;
    }

    // Tải song song toàn bộ các đoạn; tối đa chờ 1,5s rồi phát phần đã sẵn và nối tiếp
    var cacPromise = [];
    ds.forEach(function (item) {
      if (item.loai !== "clip") return;
      item.promise = taiBuffer(item.duongDan).then(function (muc) {
        item.muc = muc;
        item.daTai = true;
        return muc;
      });
      cacPromise.push(item.promise);
    });

    var daXongHet = Promise.all(cacPromise);
    var quaHan = new Promise(function (resolve) { setTimeout(resolve, HAN_CHO_TAI); });

    Promise.race([daXongHet, quaHan]).then(function () {
      if (hang !== job) return;
      damBaoCtxChay().then(function (ok) {
        if (hang !== job) return;
        if (!ok) job.dungWebAudio = false;
        chayTiep(job);
      });
    });
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
    var j = hang;
    hang = null;
    dangDoc = false;
    dungNguonWebAudio(j);
    try {
      if (dangPhatCu) {
        dangPhatCu.onended = dangPhatCu.onerror = null;
        dangPhatCu.pause();
      }
    } catch (e) {}
    dangPhatCu = null;
    goc.cancel();
    if (j) try { j.u.dispatchEvent(new Event("end")); } catch (e) {}
  };

  try {
    Object.defineProperty(ss, "speaking", {
      configurable: true,
      get: function () {
        return dangDoc || Object.getPrototypeOf(ss).__lookupGetter__("speaking").call(ss);
      }
    });
  } catch (e) {}
})();
