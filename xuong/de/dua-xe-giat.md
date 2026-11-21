Em là lập trình viên game WebGL (three.js r128). Dưới đây là TOÀN BỘ mã game "Đua xe" (games/dua-xe/index.html) chạy trên TV LG webOS và iPad, có chế độ 2 người chia đôi màn hình.

LỖI ANH BÁO: hai chị em đua chế độ 2 người thì rất giật, tốc độ càng nhanh càng giật, cuối cùng TV báo "ứng dụng sẽ khởi động lại để giải phóng bộ nhớ" (tràn bộ nhớ). Ảnh chụp thấy tốc độ lên tới 601 km/h.

CLAUDE ĐÃ CHẨN ĐOÁN SƠ BỘ (em kiểm tra lại, sửa đúng gốc, có thể thấy thêm chỗ khác):
1. renderSceneForView: mỗi chướng ngại/xu/nitro (r.objMeshes) và mỗi cổng câu hỏi (r.gateMeshes, makeGateMesh có CanvasTexture chữ) được TẠO MỚI khi lại gần nhưng KHÔNG BAO GIỜ xóa khi đã đi qua — chỉ ẩn đi. Đi càng nhanh càng qua nhiều vật -> hàng nghìn mesh + geometry + material + texture tích lại -> tràn bộ nhớ GPU. Chế độ 2 người còn nhân đôi.
2. scene.remove(...) ở r.props, R3.player, objMeshes, gateMeshes không gọi dispose() geometry/material/texture.
3. Mỗi vật tạo geometry/material riêng thay vì dùng chung.
4. Tốc độ quá cao (601 km/h) làm vật xuất hiện dồn dập.

YÊU CẦU SỬA:
- Vật/cổng đã đi qua (o.s < d - 12, o.got, cổng đã vỡ hoặc đã qua) thì gỡ khỏi scene, dispose đầy đủ (kể cả texture trong material.map), xóa khỏi Map. Viết hàm boDi(obj) duyệt traverse để dispose. Tốt hơn nữa: dùng chung geometry/material cho cùng loại vật (coin, nitro, tim, chướng ngại) để không cần tạo mới.
- Mọi chỗ scene.remove trong code đều dispose tương ứng.
- Giới hạn tốc độ hiển thị tối đa hợp lý (khoảng 300 km/h), vẫn giữ cảm giác nitro.
- Chế độ 2 người và trên TV/iPad: setPixelRatio tối đa 1, tắt antialias khi chơi 2 người nếu cần, giảm số hạt (parts) và cây/nhà.
- KHÔNG đổi luật chơi, câu hỏi, giao diện, mặt thật hai bé, dong-bo.js, dem-gio.js, giong-noi.js.

CÁCH TRẢ LỜI (bắt buộc, vì tệp rất dài nên KHÔNG viết lại cả tệp):
Trả về MỘT khối ```json là một mảng các sửa đổi: [{"cu": "đoạn mã gốc copy NGUYÊN VĂN, đủ dài để là duy nhất trong tệp", "moi": "đoạn mã thay thế"}]. Mỗi "cu" phải khớp chính xác từng ký tự với mã gốc và chỉ xuất hiện một lần. Sau khối json, viết 3-5 dòng tiếng Việt tóm tắt đã sửa gì.

===== MÃ GỐC =====
<!DOCTYPE html>
<html lang="vi">
<head>
<script src="/games/anh-chung/dong-bo.js"></script>
<script src="/games/anh-chung/dem-gio.js" defer></script>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<meta name="author" content="Nguyễn Hoàng Ngọc Anh">
<meta name="keywords" content="Ban Tuyên giáo Trung ương">
<title>Đua Xe Tia Chớp Lucie & Lucas</title>
<link rel="manifest" href="/manifest.webmanifest">
<script>if ("serviceWorker" in navigator) addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => {}));</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;700;800&display=swap" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:100%;height:100%;overflow:hidden;background:#0b1630;font-family:'Baloo 2',system-ui,sans-serif;color:#fff;-webkit-tap-highlight-color:transparent;user-select:none}
#cv,#cv2{position:fixed;inset:0;width:100vw;height:100vh;display:block}
button{font-family:inherit;cursor:pointer;outline:none}
.hide{display:none!important}
.btn{border:0;border-radius:18px;padding:.45em 1.1em;font-weight:800;font-size:clamp(18px,2.2vw,30px);color:#fff;background:linear-gradient(#ff7a3d,#e8410f);box-shadow:0 6px 0 #9c2a06,0 10px 22px rgba(0,0,0,.35);transition:transform .08s}
.btn.xanh{background:linear-gradient(#4fc3ff,#1673d6);box-shadow:0 6px 0 #0d4691,0 10px 22px rgba(0,0,0,.35)}
.btn:focus-visible,.btn.foc{outline:5px solid #ffe066;outline-offset:4px;transform:scale(1.05)}
.btn:active{transform:translateY(3px)}

/* Màn bắt đầu */
#start{position:fixed;inset:0;z-index:50;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5vh;padding:2vh 2.5vw;
  background:radial-gradient(circle at 50% 120%,rgba(255,170,40,.55),transparent 55%),linear-gradient(160deg,#10204a 0,#2b1a6b 55%,#561b6b 100%)}
#start:before{content:"";position:absolute;inset:auto 0 0 0;height:26vh;background:repeating-linear-gradient(90deg,#222 0 8vw,#fff 8vw 16vw);opacity:.08}
#start h1{font-size:clamp(34px,6vw,96px);line-height:.95;text-align:center;color:#ffe14d;text-shadow:0 5px 0 #c2410c,0 10px 0 rgba(0,0,0,.35);font-style:italic;letter-spacing:1px}
#start h1 small{display:block;font-size:.42em;color:#fff;text-shadow:0 3px 0 #1d4ed8;font-style:normal}
#start .sub{font-size:clamp(15px,1.8vw,25px);text-align:center;max-width:1100px;text-shadow:0 2px 0 #000;opacity:.95}
.chars{display:flex;gap:2.5vw;flex-wrap:wrap;justify-content:center}
.char{width:clamp(175px,20vw,285px);border-radius:26px;padding:1.6vh 1vw;display:flex;flex-direction:column;align-items:center;gap:.5vh;font-size:clamp(20px,2.4vw,34px);color:#fff;border:5px solid rgba(255,255,255,.85)}
.char img{width:66%;aspect-ratio:1;object-fit:cover;border-radius:50%;border:6px solid #fff;background:#ddd;box-shadow:0 6px 18px rgba(0,0,0,.35)}
.char.lucas{background:linear-gradient(#5cc2ff,#1b5fd1);box-shadow:0 8px 0 #0f3b88}
.char.lucie{background:linear-gradient(#ff8fc7,#d6337f);box-shadow:0 8px 0 #93174f}
.char.both{background:linear-gradient(135deg,#ff8fc7 0%,#9333ea 50%,#5cc2ff 100%);box-shadow:0 8px 0 #4c1d95}
.char .pairImg{display:flex;align-items:center;justify-content:center;width:86%;aspect-ratio:2/1}
.char .pairImg img{width:52%;aspect-ratio:1;margin:0 -6%}
.char small{font-size:.55em;opacity:.95;line-height:1.1;text-align:center}
.char .best{font-size:.5em;background:rgba(0,0,0,.25);border-radius:12px;padding:0 .6em}
.char:focus-visible,.char.foc{outline:6px solid #ffe066;outline-offset:5px;transform:scale(1.05)}
.mau{display:flex;gap:1.2vw;align-items:center;font-size:clamp(16px,1.8vw,24px)}
.mau button{width:clamp(38px,3.6vw,54px);height:clamp(38px,3.6vw,54px);border-radius:50%;border:4px solid #fff;box-shadow:0 4px 0 rgba(0,0,0,.35)}
.mau button.on{outline:5px solid #ffe066;outline-offset:3px;transform:scale(1.12)}
.keys{font-size:clamp(13px,1.4vw,20px);opacity:.9;text-align:center}
#homeBtn{position:fixed;right:14px;top:12px;z-index:60;font-size:clamp(14px,1.5vw,20px);padding:.3em .9em;border-radius:14px}

/* HUD 1 người */
#hud{position:fixed;inset:0 0 auto 0;z-index:10;display:flex;align-items:flex-start;justify-content:space-between;gap:1vw;padding:1.2vh 1.2vw;pointer-events:none}
.hbox{background:rgba(10,18,45,.72);border:3px solid rgba(255,255,255,.55);border-radius:18px;padding:.4vh 1vw;display:flex;align-items:center;gap:.8vw;font-weight:800;font-size:clamp(16px,2vw,30px)}
.tim{display:inline-flex;flex-wrap:nowrap;gap:.15em;align-items:center;margin-left:.45em;flex:none}.tim svg{width:1.05em;height:1.05em;filter:drop-shadow(0 2px 0 rgba(0,0,0,.35));transition:transform .3s}.tim svg.mat{opacity:.35;filter:grayscale(1)}
.tim.rung{animation:rungTim .6s}@keyframes rungTim{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px) scale(1.2)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(3px)}}
.hbox img{width:clamp(40px,4.4vw,64px);height:clamp(40px,4.4vw,64px);border-radius:50%;object-fit:cover;border:3px solid #fff}
#rankBox{flex-direction:column;gap:0;line-height:1;padding:.6vh 1.4vw;text-align:center}
#rank{font-size:clamp(34px,5vw,78px);color:#ffe14d;text-shadow:0 4px 0 #b45309}
#rank sup{font-size:.4em;color:#fff}
#chang{font-size:clamp(13px,1.4vw,20px);opacity:.95}
#track{position:fixed;left:50%;top:1.4vh;transform:translateX(-50%);width:min(44vw,640px);height:clamp(46px,5vw,70px);z-index:22;pointer-events:none}
#track.duoTrack{top:calc(1.6vh + clamp(52px,5.6vw,84px));width:min(40vw,560px)}
#track .line{position:absolute;left:0;right:0;top:50%;height:10px;margin-top:-5px;border-radius:6px;background:repeating-linear-gradient(90deg,#fff 0 12px,#333 12px 24px);opacity:.75}
#track .seg{position:absolute;top:calc(50% - 9px);width:3px;height:18px;background:#ffe14d}
#track .dot{position:absolute;top:50%;width:clamp(30px,3.2vw,46px);height:clamp(30px,3.2vw,46px);margin:calc(clamp(30px,3.2vw,46px)/-2) 0 0 calc(clamp(30px,3.2vw,46px)/-2);border-radius:50%;border:3px solid #fff;object-fit:cover;background:#fff;transition:left .15s linear}
#track .dot.me{border-color:#ffe14d;z-index:3;width:clamp(38px,4vw,56px);height:clamp(38px,4vw,56px);margin:calc(clamp(38px,4vw,56px)/-2) 0 0 calc(clamp(38px,4vw,56px)/-2);box-shadow:0 0 0 3px #f97316}
#speedo{position:fixed;left:1.2vw;bottom:1.6vh;transition:opacity .3s,transform .2s,border-color .2s;z-index:10;width:clamp(110px,11vw,170px);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,#1e293b 0 58%,#0f172a 59%);border:5px solid #fff;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;box-shadow:0 8px 20px rgba(0,0,0,.4)}
#speedo b{font-size:clamp(28px,3.4vw,52px);line-height:1}
#speedo span{font-size:clamp(12px,1.2vw,18px);opacity:.8}
#speedo.hot{border-color:#ff3b30;box-shadow:0 0 28px #ff3b30,0 0 60px #38bdf8;transform:scale(1.1)}
#speedo.hot b{color:#ff453a;text-shadow:0 0 12px #ff9f0a}
#nitroBar{position:absolute;left:12%;right:12%;bottom:14%;height:8px;border-radius:5px;background:#334155;overflow:hidden}
#nitroBar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#22d3ee,#a78bfa)}
#streak{position:fixed;left:50%;top:calc(2vh + clamp(46px,5vw,70px));transform:translateX(-50%);z-index:10;font-weight:800;font-size:clamp(16px,1.8vw,26px);color:#ffe14d;text-shadow:0 2px 0 #000;pointer-events:none}

/* Câu hỏi 1 người */
#qbox{position:fixed;left:50%;bottom:1.5vh;transform:translateX(-50%);z-index:20;width:min(94vw,1250px);background:rgba(255,255,255,.96);color:#1e1b4b;border-radius:28px;border:6px solid #ffe14d;box-shadow:0 14px 40px rgba(0,0,0,.45);padding:1vh 1.4vw 1.2vh;display:flex;flex-direction:column;gap:.8vh}
#qtop{display:flex;align-items:center;gap:1vw}
#qtag{background:#1d4ed8;color:#fff;border-radius:12px;padding:0 .7em;font-weight:800;font-size:clamp(14px,1.5vw,22px);white-space:nowrap}
#qtext{flex:1;font-weight:800;font-size:clamp(20px,2.6vw,40px);line-height:1.1}
#qread{font-size:clamp(16px,1.7vw,24px);padding:.25em .7em;border-radius:14px;flex:none}
#qans{display:grid;grid-template-columns:repeat(3,1fr);gap:1.2vw}
.ans{border:0;border-radius:20px;padding:.8vh .6vw;font-weight:800;font-size:clamp(20px,2.7vw,42px);color:#fff;display:flex;align-items:center;justify-content:center;gap:.5em;line-height:1.1;min-height:clamp(52px,8vh,96px)}
.ans .k{flex:none;width:1.4em;height:1.4em;border-radius:50%;background:rgba(255,255,255,.3);font-size:.62em;display:flex;align-items:center;justify-content:center}
.ans.l0{background:linear-gradient(#ff5b5b,#d61f1f);box-shadow:0 6px 0 #8f1010}
.ans.l1{background:linear-gradient(#ffcf33,#e8a200);box-shadow:0 6px 0 #9c6b00;color:#3b2500}
.ans.l2{background:linear-gradient(#3fd27a,#139a4b);box-shadow:0 6px 0 #0b6431}
.ans.cho{outline:6px solid #1e1b4b;outline-offset:3px;transform:scale(1.04)}
.ans.dung{outline:7px solid #22c55e;outline-offset:3px}
.ans.sai{opacity:.45}
#qhint{font-size:clamp(14px,1.5vw,22px);text-align:center;color:#475569;font-weight:700}
#qexp{font-size:clamp(18px,2.2vw,32px);font-weight:800;text-align:center}
#qexp.ok{color:#15803d}#qexp.no{color:#b91c1c}

/* Thông báo giữa màn & hiệu ứng tốc độ */
#big{position:fixed;left:50%;top:38%;transform:translate(-50%,-50%);z-index:25;font-weight:800;font-size:clamp(40px,8vw,140px);color:#ffe14d;text-shadow:0 6px 0 #c2410c,0 12px 24px rgba(0,0,0,.5);pointer-events:none;text-align:center;line-height:1;white-space:nowrap}
#big.pop{animation:pop .7s ease-out}
#big.turbo{color:#38bdf8;text-shadow:0 0 25px #fff,0 6px 0 #0369a1,0 12px 30px rgba(0,0,0,.7)}
#big.super{color:#e879f9;text-shadow:0 0 30px #fff,0 6px 0 #7e22ce,0 12px 30px rgba(0,0,0,.7)}
@keyframes pop{0%{transform:translate(-50%,-50%) scale(.2);opacity:0}60%{transform:translate(-50%,-50%) scale(1.22);opacity:1}100%{transform:translate(-50%,-50%) scale(1)}}
#toast{position:fixed;left:50%;top:19vh;transform:translateX(-50%);z-index:26;background:rgba(15,23,42,.85);border:3px solid #ffe14d;border-radius:18px;padding:.3em 1em;font-weight:800;font-size:clamp(18px,2.2vw,32px);pointer-events:none;text-align:center;max-width:90vw}
#overtake{position:fixed;left:50%;top:27vh;transform:translateX(-50%);z-index:26;background:linear-gradient(90deg,#f97316,#eab308);color:#fff;border:3px solid #fff;border-radius:16px;padding:.2em .9em;font-weight:800;font-size:clamp(16px,2vw,28px);pointer-events:none;box-shadow:0 6px 18px rgba(0,0,0,.4)}
#flash{position:fixed;inset:0;z-index:9;pointer-events:none;opacity:0;transition:opacity .25s}
#lines{position:fixed;inset:0;z-index:8;pointer-events:none;opacity:0;transition:opacity .25s;background:repeating-conic-gradient(from 0deg at 50% 45%,rgba(255,255,255,0) 0 3.5deg,rgba(255,255,255,.32) 3.5deg 4.6deg,rgba(56,189,248,.38) 4.6deg 5deg);-webkit-mask:radial-gradient(circle at 50% 45%,transparent 22%,#000 56%);mask:radial-gradient(circle at 50% 45%,transparent 22%,#000 56%);animation:spinLines .18s linear infinite}
#vignette{position:fixed;inset:0;z-index:8;pointer-events:none;opacity:0;transition:opacity .25s;box-shadow:inset 0 0 90px 28px rgba(56,189,248,.85),inset 0 0 180px 60px rgba(37,99,235,.55)}
#vignette.super{box-shadow:inset 0 0 100px 34px rgba(217,70,239,.9),inset 0 0 200px 70px rgba(126,34,206,.65)}
@keyframes spinLines{from{transform:scale(1)}50%{transform:scale(1.06)}to{transform:scale(1)}}

/* Nút cảm ứng */
#pad{position:fixed;inset:auto 0 2vh 0;z-index:12;display:flex;justify-content:space-between;padding:0 2.5vw;pointer-events:none}
.padSide{display:flex;gap:1.4vw;align-items:center}
#pad button{pointer-events:auto;width:clamp(64px,8.5vw,112px);height:clamp(64px,8.5vw,112px);border-radius:50%;border:5px solid #fff;background:rgba(15,23,42,.55);color:#fff;font-size:clamp(26px,3.6vw,50px);font-weight:800}
#pad button:active,#pad button.on{background:rgba(255,225,77,.8);color:#1e1b4b}
#pad .sp{width:clamp(88px,10vw,145px);border-radius:36px}
#pad .ga{background:rgba(22,163,74,.7);font-size:clamp(20px,2.6vw,36px)}

/* Chế độ 2 chị em chia đôi màn hình */
#splitUI{position:fixed;inset:0;z-index:15;display:grid;grid-template-columns:1fr 1fr;pointer-events:none}
#splitDivider{position:fixed;left:50%;top:0;bottom:0;width:4px;margin-left:-2px;background:linear-gradient(#ffe14d,#fff,#ffe14d);z-index:16;pointer-events:none;box-shadow:0 0 12px rgba(0,0,0,.7)}
.phalf{position:relative;width:100%;height:100%;overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;padding:1vh 1vw}
.phalf .phud{display:flex;justify-content:space-between;align-items:flex-start;gap:.6vw}
.phalf .pbox{background:rgba(10,18,45,.78);border:3px solid rgba(255,255,255,.65);border-radius:16px;padding:.3vh .8vw;display:flex;align-items:center;gap:.6vw;font-weight:800;font-size:clamp(14px,1.6vw,24px)}
.phalf .pbox img{width:clamp(34px,3.6vw,52px);height:clamp(34px,3.6vw,52px);border-radius:50%;object-fit:cover;border:3px solid #fff}
.phalf .prank{font-size:clamp(26px,3.6vw,54px);color:#ffe14d;text-shadow:0 3px 0 #b45309;line-height:1}
.phalf .prank sup{font-size:.42em;color:#fff}
.phalf .pkeys{font-size:clamp(11px,1.1vw,16px);background:rgba(15,23,42,.75);border-radius:10px;padding:.15em .6em;align-self:center;border:1px solid rgba(255,255,255,.35)}
.phalf .pspeed{position:absolute;right:1vw;top:calc(1.6vh + clamp(52px,5.6vw,84px));background:rgba(15,23,42,.82);border:3px solid #fff;border-radius:16px;padding:.2vh .8vw;font-weight:800;font-size:clamp(14px,1.6vw,24px);display:flex;align-items:center;gap:.6vw}
.phalf .pspeed.hot{border-color:#ff3b30;color:#ff453a;box-shadow:0 0 20px #ff3b30}
.phalf .pnitro{width:clamp(46px,5vw,76px);height:8px;border-radius:5px;background:#334155;overflow:hidden;display:inline-block}
.phalf .pnitro i{display:block;height:100%;width:0;background:linear-gradient(90deg,#22d3ee,#a78bfa)}
.phalf .pbig{position:absolute;left:50%;top:36%;transform:translate(-50%,-50%);font-weight:800;font-size:clamp(28px,4.8vw,84px);color:#38bdf8;text-shadow:0 0 18px #fff,0 5px 0 #0369a1;white-space:nowrap;pointer-events:none}
.phalf .pover{position:absolute;left:50%;top:22%;transform:translateX(-50%);background:linear-gradient(90deg,#f97316,#eab308);color:#fff;border:2px solid #fff;border-radius:14px;padding:.15em .7em;font-weight:800;font-size:clamp(13px,1.5vw,22px);white-space:nowrap}
.phalf .pstreak{position:absolute;right:1vw;bottom:1.4vh;font-weight:800;font-size:clamp(13px,1.4vw,20px);color:#ffe14d;text-shadow:0 2px 0 #000}
.phalf .plines{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .2s;background:repeating-conic-gradient(from 0deg at 50% 45%,rgba(255,255,255,0) 0 4deg,rgba(255,255,255,.3) 4deg 5deg);-webkit-mask:radial-gradient(circle at 50% 45%,transparent 24%,#000 58%);mask:radial-gradient(circle at 50% 45%,transparent 24%,#000 58%);box-shadow:inset 0 0 60px 18px rgba(56,189,248,.85)}
.phalf .pqbox{pointer-events:auto;width:96%;align-self:center;background:rgba(255,255,255,.96);color:#1e1b4b;border-radius:22px;border:5px solid #ffe14d;box-shadow:0 10px 28px rgba(0,0,0,.45);padding:.7vh .9vw .9vh;display:flex;flex-direction:column;gap:.5vh;margin-bottom:.4vh}
.phalf .pqtop{display:flex;align-items:center;gap:.6vw}
.phalf .pqtag{background:#1d4ed8;color:#fff;border-radius:10px;padding:0 .55em;font-weight:800;font-size:clamp(12px,1.2vw,18px);white-space:nowrap}
.phalf .pqtext{flex:1;font-weight:800;font-size:clamp(16px,2vw,30px);line-height:1.12}
.phalf.lucieHalf .pqtext{font-size:clamp(18px,2.2vw,34px)}
.phalf .pqans{display:grid;grid-template-columns:repeat(3,1fr);gap:.7vw}
.phalf .ans{font-size:clamp(16px,2vw,30px);min-height:clamp(42px,6.5vh,76px);padding:.5vh .4vw;border-radius:16px}
.phalf .pqexp{font-size:clamp(13px,1.5vw,22px);font-weight:800;text-align:center}
.phalf .pqexp.ok{color:#15803d}.phalf .pqexp.no{color:#b91c1c}
.phalf .ppad{pointer-events:none;display:flex;justify-content:space-between;padding:0 .5vw .5vh}
.phalf .ppad button{pointer-events:auto;width:clamp(46px,6vw,76px);height:clamp(46px,6vw,76px);border-radius:50%;border:3px solid #fff;background:rgba(15,23,42,.55);color:#fff;font-size:clamp(18px,2.2vw,30px);font-weight:800}

/* Tạm dừng & kết thúc */
.overlay{position:fixed;inset:0;z-index:40;background:rgba(8,12,35,.78);display:flex;align-items:center;justify-content:center;padding:3vh 3vw}
.card{background:linear-gradient(#fff,#eef4ff);color:#1e1b4b;border-radius:30px;border:6px solid #ffe14d;padding:2.5vh 2.5vw;display:flex;flex-direction:column;align-items:center;gap:1.4vh;max-width:min(96vw,1200px);text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.card h2{font-size:clamp(28px,4.2vw,62px);line-height:1;color:#c2410c}
.card p{font-size:clamp(16px,1.9vw,26px);font-weight:700}
.row{display:flex;gap:1.4vw;flex-wrap:wrap;justify-content:center}
#podium{display:flex;align-items:flex-end;justify-content:center;gap:1.2vw;margin-top:.6vh}
.pod{display:flex;flex-direction:column;align-items:center;gap:.4vh;font-weight:800;font-size:clamp(13px,1.5vw,21px)}
.pod img{width:clamp(52px,6.5vw,98px);height:clamp(52px,6.5vw,98px);border-radius:50%;object-fit:cover;border:5px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.3);background:#fff}
.pod .blk{width:clamp(68px,9vw,140px);border-radius:14px 14px 0 0;display:flex;align-items:flex-start;justify-content:center;color:#fff;font-size:clamp(26px,3.6vw,54px);padding-top:.4vh;text-shadow:0 3px 0 rgba(0,0,0,.3)}
.pod.p1 .blk{height:clamp(105px,16vh,180px);background:linear-gradient(#ffd84d,#e0a100)}
.pod.p2 .blk{height:clamp(78px,11.5vh,135px);background:linear-gradient(#d9e2ec,#94a3b8)}
.pod.p3 .blk{height:clamp(58px,8.5vh,100px);background:linear-gradient(#f0b27a,#b45f2a)}
.pod.p4 .blk{height:clamp(42px,6vh,70px);background:linear-gradient(#a5b4fc,#6366f1)}
.pod.p5 .blk{height:clamp(32px,4.5vh,54px);background:linear-gradient(#cbd5e1,#64748b)}
.pod.me img{border-color:#f97316;box-shadow:0 0 0 5px #ffe14d}
.stats{display:flex;gap:1.2vw;flex-wrap:wrap;justify-content:center}
.stat{background:#e0e7ff;border-radius:16px;padding:.5vh 1.1vw;font-weight:800;font-size:clamp(15px,1.8vw,26px)}
.stat b{color:#c2410c}
#confetti{position:fixed;inset:0;z-index:45;pointer-events:none}

@media (max-aspect-ratio:4/5),(max-width:700px){
  #splitUI{grid-template-columns:1fr;grid-template-rows:1fr 1fr}
  #splitDivider{left:0;right:0;top:50%;bottom:auto;width:100%;height:4px;margin:0}
  #track{top:auto;bottom:calc(2vh + 100px);width:80vw}
  body.splitMode #track{top:50%;bottom:auto;transform:translate(-50%,-50%);width:86vw}
  #hud{padding:6px}
  .hbox{padding:2px 8px}
  #qans{grid-template-columns:1fr;gap:8px}
  .ans{min-height:52px}
  #speedo{display:none}
  #pad{bottom:calc(2vh)}
}
</style>
<script src="../anh-chung/giong-noi.js"></script>
</head>
<body>
<canvas id="cv"></canvas>
<canvas id="cv2" class="hide"></canvas>
<div id="lines"></div>
<div id="vignette"></div>
<div id="flash"></div>

<div id="start">
  <h1>Đua Xe Tia Chớp<small>cùng Lucie &amp; Lucas</small></h1>
  <div class="sub">Lái xe đua qua 4 chặng: thành phố, đồng lúa, bờ biển, núi tuyết. Gặp <b>Cổng Thử Thách</b> bấm chọn đáp án đúng để bật <b>TURBO SIÊU TỐC</b> vượt lên về nhất!</div>
  <div class="chars">
    <button class="char lucas" data-c="lucas"><img data-face="lucas" alt="Lucas"><span data-hs="lucas.goi">Lucas</span><small>Lớp <span data-hs="lucas.lop">1</span> · Toán, Tiếng Việt, Tiếng Anh</small><span class="best" id="best_lucas"></span></button>
    <button class="char lucie" data-c="lucie"><img data-face="lucie" alt="Lucie"><span data-hs="lucie.goi">Lucie</span><small>Lớp <span data-hs="lucie.lop">3</span> · Toán, Tiếng Việt, Tiếng Anh</small><span class="best" id="best_lucie"></span></button>
    <button class="char both" data-c="both" id="btnBoth"><div class="pairImg"><img data-face="lucie" alt="Lucie"><img data-face="lucas" alt="Lucas"></div><span>Hai chị em cùng đua</span><small>Chia đôi màn hình · Chị lớp 3 &amp; Em lớp 1 cùng thi tài!</small><span class="best">2 người trên 1 TV</span></button>
  </div>
  <div class="mau" id="mau">Màu xe:</div>
  <div class="keys">⬅️ ➡️ đổi làn · ⬆️ giữ ga tăng tốc · phím 1 2 3 chốt ngay đáp án · Cách / OK: dùng nitro · P: tạm dừng</div>
</div>
<button class="btn xanh" id="homeBtn" onclick="location.href='../../'">🏠 Trang chủ</button>

<div id="hud" class="hide">
  <div class="hbox"><img id="hudFace" alt=""><span id="hudName"></span><span>⭐ <span id="score">0</span></span><span class="tim" id="tim" title="Lượt được sai"></span></div>
  <div class="hbox" id="rankBox"><div id="rank">1<sup>/4</sup></div><div id="chang"></div></div>
</div>
<div id="track" class="hide"><div class="line"></div></div>
<div id="streak" class="hide"></div>
<div id="speedo" class="hide"><b id="kmh">0</b><span>km/giờ</span><div id="nitroBar"><i></i></div></div>
<div id="big" class="hide"></div>
<div id="toast" class="hide"></div>
<div id="overtake" class="hide"></div>

<div id="qbox" class="hide">
  <div id="qtop"><span id="qtag"></span><div id="qtext"></div><button class="btn xanh" id="qread">🔊 Đọc</button></div>
  <div id="qans"></div>
  <div id="qhint">⬅️ ➡️ chọn đáp án rồi bấm <b>OK</b> (hoặc phím số 1, 2, 3, chạm vào đáp án) là phóng TURBO ngay!</div>
  <div id="qexp" class="hide"></div>
</div>

<div id="pad" class="hide">
  <div class="padSide"><button id="padL">◀</button><button id="padR">▶</button></div>
  <div class="padSide"><button id="padG" class="sp ga">⬆️ GA</button><button id="padN" class="sp">🔥</button></div>
</div>

<!-- Giao diện chế độ 2 chị em -->
<div id="splitDivider" class="hide"></div>
<div id="splitUI" class="hide">
  <div class="phalf lucieHalf" id="half0">
    <div class="plines" id="plines0"></div>
    <div class="phud">
      <div class="pbox"><img id="pface0" alt=""><span id="pname0">Lucie</span><span>⭐ <span id="pscore0">0</span></span><span class="tim" id="tim0"></span></div>
      <div class="pbox"><div class="prank" id="prank0">1<sup>/5</sup></div></div>
    </div>
    <div class="pkeys">Chị Lucie: A/D làn · 1/2/3 đáp án · W ga · Q nitro</div>
    <div class="pbig hide" id="pbig0"></div>
    <div class="pover hide" id="pover0"></div>
    <div style="flex:1"></div>
    <div class="pqbox hide" id="pqbox0">
      <div class="pqtop"><span class="pqtag" id="pqtag0"></span><div class="pqtext" id="pqtext0"></div></div>
      <div class="pqans" id="pqans0"></div>
      <div class="pqexp hide" id="pqexp0"></div>
    </div>
    <div class="ppad hide" id="ppad0"><button data-p="0" data-a="L">◀</button><button data-p="0" data-a="G">GA</button><button data-p="0" data-a="N">🔥</button><button data-p="0" data-a="R">▶</button></div>
    <div class="pspeed" id="pspeed0"><b id="pkmh0">0</b><small>km/h</small><span class="pnitro"><i id="pnitro0"></i></span></div>
    <div class="pstreak" id="pstreak0"></div>
  </div>
  <div class="phalf lucasHalf" id="half1">
    <div class="plines" id="plines1"></div>
    <div class="phud">
      <div class="pbox"><img id="pface1" alt=""><span id="pname1">Lucas</span><span>⭐ <span id="pscore1">0</span></span><span class="tim" id="tim1"></span></div>
      <div class="pbox"><div class="prank" id="prank1">1<sup>/5</sup></div></div>
    </div>
    <div class="pkeys">Em Lucas: ⬅️/➡️ làn · 7/8/9 (J/K/L) đáp án · ⬆️ ga · 0/Enter nitro</div>
    <div class="pbig hide" id="pbig1"></div>
    <div class="pover hide" id="pover1"></div>
    <div style="flex:1"></div>
    <div class="pqbox hide" id="pqbox1">
      <div class="pqtop"><span class="pqtag" id="pqtag1"></span><div class="pqtext" id="pqtext1"></div></div>
      <div class="pqans" id="pqans1"></div>
      <div class="pqexp hide" id="pqexp1"></div>
    </div>
    <div class="ppad hide" id="ppad1"><button data-p="1" data-a="L">◀</button><button data-p="1" data-a="G">GA</button><button data-p="1" data-a="N">🔥</button><button data-p="1" data-a="R">▶</button></div>
    <div class="pspeed" id="pspeed1"><b id="pkmh1">0</b><small>km/h</small><span class="pnitro"><i id="pnitro1"></i></span></div>
    <div class="pstreak" id="pstreak1"></div>
  </div>
</div>

<div id="pause" class="overlay hide"><div class="card">
  <h2>Tạm dừng</h2>
  <div class="row"><button class="btn xanh" id="pResume">▶ Chơi tiếp</button><button class="btn" id="pRestart">↻ Đua lại</button><button class="btn xanh" id="pHome">🏠 Chọn người chơi</button></div>
</div></div>

<div id="end" class="overlay hide"><div class="card">
  <h2 id="endTitle">Về đích!</h2>
  <div id="podium"></div>
  <p id="endMsg"></p>
  <div class="stats" id="endStats"></div>
  <div class="row"><button class="btn" id="eAgain">🏁 Đua tiếp</button><button class="btn xanh" id="eHome">👥 Đổi người chơi</button><button class="btn xanh" onclick="location.href='../../'">🏠 Trang chủ</button></div>
</div></div>
<canvas id="confetti" class="hide"></canvas>

<script src="../anh-chung/thong-tin.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="../anh-chung/che-do-tv.js"></script>
<script src="../anh-chung/mat-that.js"></script>
<script>
"use strict";
/* ================= NỘI DUNG (Gemini 4 Argon soạn, Claude soát) ================= */
/*KB*/
const KB = {
 "chao": "Chào mừng con đến với Đua Xe Tia Chớp Lucie và Lucas! Lái vào cổng có đáp án đúng để bật turbo vượt lên nhé!",
 "chang": [
  [
   "Phố Thị Nhộn Nhịp",
   "#ff8a3d",
   "Đồng xu vàng"
  ],
  [
   "Đồng Lúa Thẳng Cánh",
   "#e0b400",
   "Bình nitro"
  ],
  [
   "Bờ Biển Nắng Vàng",
   "#2bb3e8",
   "Bình nitro"
  ],
  [
   "Đỉnh Tuyết Trắng Xóa",
   "#cfe8ff",
   "Bình nitro"
  ]
 ],
 "khen": [
  "Tuyệt vời! Bơm kịch kim turbo vọt lên nào con ơi!",
  "Quá chuẩn! Tay đua nhí của chúng ta thông minh quá!",
  "Xuất sắc! Xe phóng nhanh như tia chớp vượt qua các bạn thú!",
  "Đúng rồi! Cứ giữ vững tốc độ đỉnh cao này nhé con!",
  "Giỏi lắm! Một pha bứt tốc ngoạn mục qua Cổng Thử Thách!"
 ],
 "dongvien": [
  "Tiếc quá, nhầm chút xíu thôi, con nghe giải thích rồi tăng tốc nhé!",
  "Không sao đâu, bình tĩnh nhấn ga đuổi theo Thỏ Trắng nào!",
  "Chậm lại một nhịp để nhớ bài, cổng sau mình lấy lại phong độ!",
  "Cố lên con ơi, Cáo Cam và Gấu Nâu vẫn ở ngay phía trước!",
  "Sai một câu vẫn còn cơ hội, tập trung nhìn kỹ cổng tiếp theo nhé!"
 ],
 "chuc": "Chúc mừng tay đua xuất sắc đã cán đích và giành chiếc cúp vinh quang!"
};
/*END_KB*/
/*DATA*/
const DATA = {
 lucie: [
  ["Toán", 1, "Kết quả của phép nhân 7 x 8 là bao nhiêu?", "56", "54", "48", "64", "Bảng nhân 7: 7 nhân 8 bằng 56."],
  ["Toán", 1, "Số liền sau của số 999 là số nào?", "1000", "998", "990", "1001", "Thêm 1 vào 999 ta được 1000."],
  ["Toán", 1, "Một giờ có bao nhiêu phút?", "60 phút", "30 phút", "100 phút", "24 phút", "Một giờ đồng hồ có đúng 60 phút."],
  ["Toán", 1, "Kết quả của phép chia 45 : 5 là mấy?", "9", "8", "7", "6", "Bảng chia 5: 45 chia 5 bằng 9."],
  ["Toán", 1, "1 mét bằng bao nhiêu xăng-ti-mét?", "100 cm", "10 cm", "1000 cm", "50 cm", "1 mét đổi ra được 100 xăng-ti-mét."],
  ["Toán", 2, "Chu vi hình vuông có cạnh 6 cm là bao nhiêu?", "24 cm", "36 cm", "12 cm", "18 cm", "Chu vi hình vuông bằng cạnh nhân 4."],
  ["Toán", 2, "Một phần ba của 27 quả cam là mấy quả?", "9 quả", "6 quả", "8 quả", "3 quả", "Lấy 27 chia 3 được 9 quả cam."],
  ["Toán", 2, "Chữ số La Mã VIII là số mấy?", "8", "7", "9", "6", "V là 5, thêm III là 3, bằng 8."],
  ["Toán", 2, "Tìm x biết x + 120 = 350.", "230", "470", "220", "130", "Lấy 350 trừ 120 bằng 230."],
  ["Toán", 2, "54 chia 6 rồi cộng với 11 bằng bao nhiêu?", "20", "19", "18", "21", "54 chia 6 bằng 9, cộng 11 bằng 20."],
  ["Toán", 3, "Diện tích hình chữ nhật dài 8 cm, rộng 5 cm là bao nhiêu?", "40 cm²", "26 cm²", "13 cm²", "45 cm²", "Diện tích bằng dài nhân rộng: 8 nhân 5."],
  ["Toán", 3, "Chia 38 cho 5 thì số dư là bao nhiêu?", "3", "2", "4", "1", "38 chia 5 được 7, dư 3."],
  ["Toán", 3, "4 túi có 32 viên bi. 1 túi có mấy viên?", "8 viên", "7 viên", "9 viên", "6 viên", "Lấy 32 chia đều cho 4 túi được 8."],
  ["Toán", 3, "Làm tròn số 264 đến hàng chục ta được số nào?", "260", "270", "300", "200", "Hàng đơn vị là 4 nên làm tròn xuống 260."],
  ["Toán", 3, "Giá trị của biểu thức 100 - 20 x 3 là mấy?", "40", "240", "60", "80", "Nhân trước trừ sau: 100 trừ 60 bằng 40."],
  ["Tiếng Việt", 1, "Từ nào chỉ hoạt động trong câu: Bé quét nhà giúp mẹ?", "quét nhà", "bé", "mẹ", "nhà", "Quét nhà là việc làm, hoạt động của bé."],
  ["Tiếng Việt", 1, "Từ nào viết đúng chính tả?", "dòng sông", "ròng sông", "giòng sông", "dòng xông", "Dòng sông viết đúng với âm đầu d và s."],
  ["Tiếng Việt", 1, "Từ nào trái nghĩa với từ chăm chỉ?", "lười biếng", "siêng năng", "cần cù", "chịu khó", "Trái nghĩa với chăm chỉ là lười biếng."],
  ["Tiếng Việt", 1, "Cuối câu hỏi ta phải dùng dấu câu nào?", "dấu chấm hỏi", "dấu chấm", "dấu phẩy", "dấu chấm than", "Câu hỏi luôn kết thúc bằng dấu chấm hỏi."],
  ["Tiếng Việt", 1, "Từ nào dưới đây là từ chỉ đặc điểm?", "xinh đẹp", "bàn học", "chạy nhảy", "cô giáo", "Xinh đẹp là từ miêu tả đặc điểm."],
  ["Tiếng Việt", 2, "Từ nào cùng nghĩa với từ Tổ quốc?", "đất nước", "nhà cửa", "trường học", "bầu trời", "Tổ quốc và đất nước có cùng ý nghĩa."],
  ["Tiếng Việt", 2, "Trong câu \"Chú mèo mượt như nhung\", từ nào dùng để so sánh?", "như", "chú mèo", "mượt", "nhung", "Từ như dùng để nối hai vế so sánh."],
  ["Tiếng Việt", 2, "\"Ôi, bông hoa đẹp quá!\" thuộc kiểu câu gì?", "câu cảm", "câu hỏi", "câu kể", "câu khiến", "Câu bộc lộ cảm xúc là câu cảm."],
  ["Tiếng Việt", 2, "Điền vào chỗ trống: \"... nắng hay ... mưa?\"", "trời", "chời", "trờ", "chờ", "Trời nắng, trời mưa viết với âm tr."],
  ["Tiếng Việt", 2, "Từ nào chỉ người làm việc ở bệnh viện để khám bệnh?", "bác sĩ", "giáo viên", "kĩ sư", "nông dân", "Bác sĩ là người khám và chữa bệnh."],
  ["Tiếng Việt", 3, "Thành ngữ nào nói về tinh thần giúp đỡ nhau?", "Lá lành đùm lá rách", "Chậm như sên", "Nhanh như chớp", "Khỏe như voi", "Lá lành đùm lá rách khuyên ta đùm bọc nhau."],
  ["Tiếng Việt", 3, "Trong câu \"Đàn chim hót líu lo\", bộ phận nào trả lời câu hỏi Làm gì?", "hót líu lo", "đàn chim", "líu lo", "chim hót", "Hót líu lo nêu hoạt động của đàn chim."],
  ["Tiếng Việt", 3, "Từ nào viết SAI chính tả?", "suất sắc", "xinh xắn", "sạch sẽ", "sẵn sàng", "Phải viết là xuất sắc mới đúng chính tả."],
  ["Tiếng Việt", 3, "Dấu câu nào dùng để ngăn cách các từ cùng loại trong câu?", "dấu phẩy", "dấu chấm", "dấu hỏi", "dấu hai chấm", "Dấu phẩy ngăn cách các từ cùng loại."],
  ["Tiếng Việt", 3, "Từ chạy trong câu \"Đồng hồ chạy rất đúng giờ\" chỉ điều gì?", "hoạt động của máy", "di chuyển bằng chân", "chạy trốn", "tập thể dục", "Chỉ sự hoạt động của máy móc trong đồng hồ."],
  ["Tiếng Anh", 1, "Từ nào có nghĩa là \"tên\"?", "name", "age", "hello", "goodbye", "Name trong tiếng Anh có nghĩa là tên."],
  ["Tiếng Anh", 1, "How old are you? - I am eight ... old.", "years", "year", "old", "fine", "Cấu trúc nói tuổi: số tuổi + years old."],
  ["Tiếng Anh", 1, "Từ cục tẩy trong tiếng Anh là gì?", "eraser", "ruler", "pencil", "book", "Eraser nghĩa là cục tẩy."],
  ["Tiếng Anh", 1, "What colour is it? - It is ... (màu xanh lá cây)", "green", "red", "blue", "yellow", "Green là màu xanh lá cây."],
  ["Tiếng Anh", 1, "Từ nào có nghĩa là mẹ?", "mother", "father", "brother", "sister", "Mother là mẹ, father là bố."],
  ["Tiếng Anh", 2, "Is this your school? - Yes, ... is.", "it", "he", "she", "they", "Câu hỏi dùng this thì trả lời dùng it."],
  ["Tiếng Anh", 2, "May I ... in? - Yes, you can.", "come", "go", "sit", "stand", "May I come in nghĩa là xin phép vào lớp."],
  ["Tiếng Anh", 2, "Phòng ngủ trong tiếng Anh gọi là gì?", "bedroom", "bathroom", "kitchen", "living room", "Bedroom là phòng ngủ."],
  ["Tiếng Anh", 2, "How many ... do you have? - I have two dogs.", "dogs", "dog", "a dog", "the dog", "Sau How many phải dùng danh từ số nhiều."],
  ["Tiếng Anh", 2, "What is she doing? - She is ... a book.", "reading", "read", "reads", "listening", "Sau is dùng động từ thêm ing: reading."],
  ["Tiếng Anh", 3, "Where are the posters? - ... are on the wall.", "They", "It", "He", "She", "Posters là số nhiều nên dùng They."],
  ["Tiếng Anh", 3, "Do you have any parrots? - No, I ...", "don't", "do", "isn't", "am not", "Câu hỏi Do you thì trả lời No, I don't."],
  ["Tiếng Anh", 3, "What is your father's job? - He is a ... (tài xế)", "driver", "teacher", "doctor", "worker", "Driver có nghĩa là tài xế."],
  ["Tiếng Anh", 3, "Would you like some milk? - ..., please.", "Yes", "No", "Thanks", "Not", "Đồng ý lời mời lịch sự: Yes, please."],
  ["Tiếng Anh", 3, "Sắp xếp thành từ đúng: C - H - I - C - K - E - N", "chicken", "chekcin", "chiken", "chikcen", "Chicken nghĩa là con gà."],
["Toán", 1, "Kết quả của phép tính 7 x 6 là bao nhiêu?", "42", "36", "48", "49", "Theo bảng nhân 7: 7 x 6 = 42."],
["Toán", 1, "Kết quả của phép tính 8 x 7 là bao nhiêu?", "56", "54", "64", "48", "Theo bảng nhân 8: 8 x 7 = 56."],
["Toán", 1, "Kết quả của phép tính 9 x 8 là bao nhiêu?", "72", "63", "81", "64", "Theo bảng nhân 9: 9 x 8 = 72."],
["Toán", 1, "Kết quả của phép tính 63 : 7 là bao nhiêu?", "9", "8", "7", "6", "Vì 7 x 9 = 63 nên 63 : 7 = 9."],
["Toán", 1, "Kết quả của phép tính 72 : 8 là bao nhiêu?", "9", "8", "7", "6", "Vì 8 x 9 = 72 nên 72 : 8 = 9."],
["Toán", 1, "Kết quả của phép tính 81 : 9 là bao nhiêu?", "9", "8", "7", "10", "Vì 9 x 9 = 81 nên 81 : 9 = 9."],
["Toán", 2, "Gấp 12 lên 4 lần ta được số nào?", "48", "16", "36", "52", "Muốn gấp một số lên nhiều lần, ta lấy số đó nhân với số lần: 12 x 4 = 48."],
["Toán", 2, "Giảm 54 đi 6 lần ta được số nào?", "9", "48", "8", "7", "Muốn giảm một số đi nhiều lần, ta chia số đó cho số lần: 54 : 6 = 9."],
["Toán", 2, "Giá trị của biểu thức 25 + 15 x 2 là bao nhiêu?", "55", "80", "50", "45", "Tính nhân trước, cộng sau: 15 x 2 = 30; 25 + 30 = 55."],
["Toán", 2, "Giá trị của biểu thức (40 - 16) : 3 là bao nhiêu?", "8", "12", "6", "9", "Tính trong ngoặc trước: 40 - 16 = 24; 24 : 3 = 8."],
["Toán", 2, "1 m bằng bao nhiêu mi-li-mét (mm)?", "1000 mm", "100 mm", "10 mm", "10000 mm", "1 m = 10 dm = 100 cm = 1000 mm."],
["Toán", 2, "Chu vi hình vuông có cạnh dài 9 cm là bao nhiêu?", "36 cm", "18 cm", "81 cm", "27 cm", "Chu vi hình vuông bằng độ dài một cạnh nhân 4: 9 x 4 = 36 cm."],
["Toán", 2, "Chu vi hình chữ nhật có chiều dài 12 cm, chiều rộng 8 cm là bao nhiêu?", "40 cm", "20 cm", "96 cm", "32 cm", "Chu vi hình chữ nhật = (12 + 8) x 2 = 40 cm."],
["Toán", 3, "Số dư của phép chia 38 : 5 là bao nhiêu?", "3", "2", "4", "1", "38 : 5 = 7 dư 3 (vì 5 x 7 = 35, 38 - 35 = 3)."],
["Tiếng Việt", 1, "Trong câu “Trăng tròn như chiếc đĩa bạc”, hình ảnh so sánh là gì?", "Trăng với chiếc đĩa bạc", "Trăng với bầu trời", "Chiếc đĩa với ngôi sao", "Tròn với màu trắng", "Từ 'như' dùng để so sánh trăng tròn với chiếc đĩa bạc."],
["Tiếng Việt", 1, "Từ nào dưới đây là từ chỉ hoạt động?", "Chạy nhảy", "Xanh biếc", "Quyển vở", "Ngọt ngào", "Chạy nhảy là từ chỉ hoạt động."],
["Tiếng Việt", 2, "Cuối câu hỏi phải đặt dấu câu nào?", "Dấu chấm hỏi (?)", "Dấu chấm (.)", "Dấu phẩy (,)", "Dấu hai chấm (:)", "Câu hỏi kết thúc bằng dấu chấm hỏi (?)."],
["Tiếng Việt", 2, "Từ nào cùng nghĩa với từ “chăm chỉ”?", "Siêng năng", "Lười biếng", "Vội vàng", "Nhút nhát", "Siêng năng cùng nghĩa với chăm chỉ."],
["Tiếng Việt", 2, "Từ nào trái nghĩa với từ “dũng cảm”?", "Nhút nhát", "Gan dạ", "Kiên cường", "Tự tin", "Nhút nhát trái nghĩa với dũng cảm."],
["Tiếng Anh", 1, "Câu “Open your book, please!” nghĩa là gì?", "Hãy mở sách của bạn ra!", "Hãy gấp sách lại!", "Hãy đứng lên!", "Hãy ngồi xuống!", "Open your book = mở sách của bạn ra."],
["Tiếng Anh", 1, "Đồ dùng học tập “pencil case” là gì?", "Hộp bút", "Cục tẩy", "Thước kẻ", "Cặp sách", "Pencil case là hộp đựng bút."],
["Tiếng Anh", 1, "Từ tiếng Anh nào có nghĩa là “cục tẩy”?", "eraser", "ruler", "notebook", "school bag", "Eraser (hoặc rubber) là cục tẩy."],
["Tiếng Anh", 1, "Hỏi màu sắc của nhiều đồ vật, em dùng câu nào?", "What colour are they?", "What colour is it?", "How old are you?", "Who is that?", "Số nhiều dùng 'What colour are they?'."],
["Tiếng Anh", 2, "Hoạt động giờ ra chơi “play badminton” là chơi môn gì?", "Chơi cầu lông", "Chơi bóng đá", "Chơi cờ vua", "Nhảy dây", "Badminton là môn cầu lông."],
["Tiếng Anh", 2, "Trò chơi “skipping” trong giờ ra chơi là gì?", "Nhảy dây", "Chơi trốn tìm", "Đá cầu", "Chơi bóng rổ", "Skipping là nhảy dây."],
["Tiếng Anh", 2, "Trả lời cho câu hỏi “Do you have a ruler?” (Có), em nói thế nào?", "Yes, I do.", "Yes, I am.", "No, I do.", "Yes, it is.", "Câu hỏi bắt đầu bằng 'Do you...' trả lời 'Yes, I do.'."],
["Tiếng Anh", 2, "Từ “white” là màu gì?", "Màu trắng", "Màu đen", "Màu cam", "Màu nâu", "White là màu trắng."]
],
 lucas: [
  ["Toán", 1, "2 cộng 3 bằng mấy?", "5", "4", "6", "3", "2 thêm 3 bằng 5."],
  ["Toán", 1, "5 trừ 2 bằng mấy?", "3", "2", "4", "1", "5 bớt 2 còn 3."],
  ["Toán", 1, "Số nào lớn hơn: 7 hay 4?", "7", "4", "bằng nhau", "0", "Trên tia số, 7 đứng sau 4 nên lớn hơn."],
  ["Toán", 1, "1 bàn tay có mấy ngón tay?", "5 ngón", "4 ngón", "6 ngón", "10 ngón", "Mỗi bàn tay có đúng 5 ngón tay."],
  ["Toán", 1, "Số liền sau của số 5 là số mấy?", "6", "4", "7", "5", "Đếm thêm 1 sau số 5 là số 6."],
  ["Toán", 1, "4 cộng 4 bằng mấy?", "8", "7", "9", "6", "4 cộng 4 bằng 8."],
  ["Toán", 1, "9 trừ 0 bằng mấy?", "9", "0", "8", "10", "Số nào trừ đi 0 cũng bằng chính nó."],
  ["Toán", 1, "Con chó có mấy cái chân?", "4 chân", "2 chân", "3 chân", "6 chân", "Con chó có 4 cái chân."],
  ["Toán", 1, "Số nào bé nhất: 2, 8, 5?", "2", "8", "5", "0", "Trong ba số 2, 8, 5 thì 2 bé nhất."],
  ["Toán", 1, "3 cộng 6 bằng mấy?", "9", "8", "10", "7", "3 thêm 6 bằng 9."],
  ["Toán", 1, "10 trừ 5 bằng mấy?", "5", "4", "6", "3", "10 bớt 5 còn 5."],
  ["Toán", 1, "Hình vuông có mấy cạnh bằng nhau?", "4 cạnh", "3 cạnh", "5 cạnh", "2 cạnh", "Hình vuông có 4 cạnh dài bằng nhau."],
  ["Toán", 2, "10 cộng 5 bằng mấy?", "15", "14", "16", "50", "1 chục cộng 5 đơn vị là 15."],
  ["Toán", 2, "18 trừ 8 bằng mấy?", "10", "8", "11", "9", "18 bớt 8 đơn vị còn 10."],
  ["Toán", 2, "Số gồm 1 chục và 3 đơn vị là số mấy?", "13", "31", "10", "4", "1 chục và 3 đơn vị viết là 13."],
  ["Toán", 2, "2 cộng 3 cộng 4 bằng mấy?", "9", "8", "10", "7", "2 cộng 3 bằng 5, cộng 4 bằng 9."],
  ["Toán", 2, "10 trừ 3 trừ 2 bằng mấy?", "5", "6", "4", "7", "10 trừ 3 còn 7, trừ 2 còn 5."],
  ["Toán", 2, "Hình tam giác có mấy đỉnh?", "3 đỉnh", "4 đỉnh", "2 đỉnh", "5 đỉnh", "Hình tam giác có 3 cạnh và 3 đỉnh."],
  ["Toán", 2, "Kim dài chỉ 12, kim ngắn chỉ 3 là mấy giờ?", "3 giờ", "12 giờ", "6 giờ", "9 giờ", "Kim ngắn chỉ số 3 là 3 giờ đúng."],
  ["Toán", 2, "Số liền trước của số 10 là số mấy?", "9", "11", "8", "10", "Trước số 10 là số 9."],
  ["Toán", 2, "12 cộng 4 bằng mấy?", "16", "15", "17", "14", "2 cộng 4 bằng 6, thêm 1 chục là 16."],
  ["Toán", 2, "19 trừ 3 bằng mấy?", "16", "15", "17", "12", "9 trừ 3 bằng 6, giữ nguyên 1 chục là 16."],
  ["Toán", 2, "Bánh xe đạp có hình gì?", "hình tròn", "hình vuông", "tam giác", "chữ nhật", "Bánh xe có dạng hình tròn để lăn được."],
  ["Toán", 2, "Số nào ở giữa số 7 và số 9?", "8", "6", "10", "5", "Đếm 7 rồi đến 8 rồi đến 9."],
  ["Toán", 3, "Mấy cộng với 4 thì bằng 10?", "6", "5", "7", "4", "6 cộng 4 bằng 10."],
  ["Toán", 3, "Có 8 quả táo, ăn 3 quả, còn mấy quả?", "5 quả", "4 quả", "6 quả", "11 quả", "8 trừ 3 còn 5 quả táo."],
  ["Toán", 3, "Số lớn nhất có một chữ số là số mấy?", "9", "10", "8", "1", "Từ 0 đến 9 thì 9 là lớn nhất."],
  ["Toán", 3, "Số bé nhất có hai chữ số là số mấy?", "10", "11", "99", "0", "Số đầu tiên có hai chữ số là 10."],
  ["Toán", 3, "15 trừ 5 cộng 2 bằng mấy?", "12", "10", "13", "8", "15 trừ 5 bằng 10, cộng 2 bằng 12."],
  ["Toán", 3, "11 cộng 6 trừ 7 bằng mấy?", "10", "11", "9", "12", "11 cộng 6 bằng 17, trừ 7 còn 10."],
  ["Toán", 3, "Một tuần lễ có mấy ngày?", "7 ngày", "6 ngày", "5 ngày", "8 ngày", "Từ thứ hai đến chủ nhật có 7 ngày."],
  ["Toán", 3, "1 chục quả trứng là mấy quả trứng?", "10 quả", "1 quả", "12 quả", "20 quả", "1 chục chính là 10."],
  ["Toán", 3, "Lúc 6 giờ đúng, kim dài chỉ vào số mấy?", "số 12", "số 6", "số 3", "số 1", "Giờ đúng thì kim dài luôn chỉ số 12."],
  ["Toán", 3, "Hộp sữa tươi thường có dạng khối gì?", "khối hộp chữ nhật", "khối cầu", "hình tròn", "tam giác", "Hộp sữa có dạng khối hộp chữ nhật."],
  ["Toán", 3, "Số nào vừa lớn hơn 14 vừa bé hơn 16?", "15", "13", "17", "14", "Giữa 14 và 16 là số 15."],
  ["Tiếng Việt", 1, "Ghép âm b và âm a được tiếng gì?", "ba", "bơ", "bo", "bi", "Âm b ghép với a đọc là ba."],
  ["Tiếng Việt", 1, "Tiếng cá có dấu thanh gì?", "dấu sắc", "dấu huyền", "dấu hỏi", "dấu ngã", "Cờ a ca sắc cá."],
  ["Tiếng Việt", 1, "Con gì kêu meo meo?", "con mèo", "con chó", "con gà", "con vịt", "Con mèo thường kêu meo meo."],
  ["Tiếng Việt", 1, "Chữ cái đầu tiên trong bảng chữ cái là gì?", "a", "ă", "â", "b", "Bảng chữ cái bắt đầu bằng chữ a."],
  ["Tiếng Việt", 1, "Tiếng mẹ có âm đầu là chữ gì?", "m", "n", "b", "l", "Mờ e me nặng mẹ, âm đầu là m."],
  ["Tiếng Việt", 1, "Điền từ: Công cha như núi Thái ...", "Sơn", "Biển", "Cao", "Lớn", "Câu ca dao: Công cha như núi Thái Sơn."],
  ["Tiếng Việt", 1, "Con gì gáy ò ó o mỗi sáng?", "gà trống", "gà mái", "con vịt", "con chim", "Gà trống gáy ò ó o báo thức."],
  ["Tiếng Việt", 1, "Quả gì ăn có vị rất chua?", "quả chanh", "quả dưa", "quả chuối", "quả na", "Quả chanh có vị rất chua."],
  ["Tiếng Việt", 1, "Ghép c với ô và dấu huyền được tiếng gì?", "cồ", "cố", "cổ", "cô", "Cờ ô cô huyền cồ."],
  ["Tiếng Việt", 1, "Từ nào chỉ người sinh ra mình?", "bố mẹ", "bạn bè", "thầy cô", "hàng xóm", "Bố mẹ là người sinh ra và nuôi dưỡng con."],
  ["Tiếng Việt", 1, "Đi học bé đeo cặp sách ở đâu?", "trên vai", "trên đầu", "dưới chân", "ở bụng", "Cặp sách dùng để đeo trên hai vai."],
  ["Tiếng Việt", 1, "Tiếng nhà có vần gì?", "vần a", "vần o", "vần ê", "vần u", "Nhờ a nha huyền nhà, có vần a."],
  ["Tiếng Việt", 2, "Điền c hay k vào trước chữ iến?", "k", "c", "q", "g", "Trước i, e, ê phải viết bằng chữ k."],
  ["Tiếng Việt", 2, "Điền g hay gh vào trước chữ ế?", "gh", "g", "ng", "ngh", "Trước e, ê, i phải dùng chữ gh."],
  ["Tiếng Việt", 2, "Tiếng trường có vần gì?", "ương", "ươn", "uông", "uôn", "Trờ ương trương huyền trường."],
  ["Tiếng Việt", 2, "Từ nào viết đúng chính tả?", "con kiến", "con ciến", "kon kiến", "con quiến", "Chữ k đứng trước vần iên: con kiến."],
  ["Tiếng Việt", 2, "Từ nào chỉ đồ dùng học tập của bé?", "bút chì", "cái nồi", "cái chổi", "cái gối", "Bút chì dùng để viết và vẽ ở lớp."],
  ["Tiếng Việt", 2, "Mùa nào trời rất lạnh, phải mặc áo ấm?", "mùa đông", "mùa hè", "mùa xuân", "mùa thu", "Mùa đông gió rét, trời rất lạnh."],
  ["Tiếng Việt", 2, "Con gì có cái vòi dài?", "con voi", "con hổ", "con khỉ", "con thỏ", "Con voi có chiếc vòi dài."],
  ["Tiếng Việt", 2, "Đèn giao thông màu gì thì xe phải dừng lại?", "màu đỏ", "màu xanh", "màu vàng", "màu tím", "Đèn đỏ báo hiệu các xe dừng lại."],
  ["Tiếng Việt", 2, "Điền vào chỗ trống: Bé ... răng mỗi sáng.", "đánh", "rửa", "gội", "quét", "Buổi sáng thức dậy bé đánh răng sạch sẽ."],
  ["Tiếng Việt", 2, "Tiếng bông có vần gì?", "ông", "ong", "ung", "ưng", "Bờ ông bông, có vần ông."],
  ["Tiếng Việt", 2, "Viết ng hay ngh trước chữ ệ?", "ngh", "ng", "g", "gh", "Trước e, ê, i phải viết là ngh, như củ nghệ."],
  ["Tiếng Việt", 2, "Quả gì ruột đỏ, có nhiều hạt đen?", "dưa hấu", "quả cam", "quả nhãn", "quả vải", "Dưa hấu ruột đỏ, vỏ xanh, hạt đen."],
  ["Tiếng Việt", 3, "Từ nào viết đúng chính tả?", "nghe nhạc", "nge nhạc", "ghe nhạc", "nghe nhạt", "Trước chữ e phải viết là ngh: nghe nhạc."],
  ["Tiếng Việt", 3, "Điền vần: Chim én bay l...", "ượn", "ươn", "ương", "uôn", "Chim én bay lượn trên bầu trời."],
  ["Tiếng Việt", 3, "Tiếng nào có vần anh?", "bánh", "bắn", "bàn", "bông", "Bờ anh banh sắc bánh."],
  ["Tiếng Việt", 3, "Tiếng nào có vần êu?", "kêu", "keo", "kia", "cau", "Cờ êu kêu."],
  ["Tiếng Việt", 3, "Từ nào chỉ hoạt động của học sinh ở trường?", "đọc bài", "nấu cơm", "lái xe", "cày ruộng", "Ở trường học sinh đọc bài và viết bài."],
  ["Tiếng Việt", 3, "Điền từ: Học thầy không tày học ...", "bạn", "mẹ", "cha", "em", "Tục ngữ: Học thầy không tày học bạn."],
  ["Tiếng Việt", 3, "Từ nào viết SAI chính tả?", "cái cính", "cái kẹo", "cái kéo", "cái kim", "Phải viết là cái kính với chữ k."],
  ["Tiếng Việt", 3, "Tiếng hoàng có vần gì?", "oang", "ang", "oan", "ong", "Hờ oang hoang huyền hoàng."],
  ["Tiếng Việt", 3, "Con vật nào sống dưới nước?", "con tôm", "con gà", "con mèo", "con chim", "Con tôm bơi và sống ở dưới nước."],
  ["Tiếng Việt", 3, "Ngày Tết miền Bắc thường có hoa gì màu hồng?", "hoa đào", "hoa mai", "hoa sen", "hoa cúc", "Hoa đào nở màu hồng vào dịp Tết."],
  ["Tiếng Việt", 3, "Điền từ: Ăn quả nhớ kẻ trồng ...", "cây", "hoa", "lúa", "rau", "Tục ngữ: Ăn quả nhớ kẻ trồng cây."],
  ["Tiếng Anh", 1, "Màu đỏ tiếng Anh là gì?", "red", "blue", "green", "pink", "Red là màu đỏ."],
  ["Tiếng Anh", 1, "Con mèo tiếng Anh là gì?", "cat", "dog", "pig", "bird", "Cat nghĩa là con mèo."],
  ["Tiếng Anh", 1, "Số 1 tiếng Anh đọc là gì?", "one", "two", "three", "four", "One là số 1."],
  ["Tiếng Anh", 1, "Khi gặp bạn, con chào như thế nào?", "Hello", "Bye", "No", "Yes", "Hello dùng để chào khi gặp nhau."],
  ["Tiếng Anh", 2, "Con chó tiếng Anh là gì?", "dog", "cat", "duck", "cow", "Dog nghĩa là con chó."],
  ["Tiếng Anh", 2, "Số 2 tiếng Anh là gì?", "two", "one", "three", "five", "Two là số 2."],
  ["Tiếng Anh", 2, "Màu xanh da trời tiếng Anh là gì?", "blue", "red", "yellow", "black", "Blue là màu xanh da trời."],
  ["Tiếng Anh", 2, "Quả táo tiếng Anh là gì?", "apple", "banana", "orange", "mango", "Apple là quả táo."],
  ["Tiếng Anh", 3, "Số 5 tiếng Anh là gì?", "five", "four", "six", "ten", "Five là số 5."],
  ["Tiếng Anh", 3, "Màu vàng tiếng Anh là gì?", "yellow", "green", "white", "brown", "Yellow là màu vàng."],
["Toán", 1, "4 + 5 bằng mấy?", "9", "8", "10", "7", "4 thêm 5 bằng 9."],
["Toán", 1, "3 + 7 bằng mấy?", "10", "9", "8", "6", "3 cộng 7 bằng 10."],
["Toán", 1, "6 + 2 bằng mấy?", "8", "7", "9", "5", "6 thêm 2 bằng 8."],
["Toán", 1, "9 - 4 bằng mấy?", "5", "4", "6", "3", "9 bớt 4 còn 5."],
["Toán", 1, "10 - 3 bằng mấy?", "7", "6", "8", "5", "10 bớt 3 còn 7."],
["Toán", 1, "8 - 5 bằng mấy?", "3", "2", "4", "5", "8 bớt 5 còn 3."],
["Toán", 1, "7 + 0 bằng mấy?", "7", "0", "8", "6", "Số nào cộng với 0 cũng bằng chính số đó."],
["Toán", 1, "6 - 6 bằng mấy?", "0", "1", "6", "12", "Hai số giống nhau trừ cho nhau bằng 0."],
["Toán", 2, "Số nào lớn nhất trong các số: 4, 9, 2, 7?", "9", "7", "4", "2", "Trong 4 số đã cho, 9 là số lớn nhất."],
["Toán", 2, "Số nào bé nhất trong các số: 8, 3, 6, 5?", "3", "5", "6", "8", "Trong 4 số đã cho, 3 là số bé nhất."],
["Toán", 2, "Số liền sau của số 8 là số mấy?", "9", "7", "10", "6", "Đếm xuôi: 8 rồi đến 9."],
["Toán", 2, "Số liền trước của số 6 là số mấy?", "5", "7", "4", "8", "Đếm ngược: trước 6 là 5."],
["Toán", 2, "Hình tam giác có mấy cạnh?", "3 cạnh", "4 cạnh", "2 cạnh", "5 cạnh", "Hình tam giác có 3 cạnh và 3 góc."],
["Toán", 2, "Có 5 quả táo, thêm 4 quả nữa. Có tất cả mấy quả?", "9 quả", "8 quả", "10 quả", "7 quả", "5 + 4 = 9 quả táo."],
["Tiếng Việt", 1, "Điền c hay k vào chỗ trống: “...on cá”?", "c", "k", "g", "d", "Trước o dùng chữ c: con cá."],
["Tiếng Việt", 1, "Điền c hay k vào chỗ trống: “cái ...éo”?", "k", "c", "t", "n", "Trước e, ê, i dùng chữ k: cái kéo."],
["Tiếng Việt", 1, "Điền g hay gh vào chỗ trống: “cái ...ế”?", "gh", "g", "ng", "c", "Trước e, ê, i dùng chữ gh: cái ghế."],
["Tiếng Việt", 1, "Điền g hay gh vào chỗ trống: “con ...à”?", "g", "gh", "k", "ngh", "Trước a dùng chữ g: con gà."],
["Tiếng Việt", 2, "Điền ng hay ngh vào chỗ trống: “lắng ...e”?", "ngh", "ng", "g", "gh", "Trước e, ê, i dùng chữ ngh: lắng nghe."],
["Tiếng Việt", 2, "Con vật nào biết gáy “ò ó o” buổi sáng?", "Con gà trống", "Con mèo", "Con cá", "Con rùa", "Gà trống gáy ò ó o gọi trời sáng."],
["Tiếng Anh", 1, "Số 8 tiếng Anh là gì?", "eight", "seven", "nine", "ten", "Eight là số 8."],
["Tiếng Anh", 1, "Màu xanh lá tiếng Anh là gì?", "green", "pink", "black", "white", "Green là màu xanh lá cây."],
["Tiếng Anh", 1, "Quyển sách tiếng Anh là gì?", "book", "pen", "bag", "desk", "Book là quyển sách."]
]
};
/*END_DATA*/

/* ================= TIỆN ÍCH ================= */
const $ = id => document.getElementById(id);
const rnd = (a, b) => a + Math.random() * (b - a);
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const LS = { get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };
const ANH = "../anh-chung/anh/";
const faceUrl = c => window.MatThat ? MatThat.url(c) : "../../img/" + c + ".webp";
const tenBe = c => (window.HS && HS[c] && HS[c].goi) || (c === "lucie" ? "Lucie" : "Lucas");

/* ================= GIỌNG ĐỌC ================= */
const Voice = {
  q: [], busy: false, on: true, tok: 0,
  stop() { this.q = []; this.busy = false; this.tok++; try { speechSynthesis.cancel(); } catch (e) {} },
  say(text, en, now) {
    if (!text) return;
    if (now) this.stop();
    this.q.push({ text, en }); if (!this.busy) this.next();
  },
  next() {
    const it = this.q.shift(); if (!it) { this.busy = false; return; }
    this.busy = true; const tk = this.tok;
    let done = false; const fin = () => { if (done || tk !== this.tok) return; done = true; setTimeout(() => this.next(), 120); };
    try {
      const u = new SpeechSynthesisUtterance(it.text);
      u.lang = it.en ? "en-US" : "vi-VN"; u.rate = it.en ? 0.8 : 0.95; u.pitch = 1.05;
      if (it.en) { const v = speechSynthesis.getVoices().find(x => /^en/i.test(x.lang)); if (v) u.voice = v; }
      else { const v = speechSynthesis.getVoices().find(x => /^vi/i.test(x.lang)); if (v) u.voice = v; }
      u.onend = u.onerror = fin; u.addEventListener("end", fin);
      speechSynthesis.speak(u);
      setTimeout(fin, 1500 + it.text.length * 140);
    } catch (e) { fin(); }
  }
};
const isEnText = s => /^[\x00-\x7F]*$/.test(s) && /[a-z]/i.test(s);

/* ================= ÂM THANH (Web Audio) ================= */
const SFX = {
  ctx: null, eng: null, engG: null, master: null,
  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.ctx.createGain(); this.master.gain.value = 0.55; this.master.connect(this.ctx.destination);
      const o = this.ctx.createOscillator(), o2 = this.ctx.createOscillator(), lp = this.ctx.createBiquadFilter(), g = this.ctx.createGain();
      o.type = "sawtooth"; o2.type = "square"; o.frequency.value = 60; o2.frequency.value = 30; lp.type = "lowpass"; lp.frequency.value = 420; g.gain.value = 0;
      o.connect(lp); o2.connect(lp); lp.connect(g); g.connect(this.master); o.start(); o2.start();
      this.eng = [o, o2]; this.engG = g; this.lp = lp;
    } catch (e) { this.ctx = null; }
  },
  engine(speed, on, gas) {
    if (!this.ctx) return; const t = this.ctx.currentTime;
    const f = 48 + speed * (gas ? 2.6 : 2.15);
    this.eng[0].frequency.setTargetAtTime(f, t, 0.08); this.eng[1].frequency.setTargetAtTime(f / 2, t, 0.08);
    this.lp.frequency.setTargetAtTime(320 + speed * (gas ? 18 : 13), t, 0.08);
    this.engG.gain.setTargetAtTime(on ? (gas ? 0.065 : 0.045) : 0, t, 0.15);
  },
  tone(f, d, type, vol, slide) {
    if (!this.ctx) return; const t = this.ctx.currentTime, o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = type || "sine"; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d);
    g.gain.setValueAtTime(vol || 0.2, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    o.connect(g); g.connect(this.master); o.start(t); o.stop(t + d + 0.02);
  },
  noise(d, vol, f0, f1) {
    if (!this.ctx) return; const t = this.ctx.currentTime, n = Math.floor(this.ctx.sampleRate * d), b = this.ctx.createBuffer(1, n, this.ctx.sampleRate), a = b.getChannelData(0);
    for (let i = 0; i < n; i++) a[i] = Math.random() * 2 - 1;
    const s = this.ctx.createBufferSource(), bp = this.ctx.createBiquadFilter(), g = this.ctx.createGain();
    s.buffer = b; bp.type = "bandpass"; bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + d); bp.Q.value = 0.8;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    s.connect(bp); bp.connect(g); g.connect(this.master); s.start(t);
  },
  coin() { this.tone(988, 0.08, "square", 0.08); setTimeout(() => this.tone(1319, 0.18, "square", 0.08), 70); },
  turbo(superT) {
    this.tone(110, 0.45, "sine", 0.38, 28);
    this.noise(0.32, 0.45, 220, 45);
    this.noise(1.35, 0.38, 350, superT ? 4200 : 3200);
    this.tone(160, 0.95, "sawtooth", 0.14, superT ? 1180 : 920);
    if (superT) setTimeout(() => this.tone(520, 0.5, "triangle", 0.18, 1560), 120);
  },
  whoosh() { this.noise(0.38, 0.25, 300, 2200); this.tone(280, 0.28, "sine", 0.1, 680); },
  shatter() { this.noise(0.35, 0.32, 1800, 600); [1046, 1318, 1568, 2093].forEach((f, i) => setTimeout(() => this.tone(f, 0.16, "triangle", 0.14), i * 45)); },
  hit() { this.noise(0.35, 0.4, 900, 120); this.tone(120, 0.3, "square", 0.12, 50); },
  ok() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, 0.18, "triangle", 0.18), i * 70)); },
  no() { this.tone(300, 0.25, "sawtooth", 0.12, 150); setTimeout(() => this.tone(200, 0.35, "sawtooth", 0.12, 100), 200); },
  beep(hi) { this.tone(hi ? 1046 : 523, hi ? 0.5 : 0.22, "square", 0.14); },
  fanfare() { [523, 659, 784, 1047, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, i === 5 ? 0.6 : 0.16, "triangle", 0.2), i * 140)); }
};

/* ================= CẤU HÌNH ĐƯỜNG ĐUA ================= */
const LANES = [-3.2, 0, 3.2];
const CHANG_LEN = 1000;
const N_CHANG = 4;
const RACE_LEN = CHANG_LEN * N_CHANG;
const GATES_PER = 5;
const BASE_SPEED = 32;
const Q_AHEAD = 135;
const MAUXE = [["#e11d48", "Đỏ"], ["#2563eb", "Xanh"], ["#facc15", "Vàng"], ["#f97316", "Cam"], ["#9333ea", "Tím"], ["#10b981", "Lục"]];
const RIVALS = [
  { id: "tho", ten: "Thỏ Trắng", anh: "e-1f430", mau: "#f472b6", tai: "tho", da: 0xffffff },
  { id: "cao", ten: "Cáo Cam", anh: "e-1f98a", mau: "#f59e0b", tai: "cao", da: 0xf97316 },
  { id: "gau", ten: "Gấu Nâu", anh: "e-1f43b", mau: "#22c55e", tai: "gau", da: 0x8b5a2b }
];
const STAGES = [
  { sky: [0x6ec6ff, 0xd8f1ff], fog: 0xbfe6ff, ground: 0x6b7280, side: 0x9ca3af, road: "#3a3f4b" },
  { sky: [0x7fd0ff, 0xf3ffd9], fog: 0xe3f7c9, ground: 0x6cc24a, side: 0x8fd16a, road: "#4a4a4a" },
  { sky: [0x39b6f2, 0xfff2c9], fog: 0xd6f3ff, ground: 0xf1d79a, side: 0xf6e3b4, road: "#4b4f57" },
  { sky: [0x9cc8ef, 0xf2f7ff], fog: 0xeaf3ff, ground: 0xf4f8ff, side: 0xe2ecf7, road: "#525a66" }
];

/* ================= TRẠNG THÁI GAME ================= */
const G = {
  child: "lucas", carColor: 0, state: "menu", mode: 1,
  d: 0, x: 0, lane: 1, speed: 0, boost: 0, superTurbo: false, gas: false, slow: 0, nitro: 0, nitroOn: 0, score: 0, ts: 1, tsTarget: 1,
  rivals: [], objs: [], gates: [], qs: [], gi: 0, right: 0, asked: 0, streak: 0, bestStreak: 0, coins: 0, hits: 0,
  stage: 0, t0: 0, shake: 0, fovKick: 0, finished: false, finishOrder: [], mon: {}
};
window.__dx = G;

const G2 = {
  state: "menu", cd: 0, cdShown: 0, t0: 0,
  players: [], rivals: [], objs: [], finishOrder: []
};
window.__dx2 = G2;

function cupKey(c) { return "duaXe_" + c; }
function bestText(c) {
  const o = LS.get(cupKey(c), {});
  return "🏁 Giải " + giaiDX(c) + "/30: " + ((GIAI_DX[giaiDX(c) - 1] || {}).ten || "") + " · " + (o.luot ? "🏆 " + (o.vang || 0) + " · 🥈 " + (o.bac || 0) + " · 🥉 " + (o.dong || 0) : "Chưa đua lần nào");
}

const GIAI_DX = [{"ten": "Đại Lộ Thành Phố", "lucie": [], "lucas": []}, {"ten": "Con Đường Đồng Lúa", "lucie": [], "lucas": []}, {"ten": "Đường Đua Bờ Biển", "lucie": [], "lucas": []}, {"ten": "Đỉnh Đèo Núi Tuyết", "lucie": [], "lucas": []}, {"ten": "Rừng Trúc Xanh Mát", "lucie": [["Toán", 1, "Tính tổng: 199 + 186 = ?", "385", "395", "375", "386", "199 + 186 = 385."], ["Toán", 1, "Tính hiệu: 705 - 239 = ?", "466", "476", "456", "468", "705 - 239 = 466."], ["Toán", 1, "Tính tích: 18 x 6 = ?", "108", "114", "102", "118", "18 x 6 = 108."], ["Toán", 1, "Tính thương: 98 : 7 = ?", "14", "15", "13", "16", "Vì 7 x 14 = 98 nên 98 : 7 = 14."], ["Toán", 1, "Giá trị biểu thức 24 + 7 x 4 là bao nhiêu?", "52", "62", "42", "56", "7 x 4 = 28; 24 + 28 = 52."], ["Toán", 1, "Chu vi hình chữ nhật dài 15 cm, rộng 8 cm là bao nhiêu?", "46 cm", "48 cm", "44 cm", "50 cm", "Chu vi = (15 + 8) x 2 = 46 cm."], ["Tiếng Việt", 1, "Từ cùng nghĩa với 'đoàn kết' là từ nào?", "Gắn bó", "Chia rẽ", "Xa cách", "Tranh cãi", "Gắn bó gần nghĩa với đoàn kết."], ["Tiếng Việt", 1, "Từ trái nghĩa với 'cẩn thận' là từ nào?", "Cẩu thả", "Tỉ mỉ", "Chu đáo", "Kỹ lưỡng", "Cẩu thả trái nghĩa với cẩn thận."], ["Tiếng Anh", 1, "Từ 'grandfather' chỉ ai trong gia đình?", "Ông", "Bà", "Bố", "Chú", "Grandfather là ông (nội/ngoại)."], ["Tiếng Anh", 1, "Từ 'grandmother' chỉ ai trong gia đình?", "Bà", "Ông", "Mẹ", "Cô", "Grandmother là bà (nội/ngoại)."]], "lucas": [["Toán", 1, "Tính: 18 + 1 = ?", "19", "20", "18", "21", "18 + 1 = 19."], ["Toán", 1, "Tính: 24 - 1 = ?", "23", "24", "22", "25", "24 - 1 = 23."], ["Toán", 1, "Số liền sau của số 15 là số mấy?", "16", "17", "15", "18", "Sau số 15 là số 16."], ["Toán", 1, "Số gồm 2 chục và 0 đơn vị là số mấy?", "20", "30", "10", "21", "2 chục và 0 đơn vị là 20."], ["Toán", 1, "Tính nhẩm: 15 + 10 = ?", "25", "35", "15", "26", "15 + 10 = 25."], ["Toán", 1, "Trong rổ có 9 quả táo, thêm 2 quả nữa. Có tất cả mấy quả táo?", "11 quả táo", "12 quả táo", "10 quả táo", "13 quả táo", "9 + 2 = 11 quả táo."], ["Tiếng Việt", 1, "Con vật nào thích ăn cỏ và cho sữa?", "Con bò", "Con cá", "Con gà", "Con mèo", "Con bò sữa ăn cỏ và cho sữa."], ["Tiếng Việt", 1, "Con vật nào biết bơi giỏi dưới ao?", "Con vịt", "Con gà", "Con mèo", "Con khỉ", "Con vịt có màng chân bơi rất giỏi."], ["Tiếng Anh", 1, "Từ 'bird' là con gì?", "Con chim", "Con cá", "Con mèo", "Con chó", "Bird là con chim."], ["Tiếng Anh", 1, "Từ 'duck' là con gì?", "Con vịt", "Con gà", "Con voi", "Con ong", "Duck là con vịt."]]}, {"ten": "Cầu Vồng Sau Mưa", "lucie": [["Toán", 1, "Tính tổng: 216 + 199 = ?", "415", "425", "405", "416", "216 + 199 = 415."], ["Toán", 1, "Tính hiệu: 724 - 251 = ?", "473", "483", "463", "475", "724 - 251 = 473."], ["Toán", 1, "Tính tích: 19 x 7 = ?", "133", "140", "126", "143", "19 x 7 = 133."], ["Toán", 1, "Tính thương: 120 : 8 = ?", "15", "16", "14", "17", "Vì 8 x 15 = 120 nên 120 : 8 = 15."], ["Toán", 1, "Giá trị biểu thức 27 + 8 x 5 là bao nhiêu?", "67", "77", "57", "72", "8 x 5 = 40; 27 + 40 = 67."], ["Toán", 1, "Chu vi hình chữ nhật dài 16 cm, rộng 9 cm là bao nhiêu?", "50 cm", "52 cm", "48 cm", "54 cm", "Chu vi = (16 + 9) x 2 = 50 cm."], ["Tiếng Việt", 1, "Từ trái nghĩa với 'khiêm tốn' là từ nào?", "Kiêu ngạo", "Hiền lành", "Lễ phép", "Chân thành", "Kiêu ngạo trái nghĩa với khiêm tốn."], ["Tiếng Việt", 1, "Từ trái nghĩa với 'yên tĩnh' là từ nào?", "Ồn ào", "Êm đềm", "Vắng lặng", "Nhẹ nhàng", "Ồn ào trái nghĩa với yên tĩnh."], ["Tiếng Anh", 1, "Nghề nghiệp 'driver' là nghề gì?", "Tài xế lái xe", "Bác sĩ", "Giáo viên", "Nông dân", "Driver là người lái xe."], ["Tiếng Anh", 1, "Nghề nghiệp 'singer' là nghề gì?", "Ca sĩ", "Bác sĩ", "Công nhân", "Đầu bếp", "Singer là ca sĩ."]], "lucas": [["Toán", 1, "Tính: 21 + 2 = ?", "23", "24", "22", "25", "21 + 2 = 23."], ["Toán", 1, "Tính: 26 - 2 = ?", "24", "25", "23", "26", "26 - 2 = 24."], ["Toán", 1, "Số liền trước của số 18 là số mấy?", "17", "18", "16", "19", "Trước số 18 là số 17."], ["Toán", 1, "Số gồm 2 chục và 2 đơn vị là số mấy?", "22", "32", "12", "23", "2 chục và 2 đơn vị là 22."], ["Toán", 1, "Tính nhẩm: 16 + 20 = ?", "36", "46", "26", "37", "16 + 20 = 36."], ["Toán", 1, "Trên đĩa có 14 chiếc bánh, ăn bớt 3 chiếc. Còn lại mấy chiếc bánh?", "11 chiếc bánh", "12 chiếc bánh", "10 chiếc bánh", "13 chiếc bánh", "14 - 3 = 11 chiếc bánh."], ["Tiếng Việt", 1, "Quả nào có vị chua, màu xanh hoặc vàng?", "Quả chanh", "Quả chuối", "Củ khoai", "Hạt gạo", "Quả chanh có vị chua."], ["Tiếng Việt", 1, "Mùa nào trời rất lạnh cần mặc áo ấm?", "Mùa đông", "Mùa hè", "Mùa thu", "Mùa xuân", "Mùa đông trời lạnh."], ["Tiếng Anh", 1, "Từ 'apple' là quả gì?", "Quả táo", "Quả chuối", "Quả cam", "Quả lê", "Apple là quả táo."], ["Tiếng Anh", 1, "Từ 'banana' là quả gì?", "Quả chuối", "Quả táo", "Quả dưa", "Quả nho", "Banana là quả chuối."]]}, {"ten": "Thung Lũng Hoa Hướng Dương", "lucie": [["Toán", 2, "Tính tổng: 233 + 212 = ?", "445", "455", "435", "446", "233 + 212 = 445."], ["Toán", 2, "Tính hiệu: 743 - 263 = ?", "480", "490", "470", "482", "743 - 263 = 480."], ["Toán", 2, "Tính tích: 20 x 8 = ?", "160", "168", "152", "170", "20 x 8 = 160."], ["Toán", 2, "Tính thương: 144 : 9 = ?", "16", "17", "15", "18", "Vì 9 x 16 = 144 nên 144 : 9 = 16."], ["Toán", 2, "Giá trị biểu thức 30 + 3 x 6 là bao nhiêu?", "48", "58", "38", "54", "3 x 6 = 18; 30 + 18 = 48."], ["Toán", 2, "Chu vi hình chữ nhật dài 17 cm, rộng 4 cm là bao nhiêu?", "42 cm", "44 cm", "40 cm", "46 cm", "Chu vi = (17 + 4) x 2 = 42 cm."], ["Tiếng Việt", 2, "Câu 'Con hãy sắp xếp góc học tập gọn gàng nhé!' là kiểu câu gì?", "Câu khiến", "Câu hỏi", "Câu kể", "Câu cảm", "Câu nêu yêu cầu, đề nghị là câu khiến."], ["Tiếng Việt", 2, "Câu 'Bức tranh này đẹp tuyệt vời!' là kiểu câu gì?", "Câu cảm", "Câu hỏi", "Câu kể", "Câu khiến", "Câu bộc lộ cảm xúc kết thúc bằng dấu (!) là câu cảm."], ["Tiếng Anh", 2, "Phòng 'bathroom' là phòng nào trong nhà?", "Phòng tắm", "Phòng bếp", "Phòng ngủ", "Phòng khách", "Bathroom là phòng tắm."], ["Tiếng Anh", 2, "Phòng 'dining room' là phòng nào?", "Phòng ăn", "Phòng ngủ", "Phòng tắm", "Sân vườn", "Dining room là phòng ăn."]], "lucas": [["Toán", 2, "Tính: 23 + 3 = ?", "26", "27", "25", "28", "23 + 3 = 26."], ["Toán", 2, "Tính: 28 - 3 = ?", "25", "26", "24", "27", "28 - 3 = 25."], ["Toán", 2, "Số liền sau của số 21 là số mấy?", "22", "23", "21", "24", "Sau số 21 là số 22."], ["Toán", 2, "Số gồm 2 chục và 4 đơn vị là số mấy?", "24", "34", "14", "25", "2 chục và 4 đơn vị là 24."], ["Toán", 2, "Tính nhẩm: 17 + 30 = ?", "47", "57", "37", "48", "17 + 30 = 47."], ["Toán", 2, "Trong rổ có 11 quả táo, thêm 4 quả nữa. Có tất cả mấy quả táo?", "15 quả táo", "16 quả táo", "14 quả táo", "17 quả táo", "11 + 4 = 15 quả táo."], ["Tiếng Việt", 2, "Từ nào trái nghĩa với 'dài'?", "Ngắn", "Cao", "To", "Rộng", "Ngắn trái nghĩa với dài."], ["Tiếng Việt", 2, "Từ nào trái nghĩa với 'vui'?", "Buồn", "Cười", "Đẹp", "Sáng", "Buồn trái nghĩa với vui."], ["Tiếng Anh", 2, "Từ 'book' là đồ vật gì?", "Quyển sách", "Cây bút", "Cái bàn", "Quả bóng", "Book là quyển sách."], ["Tiếng Anh", 2, "Từ 'ball' là đồ vật gì?", "Quả bóng", "Cái mũ", "Cái cặp", "Ô tô", "Ball là quả bóng."]]}, {"ten": "Phố Cổ Đèn Lồng", "lucie": [["Toán", 2, "Tính tổng: 250 + 225 = ?", "475", "485", "465", "476", "250 + 225 = 475."], ["Toán", 2, "Tính hiệu: 762 - 275 = ?", "487", "497", "477", "489", "762 - 275 = 487."], ["Toán", 2, "Tính tích: 21 x 2 = ?", "42", "44", "40", "52", "21 x 2 = 42."], ["Toán", 2, "Tính thương: 51 : 3 = ?", "17", "18", "16", "19", "Vì 3 x 17 = 51 nên 51 : 3 = 17."], ["Toán", 2, "Giá trị biểu thức 33 + 4 x 7 là bao nhiêu?", "61", "71", "51", "68", "4 x 7 = 28; 33 + 28 = 61."], ["Toán", 2, "Chu vi hình chữ nhật dài 18 cm, rộng 5 cm là bao nhiêu?", "46 cm", "48 cm", "44 cm", "50 cm", "Chu vi = (18 + 5) x 2 = 46 cm."], ["Tiếng Việt", 2, "Dấu câu nào dùng để kết thúc câu hỏi?", "Dấu chấm hỏi (?)", "Dấu chấm (.)", "Dấu phẩy (,)", "Dấu chấm than (!)", "Câu hỏi kết thúc bằng dấu chấm hỏi (?)."], ["Tiếng Việt", 2, "Trong câu 'Tàu lướt nhanh như mũi tên', từ so sánh là từ nào?", "như", "lướt", "nhanh", "mũi tên", "Từ 'như' là từ chỉ sự so sánh."], ["Tiếng Anh", 2, "Món ăn 'bread' là món gì?", "Bánh mì", "Cơm", "Thịt gà", "Trứng", "Bread là bánh mì."], ["Tiếng Anh", 2, "Món ăn 'noodles' là món gì?", "Mì / phở / bún", "Bánh ngọt", "Sữa", "Nước cam", "Noodles là các món mì, bún, phở."]], "lucas": [["Toán", 2, "Tính: 25 + 4 = ?", "29", "30", "28", "31", "25 + 4 = 29."], ["Toán", 2, "Tính: 35 - 4 = ?", "31", "32", "30", "33", "35 - 4 = 31."], ["Toán", 2, "Số liền trước của số 24 là số mấy?", "23", "24", "22", "25", "Trước số 24 là số 23."], ["Toán", 2, "Số gồm 2 chục và 6 đơn vị là số mấy?", "26", "36", "16", "27", "2 chục và 6 đơn vị là 26."], ["Toán", 2, "Tính nhẩm: 18 + 40 = ?", "58", "68", "48", "59", "18 + 40 = 58."], ["Toán", 2, "Trên đĩa có 18 chiếc bánh, ăn bớt 5 chiếc. Còn lại mấy chiếc bánh?", "13 chiếc bánh", "14 chiếc bánh", "12 chiếc bánh", "15 chiếc bánh", "18 - 5 = 13 chiếc bánh."], ["Tiếng Việt", 2, "Từ nào trái nghĩa với 'nặng'?", "Nhẹ", "To", "Cao", "Dài", "Nhẹ trái nghĩa với nặng."], ["Tiếng Việt", 2, "Đồ vật nào dùng để cắt giấy thủ công?", "Cái kéo", "Cục tẩy", "Quyển vở", "Cái bát", "Cái kéo dùng để cắt giấy."], ["Tiếng Anh", 2, "Từ 'car' là phương tiện gì?", "Ô tô", "Máy bay", "Tàu thủy", "Xe đạp", "Car là xe ô tô."], ["Tiếng Anh", 2, "Từ 'sun' nghĩa là gì?", "Mặt trời", "Mặt trăng", "Ngôi sao", "Đám mây", "Sun là mặt trời."]]}, {"ten": "Hẻm Núi Đỏ Rực", "lucie": [["Toán", 2, "Tính tổng: 267 + 238 = ?", "505", "515", "495", "506", "267 + 238 = 505."], ["Toán", 2, "Tính hiệu: 781 - 287 = ?", "494", "504", "484", "496", "781 - 287 = 494."], ["Toán", 2, "Tính tích: 22 x 3 = ?", "66", "69", "63", "76", "22 x 3 = 66."], ["Toán", 2, "Tính thương: 72 : 4 = ?", "18", "19", "17", "20", "Vì 4 x 18 = 72 nên 72 : 4 = 18."], ["Toán", 2, "Giá trị biểu thức 36 + 5 x 8 là bao nhiêu?", "76", "86", "66", "84", "5 x 8 = 40; 36 + 40 = 76."], ["Toán", 2, "Chu vi hình chữ nhật dài 19 cm, rộng 6 cm là bao nhiêu?", "50 cm", "52 cm", "48 cm", "54 cm", "Chu vi = (19 + 6) x 2 = 50 cm."], ["Tiếng Việt", 2, "Trong câu 'Chú chim nhỏ hót vang chào bình minh', biện pháp nào được dùng?", "Nhân hóa", "So sánh", "Liệt kê", "Câu hỏi", "Gọi chim là 'chú' và biết 'chào bình minh' là nhân hóa."], ["Tiếng Việt", 2, "Từ nào chỉ người làm việc trong bệnh viện?", "Y tá", "Kỹ sư cầu đường", "Thợ mộc", "Thủ thư", "Y tá làm việc chăm sóc bệnh nhân."], ["Tiếng Anh", 2, "Con vật 'goldfish' là con gì?", "Cá vàng", "Con thỏ", "Con vẹt", "Con mèo", "Goldfish là cá vàng."], ["Tiếng Anh", 2, "Con vật 'tiger' là con gì?", "Con hổ", "Con voi", "Con khỉ", "Con công", "Tiger là con hổ."]], "lucas": [["Toán", 2, "Tính: 27 + 1 = ?", "28", "29", "27", "30", "27 + 1 = 28."], ["Toán", 2, "Tính: 32 - 1 = ?", "31", "32", "30", "33", "32 - 1 = 31."], ["Toán", 2, "Số liền sau của số 27 là số mấy?", "28", "29", "27", "30", "Sau số 27 là số 28."], ["Toán", 2, "Số gồm 2 chục và 8 đơn vị là số mấy?", "28", "38", "18", "29", "2 chục và 8 đơn vị là 28."], ["Toán", 2, "Tính nhẩm: 19 + 10 = ?", "29", "39", "19", "30", "19 + 10 = 29."], ["Toán", 2, "Trong rổ có 13 quả táo, thêm 2 quả nữa. Có tất cả mấy quả táo?", "15 quả táo", "16 quả táo", "14 quả táo", "17 quả táo", "13 + 2 = 15 quả táo."], ["Tiếng Việt", 2, "Đồ vật nào dùng để che đầu khi đi nắng?", "Cái mũ", "Đôi tất", "Cái bút", "Cái thìa", "Cái mũ dùng để đội đầu."], ["Tiếng Việt", 2, "Từ nào có vần 'oa'?", "Bông hoa", "Con cá", "Cái bàn", "Cây tre", "Tiếng 'hoa' có vần oa."], ["Tiếng Anh", 2, "Từ 'moon' nghĩa là gì?", "Mặt trăng", "Mặt trời", "Cái cây", "Bông hoa", "Moon là mặt trăng."], ["Tiếng Anh", 2, "Từ 'star' nghĩa là gì?", "Ngôi sao", "Mặt trời", "Mặt trăng", "Cơn mưa", "Star là ngôi sao."]]}, {"ten": "Cảng Biển Siêu Tốc", "lucie": [["Toán", 2, "Tính tổng: 284 + 251 = ?", "535", "545", "525", "536", "284 + 251 = 535."], ["Toán", 2, "Tính hiệu: 800 - 299 = ?", "501", "511", "491", "503", "800 - 299 = 501."], ["Toán", 2, "Tính tích: 23 x 4 = ?", "92", "96", "88", "102", "23 x 4 = 92."], ["Toán", 2, "Tính thương: 95 : 5 = ?", "19", "20", "18", "21", "Vì 5 x 19 = 95 nên 95 : 5 = 19."], ["Toán", 2, "Giá trị biểu thức 39 + 6 x 4 là bao nhiêu?", "63", "73", "53", "67", "6 x 4 = 24; 39 + 24 = 63."], ["Toán", 2, "Chu vi hình chữ nhật dài 20 cm, rộng 7 cm là bao nhiêu?", "54 cm", "56 cm", "52 cm", "58 cm", "Chu vi = (20 + 7) x 2 = 54 cm."], ["Tiếng Việt", 2, "Từ nào chỉ đồ dùng đo đạc trong môn Toán?", "Thước ê ke", "Bút lông vẽ", "Cái chổi", "Quả cầu", "Thước ê ke dùng đo góc vuông trong môn Toán."], ["Tiếng Việt", 2, "Tục ngữ 'Có công mài sắt, có ngày nên kim' khuyên điều gì?", "Kiên trì cố gắng sẽ đạt được thành công", "Phải rèn sắt mỗi ngày", "Nên tiết kiệm tiền", "Giữ gìn kim chỉ cẩn thận", "Câu tục ngữ khuyên ta kiên trì, bền bỉ."], ["Tiếng Anh", 2, "Đồ chơi 'plane' là món gì?", "Máy bay đồ chơi", "Ô tô", "Tàu thủy", "Cái diều", "Plane là máy bay."], ["Tiếng Anh", 2, "Đồ chơi 'train' là món gì?", "Tàu hỏa đồ chơi", "Xe buýt", "Xe đạp", "Thuyền buồm", "Train là tàu hỏa."]], "lucas": [["Toán", 2, "Tính: 27 + 2 = ?", "29", "30", "28", "31", "27 + 2 = 29."], ["Toán", 2, "Tính: 34 - 2 = ?", "32", "33", "31", "34", "34 - 2 = 32."], ["Toán", 2, "Số liền trước của số 30 là số mấy?", "29", "30", "28", "31", "Trước số 30 là số 29."], ["Toán", 2, "Số gồm 3 chục và 0 đơn vị là số mấy?", "30", "40", "20", "31", "3 chục và 0 đơn vị là 30."], ["Toán", 2, "Tính nhẩm: 20 + 20 = ?", "40", "50", "30", "41", "20 + 20 = 40."], ["Toán", 2, "Trên đĩa có 18 chiếc bánh, ăn bớt 3 chiếc. Còn lại mấy chiếc bánh?", "15 chiếc bánh", "16 chiếc bánh", "14 chiếc bánh", "17 chiếc bánh", "18 - 3 = 15 chiếc bánh."], ["Tiếng Việt", 2, "Từ nào có vần 'au'?", "Cây cau", "Con mèo", "Quả cam", "Bút chì", "Tiếng 'cau' có vần au."], ["Tiếng Việt", 2, "Từ nào có vần 'iên'?", "Biển xanh", "Con gà", "Cái cốc", "Quả lê", "Tiếng 'biển' có vần iên."], ["Tiếng Anh", 2, "Từ 'five' là số mấy?", "5", "4", "6", "7", "Five là số 5."], ["Tiếng Anh", 2, "Từ 'ten' là số mấy?", "10", "8", "9", "2", "Ten là số 10."]]}, {"ten": "Rừng Thông Sương Mù", "lucie": [["Toán", 2, "Tính tổng: 301 + 264 = ?", "565", "575", "555", "566", "301 + 264 = 565."], ["Toán", 2, "Tính hiệu: 819 - 311 = ?", "508", "518", "498", "510", "819 - 311 = 508."], ["Toán", 2, "Tính tích: 24 x 5 = ?", "120", "125", "115", "130", "24 x 5 = 120."], ["Toán", 2, "Tính thương: 120 : 6 = ?", "20", "21", "19", "22", "Vì 6 x 20 = 120 nên 120 : 6 = 20."], ["Toán", 2, "Giá trị biểu thức 42 + 7 x 5 là bao nhiêu?", "77", "87", "67", "82", "7 x 5 = 35; 42 + 35 = 77."], ["Toán", 2, "Chu vi hình chữ nhật dài 21 cm, rộng 8 cm là bao nhiêu?", "58 cm", "60 cm", "56 cm", "62 cm", "Chu vi = (21 + 8) x 2 = 58 cm."], ["Tiếng Việt", 2, "Thành ngữ 'Đi một ngày đàng, học một sàng khôn' khuyên điều gì?", "Chịu khó đi đây đi đó, quan sát để mở mang hiểu biết", "Mỗi ngày nên đi bộ thật xa", "Phải mang theo cái sàng", "Chỉ học vào ban ngày", "Đi nhiều và trải nghiệm giúp ta học hỏi thêm nhiều điều hay."], ["Tiếng Việt", 2, "Chọn từ viết đúng chính tả (nhóm ch/tr):", "Chăm chút", "Trăm trút", "Chăm trút", "Trăm chút", "Viết đúng là 'chăm chút'."], ["Tiếng Anh", 2, "Hoạt động 'swimming' nghĩa là gì?", "Đang bơi lội", "Đang chạy bộ", "Đang vẽ tranh", "Đang đọc sách", "Swimming là bơi lội."], ["Tiếng Anh", 2, "Hoạt động 'reading' nghĩa là gì?", "Đang đọc sách", "Đang viết bài", "Đang hát", "Đang nấu ăn", "Reading là đang đọc."]], "lucas": [["Toán", 2, "Tính: 31 + 3 = ?", "34", "35", "33", "36", "31 + 3 = 34."], ["Toán", 2, "Tính: 36 - 3 = ?", "33", "34", "32", "35", "36 - 3 = 33."], ["Toán", 2, "Số liền sau của số 33 là số mấy?", "34", "35", "33", "36", "Sau số 33 là số 34."], ["Toán", 2, "Số gồm 3 chục và 2 đơn vị là số mấy?", "32", "42", "22", "33", "3 chục và 2 đơn vị là 32."], ["Toán", 2, "Tính nhẩm: 21 + 30 = ?", "51", "61", "41", "52", "21 + 30 = 51."], ["Toán", 2, "Trong rổ có 15 quả táo, thêm 4 quả nữa. Có tất cả mấy quả táo?", "19 quả táo", "20 quả táo", "18 quả táo", "21 quả táo", "15 + 4 = 19 quả táo."], ["Tiếng Việt", 2, "Điền c hay k: 'con ...iến'?", "k", "c", "g", "b", "Trước i dùng chữ k: con kiến."], ["Tiếng Việt", 2, "Điền c hay k: 'quả ...am'?", "c", "k", "g", "m", "Trước a dùng chữ c: quả cam."], ["Tiếng Anh", 2, "Từ 'one' là số mấy?", "1", "2", "3", "4", "One là số 1."], ["Tiếng Anh", 2, "Từ 'two' là số mấy?", "2", "1", "3", "5", "Two là số 2."]]}, {"ten": "Vương Quốc Kẹo Ngọt", "lucie": [["Toán", 2, "Tính tổng: 318 + 277 = ?", "595", "605", "585", "596", "318 + 277 = 595."], ["Toán", 2, "Tính hiệu: 838 - 323 = ?", "515", "525", "505", "517", "838 - 323 = 515."], ["Toán", 2, "Tính tích: 25 x 6 = ?", "150", "156", "144", "160", "25 x 6 = 150."], ["Toán", 2, "Tính thương: 147 : 7 = ?", "21", "22", "20", "23", "Vì 7 x 21 = 147 nên 147 : 7 = 21."], ["Toán", 2, "Giá trị biểu thức 45 + 8 x 6 là bao nhiêu?", "93", "103", "83", "99", "8 x 6 = 48; 45 + 48 = 93."], ["Toán", 2, "Chu vi hình chữ nhật dài 22 cm, rộng 9 cm là bao nhiêu?", "62 cm", "64 cm", "60 cm", "66 cm", "Chu vi = (22 + 9) x 2 = 62 cm."], ["Tiếng Việt", 2, "Chọn từ viết đúng chính tả (nhóm x/s):", "Xôn xao", "Sôn sao", "Xôn sao", "Sôn xao", "Viết đúng là 'xôn xao'."], ["Tiếng Việt", 2, "Chọn từ viết đúng chính tả (nhóm gi/d/r):", "Giản dị", "Dản dị", "Rản rị", "Giản rị", "Viết đúng là 'giản dị'."], ["Tiếng Anh", 2, "Từ 'fourteen' là số mấy?", "14", "4", "40", "15", "Fourteen là số 14."], ["Tiếng Anh", 2, "Từ 'nineteen' là số mấy?", "19", "9", "90", "18", "Nineteen là số 19."]], "lucas": [["Toán", 2, "Tính: 33 + 4 = ?", "37", "38", "36", "39", "33 + 4 = 37."], ["Toán", 2, "Tính: 38 - 4 = ?", "34", "35", "33", "36", "38 - 4 = 34."], ["Toán", 2, "Số liền trước của số 36 là số mấy?", "35", "36", "34", "37", "Trước số 36 là số 35."], ["Toán", 2, "Số gồm 3 chục và 4 đơn vị là số mấy?", "34", "44", "24", "35", "3 chục và 4 đơn vị là 34."], ["Toán", 2, "Tính nhẩm: 22 + 40 = ?", "62", "72", "52", "63", "22 + 40 = 62."], ["Toán", 2, "Trên đĩa có 22 chiếc bánh, ăn bớt 5 chiếc. Còn lại mấy chiếc bánh?", "17 chiếc bánh", "18 chiếc bánh", "16 chiếc bánh", "19 chiếc bánh", "22 - 5 = 17 chiếc bánh."], ["Tiếng Việt", 2, "Điền g hay gh: '...i bài'?", "gh", "g", "k", "ng", "Trước i dùng chữ gh: ghi bài."], ["Tiếng Việt", 2, "Điền g hay gh: 'hạt ...ạo'?", "g", "gh", "c", "k", "Trước a dùng chữ g: hạt gạo."], ["Tiếng Anh", 2, "Từ 'three' là số mấy?", "3", "2", "4", "6", "Three là số 3."], ["Tiếng Anh", 2, "Từ 'four' là số mấy?", "4", "1", "3", "5", "Four là số 4."]]}, {"ten": "Đường Hầm Ánh Sáng", "lucie": [["Toán", 3, "Tính tổng: 335 + 290 = ?", "625", "635", "615", "626", "335 + 290 = 625."], ["Toán", 3, "Tính hiệu: 857 - 335 = ?", "522", "532", "512", "524", "857 - 335 = 522."], ["Toán", 3, "Tính tích: 26 x 7 = ?", "182", "189", "175", "192", "26 x 7 = 182."], ["Toán", 3, "Tính thương: 176 : 8 = ?", "22", "23", "21", "24", "Vì 8 x 22 = 176 nên 176 : 8 = 22."], ["Toán", 3, "Giá trị biểu thức 48 + 3 x 7 là bao nhiêu?", "69", "79", "59", "76", "3 x 7 = 21; 48 + 21 = 69."], ["Toán", 3, "Chu vi hình chữ nhật dài 23 cm, rộng 4 cm là bao nhiêu?", "54 cm", "56 cm", "52 cm", "58 cm", "Chu vi = (23 + 4) x 2 = 54 cm."], ["Tiếng Việt", 3, "Từ nào chỉ phẩm chất tốt đẹp của học sinh?", "Trung thực", "Vội vàng", "Màu xanh", "Bàn ghế", "Trung thực là đức tính tốt đẹp."], ["Tiếng Việt", 3, "Trong câu 'Mùa xuân, hoa đào nở hồng rực khắp vườn', bộ phận trả lời 'Khi nào?' là gì?", "Mùa xuân", "Hoa đào", "Nở hồng rực", "Khắp vườn", "'Mùa xuân' chỉ thời gian (Khi nào?)."], ["Tiếng Anh", 3, "Thời tiết 'windy' nghĩa là trời thế nào?", "Trời có gió", "Trời nắng gắt", "Trời mưa to", "Trời tuyết", "Windy là trời có gió."], ["Tiếng Anh", 3, "Thời tiết 'cloudy' nghĩa là trời thế nào?", "Trời nhiều mây", "Trời mưa rào", "Trời nắng", "Trời bão", "Cloudy là trời nhiều mây."]], "lucas": [["Toán", 3, "Tính: 35 + 1 = ?", "36", "37", "35", "38", "35 + 1 = 36."], ["Toán", 3, "Tính: 42 - 1 = ?", "41", "42", "40", "43", "42 - 1 = 41."], ["Toán", 3, "Số liền sau của số 39 là số mấy?", "40", "41", "39", "42", "Sau số 39 là số 40."], ["Toán", 3, "Số gồm 3 chục và 6 đơn vị là số mấy?", "36", "46", "26", "37", "3 chục và 6 đơn vị là 36."], ["Toán", 3, "Tính nhẩm: 23 + 10 = ?", "33", "43", "23", "34", "23 + 10 = 33."], ["Toán", 3, "Trong rổ có 17 quả táo, thêm 2 quả nữa. Có tất cả mấy quả táo?", "19 quả táo", "20 quả táo", "18 quả táo", "21 quả táo", "17 + 2 = 19 quả táo."], ["Tiếng Việt", 3, "Điền ng hay ngh: '...ỉ hè'?", "ngh", "ng", "g", "gh", "Trước i dùng chữ ngh: nghỉ hè."], ["Tiếng Việt", 3, "Điền ng hay ngh: 'quả ...ọt'?", "ng", "ngh", "gh", "g", "Trước o dùng chữ ng: quả ngọt."], ["Tiếng Anh", 3, "Từ 'six' là số mấy?", "6", "5", "7", "8", "Six là số 6."], ["Tiếng Anh", 3, "Từ 'seven' là số mấy?", "7", "6", "8", "9", "Seven là số 7."]]}, {"ten": "Cao Nguyên Gió Lộng", "lucie": [["Toán", 3, "Tính tổng: 352 + 303 = ?", "655", "665", "645", "656", "352 + 303 = 655."], ["Toán", 3, "Tính hiệu: 876 - 347 = ?", "529", "539", "519", "531", "876 - 347 = 529."], ["Toán", 3, "Tính tích: 27 x 8 = ?", "216", "224", "208", "226", "27 x 8 = 216."], ["Toán", 3, "Tính thương: 207 : 9 = ?", "23", "24", "22", "25", "Vì 9 x 23 = 207 nên 207 : 9 = 23."], ["Toán", 3, "Giá trị biểu thức 51 + 4 x 8 là bao nhiêu?", "83", "93", "73", "91", "4 x 8 = 32; 51 + 32 = 83."], ["Toán", 3, "Chu vi hình chữ nhật dài 24 cm, rộng 5 cm là bao nhiêu?", "58 cm", "60 cm", "56 cm", "62 cm", "Chu vi = (24 + 5) x 2 = 58 cm."], ["Tiếng Việt", 3, "Trong câu 'Trên sân trường, các bạn đang nhảy dây', bộ phận trả lời 'Ở đâu?' là gì?", "Trên sân trường", "Các bạn", "Đang nhảy dây", "Nhảy dây", "'Trên sân trường' chỉ địa điểm (Ở đâu?)."], ["Tiếng Việt", 3, "Từ nào không cùng nhóm: xe đạp, ô tô, tàu hỏa, quyển truyện?", "Quyển truyện", "Xe đạp", "Ô tô", "Tàu hỏa", "Quyển truyện không phải phương tiện giao thông."], ["Tiếng Anh", 3, "Chọn từ đúng: 'There ___ three books on the desk.'", "are", "is", "am", "be", "Số nhiều (three books) dùng 'There are'."], ["Tiếng Anh", 3, "Chọn từ đúng: 'She ___ playing badminton.'", "is", "are", "am", "do", "Chủ ngữ 'She' đi với 'is'."]], "lucas": [["Toán", 3, "Tính: 37 + 2 = ?", "39", "40", "38", "41", "37 + 2 = 39."], ["Toán", 3, "Tính: 42 - 2 = ?", "40", "41", "39", "42", "42 - 2 = 40."], ["Toán", 3, "Số liền trước của số 42 là số mấy?", "41", "42", "40", "43", "Trước số 42 là số 41."], ["Toán", 3, "Số gồm 3 chục và 8 đơn vị là số mấy?", "38", "48", "28", "39", "3 chục và 8 đơn vị là 38."], ["Toán", 3, "Tính nhẩm: 24 + 20 = ?", "44", "54", "34", "45", "24 + 20 = 44."], ["Toán", 3, "Trên đĩa có 22 chiếc bánh, ăn bớt 3 chiếc. Còn lại mấy chiếc bánh?", "19 chiếc bánh", "20 chiếc bánh", "18 chiếc bánh", "21 chiếc bánh", "22 - 3 = 19 chiếc bánh."], ["Tiếng Việt", 3, "Từ nào viết đúng: 'mặt trời' hay 'mặt chời'?", "mặt trời", "mặt chời", "mặc trời", "mặc chời", "Viết đúng là 'mặt trời'."], ["Tiếng Việt", 3, "Từ nào viết đúng: 'trường học' hay 'chường học'?", "trường học", "chường học", "trường hộc", "chường hộc", "Viết đúng là 'trường học'."], ["Tiếng Anh", 3, "Từ 'eight' là số mấy?", "8", "7", "9", "10", "Eight là số 8."], ["Tiếng Anh", 3, "Từ 'nine' là số mấy?", "9", "8", "10", "6", "Nine là số 9."]]}, {"ten": "Bãi Cát Kim Tự Tháp", "lucie": [["Toán", 3, "Tính tổng: 369 + 316 = ?", "685", "695", "675", "686", "369 + 316 = 685."], ["Toán", 3, "Tính hiệu: 895 - 359 = ?", "536", "546", "526", "538", "895 - 359 = 536."], ["Toán", 3, "Tính tích: 28 x 2 = ?", "56", "58", "54", "66", "28 x 2 = 56."], ["Toán", 3, "Tính thương: 72 : 3 = ?", "24", "25", "23", "26", "Vì 3 x 24 = 72 nên 72 : 3 = 24."], ["Toán", 3, "Giá trị biểu thức 54 + 5 x 4 là bao nhiêu?", "74", "84", "64", "78", "5 x 4 = 20; 54 + 20 = 74."], ["Toán", 3, "Chu vi hình chữ nhật dài 25 cm, rộng 6 cm là bao nhiêu?", "62 cm", "64 cm", "60 cm", "66 cm", "Chu vi = (25 + 6) x 2 = 62 cm."], ["Tiếng Việt", 3, "Từ nào không cùng nhóm: cam, bưởi, xoài, cái thước?", "Cái thước", "Cam", "Bưởi", "Xoài", "Cái thước là đồ dùng học tập, không phải trái cây."], ["Tiếng Việt", 3, "Từ nào cùng nghĩa với 'vui vẻ'?", "Hớn hở", "Buồn rầu", "Lo lắng", "Mệt mỏi", "Hớn hở cùng nghĩa với vui vẻ."], ["Tiếng Anh", 3, "Từ 'summer' chỉ mùa nào trong năm?", "Mùa hè", "Mùa đông", "Mùa thu", "Mùa xuân", "Summer là mùa hè."], ["Tiếng Anh", 3, "Từ 'dinner' là bữa ăn nào trong ngày?", "Bữa tối", "Bữa sáng", "Bữa trưa", "Bữa phụ", "Dinner là bữa tối."]], "lucas": [["Toán", 3, "Tính: 36 + 3 = ?", "39", "40", "38", "41", "36 + 3 = 39."], ["Toán", 3, "Tính: 44 - 3 = ?", "41", "42", "40", "43", "44 - 3 = 41."], ["Toán", 3, "Số liền sau của số 45 là số mấy?", "46", "47", "45", "48", "Sau số 45 là số 46."], ["Toán", 3, "Số gồm 4 chục và 0 đơn vị là số mấy?", "40", "50", "30", "41", "4 chục và 0 đơn vị là 40."], ["Toán", 3, "Tính nhẩm: 25 + 30 = ?", "55", "65", "45", "56", "25 + 30 = 55."], ["Toán", 3, "Trong rổ có 19 quả táo, thêm 4 quả nữa. Có tất cả mấy quả táo?", "23 quả táo", "24 quả táo", "22 quả táo", "25 quả táo", "19 + 4 = 23 quả táo."], ["Tiếng Việt", 3, "Từ nào viết đúng: 'ngôi sao' hay 'ngôi xao'?", "ngôi sao", "ngôi xao", "gôi sao", "ngôi sảo", "Viết đúng là 'ngôi sao'."], ["Tiếng Việt", 3, "Từ nào viết đúng: 'bông hoa' hay 'pông hoa'?", "bông hoa", "pông hoa", "bông hỏa", "pông hỏa", "Viết đúng là 'bông hoa'."], ["Tiếng Anh", 3, "Từ 'orange' là màu gì?", "Màu cam", "Màu xanh", "Màu đen", "Màu trắng", "Orange là màu cam."], ["Tiếng Anh", 3, "Từ 'black' là màu gì?", "Màu đen", "Màu trắng", "Màu đỏ", "Màu vàng", "Black là màu đen."]]}, {"ten": "Cầu Treo Vượt Sông", "lucie": [["Toán", 3, "Tính tổng: 386 + 329 = ?", "715", "725", "705", "716", "386 + 329 = 715."], ["Toán", 3, "Tính hiệu: 914 - 371 = ?", "543", "553", "533", "545", "914 - 371 = 543."], ["Toán", 3, "Tính tích: 29 x 3 = ?", "87", "90", "84", "97", "29 x 3 = 87."], ["Toán", 3, "Tính thương: 100 : 4 = ?", "25", "26", "24", "27", "Vì 4 x 25 = 100 nên 100 : 4 = 25."], ["Toán", 3, "Giá trị biểu thức 57 + 6 x 5 là bao nhiêu?", "87", "97", "77", "92", "6 x 5 = 30; 57 + 30 = 87."], ["Toán", 3, "Chu vi hình chữ nhật dài 26 cm, rộng 7 cm là bao nhiêu?", "66 cm", "68 cm", "64 cm", "70 cm", "Chu vi = (26 + 7) x 2 = 66 cm."], ["Tiếng Việt", 3, "Từ nào chỉ hoạt động thể thao?", "Bơi lội", "Quả bóng", "Sân vận động", "Khỏe mạnh", "Bơi lội là từ chỉ hoạt động."], ["Tiếng Việt", 3, "Từ nào chỉ đặc điểm âm thanh?", "Trong trẻo", "Đàn piano", "Ca hát", "Người nghe", "Trong trẻo tả đặc điểm của âm thanh."], ["Tiếng Anh", 3, "Từ 'music room' có nghĩa là gì?", "Phòng âm nhạc", "Phòng tin học", "Thư viện", "Sân chơi", "Music room là phòng âm nhạc."], ["Tiếng Anh", 3, "Từ 'gym' ở trường học là nơi nào?", "Nhà thể chất", "Phòng y tế", "Cổng trường", "Phòng học", "Gym là phòng tập thể chất."]], "lucas": [["Toán", 3, "Tính: 41 + 4 = ?", "45", "46", "44", "47", "41 + 4 = 45."], ["Toán", 3, "Tính: 46 - 4 = ?", "42", "43", "41", "44", "46 - 4 = 42."], ["Toán", 3, "Số liền trước của số 48 là số mấy?", "47", "48", "46", "49", "Trước số 48 là số 47."], ["Toán", 3, "Số gồm 4 chục và 2 đơn vị là số mấy?", "42", "52", "32", "43", "4 chục và 2 đơn vị là 42."], ["Toán", 3, "Tính nhẩm: 26 + 40 = ?", "66", "76", "56", "67", "26 + 40 = 66."], ["Toán", 3, "Trên đĩa có 26 chiếc bánh, ăn bớt 5 chiếc. Còn lại mấy chiếc bánh?", "21 chiếc bánh", "22 chiếc bánh", "20 chiếc bánh", "23 chiếc bánh", "26 - 5 = 21 chiếc bánh."], ["Tiếng Việt", 3, "Con vật nào kêu 'meo meo'?", "Con mèo", "Con chó", "Con vịt", "Con cá", "Con mèo kêu meo meo."], ["Tiếng Việt", 3, "Con vật nào kêu 'gâu gâu'?", "Con chó", "Con mèo", "Con gà", "Con thỏ", "Con chó kêu gâu gâu."], ["Tiếng Anh", 3, "Từ 'white' là màu gì?", "Màu trắng", "Màu đen", "Màu xanh", "Màu hồng", "White là màu trắng."], ["Tiếng Anh", 3, "Từ 'brown' là màu gì?", "Màu nâu", "Màu hồng", "Màu vàng", "Màu xanh", "Brown là màu nâu."]]}, {"ten": "Vườn Hoa Anh Đào", "lucie": [["Toán", 3, "Tính tổng: 403 + 342 = ?", "745", "755", "735", "746", "403 + 342 = 745."], ["Toán", 3, "Tính hiệu: 933 - 383 = ?", "550", "560", "540", "552", "933 - 383 = 550."], ["Toán", 3, "Tính tích: 30 x 4 = ?", "120", "124", "116", "130", "30 x 4 = 120."], ["Toán", 3, "Tính thương: 130 : 5 = ?", "26", "27", "25", "28", "Vì 5 x 26 = 130 nên 130 : 5 = 26."], ["Toán", 3, "Giá trị biểu thức 60 + 7 x 6 là bao nhiêu?", "102", "112", "92", "108", "7 x 6 = 42; 60 + 42 = 102."], ["Toán", 3, "Chu vi hình chữ nhật dài 27 cm, rộng 8 cm là bao nhiêu?", "70 cm", "72 cm", "68 cm", "74 cm", "Chu vi = (27 + 8) x 2 = 70 cm."], ["Tiếng Việt", 3, "Từ nào chỉ sự vật trên bầu trời?", "Đám mây", "Bay lượn", "Trắng muốt", "Nhẹ nhàng", "Đám mây là từ chỉ sự vật."], ["Tiếng Việt", 3, "Chọn từ viết đúng chính tả (nhóm s/x):", "Sắp xếp", "Xắp xép", "Sắp xép", "Xắp xếp", "Viết đúng là 'sắp xếp'."], ["Tiếng Anh", 3, "Câu 'Close your book, please!' nghĩa là gì?", "Hãy gấp sách lại!", "Hãy mở sách ra!", "Hãy viết vào vở!", "Hãy đọc to lên!", "Close your book = gấp sách lại."], ["Tiếng Anh", 3, "Câu 'Be quiet, please!' nghĩa là gì?", "Hãy giữ trật tự!", "Hãy nói to lên!", "Hãy đứng lên!", "Hãy chạy nhanh!", "Be quiet = hãy giữ yên lặng."]], "lucas": [["Toán", 3, "Tính: 43 + 1 = ?", "44", "45", "43", "46", "43 + 1 = 44."], ["Toán", 3, "Tính: 48 - 1 = ?", "47", "48", "46", "49", "48 - 1 = 47."], ["Toán", 3, "Số liền sau của số 51 là số mấy?", "52", "53", "51", "54", "Sau số 51 là số 52."], ["Toán", 3, "Số gồm 4 chục và 4 đơn vị là số mấy?", "44", "54", "34", "45", "4 chục và 4 đơn vị là 44."], ["Toán", 3, "Tính nhẩm: 27 + 10 = ?", "37", "47", "27", "38", "27 + 10 = 37."], ["Toán", 3, "Trong rổ có 21 quả táo, thêm 2 quả nữa. Có tất cả mấy quả táo?", "23 quả táo", "24 quả táo", "22 quả táo", "25 quả táo", "21 + 2 = 23 quả táo."], ["Tiếng Việt", 3, "Con vật nào gáy 'ò ó o' mỗi sáng?", "Con gà trống", "Con vịt", "Con lợn", "Con bò", "Gà trống gáy sáng."], ["Tiếng Việt", 3, "Con vật nào có tai dài thích ăn cà rốt?", "Con thỏ", "Con cá", "Con rùa", "Con chim", "Con thỏ rất thích cà rốt."], ["Tiếng Anh", 3, "Từ 'purple' là màu gì?", "Màu tím", "Màu cam", "Màu đỏ", "Màu trắng", "Purple là màu tím."], ["Tiếng Anh", 3, "Từ 'pig' là con gì?", "Con lợn", "Con bò", "Con gà", "Con mèo", "Pig là con lợn."]]}, {"ten": "Công Viên Khủng Long", "lucie": [["Toán", 3, "Tính tổng: 420 + 355 = ?", "775", "785", "765", "776", "420 + 355 = 775."], ["Toán", 3, "Tính hiệu: 952 - 395 = ?", "557", "567", "547", "559", "952 - 395 = 557."], ["Toán", 3, "Tính tích: 31 x 5 = ?", "155", "160", "150", "165", "31 x 5 = 155."], ["Toán", 3, "Tính thương: 162 : 6 = ?", "27", "28", "26", "29", "Vì 6 x 27 = 162 nên 162 : 6 = 27."], ["Toán", 3, "Giá trị biểu thức 63 + 8 x 7 là bao nhiêu?", "119", "129", "109", "126", "8 x 7 = 56; 63 + 56 = 119."], ["Toán", 3, "Chu vi hình chữ nhật dài 28 cm, rộng 9 cm là bao nhiêu?", "74 cm", "76 cm", "72 cm", "78 cm", "Chu vi = (28 + 9) x 2 = 74 cm."], ["Tiếng Việt", 3, "Chọn từ viết đúng chính tả (nhóm tr/ch):", "Trung thu", "Chung thu", "Trung chu", "Chung chu", "Viết đúng là 'Trung thu'."], ["Tiếng Việt", 3, "Chọn từ viết đúng chính tả (nhóm r/d/gi):", "Rì rào", "Dì dào", "Gì giao", "Rì dào", "Viết đúng là 'rì rào'."], ["Tiếng Anh", 3, "Đồ dùng 'school bag' là gì?", "Cặp sách đi học", "Hộp bút", "Thước kẻ", "Bàn học", "School bag là cặp sách."], ["Tiếng Anh", 3, "Từ 'notebook' là đồ dùng gì?", "Quyển vở ghi", "Quyển từ điển", "Cục tẩy", "Bút chì", "Notebook là quyển vở."]], "lucas": [["Toán", 3, "Tính: 45 + 2 = ?", "47", "48", "46", "49", "45 + 2 = 47."], ["Toán", 3, "Tính: 53 - 2 = ?", "51", "52", "50", "53", "53 - 2 = 51."], ["Toán", 3, "Số liền trước của số 54 là số mấy?", "53", "54", "52", "55", "Trước số 54 là số 53."], ["Toán", 3, "Số gồm 4 chục và 6 đơn vị là số mấy?", "46", "56", "36", "47", "4 chục và 6 đơn vị là 46."], ["Toán", 3, "Tính nhẩm: 28 + 20 = ?", "48", "58", "38", "49", "28 + 20 = 48."], ["Toán", 3, "Trên đĩa có 26 chiếc bánh, ăn bớt 3 chiếc. Còn lại mấy chiếc bánh?", "23 chiếc bánh", "24 chiếc bánh", "22 chiếc bánh", "25 chiếc bánh", "26 - 3 = 23 chiếc bánh."], ["Tiếng Việt", 3, "Con vật nào có vòi dài và đôi tai to?", "Con voi", "Con chuột", "Con mèo", "Con gà", "Con voi có chiếc vòi dài."], ["Tiếng Việt", 3, "Con vật nào có cổ rất cao ăn lá cây?", "Hươu cao cổ", "Con vịt", "Con lợn", "Con thỏ", "Hươu cao cổ có chiếc cổ rất dài."], ["Tiếng Anh", 3, "Từ 'cow' là con gì?", "Con bò", "Con lợn", "Con chó", "Con vịt", "Cow là con bò."], ["Tiếng Anh", 3, "Từ 'bee' là con gì?", "Con ong", "Con cá", "Con chim", "Con mèo", "Bee là con ong."]]}, {"ten": "Đảo Núi Lửa Sôi Động", "lucie": [["Toán", 4, "Tính tổng: 2437 + 1368 = ?", "3805", "3815", "3795", "3806", "2437 + 1368 = 3805."], ["Toán", 4, "Tính hiệu: 5971 - 2407 = ?", "3564", "3574", "3554", "3566", "5971 - 2407 = 3564."], ["Toán", 4, "Tính tích: 32 x 6 = ?", "192", "198", "186", "202", "32 x 6 = 192."], ["Toán", 4, "Tính thương: 196 : 7 = ?", "28", "29", "27", "30", "Vì 7 x 28 = 196 nên 196 : 7 = 28."], ["Toán", 4, "Giá trị biểu thức 66 + 3 x 8 là bao nhiêu?", "90", "100", "80", "98", "3 x 8 = 24; 66 + 24 = 90."], ["Toán", 4, "Diện tích hình chữ nhật dài 29 cm, rộng 4 cm là bao nhiêu?", "116 cm²", "145 cm²", "87 cm²", "118 cm²", "Diện tích = 29 x 4 = 116 cm²."], ["Tiếng Việt", 4, "Chọn từ viết đúng chính tả (nhóm l/n):", "Lấp ló", "Nấp nó", "Lấp nó", "Nấp ló", "Viết đúng là 'lấp ló'."], ["Tiếng Việt", 4, "Từ cùng nghĩa với 'siêng năng' là từ nào?", "Cần cù", "Lười biếng", "Vội vã", "Chậm trễ", "Cần cù cùng nghĩa với siêng năng."], ["Tiếng Anh", 4, "Môn thể thao 'volleyball' là môn gì?", "Bóng chuyền", "Bóng đá", "Bóng rổ", "Cầu lông", "Volleyball là môn bóng chuyền."], ["Tiếng Anh", 4, "Hoạt động 'flying a kite' nghĩa là gì?", "Thả diều", "Đạp xe", "Bơi lội", "Nhảy dây", "Flying a kite là thả diều."]], "lucas": [["Toán", 4, "Tính: 46 + 3 = ?", "49", "50", "48", "51", "46 + 3 = 49."], ["Toán", 4, "Tính: 54 - 3 = ?", "51", "52", "50", "53", "54 - 3 = 51."], ["Toán", 4, "Số liền sau của số 57 là số mấy?", "58", "59", "57", "60", "Sau số 57 là số 58."], ["Toán", 4, "Số gồm 4 chục và 8 đơn vị là số mấy?", "48", "58", "38", "49", "4 chục và 8 đơn vị là 48."], ["Toán", 4, "Tính nhẩm: 29 + 30 = ?", "59", "69", "49", "60", "29 + 30 = 59."], ["Toán", 4, "Trong rổ có 23 quả táo, thêm 4 quả nữa. Có tất cả mấy quả táo?", "27 quả táo", "28 quả táo", "26 quả táo", "29 quả táo", "23 + 4 = 27 quả táo."], ["Tiếng Việt", 4, "Từ nào trái nghĩa với 'cao'?", "Thấp", "Dài", "To", "Rộng", "Thấp trái nghĩa với cao."], ["Tiếng Việt", 4, "Từ nào trái nghĩa với 'nóng'?", "Lạnh", "Ấm", "Đỏ", "Sáng", "Lạnh trái nghĩa với nóng."], ["Tiếng Anh", 4, "Từ 'frog' là con gì?", "Con ếch", "Con thỏ", "Con gà", "Con chó", "Frog là con ếch."], ["Tiếng Anh", 4, "Từ 'lion' là con gì?", "Sư tử", "Con mèo", "Con cá", "Con vịt", "Lion là sư tử."]]}, {"ten": "Thành Phố Tương Lai", "lucie": [["Toán", 4, "Tính tổng: 2454 + 1381 = ?", "3835", "3845", "3825", "3836", "2454 + 1381 = 3835."], ["Toán", 4, "Tính hiệu: 5990 - 2419 = ?", "3571", "3581", "3561", "3573", "5990 - 2419 = 3571."], ["Toán", 4, "Tính tích: 33 x 7 = ?", "231", "238", "224", "241", "33 x 7 = 231."], ["Toán", 4, "Tính thương: 232 : 8 = ?", "29", "30", "28", "31", "Vì 8 x 29 = 232 nên 232 : 8 = 29."], ["Toán", 4, "Giá trị biểu thức 69 + 4 x 4 là bao nhiêu?", "85", "95", "75", "89", "4 x 4 = 16; 69 + 16 = 85."], ["Toán", 4, "Diện tích hình chữ nhật dài 30 cm, rộng 5 cm là bao nhiêu?", "150 cm²", "180 cm²", "120 cm²", "152 cm²", "Diện tích = 30 x 5 = 150 cm²."], ["Tiếng Việt", 4, "Từ cùng nghĩa với 'tốt bụng' là từ nào?", "Nhân hậu", "Ích kỷ", "Nóng tính", "Lạnh lùng", "Nhân hậu cùng nghĩa với tốt bụng."], ["Tiếng Việt", 4, "Từ trái nghĩa với 'gọn gàng' là từ nào?", "Bừa bộn", "Ngăn nắp", "Sạch sẽ", "Ngay ngắn", "Bừa bộn trái nghĩa với gọn gàng."], ["Tiếng Anh", 4, "Từ 'uncle' chỉ ai trong gia đình?", "Chú / bác / cậu", "Cô / dì", "Ông", "Anh họ", "Uncle là chú, bác hoặc cậu."], ["Tiếng Anh", 4, "Từ 'aunt' chỉ ai trong gia đình?", "Cô / dì / mợ", "Chú / bác", "Bà", "Em trai", "Aunt là cô, dì hoặc mợ."]], "lucas": [["Toán", 4, "Tính: 45 + 4 = ?", "49", "50", "48", "51", "45 + 4 = 49."], ["Toán", 4, "Tính: 54 - 4 = ?", "50", "51", "49", "52", "54 - 4 = 50."], ["Toán", 4, "Số liền trước của số 60 là số mấy?", "59", "60", "58", "61", "Trước số 60 là số 59."], ["Toán", 4, "Số gồm 5 chục và 0 đơn vị là số mấy?", "50", "60", "40", "51", "5 chục và 0 đơn vị là 50."], ["Toán", 4, "Tính nhẩm: 30 + 40 = ?", "70", "80", "60", "71", "30 + 40 = 70."], ["Toán", 4, "Trên đĩa có 30 chiếc bánh, ăn bớt 5 chiếc. Còn lại mấy chiếc bánh?", "25 chiếc bánh", "26 chiếc bánh", "24 chiếc bánh", "27 chiếc bánh", "30 - 5 = 25 chiếc bánh."], ["Tiếng Việt", 4, "Từ nào trái nghĩa với 'nhanh'?", "Chậm", "Vui", "To", "Cao", "Chậm trái nghĩa với nhanh."], ["Tiếng Việt", 4, "Từ nào trái nghĩa với 'sáng'?", "Tối", "Đẹp", "Mới", "Sạch", "Tối trái nghĩa với sáng."], ["Tiếng Anh", 4, "Từ 'bear' là con gì?", "Con gấu", "Con chim", "Con ong", "Con gà", "Bear là con gấu."], ["Tiếng Anh", 4, "Từ 'egg' là món gì?", "Quả trứng", "Sữa", "Bánh mì", "Quả táo", "Egg là quả trứng."]]}, {"ten": "Cánh Đồng Oải Hương", "lucie": [["Toán", 4, "Tính tổng: 2471 + 1394 = ?", "3865", "3875", "3855", "3866", "2471 + 1394 = 3865."], ["Toán", 4, "Tính hiệu: 6009 - 2431 = ?", "3578", "3588", "3568", "3580", "6009 - 2431 = 3578."], ["Toán", 4, "Tính tích: 34 x 8 = ?", "272", "280", "264", "282", "34 x 8 = 272."], ["Toán", 4, "Tính thương: 270 : 9 = ?", "30", "31", "29", "32", "Vì 9 x 30 = 270 nên 270 : 9 = 30."], ["Toán", 4, "Giá trị biểu thức 72 + 5 x 5 là bao nhiêu?", "97", "107", "87", "102", "5 x 5 = 25; 72 + 25 = 97."], ["Toán", 4, "Diện tích hình chữ nhật dài 31 cm, rộng 6 cm là bao nhiêu?", "186 cm²", "217 cm²", "155 cm²", "188 cm²", "Diện tích = 31 x 6 = 186 cm²."], ["Tiếng Việt", 4, "Từ trái nghĩa với 'mạnh mẽ' là từ nào?", "Yếu ớt", "Khỏe khoắn", "Cường tráng", "Dẻo dai", "Yếu ớt trái nghĩa với mạnh mẽ."], ["Tiếng Việt", 4, "Từ trái nghĩa với 'rộng rãi' là từ nào?", "Chật hẹp", "Mênh mông", "Bao la", "Thoáng đãng", "Chật hẹp trái nghĩa với rộng rãi."], ["Tiếng Anh", 4, "Nghề nghiệp 'nurse' là nghề gì?", "Y tá", "Bác sĩ", "Tài xế", "Đầu bếp", "Nurse là y tá."], ["Tiếng Anh", 4, "Nghề nghiệp 'cook' là nghề gì?", "Đầu bếp", "Ca sĩ", "Họa sĩ", "Nông dân", "Cook là đầu bếp."]], "lucas": [["Toán", 4, "Tính: 51 + 1 = ?", "52", "53", "51", "54", "51 + 1 = 52."], ["Toán", 4, "Tính: 56 - 1 = ?", "55", "56", "54", "57", "56 - 1 = 55."], ["Toán", 4, "Số liền sau của số 63 là số mấy?", "64", "65", "63", "66", "Sau số 63 là số 64."], ["Toán", 4, "Số gồm 5 chục và 2 đơn vị là số mấy?", "52", "62", "42", "53", "5 chục và 2 đơn vị là 52."], ["Toán", 4, "Tính nhẩm: 31 + 10 = ?", "41", "51", "31", "42", "31 + 10 = 41."], ["Toán", 4, "Trong rổ có 25 quả táo, thêm 2 quả nữa. Có tất cả mấy quả táo?", "27 quả táo", "28 quả táo", "26 quả táo", "29 quả táo", "25 + 2 = 27 quả táo."], ["Tiếng Việt", 4, "Từ nào trái nghĩa với 'to'?", "Nhỏ", "Cao", "Nặng", "Dài", "Nhỏ trái nghĩa với to."], ["Tiếng Việt", 4, "Từ nào trái nghĩa với 'mới'?", "Cũ", "Đẹp", "Sạch", "Tươi", "Cũ trái nghĩa với mới."], ["Tiếng Anh", 4, "Từ 'milk' là đồ uống gì?", "Sữa", "Nước lọc", "Trà", "Nước cam", "Milk là sữa."], ["Tiếng Anh", 4, "Từ 'water' là đồ uống gì?", "Nước lọc", "Sữa", "Bánh ngọt", "Quả trứng", "Water là nước."]]}, {"ten": "Vịnh San Hô Dưới Biển", "lucie": [["Toán", 4, "Tính tổng: 2488 + 1407 = ?", "3895", "3905", "3885", "3896", "2488 + 1407 = 3895."], ["Toán", 4, "Tính hiệu: 6028 - 2443 = ?", "3585", "3595", "3575", "3587", "6028 - 2443 = 3585."], ["Toán", 4, "Tính tích: 35 x 2 = ?", "70", "72", "68", "80", "35 x 2 = 70."], ["Toán", 4, "Tính thương: 93 : 3 = ?", "31", "32", "30", "33", "Vì 3 x 31 = 93 nên 93 : 3 = 31."], ["Toán", 4, "Giá trị biểu thức 75 + 6 x 6 là bao nhiêu?", "111", "121", "101", "117", "6 x 6 = 36; 75 + 36 = 111."], ["Toán", 4, "Diện tích hình chữ nhật dài 32 cm, rộng 7 cm là bao nhiêu?", "224 cm²", "256 cm²", "192 cm²", "226 cm²", "Diện tích = 32 x 7 = 224 cm²."], ["Tiếng Việt", 4, "Trong câu 'Hôm qua, lớp em đi tham quan bảo tàng', bộ phận trả lời 'Khi nào?' là gì?", "Hôm qua", "Lớp em", "Đi tham quan", "Bảo tàng", "'Hôm qua' chỉ thời gian."], ["Tiếng Việt", 4, "Trong câu 'Ngoài công viên, các bạn nhỏ đang thả diều', bộ phận trả lời 'Ở đâu?' là gì?", "Ngoài công viên", "Các bạn nhỏ", "Đang thả diều", "Thả diều", "'Ngoài công viên' chỉ địa điểm."], ["Tiếng Anh", 4, "Phòng 'living room' là phòng nào?", "Phòng khách", "Phòng bếp", "Phòng ngủ", "Phòng tắm", "Living room là phòng khách."], ["Tiếng Anh", 4, "Nơi 'garden' trong nhà là gì?", "Khu vườn", "Mái nhà", "Ban công", "Cầu thang", "Garden là khu vườn."]], "lucas": [["Toán", 4, "Tính: 53 + 2 = ?", "55", "56", "54", "57", "53 + 2 = 55."], ["Toán", 4, "Tính: 58 - 2 = ?", "56", "57", "55", "58", "58 - 2 = 56."], ["Toán", 4, "Số liền trước của số 66 là số mấy?", "65", "66", "64", "67", "Trước số 66 là số 65."], ["Toán", 4, "Số gồm 5 chục và 4 đơn vị là số mấy?", "54", "64", "44", "55", "5 chục và 4 đơn vị là 54."], ["Toán", 4, "Tính nhẩm: 32 + 20 = ?", "52", "62", "42", "53", "32 + 20 = 52."], ["Toán", 4, "Trên đĩa có 30 chiếc bánh, ăn bớt 3 chiếc. Còn lại mấy chiếc bánh?", "27 chiếc bánh", "28 chiếc bánh", "26 chiếc bánh", "29 chiếc bánh", "30 - 3 = 27 chiếc bánh."], ["Tiếng Việt", 4, "Đồ vật nào dùng để tẩy nét bút chì?", "Cục tẩy", "Thước kẻ", "Cái thìa", "Cái kéo", "Cục tẩy dùng để xóa nét bút chì."], ["Tiếng Việt", 4, "Đồ vật nào dùng để kẻ đường thẳng?", "Thước kẻ", "Cục tẩy", "Cái cốc", "Cái gối", "Thước kẻ dùng kẻ đường thẳng."], ["Tiếng Anh", 4, "Từ 'cake' là món gì?", "Bánh ngọt", "Cơm", "Quả táo", "Cá", "Cake là bánh ngọt."], ["Tiếng Anh", 4, "Từ 'pen' là đồ vật gì?", "Bút mực", "Quyển sách", "Cái bàn", "Quả bóng", "Pen là bút mực."]]}, {"ten": "Đèo Mây Tây Bắc", "lucie": [["Toán", 4, "Tính tổng: 2505 + 1420 = ?", "3925", "3935", "3915", "3926", "2505 + 1420 = 3925."], ["Toán", 4, "Tính hiệu: 6047 - 2455 = ?", "3592", "3602", "3582", "3594", "6047 - 2455 = 3592."], ["Toán", 4, "Tính tích: 36 x 3 = ?", "108", "111", "105", "118", "36 x 3 = 108."], ["Toán", 4, "Tính thương: 128 : 4 = ?", "32", "33", "31", "34", "Vì 4 x 32 = 128 nên 128 : 4 = 32."], ["Toán", 4, "Giá trị biểu thức 78 + 7 x 7 là bao nhiêu?", "127", "137", "117", "134", "7 x 7 = 49; 78 + 49 = 127."], ["Toán", 4, "Diện tích hình chữ nhật dài 33 cm, rộng 8 cm là bao nhiêu?", "264 cm²", "297 cm²", "231 cm²", "266 cm²", "Diện tích = 33 x 8 = 264 cm²."], ["Tiếng Việt", 4, "Trong câu 'Ông mặt trời mỉm cười tỏa nắng ấm', biện pháp nghệ thuật nào được dùng?", "Nhân hóa", "So sánh", "Câu hỏi", "Liệt kê", "Gọi mặt trời là 'ông' và biết 'mỉm cười' là nhân hóa."], ["Tiếng Việt", 4, "Trong câu 'Dòng sông uốn lượn như dải lụa mềm', dòng sông được so sánh với gì?", "Dải lụa mềm", "Cánh đồng lúa", "Con đường lớn", "Bầu trời xanh", "Từ 'như' so sánh dòng sông với dải lụa mềm."], ["Tiếng Anh", 4, "Món ăn 'fish' là món gì?", "Cá", "Thịt gà", "Trứng", "Bánh mì", "Fish là cá."], ["Tiếng Anh", 4, "Đồ uống 'lemonade' là gì?", "Nước chanh", "Sữa tươi", "Nước cam", "Trà sữa", "Lemonade là nước chanh."]], "lucas": [["Toán", 4, "Tính: 55 + 3 = ?", "58", "59", "57", "60", "55 + 3 = 58."], ["Toán", 4, "Tính: 64 - 3 = ?", "61", "62", "60", "63", "64 - 3 = 61."], ["Toán", 4, "Số liền sau của số 69 là số mấy?", "70", "71", "69", "72", "Sau số 69 là số 70."], ["Toán", 4, "Số gồm 5 chục và 6 đơn vị là số mấy?", "56", "66", "46", "57", "5 chục và 6 đơn vị là 56."], ["Toán", 4, "Tính nhẩm: 33 + 30 = ?", "63", "73", "53", "64", "33 + 30 = 63."], ["Toán", 4, "Trong rổ có 27 quả táo, thêm 4 quả nữa. Có tất cả mấy quả táo?", "31 quả táo", "32 quả táo", "30 quả táo", "33 quả táo", "27 + 4 = 31 quả táo."], ["Tiếng Việt", 4, "Đồ vật nào dùng để xem giờ?", "Đồng hồ", "Cái quạt", "Cái bàn", "Đôi dép", "Đồng hồ giúp xem giờ."], ["Tiếng Việt", 4, "Đồ vật nào dùng để che mưa che nắng?", "Cái ô", "Cái lược", "Cái bát", "Cái bút", "Cái ô dùng che mưa nắng."], ["Tiếng Anh", 4, "Từ 'pencil' là đồ vật gì?", "Bút chì", "Cái ghế", "Cái mũ", "Cái cốc", "Pencil là bút chì."], ["Tiếng Anh", 4, "Từ 'bag' là đồ vật gì?", "Cái cặp / túi", "Quả bóng", "Ô tô", "Cái giường", "Bag là cặp sách / túi."]]}, {"ten": "Lâu Đài Trên Mây", "lucie": [["Toán", 4, "Tính tổng: 2522 + 1433 = ?", "3955", "3965", "3945", "3956", "2522 + 1433 = 3955."], ["Toán", 4, "Tính hiệu: 6066 - 2467 = ?", "3599", "3609", "3589", "3601", "6066 - 2467 = 3599."], ["Toán", 4, "Tính tích: 37 x 4 = ?", "148", "152", "144", "158", "37 x 4 = 148."], ["Toán", 4, "Tính thương: 165 : 5 = ?", "33", "34", "32", "35", "Vì 5 x 33 = 165 nên 165 : 5 = 33."], ["Toán", 4, "Giá trị biểu thức 81 + 8 x 8 là bao nhiêu?", "145", "155", "135", "153", "8 x 8 = 64; 81 + 64 = 145."], ["Toán", 4, "Diện tích hình chữ nhật dài 34 cm, rộng 9 cm là bao nhiêu?", "306 cm²", "340 cm²", "272 cm²", "308 cm²", "Diện tích = 34 x 9 = 306 cm²."], ["Tiếng Việt", 4, "Từ nào chỉ nghề nghiệp bảo vệ rừng và cây xanh?", "Kiểm lâm", "Phi công", "Nhạc sĩ", "Họa sĩ", "Kiểm lâm là người bảo vệ rừng."], ["Tiếng Việt", 4, "Từ nào chỉ dụng cụ trong phòng thí nghiệm?", "Kính hiển vi", "Cái chổi", "Chiếc gối", "Cái bát", "Kính hiển vi dùng quan sát vật rất nhỏ."], ["Tiếng Anh", 4, "Con vật 'peacock' là con gì?", "Con công", "Con vẹt", "Con thỏ", "Con hổ", "Peacock là con công."], ["Tiếng Anh", 4, "Con vật 'horse' là con gì?", "Con ngựa", "Con voi", "Con khỉ", "Con gấu", "Horse là con ngựa."]], "lucas": [["Toán", 4, "Tính: 55 + 4 = ?", "59", "60", "58", "61", "55 + 4 = 59."], ["Toán", 4, "Tính: 65 - 4 = ?", "61", "62", "60", "63", "65 - 4 = 61."], ["Toán", 4, "Số liền trước của số 72 là số mấy?", "71", "72", "70", "73", "Trước số 72 là số 71."], ["Toán", 4, "Số gồm 5 chục và 8 đơn vị là số mấy?", "58", "68", "48", "59", "5 chục và 8 đơn vị là 58."], ["Toán", 4, "Tính nhẩm: 34 + 40 = ?", "74", "84", "64", "75", "34 + 40 = 74."], ["Toán", 4, "Trên đĩa có 34 chiếc bánh, ăn bớt 5 chiếc. Còn lại mấy chiếc bánh?", "29 chiếc bánh", "30 chiếc bánh", "28 chiếc bánh", "31 chiếc bánh", "34 - 5 = 29 chiếc bánh."], ["Tiếng Việt", 4, "Từ nào có vần 'an'?", "Bàn học", "Cái cốc", "Con mèo", "Cây tre", "Tiếng 'bàn' có vần an."], ["Tiếng Việt", 4, "Từ nào có vần 'ông'?", "Cầu vồng", "Quả cam", "Cái bút", "Con cá", "Tiếng 'vồng' có vần ông."], ["Tiếng Anh", 4, "Từ 'hat' là đồ vật gì?", "Cái mũ", "Cái áo", "Đôi giày", "Cái bàn", "Hat là cái mũ."], ["Tiếng Anh", 4, "Từ 'desk' là đồ vật gì?", "Cái bàn học", "Cái giường", "Cánh cửa", "Cái cốc", "Desk là bàn học."]]}, {"ten": "Đường Đua Cực Quang", "lucie": [["Toán", 5, "Tính tổng: 2539 + 1446 = ?", "3985", "3995", "3975", "3986", "2539 + 1446 = 3985."], ["Toán", 5, "Tính hiệu: 6085 - 2479 = ?", "3606", "3616", "3596", "3608", "6085 - 2479 = 3606."], ["Toán", 5, "Tính tích: 38 x 5 = ?", "190", "195", "185", "200", "38 x 5 = 190."], ["Toán", 5, "Tính thương: 204 : 6 = ?", "34", "35", "33", "36", "Vì 6 x 34 = 204 nên 204 : 6 = 34."], ["Toán", 5, "Giá trị biểu thức 84 + 3 x 4 là bao nhiêu?", "96", "106", "86", "100", "3 x 4 = 12; 84 + 12 = 96."], ["Toán", 5, "Diện tích hình chữ nhật dài 35 cm, rộng 4 cm là bao nhiêu?", "140 cm²", "175 cm²", "105 cm²", "142 cm²", "Diện tích = 35 x 4 = 140 cm²."], ["Tiếng Việt", 5, "Dấu ngoặc kép trong văn bản thường dùng để làm gì?", "Dẫn lời nói trực tiếp của nhân vật", "Kết thúc câu hỏi", "Ngăn cách các vế liệt kê", "Thay cho dấu chấm", "Dấu ngoặc kép dùng trích dẫn lời nói trực tiếp."], ["Tiếng Việt", 5, "Câu 'Em rất thích đọc truyện cổ tích Việt Nam.' thuộc kiểu câu gì?", "Câu kể", "Câu hỏi", "Câu cảm", "Câu khiến", "Câu kể lại sở thích kết thúc bằng dấu chấm là câu kể."], ["Tiếng Anh", 5, "Đồ chơi 'teddy bear' là gì?", "Gấu bông", "Búp bê", "Ô tô", "Tàu hỏa", "Teddy bear là gấu bông."], ["Tiếng Anh", 5, "Đồ chơi 'truck' là món gì?", "Xe tải đồ chơi", "Máy bay", "Thuyền buồm", "Xe đạp", "Truck là xe tải."]], "lucas": [["Toán", 5, "Tính: 58 + 1 = ?", "59", "60", "58", "61", "58 + 1 = 59."], ["Toán", 5, "Tính: 64 - 1 = ?", "63", "64", "62", "65", "64 - 1 = 63."], ["Toán", 5, "Số liền sau của số 75 là số mấy?", "76", "77", "75", "78", "Sau số 75 là số 76."], ["Toán", 5, "Số gồm 6 chục và 0 đơn vị là số mấy?", "60", "70", "50", "61", "6 chục và 0 đơn vị là 60."], ["Toán", 5, "Tính nhẩm: 35 + 10 = ?", "45", "55", "35", "46", "35 + 10 = 45."], ["Toán", 5, "Trong rổ có 29 quả táo, thêm 2 quả nữa. Có tất cả mấy quả táo?", "31 quả táo", "32 quả táo", "30 quả táo", "33 quả táo", "29 + 2 = 31 quả táo."], ["Tiếng Việt", 5, "Từ nào có vần 'anh'?", "Bánh chưng", "Cái bát", "Con gà", "Quyển vở", "Tiếng 'bánh' có vần anh."], ["Tiếng Việt", 5, "Từ nào có vần 'oi'?", "Con voi", "Con mèo", "Con cá", "Con vịt", "Tiếng 'voi' có vần oi."], ["Tiếng Anh", 5, "Từ 'chair' là đồ vật gì?", "Cái ghế", "Cái bàn", "Quyển sách", "Cái mũ", "Chair là cái ghế."], ["Tiếng Anh", 5, "Từ 'bed' là đồ vật gì?", "Cái giường", "Cái túi", "Cái hộp", "Xe buýt", "Bed là cái giường."]]}, {"ten": "Trạm Vũ Trụ Mặt Trăng", "lucie": [["Toán", 5, "Tính tổng: 2556 + 1459 = ?", "4015", "4025", "4005", "4016", "2556 + 1459 = 4015."], ["Toán", 5, "Tính hiệu: 6104 - 2491 = ?", "3613", "3623", "3603", "3615", "6104 - 2491 = 3613."], ["Toán", 5, "Tính tích: 39 x 6 = ?", "234", "240", "228", "244", "39 x 6 = 234."], ["Toán", 5, "Tính thương: 245 : 7 = ?", "35", "36", "34", "37", "Vì 7 x 35 = 245 nên 245 : 7 = 35."], ["Toán", 5, "Giá trị biểu thức 87 + 4 x 5 là bao nhiêu?", "107", "117", "97", "112", "4 x 5 = 20; 87 + 20 = 107."], ["Toán", 5, "Diện tích hình chữ nhật dài 36 cm, rộng 5 cm là bao nhiêu?", "180 cm²", "216 cm²", "144 cm²", "182 cm²", "Diện tích = 36 x 5 = 180 cm²."], ["Tiếng Việt", 5, "Chọn từ viết đúng chính tả (nhóm hỏi/ngã):", "Suy nghĩ", "Suy nghỉ", "Xuy nghĩ", "Xuy nghỉ", "Viết đúng là 'suy nghĩ'."], ["Tiếng Anh", 5, "Hoạt động 'dancing' nghĩa là gì?", "Đang nhảy múa", "Đang hát", "Đang bơi", "Đang vẽ", "Dancing là đang nhảy múa."], ["Tiếng Anh", 5, "Hoạt động 'listening to music' nghĩa là gì?", "Đang nghe nhạc", "Đang xem phim", "Đang đọc sách", "Đang viết bài", "Listening to music là nghe nhạc."]], "lucas": [["Toán", 5, "Tính: 61 + 2 = ?", "63", "64", "62", "65", "61 + 2 = 63."], ["Toán", 5, "Tính: 66 - 2 = ?", "64", "65", "63", "66", "66 - 2 = 64."], ["Toán", 5, "Số liền trước của số 78 là số mấy?", "77", "78", "76", "79", "Trước số 78 là số 77."], ["Toán", 5, "Số gồm 6 chục và 2 đơn vị là số mấy?", "62", "72", "52", "63", "6 chục và 2 đơn vị là 62."], ["Toán", 5, "Tính nhẩm: 36 + 20 = ?", "56", "66", "46", "57", "36 + 20 = 56."], ["Toán", 5, "Trên đĩa có 34 chiếc bánh, ăn bớt 3 chiếc. Còn lại mấy chiếc bánh?", "31 chiếc bánh", "32 chiếc bánh", "30 chiếc bánh", "33 chiếc bánh", "34 - 3 = 31 chiếc bánh."], ["Tiếng Việt", 5, "Từ nào có vần 'ao'?", "Quả táo", "Cái bàn", "Quả cam", "Đôi dép", "Tiếng 'táo' có vần ao."], ["Tiếng Việt", 5, "Từ nào có vần 'em'?", "Cây kem", "Quả lê", "Con gà", "Cái bát", "Tiếng 'kem' có vần em."], ["Tiếng Anh", 5, "Từ 'cup' là đồ vật gì?", "Cái cốc", "Cái mũ", "Con mèo", "Ô tô", "Cup là cái cốc."], ["Tiếng Anh", 5, "Từ 'bus' là phương tiện gì?", "Xe buýt", "Xe đạp", "Máy bay", "Tàu thủy", "Bus là xe buýt."]]}, {"ten": "Vành Đai Sao Thổ", "lucie": [["Toán", 5, "Tính tổng: 2573 + 1472 = ?", "4045", "4055", "4035", "4046", "2573 + 1472 = 4045."], ["Toán", 5, "Tính hiệu: 6123 - 2503 = ?", "3620", "3630", "3610", "3622", "6123 - 2503 = 3620."], ["Toán", 5, "Tính tích: 40 x 7 = ?", "280", "287", "273", "290", "40 x 7 = 280."], ["Toán", 5, "Tính thương: 288 : 8 = ?", "36", "37", "35", "38", "Vì 8 x 36 = 288 nên 288 : 8 = 36."], ["Toán", 5, "Giá trị biểu thức 90 + 5 x 6 là bao nhiêu?", "120", "130", "110", "126", "5 x 6 = 30; 90 + 30 = 120."], ["Toán", 5, "Diện tích hình chữ nhật dài 37 cm, rộng 6 cm là bao nhiêu?", "222 cm²", "259 cm²", "185 cm²", "224 cm²", "Diện tích = 37 x 6 = 222 cm²."], ["Tiếng Việt", 5, "Chọn từ viết đúng chính tả (nhóm hỏi/ngã):", "Mạnh mẽ", "Mạnh mẻ", "Mạng mẽ", "Mạng mẻ", "Viết đúng là 'mạnh mẽ'."], ["Tiếng Việt", 5, "Từ nào không cùng nhóm: hoa đào, hoa mai, hoa cúc, cái quạt?", "Cái quạt", "Hoa đào", "Hoa mai", "Hoa cúc", "Cái quạt là đồ vật, không phải loài hoa."], ["Tiếng Anh", 5, "Từ 'thirteen' là số mấy?", "13", "3", "30", "14", "Thirteen là số 13."], ["Tiếng Anh", 5, "Từ 'seventeen' là số mấy?", "17", "7", "70", "16", "Seventeen là số 17."]], "lucas": [["Toán", 5, "Tính: 63 + 3 = ?", "66", "67", "65", "68", "63 + 3 = 66."], ["Toán", 5, "Tính: 68 - 3 = ?", "65", "66", "64", "67", "68 - 3 = 65."], ["Toán", 5, "Số liền sau của số 81 là số mấy?", "82", "83", "81", "84", "Sau số 81 là số 82."], ["Toán", 5, "Số gồm 6 chục và 4 đơn vị là số mấy?", "64", "74", "54", "65", "6 chục và 4 đơn vị là 64."], ["Toán", 5, "Tính nhẩm: 37 + 30 = ?", "67", "77", "57", "68", "37 + 30 = 67."], ["Toán", 5, "Trong rổ có 31 quả táo, thêm 4 quả nữa. Có tất cả mấy quả táo?", "35 quả táo", "36 quả táo", "34 quả táo", "37 quả táo", "31 + 4 = 35 quả táo."], ["Tiếng Việt", 5, "Từ nào có thanh sắc (´)?", "Con cá", "Con gà", "Con thỏ", "Con mèo", "Tiếng 'cá' có thanh sắc."], ["Tiếng Việt", 5, "Từ nào có thanh huyền (`)?", "Con mèo", "Con cá", "Con khỉ", "Con ngựa", "Tiếng 'mèo' có thanh huyền."], ["Tiếng Anh", 5, "Từ 'bike' là phương tiện gì?", "Xe đạp", "Ô tô", "Xe buýt", "Tàu hỏa", "Bike là xe đạp."], ["Tiếng Anh", 5, "Từ 'tree' nghĩa là gì?", "Cái cây", "Bông hoa", "Mặt trời", "Ngôi sao", "Tree là cái cây."]]}, {"ten": "Đấu Trường Tia Chớp", "lucie": [["Toán", 5, "Tính tổng: 2590 + 1485 = ?", "4075", "4085", "4065", "4076", "2590 + 1485 = 4075."], ["Toán", 5, "Tính hiệu: 6142 - 2515 = ?", "3627", "3637", "3617", "3629", "6142 - 2515 = 3627."], ["Toán", 5, "Tính tích: 41 x 8 = ?", "328", "336", "320", "338", "41 x 8 = 328."], ["Toán", 5, "Tính thương: 333 : 9 = ?", "37", "38", "36", "39", "Vì 9 x 37 = 333 nên 333 : 9 = 37."], ["Toán", 5, "Giá trị biểu thức 93 + 6 x 7 là bao nhiêu?", "135", "145", "125", "142", "6 x 7 = 42; 93 + 42 = 135."], ["Toán", 5, "Diện tích hình chữ nhật dài 38 cm, rộng 7 cm là bao nhiêu?", "266 cm²", "304 cm²", "228 cm²", "268 cm²", "Diện tích = 38 x 7 = 266 cm²."], ["Tiếng Việt", 5, "Từ nào không cùng nhóm: bác sĩ, y tá, giáo viên, bệnh viện?", "Bệnh viện", "Bác sĩ", "Y tá", "Giáo viên", "Bệnh viện là địa điểm, không phải nghề nghiệp."], ["Tiếng Việt", 5, "Từ nào chỉ cảm xúc hồi hộp, mong chờ?", "Háo hức", "Buồn bã", "Giận dỗi", "Chán nản", "Háo hức tả cảm xúc mong chờ đầy vui vẻ."], ["Tiếng Anh", 5, "Thời tiết 'snowy' nghĩa là trời thế nào?", "Trời có tuyết rơi", "Trời nắng", "Trời có gió", "Trời nóng", "Snowy là có tuyết."], ["Tiếng Anh", 5, "Thời tiết 'hot' nghĩa là trời thế nào?", "Trời nóng", "Trời lạnh", "Trời mát", "Trời mưa", "Hot là nóng."]], "lucas": [["Toán", 5, "Tính: 65 + 4 = ?", "69", "70", "68", "71", "65 + 4 = 69."], ["Toán", 5, "Tính: 75 - 4 = ?", "71", "72", "70", "73", "75 - 4 = 71."], ["Toán", 5, "Số liền trước của số 84 là số mấy?", "83", "84", "82", "85", "Trước số 84 là số 83."], ["Toán", 5, "Số gồm 6 chục và 6 đơn vị là số mấy?", "66", "76", "56", "67", "6 chục và 6 đơn vị là 66."], ["Toán", 5, "Tính nhẩm: 38 + 40 = ?", "78", "88", "68", "79", "38 + 40 = 78."], ["Toán", 5, "Trên đĩa có 38 chiếc bánh, ăn bớt 5 chiếc. Còn lại mấy chiếc bánh?", "33 chiếc bánh", "34 chiếc bánh", "32 chiếc bánh", "35 chiếc bánh", "38 - 5 = 33 chiếc bánh."], ["Tiếng Việt", 5, "Từ nào có thanh hỏi (̉)?", "Con thỏ", "Con cá", "Con gà", "Con voi", "Tiếng 'thỏ' có thanh hỏi."], ["Tiếng Việt", 5, "Từ nào có thanh nặng (.)?", "Con ngựa", "Con mèo", "Con cá", "Con thỏ", "Tiếng 'ngựa' có thanh nặng."], ["Tiếng Anh", 5, "Từ 'flower' nghĩa là gì?", "Bông hoa", "Cái cây", "Đám mây", "Cơn mưa", "Flower là bông hoa."], ["Tiếng Anh", 5, "Từ 'dad' chỉ ai?", "Bố", "Mẹ", "Bà", "Bạn", "Dad là bố."]]}, {"ten": "Siêu Đường Đua Hoàng Hôn", "lucie": [["Toán", 5, "Tính tổng: 2607 + 1498 = ?", "4105", "4115", "4095", "4106", "2607 + 1498 = 4105."], ["Toán", 5, "Tính hiệu: 6161 - 2527 = ?", "3634", "3644", "3624", "3636", "6161 - 2527 = 3634."], ["Toán", 5, "Tính tích: 42 x 2 = ?", "84", "86", "82", "94", "42 x 2 = 84."], ["Toán", 5, "Tính thương: 114 : 3 = ?", "38", "39", "37", "40", "Vì 3 x 38 = 114 nên 114 : 3 = 38."], ["Toán", 5, "Giá trị biểu thức 96 + 7 x 8 là bao nhiêu?", "152", "162", "142", "160", "7 x 8 = 56; 96 + 56 = 152."], ["Toán", 5, "Diện tích hình chữ nhật dài 39 cm, rộng 8 cm là bao nhiêu?", "312 cm²", "351 cm²", "273 cm²", "314 cm²", "Diện tích = 39 x 8 = 312 cm²."], ["Tiếng Việt", 5, "Từ láy nào tả tiếng gió thổi nhẹ qua hàng cây?", "Xào xạc", "Ầm ầm", "Lạch bạch", "Líu lo", "Xào xạc tả tiếng lá cây lay động trong gió."], ["Tiếng Việt", 5, "Từ láy nào tả ánh nắng tươi sáng rực rỡ?", "Chói chang", "Âm u", "Mờ mịt", "Lành lạnh", "Chói chang tả ánh nắng mạnh và rực rỡ."], ["Tiếng Anh", 5, "Chọn từ đúng: 'I ___ a student in Class 3A6.'", "am", "is", "are", "be", "Chủ ngữ 'I' đi với 'am'."], ["Tiếng Anh", 5, "Chọn từ đúng: 'They ___ playing football in the yard.'", "are", "is", "am", "does", "Chủ ngữ số nhiều 'They' đi với 'are'."]], "lucas": [["Toán", 5, "Tính: 67 + 1 = ?", "68", "69", "67", "70", "67 + 1 = 68."], ["Toán", 5, "Tính: 72 - 1 = ?", "71", "72", "70", "73", "72 - 1 = 71."], ["Toán", 5, "Số liền sau của số 87 là số mấy?", "88", "89", "87", "90", "Sau số 87 là số 88."], ["Toán", 5, "Số gồm 6 chục và 8 đơn vị là số mấy?", "68", "78", "58", "69", "6 chục và 8 đơn vị là 68."], ["Toán", 5, "Tính nhẩm: 39 + 10 = ?", "49", "59", "39", "50", "39 + 10 = 49."], ["Toán", 5, "Trong rổ có 33 quả táo, thêm 2 quả nữa. Có tất cả mấy quả táo?", "35 quả táo", "36 quả táo", "34 quả táo", "37 quả táo", "33 + 2 = 35 quả táo."], ["Tiếng Việt", 5, "Quả nào vỏ xanh ruột đỏ nhiều hạt đen?", "Quả dưa hấu", "Quả chuối", "Quả chanh", "Quả lê", "Dưa hấu vỏ xanh ruột đỏ ngọt mát."], ["Tiếng Việt", 5, "Quả nào vỏ vàng hình cong ăn thơm ngọt?", "Quả chuối", "Quả cà chua", "Củ cải", "Quả ớt", "Quả chuối chín có vỏ vàng thơm ngọt."], ["Tiếng Anh", 5, "Từ 'mom' chỉ ai?", "Mẹ", "Bố", "Ông", "Anh", "Mom là mẹ."], ["Tiếng Anh", 5, "Từ 'eyes' là bộ phận nào?", "Đôi mắt", "Đôi tai", "Cái mũi", "Bàn tay", "Eyes là đôi mắt."]]}, {"ten": "Chung Kết Cúp Vô Địch 3D", "lucie": [["Toán", 5, "Tính tổng: 2624 + 1511 = ?", "4135", "4145", "4125", "4136", "2624 + 1511 = 4135."], ["Toán", 5, "Tính hiệu: 6180 - 2539 = ?", "3641", "3651", "3631", "3643", "6180 - 2539 = 3641."], ["Toán", 5, "Tính tích: 43 x 3 = ?", "129", "132", "126", "139", "43 x 3 = 129."], ["Toán", 5, "Tính thương: 156 : 4 = ?", "39", "40", "38", "41", "Vì 4 x 39 = 156 nên 156 : 4 = 39."], ["Toán", 5, "Giá trị biểu thức 99 + 8 x 4 là bao nhiêu?", "131", "141", "121", "135", "8 x 4 = 32; 99 + 32 = 131."], ["Toán", 5, "Diện tích hình chữ nhật dài 40 cm, rộng 9 cm là bao nhiêu?", "360 cm²", "400 cm²", "320 cm²", "362 cm²", "Diện tích = 40 x 9 = 360 cm²."], ["Tiếng Việt", 5, "Tục ngữ 'Uống nước nhớ nguồn' khuyên chúng ta sống thế nào?", "Biết ơn những người đã giúp đỡ, sinh thành ra mình", "Phải uống đủ nước mỗi ngày", "Tìm nguồn nước sạch", "Không lãng phí nước", "Uống nước nhớ nguồn nhấn mạnh lòng biết ơn."], ["Tiếng Việt", 5, "Thành ngữ 'Đồng tâm hiệp lực' có nghĩa là gì?", "Cùng chung suy nghĩ và sức mạnh để hoàn thành việc lớn", "Làm việc một mình", "Chạy thật nhanh", "Học thuộc lòng", "Đồng tâm hiệp lực nói về tinh thần đoàn kết cao."], ["Tiếng Anh", 5, "Từ 'weekend' có nghĩa là gì?", "Cuối tuần", "Đầu tuần", "Buổi sáng", "Ngày mai", "Weekend là dịp cuối tuần."], ["Tiếng Anh", 5, "Từ 'birthday' có nghĩa là gì?", "Ngày sinh nhật", "Ngày lễ", "Kỳ nghỉ hè", "Ngày khai giảng", "Birthday là ngày sinh nhật."]], "lucas": [["Toán", 5, "Tính: 67 + 2 = ?", "69", "70", "68", "71", "67 + 2 = 69."], ["Toán", 5, "Tính: 74 - 2 = ?", "72", "73", "71", "74", "74 - 2 = 72."], ["Toán", 5, "Số liền trước của số 90 là số mấy?", "89", "90", "88", "91", "Trước số 90 là số 89."], ["Toán", 5, "Số gồm 7 chục và 0 đơn vị là số mấy?", "70", "80", "60", "71", "7 chục và 0 đơn vị là 70."], ["Toán", 5, "Tính nhẩm: 40 + 20 = ?", "60", "70", "50", "61", "40 + 20 = 60."], ["Toán", 5, "Trên đĩa có 38 chiếc bánh, ăn bớt 3 chiếc. Còn lại mấy chiếc bánh?", "35 chiếc bánh", "36 chiếc bánh", "34 chiếc bánh", "37 chiếc bánh", "38 - 3 = 35 chiếc bánh."], ["Tiếng Việt", 5, "Khi gặp ông bà, bé nên làm gì?", "Khoanh tay chào lễ phép", "Chạy đi ngay", "Quay mặt đi", "Không nói gì", "Bé ngoan luôn chào hỏi lễ phép."], ["Tiếng Việt", 5, "Trước khi ăn cơm, bé cần làm gì?", "Rửa tay sạch bằng xà phòng", "Chạy nhảy quanh bàn", "Bốc thức ăn ngay", "Đi ngủ", "Rửa tay sạch giúp bảo vệ sức khỏe."], ["Tiếng Anh", 5, "Từ 'nose' là bộ phận nào?", "Cái mũi", "Đôi mắt", "Đôi tai", "Bàn chân", "Nose là cái mũi."], ["Tiếng Anh", 5, "Từ 'hand' là bộ phận nào?", "Bàn tay", "Cái đầu", "Đôi mắt", "Đôi tai", "Hand là bàn tay."]]}];
function giaiDX(c) { return Math.min(30, Math.max(1, +LS.get("duaXe_giai_" + c, 1) || 1)); }
function buildQuestions(c) {
  const g = giaiDX(c), rieng = ((GIAI_DX[g - 1] || {})[c] || []).concat(((GIAI_DX[g - 2] || {})[c] || []));
  if (rieng.length >= 10) {
    const L = shuffle(rieng.map((r, i) => ({ i: 100000 + i, mon: r[0], muc: +r[1] || 1, q: r[2], dung: r[3], sai: [r[4], r[5], r[6]].filter(Boolean), gt: r[7] || "" })));
    const out = []; while (out.length < N_CHANG * GATES_PER) out.push(L[out.length % L.length]); return out;
  }
  const all = (DATA[c] || []).map((r, i) => ({ i, mon: r[0], muc: +r[1] || 1, q: r[2], dung: r[3], sai: [r[4], r[5], r[6]].filter(Boolean), gt: r[7] || "" }));
  const seenKey = "duaXe_daHoi_" + c; let seen = LS.get(seenKey, []);
  if (all.length - seen.length < N_CHANG * GATES_PER) seen = [];
  const fresh = all.filter(q => !seen.includes(q.i)), old = all.filter(q => seen.includes(q.i));
  const want = [[1, 1, 1, 2, 1], [1, 2, 1, 2, 2], [2, 2, 3, 2, 3], [3, 2, 3, 3, 3]];
  const out = [], used = new Set();
  const mons = shuffle(["Toán", "Tiếng Việt", "Tiếng Anh"]);
  let mi = 0;
  want.forEach(row => row.forEach(lv => {
    const mon = c === "lucas" && Math.random() < 0.55 ? (Math.random() < 0.5 ? "Toán" : "Tiếng Việt") : mons[mi++ % 3];
    const tryPools = [
      fresh.filter(q => q.muc === lv && q.mon === mon), fresh.filter(q => q.muc === lv), fresh.filter(q => Math.abs(q.muc - lv) <= 1),
      fresh, old.filter(q => q.muc === lv), old, all];
    for (const p of tryPools) { const cand = p.filter(q => !used.has(q.i)); if (cand.length) { const q = pick(cand); used.add(q.i); out.push(q); break; } }
  }));
  LS.set(seenKey, seen.concat(out.map(q => q.i)));
  return out;
}

function buildGatesFor(qs) {
  const gates = [];
  for (let s = 0; s < N_CHANG; s++) for (let k = 0; k < GATES_PER; k++) {
    const pos = s * CHANG_LEN + 190 + k * 165;
    gates.push({ s: pos, q: qs[gates.length], opts: null, done: false, shown: false, res: null, locked: false, shattered: false });
  }
  return gates;
}
function buildObjsFor(gatesRef) {
  const objs = [];
  const nearGate = p => gatesRef.some(g => p > g.s - Q_AHEAD - 25 && p < g.s + 25);
  for (let p = 90; p < RACE_LEN - 40; p += 18) {
    if (nearGate(p)) continue;
    const r = Math.random();
    if (r < 0.36) { const ln = Math.floor(Math.random() * 3); for (let k = 0; k < 4; k++) objs.push({ t: "coin", s: p + k * 4, lane: ln }); p += 12; }
    else if (r < 0.5 && p > 150) objs.push({ t: "cone", s: p, lane: Math.floor(Math.random() * 3) });
    else if (r < 0.56) objs.push({ t: "nitro", s: p, lane: Math.floor(Math.random() * 3) });
  }
  gatesRef.forEach(g => { for (let k = 0; k < 5; k++) objs.push({ t: "coin", s: g.s + 14 + k * 4, lane: 1 }); });
  // trái tim hồi lượt sai: 2 quả mỗi chặng, đặt xa cổng, làn ngẫu nhiên (đôi khi có nón chắn bên cạnh cho thử thách)
  for (let st = 0; st < N_CHANG; st++) {
    let dat = 0;
    for (let tries = 0; tries < 60 && dat < 2; tries++) {
      const pos = st * CHANG_LEN + rnd(120, CHANG_LEN - 60);
      if (nearGate(pos) || objs.some(o => o.t === "tim" && Math.abs(o.s - pos) < 200)) continue;
      const ln = Math.floor(Math.random() * 3);
      for (let i = objs.length - 1; i >= 0; i--) if (Math.abs(objs[i].s - pos) < 9) objs.splice(i, 1);
      objs.push({ t: "tim", s: pos, lane: ln });
      if (Math.random() < 0.5) objs.push({ t: "cone", s: pos - 10, lane: ln });
      dat++;
    }
  }
  objs.sort((a, b) => a.s - b.s);
  return objs;
}
function layout() {
  G.gates = buildGatesFor(G.qs);
  G.objs = buildObjsFor(G.gates);
}

/* ================= KẾT XUẤT 3D (Three.js) ================= */
let R3 = null;
function hasWebGL() { try { const c = document.createElement("canvas"); return !!(window.THREE && (c.getContext("webgl") || c.getContext("experimental-webgl"))); } catch (e) { return false; } }
function canvasTex(w, h, draw) { const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t; }
function roundRect(x, X, Y, w, h, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r); x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath(); }

function makeCar(color, driver, rival, childOverride) {
  const T = THREE, g = new T.Group();
  const paint = new T.MeshLambertMaterial({ color }), dark = new T.MeshLambertMaterial({ color: 0x1f2937 }), chrome = new T.MeshLambertMaterial({ color: 0xe5e7eb }), glass = new T.MeshLambertMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.7 });
  const body = new T.Mesh(new T.BoxGeometry(1.9, 0.5, 3.8), paint); body.position.y = 0.55; g.add(body);
  const nose = new T.Mesh(new T.BoxGeometry(1.7, 0.32, 1.1), paint); nose.position.set(0, 0.5, -2.3); g.add(nose);
  const side1 = new T.Mesh(new T.BoxGeometry(0.25, 0.42, 2.2), paint); side1.position.set(-1.05, 0.55, 0.1); g.add(side1);
  const side2 = side1.clone(); side2.position.x = 1.05; g.add(side2);
  const stripe = new T.Mesh(new T.BoxGeometry(0.45, 0.52, 4.9), new T.MeshLambertMaterial({ color: 0xffffff })); stripe.position.set(0, 0.56, -0.5); g.add(stripe);
  const ws = new T.Mesh(new T.BoxGeometry(1.5, 0.45, 0.08), glass); ws.position.set(0, 1.0, -0.55); ws.rotation.x = -0.5; g.add(ws);
  const seat = new T.Mesh(new T.BoxGeometry(1.0, 0.7, 0.3), dark); seat.position.set(0, 1.0, 0.75); g.add(seat);
  const sp1 = new T.Mesh(new T.BoxGeometry(2.1, 0.12, 0.5), dark); sp1.position.set(0, 1.25, 1.75); g.add(sp1);
  [-0.7, 0.7].forEach(x => { const p = new T.Mesh(new T.BoxGeometry(0.12, 0.5, 0.2), dark); p.position.set(x, 1.0, 1.75); g.add(p); });
  const wheels = [];
  [[-1.0, -1.25], [1.0, -1.25], [-1.0, 1.25], [1.0, 1.25]].forEach(([x, z]) => {
    const w = new T.Mesh(new T.CylinderGeometry(0.42, 0.42, 0.38, 16), dark); w.rotation.z = Math.PI / 2; w.position.set(x * 1.02, 0.42, z); g.add(w); wheels.push(w);
    const hub = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.4, 10), chrome); hub.rotation.z = Math.PI / 2; hub.position.copy(w.position); g.add(hub);
  });
  const flames = [], trails = [];
  [-0.5, 0.5].forEach(x => {
    const ex = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 0.35, 8), chrome); ex.rotation.x = Math.PI / 2; ex.position.set(x, 0.45, 2.0); g.add(ex);
    const fl = new T.Mesh(new T.ConeGeometry(0.26, 2.5, 10), new T.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 })); fl.rotation.x = Math.PI / 2; fl.position.set(x, 0.45, 3.25); fl.visible = false; g.add(fl); flames.push(fl);
    const core = new T.Mesh(new T.ConeGeometry(0.14, 1.6, 8), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 })); core.rotation.x = Math.PI / 2; core.position.set(x, 0.45, 2.8); core.visible = false; g.add(core); flames.push(core);
  });
  [-0.95, 0.95].forEach(x => {
    const tr = new T.Mesh(new T.PlaneGeometry(0.28, 8.0), new T.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.78, side: T.DoubleSide }));
    tr.rotation.x = -Math.PI / 2; tr.position.set(x, 0.05, 5.4); tr.visible = false; g.add(tr); trails.push(tr);
  });
  const head = new T.Group(); head.position.set(0, 1.55, 0.45); g.add(head);
  const neck = new T.Mesh(new T.BoxGeometry(0.75, 0.5, 0.5), new T.MeshLambertMaterial({ color: driver === "player" ? 0xffffff : rival.da })); neck.position.set(0, 1.2, 0.45); g.add(neck);
  if (driver === "player") {
    const cId = childOverride || G.child;
    const helmet = new T.Mesh(new T.SphereGeometry(0.5, 20, 16), paint); head.add(helmet);
    const visorBack = new T.Mesh(new T.SphereGeometry(0.505, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.35), new T.MeshLambertMaterial({ color: 0xffffff })); head.add(visorBack);
    if (window.MatThat) { const f = MatThat.dan(head, cId, { r: 0.42, y: -0.02, z: 0.53 }); const b = MatThat.dan(head, cId, { r: 0.42, y: -0.02, z: -0.53 }); if (b) b.rotation.y = Math.PI; void f; }
  } else {
    const skin = new T.MeshLambertMaterial({ color: rival.da });
    const hd = new T.Mesh(new T.SphereGeometry(0.5, 18, 14), skin); head.add(hd);
    if (rival.tai === "tho") [-0.18, 0.18].forEach(x => { const e = new T.Mesh(new T.CylinderGeometry(0.09, 0.12, 0.9, 8), skin); e.position.set(x, 0.75, 0); e.rotation.z = x * 0.6; head.add(e); const ei = new T.Mesh(new T.CylinderGeometry(0.05, 0.07, 0.7, 6), new T.MeshLambertMaterial({ color: 0xf9a8d4 })); ei.position.set(x, 0.75, -0.06); ei.rotation.z = x * 0.6; head.add(ei); });
    if (rival.tai === "cao") [-0.28, 0.28].forEach(x => { const e = new T.Mesh(new T.ConeGeometry(0.17, 0.45, 4), skin); e.position.set(x, 0.5, 0); head.add(e); });
    if (rival.tai === "gau") [-0.33, 0.33].forEach(x => { const e = new T.Mesh(new T.SphereGeometry(0.17, 10, 8), skin); e.position.set(x, 0.42, 0); head.add(e); });
    const tx = new T.TextureLoader().load(ANH + rival.anh + ".webp");
    [0.53, -0.53].forEach(z => { const m = new T.Mesh(new T.CircleGeometry(0.42, 32), new T.MeshBasicMaterial({ map: tx })); m.position.z = z; if (z < 0) m.rotation.y = Math.PI; head.add(m); });
  }
  const shadow = new T.Mesh(new T.PlaneGeometry(2.4, 4.6), new T.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28 })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.02; g.add(shadow);
  g.userData = { wheels, flames, trails, body: g };
  return g;
}

function makeGateMesh(text, lane, color) {
  const T = THREE, g = new T.Group();
  const col = new T.MeshLambertMaterial({ color });
  [-1.45, 1.45].forEach(x => { const p = new T.Mesh(new T.BoxGeometry(0.3, 3.4, 0.3), col); p.position.set(x, 1.7, 0); g.add(p); });
  const tex = canvasTex(512, 200, (x, w, h) => {
    x.fillStyle = color; roundRect(x, 0, 0, w, h, 34); x.fill();
    x.fillStyle = "rgba(255,255,255,.95)"; roundRect(x, 14, 14, w - 28, h - 28, 26); x.fill();
    x.fillStyle = "#1e1b4b"; let fs = 104; x.font = "800 " + fs + "px 'Baloo 2',sans-serif";
    while (x.measureText(text).width > w - 60 && fs > 30) { fs -= 4; x.font = "800 " + fs + "px 'Baloo 2',sans-serif"; }
    x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(text, w / 2, h / 2 + 6);
  });
  const board = new T.Mesh(new T.PlaneGeometry(3.1, 1.21), new T.MeshBasicMaterial({ map: tex, transparent: true }));
  board.position.set(0, 3.7, 0); g.add(board);
  const back = new T.Mesh(new T.PlaneGeometry(3.1, 1.21), col); back.position.set(0, 3.7, -0.02); back.rotation.y = Math.PI; g.add(back);
  const num = canvasTex(128, 128, (x) => { x.fillStyle = color; x.beginPath(); x.arc(64, 64, 60, 0, 7); x.fill(); x.fillStyle = "#fff"; x.font = "800 84px sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(String(lane + 1), 64, 70); });
  const nb = new T.Mesh(new T.CircleGeometry(0.42, 24), new T.MeshBasicMaterial({ map: num })); nb.position.set(0, 4.65, 0.01); g.add(nb);
  const strip = new T.Mesh(new T.PlaneGeometry(2.8, 1.2), new T.MeshBasicMaterial({ color, transparent: true, opacity: 0.55 })); strip.rotation.x = -Math.PI / 2; strip.position.set(0, 0.03, 0); g.add(strip);
  g.position.x = LANES[lane];
  return g;
}

function initThree() {
  const T = THREE, cv = $("cv");
  const renderer = new T.WebGLRenderer({ canvas: cv, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
  const scene = new T.Scene();
  const cam = new T.PerspectiveCamera(62, 1, 0.1, 600);
  const cam2 = new T.PerspectiveCamera(62, 1, 0.1, 600);
  scene.fog = new T.Fog(0xbfe6ff, 60, 260);
  scene.add(new T.HemisphereLight(0xffffff, 0x667788, 0.85));
  const sun = new T.DirectionalLight(0xffffff, 0.75); sun.position.set(-20, 40, 10); scene.add(sun);

  const skyTex = canvasTex(4, 256, (x, w, h) => { const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, "#6ec6ff"); gr.addColorStop(1, "#d8f1ff"); x.fillStyle = gr; x.fillRect(0, 0, w, h); });
  const sky = new T.Mesh(new T.SphereGeometry(400, 24, 12), new T.MeshBasicMaterial({ map: skyTex, side: T.BackSide, fog: false })); scene.add(sky);
  const ground = new T.Mesh(new T.PlaneGeometry(800, 800), new T.MeshLambertMaterial({ color: 0x6b7280 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.02; scene.add(ground);
  const roadTex = canvasTex(256, 256, () => {});
  const drawRoad = col => { const c = roadTex.image, x = c.getContext("2d"); x.fillStyle = col; x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 400; i++) { x.fillStyle = "rgba(255,255,255," + Math.random() * 0.05 + ")"; x.fillRect(Math.random() * 256, Math.random() * 256, 2, 2); }
    x.fillStyle = "#fff"; [256 * 0.333, 256 * 0.667].forEach(px => x.fillRect(px - 3, 0, 6, 128));
    x.fillStyle = "#ffd400"; x.fillRect(6, 0, 7, 256); x.fillRect(243, 0, 7, 256);
    roadTex.needsUpdate = true; };
  drawRoad("#3a3f4b");
  roadTex.wrapS = roadTex.wrapT = T.RepeatWrapping; roadTex.repeat.set(1, 30);
  const road = new T.Mesh(new T.PlaneGeometry(10.4, 300), new T.MeshLambertMaterial({ map: roadTex })); road.rotation.x = -Math.PI / 2; road.position.set(0, 0.01, -130); scene.add(road);
  const curbTex = canvasTex(16, 64, (x) => { x.fillStyle = "#ef4444"; x.fillRect(0, 0, 16, 32); x.fillStyle = "#fff"; x.fillRect(0, 32, 16, 32); });
  curbTex.wrapS = curbTex.wrapT = T.RepeatWrapping; curbTex.repeat.set(1, 75);
  const curbs = [-5.6, 5.6].map(x => { const m = new T.Mesh(new T.PlaneGeometry(0.9, 300), new T.MeshLambertMaterial({ map: curbTex })); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.015, -130); scene.add(m); return m; });
  const sea = new T.Mesh(new T.PlaneGeometry(400, 800), new T.MeshLambertMaterial({ color: 0x1ea7e8, transparent: true, opacity: 0.95 })); sea.rotation.x = -Math.PI / 2; sea.position.set(230, 0.0, -100); sea.visible = false; scene.add(sea);
  const mountains = new T.Group(); scene.add(mountains);
  for (let i = 0; i < 9; i++) {
    const m = new T.Mesh(new T.ConeGeometry(rnd(30, 55), rnd(45, 85), 6), new T.MeshLambertMaterial({ color: 0x8aa3c2 }));
    m.position.set(-200 + i * 50, 15, -330 + rnd(-20, 20)); mountains.add(m);
    const cap = new T.Mesh(new T.ConeGeometry(m.geometry.parameters.radius * 0.38, m.geometry.parameters.height * 0.38, 6), new T.MeshLambertMaterial({ color: 0xffffff }));
    cap.position.set(m.position.x, m.position.y + m.geometry.parameters.height * 0.31, m.position.z); mountains.add(cap);
  }

  const M = (c) => new T.MeshLambertMaterial({ color: c });
  const winTex = canvasTex(64, 128, (x) => { x.fillStyle = "#fff"; x.fillRect(0, 0, 64, 128); for (let r = 0; r < 8; r++) for (let c = 0; c < 4; c++) { x.fillStyle = Math.random() < 0.6 ? "#1e3a5f" : "#ffe08a"; x.fillRect(4 + c * 15, 4 + r * 15, 10, 10); } });
  winTex.wrapS = winTex.wrapT = T.RepeatWrapping;
  const builders = [
    () => { const g = new T.Group(), h = rnd(8, 26), w = rnd(5, 9), cols = [0xf87171, 0x60a5fa, 0xfbbf24, 0xa78bfa, 0x34d399, 0xfb923c];
      const tx = winTex.clone(); tx.needsUpdate = true; tx.repeat.set(1, h / 10);
      const b = new T.Mesh(new T.BoxGeometry(w, h, w), new T.MeshLambertMaterial({ color: pick(cols), map: tx })); b.position.y = h / 2; g.add(b);
      const roof = new T.Mesh(new T.BoxGeometry(w + 0.6, 0.6, w + 0.6), M(0x334155)); roof.position.y = h + 0.3; g.add(roof); return g; },
    () => { const g = new T.Group();
      if (Math.random() < 0.35) { const h = new T.Mesh(new T.BoxGeometry(4, 2.6, 3.4), M(0xfef3c7)); h.position.y = 1.3; g.add(h); const r = new T.Mesh(new T.ConeGeometry(3.3, 2, 4), M(0xb45309)); r.position.y = 3.6; r.rotation.y = Math.PI / 4; g.add(r); }
      else { const t = new T.Mesh(new T.CylinderGeometry(0.25, 0.35, 3, 6), M(0x8b5a2b)); t.position.y = 1.5; g.add(t); const l = new T.Mesh(new T.SphereGeometry(rnd(1.6, 2.4), 10, 8), M(pick([0x22c55e, 0x16a34a, 0x4ade80]))); l.position.y = 3.8; g.add(l); }
      for (let i = 0; i < 3; i++) { const p = new T.Mesh(new T.BoxGeometry(rnd(3, 5), 0.6, rnd(3, 5)), M(0xd9c34a)); p.position.set(rnd(-4, 4), 0.3, rnd(-4, 4)); g.add(p); }
      return g; },
    () => { const g = new T.Group(), h = rnd(5, 8);
      for (let i = 0; i < 6; i++) { const s = new T.Mesh(new T.CylinderGeometry(0.22, 0.28, h / 6 + 0.05, 6), M(0xa16207)); s.position.set(i * 0.12, h / 12 + i * h / 6, 0); g.add(s); }
      for (let i = 0; i < 6; i++) { const lf = new T.Mesh(new T.BoxGeometry(3.4, 0.12, 0.8), M(0x16a34a)); lf.position.set(0.7, h, 0); lf.rotation.y = i * Math.PI / 3; lf.rotation.z = -0.35; lf.geometry.translate(1.5, 0, 0); g.add(lf); }
      if (Math.random() < 0.4) { const u = new T.Mesh(new T.ConeGeometry(2, 1, 12), M(pick([0xf43f5e, 0x3b82f6, 0xfacc15]))); u.position.set(rnd(-2, 2), 2.5, 2); g.add(u); }
      return g; },
    () => { const g = new T.Group(), n = 1 + Math.floor(Math.random() * 3);
      for (let k = 0; k < n; k++) { const h = rnd(4, 8), x = rnd(-3, 3), z = rnd(-3, 3);
        const tr = new T.Mesh(new T.CylinderGeometry(0.2, 0.25, 1.2, 6), M(0x6b4423)); tr.position.set(x, 0.6, z); g.add(tr);
        for (let j = 0; j < 3; j++) { const c = new T.Mesh(new T.ConeGeometry(h * 0.33 * (1 - j * 0.22), h * 0.42, 8), M(j % 2 ? 0xffffff : 0x166534)); c.position.set(x, 1.2 + h * 0.18 + j * h * 0.22, z); g.add(c); } }
      if (Math.random() < 0.3) { const sm = new T.Group(); [1, 0.7, 0.45].forEach((r, i) => { const b = new T.Mesh(new T.SphereGeometry(r, 12, 10), M(0xffffff)); b.position.y = r + (i ? [0, 1.6, 2.6][i] : 0); sm.add(b); }); const n2 = new T.Mesh(new T.ConeGeometry(0.1, 0.5, 6), M(0xf97316)); n2.rotation.x = Math.PI / 2; n2.position.set(0, 3.1, 0.45); sm.add(n2); sm.position.set(rnd(-2, 2), 0, 3); g.add(sm); }
      return g; }
  ];
  const props = [];
  for (let i = 0; i < 44; i++) props.push({ s: 0, side: i % 2 ? 1 : -1, mesh: null, st: -1 });

  const coinGeo = new T.CylinderGeometry(0.55, 0.55, 0.14, 20), coinMat = new T.MeshLambertMaterial({ color: 0xffcc00, emissive: 0x664400 });
  const coinTex = new T.TextureLoader().load("../anh-chung/xu-ciecas-nho.webp");
  const coinFace = new T.MeshBasicMaterial({ map: coinTex, transparent: true });
  const mk = {
    coin: () => { const g = new T.Group(), c = new T.Mesh(coinGeo, coinMat); c.rotation.x = Math.PI / 2; g.add(c); [0.075, -0.075].forEach(z => { const f = new T.Mesh(new T.CircleGeometry(0.5, 20), coinFace); f.position.z = z; if (z < 0) f.rotation.y = Math.PI; g.add(f); }); g.position.y = 1; return g; },
    cone: () => { const g = new T.Group(), c = new T.Mesh(new T.ConeGeometry(0.5, 1.2, 12), M(0xf97316)); c.position.y = 0.6; g.add(c); const b = new T.Mesh(new T.CylinderGeometry(0.33, 0.4, 0.2, 12), M(0xffffff)); b.position.y = 0.55; g.add(b); const base = new T.Mesh(new T.BoxGeometry(1.1, 0.1, 1.1), M(0xf97316)); base.position.y = 0.05; g.add(base); return g; },
    tim: () => { const g = new T.Group(), sh = new T.Shape();
      sh.moveTo(0, -0.55); sh.bezierCurveTo(-0.15, -0.38, -0.62, -0.1, -0.62, 0.22); sh.bezierCurveTo(-0.62, 0.52, -0.25, 0.62, 0, 0.36);
      sh.bezierCurveTo(0.25, 0.62, 0.62, 0.52, 0.62, 0.22); sh.bezierCurveTo(0.62, -0.1, 0.15, -0.38, 0, -0.55);
      const h = new T.Mesh(new T.ExtrudeGeometry(sh, { depth: 0.3, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.06, bevelSegments: 3 }), new T.MeshLambertMaterial({ color: 0xff2d55, emissive: 0x7a0019 }));
      h.geometry.center(); h.scale.setScalar(1.25); h.position.y = 1.35; g.add(h);
      const ring = new T.Mesh(new T.TorusGeometry(1.0, 0.07, 8, 28), new T.MeshBasicMaterial({ color: 0xffd1dc, transparent: true, opacity: 0.8 })); ring.position.y = 1.35; g.add(ring);
      const glow = new T.Mesh(new T.CircleGeometry(0.9, 24), new T.MeshBasicMaterial({ color: 0xff7aa2, transparent: true, opacity: 0.35 })); glow.rotation.x = -Math.PI / 2; glow.position.y = 0.04; g.add(glow);
      return g; },
    nitro: () => { const g = new T.Group(), c = new T.Mesh(new T.CylinderGeometry(0.42, 0.42, 1.2, 14), new T.MeshLambertMaterial({ color: 0x22d3ee, emissive: 0x0e4a5a })); c.position.y = 1; g.add(c); const t = new T.Mesh(new T.CylinderGeometry(0.2, 0.2, 0.3, 10), M(0xe5e7eb)); t.position.y = 1.7; g.add(t); const s = new T.Mesh(new T.TorusGeometry(0.43, 0.06, 6, 18), M(0xa78bfa)); s.rotation.x = Math.PI / 2; s.position.y = 1; g.add(s); return g; }
  };
  const finTex = canvasTex(256, 64, (x) => { for (let i = 0; i < 16; i++) for (let j = 0; j < 4; j++) { x.fillStyle = (i + j) % 2 ? "#111" : "#fff"; x.fillRect(i * 16, j * 16, 16, 16); } });
  function archMesh(label, color, checker) {
    const g = new T.Group(), col = M(color);
    [-6.3, 6.3].forEach(x => { const p = new T.Mesh(new T.BoxGeometry(0.6, 7, 0.6), col); p.position.set(x, 3.5, 0); g.add(p); });
    const tx = canvasTex(1024, 128, (x, w, h) => { x.fillStyle = color === 0x111111 ? "#111" : "#" + color.toString(16).padStart(6, "0"); x.fillRect(0, 0, w, h); x.fillStyle = "#fff"; x.font = "800 86px 'Baloo 2',sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(label, w / 2, h / 2 + 6); });
    const b = new T.Mesh(new T.BoxGeometry(13.2, 1.6, 0.4), [col, col, col, col, new T.MeshBasicMaterial({ map: tx }), new T.MeshBasicMaterial({ map: tx })]); b.position.y = 7; g.add(b);
    if (checker) { const f = new T.Mesh(new T.PlaneGeometry(10.4, 1.6), new T.MeshLambertMaterial({ map: finTex })); f.rotation.x = -Math.PI / 2; f.position.y = 0.03; g.add(f); }
    return g;
  }
  const arches = [];
  for (let s = 1; s <= N_CHANG; s++) {
    const last = s === N_CHANG, a = archMesh(last ? "VỀ ĐÍCH" : "CHẶNG " + (s + 1) + ": " + KB.chang[s][0].toUpperCase(), last ? 0x111111 : 0x7c3aed, last);
    a.userData.s = s * CHANG_LEN; scene.add(a); arches.push(a);
  }
  const startArch = archMesh("XUẤT PHÁT", 0xe11d48, true); startArch.userData.s = 2; scene.add(startArch); arches.push(startArch);

  const player = makeCar(MAUXE[G.carColor][0], "player"); scene.add(player);
  const player2 = makeCar("#2563eb", "player", null, "lucas"); player2.visible = false; scene.add(player2);
  const rivalMeshes = RIVALS.map(r => { const m = makeCar(r.mau, "rival", r); scene.add(m); return m; });

  const parts = []; const pGeo = new T.BoxGeometry(0.32, 0.32, 0.12);
  for (let i = 0; i < 90; i++) { const m = new T.Mesh(pGeo, new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 })); m.visible = false; scene.add(m); parts.push({ m, life: 0, star: false }); }
  function puff(x, y, z, color, n, spread, burst) {
    const pal = [0xffe14d, 0xff5b5b, 0x3fd27a, 0x38bdf8, 0xe879f9, 0xffffff];
    for (let i = 0; i < n; i++) {
      const p = parts.find(q => q.life <= 0); if (!p) return;
      p.life = 1; p.star = !!burst; p.m.visible = true;
      p.m.material.color.setHex(burst ? pick(pal) : color);
      p.m.position.set(x + rnd(-spread, spread), y + rnd(0, spread), z + rnd(-spread, spread));
      p.v = burst ? [rnd(-10, 10), rnd(4, 14), rnd(-6, 10)] : [rnd(-3, 3), rnd(2, 6), rnd(2, 8)];
    }
  }

  R3 = { renderer, scene, cam, cam2, sky, skyTex, ground, road, roadTex, drawRoad, curbs, curbTex, sea, mountains, props, builders, mk, objMeshes: new Map(), gateMeshes: new Map(), arches, player, player2, rivalMeshes, parts, puff, curStage: -1 };
  resize3();
}
function resize3() { if (!R3) return; const w = innerWidth, h = innerHeight; R3.renderer.setSize(w, h, false); R3.cam.aspect = w / h; R3.cam.fov = w / h < 1 ? 78 : 62; R3.cam.updateProjectionMatrix(); }

function setStage3(i) {
  if (!R3 || R3.curStage === i) return; R3.curStage = i; const S = STAGES[i];
  const c1 = "#" + S.sky[0].toString(16).padStart(6, "0"), c2 = "#" + S.sky[1].toString(16).padStart(6, "0");
  const x = R3.skyTex.image.getContext("2d"), gr = x.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, c1); gr.addColorStop(0.5, c2); gr.addColorStop(1, c2); x.fillStyle = gr; x.fillRect(0, 0, 4, 256); R3.skyTex.needsUpdate = true;
  R3.scene.fog.color.setHex(S.fog); R3.ground.material.color.setHex(S.ground); R3.drawRoad(S.road);
  R3.sea.visible = i === 2; R3.mountains.visible = i === 3 || i === 1;
  R3.mountains.children.forEach((m, k) => { if (m.geometry.type === "ConeGeometry" && k % 2 === 0) m.material.color.setHex(i === 3 ? 0x8aa3c2 : 0x5b8f4a); });
}

function updateCarMesh(pl, st, dt) {
  pl.rotation.y = -(st.x - LANES[st.lane]) * 0.08;
  pl.rotation.z = st.spin ? Math.sin(st.spin * 20) * 0.18 : (st.x - LANES[st.lane]) * 0.03;
  if (st.spin) pl.rotation.y += st.spin * 11;
  pl.userData.wheels.forEach(w => w.rotation.x -= st.speed * dt * 0.8);
  const turbo = st.boost > 0 || st.nitroOn > 0;
  const col = (st.superTurbo || st.nitroOn > 0) ? 0xd946ef : 0x38bdf8;
  pl.userData.flames.forEach((f, idx) => {
    f.visible = turbo || st.gas;
    const sc = turbo ? (1.4 + Math.random() * 0.9) : 0.55;
    f.scale.set(turbo ? 1.2 : 0.7, sc, turbo ? 1.2 : 0.7);
    if (idx % 2 === 0) f.material.color.setHex(col);
  });
  pl.userData.trails.forEach(tr => {
    tr.visible = turbo;
    tr.material.color.setHex(col);
    tr.material.opacity = 0.45 + Math.random() * 0.35;
  });
}

function renderSceneForView(d, gates, objs, rivals, cam, dt, aspect) {
  const r = R3;
  const stNow = Math.min(N_CHANG - 1, Math.floor(d / CHANG_LEN)); setStage3(stNow);
  r.roadTex.offset.y = (d / 10) % 1; r.curbTex.offset.y = (d / 4) % 1;
  const baseS = Math.floor(d / 14) * 14;
  r.props.forEach((p, i) => {
    const want = baseS - 20 + Math.floor(i / 2) * 14;
    if (p.s !== want || !p.mesh) {
      const st = clamp(Math.floor(want / CHANG_LEN), 0, N_CHANG - 1);
      if (!p.mesh || p.st !== st || Math.abs(p.s - want) > 14 * 22) {
        if (p.mesh) r.scene.remove(p.mesh);
        p.mesh = r.builders[st](); p.st = st; r.scene.add(p.mesh);
        p.off = st === 2 && p.side > 0 ? rnd(13, 18) : rnd(10, 22);
      }
      p.s = want;
    }
    p.mesh.position.set(p.side * p.off, 0, -(p.s - d));
  });
  const vis = new Set();
  for (const o of objs) {
    if (o.s < d - 12) continue; if (o.s > d + 230) break;
    if (o.got) continue;
    let m = r.objMeshes.get(o); if (!m) { m = r.mk[o.t](); r.scene.add(m); r.objMeshes.set(o, m); }
    m.position.x = LANES[o.lane]; m.position.z = -(o.s - d); m.visible = true; vis.add(o);
    if (o.t === "coin") m.rotation.y += dt * 4; if (o.t === "nitro") m.rotation.y += dt * 2;
    if (o.t === "tim") { m.rotation.y += dt * 2.5; m.children[0].position.y = 1.35 + Math.sin(performance.now() / 260) * 0.18; }
    if (o.hitT) { m.rotation.z += dt * 12; m.position.y += dt * 6; m.position.x += o.hitDir * dt * 8; }
  }
  r.objMeshes.forEach((m, o) => { if (!vis.has(o)) m.visible = false; });
  r.gateMeshes.forEach(ms => ms.forEach(m => m.visible = false));
  gates.forEach(g => {
    const near = !g.shattered && g.s > d - 15 && g.s < d + 240;
    let ms = r.gateMeshes.get(g);
    if (near && g.opts && !ms) { ms = g.opts.map((t, k) => makeGateMesh(t, k, ["#e11d48", "#e8a200", "#16a34a"][k])); ms.forEach(m => r.scene.add(m)); r.gateMeshes.set(g, ms); }
    if (ms && near) {
      ms.forEach((m, k) => { m.visible = true; m.position.z = -(g.s - d); if (g.res) { const ok = g.opts[k] === g.q.dung; m.scale.setScalar(ok ? 1 + 0.1 * Math.sin(performance.now() / 70) : 0.88); } });
    }
  });
  r.arches.forEach(a => { a.position.z = -(a.userData.s - d); a.visible = a.userData.s > d - 20 && a.userData.s < d + 260; });
  rivals.forEach((rv, i) => {
    const m = r.rivalMeshes[i], z = -(rv.d - d);
    m.visible = z < 30 && z > -320; m.position.set(rv.x, 0, z);
    m.rotation.y = -(rv.x - LANES[rv.lane]) * 0.08;
    m.userData.wheels.forEach(w => w.rotation.x -= rv.speed * dt * 0.8);
    m.userData.flames.forEach(f => { f.visible = rv.boost > 0; });
  });
  cam.aspect = aspect;
}

function updateCamFor(cam, st, dt, aspect) {
  const turbo = st.boost > 0 || st.nitroOn > 0;
  const sh = (st.shake > 0 ? st.shake : 0) + (turbo ? 0.09 : 0);
  const back = 6.8 + (turbo ? 2.1 : (st.gas ? 0.45 : 0));
  const baseFov = aspect < 1 ? 76 : 62;
  st.fovKick = Math.max(0, (st.fovKick || 0) - dt * 22);
  const fov = baseFov + (turbo ? (st.superTurbo ? 20 : 15) : (st.gas ? 4 : 0)) + (st.fovKick || 0);
  cam.position.x += (st.x * 0.7 - cam.position.x) * Math.min(1, dt * 6);
  cam.position.y = 4.5 + rnd(-sh, sh);
  cam.position.z += (back - cam.position.z) * Math.min(1, dt * 5);
  cam.fov += (fov - cam.fov) * Math.min(1, dt * 7);
  cam.aspect = aspect;
  cam.updateProjectionMatrix();
  cam.lookAt(st.x * 0.5 + rnd(-sh * 0.4, sh * 0.4), -1.0, -16);
}

function stepParticles3(dt) {
  R3.parts.forEach(p => {
    if (p.life <= 0) return;
    p.life -= dt * (p.star ? 1.3 : 1.6);
    p.m.position.x += p.v[0] * dt;
    p.m.position.y += p.v[1] * dt;
    p.m.position.z += p.v[2] * dt;
    if (p.star) { p.v[1] -= 18 * dt; p.m.rotation.x += dt * 10; p.m.rotation.z += dt * 8; }
    p.m.material.opacity = Math.max(0, p.life * 0.9);
    p.m.scale.setScalar(p.star ? (0.6 + p.life * 1.4) : (1 + (1 - p.life) * 2));
    if (p.life <= 0) p.m.visible = false;
  });
}

function render3(dt) {
  const r = R3, w = innerWidth, h = innerHeight;
  stepParticles3(dt);
  if (G.mode === 2 && G2.players.length === 2) {
    const p0 = G2.players[0], p1 = G2.players[1];
    const vertSplit = (w / h) >= 0.8;
    r.renderer.setScissorTest(true);
    r.player.visible = true; r.player2.visible = true;
    // nửa 0 (Lucie)
    const vp0 = vertSplit ? [0, 0, Math.floor(w / 2), h] : [0, Math.floor(h / 2), w, Math.floor(h / 2)];
    r.renderer.setViewport(vp0[0], vp0[1], vp0[2], vp0[3]);
    r.renderer.setScissor(vp0[0], vp0[1], vp0[2], vp0[3]);
    renderSceneForView(p0.d, p0.gates, G2.objs, G2.rivals, r.cam, dt, vp0[2] / vp0[3]);
    r.player.position.set(p0.x, p0.hop || 0, 0); updateCarMesh(r.player, p0, dt);
    const z1in0 = -(p1.d - p0.d); r.player2.visible = z1in0 < 30 && z1in0 > -320; r.player2.position.set(p1.x, p1.hop || 0, z1in0); updateCarMesh(r.player2, p1, 0);
    updateCamFor(r.cam, p0, dt, vp0[2] / vp0[3]);
    r.sky.position.copy(r.cam.position);
    r.renderer.render(r.scene, r.cam);

    // nửa 1 (Lucas)
    const vp1 = vertSplit ? [Math.floor(w / 2), 0, w - Math.floor(w / 2), h] : [0, 0, w, Math.floor(h / 2)];
    r.renderer.setViewport(vp1[0], vp1[1], vp1[2], vp1[3]);
    r.renderer.setScissor(vp1[0], vp1[1], vp1[2], vp1[3]);
    renderSceneForView(p1.d, p1.gates, G2.objs, G2.rivals, r.cam2, dt, vp1[2] / vp1[3]);
    r.player2.visible = true; r.player2.position.set(p1.x, p1.hop || 0, 0); updateCarMesh(r.player2, p1, dt);
    const z0in1 = -(p0.d - p1.d); r.player.visible = z0in1 < 30 && z0in1 > -320; r.player.position.set(p0.x, p0.hop || 0, z0in1);
    updateCamFor(r.cam2, p1, dt, vp1[2] / vp1[3]);
    r.sky.position.copy(r.cam2.position);
    r.renderer.render(r.scene, r.cam2);
    r.renderer.setScissorTest(false);
    return;
  }
  r.renderer.setScissorTest(false);
  r.renderer.setViewport(0, 0, w, h);
  r.player2.visible = false; r.player.visible = true;
  renderSceneForView(G.d, G.gates, G.objs, G.rivals, r.cam, dt, w / h);
  r.player.position.set(G.x, G.hop || 0, 0);
  updateCarMesh(r.player, G, dt);
  if ((G.boost > 0 || G.nitroOn > 0) && Math.random() < 0.55) r.puff(G.x + rnd(-0.5, 0.5), 0.5, 2.8, (G.superTurbo || G.nitroOn > 0) ? 0xe879f9 : 0x7dd3fc, 1, 0.2);
  updateCamFor(r.cam, G, dt, w / h);
  r.sky.position.copy(r.cam.position);
  r.renderer.render(r.scene, r.cam);
}

/* ================= KẾT XUẤT 2D DỰ PHÒNG ================= */
let C2 = null;
const IMG = {};
function img(src) { if (!IMG[src]) { const i = new Image(); i.src = src; IMG[src] = i; } return IMG[src]; }
function init2D() {
  const cv = $("cv2"); cv.classList.remove("hide"); $("cv").classList.add("hide");
  C2 = { cv, x: cv.getContext("2d") }; resize2();
}
function resize2() { if (!C2) return; const r = Math.min(devicePixelRatio || 1, 1.5); C2.cv.width = innerWidth * r; C2.cv.height = innerHeight * r; C2.r = r; }

function render2View(x, X0, Y0, W, H, stPlayer, gates, objs, rivals, otherPlayer) {
  x.save();
  x.beginPath(); x.rect(X0, Y0, W, H); x.clip();
  x.translate(X0, Y0);
  const d = stPlayer.d, st = Math.min(N_CHANG - 1, Math.floor(d / CHANG_LEN)), S = STAGES[st];
  const hz = H * 0.3, cx = W / 2 - stPlayer.x * W * 0.02;
  const hex = n => "#" + n.toString(16).padStart(6, "0");
  let gr = x.createLinearGradient(0, 0, 0, hz); gr.addColorStop(0, hex(S.sky[0])); gr.addColorStop(1, hex(S.sky[1])); x.fillStyle = gr; x.fillRect(0, 0, W, hz);
  if (st === 3 || st === 1) { x.fillStyle = st === 3 ? "#9fb6d6" : "#6aa35a"; for (let i = 0; i < 7; i++) { x.beginPath(); x.moveTo(i * W / 6 - W / 8, hz); x.lineTo(i * W / 6, hz - H * (0.12 + (i % 3) * 0.04)); x.lineTo(i * W / 6 + W / 8, hz); x.fill(); } }
  x.fillStyle = hex(S.ground); x.fillRect(0, hz, W, H - hz);
  if (st === 2) { x.fillStyle = "#1ea7e8"; x.fillRect(W * 0.72, hz, W * 0.28, H - hz); }
  const camH = 4.6, F = H * (stPlayer.boost > 0 ? 0.76 : 0.9), camZ = 7.4;
  const proj = (wx, wy, ds) => { const z = ds + camZ; if (z < 0.5) return null; const s = F / z; return { x: cx + (wx - stPlayer.x * 0.6) * s, y: hz + (camH - wy) * s, s }; };
  for (let i = 60; i >= 0; i--) {
    const z0 = i * 4, z1 = (i + 1) * 4, a = proj(-5.2, 0, z0), b = proj(-5.2, 0, z1), a2 = proj(5.2, 0, z0), b2 = proj(5.2, 0, z1); if (!a || !b) continue;
    const band = Math.floor((d + z0) / 4) % 2;
    x.fillStyle = band ? "#ef4444" : "#fff"; x.beginPath(); x.moveTo(a.x - a.s * 0.9, a.y); x.lineTo(b.x - b.s * 0.9, b.y); x.lineTo(b2.x + b2.s * 0.9, b2.y); x.lineTo(a2.x + a2.s * 0.9, a2.y); x.fill();
    x.fillStyle = band ? S.road : shade(S.road, 10); x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.lineTo(b2.x, b2.y); x.lineTo(a2.x, a2.y); x.fill();
    if (Math.floor((d + z0) / 5) % 2) { x.fillStyle = "#fff"; [-1.6, 1.6].forEach(lx => { const p = proj(lx, 0, z0), q = proj(lx, 0, z1); x.beginPath(); x.moveTo(p.x - p.s * 0.08, p.y); x.lineTo(q.x - q.s * 0.08, q.y); x.lineTo(q.x + q.s * 0.08, q.y); x.lineTo(p.x + p.s * 0.08, p.y); x.fill(); }); }
  }
  const items = [];
  for (let s = Math.floor(d / 14) * 14 + 14 * 16; s > d - 10; s -= 14) [-1, 1].forEach(side => items.push({ k: "prop", ds: s - d, side, st: clamp(Math.floor(s / CHANG_LEN), 0, 3), seed: (s * 7 + side * 13) % 5 }));
  objs.forEach(o => { if (!o.got && o.s > d - 6 && o.s < d + 220) items.push({ k: o.t, ds: o.s - d, lane: o.lane }); });
  gates.forEach(g => { if (!g.shattered && g.opts && g.s > d - 6 && g.s < d + 230) g.opts.forEach((t, k) => items.push({ k: "gate", ds: g.s - d, lane: k, t, g })); });
  rivals.forEach((rv, i) => { if (rv.d - d > -6 && rv.d - d < 250) items.push({ k: "rival", ds: rv.d - d, rx: rv.x, i }); });
  if (otherPlayer && otherPlayer.d - d > -6 && otherPlayer.d - d < 250) items.push({ k: "other", ds: otherPlayer.d - d, rx: otherPlayer.x, pl: otherPlayer });
  for (let s = 1; s <= N_CHANG; s++) { const ds = s * CHANG_LEN - d; if (ds > -6 && ds < 250) items.push({ k: "arch", ds, last: s === N_CHANG, s }); }
  items.sort((a, b) => b.ds - a.ds);
  const gateCol = ["#e11d48", "#e8a200", "#16a34a"];
  items.forEach(it => {
    if (it.k === "prop") {
      const p = proj(it.side * (st === 2 && it.side > 0 ? 16 : 12 + it.seed), 0, it.ds); if (!p) return;
      const s = p.s;
      if (it.st === 0) { x.fillStyle = ["#f87171", "#60a5fa", "#fbbf24", "#a78bfa", "#34d399"][it.seed]; const h = (10 + it.seed * 4) * s, w = 6 * s; x.fillRect(p.x - w / 2, p.y - h, w, h); x.fillStyle = "#1e3a5f"; for (let r = 0; r < 5; r++) x.fillRect(p.x - w / 3, p.y - h + (r + 0.5) * h / 6, w / 1.5, h / 14); }
      else if (it.st === 1) { x.fillStyle = "#8b5a2b"; x.fillRect(p.x - 0.3 * s, p.y - 3 * s, 0.6 * s, 3 * s); x.fillStyle = "#22c55e"; x.beginPath(); x.arc(p.x, p.y - 3.8 * s, 2 * s, 0, 7); x.fill(); }
      else if (it.st === 2) { x.strokeStyle = "#a16207"; x.lineWidth = 0.4 * s; x.beginPath(); x.moveTo(p.x, p.y); x.quadraticCurveTo(p.x + s, p.y - 3 * s, p.x + 0.5 * s, p.y - 6 * s); x.stroke(); x.fillStyle = "#16a34a"; for (let k = 0; k < 5; k++) { x.beginPath(); x.ellipse(p.x + 0.5 * s, p.y - 6 * s, 2.6 * s, 0.5 * s, k * 0.7, 0, 7); x.fill(); } }
      else { x.fillStyle = "#166534"; x.beginPath(); x.moveTo(p.x - 2.4 * s, p.y); x.lineTo(p.x, p.y - 7 * s); x.lineTo(p.x + 2.4 * s, p.y); x.fill(); x.fillStyle = "#fff"; x.beginPath(); x.moveTo(p.x - 1 * s, p.y - 4 * s); x.lineTo(p.x, p.y - 7 * s); x.lineTo(p.x + 1 * s, p.y - 4 * s); x.fill(); }
    } else if (it.k === "tim") {
      const p = proj(LANES[it.lane], 1.3, it.ds); if (!p) return; const r = 0.6 * p.s;
      x.fillStyle = "#ff2d55"; x.strokeStyle = "#fff"; x.lineWidth = Math.max(2, 0.08 * p.s);
      x.beginPath(); x.moveTo(p.x, p.y + r); x.bezierCurveTo(p.x - r * 1.6, p.y - r * 0.2, p.x - r * 0.7, p.y - r * 1.4, p.x, p.y - r * 0.5);
      x.bezierCurveTo(p.x + r * 0.7, p.y - r * 1.4, p.x + r * 1.6, p.y - r * 0.2, p.x, p.y + r); x.fill(); x.stroke();
    } else if (it.k === "coin" || it.k === "nitro" || it.k === "cone") {
      const p = proj(LANES[it.lane], it.k === "cone" ? 0 : 1, it.ds); if (!p) return; const s = p.s;
      if (it.k === "coin") { x.fillStyle = "#ffcc00"; x.beginPath(); x.ellipse(p.x, p.y, 0.55 * s * Math.abs(Math.sin(performance.now() / 200)) + 2, 0.55 * s, 0, 0, 7); x.fill(); x.strokeStyle = "#b45309"; x.lineWidth = 2; x.stroke(); }
      else if (it.k === "nitro") { x.fillStyle = "#22d3ee"; x.fillRect(p.x - 0.42 * s, p.y - 0.6 * s, 0.84 * s, 1.2 * s); x.fillStyle = "#a78bfa"; x.fillRect(p.x - 0.42 * s, p.y - 0.1 * s, 0.84 * s, 0.2 * s); }
      else { x.fillStyle = "#f97316"; x.beginPath(); x.moveTo(p.x - 0.5 * s, p.y); x.lineTo(p.x, p.y - 1.2 * s); x.lineTo(p.x + 0.5 * s, p.y); x.fill(); x.fillStyle = "#fff"; x.fillRect(p.x - 0.3 * s, p.y - 0.6 * s, 0.6 * s, 0.15 * s); }
    } else if (it.k === "gate") {
      const p = proj(LANES[it.lane], 0, it.ds); if (!p) return; const s = p.s, col = gateCol[it.lane];
      const ok = it.g.res && it.t === it.g.q.dung;
      x.fillStyle = col; x.fillRect(p.x - 1.5 * s, p.y - 3.4 * s, 0.3 * s, 3.4 * s); x.fillRect(p.x + 1.2 * s, p.y - 3.4 * s, 0.3 * s, 3.4 * s);
      x.globalAlpha = 0.5; x.fillRect(p.x - 1.4 * s, p.y - 0.1 * s, 2.8 * s, 0.2 * s); x.globalAlpha = 1;
      x.fillStyle = col; roundRect(x, p.x - 1.6 * s, p.y - 4.3 * s, 3.2 * s, 1.25 * s, 0.25 * s); x.fill();
      x.fillStyle = ok ? "#dcfce7" : "#fff"; roundRect(x, p.x - 1.5 * s, p.y - 4.2 * s, 3.0 * s, 1.05 * s, 0.2 * s); x.fill();
      x.fillStyle = "#1e1b4b"; let fs = 0.62 * s; x.font = "800 " + fs + "px 'Baloo 2',sans-serif"; while (x.measureText(it.t).width > 2.8 * s && fs > 6) { fs *= 0.9; x.font = "800 " + fs + "px 'Baloo 2',sans-serif"; }
      x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(it.t, p.x, p.y - 3.65 * s);
    } else if (it.k === "rival") {
      const rv = rivals[it.i], p = proj(it.rx, 0, it.ds); if (!p) return; drawCar2(x, p, RIVALS[it.i].mau, img(ANH + RIVALS[it.i].anh + ".webp"), rv.boost > 0, false);
    } else if (it.k === "other") {
      const p = proj(it.rx, 0, it.ds); if (!p) return; drawCar2(x, p, it.pl.color, img(faceUrl(it.pl.child)), it.pl.boost > 0 || it.pl.nitroOn > 0, it.pl.superTurbo);
    } else if (it.k === "arch") {
      const a = proj(-6.3, 0, it.ds), b = proj(6.3, 0, it.ds); if (!a) return; const s = a.s;
      x.fillStyle = it.last ? "#111" : "#7c3aed"; x.fillRect(a.x - 0.3 * s, a.y - 7.6 * s, 0.6 * s, 7.6 * s); x.fillRect(b.x - 0.3 * s, b.y - 7.6 * s, 0.6 * s, 7.6 * s); x.fillRect(a.x, a.y - 7.8 * s, b.x - a.x, 1.6 * s);
      x.fillStyle = "#fff"; x.font = "800 " + 0.9 * s + "px 'Baloo 2',sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(it.last ? "VỀ ĐÍCH" : "CHẶNG " + (it.s + 1), (a.x + b.x) / 2, a.y - 7 * s);
    }
  });
  const p = proj(stPlayer.x, 0, 0.2);
  if (p) {
    x.save();
    if (stPlayer.spin) { x.translate(p.x, p.y); x.rotate(Math.sin(stPlayer.spin * 20) * 0.35); x.translate(-p.x, -p.y); }
    drawCar2(x, p, stPlayer.color || MAUXE[G.carColor][0], img(faceUrl(stPlayer.child)), stPlayer.boost > 0 || stPlayer.nitroOn > 0, stPlayer.superTurbo);
    x.restore();
  }
  x.restore();
}

function render2(dt) {
  void dt;
  const x = C2.x, W = C2.cv.width, H = C2.cv.height;
  if (G.mode === 2 && G2.players.length === 2) {
    const vertSplit = (W / H) >= 0.8;
    if (vertSplit) {
      render2View(x, 0, 0, W / 2, H, G2.players[0], G2.players[0].gates, G2.objs, G2.rivals, G2.players[1]);
      render2View(x, W / 2, 0, W / 2, H, G2.players[1], G2.players[1].gates, G2.objs, G2.rivals, G2.players[0]);
    } else {
      render2View(x, 0, 0, W, H / 2, G2.players[0], G2.players[0].gates, G2.objs, G2.rivals, G2.players[1]);
      render2View(x, 0, H / 2, W, H / 2, G2.players[1], G2.players[1].gates, G2.objs, G2.rivals, G2.players[0]);
    }
    return;
  }
  render2View(x, 0, 0, W, H, G, G.gates, G.objs, G.rivals, null);
}
function shade(hex, amt) { const n = parseInt(hex.slice(1), 16); const f = v => clamp(v + amt, 0, 255); return "rgb(" + f(n >> 16) + "," + f((n >> 8) & 255) + "," + f(n & 255) + ")"; }
function drawCar2(x, p, col, face, turbo, superT) {
  const s = p.s;
  x.fillStyle = "rgba(0,0,0,.3)"; x.beginPath(); x.ellipse(p.x, p.y, 1.3 * s, 0.35 * s, 0, 0, 7); x.fill();
  if (turbo) {
    x.fillStyle = superT ? "#e879f9" : "#38bdf8";
    [-0.95, 0.95].forEach(o => { x.fillRect(p.x + o * s - 0.12 * s, p.y - 0.1 * s, 0.24 * s, 1.4 * s); });
    [-0.5, 0.5].forEach(o => { x.beginPath(); x.moveTo(p.x + (o - 0.18) * s, p.y - 0.45 * s); x.lineTo(p.x + o * s, p.y + (0.6 + Math.random() * 0.8) * s); x.lineTo(p.x + (o + 0.18) * s, p.y - 0.45 * s); x.fill(); });
  }
  x.fillStyle = "#1f2937"; [-1, 1].forEach(o => x.fillRect(p.x + o * 1.0 * s - 0.2 * s, p.y - 0.8 * s, 0.4 * s, 0.8 * s));
  x.fillStyle = col; roundRect(x, p.x - 0.95 * s, p.y - 1.1 * s, 1.9 * s, 0.75 * s, 0.2 * s); x.fill();
  x.fillStyle = "#fff"; x.fillRect(p.x - 0.22 * s, p.y - 1.1 * s, 0.44 * s, 0.75 * s);
  x.fillStyle = "#1f2937"; x.fillRect(p.x - 1.05 * s, p.y - 1.45 * s, 2.1 * s, 0.15 * s);
  if (face && face.complete && face.naturalWidth) { x.save(); x.beginPath(); x.arc(p.x, p.y - 1.75 * s, 0.48 * s, 0, 7); x.clip(); x.drawImage(face, p.x - 0.48 * s, p.y - 2.23 * s, 0.96 * s, 0.96 * s); x.restore(); x.strokeStyle = col; x.lineWidth = Math.max(2, 0.08 * s); x.beginPath(); x.arc(p.x, p.y - 1.75 * s, 0.5 * s, 0, 7); x.stroke(); }
}


/* ---------- Đối thủ "kịch tính": bám sát, vượt lên, và bị vượt lại khi bé bật TURBO ---------- */
function rivalAI(rv, refD, refBoost, refLanes, dt) {
  if (rv.agg == null) rv.agg = { tho: 0.05, cao: 0.03, gau: 0.01 }[rv.id] || 0.02;
  if (!(rv.speed >= 0)) rv.speed = 0;
  const gap = rv.d - refD, base = stageBaseSpeed(refD), nearEnd = refD > RACE_LEN - 260 || rv.d > RACE_LEN - 260;
  rv.leadT = (rv.leadT || 0) - dt;
  if (rv.leadT <= 0) { rv.lead = rnd(14, 42); rv.leadT = rnd(6, 11); }
  let f;
  if (nearEnd) f = rv.k;                                   // về đích: chạy thật, ai giỏi hơn thì thắng
  else if (refBoost) f = rv.k * 0.97;                      // bé đang TURBO: đối thủ bị bỏ lại
  else if (gap < -60) { f = 2.4; if (gap < -140) rv.d = refD - 140; }   // tụt xa, khuất sau lưng: đuổi thật nhanh (bé không nhìn thấy)
  else if (gap < -22) f = 1.38 + rv.agg;                   // đang áp sát từ phía sau
  else if (gap < -3) f = 1.12 + rv.agg;                    // ngay sau xe bé: rướn lên vượt
  else if (gap < rv.lead) f = 1.04 + rv.agg * 0.5;         // vừa vượt: bứt lên một đoạn
  else if (gap < 95) f = 0.995;                            // giữ khoảng cách phía trước, vẫn nhìn thấy
  else f = 0.9;                                            // quá xa phía trước: chờ bé
  rv.boost = Math.max(0, (rv.boost || 0) - dt);
  if (!nearEnd && !refBoost && rv.boost <= 0 && gap > -16 && gap < -2 && Math.random() < dt * 0.45) { rv.boost = 1.5; rv.attack = true; }
  const tg = base * f * (rv.boost > 0 ? 1.3 : 1);
  rv.speed += (tg - rv.speed) * Math.min(1, dt * (rv.boost > 0 ? 3 : 1.4));
  // đổi làn: tránh đè lên xe của bé khi chạy sát nhau, thỉnh thoảng lạng lách
  rv.nextLane -= dt;
  const busy = refLanes.some(L => Math.abs(gap) < 10 && rv.lane === L);
  if (busy) { const free = [0, 1, 2].filter(l => !refLanes.includes(l)); rv.lane = free.length ? pick(free) : rv.lane; rv.nextLane = rnd(2, 4); }
  else if (rv.nextLane <= 0) { rv.lane = clamp(rv.lane + (Math.random() < 0.5 ? -1 : 1), 0, 2); rv.nextLane = rnd(2.5, 6); }
  return nearEnd;
}
let passedT = 0;
function showPassed(name, pIdx) {
  const now = performance.now(); if (now - passedT < 2500 && pIdx == null) return; passedT = now;
  try { SFX.tone(392, 0.12, "square", 0.12); setTimeout(() => SFX.tone(330, 0.2, "square", 0.12), 130); } catch (e) {}
  const txt = "💨 " + name + " vượt lên! Trả lời đúng để vượt lại!";
  const el = pIdx != null ? $("pover" + pIdx) : $("overtake"); if (!el) return;
  el.textContent = txt; el.style.background = "linear-gradient(90deg,#dc2626,#7c3aed)"; el.classList.remove("hide");
  clearTimeout(el._t); el._t = setTimeout(() => { el.classList.add("hide"); el.style.background = ""; }, 1800);
}

/* ================= VÒNG LẶP GAME 1 NGƯỜI ================= */
let last = 0, rafId = 0, overT = 0;
function showOvertake(name, pIdx) {
  SFX.whoosh();
  if (pIdx != null) {
    const el = $("pover" + pIdx); if (!el) return;
    el.style.background = ""; el.textContent = "⚡ Vượt " + name + "!"; el.classList.remove("hide");
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.add("hide"), 1300);
    return;
  }
  const e = $("overtake"); e.style.background = ""; e.textContent = "⚡ Vượt " + name + "!"; e.classList.remove("hide");
  clearTimeout(overT); overT = setTimeout(() => e.classList.add("hide"), 1300);
}

function startRace() {
  Voice.stop();
  G.mode = 1; G2.state = "menu";
  document.body.classList.remove("splitMode");
  $("splitUI").classList.add("hide"); $("splitDivider").classList.add("hide"); $("track").classList.remove("duoTrack");
  G.qs = buildQuestions(G.child);
  Object.assign(G, { d: 0, x: LANES[1], lane: 1, speed: 0, boost: 0, superTurbo: false, gas: false, slow: 0, nitro: 0.35, nitroOn: 0, score: 0, ts: 1, tsTarget: 1, right: 0, asked: 0, streak: 0, bestStreak: 0, coins: 0, hits: 0, stage: 0, shake: 0, fovKick: 0, spin: 0, finished: false, finishOrder: [], mon: {}, active: null, hop: 0, color: MAUXE[G.carColor][0], tim: MANG, hetLuot: false });
  veTim("tim", MANG);
  G.rivals = RIVALS.map((r, i) => ({ id: r.id, ten: r.ten, d: -6 - i * 2, x: LANES[[0, 2, 0][i]], lane: [0, 2, 0][i], speed: 0, boost: 0, k: [1.03, 1.0, 0.975][i], nextLane: rnd(2, 5), done: false, wasAhead: false }));
  layout();
  if (R3) {
    R3.objMeshes.forEach(m => R3.scene.remove(m)); R3.objMeshes.clear();
    R3.gateMeshes.forEach(ms => ms.forEach(m => R3.scene.remove(m))); R3.gateMeshes.clear();
    R3.scene.remove(R3.player); R3.player = makeCar(MAUXE[G.carColor][0], "player"); R3.scene.add(R3.player);
    R3.player2.visible = false;
    R3.cam.position.set(0, 3.6, 7.4);
  }
  ["hud", "track", "speedo", "streak"].forEach(id => $(id).classList.remove("hide"));
  if (matchMedia("(pointer:coarse)").matches) $("pad").classList.remove("hide");
  $("start").classList.add("hide"); $("end").classList.add("hide"); $("qbox").classList.add("hide"); $("homeBtn").classList.add("hide");
  $("hudFace").src = faceUrl(G.child); $("hudName").textContent = tenBe(G.child);
  buildTrack(false);
  G.state = "count"; G.cd = 3.6; G.cdShown = 4;
  hint(KB.chang[0][0]);
  Voice.say(KB.chao);
  updateHUD();
}

function buildTrack(twoMode) {
  const t = $("track"); t.querySelectorAll(".dot,.seg").forEach(e => e.remove());
  for (let s = 1; s < N_CHANG; s++) { const e = document.createElement("div"); e.className = "seg"; e.style.left = (s / N_CHANG * 100) + "%"; t.appendChild(e); }
  RIVALS.forEach(r => { const e = document.createElement("img"); e.className = "dot"; e.id = "dot_" + r.id; e.src = ANH + r.anh + ".webp"; e.onerror = () => { e.style.background = r.mau; e.removeAttribute("src"); }; t.appendChild(e); });
  if (twoMode) {
    ["lucie", "lucas"].forEach(c => {
      const me = document.createElement("img"); me.className = "dot me"; me.id = "dot_" + c; me.src = faceUrl(c);
      me.style.borderColor = c === "lucie" ? "#f472b6" : "#38bdf8";
      t.appendChild(me);
    });
  } else {
    const me = document.createElement("img"); me.className = "dot me"; me.id = "dot_me"; me.src = faceUrl(G.child); t.appendChild(me);
  }
}

function loop(t) {
  rafId = requestAnimationFrame(loop);
  let dt = Math.min(0.05, (t - (last || t)) / 1000) * (window.__nhanh || 1); last = t;
  if (G.mode === 2) {
    if (G2.state === "count") {
      G2.cd -= dt; const n = Math.ceil(G2.cd - 0.6);
      if (n !== G2.cdShown) { G2.cdShown = n; if (n > 0) { big(String(n)); SFX.beep(false); } else if (n === 0) { big("ĐI THÔI!"); SFX.beep(true); } }
      if (G2.cd <= 0) { G2.state = "race"; G.state = "race"; G2.t0 = performance.now(); }
    }
    if (G2.state === "race") step2(dt);
    const maxSp = Math.max(G2.players[0]?.speed || 0, G2.players[1]?.speed || 0);
    const anyGas = !!(G2.players[0]?.gas || G2.players[1]?.gas || G2.players[0]?.boost > 0 || G2.players[1]?.boost > 0);
    SFX.engine(maxSp, G2.state === "race" || G2.state === "count", anyGas);
    if (G2.state !== "menu") { if (R3) render3(G2.state === "pause" ? 0 : dt); else if (C2) render2(dt); }
    return;
  }
  if (G.state === "count") {
    G.cd -= dt; const n = Math.ceil(G.cd - 0.6);
    if (n !== G.cdShown) { G.cdShown = n; if (n > 0) { big(String(n)); SFX.beep(false); } else if (n === 0) { big("ĐI THÔI!"); SFX.beep(true); } }
    if (G.cd <= 0) { G.state = "race"; G.t0 = performance.now(); }
  }
  if (G.state === "race") step(dt);
  SFX.engine(G.speed, G.state === "race" || G.state === "count", G.gas || G.boost > 0);
  if (G.state !== "menu") { if (R3) render3(G.state === "pause" ? 0 : dt); else if (C2) render2(dt); }
  else if (R3) { G.d += dt * 6; render3(dt); }
}

function stageBaseSpeed(d) {
  const st = clamp(Math.floor(d / CHANG_LEN), 0, N_CHANG - 1);
  return BASE_SPEED * Math.pow(1.08, st);
}

function step(dt) {
  G.ts += (G.tsTarget - G.ts) * Math.min(1, dt * 6);
  const sdt = dt * G.ts;
  G.boost = Math.max(0, G.boost - dt);
  if (G.boost <= 0) G.superTurbo = false;
  G.slow = Math.max(0, G.slow - dt);
  G.shake = Math.max(0, G.shake - dt * 2.2);
  if (G.spin) G.spin = Math.max(0, G.spin - dt);
  if (G.nitroOn > 0) G.nitroOn = Math.max(0, G.nitroOn - dt);

  let target = stageBaseSpeed(G.d);
  if (G.gas) target *= 1.2;
  if (G.boost > 0) {
    // vọt lên ~2.5 lần (siêu turbo ~2.85 lần) rồi giảm dần mượt mà
    const k = G.boost / 3.0;
    const peak = G.superTurbo ? 2.85 : 2.5;
    target *= (1.35 + (peak - 1.35) * clamp(k, 0, 1));
  }
  if (G.nitroOn > 0) target *= 1.6;
  if (G.slow > 0) target *= 0.38;
  const accel = (G.boost > 0 || G.nitroOn > 0) ? 9.5 : (G.slow > 0 ? 6 : 2.6);
  G.speed += (target - G.speed) * Math.min(1, dt * accel);
  if (!G.finished) G.d += G.speed * sdt;
  G.x += (LANES[G.lane] - G.x) * Math.min(1, dt * (G.boost > 0 ? 14 : 9.5));
  G.hop = Math.max(0, (G.hop || 0) - dt * 3);

  // đối thủ + kiểm tra vượt
  G.rivals.forEach(rv => {
    const beforeAhead = rv.d > G.d + 1.5;
    if (beforeAhead) rv.wasAhead = true;
    if (rv.done) { rv.speed *= 0.97; rv.d += rv.speed * sdt * 0.2; return; }
    const nearEnd = rivalAI(rv, G.d, G.boost > 0 || G.nitroOn > 0, [G.lane], dt);
    // lúc bé đang đọc câu hỏi (thời gian chậm lại), xe phía sau vẫn áp sát lên ngang hàng -> chốt đúng là vượt ngay trước mắt
    rv.d += rv.speed * (!nearEnd && rv.d < G.d + 10 ? dt * Math.max(G.ts, 0.7) : sdt);
    if (!nearEnd && !G.finished && rv.wasBehind && rv.d > G.d + 1.5 && G.state === "race") showPassed(rv.ten);
    rv.wasBehind = rv.d < G.d - 1.5 ? true : (rv.d > G.d + 1.5 ? false : rv.wasBehind);
    rv.x += (LANES[rv.lane] - rv.x) * Math.min(1, dt * 3);
    if (rv.wasAhead && G.d > rv.d + 1.2) { rv.wasAhead = false; showOvertake(rv.ten); }
    if (rv.d >= RACE_LEN) { rv.done = true; G.finishOrder.push(rv.id); }
  });

  // va chạm vật phẩm
  for (const o of G.objs) {
    if (o.done) continue; if (o.s > G.d + 1) break;
    if (o.s < G.d - 3) { o.done = true; continue; }
    if (Math.abs(LANES[o.lane] - G.x) < 1.4 && Math.abs(o.s - G.d) < 1.6) {
      o.done = true;
      if (o.t === "coin") { o.got = true; G.coins++; G.score += 10; SFX.coin(); if (R3) R3.puff(G.x, 1, -1, 0xffd400, 3, 0.4); }
      else if (o.t === "nitro") { o.got = true; G.nitro = Math.min(1, G.nitro + 0.4); G.score += 20; SFX.tone(660, 0.2, "triangle", 0.15, 1320); toast("+ Nitro! Bấm 🔥 để phóng"); }
      else if (o.t === "tim") { o.got = true; anTim(G, "tim", null); }
      else if (o.t === "cone") { if (G.boost > 0 || G.nitroOn > 0) { o.hitT = 1; o.hitDir = Math.random() < 0.5 ? -1 : 1; SFX.hit(); G.score += 5; } else { o.hitT = 1; o.hitDir = Math.random() < 0.5 ? -1 : 1; G.slow = 0.9; G.shake = 0.5; G.hits++; SFX.hit(); toast("Ối! Né nón giao thông nhé!"); } }
    }
  }

  // cổng câu hỏi
  const g = G.gates.find(g => !g.done);
  if (g) {
    if (!g.shown && !G.hetLuot && g.s - G.d < Q_AHEAD) showQuestion(g);
    if (g.shown && !g.res && G.d >= g.s) passGate(g);
  }
  // khi xe đã chốt đáp án đúng và lao xuyên qua vị trí cổng -> cổng vỡ tung thành pháo hoa/ngôi sao
  G.gates.forEach(gt => {
    if (gt.res === "ok" && !gt.shattered && G.d >= gt.s) {
      gt.shattered = true;
      SFX.shatter();
      if (R3) R3.puff(G.x, 2.5, 0, 0xffe14d, 26, 2.2, true);
    }
  });
  if (G.active && G.active.res && G.d > G.active.s + 35) hideQuestion();

  const st = Math.min(N_CHANG - 1, Math.floor(G.d / CHANG_LEN));
  if (st !== G.stage) { G.stage = st; big("CHẶNG " + (st + 1)); hint(KB.chang[st][0]); Voice.say("Chặng " + (st + 1) + ". " + KB.chang[st][0]); SFX.beep(true); }
  if (!G.finished && !G.hetLuot && G.d >= RACE_LEN) finish();
  updateHUD();
}

function rankNow() { return 1 + G.rivals.filter(r => r.d > G.d).length; }
function updateHUD() {
  const rk = G.finished ? G.myRank : rankNow();
  $("rank").innerHTML = rk + "<sup>/4</sup>"; $("score").textContent = G.score;
  $("chang").textContent = "Giải " + giaiDX(G.child) + "/30 · Chặng " + (G.stage + 1) + " · " + KB.chang[G.stage][0];
  const kmh = Math.round(G.speed * 3.6 * (G.state === "race" ? 1 : 0));
  $("kmh").textContent = kmh;
  $("speedo").classList.toggle("hot", G.boost > 0 || G.nitroOn > 0 || G.gas);
  $("nitroBar").firstChild.style.width = Math.round(G.nitro * 100) + "%";
  $("dot_me") && ($("dot_me").style.left = clamp(G.d / RACE_LEN * 100, 0, 100) + "%");
  G.rivals.forEach(r => { const e = $("dot_" + r.id); if (e) e.style.left = clamp(r.d / RACE_LEN * 100, 0, 100) + "%"; });
  $("streak").textContent = G.streak >= 2 ? "🔥 " + G.streak + " câu đúng liên tiếp!" : "";
  $("padN").style.opacity = G.nitro >= 0.25 ? 1 : 0.4;
  $("padG").classList.toggle("on", !!G.gas);
}

/* ---------- câu hỏi 1 người (CHỐT NGAY khi chọn 1/2/3 hoặc bấm nút) ---------- */
function showQuestion(g) {
  g.shown = true; G.active = g;
  const q = g.q; if (!q) { g.done = true; return; }
  const sai = shuffle(q.sai.filter(s => s && s !== q.dung)).slice(0, 2);
  g.opts = shuffle([q.dung, ...sai]);
  G.tsTarget = G.child === "lucas" ? 0.2 : 0.3;
  $("qtag").textContent = q.mon + " · Câu " + (G.gates.indexOf(g) + 1) + "/" + G.gates.length;
  $("qtext").textContent = q.q;
  $("qans").innerHTML = g.opts.map((t, k) => `<button class="ans l${k}" data-k="${k}"><span class="k">${k + 1}</span><span>${esc(t)}</span></button>`).join("");
  $("qans").querySelectorAll(".ans").forEach(b => b.onclick = () => { SFX.init(); chooseAnswer(+b.dataset.k); });
  $("qexp").classList.add("hide"); $("qhint").classList.remove("hide");
  $("qbox").classList.remove("hide");
  markLane();
  SFX.tone(880, 0.12, "triangle", 0.15); setTimeout(() => SFX.tone(1175, 0.2, "triangle", 0.15), 110);
  readQuestion(g);
}
function readQuestion(g) {
  const q = g.q; Voice.stop();
  const en = q.mon === "Tiếng Anh";
  Voice.say(q.q.replace(/[“”"]/g, ""), isEnText(q.q));
  if (G.child === "lucas" || en) g.opts.forEach((t, k) => { Voice.say(["Cổng một", "Cổng hai", "Cổng ba"][k]); Voice.say(t, isEnText(t)); });
}
// bấm 1/2/3 hoặc chạm nút đáp án -> đổi làn & CHỐT NGAY LẬP TỨC, bật TURBO lao vút qua cổng!
function chooseAnswer(k) {
  if (G.state !== "race") return;
  G.lane = clamp(k, 0, 2);
  markLane();
  if (G.active && !G.active.res) {
    passGate(G.active);
  } else {
    SFX.tone(500, 0.06, "square", 0.06);
  }
}
function steerTo(k) { chooseAnswer(k); }
function markLane() { $("qans").querySelectorAll(".ans").forEach((b, k) => b.classList.toggle("cho", k === G.lane)); }

function passGate(g) {
  if (g.res) return;
  const pickT = g.opts[G.lane], ok = pickT === g.q.dung;
  g.res = ok ? "ok" : "no"; g.done = true; G.asked++;
  G.mon[g.q.mon] = G.mon[g.q.mon] || [0, 0]; G.mon[g.q.mon][1]++;
  logResult(g.q, ok, G.child);
  // hết làm chậm thời gian NGAY LẬP TỨC
  G.tsTarget = 1; G.ts = 1;
  $("qans").querySelectorAll(".ans").forEach((b, k) => { b.classList.remove("cho"); b.classList.add(g.opts[k] === g.q.dung ? "dung" : "sai"); });
  $("qhint").classList.add("hide");
  const ex = $("qexp"); ex.classList.remove("hide");
  Voice.stop();
  if (ok) {
    // tự lướt sang đúng làn cổng đúng
    const rightLane = g.opts.indexOf(g.q.dung);
    if (rightLane >= 0) G.lane = rightLane;
    G.right++; G.streak++; G.bestStreak = Math.max(G.bestStreak, G.streak); G.mon[g.q.mon][0]++;
    const isSuper = G.streak >= 3;
    G.superTurbo = isSuper;
    const bonus = 100 + Math.min(5, G.streak - 1) * 25 + (isSuper ? 50 : 0);
    G.score += bonus;
    G.boost = isSuper ? 3.5 : 3.0;
    G.speed = Math.max(G.speed, stageBaseSpeed(G.d) * (isSuper ? 2.65 : 2.35));
    G.fovKick = isSuper ? 22 : 16;
    G.shake = isSuper ? 0.45 : 0.3;
    G.nitro = Math.min(1, G.nitro + 0.18); G.hop = 0.65;
    SFX.ok(); SFX.turbo(isSuper);
    flash(isSuper ? "rgba(217,70,239,.45)" : "rgba(56,189,248,.42)");
    $("lines").style.opacity = 1;
    const vg = $("vignette"); vg.classList.toggle("super", isSuper); vg.style.opacity = 1;
    setTimeout(() => { $("lines").style.opacity = 0; vg.style.opacity = 0; }, 2900);
    const k = pick(KB.khen); ex.className = "ok"; ex.textContent = "✅ " + k + "  +" + bonus + " ⭐";
    big(isSuper ? "⚡ SIÊU TURBO! ⚡" : "🚀 TURBO!", isSuper ? "super" : "turbo");
    Voice.say(k);
    if (R3) R3.puff(G.x, 1.2, 0, isSuper ? 0xe879f9 : 0x7dd3fc, 16, 1.2, true);
    if (G.d >= g.s - 2) { g.shattered = true; SFX.shatter(); if (R3) R3.puff(G.x, 2.5, 0, 0xffe14d, 26, 2.2, true); }
    setTimeout(() => { if (G.active === g) hideQuestion(); }, 1350);
  } else {
    G.streak = 0; G.superTurbo = false; G.boost = 0; G.slow = 1.4; G.spin = 0.85; G.shake = 0.6;
    SFX.no(); flash("rgba(239,68,68,.38)");
    const dv = pick(KB.dongvien); ex.className = "no"; ex.textContent = "Đáp án đúng: " + g.q.dung + (g.q.gt ? " — " + g.q.gt : "");
    Voice.say(dv); Voice.say("Đáp án đúng là " + g.q.dung, isEnText(g.q.dung)); if (g.q.gt) Voice.say(g.q.gt);
    if (R3) R3.puff(G.x, 0.6, 0, 0xffffff, 12, 0.9);
    G.tim = Math.max(0, G.tim - 1); veTim("tim", G.tim);
    toast((G.tim > 0 ? "Còn " + G.tim + " lượt được sai" : "Hết 3 lượt sai rồi!"), 2200);
    Voice.say(NHAC_TIM[G.tim]);
    if (G.tim <= 0) { G.hetLuot = true; G.slow = 9; setTimeout(hetLuot, 2600); }
  }
}
function hetLuot() {
  if (G.state !== "race" || G.finished) return;
  G.finished = true; G.state = "end"; G.tsTarget = 1; G.gas = false; Voice.stop(); hideQuestion();
  const o = LS.get(cupKey(G.child), {});
  o.luot = (o.luot || 0) + 1; o.hetLuot = (o.hetLuot || 0) + 1;
  o.dungNhieuNhat = Math.max(o.dungNhieuNhat || 0, G.right);
  LS.set(cupKey(G.child), o);
  ["track", "speedo", "pad", "streak"].forEach(id => $(id).classList.add("hide"));
  $("podium").innerHTML = '<div class="pod me"><img src="' + faceUrl(G.child) + '" alt=""></div>';
  $("endTitle").textContent = "Hết 3 lượt sai rồi!";
  const msg = "Con đã trả lời sai 3 câu. Đọc thật kỹ câu hỏi rồi mình đua lại nhé!";
  $("endMsg").textContent = msg;
  $("endStats").innerHTML = `<div class="stat">Đúng <b>${G.right}/${G.asked}</b> câu</div><div class="stat">Đi được <b>${Math.round(G.d / RACE_LEN * 100)}%</b> đường đua</div><div class="stat">⭐ <b>${G.score}</b></div>`;
  $("eAgain").textContent = "🏁 Đua lại";
  $("end").classList.remove("hide"); $("homeBtn").classList.remove("hide");
  focusList = [$("eAgain"), $("eHome")]; setFoc(0);
  Voice.say("Hết lượt rồi!"); Voice.say(msg);
}
function hideQuestion() { $("qbox").classList.add("hide"); $("speedo").style.opacity = 1; G.active = null; }
function logResult(q, ok, childId) {
  try { const k = "giaDinh_nhatKy", a = JSON.parse(localStorage.getItem(k) || "[]");
    a.push({ t: Date.now(), g: "duaxe", c: childId || G.child, s: q.mon, q: q.q.slice(0, 140), ok: !!ok }); if (a.length > 6000) a.splice(0, a.length - 6000); localStorage.setItem(k, JSON.stringify(a)); } catch (e) {}
}
function useNitro() {
  if (G.state !== "race" || G.nitro < 0.25 || G.nitroOn > 0) return;
  G.nitro -= 0.25; G.nitroOn = 2.4; G.fovKick = 14; G.shake = 0.25;
  SFX.turbo(true); flash("rgba(167,139,250,.35)");
  $("lines").style.opacity = 1; $("vignette").style.opacity = 1;
  setTimeout(() => { if (G.boost <= 0) { $("lines").style.opacity = 0; $("vignette").style.opacity = 0; } }, 2300);
  big("🔥 NITRO!", "super");
}


/* ---------- Luật 3 lượt sai: sai đủ 3 câu là hết lượt, phải đua lại ---------- */
const MANG = 3;
const TIM_SVG = '<svg viewBox="0 0 24 22"><path d="M12 21.5 2.6 12.4C-.6 9.2.2 3.6 4.6 2.2 7.3 1.3 10 2.4 12 4.7c2-2.3 4.7-3.4 7.4-2.5 4.4 1.4 5.2 7 2 10.2Z" fill="#ef4444" stroke="#fff" stroke-width="1.6"/></svg>';
function veTim(id, n) {
  const e = $(id); if (!e) return;
  if (e._n === n) return;
  const mat = e._n != null && n < e._n; e._n = n;
  e.innerHTML = Array.from({ length: MANG }, (_, i) => TIM_SVG.replace("<svg ", '<svg class="' + (i < n ? "" : "mat") + '" ')).join("");
  if (mat) { e.classList.remove("rung"); void e.offsetWidth; e.classList.add("rung"); }
}
function anTim(p, hudId, pIdx) {
  if (p.hetLuot || p.out) return;
  [784, 988, 1175, 1568].forEach((f, i) => setTimeout(() => SFX.tone(f, 0.16, "triangle", 0.16), i * 70));
  if (R3) R3.puff(p.x, 1.4, -1, 0xff5c8a, 14, 0.9, true);
  let txt;
  if (p.tim < MANG) { p.tim++; veTim(hudId, p.tim); txt = "+1 tim! Còn " + p.tim + " lượt được sai"; if (pIdx == null) Voice.say("Con được thêm một trái tim!"); }
  else { p.score += 50; txt = "Tim đã đầy! +50 ⭐"; }
  if (pIdx == null) toast(txt, 2000); else pbig2(pIdx, txt);
}
const NHAC_TIM = ["Hết lượt rồi!", "Con còn một lượt sai, cẩn thận nhé!", "Con còn hai lượt sai nhé!"];

/* ---------- về đích 1 người ---------- */
function finish() {
  G.finished = true; G.state = "end"; G.tsTarget = 1; G.gas = false; Voice.stop(); hideQuestion();
  const ahead = G.rivals.filter(r => r.done || r.d > G.d).length;
  G.myRank = ahead + 1;
  const order = G.rivals.map((r, i) => ({ id: r.id, i, d: r.done ? RACE_LEN + 1000 - G.finishOrder.indexOf(r.id) : r.d }));
  order.push({ id: "me", d: RACE_LEN + 1000 - ahead + 0.5 });
  order.sort((a, b) => b.d - a.d);
  const rankBonus = [500, 300, 150, 50][G.myRank - 1]; G.score += rankBonus;
  if (G.myRank <= 3) LS.set("duaXe_giai_" + G.child, Math.min(30, giaiDX(G.child) + 1));
  const o = LS.get(cupKey(G.child), {});
  o.luot = (o.luot || 0) + 1; if (G.myRank === 1) o.vang = (o.vang || 0) + 1; if (G.myRank === 2) o.bac = (o.bac || 0) + 1; if (G.myRank === 3) o.dong = (o.dong || 0) + 1;
  o.cup = (o.vang || 0) + (o.bac || 0) + (o.dong || 0);
  o.diemCao = Math.max(o.diemCao || 0, G.score); o.dungNhieuNhat = Math.max(o.dungNhieuNhat || 0, G.right);
  LS.set(cupKey(G.child), o);
  const newHi = o.diemCao === G.score;
  setTimeout(() => {
    ["track", "speedo", "pad", "streak"].forEach(id => $(id).classList.add("hide"));
    const nm = { me: tenBe(G.child) }, src = { me: faceUrl(G.child) }; RIVALS.forEach(r => { nm[r.id] = r.ten; src[r.id] = ANH + r.anh + ".webp"; });
    const pos = [2, 1, 3, 4];
    $("podium").innerHTML = pos.map(p => { const e = order[p - 1]; return `<div class="pod p${p}${e.id === "me" ? " me" : ""}"><img src="${src[e.id]}" alt="" onerror="this.removeAttribute('src');this.style.background='#f59e0b'">${esc(nm[e.id])}<div class="blk">${p}</div></div>`; }).join("");
    const titles = ["🏆 VÔ ĐỊCH! 🏆", "🥈 Hạng nhì xuất sắc!", "🥉 Hạng ba rồi!", "Về đích rồi!"];
    $("endTitle").textContent = titles[G.myRank - 1];
    const msg = G.myRank === 1 ? KB.chuc : G.myRank <= 3 ? "Con được cúp " + ["", "", "bạc", "đồng"][G.myRank] + "! Trả lời đúng nhiều cổng hơn để về nhất nhé!" : "Cố lên! Mỗi cổng đúng là một lần turbo, con sẽ vượt lên được!";
    $("endMsg").textContent = msg;
    $("endStats").innerHTML = `<div class="stat">Đúng <b>${G.right}/${G.asked}</b> câu</div><div class="stat">⭐ <b>${G.score}</b>${newHi ? " (kỷ lục!)" : ""}</div><div class="stat">Xu <b>${G.coins}</b></div><div class="stat">Liên tiếp <b>${G.bestStreak}</b></div>` +
      Object.keys(G.mon).map(m => `<div class="stat">${m}: <b>${G.mon[m][0]}/${G.mon[m][1]}</b></div>`).join("");
    $("eAgain").textContent = "🏁 Đua tiếp";
    $("end").classList.remove("hide"); $("homeBtn").classList.remove("hide");
    focusList = [$("eAgain"), $("eHome")]; setFoc(0);
    if (G.myRank <= 3) { SFX.fanfare(); confetti(); }
    Voice.say($("endTitle").textContent.replace(/[🏆🥈🥉]/gu, "")); Voice.say(msg);
    Voice.say("Con trả lời đúng " + G.right + " trên " + G.asked + " câu.");
  }, 1600);
  big(G.myRank === 1 ? "VỀ NHẤT!" : "VỀ ĐÍCH!");
}

/* ================= CHẾ ĐỘ 2 NGƯỜI: HAI CHỊ EM CÙNG ĐUA ================= */
function makePlayerState(child, idx, color, startLane) {
  const qs = buildQuestions(child);
  const gates = buildGatesFor(qs);
  return {
    idx, child, color, d: 0, x: LANES[startLane], lane: startLane,
    speed: 0, boost: 0, superTurbo: false, gas: false, slow: 0, nitro: 0.35, nitroOn: 0,
    score: 0, ts: 1, tsTarget: 1, qs, gates, active: null,
    right: 0, asked: 0, streak: 0, bestStreak: 0, coins: 0, hits: 0,
    stage: 0, shake: 0, fovKick: 0, spin: 0, hop: 0, finished: false, myRank: 1, mon: {}, tim: MANG, out: false
  };
}

function startRace2() {
  Voice.stop();
  G.mode = 2;
  document.body.classList.add("splitMode");
  const p0 = makePlayerState("lucie", 0, "#e11d48", 0);
  const p1 = makePlayerState("lucas", 1, "#2563eb", 2);
  G2.players = [p0, p1];
  G2.rivals = RIVALS.map((r, i) => ({ id: r.id, ten: r.ten, d: -6 - i * 2, x: LANES[[1, 0, 2][i]], lane: [1, 0, 2][i], speed: 0, boost: 0, k: [1.03, 1.0, 0.975][i], nextLane: rnd(2, 5), done: false, wasAhead0: false, wasAhead1: false }));
  G2.objs = buildObjsFor(p0.gates);
  G2.finishOrder = [];
  if (R3) {
    R3.objMeshes.forEach(m => R3.scene.remove(m)); R3.objMeshes.clear();
    R3.gateMeshes.forEach(ms => ms.forEach(m => R3.scene.remove(m))); R3.gateMeshes.clear();
    R3.scene.remove(R3.player); R3.player = makeCar(p0.color, "player", null, "lucie"); R3.scene.add(R3.player);
    R3.scene.remove(R3.player2); R3.player2 = makeCar(p1.color, "player", null, "lucas"); R3.scene.add(R3.player2);
    R3.cam.position.set(0, 3.6, 7.4); R3.cam2.position.set(0, 3.6, 7.4);
  }
  ["hud", "speedo", "streak", "qbox", "pad", "start", "end", "homeBtn"].forEach(id => $(id).classList.add("hide"));
  ["track", "splitUI", "splitDivider"].forEach(id => $(id).classList.remove("hide")); $("track").classList.add("duoTrack");
  [0, 1].forEach(i => {
    const pl = G2.players[i];
    $("pface" + i).src = faceUrl(pl.child);
    $("pname" + i).textContent = tenBe(pl.child);
    $("pqbox" + i).classList.add("hide");
    if (matchMedia("(pointer:coarse)").matches) $("ppad" + i).classList.remove("hide");
  });
  buildTrack(true);
  G2.state = "count"; G.state = "count"; G2.cd = 3.6; G2.cdShown = 4;
  Voice.say("Hai chị em Lucie và Lucas cùng đua! Chúc hai con bứt tốc thật nhanh!");
  updateHUD2();
}

function step2(dt) {
  const [p0, p1] = G2.players;
  G2.players.forEach((p, idx) => {
    p.ts += (p.tsTarget - p.ts) * Math.min(1, dt * 6);
    const sdt = dt * p.ts;
    p.boost = Math.max(0, p.boost - dt);
    if (p.boost <= 0) p.superTurbo = false;
    p.slow = Math.max(0, p.slow - dt);
    p.shake = Math.max(0, p.shake - dt * 2.2);
    if (p.spin) p.spin = Math.max(0, p.spin - dt);
    if (p.nitroOn > 0) p.nitroOn = Math.max(0, p.nitroOn - dt);

    let target = stageBaseSpeed(p.d);
    if (p.gas) target *= 1.2;
    if (p.boost > 0) {
      const k = p.boost / 3.0;
      const peak = p.superTurbo ? 2.85 : 2.5;
      target *= (1.35 + (peak - 1.35) * clamp(k, 0, 1));
    }
    if (p.nitroOn > 0) target *= 1.6;
    if (p.slow > 0) target *= 0.38;
    const accel = (p.boost > 0 || p.nitroOn > 0) ? 9.5 : (p.slow > 0 ? 6 : 2.6);
    p.speed += (target - p.speed) * Math.min(1, dt * accel);
    if (!p.finished) p.d += p.speed * sdt;
    else { p.speed *= 0.96; p.d += p.speed * dt * 0.25; }
    p.x += (LANES[p.lane] - p.x) * Math.min(1, dt * (p.boost > 0 ? 14 : 9.5));
    p.hop = Math.max(0, (p.hop || 0) - dt * 3);

    // va chạm vật phẩm
    for (const o of G2.objs) {
      if (o.s > p.d + 1.5) break;
      const gotKey = idx === 0 ? "got0" : "got1";
      if (o[gotKey] || o.s < p.d - 3) continue;
      if (Math.abs(LANES[o.lane] - p.x) < 1.4 && Math.abs(o.s - p.d) < 1.6) {
        o[gotKey] = true;
        if (o.t === "coin") { p.coins++; p.score += 10; SFX.coin(); }
        else if (o.t === "nitro") { p.nitro = Math.min(1, p.nitro + 0.4); p.score += 20; SFX.tone(660, 0.2, "triangle", 0.15, 1320); }
        else if (o.t === "tim") anTim(p, "tim" + idx, idx);
        else if (o.t === "cone") { if (p.boost <= 0 && p.nitroOn <= 0) { p.slow = 0.85; p.shake = 0.45; p.hits++; SFX.hit(); } else { p.score += 5; SFX.hit(); } }
      }
    }

    // cổng câu hỏi riêng của từng bé
    const g = p.gates.find(gt => !gt.done);
    if (g) {
      if (!g.shown && !p.out && g.s - p.d < Q_AHEAD) showQuestion2(p, g);
      if (g.shown && !g.res && p.d >= g.s) passGate2(p, g);
    }
    p.gates.forEach(gt => {
      if (gt.res === "ok" && !gt.shattered && p.d >= gt.s) {
        gt.shattered = true;
        SFX.shatter();
        if (R3) R3.puff(p.x, 2.5, 0, 0xffe14d, 22, 2.0, true);
      }
    });
    if (p.active && p.active.res && p.d > p.active.s + 35) hideQuestion2(p);

    if (!p.finished && !p.out && p.d >= RACE_LEN) {
      p.finished = true;
      G2.finishOrder.push(p.child);
      p.myRank = G2.finishOrder.length;
      pbig2(idx, p.myRank === 1 ? "🏆 VỀ NHẤT!" : "🏁 VỀ ĐÍCH!");
      SFX.beep(true);
    }
  });

  // đối thủ chạy theo trung bình tiến độ của 2 chị em
  const avgD = (p0.d + p1.d) / 2;
  G2.rivals.forEach(rv => {
    if (rv.d > p0.d + 1.5) rv.wasAhead0 = true;
    if (rv.d > p1.d + 1.5) rv.wasAhead1 = true;
    if (rv.done) { rv.speed *= 0.97; rv.d += rv.speed * dt * 0.2; return; }
    const ref = Math.abs(rv.d - p0.d) <= Math.abs(rv.d - p1.d) ? p0 : p1;   // bám theo bé ở gần nhất
    const nearEnd = rivalAI(rv, ref.d, ref.boost > 0 || ref.nitroOn > 0, [p0, p1].filter(q => Math.abs(q.d - rv.d) < 12).map(q => q.lane), dt);
    rv.d += rv.speed * dt;
    [p0, p1].forEach((q, qi) => {
      const kb = "wasBehind" + qi;
      if (!nearEnd && !q.finished && rv[kb] && rv.d > q.d + 1.5 && G2.state === "race") showPassed(rv.ten, qi);
      rv[kb] = rv.d < q.d - 1.5 ? true : (rv.d > q.d + 1.5 ? false : rv[kb]);
    });
    rv.x += (LANES[rv.lane] - rv.x) * Math.min(1, dt * 3);
    if (rv.wasAhead0 && p0.d > rv.d + 1.2) { rv.wasAhead0 = false; showOvertake(rv.ten, 0); }
    if (rv.wasAhead1 && p1.d > rv.d + 1.2) { rv.wasAhead1 = false; showOvertake(rv.ten, 1); }
    if (rv.d >= RACE_LEN) { rv.done = true; G2.finishOrder.push(rv.id); }
  });

  if (p0.finished && p1.finished && G2.state === "race") finish2();
  updateHUD2();
}

function rankPlayer2(p) {
  if (p.finished && !p.out) return p.myRank;
  const other = G2.players[1 - p.idx];
  let r = 1 + G2.rivals.filter(rv => rv.d > p.d).length;
  if (other.d > p.d) r++;
  return r;
}

function updateHUD2() {
  G2.players.forEach((p, i) => {
    $("prank" + i).innerHTML = rankPlayer2(p) + "<sup>/5</sup>";
    $("pscore" + i).textContent = p.score; veTim("tim" + i, p.tim);
    $("pkmh" + i).textContent = Math.round(p.speed * 3.6 * (G2.state === "race" ? 1 : 0));
    $("pspeed" + i).classList.toggle("hot", p.boost > 0 || p.nitroOn > 0 || p.gas);
    $("pnitro" + i).style.width = Math.round(p.nitro * 100) + "%";
    $("pstreak" + i).textContent = p.streak >= 2 ? "🔥x" + p.streak : "";
    const dEl = $("dot_" + p.child);
    if (dEl) dEl.style.left = clamp(p.d / RACE_LEN * 100, 0, 100) + "%";
  });
  G2.rivals.forEach(r => { const e = $("dot_" + r.id); if (e) e.style.left = clamp(r.d / RACE_LEN * 100, 0, 100) + "%"; });
}

function showQuestion2(p, g) {
  g.shown = true; p.active = g;
  const q = g.q; if (!q) { g.done = true; return; }
  const sai = shuffle(q.sai.filter(s => s && s !== q.dung)).slice(0, 2);
  g.opts = shuffle([q.dung, ...sai]);
  // Làm chậm thời gian RIÊNG từng bé, không làm chậm bé kia
  p.tsTarget = p.child === "lucas" ? 0.22 : 0.32;
  const i = p.idx;
  const keyLabels = i === 0 ? ["1", "2", "3"] : ["7", "8", "9"];
  $("pqtag" + i).textContent = q.mon + " · Câu " + (p.gates.indexOf(g) + 1) + "/" + p.gates.length;
  $("pqtext" + i).textContent = q.q;
  $("pqans" + i).innerHTML = g.opts.map((t, k) => `<button class="ans l${k}" data-p="${i}" data-k="${k}"><span class="k">${keyLabels[k]}</span><span>${esc(t)}</span></button>`).join("");
  $("pqans" + i).querySelectorAll(".ans").forEach(b => b.onclick = () => { SFX.init(); chooseAnswer2(i, +b.dataset.k); });
  $("pqexp" + i).classList.add("hide");
  $("pqbox" + i).classList.remove("hide");
  markLane2(p);
  SFX.tone(i === 0 ? 880 : 988, 0.12, "triangle", 0.14);
  // Ưu tiên đọc câu của Lucas vì em mới lớp 1
  if (p.child === "lucas") {
    Voice.stop();
    Voice.say("Câu của Lucas: " + q.q.replace(/[“”"]/g, ""), isEnText(q.q));
    g.opts.forEach((t, k) => { Voice.say(["Một", "Hai", "Ba"][k]); Voice.say(t, isEnText(t)); });
  } else if (!G2.players[1].active || G2.players[1].active.res) {
    if (!Voice.busy) Voice.say(q.q.replace(/[“”"]/g, ""), isEnText(q.q));
  }
}

function markLane2(p) {
  $("pqans" + p.idx).querySelectorAll(".ans").forEach((b, k) => b.classList.toggle("cho", k === p.lane));
}

function chooseAnswer2(pIdx, k) {
  if (G2.state !== "race") return;
  const p = G2.players[pIdx]; if (!p) return;
  p.lane = clamp(k, 0, 2);
  markLane2(p);
  if (p.active && !p.active.res) {
    passGate2(p, p.active);
  } else {
    SFX.tone(500, 0.06, "square", 0.06);
  }
}

function passGate2(p, g) {
  if (g.res) return;
  const i = p.idx;
  const pickT = g.opts[p.lane], ok = pickT === g.q.dung;
  g.res = ok ? "ok" : "no"; g.done = true; p.asked++;
  p.mon[g.q.mon] = p.mon[g.q.mon] || [0, 0]; p.mon[g.q.mon][1]++;
  logResult(g.q, ok, p.child);
  p.tsTarget = 1; p.ts = 1;
  $("pqans" + i).querySelectorAll(".ans").forEach((b, k) => { b.classList.remove("cho"); b.classList.add(g.opts[k] === g.q.dung ? "dung" : "sai"); });
  const ex = $("pqexp" + i); ex.classList.remove("hide");
  if (ok) {
    const rightLane = g.opts.indexOf(g.q.dung);
    if (rightLane >= 0) p.lane = rightLane;
    p.right++; p.streak++; p.bestStreak = Math.max(p.bestStreak, p.streak); p.mon[g.q.mon][0]++;
    const isSuper = p.streak >= 3;
    p.superTurbo = isSuper;
    const bonus = 100 + Math.min(5, p.streak - 1) * 25 + (isSuper ? 50 : 0);
    p.score += bonus;
    p.boost = isSuper ? 3.5 : 3.0;
    p.speed = Math.max(p.speed, stageBaseSpeed(p.d) * (isSuper ? 2.65 : 2.35));
    p.fovKick = isSuper ? 22 : 16;
    p.shake = 0.35; p.nitro = Math.min(1, p.nitro + 0.18); p.hop = 0.6;
    SFX.ok(); SFX.turbo(isSuper);
    const plines = $("plines" + i); plines.style.opacity = 1;
    setTimeout(() => plines.style.opacity = 0, 2600);
    ex.className = "pqexp ok"; ex.textContent = "✅ Giỏi quá! +" + bonus + " ⭐";
    pbig2(i, isSuper ? "⚡ SIÊU TURBO!" : "🚀 TURBO!");
    if (p.d >= g.s - 2) { g.shattered = true; SFX.shatter(); if (R3) R3.puff(p.x, 2.5, 0, 0xffe14d, 22, 2.0, true); }
    setTimeout(() => { if (p.active === g) hideQuestion2(p); }, 1300);
  } else {
    p.streak = 0; p.superTurbo = false; p.boost = 0; p.slow = 1.3; p.spin = 0.8; p.shake = 0.5;
    SFX.no();
    ex.className = "pqexp no"; ex.textContent = "Đáp án đúng: " + g.q.dung;
    p.tim = Math.max(0, p.tim - 1); veTim("tim" + i, p.tim);
    pbig2(i, p.tim > 0 ? "Còn " + p.tim + " lượt sai" : "HẾT LƯỢT!");
    if (p.tim <= 0) {
      p.out = true; p.slow = 9;
      setTimeout(() => { if (!p.finished) { p.finished = true; p.speed = 0; hideQuestion2(p); pbig2(i, "Hết lượt — chờ " + (i ? "chị" : "em") + " về đích nhé!"); } }, 2200);
    }
  }
}

function hideQuestion2(p) { $("pqbox" + p.idx).classList.add("hide"); p.active = null; }
function pbig2(i, txt) {
  const e = $("pbig" + i); if (!e) return;
  e.textContent = txt; e.classList.remove("hide");
  clearTimeout(e._t); e._t = setTimeout(() => e.classList.add("hide"), 1300);
}
function useNitro2(i) {
  if (G2.state !== "race") return;
  const p = G2.players[i]; if (!p || p.nitro < 0.25 || p.nitroOn > 0) return;
  p.nitro -= 0.25; p.nitroOn = 2.4; p.fovKick = 14; p.shake = 0.25;
  SFX.turbo(true);
  const plines = $("plines" + i); plines.style.opacity = 1;
  setTimeout(() => { if (p.boost <= 0) plines.style.opacity = 0; }, 2200);
  pbig2(i, "🔥 NITRO!");
}

function finish2() {
  G2.state = "end"; G.state = "end"; Voice.stop();
  const [p0, p1] = G2.players;
  hideQuestion2(p0); hideQuestion2(p1);
  // sắp xếp cả 5 xe cho bục trao giải
  const all5 = [
    { id: "lucie", d: G2.finishOrder.indexOf("lucie") >= 0 ? RACE_LEN + 2000 - G2.finishOrder.indexOf("lucie") * 10 : p0.d },
    { id: "lucas", d: G2.finishOrder.indexOf("lucas") >= 0 ? RACE_LEN + 2000 - G2.finishOrder.indexOf("lucas") * 10 : p1.d },
    ...G2.rivals.map(r => ({ id: r.id, d: r.done ? RACE_LEN + 2000 - G2.finishOrder.indexOf(r.id) * 10 : r.d }))
  ];
  all5.sort((a, b) => b.d - a.d);
  p0.myRank = all5.findIndex(x => x.id === "lucie") + 1;
  p1.myRank = all5.findIndex(x => x.id === "lucas") + 1;

  // lưu cúp & kỷ lục cho TỪNG bé
  [p0, p1].forEach(p => {
    const rankBonus = [500, 350, 200, 100, 50][p.myRank - 1] || 50;
    p.score += rankBonus;
    const o = LS.get(cupKey(p.child), {});
    o.luot = (o.luot || 0) + 1;
    if (p.out) { o.hetLuot = (o.hetLuot || 0) + 1; o.dungNhieuNhat = Math.max(o.dungNhieuNhat || 0, p.right); LS.set(cupKey(p.child), o); return; }
    if (p.myRank === 1) o.vang = (o.vang || 0) + 1;
    if (p.myRank === 2) o.bac = (o.bac || 0) + 1;
    if (p.myRank === 3) o.dong = (o.dong || 0) + 1;
    o.cup = (o.vang || 0) + (o.bac || 0) + (o.dong || 0);
    o.diemCao = Math.max(o.diemCao || 0, p.score);
    o.dungNhieuNhat = Math.max(o.dungNhieuNhat || 0, p.right);
    LS.set(cupKey(p.child), o);
  });

  setTimeout(() => {
    $("track").classList.add("hide"); $("splitUI").classList.add("hide"); $("splitDivider").classList.add("hide");
    const nm = { lucie: tenBe("lucie"), lucas: tenBe("lucas") };
    const src = { lucie: faceUrl("lucie"), lucas: faceUrl("lucas") };
    RIVALS.forEach(r => { nm[r.id] = r.ten; src[r.id] = ANH + r.anh + ".webp"; });
    const pos = [2, 1, 3, 4, 5];
    $("podium").innerHTML = pos.map(p => {
      const e = all5[p - 1];
      const isMe = e.id === "lucie" || e.id === "lucas";
      return `<div class="pod p${p}${isMe ? " me" : ""}"><img src="${src[e.id]}" alt="" onerror="this.removeAttribute('src');this.style.background='#f59e0b'">${esc(nm[e.id])}<div class="blk">${p}</div></div>`;
    }).join("");
    const lucieFirst = p0.myRank < p1.myRank;
    $("endTitle").textContent = "🏆 Hai chị em về đích tuyệt vời! 🏆";
    let msg;
    if (p0.out && p1.out) msg = "Hai chị em đều hết 3 lượt sai rồi. Đọc thật kỹ câu hỏi rồi mình đua lại nhé!";
    else if (p0.out || p1.out) { const v = p0.out ? p1 : p0, h = p0.out ? p0 : p1; msg = (v.idx ? "Em Lucas" : "Chị Lucie") + " đã về đích, " + (h.idx ? "em Lucas" : "chị Lucie") + " hết 3 lượt sai. Lần sau đọc kỹ hơn là về đích được thôi! Cả hai chị em đều rất cố gắng!"; }
    else msg = (lucieFirst ? "Chị Lucie cán đích trước, em Lucas bám sát cực kỳ dũng cảm! " : "Em Lucas bứt tốc cán đích trước, chị Lucie đua cực kỳ xuất sắc! ") + "Cả hai chị em đều rất thông minh và đáng khen!";
    $("endMsg").textContent = msg;
    $("endStats").innerHTML =
      [p0, p1].map(p => `<div class="stat">${p.idx ? "👦 Lucas" : "👧 Lucie"}: ${p.out ? "<b>Hết 3 lượt sai</b>" : "Hạng <b>" + p.myRank + "/5</b>"} · Đúng <b>${p.right}/${p.asked}</b> câu · ⭐ <b>${p.score}</b></div>`).join("");
    $("end").classList.remove("hide"); $("homeBtn").classList.remove("hide");
    focusList = [$("eAgain"), $("eHome")]; setFoc(0);
    SFX.fanfare(); confetti();
    Voice.say("Chúc mừng hai chị em Lucie và Lucas đã hoàn thành đường đua! " + msg);
  }, 1500);
}

/* ---------- hiệu ứng giao diện ---------- */
let bigT = 0, toastT = 0;
function big(t, cls) { const e = $("big"); e.textContent = t; e.className = "pop" + (cls ? " " + cls : ""); void e.offsetWidth; clearTimeout(bigT); bigT = setTimeout(() => e.classList.add("hide"), 1300); }
function toast(t, ms) { const e = $("toast"); e.textContent = t; e.classList.remove("hide"); clearTimeout(toastT); toastT = setTimeout(() => e.classList.add("hide"), ms || 1800); }
function hint(t) { toast(t, 2400); }
function flash(c) { const f = $("flash"); f.style.background = c; f.style.opacity = 1; setTimeout(() => f.style.opacity = 0, 260); }
function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
function confetti() {
  const cv = $("confetti"); cv.classList.remove("hide"); cv.width = innerWidth; cv.height = innerHeight; const x = cv.getContext("2d");
  const ps = Array.from({ length: 160 }, () => ({ x: Math.random() * cv.width, y: -Math.random() * cv.height, v: rnd(2, 6), a: rnd(0, 6), c: pick(["#ffe14d", "#ff5b5b", "#3fd27a", "#4fc3ff", "#c084fc"]) }));
  let n = 0; (function f() { x.clearRect(0, 0, cv.width, cv.height); ps.forEach(p => { p.y += p.v; p.a += 0.1; x.fillStyle = p.c; x.save(); x.translate(p.x + Math.sin(p.a) * 10, p.y); x.rotate(p.a); x.fillRect(-5, -8, 10, 16); x.restore(); }); if (++n < 260) requestAnimationFrame(f); else cv.classList.add("hide"); })();
}

/* ---------- tạm dừng ---------- */
function pause() {
  if (G.mode === 2) {
    if (G2.state !== "race" && G2.state !== "count") return;
    G2.prev = G2.state; G2.state = "pause"; G.state = "pause"; Voice.stop();
    $("pause").classList.remove("hide"); focusList = [$("pResume"), $("pRestart"), $("pHome")]; setFoc(0);
    return;
  }
  if (G.state !== "race" && G.state !== "count") return;
  G.prev = G.state; G.state = "pause"; Voice.stop(); $("pause").classList.remove("hide"); focusList = [$("pResume"), $("pRestart"), $("pHome")]; setFoc(0);
}
function resume() {
  if (G.mode === 2) {
    if (G2.state !== "pause") return;
    $("pause").classList.add("hide"); G2.state = G2.prev || "race"; G.state = G2.state; last = 0;
    return;
  }
  if (G.state !== "pause") return;
  $("pause").classList.add("hide"); G.state = G.prev || "race"; last = 0; if (G.active && !G.active.res) readQuestion(G.active);
}
function toMenu() {
  Voice.stop(); G.state = "menu"; G2.state = "menu"; G.mode = 1;
  document.body.classList.remove("splitMode");
  ["hud", "track", "speedo", "pad", "streak", "qbox", "pause", "end", "splitUI", "splitDivider"].forEach(id => $(id).classList.add("hide"));
  $("start").classList.remove("hide"); $("homeBtn").classList.remove("hide"); refreshBest(); focusList = [...document.querySelectorAll(".char")]; setFoc(0);
}

/* ---------- điều khiển bàn phím, TV remote, cảm ứng ---------- */
let focusList = [], foc = 0;
function setFoc(i) { if (!focusList.length) return; foc = (i + focusList.length) % focusList.length; focusList.forEach((b, k) => b.classList.toggle("foc", k === foc)); try { focusList[foc].focus({ preventScroll: true }); } catch (e) {} }

// Điều khiển TV (LG webOS...) có khi không báo e.key chuẩn: đổi theo keyCode
function phim(e) {
  const c = e.keyCode || e.which, map = { 13: "Enter", 37: "ArrowLeft", 38: "ArrowUp", 39: "ArrowRight", 40: "ArrowDown", 461: "GoBack", 10009: "GoBack", 415: "Enter", 32: " " };
  if (map[c]) return map[c];
  if (c >= 48 && c <= 57) return String(c - 48);
  if (c >= 96 && c <= 105) return String(c - 96);
  return e.key || "";
}
addEventListener("keydown", e => {
  SFX.init();
  const k = phim(e);
  // Chế độ 2 chị em
  if (G.mode === 2 && (G2.state === "race" || G2.state === "count")) {
    const [p0, p1] = G2.players;
    // Lucie (nửa trái): A/D đổi làn, 1/2/3 chọn đáp án, W giữ ga, Q nitro
    if (k === "a" || k === "A") { p0.lane = Math.max(0, p0.lane - 1); if (p0.active && !p0.active.res) markLane2(p0); e.preventDefault(); }
    else if (k === "d" || k === "D") { p0.lane = Math.min(2, p0.lane + 1); if (p0.active && !p0.active.res) markLane2(p0); e.preventDefault(); }
    else if (k === "1" || k === "2" || k === "3") { chooseAnswer2(0, +k - 1); e.preventDefault(); }
    else if (k === "w" || k === "W") { p0.gas = true; e.preventDefault(); }
    else if (k === "q" || k === "Q") { useNitro2(0); e.preventDefault(); }
    // Lucas (nửa phải): mũi tên trái/phải đổi làn, 7/8/9 hoặc J/K/L chọn đáp án, mũi tên lên giữ ga, 0 hoặc Enter nitro
    else if (k === "ArrowLeft") { p1.lane = Math.max(0, p1.lane - 1); if (p1.active && !p1.active.res) markLane2(p1); e.preventDefault(); }
    else if (k === "ArrowRight") { p1.lane = Math.min(2, p1.lane + 1); if (p1.active && !p1.active.res) markLane2(p1); e.preventDefault(); }
    else if (k === "7" || k === "8" || k === "9") { chooseAnswer2(1, +k - 7); e.preventDefault(); }
    else if (k === "j" || k === "J") { chooseAnswer2(1, 0); e.preventDefault(); }
    else if (k === "k" || k === "K") { chooseAnswer2(1, 1); e.preventDefault(); }
    else if (k === "l" || k === "L") { chooseAnswer2(1, 2); e.preventDefault(); }
    else if (k === "ArrowUp") { p1.gas = true; e.preventDefault(); }
    else if (k === "Enter" && p1.active && !p1.active.res) { chooseAnswer2(1, p1.lane); e.preventDefault(); }   // OK = chốt làn đang chọn
    else if (k === "ArrowDown" && p1.active && !p1.active.res) { chooseAnswer2(1, p1.lane); e.preventDefault(); }
    else if ((k === "s" || k === "S") && p0.active && !p0.active.res) { chooseAnswer2(0, p0.lane); e.preventDefault(); }
    else if (k === "0" || k === "Enter" || k === " ") { useNitro2(1); e.preventDefault(); }
    else if (k === "p" || k === "P" || k === "Escape" || k === "Backspace" || k === "GoBack") { pause(); e.preventDefault(); }
    return;
  }
  // Chế độ 1 người
  if (G.state === "race" || G.state === "count") {
    if (k === "ArrowLeft" || k === "a" || k === "A") { G.lane = Math.max(0, G.lane - 1); if (G.active && !G.active.res) markLane(); e.preventDefault(); }
    else if (k === "ArrowRight" || k === "d" || k === "D") { G.lane = Math.min(2, G.lane + 1); if (G.active && !G.active.res) markLane(); e.preventDefault(); }
    else if (k >= "1" && k <= "3") { chooseAnswer(+k - 1); e.preventDefault(); }
    else if (k === "ArrowUp" || k === "w" || k === "W") { G.gas = true; e.preventDefault(); }
    else if ((k === "Enter" || k === " " || k === "ArrowDown") && G.active && !G.active.res && G.active.opts) { chooseAnswer(G.lane); e.preventDefault(); }   // OK = chốt đáp án ở làn đang chọn
    else if (k === " " || k === "Enter") { useNitro(); e.preventDefault(); }
    else if (k === "p" || k === "P" || k === "Escape" || k === "Backspace" || k === "GoBack") { pause(); e.preventDefault(); }
    else if (k === "r" || k === "R") { if (G.active && !G.active.res) readQuestion(G.active); }
    return;
  }
  if (focusList.length && (!$("start").classList.contains("hide") || !$("pause").classList.contains("hide") || !$("end").classList.contains("hide"))) {
    if (k === "ArrowRight" || k === "ArrowDown") { setFoc(foc + 1); e.preventDefault(); }
    else if (k === "ArrowLeft" || k === "ArrowUp") { setFoc(foc - 1); e.preventDefault(); }
    else if (k === "Enter" || k === " ") { focusList[foc] && focusList[foc].click(); e.preventDefault(); }
    else if (!$("pause").classList.contains("hide") && (k === "Escape" || k === "p" || k === "P")) resume();
  }
});

addEventListener("keyup", e => {
  const k = phim(e);
  if (G.mode === 2 && G2.players.length === 2) {
    if (k === "w" || k === "W") G2.players[0].gas = false;
    if (k === "ArrowUp") G2.players[1].gas = false;
  } else {
    if (k === "ArrowUp" || k === "w" || k === "W") G.gas = false;
  }
});

const hold = (el, fn) => { el.addEventListener("pointerdown", e => { e.preventDefault(); SFX.init(); fn(); }); };
hold($("padL"), () => { if (G.state === "race" || G.state === "count") { G.lane = Math.max(0, G.lane - 1); if (G.active && !G.active.res) markLane(); } });
hold($("padR"), () => { if (G.state === "race" || G.state === "count") { G.lane = Math.min(2, G.lane + 1); if (G.active && !G.active.res) markLane(); } });
hold($("padN"), useNitro);
$("padG").addEventListener("pointerdown", e => { e.preventDefault(); SFX.init(); G.gas = true; });
["pointerup", "pointercancel", "pointerleave"].forEach(ev => $("padG").addEventListener(ev, () => { G.gas = false; }));

// nút cảm ứng chế độ 2 người
document.querySelectorAll("#splitUI .ppad button").forEach(b => {
  const pi = +b.dataset.p, act = b.dataset.a;
  b.addEventListener("pointerdown", e => {
    e.preventDefault(); SFX.init();
    const p = G2.players[pi]; if (!p) return;
    if (act === "L") { p.lane = Math.max(0, p.lane - 1); if (p.active && !p.active.res) markLane2(p); }
    else if (act === "R") { p.lane = Math.min(2, p.lane + 1); if (p.active && !p.active.res) markLane2(p); }
    else if (act === "N") useNitro2(pi);
    else if (act === "G") p.gas = true;
  });
  if (act === "G") ["pointerup", "pointercancel", "pointerleave"].forEach(ev => b.addEventListener(ev, () => { if (G2.players[pi]) G2.players[pi].gas = false; }));
});

// vuốt trên màn hình
let tx0 = null; addEventListener("touchstart", e => { tx0 = e.touches[0].clientX; }, { passive: true });
addEventListener("touchend", e => { if (tx0 == null || G.mode !== 1 || !(G.state === "race" || G.state === "count")) return; const dx = e.changedTouches[0].clientX - tx0; if (Math.abs(dx) > 50) { G.lane = clamp(G.lane + (dx > 0 ? 1 : -1), 0, 2); if (G.active && !G.active.res) markLane(); } tx0 = null; }, { passive: true });

$("qread").onclick = () => { SFX.init(); if (G.active && !G.active.res) readQuestion(G.active); };
$("pResume").onclick = resume;
$("pRestart").onclick = () => { $("pause").classList.add("hide"); if (G.mode === 2) startRace2(); else startRace(); };
$("pHome").onclick = toMenu;
$("eAgain").onclick = () => { if (G.mode === 2) startRace2(); else startRace(); };
$("eHome").onclick = toMenu;

document.querySelectorAll(".char").forEach(b => b.onclick = () => {
  SFX.init();
  if (window.batDauNhac) try { window.batDauNhac(); } catch (e) {}
  LS.set("duaXe_mau", G.carColor);
  if (b.dataset.c === "both") {
    startRace2();
  } else {
    G.child = b.dataset.c;
    startRace();
  }
});
addEventListener("resize", () => { resize3(); resize2(); });
document.addEventListener("visibilitychange", () => { if (document.hidden) pause(); });

/* ---------- màn bắt đầu ---------- */
function refreshBest() { ["lucas", "lucie"].forEach(c => $("best_" + c).textContent = bestText(c)); }
function buildColors() {
  G.carColor = clamp(LS.get("duaXe_mau", 0), 0, MAUXE.length - 1);
  const box = $("mau");
  MAUXE.forEach(([c, n], i) => { const b = document.createElement("button"); b.style.background = c; b.title = "Xe màu " + n; b.className = i === G.carColor ? "on" : ""; b.onclick = () => { G.carColor = i; box.querySelectorAll("button").forEach((x, k) => x.className = k === i ? "on" : ""); LS.set("duaXe_mau", i); if (R3) { R3.scene.remove(R3.player); R3.player = makeCar(c, "player"); R3.scene.add(R3.player); } }; box.appendChild(b); });
}
document.querySelectorAll("[data-face]").forEach(i => i.src = faceUrl(i.dataset.face));
if (window.HS) document.querySelectorAll("[data-hs]").forEach(e => { const [a, b] = e.dataset.hs.split("."); if (HS[a] && HS[a][b]) e.textContent = HS[a][b]; });
buildColors(); refreshBest();
G.rivals = RIVALS.map((r, i) => ({ id: r.id, ten: r.ten, d: 20 + i * 12, x: LANES[i], lane: i, speed: 20, boost: 0 }));
if (hasWebGL()) { try { initThree(); } catch (e) { console.warn(e); R3 = null; init2D(); } } else init2D();
focusList = [...document.querySelectorAll(".char")]; setFoc(0);
requestAnimationFrame(loop);
</script>
<script src="ipad-tv.js"></script>
<script src="../anh-chung/anh-that.js"></script>
<!--NHAC--><script src="../anh-chung/nhac-nen.js" data-ten="Đua Xe Tia Chớp Lucie & Lucas" data-vitri="left:14px;top:calc(3vh + clamp(48px,5vw,72px))" data-bpm="150" data-goc="C" data-kieu="marimba" data-not="C5 C5 G5 G5 A5 A5 G5 F5 F5 E5 E5 D5 D5 C5 G4 C5"></script>
</body>
</html>
