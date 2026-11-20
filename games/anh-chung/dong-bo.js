/* Đồng bộ bản lưu game giữa các máy (điện thoại, máy tính, TV).
   Mọi game vẫn lưu vào localStorage như cũ; tệp này tự gửi bản lưu lên Google Apps Script
   và khi mở trang thì lấy bản mới nhất từ máy khác về. Đặt sớm trong <head>. */
(function () {
  var URL_DB = "https://script.google.com/macros/s/AKfycbxO0r_6HU7VIa6H-KXi-3c1o3I3wQ0V-KgmEenxY-xfz0n4wZpUzdgacRBIhKzIdd77XA/exec";
  var LS; try { LS = window.localStorage; LS.getItem("_x"); } catch (e) { return; }
  var BO_QUA = /^(_db|nhacNen|giong|debug|test)/;   // khóa riêng từng máy, không gửi
  var KT = "_db_t", KC = "_db_cho", TOI_DA = 400000;
  var goc = { set: Storage.prototype.setItem, del: Storage.prototype.removeItem };
  function docJ(k) { try { return JSON.parse(LS.getItem(k)) || {}; } catch (e) { return {}; } }
  var tg = docJ(KT), cho = docJ(KC);
  function ghiMeta() { try { goc.set.call(LS, KT, JSON.stringify(tg)); goc.set.call(LS, KC, JSON.stringify(cho)); } catch (e) {} }
  function dongBoDuoc(k) { return k && !BO_QUA.test(k); }

  // Bản lưu đã có từ trước khi bật đồng bộ: coi là cũ (máy khác mới hơn thì lấy máy khác).
  for (var i = 0; i < LS.length; i++) { var k0 = LS.key(i); if (dongBoDuoc(k0) && !tg[k0]) { tg[k0] = 1000; cho[k0] = 1; } }
  ghiMeta();

  var keoXong = false, daCham = false;
  // Ghi trước khi lấy xong bản trên mạng (game tự tạo bản lưu trống lúc mở) thì coi là cũ.
  function danhDau(k) { tg[k] = (keoXong || daCham) ? Date.now() : 1001; cho[k] = 1; ghiMeta(); henGui(); }
  Storage.prototype.setItem = function (k, v) {
    goc.set.call(this, k, v);
    if (this === LS && dongBoDuoc(k = String(k))) danhDau(k);
  };
  Storage.prototype.removeItem = function (k) {
    goc.del.call(this, k);
    if (this === LS && dongBoDuoc(k = String(k))) danhDau(k);
  };

  // Nén chuỗi dài (bản đồ Thợ Mỏ...) cho nhẹ.
  var coNen = typeof CompressionStream === "function" && typeof DecompressionStream === "function";
  function nen(s) {
    if (!coNen || s.length < 3000) return Promise.resolve(s);
    var st = new Blob([s]).stream().pipeThrough(new CompressionStream("gzip"));
    return new Response(st).arrayBuffer().then(function (b) {
      var u = new Uint8Array(b), t = ""; for (var i = 0; i < u.length; i += 8192) t += String.fromCharCode.apply(null, u.subarray(i, i + 8192));
      return "z1:" + btoa(t);
    });
  }
  function giaiNen(s) {
    if (typeof s !== "string" || s.indexOf("z1:") !== 0) return Promise.resolve(s);
    if (!coNen) return Promise.reject();
    var b = atob(s.slice(3)), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i);
    return new Response(new Blob([u]).stream().pipeThrough(new DecompressionStream("gzip"))).text();
  }

  var hen = null, dangGui = false, lanCuoi = 0;
  function henGui() {
    if (hen) return;
    var cho2 = Math.max(2000, 15000 - (Date.now() - lanCuoi));
    hen = setTimeout(function () { hen = null; gui(); }, cho2);
  }
  function goiMuc() {
    var ks = Object.keys(cho);
    return Promise.all(ks.map(function (k) {
      var v = LS.getItem(k);
      if (v !== null && v.length > TOI_DA) return null;
      return (v === null ? Promise.resolve(null) : nen(v)).then(function (z) { return { k: k, v: z, t: tg[k] || Date.now() }; });
    })).then(function (a) { return a.filter(Boolean); });
  }
  function gui() {
    if (dangGui || !Object.keys(cho).length) return;
    if (navigator.onLine === false) { henGui(); return; }
    dangGui = true; lanCuoi = Date.now();
    var daGui;
    goiMuc().then(function (muc) {
      daGui = muc.map(function (m) { return m.k + "@" + m.t; });
      return fetch(URL_DB, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify({ muc: muc }) });
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.ok) daGui.forEach(function (s) { var i = s.lastIndexOf("@"), k = s.slice(0, i); if (String(tg[k]) === s.slice(i + 1)) delete cho[k]; });
      ghiMeta();
    }).catch(function () {}).then(function () { dangGui = false; if (Object.keys(cho).length) henGui(); });
  }
  // Thoát trang: gửi nhanh phần chưa gửi (không nén) bằng beacon.
  function guiGap() {
    var ks = Object.keys(cho); if (!ks.length || !navigator.sendBeacon) return;
    var muc = ks.map(function (k) { var v = LS.getItem(k); return { k: k, v: v, t: tg[k] }; }).filter(function (m) { return m.v === null || m.v.length < 50000; });
    try { navigator.sendBeacon(URL_DB, new Blob([JSON.stringify({ muc: muc })], { type: "text/plain;charset=utf-8" })); } catch (e) {}
  }
  addEventListener("pagehide", guiGap);
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") { if (hen) { clearTimeout(hen); hen = null; } gui(); } });
  addEventListener("online", function () { gui(); });

  // Mở trang: lấy bản lưu mới nhất từ máy khác.
  var t0 = Date.now();
  ["pointerdown", "keydown", "touchstart"].forEach(function (ev) { addEventListener(ev, function () { daCham = true; }, { capture: true, once: true }); });
  function keo() {
    return fetch(URL_DB, { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.ok) return;
      var xa = j.luu || {}, viec = [];
      Object.keys(xa).forEach(function (k) {
        var r = xa[k]; if (!dongBoDuoc(k) || !(r.t > (tg[k] || 0))) return;
        viec.push(giaiNen(r.v).then(function (v) {
          if (v === null || v === undefined) goc.del.call(LS, k); else goc.set.call(LS, k, v);
          tg[k] = r.t; delete cho[k]; return k;
        }, function () { return null; }));
      });
      keoXong = true;
      Object.keys(tg).forEach(function (k) { if (!xa[k] || xa[k].t < tg[k]) cho[k] = 1; });
      return Promise.all(viec).then(function (doi) {
        doi = doi.filter(Boolean); ghiMeta(); gui();
        if (!doi.length) return;
        window.dispatchEvent(new CustomEvent("dongbo", { detail: doi }));
        var daTai = false; try { daTai = sessionStorage.getItem("_db_tai") === "1"; } catch (e) {}
        if (!daCham && !daTai && Date.now() - t0 < 15000) { try { sessionStorage.setItem("_db_tai", "1"); } catch (e) {} location.reload(); }
        else bao();
      });
    }).catch(function () {}).then(function () { keoXong = true; });
  }
  function bao() {
    if (!document.body) return;
    var d = document.createElement("div");
    d.textContent = "☁️ Có bản lưu mới từ máy khác — chạm để chơi tiếp";
    d.style.cssText = "position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:99999;background:#7c4dff;color:#fff;font:600 16px system-ui,sans-serif;padding:12px 18px;border-radius:999px;box-shadow:0 6px 20px rgba(0,0,0,.25);cursor:pointer";
    d.onclick = function () { location.reload(); };
    document.body.appendChild(d); setTimeout(function () { d.remove(); }, 12000);
  }
  try { if (sessionStorage.getItem("_db_tai") === "1") setTimeout(function () { sessionStorage.removeItem("_db_tai"); }, 20000); } catch (e) {}
  keo();
  window.DongBo = { gui: gui, keo: keo };
})();

/* Nút 🏠 về trang chủ cho mọi trò chơi (iPad, iPhone không có nút quay lại) */
(function () {
  var p = location.pathname.replace(/index\.html$/, "");
  if (p === "/" || p === "" || /\/tc\/$/.test(p)) return;
  function gan() {
    if (document.getElementById("nutVeNha")) return;
    var a = document.createElement("a");
    a.id = "nutVeNha"; a.href = "/"; a.setAttribute("aria-label", "Về trang chủ chọn trò chơi khác"); a.setAttribute("data-giu-icon", "");
    a.textContent = "🏠";
    a.style.cssText = "position:fixed;left:8px;top:50%;transform:translateY(-50%);z-index:2147483000;width:52px;height:52px;border-radius:50%;background:rgba(255,255,255,.92);border:3px solid #f59e0b;box-shadow:0 4px 12px rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:28px;text-decoration:none;-webkit-tap-highlight-color:transparent";
    document.body.appendChild(a);
  }
  if (document.body) gan(); else document.addEventListener("DOMContentLoaded", gan);
})();
