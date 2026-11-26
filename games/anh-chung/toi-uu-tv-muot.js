/* Tối ưu tốc độ khung hình ổn định trên Smart TV LG webOS & Điện thoại di động */
(function (root) {
  if (root.__toiUuTvMuot) return;
  root.__toiUuTvMuot = true;

  var ua = navigator.userAgent || "";
  var laTV = /Web0S|SmartTV|Tizen|BRAVIA|AppleTV|NetCast|TV/i.test(ua) ||
             (window.innerWidth >= 1200 && !("ontouchstart" in window) && (navigator.hardwareConcurrency || 4) <= 4);

  // Ổn định tốc độ requestAnimationFrame: chống giật nhảy bước khi TV bị khựng khung hình (clamp delta <= 40ms)
  if (laTV && typeof root.requestAnimationFrame === "function") {
    var origRAF = root.requestAnimationFrame.bind(root);
    var lastT = 0;
    var virtT = 0;
    root.requestAnimationFrame = function (cb) {
      return origRAF(function (now) {
        if (!lastT) {
          lastT = now;
          virtT = now;
        } else {
          var dt = now - lastT;
          lastT = now;
          // Chặn cú nhảy dt lớn (>40ms) làm game lúc chậm lúc phóng vọt bất thường
          if (dt > 40) dt = 40;
          if (dt < 0) dt = 16.67;
          virtT += dt;
        }
        cb(virtT);
      });
    };
  }

  function khoiDongEm() {
    if (!document.body) return;
    document.body.classList.add("dang-khoi-dong");
    if (laTV) document.body.classList.add("che-do-tv");

    // Tự gắn decoding="async" & lazy cho ảnh ngoài khung nhìn đầu tiên
    var imgs = document.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) {
      if (!imgs[i].hasAttribute("decoding")) imgs[i].setAttribute("decoding", "async");
      if (i > 4 && !imgs[i].hasAttribute("loading")) imgs[i].setAttribute("loading", "lazy");
    }

    // Đảm bảo có viewport chuẩn cho điện thoại nếu trang game nào thiếu
    if (!document.querySelector('meta[name="viewport"]')) {
      var m = document.createElement("meta");
      m.name = "viewport";
      m.content = "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover";
      document.head.appendChild(m);
    }

    requestAnimationFrame(function () {
      setTimeout(function () {
        if (document.body) document.body.classList.remove("dang-khoi-dong");
      }, laTV ? 380 : 180);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", khoiDongEm);
  } else {
    khoiDongEm();
  }

  document.addEventListener("visibilitychange", function () {
    if (!document.body) return;
    if (document.hidden) document.body.classList.add("tab-an");
    else document.body.classList.remove("tab-an");
  });
})(window);
