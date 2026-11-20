// Chế độ nhẹ tối ưu hiệu năng web game cho TV LG webOS / Smart TV
(function () {
  "use strict";

  var KHOA_LUU = "cheDoTV";
  var BIEU_THUC_TV = /Web0S|webOS|SmartTV|SMART-TV|Tizen|NetCast|BRAVIA|HbbTV|AFT|CrKey|Android TV/i;

  // Đọc tham số ?tv=1 hoặc ?tv=0 từ URL
  function docThamSoURL() {
    var khop = /[?&]tv=([01])(?:&|$)/.exec(window.location.search);
    return khop ? khop[1] : null;
  }

  function docLuuTru() {
    try {
      return window.localStorage.getItem(KHOA_LUU);
    } catch (e) {
      return null;
    }
  }

  function ghiLuuTru(giaTri) {
    try {
      window.localStorage.setItem(KHOA_LUU, giaTri);
    } catch (e) {}
  }

  // 1. Xác định bật/tắt chế độ nhẹ (ưu tiên: URL > localStorage > userAgent)
  function kichHoatCheDoTV() {
    var urlVal = docThamSoURL();
    if (urlVal === "1") return true;
    if (urlVal === "0") return false;

    var luuVal = docLuuTru();
    if (luuVal === "1") return true;
    if (luuVal === "0") return false;

    return BIEU_THUC_TV.test(navigator.userAgent || "");
  }

  var cheDoTV = kichHoatCheDoTV();
  window.CHE_DO_TV = cheDoTV;

  if (cheDoTV && document.documentElement) {
    document.documentElement.classList.add("tv-nhe");
  }

  // 2. Bọc THREE.WebGLRenderer bằng lớp con để tắt khử răng cưa, đổ bóng và giới hạn pixelRatio
  function bocThreeRenderer() {
    if (!cheDoTV || !window.THREE || !window.THREE.WebGLRenderer) return;
    if (window.THREE.WebGLRenderer.__daBocTV) return;

    var OrigWebGLRenderer = window.THREE.WebGLRenderer;

    class TVWebGLRenderer extends OrigWebGLRenderer {
      constructor(parameters) {
        var opts = Object.assign({}, parameters || {}, {
          antialias: false,
          powerPreference: "high-performance"
        });
        super(opts);

        // Chặn setPixelRatio vượt quá 0.75 (vẽ ít điểm ảnh hơn, TV tự phóng to) (hỗ trợ cả r128 gán trên instance lẫn prototype)
        var origSetPixelRatio = this.setPixelRatio;
        if (typeof origSetPixelRatio === "function") {
          this.setPixelRatio = function (value) {
            var tiLe = typeof value === "number" && value > 0 ? Math.min(value, 0.75) : 0.75;
            return origSetPixelRatio.call(this, tiLe);
          };
          this.setPixelRatio(0.75);
        }

        // Khóa shadowMap.enabled luôn là false
        if (this.shadowMap) {
          this.shadowMap.enabled = false;
          try {
            Object.defineProperty(this.shadowMap, "enabled", {
              get: function () { return false; },
              set: function () {},
              configurable: true
            });
          } catch (e) {}
        }
      }
    }

    TVWebGLRenderer.__daBocTV = true;
    window.THREE.WebGLRenderer = TVWebGLRenderer;
  }

  // 3. Giới hạn requestAnimationFrame tối đa 30 hình/giây (bỏ qua khung khi chưa đủ 33ms)
  function gioiHanFPS() {
    if (!cheDoTV || !window.requestAnimationFrame) return;

    var origRAF = window.requestAnimationFrame.bind(window);
    var origCancelRAF = (window.cancelAnimationFrame || function () {}).bind(window);
    var KHOANG_KHUNG = 33;
    var lanChayCuoi = -KHOANG_KHUNG;
    var demId = 1;
    var daDatLich = false;
    var hangDoi = Object.create(null);
    var dangChay = null;

    function conLenhCho() {
      for (var k in hangDoi) {
        if (hangDoi[k]) return true;
      }
      return false;
    }

    function chayKhung(thoiDiem) {
      daDatLich = false;

      if (!conLenhCho()) return;

      if (thoiDiem - lanChayCuoi < KHOANG_KHUNG) {
        daDatLich = true;
        origRAF(chayKhung);
        return;
      }

      lanChayCuoi = thoiDiem;
      dangChay = hangDoi;
      hangDoi = Object.create(null);

      for (var id in dangChay) {
        var cb = dangChay[id];
        if (cb) {
          delete dangChay[id];
          cb(thoiDiem);
        }
      }
      dangChay = null;
    }

    window.requestAnimationFrame = function (callback) {
      if (typeof callback !== "function") return 0;
      var id = demId++;
      hangDoi[id] = callback;
      if (!daDatLich) {
        daDatLich = true;
        origRAF(chayKhung);
      }
      return id;
    };

    window.cancelAnimationFrame = function (id) {
      if (hangDoi[id]) delete hangDoi[id];
      if (dangChay && dangChay[id]) delete dangChay[id];
    };
  }

  // 4. Chèn CSS giảm tải GPU khi bật .tv-nhe
  function chenCSSTV() {
    if (!cheDoTV || document.getElementById("tv-nhe-style")) return;

    var style = document.createElement("style");
    style.id = "tv-nhe-style";
    style.textContent = [
      ".tv-nhe *, .tv-nhe *::before, .tv-nhe *::after {",
      "  backdrop-filter: none !important;",
      "  -webkit-backdrop-filter: none !important;",
      "  filter: none !important;",
      "  -webkit-filter: none !important;",
      "  text-shadow: none !important;",
      "  box-shadow: none !important;",
      "  animation-duration: 0.01s !important;",
      "  animation-iteration-count: 1 !important;",
      "}",
      ".tv-nhe button:focus, .tv-nhe a:focus, .tv-nhe input:focus, .tv-nhe [role=\"button\"]:focus, .tv-nhe [tabindex]:focus {",
      "  box-shadow: 0 0 0 3px #ffeb3b !important;",
      "}",
      ".tv-nhe canvas#phaoGiay, .tv-nhe canvas.phao {",
      "  display: none !important;",
      "}"
    ].join("\n");

    (document.head || document.documentElement).appendChild(style);
  }

  // 5. Nút bật/tắt chế độ nhẹ góc trên phải, hiện khi bấm phím 0 năm lần liền
  function caiDatNutBiMat() {
    var demPhim0 = 0;
    var thoiGianCuoi = 0;
    var nut = null;

    function hienNut() {
      if (!document.body) return;
      if (!nut) {
        nut = document.createElement("button");
        nut.id = "nut-che-do-tv";
        nut.type = "button";
        nut.textContent = cheDoTV ? "Chế độ TV nhẹ: BẬT (Bấm để tắt)" : "Chế độ TV nhẹ: TẮT (Bấm để bật)";
        nut.style.cssText = [
          "position:fixed",
          "top:8px",
          "right:8px",
          "z-index:2147483647",
          "padding:6px 10px",
          "font-size:12px",
          "font-family:sans-serif",
          "color:#fff",
          "background:" + (cheDoTV ? "#2e7d32" : "#424242"),
          "border:2px solid #fff",
          "border-radius:6px",
          "cursor:pointer"
        ].join(";");

        nut.addEventListener("click", function () {
          ghiLuuTru(cheDoTV ? "0" : "1");
          // Xóa tham số ?tv= nếu có trên URL để localStorage có hiệu lực
          var searchMoi = window.location.search
            .replace(/([?&])tv=[01](&|$)/, function (m, p1, p2) {
              return p1 === "?" && p2 === "&" ? "?" : (p2 === "&" ? "&" : "");
            })
            .replace(/\?$/, "");
          if (searchMoi !== window.location.search) {
            window.location.href = window.location.pathname + searchMoi + window.location.hash;
          } else {
            window.location.reload();
          }
        });

        document.body.appendChild(nut);
      } else {
        nut.style.display = nut.style.display === "none" ? "block" : "none";
      }
      nut.focus();
    }

    window.addEventListener("keydown", function (e) {
      var laPhim0 = e.key === "0" || e.keyCode === 48 || e.keyCode === 96;
      var bayGio = Date.now();

      if (laPhim0) {
        if (bayGio - thoiGianCuoi > 2000) {
          demPhim0 = 0;
        }
        demPhim0 += 1;
        thoiGianCuoi = bayGio;

        if (demPhim0 >= 5) {
          demPhim0 = 0;
          hienNut();
        }
      } else {
        demPhim0 = 0;
      }
    }, true);
  }

  // Khởi chạy ngay lập tức
  bocThreeRenderer();
  gioiHanFPS();
  chenCSSTV();
  caiDatNutBiMat();

  // Kiểm tra lại khi DOM sẵn sàng phòng trường hợp Three.js được nạp sau
  document.addEventListener("DOMContentLoaded", function () {
    bocThreeRenderer();
    chenCSSTV();
  });
})();
