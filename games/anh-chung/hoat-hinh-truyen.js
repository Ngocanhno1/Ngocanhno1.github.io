/* Tự động phát Video MP4 cho TOÀN BỘ dự án Sách Truyện (sach-truyen) & Kiến Thức (ky-nang, các game có thư mục video/)
   1. Tự nạp video/danh-sach-video.json — bất kỳ ảnh nào đã được chuyển sang .mp4 sẽ tự phát <video> lặp êm mượt.
   2. Khi lật trang sang ảnh chưa có .mp4, tự động gỡ video cũ và hiển thị ảnh với hiệu ứng camera CSS êm (0 đứng hình, 0 nhấp nháy).
   3. Bảo vệ ảnh thật của hai bé (lucie.webp, lucas.webp) và các biểu tượng nhỏ.
*/
(function () {
  if (window.__hoatHinhTruyenV4) return;
  window.__hoatHinhTruyenV4 = true;
  window.__hoatHinhTruyenV3 = true;
  window.__hoatHinhTruyenV2 = true;

  var CO_VIDEO = {
    "tuan-30-bia": 1, "tuan-30-1": 1, "tuan-30-2": 1, "tuan-30-3": 1,
    "tuan-30-4": 1, "tuan-30-5": 1, "tuan-30-6": 1
  };
  var LA_TRUYEN_HOAC_KY_NANG = /(sach-truyen|ky-nang)/i.test(location.href);

  function chenStyle() {
    if (document.getElementById("ll-hh-v4-css")) return;
    var st = document.createElement("style");
    st.id = "ll-hh-v4-css";
    st.textContent = [
      "@keyframes llCamZoomIn  { 0% { transform: scale(1.00) translate3d(0,0,0); } 50% { transform: scale(1.07) translate3d(-1.2%,-0.8%,0); } 100% { transform: scale(1.00) translate3d(0,0,0); } }",
      "@keyframes llCamPanL    { 0% { transform: scale(1.06) translate3d(-2%,0,0); } 50% { transform: scale(1.06) translate3d(2%,0,0); } 100% { transform: scale(1.06) translate3d(-2%,0,0); } }",
      "@keyframes llCamZoomOut { 0% { transform: scale(1.08) translate3d(0,-1%,0); } 50% { transform: scale(1.01) translate3d(0,0.8%,0); } 100% { transform: scale(1.08) translate3d(0,-1%,0); } }",
      "@keyframes llCamPanR    { 0% { transform: scale(1.05) translate3d(1.8%,-0.6%,0); } 50% { transform: scale(1.05) translate3d(-1.8%,0.6%,0); } 100% { transform: scale(1.05) translate3d(1.8%,-0.6%,0); } }",
      ".ll-motion-wrap { overflow: hidden !important; }",
      ".ll-motion-0 { animation: llCamZoomIn  15s ease-in-out infinite; }",
      ".ll-motion-1 { animation: llCamPanL    17s ease-in-out infinite; }",
      ".ll-motion-2 { animation: llCamZoomOut 16s ease-in-out infinite; }",
      ".ll-motion-3 { animation: llCamPanR    18s ease-in-out infinite; }"
    ].join("\n");
    (document.head || document.documentElement).appendChild(st);
  }

  function xoaVideoCu(imgEl) {
    if (imgEl && imgEl.previousSibling && imgEl.previousSibling.classList && imgEl.previousSibling.classList.contains("ll-auto-video")) {
      try { imgEl.previousSibling.pause(); } catch (e) {}
      imgEl.previousSibling.parentNode.removeChild(imgEl.previousSibling);
    }
  }

  function apDungVideo() {
    chenStyle();
    var imgs = document.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      var src = img.getAttribute("src") || "";
      if (!src || /xu-ciecas|lucie\.webp|lucas\.webp|icon-/i.test(src)) continue;
      if (img.offsetWidth > 0 && img.offsetWidth < 140) continue;

      var laAnhMinhHoa = LA_TRUYEN_HOAC_KY_NANG || /(?:^|\/)anh\//i.test(src);
      if (!laAnhMinhHoa) continue;

      if (!img.dataset.llMotionSet) {
        img.dataset.llMotionSet = "1";
        if (img.parentNode && img.parentNode.classList) img.parentNode.classList.add("ll-motion-wrap");
        img.classList.add("ll-motion-" + (i % 4));
      }

      var m = src.match(/([^/]+)\.(?:webp|png|jpe?g)(?:\?.*)?$/i);
      var stem = m ? m[1].toLowerCase() : "";

      if (!stem || !CO_VIDEO[stem]) {
        if (img.dataset.llVideoKey) {
          delete img.dataset.llVideoKey;
          xoaVideoCu(img);
          img.style.display = "";
        }
        continue;
      }

      if (img.dataset.llVideoKey === stem) continue;

      img.dataset.llVideoKey = stem;
      var vidUrl = src.replace(/anh\/[^/]+\.(?:webp|png|jpe?g)/i, "video/" + stem + ".mp4");
      if (vidUrl === src) vidUrl = "video/" + stem + ".mp4";

      xoaVideoCu(img);
      img.style.display = "";

      (function (imgEl, imgSrc, url, expectedStem) {
        var vid = document.createElement("video");
        vid.className = (imgEl.className || "").replace(/ll-motion-\d/g, "") + " ll-auto-video";
        vid.src = url;
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
        vid.style.cssText = (imgEl.style.cssText || "") + ";width:100%;height:auto;display:block;object-fit:cover;border-radius:inherit;";

        vid.addEventListener("canplay", function () {
          if (imgEl.dataset.llVideoKey !== expectedStem) return;
          if (imgEl.parentNode && !vid.parentNode) {
            xoaVideoCu(imgEl);
            imgEl.parentNode.insertBefore(vid, imgEl);
            imgEl.style.display = "none";
            try { var p = vid.play(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
          }
        }, { once: true });
        vid.addEventListener("error", function () {
          if (vid.parentNode) vid.parentNode.removeChild(vid);
          if (imgEl.dataset.llVideoKey === expectedStem) imgEl.style.display = "";
        }, { once: true });
        vid.load();
      })(img, src, vidUrl, stem);
    }
  }

  function khoiChay() {
    fetch("video/danh-sach-video.json?t=" + Math.floor(Date.now() / 300000), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (arr) {
        if (Array.isArray(arr)) arr.forEach(function (k) { CO_VIDEO[String(k).toLowerCase()] = 1; });
        apDungVideo();
      })
      .catch(function () { apDungVideo(); });

    var mo = new MutationObserver(function () { apDungVideo(); });
    if (document.body) mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["src"] });
    setInterval(apDungVideo, 1800);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", khoiChay);
  else khoiChay();
})();
