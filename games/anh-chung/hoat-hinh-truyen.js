/* Chuyển động Video Động Điện Ảnh + Tự phát MP4 cho CẢ Sách Truyện (sach-truyen) & Trường Kỹ Năng (ky-nang)
   1. Nếu trang có tệp .mp4 hoạt hình thật trong thư mục video/ -> tự động thay thế phát video lặp mượt 60fps.
   2. Với toàn bộ ảnh minh họa tĩnh còn lại -> biến thành khung hình động điện ảnh (4 kiểu lia/zoom êm mắt,
      bo khung overflow:hidden chống tràn) giúp hai bé xem truyện và học kỹ năng sinh động như phim hoạt hình!
*/
(function () {
  if (window.__hoatHinhTruyenV2) return;
  window.__hoatHinhTruyenV2 = true;

  var CO_VIDEO = {
    "tuan-30-bia": 1, "tuan-30-1": 1, "tuan-30-2": 1, "tuan-30-3": 1,
    "tuan-30-4": 1, "tuan-30-5": 1, "tuan-30-6": 1
  };

  function chenStyle() {
    if (document.getElementById("ll-hh-v2-css")) return;
    var st = document.createElement("style");
    st.id = "ll-hh-v2-css";
    st.textContent = [
      "@keyframes llCamZoomIn  { 0% { transform: scale(1.00) translate3d(0,0,0); } 50% { transform: scale(1.07) translate3d(-1.2%,-0.8%,0); } 100% { transform: scale(1.00) translate3d(0,0,0); } }",
      "@keyframes llCamPanL    { 0% { transform: scale(1.06) translate3d(-2%,0,0); } 50% { transform: scale(1.06) translate3d(2%,0,0); } 100% { transform: scale(1.06) translate3d(-2%,0,0); } }",
      "@keyframes llCamZoomOut { 0% { transform: scale(1.08) translate3d(0,-1%,0); } 50% { transform: scale(1.01) translate3d(0,0.8%,0); } 100% { transform: scale(1.08) translate3d(0,-1%,0); } }",
      "@keyframes llCamPanR    { 0% { transform: scale(1.05) translate3d(1.8%,-0.6%,0); } 50% { transform: scale(1.05) translate3d(-1.8%,0.6%,0); } 100% { transform: scale(1.05) translate3d(1.8%,-0.6%,0); } }",
      ".ll-motion-wrap { overflow: hidden !important; }",
      ".ll-motion-0 { animation: llCamZoomIn  15s ease-in-out infinite; }",
      ".ll-motion-1 { animation: llCamPanL    17s ease-in-out infinite; }",
      ".ll-motion-2 { animation: llCamZoomOut 16s ease-in-out infinite; }",
      ".ll-motion-3 { animation: llCamPanR    18s ease-in-out infinite; }",
      "@media (prefers-reduced-motion: reduce) { .ll-motion-0,.ll-motion-1,.ll-motion-2,.ll-motion-3 { animation: none !important; } }"
    ].join("\n");
    (document.head || document.documentElement).appendChild(st);
  }

  function apDungHoatHinh() {
    chenStyle();
    // Quét tất cả ảnh nội dung lớn trong Sách Truyện & Trường Kỹ Năng (bỏ qua icon/avatar nhỏ < 140px)
    var imgs = document.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (img.dataset && img.dataset.llMotionDone) continue;
      var src = img.getAttribute("src") || "";
      if (!src || /xu-ciecas|lucie\.webp|lucas\.webp|icon-/i.test(src)) continue;
      if (img.offsetWidth > 0 && img.offsetWidth < 140) continue;

      img.dataset.llMotionDone = "1";
      if (img.parentNode && img.parentNode.classList) {
        img.parentNode.classList.add("ll-motion-wrap");
      }
      // Gắn hiệu ứng góc máy điện ảnh luân phiên mượt mà cho mọi ảnh minh họa truyện & kỹ năng
      img.classList.add("ll-motion-" + (i % 4));

      // Nếu tệp có bản video MP4 thật (VD: tuan-30) -> tự động nâng cấp sang <video> mượt mà
      var m = src.match(/(tuan-\d{2}-(?:bia|[1-6])|bai-\d{2}-(?:bia|[1-6]))\.webp/i);
      if (m) {
        var key = m[1].toLowerCase();
        if (CO_VIDEO[key]) {
          (function (imgEl, imgSrc, vidUrl) {
            var vid = document.createElement("video");
            vid.src = vidUrl;
            vid.poster = imgSrc;
            vid.autoplay = true;
            vid.loop = true;
            vid.muted = true;
            vid.playsInline = true;
            vid.setAttribute("autoplay", "");
            vid.setAttribute("loop", "");
            vid.setAttribute("muted", "");
            vid.setAttribute("playsinline", "");
            vid.setAttribute("webkit-playsinline", "");
            vid.className = imgEl.className.replace(/ll-motion-\d/g, "");
            vid.style.cssText = (imgEl.style.cssText || "") + ";width:100%;height:auto;display:block;object-fit:cover;border-radius:inherit;";
            vid.addEventListener("canplay", function () {
              if (imgEl.parentNode && !vid.parentNode) {
                imgEl.parentNode.insertBefore(vid, imgEl);
                imgEl.style.display = "none";
                try { var p = vid.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
              }
            }, { once: true });
            vid.addEventListener("error", function () {
              if (vid.parentNode) vid.parentNode.removeChild(vid);
              imgEl.style.display = "";
            }, { once: true });
            vid.load();
          })(img, src, src.replace(/anh\/[^/]+\.webp/i, "video/" + key + ".mp4"));
        }
      }
    }
  }

  function khoiChay() {
    apDungHoatHinh();
    var mo = new MutationObserver(function () { apDungHoatHinh(); });
    if (document.body) mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
    setInterval(apDungHoatHinh, 1800);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", khoiChay);
  else khoiChay();
})();
