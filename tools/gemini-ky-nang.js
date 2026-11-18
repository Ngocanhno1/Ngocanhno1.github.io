/* Vẽ tranh Trường Kỹ Năng bằng Gemini Nano Banana Pro (có hai con theo bảng nhân vật cả nhà của Sách truyện).
   Nạp SAU tools/gemini-trinh-duyet.js trong tab AI Studio (model gemini-3-pro-image-preview), mỗi bài 1 cuộc trò chuyện mới:
       window.__veBai('01')         → vẽ 5 trang bài 01 (bỏ qua trang đã vẽ trong tab này hoặc đã có trên kho)
       JSON.stringify(window.__tt)  → hỏi tiến độ
       await window.__xuatKN(['01','02'])  → đưa vào ô dán, bấm ctrl+c; tab GitHub upload games/ky-nang/anh dùng __nhan/__ghi */
(function () {
  // Tab chạy nền bị Chrome hãm đồng hồ (1 lần/phút) → vòng chờ chậm hẳn. Cho setTimeout dài chạy qua Worker (không bị hãm).
  if (!window.__wk) {
    const pol = trustedTypes.createPolicy('w' + Date.now(), { createScriptURL: s => s });
    const w = new Worker(pol.createScriptURL(URL.createObjectURL(new Blob(['onmessage=e=>setTimeout(()=>postMessage(e.data[0]),e.data[1])'], { type: 'text/javascript' }))));
    let id = 0; const cb = {}; w.onmessage = e => { const f = cb[e.data]; delete cb[e.data]; if (f) f(); };
    const st = window.setTimeout.bind(window), ct = window.clearTimeout.bind(window);
    window.setTimeout = (f, ms, ...a) => { if (typeof f !== 'function' || !(ms >= 500)) return st(f, ms, ...a); const i = 1e9 + (++id); cb[i] = () => f(...a); w.postMessage([i, ms]); return i; };
    window.clearTimeout = i => { if (i > 1e9) delete cb[i]; else ct(i); };
    window.__wk = w;
  }
  // Mẹo: mỗi bài 1 cuộc trò chuyện mới (trò chuyện dài nhiều tranh thì Gemini vẽ chậm dần). sessionStorage giữ tranh khi đổi trang/tài khoản trong cùng tab.
  const RAW = 'https://raw.githubusercontent.com/Ngocanhno1/Ngocanhno1.github.io/main/';
  async function duLieu() {
    const s = await (await fetch(RAW + 'games/ky-nang/du-lieu.js?x=' + Date.now(), { cache: 'no-store' })).text();
    return JSON.parse(s.slice(s.indexOf('{'), s.lastIndexOf('}') + 1));
  }
  window.__veBai = async function (ma) {
    window.__tt = { ma, xong: [], loi: [] };
    const KN = await duLieu(), bai = KN.bai.find(b => b.ma === ma);
    const coSan = await fetch(RAW + 'games/ky-nang/anh/da-ve.json?x=' + Date.now(), { cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []);
    let dau = true;
    for (let i = 0; i < bai.trang.length; i++) {
      const t = bai.trang[i], ten = t.anh;
      if (sessionStorage.getItem('kn:' + ten) || coSan.includes(ten + '.webp')) { window.__tt.xong.push(ten + '(co)'); continue; }
      let P = `Illustration ${i + 1} of 5 for a children's life-skills lesson "${bai.ten}". The Vietnamese story text for this page is: «${t.ke}». ` +
        `Scene: ${t.ve.replace(/a girl with pink glasses/gi, 'Lucie').replace(/a little boy/gi, 'Lucas')}. ` +
        `Show clearly what the text says, with expressive faces so a 6-year-old understands the feeling and the right or wrong behaviour. ` +
        `Draw Lucie and/or Lucas only if they are in this moment, exactly like the reference sheet (same faces, Lucie's clear pink glasses, same outfits). ` +
        `Other adults and children are gentle, simply drawn Vietnamese people. Vietnamese everyday setting. ` +
        `IMPORTANT: Do NOT write any text, letters, numbers, captions or speech bubbles anywhere in the picture.`;
      let kem = null;
      if (dau) {
        kem = [await __tep(RAW + 'games/sach-truyen/anh/nhan-vat.webp', 'nhan-vat.png')];
        P = `${__STYLE} ${__NHAN_VAT} ` + P;
        dau = false;
      }
      let ok = false;
      for (let lan = 0; lan < 2 && !ok; lan++) {
        const r = await __guiVaCho(P, lan === 0 ? kem : null);
        if (r.src) { sessionStorage.setItem('kn:' + ten, await __webp(r.src)); window.__tt.xong.push(ten); ok = true; }
        else {
          window.__tt.loi.push(ten + ':' + r.loi);
          if (r.loi === 'HET_LUOT') { window.__tt.het = true; window.__tt.hetLuot = true; await __ghiSo('vẽ tranh kỹ năng ' + ma, 'het', window.__tt.xong.length); return; }
        }
      }
    }
    window.__tt.het = true;
    await __ghiSo('vẽ tranh kỹ năng ' + ma, 'ok', window.__tt.xong.filter(x => !x.endsWith('(co)')).length);
  };
  window.__xuatKN = async function (dsMa) {
    const d = {}, moi = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i); if (!k.startsWith('kn:')) continue;
      const ten = k.slice(3); if (!dsMa.some(m => ten.startsWith(m + '-'))) continue;
      d[ten + '.webp'] = { b: sessionStorage.getItem(k) }; moi.push(ten + '.webp');
    }
    const cu = await fetch(RAW + 'games/ky-nang/anh/da-ve.json?x=' + Date.now(), { cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []);
    d['da-ve.json'] = { t: JSON.stringify([...new Set(cu.concat(moi))].sort()) };
    let ta = document.getElementById('__xuat'); if (!ta) { ta = document.createElement('textarea'); ta.id = '__xuat'; ta.style.cssText = 'position:fixed;left:0;top:0;width:200px;height:50px;z-index:99999'; document.body.appendChild(ta); }
    ta.value = JSON.stringify(d); ta.focus(); ta.select(); return Object.keys(d);
  };
})();
