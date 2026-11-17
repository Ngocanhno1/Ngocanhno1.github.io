/* Đổi icon (emoji) thành ảnh thật cho mọi game của Lucie & Lucas.
   - Ảnh lấy ở games/anh-chung/anh/e-<mã>.webp (máy chủ GitHub tải sẵn, xem anh-nguon.json).
   - Vẫn giữ emoji gốc ẩn trong chữ, nên code chấm điểm dựa vào chữ của game cũ không bị ảnh hưởng.
   - Ảnh hỏng thì tự quay về emoji. Phần tử có thuộc tính data-giu-icon thì giữ nguyên. */
(function () {
  if (window.__anhThat) return; window.__anhThat = true;
  var me = document.currentScript, BASE = me ? me.src.replace(/anh-that\.js.*$/, "") : "/games/anh-chung/";
  var RE = /(?:[\u{1F1E6}-\u{1F1FF}]{2})|(?:[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2B06}\u{2194}-\u{21AA}\u{231A}-\u{23FF}]️?(?:‍[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]️?)*)/gu;
  var SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, OPTION: 1, SELECT: 1, TITLE: 1, CANVAS: 1, NOSCRIPT: 1 };
  var HAVE = null, pending = new Set(), queued = false;
  var code = function (e) { return Array.from(e).filter(function (c) { return c !== "️"; }).map(function (c) { return c.codePointAt(0).toString(16); }).join("-"); };

  var css = document.createElement("style");
  css.textContent = ".anh-icon{display:inline-block;position:relative;width:1.18em;height:1.18em;vertical-align:-0.22em;line-height:1}" +
    ".anh-icon img{width:100%;height:100%;object-fit:cover;border-radius:50%;display:block;border:.08em solid #fff;box-shadow:0 .06em .2em rgba(80,40,120,.35);background:#fff;box-sizing:border-box}" +
    ".anh-icon.to img{border-width:.06em;animation:anhNhun 3.2s ease-in-out infinite}" +
    ".anh-icon.to:hover img{animation:anhLac .6s ease-in-out}" +
    "@keyframes anhNhun{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-6%) rotate(3deg)}}" +
    "@keyframes anhLac{0%,100%{transform:rotate(0)}25%{transform:rotate(-10deg) scale(1.08)}75%{transform:rotate(10deg) scale(1.08)}}" +
    ".anh-icon .anh-goc{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}";
  document.head.appendChild(css);

  function skip(el) {
    for (var n = el; n && n !== document.body; n = n.parentNode) {
      if (n.nodeType !== 1) continue;
      if (SKIP[n.nodeName] || n.namespaceURI === "http://www.w3.org/2000/svg" || n.isContentEditable) return true;
      if (n.hasAttribute("data-giu-icon") || n.classList.contains("anh-icon")) return true;
    }
    return false;
  }
  function swap(t) {
    var s = t.nodeValue; RE.lastIndex = 0;
    if (!RE.test(s) || !t.parentNode || skip(t.parentNode)) return;
    RE.lastIndex = 0;
    var frag = document.createDocumentFragment(), last = 0, m, changed = false;
    while ((m = RE.exec(s))) {
      var c = code(m[0]);
      if (!HAVE[c]) continue;
      if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
      var w = document.createElement("span"); w.className = "anh-icon";
      var img = document.createElement("img"); img.src = BASE + "anh/e-" + c + ".webp"; img.alt = ""; img.draggable = false; img.decoding = "async";
      img.onerror = function () { var p = this.parentNode; if (p && p.parentNode) p.parentNode.replaceChild(document.createTextNode(p.textContent), p); };
      var g = document.createElement("span"); g.className = "anh-goc"; g.textContent = m[0];
      w.appendChild(img); w.appendChild(g); frag.appendChild(w);
      last = m.index + m[0].length; changed = true;
    }
    if (!changed) return;
    if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
    var cha = t.parentNode;
    cha.replaceChild(frag, t);
    try { if (parseFloat(getComputedStyle(cha).fontSize) >= 34) cha.querySelectorAll(".anh-icon").forEach(function (e, i) { e.classList.add("to"); e.firstChild.style.animationDelay = (-(i * 0.7) % 3) + "s"; }); } catch (e) {}
  }
  function scan(root) {
    if (root.nodeType === 3) { swap(root); return; }
    if (root.nodeType !== 1 || skip(root)) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), list = [], n;
    while ((n = w.nextNode())) list.push(n);
    list.forEach(swap);
  }
  function flush() { queued = false; var a = Array.from(pending); pending.clear(); a.forEach(function (n) { if (n.isConnected) scan(n); }); }
  function queue(n) { pending.add(n); if (!queued) { queued = true; requestAnimationFrame(flush); } }

  function start() {
    scan(document.body);
    new MutationObserver(function (ms) {
      ms.forEach(function (m) {
        if (m.type === "characterData") queue(m.target);
        else m.addedNodes.forEach(function (n) { if (!(n.nodeType === 1 && n.classList.contains("anh-icon"))) queue(n); });
      });
    }).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  fetch(BASE + "anh/danh-sach.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (a) {
    HAVE = {}; a.forEach(function (c) { HAVE[c] = 1; });
    if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
  }).catch(function () {});
})();
