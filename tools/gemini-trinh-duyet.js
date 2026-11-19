/* Đoạn mã chạy trong Chrome (Claude in Chrome) để Gemini Nano Banana Pro vẽ tranh Sách truyện CÓ HAI CON (Lucie, Lucas)
   rồi chuyển thẳng sang GitHub, không qua máy chủ Claude.

   Nạp tệp (AI Studio chặn eval thường, phải qua Trusted Types):
       const pol = trustedTypes.createPolicy('l' + Date.now(), { createScript: s => s });
       (0, eval)(pol.createScript(await (await fetch('https://raw.githubusercontent.com/Ngocanhno1/Ngocanhno1.github.io/main/tools/gemini-trinh-duyet.js?x=' + Date.now())).text()));
   Tab AI Studio: https://aistudio.google.com/prompts/new_chat?authuser=<EMAIL>&model=gemini-3-pro-image-preview
   NHIỀU TÀI KHOẢN (anh dặn 18/11/2026): mỗi tài khoản Google có lượt vẽ riêng trong ngày. Danh sách tài khoản vẽ được nằm ở
     Firebase .../argon/tk (trường ve:"duoc"). Chia truyện cho các tài khoản (tab 1 tài khoản A, tab 2 tài khoản B...).
     Tab nào báo __tt.hetLuot thì: __xuat + tải lên phần đã vẽ (sessionStorage chỉ sống trong tab đó), mở tab mới với
     authuser=<tài khoản kế tiếp còn lượt>, nạp lại tệp, gọi lại __veTruyen (tự bỏ qua tranh đã có). Mọi tài khoản hết thì dừng.
     Tài khoản mới: thử window.__thuVe() — ra {ok:true} thì ghi ve:"duoc". Gặp trang đồng ý điều khoản thì không tự bấm.
   CÁCH NHANH NHẤT (18/11/2026): window.__tuDong([{loai:'truyen',ma:'tuan-05'},{loai:'kn',ma:'03'}]) — vẽ lần lượt, mỗi tranh vẽ xong
     gửi NGAY lên Firebase (sach-truyen-tai / ky-nang-tai); máy chủ (nhan-tranh.yml, 20 phút/lần) cho Gemini soát lỗi rồi mới nhận vào kho,
     tranh lỗi ghi vào sach-truyen-ve-lai / ky-nang-ve-lai kèm lý do và lần vẽ sau tự vẽ lại. Hết lượt thì tự chuyển tài khoản.
     Trang tự tải lại sau mỗi việc: Claude nạp lại tệp này (+ tệp kỹ năng) rồi gọi window.__tiepTuc(). Không cần __xuat/__nhan/__ghi nữa.
   Mỗi lần gọi javascript_tool tối đa ~45 giây: các vòng vẽ chạy ngầm, hỏi tiến độ bằng JSON.stringify(window.__tt).

   BƯỚC 0 (một lần) — Bảng nhân vật cả nhà: window.__taoNhanVat(KHOA)  (KHOA giải mã ảnh thật của bố, mẹ, Lucie, Lucas trong
     games/sach-truyen/tham-chieu.bin; khóa chỉ có trong lệnh việc định kỳ). Gemini vẽ lại cả nhà theo nét màu nước. Claude xem kỹ (giống hai con, dễ thương, không chữ) rồi xuất lên anh/nhan-vat.webp
     bằng window.__xuat(['nhan-vat']). Muốn đổi bảng nhân vật thì xóa anh/nhan-vat.webp và anh/co-nhan-vat.json rồi làm lại.
   BƯỚC 1 — Mỗi truyện 1 cuộc trò chuyện mới: window.__veTruyen('tuan-05'). Lượt đầu đính kèm bảng nhân vật.
     Chỉ vẽ tranh chưa có hai con (không có trong anh/co-nhan-vat.json): tranh thiếu, tranh FLUX, tranh Gemini cũ không người.
     Hết lượt trong ngày thì window.__tt.hetLuot = true.
   BƯỚC 2 — Xuất: await window.__xuat(['tuan-05']) rồi bấm phím ctrl+c (công cụ computer, key). Kèm co-nhan-vat.json đã cập nhật.
   BƯỚC 3 — Tab GitHub (đã đăng nhập Ngocanhno1): https://github.com/Ngocanhno1/Ngocanhno1.github.io/upload/main/games/sach-truyen/anh
     GitHub chặn nạp tệp từ xa: dán thẳng hai hàm __nhan và __ghi ở cuối tệp này, gọi __nhan(), bấm ctrl+v, rồi __ghi('Tranh Gemini vẽ ...').
     __ghi tự chờ 12 giây cho GitHub tải xong rồi mới bấm Commit (bấm sớm ra trang lỗi). */

var __RAW = 'https://raw.githubusercontent.com/Ngocanhno1/Ngocanhno1.github.io/main/';
var __STYLE = "Children's picture-book illustration, soft watercolor on textured paper, warm gentle colors, cozy, landscape 3:2 aspect ratio. No text, no letters, no signature.";
var __NHAN_VAT = "The main characters are LUCIE (8-year-old girl, older sister, wears glasses with clear pink frames, long black hair with bangs) and LUCAS (6-year-old boy, younger brother, round cheeks, short black hair with bangs). " +
  "Their family: MOM (Mẹ Thu Hà, long wavy black hair) and DAD (Bố Ngọc Anh, short black hair). " +
  "Draw every family member EXACTLY like the attached character reference sheet: same faces, glasses, hairstyles and outfits, cute storybook style (not photorealistic).";

// Ảnh thật của cả nhà (bố, mẹ, Lucie, Lucas) để Gemini vẽ bảng nhân vật: lưu MÃ HÓA ở games/sach-truyen/tham-chieu.bin
// (kho công khai nên không để ảnh gốc). Khóa giải mã chỉ nằm trong lệnh của việc định kỳ, không ghi vào kho.
async function __thamChieu(khoa) {
  const raw = new Uint8Array(await (await fetch(__RAW + 'games/sach-truyen/tham-chieu.bin?x=' + Date.now(), { cache: 'no-store' })).arrayBuffer());
  const k = await crypto.subtle.importKey('raw', Uint8Array.from(atob(khoa), c => c.charCodeAt(0)), 'AES-GCM', false, ['decrypt']);
  const d = JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: raw.slice(0, 12) }, k, raw.slice(12))));
  const ra = {}; for (const [ten, b64] of Object.entries(d)) ra[ten] = new File([Uint8Array.from(atob(b64), c => c.charCodeAt(0))], ten + '.jpg', { type: 'image/jpeg' });
  return ra;
}

async function __tep(url, ten) {   // tải ảnh, đổi sang PNG để đính kèm
  const b = await (await fetch(url + (url.includes('?') ? '&' : '?') + 'x=' + Date.now(), { cache: 'no-store' })).blob();
  const im = await createImageBitmap(b); const c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
  c.getContext('2d').drawImage(im, 0, 0); const png = await new Promise(r => c.toBlob(r, 'image/png'));
  return new File([png], ten, { type: 'image/png' });
}
async function __dinhKem(files) {
  const dt = new DataTransfer(); files.forEach(f => dt.items.add(f));
  const inp = document.querySelector('input[type=file]'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
  await new Promise(r => setTimeout(r, 5000));
}
async function __webp(src, W = 960, H = 640) {
  const im = new Image(); im.src = src; await im.decode();
  if (im.naturalWidth < 300) throw new Error('anh nho');
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  const s = Math.max(W / im.naturalWidth, H / im.naturalHeight), w = im.naturalWidth * s, h = im.naturalHeight * s;
  g.drawImage(im, (W - w) / 2, (H - h) / 2, w, h); return c.toDataURL('image/webp', 0.82).split(',')[1];
}
// gửi 1 lệnh, chờ Gemini vẽ xong, trả về ảnh của lượt trả lời CUỐI (blob ảnh cũ có thể đổi địa chỉ khi trang vẽ lại)
// Chờ theo thay đổi trên trang (MutationObserver) thay vì setTimeout: tab nền bị Chrome hãm setTimeout còn 1 lần/phút
function __cho(dk, ms) {
  return new Promise(res => {
    if (dk()) return res(true);
    let xong = false; const het = v => { if (xong) return; xong = true; ob.disconnect(); clearTimeout(t); res(v); };
    const ob = new MutationObserver(() => { try { if (dk()) het(true); } catch (e) {} });
    ob.observe(document.body, { subtree: true, childList: true, attributes: true, characterData: true });
    const t = setTimeout(() => het(dk()), ms);
  });
}
async function __guiVaCho(P, kem) {
  const sl = ms => new Promise(r => setTimeout(r, ms));
  const luot = () => [...document.querySelectorAll('ms-chat-turn')];
  // ảnh có thể nằm ở lượt riêng sau lượt "Thoughts": lấy mọi ảnh blob đủ lớn trong các lượt MỚI (sau lệnh vừa gửi)
  let soLuot = 0;
  let lanCuon = 0;   // trang chỉ vẽ ảnh của lượt đang hiện trên màn hình: thỉnh thoảng cuộn xuống cuối
  const cuon = () => { if (Date.now() - lanCuon < 1500) return; lanCuon = Date.now(); const t = luot(); if (t.length) t[t.length - 1].scrollIntoView({ block: 'end' }); };
  const anhCuoi = () => (cuon(), luot().slice(soLuot)).flatMap(x => [...x.querySelectorAll('img')]).filter(i => i.src.startsWith('blob:') && !(i.naturalWidth && i.naturalWidth < 300)).map(i => i.src);
  const dang = () => [...document.querySelectorAll('button')].some(b => /\bStop\b/.test(b.innerText));
  await __cho(() => !dang(), 180000);
  if (kem && kem.length) await __dinhKem(kem);
  soLuot = luot().length;
  const ta = document.querySelector('textarea');
  Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(ta, P); ta.dispatchEvent(new Event('input', { bubbles: true }));
  const nutRun = () => [...document.querySelectorAll('button')].find(x => /^\s*Run/.test(x.innerText));
  await __cho(() => { const x = nutRun(); return x && !x.disabled && x.getAttribute('aria-disabled') !== 'true'; }, 5000);
  const b = nutRun(); if (!b) return { loi: 'khong-thay-nut-Run' };
  b.click();
  await __cho(dang, 15000);
  await __cho(() => !dang(), 300000);
  const loiCuoi = () => { if (dang()) return false; const t = luot(); const c = t[t.length - 1]; return t.length > soLuot && c && /reached your|rate limit|quota|failed to generate/i.test(c.textContent.slice(0, 600)); };
  const coAnh = () => (luot().length > soLuot && anhCuoi().length > 0) || loiCuoi();
  for (let k = 0; k < 8 && !coAnh(); k++) {   // vẽ xong trang đứng yên: tự cuộn để trang hiện ảnh rồi chờ thay đổi
    lanCuon = 0; cuon(); const tg = document.querySelector('ms-autoscroll-container, .chat-view-container'); if (tg) tg.scrollTop = tg.scrollHeight;
    await __cho(coAnh, 12000);
  }
  { const t = luot(); if (t.length) t[t.length - 1].scrollIntoView({ block: 'end' }); }
  const moi = luot().length > soLuot ? anhCuoi() : [];
  if (!moi.length) {
    const q = /quota exceeded|daily limit|rate limit|resource exhausted|reached your limit|\b429\b/i.test(document.body.innerText.slice(-4000)) ||
              [...document.querySelectorAll('mat-dialog-container,[role=dialog]')].some(d => /unlock|go further with ai studio/i.test(d.innerText));
    return { loi: q ? 'HET_LUOT' : 'khong-co-anh' };
  }
  return { src: moi[moi.length - 1] };
}

// ===== FIREBASE: gửi ngay từng tranh, đọc danh sách tranh bị máy chủ loại để vẽ lại =====
var __FB = 'https://lucie-lucas-ciecas-default-rtdb.asia-southeast1.firebasedatabase.app/gd_hh1g8b83gym1g74zmily/';
async function __fbLay(nut) { try { return (await (await fetch(__FB + nut + '.json', { cache: 'no-store' })).json()) || {}; } catch (e) { return {}; } }
async function __fbGui(nut, ten, b) { try { return (await fetch(__FB + nut + '/' + ten + '.json', { method: 'PUT', body: JSON.stringify({ b, t: Date.now() }) })).ok; } catch (e) { return false; } }
async function __fbXoa(nut, ten) { try { await fetch(__FB + nut + '/' + ten + '.json', { method: 'DELETE' }); } catch (e) {} }

// Email tài khoản đang mở và ghi sổ vào trang theo dõi (https://ngocanhno1.github.io/theo-doi-gemini/)
window.__email = () => { const b = document.querySelector('[aria-label*="Google Account"]'); return ((b && b.getAttribute('aria-label')) || document.body.innerHTML).match(/[\w.+-]+@[\w.-]+\.\w+/)?.[0] || '?'; };
async function __ghiSo(viec, kq, so) {
  try { await fetch('https://lucie-lucas-ciecas-default-rtdb.asia-southeast1.firebasedatabase.app/gd_hh1g8b83gym1g74zmily/argon/lan.json',
    { method: 'POST', body: JSON.stringify({ e: window.__email(), t: Date.now(), tok: 0, anh: so || 0, loai: 've', viec, kq }) }); } catch (e) {}
}
// Thử một tài khoản có vẽ được không (1 tranh nhỏ, không lưu)
window.__thuVe = async function () {
  const r = await __guiVaCho('Draw a small cute watercolor apple on a plain background. No text.');
  await __ghiSo('thử vẽ', r.src ? 'ok' : (r.loi === 'HET_LUOT' ? 'het' : 'loi'));
  return r.src ? { ok: true, e: window.__email() } : { ok: false, loi: r.loi, e: window.__email() };
};

// ===== BẢNG NHÂN VẬT ===== window.__taoNhanVat(khoa)  (khoa: khóa giải mã ảnh thật; không có khóa thì chỉ dùng ảnh mặt hai con)
window.__taoNhanVat = async function (khoa) {
  window.__tt = { ma: 'nhan-vat', xong: [], loi: [] };
  let kem, gt;
  if (khoa) {
    const t = await __thamChieu(khoa);
    kem = ['lucie', 'lucie-kinh', 'lucas', 'me', 'bo', 'gia-dinh'].map(k => t[k]);
    gt = "Attached photos: 1-2 = the girl LUCIE (8, older sister; she always wears glasses with clear pink frames), 3 = the boy LUCAS (6, younger brother), " +
         "4 = their MOM (Mẹ Thu Hà), 5 = their DAD (Bố Ngọc Anh), 6 = the whole family together. ";
  } else {
    kem = [await __tep('https://ngocanhno1.github.io/img/lucie.webp', 'lucie.png'), await __tep('https://ngocanhno1.github.io/img/lucas.webp', 'lucas.png')];
    gt = "Attached photo 1 = the girl LUCIE (8, older sister, wears glasses with clear pink frames), photo 2 = the boy LUCAS (6, younger brother). Also draw their MOM (long wavy black hair) and DAD (short black hair) as simple gentle adults. ";
  }
  const P = "Create a CHARACTER REFERENCE SHEET for a children's watercolor picture book, landscape 3:2. " + gt +
    "Redraw each family member as a charming storybook character in soft watercolor, keeping their real face shape, eyes, hairstyle and hair color so the family recognizes them at once. " +
    "Show all four full-body, standing in a row (Dad, Mom, Lucie, Lucas), front view, warm friendly smiles, on a plain cream background. " +
    "Fixed outfits for the whole book: Lucie in a pastel pink dress, small yellow hair clip and her clear pink glasses; Lucas in a light blue T-shirt and beige shorts; " +
    "Mom in a cream cardigan and light skirt; Dad in a navy shirt and dark trousers. No text, no names, no letters.";
  const r = await __guiVaCho(P, kem);
  if (r.src) { sessionStorage.setItem('anh:nhan-vat', await __webp(r.src)); window.__tt.xong.push('nhan-vat'); } else window.__tt.loi.push(r.loi);
  window.__tt.het = true;
};

// ===== VẼ MỘT TRUYỆN =====
window.__veTruyen = async function (ma) {
  window.__tt = { ma, xong: [], loi: [], taiKhoan: window.__email() };
  const t = await fetch(`${__RAW}games/sach-truyen/truyen/${ma}.json?x=${Date.now()}`).then(r => r.json());
  const veLai = await __fbLay('sach-truyen-ve-lai');   // tranh máy chủ đã loại: {ten: {ly_do}}
  const coNV = await fetch(`${__RAW}games/sach-truyen/anh/co-nhan-vat.json?x=${Date.now()}`, { cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []);
  const sach = s => (s || '').replace(/,?\s*(no people|without people|no faces?|no humans?|no children|no text)\b/gi, '').replace(/\s+,/g, ',').trim();
  const jobs = [[`${ma}-bia`, `Book cover illustration for the story "${t.tieu_de}". Show Lucie and Lucas together, happy, in this setting: ${sach(t.bia)}. Do NOT write the title or any text in the picture.`]]
    .concat(t.trang.map((p, i) => [`${ma}-${i + 1}`,
      `Illustration for page ${i + 1}. The page text (Vietnamese) is: «${p.loi}». Setting hints: ${sach(p.anh)}. ` +
      `Show the characters this page is about, doing what the text says (draw Lucie and/or Lucas only if they are in this moment). ` +
      `Mom and Dad look exactly like the reference sheet. Grandparents or other adults, if present, are gentle and simply drawn. Keep the same style, characters and outfits as before. ` +
      `IMPORTANT: the Vietnamese text is only to tell you what happens. Do NOT write any text, letters, captions, words or speech bubbles anywhere in the picture.`]));
  let dau = true;
  for (const [ten, P] of jobs) {
    if (veLai[ten]) sessionStorage.removeItem('anh:' + ten);
    else if (sessionStorage.getItem('anh:' + ten) || coNV.includes(ten + '.webp')) { window.__tt.xong.push(ten + '(co)'); continue; }
    window.__tt.dangVe = ten;
    let kem = null, PP = P + (veLai[ten] ? ` A previous version was rejected because: ${veLai[ten].ly_do}. Avoid this problem.` : '');
    if (dau) {   // lượt đầu: đính kèm bảng nhân vật (chưa có thì đính kèm ảnh thật của hai con)
      const nv = await fetch(`${__RAW}games/sach-truyen/anh/nhan-vat.webp?x=${Date.now()}`, { method: 'HEAD', cache: 'no-store' }).then(r => r.ok).catch(() => false);
      kem = nv ? [await __tep(`${__RAW}games/sach-truyen/anh/nhan-vat.webp`, 'nhan-vat.png')]
               : [await __tep('https://ngocanhno1.github.io/img/lucie.webp', 'lucie.png'), await __tep('https://ngocanhno1.github.io/img/lucas.webp', 'lucas.png')];
      PP = `${__STYLE} ${__NHAN_VAT} ${P}`;
      dau = false;
    }
    let ok = false;
    for (let lan = 0; lan < 2 && !ok; lan++) {
      const r = await __guiVaCho(PP, lan === 0 ? kem : null);
      if (r.src) {
        const b = await __webp(r.src); sessionStorage.setItem('anh:' + ten, b); window.__tt.xong.push(ten); ok = true;
        if (await __fbGui('sach-truyen-tai', ten, b) && veLai[ten]) await __fbXoa('sach-truyen-ve-lai', ten);   // gửi ngay, máy chủ soát rồi nhận
      }
      else { window.__tt.loi.push(ten + ':' + r.loi); if (r.loi === 'HET_LUOT') { window.__tt.het = true; window.__tt.hetLuot = true; await __ghiSo('vẽ tranh ' + ma, 'het', window.__tt.xong.filter(x => !x.endsWith('(co)')).length); return; } }
    }
  }
  window.__tt.het = true;
  await __ghiSo('vẽ tranh ' + ma, 'ok', window.__tt.xong.filter(x => !x.endsWith('(co)')).length);
};

// ===== TỰ ĐỘNG NHIỀU VIỆC, TỰ ĐỔI TÀI KHOẢN =====
// window.__tuDong([{loai:'truyen',ma:'tuan-05'},{loai:'kn',ma:'03'}])  (không await; hỏi tiến độ bằng window.__tt)
// Mỗi việc 1 cuộc trò chuyện mới: xong việc thì trang tự tải lại; hết lượt thì tự chuyển sang tài khoản kế tiếp còn lượt
// (danh sách: Firebase argon/tk, ve:"duoc"; tài khoản hết lượt trong ngày ghi ở localStorage 'veHet').
// Sau mỗi lần trang tải lại, Claude chỉ cần nạp lại tệp (và tệp kỹ năng) rồi gọi window.__tiepTuc().
var __MO_VE = 'gemini-3-pro-image';
// Mỗi tài khoản một hàng đợi riêng (4 tab chạy song song dùng chung localStorage của aistudio.google.com)
function __khoaCho(email) { return 'tuDongCho:' + (email || window.__email()); }
function __docCho(email) { try { return JSON.parse(localStorage.getItem(__khoaCho(email)) || '[]'); } catch (e) { return []; } }
function __ghiCho(ds, email) { if (ds && ds.length) localStorage.setItem(__khoaCho(email), JSON.stringify(ds)); else localStorage.removeItem(__khoaCho(email)); }
function __moChat(email) { location.href = 'https://aistudio.google.com/prompts/new_chat?authuser=' + encodeURIComponent(email) + '&model=' + __MO_VE; }
async function __doiTaiKhoan() {
  const hom = new Date().toISOString().slice(0, 10), het = JSON.parse(localStorage.getItem('veHet') || '{}');
  het[window.__email()] = hom; localStorage.setItem('veHet', JSON.stringify(het));
  const tk = await __fbLay('argon/tk');
  const tiep = Object.entries(tk).filter(([, v]) => v && v.ve === 'duoc').map(([k]) => k.replace(/,/g, '.')).find(e => het[e] !== hom);
  if (!tiep) { window.__tt.tatCaHet = true; return 'TAT_CA_HET'; }
  __ghiCho(__docCho(tiep).concat(__docCho()), tiep); __ghiCho([]);   // chuyển việc còn lại sang tài khoản kế tiếp
  __moChat(tiep); return 'DOI:' + tiep;
}
window.__tuDong = async function (ds) {
  ds = ds || __docCho();
  __ghiCho(ds);
  if (!ds.length) { window.__tt = Object.assign(window.__tt || {}, { xongHet: true }); return 'XONG'; }
  const v = ds[0];
  if (v.loai === 'kn') await window.__veBai(v.ma, v.trang); else await window.__veTruyen(v.ma);
  if (window.__tt.hetLuot) return __doiTaiKhoan();
  ds.shift(); __ghiCho(ds);
  if (!ds.length) { window.__tt.xongHet = true; return 'XONG'; }
  __moChat(window.__email()); return 'VIEC_TIEP';
};
window.__tiepTuc = () => __docCho().length ? (window.__tuDong(), 'DANG_CHAY') : 'KHONG_CO_VIEC';

// ===== XUẤT ===== await window.__xuat(['tuan-05']) rồi bấm ctrl+c. Kèm co-nhan-vat.json (danh sách tranh đã có hai con).
window.__xuat = async function (dsMa) {
  const d = {}, moi = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const k = sessionStorage.key(i); if (!k.startsWith('anh:')) continue;
    const ten = k.slice(4);
    if (ten === 'nhan-vat' ? dsMa.includes('nhan-vat') : dsMa.some(m => ten.startsWith(m + '-'))) { d[ten + '.webp'] = { b: sessionStorage.getItem(k) }; if (ten !== 'nhan-vat') moi.push(ten + '.webp'); }
  }
  if (moi.length) {
    const cu = await fetch(`${__RAW}games/sach-truyen/anh/co-nhan-vat.json?x=${Date.now()}`, { cache: 'no-store' }).then(r => r.ok ? r.json() : []).catch(() => []);
    d['co-nhan-vat.json'] = { t: JSON.stringify([...new Set(cu.concat(moi))].sort()) };
  }
  let ta = document.getElementById('__xuat'); if (!ta) { ta = document.createElement('textarea'); ta.id = '__xuat'; ta.style.cssText = 'position:fixed;left:0;top:0;width:200px;height:50px;z-index:99999'; document.body.appendChild(ta); }
  ta.value = JSON.stringify(d); ta.focus(); ta.select(); return Object.keys(d);
};

// ===== GỬI QUA FIREBASE ===== await window.__guiFB(['tuan-05']) — không cần mở GitHub, không dùng bộ nhớ tạm.
// Máy chủ GitHub (workflow nhan-tranh.yml, 20 phút/lần hoặc khi sửa tools/nhan-tranh.txt) kéo tranh về kho rồi xóa khỏi Firebase.
window.__guiFB = async function (dsMa) {
  const FB = 'https://lucie-lucas-ciecas-default-rtdb.asia-southeast1.firebasedatabase.app/gd_hh1g8b83gym1g74zmily/sach-truyen-tai/';
  const da = [];
  for (let i = 0; i < sessionStorage.length; i++) {
    const k = sessionStorage.key(i); if (!k.startsWith('anh:')) continue;
    const ten = k.slice(4);
    if (!(ten === 'nhan-vat' ? dsMa.includes('nhan-vat') : dsMa.some(m => ten.startsWith(m + '-')))) continue;
    const r = await fetch(FB + ten + '.json', { method: 'PUT', body: JSON.stringify({ b: sessionStorage.getItem(k), t: Date.now() }) });
    da.push(ten + (r.ok ? '' : ':LOI' + r.status));
  }
  return da;
};

// ===== NHẬN (tab GitHub upload) ===== window.__nhan() rồi bấm ctrl+v (dán được nhiều lần, tệp cộng dồn)
window.__nhan = function () {
  let ta = document.getElementById('__nhan');
  if (!ta) {
    ta = document.createElement('textarea'); ta.id = '__nhan'; ta.style.cssText = 'position:fixed;left:10px;top:10px;width:300px;height:60px;z-index:99999;background:#ffd'; document.body.appendChild(ta);
    ta.addEventListener('paste', e => {
      e.preventDefault(); const d = JSON.parse(e.clipboardData.getData('text')); const dt = new DataTransfer();
      for (const [k, v] of Object.entries(d)) {
        if (v.t != null) dt.items.add(new File([v.t], k, { type: k.endsWith('.json') ? 'application/json' : 'text/plain' }));
        else { const b = Uint8Array.from(atob(v.b), c => c.charCodeAt(0)); dt.items.add(new File([b], k, { type: 'image/webp' })); }
      }
      const inp = document.querySelector('input[type=file]'); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true }));
      ta.value = (ta.value ? ta.value + ' + ' : '') + Object.keys(d).join(',');
    });
  }
  ta.focus(); return 'san sang';
};

// ===== GHI ===== await window.__ghi('Tranh ...') — tự chờ tải lên xong rồi commit
window.__ghi = async function (tin) {
  const sl = ms => new Promise(r => setTimeout(r, ms));
  await sl(12000); const v = document.getElementById('__nhan')?.value; document.getElementById('__nhan')?.remove();
  const m = document.querySelector('#commit-summary-input, input[name="message"]');
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(m, tin); m.dispatchEvent(new Event('input', { bubbles: true }));
  await sl(1500);
  const b = [...document.querySelectorAll('button')].find(x => /^\s*Commit changes\s*$/.test(x.innerText));
  setTimeout(() => b.click(), 300); return v;
};
