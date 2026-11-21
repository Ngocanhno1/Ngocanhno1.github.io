/* Giọng đọc tự nhiên VieNeu-TTS cho mọi game của Lucie & Lucas.
   Đã vá lỗi mất câu đầu trên TV: chờ danh-sach.json tải xong trước khi đọc và chờ Audio câu đầu sẵn sàng trước khi phát. */
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
  if (!ss || window.__giongNoi) return; window.__giongNoi = true;
  var me = document.currentScript, BASE = me ? me.src.replace(/giong-noi\.js.*$/, "giong/") : "/games/anh-chung/giong/";
  var CO = null, PHU = [], goc = { speak: ss.speak.bind(ss), cancel: ss.cancel.bind(ss) };
  var VN = /[àáâãèéêìíòóôõùúýăđĩũơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/i;
  var CAT = /[.!?…;:\n]+|\s\/\s|\s[-–—]\s/;   // giống hệt CAT trong tools/doc_giong.py

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

  function coGiongViet() { try { return ss.getVoices().some(function (v) { return /^vi/i.test(v.lang); }); } catch (e) { return false; } }

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
  function xong(job) { if (hang !== job) return; hang = null; dangDoc = false; dangPhat = null; try { job.u.dispatchEvent(new Event("end")); } catch (e) {} }

  function phatAudio(job, p, thuLai) {
    if (hang !== job) return;
    var au = p.au;
    dangPhat = au;
    au.volume = job.u.volume == null ? 1 : job.u.volume;
    var daXong = false;
    au.onended = function () { if (daXong) return; daXong = true; tiep(job); };
    au.onerror = function () {
      if (daXong) return; daXong = true;
      if (thuLai > 0 && hang === job) {
        setTimeout(function () {
          p.au = new Audio(au.src);
          p.au.preload = "auto";
          phatAudio(job, p, thuLai - 1);
        }, 250);
      } else {
        doiMay(job, p.text);
      }
    };
    var pr = au.play();
    if (pr && pr.catch) {
      pr.catch(function (err) {
        if (daXong) return;
        // Nếu TV chưa kịp đệm xong file mp3 đầu tiên (AbortError / NotAllowed), chờ nhẹ 220ms rồi thử lại 1 lần
        if (thuLai > 0 && hang === job && (!err || err.name !== "NotAllowedError")) {
          daXong = true;
          setTimeout(function () { phatAudio(job, p, thuLai - 1); }, 220);
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
    u.lang = o.lang || "vi-VN"; if (o.voice) u.voice = o.voice; u.rate = o.rate || 1; u.pitch = o.pitch || 1; u.volume = o.volume == null ? 1 : o.volume;
    u.onend = u.onerror = function () { tiep(job); };
    goc.speak(u);
  }

  function thucHienDoc(u) {
    var text = (u && u.text) || "", lang = (u && u.lang) || "";
    if (!CO || /^en/i.test(lang) || (!/^vi/i.test(lang) && !VN.test(text))) return goc.speak(u);
    var ds = [], coFile = 0, viMay = coGiongViet();
    var chon = (PHU.length && !window.GIONG_MOT) ? Math.floor(Math.random() * (PHU.length + 1)) - 1 : -1;
    var g = chon >= 0 ? PHU[chon] : null;
    if (window.chuanHoaVanNoi) text = window.chuanHoaVanNoi(text);   // văn nói tự nhiên, khớp mã với máy chủ
    function clip(duongDan, text) { var au = new Audio(BASE + duongDan + ".mp3"); au.preload = "auto"; ds.push({ au: au, text: text }); coFile++; }
    text.split(CAT).forEach(function (p) {
      p = p.trim(); if (!p || !/[\p{L}\p{N}]/u.test(p)) return;
      var c = chuan(p), k = ma(c);
      if (c && g && g.co[k]) return clip(g.thu + "/" + k, p);
      if (c && CO[k]) return clip(k, p);
      var tu = c.match(/[\p{L}\p{N}]+/gu) || [];
      if (!viMay && tu.length && tu.length <= 3 && tu.every(function (t) { return CO[ma(t)]; })) { tu.forEach(function (t) { clip(ma(t), t); }); return; }
      ds.push({ text: p });
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
  try { Object.defineProperty(ss, "speaking", { configurable: true, get: function () { return dangDoc || Object.getPrototypeOf(ss).__lookupGetter__("speaking").call(ss); } }); } catch (e) {}
})();
