/* Giọng đọc tự nhiên VieNeu-TTS cho mọi game của Lucie & Lucas.
   Game vẫn gọi speechSynthesis.speak(...) như cũ; đoạn mã này chen vào giữa:
   - cắt câu, tìm file giọng đọc sẵn (games/anh-chung/giong/<mã>.mp3, do máy chủ GitHub đọc bằng VieNeu);
   - có file thì phát giọng VieNeu, chưa có thì đọc phần đó bằng giọng máy như cũ;
   - vẫn báo "start"/"end" cho game, cancel() vẫn dừng được.
   Cách cắt câu và tính mã PHẢI giống hệt tools/doc_giong.py. Câu tiếng Anh (lang en) giữ giọng máy. */
(function () {
  var ss = window.speechSynthesis;
  if (!ss || window.__giongNoi) return; window.__giongNoi = true;
  var me = document.currentScript, BASE = me ? me.src.replace(/giong-noi\.js.*$/, "giong/") : "/games/anh-chung/giong/";
  var CO = null, goc = { speak: ss.speak.bind(ss), cancel: ss.cancel.bind(ss) };
  var VN = /[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/i;
  var CAT = /[.!?…;:\n]+|\s\/\s|\s[-–—]\s/;
  fetch(BASE + "danh-sach.json", { cache: "no-cache" }).then(function (r) { return r.json(); })
    .then(function (a) { CO = {}; a.forEach(function (k) { CO[k] = 1; }); }).catch(function () {});

  function chuan(s) {
    return s.normalize("NFC").toLowerCase().replace(/["“”'‘’()\[\]«»*_]/g, "").replace(/\s+/g, " ")
      .replace(/^[\s.,!?…;:\-–—]+|[\s.,!?…;:\-–—]+$/g, "");
  }
  function ma(s) {
    var b = new TextEncoder().encode(s), h = 0x811c9dc5;
    for (var i = 0; i < b.length; i++) { h ^= b[i]; h = Math.imul(h, 0x01000193) >>> 0; }
    return ("0000000" + h.toString(16)).slice(-8);
  }

  var hang = null, dangDoc = false, dangPhat = null;
  function xong(job) { if (hang !== job) return; hang = null; dangDoc = false; dangPhat = null; try { job.u.dispatchEvent(new Event("end")); } catch (e) {} }
  function tiep(job) {
    if (hang !== job) return;
    if (!job.ds.length) return xong(job);
    var p = job.ds.shift();
    if (p.au) {   // file đã được tải trước từ đầu lượt đọc -> câu sau nối liền câu trước, không ngắt quãng
      dangPhat = p.au; p.au.volume = job.u.volume == null ? 1 : job.u.volume;
      p.au.onended = function () { tiep(job); };
      p.au.onerror = function () { doiMay(job, p.text); };
      var pr = p.au.play(); if (pr && pr.catch) pr.catch(function () { doiMay(job, p.text); });
    } else doiMay(job, p.text);
  }
  function doiMay(job, text) {   // câu chưa có giọng VieNeu: đọc bằng giọng máy rồi đi tiếp
    if (hang !== job) return;
    var u = new SpeechSynthesisUtterance(text), o = job.u;
    u.lang = o.lang || "vi-VN"; if (o.voice) u.voice = o.voice; u.rate = o.rate || 1; u.pitch = o.pitch || 1; u.volume = o.volume == null ? 1 : o.volume;
    u.onend = u.onerror = function () { tiep(job); };
    goc.speak(u);
  }
  ss.speak = function (u) {
    var text = (u && u.text) || "", lang = (u && u.lang) || "";
    if (!CO || /^en/i.test(lang) || (!/^vi/i.test(lang) && !VN.test(text))) return goc.speak(u);
    var ds = [], coFile = 0;
    text.split(CAT).forEach(function (p) {
      p = p.trim(); if (!p) return;
      var k = ma(chuan(p));
      if (chuan(p) && CO[k]) { var au = new Audio(BASE + k + ".mp3"); au.preload = "auto"; ds.push({ au: au, text: p }); coFile++; }
      else if (/[\p{L}\p{N}]/u.test(p)) ds.push({ text: p });
    });
    if (!coFile) return goc.speak(u);
    ss.cancel();
    var job = { u: u, ds: ds }; hang = job; dangDoc = true;
    try { u.dispatchEvent(new Event("start")); } catch (e) {}
    tiep(job);
  };
  ss.cancel = function () { var j = hang; hang = null; dangDoc = false; try { if (dangPhat) dangPhat.pause(); } catch (e) {} dangPhat = null; goc.cancel(); if (j) try { j.u.dispatchEvent(new Event("end")); } catch (e) {} };
  try { Object.defineProperty(ss, "speaking", { configurable: true, get: function () { return dangDoc || Object.getPrototypeOf(ss).__lookupGetter__("speaking").call(ss); } }); } catch (e) {}
})();
