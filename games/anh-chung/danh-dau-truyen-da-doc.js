/* Quản lý tiến độ Sách Truyện thông minh:
   1. Gắn huy hiệu tích xanh (✓ Đã đọc & trả lời hết) cho truyện đã hoàn thành.
   2. Chống mở tràn lan: tối đa 3 tập chưa đọc được mở cùng lúc.
   3. Luôn hé lộ đúng 5 tập kế tiếp ở trạng thái KHÓA (🔒) để kích thích Lucie & Lucas siêng nghe.
   4. Các tập sản xuất sẵn xa hơn nữa sẽ ẩn gọn trong kho, tự động mở dần khi hai bé đọc xong.
*/
(function () {
  if (window.__danhDauTruyenDaDocV2) return;
  window.__danhDauTruyenDaDocV2 = true;

  var MAX_CHUA_DOC_MO = 3; // Tối đa 3 tập chưa đọc được mở cùng lúc
  var SO_TAP_NHA_HANG = 5; // Hiện hé lộ 5 tập kế tiếp bị khóa 🔒
  var dsTruyen = [];

  function docJsonLS(key) {
    try { return JSON.parse(localStorage.getItem(key) || "null"); } catch (e) { return null; }
  }

  function layTrangThaiHoanThanh() {
    var kq = {};
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
    if (document.getElementById("ll-tich-va-khoa-css")) return;
    var st = document.createElement("style");
    st.id = "ll-tich-va-khoa-css";
    st.textContent = [
      ".ll-badge-dadoc {",
      "  position: absolute; top: 10px; right: 10px; z-index: 10;",
      "  background: #16a34a; color: #fff; font-weight: 800;",
      "  font-size: 13px; line-height: 1.2; padding: 5px 10px;",
      "  border-radius: 999px; box-shadow: 0 3px 10px rgba(22,163,74,.45);",
      "  border: 2px solid #fff; pointer-events: none;",
      "  font-family: system-ui, -apple-system, sans-serif;",
      "}",
      ".ll-card-dadoc { box-shadow: 0 0 0 3px #22c55e !important; }",
      ".ll-card-khoa { position: relative !important; opacity: 0.78 !important; }",
      ".ll-card-khoa img { filter: grayscale(45%) blur(1.2px) !important; }",
      ".ll-badge-khoa {",
      "  position: absolute; top: 10px; right: 10px; z-index: 12;",
      "  background: #f59e0b; color: #1e293b; font-weight: 800;",
      "  font-size: 13px; line-height: 1.25; padding: 6px 11px;",
      "  border-radius: 999px; box-shadow: 0 4px 12px rgba(0,0,0,.3);",
      "  border: 2px solid #fff; pointer-events: none;",
      "  font-family: system-ui, -apple-system, sans-serif;",
      "}",
      ".ll-toast-khoa {",
      "  position: fixed; left: 50%; bottom: 24px; transform: translateX(-50%);",
      "  z-index: 99999; background: #1e293b; color: #fff; padding: 12px 18px;",
      "  border-radius: 14px; font: 700 14px/1.4 system-ui,sans-serif;",
      "  box-shadow: 0 10px 28px rgba(0,0,0,.35); max-width: 90vw; text-align: center;",
      "}"
    ].join("\n");
    (document.head || document.documentElement).appendChild(st);
  }

  function hienThongBaoKhoa(msg) {
    var old = document.getElementById("ll-toast-khoa");
    if (old) old.remove();
    var t = document.createElement("div");
    t.id = "ll-toast-khoa";
    t.className = "ll-toast-khoa";
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3200);
  }

  function laySoTap(ma) {
    var m = String(ma || "").match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 0;
  }

  function apDungTienDoVaKhoa() {
    chenStyle();
    var st = layTrangThaiHoanThanh();

    // Sắp xếp danh sách truyện theo thứ tự tập tăng dần 1 -> N để tính ngưỡng mở khóa
    var ordered = dsTruyen.slice().sort(function (a, b) { return (a.so || laySoTap(a.ma)) - (b.so || laySoTap(b.ma)); });
    var trangThaiTap = {}; // ma -> "xong" | "mo" | "khoa" | "an"
    var demChuaDocMo = 0;
    var demNhaHang = 0;

    ordered.forEach(function (it) {
      var ma = it.ma;
      if (!ma) return;
      if (st[ma]) {
        trangThaiTap[ma] = "xong";
      } else if (demChuaDocMo < MAX_CHUA_DOC_MO) {
        trangThaiTap[ma] = "mo";
        demChuaDocMo++;
      } else if (demNhaHang < SO_TAP_NHA_HANG) {
        trangThaiTap[ma] = "khoa";
        demNhaHang++;
      } else {
        trangThaiTap[ma] = "an";
      }
    });


    // PHẦN THƯỞNG MỞ KHÓA TẬP HOẠT HÌNH ĐẶC BIỆT (tuan-30): Đọc đủ 5 tập tích xanh -> mở khóa ngay!
    var tongDaDoc = Object.keys(st).length;
    var MOC_MO_HOAT_HINH = 5;
    if (trangThaiTap["tuan-30"]) {
      if (st["tuan-30"]) trangThaiTap["tuan-30"] = "xong";
      else if (tongDaDoc >= MOC_MO_HOAT_HINH) trangThaiTap["tuan-30"] = "hoat_hinh_mo";
      else trangThaiTap["tuan-30"] = "hoat_hinh_khoa";
    }

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
      if (!ma) continue;

      var mode = trangThaiTap[ma] || (st[ma] ? "xong" : "mo");
      var cs = getComputedStyle(el);
      if (cs.position === "static") el.style.position = "relative";

      if (mode === "an") {
        el.style.display = "none";
        continue;
      } else if (el.style.display === "none") {
        el.style.display = "";
      }

      if (mode === "xong") {
        el.classList.remove("ll-card-khoa");
        el.classList.add("ll-card-dadoc");
        var bk = el.querySelector(".ll-badge-khoa");
        if (bk) bk.remove();
        var info = st[ma] || {};
        var nhan = (info.lucie && info.lucas) ? "✓ Đã đọc & trả lời hết (Cả 2 bé)"
                 : info.lucie ? "✓ Lucie đã đọc xong"
                 : "✓ Lucas đã đọc xong";
        var old = el.querySelector(".ll-badge-dadoc");
        if (old) { if (old.textContent !== nhan) old.textContent = nhan; }
        else {
          var b = document.createElement("span");
          b.className = "ll-badge-dadoc";
          b.textContent = nhan;
          el.appendChild(b);
        }
      } else if (mode === "khoa") {
        el.classList.remove("ll-card-dadoc");
        el.classList.add("ll-card-khoa");
        var bd = el.querySelector(".ll-badge-dadoc");
        if (bd) bd.remove();
        if (!el.querySelector(".ll-badge-khoa")) {
          var bk2 = document.createElement("span");
          bk2.className = "ll-badge-khoa";
          bk2.textContent = "🔒 Nghe xong tập trước để mở";
          el.appendChild(bk2);
        }
        if (!el.__daGanChanKhoa) {
          el.__daGanChanKhoa = true;
          el.addEventListener("click", function (ev) {
            if (this.classList.contains("ll-card-khoa")) {
              ev.preventDefault();
              ev.stopPropagation();
              hienThongBaoKhoa("🔒 Tập này đang khóa! Bé hãy nghe xong và trả lời hết câu hỏi ở 3 tập đang mở để mở khóa tập mới nhé!");
            }
          }, true);
        }
      } else if (mode === "hoat_hinh_mo") {
        el.classList.remove("ll-card-khoa");
        var bkH = el.querySelector(".ll-badge-khoa"); if (bkH) bkH.remove();
        var oldH = el.querySelector(".ll-badge-dadoc");
        var txtH = "🎬 PHIM HOẠT HÌNH ĐÃ MỞ KHÓA!";
        if (oldH) { if (oldH.textContent !== txtH) oldH.textContent = txtH; }
        else {
          var bH = document.createElement("span");
          bH.className = "ll-badge-dadoc";
          bH.style.background = "linear-gradient(135deg,#f59e0b,#ec4899)";
          bH.textContent = txtH;
          el.appendChild(bH);
        }
      } else if (mode === "hoat_hinh_khoa") {
        el.classList.remove("ll-card-dadoc");
        el.classList.add("ll-card-khoa");
        var bdH = el.querySelector(".ll-badge-dadoc"); if (bdH) bdH.remove();
        var txtHK = "🎬 Quà Hoạt Hình (" + Object.keys(st).length + "/5 tập)";
        var bkH2 = el.querySelector(".ll-badge-khoa");
        if (bkH2) { if (bkH2.textContent !== txtHK) bkH2.textContent = txtHK; }
        else {
          var bHK = document.createElement("span");
          bHK.className = "ll-badge-khoa";
          bHK.style.background = "#fbbf24";
          bHK.textContent = txtHK;
          el.appendChild(bHK);
        }
        if (!el.__daGanChanKhoa) {
          el.__daGanChanKhoa = true;
          el.addEventListener("click", function (ev) {
            if (this.classList.contains("ll-card-khoa")) {
              ev.preventDefault();
              ev.stopPropagation();
              hienThongBaoKhoa("🎬 Tập Phim Hoạt Hình Đặc Biệt! Bé hãy nghe xong và trả lời hết câu hỏi của đủ 5 tập truyện để mở khóa phần thưởng này nhé!");
            }
          }, true);
        }
      } else {
        el.classList.remove("ll-card-khoa");
        var bk3 = el.querySelector(".ll-badge-khoa");
        if (bk3) bk3.remove();
      }
    }
  }

  function khoiChay() {
    fetch("truyen/danh-sach.json", { cache: "no-cache" })
      .then(function (r) { return r.json(); })
      .then(function (a) { if (Array.isArray(a)) dsTruyen = a; apDungTienDoVaKhoa(); })
      .catch(function () { apDungTienDoVaKhoa(); });

    var mo = new MutationObserver(function () { apDungTienDoVaKhoa(); });
    if (document.body) mo.observe(document.body, { childList: true, subtree: true });
    setInterval(apDungTienDoVaKhoa, 2500);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", khoiChay);
  else khoiChay();
})();
