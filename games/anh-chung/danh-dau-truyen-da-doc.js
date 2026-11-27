/* Tự động gắn huy hiệu tích xanh (✓ Đã đọc & trả lời hết) lên các truyện đã hoàn thành
   trong trang Sách Truyện (games/sach-truyen/), không cần sửa đè index.html.
*/
(function () {
  if (window.__danhDauTruyenDaDoc) return;
  window.__danhDauTruyenDaDoc = true;

  var dsTruyen = [];

  function docJsonLS(key) {
    try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (e) { return null; }
  }

  function layTrangThaiHoanThanh() {
    var kq = {}; // { "tuan-01": { lucie: true, lucas: false } }
    ["lucie", "lucas"].forEach(function (be) {
      var o = docJsonLS("sachtruyen_" + be) || {};
      var tr = o.truyen || o.daDoc || o.xong || {};
      if (Array.isArray(tr)) {
        tr.forEach(function (ma) {
          if (!kq[ma]) kq[ma] = {};
          kq[ma][be] = true;
        });
      } else if (tr && typeof tr === "object") {
        Object.keys(tr).forEach(function (ma) {
          var v = tr[ma];
          // Đã hoàn thành khi có giá trị truthy (số sao > 0, true, hoặc object có hoanThanh/sao/cau)
          var xong = (v === true) || (typeof v === "number" && v > 0) ||
                     (v && typeof v === "object" && (v.xong || v.hoanThanh || v.sao > 0 || v.dung > 0 || v.ngay));
          if (xong) {
            if (!kq[ma]) kq[ma] = {};
            kq[ma][be] = true;
          }
        });
      }
    });
    return kq;
  }

  function chenStyle() {
    if (document.getElementById("ll-tich-da-doc-css")) return;
    var st = document.createElement("style");
    st.id = "ll-tich-da-doc-css";
    st.textContent = [
      ".ll-badge-dadoc {",
      "  position: absolute; top: 10px; right: 10px; z-index: 9;",
      "  background: #16a34a; color: #fff; font-weight: 800;",
      "  font-size: 13px; line-height: 1.2; padding: 5px 10px;",
      "  border-radius: 999px; box-shadow: 0 3px 10px rgba(22,163,74,.45);",
      "  border: 2px solid #ffffff; pointer-events: none;",
      "  font-family: system-ui, -apple-system, sans-serif;",
      "}",
      ".ll-card-dadoc { box-shadow: 0 0 0 3px #22c55e !important; }"
    ].join("\n");
    (document.head || document.documentElement).appendChild(st);
  }

  function ganHuyHieu() {
    var st = layTrangThaiHoanThanh();
    var maList = Object.keys(st);
    if (!maList.length) return;
    chenStyle();

    // Map tiêu đề -> mã truyện để nhận diện chắc chắn mọi kiểu thẻ HTML
    var titleToMa = {};
    dsTruyen.forEach(function (it) {
      if (it && it.tieu_de && it.ma) titleToMa[it.tieu_de.trim().toLowerCase()] = it.ma;
    });

    var cards = document.querySelectorAll("[data-ma], [data-id], .card, .truyen, .book, a[href*='tuan-'], button");
    for (var i = 0; i < cards.length; i++) {
      var el = cards[i];
      if (el.offsetWidth < 120 || el.offsetHeight < 80) continue;
      var ma = el.getAttribute("data-ma") || el.getAttribute("data-id") || "";
      if (!ma) {
        var html = (el.getAttribute("href") || "") + " " + (el.getAttribute("onclick") || "") + " " + (el.innerHTML || "");
        var m = html.match(/tuan-\d{2}/i);
        if (m) ma = m[0].toLowerCase();
      }
      if (!ma && el.textContent) {
        var txt = el.textContent.trim().toLowerCase();
        Object.keys(titleToMa).forEach(function (td) {
          if (!ma && txt.indexOf(td) !== -1) ma = titleToMa[td];
        });
      }
      if (!ma || !st[ma]) continue;

      var info = st[ma];
      var nhan = (info.lucie && info.lucas) ? "✓ Đã đọc & trả lời hết (Cả 2 bé)"
               : info.lucie ? "✓ Lucie đã đọc xong"
               : "✓ Lucas đã đọc xong";

      var cs = getComputedStyle(el);
      if (cs.position === "static") el.style.position = "relative";
      el.classList.add("ll-card-dadoc");

      var old = el.querySelector(".ll-badge-dadoc");
      if (old) {
        if (old.textContent !== nhan) old.textContent = nhan;
      } else {
        var b = document.createElement("span");
        b.className = "ll-badge-dadoc";
        b.textContent = nhan;
        el.appendChild(b);
      }
    }
  }

  function khoiChay() {
    fetch("truyen/danh-sach.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (a) { if (Array.isArray(a)) dsTruyen = a; ganHuyHieu(); })
      .catch(function () { ganHuyHieu(); });

    var mo = new MutationObserver(function () { ganHuyHieu(); });
    if (document.body) mo.observe(document.body, { childList: true, subtree: true });
    setInterval(ganHuyHieu, 2500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", khoiChay);
  else khoiChay();
})();
