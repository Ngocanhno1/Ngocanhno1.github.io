/* Tối giản Trang Chủ v2 — Xóa triệt để bong bóng bay, hạt nền & hiệu ứng chậm TV */
(function () {
  if (window.__donSachTrangChuV2) return;
  window.__donSachTrangChuV2 = true;

  var me = document.currentScript;
  var ROOT_AC = me ? me.src.replace(/nen-hat\.js.*$/, "") : "/games/anh-chung/";

  function xoaBongBong() {
    var rac = document.querySelectorAll(".bay, .cloud, .pop-bay, .pop-hat, canvas.nen-hat, #nenHat");
    for (var i = 0; i < rac.length; i++) {
      if (rac[i] && rac[i].parentNode) rac[i].parentNode.removeChild(rac[i]);
    }
  }

  function donSach() {
    try {
      xoaBongBong();
      var head = document.head || document.documentElement;
      if (head && !document.getElementById("ll-toi-gian-style")) {
        var st = document.createElement("style");
        st.id = "ll-toi-gian-style";
        st.textContent = [
          ".bay, .cloud, .pop-bay, .pop-hat { display: none !important; animation: none !important; visibility: hidden !important; }",
          ".kids, .kids img, a.game .art .face, a.game:hover .art .face, a.game:focus-visible .art .face, header { animation: none !important; }",
          "header, .top-bar, .glass, .card, a.game { -webkit-backdrop-filter: none !important; backdrop-filter: none !important; will-change: auto !important; }",
          "a.game { transition: transform 0.12s ease, border-color 0.12s ease !important; }",
          "a.game:hover, a.game:focus-visible { transform: translateY(-3px) !important; }",
          "a.game:active { transform: scale(0.97) !important; }"
        ].join("\n");
        head.appendChild(st);
      }
      if (head && !document.querySelector('link[href*="toi-uu-tv-muot.css"]')) {
        var lk = document.createElement("link");
        lk.rel = "stylesheet";
        lk.href = ROOT_AC + "toi-uu-tv-muot.css?v=20261126b";
        head.appendChild(lk);
      }
      if (head && !window.__toiUuTvMuot && !document.querySelector('script[src*="toi-uu-tv-muot.js"]')) {
        var sc = document.createElement("script");
        sc.src = ROOT_AC + "toi-uu-tv-muot.js?v=20261126b";
        sc.defer = true;
        head.appendChild(sc);
      }
      if (head && !window.__traiNghiemChung && !document.querySelector('script[src*="trai-nghiem-chung.js"]')) {
        var scUx = document.createElement("script");
        scUx.src = ROOT_AC + "trai-nghiem-chung.js?v=20261127";
        scUx.defer = true;
        head.appendChild(scUx);
      }
    } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", donSach);
  } else {
    donSach();
  }
  // Quét thêm 1 nhịp sau 600ms phòng script khác chèn bong bóng trễ
  setTimeout(xoaBongBong, 600);
})();
