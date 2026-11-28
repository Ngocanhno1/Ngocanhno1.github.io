/* Trình phát Tập Hoạt Hình Đặc Biệt cho Sách Truyện Lucie & Lucas
   - Nếu đã tải file MP4 vào games/sach-truyen/video/tuan-30-*.mp4 -> tự động phát video lặp êm khớp giọng kể Hoài My.
   - Nếu chưa có file MP4 -> tự giữ ảnh Pixar 3D sắc nét kèm chuyển động lia/zoom điện ảnh êm mắt (không bao giờ lỗi đen màn hình).
*/
(function () {
  if (window.__hoatHinhTruyen) return;
  window.__hoatHinhTruyen = true;

  var CO_VIDEO = {
    "tuan-30-bia": 1, "tuan-30-1": 1, "tuan-30-2": 1, "tuan-30-3": 1,
    "tuan-30-4": 1, "tuan-30-5": 1, "tuan-30-6": 1
  };

  function chenStyle() {
    if (document.getElementById("ll-hh-css")) return;
    var st = document.createElement("style");
    st.id = "ll-hh-css";
    st.textContent = [
      "@keyframes llKenBurns { 0% { transform: scale(1.0); } 50% { transform: scale(1.06); } 100% { transform: scale(1.0); } }",
      ".ll-ken-burns { animation: llKenBurns 14s ease-in-out infinite; will-change: transform; }"
    ].join("\n");
    (document.head || document.documentElement).appendChild(st);
  }

  function nangCapAnhThanhVideo() {
    chenStyle();
    var imgs = document.querySelectorAll("img[src*='tuan-30']");
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      if (img.dataset && img.dataset.daDoiVideo) continue;
      var src = img.getAttribute("src") || "";
      var m = src.match(/(tuan-\d{2}-(?:bia|[1-6]))\.webp/i);
      if (!m) continue;
      var key = m[1].toLowerCase();
      if (!CO_VIDEO[key]) continue;

      img.dataset.daDoiVideo = "1";
      img.classList.add("ll-ken-burns");

      // Thử nạp video MP4; nếu có trên server sẽ tự thay mượt, nếu chưa có sẽ tự gỡ video giữ nguyên ảnh động Ken Burns
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
        vid.className = imgEl.className.replace("ll-ken-burns", "");
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

  function khoiChay() {
    nangCapAnhThanhVideo();
    var mo = new MutationObserver(function () { nangCapAnhThanhVideo(); });
    if (document.body) mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
    setInterval(nangCapAnhThanhVideo, 2000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", khoiChay);
  else khoiChay();
})();
