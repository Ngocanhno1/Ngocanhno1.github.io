/* Trình phát Video Hoạt Hình AI thật (V5) cho Sách Truyện (sach-truyen) & Trường Kỹ Năng (ky-nang)
   1. Tắt hoàn toàn hiệu ứng CSS zoom ra/vào và KHÔNG phát các clip FFmpeg zoom tạm (chỉ phát video AI thật).
   2. Chỉ nạp danh sách video AI thật từ video/veo-done.json (cộng bộ tuan-30 có sẵn).
   3. Ảnh chưa có video AI thật sẽ hiển thị tĩnh, sắc nét, không rung lắc; bảo vệ ảnh thật lucie.webp / lucas.webp.
*/
(function () {
  if (window.__hoatHinhTruyenV5) return;
  window.__hoatHinhTruyenV5 = true;
  window.__hoatHinhTruyenV4 = true;
  window.__hoatHinhTruyenV3 = true;
  window.__hoatHinhTruyenV2 = true;

  // Chỉ đăng ký sẵn các clip hoạt hình AI thật đã kiểm duyệt (KHÔNG nạp 213 clip FFmpeg zoom tạm)
  var CO_VIDEO_AI = {
    "tuan-30-bia": 1,
    "tuan-30-1": 1,
    "tuan-30-2": 1,
    "tuan-30-3": 1,
    "tuan-30-4": 1,
    "tuan-30-5": 1,
    "tuan-30-6": 1
  };
  var LA_TRUYEN_HOAC_KY_NANG = /(sach-truyen|ky-nang)/i.test(location.href);

  function goStyleZoomCu() {
    var oldSt = document.getElementById("ll-hh-v4-css");
    if (oldSt && oldSt.parentNode) oldSt.parentNode.removeChild(oldSt);
  }

  function xoaVideoCu(imgEl) {
    if (imgEl && imgEl.previousSibling && imgEl.previousSibling.classList && imgEl.previousSibling.classList.contains("ll-auto-video")) {
      try { imgEl.previousSibling.pause(); } catch (e) {}
      imgEl.previousSibling.parentNode.removeChild(imgEl.previousSibling);
    }
  }

  function apDungVideo() {
    goStyleZoomCu();
    var imgs = document.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      var src = img.getAttribute("src") || "";
      if (!src || /xu-ciecas|lucie\.webp|lucas\.webp|icon-/i.test(src)) continue;
      if (img.offsetWidth > 0 && img.offsetWidth < 140) continue;

      // Gỡ mọi class zoom CSS nếu trang cũ từng gắn
      if (img.className && /ll-motion-\d/.test(img.className)) {
        img.className = img.className.replace(/\bll-motion-\d\b/g, "").trim();
      }

      var laAnhMinhHoa = LA_TRUYEN_HOAC_KY_NANG || /(?:^|\/)anh\//i.test(src);
      if (!laAnhMinhHoa) continue;

      var m = src.match(/([^/]+)\.(?:webp|png|jpe?g)(?:\?.*)?$/i);
      var stem = m ? m[1].toLowerCase() : "";

      if (!stem || !CO_VIDEO_AI[stem]) {
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
        vid.className = (imgEl.className || "").replace(/\bll-motion-\d\b/g, "") + " ll-auto-video";
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
    // Chỉ nạp video/veo-done.json (danh sách clip hoạt hình AI thật, bỏ qua các clip FFmpeg zoom tạm)
    fetch("video/veo-done.json?t=" + Math.floor(Date.now() / 300000), { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (arr) {
        if (Array.isArray(arr)) arr.forEach(function (k) { CO_VIDEO_AI[String(k).toLowerCase()] = 1; });
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
