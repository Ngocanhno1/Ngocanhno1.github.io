/* Đoạn mã chạy trong Chrome (Claude in Chrome) để Gemini vẽ tranh và chuyển sang GitHub, không qua máy chủ Claude.
   Dùng cho Sách truyện nói (games/sach-truyen). Mỗi lần gọi javascript_tool tối đa ~45 giây, nên vòng vẽ chạy ngầm, Claude hỏi tiến độ qua window.__tt.

   BƯỚC 1 — Tab AI Studio, mô hình Nano Banana Pro:
     https://aistudio.google.com/prompts/new_chat?authuser=ngocanh220788@gmail.com&model=gemini-3-pro-image-preview
     Nạp tệp này (AI Studio chặn eval thường, phải qua Trusted Types), rồi gọi window.__veTruyen('tuan-12'):
       const pol = trustedTypes.createPolicy('l' + Date.now(), { createScript: s => s });
       (0, eval)(pol.createScript(await (await fetch('https://raw.githubusercontent.com/Ngocanhno1/Ngocanhno1.github.io/main/tools/gemini-trinh-duyet.js?x=' + Date.now())).text()));
       window.__veTruyen('tuan-12');
     (Tab GitHub nạp tương tự; nếu Trusted Types báo lỗi thì dán thẳng phần hàm cần dùng.)
     Mỗi truyện mở 1 cuộc trò chuyện mới (tranh cùng một nét vẽ). Ảnh lưu vào sessionStorage 'anh:<mã>' (960x640 webp).
     Hỏi tiến độ: JSON.stringify(window.__tt)  -> {ma, xong:[...], loi:[...], het:true}
   BƯỚC 2 — Xuất: window.__xuat(['tuan-12']) rồi bấm phím ctrl+c (công cụ computer, key).
   BƯỚC 3 — Tab GitHub (đã đăng nhập Ngocanhno1):
     https://github.com/Ngocanhno1/Ngocanhno1.github.io/upload/main/games/sach-truyen/anh
     Dán cả tệp này, gọi window.__nhan(), bấm ctrl+v (computer key), rồi window.__ghi('Tranh Gemini vẽ ...') để commit.
   Sau đó ở AI Studio: sessionStorage.clear() để không gửi lại tranh cũ. */

// ===== VE =====
window.__veTruyen = async function (ma) {
  const sl = ms => new Promise(r => setTimeout(r, ms));
  const t = await fetch(`https://raw.githubusercontent.com/Ngocanhno1/Ngocanhno1.github.io/main/games/sach-truyen/truyen/${ma}.json?x=${Date.now()}`).then(r => r.json());
  const STYLE = "Children's picture-book illustration, soft watercolor, warm gentle colors, landscape 3:2 aspect ratio. Absolutely NO people, NO faces, NO children, NO text, NO letters, NO signature.";
  const jobs = [[`${ma}-bia`, `${STYLE} Book cover illustration: ${t.bia}.`]].concat(t.trang.map((p, i) => [`${ma}-${i + 1}`,
    `Next illustration for the same picture book. Keep exactly the same watercolor style and color palette, landscape 3:2. No people, no faces, no text. Scene: ${p.anh}.`]));
  const blobs = () => [...new Set([...document.querySelectorAll('img')].filter(i => i.src.startsWith('blob:')).map(i => i.src))];   // tab chạy nền: ảnh chưa giải mã nên không lọc theo kích thước
  const luot = () => [...document.querySelectorAll('ms-chat-turn')];
  // ảnh của lượt trả lời CUỐI CÙNG (blob của ảnh cũ có thể đổi địa chỉ khi trang vẽ lại, nên không so tập blob)
  const anhCuoi = () => { const t = luot(); const c = t[t.length - 1]; if (!c || /^\s*User/.test(c.innerText)) return []; return [...c.querySelectorAll('img')].filter(i => i.src.startsWith('blob:')).map(i => i.src); };
  const dang = () => [...document.querySelectorAll('button')].some(b => /\bStop\b/.test(b.innerText));
  async function webp(src) {
    const im = new Image(); im.src = src; await im.decode();
    if (im.naturalWidth < 300) throw new Error('anh nho');
    const c = document.createElement('canvas'); c.width = 960; c.height = 640; const g = c.getContext('2d');
    const s = Math.max(960 / im.naturalWidth, 640 / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s;
    g.drawImage(im, (960 - w) / 2, (640 - h) / 2, w, h); return c.toDataURL('image/webp', 0.8).split(',')[1];
  }
  window.__tt = { ma, xong: [], loi: [] };
  for (const [ten, P] of jobs) {
    if (sessionStorage.getItem('anh:' + ten)) { window.__tt.xong.push(ten); continue; }
    // tranh đã có trên trang thì bỏ qua (chạy lại chỉ vẽ tranh còn thiếu)
    // tranh đã có thì bỏ qua — trừ tranh do máy chủ vẽ bằng FLUX (có dấu "FLUX.1-schnell" trong tệp): Gemini vẽ lại đẹp hơn
    const coSan = await fetch(`https://raw.githubusercontent.com/Ngocanhno1/Ngocanhno1.github.io/main/games/sach-truyen/anh/${ten}.webp?x=${Date.now()}`, { cache: 'no-store' })
      .then(async r => r.ok && !new TextDecoder('latin1').decode(await r.arrayBuffer()).includes('FLUX.1-schnell')).catch(() => false);
    if (coSan) { window.__tt.xong.push(ten + '(co san)'); continue; }
    const PP = window.__tt.daGui ? P : (P.startsWith(STYLE) ? P : STYLE + ' ' + P);   // lượt đầu của cuộc trò chuyện luôn kèm mô tả nét vẽ
    window.__tt.daGui = true;
    let ok = false;
    for (let lan = 0; lan < 2 && !ok; lan++) {
      for (let i = 0; i < 90 && dang(); i++) await sl(2000);   // lượt trước còn chạy thì chờ hẳn
      const truoc = new Set(blobs()), soLuot = luot().length;
      const ta = document.querySelector('textarea');
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(ta, PP); ta.dispatchEvent(new Event('input', { bubbles: true }));
      await sl(800);
      const b = [...document.querySelectorAll('button')].find(x => /^\s*Run/.test(x.innerText)); if (!b) { window.__tt.loi.push(ten + ':khong-thay-nut-Run'); break; }
      b.click();
      for (let i = 0; i < 15 && !dang(); i++) await sl(1000);    // chờ bắt đầu vẽ
      for (let i = 0; i < 120 && dang(); i++) await sl(2000);    // chờ vẽ xong
      for (let i = 0; i < 15 && !(luot().length > soLuot && anhCuoi().length); i++) await sl(1000);
      const moi = luot().length > soLuot ? anhCuoi() : [];
      let b64 = null; for (const s of moi.reverse()) { try { b64 = await webp(s); break; } catch (e) {} }
      if (b64) { sessionStorage.setItem('anh:' + ten, b64); window.__tt.xong.push(ten); ok = true; }
      else window.__tt.loi.push(ten + ':lan' + lan);
    }
  }
  window.__tt.het = true;
};

// ===== XUAT ===== window.__xuat(['tuan-12','tuan-13']) rồi bấm ctrl+c
window.__xuat = function (dsMa) {
  const d = {};
  for (let i = 0; i < sessionStorage.length; i++) { const k = sessionStorage.key(i); if (k.startsWith('anh:') && dsMa.some(m => k.startsWith('anh:' + m + '-'))) d[k.slice(4) + '.webp'] = { b: sessionStorage.getItem(k) }; }
  let ta = document.getElementById('__xuat'); if (!ta) { ta = document.createElement('textarea'); ta.id = '__xuat'; ta.style.cssText = 'position:fixed;left:0;top:0;width:200px;height:50px;z-index:99999'; document.body.appendChild(ta); }
  ta.value = JSON.stringify(d); ta.focus(); ta.select(); return Object.keys(d).length;
};

// ===== NHAN ===== (tab GitHub upload) window.__nhan() rồi bấm ctrl+v
window.__nhan = function () {
  const ta = document.createElement('textarea'); ta.id = '__nhan'; ta.style.cssText = 'position:fixed;left:10px;top:10px;width:300px;height:60px;z-index:99999;background:#ffd'; document.body.appendChild(ta);
  ta.addEventListener('paste', e => {
    e.preventDefault(); const d = JSON.parse(e.clipboardData.getData('text')); const dt = new DataTransfer();
    for (const [k, v] of Object.entries(d)) {
      if (v.t != null) dt.items.add(new File([v.t], k, { type: 'text/plain' }));
      else { const b = Uint8Array.from(atob(v.b), c => c.charCodeAt(0)); dt.items.add(new File([b], k, { type: 'image/webp' })); }
    }
    const inp = document.querySelector('input[type=file]'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
    ta.value = 'da nhan ' + Object.keys(d).length;
  });
  ta.focus(); return 'san sang';
};

// ===== GHI ===== window.__ghi('Tranh ...') — chờ tải lên xong rồi commit
window.__ghi = async function (tin) {
  const sl = ms => new Promise(r => setTimeout(r, ms));
  await sl(12000); document.getElementById('__nhan')?.remove();   // chờ GitHub tải hết tệp lên (bấm sớm sẽ ra trang lỗi)
  const m = document.querySelector('#commit-summary-input, input[name="message"]');
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(m, tin); m.dispatchEvent(new Event('input', { bubbles: true }));
  await sl(1500);
  const b = [...document.querySelectorAll('button')].find(x => /^\s*Commit changes\s*$/.test(x.innerText));
  setTimeout(() => b.click(), 300); return !b.disabled;
};
