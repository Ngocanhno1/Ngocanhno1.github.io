/* Tối ưu Trải Nghiệm Chung cho toàn bộ kho game Lucie & Lucas (TV LG webOS + Điện thoại)
   1. Hỗ trợ điều khiển Remote TV (phím mũi tên di chuyển rõ ràng giữa các nút đáp án / nút bấm).
   2. Thu gọn thanh thông báo đồng bộ nếu bị che chữ trên màn hình nhỏ.
   3. Hiện dải "Nhiệm vụ hôm nay & Chuỗi ngày chăm chỉ" gọn gàng, tĩnh mượt trên trang chủ.
*/
(function () {
  if (window.__traiNghiemChung) return;
  window.__traiNghiemChung = true;

  // 1. Hỗ trợ phím mũi tên Remote TV trong các game con (chỉ kích hoạt khi game chưa tự chặn)
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

  // 2. Dải Nhiệm vụ Hằng ngày & Chuỗi chăm chỉ gọn mắt ngay dưới tiêu đề trang chủ
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
