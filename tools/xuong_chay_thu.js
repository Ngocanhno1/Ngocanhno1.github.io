// Mở một trang HTML bằng trình duyệt ảo, bấm thử vài nút, in ra danh sách lỗi dạng JSON (dòng cuối).
const puppeteer = require('puppeteer');
const path = require('path');
(async () => {
  const loi = [];
  const b = await puppeteer.launch({ args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1600, height: 900 });
  p.on('pageerror', e => loi.push('Lỗi JS: ' + e.message));
  p.on('console', m => { if (m.type() === 'error') loi.push('Console: ' + m.text()); });
  try {
    await p.goto('file://' + path.resolve(process.argv[2]), { waitUntil: 'load', timeout: 60000 });
    await new Promise(r => setTimeout(r, 4000));
    // Bấm thử tối đa 5 nút đang hiện để bắt lỗi khi chơi
    for (let i = 0; i < 5; i++) {
      const bam = await p.evaluate(() => {
        const nut = [...document.querySelectorAll('button, [onclick]')].find(n => n.offsetParent && !n.dataset.daBam);
        if (!nut) return false;
        nut.dataset.daBam = 1; nut.click(); return true;
      });
      if (!bam) break;
      await new Promise(r => setTimeout(r, 800));
    }
  } catch (e) { loi.push('Không mở được trang: ' + e.message); }
  await b.close();
  // Bỏ lỗi tải tài nguyên ngoài (ảnh, phông) vì không phải lỗi code
  console.log(JSON.stringify(loi.filter(x => !/Failed to load resource|net::ERR/.test(x)).slice(0, 30)));
})();
