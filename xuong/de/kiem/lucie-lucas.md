Em là lập trình viên game web giàu kinh nghiệm. Dưới đây là TOÀN BỘ mã game "lucie-lucas" (games/lucie-lucas/index.html) — game học tập cho hai bé Lucie (lớp 3) và Lucas (lớp 1), chơi trên TV LG webOS (phím mũi tên/OK, phím 1-4) và iPad/điện thoại (chạm). Anh (bố) báo: các con chơi vẫn còn NHIỀU LỖI.

NHIỆM VỤ: đọc kỹ toàn bộ mã như một người kiểm thử, tìm và SỬA mọi lỗi thật: kẹt màn/không sang câu tiếp, nút không bấm được trên TV hoặc iPad, đếm điểm/cúp/CIECAS sai, đáp án sai hoặc trùng, câu hỏi lặp, lưu ván dở lỗi, âm thanh/giọng đọc chồng nhau, giật/rò bộ nhớ (setInterval, requestAnimationFrame, listener, phần tử tạo mới không xóa), lỗi khi tải ảnh thất bại, lỗi giao diện tràn màn hình TV 1920x1080 và iPad dọc. Không đổi luật chơi, nội dung câu hỏi đúng, mặt thật hai bé, các tệp dùng chung (../anh-chung/*.js).

CÁCH TRẢ LỜI (bắt buộc): MỘT khối ```json là mảng [{"cu": "đoạn mã gốc copy NGUYÊN VĂN, đủ dài để duy nhất trong tệp", "moi": "đoạn thay"}]. Nếu không có lỗi thì trả về []. Sau khối json, liệt kê ngắn từng lỗi đã sửa (1 dòng/lỗi).

LƯU Ý: thư viện three.js nhúng và dữ liệu khuôn mặt 3D đã được bỏ bớt cho gọn — KHÔNG sửa hai chỗ đó. Ngân hàng câu hỏi rất dài: chỉ sửa câu nào SAI đáp án.

===== MÃ GỐC =====
<!DOCTYPE html>
<html lang="vi">
<head>
<script src="/games/anh-chung/dong-bo.js"></script>
<script src="/games/anh-chung/dem-gio.js" defer></script>
<meta name="robots" content="noindex, nofollow">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<title>Lucie và Lucas phiêu lưu</title>
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Lucie Lucas">
<meta name="theme-color" content="#ff8fc8">
<link rel="apple-touch-icon" href="data:...BASE64_BO_BOT...">
<link rel="icon" href="data:...BASE64_BO_BOT...">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body { font-family: "Segoe UI", "Comic Sans MS", Arial, sans-serif; background: #8fd3ff; color: #333; overflow: hidden; user-select: none; -webkit-user-select: none;
         overscroll-behavior: none; -webkit-tap-highlight-color: transparent; -webkit-touch-callout: none; touch-action: manipulation; }
  .screen { position: fixed; inset: 0; display: none; }
  .screen.active { display: flex; }
  button { font-family: inherit; touch-action: manipulation; }
  [hidden] { display: none !important; }

  /* ===== MÀN HÌNH 1: CHỌN NHÂN VẬT ===== */
  #startScreen { flex-direction: column; align-items: center; justify-content: center; gap: 24px; background: linear-gradient(135deg, #ffdeeb 0%, #e3f8ff 50%, #d3f9d8 100%); padding: 20px; }
  #startScreen h1 { font-size: clamp(32px, 6vw, 58px); color: #ff6b6b; text-shadow: 3px 3px 0 #fff; text-align: center; }
  .hint { font-size: 24px; color: #355; text-align: center; }
  .chars { display: flex; gap: 40px; flex-wrap: wrap; justify-content: center; }
  .charCard { background: #fff; border-radius: 30px; padding: 22px 40px; text-align: center; cursor: pointer; box-shadow: 0 8px 0 #c9d6df; transition: transform .2s; border: 6px solid transparent; width: 300px; }
  .charCard:hover { transform: translateY(-8px) scale(1.05); }
  .charCard.lucie { border-color: #ff8fc8; background: #fff0f6; }
  .charCard.lucas { border-color: #5bb8ff; background: #e7f5ff; }
  .charCard h2 { font-size: 40px; color: #333; }
  .charCard p { font-size: 22px; color: #666; }
  .charCard .prog { margin-top: 8px; font-size: 20px; color: #e8590c; font-weight: bold; min-height: 26px; }

  /* ===== MÀN HÌNH 2: CHỌN LEVEL ===== */
  #levelScreen { flex-direction: column; align-items: center; padding: 20px; gap: 18px; overflow-y: auto; }
  #levelScreen.lucas { background: linear-gradient(#a5d8ff, #e7f5ff); }
  #levelScreen.lucie { background: linear-gradient(#ffdeeb, #fff0f6); }
  .lvTop { width: min(1100px, 100%); display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
  .lvTop h1 { font-size: clamp(26px, 4.5vw, 44px); color: #333; text-shadow: 2px 2px 0 #fff; }
  .btn { font-size: 22px; border: none; background: #fff; border-radius: 20px; padding: 10px 18px; cursor: pointer; box-shadow: 0 4px 0 #bbb; font-weight: bold; color: #333; }
  .btn:active { transform: translateY(3px); box-shadow: 0 1px 0 #bbb; }
  .lvGrid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; width: min(1100px, 100%); }
  @media (max-width: 800px) { .lvGrid { grid-template-columns: repeat(2, 1fr); } }
  .biomeHead { grid-column: 1 / -1; border-radius: 18px; padding: 10px 18px; font-size: 22px; font-weight: 900; color: #fff; text-shadow: 1px 2px 0 rgba(0,0,0,.35); margin-top: 6px; }
  .lvTile { background: #fff; border-radius: 24px; padding: 14px 8px; text-align: center; cursor: pointer; box-shadow: 0 6px 0 #c9d6df; border: 5px solid #ffd43b; transition: transform .15s; }
  .lvTile:hover { transform: scale(1.06); }
  .lvTile .num { font-size: 22px; font-weight: 900; color: #e8590c; }
  .lvTile .ico { font-size: 46px; }
  .lvTile .nm { font-size: 18px; font-weight: bold; color: #333; min-height: 46px; display: flex; align-items: center; justify-content: center; }
  .lvTile .st { font-size: 26px; letter-spacing: 2px; }
  .lvTile.locked { background: #e9ecef; border-color: #ced4da; filter: grayscale(1); opacity: .7; }
  .lvTile.next { animation: pulse .6s infinite alternate; border-color: #51cf66; }
  #carPicker { display: none; align-items: center; gap: 16px; background: rgba(255,255,255,.85); border-radius: 26px; padding: 10px 22px; box-shadow: 0 5px 0 #c9d6df; flex-wrap: wrap; justify-content: center; }
  #carPicker.show { display: flex; }
  #carPicker .prev { width: 200px; height: 113px; }
  #carPicker .lbl { font-size: 22px; font-weight: bold; color: #333; }
  .sw { width: 44px; height: 44px; border-radius: 50%; border: 4px solid #fff; cursor: pointer; box-shadow: 0 3px 0 rgba(0,0,0,.2); transition: transform .15s; }
  .sw:hover { transform: scale(1.15); }
  .sw.on { outline: 4px solid #f76707; transform: scale(1.15); }
  #carPicker .bdg { font-size: 20px; color: #e8590c; font-weight: bold; margin-top: 6px; }
  .parentRow { display: flex; gap: 18px; flex-wrap: wrap; justify-content: center; }
  .resetAll { font-size: 17px; background: rgba(255,255,255,.75); border: 2px dashed #adb5bd; color: #495057; border-radius: 16px; padding: 8px 16px; cursor: pointer; font-family: inherit; }
  .resetAll.armed, .parentBtn.armed { background: #ffe3e3; border-color: #e03131; color: #c92a2a; font-weight: bold; }
  .parentBtn { font-size: 16px; background: transparent; border: none; color: #868e96; cursor: pointer; text-decoration: underline; margin-top: 6px; }

  /* ===== MÀN HÌNH 3: CHƠI GAME ===== */
  #gameScreen { flex-direction: column; }
  #world { position: absolute; inset: 0; overflow: hidden; --side: #7ed957; --road: #6b6b6b; --lane: #ffffff; }
  .cloud { position: absolute; font-size: 70px; animation: drift linear infinite; opacity: .9; }
  @keyframes drift { from { transform: translateX(110vw); } to { transform: translateX(-200px); } }
  #deco { position: absolute; top: 140px; right: 60px; font-size: 90px; }
  #scenery { position: absolute; left: 0; bottom: 30%; height: 100px; width: 100%; will-change: transform; }
  .scn { position: absolute; bottom: -4px; font-size: 76px; }
  #ground { position: absolute; left: 0; right: 0; bottom: 0; height: 30%; background: linear-gradient(var(--side) 0 18%, var(--road) 18% 100%); }
  #lane { position: absolute; left: 0; right: 0; top: 62%; height: 10px; background: repeating-linear-gradient(90deg, var(--lane) 0 60px, transparent 60px 130px); opacity: .85; }
  #track { position: absolute; left: 0; bottom: 14%; height: 120px; width: 100%; will-change: transform; z-index: 2; }
  .obstacle { position: absolute; bottom: 0; font-size: 95px; line-height: 1; transition: transform .5s, opacity .6s; }
  .obstacle.boss { font-size: 150px; animation: bossBreath 1s infinite alternate; }
  @keyframes bossBreath { to { transform: scale(1.1); } }
  .obstacle.boom { transform: scale(2) rotate(25deg) translateY(-40px) !important; opacity: 0; animation: none; }
  .coin { position: absolute; bottom: 90px; font-size: 48px; animation: spin .8s infinite alternate; transition: transform .6s, opacity .6s; }
  @keyframes spin { to { transform: translateY(-14px) scaleX(.6); } }
  .coin.got { transform: translateY(-180px) scale(1.6); opacity: 0; animation: none; }
  #player { position: absolute; left: 110px; bottom: 13%; z-index: 3; }
  #player.lucas { width: 230px; height: 130px; }
  #player.lucie { width: 218px; height: 215px; }
  .hero { width: 100%; height: 100%; display: block; overflow: visible; filter: drop-shadow(0 4px 4px rgba(0,0,0,.18)); }
  .hero .wheel { transform-box: fill-box; transform-origin: center; }
  #player.drive .wheel { animation: wheel .35s linear infinite; }
  @keyframes wheel { to { transform: rotate(360deg); } }
  .hero .skirt { transform-box: fill-box; transform-origin: 50% 0; }
  #player.walk .skirt { animation: swish .35s ease-in-out infinite alternate; }
  @keyframes swish { from { transform: scaleX(.97); } to { transform: scaleX(1.03); } }
  .hero .bear { transform-box: fill-box; transform-origin: 50% 100%; }
  #player.walk .bear { animation: bearHop .35s ease-in-out infinite alternate-reverse; }
  @keyframes bearHop { to { transform: translateY(-8px) rotate(-3deg); } }
  .hero .wand { transform-box: fill-box; transform-origin: 0% 100%; animation: wave 1.2s ease-in-out infinite alternate; }
  @keyframes wave { to { transform: rotate(-14deg); } }
  #player .trail { position: absolute; left: -46px; bottom: 14px; font-size: 42px; opacity: 0; }
  .faceImg { width: 150px; height: 150px; border-radius: 50%; border: 6px solid #fff; box-shadow: 0 6px 14px rgba(0,0,0,.25); object-fit: cover; display: block; margin: 0 auto; }
  .heroWrap { display: block; margin: 0 auto; animation: bob 1s infinite alternate; }
  .lucie .heroWrap { width: 190px; height: 187px; }
  .lucas .heroWrap { width: 220px; height: 125px; margin-top: 40px; margin-bottom: 20px; }
  .titleFace { width: 56px; height: 56px; border-radius: 50%; border: 3px solid #fff; vertical-align: middle; object-fit: cover; margin-right: 8px; }
  .winFace { width: 130px; height: 130px; border-radius: 50%; border: 6px solid #ffd43b; object-fit: cover; vertical-align: middle; }
  #player.drive { animation: vib .12s infinite alternate; }
  #player.walk { animation: bob .35s infinite alternate; }
  #player.drive .trail, #player.walk .trail { opacity: .85; animation: puff .3s infinite alternate; }
  #player.jump { animation: jump .7s ease-out; }
  @keyframes vib { to { transform: translateY(-4px); } }
  @keyframes bob { to { transform: translateY(-16px); } }
  @keyframes puff { to { transform: translateX(-10px) scale(1.2); opacity: .4; } }
  @keyframes jump { 0% { transform: translateY(0); } 45% { transform: translateY(-160px) rotate(-12deg); } 100% { transform: translateY(0); } }

  .hud { position: absolute; top: calc(10px + env(safe-area-inset-top, 0px)); left: calc(10px + env(safe-area-inset-left, 0px)); right: calc(10px + env(safe-area-inset-right, 0px)); display: flex; justify-content: space-between; align-items: center; z-index: 5; gap: 10px; flex-wrap: wrap; }
  .hud .group { display: flex; gap: 10px; flex-wrap: wrap; }
  .hud .box { background: #fff; border-radius: 20px; padding: 8px 16px; font-size: 22px; font-weight: bold; box-shadow: 0 4px 0 #bbb; color: #333; }
  #comboBox.hot { background: #ffe066; animation: pulse .6s infinite alternate; }
  @keyframes pulse { to { transform: scale(1.07); } }

  #map { position: absolute; top: 76px; left: 50%; transform: translateX(-50%); z-index: 5; display: flex; align-items: center; gap: 4px; background: rgba(255,255,255,.9); padding: 6px 16px; border-radius: 30px; box-shadow: 0 4px 0 #bbb; white-space: nowrap; }
  #map .lvName { font-size: 20px; font-weight: bold; margin-right: 10px; color: #333; }
  .node { width: 38px; height: 38px; border-radius: 50%; background: #dee2e6; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; color: #868e96; flex-shrink: 0; }
  .node.done { background: #51cf66; color: #fff; }
  .node.now { background: #ffd43b; color: #333; animation: pulse .5s infinite alternate; }
  .node.bossNode { font-size: 22px; }
  .line { width: 16px; height: 5px; background: #dee2e6; border-radius: 3px; }
  .line.done { background: #51cf66; }

  #zoneBanner { position: fixed; top: 42%; left: 50%; transform: translate(-50%, -50%); z-index: 8; background: #fff; border: 6px solid #ffb703; border-radius: 30px; padding: 18px 36px; font-size: clamp(26px, 5vw, 46px); font-weight: 900; color: #e8590c; display: none; text-align: center; white-space: nowrap; }
  #zoneBanner.show { display: block; animation: banner 2.4s forwards; }
  @keyframes banner { 0% { transform: translate(-50%,-50%) scale(.3); opacity: 0; } 15% { transform: translate(-50%,-50%) scale(1.1); opacity: 1; } 80% { opacity: 1; } 100% { transform: translate(-50%,-50%) scale(1); opacity: 0; } }

  /* ===== POP-UP CÂU HỎI ===== */
  .overlay { position: fixed; inset: 0; background: rgba(0,0,0,.45); display: none; align-items: center; justify-content: center; z-index: 10; padding: 12px; }
  .overlay.show { display: flex; }
  .card { background: #fffdf3; border-radius: 30px; padding: 24px; width: min(860px, 96vw); border: 7px solid #ffb703; animation: pop .35s; max-height: 96vh; overflow-y: auto; }
  .card.bossCard { border-color: #7b5ea7; background: #f8f0ff; }
  @keyframes pop { from { transform: scale(.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .quizTop { display: flex; justify-content: space-between; align-items: center; gap: 10px; flex-wrap: wrap; }
  .stageTag { font-size: 22px; font-weight: bold; color: #555; }
  .subject { display: inline-block; padding: 8px 20px; border-radius: 20px; color: #fff; font-size: 22px; font-weight: bold; }
  .timerNum { font-size: 26px; font-weight: 900; color: #2b8a3e; background: #fff; border-radius: 20px; padding: 6px 16px; box-shadow: 0 3px 0 #ced4da; min-width: 96px; text-align: center; }
  .timerNum.warn { color: #e67700; } .timerNum.hot { color: #e03131; animation: pulse .3s infinite alternate; }
  .timerBar { height: 16px; background: #e9ecef; border-radius: 10px; margin-top: 14px; overflow: hidden; box-shadow: inset 0 2px 3px rgba(0,0,0,.12); }
  .timerFill { height: 100%; width: 100%; border-radius: 10px; background: linear-gradient(90deg,#69db7c,#2f9e44); transition: width .1s linear; }
  .toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); z-index: 50; background: #fff; border: 4px solid #ffb703; border-radius: 20px; padding: 12px 22px; font-size: 22px; font-weight: bold; color: #333; box-shadow: 0 6px 16px rgba(0,0,0,.2); white-space: nowrap; }
  /* Cúp */
  .cupPop { text-align: center; }
  .cupPop h2 { font-size: clamp(28px, 5vw, 42px); color: #e8590c; }
  .cupPop p { font-size: 24px; color: #333; margin: 6px 0; }
  .cupPop .cupBig { width: 190px; height: 190px; margin: 6px auto; animation: cupIn .8s cubic-bezier(.2,1.6,.4,1); }
  .cupPop .cupBig svg { width: 100%; height: 100%; }
  @keyframes cupIn { from { transform: scale(.2) rotate(-30deg); opacity: 0; } to { transform: scale(1) rotate(0); opacity: 1; } }
  .cupPop button { font-size: 24px; border: none; border-radius: 20px; padding: 12px 26px; margin-top: 12px; cursor: pointer; color: #fff; font-weight: bold; background: #f76707; box-shadow: 0 5px 0 rgba(0,0,0,.2); }
  .cupGrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(118px, 1fr)); gap: 12px; margin-top: 14px; max-height: 62vh; overflow-y: auto; padding: 4px; }
  @media (max-width: 700px) { .cupGrid { grid-template-columns: repeat(3, 1fr); } }
  .cupCell { text-align: center; background: #fff; border-radius: 18px; padding: 10px 4px; box-shadow: 0 4px 0 #e9ecef; }
  .cupCell svg { width: 96px; height: 96px; }
  .cupCell .cn { font-size: 15px; font-weight: bold; color: #333; min-height: 38px; }
  .cupCell.locked svg { filter: grayscale(1) brightness(1.3); opacity: .45; }
  .shine { animation: shine 2.4s ease-in-out infinite; }
  @keyframes shine { 0%,100% { opacity: .25; } 50% { opacity: .95; } }
  .qtext { font-size: clamp(24px, 4vw, 38px); margin: 18px 0 4px; line-height: 1.4; color: #333; font-weight: bold; text-align: center; }
  .options { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .opt { font-size: clamp(20px, 3.2vw, 30px); padding: 18px 12px; border-radius: 22px; border: none; cursor: pointer; color: #fff; font-weight: bold; box-shadow: 0 6px 0 rgba(0,0,0,.2); transition: transform .15s; }
  .opt:hover { transform: scale(1.04); }
  .opt:nth-child(1) { background: #ff6b6b; } .opt:nth-child(2) { background: #4dabf7; }
  .opt:nth-child(3) { background: #40c057; } .opt:nth-child(4) { background: #b57edc; }
  .opt.wrong { opacity: .3; pointer-events: none; }
  .opt.right { outline: 7px solid #ffd43b; transform: scale(1.06); }
  .message { font-size: 26px; text-align: center; min-height: 40px; margin-top: 14px; font-weight: bold; }
  .shake { animation: shake .5s; }
  @keyframes shake { 0%,100% { transform: translateX(0); } 20%,60% { transform: translateX(-16px); } 40%,80% { transform: translateX(16px); } }

  #praise { position: fixed; top: 22%; left: 50%; transform: translateX(-50%); font-size: clamp(50px, 10vw, 100px); font-weight: 900; color: #ffd43b; text-shadow: 4px 4px 0 #e8590c, -2px -2px 0 #fff; z-index: 30; display: none; pointer-events: none; white-space: nowrap; }
  #praise.show { display: block; animation: praiseAnim 1.3s forwards; }
  @keyframes praiseAnim { 0% { transform: translateX(-50%) scale(.3); } 30% { transform: translateX(-50%) scale(1.15); } 100% { transform: translateX(-50%) scale(1) translateY(-40px); opacity: 0; } }

  /* ===== HOÀN THÀNH LEVEL ===== */
  .win { text-align: center; }
  .win h2 { font-size: clamp(28px, 5vw, 44px); color: #e8590c; }
  .win .big { font-size: 90px; }
  .win .stars { font-size: 70px; letter-spacing: 10px; }
  .win .stars span { display: inline-block; animation: pop .5s backwards; }
  .win p { font-size: 24px; margin: 8px 0; color: #333; }
  .win .record { color: #e8590c; font-weight: bold; }
  .win button { font-size: 24px; border: none; border-radius: 20px; padding: 14px 24px; margin: 12px 6px 0; cursor: pointer; color: #fff; font-weight: bold; box-shadow: 0 5px 0 rgba(0,0,0,.2); }

  #tapStart { position: fixed; inset: 0; z-index: 60; display: flex; align-items: center; justify-content: center; cursor: pointer;
              background: radial-gradient(circle at 50% 40%, #fff0f6 0%, #d0ebff 55%, #b2f2bb 100%); }
  .tapBox { text-align: center; padding: 20px; }
  .tapTitle { font-size: clamp(32px, 7vw, 64px); font-weight: 900; color: #ff6b6b; text-shadow: 3px 3px 0 #fff; }
  .tapHeroes { display: flex; gap: 30px; justify-content: center; align-items: flex-end; margin: 24px 0; }
  .tapHero { width: 170px; height: 168px; animation: bob 1s infinite alternate; }
  .tapHero.car { width: 230px; height: 130px; animation-delay: .5s; }
  .tapBtn { display: inline-block; font-size: clamp(24px, 4.5vw, 36px); font-weight: 900; color: #fff; background: linear-gradient(#ff922b, #f76707);
            padding: 18px 36px; border-radius: 40px; box-shadow: 0 8px 0 #c2410c; animation: pulse .7s infinite alternate; }
  @media (max-height: 560px) {
    #player { zoom: .62; }
    .obstacle { font-size: 60px; } .obstacle.boss { font-size: 95px; } .coin { font-size: 32px; bottom: 56px; } .scn { font-size: 48px; }
    .hud .box, .hud .btn { font-size: 15px; padding: 5px 10px; }
    #map { top: calc(52px + env(safe-area-inset-top, 0px)); padding: 3px 10px; zoom: .8; }
    #deco { top: 80px; font-size: 56px; }
    .card { padding: 14px; border-width: 5px; }
    .qtext { font-size: 22px; margin: 8px 0 2px; }
    .opt { font-size: 19px; padding: 10px 8px; }
    .options { gap: 10px; }
    .message { font-size: 19px; min-height: 26px; margin-top: 8px; }
    .timerNum, .subject, .stageTag { font-size: 17px; }
    .timerBar { margin-top: 8px; height: 12px; }
    #zoneBanner { font-size: 26px; }
    .win .big { font-size: 56px; } .win .stars { font-size: 44px; } .win p { font-size: 18px; }
    .win button { font-size: 18px; padding: 10px 16px; }
    .tapHeroes { margin: 10px 0; zoom: .75; }
  }
  @media (max-width: 520px) {
    .options { grid-template-columns: 1fr; }
    #map .lvName { display: none; }
  }
  #gl { position: absolute; inset: 0; width: 100%; height: 100%; display: block; touch-action: none; }
  #bubbles { position: absolute; inset: 0; pointer-events: none; z-index: 4; overflow: hidden; }
  .bub { position: absolute; transform: translate(-50%, -100%); background: #fff; color: #222; border: 2px solid #222; border-radius: 10px;
         padding: 2px 8px; font-size: 13px; font-weight: 800; line-height: 1.25; white-space: nowrap; max-width: 44vw; overflow: hidden; text-overflow: ellipsis;
         animation: pop .25s; box-shadow: 0 2px 0 rgba(0,0,0,.2); opacity: .95; }
  .bub::after { content: ""; position: absolute; left: 50%; bottom: -8px; transform: translateX(-50%); border: 6px solid transparent; border-top-color: #222; }
  .bub.kid { background: #fff3bf; } .bub.pop { background: #ffe3e3; color: #c92a2a; font-size: 14px; }
  .bub.stars, .bub.float { background: none; border: none; box-shadow: none; font-size: 20px; padding: 0; overflow: visible; max-width: none; }
  .bub.stars::after, .bub.float::after { display: none; }
  .bub.float { animation: floatUp .6s forwards; }
  .bub.plus { font-size: 18px; color: #fff; text-shadow: 2px 2px 0 #1098ad, -1px -1px 0 #1098ad; }
  .hud .box.bump { animation: bump .35s; }
  @keyframes bump { 40% { transform: scale(1.3); background: #c5f6fa; } }
  @keyframes floatUp { to { transform: translate(-50%, -220%); opacity: 0; } }
  #caught { position: absolute; top: 34%; left: 50%; transform: translateX(-50%); z-index: 6; font-size: clamp(30px, 6vw, 60px); font-weight: 900;
            color: #fff; text-shadow: 3px 3px 0 #e03131, -2px -2px 0 #c92a2a; display: none; white-space: nowrap; pointer-events: none; }
  #caught.show { display: block; animation: praiseAnim 2.6s forwards; }
  .laneBtns { position: absolute; right: calc(14px + env(safe-area-inset-right, 0px)); bottom: calc(18px + env(safe-area-inset-bottom, 0px));
              display: flex; flex-direction: column; gap: 12px; z-index: 5; }
  .laneBtns button { width: 64px; height: 64px; border-radius: 50%; border: 4px solid #fff; background: rgba(255,146,43,.92); color: #fff;
                     font-size: 30px; font-weight: 900; box-shadow: 0 5px 0 rgba(0,0,0,.25); cursor: pointer; }
  .laneBtns[hidden] { display: none !important; }
  .laneBtns button:active { transform: translateY(3px); }
  .box.chase.c1 { background: #fff3bf; } .box.chase.c2 { background: #ffd8a8; }
  .box.chase.c3 { background: #ffc9c9; animation: pulse .4s infinite alternate; } .box.chase.c4 { background: #ff8787; color: #fff; }
  @media (max-width: 600px) {
    #map { top: auto; bottom: calc(14px + env(safe-area-inset-bottom, 0px)); left: calc(10px + env(safe-area-inset-left, 0px)); transform: none; zoom: .72; }
    #map .lvName { display: none; }
    .hud .box, .hud .btn { font-size: 15px; padding: 5px 10px; }
  }
  @media (max-height: 560px) { .laneBtns button { width: 50px; height: 50px; font-size: 22px; } .bub { font-size: 12px; } }
  @media (max-width: 600px) { .bub { font-size: 11.5px; padding: 2px 6px; } }
  #confetti { position: fixed; inset: 0; pointer-events: none; z-index: 25; }
</style>
<link rel="manifest" href="/manifest.webmanifest"><meta name="theme-color" content="#7c4dff"><link rel="apple-touch-icon" href="/img/icon-192.png"><script>if("serviceWorker" in navigator)addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").catch(function(){})});</script>
<script src="../anh-chung/thong-tin.js"></script>
</head>
<body>

<!-- Trình duyệt / iPad chỉ cho phát tiếng sau lần chạm đầu tiên, nên có màn chạm để vào game -->
<div id="tapStart" onclick="tapToStart()">
  <div class="tapBox">
    <div class="tapTitle">🌈 Lucie &amp; Lucas phiêu lưu 🌈</div>
    <div class="tapHeroes"><div class="tapHero" data-hero="lucie"></div><div class="tapHero car" data-hero="lucas"></div></div>
    <div class="tapBtn">👆 Chạm vào đây để bắt đầu 🎵</div>
  </div>
</div>

<!-- ============ MÀN HÌNH 1: CHỌN NHÂN VẬT ============ -->
<div id="startScreen" class="screen active">
  <h1>🌈 Lucie &amp; Lucas phiêu lưu 🌈</h1>
  <div class="hint">Mỗi bạn có 30 level 3D qua 6 vùng đất. Trả lời sai là bố mẹ đuổi theo đấy! Trả lời đúng để vượt chướng ngại vật nhé!<br>Hôm nay ai chơi nào?</div>
  <div class="chars">
    <div class="charCard lucie" onclick="openLevels('lucie')">
      <div class="heroWrap" data-hero="lucie"></div><h2>Lucie</h2><p><b data-hs="lucie.ten">Nguyễn Ngọc Tường San</b><br>Lớp <span data-hs="lucie.lop">3A6</span> • Công chúa phiêu lưu</p>
      <div class="prog" id="prog-lucie"></div>
    </div>
    <div class="charCard lucas" onclick="openLevels('lucas')">
      <div class="heroWrap" data-hero="lucas"></div><h2>Lucas</h2><p><b data-hs="lucas.ten">Nguyễn Ngọc Tường Minh</b><br>Lớp <span data-hs="lucas.lop">1A5</span> • Đua xe tốc độ</p>
      <div class="prog" id="prog-lucas"></div>
    </div>
  </div>
  <button class="resetAll" id="resetAllBtn" onclick="resetAll()">🔄 Chơi lại từ đầu (xóa hết tiến độ của cả 2 bạn)</button>
</div>

<!-- ============ MÀN HÌNH 2: CHỌN LEVEL ============ -->
<div id="levelScreen" class="screen">
  <div class="lvTop">
    <button class="btn" onclick="goHome()">⬅ Đổi nhân vật</button>
    <h1 id="lvTitle"></h1>
    <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn fsBtn" onclick="toggleFull()">⛶ Toàn màn hình</button><button class="btn" id="cupBtn" onclick="openCups()">🏆 Phòng cúp</button><button class="btn" id="musicBtn2" onclick="toggleMusic()">🔇 Tắt nhạc</button></div>
  </div>
  <div id="carPicker"></div>
  <div class="lvGrid" id="lvGrid"></div>
  <div class="parentRow">
    <button class="parentBtn" onclick="unlockAll()">🔓 Mở khóa tất cả level (dành cho bố mẹ)</button>
    <button class="parentBtn" onclick="resetChar()">🔄 Chơi lại từ đầu cho bạn này</button>
  </div>
</div>

<!-- ============ MÀN HÌNH 3: CHƠI GAME ============ -->
<div id="gameScreen" class="screen">
  <div id="world">
    <canvas id="gl"></canvas>
    <div id="bubbles"></div>
    <div id="caught"></div>
    <div class="laneBtns" hidden><button id="laneUp" aria-label="Lên làn trên">⬆</button><button id="laneDown" aria-label="Xuống làn dưới">⬇</button></div>
  </div>
  <div class="hud">
    <div class="group">
      <div class="box">⭐ Điểm: <span id="score">0</span></div>
      <div class="box" id="comboBox">🔥 Combo: <span id="combo">0</span> <span id="mult"></span></div>
      <div class="box"><span id="collectIcon">🪙</span> <span id="coins">0</span></div>
      <div class="box chase c0" id="chaseBox">😄 An toàn</div>
    </div>
    <div class="group">
      <button class="btn" id="musicBtn" onclick="toggleMusic()">🔇 Tắt nhạc</button>
      <button class="btn fsBtn" onclick="toggleFull()">⛶</button>
      <button class="btn" onclick="backToLevels()">🗺️ Chọn level</button>
    </div>
  </div>
  <div id="map"></div>
  <div id="zoneBanner"></div>
</div>

<!-- ============ POP-UP CÂU HỎI ============ -->
<div id="quizOverlay" class="overlay">
  <div class="card" id="quizCard">
    <div class="quizTop">
      <span class="stageTag" id="qStage"></span>
      <span class="subject" id="qSubject">Toán</span>
      <button type="button" id="qRead" onclick="docCauHoi(true)" style="border:0;border-radius:999px;padding:4px 12px;font:inherit;font-weight:800;color:#fff;background:#1c7ed6;cursor:pointer">🔊 Đọc</button>
      <span class="timerNum" id="timerNum">⏱ 10</span>
    </div>
    <div class="qtext" id="qText"></div>
    <div class="timerBar"><div class="timerFill" id="timerFill"></div></div>
    <div class="options" id="qOptions" style="margin-top:16px"></div>
    <div class="message" id="qMessage"></div>
  </div>
</div>

<!-- ============ HOÀN THÀNH LEVEL ============ -->
<div id="winOverlay" class="overlay">
  <div class="card win">
    <div class="big" id="winBig">🏆</div>
    <h2 id="winTitle">Hoàn thành!</h2>
    <div class="stars" id="winStars"></div>
    <p id="winScore"></p>
    <p id="winDetail"></p>
    <p class="record" id="winRecord"></p>
    <button id="nextBtn" style="background:#f76707" onclick="startLevel(state.char, state.level + 1)">▶ Level tiếp theo</button>
    <button style="background:#40c057" onclick="startLevel(state.char, state.level)">🔁 Chơi lại</button>
    <button style="background:#4dabf7" onclick="backToLevels()">🗺️ Chọn level</button>
  </div>
</div>

<div id="cupOverlay" class="overlay" style="z-index:22"></div>

<div id="praise"></div>
<canvas id="confetti"></canvas>

<script>
/* Thư viện đồ họa 3D Three.js r149 (giấy phép MIT) — nhúng sẵn để chơi không cần mạng */
/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
/* ...THƯ VIỆN THREE.JS ĐÃ NHÚNG (bỏ bớt, không sửa)... */

</script>
<script src="../anh-chung/che-do-tv.js"></script>
<script>
/* ẢNH MẶT LUCIE VÀ LUCAS — đã nhúng sẵn trong file, KHÔNG CẦN SỬA */
const FACES = {
  lucas: "data:...BASE64_BO_BOT...",
  lucie: "data:...BASE64_BO_BOT..."
};
/* ẢNH MẶT BỐ VÀ MẸ (dùng cho cảnh đuổi bắt) */
const PARENT_FACES = {
  dad: "data:...BASE64_BO_BOT...",
  mom: "data:...BASE64_BO_BOT..."
};
</script>
<script>
/* =====================================================================
   NGÂN HÀNG CÂU HỎI — ANH CHỈ CẦN SỬA / THÊM Ở ĐÂY
   ---------------------------------------------------------------------
   - "lucie" = câu hỏi cho Lucie (Lớp 3)   - "lucas" = câu hỏi cho Lucas (Lớp 1)
   Mỗi câu hỏi nằm trên 1 dòng, dạng { ... }, các câu cách nhau bằng DẤU PHẨY:
     id           : số thứ tự (không trùng nhau)
     level        : câu này thuộc level nào (từ 1 đến 10)
     subject      : "Toán" hoặc "Tiếng Việt" hoặc "Tiếng Anh"
     question     : nội dung câu hỏi (đặt trong dấu ngoặc kép)
     readAloud    : (KHÔNG bắt buộc) câu để loa đọc thay cho question,
                    dùng khi câu hỏi có ký hiệu khó đọc như "7 × 8"
     options      : 4 đáp án, đặt trong [ ], cách nhau bằng dấu phẩy
     correctIndex : vị trí đáp án ĐÚNG, ĐẾM TỪ 0 (0 = A, 1 = B, 2 = C, 3 = D)
   - Mỗi level lấy ngẫu nhiên 5 câu có cùng số level (xem CAU_MOI_LEVEL).
     Anh thêm nhiều câu cho 1 level thì mỗi lần chơi lại sẽ khác nhau.
   - Câu cuối cùng của mỗi level là "Trùm" (chướng ngại vật to).
   - MẸO môn Tiếng Anh: từ tiếng Anh trong câu hỏi đặt giữa hai dấu nháy
     đơn, ví dụ 'Hello', thì loa sẽ đọc bằng giọng tiếng Anh.
   ===================================================================== */
const questionsData = {
  lucas: [
    {"id": 1, "level": 1, "subject": "Toán", "question": "🚗🚗🚗 Có mấy chiếc xe?", "options": ["2", "3", "4", "5"], "correctIndex": 1},
    {"id": 2, "level": 1, "subject": "Toán", "question": "1 + 1 = ?", "options": ["1", "3", "2", "0"], "correctIndex": 2},
    {"id": 3, "level": 1, "subject": "Tiếng Việt", "question": "Chữ nào là chữ 'a'?", "options": ["o", "a", "e", "i"], "correctIndex": 1},
    {"id": 4, "level": 1, "subject": "Tiếng Việt", "question": "Tiếng 'bà' bắt đầu bằng chữ nào?", "options": ["b", "a", "c", "d"], "correctIndex": 0},
    {"id": 5, "level": 1, "subject": "Tiếng Anh", "question": "'One' là số mấy?", "options": ["1", "2", "3", "4"], "correctIndex": 0},
    {"subject": "Toán", "question": "Điền dấu: 10 … 7", "options": ["<", ">", "+", "="], "correctIndex": 1, "level": 1, "id": 6},
    {"subject": "Toán", "question": "Có 2 quả bóng bay 🎈, cho bạn 1 quả bóng bay. Còn mấy quả bóng bay?", "options": ["0", "2", "3", "1"], "correctIndex": 3, "level": 1, "id": 7},
    {"subject": "Toán", "question": "2 − 1 = ?", "options": ["2", "3", "1", "0"], "correctIndex": 2, "level": 1, "id": 8},
    {"subject": "Toán", "question": "Có 9 cái kẹo 🍬, thêm 9 cái kẹo nữa. Có tất cả mấy cái kẹo?", "options": ["17", "18", "19", "16"], "correctIndex": 1, "level": 1, "id": 9},
    {"subject": "Toán", "question": "Có 6 con cá 🐟, thêm 1 con cá nữa. Có tất cả mấy con cá?", "options": ["7", "8", "9", "5"], "correctIndex": 0, "level": 1, "id": 10},
    {"subject": "Toán", "question": "Điền dấu: 1 … 6", "options": ["+", ">", "<", "="], "correctIndex": 2, "level": 1, "id": 11},
    {"subject": "Toán", "question": "Có 3 chiếc ô tô 🚗, thêm 3 chiếc ô tô nữa. Có tất cả mấy chiếc ô tô?", "options": ["6", "8", "5", "7"], "correctIndex": 0, "level": 1, "id": 12},
    {"subject": "Toán", "question": "Số gồm 3 chục và 4 đơn vị là:", "options": ["43", "7", "44", "34"], "correctIndex": 3, "level": 1, "id": 13},
    {"subject": "Toán", "question": "🟢 là hình gì?", "options": ["Hình chữ nhật", "Hình tam giác", "Hình vuông", "Hình tròn"], "correctIndex": 3, "level": 1, "id": 14},
    {"subject": "Toán", "question": "Có 4 bông hoa 🌸, cho bạn 2 bông hoa. Còn mấy bông hoa?", "options": ["0", "2", "3", "4"], "correctIndex": 1, "level": 1, "id": 15},
    {"subject": "Toán", "question": "🟥 là hình gì?", "options": ["Hình tròn", "Hình tam giác", "Hình chữ nhật", "Hình vuông"], "correctIndex": 3, "level": 1, "id": 16},
    {"subject": "Toán", "question": "⚽⚽⚽ Có mấy quả bóng?", "options": ["3", "5", "1", "2"], "correctIndex": 0, "level": 1, "id": 17},
    {"subject": "Toán", "question": "🐥🐥🐥🐥🐥🐥 Có mấy chú gà con?", "options": ["8", "5", "6", "7"], "correctIndex": 2, "level": 1, "id": 18},
    {"subject": "Toán", "question": "9 + 1 = ?", "options": ["10", "8", "9", "11"], "correctIndex": 0, "level": 1, "id": 19},
    {"subject": "Toán", "question": "Điền dấu: 4 … 9", "options": [">", "<", "=", "+"], "correctIndex": 1, "level": 1, "id": 20},
    {"subject": "Toán", "question": "2 + 1 = ?", "options": ["4", "2", "1", "3"], "correctIndex": 3, "level": 1, "id": 21},
    {"subject": "Toán", "question": "🐞🐞🐞 Có mấy con bọ rùa?", "options": ["3", "5", "1", "2"], "correctIndex": 0, "level": 1, "id": 22},
    {"subject": "Toán", "question": "4 − 3 = ?", "options": ["1", "2", "3", "0"], "correctIndex": 0, "level": 1, "id": 23},
    {"subject": "Tiếng Việt", "question": "🐝 là gì?", "options": ["Con ong", "Con chuột", "Con khỉ", "Con mèo"], "correctIndex": 0, "level": 1, "id": 24},
    {"subject": "Tiếng Việt", "question": "Tiếng 'dê' bắt đầu bằng chữ nào?", "options": ["d", "c", "b", "t"], "correctIndex": 0, "level": 1, "id": 25},
    {"subject": "Tiếng Việt", "question": "🐘 là gì?", "options": ["Con bò", "Con voi", "Con hổ", "Con ếch"], "correctIndex": 1, "level": 1, "id": 26},
    {"subject": "Tiếng Việt", "question": "Tiếng 'cam' có vần gì?", "options": ["oe", "ui", "an", "am"], "correctIndex": 3, "level": 1, "id": 27},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'v'?", "options": ["v", "o", "m", "q"], "correctIndex": 0, "level": 1, "id": 28},
    {"subject": "Tiếng Việt", "question": "🐱 là gì?", "options": ["Con bò", "Con mèo", "Con ốc", "Con cá"], "correctIndex": 1, "level": 1, "id": 29},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'oe'?", "options": ["hạt", "khoe", "đèn", "thuyền"], "correctIndex": 1, "level": 1, "id": 30},
    {"subject": "Tiếng Việt", "question": "⛵ là gì?", "options": ["Bóng bay", "Quyển sách", "Con dê", "Thuyền buồm"], "correctIndex": 3, "level": 1, "id": 31},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'm'?", "options": ["ơ", "m", "x", "ă"], "correctIndex": 1, "level": 1, "id": 32},
    {"subject": "Tiếng Việt", "question": "🐰 là gì?", "options": ["Con ong", "Con rùa", "Con thỏ", "Con diều"], "correctIndex": 2, "level": 1, "id": 33},
    {"subject": "Tiếng Việt", "question": "🐄 là gì?", "options": ["Con lợn", "Con bò", "Con ốc", "Con ong"], "correctIndex": 1, "level": 1, "id": 34},
    {"subject": "Tiếng Việt", "question": "Tiếng 'cột' có vần gì?", "options": ["oi", "ôt", "âng", "ương"], "correctIndex": 1, "level": 1, "id": 35},
    {"subject": "Tiếng Việt", "question": "✏️ là gì?", "options": ["Con khỉ", "Bắp ngô", "Bút chì", "Quả dưa"], "correctIndex": 2, "level": 1, "id": 36},
    {"subject": "Tiếng Anh", "question": "'Dưa hấu' tiếng Anh là gì?", "options": ["Bread", "Watermelon", "Orange", "Milk"], "correctIndex": 1, "level": 1, "id": 37},
    {"subject": "Tiếng Anh", "question": "🐱 tiếng Anh là gì?", "options": ["Fish", "Rabbit", "Elephant", "Cat"], "correctIndex": 3, "level": 1, "id": 38},
    {"subject": "Tiếng Anh", "question": "Số 8 tiếng Anh là gì?", "options": ["Eight", "Ten", "Seven", "Six"], "correctIndex": 0, "level": 1, "id": 39},
    {"subject": "Tiếng Anh", "question": "🥛 tiếng Anh là gì?", "options": ["Milk", "Mango", "Rice", "Grapes"], "correctIndex": 0, "level": 1, "id": 40},
    {"subject": "Tiếng Anh", "question": "🐄 tiếng Anh là gì?", "options": ["Cow", "Dog", "Tiger", "Horse"], "correctIndex": 0, "level": 1, "id": 41},
    {"subject": "Tiếng Anh", "question": "'Sorry' nghĩa là gì?", "options": ["Cảm ơn", "Tạm biệt", "Chào buổi sáng", "Xin lỗi"], "correctIndex": 3, "level": 1, "id": 42},
    {"subject": "Tiếng Anh", "question": "'Turtle' nghĩa là gì?", "options": ["Con chó", "Con rùa", "Con voi", "Con cá"], "correctIndex": 1, "level": 1, "id": 43},
    {"subject": "Tiếng Anh", "question": "'Tiger' nghĩa là gì?", "options": ["Con rùa", "Con gấu", "Con vịt", "Con hổ"], "correctIndex": 3, "level": 1, "id": 44},
    {"subject": "Tiếng Anh", "question": "🔴 tiếng Anh là gì?", "options": ["Orange", "Purple", "Red", "Black"], "correctIndex": 2, "level": 1, "id": 45},
    {"subject": "Tiếng Anh", "question": "'Brown' nghĩa là gì?", "options": ["Màu đen", "Màu nâu", "Màu xanh dương", "Màu xanh lá"], "correctIndex": 1, "level": 1, "id": 46},
    {"subject": "Tiếng Anh", "question": "'Màu đỏ' tiếng Anh là gì?", "options": ["Red", "Blue", "White", "Purple"], "correctIndex": 0, "level": 1, "id": 47},
    {"subject": "Tiếng Anh", "question": "'Bánh mì' tiếng Anh là gì?", "options": ["Rice", "Grapes", "Bread", "Milk"], "correctIndex": 2, "level": 1, "id": 48},
    {"subject": "Tiếng Anh", "question": "Số 6 tiếng Anh là gì?", "options": ["Eight", "Six", "Nine", "Three"], "correctIndex": 1, "level": 1, "id": 49},
    {"subject": "Tiếng Anh", "question": "'White' nghĩa là gì?", "options": ["Màu hồng", "Màu trắng", "Màu đen", "Màu vàng"], "correctIndex": 1, "level": 1, "id": 50},
    {"id": 51, "level": 2, "subject": "Toán", "question": "2 + 2 = ?", "options": ["3", "4", "5", "2"], "correctIndex": 1},
    {"id": 52, "level": 2, "subject": "Toán", "question": "Số nào bé nhất?", "options": ["5", "3", "1", "4"], "correctIndex": 2},
    {"id": 53, "level": 2, "subject": "Tiếng Việt", "question": "Tiếng nào có chữ 'c'?", "options": ["cá", "bé", "hổ", "mẹ"], "correctIndex": 0},
    {"id": 54, "level": 2, "subject": "Tiếng Việt", "question": "🐔 con g _ — Chữ nào còn thiếu?", "options": ["e", "à", "ô", "i"], "correctIndex": 1},
    {"id": 55, "level": 2, "subject": "Tiếng Anh", "question": "🔴 Màu đỏ tiếng Anh là gì?", "options": ["Blue", "Green", "Red", "Yellow"], "correctIndex": 2},
    {"subject": "Toán", "question": "🟦 là hình gì?", "options": ["Hình vuông", "Hình chữ nhật", "Hình tròn", "Hình tam giác"], "correctIndex": 0, "level": 2, "id": 56},
    {"subject": "Toán", "question": "Số liền sau của 9 là:", "options": ["11", "8", "9", "10"], "correctIndex": 3, "level": 2, "id": 57},
    {"subject": "Toán", "question": "7 − 5 = ?", "options": ["4", "3", "0", "2"], "correctIndex": 3, "level": 2, "id": 58},
    {"subject": "Toán", "question": "🔵 là hình gì?", "options": ["Hình tam giác", "Hình tròn", "Hình chữ nhật", "Hình vuông"], "correctIndex": 1, "level": 2, "id": 59},
    {"subject": "Toán", "question": "🍎🍎🍎🍎🍎🍎🍎 Có mấy quả táo?", "options": ["7", "8", "5", "6"], "correctIndex": 0, "level": 2, "id": 60},
    {"subject": "Toán", "question": "Có 8 bông hoa 🌸, cho bạn 2 bông hoa. Còn mấy bông hoa?", "options": ["4", "6", "7", "5"], "correctIndex": 1, "level": 2, "id": 61},
    {"subject": "Toán", "question": "Có 8 con cá 🐟, thêm 9 con cá nữa. Có tất cả mấy con cá?", "options": ["17", "19", "16", "18"], "correctIndex": 0, "level": 2, "id": 62},
    {"subject": "Toán", "question": "0 + 4 = ?", "options": ["6", "3", "2", "4"], "correctIndex": 3, "level": 2, "id": 63},
    {"subject": "Toán", "question": "Số liền sau của 7 là:", "options": ["7", "9", "6", "8"], "correctIndex": 3, "level": 2, "id": 64},
    {"subject": "Toán", "question": "4 + 2 = ?", "options": ["4", "7", "6", "8"], "correctIndex": 2, "level": 2, "id": 65},
    {"subject": "Toán", "question": "8 + 1 = ?", "options": ["9", "8", "7", "11"], "correctIndex": 0, "level": 2, "id": 66},
    {"subject": "Toán", "question": "Số gồm 1 chục và 7 đơn vị là:", "options": ["27", "17", "8", "71"], "correctIndex": 1, "level": 2, "id": 67},
    {"subject": "Toán", "question": "Có 9 quả bóng bay 🎈, thêm 5 quả bóng bay nữa. Có tất cả mấy quả bóng bay?", "options": ["15", "12", "13", "14"], "correctIndex": 3, "level": 2, "id": 68},
    {"subject": "Toán", "question": "Có 6 quả bóng bay 🎈, thêm 1 quả bóng bay nữa. Có tất cả mấy quả bóng bay?", "options": ["5", "7", "6", "8"], "correctIndex": 1, "level": 2, "id": 69},
    {"subject": "Toán", "question": "Số liền trước của 4 là:", "options": ["4", "2", "3", "5"], "correctIndex": 2, "level": 2, "id": 70},
    {"subject": "Toán", "question": "Số gồm 3 chục và 5 đơn vị là:", "options": ["8", "53", "35", "45"], "correctIndex": 2, "level": 2, "id": 71},
    {"subject": "Toán", "question": "Có 2 bông hoa 🌸, cho bạn 1 bông hoa. Còn mấy bông hoa?", "options": ["1", "3", "2", "0"], "correctIndex": 0, "level": 2, "id": 72},
    {"subject": "Toán", "question": "Số liền trước của 3 là:", "options": ["3", "4", "1", "2"], "correctIndex": 3, "level": 2, "id": 73},
    {"subject": "Tiếng Việt", "question": "🐴 là gì?", "options": ["Con bò", "Con gà", "Con ngựa", "Con ốc"], "correctIndex": 2, "level": 2, "id": 74},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'l'?", "options": ["n", "l", "e", "c"], "correctIndex": 1, "level": 2, "id": 75},
    {"subject": "Tiếng Việt", "question": "🚗 là gì?", "options": ["Máy bay", "Con gà", "Quả cam", "Ô tô"], "correctIndex": 3, "level": 2, "id": 76},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ươi'?", "options": ["bụi", "bơi", "tươi", "tiên"], "correctIndex": 2, "level": 2, "id": 77},
    {"subject": "Tiếng Việt", "question": "Tiếng 'thỏ' bắt đầu bằng chữ nào?", "options": ["r", "th", "x", "s"], "correctIndex": 1, "level": 2, "id": 78},
    {"subject": "Tiếng Việt", "question": "Tiếng 'nhà' bắt đầu bằng chữ nào?", "options": ["nh", "x", "đ", "c"], "correctIndex": 0, "level": 2, "id": 79},
    {"subject": "Tiếng Việt", "question": "Tiếng 'hổ' bắt đầu bằng chữ nào?", "options": ["h", "qu", "đ", "m"], "correctIndex": 0, "level": 2, "id": 80},
    {"subject": "Tiếng Việt", "question": "🐸 là gì?", "options": ["Con ếch", "Con ngựa", "Con khỉ", "Con hổ"], "correctIndex": 0, "level": 2, "id": 81},
    {"subject": "Tiếng Việt", "question": "Tiếng 'đôi' có vần gì?", "options": ["oang", "ơt", "ươi", "ôi"], "correctIndex": 3, "level": 2, "id": 82},
    {"subject": "Tiếng Việt", "question": "🌸 là gì?", "options": ["Con hổ", "Bông hoa", "Con bướm", "Mặt trời"], "correctIndex": 1, "level": 2, "id": 83},
    {"subject": "Tiếng Việt", "question": "Tiếng 'chó' bắt đầu bằng chữ nào?", "options": ["ch", "ph", "tr", "m"], "correctIndex": 0, "level": 2, "id": 84},
    {"subject": "Tiếng Việt", "question": "Tiếng 'giỏ' bắt đầu bằng chữ nào?", "options": ["t", "r", "ngh", "gi"], "correctIndex": 3, "level": 2, "id": 85},
    {"subject": "Tiếng Việt", "question": "🌳 là gì?", "options": ["Quả táo", "Máy bay", "Đồng hồ", "Cây xanh"], "correctIndex": 3, "level": 2, "id": 86},
    {"subject": "Tiếng Anh", "question": "🐦 tiếng Anh là gì?", "options": ["Cow", "Bird", "Fish", "Lion"], "correctIndex": 1, "level": 2, "id": 87},
    {"subject": "Tiếng Anh", "question": "'Purple' nghĩa là gì?", "options": ["Màu vàng", "Màu tím", "Màu nâu", "Màu xanh dương"], "correctIndex": 1, "level": 2, "id": 88},
    {"subject": "Tiếng Anh", "question": "🟡 tiếng Anh là gì?", "options": ["Green", "White", "Yellow", "Black"], "correctIndex": 2, "level": 2, "id": 89},
    {"subject": "Tiếng Anh", "question": "'Six' là số mấy?", "options": ["9", "6", "3", "4"], "correctIndex": 1, "level": 2, "id": 90},
    {"subject": "Tiếng Anh", "question": "'Orange' nghĩa là gì?", "options": ["Màu nâu", "Màu trắng", "Màu cam", "Màu đen"], "correctIndex": 2, "level": 2, "id": 91},
    {"subject": "Tiếng Anh", "question": "'Eight' là số mấy?", "options": ["7", "10", "8", "9"], "correctIndex": 2, "level": 2, "id": 92},
    {"subject": "Tiếng Anh", "question": "🦆 tiếng Anh là gì?", "options": ["Chicken", "Rabbit", "Duck", "Tiger"], "correctIndex": 2, "level": 2, "id": 93},
    {"subject": "Tiếng Anh", "question": "🔵 tiếng Anh là gì?", "options": ["White", "Yellow", "Blue", "Red"], "correctIndex": 2, "level": 2, "id": 94},
    {"subject": "Tiếng Anh", "question": "'Bird' nghĩa là gì?", "options": ["Con chim", "Con voi", "Con hổ", "Con lợn"], "correctIndex": 0, "level": 2, "id": 95},
    {"subject": "Tiếng Anh", "question": "'Yes' nghĩa là gì?", "options": ["Vâng / Có", "Chúc ngủ ngon", "Xin lỗi", "Hẹn gặp lại"], "correctIndex": 0, "level": 2, "id": 96},
    {"subject": "Tiếng Anh", "question": "'Good night' nghĩa là gì?", "options": ["Chào buổi sáng", "Chúc ngủ ngon", "Xin lỗi", "Vâng / Có"], "correctIndex": 1, "level": 2, "id": 97},
    {"subject": "Tiếng Anh", "question": "🍪 tiếng Anh là gì?", "options": ["Orange", "Cookie", "Milk", "Watermelon"], "correctIndex": 1, "level": 2, "id": 98},
    {"subject": "Tiếng Anh", "question": "'Quả xoài' tiếng Anh là gì?", "options": ["Egg", "Banana", "Orange", "Mango"], "correctIndex": 3, "level": 2, "id": 99},
    {"subject": "Tiếng Anh", "question": "🍌 tiếng Anh là gì?", "options": ["Banana", "Orange", "Mango", "Watermelon"], "correctIndex": 0, "level": 2, "id": 100},
    {"id": 101, "level": 3, "subject": "Toán", "question": "5 − 2 = ?", "options": ["2", "3", "4", "1"], "correctIndex": 1},
    {"id": 102, "level": 3, "subject": "Toán", "question": "Số liền sau số 4 là số nào?", "options": ["3", "6", "5", "4"], "correctIndex": 2},
    {"id": 103, "level": 3, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'an'?", "options": ["bàn", "bút", "cô", "mẹ"], "correctIndex": 0},
    {"id": 104, "level": 3, "subject": "Tiếng Việt", "question": "Tiếng nào có chữ 'ch'?", "options": ["nhà", "chó", "gà", "thỏ"], "correctIndex": 1},
    {"id": 105, "level": 3, "subject": "Tiếng Anh", "question": "'Hello' nghĩa là gì?", "options": ["Tạm biệt", "Xin chào", "Cảm ơn", "Xin lỗi"], "correctIndex": 1},
    {"subject": "Toán", "question": "Điền dấu: 0 … 6", "options": ["<", ">", "+", "="], "correctIndex": 0, "level": 3, "id": 106},
    {"subject": "Toán", "question": "8 + 2 = ?", "options": ["12", "11", "10", "8"], "correctIndex": 2, "level": 3, "id": 107},
    {"subject": "Toán", "question": "2 + 4 = ?", "options": ["7", "5", "6", "8"], "correctIndex": 2, "level": 3, "id": 108},
    {"subject": "Toán", "question": "Điền dấu: 2 … 7", "options": ["=", "+", ">", "<"], "correctIndex": 3, "level": 3, "id": 109},
    {"subject": "Toán", "question": "8 − 4 = ?", "options": ["6", "4", "3", "5"], "correctIndex": 1, "level": 3, "id": 110},
    {"subject": "Toán", "question": "Có 6 chiếc ô tô 🚗, cho bạn 1 chiếc ô tô. Còn mấy chiếc ô tô?", "options": ["5", "7", "4", "6"], "correctIndex": 0, "level": 3, "id": 111},
    {"subject": "Toán", "question": "0 + 6 = ?", "options": ["8", "6", "7", "5"], "correctIndex": 1, "level": 3, "id": 112},
    {"subject": "Toán", "question": "🚀🚀🚀 Có mấy tên lửa?", "options": ["5", "2", "3", "1"], "correctIndex": 2, "level": 3, "id": 113},
    {"subject": "Toán", "question": "Điền dấu: 0 … 1", "options": ["=", ">", "<", "+"], "correctIndex": 2, "level": 3, "id": 114},
    {"subject": "Toán", "question": "Điền dấu: 4 … 7", "options": ["<", "=", "+", ">"], "correctIndex": 0, "level": 3, "id": 115},
    {"subject": "Toán", "question": "Số liền sau của 4 là:", "options": ["4", "5", "3", "6"], "correctIndex": 1, "level": 3, "id": 116},
    {"subject": "Toán", "question": "Có 6 quả bóng bay 🎈, cho bạn 3 quả bóng bay. Còn mấy quả bóng bay?", "options": ["2", "3", "1", "5"], "correctIndex": 1, "level": 3, "id": 117},
    {"subject": "Toán", "question": "🎈🎈🎈🎈🎈🎈🎈🎈🎈 Có mấy quả bóng bay?", "options": ["7", "9", "8", "10"], "correctIndex": 1, "level": 3, "id": 118},
    {"subject": "Toán", "question": "🎈🎈🎈🎈🎈🎈🎈 Có mấy quả bóng bay?", "options": ["9", "5", "7", "6"], "correctIndex": 2, "level": 3, "id": 119},
    {"subject": "Toán", "question": "Số liền trước của 8 là:", "options": ["8", "6", "9", "7"], "correctIndex": 3, "level": 3, "id": 120},
    {"subject": "Toán", "question": "🔺 là hình gì?", "options": ["Hình tròn", "Hình chữ nhật", "Hình vuông", "Hình tam giác"], "correctIndex": 3, "level": 3, "id": 121},
    {"subject": "Toán", "question": "🚗🚗🚗🚗🚗🚗🚗 Có mấy chiếc ô tô?", "options": ["7", "8", "6", "5"], "correctIndex": 0, "level": 3, "id": 122},
    {"subject": "Toán", "question": "6 + 4 = ?", "options": ["11", "10", "12", "8"], "correctIndex": 1, "level": 3, "id": 123},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'i'?", "options": ["o", "i", "a", "g"], "correctIndex": 1, "level": 3, "id": 124},
    {"subject": "Tiếng Việt", "question": "Tiếng 'kênh' có vần gì?", "options": ["ich", "ut", "ênh", "ơm"], "correctIndex": 2, "level": 3, "id": 125},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ưa'?", "options": ["muối", "chuyện", "lửa", "đứt"], "correctIndex": 2, "level": 3, "id": 126},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ưng'?", "options": ["buồn", "gừng", "chuông", "hút"], "correctIndex": 1, "level": 3, "id": 127},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'au'?", "options": ["rau", "súng", "lưng", "vạch"], "correctIndex": 0, "level": 3, "id": 128},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 's'?", "options": ["d", "q", "s", "t"], "correctIndex": 2, "level": 3, "id": 129},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'k'?", "options": ["l", "e", "r", "k"], "correctIndex": 3, "level": 3, "id": 130},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 't'?", "options": ["t", "e", "c", "o"], "correctIndex": 0, "level": 3, "id": 131},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'oa'?", "options": ["chuông", "loa", "thơm", "sen"], "correctIndex": 1, "level": 3, "id": 132},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'uông'?", "options": ["cừu", "người", "chuông", "kính"], "correctIndex": 2, "level": 3, "id": 133},
    {"subject": "Tiếng Việt", "question": "Tiếng 'gà' bắt đầu bằng chữ nào?", "options": ["ch", "ph", "nh", "g"], "correctIndex": 3, "level": 3, "id": 134},
    {"subject": "Tiếng Việt", "question": "🦀 là gì?", "options": ["Con ốc", "Con cua", "Con gà", "Con ngựa"], "correctIndex": 1, "level": 3, "id": 135},
    {"subject": "Tiếng Việt", "question": "Tiếng 'kẹo' bắt đầu bằng chữ nào?", "options": ["nh", "đ", "th", "k"], "correctIndex": 3, "level": 3, "id": 136},
    {"subject": "Tiếng Anh", "question": "'Sữa' tiếng Anh là gì?", "options": ["Egg", "Bread", "Milk", "Watermelon"], "correctIndex": 2, "level": 3, "id": 137},
    {"subject": "Tiếng Anh", "question": "🥚 tiếng Anh là gì?", "options": ["Grapes", "Bread", "Watermelon", "Egg"], "correctIndex": 3, "level": 3, "id": 138},
    {"subject": "Tiếng Anh", "question": "'Seven' là số mấy?", "options": ["10", "7", "5", "4"], "correctIndex": 1, "level": 3, "id": 139},
    {"subject": "Tiếng Anh", "question": "'Elephant' nghĩa là gì?", "options": ["Con sư tử", "Con chuột", "Con thỏ", "Con voi"], "correctIndex": 3, "level": 3, "id": 140},
    {"subject": "Tiếng Anh", "question": "'No' nghĩa là gì?", "options": ["Không", "Chào buổi sáng", "Hẹn gặp lại", "Vâng / Có"], "correctIndex": 0, "level": 3, "id": 141},
    {"subject": "Tiếng Anh", "question": "'Cow' nghĩa là gì?", "options": ["Con chim", "Con chó", "Con vịt", "Con bò"], "correctIndex": 3, "level": 3, "id": 142},
    {"subject": "Tiếng Anh", "question": "'Duck' nghĩa là gì?", "options": ["Con rùa", "Con hổ", "Con vịt", "Con ếch"], "correctIndex": 2, "level": 3, "id": 143},
    {"subject": "Tiếng Anh", "question": "'Con lợn' tiếng Anh là gì?", "options": ["Chicken", "Pig", "Cat", "Rabbit"], "correctIndex": 1, "level": 3, "id": 144},
    {"subject": "Tiếng Anh", "question": "🟣 tiếng Anh là gì?", "options": ["Brown", "Green", "Yellow", "Purple"], "correctIndex": 3, "level": 3, "id": 145},
    {"subject": "Tiếng Anh", "question": "'Bear' nghĩa là gì?", "options": ["Con chó", "Con ngựa", "Con gấu", "Con sư tử"], "correctIndex": 2, "level": 3, "id": 146},
    {"subject": "Tiếng Anh", "question": "'Cookie' nghĩa là gì?", "options": ["Kem", "Bánh quy", "Quả táo", "Nước ép"], "correctIndex": 1, "level": 3, "id": 147},
    {"subject": "Tiếng Anh", "question": "'Rabbit' nghĩa là gì?", "options": ["Con vịt", "Con rùa", "Con mèo", "Con thỏ"], "correctIndex": 3, "level": 3, "id": 148},
    {"subject": "Tiếng Anh", "question": "'Con rùa' tiếng Anh là gì?", "options": ["Giraffe", "Pig", "Chicken", "Turtle"], "correctIndex": 3, "level": 3, "id": 149},
    {"subject": "Tiếng Anh", "question": "🐸 tiếng Anh là gì?", "options": ["Giraffe", "Horse", "Snake", "Frog"], "correctIndex": 3, "level": 3, "id": 150},
    {"id": 151, "level": 4, "subject": "Toán", "question": "3 + 4 = ?", "options": ["6", "7", "8", "5"], "correctIndex": 1},
    {"id": 152, "level": 4, "subject": "Toán", "question": "Quả bóng ⚽ có dạng hình gì?", "options": ["Hình vuông", "Hình tròn", "Hình tam giác", "Hình chữ nhật"], "correctIndex": 1},
    {"id": 153, "level": 4, "subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["ngỉ ngơi", "nghỉ ngơi", "nghỉ nghơi", "ngỉ nghơi"], "correctIndex": 1},
    {"id": 154, "level": 4, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'on'?", "options": ["con", "cân", "cơm", "bé"], "correctIndex": 0},
    {"id": 155, "level": 4, "subject": "Tiếng Anh", "question": "🐶 Con chó tiếng Anh là gì?", "options": ["Cat", "Fish", "Dog", "Bird"], "correctIndex": 2},
    {"subject": "Toán", "question": "Điền dấu: 5 … 9", "options": ["=", ">", "+", "<"], "correctIndex": 3, "level": 4, "id": 156},
    {"subject": "Toán", "question": "Số gồm 9 chục và 6 đơn vị là:", "options": ["69", "106", "15", "96"], "correctIndex": 3, "level": 4, "id": 157},
    {"subject": "Toán", "question": "Có 8 quả bóng bay 🎈, thêm 8 quả bóng bay nữa. Có tất cả mấy quả bóng bay?", "options": ["16", "14", "17", "18"], "correctIndex": 0, "level": 4, "id": 158},
    {"subject": "Toán", "question": "🚀🚀🚀🚀🚀 Có mấy tên lửa?", "options": ["5", "3", "7", "6"], "correctIndex": 0, "level": 4, "id": 159},
    {"subject": "Toán", "question": "Số gồm 4 chục và 5 đơn vị là:", "options": ["9", "45", "55", "54"], "correctIndex": 1, "level": 4, "id": 160},
    {"subject": "Toán", "question": "9 − 4 = ?", "options": ["6", "4", "5", "7"], "correctIndex": 2, "level": 4, "id": 161},
    {"subject": "Toán", "question": "3 + 6 = ?", "options": ["8", "10", "7", "9"], "correctIndex": 3, "level": 4, "id": 162},
    {"subject": "Toán", "question": "Số gồm 5 chục và 1 đơn vị là:", "options": ["51", "15", "6", "61"], "correctIndex": 0, "level": 4, "id": 163},
    {"subject": "Toán", "question": "Số gồm 2 chục và 8 đơn vị là:", "options": ["28", "38", "10", "82"], "correctIndex": 0, "level": 4, "id": 164},
    {"subject": "Toán", "question": "🍌🍌 Có mấy quả chuối?", "options": ["1", "4", "2", "3"], "correctIndex": 2, "level": 4, "id": 165},
    {"subject": "Toán", "question": "1 + 3 = ?", "options": ["3", "4", "5", "6"], "correctIndex": 1, "level": 4, "id": 166},
    {"subject": "Toán", "question": "Có 5 cái kẹo 🍬, thêm 1 cái kẹo nữa. Có tất cả mấy cái kẹo?", "options": ["4", "7", "6", "8"], "correctIndex": 2, "level": 4, "id": 167},
    {"subject": "Toán", "question": "Có 9 quả táo 🍎, thêm 5 quả táo nữa. Có tất cả mấy quả táo?", "options": ["13", "15", "14", "16"], "correctIndex": 2, "level": 4, "id": 168},
    {"subject": "Toán", "question": "Điền dấu: 5 … 5", "options": ["+", "<", "=", ">"], "correctIndex": 2, "level": 4, "id": 169},
    {"subject": "Toán", "question": "Có 6 con cá 🐟, cho bạn 4 con cá. Còn mấy con cá?", "options": ["4", "2", "1", "0"], "correctIndex": 1, "level": 4, "id": 170},
    {"subject": "Toán", "question": "Điền dấu: 1 … 8", "options": ["<", "=", "+", ">"], "correctIndex": 0, "level": 4, "id": 171},
    {"subject": "Toán", "question": "🧁🧁🧁🧁🧁🧁🧁🧁🧁 Có mấy cái bánh?", "options": ["8", "10", "7", "9"], "correctIndex": 3, "level": 4, "id": 172},
    {"subject": "Toán", "question": "Điền dấu: 10 … 6", "options": ["=", "<", "+", ">"], "correctIndex": 3, "level": 4, "id": 173},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'ă'?", "options": ["q", "c", "ă", "ư"], "correctIndex": 2, "level": 4, "id": 174},
    {"subject": "Tiếng Việt", "question": "Tiếng 'xe' bắt đầu bằng chữ nào?", "options": ["c", "r", "b", "x"], "correctIndex": 3, "level": 4, "id": 175},
    {"subject": "Tiếng Việt", "question": "⭐ là gì?", "options": ["Ngôi nhà", "Ngôi sao", "Con cá", "Cây xanh"], "correctIndex": 1, "level": 4, "id": 176},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'd'?", "options": ["q", "u", "s", "d"], "correctIndex": 3, "level": 4, "id": 177},
    {"subject": "Tiếng Việt", "question": "Tiếng 'vườn' có vần gì?", "options": ["ao", "ươn", "ang", "oi"], "correctIndex": 1, "level": 4, "id": 178},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'n'?", "options": ["c", "l", "r", "n"], "correctIndex": 3, "level": 4, "id": 179},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ương'?", "options": ["đường", "hạt", "cau", "khoang"], "correctIndex": 0, "level": 4, "id": 180},
    {"subject": "Tiếng Việt", "question": "⚽ là gì?", "options": ["Quả bóng", "Quả xoài", "Quả cam", "Quả chuối"], "correctIndex": 0, "level": 4, "id": 181},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ươn'?", "options": ["vợt", "lươn", "tám", "kính"], "correctIndex": 1, "level": 4, "id": 182},
    {"subject": "Tiếng Việt", "question": "Tiếng 'hút' có vần gì?", "options": ["êm", "ut", "uyên", "ang"], "correctIndex": 1, "level": 4, "id": 183},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ut'?", "options": ["buồn", "lựu", "thơm", "bút"], "correctIndex": 3, "level": 4, "id": 184},
    {"subject": "Tiếng Việt", "question": "Tiếng 'nghé' bắt đầu bằng chữ nào?", "options": ["gi", "g", "r", "ngh"], "correctIndex": 3, "level": 4, "id": 185},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'am'?", "options": ["gừng", "cam", "xuống", "khoang"], "correctIndex": 1, "level": 4, "id": 186},
    {"subject": "Tiếng Anh", "question": "'See you later' nghĩa là gì?", "options": ["Không", "Xin lỗi", "Hẹn gặp lại", "Vâng / Có"], "correctIndex": 2, "level": 4, "id": 187},
    {"subject": "Tiếng Anh", "question": "'Red' nghĩa là gì?", "options": ["Màu xanh dương", "Màu vàng", "Màu đỏ", "Màu hồng"], "correctIndex": 2, "level": 4, "id": 188},
    {"subject": "Tiếng Anh", "question": "🐭 tiếng Anh là gì?", "options": ["Elephant", "Frog", "Mouse", "Snake"], "correctIndex": 2, "level": 4, "id": 189},
    {"subject": "Tiếng Anh", "question": "'Dog' nghĩa là gì?", "options": ["Con ếch", "Con chó", "Con hổ", "Con chim"], "correctIndex": 1, "level": 4, "id": 190},
    {"subject": "Tiếng Anh", "question": "'Nine' là số mấy?", "options": ["8", "9", "10", "6"], "correctIndex": 1, "level": 4, "id": 191},
    {"subject": "Tiếng Anh", "question": "🐴 tiếng Anh là gì?", "options": ["Cat", "Frog", "Dog", "Horse"], "correctIndex": 3, "level": 4, "id": 192},
    {"subject": "Tiếng Anh", "question": "'Con khỉ' tiếng Anh là gì?", "options": ["Lion", "Fish", "Monkey", "Bear"], "correctIndex": 2, "level": 4, "id": 193},
    {"subject": "Tiếng Anh", "question": "'Snake' nghĩa là gì?", "options": ["Con rắn", "Con lợn", "Con ếch", "Con bò"], "correctIndex": 0, "level": 4, "id": 194},
    {"subject": "Tiếng Anh", "question": "'Con ngựa' tiếng Anh là gì?", "options": ["Frog", "Horse", "Snake", "Dog"], "correctIndex": 1, "level": 4, "id": 195},
    {"subject": "Tiếng Anh", "question": "🍇 tiếng Anh là gì?", "options": ["Grapes", "Orange", "Cookie", "Rice"], "correctIndex": 0, "level": 4, "id": 196},
    {"subject": "Tiếng Anh", "question": "'Màu trắng' tiếng Anh là gì?", "options": ["White", "Blue", "Yellow", "Pink"], "correctIndex": 0, "level": 4, "id": 197},
    {"subject": "Tiếng Anh", "question": "'Fish' nghĩa là gì?", "options": ["Con mèo", "Con cá", "Con vịt", "Con gà"], "correctIndex": 1, "level": 4, "id": 198},
    {"subject": "Tiếng Anh", "question": "🟢 tiếng Anh là gì?", "options": ["Black", "Red", "Pink", "Green"], "correctIndex": 3, "level": 4, "id": 199},
    {"subject": "Tiếng Anh", "question": "🍞 tiếng Anh là gì?", "options": ["Juice", "Orange", "Apple", "Bread"], "correctIndex": 3, "level": 4, "id": 200},
    {"id": 201, "level": 5, "subject": "Toán", "question": "8 − 3 = ?", "options": ["4", "5", "6", "3"], "correctIndex": 1},
    {"id": 202, "level": 5, "subject": "Toán", "question": "So sánh 7 và 5:", "options": ["7 bé hơn 5", "7 lớn hơn 5", "7 bằng 5", "5 lớn hơn 7"], "correctIndex": 1},
    {"id": 203, "level": 5, "subject": "Tiếng Việt", "question": "Tiếng nào có chữ 'nh'?", "options": ["nho", "no", "cho", "ngô"], "correctIndex": 0},
    {"id": 204, "level": 5, "subject": "Tiếng Việt", "question": "Từ nào chỉ con vật?", "options": ["cái bàn", "con mèo", "quả cam", "bông hoa"], "correctIndex": 1},
    {"id": 205, "level": 5, "subject": "Tiếng Anh", "question": "'Cat' nghĩa là gì?", "options": ["Con chó", "Con cá", "Con mèo", "Con gà"], "correctIndex": 2},
    {"subject": "Toán", "question": "🍎🍎 Có mấy quả táo?", "options": ["1", "2", "4", "3"], "correctIndex": 1, "level": 5, "id": 206},
    {"subject": "Toán", "question": "🐟🐟🐟🐟🐟🐟🐟🐟🐟 Có mấy con cá?", "options": ["11", "8", "7", "9"], "correctIndex": 3, "level": 5, "id": 207},
    {"subject": "Toán", "question": "Điền dấu: 9 … 3", "options": ["=", "+", "<", ">"], "correctIndex": 3, "level": 5, "id": 208},
    {"subject": "Toán", "question": "⭐⭐⭐⭐⭐ Có mấy ngôi sao?", "options": ["5", "7", "6", "4"], "correctIndex": 0, "level": 5, "id": 209},
    {"subject": "Toán", "question": "Có 5 cái kẹo 🍬, cho bạn 4 cái kẹo. Còn mấy cái kẹo?", "options": ["0", "2", "3", "1"], "correctIndex": 3, "level": 5, "id": 210},
    {"subject": "Toán", "question": "Số gồm 9 chục và 3 đơn vị là:", "options": ["12", "93", "39", "103"], "correctIndex": 1, "level": 5, "id": 211},
    {"subject": "Toán", "question": "Số gồm 6 chục và 8 đơn vị là:", "options": ["14", "68", "86", "78"], "correctIndex": 1, "level": 5, "id": 212},
    {"subject": "Toán", "question": "3 + 7 = ?", "options": ["8", "9", "12", "10"], "correctIndex": 3, "level": 5, "id": 213},
    {"subject": "Toán", "question": "Có 5 con cá 🐟, cho bạn 3 con cá. Còn mấy con cá?", "options": ["1", "4", "2", "0"], "correctIndex": 2, "level": 5, "id": 214},
    {"subject": "Toán", "question": "4 + 4 = ?", "options": ["6", "8", "9", "7"], "correctIndex": 1, "level": 5, "id": 215},
    {"subject": "Toán", "question": "Điền dấu: 10 … 9", "options": ["=", "+", ">", "<"], "correctIndex": 2, "level": 5, "id": 216},
    {"subject": "Toán", "question": "Có 8 quả táo 🍎, thêm 8 quả táo nữa. Có tất cả mấy quả táo?", "options": ["18", "16", "17", "14"], "correctIndex": 1, "level": 5, "id": 217},
    {"subject": "Toán", "question": "7 − 6 = ?", "options": ["3", "1", "0", "2"], "correctIndex": 1, "level": 5, "id": 218},
    {"subject": "Toán", "question": "🧁🧁🧁🧁🧁🧁 Có mấy cái bánh?", "options": ["7", "4", "6", "5"], "correctIndex": 2, "level": 5, "id": 219},
    {"subject": "Toán", "question": "4 − 1 = ?", "options": ["5", "3", "1", "2"], "correctIndex": 1, "level": 5, "id": 220},
    {"subject": "Toán", "question": "7 + 2 = ?", "options": ["7", "9", "8", "11"], "correctIndex": 1, "level": 5, "id": 221},
    {"subject": "Toán", "question": "3 − 2 = ?", "options": ["3", "1", "0", "2"], "correctIndex": 1, "level": 5, "id": 222},
    {"subject": "Toán", "question": "Số liền trước của 7 là:", "options": ["5", "8", "6", "7"], "correctIndex": 2, "level": 5, "id": 223},
    {"subject": "Tiếng Việt", "question": "☀️ là gì?", "options": ["Mặt trời", "Bút chì", "Con ốc", "Con bò"], "correctIndex": 0, "level": 5, "id": 224},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'ô'?", "options": ["s", "ư", "ô", "m"], "correctIndex": 2, "level": 5, "id": 225},
    {"subject": "Tiếng Việt", "question": "🐭 là gì?", "options": ["Con lợn", "Con chuột", "Con bướm", "Con dê"], "correctIndex": 1, "level": 5, "id": 226},
    {"subject": "Tiếng Việt", "question": "✈️ là gì?", "options": ["Quyển sách", "Máy bay", "Ngôi nhà", "Ngôi sao"], "correctIndex": 1, "level": 5, "id": 227},
    {"subject": "Tiếng Việt", "question": "Tiếng 'cá' bắt đầu bằng chữ nào?", "options": ["đ", "ph", "c", "ch"], "correctIndex": 2, "level": 5, "id": 228},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ênh'?", "options": ["hút", "ớt", "bệnh", "súng"], "correctIndex": 2, "level": 5, "id": 229},
    {"subject": "Tiếng Việt", "question": "🍌 là gì?", "options": ["Quả bóng", "Quả xoài", "Quả táo", "Quả chuối"], "correctIndex": 3, "level": 5, "id": 230},
    {"subject": "Tiếng Việt", "question": "Tiếng 'mèo' có vần gì?", "options": ["ung", "uôn", "eo", "oi"], "correctIndex": 2, "level": 5, "id": 231},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ung'?", "options": ["vui", "súng", "muối", "lươn"], "correctIndex": 1, "level": 5, "id": 232},
    {"subject": "Tiếng Việt", "question": "Tiếng 'lựu' có vần gì?", "options": ["ươi", "uông", "ich", "ưu"], "correctIndex": 3, "level": 5, "id": 233},
    {"subject": "Tiếng Việt", "question": "Tiếng 'ghế' bắt đầu bằng chữ nào?", "options": ["x", "gh", "ngh", "d"], "correctIndex": 1, "level": 5, "id": 234},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'oang'?", "options": ["sơn", "hoa", "hoàng", "đứt"], "correctIndex": 2, "level": 5, "id": 235},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'inh'?", "options": ["buồn", "kính", "đôi", "vàng"], "correctIndex": 1, "level": 5, "id": 236},
    {"subject": "Tiếng Anh", "question": "🍊 tiếng Anh là gì?", "options": ["Watermelon", "Orange", "Milk", "Apple"], "correctIndex": 1, "level": 5, "id": 237},
    {"subject": "Tiếng Anh", "question": "🧃 tiếng Anh là gì?", "options": ["Grapes", "Milk", "Juice", "Bread"], "correctIndex": 2, "level": 5, "id": 238},
    {"subject": "Tiếng Anh", "question": "🍚 tiếng Anh là gì?", "options": ["Grapes", "Bread", "Watermelon", "Rice"], "correctIndex": 3, "level": 5, "id": 239},
    {"subject": "Tiếng Anh", "question": "'Pig' nghĩa là gì?", "options": ["Con thỏ", "Con gấu", "Con lợn", "Con cá"], "correctIndex": 2, "level": 5, "id": 240},
    {"subject": "Tiếng Anh", "question": "Số 5 tiếng Anh là gì?", "options": ["Four", "Five", "Seven", "Two"], "correctIndex": 1, "level": 5, "id": 241},
    {"subject": "Tiếng Anh", "question": "'Egg' nghĩa là gì?", "options": ["Quả trứng", "Dưa hấu", "Cơm", "Kem"], "correctIndex": 0, "level": 5, "id": 242},
    {"subject": "Tiếng Anh", "question": "🐶 tiếng Anh là gì?", "options": ["Lion", "Dog", "Tiger", "Duck"], "correctIndex": 1, "level": 5, "id": 243},
    {"subject": "Tiếng Anh", "question": "⚫ tiếng Anh là gì?", "options": ["Red", "Black", "Yellow", "Brown"], "correctIndex": 1, "level": 5, "id": 244},
    {"subject": "Tiếng Anh", "question": "🟠 tiếng Anh là gì?", "options": ["Purple", "Brown", "Orange", "Pink"], "correctIndex": 2, "level": 5, "id": 245},
    {"subject": "Tiếng Anh", "question": "Số 7 tiếng Anh là gì?", "options": ["Nine", "Ten", "Eight", "Seven"], "correctIndex": 3, "level": 5, "id": 246},
    {"subject": "Tiếng Anh", "question": "'Grapes' nghĩa là gì?", "options": ["Quả nho", "Nước ép", "Sữa", "Quả chuối"], "correctIndex": 0, "level": 5, "id": 247},
    {"subject": "Tiếng Anh", "question": "Số 3 tiếng Anh là gì?", "options": ["Four", "One", "Five", "Three"], "correctIndex": 3, "level": 5, "id": 248},
    {"subject": "Tiếng Anh", "question": "'Blue' nghĩa là gì?", "options": ["Màu vàng", "Màu cam", "Màu đỏ", "Màu xanh dương"], "correctIndex": 3, "level": 5, "id": 249},
    {"subject": "Tiếng Anh", "question": "🍎 tiếng Anh là gì?", "options": ["Juice", "Apple", "Bread", "Cookie"], "correctIndex": 1, "level": 5, "id": 250},
    {"id": 251, "level": 6, "subject": "Toán", "question": "6 + 3 = ?", "options": ["8", "9", "10", "7"], "correctIndex": 1},
    {"id": 252, "level": 6, "subject": "Toán", "question": "Có 5 quả táo 🍎, ăn mất 2 quả. Còn mấy quả?", "options": ["2", "3", "4", "7"], "correctIndex": 1},
    {"id": 253, "level": 6, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'em'?", "options": ["kim", "cam", "kem", "cơm"], "correctIndex": 2},
    {"id": 254, "level": 6, "subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["cẻ vở", "kẻ vở", "kẻ vỡ", "quẻ vở"], "correctIndex": 1},
    {"id": 255, "level": 6, "subject": "Tiếng Anh", "question": "🟡 Màu vàng tiếng Anh là gì?", "options": ["Yellow", "Red", "Pink", "Blue"], "correctIndex": 0},
    {"subject": "Toán", "question": "Có 3 con cá 🐟, thêm 8 con cá nữa. Có tất cả mấy con cá?", "options": ["9", "13", "12", "11"], "correctIndex": 3, "level": 6, "id": 256},
    {"subject": "Toán", "question": "🚗🚗🚗🚗🚗🚗 Có mấy chiếc ô tô?", "options": ["8", "6", "7", "4"], "correctIndex": 1, "level": 6, "id": 257},
    {"subject": "Toán", "question": "Điền dấu: 1 … 0", "options": ["=", "<", "+", ">"], "correctIndex": 3, "level": 6, "id": 258},
    {"subject": "Toán", "question": "2 + 5 = ?", "options": ["5", "6", "7", "9"], "correctIndex": 2, "level": 6, "id": 259},
    {"subject": "Toán", "question": "0 + 10 = ?", "options": ["10", "9", "8", "12"], "correctIndex": 0, "level": 6, "id": 260},
    {"subject": "Toán", "question": "5 + 2 = ?", "options": ["5", "7", "9", "8"], "correctIndex": 1, "level": 6, "id": 261},
    {"subject": "Toán", "question": "Có 4 quả bóng bay 🎈, cho bạn 2 quả bóng bay. Còn mấy quả bóng bay?", "options": ["2", "1", "3", "4"], "correctIndex": 0, "level": 6, "id": 262},
    {"subject": "Toán", "question": "Có 9 quả táo 🍎, thêm 8 quả táo nữa. Có tất cả mấy quả táo?", "options": ["16", "17", "19", "15"], "correctIndex": 1, "level": 6, "id": 263},
    {"subject": "Toán", "question": "🚗🚗🚗🚗🚗🚗🚗🚗 Có mấy chiếc ô tô?", "options": ["7", "6", "8", "9"], "correctIndex": 2, "level": 6, "id": 264},
    {"subject": "Toán", "question": "Có 2 con cá 🐟, thêm 1 con cá nữa. Có tất cả mấy con cá?", "options": ["5", "3", "4", "2"], "correctIndex": 1, "level": 6, "id": 265},
    {"subject": "Toán", "question": "🍎🍎🍎🍎🍎🍎🍎🍎 Có mấy quả táo?", "options": ["7", "9", "10", "8"], "correctIndex": 3, "level": 6, "id": 266},
    {"subject": "Toán", "question": "Số gồm 8 chục và 5 đơn vị là:", "options": ["85", "95", "58", "13"], "correctIndex": 0, "level": 6, "id": 267},
    {"subject": "Toán", "question": "Số gồm 8 chục và 2 đơn vị là:", "options": ["28", "10", "82", "92"], "correctIndex": 2, "level": 6, "id": 268},
    {"subject": "Toán", "question": "🧁🧁🧁🧁🧁🧁🧁🧁 Có mấy cái bánh?", "options": ["7", "10", "9", "8"], "correctIndex": 3, "level": 6, "id": 269},
    {"subject": "Toán", "question": "10 − 6 = ?", "options": ["5", "3", "4", "6"], "correctIndex": 2, "level": 6, "id": 270},
    {"subject": "Toán", "question": "Có 5 chiếc ô tô 🚗, thêm 5 chiếc ô tô nữa. Có tất cả mấy chiếc ô tô?", "options": ["9", "8", "11", "10"], "correctIndex": 3, "level": 6, "id": 271},
    {"subject": "Toán", "question": "6 − 5 = ?", "options": ["1", "0", "2", "3"], "correctIndex": 0, "level": 6, "id": 272},
    {"subject": "Toán", "question": "🚌🚌 Có mấy xe buýt?", "options": ["3", "2", "4", "1"], "correctIndex": 1, "level": 6, "id": 273},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'am'?", "options": ["tám", "tầng", "mưa", "vạch"], "correctIndex": 0, "level": 6, "id": 274},
    {"subject": "Tiếng Việt", "question": "🥕 là gì?", "options": ["Con dê", "Con bướm", "Con khỉ", "Củ cà rốt"], "correctIndex": 3, "level": 6, "id": 275},
    {"subject": "Tiếng Việt", "question": "Tiếng 'mẹ' bắt đầu bằng chữ nào?", "options": ["kh", "h", "m", "v"], "correctIndex": 2, "level": 6, "id": 276},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["gi nhớ", "con ghà", "cá kho", "cá cho"], "correctIndex": 2, "level": 6, "id": 277},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ach'?", "options": ["chuối", "vạch", "bệnh", "người"], "correctIndex": 1, "level": 6, "id": 278},
    {"subject": "Tiếng Việt", "question": "Tiếng 'bệnh' có vần gì?", "options": ["uyên", "ênh", "ơt", "uôi"], "correctIndex": 1, "level": 6, "id": 279},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'đ'?", "options": ["đ", "c", "g", "u"], "correctIndex": 0, "level": 6, "id": 280},
    {"subject": "Tiếng Việt", "question": "Tiếng 'con' có vần gì?", "options": ["ôt", "on", "ôi", "ut"], "correctIndex": 1, "level": 6, "id": 281},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'ơ'?", "options": ["ơ", "p", "u", "m"], "correctIndex": 0, "level": 6, "id": 282},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ưt'?", "options": ["tem", "đứt", "sen", "rau"], "correctIndex": 1, "level": 6, "id": 283},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ưu'?", "options": ["chuyện", "muối", "toán", "lựu"], "correctIndex": 3, "level": 6, "id": 284},
    {"subject": "Tiếng Việt", "question": "🐶 là gì?", "options": ["Con mèo", "Con hổ", "Con chó", "Con chuột"], "correctIndex": 2, "level": 6, "id": 285},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ôt'?", "options": ["bàn", "cam", "cột", "bông"], "correctIndex": 2, "level": 6, "id": 286},
    {"subject": "Tiếng Anh", "question": "🧸 tiếng Anh là gì?", "options": ["Kite", "Boat", "Teddy bear", "Bike"], "correctIndex": 2, "level": 6, "id": 287},
    {"subject": "Tiếng Anh", "question": "🍉 tiếng Anh là gì?", "options": ["Orange", "Mango", "Watermelon", "Rice"], "correctIndex": 2, "level": 6, "id": 288},
    {"subject": "Tiếng Anh", "question": "⚽ tiếng Anh là gì?", "options": ["Doll", "Car", "Ball", "Train"], "correctIndex": 2, "level": 6, "id": 289},
    {"subject": "Tiếng Anh", "question": "🍦 tiếng Anh là gì?", "options": ["Milk", "Banana", "Rice", "Ice cream"], "correctIndex": 3, "level": 6, "id": 290},
    {"subject": "Tiếng Anh", "question": "🦁 tiếng Anh là gì?", "options": ["Frog", "Dog", "Snake", "Lion"], "correctIndex": 3, "level": 6, "id": 291},
    {"subject": "Tiếng Anh", "question": "'Chicken' nghĩa là gì?", "options": ["Con bò", "Con rắn", "Con gấu", "Con gà"], "correctIndex": 3, "level": 6, "id": 292},
    {"subject": "Tiếng Anh", "question": "'Car' nghĩa là gì?", "options": ["Cái yo-yo", "Máy bay", "Ô tô", "Búp bê"], "correctIndex": 2, "level": 6, "id": 293},
    {"subject": "Tiếng Anh", "question": "'Milk' nghĩa là gì?", "options": ["Quả trứng", "Dưa hấu", "Kem", "Sữa"], "correctIndex": 3, "level": 6, "id": 294},
    {"subject": "Tiếng Anh", "question": "Số 2 tiếng Anh là gì?", "options": ["Three", "Two", "Four", "One"], "correctIndex": 1, "level": 6, "id": 295},
    {"subject": "Tiếng Anh", "question": "🐢 tiếng Anh là gì?", "options": ["Pig", "Rabbit", "Tiger", "Turtle"], "correctIndex": 3, "level": 6, "id": 296},
    {"subject": "Tiếng Anh", "question": "🚲 tiếng Anh là gì?", "options": ["Doll", "Plane", "Train", "Bike"], "correctIndex": 3, "level": 6, "id": 297},
    {"subject": "Tiếng Anh", "question": "'Ice cream' nghĩa là gì?", "options": ["Kem", "Sữa", "Bánh quy", "Quả trứng"], "correctIndex": 0, "level": 6, "id": 298},
    {"subject": "Tiếng Anh", "question": "✈️ tiếng Anh là gì?", "options": ["Ball", "Boat", "Teddy bear", "Plane"], "correctIndex": 3, "level": 6, "id": 299},
    {"subject": "Tiếng Anh", "question": "'Gấu bông' tiếng Anh là gì?", "options": ["Train", "Kite", "Teddy bear", "Plane"], "correctIndex": 2, "level": 6, "id": 300},
    {"id": 301, "level": 7, "subject": "Toán", "question": "10 − 4 = ?", "options": ["5", "7", "6", "4"], "correctIndex": 2},
    {"id": 302, "level": 7, "subject": "Toán", "question": "Số nào lớn nhất?", "options": ["9", "6", "10", "8"], "correctIndex": 2},
    {"id": 303, "level": 7, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'at'?", "options": ["mát", "mắt", "mặt", "một"], "correctIndex": 0},
    {"id": 304, "level": 7, "subject": "Tiếng Việt", "question": "Điền từ: Bé ... bóng.", "options": ["đá", "ngủ", "uống", "ăn"], "correctIndex": 0},
    {"id": 305, "level": 7, "subject": "Tiếng Anh", "question": "'Three' là số mấy?", "options": ["1", "2", "4", "3"], "correctIndex": 3},
    {"subject": "Toán", "question": "Số gồm 5 chục và 3 đơn vị là:", "options": ["35", "53", "8", "63"], "correctIndex": 1, "level": 7, "id": 306},
    {"subject": "Toán", "question": "⚽⚽⚽⚽⚽⚽⚽⚽⚽⚽ Có mấy quả bóng?", "options": ["10", "9", "11", "8"], "correctIndex": 0, "level": 7, "id": 307},
    {"subject": "Toán", "question": "7 − 1 = ?", "options": ["7", "5", "8", "6"], "correctIndex": 3, "level": 7, "id": 308},
    {"subject": "Toán", "question": "Có 9 quả bóng bay 🎈, thêm 2 quả bóng bay nữa. Có tất cả mấy quả bóng bay?", "options": ["13", "12", "11", "9"], "correctIndex": 2, "level": 7, "id": 309},
    {"subject": "Toán", "question": "Có 8 quả bóng bay 🎈, cho bạn 5 quả bóng bay. Còn mấy quả bóng bay?", "options": ["4", "3", "2", "1"], "correctIndex": 1, "level": 7, "id": 310},
    {"subject": "Toán", "question": "Số gồm 4 chục và 1 đơn vị là:", "options": ["41", "14", "51", "5"], "correctIndex": 0, "level": 7, "id": 311},
    {"subject": "Toán", "question": "5 + 1 = ?", "options": ["7", "8", "6", "4"], "correctIndex": 2, "level": 7, "id": 312},
    {"subject": "Toán", "question": "Số gồm 9 chục và 5 đơn vị là:", "options": ["59", "14", "105", "95"], "correctIndex": 3, "level": 7, "id": 313},
    {"subject": "Toán", "question": "Số liền trước của 5 là:", "options": ["5", "4", "3", "6"], "correctIndex": 1, "level": 7, "id": 314},
    {"subject": "Toán", "question": "Số liền sau của 6 là:", "options": ["8", "7", "6", "5"], "correctIndex": 1, "level": 7, "id": 315},
    {"subject": "Toán", "question": "9 − 1 = ?", "options": ["10", "9", "8", "7"], "correctIndex": 2, "level": 7, "id": 316},
    {"subject": "Toán", "question": "Có 3 bông hoa 🌸, thêm 3 bông hoa nữa. Có tất cả mấy bông hoa?", "options": ["7", "5", "6", "4"], "correctIndex": 2, "level": 7, "id": 317},
    {"subject": "Toán", "question": "🐞🐞🐞🐞 Có mấy con bọ rùa?", "options": ["5", "4", "6", "3"], "correctIndex": 1, "level": 7, "id": 318},
    {"subject": "Toán", "question": "🎈🎈 Có mấy quả bóng bay?", "options": ["4", "2", "1", "3"], "correctIndex": 1, "level": 7, "id": 319},
    {"subject": "Toán", "question": "⭐⭐ Có mấy ngôi sao?", "options": ["1", "2", "3", "4"], "correctIndex": 1, "level": 7, "id": 320},
    {"subject": "Toán", "question": "🐟🐟🐟🐟🐟🐟🐟 Có mấy con cá?", "options": ["9", "7", "5", "8"], "correctIndex": 1, "level": 7, "id": 321},
    {"subject": "Toán", "question": "7 − 2 = ?", "options": ["5", "4", "6", "7"], "correctIndex": 0, "level": 7, "id": 322},
    {"subject": "Toán", "question": "Số gồm 8 chục và 3 đơn vị là:", "options": ["11", "83", "93", "38"], "correctIndex": 1, "level": 7, "id": 323},
    {"subject": "Tiếng Việt", "question": "Tiếng 'voi' có vần gì?", "options": ["oi", "ông", "ưu", "ach"], "correctIndex": 0, "level": 7, "id": 324},
    {"subject": "Tiếng Việt", "question": "Tiếng 'đỏ' bắt đầu bằng chữ nào?", "options": ["kh", "gi", "đ", "ch"], "correctIndex": 2, "level": 7, "id": 325},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'h'?", "options": ["d", "h", "x", "đ"], "correctIndex": 1, "level": 7, "id": 326},
    {"subject": "Tiếng Việt", "question": "Tiếng 'hoa' có vần gì?", "options": ["ang", "ung", "oa", "at"], "correctIndex": 2, "level": 7, "id": 327},
    {"subject": "Tiếng Việt", "question": "Tiếng 'vàng' có vần gì?", "options": ["âng", "oe", "ôi", "ang"], "correctIndex": 3, "level": 7, "id": 328},
    {"subject": "Tiếng Việt", "question": "🐟 là gì?", "options": ["Con mèo", "Con ngựa", "Con ốc", "Con cá"], "correctIndex": 3, "level": 7, "id": 329},
    {"subject": "Tiếng Việt", "question": "🌙 là gì?", "options": ["Con dê", "Mặt trời", "Đồng hồ", "Mặt trăng"], "correctIndex": 3, "level": 7, "id": 330},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'c'?", "options": ["v", "g", "c", "i"], "correctIndex": 2, "level": 7, "id": 331},
    {"subject": "Tiếng Việt", "question": "🪁 là gì?", "options": ["Con gà", "Con rùa", "Con diều", "Con cá"], "correctIndex": 2, "level": 7, "id": 332},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'em'?", "options": ["bát", "tem", "sao", "sen"], "correctIndex": 1, "level": 7, "id": 333},
    {"subject": "Tiếng Việt", "question": "🐒 là gì?", "options": ["Con ếch", "Con khỉ", "Con hổ", "Con ong"], "correctIndex": 1, "level": 7, "id": 334},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'êm'?", "options": ["nệm", "hoàng", "mưa", "khoe"], "correctIndex": 0, "level": 7, "id": 335},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ôt'?", "options": ["vâng", "tốt", "sách", "vợt"], "correctIndex": 1, "level": 7, "id": 336},
    {"subject": "Tiếng Anh", "question": "🚂 tiếng Anh là gì?", "options": ["Train", "Yo-yo", "Plane", "Bike"], "correctIndex": 0, "level": 7, "id": 337},
    {"subject": "Tiếng Anh", "question": "🟤 tiếng Anh là gì?", "options": ["Brown", "Orange", "Purple", "Yellow"], "correctIndex": 0, "level": 7, "id": 338},
    {"subject": "Tiếng Anh", "question": "Số 4 tiếng Anh là gì?", "options": ["Seven", "Four", "Three", "One"], "correctIndex": 1, "level": 7, "id": 339},
    {"subject": "Tiếng Anh", "question": "'Horse' nghĩa là gì?", "options": ["Con rắn", "Con hổ", "Con ngựa", "Con chó"], "correctIndex": 2, "level": 7, "id": 340},
    {"subject": "Tiếng Anh", "question": "'Con chó' tiếng Anh là gì?", "options": ["Chicken", "Dog", "Pig", "Turtle"], "correctIndex": 1, "level": 7, "id": 341},
    {"subject": "Tiếng Anh", "question": "🪁 tiếng Anh là gì?", "options": ["Kite", "Plane", "Car", "Bike"], "correctIndex": 0, "level": 7, "id": 342},
    {"subject": "Tiếng Anh", "question": "'Con gà' tiếng Anh là gì?", "options": ["Mouse", "Monkey", "Chicken", "Fish"], "correctIndex": 2, "level": 7, "id": 343},
    {"subject": "Tiếng Anh", "question": "Số 10 tiếng Anh là gì?", "options": ["Eleven", "Ten", "Nine", "Twelve"], "correctIndex": 1, "level": 7, "id": 344},
    {"subject": "Tiếng Anh", "question": "Số 1 tiếng Anh là gì?", "options": ["Three", "One", "Two", "Four"], "correctIndex": 1, "level": 7, "id": 345},
    {"subject": "Tiếng Anh", "question": "'Con sư tử' tiếng Anh là gì?", "options": ["Lion", "Cow", "Mouse", "Tiger"], "correctIndex": 0, "level": 7, "id": 346},
    {"subject": "Tiếng Anh", "question": "'Màu xanh lá' tiếng Anh là gì?", "options": ["Black", "Pink", "Green", "Yellow"], "correctIndex": 2, "level": 7, "id": 347},
    {"subject": "Tiếng Anh", "question": "'Cái yo-yo' tiếng Anh là gì?", "options": ["Kite", "Doll", "Plane", "Yo-yo"], "correctIndex": 3, "level": 7, "id": 348},
    {"subject": "Tiếng Anh", "question": "'Con diều' tiếng Anh là gì?", "options": ["Boat", "Bike", "Train", "Kite"], "correctIndex": 3, "level": 7, "id": 349},
    {"subject": "Tiếng Anh", "question": "'Rice' nghĩa là gì?", "options": ["Cơm", "Quả cam", "Nước ép", "Quả chuối"], "correctIndex": 0, "level": 7, "id": 350},
    {"id": 351, "level": 8, "subject": "Toán", "question": "2 + 8 = ?", "options": ["10", "9", "8", "11"], "correctIndex": 0},
    {"id": 352, "level": 8, "subject": "Toán", "question": "9 − 9 = ?", "options": ["9", "1", "0", "18"], "correctIndex": 2},
    {"id": 353, "level": 8, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ươn'?", "options": ["vườn", "vần", "viên", "vòng"], "correctIndex": 0},
    {"id": 354, "level": 8, "subject": "Tiếng Việt", "question": "Từ nào chỉ đồ dùng học tập?", "options": ["quả bóng", "cái bút", "con cá", "bông hoa"], "correctIndex": 1},
    {"id": 355, "level": 8, "subject": "Tiếng Anh", "question": "'Goodbye' nghĩa là gì?", "options": ["Xin chào", "Cảm ơn", "Tạm biệt", "Chúc ngủ ngon"], "correctIndex": 2},
    {"subject": "Toán", "question": "Có 9 quả bóng bay 🎈, thêm 4 quả bóng bay nữa. Có tất cả mấy quả bóng bay?", "options": ["15", "14", "11", "13"], "correctIndex": 3, "level": 8, "id": 356},
    {"subject": "Toán", "question": "3 + 1 = ?", "options": ["6", "3", "2", "4"], "correctIndex": 3, "level": 8, "id": 357},
    {"subject": "Toán", "question": "Có 5 chiếc ô tô 🚗, thêm 1 chiếc ô tô nữa. Có tất cả mấy chiếc ô tô?", "options": ["8", "7", "6", "4"], "correctIndex": 2, "level": 8, "id": 358},
    {"subject": "Toán", "question": "Số gồm 7 chục và 1 đơn vị là:", "options": ["71", "81", "8", "17"], "correctIndex": 0, "level": 8, "id": 359},
    {"subject": "Toán", "question": "Có 2 con cá 🐟, thêm 6 con cá nữa. Có tất cả mấy con cá?", "options": ["8", "9", "10", "6"], "correctIndex": 0, "level": 8, "id": 360},
    {"subject": "Toán", "question": "6 + 1 = ?", "options": ["5", "7", "9", "8"], "correctIndex": 1, "level": 8, "id": 361},
    {"subject": "Toán", "question": "🚀🚀🚀🚀🚀🚀 Có mấy tên lửa?", "options": ["8", "6", "7", "4"], "correctIndex": 1, "level": 8, "id": 362},
    {"subject": "Toán", "question": "Điền dấu: 7 … 0", "options": ["+", "=", "<", ">"], "correctIndex": 3, "level": 8, "id": 363},
    {"subject": "Toán", "question": "Điền dấu: 6 … 5", "options": ["+", ">", "<", "="], "correctIndex": 1, "level": 8, "id": 364},
    {"subject": "Toán", "question": "Điền dấu: 8 … 7", "options": ["=", "+", "<", ">"], "correctIndex": 3, "level": 8, "id": 365},
    {"subject": "Toán", "question": "3 + 2 = ?", "options": ["5", "4", "6", "7"], "correctIndex": 0, "level": 8, "id": 366},
    {"subject": "Toán", "question": "Có 8 con cá 🐟, cho bạn 5 con cá. Còn mấy con cá?", "options": ["2", "5", "1", "3"], "correctIndex": 3, "level": 8, "id": 367},
    {"subject": "Toán", "question": "Điền dấu: 2 … 3", "options": ["<", ">", "+", "="], "correctIndex": 0, "level": 8, "id": 368},
    {"subject": "Toán", "question": "🍎🍎🍎🍎🍎🍎🍎🍎🍎🍎 Có mấy quả táo?", "options": ["11", "9", "10", "12"], "correctIndex": 2, "level": 8, "id": 369},
    {"subject": "Toán", "question": "5 + 4 = ?", "options": ["10", "11", "9", "7"], "correctIndex": 2, "level": 8, "id": 370},
    {"subject": "Toán", "question": "⚽⚽⚽⚽⚽ Có mấy quả bóng?", "options": ["3", "7", "5", "6"], "correctIndex": 2, "level": 8, "id": 371},
    {"subject": "Toán", "question": "Điền dấu: 1 … 7", "options": ["=", "+", "<", ">"], "correctIndex": 2, "level": 8, "id": 372},
    {"subject": "Toán", "question": "Điền dấu: 8 … 9", "options": ["<", ">", "+", "="], "correctIndex": 0, "level": 8, "id": 373},
    {"subject": "Tiếng Việt", "question": "Tiếng 'quạt' bắt đầu bằng chữ nào?", "options": ["qu", "tr", "n", "r"], "correctIndex": 0, "level": 8, "id": 374},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'o'?", "options": ["b", "e", "n", "o"], "correctIndex": 3, "level": 8, "id": 375},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'r'?", "options": ["x", "r", "s", "g"], "correctIndex": 1, "level": 8, "id": 376},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'at'?", "options": ["bát", "chào", "tám", "nệm"], "correctIndex": 0, "level": 8, "id": 377},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'uyên'?", "options": ["lan", "hút", "chuyện", "chào"], "correctIndex": 2, "level": 8, "id": 378},
    {"subject": "Tiếng Việt", "question": "🍉 là gì?", "options": ["Quả dưa", "Quả táo", "Quả xoài", "Quả cam"], "correctIndex": 0, "level": 8, "id": 379},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'oan'?", "options": ["gừng", "bàn", "toán", "đường"], "correctIndex": 2, "level": 8, "id": 380},
    {"subject": "Tiếng Việt", "question": "Tiếng 'cừu' có vần gì?", "options": ["on", "eo", "ưu", "im"], "correctIndex": 2, "level": 8, "id": 381},
    {"subject": "Tiếng Việt", "question": "🐐 là gì?", "options": ["Con diều", "Con vịt", "Con rùa", "Con dê"], "correctIndex": 3, "level": 8, "id": 382},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'en'?", "options": ["cung", "đôi", "tám", "sen"], "correctIndex": 3, "level": 8, "id": 383},
    {"subject": "Tiếng Việt", "question": "🍊 là gì?", "options": ["Quả chuối", "Quả táo", "Quả xoài", "Quả cam"], "correctIndex": 3, "level": 8, "id": 384},
    {"subject": "Tiếng Việt", "question": "🐷 là gì?", "options": ["Con thỏ", "Con lợn", "Con khỉ", "Con mèo"], "correctIndex": 1, "level": 8, "id": 385},
    {"subject": "Tiếng Việt", "question": "🐌 là gì?", "options": ["Con voi", "Con ốc", "Con cua", "Con chó"], "correctIndex": 1, "level": 8, "id": 386},
    {"subject": "Tiếng Anh", "question": "'Black' nghĩa là gì?", "options": ["Màu xanh lá", "Màu nâu", "Màu đen", "Màu cam"], "correctIndex": 2, "level": 8, "id": 387},
    {"subject": "Tiếng Anh", "question": "🐰 tiếng Anh là gì?", "options": ["Pig", "Turtle", "Rabbit", "Bear"], "correctIndex": 2, "level": 8, "id": 388},
    {"subject": "Tiếng Anh", "question": "'Monkey' nghĩa là gì?", "options": ["Con hổ", "Con khỉ", "Con sư tử", "Con hươu cao cổ"], "correctIndex": 1, "level": 8, "id": 389},
    {"subject": "Tiếng Anh", "question": "'Con thuyền' tiếng Anh là gì?", "options": ["Train", "Yo-yo", "Boat", "Teddy bear"], "correctIndex": 2, "level": 8, "id": 390},
    {"subject": "Tiếng Anh", "question": "'Yellow' nghĩa là gì?", "options": ["Màu xanh lá", "Màu đen", "Màu nâu", "Màu vàng"], "correctIndex": 3, "level": 8, "id": 391},
    {"subject": "Tiếng Anh", "question": "'Búp bê' tiếng Anh là gì?", "options": ["Kite", "Yo-yo", "Doll", "Teddy bear"], "correctIndex": 2, "level": 8, "id": 392},
    {"subject": "Tiếng Anh", "question": "'Mouse' nghĩa là gì?", "options": ["Con hươu cao cổ", "Con gà", "Con chuột", "Con cá"], "correctIndex": 2, "level": 8, "id": 393},
    {"subject": "Tiếng Anh", "question": "'Apple' nghĩa là gì?", "options": ["Quả xoài", "Quả táo", "Sữa", "Quả trứng"], "correctIndex": 1, "level": 8, "id": 394},
    {"subject": "Tiếng Anh", "question": "'Banana' nghĩa là gì?", "options": ["Quả chuối", "Bánh mì", "Bánh quy", "Quả cam"], "correctIndex": 0, "level": 8, "id": 395},
    {"subject": "Tiếng Anh", "question": "'Kite' nghĩa là gì?", "options": ["Con diều", "Quả bóng", "Gấu bông", "Cái yo-yo"], "correctIndex": 0, "level": 8, "id": 396},
    {"subject": "Tiếng Anh", "question": "'Màu hồng' tiếng Anh là gì?", "options": ["Brown", "Purple", "Pink", "Blue"], "correctIndex": 2, "level": 8, "id": 397},
    {"subject": "Tiếng Anh", "question": "'Màu đen' tiếng Anh là gì?", "options": ["Black", "Purple", "Red", "Orange"], "correctIndex": 0, "level": 8, "id": 398},
    {"subject": "Tiếng Anh", "question": "'Four' là số mấy?", "options": ["4", "7", "2", "3"], "correctIndex": 0, "level": 8, "id": 399},
    {"subject": "Tiếng Anh", "question": "'Train' nghĩa là gì?", "options": ["Cái yo-yo", "Con diều", "Tàu hỏa", "Gấu bông"], "correctIndex": 2, "level": 8, "id": 400},
    {"id": 401, "level": 9, "subject": "Toán", "question": "3 + 3 + 2 = ?", "options": ["7", "8", "9", "6"], "correctIndex": 1},
    {"id": 402, "level": 9, "subject": "Toán", "question": "Hình tam giác có mấy cạnh?", "options": ["2", "4", "3", "5"], "correctIndex": 2},
    {"id": 403, "level": 9, "subject": "Tiếng Việt", "question": "Tiếng nào có chữ 'gh'?", "options": ["ghế", "gà", "gỗ", "ga"], "correctIndex": 0},
    {"id": 404, "level": 9, "subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["con ghà", "con gà", "con gàa", "côn gà"], "correctIndex": 1},
    {"id": 405, "level": 9, "subject": "Tiếng Anh", "question": "🍎 'Apple' là quả gì?", "options": ["Quả cam", "Quả táo", "Quả chuối", "Quả nho"], "correctIndex": 1},
    {"subject": "Toán", "question": "Điền dấu: 4 … 6", "options": ["<", "=", "+", ">"], "correctIndex": 0, "level": 9, "id": 406},
    {"subject": "Toán", "question": "Điền dấu: 8 … 4", "options": ["=", "+", ">", "<"], "correctIndex": 2, "level": 9, "id": 407},
    {"subject": "Toán", "question": "Số liền sau của 8 là:", "options": ["9", "7", "10", "8"], "correctIndex": 0, "level": 9, "id": 408},
    {"subject": "Toán", "question": "Số gồm 9 chục và 8 đơn vị là:", "options": ["98", "17", "108", "89"], "correctIndex": 0, "level": 9, "id": 409},
    {"subject": "Toán", "question": "9 − 7 = ?", "options": ["0", "3", "4", "2"], "correctIndex": 3, "level": 9, "id": 410},
    {"subject": "Toán", "question": "Điền dấu: 0 … 5", "options": ["<", ">", "=", "+"], "correctIndex": 0, "level": 9, "id": 411},
    {"subject": "Toán", "question": "Điền dấu: 6 … 4", "options": ["=", "<", "+", ">"], "correctIndex": 3, "level": 9, "id": 412},
    {"subject": "Toán", "question": "Số gồm 1 chục và 3 đơn vị là:", "options": ["4", "31", "13", "23"], "correctIndex": 2, "level": 9, "id": 413},
    {"subject": "Toán", "question": "Điền dấu: 5 … 4", "options": [">", "<", "+", "="], "correctIndex": 0, "level": 9, "id": 414},
    {"subject": "Toán", "question": "5 + 3 = ?", "options": ["9", "8", "10", "6"], "correctIndex": 1, "level": 9, "id": 415},
    {"subject": "Toán", "question": "Số gồm 2 chục và 7 đơn vị là:", "options": ["72", "27", "9", "37"], "correctIndex": 1, "level": 9, "id": 416},
    {"subject": "Toán", "question": "Điền dấu: 1 … 5", "options": ["=", ">", "<", "+"], "correctIndex": 2, "level": 9, "id": 417},
    {"subject": "Toán", "question": "🦋🦋🦋🦋🦋🦋🦋🦋 Có mấy con bướm?", "options": ["8", "9", "6", "10"], "correctIndex": 0, "level": 9, "id": 418},
    {"subject": "Toán", "question": "Có 2 cái kẹo 🍬, thêm 1 cái kẹo nữa. Có tất cả mấy cái kẹo?", "options": ["4", "1", "3", "2"], "correctIndex": 2, "level": 9, "id": 419},
    {"subject": "Toán", "question": "Điền dấu: 4 … 1", "options": ["<", "=", "+", ">"], "correctIndex": 3, "level": 9, "id": 420},
    {"subject": "Toán", "question": "0 + 2 = ?", "options": ["3", "4", "2", "0"], "correctIndex": 2, "level": 9, "id": 421},
    {"subject": "Toán", "question": "Có 4 quả táo 🍎, thêm 2 quả táo nữa. Có tất cả mấy quả táo?", "options": ["5", "7", "8", "6"], "correctIndex": 3, "level": 9, "id": 422},
    {"subject": "Toán", "question": "Số liền trước của 6 là:", "options": ["7", "6", "5", "4"], "correctIndex": 2, "level": 9, "id": 423},
    {"subject": "Tiếng Việt", "question": "Tiếng 'rổ' bắt đầu bằng chữ nào?", "options": ["d", "r", "đ", "ng"], "correctIndex": 1, "level": 9, "id": 424},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ơt'?", "options": ["đèn", "chuối", "vợt", "voi"], "correctIndex": 2, "level": 9, "id": 425},
    {"subject": "Tiếng Việt", "question": "Tiếng 'lá' bắt đầu bằng chữ nào?", "options": ["k", "l", "g", "h"], "correctIndex": 1, "level": 9, "id": 426},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'â'?", "options": ["â", "i", "g", "ư"], "correctIndex": 0, "level": 9, "id": 427},
    {"subject": "Tiếng Việt", "question": "🍎 là gì?", "options": ["Quả chuối", "Quả táo", "Quả dưa", "Quả cam"], "correctIndex": 1, "level": 9, "id": 428},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["củ ciệu", "gồ gề", "gồ ghề", "con ciến"], "correctIndex": 2, "level": 9, "id": 429},
    {"subject": "Tiếng Việt", "question": "Tiếng 'khế' bắt đầu bằng chữ nào?", "options": ["qu", "c", "kh", "th"], "correctIndex": 2, "level": 9, "id": 430},
    {"subject": "Tiếng Việt", "question": "Tiếng 'bơi' có vần gì?", "options": ["ơt", "ao", "iên", "ơi"], "correctIndex": 3, "level": 9, "id": 431},
    {"subject": "Tiếng Việt", "question": "Tiếng 'vạch' có vần gì?", "options": ["ôi", "ach", "ươi", "ich"], "correctIndex": 1, "level": 9, "id": 432},
    {"subject": "Tiếng Việt", "question": "🎈 là gì?", "options": ["Con mèo", "Bóng bay", "Con rùa", "Con vịt"], "correctIndex": 1, "level": 9, "id": 433},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["bé nghoan", "bé ngoan", "quả kam", "cái cẹo"], "correctIndex": 1, "level": 9, "id": 434},
    {"subject": "Tiếng Việt", "question": "🏠 là gì?", "options": ["Ngôi sao", "Ngôi nhà", "Con ếch", "Con cua"], "correctIndex": 1, "level": 9, "id": 435},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'uôi'?", "options": ["hoa", "tốt", "sông", "muối"], "correctIndex": 3, "level": 9, "id": 436},
    {"subject": "Tiếng Anh", "question": "🥭 tiếng Anh là gì?", "options": ["Juice", "Ice cream", "Mango", "Watermelon"], "correctIndex": 2, "level": 9, "id": 437},
    {"subject": "Tiếng Anh", "question": "🐻 tiếng Anh là gì?", "options": ["Bear", "Turtle", "Lion", "Chicken"], "correctIndex": 0, "level": 9, "id": 438},
    {"subject": "Tiếng Anh", "question": "'Frog' nghĩa là gì?", "options": ["Con chó", "Con gấu", "Con ếch", "Con vịt"], "correctIndex": 2, "level": 9, "id": 439},
    {"subject": "Tiếng Anh", "question": "'Màu xanh dương' tiếng Anh là gì?", "options": ["Orange", "Red", "Yellow", "Blue"], "correctIndex": 3, "level": 9, "id": 440},
    {"subject": "Tiếng Anh", "question": "🐷 tiếng Anh là gì?", "options": ["Monkey", "Chicken", "Cat", "Pig"], "correctIndex": 3, "level": 9, "id": 441},
    {"subject": "Tiếng Anh", "question": "'Ball' nghĩa là gì?", "options": ["Ô tô", "Máy bay", "Quả bóng", "Gấu bông"], "correctIndex": 2, "level": 9, "id": 442},
    {"subject": "Tiếng Anh", "question": "⚪ tiếng Anh là gì?", "options": ["Yellow", "White", "Blue", "Red"], "correctIndex": 1, "level": 9, "id": 443},
    {"subject": "Tiếng Anh", "question": "'Con vịt' tiếng Anh là gì?", "options": ["Frog", "Pig", "Duck", "Chicken"], "correctIndex": 2, "level": 9, "id": 444},
    {"subject": "Tiếng Anh", "question": "'Màu vàng' tiếng Anh là gì?", "options": ["Blue", "Green", "Black", "Yellow"], "correctIndex": 3, "level": 9, "id": 445},
    {"subject": "Tiếng Anh", "question": "'Màu nâu' tiếng Anh là gì?", "options": ["Red", "Green", "Yellow", "Brown"], "correctIndex": 3, "level": 9, "id": 446},
    {"subject": "Tiếng Anh", "question": "'Con voi' tiếng Anh là gì?", "options": ["Elephant", "Giraffe", "Bird", "Tiger"], "correctIndex": 0, "level": 9, "id": 447},
    {"subject": "Tiếng Anh", "question": "'Boat' nghĩa là gì?", "options": ["Con thuyền", "Xe đạp", "Con diều", "Tàu hỏa"], "correctIndex": 0, "level": 9, "id": 448},
    {"subject": "Tiếng Anh", "question": "'Con gấu' tiếng Anh là gì?", "options": ["Pig", "Snake", "Bear", "Frog"], "correctIndex": 2, "level": 9, "id": 449},
    {"subject": "Tiếng Anh", "question": "'Quả bóng' tiếng Anh là gì?", "options": ["Ball", "Bike", "Train", "Boat"], "correctIndex": 0, "level": 9, "id": 450},
    {"id": 451, "level": 10, "subject": "Toán", "question": "7 + 3 − 5 = ?", "options": ["4", "5", "6", "10"], "correctIndex": 1},
    {"id": 452, "level": 10, "subject": "Toán", "question": "10 = 6 + ?", "options": ["3", "5", "4", "6"], "correctIndex": 2},
    {"id": 453, "level": 10, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'uôi'?", "options": ["chuối", "chơi", "chai", "chuột"], "correctIndex": 0},
    {"id": 454, "level": 10, "subject": "Tiếng Việt", "question": "Điền từ: Mẹ đi chợ mua ...", "options": ["bảng", "rau", "trường", "lớp"], "correctIndex": 1},
    {"id": 455, "level": 10, "subject": "Tiếng Anh", "question": "'Big' nghĩa là gì?", "options": ["Nhỏ", "To", "Cao", "Đẹp"], "correctIndex": 1},
    {"subject": "Toán", "question": "Có 8 quả bóng bay 🎈, thêm 5 quả bóng bay nữa. Có tất cả mấy quả bóng bay?", "options": ["13", "15", "12", "14"], "correctIndex": 0, "level": 10, "id": 456},
    {"subject": "Toán", "question": "🚌🚌🚌🚌🚌 Có mấy xe buýt?", "options": ["3", "5", "4", "6"], "correctIndex": 1, "level": 10, "id": 457},
    {"subject": "Toán", "question": "3 + 3 = ?", "options": ["8", "4", "7", "6"], "correctIndex": 3, "level": 10, "id": 458},
    {"subject": "Toán", "question": "Có 8 quả bóng bay 🎈, cho bạn 6 quả bóng bay. Còn mấy quả bóng bay?", "options": ["0", "1", "3", "2"], "correctIndex": 3, "level": 10, "id": 459},
    {"subject": "Toán", "question": "Có 5 quả táo 🍎, thêm 2 quả táo nữa. Có tất cả mấy quả táo?", "options": ["6", "9", "7", "5"], "correctIndex": 2, "level": 10, "id": 460},
    {"subject": "Toán", "question": "🐞🐞 Có mấy con bọ rùa?", "options": ["2", "4", "1", "3"], "correctIndex": 0, "level": 10, "id": 461},
    {"subject": "Toán", "question": "🐞🐞🐞🐞🐞🐞 Có mấy con bọ rùa?", "options": ["5", "6", "4", "7"], "correctIndex": 1, "level": 10, "id": 462},
    {"subject": "Toán", "question": "🚀🚀🚀🚀🚀🚀🚀🚀 Có mấy tên lửa?", "options": ["9", "6", "7", "8"], "correctIndex": 3, "level": 10, "id": 463},
    {"subject": "Toán", "question": "Có 8 con cá 🐟, thêm 7 con cá nữa. Có tất cả mấy con cá?", "options": ["17", "13", "15", "14"], "correctIndex": 2, "level": 10, "id": 464},
    {"subject": "Toán", "question": "Số gồm 3 chục và 9 đơn vị là:", "options": ["93", "49", "12", "39"], "correctIndex": 3, "level": 10, "id": 465},
    {"subject": "Toán", "question": "10 − 5 = ?", "options": ["4", "6", "5", "7"], "correctIndex": 2, "level": 10, "id": 466},
    {"subject": "Toán", "question": "Số gồm 7 chục và 2 đơn vị là:", "options": ["9", "72", "27", "82"], "correctIndex": 1, "level": 10, "id": 467},
    {"subject": "Toán", "question": "3 − 1 = ?", "options": ["2", "3", "0", "1"], "correctIndex": 0, "level": 10, "id": 468},
    {"subject": "Toán", "question": "Điền dấu: 5 … 8", "options": ["+", "=", ">", "<"], "correctIndex": 3, "level": 10, "id": 469},
    {"subject": "Toán", "question": "Số gồm 5 chục và 2 đơn vị là:", "options": ["62", "7", "52", "25"], "correctIndex": 2, "level": 10, "id": 470},
    {"subject": "Toán", "question": "Có 5 chiếc ô tô 🚗, thêm 7 chiếc ô tô nữa. Có tất cả mấy chiếc ô tô?", "options": ["14", "13", "11", "12"], "correctIndex": 3, "level": 10, "id": 471},
    {"subject": "Toán", "question": "1 + 9 = ?", "options": ["10", "9", "12", "11"], "correctIndex": 0, "level": 10, "id": 472},
    {"subject": "Toán", "question": "6 − 4 = ?", "options": ["4", "2", "3", "0"], "correctIndex": 1, "level": 10, "id": 473},
    {"subject": "Tiếng Việt", "question": "🍇 là gì?", "options": ["Con chó", "Ngôi nhà", "Chùm nho", "Con ong"], "correctIndex": 2, "level": 10, "id": 474},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["ngã ba", "nghã ba", "gồ gề", "con kò"], "correctIndex": 0, "level": 10, "id": 475},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ưng'?", "options": ["voi", "tốt", "lưng", "mưa"], "correctIndex": 2, "level": 10, "id": 476},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["con ghà", "nghõ nhỏ", "ngõ nhỏ", "ngỉ hè"], "correctIndex": 2, "level": 10, "id": 477},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'q'?", "options": ["a", "q", "ô", "o"], "correctIndex": 1, "level": 10, "id": 478},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'e'?", "options": ["h", "g", "e", "ă"], "correctIndex": 2, "level": 10, "id": 479},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["gói quà", "gi nhớ", "ghói quà", "quả kam"], "correctIndex": 0, "level": 10, "id": 480},
    {"subject": "Tiếng Việt", "question": "Tiếng 'lươn' có vần gì?", "options": ["ông", "ươn", "en", "im"], "correctIndex": 1, "level": 10, "id": 481},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'x'?", "options": ["d", "h", "x", "l"], "correctIndex": 2, "level": 10, "id": 482},
    {"subject": "Tiếng Việt", "question": "👒 là gì?", "options": ["Cái mũ", "Cây xanh", "Con rùa", "Chùm nho"], "correctIndex": 0, "level": 10, "id": 483},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["cái gế", "con kò", "củ ciệu", "con cò"], "correctIndex": 3, "level": 10, "id": 484},
    {"subject": "Tiếng Việt", "question": "Tiếng 'sẻ' bắt đầu bằng chữ nào?", "options": ["k", "đ", "gh", "s"], "correctIndex": 3, "level": 10, "id": 485},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'oang'?", "options": ["khoang", "trăng", "vườn", "hạt"], "correctIndex": 0, "level": 10, "id": 486},
    {"subject": "Tiếng Anh", "question": "'Quả chuối' tiếng Anh là gì?", "options": ["Banana", "Egg", "Mango", "Watermelon"], "correctIndex": 0, "level": 10, "id": 487},
    {"subject": "Tiếng Anh", "question": "🐔 tiếng Anh là gì?", "options": ["Chicken", "Rabbit", "Horse", "Elephant"], "correctIndex": 0, "level": 10, "id": 488},
    {"subject": "Tiếng Anh", "question": "'Con ếch' tiếng Anh là gì?", "options": ["Bird", "Dog", "Tiger", "Frog"], "correctIndex": 3, "level": 10, "id": 489},
    {"subject": "Tiếng Anh", "question": "Số 9 tiếng Anh là gì?", "options": ["Eleven", "Nine", "Ten", "Seven"], "correctIndex": 1, "level": 10, "id": 490},
    {"subject": "Tiếng Anh", "question": "'Con chim' tiếng Anh là gì?", "options": ["Bird", "Frog", "Dog", "Bear"], "correctIndex": 0, "level": 10, "id": 491},
    {"subject": "Tiếng Anh", "question": "🚗 tiếng Anh là gì?", "options": ["Car", "Boat", "Teddy bear", "Train"], "correctIndex": 0, "level": 10, "id": 492},
    {"subject": "Tiếng Anh", "question": "'Màu tím' tiếng Anh là gì?", "options": ["White", "Orange", "Black", "Purple"], "correctIndex": 3, "level": 10, "id": 493},
    {"subject": "Tiếng Anh", "question": "'Doll' nghĩa là gì?", "options": ["Máy bay", "Búp bê", "Quả bóng", "Gấu bông"], "correctIndex": 1, "level": 10, "id": 494},
    {"subject": "Tiếng Anh", "question": "'Tàu hỏa' tiếng Anh là gì?", "options": ["Doll", "Car", "Teddy bear", "Train"], "correctIndex": 3, "level": 10, "id": 495},
    {"subject": "Tiếng Anh", "question": "⛵ tiếng Anh là gì?", "options": ["Bike", "Plane", "Ball", "Boat"], "correctIndex": 3, "level": 10, "id": 496},
    {"subject": "Tiếng Anh", "question": "'Con cá' tiếng Anh là gì?", "options": ["Elephant", "Fish", "Snake", "Tiger"], "correctIndex": 1, "level": 10, "id": 497},
    {"subject": "Tiếng Anh", "question": "'Teddy bear' nghĩa là gì?", "options": ["Búp bê", "Ô tô", "Gấu bông", "Con thuyền"], "correctIndex": 2, "level": 10, "id": 498},
    {"subject": "Tiếng Anh", "question": "🐯 tiếng Anh là gì?", "options": ["Bird", "Frog", "Tiger", "Rabbit"], "correctIndex": 2, "level": 10, "id": 499},
    {"subject": "Tiếng Anh", "question": "'Máy bay' tiếng Anh là gì?", "options": ["Bike", "Doll", "Train", "Plane"], "correctIndex": 3, "level": 10, "id": 500},
    {"id": 501, "level": 11, "subject": "Toán", "question": "2 + 6 = ?", "options": ["10", "11", "8", "5"], "correctIndex": 2},
    {"id": 502, "level": 11, "subject": "Toán", "question": "5 − 4 = ?", "options": ["3", "2", "4", "1"], "correctIndex": 3},
    {"id": 503, "level": 11, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ai'?", "options": ["mơ", "mũ", "mây", "mai"], "correctIndex": 3},
    {"id": 504, "level": 11, "subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["con nghé", "con ngé", "con nghẽ", "côn nghé"], "correctIndex": 0},
    {"id": 505, "level": 11, "subject": "Tiếng Anh", "question": "'Two' là số mấy?", "options": ["2", "3", "4", "1"], "correctIndex": 0},
    {"subject": "Toán", "question": "4 + 13 = ?", "options": ["17", "18", "19", "16"], "correctIndex": 0, "level": 11, "id": 506},
    {"subject": "Toán", "question": "Có 4 chiếc ô tô 🚗, cho bạn 1 chiếc ô tô. Còn mấy chiếc ô tô?", "options": ["2", "1", "3", "4"], "correctIndex": 2, "level": 11, "id": 507},
    {"subject": "Toán", "question": "12 + 2 = ?", "options": ["12", "14", "15", "13"], "correctIndex": 1, "level": 11, "id": 508},
    {"subject": "Toán", "question": "Điền dấu: 7 … 8", "options": [">", "<", "=", "+"], "correctIndex": 1, "level": 11, "id": 509},
    {"subject": "Toán", "question": "Có 4 cái kẹo 🍬, thêm 2 cái kẹo nữa. Có tất cả mấy cái kẹo?", "options": ["7", "5", "6", "8"], "correctIndex": 2, "level": 11, "id": 510},
    {"subject": "Toán", "question": "15 + 1 = ?", "options": ["16", "18", "14", "17"], "correctIndex": 0, "level": 11, "id": 511},
    {"subject": "Toán", "question": "8 + 11 = ?", "options": ["18", "19", "21", "17"], "correctIndex": 1, "level": 11, "id": 512},
    {"subject": "Toán", "question": "Có 9 con cá 🐟, cho bạn 6 con cá. Còn mấy con cá?", "options": ["4", "5", "3", "2"], "correctIndex": 2, "level": 11, "id": 513},
    {"subject": "Toán", "question": "15 + 2 = ?", "options": ["16", "17", "19", "18"], "correctIndex": 1, "level": 11, "id": 514},
    {"subject": "Toán", "question": "16 − 15 = ?", "options": ["2", "1", "0", "3"], "correctIndex": 1, "level": 11, "id": 515},
    {"subject": "Toán", "question": "Điền dấu: 20 … 18", "options": ["<", "=", "+", ">"], "correctIndex": 3, "level": 11, "id": 516},
    {"subject": "Toán", "question": "9 + 6 = ?", "options": ["13", "16", "15", "17"], "correctIndex": 2, "level": 11, "id": 517},
    {"subject": "Toán", "question": "13 − 8 = ?", "options": ["4", "7", "5", "3"], "correctIndex": 2, "level": 11, "id": 518},
    {"subject": "Toán", "question": "7 + 7 = ?", "options": ["12", "14", "16", "13"], "correctIndex": 1, "level": 11, "id": 519},
    {"subject": "Toán", "question": "11 + 1 = ?", "options": ["11", "12", "13", "14"], "correctIndex": 1, "level": 11, "id": 520},
    {"subject": "Toán", "question": "13 − 12 = ?", "options": ["1", "3", "2", "0"], "correctIndex": 0, "level": 11, "id": 521},
    {"subject": "Toán", "question": "Điền dấu: 13 … 11", "options": ["=", ">", "+", "<"], "correctIndex": 1, "level": 11, "id": 522},
    {"subject": "Toán", "question": "19 − 1 = ?", "options": ["20", "19", "18", "16"], "correctIndex": 2, "level": 11, "id": 523},
    {"subject": "Tiếng Việt", "question": "Tiếng 'tô' bắt đầu bằng chữ nào?", "options": ["đ", "t", "d", "ng"], "correctIndex": 1, "level": 11, "id": 524},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["nghõ nhỏ", "nghe nhạc", "nge nhạc", "ngỉ hè"], "correctIndex": 1, "level": 11, "id": 525},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'at'?", "options": ["bút", "hạt", "buồn", "xòe"], "correctIndex": 1, "level": 11, "id": 526},
    {"subject": "Tiếng Việt", "question": "Tiếng 'súng' có vần gì?", "options": ["inh", "êm", "oang", "ung"], "correctIndex": 3, "level": 11, "id": 527},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ich'?", "options": ["bát", "xuống", "xích", "cung"], "correctIndex": 2, "level": 11, "id": 528},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'p'?", "options": ["i", "p", "l", "v"], "correctIndex": 1, "level": 11, "id": 529},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ut'?", "options": ["nệm", "hút", "gương", "gừng"], "correctIndex": 1, "level": 11, "id": 530},
    {"subject": "Tiếng Việt", "question": "Điền từ: Bà ... chuyện.", "options": ["bay", "bơi", "kể", "gáy"], "correctIndex": 2, "level": 11, "id": 531},
    {"subject": "Tiếng Việt", "question": "Điền từ: Chú bò ... cỏ.", "options": ["bay", "viết", "ăn", "hót"], "correctIndex": 2, "level": 11, "id": 532},
    {"subject": "Tiếng Việt", "question": "Tiếng 'buồn' có vần gì?", "options": ["uôn", "ach", "at", "ưng"], "correctIndex": 0, "level": 11, "id": 533},
    {"subject": "Tiếng Việt", "question": "Tiếng 'dưa' có vần gì?", "options": ["ơt", "ôi", "ưa", "êm"], "correctIndex": 2, "level": 11, "id": 534},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'im'?", "options": ["chim", "chuồn", "cột", "kéo"], "correctIndex": 0, "level": 11, "id": 535},
    {"subject": "Tiếng Việt", "question": "Tiếng 'đứt' có vần gì?", "options": ["inh", "oan", "au", "ưt"], "correctIndex": 3, "level": 11, "id": 536},
    {"subject": "Tiếng Anh", "question": "👴 tiếng Anh là gì?", "options": ["Sister", "Brother", "Grandfather", "Father"], "correctIndex": 2, "level": 11, "id": 537},
    {"subject": "Tiếng Anh", "question": "'Bà' tiếng Anh là gì?", "options": ["Mother", "Grandmother", "Brother", "Sister"], "correctIndex": 1, "level": 11, "id": 538},
    {"subject": "Tiếng Anh", "question": "'Giraffe' nghĩa là gì?", "options": ["Con rắn", "Con voi", "Con hươu cao cổ", "Con thỏ"], "correctIndex": 2, "level": 11, "id": 539},
    {"subject": "Tiếng Anh", "question": "'Mother' nghĩa là gì?", "options": ["Em bé", "Bố", "Chị/em gái", "Mẹ"], "correctIndex": 3, "level": 11, "id": 540},
    {"subject": "Tiếng Anh", "question": "👵 tiếng Anh là gì?", "options": ["Brother", "Baby", "Sister", "Grandmother"], "correctIndex": 3, "level": 11, "id": 541},
    {"subject": "Tiếng Anh", "question": "'Father' nghĩa là gì?", "options": ["Ông", "Mẹ", "Bố", "Bà"], "correctIndex": 2, "level": 11, "id": 542},
    {"subject": "Tiếng Anh", "question": "'Quả cam' tiếng Anh là gì?", "options": ["Bread", "Banana", "Orange", "Juice"], "correctIndex": 2, "level": 11, "id": 543},
    {"subject": "Tiếng Anh", "question": "'Anh/em trai' tiếng Anh là gì?", "options": ["Baby", "Grandfather", "Sister", "Brother"], "correctIndex": 3, "level": 11, "id": 544},
    {"subject": "Tiếng Anh", "question": "'Bố' tiếng Anh là gì?", "options": ["Grandmother", "Grandfather", "Baby", "Father"], "correctIndex": 3, "level": 11, "id": 545},
    {"subject": "Tiếng Anh", "question": "'Sister' nghĩa là gì?", "options": ["Bố", "Chị/em gái", "Bà", "Ông"], "correctIndex": 1, "level": 11, "id": 546},
    {"subject": "Tiếng Anh", "question": "'Ô tô' tiếng Anh là gì?", "options": ["Ball", "Train", "Car", "Bike"], "correctIndex": 2, "level": 11, "id": 547},
    {"subject": "Tiếng Anh", "question": "'Bike' nghĩa là gì?", "options": ["Con diều", "Quả bóng", "Xe đạp", "Búp bê"], "correctIndex": 2, "level": 11, "id": 548},
    {"subject": "Tiếng Anh", "question": "'Mẹ' tiếng Anh là gì?", "options": ["Grandmother", "Mother", "Sister", "Brother"], "correctIndex": 1, "level": 11, "id": 549},
    {"subject": "Tiếng Anh", "question": "'Bread' nghĩa là gì?", "options": ["Kem", "Nước ép", "Bánh mì", "Dưa hấu"], "correctIndex": 2, "level": 11, "id": 550},
    {"id": 551, "level": 12, "subject": "Toán", "question": "6 + 3 = ?", "options": ["9", "12", "10", "11"], "correctIndex": 0},
    {"id": 552, "level": 12, "subject": "Toán", "question": "9 − 2 = ?", "options": ["7", "6", "4", "10"], "correctIndex": 0},
    {"id": 553, "level": 12, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'oi'?", "options": ["về", "vui", "vai", "voi"], "correctIndex": 3},
    {"id": 554, "level": 12, "subject": "Tiếng Việt", "question": "Điền từ: Bé ... sách.", "options": ["đọc", "bơi", "ngủ", "chạy"], "correctIndex": 0},
    {"id": 555, "level": 12, "subject": "Tiếng Anh", "question": "'Five' là số mấy?", "options": ["9", "6", "4", "5"], "correctIndex": 3},
    {"subject": "Toán", "question": "Số liền trước của 10 là:", "options": ["10", "11", "8", "9"], "correctIndex": 3, "level": 12, "id": 556},
    {"subject": "Toán", "question": "Điền dấu: 19 … 19", "options": ["=", "+", "<", ">"], "correctIndex": 0, "level": 12, "id": 557},
    {"subject": "Toán", "question": "Có 8 cái kẹo 🍬, thêm 9 cái kẹo nữa. Có tất cả mấy cái kẹo?", "options": ["17", "16", "15", "18"], "correctIndex": 0, "level": 12, "id": 558},
    {"subject": "Toán", "question": "Có 2 quả táo 🍎, thêm 9 quả táo nữa. Có tất cả mấy quả táo?", "options": ["11", "9", "10", "12"], "correctIndex": 0, "level": 12, "id": 559},
    {"subject": "Toán", "question": "Có 6 cái kẹo 🍬, cho bạn 1 cái kẹo. Còn mấy cái kẹo?", "options": ["5", "7", "4", "6"], "correctIndex": 0, "level": 12, "id": 560},
    {"subject": "Toán", "question": "Điền dấu: 17 … 16", "options": ["<", ">", "=", "+"], "correctIndex": 1, "level": 12, "id": 561},
    {"subject": "Toán", "question": "🐥🐥 Có mấy chú gà con?", "options": ["4", "1", "3", "2"], "correctIndex": 3, "level": 12, "id": 562},
    {"subject": "Toán", "question": "Điền dấu: 18 … 12", "options": ["+", ">", "=", "<"], "correctIndex": 1, "level": 12, "id": 563},
    {"subject": "Toán", "question": "🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗 Có mấy chiếc ô tô?", "options": ["8", "11", "10", "12"], "correctIndex": 2, "level": 12, "id": 564},
    {"subject": "Toán", "question": "Số gồm 6 chục và 1 đơn vị là:", "options": ["61", "71", "7", "16"], "correctIndex": 0, "level": 12, "id": 565},
    {"subject": "Toán", "question": "Số gồm 7 chục và 6 đơn vị là:", "options": ["76", "13", "67", "86"], "correctIndex": 0, "level": 12, "id": 566},
    {"subject": "Toán", "question": "11 − 5 = ?", "options": ["8", "5", "4", "6"], "correctIndex": 3, "level": 12, "id": 567},
    {"subject": "Toán", "question": "Có 3 quả bóng bay 🎈, thêm 1 quả bóng bay nữa. Có tất cả mấy quả bóng bay?", "options": ["4", "5", "2", "3"], "correctIndex": 0, "level": 12, "id": 568},
    {"subject": "Toán", "question": "Có 4 quả táo 🍎, thêm 4 quả táo nữa. Có tất cả mấy quả táo?", "options": ["10", "8", "9", "7"], "correctIndex": 1, "level": 12, "id": 569},
    {"subject": "Toán", "question": "8 − 7 = ?", "options": ["3", "2", "0", "1"], "correctIndex": 3, "level": 12, "id": 570},
    {"subject": "Toán", "question": "🐟🐟🐟 Có mấy con cá?", "options": ["2", "5", "1", "3"], "correctIndex": 3, "level": 12, "id": 571},
    {"subject": "Toán", "question": "🦋🦋🦋🦋 Có mấy con bướm?", "options": ["2", "4", "5", "6"], "correctIndex": 1, "level": 12, "id": 572},
    {"subject": "Toán", "question": "Điền dấu: 7 … 6", "options": ["+", ">", "=", "<"], "correctIndex": 1, "level": 12, "id": 573},
    {"subject": "Tiếng Việt", "question": "Điền từ: Cá ... dưới nước.", "options": ["viết", "bay", "bơi", "hót"], "correctIndex": 2, "level": 12, "id": 574},
    {"subject": "Tiếng Việt", "question": "Tiếng 'xích' có vần gì?", "options": ["ơm", "ich", "en", "ut"], "correctIndex": 1, "level": 12, "id": 575},
    {"subject": "Tiếng Việt", "question": "🐢 là gì?", "options": ["Con rùa", "Con voi", "Con cá", "Con ngựa"], "correctIndex": 0, "level": 12, "id": 576},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["củ ciệu", "củ kiệu", "con ngé", "gồ gề"], "correctIndex": 1, "level": 12, "id": 577},
    {"subject": "Tiếng Việt", "question": "Tiếng 'trăng' có vần gì?", "options": ["ach", "on", "uôi", "ăng"], "correctIndex": 3, "level": 12, "id": 578},
    {"subject": "Tiếng Việt", "question": "Tiếng 'nơ' bắt đầu bằng chữ nào?", "options": ["tr", "n", "s", "gh"], "correctIndex": 1, "level": 12, "id": 579},
    {"subject": "Tiếng Việt", "question": "Tiếng 'tầng' có vần gì?", "options": ["iên", "ưu", "âng", "ông"], "correctIndex": 2, "level": 12, "id": 580},
    {"subject": "Tiếng Việt", "question": "🌽 là gì?", "options": ["Con bướm", "Con lợn", "Quyển sách", "Bắp ngô"], "correctIndex": 3, "level": 12, "id": 581},
    {"subject": "Tiếng Việt", "question": "🦋 là gì?", "options": ["Con cua", "Con ốc", "Con thỏ", "Con bướm"], "correctIndex": 3, "level": 12, "id": 582},
    {"subject": "Tiếng Việt", "question": "Điền từ: Bé ... răng.", "options": ["hót", "đánh", "bay", "gáy"], "correctIndex": 1, "level": 12, "id": 583},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ưt'?", "options": ["mứt", "bệnh", "bàn", "cung"], "correctIndex": 0, "level": 12, "id": 584},
    {"subject": "Tiếng Việt", "question": "Tiếng 'thuyền' có vần gì?", "options": ["an", "uyên", "ênh", "im"], "correctIndex": 1, "level": 12, "id": 585},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'g'?", "options": ["o", "k", "g", "m"], "correctIndex": 2, "level": 12, "id": 586},
    {"subject": "Tiếng Anh", "question": "'Baby' nghĩa là gì?", "options": ["Ông", "Bà", "Anh/em trai", "Em bé"], "correctIndex": 3, "level": 12, "id": 587},
    {"subject": "Tiếng Anh", "question": "'Chị/em gái' tiếng Anh là gì?", "options": ["Father", "Mother", "Grandmother", "Sister"], "correctIndex": 3, "level": 12, "id": 588},
    {"subject": "Tiếng Anh", "question": "'Pink' nghĩa là gì?", "options": ["Màu hồng", "Màu vàng", "Màu cam", "Màu đen"], "correctIndex": 0, "level": 12, "id": 589},
    {"subject": "Tiếng Anh", "question": "'Green' nghĩa là gì?", "options": ["Màu trắng", "Màu hồng", "Màu cam", "Màu xanh lá"], "correctIndex": 3, "level": 12, "id": 590},
    {"subject": "Tiếng Anh", "question": "👩 tiếng Anh là gì?", "options": ["Grandfather", "Mother", "Baby", "Sister"], "correctIndex": 1, "level": 12, "id": 591},
    {"subject": "Tiếng Anh", "question": "👨 tiếng Anh là gì?", "options": ["Grandmother", "Father", "Sister", "Mother"], "correctIndex": 1, "level": 12, "id": 592},
    {"subject": "Tiếng Anh", "question": "'Grandmother' nghĩa là gì?", "options": ["Bố", "Em bé", "Anh/em trai", "Bà"], "correctIndex": 3, "level": 12, "id": 593},
    {"subject": "Tiếng Anh", "question": "'Yo-yo' nghĩa là gì?", "options": ["Quả bóng", "Cái yo-yo", "Máy bay", "Con thuyền"], "correctIndex": 1, "level": 12, "id": 594},
    {"subject": "Tiếng Anh", "question": "'Con bò' tiếng Anh là gì?", "options": ["Lion", "Snake", "Cow", "Cat"], "correctIndex": 2, "level": 12, "id": 595},
    {"subject": "Tiếng Anh", "question": "'Em bé' tiếng Anh là gì?", "options": ["Grandfather", "Father", "Baby", "Brother"], "correctIndex": 2, "level": 12, "id": 596},
    {"subject": "Tiếng Anh", "question": "🐟 tiếng Anh là gì?", "options": ["Fish", "Snake", "Duck", "Monkey"], "correctIndex": 0, "level": 12, "id": 597},
    {"subject": "Tiếng Anh", "question": "'Plane' nghĩa là gì?", "options": ["Xe đạp", "Búp bê", "Tàu hỏa", "Máy bay"], "correctIndex": 3, "level": 12, "id": 598},
    {"subject": "Tiếng Anh", "question": "'Grandfather' nghĩa là gì?", "options": ["Mẹ", "Bố", "Anh/em trai", "Ông"], "correctIndex": 3, "level": 12, "id": 599},
    {"subject": "Tiếng Anh", "question": "👦 tiếng Anh là gì?", "options": ["Grandmother", "Father", "Mother", "Brother"], "correctIndex": 3, "level": 12, "id": 600},
    {"id": 601, "level": 13, "subject": "Toán", "question": "2 + 7 = ?", "options": ["11", "10", "9", "8"], "correctIndex": 2},
    {"id": 602, "level": 13, "subject": "Toán", "question": "10 − 7 = ?", "options": ["5", "0", "4", "3"], "correctIndex": 3},
    {"id": 603, "level": 13, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ây'?", "options": ["may", "mai", "mây", "mơ"], "correctIndex": 2},
    {"id": 604, "level": 13, "subject": "Tiếng Việt", "question": "Từ nào chỉ hoa quả?", "options": ["con gà", "bút chì", "quả cam", "cái ghế"], "correctIndex": 2},
    {"id": 605, "level": 13, "subject": "Tiếng Anh", "question": "'Ten' là số mấy?", "options": ["10", "2", "1", "7"], "correctIndex": 0},
    {"subject": "Toán", "question": "13 + 4 = ?", "options": ["18", "17", "16", "15"], "correctIndex": 1, "level": 13, "id": 606},
    {"subject": "Toán", "question": "Điền dấu: 7 … 12", "options": ["=", "+", ">", "<"], "correctIndex": 3, "level": 13, "id": 607},
    {"subject": "Toán", "question": "Có 2 quả táo 🍎, thêm 6 quả táo nữa. Có tất cả mấy quả táo?", "options": ["7", "8", "9", "10"], "correctIndex": 1, "level": 13, "id": 608},
    {"subject": "Toán", "question": "Điền dấu: 3 … 13", "options": [">", "<", "+", "="], "correctIndex": 1, "level": 13, "id": 609},
    {"subject": "Toán", "question": "Số liền sau của 5 là:", "options": ["4", "5", "6", "7"], "correctIndex": 2, "level": 13, "id": 610},
    {"subject": "Toán", "question": "Có 4 con cá 🐟, thêm 1 con cá nữa. Có tất cả mấy con cá?", "options": ["4", "5", "6", "3"], "correctIndex": 1, "level": 13, "id": 611},
    {"subject": "Toán", "question": "Số liền trước của 19 là:", "options": ["18", "19", "20", "17"], "correctIndex": 0, "level": 13, "id": 612},
    {"subject": "Toán", "question": "Điền dấu: 20 … 14", "options": [">", "<", "=", "+"], "correctIndex": 0, "level": 13, "id": 613},
    {"subject": "Toán", "question": "14 − 9 = ?", "options": ["6", "7", "4", "5"], "correctIndex": 3, "level": 13, "id": 614},
    {"subject": "Toán", "question": "Số gồm 7 chục và 9 đơn vị là:", "options": ["16", "97", "89", "79"], "correctIndex": 3, "level": 13, "id": 615},
    {"subject": "Toán", "question": "Số gồm 3 chục và 6 đơn vị là:", "options": ["9", "63", "36", "46"], "correctIndex": 2, "level": 13, "id": 616},
    {"subject": "Toán", "question": "1 + 11 = ?", "options": ["14", "11", "10", "12"], "correctIndex": 3, "level": 13, "id": 617},
    {"subject": "Toán", "question": "17 − 13 = ?", "options": ["4", "2", "5", "6"], "correctIndex": 0, "level": 13, "id": 618},
    {"subject": "Toán", "question": "Có 7 quả bóng bay 🎈, thêm 7 quả bóng bay nữa. Có tất cả mấy quả bóng bay?", "options": ["16", "14", "15", "13"], "correctIndex": 1, "level": 13, "id": 619},
    {"subject": "Toán", "question": "12 + 1 = ?", "options": ["13", "15", "11", "12"], "correctIndex": 0, "level": 13, "id": 620},
    {"subject": "Toán", "question": "Số liền sau của 15 là:", "options": ["17", "14", "16", "15"], "correctIndex": 2, "level": 13, "id": 621},
    {"subject": "Toán", "question": "🚌🚌🚌🚌🚌🚌🚌🚌🚌🚌 Có mấy xe buýt?", "options": ["9", "10", "12", "8"], "correctIndex": 1, "level": 13, "id": 622},
    {"subject": "Toán", "question": "Số liền sau của 3 là:", "options": ["4", "3", "5", "2"], "correctIndex": 0, "level": 13, "id": 623},
    {"subject": "Tiếng Việt", "question": "Điền từ: Em ... tay trước khi ăn.", "options": ["rửa", "gáy", "hót", "bay"], "correctIndex": 0, "level": 13, "id": 624},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ông'?", "options": ["vâng", "đôi", "kính", "sông"], "correctIndex": 3, "level": 13, "id": 625},
    {"subject": "Tiếng Việt", "question": "Điền từ: Gà trống ... ò ó o.", "options": ["nấu", "gáy", "bơi", "đọc"], "correctIndex": 1, "level": 13, "id": 626},
    {"subject": "Tiếng Việt", "question": "Tiếng 'canh' có vần gì?", "options": ["ươn", "anh", "âng", "oang"], "correctIndex": 1, "level": 13, "id": 627},
    {"subject": "Tiếng Việt", "question": "🚲 là gì?", "options": ["Củ cà rốt", "Quyển sách", "Chùm nho", "Xe đạp"], "correctIndex": 3, "level": 13, "id": 628},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'anh'?", "options": ["hạt", "cơm", "canh", "sen"], "correctIndex": 2, "level": 13, "id": 629},
    {"subject": "Tiếng Việt", "question": "Tiếng 'xòe' có vần gì?", "options": ["ông", "oe", "oang", "ưu"], "correctIndex": 1, "level": 13, "id": 630},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["cây kem", "cây cem", "cá cho", "ghói quà"], "correctIndex": 0, "level": 13, "id": 631},
    {"subject": "Tiếng Việt", "question": "📕 là gì?", "options": ["Quyển sách", "Bút chì", "Con vịt", "Mặt trời"], "correctIndex": 0, "level": 13, "id": 632},
    {"subject": "Tiếng Việt", "question": "Điền từ: Bé ... đá bóng.", "options": ["hót", "nấu", "gáy", "chơi"], "correctIndex": 3, "level": 13, "id": 633},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["ngỉ hè", "cái cẹo", "cái kẹo", "cể chuyện"], "correctIndex": 2, "level": 13, "id": 634},
    {"subject": "Tiếng Việt", "question": "🐯 là gì?", "options": ["Con mèo", "Con hổ", "Con chó", "Con ếch"], "correctIndex": 1, "level": 13, "id": 635},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'u'?", "options": ["n", "â", "e", "u"], "correctIndex": 3, "level": 13, "id": 636},
    {"subject": "Tiếng Anh", "question": "🐘 tiếng Anh là gì?", "options": ["Frog", "Monkey", "Tiger", "Elephant"], "correctIndex": 3, "level": 13, "id": 637},
    {"subject": "Tiếng Anh", "question": "'Quả trứng' tiếng Anh là gì?", "options": ["Milk", "Watermelon", "Cookie", "Egg"], "correctIndex": 3, "level": 13, "id": 638},
    {"subject": "Tiếng Anh", "question": "'Brother' nghĩa là gì?", "options": ["Bà", "Anh/em trai", "Mẹ", "Chị/em gái"], "correctIndex": 1, "level": 13, "id": 639},
    {"subject": "Tiếng Anh", "question": "'Quả táo' tiếng Anh là gì?", "options": ["Rice", "Apple", "Grapes", "Mango"], "correctIndex": 1, "level": 13, "id": 640},
    {"subject": "Tiếng Anh", "question": "'Xe đạp' tiếng Anh là gì?", "options": ["Train", "Bike", "Plane", "Doll"], "correctIndex": 1, "level": 13, "id": 641},
    {"subject": "Tiếng Anh", "question": "'Kem' tiếng Anh là gì?", "options": ["Orange", "Egg", "Mango", "Ice cream"], "correctIndex": 3, "level": 13, "id": 642},
    {"subject": "Tiếng Anh", "question": "👶 tiếng Anh là gì?", "options": ["Sister", "Father", "Brother", "Baby"], "correctIndex": 3, "level": 13, "id": 643},
    {"subject": "Tiếng Anh", "question": "🐒 tiếng Anh là gì?", "options": ["Mouse", "Duck", "Fish", "Monkey"], "correctIndex": 3, "level": 13, "id": 644},
    {"subject": "Tiếng Anh", "question": "🦒 tiếng Anh là gì?", "options": ["Giraffe", "Bear", "Fish", "Lion"], "correctIndex": 0, "level": 13, "id": 645},
    {"subject": "Tiếng Anh", "question": "'Ông' tiếng Anh là gì?", "options": ["Father", "Sister", "Grandfather", "Baby"], "correctIndex": 2, "level": 13, "id": 646},
    {"subject": "Tiếng Anh", "question": "👧 tiếng Anh là gì?", "options": ["Sister", "Mother", "Grandmother", "Grandfather"], "correctIndex": 0, "level": 13, "id": 647},
    {"subject": "Tiếng Anh", "question": "'Juice' nghĩa là gì?", "options": ["Bánh mì", "Dưa hấu", "Nước ép", "Quả cam"], "correctIndex": 2, "level": 13, "id": 648},
    {"subject": "Tiếng Anh", "question": "'Lion' nghĩa là gì?", "options": ["Con chim", "Con rùa", "Con sư tử", "Con ngựa"], "correctIndex": 2, "level": 13, "id": 649},
    {"subject": "Tiếng Anh", "question": "'Màu cam' tiếng Anh là gì?", "options": ["Purple", "Blue", "Orange", "Brown"], "correctIndex": 2, "level": 13, "id": 650},
    {"id": 651, "level": 14, "subject": "Toán", "question": "? + 7 = 10. Số cần điền là:", "options": ["5", "3", "2", "6"], "correctIndex": 1},
    {"id": 652, "level": 14, "subject": "Toán", "question": "Số nào lớn hơn: 9 hay 8?", "options": ["1", "9", "8", "17"], "correctIndex": 1},
    {"id": 653, "level": 14, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ưa'?", "options": ["mía", "mua", "mơ", "mưa"], "correctIndex": 3},
    {"id": 654, "level": 14, "subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["ghì nhớ", "ghi nhớ", "gi nhớ", "gí nhớ"], "correctIndex": 1},
    {"id": 655, "level": 14, "subject": "Tiếng Anh", "question": "Màu xanh lá cây tiếng Anh là gì?", "options": ["Green", "Red", "Pink", "Blue"], "correctIndex": 0},
    {"subject": "Toán", "question": "11 + 4 = ?", "options": ["13", "16", "15", "14"], "correctIndex": 2, "level": 14, "id": 656},
    {"subject": "Toán", "question": "Điền dấu: 14 … 17", "options": ["<", ">", "+", "="], "correctIndex": 0, "level": 14, "id": 657},
    {"subject": "Toán", "question": "13 + 1 = ?", "options": ["15", "13", "16", "14"], "correctIndex": 3, "level": 14, "id": 658},
    {"subject": "Toán", "question": "Số gồm 6 chục và 4 đơn vị là:", "options": ["46", "64", "74", "10"], "correctIndex": 1, "level": 14, "id": 659},
    {"subject": "Toán", "question": "11 − 3 = ?", "options": ["10", "6", "9", "8"], "correctIndex": 3, "level": 14, "id": 660},
    {"subject": "Toán", "question": "Số liền sau của 18 là:", "options": ["20", "18", "17", "19"], "correctIndex": 3, "level": 14, "id": 661},
    {"subject": "Toán", "question": "20 − 19 = ?", "options": ["0", "1", "3", "2"], "correctIndex": 1, "level": 14, "id": 662},
    {"subject": "Toán", "question": "11 − 2 = ?", "options": ["10", "7", "8", "9"], "correctIndex": 3, "level": 14, "id": 663},
    {"subject": "Toán", "question": "Có 4 quả bóng bay 🎈, thêm 2 quả bóng bay nữa. Có tất cả mấy quả bóng bay?", "options": ["5", "6", "8", "4"], "correctIndex": 1, "level": 14, "id": 664},
    {"subject": "Toán", "question": "9 + 4 = ?", "options": ["15", "11", "12", "13"], "correctIndex": 3, "level": 14, "id": 665},
    {"subject": "Toán", "question": "Điền dấu: 19 … 4", "options": ["+", "<", "=", ">"], "correctIndex": 3, "level": 14, "id": 666},
    {"subject": "Toán", "question": "16 − 5 = ?", "options": ["12", "13", "11", "9"], "correctIndex": 2, "level": 14, "id": 667},
    {"subject": "Toán", "question": "Điền dấu: 16 … 8", "options": [">", "+", "=", "<"], "correctIndex": 0, "level": 14, "id": 668},
    {"subject": "Toán", "question": "🐟🐟🐟🐟🐟🐟🐟🐟🐟🐟 Có mấy con cá?", "options": ["8", "10", "11", "12"], "correctIndex": 1, "level": 14, "id": 669},
    {"subject": "Toán", "question": "🚌🚌🚌🚌 Có mấy xe buýt?", "options": ["4", "3", "5", "2"], "correctIndex": 0, "level": 14, "id": 670},
    {"subject": "Toán", "question": "18 + 1 = ?", "options": ["18", "20", "19", "17"], "correctIndex": 2, "level": 14, "id": 671},
    {"subject": "Toán", "question": "Điền dấu: 20 … 19", "options": ["<", "+", ">", "="], "correctIndex": 2, "level": 14, "id": 672},
    {"subject": "Toán", "question": "5 + 13 = ?", "options": ["16", "18", "19", "20"], "correctIndex": 1, "level": 14, "id": 673},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["cái ghế", "con ghà", "cá cho", "cái gế"], "correctIndex": 0, "level": 14, "id": 674},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["quả kam", "con ghà", "ghói quà", "quả cam"], "correctIndex": 3, "level": 14, "id": 675},
    {"subject": "Tiếng Việt", "question": "Tiếng 'trâu' bắt đầu bằng chữ nào?", "options": ["v", "tr", "k", "c"], "correctIndex": 1, "level": 14, "id": 676},
    {"subject": "Tiếng Việt", "question": "🐔 là gì?", "options": ["Con rùa", "Con gà", "Con khỉ", "Con lợn"], "correctIndex": 1, "level": 14, "id": 677},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'b'?", "options": ["b", "o", "d", "h"], "correctIndex": 0, "level": 14, "id": 678},
    {"subject": "Tiếng Việt", "question": "Tiếng 'chuồn' có vần gì?", "options": ["ương", "uôn", "iên", "inh"], "correctIndex": 1, "level": 14, "id": 679},
    {"subject": "Tiếng Việt", "question": "🥭 là gì?", "options": ["Quả xoài", "Quả bóng", "Quả cam", "Quả dưa"], "correctIndex": 0, "level": 14, "id": 680},
    {"subject": "Tiếng Việt", "question": "Điền từ: Hoa ... thơm.", "options": ["đọc", "chạy", "gáy", "nở"], "correctIndex": 3, "level": 14, "id": 681},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["cể chuyện", "kể chuyện", "con ciến", "con ngé"], "correctIndex": 1, "level": 14, "id": 682},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ui'?", "options": ["chuông", "cam", "vui", "gương"], "correctIndex": 2, "level": 14, "id": 683},
    {"subject": "Tiếng Việt", "question": "Tiếng 'bông' có vần gì?", "options": ["ưng", "ông", "au", "am"], "correctIndex": 1, "level": 14, "id": 684},
    {"subject": "Tiếng Việt", "question": "Điền từ: Em ... chữ.", "options": ["bay", "gáy", "viết", "bơi"], "correctIndex": 2, "level": 14, "id": 685},
    {"subject": "Tiếng Việt", "question": "Tiếng 'đếm' có vần gì?", "options": ["êm", "ươn", "ăng", "ơi"], "correctIndex": 0, "level": 14, "id": 686},
    {"subject": "Tiếng Anh", "question": "🐍 tiếng Anh là gì?", "options": ["Chicken", "Horse", "Snake", "Giraffe"], "correctIndex": 2, "level": 14, "id": 687},
    {"subject": "Tiếng Anh", "question": "'Con thỏ' tiếng Anh là gì?", "options": ["Snake", "Rabbit", "Bear", "Lion"], "correctIndex": 1, "level": 14, "id": 688},
    {"subject": "Tiếng Anh", "question": "'Orange' nghĩa là gì?", "options": ["Bánh mì", "Quả xoài", "Quả cam", "Quả nho"], "correctIndex": 2, "level": 14, "id": 689},
    {"subject": "Tiếng Anh", "question": "'Quả nho' tiếng Anh là gì?", "options": ["Banana", "Milk", "Egg", "Grapes"], "correctIndex": 3, "level": 14, "id": 690},
    {"subject": "Tiếng Anh", "question": "'Con hổ' tiếng Anh là gì?", "options": ["Snake", "Chicken", "Frog", "Tiger"], "correctIndex": 3, "level": 14, "id": 691},
    {"subject": "Tiếng Anh", "question": "'Bánh quy' tiếng Anh là gì?", "options": ["Juice", "Mango", "Cookie", "Milk"], "correctIndex": 2, "level": 14, "id": 692},
    {"subject": "Tiếng Anh", "question": "'Cơm' tiếng Anh là gì?", "options": ["Ice cream", "Rice", "Watermelon", "Juice"], "correctIndex": 1, "level": 14, "id": 693},
    {"subject": "Tiếng Anh", "question": "'Watermelon' nghĩa là gì?", "options": ["Dưa hấu", "Bánh mì", "Cơm", "Quả cam"], "correctIndex": 0, "level": 14, "id": 694},
    {"subject": "Tiếng Anh", "question": "'Con hươu cao cổ' tiếng Anh là gì?", "options": ["Cat", "Giraffe", "Dog", "Bear"], "correctIndex": 1, "level": 14, "id": 695},
    {"subject": "Tiếng Anh", "question": "'Nước ép' tiếng Anh là gì?", "options": ["Mango", "Cookie", "Rice", "Juice"], "correctIndex": 3, "level": 14, "id": 696},
    {"subject": "Tiếng Anh", "question": "'Con mèo' tiếng Anh là gì?", "options": ["Pig", "Cat", "Chicken", "Lion"], "correctIndex": 1, "level": 14, "id": 697},
    {"subject": "Tiếng Anh", "question": "'Mango' nghĩa là gì?", "options": ["Quả xoài", "Quả cam", "Bánh mì", "Cơm"], "correctIndex": 0, "level": 14, "id": 698},
    {"subject": "Tiếng Anh", "question": "'Con chuột' tiếng Anh là gì?", "options": ["Frog", "Mouse", "Snake", "Fish"], "correctIndex": 1, "level": 14, "id": 699},
    {"subject": "Tiếng Anh", "question": "🟠 tiếng Anh là gì?", "options": ["Orange", "White", "Blue", "Red"], "correctIndex": 0, "level": 14, "id": 700},
    {"id": 701, "level": 15, "subject": "Toán", "question": "? + 8 = 9. Số cần điền là:", "options": ["4", "1", "2", "3"], "correctIndex": 1},
    {"id": 702, "level": 15, "subject": "Toán", "question": "Số nào lớn hơn: 1 hay 5?", "options": ["5", "1", "6", "4"], "correctIndex": 0},
    {"id": 703, "level": 15, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ong'?", "options": ["bàng", "bông", "bóng", "bưng"], "correctIndex": 2},
    {"id": 704, "level": 15, "subject": "Tiếng Việt", "question": "Con gì gáy 'ò ó o'?", "options": ["con chó", "con mèo", "con gà trống", "con vịt"], "correctIndex": 2},
    {"id": 705, "level": 15, "subject": "Tiếng Anh", "question": "'Pink' là màu gì?", "options": ["Màu trắng", "Màu hồng", "Màu đen", "Màu tím"], "correctIndex": 1},
    {"subject": "Toán", "question": "Có 4 cái kẹo 🍬, thêm 9 cái kẹo nữa. Có tất cả mấy cái kẹo?", "options": ["13", "14", "12", "15"], "correctIndex": 0, "level": 15, "id": 706},
    {"subject": "Toán", "question": "Số gồm 1 chục và 2 đơn vị là:", "options": ["22", "3", "12", "21"], "correctIndex": 2, "level": 15, "id": 707},
    {"subject": "Toán", "question": "20 − 6 = ?", "options": ["15", "12", "14", "13"], "correctIndex": 2, "level": 15, "id": 708},
    {"subject": "Toán", "question": "Có 8 con cá 🐟, cho bạn 2 con cá. Còn mấy con cá?", "options": ["5", "6", "8", "7"], "correctIndex": 1, "level": 15, "id": 709},
    {"subject": "Toán", "question": "Có 4 cái kẹo 🍬, thêm 4 cái kẹo nữa. Có tất cả mấy cái kẹo?", "options": ["7", "9", "8", "10"], "correctIndex": 2, "level": 15, "id": 710},
    {"subject": "Toán", "question": "0 + 16 = ?", "options": ["15", "16", "18", "14"], "correctIndex": 1, "level": 15, "id": 711},
    {"subject": "Toán", "question": "🌸🌸 Có mấy bông hoa?", "options": ["1", "4", "2", "3"], "correctIndex": 2, "level": 15, "id": 712},
    {"subject": "Toán", "question": "Số gồm 2 chục và 3 đơn vị là:", "options": ["23", "33", "32", "5"], "correctIndex": 0, "level": 15, "id": 713},
    {"subject": "Toán", "question": "1 + 10 = ?", "options": ["10", "13", "11", "9"], "correctIndex": 2, "level": 15, "id": 714},
    {"subject": "Toán", "question": "Điền dấu: 7 … 17", "options": ["+", "=", ">", "<"], "correctIndex": 3, "level": 15, "id": 715},
    {"subject": "Toán", "question": "🐥🐥🐥🐥🐥🐥🐥 Có mấy chú gà con?", "options": ["5", "7", "6", "8"], "correctIndex": 1, "level": 15, "id": 716},
    {"subject": "Toán", "question": "Số gồm 5 chục và 4 đơn vị là:", "options": ["45", "64", "9", "54"], "correctIndex": 3, "level": 15, "id": 717},
    {"subject": "Toán", "question": "6 − 2 = ?", "options": ["3", "5", "2", "4"], "correctIndex": 3, "level": 15, "id": 718},
    {"subject": "Toán", "question": "15 + 5 = ?", "options": ["22", "20", "21", "18"], "correctIndex": 1, "level": 15, "id": 719},
    {"subject": "Toán", "question": "0 + 9 = ?", "options": ["10", "11", "9", "8"], "correctIndex": 2, "level": 15, "id": 720},
    {"subject": "Toán", "question": "Điền dấu: 8 … 19", "options": ["+", "=", ">", "<"], "correctIndex": 3, "level": 15, "id": 721},
    {"subject": "Toán", "question": "🌸🌸🌸🌸 Có mấy bông hoa?", "options": ["2", "4", "5", "6"], "correctIndex": 1, "level": 15, "id": 722},
    {"subject": "Toán", "question": "13 + 3 = ?", "options": ["15", "17", "14", "16"], "correctIndex": 3, "level": 15, "id": 723},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ưa'?", "options": ["lươn", "bơi", "dưa", "tươi"], "correctIndex": 2, "level": 15, "id": 724},
    {"subject": "Tiếng Việt", "question": "Tiếng 'kéo' có vần gì?", "options": ["eo", "ôi", "ông", "an"], "correctIndex": 0, "level": 15, "id": 725},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'on'?", "options": ["lợn", "bàn", "non", "chanh"], "correctIndex": 2, "level": 15, "id": 726},
    {"subject": "Tiếng Việt", "question": "Tiếng 'nệm' có vần gì?", "options": ["oang", "ênh", "êm", "ung"], "correctIndex": 2, "level": 15, "id": 727},
    {"subject": "Tiếng Việt", "question": "Điền từ: Mèo ... chuột.", "options": ["bắt", "hót", "đọc", "gáy"], "correctIndex": 0, "level": 15, "id": 728},
    {"subject": "Tiếng Việt", "question": "Điền từ: Bố ... xe đạp.", "options": ["đi", "bơi", "gáy", "hót"], "correctIndex": 0, "level": 15, "id": 729},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'en'?", "options": ["bơi", "bàng", "đèn", "măng"], "correctIndex": 2, "level": 15, "id": 730},
    {"subject": "Tiếng Việt", "question": "Tiếng 'ngủ' bắt đầu bằng chữ nào?", "options": ["tr", "ch", "gi", "ng"], "correctIndex": 3, "level": 15, "id": 731},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'êm'?", "options": ["bát", "chuyện", "kim", "đếm"], "correctIndex": 3, "level": 15, "id": 732},
    {"subject": "Tiếng Việt", "question": "Điền từ: Chim ... trên cành.", "options": ["nấu", "đọc", "bơi", "hót"], "correctIndex": 3, "level": 15, "id": 733},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ich'?", "options": ["khoe", "đứt", "bông", "lịch"], "correctIndex": 3, "level": 15, "id": 734},
    {"subject": "Tiếng Việt", "question": "🦆 là gì?", "options": ["Con dê", "Con vịt", "Con gà", "Con chuột"], "correctIndex": 1, "level": 15, "id": 735},
    {"subject": "Tiếng Việt", "question": "Điền từ: Máy bay ... trên trời.", "options": ["bay", "đọc", "bơi", "nấu"], "correctIndex": 0, "level": 15, "id": 736},
    {"subject": "Tiếng Anh", "question": "'Con rắn' tiếng Anh là gì?", "options": ["Giraffe", "Lion", "Tiger", "Snake"], "correctIndex": 3, "level": 15, "id": 737},
    {"subject": "Tiếng Anh", "question": "'Búp bê' tiếng Anh là gì?", "options": ["Yo-yo", "Plane", "Doll", "Car"], "correctIndex": 2, "level": 15, "id": 738},
    {"subject": "Tiếng Anh", "question": "🟣 tiếng Anh là gì?", "options": ["Brown", "Pink", "Purple", "White"], "correctIndex": 2, "level": 15, "id": 739},
    {"subject": "Tiếng Anh", "question": "'See you later' nghĩa là gì?", "options": ["Xin chào", "Tạm biệt", "Không", "Hẹn gặp lại"], "correctIndex": 3, "level": 15, "id": 740},
    {"subject": "Tiếng Anh", "question": "'Yes' nghĩa là gì?", "options": ["Hẹn gặp lại", "Xin lỗi", "Tạm biệt", "Vâng / Có"], "correctIndex": 3, "level": 15, "id": 741},
    {"subject": "Tiếng Anh", "question": "'Father' nghĩa là gì?", "options": ["Chị/em gái", "Bố", "Anh/em trai", "Mẹ"], "correctIndex": 1, "level": 15, "id": 742},
    {"subject": "Tiếng Anh", "question": "'Blue' nghĩa là gì?", "options": ["Màu trắng", "Màu cam", "Màu tím", "Màu xanh dương"], "correctIndex": 3, "level": 15, "id": 743},
    {"subject": "Tiếng Anh", "question": "🔵 tiếng Anh là gì?", "options": ["Purple", "Blue", "White", "Yellow"], "correctIndex": 1, "level": 15, "id": 744},
    {"subject": "Tiếng Anh", "question": "👧 tiếng Anh là gì?", "options": ["Baby", "Sister", "Father", "Grandfather"], "correctIndex": 1, "level": 15, "id": 745},
    {"subject": "Tiếng Anh", "question": "'Màu hồng' tiếng Anh là gì?", "options": ["Brown", "Black", "Green", "Pink"], "correctIndex": 3, "level": 15, "id": 746},
    {"subject": "Tiếng Anh", "question": "'Yo-yo' nghĩa là gì?", "options": ["Con diều", "Cái yo-yo", "Quả bóng", "Ô tô"], "correctIndex": 1, "level": 15, "id": 747},
    {"subject": "Tiếng Anh", "question": "'Con ếch' tiếng Anh là gì?", "options": ["Frog", "Monkey", "Fish", "Rabbit"], "correctIndex": 0, "level": 15, "id": 748},
    {"subject": "Tiếng Anh", "question": "👵 tiếng Anh là gì?", "options": ["Sister", "Mother", "Brother", "Grandmother"], "correctIndex": 3, "level": 15, "id": 749},
    {"subject": "Tiếng Anh", "question": "'Six' là số mấy?", "options": ["6", "3", "9", "5"], "correctIndex": 0, "level": 15, "id": 750},
    {"id": 751, "level": 16, "subject": "Toán", "question": "12 + 6 = ?", "options": ["15", "19", "18", "16"], "correctIndex": 2},
    {"id": 752, "level": 16, "subject": "Toán", "question": "13 − 1 = ?", "options": ["12", "10", "14", "13"], "correctIndex": 0},
    {"id": 753, "level": 16, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'anh'?", "options": ["xăng", "xương", "xanh", "xinh"], "correctIndex": 2},
    {"id": 754, "level": 16, "subject": "Tiếng Việt", "question": "Từ nào chỉ hoạt động?", "options": ["cái bàn", "quét nhà", "quả bóng", "bông hoa"], "correctIndex": 1},
    {"id": 755, "level": 16, "subject": "Tiếng Anh", "question": "'Bird' là con gì?", "options": ["Con mèo", "Con chim", "Con bò", "Con cá"], "correctIndex": 1},
    {"subject": "Toán", "question": "🎈🎈🎈🎈 Có mấy quả bóng bay?", "options": ["5", "2", "3", "4"], "correctIndex": 3, "level": 16, "id": 756},
    {"subject": "Toán", "question": "Số liền sau của 12 là:", "options": ["12", "11", "13", "14"], "correctIndex": 2, "level": 16, "id": 757},
    {"subject": "Toán", "question": "Điền dấu: 15 … 2", "options": ["+", "<", ">", "="], "correctIndex": 2, "level": 16, "id": 758},
    {"subject": "Toán", "question": "Có 8 chiếc ô tô 🚗, thêm 4 chiếc ô tô nữa. Có tất cả mấy chiếc ô tô?", "options": ["12", "13", "14", "11"], "correctIndex": 0, "level": 16, "id": 759},
    {"subject": "Toán", "question": "Có 3 quả bóng bay 🎈, thêm 2 quả bóng bay nữa. Có tất cả mấy quả bóng bay?", "options": ["4", "5", "7", "3"], "correctIndex": 1, "level": 16, "id": 760},
    {"subject": "Toán", "question": "1 + 5 = ?", "options": ["5", "6", "4", "7"], "correctIndex": 1, "level": 16, "id": 761},
    {"subject": "Toán", "question": "Kim ngắn chỉ số 7, kim dài chỉ số 12. Đồng hồ chỉ mấy giờ?", "options": ["12 giờ", "6 giờ", "8 giờ", "7 giờ"], "correctIndex": 3, "level": 16, "id": 762},
    {"subject": "Toán", "question": "Số liền sau của 16 là:", "options": ["15", "16", "18", "17"], "correctIndex": 3, "level": 16, "id": 763},
    {"subject": "Toán", "question": "18 + 2 = ?", "options": ["20", "21", "22", "19"], "correctIndex": 0, "level": 16, "id": 764},
    {"subject": "Toán", "question": "Số liền trước của 13 là:", "options": ["14", "11", "12", "13"], "correctIndex": 2, "level": 16, "id": 765},
    {"subject": "Toán", "question": "Số gồm 8 chục và 7 đơn vị là:", "options": ["87", "15", "97", "78"], "correctIndex": 0, "level": 16, "id": 766},
    {"subject": "Toán", "question": "Số gồm 4 chục và 8 đơn vị là:", "options": ["12", "48", "58", "84"], "correctIndex": 1, "level": 16, "id": 767},
    {"subject": "Toán", "question": "Có 9 quả táo 🍎, cho bạn 1 quả táo. Còn mấy quả táo?", "options": ["9", "10", "8", "7"], "correctIndex": 2, "level": 16, "id": 768},
    {"subject": "Toán", "question": "🚌🚌🚌🚌🚌🚌🚌 Có mấy xe buýt?", "options": ["8", "5", "9", "7"], "correctIndex": 3, "level": 16, "id": 769},
    {"subject": "Toán", "question": "Điền dấu: 11 … 8", "options": ["<", ">", "+", "="], "correctIndex": 1, "level": 16, "id": 770},
    {"subject": "Toán", "question": "14 + 4 = ?", "options": ["16", "17", "19", "18"], "correctIndex": 3, "level": 16, "id": 771},
    {"subject": "Toán", "question": "19 − 5 = ?", "options": ["12", "14", "13", "16"], "correctIndex": 1, "level": 16, "id": 772},
    {"subject": "Toán", "question": "Số liền sau của 11 là:", "options": ["11", "12", "10", "13"], "correctIndex": 1, "level": 16, "id": 773},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["con ciến", "cái kéo", "bé nghoan", "cái céo"], "correctIndex": 1, "level": 16, "id": 774},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ăng'?", "options": ["măng", "lưng", "hạt", "đếm"], "correctIndex": 0, "level": 16, "id": 775},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ao'?", "options": ["cột", "tươi", "sơn", "sao"], "correctIndex": 3, "level": 16, "id": 776},
    {"subject": "Tiếng Việt", "question": "Tiếng 'vở' bắt đầu bằng chữ nào?", "options": ["kh", "v", "tr", "s"], "correctIndex": 1, "level": 16, "id": 777},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["con ghà", "ngỉ hè", "nghỉ hè", "nge nhạc"], "correctIndex": 2, "level": 16, "id": 778},
    {"subject": "Tiếng Việt", "question": "Tiếng 'cung' có vần gì?", "options": ["âng", "ung", "en", "ương"], "correctIndex": 1, "level": 16, "id": 779},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'cao'?", "options": ["thấp", "nóng", "xa", "dài"], "correctIndex": 0, "level": 16, "id": 780},
    {"subject": "Tiếng Việt", "question": "Tiếng 'gừng' có vần gì?", "options": ["ưng", "ôt", "im", "ach"], "correctIndex": 0, "level": 16, "id": 781},
    {"subject": "Tiếng Việt", "question": "Tiếng 'non' có vần gì?", "options": ["ưa", "ưu", "on", "au"], "correctIndex": 2, "level": 16, "id": 782},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'đêm'?", "options": ["gần", "dưới", "đầy", "ngày"], "correctIndex": 3, "level": 16, "id": 783},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'nhỏ'?", "options": ["to", "cũ", "trẻ", "mới"], "correctIndex": 0, "level": 16, "id": 784},
    {"subject": "Tiếng Việt", "question": "Tiếng 'kim' có vần gì?", "options": ["ươn", "ưu", "ich", "im"], "correctIndex": 3, "level": 16, "id": 785},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'đầy'?", "options": ["cười", "vơi", "khóc", "sáng"], "correctIndex": 1, "level": 16, "id": 786},
    {"subject": "Tiếng Anh", "question": "👃 tiếng Anh là gì?", "options": ["Tooth", "Ear", "Nose", "Foot"], "correctIndex": 2, "level": 16, "id": 787},
    {"subject": "Tiếng Anh", "question": "'Miệng' tiếng Anh là gì?", "options": ["Tooth", "Eye", "Mouth", "Leg"], "correctIndex": 2, "level": 16, "id": 788},
    {"subject": "Tiếng Anh", "question": "'Seventeen' là số mấy?", "options": ["20", "16", "19", "17"], "correctIndex": 3, "level": 16, "id": 789},
    {"subject": "Tiếng Anh", "question": "'Fifteen' là số mấy?", "options": ["13", "18", "15", "12"], "correctIndex": 2, "level": 16, "id": 790},
    {"subject": "Tiếng Anh", "question": "'Tooth' nghĩa là gì?", "options": ["Tai", "Răng", "Cánh tay", "Miệng"], "correctIndex": 1, "level": 16, "id": 791},
    {"subject": "Tiếng Anh", "question": "👄 tiếng Anh là gì?", "options": ["Mouth", "Nose", "Tooth", "Ear"], "correctIndex": 0, "level": 16, "id": 792},
    {"subject": "Tiếng Anh", "question": "👂 tiếng Anh là gì?", "options": ["Eye", "Foot", "Ear", "Nose"], "correctIndex": 2, "level": 16, "id": 793},
    {"subject": "Tiếng Anh", "question": "'Nineteen' là số mấy?", "options": ["18", "20", "16", "19"], "correctIndex": 3, "level": 16, "id": 794},
    {"subject": "Tiếng Anh", "question": "'Sixteen' là số mấy?", "options": ["18", "17", "13", "16"], "correctIndex": 3, "level": 16, "id": 795},
    {"subject": "Tiếng Anh", "question": "'Twenty' là số mấy?", "options": ["18", "22", "17", "20"], "correctIndex": 3, "level": 16, "id": 796},
    {"subject": "Tiếng Anh", "question": "Số 12 tiếng Anh là gì?", "options": ["Twelve", "Eleven", "Fifteen", "Fourteen"], "correctIndex": 0, "level": 16, "id": 797},
    {"subject": "Tiếng Anh", "question": "Số 13 tiếng Anh là gì?", "options": ["Eleven", "Twelve", "Thirteen", "Fifteen"], "correctIndex": 2, "level": 16, "id": 798},
    {"subject": "Tiếng Anh", "question": "'Eighteen' là số mấy?", "options": ["18", "16", "20", "21"], "correctIndex": 0, "level": 16, "id": 799},
    {"subject": "Tiếng Anh", "question": "🦷 tiếng Anh là gì?", "options": ["Hand", "Leg", "Tooth", "Mouth"], "correctIndex": 2, "level": 16, "id": 800},
    {"id": 801, "level": 17, "subject": "Toán", "question": "15 + 3 = ?", "options": ["19", "21", "18", "15"], "correctIndex": 2},
    {"id": 802, "level": 17, "subject": "Toán", "question": "14 − 2 = ?", "options": ["11", "13", "12", "14"], "correctIndex": 2},
    {"id": 803, "level": 17, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'inh'?", "options": ["xanh", "xong", "xinh", "xung"], "correctIndex": 2},
    {"id": 804, "level": 17, "subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["củ gừng", "củ ghừng", "cũ gừng", "củ ngừng"], "correctIndex": 0},
    {"id": 805, "level": 17, "subject": "Tiếng Anh", "question": "'Fish' là con gì?", "options": ["Con gà", "Con chim", "Con lợn", "Con cá"], "correctIndex": 3},
    {"subject": "Toán", "question": "Số gồm 6 chục và 3 đơn vị là:", "options": ["9", "36", "63", "73"], "correctIndex": 2, "level": 17, "id": 806},
    {"subject": "Toán", "question": "🦋🦋🦋🦋🦋🦋🦋🦋🦋🦋 Có mấy con bướm?", "options": ["9", "8", "12", "10"], "correctIndex": 3, "level": 17, "id": 807},
    {"subject": "Toán", "question": "Có 8 con cá 🐟, thêm 8 con cá nữa. Có tất cả mấy con cá?", "options": ["14", "16", "15", "18"], "correctIndex": 1, "level": 17, "id": 808},
    {"subject": "Toán", "question": "Kim ngắn chỉ số 5, kim dài chỉ số 12. Đồng hồ chỉ mấy giờ?", "options": ["6 giờ", "5 giờ", "12 giờ", "4 giờ"], "correctIndex": 1, "level": 17, "id": 809},
    {"subject": "Toán", "question": "🐞🐞🐞🐞🐞🐞🐞🐞🐞🐞 Có mấy con bọ rùa?", "options": ["10", "8", "9", "11"], "correctIndex": 0, "level": 17, "id": 810},
    {"subject": "Toán", "question": "16 + 2 = ?", "options": ["16", "17", "20", "18"], "correctIndex": 3, "level": 17, "id": 811},
    {"subject": "Toán", "question": "Điền dấu: 15 … 10", "options": [">", "+", "<", "="], "correctIndex": 0, "level": 17, "id": 812},
    {"subject": "Toán", "question": "8 − 5 = ?", "options": ["2", "5", "1", "3"], "correctIndex": 3, "level": 17, "id": 813},
    {"subject": "Toán", "question": "Số liền sau của 13 là:", "options": ["12", "14", "13", "15"], "correctIndex": 1, "level": 17, "id": 814},
    {"subject": "Toán", "question": "Có 2 quả táo 🍎, thêm 2 quả táo nữa. Có tất cả mấy quả táo?", "options": ["4", "2", "5", "6"], "correctIndex": 0, "level": 17, "id": 815},
    {"subject": "Toán", "question": "4 + 5 = ?", "options": ["10", "9", "11", "7"], "correctIndex": 1, "level": 17, "id": 816},
    {"subject": "Toán", "question": "Kim ngắn chỉ số 12, kim dài chỉ số 12. Đồng hồ chỉ mấy giờ?", "options": ["12 giờ", "11 giờ", "6 giờ", "1 giờ"], "correctIndex": 0, "level": 17, "id": 817},
    {"subject": "Toán", "question": "19 − 9 = ?", "options": ["10", "11", "12", "8"], "correctIndex": 0, "level": 17, "id": 818},
    {"subject": "Toán", "question": "1 + 13 = ?", "options": ["13", "14", "16", "12"], "correctIndex": 1, "level": 17, "id": 819},
    {"subject": "Toán", "question": "Điền dấu: 17 … 13", "options": ["+", "<", "=", ">"], "correctIndex": 3, "level": 17, "id": 820},
    {"subject": "Toán", "question": "🚗🚗🚗🚗🚗🚗🚗🚗🚗 Có mấy chiếc ô tô?", "options": ["9", "10", "11", "7"], "correctIndex": 0, "level": 17, "id": 821},
    {"subject": "Toán", "question": "Có 4 con cá 🐟, cho bạn 2 con cá. Còn mấy con cá?", "options": ["2", "1", "4", "3"], "correctIndex": 0, "level": 17, "id": 822},
    {"subject": "Toán", "question": "Kim ngắn chỉ số 2, kim dài chỉ số 12. Đồng hồ chỉ mấy giờ?", "options": ["12 giờ", "2 giờ", "3 giờ", "1 giờ"], "correctIndex": 1, "level": 17, "id": 823},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'trắng'?", "options": ["sáng", "mới", "vơi", "đen"], "correctIndex": 3, "level": 17, "id": 824},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'buồn'?", "options": ["vui", "sáng", "gầy", "cao"], "correctIndex": 0, "level": 17, "id": 825},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'cười'?", "options": ["thấp", "khóc", "đêm", "dài"], "correctIndex": 1, "level": 17, "id": 826},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'béo'?", "options": ["đêm", "gầy", "cũ", "trên"], "correctIndex": 1, "level": 17, "id": 827},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ang'?", "options": ["vàng", "ớt", "tốt", "tươi"], "correctIndex": 0, "level": 17, "id": 828},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'mới'?", "options": ["vơi", "già", "gầy", "cũ"], "correctIndex": 3, "level": 17, "id": 829},
    {"subject": "Tiếng Việt", "question": "Tiếng 'hạt' có vần gì?", "options": ["oa", "ông", "at", "ươn"], "correctIndex": 2, "level": 17, "id": 830},
    {"subject": "Tiếng Việt", "question": "Tiếng 'bát' có vần gì?", "options": ["uyên", "iên", "at", "ương"], "correctIndex": 2, "level": 17, "id": 831},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'xa'?", "options": ["ngắn", "gần", "vui", "trẻ"], "correctIndex": 1, "level": 17, "id": 832},
    {"subject": "Tiếng Việt", "question": "🕰️ là gì?", "options": ["Cây xanh", "Con ngựa", "Đồng hồ", "Mặt trời"], "correctIndex": 2, "level": 17, "id": 833},
    {"subject": "Tiếng Việt", "question": "Tiếng 'chim' có vần gì?", "options": ["im", "eo", "oi", "ươi"], "correctIndex": 0, "level": 17, "id": 834},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'nhanh'?", "options": ["đêm", "chậm", "ngắn", "đầy"], "correctIndex": 1, "level": 17, "id": 835},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'au'?", "options": ["cột", "cau", "non", "đôi"], "correctIndex": 1, "level": 17, "id": 836},
    {"subject": "Tiếng Anh", "question": "👁️ tiếng Anh là gì?", "options": ["Eye", "Mouth", "Ear", "Foot"], "correctIndex": 0, "level": 17, "id": 837},
    {"subject": "Tiếng Anh", "question": "'Thirteen' là số mấy?", "options": ["15", "14", "13", "11"], "correctIndex": 2, "level": 17, "id": 838},
    {"subject": "Tiếng Anh", "question": "🦵 tiếng Anh là gì?", "options": ["Hand", "Mouth", "Nose", "Leg"], "correctIndex": 3, "level": 17, "id": 839},
    {"subject": "Tiếng Anh", "question": "🦶 tiếng Anh là gì?", "options": ["Foot", "Hand", "Tooth", "Ear"], "correctIndex": 0, "level": 17, "id": 840},
    {"subject": "Tiếng Anh", "question": "'Hand' nghĩa là gì?", "options": ["Mũi", "Miệng", "Bàn tay", "Răng"], "correctIndex": 2, "level": 17, "id": 841},
    {"subject": "Tiếng Anh", "question": "'Mouth' nghĩa là gì?", "options": ["Cánh tay", "Miệng", "Răng", "Mũi"], "correctIndex": 1, "level": 17, "id": 842},
    {"subject": "Tiếng Anh", "question": "Số 17 tiếng Anh là gì?", "options": ["Seventeen", "Fourteen", "Twenty", "Nineteen"], "correctIndex": 0, "level": 17, "id": 843},
    {"subject": "Tiếng Anh", "question": "Số 11 tiếng Anh là gì?", "options": ["Thirteen", "Eight", "Eleven", "Ten"], "correctIndex": 2, "level": 17, "id": 844},
    {"subject": "Tiếng Anh", "question": "'Leg' nghĩa là gì?", "options": ["Mũi", "Răng", "Miệng", "Chân"], "correctIndex": 3, "level": 17, "id": 845},
    {"subject": "Tiếng Anh", "question": "'Cánh tay' tiếng Anh là gì?", "options": ["Arm", "Tooth", "Ear", "Hand"], "correctIndex": 0, "level": 17, "id": 846},
    {"subject": "Tiếng Anh", "question": "✋ tiếng Anh là gì?", "options": ["Nose", "Hand", "Ear", "Leg"], "correctIndex": 1, "level": 17, "id": 847},
    {"subject": "Tiếng Anh", "question": "'Arm' nghĩa là gì?", "options": ["Bàn chân", "Cánh tay", "Tai", "Chân"], "correctIndex": 1, "level": 17, "id": 848},
    {"subject": "Tiếng Anh", "question": "'Bàn chân' tiếng Anh là gì?", "options": ["Foot", "Eye", "Tooth", "Hand"], "correctIndex": 0, "level": 17, "id": 849},
    {"subject": "Tiếng Anh", "question": "'Nose' nghĩa là gì?", "options": ["Răng", "Mũi", "Cánh tay", "Tai"], "correctIndex": 1, "level": 17, "id": 850},
    {"id": 851, "level": 18, "subject": "Toán", "question": "13 + 6 = ?", "options": ["20", "19", "16", "18"], "correctIndex": 1},
    {"id": 852, "level": 18, "subject": "Toán", "question": "16 − 4 = ?", "options": ["14", "10", "13", "12"], "correctIndex": 3},
    {"id": 853, "level": 18, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ươi'?", "options": ["ngồi", "nguôi", "ngoài", "người"], "correctIndex": 3},
    {"id": 854, "level": 18, "subject": "Tiếng Việt", "question": "Điền từ: Trời ... to.", "options": ["đọc", "viết", "ăn", "mưa"], "correctIndex": 3},
    {"id": 855, "level": 18, "subject": "Tiếng Anh", "question": "Con voi tiếng Anh là gì?", "options": ["Tiger", "Elephant", "Monkey", "Lion"], "correctIndex": 1},
    {"subject": "Toán", "question": "Số gồm 8 chục và 9 đơn vị là:", "options": ["99", "89", "17", "98"], "correctIndex": 1, "level": 18, "id": 856},
    {"subject": "Toán", "question": "🍓🍓 Có mấy quả dâu?", "options": ["2", "1", "3", "4"], "correctIndex": 0, "level": 18, "id": 857},
    {"subject": "Toán", "question": "19 − 3 = ?", "options": ["16", "18", "14", "15"], "correctIndex": 0, "level": 18, "id": 858},
    {"subject": "Toán", "question": "16 + 1 = ?", "options": ["18", "19", "15", "17"], "correctIndex": 3, "level": 18, "id": 859},
    {"subject": "Toán", "question": "14 − 12 = ?", "options": ["3", "2", "0", "1"], "correctIndex": 1, "level": 18, "id": 860},
    {"subject": "Toán", "question": "Số gồm 2 chục và 5 đơn vị là:", "options": ["35", "7", "25", "52"], "correctIndex": 2, "level": 18, "id": 861},
    {"subject": "Toán", "question": "0 + 14 = ?", "options": ["15", "16", "13", "14"], "correctIndex": 3, "level": 18, "id": 862},
    {"subject": "Toán", "question": "Điền dấu: 0 … 14", "options": [">", "<", "+", "="], "correctIndex": 1, "level": 18, "id": 863},
    {"subject": "Toán", "question": "Số gồm 5 chục và 7 đơn vị là:", "options": ["57", "67", "12", "75"], "correctIndex": 0, "level": 18, "id": 864},
    {"subject": "Toán", "question": "17 − 8 = ?", "options": ["8", "11", "9", "10"], "correctIndex": 2, "level": 18, "id": 865},
    {"subject": "Toán", "question": "Có 2 con cá 🐟, thêm 2 con cá nữa. Có tất cả mấy con cá?", "options": ["4", "2", "6", "5"], "correctIndex": 0, "level": 18, "id": 866},
    {"subject": "Toán", "question": "Kim ngắn chỉ số 9, kim dài chỉ số 12. Đồng hồ chỉ mấy giờ?", "options": ["12 giờ", "8 giờ", "9 giờ", "10 giờ"], "correctIndex": 2, "level": 18, "id": 867},
    {"subject": "Toán", "question": "11 − 10 = ?", "options": ["3", "1", "2", "0"], "correctIndex": 1, "level": 18, "id": 868},
    {"subject": "Toán", "question": "Điền dấu: 7 … 11", "options": ["<", ">", "+", "="], "correctIndex": 0, "level": 18, "id": 869},
    {"subject": "Toán", "question": "Có 3 cái kẹo 🍬, thêm 5 cái kẹo nữa. Có tất cả mấy cái kẹo?", "options": ["7", "10", "8", "9"], "correctIndex": 2, "level": 18, "id": 870},
    {"subject": "Toán", "question": "Có 5 chiếc ô tô 🚗, cho bạn 1 chiếc ô tô. Còn mấy chiếc ô tô?", "options": ["5", "2", "3", "4"], "correctIndex": 3, "level": 18, "id": 871},
    {"subject": "Toán", "question": "15 + 4 = ?", "options": ["20", "21", "17", "19"], "correctIndex": 3, "level": 18, "id": 872},
    {"subject": "Toán", "question": "Có 2 chiếc ô tô 🚗, thêm 1 chiếc ô tô nữa. Có tất cả mấy chiếc ô tô?", "options": ["4", "2", "3", "1"], "correctIndex": 2, "level": 18, "id": 873},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'ngày'?", "options": ["đêm", "nhỏ", "cao", "ngắn"], "correctIndex": 0, "level": 18, "id": 874},
    {"subject": "Tiếng Việt", "question": "Tiếng 'kính' có vần gì?", "options": ["inh", "ich", "ương", "anh"], "correctIndex": 0, "level": 18, "id": 875},
    {"subject": "Tiếng Việt", "question": "Tiếng 'bàng' có vần gì?", "options": ["en", "uôn", "uôi", "ang"], "correctIndex": 3, "level": 18, "id": 876},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'âng'?", "options": ["xuống", "tem", "vâng", "lựu"], "correctIndex": 2, "level": 18, "id": 877},
    {"subject": "Tiếng Việt", "question": "Tiếng 'sơn' có vần gì?", "options": ["êm", "âng", "ơn", "an"], "correctIndex": 2, "level": 18, "id": 878},
    {"subject": "Tiếng Việt", "question": "Tiếng 'bụi' có vần gì?", "options": ["uyên", "oan", "ao", "ui"], "correctIndex": 3, "level": 18, "id": 879},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'vơi'?", "options": ["cũ", "buồn", "già", "đầy"], "correctIndex": 3, "level": 18, "id": 880},
    {"subject": "Tiếng Việt", "question": "Tiếng 'vui' có vần gì?", "options": ["ui", "at", "im", "ưu"], "correctIndex": 0, "level": 18, "id": 881},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'đen'?", "options": ["béo", "cũ", "trắng", "chậm"], "correctIndex": 2, "level": 18, "id": 882},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'uông'?", "options": ["cung", "bệnh", "súng", "xuống"], "correctIndex": 3, "level": 18, "id": 883},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ui'?", "options": ["xinh", "súng", "bụi", "kính"], "correctIndex": 2, "level": 18, "id": 884},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'thấp'?", "options": ["cao", "vui", "béo", "đen"], "correctIndex": 0, "level": 18, "id": 885},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'gầy'?", "options": ["trẻ", "ngày", "gần", "béo"], "correctIndex": 3, "level": 18, "id": 886},
    {"subject": "Tiếng Anh", "question": "'Bàn tay' tiếng Anh là gì?", "options": ["Mouth", "Ear", "Leg", "Hand"], "correctIndex": 3, "level": 18, "id": 887},
    {"subject": "Tiếng Anh", "question": "Số 14 tiếng Anh là gì?", "options": ["Fifteen", "Fourteen", "Thirteen", "Eleven"], "correctIndex": 1, "level": 18, "id": 888},
    {"subject": "Tiếng Anh", "question": "'Fourteen' là số mấy?", "options": ["12", "13", "14", "11"], "correctIndex": 2, "level": 18, "id": 889},
    {"subject": "Tiếng Anh", "question": "'Eye' nghĩa là gì?", "options": ["Cánh tay", "Tai", "Mắt", "Bàn chân"], "correctIndex": 2, "level": 18, "id": 890},
    {"subject": "Tiếng Anh", "question": "'Tai' tiếng Anh là gì?", "options": ["Eye", "Mouth", "Tooth", "Ear"], "correctIndex": 3, "level": 18, "id": 891},
    {"subject": "Tiếng Anh", "question": "'Răng' tiếng Anh là gì?", "options": ["Leg", "Ear", "Tooth", "Foot"], "correctIndex": 2, "level": 18, "id": 892},
    {"subject": "Tiếng Anh", "question": "'Ear' nghĩa là gì?", "options": ["Chân", "Tai", "Bàn chân", "Răng"], "correctIndex": 1, "level": 18, "id": 893},
    {"subject": "Tiếng Anh", "question": "'Chân' tiếng Anh là gì?", "options": ["Hand", "Mouth", "Eye", "Leg"], "correctIndex": 3, "level": 18, "id": 894},
    {"subject": "Tiếng Anh", "question": "Số 18 tiếng Anh là gì?", "options": ["Sixteen", "Fifteen", "Seventeen", "Eighteen"], "correctIndex": 3, "level": 18, "id": 895},
    {"subject": "Tiếng Anh", "question": "Số 15 tiếng Anh là gì?", "options": ["Sixteen", "Fourteen", "Fifteen", "Twelve"], "correctIndex": 2, "level": 18, "id": 896},
    {"subject": "Tiếng Anh", "question": "Số 16 tiếng Anh là gì?", "options": ["Sixteen", "Nineteen", "Eighteen", "Seventeen"], "correctIndex": 0, "level": 18, "id": 897},
    {"subject": "Tiếng Anh", "question": "💪 tiếng Anh là gì?", "options": ["Hand", "Arm", "Ear", "Nose"], "correctIndex": 1, "level": 18, "id": 898},
    {"subject": "Tiếng Anh", "question": "'Mắt' tiếng Anh là gì?", "options": ["Leg", "Eye", "Mouth", "Nose"], "correctIndex": 1, "level": 18, "id": 899},
    {"subject": "Tiếng Anh", "question": "'Foot' nghĩa là gì?", "options": ["Mũi", "Cánh tay", "Bàn chân", "Mắt"], "correctIndex": 2, "level": 18, "id": 900},
    {"id": 901, "level": 19, "subject": "Toán", "question": "14 + 1 = ?", "options": ["15", "13", "17", "18"], "correctIndex": 0},
    {"id": 902, "level": 19, "subject": "Toán", "question": "14 − 2 = ?", "options": ["15", "13", "10", "12"], "correctIndex": 3},
    {"id": 903, "level": 19, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'uôn'?", "options": ["mơn", "muốn", "màn", "mến"], "correctIndex": 1},
    {"id": 904, "level": 19, "subject": "Tiếng Việt", "question": "Từ nào chỉ đồ dùng trong nhà?", "options": ["cái nồi", "đám mây", "con bò", "cây tre"], "correctIndex": 0},
    {"id": 905, "level": 19, "subject": "Tiếng Anh", "question": "'Ball' là gì?", "options": ["Quả bóng", "Búp bê", "Cái bàn", "Cái mũ"], "correctIndex": 0},
    {"subject": "Toán", "question": "18 − 8 = ?", "options": ["9", "12", "10", "8"], "correctIndex": 2, "level": 19, "id": 906},
    {"subject": "Toán", "question": "Có 6 chiếc ô tô 🚗, thêm 3 chiếc ô tô nữa. Có tất cả mấy chiếc ô tô?", "options": ["11", "9", "10", "7"], "correctIndex": 1, "level": 19, "id": 907},
    {"subject": "Toán", "question": "7 + 6 = ?", "options": ["12", "13", "11", "14"], "correctIndex": 1, "level": 19, "id": 908},
    {"subject": "Toán", "question": "Có 5 bông hoa 🌸, thêm 5 bông hoa nữa. Có tất cả mấy bông hoa?", "options": ["10", "9", "8", "12"], "correctIndex": 0, "level": 19, "id": 909},
    {"subject": "Toán", "question": "10 − 9 = ?", "options": ["2", "3", "1", "0"], "correctIndex": 2, "level": 19, "id": 910},
    {"subject": "Toán", "question": "13 + 5 = ?", "options": ["19", "18", "16", "17"], "correctIndex": 1, "level": 19, "id": 911},
    {"subject": "Toán", "question": "6 + 12 = ?", "options": ["20", "18", "17", "19"], "correctIndex": 1, "level": 19, "id": 912},
    {"subject": "Toán", "question": "Điền dấu: 3 … 4", "options": [">", "+", "=", "<"], "correctIndex": 3, "level": 19, "id": 913},
    {"subject": "Toán", "question": "Số gồm 4 chục và 6 đơn vị là:", "options": ["46", "56", "64", "10"], "correctIndex": 0, "level": 19, "id": 914},
    {"subject": "Toán", "question": "🧁🧁🧁🧁 Có mấy cái bánh?", "options": ["6", "2", "4", "5"], "correctIndex": 2, "level": 19, "id": 915},
    {"subject": "Toán", "question": "Điền dấu: 7 … 18", "options": ["<", ">", "=", "+"], "correctIndex": 0, "level": 19, "id": 916},
    {"subject": "Toán", "question": "10 + 5 = ?", "options": ["13", "16", "14", "15"], "correctIndex": 3, "level": 19, "id": 917},
    {"subject": "Toán", "question": "6 + 14 = ?", "options": ["18", "19", "22", "20"], "correctIndex": 3, "level": 19, "id": 918},
    {"subject": "Toán", "question": "Kim ngắn chỉ số 4, kim dài chỉ số 12. Đồng hồ chỉ mấy giờ?", "options": ["12 giờ", "5 giờ", "4 giờ", "3 giờ"], "correctIndex": 2, "level": 19, "id": 919},
    {"subject": "Toán", "question": "Có 3 cái kẹo 🍬, cho bạn 1 cái kẹo. Còn mấy cái kẹo?", "options": ["3", "0", "4", "2"], "correctIndex": 3, "level": 19, "id": 920},
    {"subject": "Toán", "question": "18 − 10 = ?", "options": ["9", "8", "6", "10"], "correctIndex": 1, "level": 19, "id": 921},
    {"subject": "Toán", "question": "🧁🧁 Có mấy cái bánh?", "options": ["3", "2", "1", "4"], "correctIndex": 1, "level": 19, "id": 922},
    {"subject": "Toán", "question": "2 + 3 = ?", "options": ["5", "3", "7", "4"], "correctIndex": 0, "level": 19, "id": 923},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ơn'?", "options": ["lợn", "mứt", "tiên", "chanh"], "correctIndex": 0, "level": 19, "id": 924},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'eo'?", "options": ["lươn", "hạt", "mèo", "gương"], "correctIndex": 2, "level": 19, "id": 925},
    {"subject": "Tiếng Việt", "question": "Tiếng 'khoang' có vần gì?", "options": ["em", "au", "oang", "oa"], "correctIndex": 2, "level": 19, "id": 926},
    {"subject": "Tiếng Việt", "question": "Tiếng 'sách' có vần gì?", "options": ["oi", "ôt", "ang", "ach"], "correctIndex": 3, "level": 19, "id": 927},
    {"subject": "Tiếng Việt", "question": "Tiếng 'măng' có vần gì?", "options": ["eo", "ăng", "ao", "ach"], "correctIndex": 1, "level": 19, "id": 928},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ăng'?", "options": ["bệnh", "buồn", "trăng", "dưa"], "correctIndex": 2, "level": 19, "id": 929},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'sáng'?", "options": ["trắng", "trên", "tối", "ngày"], "correctIndex": 2, "level": 19, "id": 930},
    {"subject": "Tiếng Việt", "question": "Tiếng 'hoàng' có vần gì?", "options": ["inh", "oan", "oang", "ưu"], "correctIndex": 2, "level": 19, "id": 931},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'ngắn'?", "options": ["dài", "trẻ", "cười", "đen"], "correctIndex": 0, "level": 19, "id": 932},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'già'?", "options": ["đầy", "nhanh", "cười", "trẻ"], "correctIndex": 3, "level": 19, "id": 933},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'tối'?", "options": ["đêm", "sáng", "dài", "đầy"], "correctIndex": 1, "level": 19, "id": 934},
    {"subject": "Tiếng Việt", "question": "Tiếng 'lưng' có vần gì?", "options": ["uyên", "ang", "ưng", "inh"], "correctIndex": 2, "level": 19, "id": 935},
    {"subject": "Tiếng Việt", "question": "Tiếng 'muối' có vần gì?", "options": ["uôi", "au", "an", "ăng"], "correctIndex": 0, "level": 19, "id": 936},
    {"subject": "Tiếng Anh", "question": "'Eleven' là số mấy?", "options": ["9", "13", "12", "11"], "correctIndex": 3, "level": 19, "id": 937},
    {"subject": "Tiếng Anh", "question": "'Mũi' tiếng Anh là gì?", "options": ["Tooth", "Nose", "Mouth", "Arm"], "correctIndex": 1, "level": 19, "id": 938},
    {"subject": "Tiếng Anh", "question": "'Twelve' là số mấy?", "options": ["12", "10", "13", "14"], "correctIndex": 0, "level": 19, "id": 939},
    {"subject": "Tiếng Anh", "question": "'Mouth' nghĩa là gì?", "options": ["Cánh tay", "Bàn tay", "Miệng", "Mắt"], "correctIndex": 2, "level": 19, "id": 940},
    {"subject": "Tiếng Anh", "question": "'Ô tô' tiếng Anh là gì?", "options": ["Boat", "Train", "Car", "Yo-yo"], "correctIndex": 2, "level": 19, "id": 941},
    {"subject": "Tiếng Anh", "question": "🦵 tiếng Anh là gì?", "options": ["Mouth", "Nose", "Leg", "Hand"], "correctIndex": 2, "level": 19, "id": 942},
    {"subject": "Tiếng Anh", "question": "'Car' nghĩa là gì?", "options": ["Con thuyền", "Tàu hỏa", "Ô tô", "Con diều"], "correctIndex": 2, "level": 19, "id": 943},
    {"subject": "Tiếng Anh", "question": "🍊 tiếng Anh là gì?", "options": ["Grapes", "Milk", "Orange", "Cookie"], "correctIndex": 2, "level": 19, "id": 944},
    {"subject": "Tiếng Anh", "question": "Số 8 tiếng Anh là gì?", "options": ["Seven", "Six", "Nine", "Eight"], "correctIndex": 3, "level": 19, "id": 945},
    {"subject": "Tiếng Anh", "question": "'Brother' nghĩa là gì?", "options": ["Anh/em trai", "Em bé", "Mẹ", "Bố"], "correctIndex": 0, "level": 19, "id": 946},
    {"subject": "Tiếng Anh", "question": "🦆 tiếng Anh là gì?", "options": ["Frog", "Pig", "Cow", "Duck"], "correctIndex": 3, "level": 19, "id": 947},
    {"subject": "Tiếng Anh", "question": "'Màu đỏ' tiếng Anh là gì?", "options": ["Pink", "Red", "Orange", "Purple"], "correctIndex": 1, "level": 19, "id": 948},
    {"subject": "Tiếng Anh", "question": "'Goodbye' nghĩa là gì?", "options": ["Xin chào", "Vâng / Có", "Chào buổi sáng", "Tạm biệt"], "correctIndex": 3, "level": 19, "id": 949},
    {"subject": "Tiếng Anh", "question": "Số 1 tiếng Anh là gì?", "options": ["Two", "Four", "One", "Three"], "correctIndex": 2, "level": 19, "id": 950},
    {"id": 951, "level": 20, "subject": "Toán", "question": "12 + 3 = ?", "options": ["12", "15", "16", "17"], "correctIndex": 1},
    {"id": 952, "level": 20, "subject": "Toán", "question": "17 − 7 = ?", "options": ["12", "13", "11", "10"], "correctIndex": 3},
    {"id": 953, "level": 20, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'êt'?", "options": ["tốt", "tết", "tít", "tất"], "correctIndex": 1},
    {"id": 954, "level": 20, "subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["côn kiến", "kon kiến", "con ciến", "con kiến"], "correctIndex": 3},
    {"id": 955, "level": 20, "subject": "Tiếng Anh", "question": "'Book' là gì?", "options": ["Quyển sách", "Cái ghế", "Cái cặp", "Cái bút"], "correctIndex": 0},
    {"subject": "Toán", "question": "Có 4 bông hoa 🌸, thêm 2 bông hoa nữa. Có tất cả mấy bông hoa?", "options": ["4", "5", "7", "6"], "correctIndex": 3, "level": 20, "id": 956},
    {"subject": "Toán", "question": "Số liền sau của 17 là:", "options": ["17", "19", "18", "16"], "correctIndex": 2, "level": 20, "id": 957},
    {"subject": "Toán", "question": "🚌🚌🚌🚌🚌🚌 Có mấy xe buýt?", "options": ["4", "5", "8", "6"], "correctIndex": 3, "level": 20, "id": 958},
    {"subject": "Toán", "question": "15 − 7 = ?", "options": ["7", "6", "10", "8"], "correctIndex": 3, "level": 20, "id": 959},
    {"subject": "Toán", "question": "19 + 1 = ?", "options": ["20", "21", "19", "18"], "correctIndex": 0, "level": 20, "id": 960},
    {"subject": "Toán", "question": "Số liền trước của 2 là:", "options": ["0", "1", "3", "2"], "correctIndex": 1, "level": 20, "id": 961},
    {"subject": "Toán", "question": "Số gồm 1 chục và 9 đơn vị là:", "options": ["10", "91", "29", "19"], "correctIndex": 3, "level": 20, "id": 962},
    {"subject": "Toán", "question": "Có 4 quả táo 🍎, thêm 3 quả táo nữa. Có tất cả mấy quả táo?", "options": ["7", "5", "6", "8"], "correctIndex": 0, "level": 20, "id": 963},
    {"subject": "Toán", "question": "Số liền trước của 12 là:", "options": ["11", "12", "10", "13"], "correctIndex": 0, "level": 20, "id": 964},
    {"subject": "Toán", "question": "11 + 6 = ?", "options": ["19", "15", "18", "17"], "correctIndex": 3, "level": 20, "id": 965},
    {"subject": "Toán", "question": "17 − 16 = ?", "options": ["1", "3", "2", "0"], "correctIndex": 0, "level": 20, "id": 966},
    {"subject": "Toán", "question": "Điền dấu: 17 … 11", "options": ["+", ">", "<", "="], "correctIndex": 1, "level": 20, "id": 967},
    {"subject": "Toán", "question": "🍌🍌🍌🍌🍌🍌🍌🍌🍌🍌 Có mấy quả chuối?", "options": ["10", "12", "9", "11"], "correctIndex": 0, "level": 20, "id": 968},
    {"subject": "Toán", "question": "18 − 13 = ?", "options": ["6", "3", "5", "7"], "correctIndex": 2, "level": 20, "id": 969},
    {"subject": "Toán", "question": "17 + 2 = ?", "options": ["20", "19", "18", "21"], "correctIndex": 1, "level": 20, "id": 970},
    {"subject": "Toán", "question": "12 + 4 = ?", "options": ["18", "17", "15", "16"], "correctIndex": 3, "level": 20, "id": 971},
    {"subject": "Toán", "question": "⚽⚽⚽⚽⚽⚽⚽⚽⚽ Có mấy quả bóng?", "options": ["9", "8", "7", "10"], "correctIndex": 0, "level": 20, "id": 972},
    {"subject": "Toán", "question": "Điền dấu: 1 … 15", "options": ["=", ">", "<", "+"], "correctIndex": 2, "level": 20, "id": 973},
    {"subject": "Tiếng Việt", "question": "Tiếng 'biển' có vần gì?", "options": ["iên", "ông", "uôi", "oa"], "correctIndex": 0, "level": 20, "id": 974},
    {"subject": "Tiếng Việt", "question": "Tiếng 'tươi' có vần gì?", "options": ["ươi", "eo", "ao", "ưu"], "correctIndex": 0, "level": 20, "id": 975},
    {"subject": "Tiếng Việt", "question": "Tiếng 'ngoan' có vần gì?", "options": ["oan", "am", "ơn", "ơm"], "correctIndex": 0, "level": 20, "id": 976},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'trẻ'?", "options": ["cũ", "nhỏ", "to", "già"], "correctIndex": 3, "level": 20, "id": 977},
    {"subject": "Tiếng Việt", "question": "Tiếng 'sen' có vần gì?", "options": ["ơi", "en", "ach", "au"], "correctIndex": 1, "level": 20, "id": 978},
    {"subject": "Tiếng Việt", "question": "Tiếng 'phở' bắt đầu bằng chữ nào?", "options": ["gh", "r", "ph", "m"], "correctIndex": 2, "level": 20, "id": 979},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'âng'?", "options": ["tám", "chuồn", "voi", "tầng"], "correctIndex": 3, "level": 20, "id": 980},
    {"subject": "Tiếng Việt", "question": "Tiếng 'sông' có vần gì?", "options": ["ông", "ơn", "on", "ôt"], "correctIndex": 0, "level": 20, "id": 981},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'khóc'?", "options": ["gần", "to", "ngày", "cười"], "correctIndex": 3, "level": 20, "id": 982},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ương'?", "options": ["tem", "măng", "gương", "vàng"], "correctIndex": 2, "level": 20, "id": 983},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'dài'?", "options": ["cao", "cũ", "ngắn", "to"], "correctIndex": 2, "level": 20, "id": 984},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ang'?", "options": ["đường", "xòe", "lan", "bàng"], "correctIndex": 3, "level": 20, "id": 985},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'y'?", "options": ["ơ", "b", "y", "l"], "correctIndex": 2, "level": 20, "id": 986},
    {"subject": "Tiếng Anh", "question": "'Goodbye' nghĩa là gì?", "options": ["Hẹn gặp lại", "Xin lỗi", "Tạm biệt", "Chào buổi sáng"], "correctIndex": 2, "level": 20, "id": 987},
    {"subject": "Tiếng Anh", "question": "'Yes' nghĩa là gì?", "options": ["Xin lỗi", "Vâng / Có", "Không", "Cảm ơn"], "correctIndex": 1, "level": 20, "id": 988},
    {"subject": "Tiếng Anh", "question": "'Con lợn' tiếng Anh là gì?", "options": ["Horse", "Bird", "Pig", "Snake"], "correctIndex": 2, "level": 20, "id": 989},
    {"subject": "Tiếng Anh", "question": "'Quả xoài' tiếng Anh là gì?", "options": ["Bread", "Watermelon", "Mango", "Orange"], "correctIndex": 2, "level": 20, "id": 990},
    {"subject": "Tiếng Anh", "question": "'Mũi' tiếng Anh là gì?", "options": ["Foot", "Nose", "Tooth", "Mouth"], "correctIndex": 1, "level": 20, "id": 991},
    {"subject": "Tiếng Anh", "question": "🍞 tiếng Anh là gì?", "options": ["Ice cream", "Bread", "Juice", "Milk"], "correctIndex": 1, "level": 20, "id": 992},
    {"subject": "Tiếng Anh", "question": "Số 2 tiếng Anh là gì?", "options": ["Four", "Two", "Five", "Three"], "correctIndex": 1, "level": 20, "id": 993},
    {"subject": "Tiếng Anh", "question": "👵 tiếng Anh là gì?", "options": ["Father", "Grandfather", "Grandmother", "Sister"], "correctIndex": 2, "level": 20, "id": 994},
    {"subject": "Tiếng Anh", "question": "'Father' nghĩa là gì?", "options": ["Bà", "Mẹ", "Bố", "Ông"], "correctIndex": 2, "level": 20, "id": 995},
    {"subject": "Tiếng Anh", "question": "'Quả cam' tiếng Anh là gì?", "options": ["Watermelon", "Orange", "Grapes", "Apple"], "correctIndex": 1, "level": 20, "id": 996},
    {"subject": "Tiếng Anh", "question": "'Em bé' tiếng Anh là gì?", "options": ["Brother", "Baby", "Mother", "Grandfather"], "correctIndex": 1, "level": 20, "id": 997},
    {"subject": "Tiếng Anh", "question": "'Xe đạp' tiếng Anh là gì?", "options": ["Train", "Kite", "Bike", "Teddy bear"], "correctIndex": 2, "level": 20, "id": 998},
    {"subject": "Tiếng Anh", "question": "'Màu cam' tiếng Anh là gì?", "options": ["Orange", "Brown", "Blue", "Purple"], "correctIndex": 0, "level": 20, "id": 999},
    {"subject": "Tiếng Anh", "question": "🪁 tiếng Anh là gì?", "options": ["Kite", "Car", "Train", "Boat"], "correctIndex": 0, "level": 20, "id": 1000},
    {"id": 1001, "level": 21, "subject": "Toán", "question": "Số gồm 6 chục và 9 đơn vị là:", "options": ["96", "15", "69", "79"], "correctIndex": 2},
    {"id": 1002, "level": 21, "subject": "Toán", "question": "30 + 20 = ?", "options": ["49", "51", "60", "50"], "correctIndex": 3},
    {"id": 1003, "level": 21, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ach'?", "options": ["sục", "sếch", "sóc", "sách"], "correctIndex": 3},
    {"id": 1004, "level": 21, "subject": "Tiếng Việt", "question": "Điền từ: Mẹ ... cơm.", "options": ["bay", "nấu", "đá", "bơi"], "correctIndex": 1},
    {"id": 1005, "level": 21, "subject": "Tiếng Anh", "question": "'Pencil' là gì?", "options": ["Quyển vở", "Bút chì", "Cục tẩy", "Thước kẻ"], "correctIndex": 1},
    {"subject": "Toán", "question": "Hôm nay là Chủ nhật. Ngày mai là thứ mấy?", "options": ["Thứ Bảy", "Thứ Ba", "Thứ Hai", "Thứ Tư"], "correctIndex": 2, "level": 21, "id": 1006},
    {"subject": "Toán", "question": "Kim ngắn chỉ số 3, kim dài chỉ số 12. Đồng hồ chỉ mấy giờ?", "options": ["12 giờ", "3 giờ", "4 giờ", "2 giờ"], "correctIndex": 1, "level": 21, "id": 1007},
    {"subject": "Toán", "question": "Điền dấu: 10 … 3", "options": [">", "=", "<", "+"], "correctIndex": 0, "level": 21, "id": 1008},
    {"subject": "Toán", "question": "37 − 4 = ?", "options": ["41", "28", "33", "31"], "correctIndex": 2, "level": 21, "id": 1009},
    {"subject": "Toán", "question": "Số liền sau của 40 là:", "options": ["40", "39", "42", "41"], "correctIndex": 3, "level": 21, "id": 1010},
    {"subject": "Toán", "question": "Điền dấu: 0 … 34", "options": [">", "=", "+", "<"], "correctIndex": 3, "level": 21, "id": 1011},
    {"subject": "Toán", "question": "Hôm nay là Thứ Năm. Ngày mai là thứ mấy?", "options": ["Thứ Tư", "Chủ nhật", "Thứ Sáu", "Thứ Bảy"], "correctIndex": 2, "level": 21, "id": 1012},
    {"subject": "Toán", "question": "Điền dấu: 32 … 35", "options": ["+", "=", ">", "<"], "correctIndex": 3, "level": 21, "id": 1013},
    {"subject": "Toán", "question": "99 − 26 = ?", "options": ["73", "81", "77", "68"], "correctIndex": 0, "level": 21, "id": 1014},
    {"subject": "Toán", "question": "22 + 12 = ?", "options": ["28", "34", "36", "39"], "correctIndex": 1, "level": 21, "id": 1015},
    {"subject": "Toán", "question": "Số liền sau của 37 là:", "options": ["36", "37", "38", "39"], "correctIndex": 2, "level": 21, "id": 1016},
    {"subject": "Toán", "question": "Số liền trước của 34 là:", "options": ["34", "35", "33", "32"], "correctIndex": 2, "level": 21, "id": 1017},
    {"subject": "Toán", "question": "Kim ngắn chỉ số 10, kim dài chỉ số 12. Đồng hồ chỉ mấy giờ?", "options": ["11 giờ", "10 giờ", "9 giờ", "12 giờ"], "correctIndex": 1, "level": 21, "id": 1018},
    {"subject": "Toán", "question": "🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈 Có mấy quả bóng bay?", "options": ["9", "10", "8", "11"], "correctIndex": 1, "level": 21, "id": 1019},
    {"subject": "Toán", "question": "87 − 7 = ?", "options": ["74", "80", "78", "71"], "correctIndex": 1, "level": 21, "id": 1020},
    {"subject": "Toán", "question": "Điền dấu: 36 … 14", "options": ["+", ">", "=", "<"], "correctIndex": 1, "level": 21, "id": 1021},
    {"subject": "Toán", "question": "Có 3 quả bóng bay 🎈, thêm 3 quả bóng bay nữa. Có tất cả mấy quả bóng bay?", "options": ["7", "4", "6", "8"], "correctIndex": 2, "level": 21, "id": 1022},
    {"subject": "Toán", "question": "Hôm nay là Thứ Tư. Ngày mai là thứ mấy?", "options": ["Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Thứ Ba"], "correctIndex": 0, "level": 21, "id": 1023},
    {"subject": "Tiếng Việt", "question": "Câu 'Mẹ đi chợ.' có mấy tiếng?", "options": ["4", "5", "3", "2"], "correctIndex": 2, "level": 21, "id": 1024},
    {"subject": "Tiếng Việt", "question": "Câu 'Đàn vịt bơi trên ao.' có mấy tiếng?", "options": ["7", "3", "5", "4"], "correctIndex": 2, "level": 21, "id": 1025},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ơt'?", "options": ["lựu", "sơn", "ngoan", "ớt"], "correctIndex": 3, "level": 21, "id": 1026},
    {"subject": "Tiếng Việt", "question": "Câu 'Bé đi học.' có mấy tiếng?", "options": ["2", "3", "5", "4"], "correctIndex": 1, "level": 21, "id": 1027},
    {"subject": "Tiếng Việt", "question": "Câu 'Bố đọc báo.' có mấy tiếng?", "options": ["2", "5", "3", "4"], "correctIndex": 2, "level": 21, "id": 1028},
    {"subject": "Tiếng Việt", "question": "Câu 'Bé ngủ ngon.' có mấy tiếng?", "options": ["5", "2", "4", "3"], "correctIndex": 3, "level": 21, "id": 1029},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'vui'?", "options": ["cao", "gần", "buồn", "to"], "correctIndex": 2, "level": 21, "id": 1030},
    {"subject": "Tiếng Việt", "question": "Tiếng 'mứt' có vần gì?", "options": ["ươn", "iên", "inh", "ưt"], "correctIndex": 3, "level": 21, "id": 1031},
    {"subject": "Tiếng Việt", "question": "Câu 'Em tưới cây cho mẹ.' có mấy tiếng?", "options": ["5", "3", "4", "6"], "correctIndex": 0, "level": 21, "id": 1032},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ưu'?", "options": ["cừu", "bàng", "hoàng", "khoang"], "correctIndex": 0, "level": 21, "id": 1033},
    {"subject": "Tiếng Việt", "question": "Tiếng 'đường' có vần gì?", "options": ["êm", "au", "ương", "am"], "correctIndex": 2, "level": 21, "id": 1034},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'ư'?", "options": ["u", "ă", "ư", "c"], "correctIndex": 2, "level": 21, "id": 1035},
    {"subject": "Tiếng Việt", "question": "Tiếng 'lợn' có vần gì?", "options": ["ao", "on", "ơn", "ôi"], "correctIndex": 2, "level": 21, "id": 1036},
    {"subject": "Tiếng Anh", "question": "'Cái thước' tiếng Anh là gì?", "options": ["Pencil", "Ruler", "School bag", "Pen"], "correctIndex": 1, "level": 21, "id": 1037},
    {"subject": "Tiếng Anh", "question": "'Bút sáp màu' tiếng Anh là gì?", "options": ["Book", "Crayon", "Eraser", "Ruler"], "correctIndex": 1, "level": 21, "id": 1038},
    {"subject": "Tiếng Anh", "question": "'Cặp sách' tiếng Anh là gì?", "options": ["Crayon", "Book", "Pencil", "School bag"], "correctIndex": 3, "level": 21, "id": 1039},
    {"subject": "Tiếng Anh", "question": "'Cái kéo' tiếng Anh là gì?", "options": ["Pen", "Book", "Crayon", "Scissors"], "correctIndex": 3, "level": 21, "id": 1040},
    {"subject": "Tiếng Anh", "question": "'Bút mực' tiếng Anh là gì?", "options": ["Pen", "Crayon", "Notebook", "Chair"], "correctIndex": 0, "level": 21, "id": 1041},
    {"subject": "Tiếng Anh", "question": "🎒 tiếng Anh là gì?", "options": ["Book", "School bag", "Crayon", "Scissors"], "correctIndex": 1, "level": 21, "id": 1042},
    {"subject": "Tiếng Anh", "question": "'Crayon' nghĩa là gì?", "options": ["Bút sáp màu", "Cái kéo", "Cục tẩy", "Bút chì"], "correctIndex": 0, "level": 21, "id": 1043},
    {"subject": "Tiếng Anh", "question": "'School bag' nghĩa là gì?", "options": ["Bút chì", "Cặp sách", "Cái kéo", "Quyển sách"], "correctIndex": 1, "level": 21, "id": 1044},
    {"subject": "Tiếng Anh", "question": "🖊️ tiếng Anh là gì?", "options": ["Pen", "Book", "Chair", "Notebook"], "correctIndex": 0, "level": 21, "id": 1045},
    {"subject": "Tiếng Anh", "question": "📘 tiếng Anh là gì?", "options": ["Book", "School bag", "Ruler", "Notebook"], "correctIndex": 0, "level": 21, "id": 1046},
    {"subject": "Tiếng Anh", "question": "'Notebook' nghĩa là gì?", "options": ["Cục tẩy", "Quyển vở", "Bút sáp màu", "Cặp sách"], "correctIndex": 1, "level": 21, "id": 1047},
    {"subject": "Tiếng Anh", "question": "'Pen' nghĩa là gì?", "options": ["Bút chì", "Bút mực", "Cái ghế", "Bút sáp màu"], "correctIndex": 1, "level": 21, "id": 1048},
    {"subject": "Tiếng Anh", "question": "'Ruler' nghĩa là gì?", "options": ["Cái kéo", "Cái thước", "Bút mực", "Cặp sách"], "correctIndex": 1, "level": 21, "id": 1049},
    {"subject": "Tiếng Anh", "question": "📏 tiếng Anh là gì?", "options": ["Ruler", "Pen", "Crayon", "Chair"], "correctIndex": 0, "level": 21, "id": 1050},
    {"id": 1051, "level": 22, "subject": "Toán", "question": "Số gồm 6 chục và 5 đơn vị là:", "options": ["56", "11", "65", "75"], "correctIndex": 2},
    {"id": 1052, "level": 22, "subject": "Toán", "question": "20 + 22 = ?", "options": ["52", "41", "43", "42"], "correctIndex": 3},
    {"id": 1053, "level": 22, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'iêng'?", "options": ["chuông", "chang", "chiêng", "chưng"], "correctIndex": 2},
    {"id": 1054, "level": 22, "subject": "Tiếng Việt", "question": "Từ nào chỉ người trong gia đình?", "options": ["ông bà", "cây bàng", "cái bàn", "con mèo"], "correctIndex": 0},
    {"id": 1055, "level": 22, "subject": "Tiếng Anh", "question": "'Mom' là ai?", "options": ["Anh", "Bà", "Bố", "Mẹ"], "correctIndex": 3},
    {"subject": "Toán", "question": "97 − 83 = ?", "options": ["15", "9", "14", "20"], "correctIndex": 2, "level": 22, "id": 1056},
    {"subject": "Toán", "question": "73 − 60 = ?", "options": ["18", "13", "4", "6"], "correctIndex": 1, "level": 22, "id": 1057},
    {"subject": "Toán", "question": "42 − 31 = ?", "options": ["3", "18", "11", "4"], "correctIndex": 2, "level": 22, "id": 1058},
    {"subject": "Toán", "question": "26 − 15 = ?", "options": ["5", "18", "8", "11"], "correctIndex": 3, "level": 22, "id": 1059},
    {"subject": "Toán", "question": "Hôm nay là Thứ Năm. Hôm qua là thứ mấy?", "options": ["Thứ Tư", "Thứ Bảy", "Thứ Hai", "Thứ Sáu"], "correctIndex": 0, "level": 22, "id": 1060},
    {"subject": "Toán", "question": "🧁🧁🧁🧁🧁🧁🧁🧁🧁🧁 Có mấy cái bánh?", "options": ["9", "12", "11", "10"], "correctIndex": 3, "level": 22, "id": 1061},
    {"subject": "Toán", "question": "Số liền sau của 26 là:", "options": ["28", "27", "25", "26"], "correctIndex": 1, "level": 22, "id": 1062},
    {"subject": "Toán", "question": "65 − 13 = ?", "options": ["47", "43", "42", "52"], "correctIndex": 3, "level": 22, "id": 1063},
    {"subject": "Toán", "question": "Có 2 cái kẹo 🍬, cho bạn 1 cái kẹo. Còn mấy cái kẹo?", "options": ["2", "0", "1", "3"], "correctIndex": 2, "level": 22, "id": 1064},
    {"subject": "Toán", "question": "62 − 30 = ?", "options": ["36", "38", "32", "25"], "correctIndex": 2, "level": 22, "id": 1065},
    {"subject": "Toán", "question": "57 − 43 = ?", "options": ["7", "4", "14", "11"], "correctIndex": 2, "level": 22, "id": 1066},
    {"subject": "Toán", "question": "Hôm nay là Thứ Hai. Ngày mai là thứ mấy?", "options": ["Thứ Năm", "Thứ Tư", "Thứ Ba", "Chủ nhật"], "correctIndex": 2, "level": 22, "id": 1067},
    {"subject": "Toán", "question": "🚗🚗🚗🚗 Có mấy chiếc ô tô?", "options": ["4", "5", "3", "6"], "correctIndex": 0, "level": 22, "id": 1068},
    {"subject": "Toán", "question": "🚌🚌🚌🚌🚌🚌🚌🚌 Có mấy xe buýt?", "options": ["6", "7", "8", "9"], "correctIndex": 2, "level": 22, "id": 1069},
    {"subject": "Toán", "question": "Hôm nay là Thứ Sáu. Ngày mai là thứ mấy?", "options": ["Thứ Năm", "Thứ Hai", "Chủ nhật", "Thứ Bảy"], "correctIndex": 3, "level": 22, "id": 1070},
    {"subject": "Toán", "question": "44 + 4 = ?", "options": ["55", "48", "38", "43"], "correctIndex": 1, "level": 22, "id": 1071},
    {"subject": "Toán", "question": "Điền dấu: 26 … 29", "options": ["=", "<", ">", "+"], "correctIndex": 1, "level": 22, "id": 1072},
    {"subject": "Toán", "question": "Có 4 quả bóng bay 🎈, thêm 7 quả bóng bay nữa. Có tất cả mấy quả bóng bay?", "options": ["9", "10", "11", "12"], "correctIndex": 2, "level": 22, "id": 1073},
    {"subject": "Tiếng Việt", "question": "Câu 'Cô giáo khen bé.' có mấy tiếng?", "options": ["2", "5", "4", "3"], "correctIndex": 2, "level": 22, "id": 1074},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'lạnh'?", "options": ["gần", "tối", "đầy", "nóng"], "correctIndex": 3, "level": 22, "id": 1075},
    {"subject": "Tiếng Việt", "question": "Câu 'Em yêu bố mẹ.' có mấy tiếng?", "options": ["3", "2", "4", "6"], "correctIndex": 2, "level": 22, "id": 1076},
    {"subject": "Tiếng Việt", "question": "Tiếng 'chào' có vần gì?", "options": ["ăng", "ơi", "im", "ao"], "correctIndex": 3, "level": 22, "id": 1077},
    {"subject": "Tiếng Việt", "question": "Câu 'Hà đi học sớm.' có mấy tiếng?", "options": ["2", "5", "4", "3"], "correctIndex": 2, "level": 22, "id": 1078},
    {"subject": "Tiếng Việt", "question": "Tiếng 'tem' có vần gì?", "options": ["em", "ươi", "ăng", "ach"], "correctIndex": 0, "level": 22, "id": 1079},
    {"subject": "Tiếng Việt", "question": "Câu 'Bé ăn quả na.' có mấy tiếng?", "options": ["4", "3", "2", "5"], "correctIndex": 0, "level": 22, "id": 1080},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'dưới'?", "options": ["mới", "trẻ", "trên", "gần"], "correctIndex": 2, "level": 22, "id": 1081},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'anh'?", "options": ["đường", "chanh", "hoàng", "đếm"], "correctIndex": 1, "level": 22, "id": 1082},
    {"subject": "Tiếng Việt", "question": "Câu 'Chú gà gáy sáng.' có mấy tiếng?", "options": ["5", "4", "6", "3"], "correctIndex": 1, "level": 22, "id": 1083},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'uôn'?", "options": ["chuồn", "ngoan", "vàng", "tem"], "correctIndex": 0, "level": 22, "id": 1084},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'uôn'?", "options": ["buồn", "lựu", "kính", "sen"], "correctIndex": 0, "level": 22, "id": 1085},
    {"subject": "Tiếng Việt", "question": "Câu 'Lan có quả bóng đỏ.' có mấy tiếng?", "options": ["4", "5", "7", "6"], "correctIndex": 1, "level": 22, "id": 1086},
    {"subject": "Tiếng Anh", "question": "📓 tiếng Anh là gì?", "options": ["Notebook", "Book", "Chair", "Pencil"], "correctIndex": 0, "level": 22, "id": 1087},
    {"subject": "Tiếng Anh", "question": "✂️ tiếng Anh là gì?", "options": ["Chair", "Pencil", "Notebook", "Scissors"], "correctIndex": 3, "level": 22, "id": 1088},
    {"subject": "Tiếng Anh", "question": "'Bút chì' tiếng Anh là gì?", "options": ["Pencil", "Book", "School bag", "Notebook"], "correctIndex": 0, "level": 22, "id": 1089},
    {"subject": "Tiếng Anh", "question": "'Pencil' nghĩa là gì?", "options": ["Bút chì", "Quyển vở", "Cái thước", "Cái ghế"], "correctIndex": 0, "level": 22, "id": 1090},
    {"subject": "Tiếng Anh", "question": "'Quyển vở' tiếng Anh là gì?", "options": ["Book", "School bag", "Ruler", "Notebook"], "correctIndex": 3, "level": 22, "id": 1091},
    {"subject": "Tiếng Anh", "question": "'Scissors' nghĩa là gì?", "options": ["Cặp sách", "Cục tẩy", "Cái kéo", "Bút mực"], "correctIndex": 2, "level": 22, "id": 1092},
    {"subject": "Tiếng Anh", "question": "🖍️ tiếng Anh là gì?", "options": ["Ruler", "Pencil", "School bag", "Crayon"], "correctIndex": 3, "level": 22, "id": 1093},
    {"subject": "Tiếng Anh", "question": "🪑 tiếng Anh là gì?", "options": ["Pencil", "Chair", "Pen", "School bag"], "correctIndex": 1, "level": 22, "id": 1094},
    {"subject": "Tiếng Anh", "question": "'Book' nghĩa là gì?", "options": ["Cái thước", "Bút chì", "Quyển sách", "Cái ghế"], "correctIndex": 2, "level": 22, "id": 1095},
    {"subject": "Tiếng Anh", "question": "'Eraser' nghĩa là gì?", "options": ["Bút mực", "Bút chì", "Cục tẩy", "Quyển sách"], "correctIndex": 2, "level": 22, "id": 1096},
    {"subject": "Tiếng Anh", "question": "✏️ tiếng Anh là gì?", "options": ["Eraser", "School bag", "Notebook", "Pencil"], "correctIndex": 3, "level": 22, "id": 1097},
    {"subject": "Tiếng Anh", "question": "'Cái ghế' tiếng Anh là gì?", "options": ["Book", "Chair", "Eraser", "Crayon"], "correctIndex": 1, "level": 22, "id": 1098},
    {"subject": "Tiếng Anh", "question": "Số 19 tiếng Anh là gì?", "options": ["Eighteen", "Twenty", "Seventeen", "Nineteen"], "correctIndex": 3, "level": 22, "id": 1099},
    {"subject": "Tiếng Anh", "question": "'Quyển sách' tiếng Anh là gì?", "options": ["Pen", "Book", "Chair", "Ruler"], "correctIndex": 1, "level": 22, "id": 1100},
    {"id": 1101, "level": 23, "subject": "Toán", "question": "Số gồm 5 chục và 8 đơn vị là:", "options": ["58", "68", "85", "13"], "correctIndex": 0},
    {"id": 1102, "level": 23, "subject": "Toán", "question": "50 + 32 = ?", "options": ["83", "92", "82", "81"], "correctIndex": 2},
    {"id": 1103, "level": 23, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'oa'?", "options": ["hai", "hồ", "hè", "hoa"], "correctIndex": 3},
    {"id": 1104, "level": 23, "subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'to'?", "options": ["lớn", "nhỏ", "dài", "cao"], "correctIndex": 1},
    {"id": 1105, "level": 23, "subject": "Tiếng Anh", "question": "'Dad' là ai?", "options": ["Bố", "Em", "Mẹ", "Ông"], "correctIndex": 0},
    {"subject": "Toán", "question": "37 − 2 = ?", "options": ["35", "36", "38", "25"], "correctIndex": 0, "level": 23, "id": 1106},
    {"subject": "Toán", "question": "Điền dấu: 36 … 0", "options": ["<", "+", "=", ">"], "correctIndex": 3, "level": 23, "id": 1107},
    {"subject": "Toán", "question": "🌸🌸🌸🌸🌸 Có mấy bông hoa?", "options": ["5", "4", "3", "7"], "correctIndex": 0, "level": 23, "id": 1108},
    {"subject": "Toán", "question": "Số liền trước của 40 là:", "options": ["38", "41", "39", "40"], "correctIndex": 2, "level": 23, "id": 1109},
    {"subject": "Toán", "question": "Có 5 bông hoa 🌸, cho bạn 4 bông hoa. Còn mấy bông hoa?", "options": ["1", "2", "0", "3"], "correctIndex": 0, "level": 23, "id": 1110},
    {"subject": "Toán", "question": "Kim ngắn chỉ số 6, kim dài chỉ số 12. Đồng hồ chỉ mấy giờ?", "options": ["7 giờ", "12 giờ", "5 giờ", "6 giờ"], "correctIndex": 3, "level": 23, "id": 1111},
    {"subject": "Toán", "question": "Hôm nay là Chủ nhật. Hôm qua là thứ mấy?", "options": ["Thứ Bảy", "Thứ Năm", "Thứ Hai", "Thứ Ba"], "correctIndex": 0, "level": 23, "id": 1112},
    {"subject": "Toán", "question": "30 + 13 = ?", "options": ["41", "51", "43", "33"], "correctIndex": 2, "level": 23, "id": 1113},
    {"subject": "Toán", "question": "Có 5 chiếc ô tô 🚗, thêm 9 chiếc ô tô nữa. Có tất cả mấy chiếc ô tô?", "options": ["16", "13", "14", "15"], "correctIndex": 2, "level": 23, "id": 1114},
    {"subject": "Toán", "question": "Số liền sau của 14 là:", "options": ["13", "14", "16", "15"], "correctIndex": 3, "level": 23, "id": 1115},
    {"subject": "Toán", "question": "Có 2 quả bóng bay 🎈, thêm 2 quả bóng bay nữa. Có tất cả mấy quả bóng bay?", "options": ["6", "4", "2", "5"], "correctIndex": 1, "level": 23, "id": 1116},
    {"subject": "Toán", "question": "51 − 21 = ?", "options": ["29", "34", "40", "30"], "correctIndex": 3, "level": 23, "id": 1117},
    {"subject": "Toán", "question": "Điền dấu: 42 … 42", "options": [">", "+", "<", "="], "correctIndex": 3, "level": 23, "id": 1118},
    {"subject": "Toán", "question": "Có 6 bông hoa 🌸, cho bạn 1 bông hoa. Còn mấy bông hoa?", "options": ["7", "4", "5", "6"], "correctIndex": 2, "level": 23, "id": 1119},
    {"subject": "Toán", "question": "91 − 40 = ?", "options": ["53", "55", "51", "44"], "correctIndex": 2, "level": 23, "id": 1120},
    {"subject": "Toán", "question": "Kim ngắn chỉ số 8, kim dài chỉ số 12. Đồng hồ chỉ mấy giờ?", "options": ["9 giờ", "8 giờ", "12 giờ", "7 giờ"], "correctIndex": 1, "level": 23, "id": 1121},
    {"subject": "Toán", "question": "Hôm nay là Thứ Sáu. Hôm qua là thứ mấy?", "options": ["Thứ Năm", "Chủ nhật", "Thứ Bảy", "Thứ Ba"], "correctIndex": 0, "level": 23, "id": 1122},
    {"subject": "Toán", "question": "Điền dấu: 34 … 30", "options": ["<", "+", ">", "="], "correctIndex": 2, "level": 23, "id": 1123},
    {"subject": "Tiếng Việt", "question": "Tiếng 'mưa' có vần gì?", "options": ["ơt", "ươn", "ưa", "ung"], "correctIndex": 2, "level": 23, "id": 1124},
    {"subject": "Tiếng Việt", "question": "Tiếng 'chuối' có vần gì?", "options": ["ơi", "eo", "ăng", "uôi"], "correctIndex": 3, "level": 23, "id": 1125},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'oe'?", "options": ["xòe", "lưng", "tiên", "lan"], "correctIndex": 0, "level": 23, "id": 1126},
    {"subject": "Tiếng Việt", "question": "Tiếng 'lịch' có vần gì?", "options": ["iên", "au", "ich", "ang"], "correctIndex": 2, "level": 23, "id": 1127},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ao'?", "options": ["bệnh", "chào", "đèn", "hạt"], "correctIndex": 1, "level": 23, "id": 1128},
    {"subject": "Tiếng Việt", "question": "Câu 'Bà kể chuyện.' có mấy tiếng?", "options": ["5", "3", "2", "4"], "correctIndex": 1, "level": 23, "id": 1129},
    {"subject": "Tiếng Việt", "question": "Tiếng 'người' có vần gì?", "options": ["oan", "oi", "ôi", "ươi"], "correctIndex": 3, "level": 23, "id": 1130},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'iên'?", "options": ["chào", "tiên", "loa", "hút"], "correctIndex": 1, "level": 23, "id": 1131},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ơn'?", "options": ["rau", "buồn", "sơn", "dưa"], "correctIndex": 2, "level": 23, "id": 1132},
    {"subject": "Tiếng Việt", "question": "Tiếng 'chuyện' có vần gì?", "options": ["uyên", "ưa", "oa", "anh"], "correctIndex": 0, "level": 23, "id": 1133},
    {"subject": "Tiếng Việt", "question": "Tiếng 'cau' có vần gì?", "options": ["ưng", "au", "âng", "oe"], "correctIndex": 1, "level": 23, "id": 1134},
    {"subject": "Tiếng Việt", "question": "Câu 'Bé vẽ con mèo.' có mấy tiếng?", "options": ["6", "2", "3", "4"], "correctIndex": 3, "level": 23, "id": 1135},
    {"subject": "Tiếng Việt", "question": "Tiếng 'bút' có vần gì?", "options": ["at", "ut", "ui", "ương"], "correctIndex": 1, "level": 23, "id": 1136},
    {"subject": "Tiếng Anh", "question": "'Cục tẩy' tiếng Anh là gì?", "options": ["Pen", "Chair", "School bag", "Eraser"], "correctIndex": 3, "level": 23, "id": 1137},
    {"subject": "Tiếng Anh", "question": "'Chair' nghĩa là gì?", "options": ["Cục tẩy", "Cái ghế", "Bút chì", "Quyển sách"], "correctIndex": 1, "level": 23, "id": 1138},
    {"subject": "Tiếng Anh", "question": "Số 4 tiếng Anh là gì?", "options": ["Four", "Two", "One", "Three"], "correctIndex": 0, "level": 23, "id": 1139},
    {"subject": "Tiếng Anh", "question": "Số 5 tiếng Anh là gì?", "options": ["Two", "Three", "Five", "Six"], "correctIndex": 2, "level": 23, "id": 1140},
    {"subject": "Tiếng Anh", "question": "'Cánh tay' tiếng Anh là gì?", "options": ["Arm", "Mouth", "Ear", "Tooth"], "correctIndex": 0, "level": 23, "id": 1141},
    {"subject": "Tiếng Anh", "question": "'Hello' nghĩa là gì?", "options": ["Xin chào", "Tạm biệt", "Hẹn gặp lại", "Cảm ơn"], "correctIndex": 0, "level": 23, "id": 1142},
    {"subject": "Tiếng Anh", "question": "'Tooth' nghĩa là gì?", "options": ["Miệng", "Răng", "Mũi", "Chân"], "correctIndex": 1, "level": 23, "id": 1143},
    {"subject": "Tiếng Anh", "question": "'Cái ghế' tiếng Anh là gì?", "options": ["Chair", "Crayon", "Pencil", "School bag"], "correctIndex": 0, "level": 23, "id": 1144},
    {"subject": "Tiếng Anh", "question": "🍌 tiếng Anh là gì?", "options": ["Banana", "Cookie", "Orange", "Rice"], "correctIndex": 0, "level": 23, "id": 1145},
    {"subject": "Tiếng Anh", "question": "'Grandmother' nghĩa là gì?", "options": ["Bà", "Ông", "Mẹ", "Em bé"], "correctIndex": 0, "level": 23, "id": 1146},
    {"subject": "Tiếng Anh", "question": "✈️ tiếng Anh là gì?", "options": ["Ball", "Plane", "Bike", "Yo-yo"], "correctIndex": 1, "level": 23, "id": 1147},
    {"subject": "Tiếng Anh", "question": "'Kite' nghĩa là gì?", "options": ["Tàu hỏa", "Con diều", "Quả bóng", "Xe đạp"], "correctIndex": 1, "level": 23, "id": 1148},
    {"subject": "Tiếng Anh", "question": "🥛 tiếng Anh là gì?", "options": ["Milk", "Egg", "Apple", "Bread"], "correctIndex": 0, "level": 23, "id": 1149},
    {"subject": "Tiếng Anh", "question": "👃 tiếng Anh là gì?", "options": ["Ear", "Arm", "Nose", "Tooth"], "correctIndex": 2, "level": 23, "id": 1150},
    {"id": 1151, "level": 24, "subject": "Toán", "question": "Số gồm 2 chục và 9 đơn vị là:", "options": ["92", "11", "39", "29"], "correctIndex": 3},
    {"id": 1152, "level": 24, "subject": "Toán", "question": "41 + 30 = ?", "options": ["81", "70", "72", "71"], "correctIndex": 3},
    {"id": 1153, "level": 24, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'uyên'?", "options": ["thuyền", "thuần", "than", "thiên"], "correctIndex": 0},
    {"id": 1154, "level": 24, "subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'nóng'?", "options": ["nắng", "oi", "ấm", "lạnh"], "correctIndex": 3},
    {"id": 1155, "level": 24, "subject": "Tiếng Anh", "question": "'Thank you' nghĩa là gì?", "options": ["Cảm ơn", "Xin lỗi", "Xin chào", "Tạm biệt"], "correctIndex": 0},
    {"subject": "Toán", "question": "83 − 42 = ?", "options": ["51", "46", "37", "41"], "correctIndex": 3, "level": 24, "id": 1156},
    {"subject": "Toán", "question": "Có 7 bông hoa 🌸, cho bạn 3 bông hoa. Còn mấy bông hoa?", "options": ["4", "3", "6", "5"], "correctIndex": 0, "level": 24, "id": 1157},
    {"subject": "Toán", "question": "🌸🌸🌸🌸🌸🌸🌸🌸🌸🌸 Có mấy bông hoa?", "options": ["10", "9", "11", "8"], "correctIndex": 0, "level": 24, "id": 1158},
    {"subject": "Toán", "question": "Hôm nay là Thứ Ba. Hôm qua là thứ mấy?", "options": ["Thứ Hai", "Thứ Bảy", "Thứ Năm", "Thứ Tư"], "correctIndex": 0, "level": 24, "id": 1159},
    {"subject": "Toán", "question": "Hôm nay là Thứ Bảy. Hôm qua là thứ mấy?", "options": ["Thứ Hai", "Chủ nhật", "Thứ Tư", "Thứ Sáu"], "correctIndex": 3, "level": 24, "id": 1160},
    {"subject": "Toán", "question": "29 − 1 = ?", "options": ["28", "29", "32", "30"], "correctIndex": 0, "level": 24, "id": 1161},
    {"subject": "Toán", "question": "Điền dấu: 29 … 44", "options": [">", "<", "=", "+"], "correctIndex": 1, "level": 24, "id": 1162},
    {"subject": "Toán", "question": "93 − 70 = ?", "options": ["24", "23", "15", "19"], "correctIndex": 1, "level": 24, "id": 1163},
    {"subject": "Toán", "question": "Số liền trước của 45 là:", "options": ["46", "44", "45", "43"], "correctIndex": 1, "level": 24, "id": 1164},
    {"subject": "Toán", "question": "12 + 20 = ?", "options": ["32", "35", "33", "28"], "correctIndex": 0, "level": 24, "id": 1165},
    {"subject": "Toán", "question": "🦋🦋🦋🦋🦋🦋🦋🦋🦋 Có mấy con bướm?", "options": ["10", "9", "11", "8"], "correctIndex": 1, "level": 24, "id": 1166},
    {"subject": "Toán", "question": "🐞🐞🐞🐞🐞🐞🐞🐞🐞 Có mấy con bọ rùa?", "options": ["7", "9", "8", "10"], "correctIndex": 1, "level": 24, "id": 1167},
    {"subject": "Toán", "question": "29 − 5 = ?", "options": ["29", "24", "26", "18"], "correctIndex": 1, "level": 24, "id": 1168},
    {"subject": "Toán", "question": "Có 6 quả bóng bay 🎈, thêm 8 quả bóng bay nữa. Có tất cả mấy quả bóng bay?", "options": ["13", "16", "14", "15"], "correctIndex": 2, "level": 24, "id": 1169},
    {"subject": "Toán", "question": "Điền dấu: 34 … 16", "options": ["+", ">", "=", "<"], "correctIndex": 1, "level": 24, "id": 1170},
    {"subject": "Toán", "question": "Có 2 cái kẹo 🍬, thêm 2 cái kẹo nữa. Có tất cả mấy cái kẹo?", "options": ["5", "6", "3", "4"], "correctIndex": 3, "level": 24, "id": 1171},
    {"subject": "Toán", "question": "Có 7 cái kẹo 🍬, thêm 7 cái kẹo nữa. Có tất cả mấy cái kẹo?", "options": ["13", "16", "15", "14"], "correctIndex": 3, "level": 24, "id": 1172},
    {"subject": "Toán", "question": "Số gồm 9 chục và 1 đơn vị là:", "options": ["10", "101", "91", "19"], "correctIndex": 2, "level": 24, "id": 1173},
    {"subject": "Tiếng Việt", "question": "Tiếng 'vâng' có vần gì?", "options": ["âng", "ôi", "ach", "ăng"], "correctIndex": 0, "level": 24, "id": 1174},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'iên'?", "options": ["hoàng", "biển", "toán", "thơm"], "correctIndex": 1, "level": 24, "id": 1175},
    {"subject": "Tiếng Việt", "question": "Tiếng 'toán' có vần gì?", "options": ["oan", "inh", "ươn", "âng"], "correctIndex": 0, "level": 24, "id": 1176},
    {"subject": "Tiếng Việt", "question": "Tiếng 'chuông' có vần gì?", "options": ["ông", "oang", "uông", "êm"], "correctIndex": 2, "level": 24, "id": 1177},
    {"subject": "Tiếng Việt", "question": "Tiếng 'rau' có vần gì?", "options": ["ươn", "ơn", "au", "uôn"], "correctIndex": 2, "level": 24, "id": 1178},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'chậm'?", "options": ["cười", "già", "nhanh", "mới"], "correctIndex": 2, "level": 24, "id": 1179},
    {"subject": "Tiếng Việt", "question": "Tiếng 'ớt' có vần gì?", "options": ["ương", "at", "ơt", "ươn"], "correctIndex": 2, "level": 24, "id": 1180},
    {"subject": "Tiếng Việt", "question": "Tiếng 'thơm' có vần gì?", "options": ["oa", "ươn", "ơm", "ôt"], "correctIndex": 2, "level": 24, "id": 1181},
    {"subject": "Tiếng Việt", "question": "Tiếng 'lan' có vần gì?", "options": ["an", "ach", "oan", "âng"], "correctIndex": 0, "level": 24, "id": 1182},
    {"subject": "Tiếng Việt", "question": "Tiếng 'cơm' có vần gì?", "options": ["oe", "ăng", "ơm", "ach"], "correctIndex": 2, "level": 24, "id": 1183},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ơm'?", "options": ["súng", "nệm", "bụi", "thơm"], "correctIndex": 3, "level": 24, "id": 1184},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'an'?", "options": ["lan", "muối", "sách", "cột"], "correctIndex": 0, "level": 24, "id": 1185},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ôi'?", "options": ["hoa", "đôi", "chanh", "cau"], "correctIndex": 1, "level": 24, "id": 1186},
    {"subject": "Tiếng Anh", "question": "'No' nghĩa là gì?", "options": ["Hẹn gặp lại", "Chào buổi sáng", "Không", "Chúc ngủ ngon"], "correctIndex": 2, "level": 24, "id": 1187},
    {"subject": "Tiếng Anh", "question": "'Tooth' nghĩa là gì?", "options": ["Mắt", "Cánh tay", "Răng", "Mũi"], "correctIndex": 2, "level": 24, "id": 1188},
    {"subject": "Tiếng Anh", "question": "'Mouse' nghĩa là gì?", "options": ["Con hươu cao cổ", "Con mèo", "Con rắn", "Con chuột"], "correctIndex": 3, "level": 24, "id": 1189},
    {"subject": "Tiếng Anh", "question": "✏️ tiếng Anh là gì?", "options": ["Pen", "Notebook", "Pencil", "Eraser"], "correctIndex": 2, "level": 24, "id": 1190},
    {"subject": "Tiếng Anh", "question": "'See you later' nghĩa là gì?", "options": ["Vâng / Có", "Cảm ơn", "Hẹn gặp lại", "Xin chào"], "correctIndex": 2, "level": 24, "id": 1191},
    {"subject": "Tiếng Anh", "question": "🦵 tiếng Anh là gì?", "options": ["Eye", "Tooth", "Nose", "Leg"], "correctIndex": 3, "level": 24, "id": 1192},
    {"subject": "Tiếng Anh", "question": "🍉 tiếng Anh là gì?", "options": ["Juice", "Egg", "Watermelon", "Cookie"], "correctIndex": 2, "level": 24, "id": 1193},
    {"subject": "Tiếng Anh", "question": "👦 tiếng Anh là gì?", "options": ["Mother", "Grandmother", "Father", "Brother"], "correctIndex": 3, "level": 24, "id": 1194},
    {"subject": "Tiếng Anh", "question": "'Brown' nghĩa là gì?", "options": ["Màu trắng", "Màu nâu", "Màu hồng", "Màu cam"], "correctIndex": 1, "level": 24, "id": 1195},
    {"subject": "Tiếng Anh", "question": "'Good morning' nghĩa là gì?", "options": ["Chào buổi sáng", "Xin lỗi", "Không", "Cảm ơn"], "correctIndex": 0, "level": 24, "id": 1196},
    {"subject": "Tiếng Anh", "question": "'Purple' nghĩa là gì?", "options": ["Màu tím", "Màu nâu", "Màu xanh lá", "Màu vàng"], "correctIndex": 0, "level": 24, "id": 1197},
    {"subject": "Tiếng Anh", "question": "'Lion' nghĩa là gì?", "options": ["Con chó", "Con lợn", "Con sư tử", "Con rắn"], "correctIndex": 2, "level": 24, "id": 1198},
    {"subject": "Tiếng Anh", "question": "'Good night' nghĩa là gì?", "options": ["Chúc ngủ ngon", "Tạm biệt", "Không", "Xin chào"], "correctIndex": 0, "level": 24, "id": 1199},
    {"subject": "Tiếng Anh", "question": "'Ô tô' tiếng Anh là gì?", "options": ["Kite", "Bike", "Car", "Train"], "correctIndex": 2, "level": 24, "id": 1200},
    {"id": 1201, "level": 25, "subject": "Toán", "question": "Số gồm 8 chục và 4 đơn vị là:", "options": ["94", "48", "12", "84"], "correctIndex": 3},
    {"id": 1202, "level": 25, "subject": "Toán", "question": "51 + 11 = ?", "options": ["72", "63", "62", "61"], "correctIndex": 2},
    {"id": 1203, "level": 25, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'oan'?", "options": ["ngân", "ngon", "ngăn", "ngoan"], "correctIndex": 3},
    {"id": 1204, "level": 25, "subject": "Tiếng Việt", "question": "Câu nào viết đúng?", "options": ["Bé ngoan lắm.", "bé Ngoan lắm", "bé ngoan lắm.", "Bé ngoan Lắm"], "correctIndex": 0},
    {"id": 1205, "level": 25, "subject": "Tiếng Anh", "question": "'Banana' là quả gì?", "options": ["Quả táo", "Quả dưa", "Quả chuối", "Quả cam"], "correctIndex": 2},
    {"subject": "Toán", "question": "63 − 23 = ?", "options": ["34", "39", "36", "40"], "correctIndex": 3, "level": 25, "id": 1206},
    {"subject": "Toán", "question": "71 − 31 = ?", "options": ["46", "31", "40", "33"], "correctIndex": 2, "level": 25, "id": 1207},
    {"subject": "Toán", "question": "Điền dấu: 32 … 26", "options": ["+", ">", "<", "="], "correctIndex": 1, "level": 25, "id": 1208},
    {"subject": "Toán", "question": "41 − 31 = ?", "options": ["10", "6", "18", "5"], "correctIndex": 0, "level": 25, "id": 1209},
    {"subject": "Toán", "question": "81 − 11 = ?", "options": ["75", "70", "72", "63"], "correctIndex": 1, "level": 25, "id": 1210},
    {"subject": "Toán", "question": "97 − 14 = ?", "options": ["78", "83", "92", "82"], "correctIndex": 1, "level": 25, "id": 1211},
    {"subject": "Toán", "question": "Điền dấu: 8 … 47", "options": [">", "<", "+", "="], "correctIndex": 1, "level": 25, "id": 1212},
    {"subject": "Toán", "question": "Điền dấu: 36 … 10", "options": ["=", ">", "<", "+"], "correctIndex": 1, "level": 25, "id": 1213},
    {"subject": "Toán", "question": "93 − 21 = ?", "options": ["75", "72", "66", "63"], "correctIndex": 1, "level": 25, "id": 1214},
    {"subject": "Toán", "question": "83 − 12 = ?", "options": ["71", "66", "64", "78"], "correctIndex": 0, "level": 25, "id": 1215},
    {"subject": "Toán", "question": "Điền dấu: 16 … 26", "options": ["+", ">", "<", "="], "correctIndex": 2, "level": 25, "id": 1216},
    {"subject": "Toán", "question": "24 − 4 = ?", "options": ["29", "20", "13", "19"], "correctIndex": 1, "level": 25, "id": 1217},
    {"subject": "Toán", "question": "🚀🚀🚀🚀 Có mấy tên lửa?", "options": ["2", "4", "5", "3"], "correctIndex": 1, "level": 25, "id": 1218},
    {"subject": "Toán", "question": "Số liền trước của 22 là:", "options": ["21", "22", "23", "20"], "correctIndex": 0, "level": 25, "id": 1219},
    {"subject": "Toán", "question": "Số liền sau của 32 là:", "options": ["34", "33", "31", "32"], "correctIndex": 1, "level": 25, "id": 1220},
    {"subject": "Toán", "question": "10 + 10 = ?", "options": ["17", "20", "10", "22"], "correctIndex": 1, "level": 25, "id": 1221},
    {"subject": "Toán", "question": "Có 4 cái kẹo 🍬, thêm 3 cái kẹo nữa. Có tất cả mấy cái kẹo?", "options": ["9", "8", "5", "7"], "correctIndex": 3, "level": 25, "id": 1222},
    {"subject": "Toán", "question": "61 − 20 = ?", "options": ["39", "31", "48", "41"], "correctIndex": 3, "level": 25, "id": 1223},
    {"subject": "Tiếng Việt", "question": "Tiếng 'sao' có vần gì?", "options": ["ao", "ich", "ênh", "iên"], "correctIndex": 0, "level": 25, "id": 1224},
    {"subject": "Tiếng Việt", "question": "Tiếng 'khoe' có vần gì?", "options": ["at", "oa", "iên", "oe"], "correctIndex": 3, "level": 25, "id": 1225},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'trên'?", "options": ["to", "già", "dưới", "thấp"], "correctIndex": 2, "level": 25, "id": 1226},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'im'?", "options": ["cam", "kim", "kéo", "vàng"], "correctIndex": 1, "level": 25, "id": 1227},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'ê'?", "options": ["ê", "n", "v", "t"], "correctIndex": 0, "level": 25, "id": 1228},
    {"subject": "Tiếng Việt", "question": "Tiếng 'tốt' có vần gì?", "options": ["ưt", "ôt", "em", "anh"], "correctIndex": 1, "level": 25, "id": 1229},
    {"subject": "Tiếng Việt", "question": "Tiếng 'xuống' có vần gì?", "options": ["ưt", "ông", "uông", "oi"], "correctIndex": 2, "level": 25, "id": 1230},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'gần'?", "options": ["đêm", "xa", "trên", "đen"], "correctIndex": 1, "level": 25, "id": 1231},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'cũ'?", "options": ["dài", "đêm", "sáng", "mới"], "correctIndex": 3, "level": 25, "id": 1232},
    {"subject": "Tiếng Việt", "question": "Tiếng 'tiên' có vần gì?", "options": ["en", "uôn", "ơm", "iên"], "correctIndex": 3, "level": 25, "id": 1233},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ơm'?", "options": ["rau", "muối", "cơm", "con"], "correctIndex": 2, "level": 25, "id": 1234},
    {"subject": "Tiếng Việt", "question": "Tiếng 'đèn' có vần gì?", "options": ["en", "uyên", "au", "ơt"], "correctIndex": 0, "level": 25, "id": 1235},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ung'?", "options": ["cung", "vợt", "chuông", "xòe"], "correctIndex": 0, "level": 25, "id": 1236},
    {"subject": "Tiếng Anh", "question": "🪑 tiếng Anh là gì?", "options": ["Pen", "Chair", "Pencil", "Crayon"], "correctIndex": 1, "level": 25, "id": 1237},
    {"subject": "Tiếng Anh", "question": "'Apple' nghĩa là gì?", "options": ["Quả trứng", "Nước ép", "Sữa", "Quả táo"], "correctIndex": 3, "level": 25, "id": 1238},
    {"subject": "Tiếng Anh", "question": "'Brother' nghĩa là gì?", "options": ["Mẹ", "Em bé", "Chị/em gái", "Anh/em trai"], "correctIndex": 3, "level": 25, "id": 1239},
    {"subject": "Tiếng Anh", "question": "'Ông' tiếng Anh là gì?", "options": ["Sister", "Grandmother", "Grandfather", "Brother"], "correctIndex": 2, "level": 25, "id": 1240},
    {"subject": "Tiếng Anh", "question": "'Five' là số mấy?", "options": ["8", "5", "4", "3"], "correctIndex": 1, "level": 25, "id": 1241},
    {"subject": "Tiếng Anh", "question": "'Sorry' nghĩa là gì?", "options": ["Xin lỗi", "Tạm biệt", "Vâng / Có", "Cảm ơn"], "correctIndex": 0, "level": 25, "id": 1242},
    {"subject": "Tiếng Anh", "question": "'One' là số mấy?", "options": ["2", "3", "4", "1"], "correctIndex": 3, "level": 25, "id": 1243},
    {"subject": "Tiếng Anh", "question": "👧 tiếng Anh là gì?", "options": ["Brother", "Father", "Grandfather", "Sister"], "correctIndex": 3, "level": 25, "id": 1244},
    {"subject": "Tiếng Anh", "question": "'Thank you' nghĩa là gì?", "options": ["Xin lỗi", "Chúc ngủ ngon", "Hẹn gặp lại", "Cảm ơn"], "correctIndex": 3, "level": 25, "id": 1245},
    {"subject": "Tiếng Anh", "question": "'Eighteen' là số mấy?", "options": ["19", "18", "16", "20"], "correctIndex": 1, "level": 25, "id": 1246},
    {"subject": "Tiếng Anh", "question": "'Búp bê' tiếng Anh là gì?", "options": ["Doll", "Yo-yo", "Ball", "Bike"], "correctIndex": 0, "level": 25, "id": 1247},
    {"subject": "Tiếng Anh", "question": "🚗 tiếng Anh là gì?", "options": ["Car", "Boat", "Plane", "Ball"], "correctIndex": 0, "level": 25, "id": 1248},
    {"subject": "Tiếng Anh", "question": "'Banana' nghĩa là gì?", "options": ["Dưa hấu", "Nước ép", "Quả chuối", "Bánh mì"], "correctIndex": 2, "level": 25, "id": 1249},
    {"subject": "Tiếng Anh", "question": "🐭 tiếng Anh là gì?", "options": ["Elephant", "Dog", "Mouse", "Bear"], "correctIndex": 2, "level": 25, "id": 1250},
    {"id": 1251, "level": 26, "subject": "Toán", "question": "69 − 15 = ?", "options": ["54", "55", "64", "53"], "correctIndex": 0},
    {"id": 1252, "level": 26, "subject": "Toán", "question": "Lan có 15 cái kẹo, Lan cho bạn 3 cái. Lan còn mấy cái kẹo?", "options": ["18", "11", "13", "12"], "correctIndex": 3},
    {"id": 1253, "level": 26, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ươc'?", "options": ["nắc", "nước", "nóc", "nức"], "correctIndex": 1},
    {"id": 1254, "level": 26, "subject": "Tiếng Việt", "question": "Điền từ: Con cá sống ở dưới ...", "options": ["mây", "nước", "cây", "trời"], "correctIndex": 1},
    {"id": 1255, "level": 26, "subject": "Tiếng Anh", "question": "'Car' là gì?", "options": ["Ô tô", "Xe đạp", "Máy bay", "Tàu thủy"], "correctIndex": 0},
    {"subject": "Toán", "question": "88 − 18 = ?", "options": ["62", "66", "80", "70"], "correctIndex": 3, "level": 26, "id": 1256},
    {"subject": "Toán", "question": "Có 9 chiếc ô tô 🚗, thêm 2 chiếc ô tô nữa. Có tất cả mấy chiếc ô tô?", "options": ["11", "12", "10", "9"], "correctIndex": 0, "level": 26, "id": 1257},
    {"subject": "Toán", "question": "Điền dấu: 96 … 12", "options": ["=", "+", ">", "<"], "correctIndex": 2, "level": 26, "id": 1258},
    {"subject": "Toán", "question": "Điền dấu: 49 … 36", "options": [">", "<", "=", "+"], "correctIndex": 0, "level": 26, "id": 1259},
    {"subject": "Toán", "question": "Số nào lớn nhất?", "options": ["61", "63", "35", "40"], "correctIndex": 1, "level": 26, "id": 1260},
    {"subject": "Toán", "question": "92 − 30 = ?", "options": ["57", "65", "71", "62"], "correctIndex": 3, "level": 26, "id": 1261},
    {"subject": "Toán", "question": "Có 5 chiếc ô tô 🚗, thêm 4 chiếc ô tô nữa. Có tất cả mấy chiếc ô tô?", "options": ["8", "9", "11", "7"], "correctIndex": 1, "level": 26, "id": 1262},
    {"subject": "Toán", "question": "38 − 13 = ?", "options": ["20", "34", "25", "32"], "correctIndex": 2, "level": 26, "id": 1263},
    {"subject": "Toán", "question": "⭐⭐⭐⭐⭐⭐ Có mấy ngôi sao?", "options": ["8", "6", "7", "4"], "correctIndex": 1, "level": 26, "id": 1264},
    {"subject": "Toán", "question": "Số nào lớn nhất?", "options": ["79", "51", "64", "47"], "correctIndex": 0, "level": 26, "id": 1265},
    {"subject": "Toán", "question": "🚀🚀🚀🚀🚀🚀🚀 Có mấy tên lửa?", "options": ["7", "6", "8", "9"], "correctIndex": 0, "level": 26, "id": 1266},
    {"subject": "Toán", "question": "35 + 40 = ?", "options": ["72", "75", "79", "73"], "correctIndex": 1, "level": 26, "id": 1267},
    {"subject": "Toán", "question": "41 + 11 = ?", "options": ["59", "54", "44", "52"], "correctIndex": 3, "level": 26, "id": 1268},
    {"subject": "Toán", "question": "🚌🚌🚌🚌🚌🚌🚌🚌🚌 Có mấy xe buýt?", "options": ["10", "7", "8", "9"], "correctIndex": 3, "level": 26, "id": 1269},
    {"subject": "Toán", "question": "🍎🍎🍎🍎 Có mấy quả táo?", "options": ["2", "5", "6", "4"], "correctIndex": 3, "level": 26, "id": 1270},
    {"subject": "Toán", "question": "Điền dấu: 86 … 95", "options": ["<", "=", "+", ">"], "correctIndex": 0, "level": 26, "id": 1271},
    {"subject": "Toán", "question": "56 − 21 = ?", "options": ["30", "42", "35", "41"], "correctIndex": 2, "level": 26, "id": 1272},
    {"subject": "Toán", "question": "Điền dấu: 92 … 35", "options": ["=", "+", "<", ">"], "correctIndex": 3, "level": 26, "id": 1273},
    {"subject": "Tiếng Việt", "question": "Tiếng 'vợt' có vần gì?", "options": ["ơt", "iên", "oang", "ưt"], "correctIndex": 0, "level": 26, "id": 1274},
    {"subject": "Tiếng Việt", "question": "Tiếng 'lửa' có vần gì?", "options": ["ưng", "ưa", "oan", "uôi"], "correctIndex": 1, "level": 26, "id": 1275},
    {"subject": "Tiếng Việt", "question": "Tiếng 'kem' có vần gì?", "options": ["iên", "oang", "em", "êm"], "correctIndex": 2, "level": 26, "id": 1276},
    {"subject": "Tiếng Việt", "question": "Tiếng 'bàn' có vần gì?", "options": ["ươn", "an", "ưng", "en"], "correctIndex": 1, "level": 26, "id": 1277},
    {"subject": "Tiếng Việt", "question": "Tiếng 'chanh' có vần gì?", "options": ["ơt", "oe", "uôi", "anh"], "correctIndex": 3, "level": 26, "id": 1278},
    {"subject": "Tiếng Việt", "question": "Tiếng 'gương' có vần gì?", "options": ["ưng", "oa", "ương", "ung"], "correctIndex": 2, "level": 26, "id": 1279},
    {"subject": "Tiếng Việt", "question": "Tiếng 'tám' có vần gì?", "options": ["oan", "âng", "oang", "am"], "correctIndex": 3, "level": 26, "id": 1280},
    {"subject": "Tiếng Việt", "question": "Tiếng 'xinh' có vần gì?", "options": ["ơt", "ung", "inh", "ui"], "correctIndex": 2, "level": 26, "id": 1281},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ông'?", "options": ["toán", "bông", "ngoan", "dưa"], "correctIndex": 1, "level": 26, "id": 1282},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ơi'?", "options": ["ớt", "đèn", "bơi", "biển"], "correctIndex": 2, "level": 26, "id": 1283},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'eo'?", "options": ["kéo", "vàng", "cơm", "hoa"], "correctIndex": 0, "level": 26, "id": 1284},
    {"subject": "Tiếng Việt", "question": "Tiếng 'loa' có vần gì?", "options": ["au", "oa", "ưt", "inh"], "correctIndex": 1, "level": 26, "id": 1285},
    {"subject": "Tiếng Việt", "question": "Câu 'Mẹ đi chợ.' có mấy tiếng?", "options": ["5", "4", "2", "3"], "correctIndex": 3, "level": 26, "id": 1286},
    {"subject": "Tiếng Anh", "question": "'Book' nghĩa là gì?", "options": ["Cặp sách", "Quyển vở", "Bút sáp màu", "Quyển sách"], "correctIndex": 3, "level": 26, "id": 1287},
    {"subject": "Tiếng Anh", "question": "'Six' là số mấy?", "options": ["7", "8", "4", "6"], "correctIndex": 3, "level": 26, "id": 1288},
    {"subject": "Tiếng Anh", "question": "'Bàn tay' tiếng Anh là gì?", "options": ["Nose", "Leg", "Hand", "Arm"], "correctIndex": 2, "level": 26, "id": 1289},
    {"subject": "Tiếng Anh", "question": "✏️ tiếng Anh là gì?", "options": ["Pen", "Ruler", "School bag", "Pencil"], "correctIndex": 3, "level": 26, "id": 1290},
    {"subject": "Tiếng Anh", "question": "'No' nghĩa là gì?", "options": ["Xin lỗi", "Không", "Chào buổi sáng", "Xin chào"], "correctIndex": 1, "level": 26, "id": 1291},
    {"subject": "Tiếng Anh", "question": "👁️ tiếng Anh là gì?", "options": ["Eye", "Nose", "Mouth", "Foot"], "correctIndex": 0, "level": 26, "id": 1292},
    {"subject": "Tiếng Anh", "question": "'Two' là số mấy?", "options": ["2", "4", "5", "1"], "correctIndex": 0, "level": 26, "id": 1293},
    {"subject": "Tiếng Anh", "question": "🥛 tiếng Anh là gì?", "options": ["Mango", "Milk", "Rice", "Watermelon"], "correctIndex": 1, "level": 26, "id": 1294},
    {"subject": "Tiếng Anh", "question": "'Bà' tiếng Anh là gì?", "options": ["Father", "Grandmother", "Sister", "Grandfather"], "correctIndex": 1, "level": 26, "id": 1295},
    {"subject": "Tiếng Anh", "question": "👦 tiếng Anh là gì?", "options": ["Mother", "Grandfather", "Brother", "Father"], "correctIndex": 2, "level": 26, "id": 1296},
    {"subject": "Tiếng Anh", "question": "'Teddy bear' nghĩa là gì?", "options": ["Gấu bông", "Quả bóng", "Cái yo-yo", "Máy bay"], "correctIndex": 0, "level": 26, "id": 1297},
    {"subject": "Tiếng Anh", "question": "'Sixteen' là số mấy?", "options": ["16", "19", "18", "17"], "correctIndex": 0, "level": 26, "id": 1298},
    {"subject": "Tiếng Anh", "question": "'Good morning' nghĩa là gì?", "options": ["Vâng / Có", "Chào buổi sáng", "Xin chào", "Cảm ơn"], "correctIndex": 1, "level": 26, "id": 1299},
    {"subject": "Tiếng Anh", "question": "'Arm' nghĩa là gì?", "options": ["Mũi", "Tai", "Bàn tay", "Cánh tay"], "correctIndex": 3, "level": 26, "id": 1300},
    {"id": 1301, "level": 27, "subject": "Toán", "question": "69 − 33 = ?", "options": ["36", "35", "37", "46"], "correctIndex": 0},
    {"id": 1302, "level": 27, "subject": "Toán", "question": "Một tuần có mấy ngày?", "options": ["7", "5", "6", "10"], "correctIndex": 0},
    {"id": 1303, "level": 27, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'uôt'?", "options": ["chuột", "chuối", "chốt", "chát"], "correctIndex": 0},
    {"id": 1304, "level": 27, "subject": "Tiếng Việt", "question": "Từ nào chỉ màu sắc?", "options": ["cái mũ", "con voi", "đỏ tươi", "chạy nhanh"], "correctIndex": 2},
    {"id": 1305, "level": 27, "subject": "Tiếng Anh", "question": "'Sun' là gì?", "options": ["Ngôi sao", "Mặt trời", "Đám mây", "Mặt trăng"], "correctIndex": 1},
    {"subject": "Toán", "question": "97 − 7 = ?", "options": ["90", "84", "88", "93"], "correctIndex": 0, "level": 27, "id": 1306},
    {"subject": "Toán", "question": "43 − 13 = ?", "options": ["30", "23", "27", "31"], "correctIndex": 0, "level": 27, "id": 1307},
    {"subject": "Toán", "question": "Số gồm 1 chục và 5 đơn vị là:", "options": ["6", "15", "25", "51"], "correctIndex": 1, "level": 27, "id": 1308},
    {"subject": "Toán", "question": "27 − 16 = ?", "options": ["12", "8", "17", "11"], "correctIndex": 3, "level": 27, "id": 1309},
    {"subject": "Toán", "question": "75 − 41 = ?", "options": ["37", "44", "33", "34"], "correctIndex": 3, "level": 27, "id": 1310},
    {"subject": "Toán", "question": "Có 8 quả bóng bay 🎈, thêm 9 quả bóng bay nữa. Có tất cả mấy quả bóng bay?", "options": ["15", "16", "17", "18"], "correctIndex": 2, "level": 27, "id": 1311},
    {"subject": "Toán", "question": "Số nào lớn nhất?", "options": ["6", "63", "56", "68"], "correctIndex": 3, "level": 27, "id": 1312},
    {"subject": "Toán", "question": "Số liền sau của 21 là:", "options": ["22", "23", "20", "21"], "correctIndex": 0, "level": 27, "id": 1313},
    {"subject": "Toán", "question": "63 + 4 = ?", "options": ["65", "70", "67", "58"], "correctIndex": 2, "level": 27, "id": 1314},
    {"subject": "Toán", "question": "75 − 52 = ?", "options": ["14", "27", "23", "28"], "correctIndex": 2, "level": 27, "id": 1315},
    {"subject": "Toán", "question": "34 + 24 = ?", "options": ["59", "48", "58", "64"], "correctIndex": 2, "level": 27, "id": 1316},
    {"subject": "Toán", "question": "Có 4 con cá 🐟, thêm 4 con cá nữa. Có tất cả mấy con cá?", "options": ["8", "9", "6", "7"], "correctIndex": 0, "level": 27, "id": 1317},
    {"subject": "Toán", "question": "29 − 12 = ?", "options": ["17", "24", "19", "16"], "correctIndex": 0, "level": 27, "id": 1318},
    {"subject": "Toán", "question": "Điền dấu: 0 … 97", "options": ["<", ">", "+", "="], "correctIndex": 0, "level": 27, "id": 1319},
    {"subject": "Toán", "question": "Số liền trước của 14 là:", "options": ["13", "15", "14", "12"], "correctIndex": 0, "level": 27, "id": 1320},
    {"subject": "Toán", "question": "Số nào lớn nhất?", "options": ["95", "86", "64", "72"], "correctIndex": 0, "level": 27, "id": 1321},
    {"subject": "Toán", "question": "35 + 20 = ?", "options": ["52", "55", "47", "58"], "correctIndex": 1, "level": 27, "id": 1322},
    {"subject": "Toán", "question": "Số nào lớn nhất?", "options": ["26", "3", "16", "84"], "correctIndex": 3, "level": 27, "id": 1323},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'p'?", "options": ["e", "p", "đ", "s"], "correctIndex": 1, "level": 27, "id": 1324},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'b'?", "options": ["v", "ê", "b", "a"], "correctIndex": 2, "level": 27, "id": 1325},
    {"subject": "Tiếng Việt", "question": "Câu 'Bé ngủ ngon.' có mấy tiếng?", "options": ["2", "3", "4", "5"], "correctIndex": 1, "level": 27, "id": 1326},
    {"subject": "Tiếng Việt", "question": "🚲 là gì?", "options": ["Con chó", "Con voi", "Quả táo", "Xe đạp"], "correctIndex": 3, "level": 27, "id": 1327},
    {"subject": "Tiếng Việt", "question": "Điền từ: Bố ... xe đạp.", "options": ["bơi", "đi", "gáy", "hót"], "correctIndex": 1, "level": 27, "id": 1328},
    {"subject": "Tiếng Việt", "question": "⚽ là gì?", "options": ["Quả cam", "Quả bóng", "Quả xoài", "Quả táo"], "correctIndex": 1, "level": 27, "id": 1329},
    {"subject": "Tiếng Việt", "question": "Tiếng 'ghế' bắt đầu bằng chữ nào?", "options": ["d", "t", "gh", "đ"], "correctIndex": 2, "level": 27, "id": 1330},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["nghõ nhỏ", "cá kho", "cá cho", "cể chuyện"], "correctIndex": 1, "level": 27, "id": 1331},
    {"subject": "Tiếng Việt", "question": "Tiếng 'khế' bắt đầu bằng chữ nào?", "options": ["gh", "kh", "ph", "ngh"], "correctIndex": 1, "level": 27, "id": 1332},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'nhỏ'?", "options": ["sáng", "to", "tối", "đen"], "correctIndex": 1, "level": 27, "id": 1333},
    {"subject": "Tiếng Việt", "question": "🦋 là gì?", "options": ["Con bướm", "Con ngựa", "Con cua", "Con ếch"], "correctIndex": 0, "level": 27, "id": 1334},
    {"subject": "Tiếng Việt", "question": "🐟 là gì?", "options": ["Con gà", "Con rùa", "Con thỏ", "Con cá"], "correctIndex": 3, "level": 27, "id": 1335},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'đ'?", "options": ["â", "đ", "q", "u"], "correctIndex": 1, "level": 27, "id": 1336},
    {"subject": "Tiếng Anh", "question": "'Cat' nghĩa là gì?", "options": ["Con chim", "Con hổ", "Con mèo", "Con hươu cao cổ"], "correctIndex": 2, "level": 27, "id": 1337},
    {"subject": "Tiếng Anh", "question": "👩 tiếng Anh là gì?", "options": ["Father", "Mother", "Brother", "Grandmother"], "correctIndex": 1, "level": 27, "id": 1338},
    {"subject": "Tiếng Anh", "question": "🐢 tiếng Anh là gì?", "options": ["Cat", "Turtle", "Chicken", "Pig"], "correctIndex": 1, "level": 27, "id": 1339},
    {"subject": "Tiếng Anh", "question": "📘 tiếng Anh là gì?", "options": ["School bag", "Book", "Pen", "Scissors"], "correctIndex": 1, "level": 27, "id": 1340},
    {"subject": "Tiếng Anh", "question": "'Kite' nghĩa là gì?", "options": ["Tàu hỏa", "Máy bay", "Con diều", "Con thuyền"], "correctIndex": 2, "level": 27, "id": 1341},
    {"subject": "Tiếng Anh", "question": "'Pencil' nghĩa là gì?", "options": ["Bút chì", "Cái kéo", "Cái ghế", "Cái thước"], "correctIndex": 0, "level": 27, "id": 1342},
    {"subject": "Tiếng Anh", "question": "👄 tiếng Anh là gì?", "options": ["Arm", "Mouth", "Foot", "Hand"], "correctIndex": 1, "level": 27, "id": 1343},
    {"subject": "Tiếng Anh", "question": "🦶 tiếng Anh là gì?", "options": ["Eye", "Arm", "Foot", "Ear"], "correctIndex": 2, "level": 27, "id": 1344},
    {"subject": "Tiếng Anh", "question": "Số 15 tiếng Anh là gì?", "options": ["Fourteen", "Eighteen", "Seventeen", "Fifteen"], "correctIndex": 3, "level": 27, "id": 1345},
    {"subject": "Tiếng Anh", "question": "'Foot' nghĩa là gì?", "options": ["Bàn chân", "Mũi", "Cánh tay", "Răng"], "correctIndex": 0, "level": 27, "id": 1346},
    {"subject": "Tiếng Anh", "question": "'Mắt' tiếng Anh là gì?", "options": ["Hand", "Leg", "Eye", "Foot"], "correctIndex": 2, "level": 27, "id": 1347},
    {"subject": "Tiếng Anh", "question": "👨 tiếng Anh là gì?", "options": ["Baby", "Father", "Grandmother", "Mother"], "correctIndex": 1, "level": 27, "id": 1348},
    {"subject": "Tiếng Anh", "question": "🐄 tiếng Anh là gì?", "options": ["Cow", "Monkey", "Chicken", "Elephant"], "correctIndex": 0, "level": 27, "id": 1349},
    {"subject": "Tiếng Anh", "question": "'Thirteen' là số mấy?", "options": ["14", "11", "15", "13"], "correctIndex": 3, "level": 27, "id": 1350},
    {"id": 1351, "level": 28, "subject": "Toán", "question": "79 − 41 = ?", "options": ["37", "39", "38", "48"], "correctIndex": 2},
    {"id": 1352, "level": 28, "subject": "Toán", "question": "Đồng hồ có kim ngắn chỉ số 3, kim dài chỉ số 12. Đồng hồ chỉ mấy giờ?", "options": ["3 giờ", "12 giờ", "9 giờ", "6 giờ"], "correctIndex": 0},
    {"id": 1353, "level": 28, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'iêu'?", "options": ["dao", "diều", "dâu", "dầu"], "correctIndex": 1},
    {"id": 1354, "level": 28, "subject": "Tiếng Việt", "question": "Đọc câu: 'Bé thả diều trên đê.' Bé làm gì?", "options": ["Đá bóng", "Tưới cây", "Đọc sách", "Thả diều"], "correctIndex": 3},
    {"id": 1355, "level": 28, "subject": "Tiếng Anh", "question": "'Eyes' là gì?", "options": ["Đôi tai", "Đôi mắt", "Cái miệng", "Cái mũi"], "correctIndex": 1},
    {"subject": "Toán", "question": "Số nào lớn nhất?", "options": ["47", "57", "16", "42"], "correctIndex": 1, "level": 28, "id": 1356},
    {"subject": "Toán", "question": "89 − 64 = ?", "options": ["28", "25", "22", "34"], "correctIndex": 1, "level": 28, "id": 1357},
    {"subject": "Toán", "question": "Có 5 cái kẹo 🍬, thêm 3 cái kẹo nữa. Có tất cả mấy cái kẹo?", "options": ["9", "8", "10", "6"], "correctIndex": 1, "level": 28, "id": 1358},
    {"subject": "Toán", "question": "Số nào lớn nhất?", "options": ["97", "56", "53", "50"], "correctIndex": 0, "level": 28, "id": 1359},
    {"subject": "Toán", "question": "64 + 23 = ?", "options": ["87", "89", "96", "92"], "correctIndex": 0, "level": 28, "id": 1360},
    {"subject": "Toán", "question": "63 − 10 = ?", "options": ["53", "48", "49", "52"], "correctIndex": 0, "level": 28, "id": 1361},
    {"subject": "Toán", "question": "95 − 30 = ?", "options": ["64", "65", "74", "67"], "correctIndex": 1, "level": 28, "id": 1362},
    {"subject": "Toán", "question": "35 + 23 = ?", "options": ["51", "59", "66", "58"], "correctIndex": 3, "level": 28, "id": 1363},
    {"subject": "Toán", "question": "69 − 9 = ?", "options": ["68", "52", "55", "60"], "correctIndex": 3, "level": 28, "id": 1364},
    {"subject": "Toán", "question": "Số gồm 3 chục và 1 đơn vị là:", "options": ["13", "31", "4", "41"], "correctIndex": 1, "level": 28, "id": 1365},
    {"subject": "Toán", "question": "Có 9 chiếc ô tô 🚗, thêm 9 chiếc ô tô nữa. Có tất cả mấy chiếc ô tô?", "options": ["18", "16", "19", "20"], "correctIndex": 0, "level": 28, "id": 1366},
    {"subject": "Toán", "question": "64 + 35 = ?", "options": ["90", "98", "95", "99"], "correctIndex": 3, "level": 28, "id": 1367},
    {"subject": "Toán", "question": "Số nào lớn nhất?", "options": ["55", "15", "8", "81"], "correctIndex": 3, "level": 28, "id": 1368},
    {"subject": "Toán", "question": "Điền dấu: 63 … 24", "options": ["<", "=", "+", ">"], "correctIndex": 3, "level": 28, "id": 1369},
    {"subject": "Toán", "question": "Có 4 quả táo 🍎, thêm 6 quả táo nữa. Có tất cả mấy quả táo?", "options": ["11", "10", "9", "8"], "correctIndex": 1, "level": 28, "id": 1370},
    {"subject": "Toán", "question": "Có 4 chiếc ô tô 🚗, thêm 5 chiếc ô tô nữa. Có tất cả mấy chiếc ô tô?", "options": ["11", "7", "9", "8"], "correctIndex": 2, "level": 28, "id": 1371},
    {"subject": "Toán", "question": "52 − 30 = ?", "options": ["22", "26", "29", "27"], "correctIndex": 0, "level": 28, "id": 1372},
    {"subject": "Toán", "question": "67 − 55 = ?", "options": ["11", "21", "18", "12"], "correctIndex": 3, "level": 28, "id": 1373},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'ngày'?", "options": ["cao", "dài", "béo", "đêm"], "correctIndex": 3, "level": 28, "id": 1374},
    {"subject": "Tiếng Việt", "question": "Câu 'Đàn vịt bơi trên ao.' có mấy tiếng?", "options": ["5", "4", "6", "7"], "correctIndex": 0, "level": 28, "id": 1375},
    {"subject": "Tiếng Việt", "question": "Câu 'Bé đi học.' có mấy tiếng?", "options": ["2", "4", "5", "3"], "correctIndex": 3, "level": 28, "id": 1376},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'oa'?", "options": ["sơn", "canh", "loa", "kênh"], "correctIndex": 2, "level": 28, "id": 1377},
    {"subject": "Tiếng Việt", "question": "🥕 là gì?", "options": ["Con bướm", "Con hổ", "Củ cà rốt", "Quả bóng"], "correctIndex": 2, "level": 28, "id": 1378},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["ngã ba", "cái gế", "ghói quà", "nghã ba"], "correctIndex": 0, "level": 28, "id": 1379},
    {"subject": "Tiếng Việt", "question": "Tiếng 'quạt' bắt đầu bằng chữ nào?", "options": ["qu", "ng", "t", "nh"], "correctIndex": 0, "level": 28, "id": 1380},
    {"subject": "Tiếng Việt", "question": "Điền từ: Mèo ... chuột.", "options": ["gáy", "đọc", "hót", "bắt"], "correctIndex": 3, "level": 28, "id": 1381},
    {"subject": "Tiếng Việt", "question": "Tiếng 'kim' có vần gì?", "options": ["ôt", "inh", "im", "ut"], "correctIndex": 2, "level": 28, "id": 1382},
    {"subject": "Tiếng Việt", "question": "Câu 'Hà đi học sớm.' có mấy tiếng?", "options": ["4", "6", "5", "2"], "correctIndex": 0, "level": 28, "id": 1383},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'an'?", "options": ["bàn", "vạch", "chuối", "chào"], "correctIndex": 0, "level": 28, "id": 1384},
    {"subject": "Tiếng Việt", "question": "Chữ nào là chữ 'i'?", "options": ["r", "p", "i", "o"], "correctIndex": 2, "level": 28, "id": 1385},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["con ngé", "nghã ba", "con nghé", "nge nhạc"], "correctIndex": 2, "level": 28, "id": 1386},
    {"subject": "Tiếng Anh", "question": "'Sorry' nghĩa là gì?", "options": ["Tạm biệt", "Không", "Vâng / Có", "Xin lỗi"], "correctIndex": 3, "level": 28, "id": 1387},
    {"subject": "Tiếng Anh", "question": "🟢 tiếng Anh là gì?", "options": ["Pink", "Green", "Blue", "Red"], "correctIndex": 1, "level": 28, "id": 1388},
    {"subject": "Tiếng Anh", "question": "👩 tiếng Anh là gì?", "options": ["Grandfather", "Baby", "Mother", "Father"], "correctIndex": 2, "level": 28, "id": 1389},
    {"subject": "Tiếng Anh", "question": "Số 14 tiếng Anh là gì?", "options": ["Fourteen", "Seventeen", "Fifteen", "Twelve"], "correctIndex": 0, "level": 28, "id": 1390},
    {"subject": "Tiếng Anh", "question": "🍇 tiếng Anh là gì?", "options": ["Ice cream", "Watermelon", "Grapes", "Juice"], "correctIndex": 2, "level": 28, "id": 1391},
    {"subject": "Tiếng Anh", "question": "📓 tiếng Anh là gì?", "options": ["Pencil", "School bag", "Notebook", "Pen"], "correctIndex": 2, "level": 28, "id": 1392},
    {"subject": "Tiếng Anh", "question": "'Thirteen' là số mấy?", "options": ["16", "12", "14", "13"], "correctIndex": 3, "level": 28, "id": 1393},
    {"subject": "Tiếng Anh", "question": "'Hello' nghĩa là gì?", "options": ["Tạm biệt", "Xin chào", "Không", "Vâng / Có"], "correctIndex": 1, "level": 28, "id": 1394},
    {"subject": "Tiếng Anh", "question": "'Lion' nghĩa là gì?", "options": ["Con sư tử", "Con gấu", "Con khỉ", "Con lợn"], "correctIndex": 0, "level": 28, "id": 1395},
    {"subject": "Tiếng Anh", "question": "'Con khỉ' tiếng Anh là gì?", "options": ["Chicken", "Monkey", "Elephant", "Tiger"], "correctIndex": 1, "level": 28, "id": 1396},
    {"subject": "Tiếng Anh", "question": "'Con hổ' tiếng Anh là gì?", "options": ["Rabbit", "Tiger", "Mouse", "Frog"], "correctIndex": 1, "level": 28, "id": 1397},
    {"subject": "Tiếng Anh", "question": "'Good night' nghĩa là gì?", "options": ["Cảm ơn", "Xin chào", "Chúc ngủ ngon", "Hẹn gặp lại"], "correctIndex": 2, "level": 28, "id": 1398},
    {"subject": "Tiếng Anh", "question": "Số 3 tiếng Anh là gì?", "options": ["Four", "Six", "Two", "Three"], "correctIndex": 3, "level": 28, "id": 1399},
    {"subject": "Tiếng Anh", "question": "'Two' là số mấy?", "options": ["2", "1", "5", "3"], "correctIndex": 0, "level": 28, "id": 1400},
    {"id": 1401, "level": 29, "subject": "Toán", "question": "88 − 25 = ?", "options": ["73", "62", "64", "63"], "correctIndex": 3},
    {"id": 1402, "level": 29, "subject": "Toán", "question": "Rổ có 20 quả cam, mẹ bỏ thêm 10 quả. Rổ có tất cả bao nhiêu quả?", "options": ["30", "21", "10", "40"], "correctIndex": 0},
    {"id": 1403, "level": 29, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ưu'?", "options": ["cáu", "câu", "cứu", "cấu"], "correctIndex": 2},
    {"id": 1404, "level": 29, "subject": "Tiếng Việt", "question": "Đọc câu: 'Mèo con nằm sưởi nắng.' Con gì nằm sưởi nắng?", "options": ["Mèo con", "Gà con", "Vịt con", "Chó con"], "correctIndex": 0},
    {"id": 1405, "level": 29, "subject": "Tiếng Anh", "question": "'Happy' nghĩa là gì?", "options": ["Đói", "Vui vẻ", "Buồn", "Mệt"], "correctIndex": 1},
    {"subject": "Toán", "question": "🍎🍎🍎 Có mấy quả táo?", "options": ["5", "3", "1", "4"], "correctIndex": 1, "level": 29, "id": 1406},
    {"subject": "Toán", "question": "Có 7 con cá 🐟, cho bạn 1 con cá. Còn mấy con cá?", "options": ["5", "7", "6", "4"], "correctIndex": 2, "level": 29, "id": 1407},
    {"subject": "Toán", "question": "56 − 34 = ?", "options": ["13", "22", "16", "12"], "correctIndex": 1, "level": 29, "id": 1408},
    {"subject": "Toán", "question": "14 + 60 = ?", "options": ["71", "65", "78", "74"], "correctIndex": 3, "level": 29, "id": 1409},
    {"subject": "Toán", "question": "56 − 31 = ?", "options": ["32", "34", "25", "18"], "correctIndex": 2, "level": 29, "id": 1410},
    {"subject": "Toán", "question": "Số gồm 6 chục và 2 đơn vị là:", "options": ["72", "26", "62", "8"], "correctIndex": 2, "level": 29, "id": 1411},
    {"subject": "Toán", "question": "Điền dấu: 48 … 37", "options": ["=", "<", "+", ">"], "correctIndex": 3, "level": 29, "id": 1412},
    {"subject": "Toán", "question": "Số liền sau của 84 là:", "options": ["86", "84", "85", "83"], "correctIndex": 2, "level": 29, "id": 1413},
    {"subject": "Toán", "question": "78 − 21 = ?", "options": ["57", "66", "59", "67"], "correctIndex": 0, "level": 29, "id": 1414},
    {"subject": "Toán", "question": "47 − 12 = ?", "options": ["35", "31", "39", "45"], "correctIndex": 0, "level": 29, "id": 1415},
    {"subject": "Toán", "question": "Hôm nay là Thứ Ba. Ngày mai là thứ mấy?", "options": ["Thứ Hai", "Thứ Sáu", "Thứ Năm", "Thứ Tư"], "correctIndex": 3, "level": 29, "id": 1416},
    {"subject": "Toán", "question": "Điền dấu: 35 … 38", "options": ["<", "+", ">", "="], "correctIndex": 0, "level": 29, "id": 1417},
    {"subject": "Toán", "question": "84 + 15 = ?", "options": ["107", "100", "93", "99"], "correctIndex": 3, "level": 29, "id": 1418},
    {"subject": "Toán", "question": "Số nào lớn nhất?", "options": ["94", "3", "38", "5"], "correctIndex": 0, "level": 29, "id": 1419},
    {"subject": "Toán", "question": "Số nào lớn nhất?", "options": ["96", "27", "22", "3"], "correctIndex": 0, "level": 29, "id": 1420},
    {"subject": "Toán", "question": "Số gồm 1 chục và 6 đơn vị là:", "options": ["61", "26", "16", "7"], "correctIndex": 2, "level": 29, "id": 1421},
    {"subject": "Toán", "question": "89 − 22 = ?", "options": ["67", "65", "74", "57"], "correctIndex": 0, "level": 29, "id": 1422},
    {"subject": "Toán", "question": "Điền dấu: 39 … 38", "options": ["=", "+", "<", ">"], "correctIndex": 3, "level": 29, "id": 1423},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ơm'?", "options": ["con", "thơm", "bệnh", "đếm"], "correctIndex": 1, "level": 29, "id": 1424},
    {"subject": "Tiếng Việt", "question": "Tiếng 'sơn' có vần gì?", "options": ["oi", "ơn", "uôn", "ach"], "correctIndex": 1, "level": 29, "id": 1425},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'đêm'?", "options": ["trắng", "tối", "trên", "ngày"], "correctIndex": 3, "level": 29, "id": 1426},
    {"subject": "Tiếng Việt", "question": "Điền từ: Máy bay ... trên trời.", "options": ["bơi", "bay", "nấu", "đọc"], "correctIndex": 1, "level": 29, "id": 1427},
    {"subject": "Tiếng Việt", "question": "Tiếng 'kính' có vần gì?", "options": ["inh", "uông", "uôi", "im"], "correctIndex": 0, "level": 29, "id": 1428},
    {"subject": "Tiếng Việt", "question": "Điền từ: Bố ... xe đạp.", "options": ["gáy", "bơi", "đi", "hót"], "correctIndex": 2, "level": 29, "id": 1429},
    {"subject": "Tiếng Việt", "question": "Câu 'Em tưới cây cho mẹ.' có mấy tiếng?", "options": ["5", "4", "6", "7"], "correctIndex": 0, "level": 29, "id": 1430},
    {"subject": "Tiếng Việt", "question": "Tiếng 'tám' có vần gì?", "options": ["uôi", "eo", "am", "on"], "correctIndex": 2, "level": 29, "id": 1431},
    {"subject": "Tiếng Việt", "question": "🌸 là gì?", "options": ["Con ong", "Con ếch", "Bông hoa", "Con chuột"], "correctIndex": 2, "level": 29, "id": 1432},
    {"subject": "Tiếng Việt", "question": "Tiếng 'đếm' có vần gì?", "options": ["ut", "an", "êm", "iên"], "correctIndex": 2, "level": 29, "id": 1433},
    {"subject": "Tiếng Việt", "question": "🌙 là gì?", "options": ["Mặt trăng", "Con bướm", "Con hổ", "Cái mũ"], "correctIndex": 0, "level": 29, "id": 1434},
    {"subject": "Tiếng Việt", "question": "🐝 là gì?", "options": ["Con ốc", "Con khỉ", "Con cá", "Con ong"], "correctIndex": 3, "level": 29, "id": 1435},
    {"subject": "Tiếng Việt", "question": "Tiếng 'chó' bắt đầu bằng chữ nào?", "options": ["th", "ph", "đ", "ch"], "correctIndex": 3, "level": 29, "id": 1436},
    {"subject": "Tiếng Anh", "question": "'Anh/em trai' tiếng Anh là gì?", "options": ["Brother", "Mother", "Grandfather", "Father"], "correctIndex": 0, "level": 29, "id": 1437},
    {"subject": "Tiếng Anh", "question": "'Twenty' là số mấy?", "options": ["23", "22", "19", "20"], "correctIndex": 3, "level": 29, "id": 1438},
    {"subject": "Tiếng Anh", "question": "✋ tiếng Anh là gì?", "options": ["Ear", "Nose", "Hand", "Tooth"], "correctIndex": 2, "level": 29, "id": 1439},
    {"subject": "Tiếng Anh", "question": "🟤 tiếng Anh là gì?", "options": ["Blue", "Brown", "Purple", "Red"], "correctIndex": 1, "level": 29, "id": 1440},
    {"subject": "Tiếng Anh", "question": "'Fourteen' là số mấy?", "options": ["17", "14", "16", "13"], "correctIndex": 1, "level": 29, "id": 1441},
    {"subject": "Tiếng Anh", "question": "'Yo-yo' nghĩa là gì?", "options": ["Xe đạp", "Gấu bông", "Cái yo-yo", "Tàu hỏa"], "correctIndex": 2, "level": 29, "id": 1442},
    {"subject": "Tiếng Anh", "question": "Số 2 tiếng Anh là gì?", "options": ["Two", "One", "Four", "Five"], "correctIndex": 0, "level": 29, "id": 1443},
    {"subject": "Tiếng Anh", "question": "⛵ tiếng Anh là gì?", "options": ["Car", "Train", "Boat", "Bike"], "correctIndex": 2, "level": 29, "id": 1444},
    {"subject": "Tiếng Anh", "question": "'Four' là số mấy?", "options": ["6", "3", "4", "5"], "correctIndex": 2, "level": 29, "id": 1445},
    {"subject": "Tiếng Anh", "question": "'Răng' tiếng Anh là gì?", "options": ["Eye", "Arm", "Foot", "Tooth"], "correctIndex": 3, "level": 29, "id": 1446},
    {"subject": "Tiếng Anh", "question": "'Chicken' nghĩa là gì?", "options": ["Con rùa", "Con mèo", "Con gà", "Con voi"], "correctIndex": 2, "level": 29, "id": 1447},
    {"subject": "Tiếng Anh", "question": "'Yellow' nghĩa là gì?", "options": ["Màu xanh dương", "Màu xanh lá", "Màu vàng", "Màu tím"], "correctIndex": 2, "level": 29, "id": 1448},
    {"subject": "Tiếng Anh", "question": "🐢 tiếng Anh là gì?", "options": ["Pig", "Horse", "Chicken", "Turtle"], "correctIndex": 3, "level": 29, "id": 1449},
    {"subject": "Tiếng Anh", "question": "'Black' nghĩa là gì?", "options": ["Màu hồng", "Màu đen", "Màu trắng", "Màu xanh dương"], "correctIndex": 1, "level": 29, "id": 1450},
    {"id": 1451, "level": 30, "subject": "Toán", "question": "86 − 15 = ?", "options": ["71", "70", "81", "72"], "correctIndex": 0},
    {"id": 1452, "level": 30, "subject": "Toán", "question": "Hôm nay là thứ Hai. Ngày mai là thứ mấy?", "options": ["Thứ Năm", "Thứ Ba", "Chủ nhật", "Thứ Tư"], "correctIndex": 1},
    {"id": 1453, "level": 30, "subject": "Tiếng Việt", "question": "Tiếng nào có vần 'ênh'?", "options": ["canh", "kênh", "cành", "kinh"], "correctIndex": 1},
    {"id": 1454, "level": 30, "subject": "Tiếng Việt", "question": "Đọc câu: 'Sáng nay, bố đưa Lan đi học.' Ai đưa Lan đi học?", "options": ["Chị", "Ông", "Bố", "Mẹ"], "correctIndex": 2},
    {"id": 1455, "level": 30, "subject": "Tiếng Anh", "question": "'Good morning' nghĩa là gì?", "options": ["Tạm biệt", "Cảm ơn", "Chúc ngủ ngon", "Chào buổi sáng"], "correctIndex": 3},
    {"subject": "Toán", "question": "Có 5 quả táo 🍎, thêm 3 quả táo nữa. Có tất cả mấy quả táo?", "options": ["10", "7", "8", "9"], "correctIndex": 2, "level": 30, "id": 1456},
    {"subject": "Toán", "question": "Điền dấu: 50 … 56", "options": ["<", "=", "+", ">"], "correctIndex": 0, "level": 30, "id": 1457},
    {"subject": "Toán", "question": "Có 9 quả bóng bay 🎈, cho bạn 1 quả bóng bay. Còn mấy quả bóng bay?", "options": ["6", "7", "10", "8"], "correctIndex": 3, "level": 30, "id": 1458},
    {"subject": "Toán", "question": "51 + 25 = ?", "options": ["84", "74", "82", "76"], "correctIndex": 3, "level": 30, "id": 1459},
    {"subject": "Toán", "question": "Số nào lớn nhất?", "options": ["24", "22", "65", "5"], "correctIndex": 2, "level": 30, "id": 1460},
    {"subject": "Toán", "question": "Điền dấu: 55 … 52", "options": ["<", ">", "+", "="], "correctIndex": 1, "level": 30, "id": 1461},
    {"subject": "Toán", "question": "Có 3 chiếc ô tô 🚗, thêm 7 chiếc ô tô nữa. Có tất cả mấy chiếc ô tô?", "options": ["8", "10", "9", "11"], "correctIndex": 1, "level": 30, "id": 1462},
    {"subject": "Toán", "question": "Hôm nay là Thứ Tư. Hôm qua là thứ mấy?", "options": ["Thứ Ba", "Thứ Năm", "Thứ Sáu", "Chủ nhật"], "correctIndex": 0, "level": 30, "id": 1463},
    {"subject": "Toán", "question": "🌸🌸🌸🌸🌸🌸 Có mấy bông hoa?", "options": ["6", "7", "8", "5"], "correctIndex": 0, "level": 30, "id": 1464},
    {"subject": "Toán", "question": "🍎🍎🍎🍎🍎🍎 Có mấy quả táo?", "options": ["5", "6", "7", "4"], "correctIndex": 1, "level": 30, "id": 1465},
    {"subject": "Toán", "question": "Điền dấu: 10 … 33", "options": ["=", ">", "<", "+"], "correctIndex": 2, "level": 30, "id": 1466},
    {"subject": "Toán", "question": "24 + 61 = ?", "options": ["85", "81", "87", "86"], "correctIndex": 0, "level": 30, "id": 1467},
    {"subject": "Toán", "question": "75 + 13 = ?", "options": ["88", "86", "94", "84"], "correctIndex": 0, "level": 30, "id": 1468},
    {"subject": "Toán", "question": "Có 5 con cá 🐟, cho bạn 4 con cá. Còn mấy con cá?", "options": ["3", "0", "2", "1"], "correctIndex": 3, "level": 30, "id": 1469},
    {"subject": "Toán", "question": "Số nào lớn nhất?", "options": ["55", "5", "66", "44"], "correctIndex": 2, "level": 30, "id": 1470},
    {"subject": "Toán", "question": "87 − 40 = ?", "options": ["55", "47", "56", "43"], "correctIndex": 1, "level": 30, "id": 1471},
    {"subject": "Toán", "question": "10 + 42 = ?", "options": ["59", "62", "52", "42"], "correctIndex": 2, "level": 30, "id": 1472},
    {"subject": "Toán", "question": "72 − 1 = ?", "options": ["71", "72", "76", "64"], "correctIndex": 0, "level": 30, "id": 1473},
    {"subject": "Tiếng Việt", "question": "🌙 là gì?", "options": ["Quả táo", "Mặt trăng", "Con dê", "Con cá"], "correctIndex": 1, "level": 30, "id": 1474},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'khóc'?", "options": ["dưới", "tối", "cười", "to"], "correctIndex": 2, "level": 30, "id": 1475},
    {"subject": "Tiếng Việt", "question": "Câu 'Đàn vịt bơi trên ao.' có mấy tiếng?", "options": ["7", "6", "5", "4"], "correctIndex": 2, "level": 30, "id": 1476},
    {"subject": "Tiếng Việt", "question": "Điền từ: Hoa ... thơm.", "options": ["gáy", "nở", "đọc", "chạy"], "correctIndex": 1, "level": 30, "id": 1477},
    {"subject": "Tiếng Việt", "question": "Tiếng 'đỏ' bắt đầu bằng chữ nào?", "options": ["ch", "gi", "đ", "h"], "correctIndex": 2, "level": 30, "id": 1478},
    {"subject": "Tiếng Việt", "question": "Tiếng nào có vần 'au'?", "options": ["bút", "rau", "sơn", "bông"], "correctIndex": 1, "level": 30, "id": 1479},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'ngắn'?", "options": ["thấp", "chậm", "dài", "buồn"], "correctIndex": 2, "level": 30, "id": 1480},
    {"subject": "Tiếng Việt", "question": "Điền từ: Trời ... to.", "options": ["đọc", "nấu", "viết", "mưa"], "correctIndex": 3, "level": 30, "id": 1481},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng?", "options": ["nghe nhạc", "nge nhạc", "quả kam", "cái cẹo"], "correctIndex": 0, "level": 30, "id": 1482},
    {"subject": "Tiếng Việt", "question": "Tiếng 'quạt' bắt đầu bằng chữ nào?", "options": ["ph", "qu", "n", "s"], "correctIndex": 1, "level": 30, "id": 1483},
    {"subject": "Tiếng Việt", "question": "🐸 là gì?", "options": ["Con thỏ", "Con ếch", "Con bò", "Con voi"], "correctIndex": 1, "level": 30, "id": 1484},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'vơi'?", "options": ["dưới", "đầy", "sáng", "mới"], "correctIndex": 1, "level": 30, "id": 1485},
    {"subject": "Tiếng Việt", "question": "🚗 là gì?", "options": ["Ô tô", "Quả cam", "Bắp ngô", "Con ngựa"], "correctIndex": 0, "level": 30, "id": 1486},
    {"subject": "Tiếng Anh", "question": "'Cookie' nghĩa là gì?", "options": ["Quả nho", "Sữa", "Bánh quy", "Kem"], "correctIndex": 2, "level": 30, "id": 1487},
    {"subject": "Tiếng Anh", "question": "'Rabbit' nghĩa là gì?", "options": ["Con ếch", "Con gà", "Con thỏ", "Con hươu cao cổ"], "correctIndex": 2, "level": 30, "id": 1488},
    {"subject": "Tiếng Anh", "question": "'Cánh tay' tiếng Anh là gì?", "options": ["Arm", "Leg", "Hand", "Nose"], "correctIndex": 0, "level": 30, "id": 1489},
    {"subject": "Tiếng Anh", "question": "'One' là số mấy?", "options": ["4", "3", "2", "1"], "correctIndex": 3, "level": 30, "id": 1490},
    {"subject": "Tiếng Anh", "question": "'Ten' là số mấy?", "options": ["9", "10", "11", "7"], "correctIndex": 1, "level": 30, "id": 1491},
    {"subject": "Tiếng Anh", "question": "Số 6 tiếng Anh là gì?", "options": ["Six", "Four", "Eight", "Seven"], "correctIndex": 0, "level": 30, "id": 1492},
    {"subject": "Tiếng Anh", "question": "'Pen' nghĩa là gì?", "options": ["Cặp sách", "Cục tẩy", "Quyển vở", "Bút mực"], "correctIndex": 3, "level": 30, "id": 1493},
    {"subject": "Tiếng Anh", "question": "🥚 tiếng Anh là gì?", "options": ["Juice", "Egg", "Cookie", "Ice cream"], "correctIndex": 1, "level": 30, "id": 1494},
    {"subject": "Tiếng Anh", "question": "🎒 tiếng Anh là gì?", "options": ["Pencil", "Ruler", "Crayon", "School bag"], "correctIndex": 3, "level": 30, "id": 1495},
    {"subject": "Tiếng Anh", "question": "🔵 tiếng Anh là gì?", "options": ["Pink", "Blue", "Brown", "Red"], "correctIndex": 1, "level": 30, "id": 1496},
    {"subject": "Tiếng Anh", "question": "'Con thuyền' tiếng Anh là gì?", "options": ["Kite", "Train", "Boat", "Plane"], "correctIndex": 2, "level": 30, "id": 1497},
    {"subject": "Tiếng Anh", "question": "👂 tiếng Anh là gì?", "options": ["Eye", "Ear", "Foot", "Hand"], "correctIndex": 1, "level": 30, "id": 1498},
    {"subject": "Tiếng Anh", "question": "'Mắt' tiếng Anh là gì?", "options": ["Mouth", "Leg", "Eye", "Tooth"], "correctIndex": 2, "level": 30, "id": 1499},
    {"subject": "Tiếng Anh", "question": "'Orange' nghĩa là gì?", "options": ["Màu cam", "Màu đen", "Màu vàng", "Màu trắng"], "correctIndex": 0, "level": 30, "id": 1500},
    {"subject": "Toán", "question": "4 + 5 bằng mấy?", "options": ["9", "8", "10", "7"], "correctIndex": 0, "level": 1, "id": 1501},
    {"subject": "Toán", "question": "3 + 7 bằng mấy?", "options": ["9", "10", "8", "6"], "correctIndex": 1, "level": 2, "id": 1502},
    {"subject": "Toán", "question": "6 + 2 bằng mấy?", "options": ["7", "9", "8", "5"], "correctIndex": 2, "level": 3, "id": 1503},
    {"subject": "Toán", "question": "9 - 4 bằng mấy?", "options": ["4", "6", "3", "5"], "correctIndex": 3, "level": 4, "id": 1504},
    {"subject": "Toán", "question": "10 - 3 bằng mấy?", "options": ["7", "6", "8", "5"], "correctIndex": 0, "level": 5, "id": 1505},
    {"subject": "Toán", "question": "8 - 5 bằng mấy?", "options": ["2", "3", "4", "5"], "correctIndex": 1, "level": 6, "id": 1506},
    {"subject": "Toán", "question": "7 + 0 bằng mấy?", "options": ["0", "8", "7", "6"], "correctIndex": 2, "level": 1, "id": 1507},
    {"subject": "Toán", "question": "6 - 6 bằng mấy?", "options": ["1", "6", "12", "0"], "correctIndex": 3, "level": 2, "id": 1508},
    {"subject": "Toán", "question": "Số nào lớn nhất trong các số: 4, 9, 2, 7?", "options": ["9", "7", "4", "2"], "correctIndex": 0, "level": 3, "id": 1509},
    {"subject": "Toán", "question": "Số nào bé nhất trong các số: 8, 3, 6, 5?", "options": ["5", "3", "6", "8"], "correctIndex": 1, "level": 4, "id": 1510},
    {"subject": "Toán", "question": "Số liền sau của số 8 là số mấy?", "options": ["7", "10", "9", "6"], "correctIndex": 2, "level": 5, "id": 1511},
    {"subject": "Toán", "question": "Số liền trước của số 6 là số mấy?", "options": ["7", "4", "8", "5"], "correctIndex": 3, "level": 6, "id": 1512},
    {"subject": "Toán", "question": "Hình tam giác có mấy cạnh?", "options": ["3 cạnh", "4 cạnh", "2 cạnh", "5 cạnh"], "correctIndex": 0, "level": 1, "id": 1513},
    {"subject": "Toán", "question": "Có 5 quả táo, thêm 4 quả nữa. Có tất cả mấy quả?", "options": ["8 quả", "9 quả", "10 quả", "7 quả"], "correctIndex": 1, "level": 2, "id": 1514},
    {"subject": "Tiếng Việt", "question": "Điền c hay k vào chỗ trống: “...on cá”?", "options": ["k", "g", "c", "d"], "correctIndex": 2, "level": 3, "id": 1515},
    {"subject": "Tiếng Việt", "question": "Điền c hay k vào chỗ trống: “cái ...éo”?", "options": ["c", "t", "n", "k"], "correctIndex": 3, "level": 4, "id": 1516},
    {"subject": "Tiếng Việt", "question": "Điền g hay gh vào chỗ trống: “cái ...ế”?", "options": ["gh", "g", "ng", "c"], "correctIndex": 0, "level": 5, "id": 1517},
    {"subject": "Tiếng Việt", "question": "Điền g hay gh vào chỗ trống: “con ...à”?", "options": ["gh", "g", "k", "ngh"], "correctIndex": 1, "level": 6, "id": 1518},
    {"subject": "Tiếng Việt", "question": "Điền ng hay ngh vào chỗ trống: “lắng ...e”?", "options": ["ng", "g", "ngh", "gh"], "correctIndex": 2, "level": 1, "id": 1519},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["Mặt chời", "Mặc trời", "Mặc chời", "Mặt trời"], "correctIndex": 3, "level": 2, "id": 1520},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["Bông hoa", "Bông hoan", "Pông hoa", "Bông hỏa"], "correctIndex": 0, "level": 3, "id": 1521},
    {"subject": "Tiếng Việt", "question": "Con vật nào biết gáy “ò ó o” buổi sáng?", "options": ["Con mèo", "Con gà trống", "Con cá", "Con rùa"], "correctIndex": 1, "level": 4, "id": 1522},
    {"subject": "Tiếng Anh", "question": "Số 5 tiếng Anh là gì?", "options": ["four", "six", "five", "two"], "correctIndex": 2, "level": 5, "id": 1523},
    {"subject": "Tiếng Anh", "question": "Số 8 tiếng Anh là gì?", "options": ["seven", "nine", "ten", "eight"], "correctIndex": 3, "level": 6, "id": 1524},
    {"subject": "Tiếng Anh", "question": "Màu vàng tiếng Anh là gì?", "options": ["yellow", "blue", "red", "green"], "correctIndex": 0, "level": 1, "id": 1525},
    {"subject": "Tiếng Anh", "question": "Màu xanh lá tiếng Anh là gì?", "options": ["pink", "green", "black", "white"], "correctIndex": 1, "level": 2, "id": 1526},
    {"subject": "Tiếng Anh", "question": "Con mèo tiếng Anh là gì?", "options": ["dog", "bird", "cat", "fish"], "correctIndex": 2, "level": 3, "id": 1527},
    {"subject": "Tiếng Anh", "question": "Con chó tiếng Anh là gì?", "options": ["cat", "duck", "pig", "dog"], "correctIndex": 3, "level": 4, "id": 1528},
    {"subject": "Tiếng Anh", "question": "Quyển sách tiếng Anh là gì?", "options": ["book", "pen", "bag", "desk"], "correctIndex": 0, "level": 5, "id": 1529},
    {"subject": "Tiếng Anh", "question": "Quả táo tiếng Anh là gì?", "options": ["banana", "apple", "orange", "milk"], "correctIndex": 1, "level": 6, "id": 1530},
  ],
  lucie: [
    {"id": 1, "level": 1, "subject": "Toán", "question": "7 × 8 = ?", "options": ["54", "56", "63", "48"], "correctIndex": 1},
    {"id": 2, "level": 1, "subject": "Toán", "question": "Số liền sau của 999 là số nào?", "options": ["998", "1000", "9910", "1001"], "correctIndex": 1},
    {"id": 3, "level": 1, "subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["Bàn ghế", "Xinh đẹp", "Chạy nhảy", "Quyển vở"], "correctIndex": 2},
    {"id": 4, "level": 1, "subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'chăm chỉ'?", "options": ["Siêng năng", "Lười biếng", "Cần cù", "Chịu khó"], "correctIndex": 1},
    {"id": 5, "level": 1, "subject": "Tiếng Anh", "question": "Con mèo trong tiếng Anh là gì?", "options": ["Dog", "Cat", "Bird", "Fish"], "correctIndex": 1},
    {"subject": "Toán", "question": "40 − 11 = ?", "options": ["39", "30", "28", "29"], "correctIndex": 3, "level": 1, "id": 6},
    {"subject": "Toán", "question": "10 : 2 = ?", "options": ["5", "4", "2", "6"], "correctIndex": 0, "level": 1, "id": 7},
    {"subject": "Toán", "question": "Mỗi hàng có 5 chiếc xe. 8 hàng như thế có bao nhiêu chiếc xe?", "options": ["40 chiếc", "13 chiếc", "32 chiếc", "45 chiếc"], "correctIndex": 0, "level": 1, "id": 8},
    {"subject": "Toán", "question": "1/5 của 10 là:", "options": ["5", "7", "2", "3"], "correctIndex": 2, "level": 1, "id": 9},
    {"subject": "Toán", "question": "Mỗi nhóm có 6 bạn. 9 nhóm như thế có bao nhiêu bạn?", "options": ["60 bạn", "54 bạn", "15 bạn", "45 bạn"], "correctIndex": 1, "level": 1, "id": 10},
    {"subject": "Toán", "question": "16 : 2 = ?", "options": ["7", "10", "8", "6"], "correctIndex": 2, "level": 1, "id": 11},
    {"subject": "Toán", "question": "1/4 của 28 là:", "options": ["8", "11", "7", "24"], "correctIndex": 2, "level": 1, "id": 12},
    {"subject": "Toán", "question": "36 : ? = 6. Số cần điền là:", "options": ["3", "7", "4", "6"], "correctIndex": 3, "level": 1, "id": 13},
    {"subject": "Toán", "question": "Giảm 22 đi 2 lần được:", "options": ["12", "20", "24", "11"], "correctIndex": 3, "level": 1, "id": 14},
    {"subject": "Toán", "question": "Có 21 quả táo chia đều cho 3 đĩa. Mỗi đĩa được mấy quả?", "options": ["5 quả", "9 quả", "4 quả", "7 quả"], "correctIndex": 3, "level": 1, "id": 15},
    {"subject": "Toán", "question": "Có 27 học sinh chia đều cho 9 nhóm. Mỗi nhóm được mấy bạn?", "options": ["4 bạn", "3 bạn", "6 bạn", "1 bạn"], "correctIndex": 1, "level": 1, "id": 16},
    {"subject": "Toán", "question": "Lan có 53 quyển truyện. Hoa có nhiều hơn Lan 43 quyển truyện. Hoa có bao nhiêu quyển truyện?", "options": ["96", "106", "10", "95"], "correctIndex": 0, "level": 1, "id": 17},
    {"subject": "Toán", "question": "Mỗi đĩa có 6 quả cam. 5 đĩa như thế có bao nhiêu quả cam?", "options": ["30 quả", "25 quả", "11 quả", "36 quả"], "correctIndex": 0, "level": 1, "id": 18},
    {"subject": "Toán", "question": "27 + 15 = ?", "options": ["52", "42", "41", "32"], "correctIndex": 1, "level": 1, "id": 19},
    {"subject": "Toán", "question": "14 + 41 = ?", "options": ["56", "155", "45", "55"], "correctIndex": 3, "level": 1, "id": 20},
    {"subject": "Toán", "question": "Gấp 4 lên 6 lần được:", "options": ["30", "24", "10", "20"], "correctIndex": 1, "level": 1, "id": 21},
    {"subject": "Toán", "question": "1/4 của 20 là:", "options": ["16", "6", "5", "9"], "correctIndex": 2, "level": 1, "id": 22},
    {"subject": "Toán", "question": "29 + 16 = ?", "options": ["35", "46", "45", "55"], "correctIndex": 2, "level": 1, "id": 23},
    {"subject": "Tiếng Việt", "question": "'Đường lên dốc trơn như mỡ.' — Đường lên dốc được so sánh với gì?", "options": ["những ngôi sao", "sóc", "mỡ", "đường lên dốc"], "correctIndex": 2, "level": 1, "id": 24},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["lấp lánh", "con mèo", "cao vút", "nghe nhạc"], "correctIndex": 1, "level": 1, "id": 25},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Trăng tròn như quả bóng.', sự vật nào được so sánh?", "options": ["hoa đầu cành", "sóc", "trăng", "quả bóng"], "correctIndex": 2, "level": 1, "id": 26},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["lấp lánh", "quét nhà", "đen nhánh", "cái bút"], "correctIndex": 1, "level": 1, "id": 27},
    {"subject": "Tiếng Việt", "question": "Câu 'Kính trên nhường dưới' khuyên ta điều gì?", "options": ["yêu thương mọi người như chính mình", "chơi cả ngày", "ăn thật nhiều", "lễ phép với người lớn, nhường nhịn em nhỏ"], "correctIndex": 3, "level": 1, "id": 28},
    {"subject": "Tiếng Việt", "question": "Câu 'Tốt gỗ hơn tốt nước sơn' khuyên ta điều gì?", "options": ["chơi cả ngày", "không cần học", "tính nết quan trọng hơn vẻ ngoài", "chạy thật nhanh"], "correctIndex": 2, "level": 1, "id": 29},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Chú gà trống gáy vang cả xóm.', từ chỉ hoạt động là:", "options": ["vang", "chú gà trống", "gáy", "cả"], "correctIndex": 2, "level": 1, "id": 30},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'bừa bộn'?", "options": ["dài", "gọn gàng", "xa", "lên"], "correctIndex": 1, "level": 1, "id": 31},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["tre trở", "che chỡ", "tre chở", "che chở"], "correctIndex": 3, "level": 1, "id": 32},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["tưới cây", "quyển vở", "nhỏ xíu", "học sinh"], "correctIndex": 2, "level": 1, "id": 33},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'trắng'?", "options": ["đen", "thấp", "chăm chỉ", "già"], "correctIndex": 0, "level": 1, "id": 34},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'hỗ trợ'?", "options": ["bè bạn", "giúp đỡ", "cần cù", "căn nhà"], "correctIndex": 1, "level": 1, "id": 35},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'thông minh'?", "options": ["ngọt", "thắng", "ngốc nghếch", "đắng"], "correctIndex": 2, "level": 1, "id": 36},
    {"subject": "Tiếng Anh", "question": "'Màu nâu' tiếng Anh là gì?", "options": ["Brown", "Blue", "Purple", "Black"], "correctIndex": 0, "level": 1, "id": 37},
    {"subject": "Tiếng Anh", "question": "'Where is the cat?' — Chọn câu trả lời đúng:", "options": ["I'm seven.", "It's black.", "Yes, I can.", "It's under the table."], "correctIndex": 3, "level": 1, "id": 38},
    {"subject": "Tiếng Anh", "question": "'Goodbye' nghĩa là gì?", "options": ["Xin lỗi", "Tạm biệt", "Hẹn gặp lại", "Vâng / Có"], "correctIndex": 1, "level": 1, "id": 39},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Dog", "Cat", "Egg", "Bear"], "correctIndex": 2, "level": 1, "id": 40},
    {"subject": "Tiếng Anh", "question": "'Can you swim?' — Chọn câu trả lời đúng:", "options": ["My name is Nam.", "It's blue.", "Yes, it is.", "Yes, I can."], "correctIndex": 3, "level": 1, "id": 41},
    {"subject": "Tiếng Anh", "question": "'Goodbye!' — Chọn câu trả lời đúng:", "options": ["It's red.", "I'm seven.", "Bye! See you later.", "My name is Lan."], "correctIndex": 2, "level": 1, "id": 42},
    {"subject": "Tiếng Anh", "question": "'Sleep' nghĩa là gì?", "options": ["Ngủ", "Vẽ", "Hát", "Chạy"], "correctIndex": 0, "level": 1, "id": 43},
    {"subject": "Tiếng Anh", "question": "'Train' nghĩa là gì?", "options": ["Tàu hỏa", "Con diều", "Gấu bông", "Máy bay"], "correctIndex": 0, "level": 1, "id": 44},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ nơi chốn?", "options": ["Bedroom", "Purple", "Mouth", "Run"], "correctIndex": 0, "level": 1, "id": 45},
    {"subject": "Tiếng Anh", "question": "'Is this a book?' — Chọn câu trả lời đúng:", "options": ["It's red.", "My name is Mai.", "I'm fine.", "Yes, it is."], "correctIndex": 3, "level": 1, "id": 46},
    {"subject": "Tiếng Anh", "question": "Cô giáo bảo 'Giơ tay lên', tiếng Anh là:", "options": ["Open your book!", "Raise your hand!", "Stand up!", "Sit down!"], "correctIndex": 1, "level": 1, "id": 47},
    {"subject": "Tiếng Anh", "question": "'Quả xoài' tiếng Anh là gì?", "options": ["Orange", "Juice", "Mango", "Milk"], "correctIndex": 2, "level": 1, "id": 48},
    {"subject": "Tiếng Anh", "question": "'See you later' nghĩa là gì?", "options": ["Không", "Hẹn gặp lại", "Vâng / Có", "Chào buổi sáng"], "correctIndex": 1, "level": 1, "id": 49},
    {"subject": "Tiếng Anh", "question": "Từ nào viết đúng chính tả?", "options": ["pancil", "pencel", "pencil", "pensil"], "correctIndex": 2, "level": 1, "id": 50},
    {"id": 51, "level": 2, "subject": "Toán", "question": "48 : 6 = ?", "options": ["6", "7", "9", "8"], "correctIndex": 3},
    {"id": 52, "level": 2, "subject": "Toán", "question": "1 giờ = ? phút", "options": ["30", "100", "60", "24"], "correctIndex": 2},
    {"id": 53, "level": 2, "subject": "Tiếng Việt", "question": "Câu 'Mẹ em là giáo viên.' thuộc kiểu câu nào?", "options": ["Ai làm gì?", "Ai thế nào?", "Ai là gì?", "Khi nào?"], "correctIndex": 2},
    {"id": 54, "level": 2, "subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["xạch sẽ", "sạch sẽ", "sạch xẽ", "xạch xẽ"], "correctIndex": 1},
    {"id": 55, "level": 2, "subject": "Tiếng Anh", "question": "'How old are you?' — Chọn câu trả lời đúng:", "options": ["I am fine.", "I am eight years old.", "My name is Lucie.", "Thank you."], "correctIndex": 1},
    {"subject": "Toán", "question": "20 : 2 = ?", "options": ["7", "10", "13", "8"], "correctIndex": 1, "level": 2, "id": 56},
    {"subject": "Toán", "question": "Thùng thứ nhất có 58 lít nước. thùng thứ hai có ít hơn Thùng thứ nhất 24 lít nước. thùng thứ hai có bao nhiêu lít nước?", "options": ["82", "44", "33", "34"], "correctIndex": 3, "level": 2, "id": 57},
    {"subject": "Toán", "question": "Nam có 88 viên bi. Minh có ít hơn Nam 28 viên bi. Minh có bao nhiêu viên bi?", "options": ["70", "116", "60", "59"], "correctIndex": 2, "level": 2, "id": 58},
    {"subject": "Toán", "question": "41 + 41 = ?", "options": ["92", "82", "81", "182"], "correctIndex": 1, "level": 2, "id": 59},
    {"subject": "Toán", "question": "21 − 14 = ?", "options": ["6", "7", "17", "107"], "correctIndex": 1, "level": 2, "id": 60},
    {"subject": "Toán", "question": "26 + 37 = ?", "options": ["163", "63", "53", "73"], "correctIndex": 1, "level": 2, "id": 61},
    {"subject": "Toán", "question": "1/4 của 8 là:", "options": ["3", "6", "2", "4"], "correctIndex": 2, "level": 2, "id": 62},
    {"subject": "Toán", "question": "Thùng thứ nhất có 30 lít nước. thùng thứ hai có nhiều hơn Thùng thứ nhất 16 lít nước. thùng thứ hai có bao nhiêu lít nước?", "options": ["14", "45", "56", "46"], "correctIndex": 3, "level": 2, "id": 63},
    {"subject": "Toán", "question": "Mỗi hộp có 6 cái bánh. 3 hộp như thế có bao nhiêu cái bánh?", "options": ["9 cái", "15 cái", "18 cái", "24 cái"], "correctIndex": 2, "level": 2, "id": 64},
    {"subject": "Toán", "question": "Có 30 cái kẹo chia đều cho 6 bạn. Mỗi bạn được mấy cái?", "options": ["6 cái", "4 cái", "5 cái", "3 cái"], "correctIndex": 2, "level": 2, "id": 65},
    {"subject": "Toán", "question": "43 − 35 = ?", "options": ["8", "7", "18", "108"], "correctIndex": 0, "level": 2, "id": 66},
    {"subject": "Toán", "question": "21 + 11 = ?", "options": ["132", "33", "32", "31"], "correctIndex": 2, "level": 2, "id": 67},
    {"subject": "Toán", "question": "Có 81 bông hoa chia đều cho 9 lọ. Mỗi lọ được mấy bông?", "options": ["7 bông", "12 bông", "10 bông", "9 bông"], "correctIndex": 3, "level": 2, "id": 68},
    {"subject": "Toán", "question": "Giảm 16 đi 4 lần được:", "options": ["5", "12", "4", "20"], "correctIndex": 2, "level": 2, "id": 69},
    {"subject": "Toán", "question": "21 + 16 = ?", "options": ["36", "27", "38", "37"], "correctIndex": 3, "level": 2, "id": 70},
    {"subject": "Toán", "question": "43 − 41 = ?", "options": ["1", "2", "102", "3"], "correctIndex": 1, "level": 2, "id": 71},
    {"subject": "Toán", "question": "Nam có 64 viên bi. Minh có ít hơn Nam 14 viên bi. Minh có bao nhiêu viên bi?", "options": ["78", "60", "50", "49"], "correctIndex": 2, "level": 2, "id": 72},
    {"subject": "Toán", "question": "Có 64 học sinh chia đều cho 8 nhóm. Mỗi nhóm được mấy bạn?", "options": ["10 bạn", "7 bạn", "8 bạn", "11 bạn"], "correctIndex": 2, "level": 2, "id": 73},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'sáng dạ'?", "options": ["trung thực", "căn nhà", "thông minh", "ba"], "correctIndex": 2, "level": 2, "id": 74},
    {"subject": "Tiếng Việt", "question": "Câu 'Đi một ngày đàng, học một sàng khôn' khuyên ta điều gì?", "options": ["đi nhiều thì học được nhiều", "anh em phải yêu thương nhau", "giúp đỡ người khó khăn", "lễ phép với người lớn, nhường nhịn em nhỏ"], "correctIndex": 0, "level": 2, "id": 75},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Đàn cò trắng bay qua cánh đồng.', từ chỉ hoạt động là:", "options": ["qua", "bay", "đàn cò", "trắng"], "correctIndex": 1, "level": 2, "id": 76},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Chú cún nhỏ vẫy cái đuôi ngắn.', từ chỉ đặc điểm là:", "options": ["ngắn", "nhỏ", "chú cún", "vẫy"], "correctIndex": 0, "level": 2, "id": 77},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'im lặng'?", "options": ["to lớn", "thật thà", "lặng im", "thông minh"], "correctIndex": 2, "level": 2, "id": 78},
    {"subject": "Tiếng Việt", "question": "Câu 'Học thầy không tày học bạn' khuyên ta điều gì?", "options": ["tính nết quan trọng hơn vẻ ngoài", "biết ơn người đi trước", "học hỏi từ bạn bè", "lễ phép với người lớn, nhường nhịn em nhỏ"], "correctIndex": 2, "level": 2, "id": 79},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["giặt áo", "cô giáo", "chăm chỉ", "nhảy dây"], "correctIndex": 1, "level": 2, "id": 80},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Dòng sông xanh chảy hiền hòa.', từ chỉ đặc điểm là:", "options": ["chảy", "hiền hòa", "dòng sông", "xanh"], "correctIndex": 1, "level": 2, "id": 81},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["chạy nhảy", "dòng sông", "mềm mại", "đen nhánh"], "correctIndex": 1, "level": 2, "id": 82},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["cây bàng", "con đường", "nhanh nhẹn", "bơi"], "correctIndex": 3, "level": 2, "id": 83},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'hiền lành'?", "options": ["hiền hậu", "săn sóc", "chăm chỉ", "dữ tợn"], "correctIndex": 0, "level": 2, "id": 84},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["đọc sách", "dịu dàng", "quyển vở", "nhảy dây"], "correctIndex": 2, "level": 2, "id": 85},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["đôi dép", "nhanh nhẹn", "leo núi", "bơi"], "correctIndex": 1, "level": 2, "id": 86},
    {"subject": "Tiếng Anh", "question": "'What can you do?' — Chọn câu trả lời đúng:", "options": ["It's pink.", "I'm nine.", "It's rainy.", "I can dance."], "correctIndex": 3, "level": 2, "id": 87},
    {"subject": "Tiếng Anh", "question": "'Mother' nghĩa là gì?", "options": ["Chị/em gái", "Em bé", "Ông", "Mẹ"], "correctIndex": 3, "level": 2, "id": 88},
    {"subject": "Tiếng Anh", "question": "'Brother' nghĩa là gì?", "options": ["Bà", "Ông", "Anh/em trai", "Em bé"], "correctIndex": 2, "level": 2, "id": 89},
    {"subject": "Tiếng Anh", "question": "'Thirteen' là số mấy?", "options": ["13", "12", "14", "15"], "correctIndex": 0, "level": 2, "id": 90},
    {"subject": "Tiếng Anh", "question": "'How old are you?' — Chọn câu trả lời đúng:", "options": ["I'm fine.", "It's blue.", "My name is Lan.", "I'm eight years old."], "correctIndex": 3, "level": 2, "id": 91},
    {"subject": "Tiếng Anh", "question": "'Yellow' nghĩa là gì?", "options": ["Màu cam", "Màu đen", "Màu vàng", "Màu trắng"], "correctIndex": 2, "level": 2, "id": 92},
    {"subject": "Tiếng Anh", "question": "'Doll' nghĩa là gì?", "options": ["Búp bê", "Con diều", "Máy bay", "Gấu bông"], "correctIndex": 0, "level": 2, "id": 93},
    {"subject": "Tiếng Anh", "question": "'Listen!' nghĩa là gì?", "options": ["Lắng nghe", "Gấp sách lại", "Giơ tay lên", "Nhìn"], "correctIndex": 0, "level": 2, "id": 94},
    {"subject": "Tiếng Anh", "question": "Từ nào viết đúng chính tả?", "options": ["eliphant", "elephent", "elephant", "elefant"], "correctIndex": 2, "level": 2, "id": 95},
    {"subject": "Tiếng Anh", "question": "'Yes' nghĩa là gì?", "options": ["Chào buổi sáng", "Vâng / Có", "Xin lỗi", "Chúc ngủ ngon"], "correctIndex": 1, "level": 2, "id": 96},
    {"subject": "Tiếng Anh", "question": "Cô giáo bảo 'Lắng nghe', tiếng Anh là:", "options": ["Open your book!", "Sit down!", "Stand up!", "Listen!"], "correctIndex": 3, "level": 2, "id": 97},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Mango", "Grapes", "Grandfather", "Orange"], "correctIndex": 2, "level": 2, "id": 98},
    {"subject": "Tiếng Anh", "question": "'Sorry' nghĩa là gì?", "options": ["Chào buổi sáng", "Tạm biệt", "Chúc ngủ ngon", "Xin lỗi"], "correctIndex": 3, "level": 2, "id": 99},
    {"subject": "Tiếng Anh", "question": "'What's the weather like?' — Chọn câu trả lời đúng:", "options": ["He is my brother.", "It's a dog.", "It's sunny.", "I'm fine."], "correctIndex": 2, "level": 2, "id": 100},
    {"id": 101, "level": 3, "subject": "Toán", "question": "6 × 7 = ?", "options": ["42", "36", "48", "49"], "correctIndex": 0},
    {"id": 102, "level": 3, "subject": "Toán", "question": "Số 'năm trăm linh tư' viết là:", "options": ["540", "504", "5004", "450"], "correctIndex": 1},
    {"id": 103, "level": 3, "subject": "Tiếng Việt", "question": "Từ nào chỉ đặc điểm?", "options": ["Hiền lành", "Cô giáo", "Đọc sách", "Cái cặp"], "correctIndex": 0},
    {"id": 104, "level": 3, "subject": "Tiếng Việt", "question": "'Mặt trăng tròn như quả bóng.' — Sự vật nào được so sánh với quả bóng?", "options": ["Quả bóng", "Mặt trăng", "Bầu trời", "Ngôi sao"], "correctIndex": 1},
    {"id": 105, "level": 3, "subject": "Tiếng Anh", "question": "Màu xanh da trời trong tiếng Anh là gì?", "options": ["Red", "Blue", "Yellow", "Black"], "correctIndex": 1},
    {"subject": "Toán", "question": "Mỗi đĩa có 5 quả cam. 6 đĩa như thế có bao nhiêu quả cam?", "options": ["35 quả", "30 quả", "24 quả", "11 quả"], "correctIndex": 1, "level": 3, "id": 106},
    {"subject": "Toán", "question": "Mỗi chồng có 9 quyển vở. 4 chồng như thế có bao nhiêu quyển vở?", "options": ["36 quyển", "32 quyển", "45 quyển", "13 quyển"], "correctIndex": 0, "level": 3, "id": 107},
    {"subject": "Toán", "question": "Giảm 36 đi 4 lần được:", "options": ["9", "32", "40", "10"], "correctIndex": 0, "level": 3, "id": 108},
    {"subject": "Toán", "question": "4 × 7 = ?", "options": ["31", "28", "24", "23"], "correctIndex": 1, "level": 3, "id": 109},
    {"subject": "Toán", "question": "1/2 của 18 là:", "options": ["10", "9", "11", "16"], "correctIndex": 1, "level": 3, "id": 110},
    {"subject": "Toán", "question": "Mỗi đĩa có 5 quả cam. 4 đĩa như thế có bao nhiêu quả cam?", "options": ["9 quả", "16 quả", "20 quả", "25 quả"], "correctIndex": 2, "level": 3, "id": 111},
    {"subject": "Toán", "question": "Có 12 quả táo chia đều cho 2 đĩa. Mỗi đĩa được mấy quả?", "options": ["8 quả", "3 quả", "6 quả", "7 quả"], "correctIndex": 2, "level": 3, "id": 112},
    {"subject": "Toán", "question": "48 : ? = 6. Số cần điền là:", "options": ["5", "6", "7", "8"], "correctIndex": 3, "level": 3, "id": 113},
    {"subject": "Toán", "question": "1/6 của 54 là:", "options": ["15", "10", "9", "48"], "correctIndex": 2, "level": 3, "id": 114},
    {"subject": "Toán", "question": "2 × 5 = ?", "options": ["10", "14", "16", "5"], "correctIndex": 0, "level": 3, "id": 115},
    {"subject": "Toán", "question": "1/3 của 18 là:", "options": ["9", "6", "7", "15"], "correctIndex": 1, "level": 3, "id": 116},
    {"subject": "Toán", "question": "1/3 của 21 là:", "options": ["10", "7", "18", "8"], "correctIndex": 1, "level": 3, "id": 117},
    {"subject": "Toán", "question": "Giảm 48 đi 6 lần được:", "options": ["54", "8", "9", "42"], "correctIndex": 1, "level": 3, "id": 118},
    {"subject": "Toán", "question": "31 + 44 = ?", "options": ["75", "74", "76", "65"], "correctIndex": 0, "level": 3, "id": 119},
    {"subject": "Toán", "question": "1/3 của 12 là:", "options": ["4", "5", "9", "7"], "correctIndex": 0, "level": 3, "id": 120},
    {"subject": "Toán", "question": "20 : ? = 5. Số cần điền là:", "options": ["2", "6", "5", "4"], "correctIndex": 3, "level": 3, "id": 121},
    {"subject": "Toán", "question": "Giảm 24 đi 3 lần được:", "options": ["8", "21", "27", "9"], "correctIndex": 0, "level": 3, "id": 122},
    {"subject": "Toán", "question": "1/5 của 30 là:", "options": ["6", "7", "11", "25"], "correctIndex": 0, "level": 3, "id": 123},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Bé lau chiếc bàn sạch bóng.', từ chỉ đặc điểm là:", "options": ["bé", "lau", "chiếc", "sạch bóng"], "correctIndex": 3, "level": 3, "id": 124},
    {"subject": "Tiếng Việt", "question": "Câu 'Thương người như thể thương thân' khuyên ta điều gì?", "options": ["ngủ thật sớm", "biết ơn người làm ra thành quả", "yêu thương mọi người như chính mình", "chạy thật nhanh"], "correctIndex": 2, "level": 3, "id": 125},
    {"subject": "Tiếng Việt", "question": "'Tiếng suối trong như tiếng hát xa.' — Tiếng suối được so sánh với gì?", "options": ["tiếng hát xa", "những ngôi sao", "tiếng suối", "quả cầu lửa"], "correctIndex": 0, "level": 3, "id": 126},
    {"subject": "Tiếng Việt", "question": "'Lá cờ đỏ thắm như máu.' — Lá cờ được so sánh với gì?", "options": ["tiếng hát xa", "máu", "lá cờ", "ngàn con mắt"], "correctIndex": 1, "level": 3, "id": 127},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Bạn Nam đá quả bóng tròn.', từ chỉ đặc điểm là:", "options": ["quả", "đá", "tròn", "bạn Nam"], "correctIndex": 2, "level": 3, "id": 128},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Những ngôi sao như ngàn con mắt.', sự vật nào được so sánh?", "options": ["tán bàng", "mỡ", "ngàn con mắt", "những ngôi sao"], "correctIndex": 3, "level": 3, "id": 129},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Đàn cò trắng bay qua cánh đồng.', từ chỉ đặc điểm là:", "options": ["trắng", "qua", "đàn cò", "bay"], "correctIndex": 0, "level": 3, "id": 130},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Hai bàn tay em như hoa đầu cành.', sự vật nào được so sánh?", "options": ["mắt bé", "mẹ hiền", "hoa đầu cành", "hai bàn tay em"], "correctIndex": 3, "level": 3, "id": 131},
    {"subject": "Tiếng Việt", "question": "Câu 'Hà Nội là thủ đô của nước ta.' thuộc kiểu câu nào?", "options": ["Vì sao?", "Ai là gì?", "Ai thế nào?", "Ai làm gì?"], "correctIndex": 1, "level": 3, "id": 132},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Đàn kiến chăm chỉ tha mồi về tổ.', từ chỉ đặc điểm là:", "options": ["đàn kiến", "tha", "chăm chỉ", "mồi"], "correctIndex": 2, "level": 3, "id": 133},
    {"subject": "Tiếng Việt", "question": "Câu 'Nước chảy đá mòn' khuyên ta điều gì?", "options": ["ăn thật nhiều", "kiên trì sẽ thành công", "ngủ thật sớm", "không cần học"], "correctIndex": 1, "level": 3, "id": 134},
    {"subject": "Tiếng Việt", "question": "Cuối câu 'Bạn tên là gì …' cần đặt dấu gì?", "options": ["Dấu chấm hỏi", "Dấu phẩy", "Dấu chấm than", "Dấu chấm"], "correctIndex": 0, "level": 3, "id": 135},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Lá cờ đỏ thắm như máu.', sự vật nào được so sánh?", "options": ["sao", "máu", "lá cờ", "ngàn con mắt"], "correctIndex": 2, "level": 3, "id": 136},
    {"subject": "Tiếng Anh", "question": "Từ nào viết đúng chính tả?", "options": ["flower", "flouer", "flawer", "flowr"], "correctIndex": 0, "level": 3, "id": 137},
    {"subject": "Tiếng Anh", "question": "Từ nào viết đúng chính tả?", "options": ["school", "skool", "scool", "shcool"], "correctIndex": 0, "level": 3, "id": 138},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Grandfather", "Father", "Sister", "School"], "correctIndex": 3, "level": 3, "id": 139},
    {"subject": "Tiếng Anh", "question": "Từ nào viết đúng chính tả?", "options": ["mankey", "monky", "monkey", "monkei"], "correctIndex": 2, "level": 3, "id": 140},
    {"subject": "Tiếng Anh", "question": "'Good night' nghĩa là gì?", "options": ["Xin lỗi", "Chúc ngủ ngon", "Chào buổi sáng", "Hẹn gặp lại"], "correctIndex": 1, "level": 3, "id": 141},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Brother", "Yo-yo", "Kite", "Bike"], "correctIndex": 0, "level": 3, "id": 142},
    {"subject": "Tiếng Anh", "question": "'Con gấu' tiếng Anh là gì?", "options": ["Giraffe", "Bear", "Monkey", "Turtle"], "correctIndex": 1, "level": 3, "id": 143},
    {"subject": "Tiếng Anh", "question": "Cô giáo bảo 'Gấp sách lại', tiếng Anh là:", "options": ["Open your book!", "Stand up!", "Close your book!", "Sit down!"], "correctIndex": 2, "level": 3, "id": 144},
    {"subject": "Tiếng Anh", "question": "'Thirty' là số mấy?", "options": ["20", "30", "13", "40"], "correctIndex": 1, "level": 3, "id": 145},
    {"subject": "Tiếng Anh", "question": "'Đọc' tiếng Anh là gì?", "options": ["Write", "Run", "Read", "Sleep"], "correctIndex": 2, "level": 3, "id": 146},
    {"subject": "Tiếng Anh", "question": "'What's his name?' — Chọn câu trả lời đúng:", "options": ["He is fine.", "I'm eight.", "It's a ball.", "His name is Nam."], "correctIndex": 3, "level": 3, "id": 147},
    {"subject": "Tiếng Anh", "question": "'No' nghĩa là gì?", "options": ["Cảm ơn", "Hẹn gặp lại", "Không", "Vâng / Có"], "correctIndex": 2, "level": 3, "id": 148},
    {"subject": "Tiếng Anh", "question": "'Yo-yo' nghĩa là gì?", "options": ["Quả bóng", "Cái yo-yo", "Gấu bông", "Búp bê"], "correctIndex": 1, "level": 3, "id": 149},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Apple", "Cat", "Fish", "Duck"], "correctIndex": 0, "level": 3, "id": 150},
    {"id": 151, "level": 4, "subject": "Toán", "question": "56 : 8 = ?", "options": ["6", "7", "8", "9"], "correctIndex": 1},
    {"id": 152, "level": 4, "subject": "Toán", "question": "Gấp 6 lên 4 lần được bao nhiêu?", "options": ["10", "24", "2", "20"], "correctIndex": 1},
    {"id": 153, "level": 4, "subject": "Tiếng Việt", "question": "Từ nào cùng nghĩa với 'to lớn'?", "options": ["Nhỏ bé", "Khổng lồ", "Thấp bé", "Xinh xắn"], "correctIndex": 1},
    {"id": 154, "level": 4, "subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["chăng sáng", "trăng sáng", "trăng xáng", "chăng xáng"], "correctIndex": 1},
    {"id": 155, "level": 4, "subject": "Tiếng Anh", "question": "'What is your name?' nghĩa là gì?", "options": ["Bạn bao nhiêu tuổi?", "Bạn tên là gì?", "Bạn khỏe không?", "Đây là cái gì?"], "correctIndex": 1},
    {"subject": "Toán", "question": "Lớp 3A có 42 bông hoa điểm tốt. Lớp 3B có nhiều hơn Lớp 3A 10 bông hoa điểm tốt. Lớp 3B có bao nhiêu bông hoa điểm tốt?", "options": ["51", "62", "32", "52"], "correctIndex": 3, "level": 4, "id": 156},
    {"subject": "Toán", "question": "Gấp 12 lên 4 lần được:", "options": ["16", "36", "48", "52"], "correctIndex": 2, "level": 4, "id": 157},
    {"subject": "Toán", "question": "90 : 9 = ?", "options": ["9", "11", "7", "10"], "correctIndex": 3, "level": 4, "id": 158},
    {"subject": "Toán", "question": "Mỗi chồng có 6 quyển vở. 3 chồng như thế có bao nhiêu quyển vở?", "options": ["15 quyển", "9 quyển", "18 quyển", "24 quyển"], "correctIndex": 2, "level": 4, "id": 159},
    {"subject": "Toán", "question": "Mỗi đĩa có 6 quả cam. 6 đĩa như thế có bao nhiêu quả cam?", "options": ["36 quả", "30 quả", "42 quả", "12 quả"], "correctIndex": 0, "level": 4, "id": 160},
    {"subject": "Toán", "question": "1/5 của 35 là:", "options": ["7", "8", "30", "12"], "correctIndex": 0, "level": 4, "id": 161},
    {"subject": "Toán", "question": "Lớp 3A có 55 bông hoa điểm tốt. Lớp 3B có nhiều hơn Lớp 3A 6 bông hoa điểm tốt. Lớp 3B có bao nhiêu bông hoa điểm tốt?", "options": ["60", "71", "49", "61"], "correctIndex": 3, "level": 4, "id": 162},
    {"subject": "Toán", "question": "3 × 6 = ?", "options": ["18", "23", "15", "16"], "correctIndex": 0, "level": 4, "id": 163},
    {"subject": "Toán", "question": "? × 5 = 20. Số cần điền là:", "options": ["7", "3", "4", "1"], "correctIndex": 2, "level": 4, "id": 164},
    {"subject": "Toán", "question": "14 + 49 = ?", "options": ["63", "73", "62", "64"], "correctIndex": 0, "level": 4, "id": 165},
    {"subject": "Toán", "question": "3 × 3 = ?", "options": ["13", "7", "9", "10"], "correctIndex": 2, "level": 4, "id": 166},
    {"subject": "Toán", "question": "3 × 5 = ?", "options": ["16", "12", "15", "18"], "correctIndex": 2, "level": 4, "id": 167},
    {"subject": "Toán", "question": "45 : 9 = ?", "options": ["4", "2", "7", "5"], "correctIndex": 3, "level": 4, "id": 168},
    {"subject": "Toán", "question": "Gấp 7 lên 6 lần được:", "options": ["13", "35", "42", "48"], "correctIndex": 2, "level": 4, "id": 169},
    {"subject": "Toán", "question": "Tổ Một có 88 cây. Tổ Hai có ít hơn Tổ Một 39 cây. Tổ Hai có bao nhiêu cây?", "options": ["48", "127", "49", "59"], "correctIndex": 2, "level": 4, "id": 170},
    {"subject": "Toán", "question": "6 × 9 = ?", "options": ["54", "60", "59", "58"], "correctIndex": 0, "level": 4, "id": 171},
    {"subject": "Toán", "question": "21 : 7 = ?", "options": ["1", "5", "2", "3"], "correctIndex": 3, "level": 4, "id": 172},
    {"subject": "Toán", "question": "Mỗi lọ có 3 bông hoa. 8 lọ như thế có bao nhiêu bông hoa?", "options": ["24 bông", "27 bông", "16 bông", "11 bông"], "correctIndex": 0, "level": 4, "id": 173},
    {"subject": "Tiếng Việt", "question": "Câu 'Ăn quả nhớ kẻ trồng cây' khuyên ta điều gì?", "options": ["biết ơn người làm ra thành quả", "chơi cả ngày", "không cần học", "học hỏi từ bạn bè"], "correctIndex": 0, "level": 4, "id": 174},
    {"subject": "Tiếng Việt", "question": "Câu 'Nước suối mát lạnh.' thuộc kiểu câu nào?", "options": ["Vì sao?", "Ai làm gì?", "Ai là gì?", "Ai thế nào?"], "correctIndex": 3, "level": 4, "id": 175},
    {"subject": "Tiếng Việt", "question": "Cuối câu 'A, mẹ về rồi …' cần đặt dấu gì?", "options": ["Dấu chấm", "Dấu phẩy", "Dấu chấm than", "Dấu chấm hỏi"], "correctIndex": 2, "level": 4, "id": 176},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'xinh xắn'?", "options": ["giúp đỡ", "học tập", "bao la", "xinh đẹp"], "correctIndex": 3, "level": 4, "id": 177},
    {"subject": "Tiếng Việt", "question": "Câu 'Bông hồng rất thơm.' thuộc kiểu câu nào?", "options": ["Ai làm gì?", "Vì sao?", "Ai thế nào?", "Ai là gì?"], "correctIndex": 2, "level": 4, "id": 178},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["trò chơi", "trò trơi", "chò chơi", "chò trơi"], "correctIndex": 0, "level": 4, "id": 179},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'long lanh'?", "options": ["bé xíu", "trung thực", "giúp đỡ", "lấp lánh"], "correctIndex": 3, "level": 4, "id": 180},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'trung thực'?", "options": ["tổ quốc", "sáng dạ", "thật thà", "ngôi nhà"], "correctIndex": 2, "level": 4, "id": 181},
    {"subject": "Tiếng Việt", "question": "Cuối câu 'Vì sao bầu trời có màu xanh …' cần đặt dấu gì?", "options": ["Dấu chấm than", "Dấu chấm", "Dấu chấm hỏi", "Dấu phẩy"], "correctIndex": 2, "level": 4, "id": 182},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Cô giáo như mẹ hiền.', sự vật nào được so sánh?", "options": ["những ngôi sao", "cô giáo", "mẹ hiền", "hoa đầu cành"], "correctIndex": 1, "level": 4, "id": 183},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["đọc sách", "múa", "cao vút", "bác sĩ"], "correctIndex": 3, "level": 4, "id": 184},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Chú gà trống gáy vang cả xóm.', từ chỉ đặc điểm là:", "options": ["cả", "vang", "chú gà trống", "gáy"], "correctIndex": 1, "level": 4, "id": 185},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["múa", "chăm chỉ", "bàn ghế", "con mèo"], "correctIndex": 1, "level": 4, "id": 186},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Bread", "Pencil", "Scissors", "Crayon"], "correctIndex": 0, "level": 4, "id": 187},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ nơi chốn?", "options": ["Yellow", "Eraser", "School", "Brother"], "correctIndex": 2, "level": 4, "id": 188},
    {"subject": "Tiếng Anh", "question": "'Stand up!' nghĩa là gì?", "options": ["Đứng lên", "Ngồi xuống", "Lắng nghe", "Gấp sách lại"], "correctIndex": 0, "level": 4, "id": 189},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Snowy", "Ice cream", "Juice", "Cookie"], "correctIndex": 0, "level": 4, "id": 190},
    {"subject": "Tiếng Anh", "question": "'What do you like?' — Chọn câu trả lời đúng:", "options": ["She is my mother.", "It's under the bed.", "I like ice cream.", "I'm fine."], "correctIndex": 2, "level": 4, "id": 191},
    {"subject": "Tiếng Anh", "question": "Số 16 tiếng Anh là gì?", "options": ["Sixteen", "Fourteen", "Seventeen", "Fifteen"], "correctIndex": 0, "level": 4, "id": 192},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ người trong gia đình?", "options": ["Pink", "Run", "Frog", "Grandmother"], "correctIndex": 3, "level": 4, "id": 193},
    {"subject": "Tiếng Anh", "question": "'What is this?' — Chọn câu trả lời đúng:", "options": ["It's a ruler.", "I'm fine.", "I'm eight.", "It's yellow."], "correctIndex": 0, "level": 4, "id": 194},
    {"subject": "Tiếng Anh", "question": "'Bathroom' nghĩa là gì?", "options": ["Phòng ngủ", "Công viên", "Phòng tắm", "Bệnh viện"], "correctIndex": 2, "level": 4, "id": 195},
    {"subject": "Tiếng Anh", "question": "'Con voi' tiếng Anh là gì?", "options": ["Monkey", "Elephant", "Mouse", "Cow"], "correctIndex": 1, "level": 4, "id": 196},
    {"subject": "Tiếng Anh", "question": "'Cow' nghĩa là gì?", "options": ["Con khỉ", "Con bò", "Con ngựa", "Con ếch"], "correctIndex": 1, "level": 4, "id": 197},
    {"subject": "Tiếng Anh", "question": "'Bird' nghĩa là gì?", "options": ["Con rùa", "Con rắn", "Con chim", "Con hươu cao cổ"], "correctIndex": 2, "level": 4, "id": 198},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ con vật?", "options": ["Cow", "Snowy", "Brown", "Orange"], "correctIndex": 0, "level": 4, "id": 199},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ thời tiết?", "options": ["Ride a bike", "Rainy", "Monkey", "Blue"], "correctIndex": 1, "level": 4, "id": 200},
    {"id": 201, "level": 5, "subject": "Toán", "question": "9 × 6 = ?", "options": ["54", "56", "45", "63"], "correctIndex": 0},
    {"id": 202, "level": 5, "subject": "Toán", "question": "1 m = ? cm", "options": ["10", "1000", "100", "50"], "correctIndex": 2},
    {"id": 203, "level": 5, "subject": "Tiếng Việt", "question": "Từ nào chỉ sự vật?", "options": ["Nhảy dây", "Dòng sông", "Vui vẻ", "Xanh biếc"], "correctIndex": 1},
    {"id": 204, "level": 5, "subject": "Tiếng Việt", "question": "Câu nào là câu hỏi?", "options": ["Em đi học.", "Em đi học à?", "Em đi học vui quá!", "Em đi học sớm."], "correctIndex": 1},
    {"id": 205, "level": 5, "subject": "Tiếng Anh", "question": "'Pen' là gì?", "options": ["Cái thước", "Cái bút", "Quyển sách", "Cái cặp"], "correctIndex": 1},
    {"subject": "Toán", "question": "1/5 của 45 là:", "options": ["9", "10", "14", "40"], "correctIndex": 0, "level": 5, "id": 206},
    {"subject": "Toán", "question": "15 : 5 = ?", "options": ["2", "1", "6", "3"], "correctIndex": 3, "level": 5, "id": 207},
    {"subject": "Toán", "question": "Có 54 quyển sách chia đều cho 6 ngăn. Mỗi ngăn được mấy quyển?", "options": ["6 quyển", "10 quyển", "9 quyển", "11 quyển"], "correctIndex": 2, "level": 5, "id": 208},
    {"subject": "Toán", "question": "Mỗi lọ có 8 bông hoa. 3 lọ như thế có bao nhiêu bông hoa?", "options": ["21 bông", "24 bông", "32 bông", "11 bông"], "correctIndex": 1, "level": 5, "id": 209},
    {"subject": "Toán", "question": "49 − 35 = ?", "options": ["13", "24", "14", "15"], "correctIndex": 2, "level": 5, "id": 210},
    {"subject": "Toán", "question": "27 : 9 = ?", "options": ["3", "6", "1", "5"], "correctIndex": 0, "level": 5, "id": 211},
    {"subject": "Toán", "question": "Mỗi đĩa có 5 quả cam. 8 đĩa như thế có bao nhiêu quả cam?", "options": ["40 quả", "13 quả", "32 quả", "45 quả"], "correctIndex": 0, "level": 5, "id": 212},
    {"subject": "Toán", "question": "Mỗi hộp có 4 cái bánh. 8 hộp như thế có bao nhiêu cái bánh?", "options": ["36 cái", "12 cái", "32 cái", "24 cái"], "correctIndex": 2, "level": 5, "id": 213},
    {"subject": "Toán", "question": "46 − 36 = ?", "options": ["110", "10", "9", "11"], "correctIndex": 1, "level": 5, "id": 214},
    {"subject": "Toán", "question": "2 × 6 = ?", "options": ["12", "16", "6", "11"], "correctIndex": 0, "level": 5, "id": 215},
    {"subject": "Toán", "question": "7 × 5 = ?", "options": ["36", "38", "35", "31"], "correctIndex": 2, "level": 5, "id": 216},
    {"subject": "Toán", "question": "36 + 32 = ?", "options": ["78", "68", "58", "67"], "correctIndex": 1, "level": 5, "id": 217},
    {"subject": "Toán", "question": "64 : ? = 8. Số cần điền là:", "options": ["5", "8", "10", "6"], "correctIndex": 1, "level": 5, "id": 218},
    {"subject": "Toán", "question": "Lớp 3A có 46 bông hoa điểm tốt. Lớp 3B có nhiều hơn Lớp 3A 13 bông hoa điểm tốt. Lớp 3B có bao nhiêu bông hoa điểm tốt?", "options": ["33", "58", "69", "59"], "correctIndex": 3, "level": 5, "id": 219},
    {"subject": "Toán", "question": "Có 48 học sinh chia đều cho 8 nhóm. Mỗi nhóm được mấy bạn?", "options": ["9 bạn", "6 bạn", "4 bạn", "3 bạn"], "correctIndex": 1, "level": 5, "id": 220},
    {"subject": "Toán", "question": "Có 56 quyển sách chia đều cho 8 ngăn. Mỗi ngăn được mấy quyển?", "options": ["8 quyển", "5 quyển", "10 quyển", "7 quyển"], "correctIndex": 3, "level": 5, "id": 221},
    {"subject": "Toán", "question": "7 × 9 = ?", "options": ["61", "63", "69", "59"], "correctIndex": 1, "level": 5, "id": 222},
    {"subject": "Toán", "question": "5 × 7 = ?", "options": ["40", "35", "30", "31"], "correctIndex": 1, "level": 5, "id": 223},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'hèn nhát'?", "options": ["dưới", "đóng", "dũng cảm", "muộn"], "correctIndex": 2, "level": 5, "id": 224},
    {"subject": "Tiếng Việt", "question": "Câu 'Chú công nhân xây nhà.' thuộc kiểu câu nào?", "options": ["Ai là gì?", "Vì sao?", "Ai làm gì?", "Ai thế nào?"], "correctIndex": 2, "level": 5, "id": 225},
    {"subject": "Tiếng Việt", "question": "'Những ngôi sao như ngàn con mắt.' — Những ngôi sao được so sánh với gì?", "options": ["ngàn con mắt", "bé", "mỡ", "những ngôi sao"], "correctIndex": 0, "level": 5, "id": 226},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["củ khoay", "cũ khoay", "củ khoai", "cũ khoai"], "correctIndex": 2, "level": 5, "id": 227},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'săn sóc'?", "options": ["chăm sóc", "bao la", "sáng dạ", "hiền lành"], "correctIndex": 0, "level": 5, "id": 228},
    {"subject": "Tiếng Việt", "question": "'Trăng tròn như quả bóng.' — Trăng được so sánh với gì?", "options": ["mẹ hiền", "trăng", "tiếng suối", "quả bóng"], "correctIndex": 3, "level": 5, "id": 229},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Mẹ nấu nồi canh thơm phức.', từ chỉ đặc điểm là:", "options": ["thơm phức", "nấu", "nồi", "mẹ"], "correctIndex": 0, "level": 5, "id": 230},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["cho gà ăn", "cô giáo", "tròn xoe", "con đường"], "correctIndex": 2, "level": 5, "id": 231},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["trăm chỉ", "chăm chỉ", "chăm chĩ", "trăm trỉ"], "correctIndex": 1, "level": 5, "id": 232},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["ngọt lịm", "vẽ", "ông nội", "cao vút"], "correctIndex": 1, "level": 5, "id": 233},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Em bé ngủ say trong nôi.', từ chỉ hoạt động là:", "options": ["em bé", "ngủ", "trong", "say"], "correctIndex": 1, "level": 5, "id": 234},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["cĩ càng", "kĩ càng", "kĩ kàng", "kỉ càng"], "correctIndex": 1, "level": 5, "id": 235},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["ngiêng ngả", "nghiêng ngả", "nghiêng ngã", "ngiêng ngã"], "correctIndex": 1, "level": 5, "id": 236},
    {"subject": "Tiếng Anh", "question": "'Ninety' là số mấy?", "options": ["19", "80", "100", "90"], "correctIndex": 3, "level": 5, "id": 237},
    {"subject": "Tiếng Anh", "question": "'How are you?' — Chọn câu trả lời đúng:", "options": ["Yes, it is.", "My name is Nam.", "It's red.", "I'm fine, thank you."], "correctIndex": 3, "level": 5, "id": 238},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ bộ phận cơ thể?", "options": ["Green", "Ear", "Windy", "Kite"], "correctIndex": 1, "level": 5, "id": 239},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ con vật?", "options": ["Orange", "Chicken", "Yo-yo", "Sleep"], "correctIndex": 1, "level": 5, "id": 240},
    {"subject": "Tiếng Anh", "question": "Từ nào viết đúng chính tả?", "options": ["water", "watar", "woter", "watter"], "correctIndex": 0, "level": 5, "id": 241},
    {"subject": "Tiếng Anh", "question": "Từ nào viết đúng chính tả?", "options": ["yellow", "yallow", "yelow", "yellou"], "correctIndex": 0, "level": 5, "id": 242},
    {"subject": "Tiếng Anh", "question": "'Hello' nghĩa là gì?", "options": ["Xin chào", "Không", "Chào buổi sáng", "Xin lỗi"], "correctIndex": 0, "level": 5, "id": 243},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Pig", "Cow", "Yo-yo", "Bear"], "correctIndex": 2, "level": 5, "id": 244},
    {"subject": "Tiếng Anh", "question": "'Look!' nghĩa là gì?", "options": ["Gấp sách lại", "Giơ tay lên", "Lại đây", "Nhìn"], "correctIndex": 3, "level": 5, "id": 245},
    {"subject": "Tiếng Anh", "question": "'Nineteen' là số mấy?", "options": ["22", "20", "16", "19"], "correctIndex": 3, "level": 5, "id": 246},
    {"subject": "Tiếng Anh", "question": "'Come here!' nghĩa là gì?", "options": ["Giữ trật tự", "Lắng nghe", "Lại đây", "Giơ tay lên"], "correctIndex": 2, "level": 5, "id": 247},
    {"subject": "Tiếng Anh", "question": "Từ nào viết đúng chính tả?", "options": ["purpul", "purple", "purpel", "perple"], "correctIndex": 1, "level": 5, "id": 248},
    {"subject": "Tiếng Anh", "question": "'How many cats?' — Chọn câu trả lời đúng:", "options": ["I'm fine.", "Three cats.", "It's a cat.", "Yes, I do."], "correctIndex": 1, "level": 5, "id": 249},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ ăn?", "options": ["Rice", "Rainy", "Book", "Teddy bear"], "correctIndex": 0, "level": 5, "id": 250},
    {"id": 251, "level": 6, "subject": "Toán", "question": "72 : 9 = ?", "options": ["7", "8", "9", "6"], "correctIndex": 1},
    {"id": 252, "level": 6, "subject": "Toán", "question": "Số lớn nhất có ba chữ số là số nào?", "options": ["999", "100", "990", "900"], "correctIndex": 0},
    {"id": 253, "level": 6, "subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'sáng sủa'?", "options": ["Tối tăm", "Rực rỡ", "Sạch sẽ", "Tươi vui"], "correctIndex": 0},
    {"id": 254, "level": 6, "subject": "Tiếng Việt", "question": "Trong câu 'Bé tưới cây.', từ chỉ hoạt động là:", "options": ["Bé", "tưới", "cây", "Bé và cây"], "correctIndex": 1},
    {"id": 255, "level": 6, "subject": "Tiếng Anh", "question": "'I have a ruler.' — 'ruler' là gì?", "options": ["Cái thước", "Cục tẩy", "Cái bút", "Cái bàn"], "correctIndex": 0},
    {"subject": "Toán", "question": "7 × 4 = ?", "options": ["28", "27", "22", "25"], "correctIndex": 0, "level": 6, "id": 256},
    {"subject": "Toán", "question": "Giảm 35 đi 5 lần được:", "options": ["8", "40", "7", "30"], "correctIndex": 2, "level": 6, "id": 257},
    {"subject": "Toán", "question": "Có 10 bông hoa chia đều cho 2 lọ. Mỗi lọ được mấy bông?", "options": ["5 bông", "7 bông", "8 bông", "4 bông"], "correctIndex": 0, "level": 6, "id": 258},
    {"subject": "Toán", "question": "182 − 27 = ?", "options": ["55", "165", "155", "156"], "correctIndex": 2, "level": 6, "id": 259},
    {"subject": "Toán", "question": "226 − 219 = ?", "options": ["7", "17", "107", "8"], "correctIndex": 0, "level": 6, "id": 260},
    {"subject": "Toán", "question": "39 − 11 = ?", "options": ["29", "18", "28", "38"], "correctIndex": 2, "level": 6, "id": 261},
    {"subject": "Toán", "question": "149 − 58 = ?", "options": ["101", "90", "81", "91"], "correctIndex": 3, "level": 6, "id": 262},
    {"subject": "Toán", "question": "Mỗi đĩa có 6 quả cam. 4 đĩa như thế có bao nhiêu quả cam?", "options": ["10 quả", "24 quả", "20 quả", "30 quả"], "correctIndex": 1, "level": 6, "id": 263},
    {"subject": "Toán", "question": "222 − 109 = ?", "options": ["113", "112", "123", "13"], "correctIndex": 0, "level": 6, "id": 264},
    {"subject": "Toán", "question": "Lớp 3A có 145 bông hoa điểm tốt. Lớp 3B có ít hơn Lớp 3A 25 bông hoa điểm tốt. Lớp 3B có bao nhiêu bông hoa điểm tốt?", "options": ["170", "130", "119", "120"], "correctIndex": 3, "level": 6, "id": 265},
    {"subject": "Toán", "question": "Lan có 64 quyển truyện. Hoa có nhiều hơn Lan 33 quyển truyện. Hoa có bao nhiêu quyển truyện?", "options": ["107", "31", "97", "96"], "correctIndex": 2, "level": 6, "id": 266},
    {"subject": "Toán", "question": "35 : 7 = ?", "options": ["7", "5", "8", "3"], "correctIndex": 1, "level": 6, "id": 267},
    {"subject": "Toán", "question": "50 : 5 = ?", "options": ["8", "13", "9", "10"], "correctIndex": 3, "level": 6, "id": 268},
    {"subject": "Toán", "question": "Có 40 quyển sách chia đều cho 5 ngăn. Mỗi ngăn được mấy quyển?", "options": ["8 quyển", "11 quyển", "6 quyển", "5 quyển"], "correctIndex": 0, "level": 6, "id": 269},
    {"subject": "Toán", "question": "Gấp 4 lên 2 lần được:", "options": ["6", "4", "10", "8"], "correctIndex": 3, "level": 6, "id": 270},
    {"subject": "Toán", "question": "Có 42 bông hoa chia đều cho 6 lọ. Mỗi lọ được mấy bông?", "options": ["4 bông", "5 bông", "8 bông", "7 bông"], "correctIndex": 3, "level": 6, "id": 271},
    {"subject": "Toán", "question": "1 m = ? dm", "options": ["10", "1", "100", "20"], "correctIndex": 0, "level": 6, "id": 272},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 8 cm, chiều rộng 5 cm. Chu vi là:", "options": ["13 cm", "26 cm", "21 cm", "40 cm"], "correctIndex": 1, "level": 6, "id": 273},
    {"subject": "Tiếng Việt", "question": "Cuối câu 'Hoan hô, đội mình thắng rồi …' cần đặt dấu gì?", "options": ["Dấu chấm hỏi", "Dấu chấm than", "Dấu phẩy", "Dấu chấm"], "correctIndex": 1, "level": 6, "id": 274},
    {"subject": "Tiếng Việt", "question": "Câu 'Có công mài sắt, có ngày nên kim' khuyên ta điều gì?", "options": ["đoàn kết tạo nên sức mạnh", "giúp đỡ người khó khăn", "chạy thật nhanh", "kiên trì sẽ thành công"], "correctIndex": 3, "level": 6, "id": 275},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["học bài", "leo núi", "lau bàn", "quả cam"], "correctIndex": 3, "level": 6, "id": 276},
    {"subject": "Tiếng Việt", "question": "Câu 'Bố em là bác sĩ.' thuộc kiểu câu nào?", "options": ["Ai thế nào?", "Ai là gì?", "Vì sao?", "Ai làm gì?"], "correctIndex": 1, "level": 6, "id": 277},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["xinh đẹp", "chăm chỉ", "vàng óng", "tưới cây"], "correctIndex": 3, "level": 6, "id": 278},
    {"subject": "Tiếng Việt", "question": "Câu 'Chú voi to khỏe.' thuộc kiểu câu nào?", "options": ["Ai thế nào?", "Vì sao?", "Ai làm gì?", "Ai là gì?"], "correctIndex": 0, "level": 6, "id": 279},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'nhanh nhẹn'?", "options": ["thông minh", "lanh lợi", "nhỏ bé", "giúp đỡ"], "correctIndex": 1, "level": 6, "id": 280},
    {"subject": "Tiếng Việt", "question": "Cuối câu 'Nhà bạn ở đâu …' cần đặt dấu gì?", "options": ["Dấu chấm hỏi", "Dấu chấm than", "Dấu chấm", "Dấu phẩy"], "correctIndex": 0, "level": 6, "id": 281},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["nhảy dây", "cái bút", "lấp lánh", "nấu cơm"], "correctIndex": 2, "level": 6, "id": 282},
    {"subject": "Tiếng Việt", "question": "'Bé chạy nhanh như sóc.' — Bé được so sánh với gì?", "options": ["sóc", "tán bàng", "cô giáo", "bé"], "correctIndex": 0, "level": 6, "id": 283},
    {"subject": "Tiếng Việt", "question": "Câu 'Bà đang kể chuyện cổ tích.' thuộc kiểu câu nào?", "options": ["Ai là gì?", "Ai thế nào?", "Ai làm gì?", "Vì sao?"], "correctIndex": 2, "level": 6, "id": 284},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["con chim", "bơi", "nghe nhạc", "cao lớn"], "correctIndex": 3, "level": 6, "id": 285},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Chị Mai cắm bình hoa rực rỡ.', từ chỉ đặc điểm là:", "options": ["bình", "chị Mai", "cắm", "rực rỡ"], "correctIndex": 3, "level": 6, "id": 286},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ bộ phận cơ thể?", "options": ["Hand", "Ruler", "Bedroom", "Cloudy"], "correctIndex": 0, "level": 6, "id": 287},
    {"subject": "Tiếng Anh", "question": "'Good morning' nghĩa là gì?", "options": ["Không", "Chào buổi sáng", "Hẹn gặp lại", "Vâng / Có"], "correctIndex": 1, "level": 6, "id": 288},
    {"subject": "Tiếng Anh", "question": "'Rice' nghĩa là gì?", "options": ["Quả trứng", "Cơm", "Quả nho", "Nước ép"], "correctIndex": 1, "level": 6, "id": 289},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ dùng học tập?", "options": ["Ice cream", "Jump", "Tiger", "Eraser"], "correctIndex": 3, "level": 6, "id": 290},
    {"subject": "Tiếng Anh", "question": "'Xe đạp' tiếng Anh là gì?", "options": ["Plane", "Train", "Boat", "Bike"], "correctIndex": 3, "level": 6, "id": 291},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Brown", "School bag", "Ruler", "Notebook"], "correctIndex": 0, "level": 6, "id": 292},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ màu sắc?", "options": ["House", "Brown", "Bike", "Pencil"], "correctIndex": 1, "level": 6, "id": 293},
    {"subject": "Tiếng Anh", "question": "'Where are you from?' — Chọn câu trả lời đúng:", "options": ["I'm from Viet Nam.", "It's a ruler.", "Yes, I can.", "I'm fine."], "correctIndex": 0, "level": 6, "id": 294},
    {"subject": "Tiếng Anh", "question": "'Grandmother' nghĩa là gì?", "options": ["Bà", "Chị/em gái", "Anh/em trai", "Em bé"], "correctIndex": 0, "level": 6, "id": 295},
    {"subject": "Tiếng Anh", "question": "'Who is he?' — Chọn câu trả lời đúng:", "options": ["It's a pen.", "She is nine.", "Yes, I can.", "He is my father."], "correctIndex": 3, "level": 6, "id": 296},
    {"subject": "Tiếng Anh", "question": "'Sixty' là số mấy?", "options": ["70", "60", "50", "16"], "correctIndex": 1, "level": 6, "id": 297},
    {"subject": "Tiếng Anh", "question": "'Màu xanh lá' tiếng Anh là gì?", "options": ["Green", "Red", "Yellow", "Brown"], "correctIndex": 0, "level": 6, "id": 298},
    {"subject": "Tiếng Anh", "question": "Từ nào viết đúng chính tả?", "options": ["ticher", "teacher", "teecher", "teacer"], "correctIndex": 1, "level": 6, "id": 299},
    {"subject": "Tiếng Anh", "question": "Cô giáo bảo 'Nhìn', tiếng Anh là:", "options": ["Sit down!", "Open your book!", "Look!", "Stand up!"], "correctIndex": 2, "level": 6, "id": 300},
    {"id": 301, "level": 7, "subject": "Toán", "question": "8 × 9 = ?", "options": ["72", "81", "64", "63"], "correctIndex": 0},
    {"id": 302, "level": 7, "subject": "Toán", "question": "Giảm 36 đi 4 lần được bao nhiêu?", "options": ["32", "40", "9", "8"], "correctIndex": 2},
    {"id": 303, "level": 7, "subject": "Tiếng Việt", "question": "Từ nào viết SAI chính tả?", "options": ["lấp lánh", "nấp lánh", "long lanh", "nặng nề"], "correctIndex": 1},
    {"id": 304, "level": 7, "subject": "Tiếng Việt", "question": "'Trẻ em như búp trên cành.' — Trẻ em được so sánh với gì?", "options": ["Cái cành", "Búp trên cành", "Chiếc lá", "Bông hoa"], "correctIndex": 1},
    {"id": 305, "level": 7, "subject": "Tiếng Anh", "question": "'Stand up, please!' nghĩa là gì?", "options": ["Mời ngồi xuống!", "Đứng lên nào!", "Mở sách ra!", "Im lặng nào!"], "correctIndex": 1},
    {"subject": "Toán", "question": "Có 12 học sinh chia đều cho 4 nhóm. Mỗi nhóm được mấy bạn?", "options": ["1 bạn", "4 bạn", "2 bạn", "3 bạn"], "correctIndex": 3, "level": 7, "id": 306},
    {"subject": "Toán", "question": "Mỗi đĩa có 3 quả cam. 6 đĩa như thế có bao nhiêu quả cam?", "options": ["21 quả", "18 quả", "12 quả", "9 quả"], "correctIndex": 1, "level": 7, "id": 307},
    {"subject": "Toán", "question": "1/5 của 20 là:", "options": ["15", "5", "4", "9"], "correctIndex": 2, "level": 7, "id": 308},
    {"subject": "Toán", "question": "Hình vuông có cạnh 6 cm. Chu vi hình vuông là:", "options": ["12 cm", "24 cm", "28 cm", "36 cm"], "correctIndex": 1, "level": 7, "id": 309},
    {"subject": "Toán", "question": "Mỗi chồng có 5 quyển vở. 4 chồng như thế có bao nhiêu quyển vở?", "options": ["9 quyển", "16 quyển", "20 quyển", "25 quyển"], "correctIndex": 2, "level": 7, "id": 310},
    {"subject": "Toán", "question": "142 − 63 = ?", "options": ["79", "89", "78", "69"], "correctIndex": 0, "level": 7, "id": 311},
    {"subject": "Toán", "question": "147 − 127 = ?", "options": ["20", "21", "120", "10"], "correctIndex": 0, "level": 7, "id": 312},
    {"subject": "Toán", "question": "24 : ? = 4. Số cần điền là:", "options": ["9", "6", "8", "3"], "correctIndex": 1, "level": 7, "id": 313},
    {"subject": "Toán", "question": "2 m = ? dm", "options": ["20", "2", "200", "30"], "correctIndex": 0, "level": 7, "id": 314},
    {"subject": "Toán", "question": "Mỗi can có 7 lít dầu. 7 can như thế có bao nhiêu lít dầu?", "options": ["56 lít", "42 lít", "49 lít", "14 lít"], "correctIndex": 2, "level": 7, "id": 315},
    {"subject": "Toán", "question": "152 − 123 = ?", "options": ["29", "19", "30", "39"], "correctIndex": 0, "level": 7, "id": 316},
    {"subject": "Toán", "question": "18 : ? = 9. Số cần điền là:", "options": ["4", "3", "5", "2"], "correctIndex": 3, "level": 7, "id": 317},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 18 cm, chiều rộng 2 cm. Chu vi là:", "options": ["40 cm", "38 cm", "36 cm", "20 cm"], "correctIndex": 0, "level": 7, "id": 318},
    {"subject": "Toán", "question": "Lan có 35 quyển truyện. Hoa có nhiều hơn Lan 19 quyển truyện. Hoa có bao nhiêu quyển truyện?", "options": ["54", "16", "64", "53"], "correctIndex": 0, "level": 7, "id": 319},
    {"subject": "Toán", "question": "Gấp 3 lên 6 lần được:", "options": ["9", "15", "24", "18"], "correctIndex": 3, "level": 7, "id": 320},
    {"subject": "Toán", "question": "6 × 6 = ?", "options": ["30", "36", "39", "40"], "correctIndex": 1, "level": 7, "id": 321},
    {"subject": "Toán", "question": "248 + 217 = ?", "options": ["465", "475", "455", "466"], "correctIndex": 0, "level": 7, "id": 322},
    {"subject": "Toán", "question": "8 : 4 = ?", "options": ["2", "3", "5", "1"], "correctIndex": 0, "level": 7, "id": 323},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'học tập'?", "options": ["bạn bè", "căn nhà", "học hành", "lấp lánh"], "correctIndex": 2, "level": 7, "id": 324},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Em bé ngủ say trong nôi.', từ chỉ đặc điểm là:", "options": ["say", "em bé", "ngủ", "trong"], "correctIndex": 0, "level": 7, "id": 325},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'thương yêu'?", "options": ["tổ quốc", "yêu thương", "cần cù", "thông minh"], "correctIndex": 1, "level": 7, "id": 326},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["dịu dàng", "con mèo", "trồng cây", "con chim"], "correctIndex": 2, "level": 7, "id": 327},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["thông minh", "chiếc cặp", "mặt trời", "vẽ"], "correctIndex": 0, "level": 7, "id": 328},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'nghèo'?", "options": ["nặng", "ngồi", "giàu", "hiền lành"], "correctIndex": 2, "level": 7, "id": 329},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'giúp đỡ'?", "options": ["bạn bè", "má", "hỗ trợ", "lanh lợi"], "correctIndex": 2, "level": 7, "id": 330},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["đám mây", "đọc sách", "rộng rãi", "tưới cây"], "correctIndex": 0, "level": 7, "id": 331},
    {"subject": "Tiếng Việt", "question": "Câu 'Anh em như thể tay chân' khuyên ta điều gì?", "options": ["tính nết quan trọng hơn vẻ ngoài", "lễ phép với người lớn, nhường nhịn em nhỏ", "kiên trì sẽ thành công", "anh em phải yêu thương nhau"], "correctIndex": 3, "level": 7, "id": 332},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["chú ý", "trú ý", "trú í", "chú í"], "correctIndex": 0, "level": 7, "id": 333},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'ngôi nhà'?", "options": ["căn nhà", "học tập", "mênh mông", "sáng dạ"], "correctIndex": 0, "level": 7, "id": 334},
    {"subject": "Tiếng Việt", "question": "Cuối câu 'Ôi, cầu vồng đẹp quá …' cần đặt dấu gì?", "options": ["Dấu chấm hỏi", "Dấu chấm", "Dấu chấm than", "Dấu phẩy"], "correctIndex": 2, "level": 7, "id": 335},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Mẹ nấu nồi canh thơm phức.', từ chỉ hoạt động là:", "options": ["thơm phức", "nấu", "mẹ", "nồi"], "correctIndex": 1, "level": 7, "id": 336},
    {"subject": "Tiếng Anh", "question": "'Do you like apples?' — Chọn câu trả lời đúng:", "options": ["It's red.", "Yes, it is.", "I'm eight.", "Yes, I do."], "correctIndex": 3, "level": 7, "id": 337},
    {"subject": "Tiếng Anh", "question": "'What's your name?' — Chọn câu trả lời đúng:", "options": ["I'm eight.", "I am fine.", "My name is Lucie.", "It's a cat."], "correctIndex": 2, "level": 7, "id": 338},
    {"subject": "Tiếng Anh", "question": "'Leg' nghĩa là gì?", "options": ["Chân", "Mũi", "Tai", "Miệng"], "correctIndex": 0, "level": 7, "id": 339},
    {"subject": "Tiếng Anh", "question": "Từ nào viết đúng chính tả?", "options": ["rabbet", "rabbit", "rabit", "rebbit"], "correctIndex": 1, "level": 7, "id": 340},
    {"subject": "Tiếng Anh", "question": "Số 3 tiếng Anh là gì?", "options": ["One", "Six", "Three", "Four"], "correctIndex": 2, "level": 7, "id": 341},
    {"subject": "Tiếng Anh", "question": "'What colour is it?' — Chọn câu trả lời đúng:", "options": ["It's a pen.", "It's green.", "Yes, I do.", "I'm nine."], "correctIndex": 1, "level": 7, "id": 342},
    {"subject": "Tiếng Anh", "question": "'Màu cam' tiếng Anh là gì?", "options": ["Brown", "Red", "Orange", "Yellow"], "correctIndex": 2, "level": 7, "id": 343},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ hoạt động?", "options": ["Jump", "Grapes", "Cow", "Father"], "correctIndex": 0, "level": 7, "id": 344},
    {"subject": "Tiếng Anh", "question": "'Who is she?' — Chọn câu trả lời đúng:", "options": ["It's sunny.", "I'm fine.", "She is my sister.", "It's a cat."], "correctIndex": 2, "level": 7, "id": 345},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ nơi chốn?", "options": ["Hospital", "Chicken", "Sing", "Bike"], "correctIndex": 0, "level": 7, "id": 346},
    {"subject": "Tiếng Anh", "question": "'Tai' tiếng Anh là gì?", "options": ["Foot", "Ear", "Tooth", "Leg"], "correctIndex": 1, "level": 7, "id": 347},
    {"subject": "Tiếng Anh", "question": "'Eighteen' là số mấy?", "options": ["21", "18", "20", "19"], "correctIndex": 1, "level": 7, "id": 348},
    {"subject": "Tiếng Anh", "question": "'Close your book!' nghĩa là gì?", "options": ["Lắng nghe", "Gấp sách lại", "Giữ trật tự", "Đứng lên"], "correctIndex": 1, "level": 7, "id": 349},
    {"subject": "Tiếng Anh", "question": "'Jump' nghĩa là gì?", "options": ["Bơi", "Nhảy", "Nhảy múa", "Viết"], "correctIndex": 1, "level": 7, "id": 350},
    {"id": 351, "level": 8, "subject": "Toán", "question": "125 + 238 = ?", "options": ["353", "363", "373", "263"], "correctIndex": 1},
    {"id": 352, "level": 8, "subject": "Toán", "question": "Có 35 bông hoa cắm đều vào 5 lọ. Mỗi lọ có mấy bông?", "options": ["5", "6", "7", "8"], "correctIndex": 2},
    {"id": 353, "level": 8, "subject": "Tiếng Việt", "question": "Từ nào chỉ màu sắc?", "options": ["Đỏ thắm", "Thơm ngát", "Ngọt lịm", "Mềm mại"], "correctIndex": 0},
    {"id": 354, "level": 8, "subject": "Tiếng Việt", "question": "Cuối câu kể ta đặt dấu gì?", "options": ["Dấu chấm hỏi", "Dấu chấm", "Dấu chấm than", "Dấu phẩy"], "correctIndex": 1},
    {"id": 355, "level": 8, "subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Red", "Blue", "Cat", "Green"], "correctIndex": 2},
    {"subject": "Toán", "question": "112 + 117 = ?", "options": ["329", "129", "219", "229"], "correctIndex": 3, "level": 8, "id": 356},
    {"subject": "Toán", "question": "238 + 122 = ?", "options": ["370", "360", "359", "460"], "correctIndex": 1, "level": 8, "id": 357},
    {"subject": "Toán", "question": "Mỗi hộp có 7 cái bánh. 9 hộp như thế có bao nhiêu cái bánh?", "options": ["54 cái", "70 cái", "16 cái", "63 cái"], "correctIndex": 3, "level": 8, "id": 358},
    {"subject": "Toán", "question": "244 + 224 = ?", "options": ["469", "568", "368", "468"], "correctIndex": 3, "level": 8, "id": 359},
    {"subject": "Toán", "question": "Hình vuông có cạnh 7 cm. Chu vi hình vuông là:", "options": ["14 cm", "49 cm", "28 cm", "32 cm"], "correctIndex": 2, "level": 8, "id": 360},
    {"subject": "Toán", "question": "199 + 138 = ?", "options": ["337", "336", "327", "437"], "correctIndex": 0, "level": 8, "id": 361},
    {"subject": "Toán", "question": "4 m = ? dm", "options": ["40", "50", "400", "4"], "correctIndex": 0, "level": 8, "id": 362},
    {"subject": "Toán", "question": "166 − 151 = ?", "options": ["25", "15", "115", "16"], "correctIndex": 1, "level": 8, "id": 363},
    {"subject": "Toán", "question": "Hình vuông có cạnh 9 cm. Chu vi hình vuông là:", "options": ["40 cm", "36 cm", "81 cm", "18 cm"], "correctIndex": 1, "level": 8, "id": 364},
    {"subject": "Toán", "question": "183 − 14 = ?", "options": ["269", "169", "170", "159"], "correctIndex": 1, "level": 8, "id": 365},
    {"subject": "Toán", "question": "20 : 4 = ?", "options": ["3", "2", "7", "5"], "correctIndex": 3, "level": 8, "id": 366},
    {"subject": "Toán", "question": "Giảm 72 đi 6 lần được:", "options": ["66", "78", "12", "13"], "correctIndex": 2, "level": 8, "id": 367},
    {"subject": "Toán", "question": "204 − 194 = ?", "options": ["9", "110", "10", "0"], "correctIndex": 2, "level": 8, "id": 368},
    {"subject": "Toán", "question": "Thùng thứ nhất có 144 lít nước. thùng thứ hai có nhiều hơn Thùng thứ nhất 82 lít nước. thùng thứ hai có bao nhiêu lít nước?", "options": ["226", "62", "236", "225"], "correctIndex": 0, "level": 8, "id": 369},
    {"subject": "Toán", "question": "Có 24 học sinh chia đều cho 8 nhóm. Mỗi nhóm được mấy bạn?", "options": ["3 bạn", "5 bạn", "6 bạn", "1 bạn"], "correctIndex": 0, "level": 8, "id": 370},
    {"subject": "Toán", "question": "7 × 6 = ?", "options": ["42", "37", "41", "36"], "correctIndex": 0, "level": 8, "id": 371},
    {"subject": "Toán", "question": "3 cm = ? mm", "options": ["3", "40", "30", "300"], "correctIndex": 2, "level": 8, "id": 372},
    {"subject": "Toán", "question": "217 − 187 = ?", "options": ["29", "40", "30", "31"], "correctIndex": 2, "level": 8, "id": 373},
    {"subject": "Tiếng Việt", "question": "Câu 'Trâu là bạn của nhà nông.' thuộc kiểu câu nào?", "options": ["Ai làm gì?", "Ai là gì?", "Ai thế nào?", "Vì sao?"], "correctIndex": 1, "level": 8, "id": 374},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'học hành'?", "options": ["nhanh nhẹn", "săn sóc", "nhỏ bé", "học tập"], "correctIndex": 3, "level": 8, "id": 375},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["nghỉ ngơi", "nghỉ nghơi", "ngỉ ngơi", "nghĩ ngơi"], "correctIndex": 0, "level": 8, "id": 376},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Đàn kiến chăm chỉ tha mồi về tổ.', từ chỉ hoạt động là:", "options": ["chăm", "đàn kiến", "chăm chỉ", "tha"], "correctIndex": 3, "level": 8, "id": 377},
    {"subject": "Tiếng Việt", "question": "Cuối câu 'Con đã làm bài tập chưa …' cần đặt dấu gì?", "options": ["Dấu chấm than", "Dấu chấm hỏi", "Dấu phẩy", "Dấu chấm"], "correctIndex": 1, "level": 8, "id": 378},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["cánh đồng", "cao lớn", "rửa bát", "hát"], "correctIndex": 0, "level": 8, "id": 379},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'dũng cảm'?", "options": ["má", "hèn nhát", "xinh đẹp", "gan dạ"], "correctIndex": 3, "level": 8, "id": 380},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["múa", "xinh đẹp", "quả cam", "quyển vở"], "correctIndex": 0, "level": 8, "id": 381},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["thơm ngát", "chiếc cặp", "nhảy dây", "đôi dép"], "correctIndex": 2, "level": 8, "id": 382},
    {"subject": "Tiếng Việt", "question": "Cuối câu 'Mùa thu, lá vàng rơi đầy sân …' cần đặt dấu gì?", "options": ["Dấu chấm hỏi", "Dấu chấm than", "Dấu phẩy", "Dấu chấm"], "correctIndex": 3, "level": 8, "id": 383},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'đứng'?", "options": ["xa", "vơi", "ngồi", "tối"], "correctIndex": 2, "level": 8, "id": 384},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Bố sơn cánh cổng màu xanh.', từ chỉ đặc điểm là:", "options": ["xanh", "bố", "cánh", "sơn"], "correctIndex": 0, "level": 8, "id": 385},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'bạn bè'?", "options": ["học tập", "mẹ", "bè bạn", "hỗ trợ"], "correctIndex": 2, "level": 8, "id": 386},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ nơi chốn?", "options": ["Park", "Book", "Sunny", "Rabbit"], "correctIndex": 0, "level": 8, "id": 387},
    {"subject": "Tiếng Anh", "question": "'Baby' nghĩa là gì?", "options": ["Em bé", "Mẹ", "Bố", "Chị/em gái"], "correctIndex": 0, "level": 8, "id": 388},
    {"subject": "Tiếng Anh", "question": "Cô giáo bảo 'Giữ trật tự', tiếng Anh là:", "options": ["Open your book!", "Sit down!", "Stand up!", "Be quiet!"], "correctIndex": 3, "level": 8, "id": 389},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ con vật?", "options": ["Fish", "Cookie", "Pink", "Teddy bear"], "correctIndex": 0, "level": 8, "id": 390},
    {"subject": "Tiếng Anh", "question": "'Ride a bike' nghĩa là gì?", "options": ["Đạp xe", "Chạy", "Nhảy", "Nhảy múa"], "correctIndex": 0, "level": 8, "id": 391},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ hoạt động?", "options": ["Sleep", "Train", "Pen", "White"], "correctIndex": 0, "level": 8, "id": 392},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ bộ phận cơ thể?", "options": ["Nose", "Swim", "Grapes", "Kitchen"], "correctIndex": 0, "level": 8, "id": 393},
    {"subject": "Tiếng Anh", "question": "Cô giáo bảo 'Ngồi xuống', tiếng Anh là:", "options": ["Sit down!", "Stand up!", "Close your book!", "Open your book!"], "correctIndex": 0, "level": 8, "id": 394},
    {"subject": "Tiếng Anh", "question": "'Sit down!' nghĩa là gì?", "options": ["Lắng nghe", "Mở sách ra", "Gấp sách lại", "Ngồi xuống"], "correctIndex": 3, "level": 8, "id": 395},
    {"subject": "Tiếng Anh", "question": "'Watermelon' nghĩa là gì?", "options": ["Bánh quy", "Nước ép", "Dưa hấu", "Bánh mì"], "correctIndex": 2, "level": 8, "id": 396},
    {"subject": "Tiếng Anh", "question": "'Be quiet!' nghĩa là gì?", "options": ["Đứng lên", "Giữ trật tự", "Lại đây", "Ngồi xuống"], "correctIndex": 1, "level": 8, "id": 397},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Bathroom", "Sister", "Grandmother", "Father"], "correctIndex": 0, "level": 8, "id": 398},
    {"subject": "Tiếng Anh", "question": "'Có tuyết' tiếng Anh là gì?", "options": ["Rainy", "Cloudy", "Snowy", "Sunny"], "correctIndex": 2, "level": 8, "id": 399},
    {"subject": "Tiếng Anh", "question": "'Nhiều mây' tiếng Anh là gì?", "options": ["Cloudy", "Sunny", "Windy", "Snowy"], "correctIndex": 0, "level": 8, "id": 400},
    {"id": 401, "level": 9, "subject": "Toán", "question": "500 − 125 = ?", "options": ["375", "385", "475", "425"], "correctIndex": 0},
    {"id": 402, "level": 9, "subject": "Toán", "question": "Một phần hai của 18 là bao nhiêu?", "options": ["6", "9", "8", "36"], "correctIndex": 1},
    {"id": 403, "level": 9, "subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'chăm chỉ'?", "options": ["Lười nhác", "Siêng năng", "Vội vàng", "Nhút nhát"], "correctIndex": 1},
    {"id": 404, "level": 9, "subject": "Tiếng Việt", "question": "Câu 'Bầu trời xanh ngắt.' thuộc kiểu câu nào?", "options": ["Ai là gì?", "Ai làm gì?", "Ai thế nào?", "Ở đâu?"], "correctIndex": 2},
    {"id": 405, "level": 9, "subject": "Tiếng Anh", "question": "'Can you swim?' — 'Yes, I ___.'", "options": ["can", "cannot", "am", "is"], "correctIndex": 0},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 15 cm, chiều rộng 3 cm. Chu vi là:", "options": ["45 cm", "36 cm", "33 cm", "18 cm"], "correctIndex": 1, "level": 9, "id": 406},
    {"subject": "Toán", "question": "Thùng thứ nhất có 178 lít nước. thùng thứ hai có nhiều hơn Thùng thứ nhất 79 lít nước. thùng thứ hai có bao nhiêu lít nước?", "options": ["267", "257", "256", "99"], "correctIndex": 1, "level": 9, "id": 407},
    {"subject": "Toán", "question": "Nam có 57 viên bi. Minh có nhiều hơn Nam 15 viên bi. Minh có bao nhiêu viên bi?", "options": ["71", "82", "42", "72"], "correctIndex": 3, "level": 9, "id": 408},
    {"subject": "Toán", "question": "Gấp 5 lên 6 lần được:", "options": ["11", "30", "36", "25"], "correctIndex": 1, "level": 9, "id": 409},
    {"subject": "Toán", "question": "168 − 129 = ?", "options": ["29", "39", "49", "139"], "correctIndex": 1, "level": 9, "id": 410},
    {"subject": "Toán", "question": "Mỗi hộp có 8 cái bánh. 6 hộp như thế có bao nhiêu cái bánh?", "options": ["14 cái", "48 cái", "56 cái", "42 cái"], "correctIndex": 1, "level": 9, "id": 411},
    {"subject": "Toán", "question": "Gấp 12 lên 6 lần được:", "options": ["78", "72", "18", "60"], "correctIndex": 1, "level": 9, "id": 412},
    {"subject": "Toán", "question": "9 × 4 = ?", "options": ["41", "30", "36", "42"], "correctIndex": 2, "level": 9, "id": 413},
    {"subject": "Toán", "question": "Nam có 140 viên bi. Minh có ít hơn Nam 56 viên bi. Minh có bao nhiêu viên bi?", "options": ["196", "83", "94", "84"], "correctIndex": 3, "level": 9, "id": 414},
    {"subject": "Toán", "question": "3 l = ? ml", "options": ["4 000", "30 000", "300", "3 000"], "correctIndex": 3, "level": 9, "id": 415},
    {"subject": "Toán", "question": "Mỗi hộp có 7 cái bánh. 5 hộp như thế có bao nhiêu cái bánh?", "options": ["30 cái", "35 cái", "42 cái", "12 cái"], "correctIndex": 1, "level": 9, "id": 416},
    {"subject": "Toán", "question": "4 m = ? cm", "options": ["400", "40", "4 000", "500"], "correctIndex": 0, "level": 9, "id": 417},
    {"subject": "Toán", "question": "40 : 8 = ?", "options": ["4", "3", "7", "5"], "correctIndex": 3, "level": 9, "id": 418},
    {"subject": "Toán", "question": "Mỗi hộp có 5 cái bút. 3 hộp như thế có bao nhiêu cái bút?", "options": ["20 cái", "8 cái", "15 cái", "12 cái"], "correctIndex": 2, "level": 9, "id": 419},
    {"subject": "Toán", "question": "6 : 2 = ?", "options": ["6", "5", "3", "4"], "correctIndex": 2, "level": 9, "id": 420},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 6 cm, chiều rộng 2 cm. Chu vi là:", "options": ["16 cm", "14 cm", "8 cm", "12 cm"], "correctIndex": 0, "level": 9, "id": 421},
    {"subject": "Toán", "question": "? × 5 = 15. Số cần điền là:", "options": ["2", "5", "6", "3"], "correctIndex": 3, "level": 9, "id": 422},
    {"subject": "Toán", "question": "30 : 5 = ?", "options": ["5", "8", "7", "6"], "correctIndex": 3, "level": 9, "id": 423},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["chái kây", "trái kây", "chái cây", "trái cây"], "correctIndex": 3, "level": 9, "id": 424},
    {"subject": "Tiếng Việt", "question": "Câu 'Bầu trời trong xanh.' thuộc kiểu câu nào?", "options": ["Vì sao?", "Ai là gì?", "Ai thế nào?", "Ai làm gì?"], "correctIndex": 2, "level": 9, "id": 425},
    {"subject": "Tiếng Việt", "question": "Câu 'Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao' khuyên ta điều gì?", "options": ["đoàn kết tạo nên sức mạnh", "biết ơn người đi trước", "chạy thật nhanh", "ăn thật nhiều"], "correctIndex": 0, "level": 9, "id": 426},
    {"subject": "Tiếng Việt", "question": "Câu 'Mẹ đi chợ mua rau.' thuộc kiểu câu nào?", "options": ["Ai là gì?", "Ai làm gì?", "Vì sao?", "Ai thế nào?"], "correctIndex": 1, "level": 9, "id": 427},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["dữ gìn", "giữ dìn", "giử gìn", "giữ gìn"], "correctIndex": 3, "level": 9, "id": 428},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'chăm sóc'?", "options": ["săn sóc", "thật thà", "giúp đỡ", "vui vẻ"], "correctIndex": 0, "level": 9, "id": 429},
    {"subject": "Tiếng Việt", "question": "Câu 'Cô Hoa là cô giáo của em.' thuộc kiểu câu nào?", "options": ["Ai làm gì?", "Vì sao?", "Ai là gì?", "Ai thế nào?"], "correctIndex": 2, "level": 9, "id": 430},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Mắt bé sáng như sao.', sự vật nào được so sánh?", "options": ["sao", "mỡ", "đường lên dốc", "mắt bé"], "correctIndex": 3, "level": 9, "id": 431},
    {"subject": "Tiếng Việt", "question": "Cuối câu 'Chà, bông hoa thơm quá …' cần đặt dấu gì?", "options": ["Dấu chấm than", "Dấu chấm hỏi", "Dấu phẩy", "Dấu chấm"], "correctIndex": 0, "level": 9, "id": 432},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["ngôi nhà", "nhỏ xíu", "hát", "dòng sông"], "correctIndex": 2, "level": 9, "id": 433},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["no lắng", "lo lắng", "no nắng", "lo nắng"], "correctIndex": 1, "level": 9, "id": 434},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["chú bộ đội", "tươi tốt", "bông hoa", "vẽ"], "correctIndex": 1, "level": 9, "id": 435},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'sạch'?", "options": ["ra", "mềm", "trên", "bẩn"], "correctIndex": 3, "level": 9, "id": 436},
    {"subject": "Tiếng Anh", "question": "'Rainy' nghĩa là gì?", "options": ["Trời mưa", "Trời nắng", "Có gió", "Có tuyết"], "correctIndex": 0, "level": 9, "id": 437},
    {"subject": "Tiếng Anh", "question": "Cô giáo bảo 'Đứng lên', tiếng Anh là:", "options": ["Open your book!", "Close your book!", "Sit down!", "Stand up!"], "correctIndex": 3, "level": 9, "id": 438},
    {"subject": "Tiếng Anh", "question": "'Bàn chân' tiếng Anh là gì?", "options": ["Eye", "Arm", "Foot", "Hand"], "correctIndex": 2, "level": 9, "id": 439},
    {"subject": "Tiếng Anh", "question": "'Forty' là số mấy?", "options": ["40", "14", "50", "30"], "correctIndex": 0, "level": 9, "id": 440},
    {"subject": "Tiếng Anh", "question": "'Eye' nghĩa là gì?", "options": ["Mắt", "Chân", "Bàn chân", "Bàn tay"], "correctIndex": 0, "level": 9, "id": 441},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Boat", "Grapes", "Doll", "Teddy bear"], "correctIndex": 1, "level": 9, "id": 442},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Notebook", "Pencil", "Mouth", "Crayon"], "correctIndex": 2, "level": 9, "id": 443},
    {"subject": "Tiếng Anh", "question": "Cô giáo bảo 'Lại đây', tiếng Anh là:", "options": ["Come here!", "Stand up!", "Open your book!", "Sit down!"], "correctIndex": 0, "level": 9, "id": 444},
    {"subject": "Tiếng Anh", "question": "'Trường học' tiếng Anh là gì?", "options": ["Bathroom", "School", "Park", "Hospital"], "correctIndex": 1, "level": 9, "id": 445},
    {"subject": "Tiếng Anh", "question": "'Phòng tắm' tiếng Anh là gì?", "options": ["Bathroom", "Hospital", "Bedroom", "Kitchen"], "correctIndex": 0, "level": 9, "id": 446},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Hospital", "House", "School", "Train"], "correctIndex": 3, "level": 9, "id": 447},
    {"subject": "Tiếng Anh", "question": "Từ nào viết đúng chính tả?", "options": ["orenge", "orang", "oranj", "orange"], "correctIndex": 3, "level": 9, "id": 448},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Swim", "Write", "Dance", "Cloudy"], "correctIndex": 3, "level": 9, "id": 449},
    {"subject": "Tiếng Anh", "question": "'Open your book!' nghĩa là gì?", "options": ["Ngồi xuống", "Nhìn", "Lại đây", "Mở sách ra"], "correctIndex": 3, "level": 9, "id": 450},
    {"id": 451, "level": 10, "subject": "Toán", "question": "9 × 7 + 7 = ?", "options": ["70", "63", "77", "56"], "correctIndex": 0},
    {"id": 452, "level": 10, "subject": "Toán", "question": "Mẹ mua 4 hộp bút, mỗi hộp 8 cái. Mẹ cho bạn 5 cái. Còn lại mấy cái?", "options": ["37", "28", "27", "23"], "correctIndex": 2},
    {"id": 453, "level": 10, "subject": "Tiếng Việt", "question": "Từ nào chỉ tình cảm gia đình?", "options": ["Chạy nhảy", "Yêu thương", "Bàn học", "Xanh tươi"], "correctIndex": 1},
    {"id": 454, "level": 10, "subject": "Tiếng Việt", "question": "Câu nào nói về tình anh em?", "options": ["Ăn quả nhớ kẻ trồng cây", "Có công mài sắt có ngày nên kim", "Uống nước nhớ nguồn", "Anh em như thể tay chân"], "correctIndex": 3},
    {"id": 455, "level": 10, "subject": "Tiếng Anh", "question": "'This is my sister.' — 'sister' là ai?", "options": ["Anh trai", "Chị hoặc em gái", "Bố", "Mẹ"], "correctIndex": 1},
    {"subject": "Toán", "question": "96 + 151 = ?", "options": ["248", "247", "347", "246"], "correctIndex": 1, "level": 10, "id": 456},
    {"subject": "Toán", "question": "115 + 173 = ?", "options": ["298", "278", "289", "288"], "correctIndex": 3, "level": 10, "id": 457},
    {"subject": "Toán", "question": "? × 7 = 49. Số cần điền là:", "options": ["7", "9", "8", "6"], "correctIndex": 0, "level": 10, "id": 458},
    {"subject": "Toán", "question": "184 − 119 = ?", "options": ["65", "66", "75", "55"], "correctIndex": 0, "level": 10, "id": 459},
    {"subject": "Toán", "question": "? × 7 = 14. Số cần điền là:", "options": ["5", "1", "2", "3"], "correctIndex": 2, "level": 10, "id": 460},
    {"subject": "Toán", "question": "2 kg = ? g", "options": ["3 000", "200", "2 000", "20 000"], "correctIndex": 2, "level": 10, "id": 461},
    {"subject": "Toán", "question": "Có 42 bông hoa chia đều cho 7 lọ. Mỗi lọ được mấy bông?", "options": ["9 bông", "6 bông", "4 bông", "3 bông"], "correctIndex": 1, "level": 10, "id": 462},
    {"subject": "Toán", "question": "2 × 9 = ?", "options": ["21", "18", "17", "23"], "correctIndex": 1, "level": 10, "id": 463},
    {"subject": "Toán", "question": "Nam có 82 viên bi. Minh có ít hơn Nam 28 viên bi. Minh có bao nhiêu viên bi?", "options": ["64", "53", "54", "110"], "correctIndex": 2, "level": 10, "id": 464},
    {"subject": "Toán", "question": "1/3 của 24 là:", "options": ["8", "9", "21", "11"], "correctIndex": 0, "level": 10, "id": 465},
    {"subject": "Toán", "question": "211 − 169 = ?", "options": ["43", "32", "41", "42"], "correctIndex": 3, "level": 10, "id": 466},
    {"subject": "Toán", "question": "1/2 của 16 là:", "options": ["10", "9", "14", "8"], "correctIndex": 3, "level": 10, "id": 467},
    {"subject": "Toán", "question": "7 × 2 = ?", "options": ["14", "18", "8", "10"], "correctIndex": 0, "level": 10, "id": 468},
    {"subject": "Toán", "question": "Mỗi nhóm có 4 bạn. 8 nhóm như thế có bao nhiêu bạn?", "options": ["36 bạn", "32 bạn", "24 bạn", "12 bạn"], "correctIndex": 1, "level": 10, "id": 469},
    {"subject": "Toán", "question": "? × 3 = 9. Số cần điền là:", "options": ["3", "5", "2", "4"], "correctIndex": 0, "level": 10, "id": 470},
    {"subject": "Toán", "question": "Mỗi nhóm có 6 bạn. 4 nhóm như thế có bao nhiêu bạn?", "options": ["30 bạn", "24 bạn", "20 bạn", "10 bạn"], "correctIndex": 1, "level": 10, "id": 471},
    {"subject": "Toán", "question": "42 : 7 = ?", "options": ["7", "6", "4", "3"], "correctIndex": 1, "level": 10, "id": 472},
    {"subject": "Toán", "question": "25 : 5 = ?", "options": ["6", "7", "4", "5"], "correctIndex": 3, "level": 10, "id": 473},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["tưới cây", "hát", "dịu dàng", "cây bàng"], "correctIndex": 3, "level": 10, "id": 474},
    {"subject": "Tiếng Việt", "question": "'Tán bàng xòe ra như chiếc ô.' — Tán bàng được so sánh với gì?", "options": ["sao", "cô giáo", "tán bàng", "chiếc ô"], "correctIndex": 3, "level": 10, "id": 475},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["con mèo", "nhỏ xíu", "sạch sẽ", "giặt áo"], "correctIndex": 3, "level": 10, "id": 476},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'béo'?", "options": ["ngọt", "nghèo", "gầy", "hư"], "correctIndex": 2, "level": 10, "id": 477},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'lanh lợi'?", "options": ["chịu khó", "ba", "nhanh nhẹn", "đất nước"], "correctIndex": 2, "level": 10, "id": 478},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["cao vút", "cái bảng", "trồng cây", "cái bút"], "correctIndex": 0, "level": 10, "id": 479},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["dòng sông", "bông hoa", "ngọt lịm", "trường học"], "correctIndex": 2, "level": 10, "id": 480},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Chú mèo mướp chạy rất nhanh.', từ chỉ đặc điểm là:", "options": ["rất", "nhanh", "chú mèo mướp", "chạy"], "correctIndex": 1, "level": 10, "id": 481},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["vàng óng", "con đường", "học sinh", "bác sĩ"], "correctIndex": 0, "level": 10, "id": 482},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'lười biếng'?", "options": ["ra", "chăm chỉ", "cẩu thả", "xuống"], "correctIndex": 1, "level": 10, "id": 483},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["lặng nề", "nặng lề", "nặng nề", "lặng lề"], "correctIndex": 2, "level": 10, "id": 484},
    {"subject": "Tiếng Việt", "question": "Câu 'Lá lành đùm lá rách' khuyên ta điều gì?", "options": ["đoàn kết tạo nên sức mạnh", "giúp đỡ người khó khăn", "không cần học", "kiên trì sẽ thành công"], "correctIndex": 1, "level": 10, "id": 485},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["trồng cây", "đỏ thắm", "hát", "ông nội"], "correctIndex": 3, "level": 10, "id": 486},
    {"subject": "Tiếng Anh", "question": "'Nhảy múa' tiếng Anh là gì?", "options": ["Ride a bike", "Run", "Read", "Dance"], "correctIndex": 3, "level": 10, "id": 487},
    {"subject": "Tiếng Anh", "question": "'Twelve' là số mấy?", "options": ["12", "9", "10", "11"], "correctIndex": 0, "level": 10, "id": 488},
    {"subject": "Tiếng Anh", "question": "'Ông' tiếng Anh là gì?", "options": ["Father", "Grandfather", "Baby", "Sister"], "correctIndex": 1, "level": 10, "id": 489},
    {"subject": "Tiếng Anh", "question": "'Sing' nghĩa là gì?", "options": ["Hát", "Ngủ", "Chạy", "Nhảy múa"], "correctIndex": 0, "level": 10, "id": 490},
    {"subject": "Tiếng Anh", "question": "Số 9 tiếng Anh là gì?", "options": ["Ten", "Nine", "Twelve", "Eight"], "correctIndex": 1, "level": 10, "id": 491},
    {"subject": "Tiếng Anh", "question": "'Cặp sách' tiếng Anh là gì?", "options": ["Scissors", "School bag", "Crayon", "Notebook"], "correctIndex": 1, "level": 10, "id": 492},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ dùng học tập?", "options": ["Rainy", "Scissors", "Purple", "Kitchen"], "correctIndex": 1, "level": 10, "id": 493},
    {"subject": "Tiếng Anh", "question": "'Father' nghĩa là gì?", "options": ["Bố", "Anh/em trai", "Em bé", "Chị/em gái"], "correctIndex": 0, "level": 10, "id": 494},
    {"subject": "Tiếng Anh", "question": "'Raise your hand!' nghĩa là gì?", "options": ["Gấp sách lại", "Giơ tay lên", "Giữ trật tự", "Lắng nghe"], "correctIndex": 1, "level": 10, "id": 495},
    {"subject": "Tiếng Anh", "question": "'Mouse' nghĩa là gì?", "options": ["Con rùa", "Con chuột", "Con bò", "Con hươu cao cổ"], "correctIndex": 1, "level": 10, "id": 496},
    {"subject": "Tiếng Anh", "question": "'Bệnh viện' tiếng Anh là gì?", "options": ["Bedroom", "Hospital", "Bathroom", "School"], "correctIndex": 1, "level": 10, "id": 497},
    {"subject": "Tiếng Anh", "question": "'Tooth' nghĩa là gì?", "options": ["Tai", "Bàn chân", "Miệng", "Răng"], "correctIndex": 3, "level": 10, "id": 498},
    {"subject": "Tiếng Anh", "question": "'Quả nho' tiếng Anh là gì?", "options": ["Juice", "Ice cream", "Cookie", "Grapes"], "correctIndex": 3, "level": 10, "id": 499},
    {"subject": "Tiếng Anh", "question": "'Thank you' nghĩa là gì?", "options": ["Cảm ơn", "Vâng / Có", "Tạm biệt", "Chúc ngủ ngon"], "correctIndex": 0, "level": 10, "id": 500},
    {"id": 501, "level": 11, "subject": "Toán", "question": "? × 5 = 25. Số cần điền là:", "options": ["3", "5", "6", "4"], "correctIndex": 1},
    {"id": 502, "level": 11, "subject": "Toán", "question": "18 : 3 = ?", "options": ["6", "7", "8", "4"], "correctIndex": 0},
    {"id": 503, "level": 11, "subject": "Tiếng Việt", "question": "Từ nào chỉ hoạt động?", "options": ["sân trường", "quyển vở", "chăm ngoan", "tập thể dục"], "correctIndex": 3},
    {"id": 504, "level": 11, "subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["xôi gấc", "sôi gấc", "sôi gất", "xôi gất"], "correctIndex": 0},
    {"id": 505, "level": 11, "subject": "Tiếng Anh", "question": "'Goodbye. See you later.' nghĩa là gì?", "options": ["Xin chào.", "Bạn khỏe không?", "Tạm biệt. Hẹn gặp lại.", "Cảm ơn bạn."], "correctIndex": 2},
    {"subject": "Toán", "question": "Tổ Một có 157 cây. Tổ Hai có nhiều hơn Tổ Một 47 cây. Tổ Hai có bao nhiêu cây?", "options": ["110", "203", "214", "204"], "correctIndex": 3, "level": 11, "id": 506},
    {"subject": "Toán", "question": "9 × 9 = ?", "options": ["80", "79", "81", "84"], "correctIndex": 2, "level": 11, "id": 507},
    {"subject": "Toán", "question": "Có 30 quả táo chia đều cho 6 đĩa. Mỗi đĩa được mấy quả?", "options": ["2 quả", "8 quả", "4 quả", "5 quả"], "correctIndex": 3, "level": 11, "id": 508},
    {"subject": "Toán", "question": "Có 27 học sinh chia đều cho 3 nhóm. Mỗi nhóm được mấy bạn?", "options": ["7 bạn", "10 bạn", "11 bạn", "9 bạn"], "correctIndex": 3, "level": 11, "id": 509},
    {"subject": "Toán", "question": "Kim giờ ở giữa số 9 và số 10, kim phút chỉ số 6. Đồng hồ chỉ mấy giờ?", "options": ["9 giờ 30 phút", "6 giờ 45 phút", "10 giờ 30 phút", "9 giờ 15 phút"], "correctIndex": 0, "level": 11, "id": 510},
    {"subject": "Toán", "question": "Có 72 học sinh chia đều cho 8 nhóm. Mỗi nhóm được mấy bạn?", "options": ["7 bạn", "8 bạn", "6 bạn", "9 bạn"], "correctIndex": 3, "level": 11, "id": 511},
    {"subject": "Toán", "question": "Giá trị của biểu thức 52 + 7 × 7 là:", "options": ["413", "111", "101", "66"], "correctIndex": 2, "level": 11, "id": 512},
    {"subject": "Toán", "question": "5 m = ? dm", "options": ["5", "60", "50", "500"], "correctIndex": 2, "level": 11, "id": 513},
    {"subject": "Toán", "question": "Giá trị của biểu thức 26 + 8 × 3 là:", "options": ["37", "50", "60", "102"], "correctIndex": 1, "level": 11, "id": 514},
    {"subject": "Toán", "question": "10 : 5 = ?", "options": ["2", "3", "5", "1"], "correctIndex": 0, "level": 11, "id": 515},
    {"subject": "Toán", "question": "1/4 của 36 là:", "options": ["10", "13", "32", "9"], "correctIndex": 3, "level": 11, "id": 516},
    {"subject": "Toán", "question": "Giá trị của biểu thức 59 + 3 × 4 là:", "options": ["71", "66", "81", "248"], "correctIndex": 0, "level": 11, "id": 517},
    {"subject": "Toán", "question": "63 : 9 = ?", "options": ["8", "4", "7", "6"], "correctIndex": 2, "level": 11, "id": 518},
    {"subject": "Toán", "question": "1/4 của 32 là:", "options": ["8", "28", "12", "9"], "correctIndex": 0, "level": 11, "id": 519},
    {"subject": "Toán", "question": "Giảm 24 đi 2 lần được:", "options": ["13", "22", "12", "26"], "correctIndex": 2, "level": 11, "id": 520},
    {"subject": "Toán", "question": "5 dm = ? cm", "options": ["50", "500", "60", "5"], "correctIndex": 0, "level": 11, "id": 521},
    {"subject": "Toán", "question": "Giá trị của biểu thức (7 + 3) × 3 là:", "options": ["33", "13", "16", "30"], "correctIndex": 3, "level": 11, "id": 522},
    {"subject": "Toán", "question": "Giảm 8 đi 4 lần được:", "options": ["12", "4", "2", "3"], "correctIndex": 2, "level": 11, "id": 523},
    {"subject": "Tiếng Việt", "question": "'Hạt sương long lanh như hạt ngọc.' — Hạt sương được so sánh với gì?", "options": ["ngàn con mắt", "hạt ngọc", "hạt sương", "bé"], "correctIndex": 1, "level": 11, "id": 524},
    {"subject": "Tiếng Việt", "question": "Câu 'Cánh đồng lúa vàng óng.' thuộc kiểu câu nào?", "options": ["Ai là gì?", "Ai thế nào?", "Vì sao?", "Ai làm gì?"], "correctIndex": 1, "level": 11, "id": 525},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["se đạb", "xe đạp", "se đạp", "xe đạb"], "correctIndex": 1, "level": 11, "id": 526},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["bông hoa", "đỏ thắm", "học bài", "dịu dàng"], "correctIndex": 0, "level": 11, "id": 527},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["lau bàn", "cái bảng", "ngoan ngoãn", "trồng cây"], "correctIndex": 1, "level": 11, "id": 528},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["leo núi", "nhảy dây", "hiền lành", "viết"], "correctIndex": 2, "level": 11, "id": 529},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'dối trá'?", "options": ["thật thà", "yên lặng", "chăm chỉ", "vụng về"], "correctIndex": 0, "level": 11, "id": 530},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["nấu cơm", "cái thước", "cao vút", "vui vẻ"], "correctIndex": 1, "level": 11, "id": 531},
    {"subject": "Tiếng Việt", "question": "'Hai bàn tay em như hoa đầu cành.' — Hai bàn tay em được so sánh với gì?", "options": ["bé", "hai bàn tay em", "ngàn con mắt", "hoa đầu cành"], "correctIndex": 3, "level": 11, "id": 532},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Bạn Hoa hát rất hay.', từ chỉ hoạt động là:", "options": ["rất", "hay", "bạn Hoa", "hát"], "correctIndex": 3, "level": 11, "id": 533},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'tươi thắm'?", "options": ["rực rỡ", "xinh xắn", "to lớn", "giúp đỡ"], "correctIndex": 0, "level": 11, "id": 534},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["sạch sẽ", "đá bóng", "chú bộ đội", "quyển vở"], "correctIndex": 0, "level": 11, "id": 535},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["mủ len", "mủ nen", "mũ nen", "mũ len"], "correctIndex": 3, "level": 11, "id": 536},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Kitchen", "School", "Bedroom", "Juice"], "correctIndex": 3, "level": 11, "id": 537},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ thời tiết?", "options": ["Arm", "Cloudy", "Brother", "Pink"], "correctIndex": 1, "level": 11, "id": 538},
    {"subject": "Tiếng Anh", "question": "Từ nào viết đúng chính tả?", "options": ["bruther", "brather", "brother", "brothre"], "correctIndex": 2, "level": 11, "id": 539},
    {"subject": "Tiếng Anh", "question": "'Seven' là số mấy?", "options": ["7", "8", "5", "6"], "correctIndex": 0, "level": 11, "id": 540},
    {"subject": "Tiếng Anh", "question": "'Snowy' nghĩa là gì?", "options": ["Nhiều mây", "Có tuyết", "Trời mưa", "Có gió"], "correctIndex": 1, "level": 11, "id": 541},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Monkey", "Car", "Teddy bear", "Kite"], "correctIndex": 0, "level": 11, "id": 542},
    {"subject": "Tiếng Anh", "question": "'Viết' tiếng Anh là gì?", "options": ["Write", "Sing", "Run", "Sleep"], "correctIndex": 0, "level": 11, "id": 543},
    {"subject": "Tiếng Anh", "question": "Từ nào viết đúng chính tả?", "options": ["kichen", "kitchin", "kittchen", "kitchen"], "correctIndex": 3, "level": 11, "id": 544},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ người trong gia đình?", "options": ["Father", "Plane", "Sunny", "Tooth"], "correctIndex": 0, "level": 11, "id": 545},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Write", "Green", "White", "Pink"], "correctIndex": 0, "level": 11, "id": 546},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ ăn?", "options": ["Yellow", "Pen", "Rainy", "Banana"], "correctIndex": 3, "level": 11, "id": 547},
    {"subject": "Tiếng Anh", "question": "'Twenty' là số mấy?", "options": ["18", "20", "21", "23"], "correctIndex": 1, "level": 11, "id": 548},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ dùng học tập?", "options": ["School bag", "Mother", "Blue", "House"], "correctIndex": 0, "level": 11, "id": 549},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ người trong gia đình?", "options": ["Eye", "Baby", "Chair", "Dog"], "correctIndex": 1, "level": 11, "id": 550},
    {"id": 551, "level": 12, "subject": "Toán", "question": "? × 3 = 27. Số cần điền là:", "options": ["10", "9", "11", "8"], "correctIndex": 1},
    {"id": 552, "level": 12, "subject": "Toán", "question": "20 : 5 = ?", "options": ["4", "6", "3", "5"], "correctIndex": 0},
    {"id": 553, "level": 12, "subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'dũng cảm'?", "options": ["gan dạ", "anh hùng", "hèn nhát", "can đảm"], "correctIndex": 2},
    {"id": 554, "level": 12, "subject": "Tiếng Việt", "question": "Câu 'Bạn Lan đang quét lớp.' thuộc kiểu câu nào?", "options": ["Ai là gì?", "Ai làm gì?", "Ai thế nào?", "Vì sao?"], "correctIndex": 1},
    {"id": 555, "level": 12, "subject": "Tiếng Anh", "question": "'How are you?' — Chọn câu trả lời đúng:", "options": ["I am fine, thank you.", "My name is Lucie.", "I am eight.", "It is a pen."], "correctIndex": 0},
    {"subject": "Toán", "question": "361 − 293 = ?", "options": ["67", "68", "58", "69"], "correctIndex": 1, "level": 12, "id": 556},
    {"subject": "Toán", "question": "? × 5 = 40. Số cần điền là:", "options": ["9", "7", "8", "6"], "correctIndex": 2, "level": 12, "id": 557},
    {"subject": "Toán", "question": "Gấp 7 lên 2 lần được:", "options": ["9", "14", "7", "16"], "correctIndex": 1, "level": 12, "id": 558},
    {"subject": "Toán", "question": "Hình vuông có cạnh 12 cm. Chu vi hình vuông là:", "options": ["144 cm", "48 cm", "52 cm", "24 cm"], "correctIndex": 1, "level": 12, "id": 559},
    {"subject": "Toán", "question": "16 : ? = 8. Số cần điền là:", "options": ["2", "3", "1", "5"], "correctIndex": 0, "level": 12, "id": 560},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 11 cm, chiều rộng 2 cm. Chu vi là:", "options": ["13 cm", "24 cm", "26 cm", "22 cm"], "correctIndex": 2, "level": 12, "id": 561},
    {"subject": "Toán", "question": "18 : 6 = ?", "options": ["2", "5", "3", "6"], "correctIndex": 2, "level": 12, "id": 562},
    {"subject": "Toán", "question": "Lớp 3A có 191 bông hoa điểm tốt. Lớp 3B có ít hơn Lớp 3A 61 bông hoa điểm tốt. Lớp 3B có bao nhiêu bông hoa điểm tốt?", "options": ["140", "129", "130", "252"], "correctIndex": 2, "level": 12, "id": 563},
    {"subject": "Toán", "question": "Có 24 cái kẹo chia đều cho 4 bạn. Mỗi bạn được mấy cái?", "options": ["6 cái", "8 cái", "4 cái", "9 cái"], "correctIndex": 0, "level": 12, "id": 564},
    {"subject": "Toán", "question": "78 + 334 = ?", "options": ["512", "422", "411", "412"], "correctIndex": 3, "level": 12, "id": 565},
    {"subject": "Toán", "question": "Mỗi hộp có 6 cái bút. 7 hộp như thế có bao nhiêu cái bút?", "options": ["42 cái", "35 cái", "13 cái", "48 cái"], "correctIndex": 0, "level": 12, "id": 566},
    {"subject": "Toán", "question": "Giá trị của biểu thức (7 + 7) × 3 là:", "options": ["42", "17", "45", "28"], "correctIndex": 0, "level": 12, "id": 567},
    {"subject": "Toán", "question": "Tổ Một có 97 cây. Tổ Hai có ít hơn Tổ Một 24 cây. Tổ Hai có bao nhiêu cây?", "options": ["72", "121", "83", "73"], "correctIndex": 3, "level": 12, "id": 568},
    {"subject": "Toán", "question": "Kim giờ chỉ số 12, kim phút chỉ số 12. Đồng hồ chỉ mấy giờ?", "options": ["12 giờ 0 phút", "12 giờ", "12 giờ 30 phút", "1 giờ"], "correctIndex": 1, "level": 12, "id": 569},
    {"subject": "Toán", "question": "1 l = ? ml", "options": ["10 000", "1 000", "2 000", "100"], "correctIndex": 1, "level": 12, "id": 570},
    {"subject": "Toán", "question": "Có 18 bông hoa chia đều cho 2 lọ. Mỗi lọ được mấy bông?", "options": ["10 bông", "9 bông", "11 bông", "6 bông"], "correctIndex": 1, "level": 12, "id": 571},
    {"subject": "Toán", "question": "1 kg = ? g", "options": ["2 000", "1 000", "100", "10 000"], "correctIndex": 1, "level": 12, "id": 572},
    {"subject": "Toán", "question": "20 : ? = 4. Số cần điền là:", "options": ["7", "4", "8", "5"], "correctIndex": 3, "level": 12, "id": 573},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["xinh sắn", "sinh sắn", "sinh xắn", "xinh xắn"], "correctIndex": 3, "level": 12, "id": 574},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["no nê", "lo nê", "lo lê", "no lê"], "correctIndex": 0, "level": 12, "id": 575},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Bé chạy nhanh như sóc.', sự vật nào được so sánh?", "options": ["sóc", "tiếng suối", "bé", "cô giáo"], "correctIndex": 2, "level": 12, "id": 576},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["tưới cây", "đen nhánh", "xinh đẹp", "học sinh"], "correctIndex": 3, "level": 12, "id": 577},
    {"subject": "Tiếng Việt", "question": "Câu 'Em đang làm bài tập.' thuộc kiểu câu nào?", "options": ["Ai là gì?", "Ai làm gì?", "Vì sao?", "Ai thế nào?"], "correctIndex": 1, "level": 12, "id": 578},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Cô giáo giảng bài rất dễ hiểu.', từ chỉ đặc điểm là:", "options": ["bài", "cô giáo", "dễ hiểu", "giảng"], "correctIndex": 2, "level": 12, "id": 579},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Chị Mai cắm bình hoa rực rỡ.', từ chỉ hoạt động là:", "options": ["cắm", "chị Mai", "bình", "rực rỡ"], "correctIndex": 0, "level": 12, "id": 580},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["vui vẻ", "con đường", "cái bảng", "ăn cơm"], "correctIndex": 0, "level": 12, "id": 581},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'gan dạ'?", "options": ["dũng cảm", "lặng im", "căn nhà", "bao la"], "correctIndex": 0, "level": 12, "id": 582},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["thông minh", "rộng rãi", "mặt trời", "đọc sách"], "correctIndex": 2, "level": 12, "id": 583},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["vẻ tranh", "vẽ chanh", "vẻ chanh", "vẽ tranh"], "correctIndex": 3, "level": 12, "id": 584},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'thông minh'?", "options": ["cần cù", "nhanh nhẹn", "sáng dạ", "ngốc nghếch"], "correctIndex": 2, "level": 12, "id": 585},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["rửa bát", "trắng tinh", "con chim", "ngọt lịm"], "correctIndex": 2, "level": 12, "id": 586},
    {"subject": "Tiếng Anh", "question": "Từ nào viết đúng chính tả?", "options": ["benana", "banane", "bananna", "banana"], "correctIndex": 3, "level": 12, "id": 587},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ nơi chốn?", "options": ["Kitchen", "Juice", "Baby", "Lion"], "correctIndex": 0, "level": 12, "id": 588},
    {"subject": "Tiếng Anh", "question": "'Run' nghĩa là gì?", "options": ["Viết", "Chạy", "Vẽ", "Đọc"], "correctIndex": 1, "level": 12, "id": 589},
    {"subject": "Tiếng Anh", "question": "'Egg' nghĩa là gì?", "options": ["Quả táo", "Quả nho", "Quả chuối", "Quả trứng"], "correctIndex": 3, "level": 12, "id": 590},
    {"subject": "Tiếng Anh", "question": "'Tiger' nghĩa là gì?", "options": ["Con gà", "Con hổ", "Con ngựa", "Con voi"], "correctIndex": 1, "level": 12, "id": 591},
    {"subject": "Tiếng Anh", "question": "'Con thuyền' tiếng Anh là gì?", "options": ["Kite", "Yo-yo", "Boat", "Ball"], "correctIndex": 2, "level": 12, "id": 592},
    {"subject": "Tiếng Anh", "question": "'Park' nghĩa là gì?", "options": ["Bệnh viện", "Công viên", "Phòng ngủ", "Phòng tắm"], "correctIndex": 1, "level": 12, "id": 593},
    {"subject": "Tiếng Anh", "question": "'Trời mưa' tiếng Anh là gì?", "options": ["Rainy", "Snowy", "Cloudy", "Sunny"], "correctIndex": 0, "level": 12, "id": 594},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ bộ phận cơ thể?", "options": ["Arm", "Blue", "Train", "Ride a bike"], "correctIndex": 0, "level": 12, "id": 595},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Cookie", "Grandmother", "Grandfather", "Baby"], "correctIndex": 0, "level": 12, "id": 596},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ hoạt động?", "options": ["Bread", "Bathroom", "White", "Sing"], "correctIndex": 3, "level": 12, "id": 597},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Windy", "Rainy", "Purple", "Cloudy"], "correctIndex": 2, "level": 12, "id": 598},
    {"subject": "Tiếng Anh", "question": "Từ nào viết đúng chính tả?", "options": ["frend", "freind", "friend", "frind"], "correctIndex": 2, "level": 12, "id": 599},
    {"subject": "Tiếng Anh", "question": "'Apple' nghĩa là gì?", "options": ["Sữa", "Quả trứng", "Quả táo", "Dưa hấu"], "correctIndex": 2, "level": 12, "id": 600},
    {"id": 601, "level": 13, "subject": "Toán", "question": "? × 3 = 27. Số cần điền là:", "options": ["9", "11", "8", "10"], "correctIndex": 0},
    {"id": 602, "level": 13, "subject": "Toán", "question": "56 : 8 = ?", "options": ["5", "7", "8", "6"], "correctIndex": 1},
    {"id": 603, "level": 13, "subject": "Tiếng Việt", "question": "Từ nào cùng nghĩa với 'Tổ quốc'?", "options": ["đất nước", "làng xóm", "gia đình", "trường học"], "correctIndex": 0},
    {"id": 604, "level": 13, "subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["trăm xóc", "trăm sóc", "chăm sóc", "chăm xóc"], "correctIndex": 2},
    {"id": 605, "level": 13, "subject": "Tiếng Anh", "question": "'This is my friend.' — 'friend' là gì?", "options": ["Người bạn", "Anh trai", "Bố", "Cô giáo"], "correctIndex": 0},
    {"subject": "Toán", "question": "Giá trị của biểu thức (4 + 2) × 3 là:", "options": ["9", "10", "18", "21"], "correctIndex": 2, "level": 13, "id": 606},
    {"subject": "Toán", "question": "Giảm 12 đi 6 lần được:", "options": ["18", "6", "3", "2"], "correctIndex": 3, "level": 13, "id": 607},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 18 cm, chiều rộng 3 cm. Chu vi là:", "options": ["21 cm", "54 cm", "39 cm", "42 cm"], "correctIndex": 3, "level": 13, "id": 608},
    {"subject": "Toán", "question": "239 + 485 = ?", "options": ["723", "724", "714", "725"], "correctIndex": 1, "level": 13, "id": 609},
    {"subject": "Toán", "question": "230 − 203 = ?", "options": ["127", "26", "27", "28"], "correctIndex": 2, "level": 13, "id": 610},
    {"subject": "Toán", "question": "5 × 10 = ?", "options": ["45", "49", "50", "48"], "correctIndex": 2, "level": 13, "id": 611},
    {"subject": "Toán", "question": "251 + 238 = ?", "options": ["490", "489", "499", "488"], "correctIndex": 1, "level": 13, "id": 612},
    {"subject": "Toán", "question": "Giá trị của biểu thức (2 + 4) × 3 là:", "options": ["9", "21", "14", "18"], "correctIndex": 3, "level": 13, "id": 613},
    {"subject": "Toán", "question": "Lan có 277 quyển truyện. Hoa có ít hơn Lan 85 quyển truyện. Hoa có bao nhiêu quyển truyện?", "options": ["362", "202", "191", "192"], "correctIndex": 3, "level": 13, "id": 614},
    {"subject": "Toán", "question": "4 × 4 = ?", "options": ["11", "15", "16", "18"], "correctIndex": 2, "level": 13, "id": 615},
    {"subject": "Toán", "question": "82 − 74 = ?", "options": ["7", "8", "108", "9"], "correctIndex": 1, "level": 13, "id": 616},
    {"subject": "Toán", "question": "Có 36 cái kẹo chia đều cho 9 bạn. Mỗi bạn được mấy cái?", "options": ["2 cái", "5 cái", "6 cái", "4 cái"], "correctIndex": 3, "level": 13, "id": 617},
    {"subject": "Toán", "question": "174 + 421 = ?", "options": ["595", "495", "585", "596"], "correctIndex": 0, "level": 13, "id": 618},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 16 cm, chiều rộng 4 cm. Chu vi là:", "options": ["20 cm", "36 cm", "64 cm", "40 cm"], "correctIndex": 3, "level": 13, "id": 619},
    {"subject": "Toán", "question": "202 + 442 = ?", "options": ["644", "654", "744", "544"], "correctIndex": 0, "level": 13, "id": 620},
    {"subject": "Toán", "question": "Kim giờ chỉ số 5, kim phút chỉ số 12. Đồng hồ chỉ mấy giờ?", "options": ["12 giờ 25 phút", "6 giờ", "5 giờ 30 phút", "5 giờ"], "correctIndex": 3, "level": 13, "id": 621},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 8 cm, chiều rộng 3 cm. Chu vi là:", "options": ["19 cm", "24 cm", "11 cm", "22 cm"], "correctIndex": 3, "level": 13, "id": 622},
    {"subject": "Toán", "question": "Gấp 12 lên 2 lần được:", "options": ["26", "24", "12", "14"], "correctIndex": 1, "level": 13, "id": 623},
    {"subject": "Tiếng Việt", "question": "Câu 'Bạn Lan là học sinh lớp 3.' thuộc kiểu câu nào?", "options": ["Ai thế nào?", "Ai làm gì?", "Ai là gì?", "Vì sao?"], "correctIndex": 2, "level": 13, "id": 624},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'bố'?", "options": ["ba", "yêu thương", "bè bạn", "vui vẻ"], "correctIndex": 0, "level": 13, "id": 625},
    {"subject": "Tiếng Việt", "question": "Câu 'Các bạn nhỏ chơi nhảy dây.' thuộc kiểu câu nào?", "options": ["Ai làm gì?", "Ai thế nào?", "Vì sao?", "Ai là gì?"], "correctIndex": 0, "level": 13, "id": 626},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'vui tươi'?", "options": ["nhỏ bé", "ba", "vui vẻ", "chịu khó"], "correctIndex": 2, "level": 13, "id": 627},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'to lớn'?", "options": ["im lặng", "khổng lồ", "bè bạn", "nhanh nhẹn"], "correctIndex": 1, "level": 13, "id": 628},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Dòng sông xanh chảy hiền hòa.', từ chỉ hoạt động là:", "options": ["chảy", "hiền hòa", "xanh", "dòng sông"], "correctIndex": 0, "level": 13, "id": 629},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'vào'?", "options": ["tối", "ra", "nghèo", "bẩn"], "correctIndex": 1, "level": 13, "id": 630},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["cao lớn", "chăm chỉ", "vàng óng", "học bài"], "correctIndex": 3, "level": 13, "id": 631},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'to'?", "options": ["nhỏ", "béo", "hẹp", "vơi"], "correctIndex": 0, "level": 13, "id": 632},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["tròn xoe", "cao vút", "trắng tinh", "rửa bát"], "correctIndex": 3, "level": 13, "id": 633},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Ông em trồng những cây cam sai quả.', từ chỉ hoạt động là:", "options": ["ông em", "những", "trồng", "sai quả"], "correctIndex": 2, "level": 13, "id": 634},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["chú bộ đội", "gấp quần áo", "hiền lành", "bác sĩ"], "correctIndex": 1, "level": 13, "id": 635},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'má'?", "options": ["thông minh", "mẹ", "tươi thắm", "long lanh"], "correctIndex": 1, "level": 13, "id": 636},
    {"subject": "Tiếng Anh", "question": "'Chị/em gái' tiếng Anh là gì?", "options": ["Father", "Baby", "Sister", "Grandmother"], "correctIndex": 2, "level": 13, "id": 637},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ bộ phận cơ thể?", "options": ["Eye", "Baby", "Blue", "School"], "correctIndex": 0, "level": 13, "id": 638},
    {"subject": "Tiếng Anh", "question": "'Cánh tay' tiếng Anh là gì?", "options": ["Eye", "Foot", "Leg", "Arm"], "correctIndex": 3, "level": 13, "id": 639},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Mother", "Brother", "Sister", "Kitchen"], "correctIndex": 3, "level": 13, "id": 640},
    {"subject": "Tiếng Anh", "question": "'Seventy' là số mấy?", "options": ["17", "70", "60", "80"], "correctIndex": 1, "level": 13, "id": 641},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ màu sắc?", "options": ["Orange", "Mouth", "Sister", "Kitchen"], "correctIndex": 0, "level": 13, "id": 642},
    {"subject": "Tiếng Anh", "question": "'Bike' nghĩa là gì?", "options": ["Con thuyền", "Con diều", "Cái yo-yo", "Xe đạp"], "correctIndex": 3, "level": 13, "id": 643},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ dùng học tập?", "options": ["Lion", "Sunny", "Draw", "Chair"], "correctIndex": 3, "level": 13, "id": 644},
    {"subject": "Tiếng Anh", "question": "'Búp bê' tiếng Anh là gì?", "options": ["Doll", "Bike", "Train", "Car"], "correctIndex": 0, "level": 13, "id": 645},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ con vật?", "options": ["Father", "Giraffe", "Windy", "School"], "correctIndex": 1, "level": 13, "id": 646},
    {"subject": "Tiếng Anh", "question": "Số 2 tiếng Anh là gì?", "options": ["Three", "Two", "One", "Five"], "correctIndex": 1, "level": 13, "id": 647},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Brother", "Grandfather", "Baby", "Arm"], "correctIndex": 3, "level": 13, "id": 648},
    {"subject": "Tiếng Anh", "question": "'Con sư tử' tiếng Anh là gì?", "options": ["Horse", "Bird", "Lion", "Dog"], "correctIndex": 2, "level": 13, "id": 649},
    {"subject": "Tiếng Anh", "question": "'Book' nghĩa là gì?", "options": ["Cái kéo", "Quyển sách", "Cặp sách", "Cục tẩy"], "correctIndex": 1, "level": 13, "id": 650},
    {"id": 651, "level": 14, "subject": "Toán", "question": "1/5 của 15 là bao nhiêu?", "options": ["3", "75", "4", "10"], "correctIndex": 0},
    {"id": 652, "level": 14, "subject": "Toán", "question": "Tính: 45 + 4 × 2 = ?", "options": ["53", "54", "49", "98"], "correctIndex": 0},
    {"id": 653, "level": 14, "subject": "Tiếng Việt", "question": "'Hai bàn tay em như hoa đầu cành.' Bàn tay được so sánh với gì?", "options": ["hoa đầu cành", "em bé", "cành cây", "đôi mắt"], "correctIndex": 0},
    {"id": 654, "level": 14, "subject": "Tiếng Việt", "question": "Từ nào chỉ đặc điểm?", "options": ["học sinh", "viết bài", "cái bảng", "thông minh"], "correctIndex": 3},
    {"id": 655, "level": 14, "subject": "Tiếng Anh", "question": "Từ nào là đồ dùng học tập?", "options": ["red", "apple", "dog", "eraser"], "correctIndex": 3},
    {"subject": "Toán", "question": "4 : ? = 2. Số cần điền là:", "options": ["3", "1", "4", "2"], "correctIndex": 3, "level": 14, "id": 656},
    {"subject": "Toán", "question": "Giá trị của biểu thức 14 + 5 × 2 là:", "options": ["38", "24", "34", "21"], "correctIndex": 1, "level": 14, "id": 657},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 9 cm, chiều rộng 2 cm. Chu vi là:", "options": ["20 cm", "18 cm", "11 cm", "22 cm"], "correctIndex": 3, "level": 14, "id": 658},
    {"subject": "Toán", "question": "Mỗi hộp có 5 cái bút. 4 hộp như thế có bao nhiêu cái bút?", "options": ["16 cái", "25 cái", "20 cái", "9 cái"], "correctIndex": 2, "level": 14, "id": 659},
    {"subject": "Toán", "question": "Nam có 443 viên bi. Minh có ít hơn Nam 76 viên bi. Minh có bao nhiêu viên bi?", "options": ["519", "366", "367", "377"], "correctIndex": 2, "level": 14, "id": 660},
    {"subject": "Toán", "question": "Mỗi hàng có 7 chiếc xe. 3 hàng như thế có bao nhiêu chiếc xe?", "options": ["18 chiếc", "21 chiếc", "10 chiếc", "28 chiếc"], "correctIndex": 1, "level": 14, "id": 661},
    {"subject": "Toán", "question": "Tổ Một có 174 cây. Tổ Hai có nhiều hơn Tổ Một 42 cây. Tổ Hai có bao nhiêu cây?", "options": ["132", "215", "226", "216"], "correctIndex": 3, "level": 14, "id": 662},
    {"subject": "Toán", "question": "Có 49 bông hoa chia đều cho 7 lọ. Mỗi lọ được mấy bông?", "options": ["7 bông", "5 bông", "4 bông", "6 bông"], "correctIndex": 0, "level": 14, "id": 663},
    {"subject": "Toán", "question": "Mỗi lọ có 7 bông hoa. 9 lọ như thế có bao nhiêu bông hoa?", "options": ["54 bông", "70 bông", "63 bông", "16 bông"], "correctIndex": 2, "level": 14, "id": 664},
    {"subject": "Toán", "question": "Mỗi hàng có 6 chiếc xe. 3 hàng như thế có bao nhiêu chiếc xe?", "options": ["18 chiếc", "15 chiếc", "24 chiếc", "9 chiếc"], "correctIndex": 0, "level": 14, "id": 665},
    {"subject": "Toán", "question": "54 : ? = 6. Số cần điền là:", "options": ["8", "12", "9", "10"], "correctIndex": 2, "level": 14, "id": 666},
    {"subject": "Toán", "question": "Giá trị của biểu thức 11 + 6 × 2 là:", "options": ["33", "19", "23", "34"], "correctIndex": 2, "level": 14, "id": 667},
    {"subject": "Toán", "question": "Tổ Một có 449 cây. Tổ Hai có ít hơn Tổ Một 84 cây. Tổ Hai có bao nhiêu cây?", "options": ["533", "364", "375", "365"], "correctIndex": 3, "level": 14, "id": 668},
    {"subject": "Toán", "question": "251 + 382 = ?", "options": ["632", "643", "633", "623"], "correctIndex": 2, "level": 14, "id": 669},
    {"subject": "Toán", "question": "Kim giờ ở giữa số 3 và số 4, kim phút chỉ số 6. Đồng hồ chỉ mấy giờ?", "options": ["6 giờ 15 phút", "3 giờ 30 phút", "4 giờ 30 phút", "3 giờ 15 phút"], "correctIndex": 1, "level": 14, "id": 670},
    {"subject": "Toán", "question": "40 : 5 = ?", "options": ["8", "5", "11", "10"], "correctIndex": 0, "level": 14, "id": 671},
    {"subject": "Toán", "question": "1/6 của 24 là:", "options": ["18", "5", "4", "10"], "correctIndex": 2, "level": 14, "id": 672},
    {"subject": "Toán", "question": "? × 4 = 20. Số cần điền là:", "options": ["4", "6", "2", "5"], "correctIndex": 3, "level": 14, "id": 673},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'cẩn thận'?", "options": ["lên", "đắng", "nhẹ", "cẩu thả"], "correctIndex": 3, "level": 14, "id": 674},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["dửa tay", "rửa tay", "rữa tay", "giửa tay"], "correctIndex": 1, "level": 14, "id": 675},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["học sinh", "cây bàng", "trắng tinh", "con đường"], "correctIndex": 2, "level": 14, "id": 676},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["nghe nhạc", "chăm chỉ", "tròn xoe", "chú bộ đội"], "correctIndex": 0, "level": 14, "id": 677},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Tán bàng xòe ra như chiếc ô.', sự vật nào được so sánh?", "options": ["đường lên dốc", "chiếc ô", "tán bàng", "mẹ hiền"], "correctIndex": 2, "level": 14, "id": 678},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'đất nước'?", "options": ["vui tươi", "to lớn", "long lanh", "tổ quốc"], "correctIndex": 3, "level": 14, "id": 679},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["cái bút", "lau bàn", "cái bảng", "xinh đẹp"], "correctIndex": 3, "level": 14, "id": 680},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'hẹp'?", "options": ["nghèo", "đắng", "hèn nhát", "rộng"], "correctIndex": 3, "level": 14, "id": 681},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'gần'?", "options": ["xa", "bừa bộn", "ồn ào", "yếu"], "correctIndex": 0, "level": 14, "id": 682},
    {"subject": "Tiếng Việt", "question": "Câu 'Bạn Minh rất chăm chỉ.' thuộc kiểu câu nào?", "options": ["Vì sao?", "Ai thế nào?", "Ai là gì?", "Ai làm gì?"], "correctIndex": 1, "level": 14, "id": 683},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'đen'?", "options": ["rộng", "trắng", "xa", "lười biếng"], "correctIndex": 1, "level": 14, "id": 684},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'ba'?", "options": ["chăm sóc", "trung thực", "cần cù", "bố"], "correctIndex": 3, "level": 14, "id": 685},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["cây bàng", "đọc sách", "dịu dàng", "ngoan ngoãn"], "correctIndex": 1, "level": 14, "id": 686},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ dùng học tập?", "options": ["Pen", "Bread", "Car", "Leg"], "correctIndex": 0, "level": 14, "id": 687},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ chơi?", "options": ["Yellow", "Car", "Grandmother", "Draw"], "correctIndex": 1, "level": 14, "id": 688},
    {"subject": "Tiếng Anh", "question": "'Trời nắng' tiếng Anh là gì?", "options": ["Windy", "Cloudy", "Rainy", "Sunny"], "correctIndex": 3, "level": 14, "id": 689},
    {"subject": "Tiếng Anh", "question": "'Dưa hấu' tiếng Anh là gì?", "options": ["Ice cream", "Watermelon", "Juice", "Rice"], "correctIndex": 1, "level": 14, "id": 690},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ con vật?", "options": ["Sunny", "Chair", "House", "Bear"], "correctIndex": 3, "level": 14, "id": 691},
    {"subject": "Tiếng Anh", "question": "'Em bé' tiếng Anh là gì?", "options": ["Baby", "Brother", "Grandmother", "Mother"], "correctIndex": 0, "level": 14, "id": 692},
    {"subject": "Tiếng Anh", "question": "'Banana' nghĩa là gì?", "options": ["Quả táo", "Cơm", "Dưa hấu", "Quả chuối"], "correctIndex": 3, "level": 14, "id": 693},
    {"subject": "Tiếng Anh", "question": "'Juice' nghĩa là gì?", "options": ["Bánh quy", "Quả táo", "Bánh mì", "Nước ép"], "correctIndex": 3, "level": 14, "id": 694},
    {"subject": "Tiếng Anh", "question": "'Grandfather' nghĩa là gì?", "options": ["Ông", "Bố", "Chị/em gái", "Bà"], "correctIndex": 0, "level": 14, "id": 695},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Mother", "Grandmother", "Baby", "School bag"], "correctIndex": 3, "level": 14, "id": 696},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ ăn?", "options": ["Juice", "Monkey", "Arm", "Red"], "correctIndex": 0, "level": 14, "id": 697},
    {"subject": "Tiếng Anh", "question": "'Mắt' tiếng Anh là gì?", "options": ["Ear", "Leg", "Hand", "Eye"], "correctIndex": 3, "level": 14, "id": 698},
    {"subject": "Tiếng Anh", "question": "'One hundred' là số mấy?", "options": ["90", "10", "100", "1000"], "correctIndex": 2, "level": 14, "id": 699},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Dog", "Crayon", "Chair", "Ruler"], "correctIndex": 0, "level": 14, "id": 700},
    {"id": 701, "level": 15, "subject": "Toán", "question": "1/5 của 15 là bao nhiêu?", "options": ["75", "4", "3", "10"], "correctIndex": 2},
    {"id": 702, "level": 15, "subject": "Toán", "question": "Tính: 33 + 9 × 4 = ?", "options": ["168", "70", "60", "69"], "correctIndex": 3},
    {"id": 703, "level": 15, "subject": "Tiếng Việt", "question": "Dấu chấm hỏi đặt ở cuối loại câu nào?", "options": ["Câu khiến", "Câu kể", "Câu hỏi", "Câu cảm"], "correctIndex": 2},
    {"id": 704, "level": 15, "subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["núa lếp", "lúa nếp", "lúa lếp", "núa nếp"], "correctIndex": 1},
    {"id": 705, "level": 15, "subject": "Tiếng Anh", "question": "'Is this your school bag?' — 'Yes, it ___.'", "options": ["do", "are", "is", "am"], "correctIndex": 2},
    {"subject": "Toán", "question": "4 × 2 = ?", "options": ["12", "8", "3", "6"], "correctIndex": 1, "level": 15, "id": 706},
    {"subject": "Toán", "question": "394 − 92 = ?", "options": ["302", "303", "202", "301"], "correctIndex": 0, "level": 15, "id": 707},
    {"subject": "Toán", "question": "Kim giờ vừa qua số 7 một chút, kim phút chỉ số 3. Đồng hồ chỉ mấy giờ?", "options": ["3 giờ 35 phút", "7 giờ 15 phút", "7 giờ 45 phút", "8 giờ 15 phút"], "correctIndex": 1, "level": 15, "id": 708},
    {"subject": "Toán", "question": "Kim giờ sắp tới số 6, kim phút chỉ số 9. Đồng hồ chỉ mấy giờ?", "options": ["5 giờ 45 phút", "5 giờ 15 phút", "6 giờ 45 phút", "9 giờ 25 phút"], "correctIndex": 0, "level": 15, "id": 709},
    {"subject": "Toán", "question": "Tổ Một có 43 cây. Tổ Hai có nhiều hơn Tổ Một 29 cây. Tổ Hai có bao nhiêu cây?", "options": ["71", "14", "72", "82"], "correctIndex": 2, "level": 15, "id": 710},
    {"subject": "Toán", "question": "220 + 292 = ?", "options": ["513", "502", "512", "511"], "correctIndex": 2, "level": 15, "id": 711},
    {"subject": "Toán", "question": "Có 24 bông hoa chia đều cho 4 lọ. Mỗi lọ được mấy bông?", "options": ["7 bông", "4 bông", "6 bông", "8 bông"], "correctIndex": 2, "level": 15, "id": 712},
    {"subject": "Toán", "question": "5 × 5 = ?", "options": ["29", "25", "27", "26"], "correctIndex": 1, "level": 15, "id": 713},
    {"subject": "Toán", "question": "298 + 381 = ?", "options": ["679", "579", "689", "678"], "correctIndex": 0, "level": 15, "id": 714},
    {"subject": "Toán", "question": "Giá trị của biểu thức 23 + 4 × 5 là:", "options": ["32", "43", "53", "135"], "correctIndex": 1, "level": 15, "id": 715},
    {"subject": "Toán", "question": "Có 63 cái kẹo chia đều cho 9 bạn. Mỗi bạn được mấy cái?", "options": ["6 cái", "8 cái", "9 cái", "7 cái"], "correctIndex": 3, "level": 15, "id": 716},
    {"subject": "Toán", "question": "12 : 6 = ?", "options": ["4", "5", "2", "3"], "correctIndex": 2, "level": 15, "id": 717},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 12 cm, chiều rộng 3 cm. Chu vi là:", "options": ["36 cm", "15 cm", "30 cm", "27 cm"], "correctIndex": 2, "level": 15, "id": 718},
    {"subject": "Toán", "question": "72 : 8 = ?", "options": ["7", "6", "9", "11"], "correctIndex": 2, "level": 15, "id": 719},
    {"subject": "Toán", "question": "Tổ Một có 331 cây. Tổ Hai có nhiều hơn Tổ Một 64 cây. Tổ Hai có bao nhiêu cây?", "options": ["405", "395", "394", "267"], "correctIndex": 1, "level": 15, "id": 720},
    {"subject": "Toán", "question": "Giá trị của biểu thức 55 + 3 × 3 là:", "options": ["61", "74", "64", "174"], "correctIndex": 2, "level": 15, "id": 721},
    {"subject": "Toán", "question": "Mỗi nhóm có 8 bạn. 3 nhóm như thế có bao nhiêu bạn?", "options": ["32 bạn", "11 bạn", "24 bạn", "21 bạn"], "correctIndex": 2, "level": 15, "id": 722},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 11 cm, chiều rộng 3 cm. Chu vi là:", "options": ["28 cm", "33 cm", "14 cm", "25 cm"], "correctIndex": 0, "level": 15, "id": 723},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'chăm chỉ'?", "options": ["lười biếng", "săn sóc", "siêng năng", "tổ quốc"], "correctIndex": 2, "level": 15, "id": 724},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'vui vẻ'?", "options": ["thật thà", "ngôi nhà", "vui tươi", "má"], "correctIndex": 2, "level": 15, "id": 725},
    {"subject": "Tiếng Việt", "question": "Cuối câu 'Hôm nay em được điểm mười …' cần đặt dấu gì?", "options": ["Dấu chấm than", "Dấu chấm hỏi", "Dấu chấm", "Dấu phẩy"], "correctIndex": 2, "level": 15, "id": 726},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["suy nghĩ", "xuy nghĩ", "suy nghỉ", "xuy nghỉ"], "correctIndex": 0, "level": 15, "id": 727},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'rộng'?", "options": ["gầy", "nhanh", "hẹp", "đứng"], "correctIndex": 2, "level": 15, "id": 728},
    {"subject": "Tiếng Việt", "question": "Câu 'Uống nước nhớ nguồn' khuyên ta điều gì?", "options": ["lễ phép với người lớn, nhường nhịn em nhỏ", "biết ơn người làm ra thành quả", "biết ơn người đi trước", "ngủ thật sớm"], "correctIndex": 2, "level": 15, "id": 729},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["lau bàn", "bàn ghế", "thơm ngát", "đọc sách"], "correctIndex": 1, "level": 15, "id": 730},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Đường lên dốc trơn như mỡ.', sự vật nào được so sánh?", "options": ["sao", "đường lên dốc", "mỡ", "hạt ngọc"], "correctIndex": 1, "level": 15, "id": 731},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'đông đúc'?", "options": ["vắng vẻ", "dài", "hèn nhát", "béo"], "correctIndex": 0, "level": 15, "id": 732},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'gọn gàng'?", "options": ["đóng", "bừa bộn", "yếu", "nặng"], "correctIndex": 1, "level": 15, "id": 733},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Bé lau chiếc bàn sạch bóng.', từ chỉ hoạt động là:", "options": ["sạch bóng", "lau", "chiếc", "bé"], "correctIndex": 1, "level": 15, "id": 734},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["mềm mại", "tưới cây", "học bài", "nhảy dây"], "correctIndex": 0, "level": 15, "id": 735},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["nhỏ xíu", "dịu dàng", "viết", "nhanh nhẹn"], "correctIndex": 2, "level": 15, "id": 736},
    {"subject": "Tiếng Anh", "question": "Cô giáo bảo 'Mở sách ra', tiếng Anh là:", "options": ["Stand up!", "Sit down!", "Close your book!", "Open your book!"], "correctIndex": 3, "level": 15, "id": 737},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ chơi?", "options": ["Chicken", "Train", "Dance", "White"], "correctIndex": 1, "level": 15, "id": 738},
    {"subject": "Tiếng Anh", "question": "'Nhà bếp' tiếng Anh là gì?", "options": ["Bedroom", "School", "Kitchen", "Park"], "correctIndex": 2, "level": 15, "id": 739},
    {"subject": "Tiếng Anh", "question": "'Eighty' là số mấy?", "options": ["80", "90", "70", "18"], "correctIndex": 0, "level": 15, "id": 740},
    {"subject": "Tiếng Anh", "question": "'Quả táo' tiếng Anh là gì?", "options": ["Ice cream", "Apple", "Juice", "Banana"], "correctIndex": 1, "level": 15, "id": 741},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Mango", "Egg", "Cookie", "Giraffe"], "correctIndex": 3, "level": 15, "id": 742},
    {"subject": "Tiếng Anh", "question": "'Kem' tiếng Anh là gì?", "options": ["Grapes", "Ice cream", "Apple", "Egg"], "correctIndex": 1, "level": 15, "id": 743},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ màu sắc?", "options": ["Turtle", "Black", "Draw", "Teddy bear"], "correctIndex": 1, "level": 15, "id": 744},
    {"subject": "Tiếng Anh", "question": "'Ear' nghĩa là gì?", "options": ["Bàn tay", "Tai", "Cánh tay", "Miệng"], "correctIndex": 1, "level": 15, "id": 745},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Teddy bear", "Bike", "Kite", "Hand"], "correctIndex": 3, "level": 15, "id": 746},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Milk", "Foot", "Arm", "Nose"], "correctIndex": 0, "level": 15, "id": 747},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Chair", "Scissors", "Boat", "Book"], "correctIndex": 2, "level": 15, "id": 748},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ thời tiết?", "options": ["Teddy bear", "Crayon", "Sunny", "Milk"], "correctIndex": 2, "level": 15, "id": 749},
    {"subject": "Tiếng Anh", "question": "'Quyển sách' tiếng Anh là gì?", "options": ["Eraser", "School bag", "Book", "Pen"], "correctIndex": 2, "level": 15, "id": 750},
    {"id": 751, "level": 16, "subject": "Toán", "question": "795 − 281 = ?", "options": ["614", "504", "514", "524"], "correctIndex": 2},
    {"id": 752, "level": 16, "subject": "Toán", "question": "174 : 6 = ?", "options": ["39", "29", "30", "28"], "correctIndex": 1},
    {"id": 753, "level": 16, "subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'ngắn'?", "options": ["hẹp", "dài", "bé", "thấp"], "correctIndex": 1},
    {"id": 754, "level": 16, "subject": "Tiếng Việt", "question": "Trong câu 'Chú mèo trèo lên cây cau.', từ chỉ hoạt động là:", "options": ["trèo", "chú mèo", "cây cau", "lên"], "correctIndex": 0},
    {"id": 755, "level": 16, "subject": "Tiếng Anh", "question": "'May I go out?' nghĩa là gì?", "options": ["Em có thể ra ngoài không ạ?", "Đóng cửa lại.", "Em có thể vào không ạ?", "Mở sách ra."], "correctIndex": 0},
    {"subject": "Toán", "question": "? × 2 = 8. Số cần điền là:", "options": ["5", "6", "4", "1"], "correctIndex": 2, "level": 16, "id": 756},
    {"subject": "Toán", "question": "Số bé nhất trong các số dưới đây là:", "options": ["913", "823", "813", "903"], "correctIndex": 2, "level": 16, "id": 757},
    {"subject": "Toán", "question": "40 : 4 = ?", "options": ["7", "9", "10", "8"], "correctIndex": 2, "level": 16, "id": 758},
    {"subject": "Toán", "question": "Số liền trước của 7 504 là:", "options": ["7 505", "7 502", "7 503", "7 494"], "correctIndex": 2, "level": 16, "id": 759},
    {"subject": "Toán", "question": "Lớp 3A có 384 bông hoa điểm tốt. Lớp 3B có ít hơn Lớp 3A 74 bông hoa điểm tốt. Lớp 3B có bao nhiêu bông hoa điểm tốt?", "options": ["458", "309", "310", "320"], "correctIndex": 2, "level": 16, "id": 760},
    {"subject": "Toán", "question": "Số bé nhất trong các số dưới đây là:", "options": ["669", "677", "678", "767"], "correctIndex": 0, "level": 16, "id": 761},
    {"subject": "Toán", "question": "Thùng thứ nhất có 378 lít nước. thùng thứ hai có nhiều hơn Thùng thứ nhất 81 lít nước. thùng thứ hai có bao nhiêu lít nước?", "options": ["458", "459", "297", "469"], "correctIndex": 1, "level": 16, "id": 762},
    {"subject": "Toán", "question": "Số liền sau của 5 845 là:", "options": ["5 847", "5 855", "5 846", "5 844"], "correctIndex": 2, "level": 16, "id": 763},
    {"subject": "Toán", "question": "Có 40 quả táo chia đều cho 5 đĩa. Mỗi đĩa được mấy quả?", "options": ["5 quả", "7 quả", "6 quả", "8 quả"], "correctIndex": 3, "level": 16, "id": 764},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 11 cm, chiều rộng 4 cm. Chu vi là:", "options": ["30 cm", "26 cm", "44 cm", "15 cm"], "correctIndex": 0, "level": 16, "id": 765},
    {"subject": "Toán", "question": "Tổ Một có 375 cây. Tổ Hai có nhiều hơn Tổ Một 61 cây. Tổ Hai có bao nhiêu cây?", "options": ["436", "435", "314", "446"], "correctIndex": 0, "level": 16, "id": 766},
    {"subject": "Toán", "question": "460 − 328 = ?", "options": ["32", "131", "232", "132"], "correctIndex": 3, "level": 16, "id": 767},
    {"subject": "Toán", "question": "Có 9 bông hoa chia đều cho 3 lọ. Mỗi lọ được mấy bông?", "options": ["3 bông", "1 bông", "6 bông", "4 bông"], "correctIndex": 0, "level": 16, "id": 768},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 12 cm, chiều rộng 4 cm. Chu vi là:", "options": ["32 cm", "28 cm", "16 cm", "48 cm"], "correctIndex": 0, "level": 16, "id": 769},
    {"subject": "Toán", "question": "4 × 8 = ?", "options": ["32", "27", "33", "36"], "correctIndex": 0, "level": 16, "id": 770},
    {"subject": "Toán", "question": "3 dm = ? cm", "options": ["300", "30", "3", "40"], "correctIndex": 1, "level": 16, "id": 771},
    {"subject": "Toán", "question": "6 × 2 = ?", "options": ["18", "7", "12", "11"], "correctIndex": 2, "level": 16, "id": 772},
    {"subject": "Toán", "question": "1/6 của 12 là:", "options": ["6", "8", "2", "3"], "correctIndex": 2, "level": 16, "id": 773},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'cẩu thả'?", "options": ["sáng", "cẩn thận", "thua", "ngồi"], "correctIndex": 1, "level": 16, "id": 774},
    {"subject": "Tiếng Việt", "question": "Câu 'Mèo là con vật rất đáng yêu.' thuộc kiểu câu nào?", "options": ["Vì sao?", "Ai là gì?", "Ai làm gì?", "Ai thế nào?"], "correctIndex": 1, "level": 16, "id": 775},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'đắng'?", "options": ["nhanh", "thấp", "ngọt", "yên lặng"], "correctIndex": 2, "level": 16, "id": 776},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Tiếng suối trong như tiếng hát xa.', sự vật nào được so sánh?", "options": ["quả bóng", "tiếng suối", "quả cầu lửa", "tiếng hát xa"], "correctIndex": 1, "level": 16, "id": 777},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["nấp nánh", "lấp nánh", "lấp lánh", "nấp lánh"], "correctIndex": 2, "level": 16, "id": 778},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'sau'?", "options": ["tối", "trước", "lạnh", "béo"], "correctIndex": 1, "level": 16, "id": 779},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Mặt trời đỏ rực như quả cầu lửa.', sự vật nào được so sánh?", "options": ["mặt trời", "hạt sương", "quả cầu lửa", "trăng"], "correctIndex": 0, "level": 16, "id": 780},
    {"subject": "Tiếng Việt", "question": "'Mặt trời đỏ rực như quả cầu lửa.' — Mặt trời được so sánh với gì?", "options": ["quả cầu lửa", "những ngôi sao", "sao", "mặt trời"], "correctIndex": 0, "level": 16, "id": 781},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'bao la'?", "options": ["mênh mông", "chịu khó", "bè bạn", "xinh đẹp"], "correctIndex": 0, "level": 16, "id": 782},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["xinh đẹp", "cái bút", "trắng tinh", "đen nhánh"], "correctIndex": 1, "level": 16, "id": 783},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Bạn Nam đá quả bóng tròn.', từ chỉ hoạt động là:", "options": ["bạn Nam", "đá", "tròn", "quả"], "correctIndex": 1, "level": 16, "id": 784},
    {"subject": "Tiếng Việt", "question": "Câu 'Đàn chim hót líu lo trên cành.' thuộc kiểu câu nào?", "options": ["Ai thế nào?", "Ai là gì?", "Ai làm gì?", "Vì sao?"], "correctIndex": 2, "level": 16, "id": 785},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'muộn'?", "options": ["gần", "đông đúc", "sớm", "béo"], "correctIndex": 2, "level": 16, "id": 786},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Foot", "Ear", "Mouth", "White"], "correctIndex": 3, "level": 16, "id": 787},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Windy", "Kite", "Sunny", "Cloudy"], "correctIndex": 1, "level": 16, "id": 788},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Park", "Sing", "Hospital", "House"], "correctIndex": 1, "level": 16, "id": 789},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ con vật?", "options": ["Dog", "Bike", "Sunny", "Scissors"], "correctIndex": 0, "level": 16, "id": 790},
    {"subject": "Tiếng Anh", "question": "'Swim' nghĩa là gì?", "options": ["Ngủ", "Bơi", "Chạy", "Đọc"], "correctIndex": 1, "level": 16, "id": 791},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ chơi?", "options": ["Bike", "Ruler", "Leg", "Sunny"], "correctIndex": 0, "level": 16, "id": 792},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ chơi?", "options": ["Doll", "Mother", "Mango", "Sunny"], "correctIndex": 0, "level": 16, "id": 793},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Bedroom", "Green", "School", "Bathroom"], "correctIndex": 1, "level": 16, "id": 794},
    {"subject": "Tiếng Anh", "question": "'Three' là số mấy?", "options": ["1", "5", "2", "3"], "correctIndex": 3, "level": 16, "id": 795},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Bedroom", "Park", "Car", "School"], "correctIndex": 2, "level": 16, "id": 796},
    {"subject": "Tiếng Anh", "question": "'Quyển vở' tiếng Anh là gì?", "options": ["Scissors", "Notebook", "Pen", "Eraser"], "correctIndex": 1, "level": 16, "id": 797},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Purple", "Black", "Green", "Rabbit"], "correctIndex": 3, "level": 16, "id": 798},
    {"subject": "Tiếng Anh", "question": "'Fifty' là số mấy?", "options": ["60", "40", "15", "50"], "correctIndex": 3, "level": 16, "id": 799},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ nơi chốn?", "options": ["Bathroom", "Grandfather", "Write", "Snake"], "correctIndex": 0, "level": 16, "id": 800},
    {"id": 801, "level": 17, "subject": "Toán", "question": "460 + 270 = ?", "options": ["630", "730", "720", "740"], "correctIndex": 1},
    {"id": 802, "level": 17, "subject": "Toán", "question": "28 × 3 = ?", "options": ["87", "74", "84", "94"], "correctIndex": 2},
    {"id": 803, "level": 17, "subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'vui vẻ'?", "options": ["hớn hở", "lo lắng", "buồn bã", "sợ hãi"], "correctIndex": 0},
    {"id": 804, "level": 17, "subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["giản rị", "dản dị", "giản dị", "rản dị"], "correctIndex": 2},
    {"id": 805, "level": 17, "subject": "Tiếng Anh", "question": "'Open your book, please.' nghĩa là gì?", "options": ["Hãy mở sách ra.", "Hãy gấp sách lại.", "Hãy ngồi xuống.", "Hãy đứng lên."], "correctIndex": 0},
    {"subject": "Toán", "question": "Thùng thứ nhất có 234 lít nước. thùng thứ hai có ít hơn Thùng thứ nhất 72 lít nước. thùng thứ hai có bao nhiêu lít nước?", "options": ["161", "172", "162", "306"], "correctIndex": 2, "level": 17, "id": 806},
    {"subject": "Toán", "question": "Giảm 24 đi 4 lần được:", "options": ["28", "7", "20", "6"], "correctIndex": 3, "level": 17, "id": 807},
    {"subject": "Toán", "question": "Tổ Một có 382 cây. Tổ Hai có ít hơn Tổ Một 65 cây. Tổ Hai có bao nhiêu cây?", "options": ["447", "327", "316", "317"], "correctIndex": 3, "level": 17, "id": 808},
    {"subject": "Toán", "question": "Mỗi chồng có 4 quyển vở. 9 chồng như thế có bao nhiêu quyển vở?", "options": ["27 quyển", "13 quyển", "36 quyển", "40 quyển"], "correctIndex": 2, "level": 17, "id": 809},
    {"subject": "Toán", "question": "36 : ? = 9. Số cần điền là:", "options": ["7", "4", "1", "3"], "correctIndex": 1, "level": 17, "id": 810},
    {"subject": "Toán", "question": "4 cm = ? mm", "options": ["50", "4", "400", "40"], "correctIndex": 3, "level": 17, "id": 811},
    {"subject": "Toán", "question": "Thùng thứ nhất có 442 lít nước. thùng thứ hai có nhiều hơn Thùng thứ nhất 5 lít nước. thùng thứ hai có bao nhiêu lít nước?", "options": ["447", "437", "446", "457"], "correctIndex": 0, "level": 17, "id": 812},
    {"subject": "Toán", "question": "237 − 84 = ?", "options": ["253", "153", "143", "163"], "correctIndex": 1, "level": 17, "id": 813},
    {"subject": "Toán", "question": "Số liền sau của 8 080 là:", "options": ["8 081", "8 079", "8 082", "8 090"], "correctIndex": 0, "level": 17, "id": 814},
    {"subject": "Toán", "question": "Nam có 525 viên bi. Minh có ít hơn Nam 33 viên bi. Minh có bao nhiêu viên bi?", "options": ["502", "492", "558", "491"], "correctIndex": 1, "level": 17, "id": 815},
    {"subject": "Toán", "question": "? × 7 = 42. Số cần điền là:", "options": ["4", "5", "9", "6"], "correctIndex": 3, "level": 17, "id": 816},
    {"subject": "Toán", "question": "Số lớn nhất trong các số dưới đây là:", "options": ["497", "417", "407", "408"], "correctIndex": 0, "level": 17, "id": 817},
    {"subject": "Toán", "question": "Kim giờ vừa qua số 12 một chút, kim phút chỉ số 3. Đồng hồ chỉ mấy giờ?", "options": ["3 giờ 0 phút", "1 giờ 15 phút", "12 giờ 15 phút", "12 giờ 45 phút"], "correctIndex": 2, "level": 17, "id": 818},
    {"subject": "Toán", "question": "Có 54 học sinh chia đều cho 6 nhóm. Mỗi nhóm được mấy bạn?", "options": ["8 bạn", "7 bạn", "12 bạn", "9 bạn"], "correctIndex": 3, "level": 17, "id": 819},
    {"subject": "Toán", "question": "Thùng thứ nhất có 264 lít nước. thùng thứ hai có nhiều hơn Thùng thứ nhất 56 lít nước. thùng thứ hai có bao nhiêu lít nước?", "options": ["320", "330", "319", "208"], "correctIndex": 0, "level": 17, "id": 820},
    {"subject": "Toán", "question": "10 : ? = 2. Số cần điền là:", "options": ["7", "6", "3", "5"], "correctIndex": 3, "level": 17, "id": 821},
    {"subject": "Toán", "question": "3 × 10 = ?", "options": ["31", "36", "29", "30"], "correctIndex": 3, "level": 17, "id": 822},
    {"subject": "Toán", "question": "3 × 2 = ?", "options": ["6", "8", "2", "1"], "correctIndex": 0, "level": 17, "id": 823},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'cứng'?", "options": ["chăm chỉ", "nghèo", "sáng", "mềm"], "correctIndex": 3, "level": 17, "id": 824},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'cần cù'?", "options": ["lấp lánh", "siêng năng", "to lớn", "chịu khó"], "correctIndex": 3, "level": 17, "id": 825},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["ngọt lịm", "cái thước", "trắng tinh", "đá bóng"], "correctIndex": 3, "level": 17, "id": 826},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'mênh mông'?", "options": ["thông minh", "lanh lợi", "im lặng", "bao la"], "correctIndex": 3, "level": 17, "id": 827},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["leo núi", "hát", "rộng rãi", "cái bút"], "correctIndex": 2, "level": 17, "id": 828},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'thật thà'?", "options": ["dối trá", "rực rỡ", "trung thực", "cần cù"], "correctIndex": 2, "level": 17, "id": 829},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'sớm'?", "options": ["cao", "ngoan", "muộn", "lười biếng"], "correctIndex": 2, "level": 17, "id": 830},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Bố sơn cánh cổng màu xanh.', từ chỉ hoạt động là:", "options": ["bố", "cánh", "sơn", "xanh"], "correctIndex": 2, "level": 17, "id": 831},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'thua'?", "options": ["cẩn thận", "dài", "thắng", "buồn"], "correctIndex": 2, "level": 17, "id": 832},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["dạy dỗ", "rạy dỗ", "dạy dổ", "dạy giỗ"], "correctIndex": 0, "level": 17, "id": 833},
    {"subject": "Tiếng Việt", "question": "'Cô giáo như mẹ hiền.' — Cô giáo được so sánh với gì?", "options": ["máu", "mẹ hiền", "hạt sương", "cô giáo"], "correctIndex": 1, "level": 17, "id": 834},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'cười'?", "options": ["khóc", "đầy", "hèn nhát", "thấp"], "correctIndex": 0, "level": 17, "id": 835},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'chịu khó'?", "options": ["khổng lồ", "hiền hậu", "cần cù", "thương yêu"], "correctIndex": 2, "level": 17, "id": 836},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ thời tiết?", "options": ["Kitchen", "Ruler", "Windy", "Sleep"], "correctIndex": 2, "level": 17, "id": 837},
    {"subject": "Tiếng Anh", "question": "'Bút sáp màu' tiếng Anh là gì?", "options": ["Pencil", "Notebook", "Eraser", "Crayon"], "correctIndex": 3, "level": 17, "id": 838},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Sister", "Jump", "Ride a bike", "Sing"], "correctIndex": 0, "level": 17, "id": 839},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Scissors", "Baby", "Notebook", "Crayon"], "correctIndex": 1, "level": 17, "id": 840},
    {"subject": "Tiếng Anh", "question": "'School bag' nghĩa là gì?", "options": ["Cái ghế", "Bút chì", "Cặp sách", "Cục tẩy"], "correctIndex": 2, "level": 17, "id": 841},
    {"subject": "Tiếng Anh", "question": "'Mẹ' tiếng Anh là gì?", "options": ["Sister", "Grandmother", "Mother", "Father"], "correctIndex": 2, "level": 17, "id": 842},
    {"subject": "Tiếng Anh", "question": "'Bà' tiếng Anh là gì?", "options": ["Baby", "Grandmother", "Father", "Sister"], "correctIndex": 1, "level": 17, "id": 843},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Mouse", "Snake", "Fish", "Ride a bike"], "correctIndex": 3, "level": 17, "id": 844},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ màu sắc?", "options": ["Green", "Hospital", "Write", "Bread"], "correctIndex": 0, "level": 17, "id": 845},
    {"subject": "Tiếng Anh", "question": "Số 13 tiếng Anh là gì?", "options": ["Ten", "Fifteen", "Fourteen", "Thirteen"], "correctIndex": 3, "level": 17, "id": 846},
    {"subject": "Tiếng Anh", "question": "'Arm' nghĩa là gì?", "options": ["Mắt", "Cánh tay", "Bàn chân", "Chân"], "correctIndex": 1, "level": 17, "id": 847},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ người trong gia đình?", "options": ["Pencil", "Park", "Mother", "Juice"], "correctIndex": 2, "level": 17, "id": 848},
    {"subject": "Tiếng Anh", "question": "'Nhảy' tiếng Anh là gì?", "options": ["Jump", "Swim", "Read", "Draw"], "correctIndex": 0, "level": 17, "id": 849},
    {"subject": "Tiếng Anh", "question": "'Pen' nghĩa là gì?", "options": ["Bút sáp màu", "Bút mực", "Cặp sách", "Cái thước"], "correctIndex": 1, "level": 17, "id": 850},
    {"id": 851, "level": 18, "subject": "Toán", "question": "508 − 203 = ?", "options": ["295", "315", "305", "405"], "correctIndex": 2},
    {"id": 852, "level": 18, "subject": "Toán", "question": "78 : 6 = ?", "options": ["14", "13", "12", "23"], "correctIndex": 1},
    {"id": 853, "level": 18, "subject": "Tiếng Việt", "question": "Câu tục ngữ nào nói về lòng biết ơn?", "options": ["Uống nước nhớ nguồn", "Nhanh như cắt", "Nước chảy đá mòn", "Chậm như rùa"], "correctIndex": 0},
    {"id": 854, "level": 18, "subject": "Tiếng Việt", "question": "Câu nào là câu cảm?", "options": ["Hãy tưới hoa đi.", "Ôi, bông hoa đẹp quá!", "Bông hoa màu đỏ.", "Bông hoa có đẹp không?"], "correctIndex": 1},
    {"id": 855, "level": 18, "subject": "Tiếng Anh", "question": "'Nose' là bộ phận nào?", "options": ["Cái tai", "Bàn tay", "Cái miệng", "Cái mũi"], "correctIndex": 3},
    {"subject": "Toán", "question": "Kim giờ vừa qua số 8 một chút, kim phút chỉ số 3. Đồng hồ chỉ mấy giờ?", "options": ["3 giờ 40 phút", "8 giờ 45 phút", "9 giờ 15 phút", "8 giờ 15 phút"], "correctIndex": 3, "level": 18, "id": 856},
    {"subject": "Toán", "question": "10 + 370 = ?", "options": ["390", "480", "370", "380"], "correctIndex": 3, "level": 18, "id": 857},
    {"subject": "Toán", "question": "Mỗi hộp có 5 cái bánh. 8 hộp như thế có bao nhiêu cái bánh?", "options": ["45 cái", "32 cái", "13 cái", "40 cái"], "correctIndex": 3, "level": 18, "id": 858},
    {"subject": "Toán", "question": "2 × 3 = ?", "options": ["5", "6", "7", "2"], "correctIndex": 1, "level": 18, "id": 859},
    {"subject": "Toán", "question": "Gấp 6 lên 4 lần được:", "options": ["18", "24", "28", "10"], "correctIndex": 1, "level": 18, "id": 860},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 9 cm, chiều rộng 5 cm. Chu vi là:", "options": ["28 cm", "14 cm", "45 cm", "23 cm"], "correctIndex": 0, "level": 18, "id": 861},
    {"subject": "Toán", "question": "Tổ Một có 264 cây. Tổ Hai có nhiều hơn Tổ Một 36 cây. Tổ Hai có bao nhiêu cây?", "options": ["310", "228", "300", "299"], "correctIndex": 2, "level": 18, "id": 862},
    {"subject": "Toán", "question": "Số liền sau của 4 060 là:", "options": ["4 070", "4 059", "4 062", "4 061"], "correctIndex": 3, "level": 18, "id": 863},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 13 cm, chiều rộng 2 cm. Chu vi là:", "options": ["28 cm", "15 cm", "30 cm", "26 cm"], "correctIndex": 2, "level": 18, "id": 864},
    {"subject": "Toán", "question": "Giảm 20 đi 5 lần được:", "options": ["4", "25", "15", "5"], "correctIndex": 0, "level": 18, "id": 865},
    {"subject": "Toán", "question": "236 + 212 = ?", "options": ["348", "448", "548", "438"], "correctIndex": 1, "level": 18, "id": 866},
    {"subject": "Toán", "question": "56 : ? = 8. Số cần điền là:", "options": ["6", "7", "10", "9"], "correctIndex": 1, "level": 18, "id": 867},
    {"subject": "Toán", "question": "Số liền trước của 7 725 là:", "options": ["7 726", "7 723", "7 715", "7 724"], "correctIndex": 3, "level": 18, "id": 868},
    {"subject": "Toán", "question": "Gấp 4 lên 5 lần được:", "options": ["16", "20", "9", "25"], "correctIndex": 1, "level": 18, "id": 869},
    {"subject": "Toán", "question": "Giá trị của biểu thức 39 + 7 × 7 là:", "options": ["88", "98", "53", "322"], "correctIndex": 0, "level": 18, "id": 870},
    {"subject": "Toán", "question": "Số lớn nhất trong các số dưới đây là:", "options": ["932", "834", "842", "923"], "correctIndex": 0, "level": 18, "id": 871},
    {"subject": "Toán", "question": "15 : ? = 5. Số cần điền là:", "options": ["3", "1", "2", "6"], "correctIndex": 0, "level": 18, "id": 872},
    {"subject": "Toán", "question": "Có 24 bông hoa chia đều cho 8 lọ. Mỗi lọ được mấy bông?", "options": ["4 bông", "6 bông", "2 bông", "3 bông"], "correctIndex": 3, "level": 18, "id": 873},
    {"subject": "Tiếng Việt", "question": "Cuối câu 'Em thích đọc truyện cổ tích …' cần đặt dấu gì?", "options": ["Dấu chấm than", "Dấu chấm hỏi", "Dấu chấm", "Dấu phẩy"], "correctIndex": 2, "level": 18, "id": 874},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["tròn xoe", "lấp lánh", "cây bàng", "lau bàn"], "correctIndex": 3, "level": 18, "id": 875},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["ngôi nhà", "đôi dép", "ngoan ngoãn", "leo núi"], "correctIndex": 2, "level": 18, "id": 876},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["sạch sẽ", "gấp quần áo", "ngoan ngoãn", "chiếc cặp"], "correctIndex": 3, "level": 18, "id": 877},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'hiền lành'?", "options": ["dữ tợn", "vụng về", "yên lặng", "vui"], "correctIndex": 0, "level": 18, "id": 878},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'rực rỡ'?", "options": ["săn sóc", "tươi thắm", "vui vẻ", "trung thực"], "correctIndex": 1, "level": 18, "id": 879},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Ông em trồng những cây cam sai quả.', từ chỉ đặc điểm là:", "options": ["ông em", "sai quả", "những", "trồng"], "correctIndex": 1, "level": 18, "id": 880},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["sáng sũa", "sáng sủa", "xáng sủa", "sáng xủa"], "correctIndex": 1, "level": 18, "id": 881},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["dộn ràng", "rộn giàng", "rộn ràng", "dộn dàng"], "correctIndex": 2, "level": 18, "id": 882},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'yếu'?", "options": ["cứng", "khỏe", "trẻ", "lên"], "correctIndex": 1, "level": 18, "id": 883},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Hạt sương long lanh như hạt ngọc.', sự vật nào được so sánh?", "options": ["hạt ngọc", "mẹ hiền", "hạt sương", "sóc"], "correctIndex": 2, "level": 18, "id": 884},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Chú mèo mướp chạy rất nhanh.', từ chỉ hoạt động là:", "options": ["rất", "chú mèo mướp", "nhanh", "chạy"], "correctIndex": 3, "level": 18, "id": 885},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'vui'?", "options": ["buồn", "ngồi", "mềm", "vắng vẻ"], "correctIndex": 0, "level": 18, "id": 886},
    {"subject": "Tiếng Anh", "question": "'Windy' nghĩa là gì?", "options": ["Nhiều mây", "Trời mưa", "Có gió", "Có tuyết"], "correctIndex": 2, "level": 18, "id": 887},
    {"subject": "Tiếng Anh", "question": "'Con chuột' tiếng Anh là gì?", "options": ["Bear", "Rabbit", "Mouse", "Bird"], "correctIndex": 2, "level": 18, "id": 888},
    {"subject": "Tiếng Anh", "question": "'Máy bay' tiếng Anh là gì?", "options": ["Ball", "Plane", "Car", "Yo-yo"], "correctIndex": 1, "level": 18, "id": 889},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Read", "Red", "Swim", "Write"], "correctIndex": 1, "level": 18, "id": 890},
    {"subject": "Tiếng Anh", "question": "'Cookie' nghĩa là gì?", "options": ["Bánh mì", "Sữa", "Quả cam", "Bánh quy"], "correctIndex": 3, "level": 18, "id": 891},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Mother", "Ball", "Car", "Boat"], "correctIndex": 0, "level": 18, "id": 892},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ dùng học tập?", "options": ["Crayon", "Sunny", "Swim", "Brown"], "correctIndex": 0, "level": 18, "id": 893},
    {"subject": "Tiếng Anh", "question": "Số 14 tiếng Anh là gì?", "options": ["Twelve", "Thirteen", "Eleven", "Fourteen"], "correctIndex": 3, "level": 18, "id": 894},
    {"subject": "Tiếng Anh", "question": "'Pencil' nghĩa là gì?", "options": ["Bút chì", "Bút sáp màu", "Cái kéo", "Cái thước"], "correctIndex": 0, "level": 18, "id": 895},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Watermelon", "Windy", "Snowy", "Cloudy"], "correctIndex": 0, "level": 18, "id": 896},
    {"subject": "Tiếng Anh", "question": "'Bút mực' tiếng Anh là gì?", "options": ["Pencil", "Chair", "Pen", "Notebook"], "correctIndex": 2, "level": 18, "id": 897},
    {"subject": "Tiếng Anh", "question": "'Orange' nghĩa là gì?", "options": ["Màu trắng", "Màu đen", "Màu hồng", "Màu cam"], "correctIndex": 3, "level": 18, "id": 898},
    {"subject": "Tiếng Anh", "question": "'Con rắn' tiếng Anh là gì?", "options": ["Snake", "Chicken", "Dog", "Pig"], "correctIndex": 0, "level": 18, "id": 899},
    {"subject": "Tiếng Anh", "question": "'Anh/em trai' tiếng Anh là gì?", "options": ["Mother", "Grandmother", "Sister", "Brother"], "correctIndex": 3, "level": 18, "id": 900},
    {"id": 901, "level": 19, "subject": "Toán", "question": "538 + 213 = ?", "options": ["741", "751", "761", "651"], "correctIndex": 1},
    {"id": 902, "level": 19, "subject": "Toán", "question": "45 × 4 = ?", "options": ["170", "190", "180", "184"], "correctIndex": 2},
    {"id": 903, "level": 19, "subject": "Tiếng Việt", "question": "Từ 'bác sĩ' là từ chỉ gì?", "options": ["hoạt động", "đặc điểm", "người", "vật"], "correctIndex": 2},
    {"id": 904, "level": 19, "subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["xương mầu", "sương mù", "sương mầu", "xương mù"], "correctIndex": 1},
    {"id": 905, "level": 19, "subject": "Tiếng Anh", "question": "'Touch your ears.' — 'ears' là gì?", "options": ["Đôi tai", "Đôi mắt", "Bàn chân", "Cái mũi"], "correctIndex": 0},
    {"subject": "Toán", "question": "Số liền sau của 420 là:", "options": ["430", "419", "422", "421"], "correctIndex": 3, "level": 19, "id": 906},
    {"subject": "Toán", "question": "Có 35 quả táo chia đều cho 5 đĩa. Mỗi đĩa được mấy quả?", "options": ["4 quả", "6 quả", "7 quả", "8 quả"], "correctIndex": 2, "level": 19, "id": 907},
    {"subject": "Toán", "question": "Tổ Một có 280 cây. Tổ Hai có nhiều hơn Tổ Một 58 cây. Tổ Hai có bao nhiêu cây?", "options": ["222", "348", "338", "337"], "correctIndex": 2, "level": 19, "id": 908},
    {"subject": "Toán", "question": "45 : 5 = ?", "options": ["11", "9", "8", "6"], "correctIndex": 1, "level": 19, "id": 909},
    {"subject": "Toán", "question": "6 × 5 = ?", "options": ["36", "30", "35", "32"], "correctIndex": 1, "level": 19, "id": 910},
    {"subject": "Toán", "question": "1/3 của 15 là:", "options": ["6", "12", "5", "8"], "correctIndex": 2, "level": 19, "id": 911},
    {"subject": "Toán", "question": "Số liền trước của 3 534 là:", "options": ["3 533", "3 524", "3 532", "3 535"], "correctIndex": 0, "level": 19, "id": 912},
    {"subject": "Toán", "question": "413 + 17 = ?", "options": ["430", "530", "429", "330"], "correctIndex": 0, "level": 19, "id": 913},
    {"subject": "Toán", "question": "460 − 202 = ?", "options": ["258", "358", "257", "259"], "correctIndex": 0, "level": 19, "id": 914},
    {"subject": "Toán", "question": "Giá trị của biểu thức (6 + 2) × 3 là:", "options": ["12", "11", "24", "27"], "correctIndex": 2, "level": 19, "id": 915},
    {"subject": "Toán", "question": "60 : 6 = ?", "options": ["12", "13", "8", "10"], "correctIndex": 3, "level": 19, "id": 916},
    {"subject": "Toán", "question": "5 m = ? cm", "options": ["500", "600", "50", "5 000"], "correctIndex": 0, "level": 19, "id": 917},
    {"subject": "Toán", "question": "Số liền trước của 4 803 là:", "options": ["4 801", "4 793", "4 802", "4 804"], "correctIndex": 2, "level": 19, "id": 918},
    {"subject": "Toán", "question": "Hình vuông có cạnh 15 cm. Chu vi hình vuông là:", "options": ["64 cm", "225 cm", "60 cm", "30 cm"], "correctIndex": 2, "level": 19, "id": 919},
    {"subject": "Toán", "question": "249 − 197 = ?", "options": ["152", "51", "52", "53"], "correctIndex": 2, "level": 19, "id": 920},
    {"subject": "Toán", "question": "Mỗi nhóm có 8 bạn. 4 nhóm như thế có bao nhiêu bạn?", "options": ["32 bạn", "12 bạn", "40 bạn", "28 bạn"], "correctIndex": 0, "level": 19, "id": 921},
    {"subject": "Toán", "question": "Có 28 quyển sách chia đều cho 4 ngăn. Mỗi ngăn được mấy quyển?", "options": ["4 quyển", "10 quyển", "7 quyển", "8 quyển"], "correctIndex": 2, "level": 19, "id": 922},
    {"subject": "Toán", "question": "308 − 171 = ?", "options": ["37", "237", "138", "137"], "correctIndex": 3, "level": 19, "id": 923},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["ngọt lịm", "cái bảng", "đi học", "xinh đẹp"], "correctIndex": 2, "level": 19, "id": 924},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'dài'?", "options": ["thua", "ngắn", "bẩn", "nhẹ"], "correctIndex": 1, "level": 19, "id": 925},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'khéo léo'?", "options": ["vụng về", "đắng", "trên", "thấp"], "correctIndex": 0, "level": 19, "id": 926},
    {"subject": "Tiếng Việt", "question": "'Mắt bé sáng như sao.' — Mắt bé được so sánh với gì?", "options": ["sao", "ngàn con mắt", "trăng", "mắt bé"], "correctIndex": 0, "level": 19, "id": 927},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'giàu'?", "options": ["nghèo", "gần", "vắng vẻ", "vui"], "correctIndex": 0, "level": 19, "id": 928},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["sửa trữa", "sửa chữa", "xửa chữa", "sữa chửa"], "correctIndex": 1, "level": 19, "id": 929},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'mềm'?", "options": ["thua", "tối", "vơi", "cứng"], "correctIndex": 3, "level": 19, "id": 930},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'căn nhà'?", "options": ["ngôi nhà", "đất nước", "thương yêu", "chăm chỉ"], "correctIndex": 0, "level": 19, "id": 931},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["sạch sẽ", "chăm chỉ", "cây bàng", "nấu cơm"], "correctIndex": 3, "level": 19, "id": 932},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Cô giáo giảng bài rất dễ hiểu.', từ chỉ hoạt động là:", "options": ["dễ hiểu", "bài", "giảng", "cô giáo"], "correctIndex": 2, "level": 19, "id": 933},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'lặng im'?", "options": ["chăm chỉ", "khổng lồ", "im lặng", "vui vẻ"], "correctIndex": 2, "level": 19, "id": 934},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["ngọt lịm", "nhỏ xíu", "ngôi nhà", "cho gà ăn"], "correctIndex": 3, "level": 19, "id": 935},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'trên'?", "options": ["dưới", "bừa bộn", "mềm", "thắng"], "correctIndex": 0, "level": 19, "id": 936},
    {"subject": "Tiếng Anh", "question": "'Bread' nghĩa là gì?", "options": ["Bánh mì", "Sữa", "Dưa hấu", "Quả trứng"], "correctIndex": 0, "level": 19, "id": 937},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Sunny", "Teddy bear", "Cloudy", "Rainy"], "correctIndex": 1, "level": 19, "id": 938},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ dùng học tập?", "options": ["Cloudy", "Ruler", "Orange", "Fish"], "correctIndex": 1, "level": 19, "id": 939},
    {"subject": "Tiếng Anh", "question": "'Bánh quy' tiếng Anh là gì?", "options": ["Cookie", "Rice", "Grapes", "Milk"], "correctIndex": 0, "level": 19, "id": 940},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ chơi?", "options": ["Boat", "Blue", "Ruler", "Snowy"], "correctIndex": 0, "level": 19, "id": 941},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ bộ phận cơ thể?", "options": ["Blue", "Tiger", "Mouth", "Father"], "correctIndex": 2, "level": 19, "id": 942},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Mouth", "Grandmother", "Tooth", "Ear"], "correctIndex": 1, "level": 19, "id": 943},
    {"subject": "Tiếng Anh", "question": "'Duck' nghĩa là gì?", "options": ["Con hươu cao cổ", "Con ngựa", "Con ếch", "Con vịt"], "correctIndex": 3, "level": 19, "id": 944},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Ice cream", "Milk", "Bedroom", "Rice"], "correctIndex": 2, "level": 19, "id": 945},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ hoạt động?", "options": ["Orange", "Draw", "Cloudy", "Doll"], "correctIndex": 1, "level": 19, "id": 946},
    {"subject": "Tiếng Anh", "question": "'Five' là số mấy?", "options": ["5", "3", "6", "2"], "correctIndex": 0, "level": 19, "id": 947},
    {"subject": "Tiếng Anh", "question": "'Foot' nghĩa là gì?", "options": ["Cánh tay", "Mũi", "Chân", "Bàn chân"], "correctIndex": 3, "level": 19, "id": 948},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Scissors", "Bedroom", "Hospital", "Kitchen"], "correctIndex": 0, "level": 19, "id": 949},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ chơi?", "options": ["Dance", "Fish", "Scissors", "Yo-yo"], "correctIndex": 3, "level": 19, "id": 950},
    {"id": 951, "level": 20, "subject": "Toán", "question": "510 − 291 = ?", "options": ["229", "219", "209", "319"], "correctIndex": 1},
    {"id": 952, "level": 20, "subject": "Toán", "question": "92 : 4 = ?", "options": ["33", "23", "22", "24"], "correctIndex": 1},
    {"id": 953, "level": 20, "subject": "Tiếng Việt", "question": "Câu 'Ông mặt trời đỏ rực.' trả lời cho câu hỏi nào?", "options": ["Ở đâu?", "Là gì?", "Thế nào?", "Làm gì?"], "correctIndex": 2},
    {"id": 954, "level": 20, "subject": "Tiếng Việt", "question": "Từ nào chỉ sự vật?", "options": ["chăm chỉ", "xinh xắn", "đi học", "con đường"], "correctIndex": 3},
    {"id": 955, "level": 20, "subject": "Tiếng Anh", "question": "'What colour is it?' — 'It is ___.'", "options": ["eight", "my friend", "green", "a pen"], "correctIndex": 2},
    {"subject": "Toán", "question": "Lan có 227 quyển truyện. Hoa có nhiều hơn Lan 86 quyển truyện. Hoa có bao nhiêu quyển truyện?", "options": ["313", "141", "312", "323"], "correctIndex": 0, "level": 20, "id": 956},
    {"subject": "Toán", "question": "Có 27 cái kẹo chia đều cho 3 bạn. Mỗi bạn được mấy cái?", "options": ["6 cái", "7 cái", "9 cái", "8 cái"], "correctIndex": 2, "level": 20, "id": 957},
    {"subject": "Toán", "question": "232 + 33 = ?", "options": ["275", "255", "264", "265"], "correctIndex": 3, "level": 20, "id": 958},
    {"subject": "Toán", "question": "Mỗi hàng có 9 chiếc xe. 5 hàng như thế có bao nhiêu chiếc xe?", "options": ["14 chiếc", "45 chiếc", "54 chiếc", "40 chiếc"], "correctIndex": 1, "level": 20, "id": 959},
    {"subject": "Toán", "question": "Mỗi lọ có 9 bông hoa. 9 lọ như thế có bao nhiêu bông hoa?", "options": ["18 bông", "81 bông", "72 bông", "90 bông"], "correctIndex": 1, "level": 20, "id": 960},
    {"subject": "Toán", "question": "? × 6 = 30. Số cần điền là:", "options": ["2", "3", "4", "5"], "correctIndex": 3, "level": 20, "id": 961},
    {"subject": "Toán", "question": "Số liền trước của 5 118 là:", "options": ["5 119", "5 116", "5 117", "5 108"], "correctIndex": 2, "level": 20, "id": 962},
    {"subject": "Toán", "question": "Số liền sau của 5 269 là:", "options": ["5 271", "5 279", "5 268", "5 270"], "correctIndex": 3, "level": 20, "id": 963},
    {"subject": "Toán", "question": "Mỗi can có 9 lít dầu. 6 can như thế có bao nhiêu lít dầu?", "options": ["15 lít", "54 lít", "48 lít", "63 lít"], "correctIndex": 1, "level": 20, "id": 964},
    {"subject": "Toán", "question": "5 cm = ? mm", "options": ["60", "50", "500", "5"], "correctIndex": 1, "level": 20, "id": 965},
    {"subject": "Toán", "question": "? × 6 = 36. Số cần điền là:", "options": ["4", "9", "3", "6"], "correctIndex": 3, "level": 20, "id": 966},
    {"subject": "Toán", "question": "10 + 425 = ?", "options": ["435", "425", "434", "335"], "correctIndex": 0, "level": 20, "id": 967},
    {"subject": "Toán", "question": "4 kg = ? g", "options": ["40 000", "4 000", "400", "5 000"], "correctIndex": 1, "level": 20, "id": 968},
    {"subject": "Toán", "question": "Giá trị của biểu thức 39 + 4 × 4 là:", "options": ["55", "172", "65", "47"], "correctIndex": 0, "level": 20, "id": 969},
    {"subject": "Toán", "question": "4 giờ = ? phút", "options": ["24", "240", "300", "2 400"], "correctIndex": 1, "level": 20, "id": 970},
    {"subject": "Toán", "question": "Lan có 329 quyển truyện. Hoa có ít hơn Lan 50 quyển truyện. Hoa có bao nhiêu quyển truyện?", "options": ["289", "279", "278", "379"], "correctIndex": 1, "level": 20, "id": 971},
    {"subject": "Toán", "question": "Kim giờ ở giữa số 5 và số 6, kim phút chỉ số 6. Đồng hồ chỉ mấy giờ?", "options": ["6 giờ 25 phút", "6 giờ 30 phút", "5 giờ 30 phút", "5 giờ 15 phút"], "correctIndex": 2, "level": 20, "id": 972},
    {"subject": "Toán", "question": "Mỗi lọ có 8 bông hoa. 7 lọ như thế có bao nhiêu bông hoa?", "options": ["49 bông", "56 bông", "64 bông", "15 bông"], "correctIndex": 1, "level": 20, "id": 973},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'khóc'?", "options": ["đóng", "mở", "vào", "cười"], "correctIndex": 3, "level": 20, "id": 974},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'chậm'?", "options": ["giàu", "ngồi", "nhanh", "rộng"], "correctIndex": 2, "level": 20, "id": 975},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Bạn Hoa hát rất hay.', từ chỉ đặc điểm là:", "options": ["rất", "bạn Hoa", "hát", "hay"], "correctIndex": 3, "level": 20, "id": 976},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'siêng năng'?", "options": ["chăm chỉ", "bao la", "bé xíu", "yêu thương"], "correctIndex": 0, "level": 20, "id": 977},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["gấp quần áo", "sạch sẽ", "con đường", "rửa bát"], "correctIndex": 2, "level": 20, "id": 978},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["ngôi nhà", "gấp quần áo", "đen nhánh", "trắng tinh"], "correctIndex": 0, "level": 20, "id": 979},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'già'?", "options": ["đóng", "trẻ", "tối", "dài"], "correctIndex": 1, "level": 20, "id": 980},
    {"subject": "Tiếng Việt", "question": "Cuối câu 'Bà em năm nay đã bảy mươi tuổi …' cần đặt dấu gì?", "options": ["Dấu phẩy", "Dấu chấm than", "Dấu chấm hỏi", "Dấu chấm"], "correctIndex": 3, "level": 20, "id": 981},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["gấp quần áo", "xanh biếc", "hát", "chú bộ đội"], "correctIndex": 1, "level": 20, "id": 982},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'nhỏ'?", "options": ["nhanh", "to", "khỏe", "vụng về"], "correctIndex": 1, "level": 20, "id": 983},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["nấu cơm", "trồng cây", "dịu dàng", "đọc sách"], "correctIndex": 2, "level": 20, "id": 984},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'tối'?", "options": ["sáng", "trước", "cười", "nóng"], "correctIndex": 0, "level": 20, "id": 985},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'gầy'?", "options": ["béo", "tối", "thắng", "cao"], "correctIndex": 0, "level": 20, "id": 986},
    {"subject": "Tiếng Anh", "question": "'Eleven' là số mấy?", "options": ["14", "10", "13", "11"], "correctIndex": 3, "level": 20, "id": 987},
    {"subject": "Tiếng Anh", "question": "'Sunny' nghĩa là gì?", "options": ["Trời mưa", "Trời nắng", "Có tuyết", "Có gió"], "correctIndex": 1, "level": 20, "id": 988},
    {"subject": "Tiếng Anh", "question": "'Four' là số mấy?", "options": ["6", "4", "1", "2"], "correctIndex": 1, "level": 20, "id": 989},
    {"subject": "Tiếng Anh", "question": "'Bút chì' tiếng Anh là gì?", "options": ["Pencil", "Pen", "Scissors", "Chair"], "correctIndex": 0, "level": 20, "id": 990},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ người trong gia đình?", "options": ["Brother", "Elephant", "Yo-yo", "Tooth"], "correctIndex": 0, "level": 20, "id": 991},
    {"subject": "Tiếng Anh", "question": "'Nose' nghĩa là gì?", "options": ["Tai", "Cánh tay", "Mũi", "Răng"], "correctIndex": 2, "level": 20, "id": 992},
    {"subject": "Tiếng Anh", "question": "'Boat' nghĩa là gì?", "options": ["Ô tô", "Con diều", "Con thuyền", "Gấu bông"], "correctIndex": 2, "level": 20, "id": 993},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ thời tiết?", "options": ["Ruler", "Father", "Purple", "Snowy"], "correctIndex": 3, "level": 20, "id": 994},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Pencil", "Book", "Crayon", "Father"], "correctIndex": 3, "level": 20, "id": 995},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Lion", "Mouth", "Arm", "Nose"], "correctIndex": 0, "level": 20, "id": 996},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Grandfather", "Mango", "Father", "Mother"], "correctIndex": 1, "level": 20, "id": 997},
    {"subject": "Tiếng Anh", "question": "'Chân' tiếng Anh là gì?", "options": ["Eye", "Leg", "Mouth", "Ear"], "correctIndex": 1, "level": 20, "id": 998},
    {"subject": "Tiếng Anh", "question": "'Crayon' nghĩa là gì?", "options": ["Bút mực", "Cái thước", "Bút sáp màu", "Cặp sách"], "correctIndex": 2, "level": 20, "id": 999},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ ăn?", "options": ["Egg", "Swim", "Kitchen", "Sunny"], "correctIndex": 0, "level": 20, "id": 1000},
    {"id": 1001, "level": 21, "subject": "Toán", "question": "1 kg = ? g", "options": ["10000", "100", "1000", "10"], "correctIndex": 2},
    {"id": 1002, "level": 21, "subject": "Toán", "question": "1 ngày có bao nhiêu giờ?", "options": ["30", "60", "24", "12"], "correctIndex": 2},
    {"id": 1003, "level": 21, "subject": "Tiếng Việt", "question": "Từ nào là từ chỉ âm thanh?", "options": ["nhỏ bé", "róc rách", "to lớn", "xanh mướt"], "correctIndex": 1},
    {"id": 1004, "level": 21, "subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["trung thực", "chung thực", "trung thựt", "chung thựt"], "correctIndex": 0},
    {"id": 1005, "level": 21, "subject": "Tiếng Anh", "question": "'I like football.' — Bạn ấy thích gì?", "options": ["Bơi lội", "Bóng rổ", "Cầu lông", "Bóng đá"], "correctIndex": 3},
    {"subject": "Toán", "question": "Có 12 học sinh chia đều cho 3 nhóm. Mỗi nhóm được mấy bạn?", "options": ["6 bạn", "4 bạn", "3 bạn", "7 bạn"], "correctIndex": 1, "level": 21, "id": 1006},
    {"subject": "Toán", "question": "36 : 4 = ?", "options": ["9", "8", "6", "12"], "correctIndex": 0, "level": 21, "id": 1007},
    {"subject": "Toán", "question": "2 876 + 4 043 = ?", "options": ["6 919", "6 929", "7 019", "6 920"], "correctIndex": 0, "level": 21, "id": 1008},
    {"subject": "Toán", "question": "2 832 + 2 686 = ?", "options": ["5 518", "5 418", "5 519", "5 618"], "correctIndex": 0, "level": 21, "id": 1009},
    {"subject": "Toán", "question": "Số liền trước của 55 653 là:", "options": ["55 654", "55 651", "55 652", "55 643"], "correctIndex": 2, "level": 21, "id": 1010},
    {"subject": "Toán", "question": "Số liền sau của 93 346 là:", "options": ["93 356", "93 347", "93 345", "93 348"], "correctIndex": 1, "level": 21, "id": 1011},
    {"subject": "Toán", "question": "4 945 + 4 947 = ?", "options": ["9 892", "9 902", "9 891", "9 893"], "correctIndex": 0, "level": 21, "id": 1012},
    {"subject": "Toán", "question": "Số lớn nhất trong các số dưới đây là:", "options": ["659", "758", "660", "668"], "correctIndex": 1, "level": 21, "id": 1013},
    {"subject": "Toán", "question": "1 445 + 3 895 = ?", "options": ["5 350", "5 339", "5 240", "5 340"], "correctIndex": 3, "level": 21, "id": 1014},
    {"subject": "Toán", "question": "Mỗi đĩa có 3 quả cam. 8 đĩa như thế có bao nhiêu quả cam?", "options": ["24 quả", "11 quả", "16 quả", "27 quả"], "correctIndex": 0, "level": 21, "id": 1015},
    {"subject": "Toán", "question": "Giá trị của biểu thức (8 + 4) × 3 là:", "options": ["36", "15", "39", "20"], "correctIndex": 0, "level": 21, "id": 1016},
    {"subject": "Toán", "question": "4 488 − 1 529 = ?", "options": ["2 859", "2 959", "2 949", "3 059"], "correctIndex": 1, "level": 21, "id": 1017},
    {"subject": "Toán", "question": "4 371 − 1 441 = ?", "options": ["2 920", "2 930", "2 830", "2 940"], "correctIndex": 1, "level": 21, "id": 1018},
    {"subject": "Toán", "question": "2 372 − 589 = ?", "options": ["1 783", "1 784", "1 683", "1 773"], "correctIndex": 0, "level": 21, "id": 1019},
    {"subject": "Toán", "question": "Có 16 bông hoa chia đều cho 2 lọ. Mỗi lọ được mấy bông?", "options": ["6 bông", "11 bông", "5 bông", "8 bông"], "correctIndex": 3, "level": 21, "id": 1020},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 7 cm, chiều rộng 2 cm. Chu vi là:", "options": ["16 cm", "9 cm", "18 cm", "14 cm"], "correctIndex": 2, "level": 21, "id": 1021},
    {"subject": "Toán", "question": "Tổ Một có 187 cây. Tổ Hai có ít hơn Tổ Một 20 cây. Tổ Hai có bao nhiêu cây?", "options": ["166", "177", "167", "207"], "correctIndex": 2, "level": 21, "id": 1022},
    {"subject": "Toán", "question": "Có 54 quyển sách chia đều cho 9 ngăn. Mỗi ngăn được mấy quyển?", "options": ["8 quyển", "6 quyển", "7 quyển", "5 quyển"], "correctIndex": 1, "level": 21, "id": 1023},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["đen nhánh", "kể chuyện", "bác sĩ", "dòng sông"], "correctIndex": 0, "level": 21, "id": 1024},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'thắng'?", "options": ["sạch", "thua", "nóng", "xuống"], "correctIndex": 1, "level": 21, "id": 1025},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'dữ tợn'?", "options": ["hiền lành", "đóng", "nhanh", "cười"], "correctIndex": 0, "level": 21, "id": 1026},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'bé xíu'?", "options": ["chăm sóc", "xinh xắn", "chăm chỉ", "nhỏ bé"], "correctIndex": 3, "level": 21, "id": 1027},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'hiền hậu'?", "options": ["chịu khó", "hiền lành", "hỗ trợ", "xinh xắn"], "correctIndex": 1, "level": 21, "id": 1028},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["ăn cơm", "chú bộ đội", "đọc sách", "hiền lành"], "correctIndex": 1, "level": 21, "id": 1029},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'mẹ'?", "options": ["khổng lồ", "má", "bao la", "yêu thương"], "correctIndex": 1, "level": 21, "id": 1030},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'lạnh'?", "options": ["chăm chỉ", "nóng", "xuống", "cũ"], "correctIndex": 1, "level": 21, "id": 1031},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'yêu thương'?", "options": ["thương yêu", "xinh đẹp", "bạn bè", "rực rỡ"], "correctIndex": 0, "level": 21, "id": 1032},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["mềm mại", "chăm chỉ", "ăn cơm", "tươi tốt"], "correctIndex": 2, "level": 21, "id": 1033},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'ngồi'?", "options": ["đứng", "mở", "xa", "dối trá"], "correctIndex": 0, "level": 21, "id": 1034},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["mềm mại", "đỏ thắm", "thơm ngát", "trường học"], "correctIndex": 3, "level": 21, "id": 1035},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'thật thà'?", "options": ["nhanh", "cẩu thả", "dối trá", "mềm"], "correctIndex": 2, "level": 21, "id": 1036},
    {"subject": "Tiếng Anh", "question": "'Hát' tiếng Anh là gì?", "options": ["Sing", "Dance", "Jump", "Run"], "correctIndex": 0, "level": 21, "id": 1037},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Hand", "Foot", "Eye", "Bird"], "correctIndex": 3, "level": 21, "id": 1038},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Rainy", "Orange", "Grapes", "Bread"], "correctIndex": 0, "level": 21, "id": 1039},
    {"subject": "Tiếng Anh", "question": "'Có gió' tiếng Anh là gì?", "options": ["Sunny", "Cloudy", "Windy", "Rainy"], "correctIndex": 2, "level": 21, "id": 1040},
    {"subject": "Tiếng Anh", "question": "'Hand' nghĩa là gì?", "options": ["Bàn tay", "Mũi", "Răng", "Tai"], "correctIndex": 0, "level": 21, "id": 1041},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ dùng học tập?", "options": ["Brown", "Bike", "Mother", "Notebook"], "correctIndex": 3, "level": 21, "id": 1042},
    {"subject": "Tiếng Anh", "question": "'Cloudy' nghĩa là gì?", "options": ["Nhiều mây", "Trời nắng", "Có tuyết", "Trời mưa"], "correctIndex": 0, "level": 21, "id": 1043},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ hoạt động?", "options": ["Swim", "Father", "Chair", "Ball"], "correctIndex": 0, "level": 21, "id": 1044},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Dance", "Snowy", "Rainy", "Sunny"], "correctIndex": 0, "level": 21, "id": 1045},
    {"subject": "Tiếng Anh", "question": "Số 8 tiếng Anh là gì?", "options": ["Six", "Nine", "Eight", "Eleven"], "correctIndex": 2, "level": 21, "id": 1046},
    {"subject": "Tiếng Anh", "question": "'Màu tím' tiếng Anh là gì?", "options": ["Orange", "Purple", "Green", "Black"], "correctIndex": 1, "level": 21, "id": 1047},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["House", "Bird", "Cow", "Elephant"], "correctIndex": 0, "level": 21, "id": 1048},
    {"subject": "Tiếng Anh", "question": "Số 5 tiếng Anh là gì?", "options": ["Eight", "Six", "Five", "Two"], "correctIndex": 2, "level": 21, "id": 1049},
    {"subject": "Tiếng Anh", "question": "'Kite' nghĩa là gì?", "options": ["Xe đạp", "Con diều", "Máy bay", "Gấu bông"], "correctIndex": 1, "level": 21, "id": 1050},
    {"id": 1051, "level": 22, "subject": "Toán", "question": "1 l = ? ml", "options": ["100", "1000", "500", "10"], "correctIndex": 1},
    {"id": 1052, "level": 22, "subject": "Toán", "question": "29 : 4 = 7 dư bao nhiêu?", "options": ["1", "2", "3", "0"], "correctIndex": 0},
    {"id": 1053, "level": 22, "subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'siêng năng'?", "options": ["cần cù", "lười biếng", "chịu khó", "chăm chỉ"], "correctIndex": 1},
    {"id": 1054, "level": 22, "subject": "Tiếng Việt", "question": "'Em yêu trường em.' — Từ 'yêu' chỉ gì?", "options": ["màu sắc", "thời gian", "sự vật", "tình cảm"], "correctIndex": 3},
    {"id": 1055, "level": 22, "subject": "Tiếng Anh", "question": "'What is your hobby?' nghĩa là gì?", "options": ["Bạn mấy tuổi?", "Bạn tên là gì?", "Đây là cái gì?", "Sở thích của bạn là gì?"], "correctIndex": 3},
    {"subject": "Toán", "question": "Số liền sau của 42 139 là:", "options": ["42 140", "42 141", "42 138", "42 149"], "correctIndex": 0, "level": 22, "id": 1056},
    {"subject": "Toán", "question": "27 : 3 = ?", "options": ["12", "9", "6", "11"], "correctIndex": 1, "level": 22, "id": 1057},
    {"subject": "Toán", "question": "Thùng thứ nhất có 108 lít nước. thùng thứ hai có nhiều hơn Thùng thứ nhất 71 lít nước. thùng thứ hai có bao nhiêu lít nước?", "options": ["178", "189", "179", "37"], "correctIndex": 2, "level": 22, "id": 1058},
    {"subject": "Toán", "question": "? × 3 = 15. Số cần điền là:", "options": ["4", "5", "7", "2"], "correctIndex": 1, "level": 22, "id": 1059},
    {"subject": "Toán", "question": "Số liền sau của 92 624 là:", "options": ["92 623", "92 625", "92 634", "92 626"], "correctIndex": 1, "level": 22, "id": 1060},
    {"subject": "Toán", "question": "Có 32 bông hoa chia đều cho 4 lọ. Mỗi lọ được mấy bông?", "options": ["11 bông", "9 bông", "8 bông", "5 bông"], "correctIndex": 2, "level": 22, "id": 1061},
    {"subject": "Toán", "question": "Số liền trước của 86 448 là:", "options": ["86 438", "86 447", "86 446", "86 449"], "correctIndex": 1, "level": 22, "id": 1062},
    {"subject": "Toán", "question": "Giá trị của biểu thức 40 + 4 × 6 là:", "options": ["264", "50", "64", "74"], "correctIndex": 2, "level": 22, "id": 1063},
    {"subject": "Toán", "question": "Số liền trước của 86 673 là:", "options": ["86 672", "86 671", "86 674", "86 663"], "correctIndex": 0, "level": 22, "id": 1064},
    {"subject": "Toán", "question": "Làm tròn số 189 đến hàng trăm được:", "options": ["200", "190", "300", "100"], "correctIndex": 0, "level": 22, "id": 1065},
    {"subject": "Toán", "question": "Làm tròn số 754 đến hàng trăm được:", "options": ["700", "900", "800", "750"], "correctIndex": 2, "level": 22, "id": 1066},
    {"subject": "Toán", "question": "9 × 3 = ?", "options": ["33", "24", "22", "27"], "correctIndex": 3, "level": 22, "id": 1067},
    {"subject": "Toán", "question": "9 × 2 = ?", "options": ["18", "17", "14", "23"], "correctIndex": 0, "level": 22, "id": 1068},
    {"subject": "Toán", "question": "Làm tròn số 578 đến hàng trăm được:", "options": ["600", "580", "700", "500"], "correctIndex": 0, "level": 22, "id": 1069},
    {"subject": "Toán", "question": "Số liền trước của 52 886 là:", "options": ["52 885", "52 884", "52 876", "52 887"], "correctIndex": 0, "level": 22, "id": 1070},
    {"subject": "Toán", "question": "Số liền trước của 7 928 là:", "options": ["7 929", "7 926", "7 918", "7 927"], "correctIndex": 3, "level": 22, "id": 1071},
    {"subject": "Toán", "question": "Giá trị của biểu thức 48 + 8 × 4 là:", "options": ["60", "224", "80", "90"], "correctIndex": 2, "level": 22, "id": 1072},
    {"subject": "Toán", "question": "Làm tròn số 839 đến hàng chục được:", "options": ["850", "840", "800", "830"], "correctIndex": 1, "level": 22, "id": 1073},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'nhỏ bé'?", "options": ["học tập", "im lặng", "bé xíu", "đất nước"], "correctIndex": 2, "level": 22, "id": 1074},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["thơm ngát", "con chim", "rửa bát", "quyển vở"], "correctIndex": 0, "level": 22, "id": 1075},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["đôi dép", "hiền lành", "ăn cơm", "ngọt lịm"], "correctIndex": 0, "level": 22, "id": 1076},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["tưới cây", "đỏ thắm", "con đường", "đá bóng"], "correctIndex": 1, "level": 22, "id": 1077},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'bẩn'?", "options": ["mềm", "sạch", "dối trá", "yếu"], "correctIndex": 1, "level": 22, "id": 1078},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'xa'?", "options": ["chăm chỉ", "nhanh", "gần", "dữ tợn"], "correctIndex": 2, "level": 22, "id": 1079},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'bè bạn'?", "options": ["im lặng", "rực rỡ", "bạn bè", "gan dạ"], "correctIndex": 2, "level": 22, "id": 1080},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Chú cún nhỏ vẫy cái đuôi ngắn.', từ chỉ hoạt động là:", "options": ["vẫy", "ngắn", "chú cún", "nhỏ"], "correctIndex": 0, "level": 22, "id": 1081},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'xuống'?", "options": ["bừa bộn", "vui", "lên", "ngốc nghếch"], "correctIndex": 2, "level": 22, "id": 1082},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'nhẹ'?", "options": ["nặng", "to", "thua", "già"], "correctIndex": 0, "level": 22, "id": 1083},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["cao vút", "trắng tinh", "chú bộ đội", "leo núi"], "correctIndex": 3, "level": 22, "id": 1084},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["trắng tinh", "dòng sông", "kể chuyện", "cao vút"], "correctIndex": 2, "level": 22, "id": 1085},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'mới'?", "options": ["dũng cảm", "cũ", "dài", "ồn ào"], "correctIndex": 1, "level": 22, "id": 1086},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Grandmother", "Father", "Sister", "Park"], "correctIndex": 3, "level": 22, "id": 1087},
    {"subject": "Tiếng Anh", "question": "'Hospital' nghĩa là gì?", "options": ["Phòng tắm", "Bệnh viện", "Phòng ngủ", "Ngôi nhà"], "correctIndex": 1, "level": 22, "id": 1088},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ hoạt động?", "options": ["Run", "Orange", "Mouse", "Train"], "correctIndex": 0, "level": 22, "id": 1089},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ màu sắc?", "options": ["Rainy", "Park", "Hand", "Purple"], "correctIndex": 3, "level": 22, "id": 1090},
    {"subject": "Tiếng Anh", "question": "'Kitchen' nghĩa là gì?", "options": ["Nhà bếp", "Công viên", "Phòng ngủ", "Phòng tắm"], "correctIndex": 0, "level": 22, "id": 1091},
    {"subject": "Tiếng Anh", "question": "'Công viên' tiếng Anh là gì?", "options": ["Park", "Hospital", "Kitchen", "Bathroom"], "correctIndex": 0, "level": 22, "id": 1092},
    {"subject": "Tiếng Anh", "question": "'Phòng ngủ' tiếng Anh là gì?", "options": ["House", "Bedroom", "Hospital", "Park"], "correctIndex": 1, "level": 22, "id": 1093},
    {"subject": "Tiếng Anh", "question": "'Bedroom' nghĩa là gì?", "options": ["Phòng ngủ", "Trường học", "Phòng tắm", "Ngôi nhà"], "correctIndex": 0, "level": 22, "id": 1094},
    {"subject": "Tiếng Anh", "question": "Từ nào viết đúng chính tả?", "options": ["sistor", "syster", "sister", "sisster"], "correctIndex": 2, "level": 22, "id": 1095},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ hoạt động?", "options": ["Grandfather", "White", "Read", "Milk"], "correctIndex": 2, "level": 22, "id": 1096},
    {"subject": "Tiếng Anh", "question": "'Màu trắng' tiếng Anh là gì?", "options": ["Yellow", "Orange", "Brown", "White"], "correctIndex": 3, "level": 22, "id": 1097},
    {"subject": "Tiếng Anh", "question": "'Con gà' tiếng Anh là gì?", "options": ["Snake", "Chicken", "Monkey", "Giraffe"], "correctIndex": 1, "level": 22, "id": 1098},
    {"subject": "Tiếng Anh", "question": "'Quả trứng' tiếng Anh là gì?", "options": ["Egg", "Banana", "Juice", "Mango"], "correctIndex": 0, "level": 22, "id": 1099},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ dùng học tập?", "options": ["Tooth", "Windy", "Pencil", "White"], "correctIndex": 2, "level": 22, "id": 1100},
    {"id": 1101, "level": 23, "subject": "Toán", "question": "3 m = ? cm", "options": ["33", "300", "30", "3000"], "correctIndex": 1},
    {"id": 1102, "level": 23, "subject": "Toán", "question": "1 năm có bao nhiêu tháng?", "options": ["24", "12", "7", "10"], "correctIndex": 1},
    {"id": 1103, "level": 23, "subject": "Tiếng Việt", "question": "Trong câu 'Chim hót trên cành cây.', bộ phận trả lời câu hỏi 'Ở đâu?' là:", "options": ["chim hót", "hót", "chim", "trên cành cây"], "correctIndex": 3},
    {"id": 1104, "level": 23, "subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["quả nhảm", "quã nhãn", "quả nhãn", "quả nhản"], "correctIndex": 2},
    {"id": 1105, "level": 23, "subject": "Tiếng Anh", "question": "'Let us play chess.' — 'chess' là gì?", "options": ["Cờ vua", "Trốn tìm", "Nhảy dây", "Bóng đá"], "correctIndex": 0},
    {"subject": "Toán", "question": "Số liền sau của 75 944 là:", "options": ["75 943", "75 954", "75 946", "75 945"], "correctIndex": 3, "level": 23, "id": 1106},
    {"subject": "Toán", "question": "4 297 − 1 433 = ?", "options": ["2 864", "2 874", "2 764", "2 865"], "correctIndex": 0, "level": 23, "id": 1107},
    {"subject": "Toán", "question": "Số liền sau của 58 225 là:", "options": ["58 224", "58 226", "58 235", "58 227"], "correctIndex": 1, "level": 23, "id": 1108},
    {"subject": "Toán", "question": "27 : ? = 3. Số cần điền là:", "options": ["6", "12", "8", "9"], "correctIndex": 3, "level": 23, "id": 1109},
    {"subject": "Toán", "question": "Gấp 8 lên 2 lần được:", "options": ["8", "16", "10", "18"], "correctIndex": 1, "level": 23, "id": 1110},
    {"subject": "Toán", "question": "Giảm 42 đi 6 lần được:", "options": ["7", "36", "8", "48"], "correctIndex": 0, "level": 23, "id": 1111},
    {"subject": "Toán", "question": "Mỗi can có 3 lít dầu. 9 can như thế có bao nhiêu lít dầu?", "options": ["18 lít", "12 lít", "27 lít", "30 lít"], "correctIndex": 2, "level": 23, "id": 1112},
    {"subject": "Toán", "question": "Giá trị của biểu thức (3 + 8) × 3 là:", "options": ["33", "14", "27", "36"], "correctIndex": 0, "level": 23, "id": 1113},
    {"subject": "Toán", "question": "Số bé nhất trong các số dưới đây là:", "options": ["174", "263", "173", "273"], "correctIndex": 2, "level": 23, "id": 1114},
    {"subject": "Toán", "question": "2 843 + 2 473 = ?", "options": ["5 306", "5 317", "5 416", "5 316"], "correctIndex": 3, "level": 23, "id": 1115},
    {"subject": "Toán", "question": "2 m = ? cm", "options": ["2 000", "200", "20", "300"], "correctIndex": 1, "level": 23, "id": 1116},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 8 cm, chiều rộng 4 cm. Chu vi là:", "options": ["24 cm", "12 cm", "20 cm", "32 cm"], "correctIndex": 0, "level": 23, "id": 1117},
    {"subject": "Toán", "question": "Số liền sau của 18 864 là:", "options": ["18 865", "18 866", "18 863", "18 874"], "correctIndex": 0, "level": 23, "id": 1118},
    {"subject": "Toán", "question": "Giá trị của biểu thức (5 + 9) × 3 là:", "options": ["42", "17", "32", "45"], "correctIndex": 0, "level": 23, "id": 1119},
    {"subject": "Toán", "question": "5 giờ = ? phút", "options": ["300", "360", "30", "3 000"], "correctIndex": 0, "level": 23, "id": 1120},
    {"subject": "Toán", "question": "3 615 − 3 530 = ?", "options": ["84", "85", "75", "95"], "correctIndex": 1, "level": 23, "id": 1121},
    {"subject": "Toán", "question": "Làm tròn số 733 đến hàng chục được:", "options": ["720", "740", "730", "700"], "correctIndex": 2, "level": 23, "id": 1122},
    {"subject": "Toán", "question": "Giá trị của biểu thức (6 + 6) × 3 là:", "options": ["15", "36", "24", "39"], "correctIndex": 1, "level": 23, "id": 1123},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'vơi'?", "options": ["gần", "đầy", "vào", "yếu"], "correctIndex": 1, "level": 23, "id": 1124},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'ồn ào'?", "options": ["dưới", "yên lặng", "sớm", "ngọt"], "correctIndex": 1, "level": 23, "id": 1125},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'yên lặng'?", "options": ["ngồi", "lên", "ồn ào", "gọn gàng"], "correctIndex": 2, "level": 23, "id": 1126},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'ngoan'?", "options": ["gần", "vào", "hư", "lên"], "correctIndex": 2, "level": 23, "id": 1127},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'buồn'?", "options": ["vui", "trên", "chậm", "ngồi"], "correctIndex": 0, "level": 23, "id": 1128},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'ra'?", "options": ["hẹp", "sạch", "bừa bộn", "vào"], "correctIndex": 3, "level": 23, "id": 1129},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'lấp lánh'?", "options": ["chăm chỉ", "thật thà", "long lanh", "dũng cảm"], "correctIndex": 2, "level": 23, "id": 1130},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'cũ'?", "options": ["mới", "to", "sáng", "buồn"], "correctIndex": 0, "level": 23, "id": 1131},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'hư'?", "options": ["nhẹ", "béo", "ngoan", "giàu"], "correctIndex": 2, "level": 23, "id": 1132},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'khổng lồ'?", "options": ["hiền hậu", "rực rỡ", "gan dạ", "to lớn"], "correctIndex": 3, "level": 23, "id": 1133},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'thấp'?", "options": ["trên", "cao", "thông minh", "ra"], "correctIndex": 1, "level": 23, "id": 1134},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'mở'?", "options": ["thắng", "đóng", "ồn ào", "dài"], "correctIndex": 1, "level": 23, "id": 1135},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'dưới'?", "options": ["trên", "thông minh", "dũng cảm", "vào"], "correctIndex": 0, "level": 23, "id": 1136},
    {"subject": "Tiếng Anh", "question": "'Màu đen' tiếng Anh là gì?", "options": ["Purple", "White", "Blue", "Black"], "correctIndex": 3, "level": 23, "id": 1137},
    {"subject": "Tiếng Anh", "question": "'Màu vàng' tiếng Anh là gì?", "options": ["Blue", "Green", "Yellow", "Orange"], "correctIndex": 2, "level": 23, "id": 1138},
    {"subject": "Tiếng Anh", "question": "'Miệng' tiếng Anh là gì?", "options": ["Tooth", "Leg", "Ear", "Mouth"], "correctIndex": 3, "level": 23, "id": 1139},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Kitchen", "Book", "Hospital", "Bedroom"], "correctIndex": 1, "level": 23, "id": 1140},
    {"subject": "Tiếng Anh", "question": "'Bear' nghĩa là gì?", "options": ["Con rùa", "Con ngựa", "Con gấu", "Con bò"], "correctIndex": 2, "level": 23, "id": 1141},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Bike", "Book", "Notebook", "Pen"], "correctIndex": 0, "level": 23, "id": 1142},
    {"subject": "Tiếng Anh", "question": "'Write' nghĩa là gì?", "options": ["Viết", "Hát", "Chạy", "Đọc"], "correctIndex": 0, "level": 23, "id": 1143},
    {"subject": "Tiếng Anh", "question": "'Nine' là số mấy?", "options": ["12", "11", "9", "6"], "correctIndex": 2, "level": 23, "id": 1144},
    {"subject": "Tiếng Anh", "question": "Số 12 tiếng Anh là gì?", "options": ["Nine", "Twelve", "Fourteen", "Fifteen"], "correctIndex": 1, "level": 23, "id": 1145},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Run", "Eraser", "Pen", "School bag"], "correctIndex": 0, "level": 23, "id": 1146},
    {"subject": "Tiếng Anh", "question": "'Eraser' nghĩa là gì?", "options": ["Quyển vở", "Cục tẩy", "Cái ghế", "Bút mực"], "correctIndex": 1, "level": 23, "id": 1147},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Grandmother", "Duck", "Grandfather", "Mother"], "correctIndex": 1, "level": 23, "id": 1148},
    {"subject": "Tiếng Anh", "question": "'Con vịt' tiếng Anh là gì?", "options": ["Cat", "Tiger", "Dog", "Duck"], "correctIndex": 3, "level": 23, "id": 1149},
    {"subject": "Tiếng Anh", "question": "'School' nghĩa là gì?", "options": ["Phòng ngủ", "Ngôi nhà", "Trường học", "Bệnh viện"], "correctIndex": 2, "level": 23, "id": 1150},
    {"id": 1151, "level": 24, "subject": "Toán", "question": "1 cm = ? mm", "options": ["1", "10", "1000", "100"], "correctIndex": 1},
    {"id": 1152, "level": 24, "subject": "Toán", "question": "Kim giờ chỉ số 8, kim phút chỉ số 6. Đồng hồ chỉ mấy giờ?", "options": ["8 giờ 30 phút", "6 giờ 8 phút", "8 giờ", "6 giờ 40 phút"], "correctIndex": 0},
    {"id": 1153, "level": 24, "subject": "Tiếng Việt", "question": "'Mẹ như ngọn lửa sưởi ấm cả nhà.' Mẹ được so sánh với gì?", "options": ["căn nhà", "ngọn lửa", "cả nhà", "mặt trời"], "correctIndex": 1},
    {"id": 1154, "level": 24, "subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'xinh đẹp'?", "options": ["xinh xắn", "xấu xí", "gầy gò", "cao lớn"], "correctIndex": 0},
    {"id": 1155, "level": 24, "subject": "Tiếng Anh", "question": "Số 'twenty' là số mấy?", "options": ["12", "2", "20", "22"], "correctIndex": 2},
    {"subject": "Toán", "question": "Mỗi chồng có 4 quyển vở. 5 chồng như thế có bao nhiêu quyển vở?", "options": ["9 quyển", "24 quyển", "20 quyển", "15 quyển"], "correctIndex": 2, "level": 24, "id": 1156},
    {"subject": "Toán", "question": "Có 36 quả táo chia đều cho 4 đĩa. Mỗi đĩa được mấy quả?", "options": ["8 quả", "9 quả", "6 quả", "10 quả"], "correctIndex": 1, "level": 24, "id": 1157},
    {"subject": "Toán", "question": "66 − 59 = ?", "options": ["6", "107", "7", "8"], "correctIndex": 2, "level": 24, "id": 1158},
    {"subject": "Toán", "question": "Hình vuông có cạnh 10 cm. Chu vi hình vuông là:", "options": ["44 cm", "100 cm", "20 cm", "40 cm"], "correctIndex": 3, "level": 24, "id": 1159},
    {"subject": "Toán", "question": "Có 40 học sinh chia đều cho 8 nhóm. Mỗi nhóm được mấy bạn?", "options": ["3 bạn", "5 bạn", "8 bạn", "4 bạn"], "correctIndex": 1, "level": 24, "id": 1160},
    {"subject": "Toán", "question": "14 : ? = 7. Số cần điền là:", "options": ["2", "4", "5", "3"], "correctIndex": 0, "level": 24, "id": 1161},
    {"subject": "Toán", "question": "24 : 6 = ?", "options": ["7", "6", "3", "4"], "correctIndex": 3, "level": 24, "id": 1162},
    {"subject": "Toán", "question": "Giá trị của biểu thức (3 + 5) × 3 là:", "options": ["11", "24", "18", "27"], "correctIndex": 1, "level": 24, "id": 1163},
    {"subject": "Toán", "question": "Số bé nhất trong các số dưới đây là:", "options": ["316", "405", "315", "414"], "correctIndex": 2, "level": 24, "id": 1164},
    {"subject": "Toán", "question": "3 850 + 4 705 = ?", "options": ["8 555", "8 545", "8 565", "8 655"], "correctIndex": 0, "level": 24, "id": 1165},
    {"subject": "Toán", "question": "1/4 của 24 là:", "options": ["20", "10", "6", "7"], "correctIndex": 2, "level": 24, "id": 1166},
    {"subject": "Toán", "question": "1 dm = ? cm", "options": ["1", "20", "100", "10"], "correctIndex": 3, "level": 24, "id": 1167},
    {"subject": "Toán", "question": "16 : 8 = ?", "options": ["2", "1", "5", "3"], "correctIndex": 0, "level": 24, "id": 1168},
    {"subject": "Toán", "question": "Thùng thứ nhất có 489 lít nước. thùng thứ hai có nhiều hơn Thùng thứ nhất 21 lít nước. thùng thứ hai có bao nhiêu lít nước?", "options": ["468", "510", "509", "520"], "correctIndex": 1, "level": 24, "id": 1169},
    {"subject": "Toán", "question": "18 : 9 = ?", "options": ["3", "1", "2", "5"], "correctIndex": 2, "level": 24, "id": 1170},
    {"subject": "Toán", "question": "28 : 4 = ?", "options": ["9", "8", "4", "7"], "correctIndex": 3, "level": 24, "id": 1171},
    {"subject": "Toán", "question": "42 : ? = 7. Số cần điền là:", "options": ["6", "3", "4", "8"], "correctIndex": 0, "level": 24, "id": 1172},
    {"subject": "Toán", "question": "Lan có 495 quyển truyện. Hoa có ít hơn Lan 9 quyển truyện. Hoa có bao nhiêu quyển truyện?", "options": ["496", "486", "485", "504"], "correctIndex": 1, "level": 24, "id": 1173},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'khỏe'?", "options": ["nặng", "yếu", "trắng", "trên"], "correctIndex": 1, "level": 24, "id": 1174},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'đầy'?", "options": ["vơi", "mở", "vui", "chăm chỉ"], "correctIndex": 0, "level": 24, "id": 1175},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'chăm chỉ'?", "options": ["trắng", "cũ", "lười biếng", "bẩn"], "correctIndex": 2, "level": 24, "id": 1176},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'tổ quốc'?", "options": ["đất nước", "săn sóc", "chịu khó", "bố"], "correctIndex": 0, "level": 24, "id": 1177},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'vụng về'?", "options": ["khéo léo", "dài", "khỏe", "nhỏ"], "correctIndex": 0, "level": 24, "id": 1178},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'nóng'?", "options": ["ra", "lạnh", "nhanh", "mới"], "correctIndex": 1, "level": 24, "id": 1179},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'lên'?", "options": ["xuống", "cao", "hư", "giàu"], "correctIndex": 0, "level": 24, "id": 1180},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'nặng'?", "options": ["ngoan", "nhẹ", "đen", "ngắn"], "correctIndex": 1, "level": 24, "id": 1181},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'đóng'?", "options": ["dài", "mở", "vào", "cẩu thả"], "correctIndex": 1, "level": 24, "id": 1182},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'trẻ'?", "options": ["sáng", "đầy", "mới", "già"], "correctIndex": 3, "level": 24, "id": 1183},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'cao'?", "options": ["vui", "thấp", "mở", "trẻ"], "correctIndex": 1, "level": 24, "id": 1184},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'ngọt'?", "options": ["đứng", "đắng", "dũng cảm", "hiền lành"], "correctIndex": 1, "level": 24, "id": 1185},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["tròn xoe", "hiền lành", "chạy nhảy", "trắng tinh"], "correctIndex": 2, "level": 24, "id": 1186},
    {"subject": "Tiếng Anh", "question": "'Đạp xe' tiếng Anh là gì?", "options": ["Sing", "Jump", "Dance", "Ride a bike"], "correctIndex": 3, "level": 24, "id": 1187},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ ăn?", "options": ["Yo-yo", "Milk", "Orange", "Brother"], "correctIndex": 1, "level": 24, "id": 1188},
    {"subject": "Tiếng Anh", "question": "'Con hổ' tiếng Anh là gì?", "options": ["Dog", "Tiger", "Rabbit", "Cow"], "correctIndex": 1, "level": 24, "id": 1189},
    {"subject": "Tiếng Anh", "question": "Số 1 tiếng Anh là gì?", "options": ["Three", "One", "Four", "Two"], "correctIndex": 1, "level": 24, "id": 1190},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Ice cream", "Snowy", "Sunny", "Windy"], "correctIndex": 0, "level": 24, "id": 1191},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Sunny", "Snowy", "Ball", "Cloudy"], "correctIndex": 2, "level": 24, "id": 1192},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ con vật?", "options": ["Elephant", "Tooth", "Windy", "School bag"], "correctIndex": 0, "level": 24, "id": 1193},
    {"subject": "Tiếng Anh", "question": "'Seventeen' là số mấy?", "options": ["15", "18", "14", "17"], "correctIndex": 3, "level": 24, "id": 1194},
    {"subject": "Tiếng Anh", "question": "'Eight' là số mấy?", "options": ["8", "5", "9", "7"], "correctIndex": 0, "level": 24, "id": 1195},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ con vật?", "options": ["Foot", "Windy", "Purple", "Bird"], "correctIndex": 3, "level": 24, "id": 1196},
    {"subject": "Tiếng Anh", "question": "'Milk' nghĩa là gì?", "options": ["Quả táo", "Sữa", "Nước ép", "Kem"], "correctIndex": 1, "level": 24, "id": 1197},
    {"subject": "Tiếng Anh", "question": "'Nước ép' tiếng Anh là gì?", "options": ["Egg", "Rice", "Juice", "Banana"], "correctIndex": 2, "level": 24, "id": 1198},
    {"subject": "Tiếng Anh", "question": "'Blue' nghĩa là gì?", "options": ["Màu xanh lá", "Màu trắng", "Màu xanh dương", "Màu nâu"], "correctIndex": 2, "level": 24, "id": 1199},
    {"subject": "Tiếng Anh", "question": "'Dance' nghĩa là gì?", "options": ["Bơi", "Nhảy múa", "Viết", "Vẽ"], "correctIndex": 1, "level": 24, "id": 1200},
    {"id": 1201, "level": 25, "subject": "Toán", "question": "Một tuần lễ có 7 ngày. 3 tuần lễ có bao nhiêu ngày?", "options": ["24", "14", "21", "10"], "correctIndex": 2},
    {"id": 1202, "level": 25, "subject": "Toán", "question": "2 kg = ? g", "options": ["200", "2000", "1200", "20"], "correctIndex": 1},
    {"id": 1203, "level": 25, "subject": "Tiếng Việt", "question": "Câu nào đặt dấu phẩy đúng?", "options": ["Sáng, nay em đi học.", "Sáng nay em, đi học.", "Sáng nay em đi, học.", "Sáng nay, em đi học."], "correctIndex": 3},
    {"id": 1204, "level": 25, "subject": "Tiếng Việt", "question": "Từ nào chỉ thời tiết?", "options": ["chạy bộ", "sân bóng", "nắng ráo", "bút mực"], "correctIndex": 2},
    {"id": 1205, "level": 25, "subject": "Tiếng Anh", "question": "'How many books?' — 'Fifteen.' Có bao nhiêu quyển sách?", "options": ["50", "13", "5", "15"], "correctIndex": 3},
    {"subject": "Toán", "question": "Kim giờ vừa qua số 6 một chút, kim phút chỉ số 3. Đồng hồ chỉ mấy giờ?", "options": ["3 giờ 30 phút", "7 giờ 15 phút", "6 giờ 45 phút", "6 giờ 15 phút"], "correctIndex": 3, "level": 25, "id": 1206},
    {"subject": "Toán", "question": "Số La Mã XI là số mấy?", "options": ["14", "5", "15", "11"], "correctIndex": 3, "level": 25, "id": 1207},
    {"subject": "Toán", "question": "Số La Mã XIV là số mấy?", "options": ["14", "12", "11", "9"], "correctIndex": 0, "level": 25, "id": 1208},
    {"subject": "Toán", "question": "Giảm 18 đi 2 lần được:", "options": ["9", "16", "10", "20"], "correctIndex": 0, "level": 25, "id": 1209},
    {"subject": "Toán", "question": "Làm tròn số 340 đến hàng chục được:", "options": ["350", "300", "330", "340"], "correctIndex": 3, "level": 25, "id": 1210},
    {"subject": "Toán", "question": "Giảm 33 đi 3 lần được:", "options": ["12", "30", "11", "36"], "correctIndex": 2, "level": 25, "id": 1211},
    {"subject": "Toán", "question": "Làm tròn số 352 đến hàng trăm được:", "options": ["400", "300", "500", "350"], "correctIndex": 0, "level": 25, "id": 1212},
    {"subject": "Toán", "question": "Làm tròn số 336 đến hàng trăm được:", "options": ["300", "200", "340", "400"], "correctIndex": 0, "level": 25, "id": 1213},
    {"subject": "Toán", "question": "Làm tròn số 116 đến hàng trăm được:", "options": ["100", "200", "120", "300"], "correctIndex": 0, "level": 25, "id": 1214},
    {"subject": "Toán", "question": "Nam có 178 viên bi. Minh có nhiều hơn Nam 82 viên bi. Minh có bao nhiêu viên bi?", "options": ["96", "270", "260", "259"], "correctIndex": 2, "level": 25, "id": 1215},
    {"subject": "Toán", "question": "Số La Mã VII là số mấy?", "options": ["5", "10", "12", "7"], "correctIndex": 3, "level": 25, "id": 1216},
    {"subject": "Toán", "question": "Số lớn nhất trong các số dưới đây là:", "options": ["966", "956", "875", "876"], "correctIndex": 0, "level": 25, "id": 1217},
    {"subject": "Toán", "question": "Mỗi nhóm có 7 bạn. 4 nhóm như thế có bao nhiêu bạn?", "options": ["24 bạn", "28 bạn", "35 bạn", "11 bạn"], "correctIndex": 1, "level": 25, "id": 1218},
    {"subject": "Toán", "question": "Giảm 48 đi 4 lần được:", "options": ["12", "44", "13", "52"], "correctIndex": 0, "level": 25, "id": 1219},
    {"subject": "Toán", "question": "Có 32 học sinh chia đều cho 8 nhóm. Mỗi nhóm được mấy bạn?", "options": ["4 bạn", "1 bạn", "2 bạn", "3 bạn"], "correctIndex": 0, "level": 25, "id": 1220},
    {"subject": "Toán", "question": "Nam có 512 viên bi. Minh có ít hơn Nam 57 viên bi. Minh có bao nhiêu viên bi?", "options": ["455", "454", "569", "465"], "correctIndex": 0, "level": 25, "id": 1221},
    {"subject": "Toán", "question": "Kim giờ vừa qua số 1 một chút, kim phút chỉ số 3. Đồng hồ chỉ mấy giờ?", "options": ["1 giờ 45 phút", "1 giờ 15 phút", "2 giờ 15 phút", "3 giờ 5 phút"], "correctIndex": 1, "level": 25, "id": 1222},
    {"subject": "Toán", "question": "Mỗi đĩa có 4 quả cam. 9 đĩa như thế có bao nhiêu quả cam?", "options": ["13 quả", "36 quả", "27 quả", "40 quả"], "correctIndex": 1, "level": 25, "id": 1223},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'sáng'?", "options": ["khéo léo", "tối", "thua", "ngắn"], "correctIndex": 1, "level": 25, "id": 1224},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'trước'?", "options": ["đầy", "già", "sau", "dữ tợn"], "correctIndex": 2, "level": 25, "id": 1225},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'nhanh'?", "options": ["sạch", "đầy", "chậm", "lạnh"], "correctIndex": 2, "level": 25, "id": 1226},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'ngốc nghếch'?", "options": ["sau", "giàu", "thông minh", "nặng"], "correctIndex": 2, "level": 25, "id": 1227},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'vắng vẻ'?", "options": ["cứng", "dưới", "đông đúc", "nghèo"], "correctIndex": 2, "level": 25, "id": 1228},
    {"subject": "Tiếng Việt", "question": "Câu 'Anh em như thể tay chân' khuyên ta điều gì?", "options": ["anh em phải yêu thương nhau", "kiên trì sẽ thành công", "tính nết quan trọng hơn vẻ ngoài", "không cần học"], "correctIndex": 0, "level": 25, "id": 1229},
    {"subject": "Tiếng Việt", "question": "'Mặt trời đỏ rực như quả cầu lửa.' — Mặt trời được so sánh với gì?", "options": ["quả cầu lửa", "tiếng suối", "mặt trời", "hạt ngọc"], "correctIndex": 0, "level": 25, "id": 1230},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'vơi'?", "options": ["tối", "giàu", "vào", "đầy"], "correctIndex": 3, "level": 25, "id": 1231},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Chị Mai cắm bình hoa rực rỡ.', từ chỉ đặc điểm là:", "options": ["chị Mai", "cắm", "bình", "rực rỡ"], "correctIndex": 3, "level": 25, "id": 1232},
    {"subject": "Tiếng Việt", "question": "Câu 'Kính trên nhường dưới' khuyên ta điều gì?", "options": ["chạy thật nhanh", "lễ phép với người lớn, nhường nhịn em nhỏ", "biết ơn người đi trước", "chỉ lo cho mình"], "correctIndex": 1, "level": 25, "id": 1233},
    {"subject": "Tiếng Việt", "question": "Câu 'Thương người như thể thương thân' khuyên ta điều gì?", "options": ["anh em phải yêu thương nhau", "tính nết quan trọng hơn vẻ ngoài", "giúp đỡ người khó khăn", "yêu thương mọi người như chính mình"], "correctIndex": 3, "level": 25, "id": 1234},
    {"subject": "Tiếng Việt", "question": "Câu 'Đi một ngày đàng, học một sàng khôn' khuyên ta điều gì?", "options": ["ăn thật nhiều", "đi nhiều thì học được nhiều", "học hỏi từ bạn bè", "ngủ thật sớm"], "correctIndex": 1, "level": 25, "id": 1235},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Ông em trồng những cây cam sai quả.', từ chỉ hoạt động là:", "options": ["sai quả", "ông em", "những", "trồng"], "correctIndex": 3, "level": 25, "id": 1236},
    {"subject": "Tiếng Anh", "question": "'Fifteen' là số mấy?", "options": ["17", "15", "16", "14"], "correctIndex": 1, "level": 25, "id": 1237},
    {"subject": "Tiếng Anh", "question": "Số 4 tiếng Anh là gì?", "options": ["Four", "Three", "Five", "Six"], "correctIndex": 0, "level": 25, "id": 1238},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Orange", "Cloudy", "Rainy", "Sunny"], "correctIndex": 0, "level": 25, "id": 1239},
    {"subject": "Tiếng Anh", "question": "'Lion' nghĩa là gì?", "options": ["Con hổ", "Con ngựa", "Con chuột", "Con sư tử"], "correctIndex": 3, "level": 25, "id": 1240},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Bathroom", "Park", "School", "Windy"], "correctIndex": 3, "level": 25, "id": 1241},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["School bag", "Black", "Pen", "Eraser"], "correctIndex": 1, "level": 25, "id": 1242},
    {"subject": "Tiếng Anh", "question": "'Ô tô' tiếng Anh là gì?", "options": ["Car", "Ball", "Bike", "Kite"], "correctIndex": 0, "level": 25, "id": 1243},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Eraser", "Bathroom", "Kitchen", "Bedroom"], "correctIndex": 0, "level": 25, "id": 1244},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Orange", "Pencil", "White", "Pink"], "correctIndex": 1, "level": 25, "id": 1245},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ dùng học tập?", "options": ["Ride a bike", "Car", "Book", "Grandmother"], "correctIndex": 2, "level": 25, "id": 1246},
    {"subject": "Tiếng Anh", "question": "'Mũi' tiếng Anh là gì?", "options": ["Ear", "Eye", "Foot", "Nose"], "correctIndex": 3, "level": 25, "id": 1247},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ chơi?", "options": ["House", "Hand", "Ride a bike", "Teddy bear"], "correctIndex": 3, "level": 25, "id": 1248},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ màu sắc?", "options": ["Sunny", "Sister", "Yellow", "Plane"], "correctIndex": 2, "level": 25, "id": 1249},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Leg", "Chair", "Arm", "Foot"], "correctIndex": 1, "level": 25, "id": 1250},
    {"id": 1251, "level": 26, "subject": "Toán", "question": "Số liền sau của 9 999 là số nào?", "options": ["10 000", "99 999", "9 998", "1 000"], "correctIndex": 0},
    {"id": 1252, "level": 26, "subject": "Toán", "question": "Hình chữ nhật dài 8 cm, rộng 5 cm. Chu vi là bao nhiêu?", "options": ["40 cm", "13 cm", "26 cm", "21 cm"], "correctIndex": 2},
    {"id": 1253, "level": 26, "subject": "Tiếng Việt", "question": "Thành ngữ 'Chậm như rùa' dùng để nói gì?", "options": ["rất chậm", "rất khỏe", "rất nhanh", "rất ngoan"], "correctIndex": 0},
    {"id": 1254, "level": 26, "subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["dực rỡ", "rực dỡ", "rực rỡ", "giực rỡ"], "correctIndex": 2},
    {"id": 1255, "level": 26, "subject": "Tiếng Anh", "question": "'Who is that?' — 'It is my mother.' Đó là ai?", "options": ["Bà", "Mẹ", "Anh trai", "Bố"], "correctIndex": 1},
    {"subject": "Toán", "question": "3 387 − 401 = ?", "options": ["2 987", "3 086", "2 886", "2 986"], "correctIndex": 3, "level": 26, "id": 1256},
    {"subject": "Toán", "question": "Có 21 cái kẹo chia đều cho 7 bạn. Mỗi bạn được mấy cái?", "options": ["3 cái", "5 cái", "6 cái", "4 cái"], "correctIndex": 0, "level": 26, "id": 1257},
    {"subject": "Toán", "question": "1 069 + 3 273 = ?", "options": ["4 242", "4 332", "4 343", "4 342"], "correctIndex": 3, "level": 26, "id": 1258},
    {"subject": "Toán", "question": "Kim giờ chỉ số 10, kim phút chỉ số 12. Đồng hồ chỉ mấy giờ?", "options": ["10 giờ", "11 giờ", "10 giờ 30 phút", "12 giờ 50 phút"], "correctIndex": 0, "level": 26, "id": 1259},
    {"subject": "Toán", "question": "Giảm 24 đi 6 lần được:", "options": ["4", "5", "18", "30"], "correctIndex": 0, "level": 26, "id": 1260},
    {"subject": "Toán", "question": "Gấp 10 lên 4 lần được:", "options": ["44", "14", "30", "40"], "correctIndex": 3, "level": 26, "id": 1261},
    {"subject": "Toán", "question": "Số lớn nhất trong các số dưới đây là:", "options": ["290", "298", "289", "388"], "correctIndex": 3, "level": 26, "id": 1262},
    {"subject": "Toán", "question": "6 × 10 = ?", "options": ["62", "57", "55", "60"], "correctIndex": 3, "level": 26, "id": 1263},
    {"subject": "Toán", "question": "Làm tròn số 556 đến hàng trăm được:", "options": ["700", "560", "500", "600"], "correctIndex": 3, "level": 26, "id": 1264},
    {"subject": "Toán", "question": "Hình chữ nhật dài 3 cm, rộng 7 cm. Diện tích là:", "options": ["24 cm²", "10 cm²", "20 cm²", "21 cm²"], "correctIndex": 3, "level": 26, "id": 1265},
    {"subject": "Toán", "question": "Gấp 9 lên 6 lần được:", "options": ["15", "54", "60", "45"], "correctIndex": 1, "level": 26, "id": 1266},
    {"subject": "Toán", "question": "Gấp 7 lên 3 lần được:", "options": ["10", "14", "21", "24"], "correctIndex": 2, "level": 26, "id": 1267},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 10 cm, chiều rộng 5 cm. Chu vi là:", "options": ["25 cm", "15 cm", "30 cm", "50 cm"], "correctIndex": 2, "level": 26, "id": 1268},
    {"subject": "Toán", "question": "21 : ? = 7. Số cần điền là:", "options": ["1", "2", "3", "5"], "correctIndex": 2, "level": 26, "id": 1269},
    {"subject": "Toán", "question": "4 × 3 = ?", "options": ["12", "13", "18", "15"], "correctIndex": 0, "level": 26, "id": 1270},
    {"subject": "Toán", "question": "? × 8 = 32. Số cần điền là:", "options": ["3", "6", "4", "1"], "correctIndex": 2, "level": 26, "id": 1271},
    {"subject": "Toán", "question": "Hình vuông có cạnh 13 cm. Chu vi hình vuông là:", "options": ["52 cm", "169 cm", "26 cm", "56 cm"], "correctIndex": 0, "level": 26, "id": 1272},
    {"subject": "Toán", "question": "Nam có 410 viên bi. Minh có ít hơn Nam 25 viên bi. Minh có bao nhiêu viên bi?", "options": ["435", "384", "385", "395"], "correctIndex": 2, "level": 26, "id": 1273},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'thông minh'?", "options": ["cao", "muộn", "ngốc nghếch", "cẩu thả"], "correctIndex": 2, "level": 26, "id": 1274},
    {"subject": "Tiếng Việt", "question": "Câu 'Uống nước nhớ nguồn' khuyên ta điều gì?", "options": ["biết ơn người đi trước", "chơi cả ngày", "chỉ lo cho mình", "ngủ thật sớm"], "correctIndex": 0, "level": 26, "id": 1275},
    {"subject": "Tiếng Việt", "question": "Câu 'Một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao' khuyên ta điều gì?", "options": ["chạy thật nhanh", "yêu thương mọi người như chính mình", "anh em phải yêu thương nhau", "đoàn kết tạo nên sức mạnh"], "correctIndex": 3, "level": 26, "id": 1276},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["bông hoa", "sạch sẽ", "nấu cơm", "đám mây"], "correctIndex": 2, "level": 26, "id": 1277},
    {"subject": "Tiếng Việt", "question": "Câu 'Mẹ đi chợ mua rau.' thuộc kiểu câu nào?", "options": ["Ai thế nào?", "Vì sao?", "Ai là gì?", "Ai làm gì?"], "correctIndex": 3, "level": 26, "id": 1278},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["học sinh", "hiền lành", "leo núi", "đám mây"], "correctIndex": 2, "level": 26, "id": 1279},
    {"subject": "Tiếng Việt", "question": "Cuối câu 'Con đã làm bài tập chưa …' cần đặt dấu gì?", "options": ["Dấu chấm hỏi", "Dấu phẩy", "Dấu chấm than", "Dấu chấm"], "correctIndex": 0, "level": 26, "id": 1280},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["đám mây", "thơm ngát", "cái bút", "hát"], "correctIndex": 1, "level": 26, "id": 1281},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["trò trơi", "chò chơi", "chò trơi", "trò chơi"], "correctIndex": 3, "level": 26, "id": 1282},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["cô giáo", "học sinh", "thông minh", "học bài"], "correctIndex": 2, "level": 26, "id": 1283},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["con đường", "xanh biếc", "trắng tinh", "chạy nhảy"], "correctIndex": 0, "level": 26, "id": 1284},
    {"subject": "Tiếng Việt", "question": "Câu 'Lá lành đùm lá rách' khuyên ta điều gì?", "options": ["đoàn kết tạo nên sức mạnh", "giúp đỡ người khó khăn", "chơi cả ngày", "lễ phép với người lớn, nhường nhịn em nhỏ"], "correctIndex": 1, "level": 26, "id": 1285},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["ngoan ngoãn", "gấp quần áo", "đôi dép", "con đường"], "correctIndex": 1, "level": 26, "id": 1286},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Pen", "Yellow", "Book", "Crayon"], "correctIndex": 1, "level": 26, "id": 1287},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ con vật?", "options": ["Green", "Pig", "Grapes", "Hospital"], "correctIndex": 1, "level": 26, "id": 1288},
    {"subject": "Tiếng Anh", "question": "'Teddy bear' nghĩa là gì?", "options": ["Con thuyền", "Búp bê", "Gấu bông", "Cái yo-yo"], "correctIndex": 2, "level": 26, "id": 1289},
    {"subject": "Tiếng Anh", "question": "'Con mèo' tiếng Anh là gì?", "options": ["Bird", "Horse", "Cat", "Cow"], "correctIndex": 2, "level": 26, "id": 1290},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Brown", "Pink", "Purple", "Snake"], "correctIndex": 3, "level": 26, "id": 1291},
    {"subject": "Tiếng Anh", "question": "'Giraffe' nghĩa là gì?", "options": ["Con gà", "Con mèo", "Con hươu cao cổ", "Con ếch"], "correctIndex": 2, "level": 26, "id": 1292},
    {"subject": "Tiếng Anh", "question": "'Red' nghĩa là gì?", "options": ["Màu đen", "Màu nâu", "Màu cam", "Màu đỏ"], "correctIndex": 3, "level": 26, "id": 1293},
    {"subject": "Tiếng Anh", "question": "'Two' là số mấy?", "options": ["2", "5", "1", "4"], "correctIndex": 0, "level": 26, "id": 1294},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ hoạt động?", "options": ["School", "Crayon", "Sunny", "Dance"], "correctIndex": 3, "level": 26, "id": 1295},
    {"subject": "Tiếng Anh", "question": "Số 6 tiếng Anh là gì?", "options": ["Seven", "Four", "Eight", "Six"], "correctIndex": 3, "level": 26, "id": 1296},
    {"subject": "Tiếng Anh", "question": "'Bố' tiếng Anh là gì?", "options": ["Sister", "Father", "Brother", "Grandmother"], "correctIndex": 1, "level": 26, "id": 1297},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Sunny", "Cloudy", "Tooth", "Snowy"], "correctIndex": 2, "level": 26, "id": 1298},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ bộ phận cơ thể?", "options": ["Foot", "Cloudy", "Baby", "Kite"], "correctIndex": 0, "level": 26, "id": 1299},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Sunny", "School", "Park", "Kitchen"], "correctIndex": 0, "level": 26, "id": 1300},
    {"id": 1301, "level": 27, "subject": "Toán", "question": "Làm tròn số 4 728 đến hàng nghìn được:", "options": ["5 000", "4 800", "4 000", "4 700"], "correctIndex": 0},
    {"id": 1302, "level": 27, "subject": "Toán", "question": "Hình vuông cạnh 6 cm. Chu vi là bao nhiêu?", "options": ["18 cm", "36 cm", "12 cm", "24 cm"], "correctIndex": 3},
    {"id": 1303, "level": 27, "subject": "Tiếng Việt", "question": "Từ nào chỉ nghề nghiệp?", "options": ["trường học", "giáo viên", "tận tình", "giảng bài"], "correctIndex": 1},
    {"id": 1304, "level": 27, "subject": "Tiếng Việt", "question": "Câu 'Trường em là ngôi nhà thứ hai.' thuộc kiểu câu nào?", "options": ["Ai là gì?", "Ai thế nào?", "Ai làm gì?", "Khi nào?"], "correctIndex": 0},
    {"id": 1305, "level": 27, "subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["father", "brother", "sister", "ruler"], "correctIndex": 3},
    {"subject": "Toán", "question": "Giá trị của biểu thức 24 + 3 × 3 là:", "options": ["33", "43", "30", "81"], "correctIndex": 0, "level": 27, "id": 1306},
    {"subject": "Toán", "question": "3 869 − 589 = ?", "options": ["3 290", "3 270", "3 281", "3 280"], "correctIndex": 3, "level": 27, "id": 1307},
    {"subject": "Toán", "question": "9 × 8 = ?", "options": ["74", "68", "72", "75"], "correctIndex": 2, "level": 27, "id": 1308},
    {"subject": "Toán", "question": "Giá trị của biểu thức (8 + 5) × 3 là:", "options": ["39", "42", "16", "23"], "correctIndex": 0, "level": 27, "id": 1309},
    {"subject": "Toán", "question": "Mỗi đĩa có 9 quả cam. 3 đĩa như thế có bao nhiêu quả cam?", "options": ["12 quả", "24 quả", "27 quả", "36 quả"], "correctIndex": 2, "level": 27, "id": 1310},
    {"subject": "Toán", "question": "4 822 − 4 670 = ?", "options": ["162", "52", "151", "152"], "correctIndex": 3, "level": 27, "id": 1311},
    {"subject": "Toán", "question": "Giá trị của biểu thức 52 + 4 × 8 là:", "options": ["64", "94", "84", "448"], "correctIndex": 2, "level": 27, "id": 1312},
    {"subject": "Toán", "question": "83 : 9 = ?", "options": ["8 (dư 2)", "10 (dư 2)", "9 (dư 2)", "9 (dư 3)"], "correctIndex": 2, "level": 27, "id": 1313},
    {"subject": "Toán", "question": "4 704 − 1 408 = ?", "options": ["3 296", "3 286", "3 297", "3 295"], "correctIndex": 0, "level": 27, "id": 1314},
    {"subject": "Toán", "question": "Số bé nhất trong các số dưới đây là:", "options": ["474", "374", "473", "464"], "correctIndex": 1, "level": 27, "id": 1315},
    {"subject": "Toán", "question": "3 811 − 1 951 = ?", "options": ["1 860", "1 861", "1 760", "1 960"], "correctIndex": 0, "level": 27, "id": 1316},
    {"subject": "Toán", "question": "Có 54 học sinh chia đều cho 9 nhóm. Mỗi nhóm được mấy bạn?", "options": ["8 bạn", "6 bạn", "3 bạn", "5 bạn"], "correctIndex": 1, "level": 27, "id": 1317},
    {"subject": "Toán", "question": "2 giờ = ? phút", "options": ["1 200", "120", "180", "12"], "correctIndex": 1, "level": 27, "id": 1318},
    {"subject": "Toán", "question": "6 : ? = 2. Số cần điền là:", "options": ["4", "1", "3", "6"], "correctIndex": 2, "level": 27, "id": 1319},
    {"subject": "Toán", "question": "Làm tròn số 179 đến hàng chục được:", "options": ["190", "200", "170", "180"], "correctIndex": 3, "level": 27, "id": 1320},
    {"subject": "Toán", "question": "Hình chữ nhật dài 6 cm, rộng 8 cm. Diện tích là:", "options": ["14 cm²", "28 cm²", "48 cm²", "54 cm²"], "correctIndex": 2, "level": 27, "id": 1321},
    {"subject": "Toán", "question": "2 330 + 4 298 = ?", "options": ["6 628", "6 728", "6 627", "6 638"], "correctIndex": 0, "level": 27, "id": 1322},
    {"subject": "Toán", "question": "Hình chữ nhật dài 3 cm, rộng 4 cm. Diện tích là:", "options": ["14 cm²", "15 cm²", "7 cm²", "12 cm²"], "correctIndex": 3, "level": 27, "id": 1323},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Lá cờ đỏ thắm như máu.', sự vật nào được so sánh?", "options": ["lá cờ", "máu", "tiếng suối", "chiếc ô"], "correctIndex": 0, "level": 27, "id": 1324},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["ăn cơm", "ngoan ngoãn", "đọc sách", "đá bóng"], "correctIndex": 1, "level": 27, "id": 1325},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["chú ý", "chú í", "trú í", "trú ý"], "correctIndex": 0, "level": 27, "id": 1326},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["no lê", "lo lê", "lo nê", "no nê"], "correctIndex": 3, "level": 27, "id": 1327},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["đám mây", "vẽ", "vui vẻ", "cây bàng"], "correctIndex": 1, "level": 27, "id": 1328},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'dũng cảm'?", "options": ["hèn nhát", "sạch", "ngọt", "to"], "correctIndex": 0, "level": 27, "id": 1329},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["cái thước", "thông minh", "xanh biếc", "xinh đẹp"], "correctIndex": 0, "level": 27, "id": 1330},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'bao la'?", "options": ["xinh đẹp", "mênh mông", "trung thực", "thông minh"], "correctIndex": 1, "level": 27, "id": 1331},
    {"subject": "Tiếng Việt", "question": "Câu 'Lá lành đùm lá rách' khuyên ta điều gì?", "options": ["không cần học", "biết ơn người làm ra thành quả", "giúp đỡ người khó khăn", "anh em phải yêu thương nhau"], "correctIndex": 2, "level": 27, "id": 1332},
    {"subject": "Tiếng Việt", "question": "Câu 'Thương người như thể thương thân' khuyên ta điều gì?", "options": ["tính nết quan trọng hơn vẻ ngoài", "yêu thương mọi người như chính mình", "không cần học", "học hỏi từ bạn bè"], "correctIndex": 1, "level": 27, "id": 1333},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'trước'?", "options": ["sớm", "bẩn", "già", "sau"], "correctIndex": 3, "level": 27, "id": 1334},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["chạy nhảy", "bác sĩ", "hát", "thơm ngát"], "correctIndex": 3, "level": 27, "id": 1335},
    {"subject": "Tiếng Việt", "question": "Cuối câu 'Ôi, cầu vồng đẹp quá …' cần đặt dấu gì?", "options": ["Dấu chấm than", "Dấu chấm", "Dấu chấm hỏi", "Dấu phẩy"], "correctIndex": 0, "level": 27, "id": 1336},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Bathroom", "Kitchen", "Hospital", "Swim"], "correctIndex": 3, "level": 27, "id": 1337},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Horse", "Cow", "Foot", "Chicken"], "correctIndex": 2, "level": 27, "id": 1338},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Sleep", "Yo-yo", "Kite", "Bike"], "correctIndex": 0, "level": 27, "id": 1339},
    {"subject": "Tiếng Anh", "question": "'Sixteen' là số mấy?", "options": ["19", "13", "18", "16"], "correctIndex": 3, "level": 27, "id": 1340},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ ăn?", "options": ["Plane", "Rainy", "Bread", "Dance"], "correctIndex": 2, "level": 27, "id": 1341},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Sister", "Grandmother", "Grandfather", "Hospital"], "correctIndex": 3, "level": 27, "id": 1342},
    {"subject": "Tiếng Anh", "question": "'Bơi' tiếng Anh là gì?", "options": ["Sleep", "Draw", "Sing", "Swim"], "correctIndex": 3, "level": 27, "id": 1343},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ nơi chốn?", "options": ["Ruler", "Elephant", "House", "Kite"], "correctIndex": 2, "level": 27, "id": 1344},
    {"subject": "Tiếng Anh", "question": "'Ball' nghĩa là gì?", "options": ["Xe đạp", "Cái yo-yo", "Quả bóng", "Con diều"], "correctIndex": 2, "level": 27, "id": 1345},
    {"subject": "Tiếng Anh", "question": "'Turtle' nghĩa là gì?", "options": ["Con vịt", "Con rùa", "Con khỉ", "Con chuột"], "correctIndex": 1, "level": 27, "id": 1346},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Purple", "Nose", "Black", "Green"], "correctIndex": 1, "level": 27, "id": 1347},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ ăn?", "options": ["Rabbit", "White", "Father", "Watermelon"], "correctIndex": 3, "level": 27, "id": 1348},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Rainy", "Read", "Windy", "Cloudy"], "correctIndex": 1, "level": 27, "id": 1349},
    {"subject": "Tiếng Anh", "question": "'Gấu bông' tiếng Anh là gì?", "options": ["Boat", "Ball", "Yo-yo", "Teddy bear"], "correctIndex": 3, "level": 27, "id": 1350},
    {"id": 1351, "level": 28, "subject": "Toán", "question": "Số 'XII' (số La Mã) là số mấy?", "options": ["7", "11", "21", "12"], "correctIndex": 3},
    {"id": 1352, "level": 28, "subject": "Toán", "question": "Hình chữ nhật dài 6 cm, rộng 4 cm. Diện tích là bao nhiêu?", "options": ["24 cm", "20 cm²", "10 cm²", "24 cm²"], "correctIndex": 3},
    {"id": 1353, "level": 28, "subject": "Tiếng Việt", "question": "Câu nào là câu khiến?", "options": ["Ôi, cửa đẹp quá!", "Cửa có đóng không?", "Cửa đã đóng.", "Em hãy đóng cửa lại."], "correctIndex": 3},
    {"id": 1354, "level": 28, "subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["sẳn sàng", "sẵn sàng", "xẵn sàng", "sẵn xàng"], "correctIndex": 1},
    {"id": 1355, "level": 28, "subject": "Tiếng Anh", "question": "'This is my house.' — 'house' là gì?", "options": ["Phòng học", "Ngôi nhà", "Công viên", "Trường học"], "correctIndex": 1},
    {"subject": "Toán", "question": "Có 32 cái kẹo chia đều cho 4 bạn. Mỗi bạn được mấy cái?", "options": ["6 cái", "10 cái", "5 cái", "8 cái"], "correctIndex": 3, "level": 28, "id": 1356},
    {"subject": "Toán", "question": "Số La Mã XV là số mấy?", "options": ["20", "9", "14", "15"], "correctIndex": 3, "level": 28, "id": 1357},
    {"subject": "Toán", "question": "12 : 4 = ?", "options": ["3", "4", "5", "2"], "correctIndex": 0, "level": 28, "id": 1358},
    {"subject": "Toán", "question": "3 191 + 3 440 = ?", "options": ["6 630", "6 621", "6 531", "6 631"], "correctIndex": 3, "level": 28, "id": 1359},
    {"subject": "Toán", "question": "Mỗi hộp có 6 cái bút. 5 hộp như thế có bao nhiêu cái bút?", "options": ["30 cái", "25 cái", "36 cái", "11 cái"], "correctIndex": 0, "level": 28, "id": 1360},
    {"subject": "Toán", "question": "Số liền sau của 11 525 là:", "options": ["11 526", "11 527", "11 535", "11 524"], "correctIndex": 0, "level": 28, "id": 1361},
    {"subject": "Toán", "question": "251 + 1 036 = ?", "options": ["1 287", "1 288", "1 286", "1 277"], "correctIndex": 0, "level": 28, "id": 1362},
    {"subject": "Toán", "question": "2 999 + 3 649 = ?", "options": ["6 748", "6 658", "6 638", "6 648"], "correctIndex": 3, "level": 28, "id": 1363},
    {"subject": "Toán", "question": "Giảm 18 đi 3 lần được:", "options": ["7", "6", "21", "15"], "correctIndex": 1, "level": 28, "id": 1364},
    {"subject": "Toán", "question": "Số La Mã III là số mấy?", "options": ["6", "3", "1", "9"], "correctIndex": 1, "level": 28, "id": 1365},
    {"subject": "Toán", "question": "Hình chữ nhật dài 9 cm, rộng 5 cm. Diện tích là:", "options": ["14 cm²", "54 cm²", "45 cm²", "28 cm²"], "correctIndex": 2, "level": 28, "id": 1366},
    {"subject": "Toán", "question": "Có 54 cái kẹo chia đều cho 6 bạn. Mỗi bạn được mấy cái?", "options": ["9 cái", "11 cái", "12 cái", "6 cái"], "correctIndex": 0, "level": 28, "id": 1367},
    {"subject": "Toán", "question": "Làm tròn số 141 đến hàng chục được:", "options": ["150", "100", "140", "130"], "correctIndex": 2, "level": 28, "id": 1368},
    {"subject": "Toán", "question": "Giá trị của biểu thức 56 + 8 × 2 là:", "options": ["66", "128", "82", "72"], "correctIndex": 3, "level": 28, "id": 1369},
    {"subject": "Toán", "question": "3 988 + 1 444 = ?", "options": ["5 532", "5 432", "5 442", "5 332"], "correctIndex": 1, "level": 28, "id": 1370},
    {"subject": "Toán", "question": "1/6 của 18 là:", "options": ["12", "4", "9", "3"], "correctIndex": 3, "level": 28, "id": 1371},
    {"subject": "Toán", "question": "Làm tròn số 332 đến hàng chục được:", "options": ["330", "340", "320", "300"], "correctIndex": 0, "level": 28, "id": 1372},
    {"subject": "Toán", "question": "Số bé nhất trong các số dưới đây là:", "options": ["539", "547", "638", "538"], "correctIndex": 3, "level": 28, "id": 1373},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["hiền lành", "vàng óng", "đám mây", "vẽ"], "correctIndex": 2, "level": 28, "id": 1374},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'chịu khó'?", "options": ["thông minh", "cần cù", "giúp đỡ", "bè bạn"], "correctIndex": 1, "level": 28, "id": 1375},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["tròn xoe", "giặt áo", "quả cam", "cô giáo"], "correctIndex": 1, "level": 28, "id": 1376},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["con chim", "học bài", "thông minh", "rộng rãi"], "correctIndex": 1, "level": 28, "id": 1377},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["vẽ tranh", "vẻ tranh", "vẻ chanh", "vẽ chanh"], "correctIndex": 0, "level": 28, "id": 1378},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["trắng tinh", "đi học", "cánh đồng", "con đường"], "correctIndex": 1, "level": 28, "id": 1379},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'thông minh'?", "options": ["tổ quốc", "sáng dạ", "bao la", "ngốc nghếch"], "correctIndex": 1, "level": 28, "id": 1380},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'căn nhà'?", "options": ["mênh mông", "thương yêu", "ngôi nhà", "ba"], "correctIndex": 2, "level": 28, "id": 1381},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Bạn Hoa hát rất hay.', từ chỉ đặc điểm là:", "options": ["rất", "hay", "bạn Hoa", "hát"], "correctIndex": 1, "level": 28, "id": 1382},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["quét nhà", "xinh đẹp", "múa", "dòng sông"], "correctIndex": 3, "level": 28, "id": 1383},
    {"subject": "Tiếng Việt", "question": "'Những ngôi sao như ngàn con mắt.' — Những ngôi sao được so sánh với gì?", "options": ["ngàn con mắt", "bé", "sao", "những ngôi sao"], "correctIndex": 0, "level": 28, "id": 1384},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ sự vật?", "options": ["bơi", "mặt trời", "rửa bát", "tươi tốt"], "correctIndex": 1, "level": 28, "id": 1385},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Em bé ngủ say trong nôi.', từ chỉ đặc điểm là:", "options": ["trong", "em bé", "say", "ngủ"], "correctIndex": 2, "level": 28, "id": 1386},
    {"subject": "Tiếng Anh", "question": "'Ngôi nhà' tiếng Anh là gì?", "options": ["Hospital", "Bathroom", "School", "House"], "correctIndex": 3, "level": 28, "id": 1387},
    {"subject": "Tiếng Anh", "question": "'Ngủ' tiếng Anh là gì?", "options": ["Write", "Sleep", "Sing", "Draw"], "correctIndex": 1, "level": 28, "id": 1388},
    {"subject": "Tiếng Anh", "question": "'Cái kéo' tiếng Anh là gì?", "options": ["School bag", "Pen", "Crayon", "Scissors"], "correctIndex": 3, "level": 28, "id": 1389},
    {"subject": "Tiếng Anh", "question": "'Con khỉ' tiếng Anh là gì?", "options": ["Lion", "Monkey", "Horse", "Duck"], "correctIndex": 1, "level": 28, "id": 1390},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ ăn?", "options": ["Lion", "Pencil", "Cloudy", "Orange"], "correctIndex": 3, "level": 28, "id": 1391},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ người trong gia đình?", "options": ["Yo-yo", "Sister", "Cookie", "Pencil"], "correctIndex": 1, "level": 28, "id": 1392},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ con vật?", "options": ["Park", "White", "Lion", "Ruler"], "correctIndex": 2, "level": 28, "id": 1393},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Grandmother", "Mother", "Grandfather", "Doll"], "correctIndex": 3, "level": 28, "id": 1394},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ ăn?", "options": ["Jump", "Teddy bear", "Black", "Ice cream"], "correctIndex": 3, "level": 28, "id": 1395},
    {"subject": "Tiếng Anh", "question": "'Grapes' nghĩa là gì?", "options": ["Quả nho", "Quả táo", "Bánh mì", "Dưa hấu"], "correctIndex": 0, "level": 28, "id": 1396},
    {"subject": "Tiếng Anh", "question": "'Bàn tay' tiếng Anh là gì?", "options": ["Arm", "Tooth", "Hand", "Eye"], "correctIndex": 2, "level": 28, "id": 1397},
    {"subject": "Tiếng Anh", "question": "'One' là số mấy?", "options": ["3", "4", "2", "1"], "correctIndex": 3, "level": 28, "id": 1398},
    {"subject": "Tiếng Anh", "question": "'Black' nghĩa là gì?", "options": ["Màu vàng", "Màu cam", "Màu nâu", "Màu đen"], "correctIndex": 3, "level": 28, "id": 1399},
    {"subject": "Tiếng Anh", "question": "'Ruler' nghĩa là gì?", "options": ["Bút chì", "Quyển sách", "Quyển vở", "Cái thước"], "correctIndex": 3, "level": 28, "id": 1400},
    {"id": 1401, "level": 29, "subject": "Toán", "question": "Số lớn nhất có năm chữ số là:", "options": ["90 000", "10 000", "9 999", "99 999"], "correctIndex": 3},
    {"id": 1402, "level": 29, "subject": "Toán", "question": "Hình vuông cạnh 5 cm. Diện tích là bao nhiêu?", "options": ["10 cm²", "20 cm²", "25 cm", "25 cm²"], "correctIndex": 3},
    {"id": 1403, "level": 29, "subject": "Tiếng Việt", "question": "Từ nào cùng nghĩa với 'bảo vệ'?", "options": ["phá hoại", "bỏ đi", "làm hỏng", "giữ gìn"], "correctIndex": 3},
    {"id": 1404, "level": 29, "subject": "Tiếng Việt", "question": "'Mặt trăng như cái đĩa bạc.' Đây là so sánh:", "options": ["âm thanh với âm thanh", "người với người", "hoạt động với hoạt động", "sự vật với sự vật"], "correctIndex": 3},
    {"id": 1405, "level": 29, "subject": "Tiếng Anh", "question": "'Where is the bed?' — 'It is in the ___.'", "options": ["bedroom", "teacher", "seven", "pencil"], "correctIndex": 0},
    {"subject": "Toán", "question": "Mỗi hộp có 9 cái bánh. 4 hộp như thế có bao nhiêu cái bánh?", "options": ["32 cái", "13 cái", "45 cái", "36 cái"], "correctIndex": 3, "level": 29, "id": 1406},
    {"subject": "Toán", "question": "20 : 6 = ?", "options": ["3 (dư 2)", "4 (dư 2)", "3 (dư 3)", "2 (dư 2)"], "correctIndex": 0, "level": 29, "id": 1407},
    {"subject": "Toán", "question": "Số liền trước của 43 511 là:", "options": ["43 510", "43 509", "43 501", "43 512"], "correctIndex": 0, "level": 29, "id": 1408},
    {"subject": "Toán", "question": "19 : 4 = ?", "options": ["3 (dư 3)", "4 (dư 3)", "5 (dư 3)", "4 (dư 2)"], "correctIndex": 1, "level": 29, "id": 1409},
    {"subject": "Toán", "question": "Hình chữ nhật dài 9 cm, rộng 8 cm. Diện tích là:", "options": ["17 cm²", "34 cm²", "81 cm²", "72 cm²"], "correctIndex": 3, "level": 29, "id": 1410},
    {"subject": "Toán", "question": "9 : 3 = ?", "options": ["3", "4", "2", "1"], "correctIndex": 0, "level": 29, "id": 1411},
    {"subject": "Toán", "question": "Kim giờ ở giữa số 7 và số 8, kim phút chỉ số 6. Đồng hồ chỉ mấy giờ?", "options": ["6 giờ 35 phút", "7 giờ 15 phút", "7 giờ 30 phút", "8 giờ 30 phút"], "correctIndex": 2, "level": 29, "id": 1412},
    {"subject": "Toán", "question": "9 : ? = 3. Số cần điền là:", "options": ["5", "1", "3", "2"], "correctIndex": 2, "level": 29, "id": 1413},
    {"subject": "Toán", "question": "Hình vuông có cạnh 5 cm. Chu vi hình vuông là:", "options": ["25 cm", "20 cm", "10 cm", "24 cm"], "correctIndex": 1, "level": 29, "id": 1414},
    {"subject": "Toán", "question": "Hình vuông có cạnh 8 cm. Chu vi hình vuông là:", "options": ["36 cm", "32 cm", "16 cm", "64 cm"], "correctIndex": 1, "level": 29, "id": 1415},
    {"subject": "Toán", "question": "1/4 của 16 là:", "options": ["12", "8", "5", "4"], "correctIndex": 3, "level": 29, "id": 1416},
    {"subject": "Toán", "question": "Hình chữ nhật có chiều dài 17 cm, chiều rộng 4 cm. Chu vi là:", "options": ["68 cm", "38 cm", "21 cm", "42 cm"], "correctIndex": 3, "level": 29, "id": 1417},
    {"subject": "Toán", "question": "8 × 7 = ?", "options": ["58", "50", "55", "56"], "correctIndex": 3, "level": 29, "id": 1418},
    {"subject": "Toán", "question": "Số La Mã IV là số mấy?", "options": ["3", "4", "9", "7"], "correctIndex": 1, "level": 29, "id": 1419},
    {"subject": "Toán", "question": "57 : 7 = ?", "options": ["8 (dư 2)", "7 (dư 1)", "8 (dư 1)", "9 (dư 1)"], "correctIndex": 2, "level": 29, "id": 1420},
    {"subject": "Toán", "question": "Giá trị của biểu thức (5 + 5) × 3 là:", "options": ["33", "20", "30", "13"], "correctIndex": 2, "level": 29, "id": 1421},
    {"subject": "Toán", "question": "Số bé nhất trong các số dưới đây là:", "options": ["714", "803", "705", "713"], "correctIndex": 2, "level": 29, "id": 1422},
    {"subject": "Toán", "question": "8 × 6 = ?", "options": ["48", "44", "47", "52"], "correctIndex": 0, "level": 29, "id": 1423},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'thật thà'?", "options": ["trước", "gọn gàng", "dối trá", "nhanh"], "correctIndex": 2, "level": 29, "id": 1424},
    {"subject": "Tiếng Việt", "question": "'Mắt bé sáng như sao.' — Mắt bé được so sánh với gì?", "options": ["những ngôi sao", "mắt bé", "mỡ", "sao"], "correctIndex": 3, "level": 29, "id": 1425},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["ngọt lịm", "giặt áo", "vẽ", "múa"], "correctIndex": 0, "level": 29, "id": 1426},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["bàn ghế", "mặt trời", "lấp lánh", "trồng cây"], "correctIndex": 2, "level": 29, "id": 1427},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Tán bàng xòe ra như chiếc ô.', sự vật nào được so sánh?", "options": ["chiếc ô", "mỡ", "mẹ hiền", "tán bàng"], "correctIndex": 3, "level": 29, "id": 1428},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["chú ý", "chú í", "trú í", "trú ý"], "correctIndex": 0, "level": 29, "id": 1429},
    {"subject": "Tiếng Việt", "question": "Câu 'Học thầy không tày học bạn' khuyên ta điều gì?", "options": ["chạy thật nhanh", "đi nhiều thì học được nhiều", "học hỏi từ bạn bè", "lễ phép với người lớn, nhường nhịn em nhỏ"], "correctIndex": 2, "level": 29, "id": 1430},
    {"subject": "Tiếng Việt", "question": "Câu 'Bầu trời trong xanh.' thuộc kiểu câu nào?", "options": ["Ai làm gì?", "Vì sao?", "Ai là gì?", "Ai thế nào?"], "correctIndex": 3, "level": 29, "id": 1431},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'lặng im'?", "options": ["khổng lồ", "săn sóc", "vui tươi", "im lặng"], "correctIndex": 3, "level": 29, "id": 1432},
    {"subject": "Tiếng Việt", "question": "Cuối câu 'Ôi, cầu vồng đẹp quá …' cần đặt dấu gì?", "options": ["Dấu chấm hỏi", "Dấu chấm than", "Dấu chấm", "Dấu phẩy"], "correctIndex": 1, "level": 29, "id": 1433},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'thông minh'?", "options": ["buồn", "ngốc nghếch", "trắng", "sớm"], "correctIndex": 1, "level": 29, "id": 1434},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["vẻ tranh", "vẻ chanh", "vẽ chanh", "vẽ tranh"], "correctIndex": 3, "level": 29, "id": 1435},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'nhẹ'?", "options": ["nặng", "gần", "vào", "vơi"], "correctIndex": 0, "level": 29, "id": 1436},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Draw", "Sleep", "Ear", "Read"], "correctIndex": 2, "level": 29, "id": 1437},
    {"subject": "Tiếng Anh", "question": "'Scissors' nghĩa là gì?", "options": ["Cái kéo", "Cái ghế", "Quyển vở", "Bút mực"], "correctIndex": 0, "level": 29, "id": 1438},
    {"subject": "Tiếng Anh", "question": "'Pink' nghĩa là gì?", "options": ["Màu nâu", "Màu xanh dương", "Màu cam", "Màu hồng"], "correctIndex": 3, "level": 29, "id": 1439},
    {"subject": "Tiếng Anh", "question": "'Màu hồng' tiếng Anh là gì?", "options": ["Yellow", "Orange", "Green", "Pink"], "correctIndex": 3, "level": 29, "id": 1440},
    {"subject": "Tiếng Anh", "question": "'Cái yo-yo' tiếng Anh là gì?", "options": ["Kite", "Doll", "Yo-yo", "Plane"], "correctIndex": 2, "level": 29, "id": 1441},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Pen", "Train", "Yo-yo", "Boat"], "correctIndex": 0, "level": 29, "id": 1442},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ con vật?", "options": ["Monkey", "Grandfather", "Train", "Ruler"], "correctIndex": 0, "level": 29, "id": 1443},
    {"subject": "Tiếng Anh", "question": "'Chair' nghĩa là gì?", "options": ["Bút sáp màu", "Bút chì", "Cái ghế", "Quyển sách"], "correctIndex": 2, "level": 29, "id": 1444},
    {"subject": "Tiếng Anh", "question": "'Rabbit' nghĩa là gì?", "options": ["Con bò", "Con sư tử", "Con thỏ", "Con gà"], "correctIndex": 2, "level": 29, "id": 1445},
    {"subject": "Tiếng Anh", "question": "'Pig' nghĩa là gì?", "options": ["Con lợn", "Con chim", "Con vịt", "Con hươu cao cổ"], "correctIndex": 0, "level": 29, "id": 1446},
    {"subject": "Tiếng Anh", "question": "'Notebook' nghĩa là gì?", "options": ["Cục tẩy", "Bút sáp màu", "Quyển vở", "Quyển sách"], "correctIndex": 2, "level": 29, "id": 1447},
    {"subject": "Tiếng Anh", "question": "Số 7 tiếng Anh là gì?", "options": ["Eight", "Nine", "Seven", "Six"], "correctIndex": 2, "level": 29, "id": 1448},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Crayon", "Plane", "School bag", "Scissors"], "correctIndex": 1, "level": 29, "id": 1449},
    {"subject": "Tiếng Anh", "question": "'Ten' là số mấy?", "options": ["10", "13", "11", "7"], "correctIndex": 0, "level": 29, "id": 1450},
    {"id": 1451, "level": 30, "subject": "Toán", "question": "Một cửa hàng có 1 250 kg gạo, đã bán 450 kg. Còn lại bao nhiêu ki-lô-gam gạo?", "options": ["800 kg", "1 700 kg", "900 kg", "700 kg"], "correctIndex": 0},
    {"id": 1452, "level": 30, "subject": "Toán", "question": "Mỗi hộp có 6 cái bánh. 8 hộp như thế có bao nhiêu cái bánh?", "options": ["42 cái", "48 cái", "56 cái", "14 cái"], "correctIndex": 1},
    {"id": 1453, "level": 30, "subject": "Tiếng Việt", "question": "Câu 'Có công mài sắt, có ngày nên kim' khuyên ta điều gì?", "options": ["ngủ sớm", "kiên trì", "vui chơi", "ăn ngon"], "correctIndex": 1},
    {"id": 1454, "level": 30, "subject": "Tiếng Việt", "question": "Trong câu 'Hoa phượng nở đỏ rực.', từ chỉ đặc điểm là:", "options": ["hoa phượng", "nở", "đỏ rực", "hoa"], "correctIndex": 2},
    {"id": 1455, "level": 30, "subject": "Tiếng Anh", "question": "'I have a doll.' — 'doll' là gì?", "options": ["Ô tô", "Quả bóng", "Búp bê", "Con diều"], "correctIndex": 2},
    {"subject": "Toán", "question": "Hình chữ nhật dài 9 cm, rộng 9 cm. Diện tích là:", "options": ["36 cm²", "81 cm²", "18 cm²", "90 cm²"], "correctIndex": 1, "level": 30, "id": 1456},
    {"subject": "Toán", "question": "Làm tròn số 509 đến hàng trăm được:", "options": ["500", "600", "510", "400"], "correctIndex": 0, "level": 30, "id": 1457},
    {"subject": "Toán", "question": "5 kg = ? g", "options": ["500", "50 000", "5 000", "6 000"], "correctIndex": 2, "level": 30, "id": 1458},
    {"subject": "Toán", "question": "Số lớn nhất trong các số dưới đây là:", "options": ["624", "623", "713", "632"], "correctIndex": 2, "level": 30, "id": 1459},
    {"subject": "Toán", "question": "2 782 − 2 640 = ?", "options": ["132", "141", "142", "42"], "correctIndex": 2, "level": 30, "id": 1460},
    {"subject": "Toán", "question": "40 : 6 = ?", "options": ["6 (dư 4)", "6 (dư 5)", "7 (dư 4)", "5 (dư 4)"], "correctIndex": 0, "level": 30, "id": 1461},
    {"subject": "Toán", "question": "Số La Mã VI là số mấy?", "options": ["4", "10", "5", "6"], "correctIndex": 3, "level": 30, "id": 1462},
    {"subject": "Toán", "question": "Số La Mã XIX là số mấy?", "options": ["14", "20", "15", "19"], "correctIndex": 3, "level": 30, "id": 1463},
    {"subject": "Toán", "question": "4 104 + 1 602 = ?", "options": ["5 606", "5 707", "5 706", "5 716"], "correctIndex": 2, "level": 30, "id": 1464},
    {"subject": "Toán", "question": "Số liền sau của 10 826 là:", "options": ["10 827", "10 825", "10 828", "10 836"], "correctIndex": 0, "level": 30, "id": 1465},
    {"subject": "Toán", "question": "Làm tròn số 544 đến hàng chục được:", "options": ["530", "540", "500", "550"], "correctIndex": 1, "level": 30, "id": 1466},
    {"subject": "Toán", "question": "Số liền sau của 56 303 là:", "options": ["56 304", "56 313", "56 302", "56 305"], "correctIndex": 0, "level": 30, "id": 1467},
    {"subject": "Toán", "question": "Mỗi lọ có 3 bông hoa. 9 lọ như thế có bao nhiêu bông hoa?", "options": ["18 bông", "12 bông", "30 bông", "27 bông"], "correctIndex": 3, "level": 30, "id": 1468},
    {"subject": "Toán", "question": "Giá trị của biểu thức 59 + 3 × 5 là:", "options": ["84", "310", "74", "67"], "correctIndex": 2, "level": 30, "id": 1469},
    {"subject": "Toán", "question": "Số liền sau của 93 580 là:", "options": ["93 581", "93 582", "93 579", "93 590"], "correctIndex": 0, "level": 30, "id": 1470},
    {"subject": "Toán", "question": "2 487 + 1 406 = ?", "options": ["3 993", "3 893", "3 894", "3 793"], "correctIndex": 1, "level": 30, "id": 1471},
    {"subject": "Toán", "question": "Lan có 267 quyển truyện. Hoa có nhiều hơn Lan 71 quyển truyện. Hoa có bao nhiêu quyển truyện?", "options": ["337", "196", "338", "348"], "correctIndex": 2, "level": 30, "id": 1472},
    {"subject": "Toán", "question": "Làm tròn số 358 đến hàng trăm được:", "options": ["400", "300", "360", "500"], "correctIndex": 0, "level": 30, "id": 1473},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'gan dạ'?", "options": ["dũng cảm", "to lớn", "yêu thương", "xinh xắn"], "correctIndex": 0, "level": 30, "id": 1474},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với 'rộng'?", "options": ["hẹp", "dài", "nhanh", "gọn gàng"], "correctIndex": 0, "level": 30, "id": 1475},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'đất nước'?", "options": ["mênh mông", "sáng dạ", "ba", "tổ quốc"], "correctIndex": 3, "level": 30, "id": 1476},
    {"subject": "Tiếng Việt", "question": "Từ nào gần nghĩa với 'thật thà'?", "options": ["rực rỡ", "dối trá", "to lớn", "trung thực"], "correctIndex": 3, "level": 30, "id": 1477},
    {"subject": "Tiếng Việt", "question": "Cuối câu 'A, mẹ về rồi …' cần đặt dấu gì?", "options": ["Dấu phẩy", "Dấu chấm", "Dấu chấm hỏi", "Dấu chấm than"], "correctIndex": 3, "level": 30, "id": 1478},
    {"subject": "Tiếng Việt", "question": "Câu 'Nước suối mát lạnh.' thuộc kiểu câu nào?", "options": ["Ai làm gì?", "Vì sao?", "Ai là gì?", "Ai thế nào?"], "correctIndex": 3, "level": 30, "id": 1479},
    {"subject": "Tiếng Việt", "question": "Trong câu 'Mẹ nấu nồi canh thơm phức.', từ chỉ đặc điểm là:", "options": ["thơm phức", "nồi", "mẹ", "nấu"], "correctIndex": 0, "level": 30, "id": 1480},
    {"subject": "Tiếng Việt", "question": "Câu 'Uống nước nhớ nguồn' khuyên ta điều gì?", "options": ["giúp đỡ người khó khăn", "lễ phép với người lớn, nhường nhịn em nhỏ", "biết ơn người đi trước", "anh em phải yêu thương nhau"], "correctIndex": 2, "level": 30, "id": 1481},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["bác sĩ", "chiếc cặp", "tròn xoe", "cô giáo"], "correctIndex": 2, "level": 30, "id": 1482},
    {"subject": "Tiếng Việt", "question": "'Đường lên dốc trơn như mỡ.' — Đường lên dốc được so sánh với gì?", "options": ["mỡ", "hạt ngọc", "hạt sương", "đường lên dốc"], "correctIndex": 0, "level": 30, "id": 1483},
    {"subject": "Tiếng Việt", "question": "Câu 'Các bạn nhỏ chơi nhảy dây.' thuộc kiểu câu nào?", "options": ["Ai làm gì?", "Ai là gì?", "Ai thế nào?", "Vì sao?"], "correctIndex": 0, "level": 30, "id": 1484},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ hoạt động?", "options": ["vui vẻ", "cái thước", "quét nhà", "sạch sẽ"], "correctIndex": 2, "level": 30, "id": 1485},
    {"subject": "Tiếng Việt", "question": "Từ nào là từ chỉ đặc điểm?", "options": ["đỏ thắm", "đá bóng", "con chim", "ăn cơm"], "correctIndex": 0, "level": 30, "id": 1486},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ màu sắc?", "options": ["Red", "School bag", "Ice cream", "Sister"], "correctIndex": 0, "level": 30, "id": 1487},
    {"subject": "Tiếng Anh", "question": "'Răng' tiếng Anh là gì?", "options": ["Tooth", "Hand", "Mouth", "Leg"], "correctIndex": 0, "level": 30, "id": 1488},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ hoạt động?", "options": ["Monkey", "Snowy", "Write", "Yellow"], "correctIndex": 2, "level": 30, "id": 1489},
    {"subject": "Tiếng Anh", "question": "'Quả chuối' tiếng Anh là gì?", "options": ["Juice", "Egg", "Orange", "Banana"], "correctIndex": 3, "level": 30, "id": 1490},
    {"subject": "Tiếng Anh", "question": "'Mango' nghĩa là gì?", "options": ["Dưa hấu", "Quả xoài", "Quả chuối", "Cơm"], "correctIndex": 1, "level": 30, "id": 1491},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ con vật?", "options": ["Cat", "Hand", "Scissors", "Doll"], "correctIndex": 0, "level": 30, "id": 1492},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ ăn?", "options": ["Giraffe", "Eraser", "Cloudy", "Cookie"], "correctIndex": 3, "level": 30, "id": 1493},
    {"subject": "Tiếng Anh", "question": "'Màu đỏ' tiếng Anh là gì?", "options": ["Brown", "Red", "Orange", "Green"], "correctIndex": 1, "level": 30, "id": 1494},
    {"subject": "Tiếng Anh", "question": "'Cơm' tiếng Anh là gì?", "options": ["Milk", "Cookie", "Rice", "Apple"], "correctIndex": 2, "level": 30, "id": 1495},
    {"subject": "Tiếng Anh", "question": "'Snake' nghĩa là gì?", "options": ["Con cá", "Con rắn", "Con chuột", "Con chim"], "correctIndex": 1, "level": 30, "id": 1496},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ đồ chơi?", "options": ["Brother", "Arm", "Kite", "Duck"], "correctIndex": 2, "level": 30, "id": 1497},
    {"subject": "Tiếng Anh", "question": "Từ nào chỉ con vật?", "options": ["School bag", "Jump", "Kitchen", "Frog"], "correctIndex": 3, "level": 30, "id": 1498},
    {"subject": "Tiếng Anh", "question": "Chọn từ khác loại:", "options": ["Brother", "Grandmother", "Leg", "Baby"], "correctIndex": 2, "level": 30, "id": 1499},
    {"subject": "Tiếng Anh", "question": "'Vẽ' tiếng Anh là gì?", "options": ["Sleep", "Swim", "Dance", "Draw"], "correctIndex": 3, "level": 30, "id": 1500},
    {"subject": "Toán", "question": "Kết quả của phép tính 7 x 6 là bao nhiêu?", "options": ["42", "36", "48", "49"], "correctIndex": 0, "level": 15, "id": 1531},
    {"subject": "Toán", "question": "Kết quả của phép tính 8 x 7 là bao nhiêu?", "options": ["54", "56", "64", "48"], "correctIndex": 1, "level": 16, "id": 1532},
    {"subject": "Toán", "question": "Kết quả của phép tính 9 x 8 là bao nhiêu?", "options": ["63", "81", "72", "64"], "correctIndex": 2, "level": 17, "id": 1533},
    {"subject": "Toán", "question": "Kết quả của phép tính 63 : 7 là bao nhiêu?", "options": ["8", "7", "6", "9"], "correctIndex": 3, "level": 18, "id": 1534},
    {"subject": "Toán", "question": "Kết quả của phép tính 72 : 8 là bao nhiêu?", "options": ["9", "8", "7", "6"], "correctIndex": 0, "level": 19, "id": 1535},
    {"subject": "Toán", "question": "Kết quả của phép tính 81 : 9 là bao nhiêu?", "options": ["8", "9", "7", "10"], "correctIndex": 1, "level": 20, "id": 1536},
    {"subject": "Toán", "question": "Gấp 12 lên 4 lần ta được số nào?", "options": ["16", "36", "48", "52"], "correctIndex": 2, "level": 15, "id": 1537},
    {"subject": "Toán", "question": "Giảm 54 đi 6 lần ta được số nào?", "options": ["48", "8", "7", "9"], "correctIndex": 3, "level": 16, "id": 1538},
    {"subject": "Toán", "question": "Giá trị của biểu thức 25 + 15 x 2 là bao nhiêu?", "options": ["55", "80", "50", "45"], "correctIndex": 0, "level": 17, "id": 1539},
    {"subject": "Toán", "question": "Giá trị của biểu thức (40 - 16) : 3 là bao nhiêu?", "options": ["12", "8", "6", "9"], "correctIndex": 1, "level": 18, "id": 1540},
    {"subject": "Toán", "question": "1 m bằng bao nhiêu mi-li-mét (mm)?", "options": ["100 mm", "10 mm", "1000 mm", "10000 mm"], "correctIndex": 2, "level": 19, "id": 1541},
    {"subject": "Toán", "question": "Chu vi hình vuông có cạnh dài 9 cm là bao nhiêu?", "options": ["18 cm", "81 cm", "27 cm", "36 cm"], "correctIndex": 3, "level": 20, "id": 1542},
    {"subject": "Toán", "question": "Chu vi hình chữ nhật có chiều dài 12 cm, chiều rộng 8 cm là bao nhiêu?", "options": ["40 cm", "20 cm", "96 cm", "32 cm"], "correctIndex": 0, "level": 15, "id": 1543},
    {"subject": "Toán", "question": "Số dư của phép chia 38 : 5 là bao nhiêu?", "options": ["2", "3", "4", "1"], "correctIndex": 1, "level": 16, "id": 1544},
    {"subject": "Tiếng Việt", "question": "Trong câu “Trăng tròn như chiếc đĩa bạc”, hình ảnh so sánh là gì?", "options": ["Trăng với bầu trời", "Chiếc đĩa với ngôi sao", "Trăng với chiếc đĩa bạc", "Tròn với màu trắng"], "correctIndex": 2, "level": 17, "id": 1545},
    {"subject": "Tiếng Việt", "question": "Từ nào dưới đây là từ chỉ hoạt động?", "options": ["Xanh biếc", "Quyển vở", "Ngọt ngào", "Chạy nhảy"], "correctIndex": 3, "level": 18, "id": 1546},
    {"subject": "Tiếng Việt", "question": "Từ nào dưới đây là từ chỉ đặc điểm?", "options": ["Dịu dàng", "Đọc sách", "Bàn học", "Quét nhà"], "correctIndex": 0, "level": 19, "id": 1547},
    {"subject": "Tiếng Việt", "question": "Cuối câu hỏi phải đặt dấu câu nào?", "options": ["Dấu chấm (.)", "Dấu chấm hỏi (?)", "Dấu phẩy (,)", "Dấu hai chấm (:)"], "correctIndex": 1, "level": 20, "id": 1548},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["Chống trường", "Trống chường", "Trống trường", "Chống chường"], "correctIndex": 2, "level": 15, "id": 1549},
    {"subject": "Tiếng Việt", "question": "Từ nào viết đúng chính tả?", "options": ["Xạch xẽ", "Sạch xẽ", "Xạch sẽ", "Sạch sẽ"], "correctIndex": 3, "level": 16, "id": 1550},
    {"subject": "Tiếng Việt", "question": "Từ nào cùng nghĩa với từ “chăm chỉ”?", "options": ["Siêng năng", "Lười biếng", "Vội vàng", "Nhút nhát"], "correctIndex": 0, "level": 17, "id": 1551},
    {"subject": "Tiếng Việt", "question": "Từ nào trái nghĩa với từ “dũng cảm”?", "options": ["Gan dạ", "Nhút nhát", "Kiên cường", "Tự tin"], "correctIndex": 1, "level": 18, "id": 1552},
    {"subject": "Tiếng Anh", "question": "Câu “Open your book, please!” nghĩa là gì?", "options": ["Hãy gấp sách lại!", "Hãy đứng lên!", "Hãy mở sách của bạn ra!", "Hãy ngồi xuống!"], "correctIndex": 2, "level": 19, "id": 1553},
    {"subject": "Tiếng Anh", "question": "Đồ dùng học tập “pencil case” là gì?", "options": ["Cục tẩy", "Thước kẻ", "Cặp sách", "Hộp bút"], "correctIndex": 3, "level": 20, "id": 1554},
    {"subject": "Tiếng Anh", "question": "Từ tiếng Anh nào có nghĩa là “cục tẩy”?", "options": ["eraser", "ruler", "notebook", "school bag"], "correctIndex": 0, "level": 15, "id": 1555},
    {"subject": "Tiếng Anh", "question": "Hỏi màu sắc của nhiều đồ vật, em dùng câu nào?", "options": ["What colour is it?", "What colour are they?", "How old are you?", "Who is that?"], "correctIndex": 1, "level": 16, "id": 1556},
    {"subject": "Tiếng Anh", "question": "Hoạt động giờ ra chơi “play badminton” là chơi môn gì?", "options": ["Chơi bóng đá", "Chơi cờ vua", "Chơi cầu lông", "Nhảy dây"], "correctIndex": 2, "level": 17, "id": 1557},
    {"subject": "Tiếng Anh", "question": "Trò chơi “skipping” trong giờ ra chơi là gì?", "options": ["Chơi trốn tìm", "Đá cầu", "Chơi bóng rổ", "Nhảy dây"], "correctIndex": 3, "level": 18, "id": 1558},
    {"subject": "Tiếng Anh", "question": "Trả lời cho câu hỏi “Do you have a ruler?” (Có), em nói thế nào?", "options": ["Yes, I do.", "Yes, I am.", "No, I do.", "Yes, it is."], "correctIndex": 0, "level": 19, "id": 1559},
    {"subject": "Tiếng Anh", "question": "Từ “white” là màu gì?", "options": ["Màu đen", "Màu trắng", "Màu cam", "Màu nâu"], "correctIndex": 1, "level": 20, "id": 1560},
  ],
};

/* NHẠC NỀN và TIẾNG VỖ TAY: dùng file thật đã nhúng sẵn trong file này (khối SOUNDS ở cuối).
   Muốn đổi bài cho từng bạn: sửa dòng MUSIC_FOR trong phần "ÂM THANH THẬT". */

/* ===== CÀI ĐẶT KHÁC (có thể chỉnh) ===== */
const CAU_MOI_LEVEL = 5;           // số câu hỏi (chướng ngại vật) mỗi level
const COIN_POINTS = 2;             // điểm thưởng mỗi đồng xu / viên kim cương

/* ===== XE CỦA LUCAS =====
   SO_XE_LUCAS : con số in trên xe — anh đổi thành số bé thích (vd: 7, 10)
   TEN_TREN_XE : chữ in trên thân xe
   Màu xe: bé tự chọn ở màn hình chọn level (máy tự nhớ). */
const SO_XE_LUCAS = 1;
const TEN_TREN_XE = "LUCAS";
const CAR_COLORS = [
  { name: "Đỏ",        top: "#ff6b6b", bot: "#c92a2a", line: "#8f1d1d", f1: "#ffd43b", f2: "#ff922b" },
  { name: "Xanh ngọc", top: "#3bc9db", bot: "#0b7285", line: "#095964", f1: "#ffd43b", f2: "#f76707" },
  { name: "Cam",       top: "#ffa94d", bot: "#e8590c", line: "#a63f06", f1: "#fff3bf", f2: "#ffd43b" },
  { name: "Vàng",      top: "#ffe066", bot: "#f59f00", line: "#a86b00", f1: "#ff922b", f2: "#e8590c" },
  { name: "Tím",       top: "#b197fc", bot: "#6741d9", line: "#4c2fa8", f1: "#ffd43b", f2: "#ff8fc8" },
  { name: "Xanh lá",   top: "#8ce99a", bot: "#2b8a3e", line: "#1f6b2e", f1: "#ffd43b", f2: "#f76707" },
  { name: "Đen",       top: "#5c636a", bot: "#212529", line: "#000000", f1: "#ffd43b", f2: "#f76707" }
];

/* Nhân vật: speed = tốc độ chạy (số càng lớn càng nhanh) */
const CHARS = {
  lucas: { name: "Lucas", front: 215, flip: false, trail: "💨", move: "drive", speed: 300, gap: 640,
           collect: "🪙", breakFx: "💥", title: "🏎️ Lucas – Xe Siêu Tốc",
           finalIcon: "🏆", finalTitle: "🏆 Lucas là Vua Tốc Độ!" },
  lucie: { name: "Lucie", front: 196, flip: false, trail: "✨", move: "walk", speed: 190, gap: 480,
           collect: "💎", breakFx: "🦋", title: "👸 Công chúa Lucie phiêu lưu",
           finalIcon: "👑", finalTitle: "👑 Công chúa Lucie đã giành lại vương miện!" }
};

/* 30 level = 6 vùng đất × 5 level. Cảnh vật, màu sắc tự đổi theo vùng.
   road = màu đường đua (Lucas), path = màu đường đi (Lucie), bosses = 5 "Trùm" của 5 level trong vùng */
const BIOMES = [
  { name: "Rừng Đom Đóm",       icon: "🌲", sky: "linear-gradient(#1b2f4a,#3d6b5a)", side: "#2b8a3e", road: "#4e3b2f", path: "#8d6e63", lane: "#ffe066", deco: "🌙",
    scenery: ["🌲", "✨", "🍄", "🦉", "🌳"], obs: ["🪵", "🍄", "🕸️", "🦔"], bosses: ["🦉", "🦔", "🦇", "🐗", "🐻"] },
  { name: "Đại Dương San Hô",   icon: "🐠", sky: "linear-gradient(#0b7285,#99e9f2)", side: "#ffe8cc", road: "#1c7ed6", path: "#ffd8a8", lane: "#e3fafc", deco: "🫧",
    scenery: ["🪸", "🐠", "🐚", "🐢", "🐟"], obs: ["🦀", "🐡", "🪼", "🐙"], bosses: ["🐢", "🐙", "🦑", "🐋", "🦈"] },
  { name: "Đỉnh Núi Tuyết",     icon: "🏔️", sky: "linear-gradient(#a5d8ff,#f8f9fa)", side: "#ffffff", road: "#868e96", path: "#d0ebff", lane: "#74c0fc", deco: "❄️",
    scenery: ["🏔️", "🌲", "⛄", "🦌", "❄️"], obs: ["🧊", "⛄", "🪨", "🐧"], bosses: ["🐧", "🦌", "🐺", "🦣", "🐻‍❄️"] },
  { name: "Sa Mạc Kim Tự Tháp", icon: "🏜️", sky: "linear-gradient(#ffc078,#fff4e6)", side: "#f4c430", road: "#a07850", path: "#ffe8a3", lane: "#fff4e6", deco: "☀️",
    scenery: ["🏜️", "🐪", "🌴", "🏺", "🌵"], obs: ["🌵", "🦂", "🏺", "🐍"], bosses: ["🦎", "🦂", "🐫", "🐊", "🦅"] },
  { name: "Thành Phố Trên Mây", icon: "☁️", sky: "linear-gradient(#d0bfff,#fff0f6)", side: "#ffffff", road: "#9775fa", path: "#fcc2d7", lane: "#ffffff", deco: "🌈",
    scenery: ["☁️", "🏰", "🎈", "🌈", "🪁"], obs: ["☁️", "⚡", "🎈", "🐦"], bosses: ["🦜", "🦚", "🦄", "🦅", "🐉"] },
  { name: "Vũ Trụ Ngân Hà",     icon: "🪐", sky: "linear-gradient(#0b0d2a,#3b2a6b)", side: "#495057", road: "#212529", path: "#5f3dc4", lane: "#ffd43b", deco: "🪐",
    scenery: ["🌟", "🛸", "🪐", "🌙", "💫"], obs: ["☄️", "🛰️", "🌑", "👾"], bosses: ["👾", "🛸", "🤖", "☄️", "👽"] }
];
const LEVELS_PER_BIOME = 5;
function makeLevels(char) {
  const out = [];
  BIOMES.forEach((B, bi) => {
    for (let j = 0; j < LEVELS_PER_BIOME; j++) {
      out.push({ name: B.name + " " + (j + 1), biome: bi, icon: B.icon, sky: B.sky, side: B.side,
                 road: char === "lucie" ? B.path : B.road, lane: B.lane, deco: B.deco,
                 scenery: B.scenery, obs: B.obs, boss: B.bosses[j] });
    }
  });
  return out;
}
const LEVELS = { lucas: makeLevels("lucas"), lucie: makeLevels("lucie") };

/* ===== PHÒNG CÚP: cứ trả lời đúng liên tiếp 5 câu là mở thêm 1 cúp ===== */
const TROPHIES = [
  { name: "Cúp Tinh Anh",          icon: "🏆", c1: "#ffe066", c2: "#f08c00" },
  { name: "Huy Chương Vàng",       icon: "🥇", c1: "#fff3bf", c2: "#fab005" },
  { name: "Khiên Sấm Sét",         icon: "⚡", c1: "#a5d8ff", c2: "#1971c2" },
  { name: "Vương Miện Thông Thái", icon: "👑", c1: "#ffd8a8", c2: "#e8590c" },
  { name: "Ngôi Sao Sáng",         icon: "🌟", c1: "#fff9db", c2: "#f59f00" },
  { name: "Kim Cương Trí Tuệ",     icon: "💎", c1: "#c5f6fa", c2: "#1098ad" },
  { name: "Tên Lửa Tốc Độ",        icon: "🚀", c1: "#ffc9c9", c2: "#e03131" },
  { name: "Sách Phép Thuật",       icon: "📖", c1: "#d0bfff", c2: "#6741d9" },
  { name: "Rồng Vàng",             icon: "🐉", c1: "#d3f9d8", c2: "#2f9e44" },
  { name: "Kỳ Lân Cầu Vồng",       icon: "🦄", c1: "#ffdeeb", c2: "#d6336c" },
  { name: "Hành Tinh Bí Ẩn",       icon: "🪐", c1: "#e5dbff", c2: "#5f3dc4" },
  { name: "Cầu Vồng Diệu Kỳ",      icon: "🌈", c1: "#fff0f6", c2: "#f76707" },
  { name: "Bông Hoa Chăm Chỉ",     icon: "🌻", c1: "#fff3bf", c2: "#e67700" },
  { name: "Cá Heo Thông Minh",     icon: "🐬", c1: "#d0ebff", c2: "#1c7ed6" },
  { name: "Cú Mèo Thông Thái",     icon: "🦉", c1: "#e9ecef", c2: "#5c3d2e" },
  { name: "Sư Tử Dũng Cảm",        icon: "🦁", c1: "#ffe8cc", c2: "#d9480f" },
  { name: "Ong Chăm Học",          icon: "🐝", c1: "#fff9db", c2: "#e67700" },
  { name: "Bút Chì Thần Kỳ",       icon: "✏️", c1: "#fff4e6", c2: "#e8590c" },
  { name: "Quả Địa Cầu",           icon: "🌍", c1: "#d3f9d8", c2: "#1971c2" },
  { name: "Kính Lúp Khám Phá",     icon: "🔍", c1: "#e7f5ff", c2: "#364fc7" },
  { name: "Đàn Phím Vui Nhộn",     icon: "🎹", c1: "#f8f9fa", c2: "#343a40" },
  { name: "Siêu Anh Hùng Nhí",     icon: "🦸", c1: "#ffe3e3", c2: "#c92a2a" },
  { name: "Lâu Đài Kiến Thức",     icon: "🏰", c1: "#f3d9fa", c2: "#862e9c" },
  { name: "Cánh Diều Bay Cao",     icon: "🪁", c1: "#e3fafc", c2: "#0c8599" },
  { name: "Tàu Vũ Trụ",            icon: "🛸", c1: "#e5dbff", c2: "#3b5bdb" },
  { name: "Mặt Trời Tỏa Sáng",     icon: "☀️", c1: "#fff9db", c2: "#f08c00" },
  { name: "Mặt Trăng Dịu Hiền",    icon: "🌙", c1: "#fff3bf", c2: "#5f3dc4" },
  { name: "Cây Đại Thụ",           icon: "🌳", c1: "#d3f9d8", c2: "#2b8a3e" },
  { name: "Rương Kho Báu",         icon: "🧰", c1: "#ffe8cc", c2: "#a0522d" },
  { name: "Huy Hiệu Toán Học",     icon: "🔢", c1: "#ffe3e3", c2: "#e03131" },
  { name: "Huy Hiệu Tiếng Việt",   icon: "📝", c1: "#d0ebff", c2: "#1971c2" },
  { name: "Huy Hiệu Tiếng Anh",    icon: "🔤", c1: "#d3f9d8", c2: "#2f9e44" },
  { name: "Ngọn Đuốc Tri Thức",    icon: "🔥", c1: "#fff4e6", c2: "#e8590c" },
  { name: "Bông Tuyết Pha Lê",     icon: "❄️", c1: "#e7f5ff", c2: "#4dabf7" },
  { name: "Ngôi Nhà Hạnh Phúc",    icon: "🏡", c1: "#fff0f6", c2: "#d6336c" },
  { name: "Cúp Vô Địch Tối Thượng", icon: "🏅", c1: "#fff3bf", c2: "#c92a2a" }
];
const COMBO_CUP = 5;               // đúng liên tiếp bao nhiêu câu thì được 1 cúp

const PRAISES = ["Đúng rồi! Con giỏi quá!", "Chính xác! Tuyệt vời!", "Hay lắm! Con làm tốt lắm!",
                 "Giỏi quá! Cứ thế phát huy nhé!", "Đúng rồi! Con thông minh quá!", "Xuất sắc! Đi tiếp thôi nào!"];
const ENCOURAGE = ["Chưa đúng rồi, con thử lại nhé!", "Gần đúng rồi, con nghĩ thêm chút nữa nhé!", "Không sao đâu, con chọn lại nhé!"];
const SUBJECT_COLORS = { "Toán": "#ff6b6b", "Tiếng Việt": "#4dabf7", "Tiếng Anh": "#2f9e44" };
const PLAYER_X = 110;              // vị trí nhân vật trên màn hình (khớp với CSS #player left)

/* =====================================================================
   PHẦN DƯỚI ĐÂY LÀ LOGIC GAME — KHÔNG CẦN SỬA
   ===================================================================== */
const $ = id => document.getElementById(id);
let state = { char: null, level: 1 };
const streak = { lucas: 0, lucie: 0 };   // chuỗi đúng liên tiếp (tính xuyên suốt các level)
let currentChar = null;

function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function showScreen(id) { document.querySelectorAll(".screen").forEach(s => s.classList.remove("active")); $(id).classList.add("active"); }


/* ---------- Màu xe & huy hiệu ---------- */
function getCarColor() { try { const i = parseInt(localStorage.getItem("lucieLucas_carColor2")); if (CAR_COLORS[i]) return i; } catch (e) {} return 0; }
function setCarColor(i) { try { localStorage.setItem("lucieLucas_carColor2", i); } catch (e) {} }
function badgeCount(char) { return Object.keys(loadProg(char).stars).length; }   // số level đã qua

/* ---------- VẼ NHÂN VẬT (ảnh mặt + thân vẽ bằng SVG) ---------- */
function heroSVG(char, id) {
  const face = FACES[char];
  id = char + id;   // mã riêng cho từng hình, tránh trùng nhau
  if (char === "lucie") return `
<svg class="hero" viewBox="-78 0 218 215" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="fc${id}"><circle cx="70" cy="60" r="34"/></clipPath>
    <linearGradient id="sk${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffc2df"/><stop offset=".55" stop-color="#ff7eb6"/><stop offset="1" stop-color="#e64980"/></linearGradient>
    <linearGradient id="bd${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff8cc6"/><stop offset="1" stop-color="#e64980"/></linearGradient>
    <linearGradient id="gd${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3bf"/><stop offset="1" stop-color="#fab005"/></linearGradient>
  </defs>
  <!-- GẤU BẢO VỆ -->
  <g class="bear">
    <ellipse cx="-38" cy="209" rx="26" ry="4" fill="#000" opacity=".15"/>
    <ellipse cx="-50" cy="201" rx="9" ry="7" fill="#9c6644"/><ellipse cx="-26" cy="201" rx="9" ry="7" fill="#9c6644"/>
    <ellipse cx="-50" cy="203" rx="5" ry="3.5" fill="#f3d5b5"/><ellipse cx="-26" cy="203" rx="5" ry="3.5" fill="#f3d5b5"/>
    <ellipse cx="-38" cy="178" rx="22" ry="25" fill="#b07d56"/>
    <ellipse cx="-38" cy="183" rx="13" ry="15" fill="#f3d5b5"/>
    <path d="M-58 168 Q-66 180 -60 190" stroke="#9c6644" stroke-width="9" stroke-linecap="round" fill="none"/>
    <circle cx="-56" cy="128" r="9" fill="#b07d56"/><circle cx="-20" cy="128" r="9" fill="#b07d56"/>
    <circle cx="-56" cy="128" r="4.5" fill="#f3d5b5"/><circle cx="-20" cy="128" r="4.5" fill="#f3d5b5"/>
    <circle cx="-38" cy="144" r="21" fill="#b07d56"/>
    <ellipse cx="-38" cy="151" rx="10" ry="7.5" fill="#f3d5b5"/>
    <ellipse cx="-38" cy="147" rx="4" ry="3" fill="#3b2a1e"/>
    <path d="M-42 153 Q-38 157 -34 153" stroke="#3b2a1e" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <circle cx="-46" cy="139" r="3" fill="#3b2a1e"/><circle cx="-30" cy="139" r="3" fill="#3b2a1e"/>
    <circle cx="-45" cy="138" r="1" fill="#fff"/><circle cx="-29" cy="138" r="1" fill="#fff"/>
    <circle cx="-51" cy="147" r="3" fill="#ffa8c5" opacity=".7"/><circle cx="-25" cy="147" r="3" fill="#ffa8c5" opacity=".7"/>
    <path d="M-22 121 l-9 -5 v10z M-22 121 l9 -5 v10z" fill="#f06595"/><circle cx="-22" cy="121" r="2.6" fill="#c2255c"/>
    <!-- khiên trái tim -->
    <path d="M-18 160 h24 v14 q0 14 -12 20 q-12 -6 -12 -20z" fill="url(#gd${id})" stroke="#f08c00" stroke-width="1.6"/>
    <path d="M-6 184 c-7 -5 -9 -9 -7 -12 c2 -3 6 -2 7 1 c1 -3 5 -4 7 -1 c2 3 0 7 -7 12z" fill="#f03e3e"/>
    <path d="M-24 172 Q-20 166 -14 168" stroke="#9c6644" stroke-width="8" stroke-linecap="round" fill="none"/>
  </g>
  <!-- giày -->
  <ellipse cx="58" cy="207" rx="9" ry="5" fill="#c2255c"/><ellipse cx="82" cy="207" rx="9" ry="5" fill="#c2255c"/>
  <!-- váy xòe -->
  <g class="skirt">
    <path d="M70 116 C48 116 36 150 16 196 Q70 212 124 196 C104 150 92 116 70 116Z" fill="url(#sk${id})"/>
    <path d="M70 116 C60 140 54 170 50 202 M70 116 C80 140 86 170 90 202" stroke="#fff" stroke-opacity=".35" stroke-width="3" fill="none"/>
    <path d="M16.0 196.0 Q22.8 206.8 29.5 199.5 Q36.2 209.8 43.0 202.0 Q49.8 211.8 56.5 203.5 Q63.2 212.8 70.0 204.0 Q76.8 212.8 83.5 203.5 Q90.2 211.8 97.0 202.0 Q103.8 209.8 110.5 199.5 Q117.2 206.8 124.0 196.0" fill="none" stroke="#fff0f6" stroke-width="5" stroke-linecap="round"/>
    <g fill="#fff">
      <path d="M40 170 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z"/><path d="M96 160 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z"/>
      <path d="M72 184 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z"/><circle cx="58" cy="150" r="2"/><circle cx="86" cy="140" r="2"/>
    </g>
  </g>
  <!-- tay trái -->
  <path d="M52 104 Q40 116 44 132" stroke="#ffd8c2" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="44" cy="133" r="5" fill="#ffd8c2"/>
  <!-- tay phải cầm đũa thần -->
  <g class="wand"><path d="M108 104 L120 76" stroke="#fab005" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M121 64 l3.5 7.5 8 1 -6 5.5 1.6 8 -7.1 -4 -7.1 4 1.6 -8 -6 -5.5 8 -1z" fill="url(#gd${id})" stroke="#f08c00" stroke-width="1.2"/></g>
  <path d="M88 104 Q100 112 108 104" stroke="#ffd8c2" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="108" cy="103" r="5" fill="#ffd8c2"/>
  <!-- thân áo -->
  <rect x="65" y="90" width="10" height="10" rx="3" fill="#ffd8c2"/>
  <path d="M55 98 Q70 92 85 98 L81 120 L59 120Z" fill="url(#bd${id})"/>
  <rect x="58" y="114" width="24" height="6" rx="3" fill="#ffd43b"/>
  <path d="M70 117 l-8 -5 v10z M70 117 l8 -5 v10z" fill="#fff0f6"/><circle cx="70" cy="117" r="2.6" fill="#f06595"/>
  <!-- tay áo bồng -->
  <circle cx="52" cy="101" r="10" fill="#ffc2df"/><circle cx="88" cy="101" r="10" fill="#ffc2df"/>
  <path d="M60 99 Q70 105 80 99" stroke="#fff" stroke-width="2" fill="none" stroke-dasharray="2 3"/>
  <!-- khuôn mặt -->
  <circle cx="70" cy="60" r="38" fill="#fff" stroke="#ffc2df" stroke-width="4"/>
  <image href="${face}" x="36" y="26" width="68" height="68" clip-path="url(#fc${id})" preserveAspectRatio="xMidYMid slice"/>
  <!-- vương miện -->
  <path d="M46 30 L49 8 L60 20 L70 2 L80 20 L91 8 L94 30 Q70 22 46 30Z" fill="url(#gd${id})" stroke="#f08c00" stroke-width="1.5" stroke-linejoin="round"/>
  <circle cx="49" cy="8" r="3.4" fill="#ff6b6b"/><circle cx="70" cy="3" r="4" fill="#4dabf7"/><circle cx="91" cy="8" r="3.4" fill="#ff6b6b"/>
  <circle cx="70" cy="22" r="3.2" fill="#e64980"/><circle cx="58" cy="25" r="2.2" fill="#51cf66"/><circle cx="82" cy="25" r="2.2" fill="#51cf66"/>
</svg>`;
  const P = CAR_COLORS[getCarColor()], nb = Math.min(10, Math.floor(badgeCount("lucas") / 3));
  let badges = "";
  for (let k = 0; k < nb; k++) {
    const bx = 8 + (k % 5) * 7.6, by = k < 5 ? 34 : 27;
    badges += `<path transform="translate(${bx} ${by}) scale(.42)" d="M0 -8 l2.4 5 5.5 .8 -4 3.8 1 5.4 -4.9 -2.6 -4.9 2.6 1 -5.4 -4 -3.8 5.5 -.8z" fill="#ffd43b" stroke="#e67700" stroke-width="1.5"/>`;
  }
  return `
<svg class="hero" viewBox="0 0 230 130" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <clipPath id="fc${id}"><circle cx="112" cy="40" r="24"/></clipPath>
    <linearGradient id="cb${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.top}"/><stop offset="1" stop-color="${P.bot}"/></linearGradient>
    <linearGradient id="fl${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${P.f1}"/><stop offset="1" stop-color="${P.f2}"/></linearGradient>
    <linearGradient id="hm${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffa94d"/><stop offset="1" stop-color="#e8590c"/></linearGradient>
  </defs>
  <ellipse cx="118" cy="124" rx="100" ry="5" fill="#000" opacity=".2"/>
  <!-- cánh gió sau -->
  <rect x="22" y="50" width="7" height="26" fill="#343a40"/>
  <path d="M4 42 h40 l-4 12 h-36z" fill="url(#cb${id})" stroke="${P.line}" stroke-width="1.5"/>
  ${badges}
  <!-- tài xế: mũ bảo hiểm + mặt bé -->
  <circle cx="112" cy="40" r="31" fill="url(#hm${id})"/>
  <path d="M84 30 Q112 2 140 30" stroke="#fff3bf" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cx="112" cy="40" r="25" fill="#fff"/>
  <image href="${face}" x="88" y="16" width="48" height="48" clip-path="url(#fc${id})" preserveAspectRatio="xMidYMid slice"/>
  <!-- thân xe -->
  <path d="M18 100 L26 72 Q30 66 40 66 L86 64 Q94 64 98 70 L126 70 Q132 70 136 66 L150 56 Q156 52 162 56 L178 70 L214 80 Q226 84 224 98 L222 102 Z" fill="url(#cb${id})" stroke="${P.line}" stroke-width="2" stroke-linejoin="round"/>
  <!-- hoa văn ngọn lửa -->
  <path d="M120 72 Q150 74 172 70 Q160 78 182 80 Q164 84 196 88 Q160 92 130 92 Q110 92 98 86 Q112 82 120 72Z" fill="url(#fl${id})"/>
  <path d="M40 76 l2 4.5 5 .7 -3.6 3.4 .9 5 -4.3 -2.4 -4.3 2.4 .9 -5 -3.6 -3.4 5 -.7z" fill="#fff"/>
  <!-- kính chắn gió -->
  <path d="M140 66 L152 46 Q156 44 158 48 L162 66Z" fill="#d0ebff" stroke="#74c0fc" stroke-width="1.5" opacity=".9"/>
  <!-- số xe -->
  <circle cx="70" cy="78" r="12" fill="#fff" stroke="${P.line}" stroke-width="2"/>
  <text x="70" y="84" text-anchor="middle" font-size="${String(SO_XE_LUCAS).length > 2 ? 10 : 15}" font-weight="900" font-family="Arial" fill="${P.bot}">${SO_XE_LUCAS}</text>
  <!-- cánh gió trước -->
  <path d="M196 104 h32 l-4 -8 h-24z" fill="#343a40"/>
  <text x="118" y="99" text-anchor="middle" font-size="13" font-weight="900" font-family="Arial Black, Arial" letter-spacing="1.5"
        fill="#fff" stroke="${P.line}" stroke-width="3" paint-order="stroke">${TEN_TREN_XE}</text>
  <!-- bánh xe -->
  <g class="wheel"><circle cx="54" cy="102" r="22" fill="#212529"/><circle cx="54" cy="102" r="11" fill="#ced4da"/>
    <path d="M54 91 V113 M43 102 H65 M46 94 L62 110 M62 94 L46 110" stroke="#868e96" stroke-width="2.5"/><circle cx="54" cy="102" r="4" fill="#f76707"/></g>
  <g class="wheel"><circle cx="180" cy="102" r="22" fill="#212529"/><circle cx="180" cy="102" r="11" fill="#ced4da"/>
    <path d="M180 91 V113 M169 102 H191 M172 94 L188 110 M188 94 L172 110" stroke="#868e96" stroke-width="2.5"/><circle cx="180" cy="102" r="4" fill="#f76707"/></g>
</svg>`;
}

/* ---------- Lưu tiến độ trên máy ---------- */
function loadProg(char) {
  try { const p = JSON.parse(localStorage.getItem("lucieLucas_v3_" + char)); if (p) return p; } catch (e) {}
  return { unlocked: 1, stars: {}, best: {} };
}
function saveProg(char, p) { try { localStorage.setItem("lucieLucas_v3_" + char, JSON.stringify(p)); } catch (e) {} }
function totalStars(p) { return Object.values(p.stars).reduce((a, b) => a + b, 0); }
document.querySelectorAll("[data-hero]").forEach(el => el.innerHTML = heroSVG(el.dataset.hero, "c"));
function showProgress() {
  document.querySelectorAll("[data-hero]").forEach(el => el.innerHTML = heroSVG(el.dataset.hero, "c"));
  ["lucie", "lucas"].forEach(c => {
    const p = loadProg(c);
    $("prog-" + c).textContent = "⭐ " + totalStars(p) + "/90 sao • Level " + Math.min(p.unlocked, 30) + "/30 • 🏆 " + (p.trophies || 0);
  });
}
showProgress();

/* ---------- Màn chọn level ---------- */
function openLevels(char) {
  getAudio();
  currentChar = char;
  state.char = char;
  renderLevels();
  showScreen("levelScreen");
  setMusic(char);
}
function renderLevels() {
  const char = currentChar, p = loadProg(char);
  $("levelScreen").className = "screen active " + char;
  $("lvTitle").innerHTML = `<img class="titleFace" src="${FACES[char]}" alt="">` + CHARS[char].title;
  renderCarPicker();
  const grid = $("lvGrid"); grid.innerHTML = "";
  LEVELS[char].forEach((L, i) => {
    const lv = i + 1, locked = lv > p.unlocked, st = p.stars[lv] || 0;
    if (i % LEVELS_PER_BIOME === 0) {
      const B = BIOMES[L.biome], h = document.createElement("div");
      h.className = "biomeHead"; h.style.background = B.sky;
      h.textContent = B.icon + " Vùng " + (L.biome + 1) + ": " + B.name + " (Level " + lv + "–" + (lv + LEVELS_PER_BIOME - 1) + ")";
      grid.appendChild(h);
    }
    const t = document.createElement("div");
    t.className = "lvTile" + (locked ? " locked" : "") + (!locked && lv === p.unlocked && !st ? " next" : "");
    t.innerHTML = `<div class="num">Level ${lv}</div><div class="ico">${locked ? "🔒" : L.boss}</div>
      <div class="st">${"⭐".repeat(st)}${"☆".repeat(3 - st)}</div>`;
    t.onclick = () => {
      if (locked) { shake(t); toast("🔒 Con hãy qua Level " + (lv - 1) + " trước để mở khóa nhé!"); return; }
      startLevel(char, lv);
    };
    grid.appendChild(t);
  });
  $("cupBtn").textContent = "🏆 Phòng cúp (" + (p.trophies || 0) + "/" + TROPHIES.length + ")";
}
function renderCarPicker() {
  const box = $("carPicker");
  if (currentChar !== "lucas") { box.className = ""; box.innerHTML = ""; return; }
  box.className = "show";
  const cur = getCarColor();
  box.innerHTML = `<div class="prev">${heroSVG("lucas", "k")}</div><div><div class="lbl">🎨 Chọn màu xe:</div>
    <div style="display:flex;gap:10px;margin-top:8px">${CAR_COLORS.map((c, i) =>
      `<div class="sw${i === cur ? " on" : ""}" title="${c.name}" style="background:linear-gradient(${c.top},${c.bot})" onclick="pickColor(${i})"></div>`).join("")}</div>
    <div class="bdg">⭐ Huy hiệu trên xe: ${Math.min(10, Math.floor(badgeCount("lucas") / 3))}/10 (cứ qua 3 level được 1 sao)</div></div>`;
}
function pickColor(i) {
  getAudio(); setCarColor(i); sfxCoin(); renderCarPicker();
  toast("🎨 Xe màu " + CAR_COLORS[i].name);
}
let unlockAsk = 0, resetAsk = {};
/* Bấm 2 lần trong vòng 3 giây mới xóa, tránh bé lỡ tay bấm nhầm */
function askTwice(key, btn, msg) {
  if (resetAsk[key] && Date.now() - resetAsk[key] < 3000) { resetAsk[key] = 0; btn && btn.classList.remove("armed"); return true; }
  resetAsk[key] = Date.now(); toast(msg);
  if (btn) { btn.classList.add("armed"); setTimeout(() => btn.classList.remove("armed"), 3000); }
  return false;
}
function wipe(char) {
  try { localStorage.removeItem("lucieLucas_v3_" + char); if (char === "lucas") localStorage.removeItem("lucieLucas_carColor2"); } catch (e) {}
  streak[char] = 0;
}
function resetAll() {
  if (!askTwice("all", $("resetAllBtn"), "⚠️ Bấm thêm 1 lần nữa để xóa hết tiến độ của cả 2 bạn")) return;
  wipe("lucie"); wipe("lucas"); showProgress(); toast("✅ Đã xóa hết. Cả 2 bạn chơi lại từ Level 1!");
}
function resetChar() {
  const btn = event && event.currentTarget;
  if (!askTwice(currentChar, btn, "⚠️ Bấm thêm 1 lần nữa để " + CHARS[currentChar].name + " chơi lại từ đầu")) return;
  wipe(currentChar); renderLevels(); toast("✅ " + CHARS[currentChar].name + " chơi lại từ Level 1!");
}
function unlockAll() {
  if (!unlockAsk || Date.now() - unlockAsk > 3000) { unlockAsk = Date.now(); toast("🔓 Bấm thêm 1 lần nữa để mở khóa tất cả level"); return; }
  unlockAsk = 0;
  const p = loadProg(currentChar); p.unlocked = LEVELS[currentChar].length; saveProg(currentChar, p); renderLevels();
}
function backToLevels() {
  state.running = false; if (typeof G !== "undefined") G.tickle = 0;
  stopTimer();
  $("quizOverlay").classList.remove("show");
  $("winOverlay").classList.remove("show");
  openLevels(state.char);
}
function goHome() {
  state.running = false;
  setMusic("menu");
  stopTimer();
  showProgress();
  showScreen("startScreen");
}

/* ---------- Bắt đầu 1 level ---------- */
function startLevel(char, lv) {
  getAudio();
  if (lv > LEVELS[char].length) { backToLevels(); return; }
  const pool = questionsData[char].filter(q => q.level === lv);
  if (!pool.length) { toast("Level " + lv + " chưa có câu hỏi nào"); return; }
  stopTimer();
  $("winOverlay").classList.remove("show");
  $("quizOverlay").classList.remove("show");
  const C = CHARS[char], L = LEVELS[char][lv - 1];
  const questions = orderQuestions(char, pool).slice(0, CAU_MOI_LEVEL);
  state = { char, level: lv, questions, idx: 0, score: 0, combo: 0, maxCombo: 0, firstTry: 0, wrongThis: false, coins: 0,
            pos: 0, lane: 1, chase: CHASE_MIN, running: true, paused: false, answered: false, obstacles: [], coinList: [] };
  $("collectIcon").textContent = C.collect;
  showScreen("gameScreen");
  initGL(); resizeGL();
  build3DLevel(char, L, questions.length);
  buildMap(); updateHud(); updateChaseHud();
  playerClass(C.move);
  showBanner("Level " + lv + ": " + L.icon + " " + L.name);
  setTimeout(() => { if (state.running) bubble(G.mom, C.name + " ơi, làm bài chưa mà chạy?! 😤", 2600); }, 1200);
  setTimeout(() => { if (state.running) bubble(G.dad, "Đuổi theo nào! 🏃", 2200); }, 2000);
  setTimeout(() => toast("🏃 Cứ chạy thẳng, nhặt " + C.collect + " và trả lời đúng để vượt cửa ải!"), 2400);
  char === "lucas" ? sfxEngine() : sfxMagic();
  setMusic(char);
}
function playerClass(mode) { G.anim = mode; }

/* ---------- Lịch sử từng câu: câu con làm sai lần trước được đánh dấu "Ôn lại" ---------- */
function qKey(q) { return q.level + "|" + q.question; }
function loadHist(char) { try { return JSON.parse(localStorage.getItem("lucieLucas_hist_" + char)) || {}; } catch (e) { return {}; } }
function ghiNhatKy(game, child, subject, question, ok) { try { const k = 'giaDinh_nhatKy', a = JSON.parse(localStorage.getItem(k) || '[]'); a.push({ t: Date.now(), g: game, c: child, s: subject, q: String(question).slice(0, 140), ok: !!ok }); if (a.length > 6000) a.splice(0, a.length - 6000); localStorage.setItem(k, JSON.stringify(a)); } catch (e) {} }
function recordQ(q, ok) {
  ghiNhatKy('phieuluu', state.char, q.subject, q.question, ok);
  const h = loadHist(state.char), k = qKey(q), r = h[k] || { seen: 0, wrong: 0 };
  r.seen++; if (!ok) r.wrong++; r.lastOk = ok; h[k] = r;
  try { localStorage.setItem("lucieLucas_hist_" + state.char, JSON.stringify(h)); } catch (e) {}
}
// Kho 50 câu/level: mỗi lượt rút 5 câu — ưu tiên câu từng sai (tối đa 2), rồi câu chưa gặp, rồi câu ít gặp nhất.
// Xếp xen kẽ môn học, câu từng sai không đứng đầu, đáp án đổi chỗ.
function orderQuestions(char, pool) {
  const h = loadHist(char), info = q => h[qKey(q)];
  const wrong = shuffle(pool.filter(q => info(q) && info(q).lastOk === false)).slice(0, 2);
  const rest = shuffle(pool.filter(q => !wrong.includes(q))).sort((a, b) => (info(a) ? info(a).seen : 0) - (info(b) ? info(b).seen : 0));
  // lấy đủ cả 3 môn nếu được
  const pick = [...wrong];
  ["Toán", "Tiếng Việt", "Tiếng Anh"].forEach(sj => { if (!pick.some(q => q.subject === sj)) { const q = rest.find(x => x.subject === sj && !pick.includes(x)); if (q) pick.push(q); } });
  for (const q of rest) { if (pick.length >= CAU_MOI_LEVEL) break; if (!pick.includes(q)) pick.push(q); }
  const items = shuffle(pick.slice(0, CAU_MOI_LEVEL).map(q => {
    const idx = shuffle(q.options.map((_, i) => i));
    return Object.assign({}, q, { options: idx.map(i => q.options[i]), correctIndex: idx.indexOf(q.correctIndex),
      review: !!(h[qKey(q)] && h[qKey(q)].lastOk === false), base: q });
  }));
  const out = []; let prev = null;
  while (items.length) {                                    // tránh 2 câu cùng môn liền nhau
    let i = items.findIndex(q => q.subject !== prev && !(out.length === 0 && q.review));
    if (i < 0) i = 0;
    out.push(items.splice(i, 1)[0]); prev = out[out.length - 1].subject;
  }
  return out;
}

/* =====================================================================
   THẾ GIỚI 3D (dùng thư viện Three.js đã nhúng sẵn trong file)
   Đường chạy 3 làn, nhân vật 3D, bố mẹ đuổi theo cho vui
   ===================================================================== */
const LANES = [-1.9, 0, 1.9];                 // 3 làn đường (xa – giữa – gần)
const SPEED3D = { lucas: 9, lucie: 6.2 };     // tốc độ chạy
const GAP3D = { lucas: 30, lucie: 22 };       // khoảng cách giữa các cửa ải
const CHASE_GAP = [null, 6.5, 4.6, 2.8, 1.1];  // bố mẹ cách bé bao xa theo mức đuổi (0 = chưa đuổi)
const CHASE_HUD = ["😄 An toàn", "🏃 Bố mẹ đuổi phía sau", "😬 Bố mẹ đuổi gần!", "😱 Sắp bị bắt!", "🤣 Bị bắt!"];
const CHASE_MIN = 1;                           // bố mẹ luôn đuổi theo (không bao giờ bỏ cuộc)
const DAD_LINES = ["Đứng lại đó con!", "Bố bắt được là cù đấy nhé!", "Chạy đâu cho thoát!", "Dép bay đây!", "Làm bài cẩn thận vào!"];
const MOM_LINES = ["Đứng lại mẹ cù cho!", "Chổi lông gà đây!", "Sai nữa là mẹ bắt đấy!", "Con ơi, chạy chậm thôi!", "Làm bài chưa hả?!"];
const G = { ready: false, debris: [], flyers: [], bubbles: [], smoke: [], fall: { dad: 0, mom: 0 }, tickle: 0, parentX: -40 };
const texCache = {};

function mat(c) { return new THREE.MeshLambertMaterial({ color: c }); }
function rand(a, b) { return a + Math.random() * (b - a); }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/* ----- Ảnh chữ / emoji thành hình 3D ----- */
function emojiTex(e) {
  if (texCache[e]) return texCache[e];
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const x = c.getContext("2d");
  x.font = '100px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif';
  x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(e, 64, 72);
  const t = new THREE.CanvasTexture(c); texCache[e] = t; return t;
}
function emojiSprite(e, size) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: emojiTex(e), transparent: true }));
  s.scale.set(size, size, 1); s.center.set(0.5, 0.08); return s;
}
/* Khuôn mặt tròn có viền màu (mũ bảo hiểm cho Lucas) */
function faceTex(src, ring, helmet) {
  const key = src.slice(-40) + ring + (helmet ? 1 : 0);
  if (texCache[key]) return texCache[key];
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const x = c.getContext("2d"), t = new THREE.CanvasTexture(c);
  const img = new Image();
  img.onload = () => {
    x.clearRect(0, 0, 256, 256);
    x.fillStyle = ring; x.beginPath(); x.arc(128, 128, 126, 0, Math.PI * 2); x.fill();
    if (helmet) {                                   // mũ bảo hiểm: vòm trên + sọc trắng
      x.fillStyle = "#fff"; x.fillRect(118, 2, 20, 40);
    }
    x.save(); x.beginPath(); x.arc(128, helmet ? 140 : 128, helmet ? 100 : 112, 0, Math.PI * 2); x.clip();
    x.drawImage(img, helmet ? 28 : 16, helmet ? 40 : 16, helmet ? 200 : 224, helmet ? 200 : 224); x.restore();
    t.needsUpdate = true;
  };
  img.src = src;
  texCache[key] = t; return t;
}
function faceSprite(src, ring, size, helmet) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: faceTex(src, ring, helmet), transparent: true }));
  s.scale.set(size, size, 1); return s;
}
function skyTex(sky) {
  const cols = (sky.match(/#[0-9a-fA-F]{3,6}/g) || ["#8fd3ff", "#e3f8ff"]);
  const c = document.createElement("canvas"); c.width = 4; c.height = 256;
  const x = c.getContext("2d"), g = x.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, cols[0]); g.addColorStop(1, cols[1] || cols[0]);
  x.fillStyle = g; x.fillRect(0, 0, 4, 256);
  return { tex: new THREE.CanvasTexture(c), bottom: cols[1] || cols[0] };
}
function roadTex(road, lane) {
  const c = document.createElement("canvas"); c.width = 256; c.height = 256;
  const x = c.getContext("2d");
  x.fillStyle = road; x.fillRect(0, 0, 256, 256);
  x.fillStyle = "rgba(255,255,255,.08)";
  for (let i = 0; i < 40; i++) x.fillRect(Math.random() * 256, Math.random() * 256, 3, 3);
  x.fillStyle = lane;
  x.fillRect(0, 124, 150, 8);                                         // vạch giữa đứt khúc
  x.fillRect(0, 6, 256, 6); x.fillRect(0, 244, 256, 6);              // mép đường
  const t = new THREE.CanvasTexture(c); t.wrapS = THREE.RepeatWrapping; return t;
}

/* ----- Khởi tạo ----- */
function initGL() {
  if (G.ready) return;
  G.renderer = new THREE.WebGLRenderer({ canvas: $("gl"), antialias: true });
  G.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  G.scene = new THREE.Scene();
  G.camera = new THREE.PerspectiveCamera(50, 1, 0.1, 400);
  G.scene.add(new THREE.HemisphereLight(0xffffff, 0x99a0b0, 0.95));
  const sun = new THREE.DirectionalLight(0xffffff, 0.75); sun.position.set(6, 14, 9); G.scene.add(sun);
  G.level = new THREE.Group(); G.scene.add(G.level);
  G.clock = 0;
  addEventListener("resize", resizeGL);
  setupLaneControls();
  G.ready = true;
  requestAnimationFrame(renderLoop);
}
function resizeGL() {
  if (!G.ready) return;
  const w = $("world").clientWidth || innerWidth, h = $("world").clientHeight || innerHeight;
  G.renderer.setSize(w, h, false);
  G.camera.aspect = w / h;
  G.camera.fov = w / h < 1 ? 68 : 50;              // điện thoại dựng đứng: nhìn rộng hơn
  G.camera.updateProjectionMatrix();
}
function clearLevel() {
  G.level.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    if (o.material && !o.material.map) o.material.dispose();
  });
  G.level.clear();
  G.debris = []; G.flyers = []; G.smoke = [];
  G.bubbles.forEach(b => b.el.remove()); G.bubbles = [];
}

/* ----- Nhân vật ----- */
/* =====================================================================
   NHÂN VẬT NGƯỜI 3D: đầu tròn có ảnh mặt thật dán lên mặt trước,
   tóc / mũ bảo hiểm, cổ, thân, tay chân có khớp để chạy, vung tay.
   ===================================================================== */
// Vùng mặt cắt từ ảnh 200×200: [tâm x, tâm y, bán kính ngang, bán kính dọc]
const FACE_CROP = {
  lucie: [100, 100, 62, 68], lucas: [100, 118, 58, 66],
  dad: [100, 112, 74, 86], mom: [100, 108, 70, 88]
};
function faceTex3D(src, crop, skinMats) {
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const x = c.getContext("2d"), t = new THREE.CanvasTexture(c);
  x.fillStyle = "#f1c9a5"; x.fillRect(0, 0, 256, 256);
  const img = new Image();
  img.onload = () => {
    const [cx, cy, rx, ry] = crop;
    // màu da thật: lấy trung bình hai bên má
    const tmp = document.createElement("canvas"); tmp.width = tmp.height = 200;
    const tx = tmp.getContext("2d"); tx.drawImage(img, 0, 0, 200, 200);
    let r = 0, g = 0, b = 0, n = 0;
    [[cx - rx * 0.5, cy + ry * 0.12], [cx + rx * 0.5, cy + ry * 0.12], [cx, cy - ry * 0.45]].forEach(([px, py]) => {
      const d = tx.getImageData(px - 6, py - 6, 12, 12).data;
      for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200) { r += d[i]; g += d[i + 1]; b += d[i + 2]; n++; }
    });
    const skin = n ? `rgb(${r / n | 0},${g / n | 0},${b / n | 0})` : "#f1c9a5";
    skinMats.forEach(m => m.color.set(skin).multiplyScalar(0.86));
    x.fillStyle = skin; x.fillRect(0, 0, 256, 256);
    // ảnh mặt trong khung bầu dục, mép mờ dần vào màu da
    const f = document.createElement("canvas"); f.width = f.height = 256;
    const fx = f.getContext("2d");
    fx.drawImage(img, cx - rx, cy - ry, rx * 2, ry * 2, 14, 10, 228, 236);
    fx.globalCompositeOperation = "destination-in";
    fx.save(); fx.translate(128, 128); fx.scale(1, 236 / 228);
    const gr = fx.createRadialGradient(0, 0, 0, 0, 0, 114);
    gr.addColorStop(0, "rgba(0,0,0,1)"); gr.addColorStop(0.8, "rgba(0,0,0,1)"); gr.addColorStop(1, "rgba(0,0,0,0)");
    fx.fillStyle = gr; fx.beginPath(); fx.arc(0, 0, 114, 0, Math.PI * 2); fx.fill(); fx.restore();
    x.drawImage(f, 0, 0);
    t.needsUpdate = true;
  };
  img.src = src;
  return t;
}
const FACE3D = {"lucie":{"v":[0.0082,-0.2309,-0.1498,0.0146, ...DỮ LIỆU KHUÔN MẶT 3D (bỏ bớt, không sửa)... };
/* Mặt 3D dựng từ 468 điểm mốc trên ảnh thật (mũi, gò má, cằm, hốc mắt có độ nổi) */
function faceMesh3D(F, r) {
  const geo = new THREE.BufferGeometry(), W = r * 1.55, n0 = F.v.length / 3, R = F.ring, n = n0 + R.length;
  const pos = new Float32Array(n * 3), uv = new Float32Array(n * 2);
  for (let i = 0; i < n0; i++) { pos[i * 3] = F.v[i * 3] * W; pos[i * 3 + 1] = F.v[i * 3 + 1] * W - r * 0.12; pos[i * 3 + 2] = F.v[i * 3 + 2] * W * 0.85 + r * 1.0; uv[i * 2] = F.uv[i * 2]; uv[i * 2 + 1] = F.uv[i * 2 + 1]; }
  // viền mép: kéo vòng ngoài của mặt vòng ra sau để mặt liền với đầu, không lộ mép
  const idx = F.i.slice();
  R.forEach((k, j) => {
    const q = n0 + j; pos[q * 3] = pos[k * 3] * 1.07; pos[q * 3 + 1] = pos[k * 3 + 1] * 1.04 - r * 0.004; pos[q * 3 + 2] = pos[k * 3 + 2] - r * 0.4;
    uv[q * 2] = F.uv[k * 2]; uv[q * 2 + 1] = F.uv[k * 2 + 1];
    const k2 = R[(j + 1) % R.length], q2 = n0 + (j + 1) % R.length; idx.push(k, k2, q, k2, q2, q);
  });
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geo.setIndex(idx); geo.computeVertexNormals();
  // đảo chiều tam giác nếu pháp tuyến quay vào trong
  const nz = geo.attributes.normal; let s = 0; for (let i = 0; i < n; i++) s += nz.getZ(i);
  if (s < 0) { const idx = geo.index.array; for (let i = 0; i < idx.length; i += 3) { const t = idx[i + 1]; idx[i + 1] = idx[i + 2]; idx[i + 2] = t; } geo.computeVertexNormals(); }
  const tex = new THREE.TextureLoader().load(F.tex);
  const m = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: tex, color: 0xe2e2e2 }));
  return { mesh: m, pos, ring: R.map(k => [pos[k * 3], pos[k * 3 + 1]]) };
}
// Cắt mềm một khối cầu: giá trị âm thì bỏ, mép cắt mịn (cắt trong shader, không bị răng cưa)
function clipMat(base) {
  const m = base.clone();
  m.onBeforeCompile = sh => {
    sh.vertexShader = "attribute float aKeep;\nvarying float vKeep;\n" + sh.vertexShader.replace("#include <begin_vertex>", "#include <begin_vertex>\nvKeep = aKeep;");
    sh.fragmentShader = "varying float vKeep;\n" + sh.fragmentShader.replace("void main() {", "void main() {\nif (vKeep < 0.0) discard;");
  };
  m.customProgramCacheKey = () => "clip";
  return m;
}
function clipSphere(rr, keep, material, sx, sy, sz, oy) {
  const geo = new THREE.SphereGeometry(rr, 72, 54); geo.scale(sx || 1, sy || 1, sz || 1);
  const p = geo.attributes.position, k = new Float32Array(p.count);
  for (let i = 0; i < p.count; i++) k[i] = keep(p.getX(i) / rr, p.getY(i) / rr, p.getZ(i) / rr);
  geo.setAttribute("aKeep", new THREE.BufferAttribute(k, 1));
  if (oy) geo.translate(0, oy, 0);
  return new THREE.Mesh(geo, clipMat(material));
}
const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
// Khoét phần sọ phía trước đúng hình khuôn mặt để mặt 3D lắp khít vào đầu
function trimSkull(r, ring, skin) {
  const pr = ring.map(([x, y]) => [x / r * 0.92, y / r * 0.92]);
  const sd = (x, y) => {                                 // khoảng cách có dấu tới viền mặt (âm = trong mặt)
    let c = false, d = 1e9;
    for (let i = 0, j = pr.length - 1; i < pr.length; j = i++) {
      const [xi, yi] = pr[i], [xj, yj] = pr[j];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c;
      const ex = xj - xi, ey = yj - yi, t = Math.max(0, Math.min(1, ((x - xi) * ex + (y - yi) * ey) / (ex * ex + ey * ey)));
      d = Math.min(d, Math.hypot(x - xi - ex * t, y - yi - ey * t));
    }
    return c ? -d : d;
  };
  return clipSphere(r, (x, y, z) => z <= 0 ? 1 : Math.max(sd(x, y), -z + 0.0), skin, 0.96, 1.0, 0.98);
}
const FACE_W = 1.75;                                  // độ rộng vùng mặt quanh đầu (radian)
function makeHead(o) {
  // o: { src, crop, r, hair: "girl"|"boy"|"man"|"woman"|"helmet", hairCol, skinMats }
  const g = new THREE.Group(), r = o.r;
  const skin = new THREE.MeshLambertMaterial({ color: "#f1c9a5" });
  o.skinMats.push(skin);
  const F = FACE3D[o.key];
  if (F) {
    o.skinMats.forEach(m => m.color.set(F.skin).multiplyScalar(0.88));
    const fm = faceMesh3D(F, r); g.add(fm.mesh);
    const sk = new THREE.MeshLambertMaterial({ color: skin.color.clone(), side: THREE.DoubleSide }); o.skinMats.push(sk); g.add(trimSkull(r, fm.ring, sk));
  } else {
    const skullGeo = new THREE.SphereGeometry(r, 40, 30); skullGeo.scale(0.96, 1.0, 0.98); g.add(new THREE.Mesh(skullGeo, skin));
    const faceMat = new THREE.MeshLambertMaterial({ map: faceTex3D(o.src, o.crop, o.skinMats), color: 0xdbdbdb });
    g.add(new THREE.Mesh(new THREE.SphereGeometry(r * 1.012, 32, 24, Math.PI / 2 - FACE_W / 2, FACE_W, 0.5, 2.15), faceMat));
  }
  if (o.hair !== "helmet") [-1, 1].forEach(s => {                                 // tai
    const e = new THREE.Mesh(new THREE.SphereGeometry(r * 0.2, 10, 8), skin); e.scale.set(0.5, 1, 0.8);
    e.position.set(s * r * 0.98, -r * 0.05, -r * 0.05); g.add(e);
  });
  const hair = new THREE.MeshLambertMaterial({ color: o.hairCol || "#1d1612" });
  const shell = (rr, keep, sy, oy, m) => { const mm = clipSphere(rr, keep, m || hair, 1, sy || 1, 1, oy || 0); g.add(mm); return mm; };
  if (o.hair === "helmet") {
    const hm = new THREE.MeshPhongMaterial({ color: o.hairCol, shininess: 90 });
    shell(r * 1.13, (x, y, z) => Math.max(y - 0.52, 0.32 - z), 1, 0, hm);
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(r * 1.14, r * 0.07, 6, 30, Math.PI - 1.05), mat("#ffffff"));
    stripe.rotation.y = Math.PI / 2; g.add(stripe);
    const num = emojiSprite("⚡", r * 0.7); num.position.set(0, r * 0.1, -r * 1.25); g.add(num);
  } else {
    const long = o.hair === "girl" || o.hair === "woman";
    const line = o.hair === "man" ? 0.66 : o.hair === "boy" ? 0.6 : 0.62;
    shell(r * 1.06, (x, y, z) => Math.max(y - (line - Math.abs(x) * 0.3), 0.15 + 0.27 * sstep(-0.35, -0.05, y) - z));
    if (long) shell(r * 1.07, (x, y, z) => Math.min(-0.05 - z, 0.6 - y), o.hair === "girl" ? 1.35 : 1.5, -r * 0.42);
    if (o.hair === "woman") { const bun = new THREE.Mesh(new THREE.SphereGeometry(r * 0.38, 14, 10), hair); bun.position.set(0, r * 0.8, -r * 0.7); g.add(bun); }
    if (o.hair === "girl") {
      [-1, 1].forEach(sd => { const pt = new THREE.Mesh(new THREE.SphereGeometry(r * 0.3, 12, 10), hair); pt.scale.set(0.8, 1.4, 0.8); pt.position.set(sd * r * 1.02, -r * 0.3, -r * 0.35); g.add(pt); });
      const band = new THREE.Mesh(new THREE.TorusGeometry(r * 1.08, r * 0.07, 6, 30, Math.PI - 1.1), mat("#f06595"));
      band.rotation.y = Math.PI / 2; g.add(band);
    }
  }
  return g;
}
function limb(len, rad, material, endMat, endR) {
  const p = new THREE.Group();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rad, rad * 0.85, len, 10), material); m.position.y = -len / 2; p.add(m);
  if (endMat) { const e = new THREE.Mesh(new THREE.SphereGeometry(endR || rad * 1.3, 10, 8), endMat); e.position.y = -len; p.add(e); }
  return p;
}
// Đầu quay 3/4 về phía máy quay để luôn thấy mặt
const HEAD_YAW = 0.4;

/* ----- Lucie: công chúa 3D ----- */
function makeLucie() {
  const g = new THREE.Group(), skins = [];
  const skin = new THREE.MeshLambertMaterial({ color: "#f1c9a5" }); skins.push(skin);
  const pink = mat("#ff6fae"), light = mat("#ffc9de");
  const legs = [];
  [-0.12, 0.12].forEach(z => {
    const l = limb(0.62, 0.075, skin); l.position.set(0, 0.68, z);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.1, 0.14), mat("#d6336c")); shoe.position.set(0.05, -0.64, 0); l.add(shoe);
    g.add(l); legs.push(l);
  });
  const prof = [[0.01, 0.42], [0.5, 0.42], [0.55, 0.5], [0.45, 0.72], [0.3, 0.95], [0.2, 1.12], [0.01, 1.14]].map(([a, b]) => new THREE.Vector2(a, b));
  const dress = new THREE.Mesh(new THREE.LatheGeometry(prof, 32), pink); g.add(dress);
  const hem = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.045, 8, 32), mat("#fff0f6")); hem.rotation.x = Math.PI / 2; hem.position.y = 0.46; g.add(hem);
  for (let i = 0; i < 8; i++) {                           // chấm hoa trên váy
    const a = i / 8 * Math.PI * 2, d = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), mat("#fff3bf"));
    d.position.set(Math.cos(a) * 0.44, 0.62, Math.sin(a) * 0.44); g.add(d);
  }
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.21, 0.42, 16), light); torso.position.y = 1.3; g.add(torso);
  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.035, 6, 18), mat("#ffd43b")); belt.rotation.x = Math.PI / 2; belt.position.y = 1.12; g.add(belt);
  const arms = [];
  [-0.25, 0.25].forEach(z => {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), pink); puff.position.set(0, 1.45, z); g.add(puff);
    const a = limb(0.46, 0.055, skin, skin, 0.065); a.position.set(0, 1.45, z); g.add(a); arms.push(a);
  });
  const wand = new THREE.Group(); wand.position.y = -0.46; arms[1].add(wand);
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.5, 6), mat("#fab005")); stick.position.set(0.18, -0.02, 0); stick.rotation.z = -1.2; wand.add(stick);
  const star = emojiSprite("⭐", 0.32); star.position.set(0.42, 0.0, 0); wand.add(star);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.14, 10), skin); neck.position.y = 1.56; g.add(neck);
  const head = makeHead({ key: "lucie", src: FACES.lucie, crop: FACE_CROP.lucie, r: 0.42, hair: "girl", hairCol: "#1b1310", skinMats: skins });
  head.position.y = 1.98; head.rotation.y = HEAD_YAW; g.add(head);
  const crown = new THREE.Group(); crown.position.y = 0.4; head.add(crown);
  const gold = new THREE.MeshPhongMaterial({ color: "#fab005", shininess: 120, specular: 0xffffff });
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.1, 14, 1, true), gold); band.material.side = THREE.DoubleSide; crown.add(band);
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2, sp = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.15, 6), gold);
    sp.position.set(Math.cos(a) * 0.17, 0.11, Math.sin(a) * 0.17); crown.add(sp);
  }
  const gem = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), mat("#4dabf7")); gem.position.set(0, 0.02, 0.19); crown.add(gem);
  g.add(blob(0.6));
  g.userData = { dress, legs, arms, head, armN: arms[1] };
  return g;
}
/* ----- Lucas ngồi trong xe đua ----- */
function addDriver(g) {
  const skins = [], skin = new THREE.MeshLambertMaterial({ color: "#f1c9a5" }); skins.push(skin);
  const suit = mat("#f8f9fa");
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.24, 0.42, 14), suit); torso.position.set(-0.12, 1.05, 0); g.add(torso);
  const badge = new THREE.Mesh(new THREE.CircleGeometry(0.07, 12), mat("#e03131")); badge.position.set(0.11, 1.1, 0.05); badge.rotation.y = Math.PI / 2; g.add(badge);
  const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.03, 6, 20), mat("#212529")); wheel.position.set(0.32, 1.02, 0); wheel.rotation.y = Math.PI / 2; wheel.rotation.x = 0.3; g.add(wheel);
  const arms = [];
  [-0.2, 0.2].forEach(z => {
    const a = limb(0.42, 0.055, suit, mat("#e03131"), 0.07); a.position.set(-0.1, 1.2, z); a.rotation.z = 1.25; a.rotation.x = z > 0 ? -0.25 : 0.25; g.add(a); arms.push(a);
  });
  const head = makeHead({ key: "lucas", src: FACES.lucas, crop: FACE_CROP.lucas, r: 0.4, hair: "helmet", hairCol: "#f76707", skinMats: skins });
  head.position.set(-0.08, 1.62, 0); head.rotation.y = HEAD_YAW; g.add(head);
  return { head, arms, wheel };
}

function makeBear() {
  const g = new THREE.Group(), fur = mat("#b07d56"), light = mat("#f3d5b5"), dark = mat("#3b2a1e");
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 12), fur); body.scale.set(1, 1.15, 1); body.position.y = 0.4; g.add(body);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), light); belly.position.set(0.15, 0.38, 0); g.add(belly);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 12), fur); head.position.y = 0.92; g.add(head);
  [-0.17, 0.17].forEach(z => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), fur); e.position.set(0, 1.13, z); g.add(e); });
  const mz = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), light); mz.position.set(0.22, 0.87, 0); g.add(mz);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), dark); nose.position.set(0.32, 0.9, 0); g.add(nose);
  [-0.09, 0.09].forEach(z => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), dark); e.position.set(0.21, 1.0, z); g.add(e); });
  const shield = emojiSprite("❤️", 0.42); shield.position.set(0.3, 0.25, 0.25); g.add(shield);
  g.add(blob(0.4));
  return g;
}
function carSideTex(P) {
  const c = document.createElement("canvas"); c.width = 512; c.height = 110;
  const x = c.getContext("2d");
  const gr = x.createLinearGradient(0, 0, 512, 0); gr.addColorStop(0, P.f1); gr.addColorStop(1, P.f2);
  x.fillStyle = gr;                                    // ngọn lửa
  x.beginPath(); x.moveTo(512, 20);
  for (let i = 0; i <= 6; i++) x.lineTo(512 - 50 - i * 45, i % 2 ? 40 : 15);
  x.lineTo(150, 55); for (let i = 6; i >= 0; i--) x.lineTo(512 - 50 - i * 45, i % 2 ? 75 : 95);
  x.lineTo(512, 90); x.closePath(); x.fill();
  x.fillStyle = "#fff"; x.beginPath(); x.arc(85, 55, 38, 0, Math.PI * 2); x.fill();
  x.fillStyle = P.bot; x.font = "900 44px Arial"; x.textAlign = "center"; x.textBaseline = "middle";
  x.fillText(String(SO_XE_LUCAS), 85, 57);
  x.font = "900 46px 'Arial Black', Arial"; x.lineWidth = 8; x.strokeStyle = P.line; x.fillStyle = "#fff";
  x.strokeText(TEN_TREN_XE, 320, 58); x.fillText(TEN_TREN_XE, 320, 58);
  return new THREE.CanvasTexture(c);
}
function makeCar() {
  const P = CAR_COLORS[getCarColor()], g = new THREE.Group();
  const top = mat(P.top), bot = mat(P.bot), dark = mat("#222");
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.42, 1.1), top); body.position.y = 0.5; g.add(body);
  const skirt = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.14, 1.16), bot); skirt.position.y = 0.3; g.add(skirt);
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.28, 0.95), top); nose.position.set(1.25, 0.42, 0); g.add(nose);
  const fwing = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.06, 1.45), dark); fwing.position.set(1.5, 0.2, 0); g.add(fwing);
  [-0.4, 0.4].forEach(z => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.08), dark); p.position.set(-0.95, 0.85, z); g.add(p); });
  const rwing = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.07, 1.35), bot); rwing.position.set(-0.98, 1.08, 0); g.add(rwing);
  const cock = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.22, 0.64), dark); cock.position.set(-0.05, 0.8, 0); g.add(cock);
  const side = new THREE.MeshBasicMaterial({ map: carSideTex(P), transparent: true });
  [0.556, -0.556].forEach(z => { const pl = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 0.43), side); pl.position.set(0.05, 0.5, z); if (z < 0) pl.rotation.y = Math.PI; g.add(pl); });
  const wheels = [];
  [[0.75, 0.6], [0.75, -0.6], [-0.7, 0.6], [-0.7, -0.6]].forEach(([wx, wz]) => {
    const w = new THREE.Group(); w.position.set(wx, 0.33, wz);
    const tyre = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.26, 20), mat("#1a1a1a")); tyre.rotation.x = Math.PI / 2; w.add(tyre);
    const hub = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.08, 0.28), mat("#ced4da")); w.add(hub);
    g.add(w); wheels.push(w);
  });
  const drv = addDriver(g);
  g.add(blob(1.2));
  g.userData = { wheels, head: drv.head, arms: drv.arms, steer: drv.wheel };
  return g;
}
function blob(r) {
  const m = new THREE.Mesh(new THREE.CircleGeometry(r, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22 }));
  m.rotation.x = -Math.PI / 2; m.position.y = 0.02; return m;
}
function makeParent(kind) {
  const g = new THREE.Group(), dad = kind === "dad";
  const pants = mat(dad ? "#2b2b33" : "#3d3a52"), shirt = mat(dad ? "#1d2b4a" : "#3f5866"), skin = new THREE.MeshLambertMaterial({ color: "#f1c9a5" });
  const legs = [];
  [-0.2, 0.2].forEach((z, i) => {
    const p = new THREE.Group(); p.position.set(0, 1.0, z);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 1.0, 10), pants); m.position.y = -0.5; p.add(m);
    const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 0.18), mat(dad ? "#222" : "#c2255c")); shoe.position.set(0.08, -1.0, 0); p.add(shoe);
    g.add(p); legs.push(p);
  });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 1.05, 16), shirt); body.position.y = 1.52; g.add(body);
  if (dad) {
    [1.75, 1.55, 1.35].forEach(y => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.035, 6, 6), mat("#ced4da")); b.position.set(0.4, y, 0); g.add(b); });
  } else {
    const sk = new THREE.Mesh(new THREE.ConeGeometry(0.55, 0.55, 20), shirt); sk.position.y = 1.05; g.add(sk);
    const cream = mat("#f8f0c8");                  // nơ voan trước cổ
    [-0.14, 0.14].forEach(z => { const lo = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), cream); lo.scale.set(0.5, 0.8, 1.3); lo.position.set(0.36, 1.92, z); g.add(lo); });
    const kn = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), cream); kn.position.set(0.4, 1.92, 0); g.add(kn);
  }
  const arms = [];
  [-0.46, 0.46].forEach(z => {
    const p = new THREE.Group(); p.position.set(0, 1.95, z);
    const a = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.8, 8), shirt); a.position.y = -0.4; p.add(a);
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), skin); h.position.y = -0.85; p.add(h);
    g.add(p); arms.push(p);
  });
  const prop = new THREE.Group(); prop.position.y = -0.9; arms[1].add(prop);
  if (dad) {                                         // dép tổ ong
    const sole = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.6, 0.07), mat("#4dabf7")); sole.position.y = -0.3; prop.add(sole);
    const strap = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 6, 12), mat("#fff")); strap.position.set(0, -0.25, 0.05); prop.add(strap);
  } else {                                           // chổi lông gà
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.0, 6), mat("#8d5524")); stick.position.y = -0.5; prop.add(stick);
    ["#e03131", "#fab005", "#1c7ed6", "#2f9e44", "#e03131", "#fab005", "#7048e8"].forEach((c, i) => {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.13, 8, 6), mat(c)); f.scale.set(0.7, 1.4, 0.7);
      f.position.set(Math.cos(i) * 0.1, -1.05 - (i % 3) * 0.12, Math.sin(i) * 0.1); prop.add(f);
    });
  }
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.2, 10), skin); neck.position.y = 2.12; g.add(neck);
  const head = makeHead({ key: kind, src: dad ? PARENT_FACES.dad : PARENT_FACES.mom, crop: FACE_CROP[kind], r: 0.44, hair: dad ? "man" : "woman", hairCol: dad ? "#15110e" : "#2a1a12", skinMats: [skin] });
  head.position.y = 2.6; head.rotation.y = HEAD_YAW; g.add(head);
  g.add(blob(0.6));
  g.userData = { legs, arms, prop, body, kind, head };
  g.visible = false;
  return g;
}

/* ----- Dựng một level ----- */
function build3DLevel(char, L, total) {
  clearLevel();
  const gap = GAP3D[char], startX = 24;
  state.finishX = startX + total * gap;
  const len = state.finishX + 90;
  planSegments(char, L, total, gap, startX, len);
  G.segs.forEach(sg => {                                     // mỗi chặng một vùng đất: trời, đất, đường riêng
    const B = BIOMES[sg.bi];
    const grass = new THREE.Mesh(new THREE.PlaneGeometry(sg.x1 - sg.x0, 120), mat(B.side));
    grass.rotation.x = -Math.PI / 2; grass.position.set((sg.x0 + sg.x1) / 2, -0.05, -20); G.level.add(grass);
    const rt = roadTex(char === "lucie" ? B.path : B.road, B.lane); rt.repeat.set((sg.x1 - sg.x0) / 9, 1);
    const road = new THREE.Mesh(new THREE.PlaneGeometry(sg.x1 - sg.x0, 6.6), new THREE.MeshLambertMaterial({ map: rt }));
    road.rotation.x = -Math.PI / 2; road.position.set((sg.x0 + sg.x1) / 2, 0, 0); G.level.add(road);
    for (let x = sg.x0 + 4, k = 0; x < sg.x1; x += rand(11, 17), k++) {   // vài biểu tượng vui hai bên
      const sp = emojiSprite(B.scenery[k % B.scenery.length], rand(2.4, 4.6)); sp.position.set(x, 0, rand(-6, -17)); G.level.add(sp);
      if (k % 3 === 0) { const n = emojiSprite(B.scenery[(k + 2) % B.scenery.length], rand(1.2, 1.8)); n.position.set(x + 2, 0, rand(4.6, 6)); G.level.add(n); }
      if (k % 4 === 0 && sg.kind !== "space") { const cl = emojiSprite("☁️", rand(4, 7)); cl.position.set(x * 1.2, rand(9, 14), rand(-30, -45)); G.level.add(cl); }
    }
  });
  G.segIdx = -1; setSegment(0, true);

  questions3DGates(L, total, gap, startX);
  decorateLevel(L, len, gap, startX, total);
  // Đích
  const fin = makeGate(char === "lucie" ? "🏰" : "🏁", "#ffffff", "#212529", 4.2, true);
  fin.position.x = state.finishX; G.level.add(fin);

  // Nhân vật
  G.player = char === "lucas" ? makeCar() : makeLucie();
  G.player.scale.setScalar(char === "lucas" ? 1.15 : 1.25);
  G.level.add(G.player);
  G.bear = null;
  if (char === "lucie") { G.bear = makeBear(); G.level.add(G.bear); }
  G.dad = makeParent("dad"); G.mom = makeParent("mom");
  G.dad.scale.setScalar(1.2); G.mom.scale.setScalar(1.2);
  G.level.add(G.dad); G.level.add(G.mom);
  G.parentRel = -14; G.parentX = -14; G.fall = { dad: 0, mom: 0 }; G.tickle = 0;
  G.pz = LANES[1]; G.jumpT = 0;
  G.nextThrow = 4; G.nextTalk = 3; G.boostT = 0;
  G.camPos = new THREE.Vector3(-6, 7, 13); G.camLook = new THREE.Vector3(4, 1, 0);
}
function makeGate(emoji, postColor, barColor, size, finish) {
  const g = new THREE.Group(), parts = [];
  [-3.4, 3.4].forEach(z => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.34, 3.4, 0.34), mat(postColor)); p.position.set(0, 1.7, z); g.add(p); parts.push(p); });
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.55, 7.2), mat(barColor)); bar.position.y = 3.5; g.add(bar); parts.push(bar);
  if (finish) {                                       // vạch đích ca-rô
    for (let i = 0; i < 12; i++) { const t = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.55), mat(i % 2 ? "#fff" : "#111")); t.position.set(0, 0.02, -3.0 + i * 0.55); g.add(t); }
  }
  const s = emojiSprite(emoji, size); s.position.y = 0.05; g.add(s);
  g.userData = { parts, sprite: s };
  return g;
}
function questions3DGates(L, total, gap, startX) {
  for (let i = 0; i < total; i++) {
    const boss = i === total - 1, x = startX + i * gap;
    const O = BIOMES[G.segs[i].bi].obs;
    const gate = makeGate(boss ? L.boss : O[(i + state.level) % O.length], "#fff4e6", boss ? "#7048e8" : "#f76707", boss ? 3.6 : 2.4, false);
    gate.position.x = x; G.level.add(gate);
    state.obstacles.push({ x, gate, cleared: false });
    const lane = 1, n = 4;                                      // một hàng xu ngay trên đường chạy
    for (let k = 0; k < n; k++) {
      const cx = x - gap * 0.75 + k * 2.2;
      if (cx < 6) continue;
      const m = state.char === "lucas" ? makeCoin() : makeGem();
      m.position.set(cx, 0.75, LANES[lane]); G.level.add(m);
      state.coinList.push({ x: cx, lane, mesh: m, got: false, t: 0 });
    }
  }
}

/* ----- Điều khiển đổi làn: phím ↑↓ / W S, vuốt, hoặc nút trên màn hình ----- */
function changeLane(d) {
  return;                                                  // chạy 1 làn: không đổi làn
  if (!state.running || state.paused || G.tickle > 0) return;
  const n = Math.max(0, Math.min(2, state.lane + d));
  if (n !== state.lane) { state.lane = n; sweep(500, 800, 0.08, "sine", 0.08); }
}
function setupLaneControls() {
  addEventListener("keydown", e => {
    if ($("quizOverlay").classList.contains("show")) return;
    if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") changeLane(-1);
    if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") changeLane(1);
  });
  $("laneUp").onclick = () => changeLane(-1);
  $("laneDown").onclick = () => changeLane(1);
  let sy = null;
  $("gl").addEventListener("touchstart", e => { sy = e.touches[0].clientY; }, { passive: true });
  $("gl").addEventListener("touchend", e => {
    if (sy === null) return;
    const dy = e.changedTouches[0].clientY - sy; sy = null;
    if (Math.abs(dy) > 30) changeLane(dy < 0 ? -1 : 1);
  }, { passive: true });
}

/* ----- Bong bóng lời thoại (gắn theo nhân vật) ----- */
function bubble(target, text, ms, cls, dy) {
  const talk = !cls || cls === "kid" || cls === "pop";
  if (talk) {                                     // chỉ giữ tối đa 2 lời thoại: bỏ lời cũ của cùng người và lời cũ nhất
    G.bubbles = G.bubbles.filter(o => { if (o.talk && (o.target === target || false)) { o.el.remove(); return false; } return true; });
    const talks = G.bubbles.filter(o => o.talk);
    if (talks.length >= 2) { talks[0].el.remove(); G.bubbles.splice(G.bubbles.indexOf(talks[0]), 1); }
    ms = Math.min(ms, 1800);
  }
  const el = document.createElement("div"); el.className = "bub" + (cls ? " " + cls : ""); el.textContent = text;
  $("bubbles").appendChild(el);
  const b = { el, target, talk, dy: dy || 3.1, until: G.clock + ms / 1000 };
  G.bubbles.push(b); return b;
}
function updateBubbles() {
  const w = $("world").clientWidth, h = $("world").clientHeight, v = new THREE.Vector3();
  G.bubbles = G.bubbles.filter(b => {
    if (G.clock > b.until) { b.el.remove(); return false; }
    let k = 1;
    if (b.target.isVector3) v.copy(b.target); else { b.target.getWorldPosition(v); k = b.target.scale ? b.target.scale.y : 1; }
    v.y += b.dy * k + (k > 1 ? 0.35 : 0); v.project(G.camera);       // nổi trên đỉnh đầu, không che mặt
    b.el.style.display = v.z > 1 ? "none" : "";
    const half = b.el.offsetWidth / 2 + 6;                 // giữ bong bóng trong màn hình
    b.el.style.left = Math.max(half, Math.min(w - half, (v.x + 1) / 2 * w)) + "px";
    b.el.style.top = Math.max(b.el.offsetHeight + 60, (1 - v.y) / 2 * h) + "px";
    return true;
  });
}

/* ----- Bố mẹ đuổi theo ----- */
function updateChaseHud() {
  const b = $("chaseBox"); if (!b) return;
  b.textContent = CHASE_HUD[state.chase || 0];
  b.className = "box chase c" + (state.chase || 0);
}
function chaseCloser() {                       // trả lời sai / hết giờ → bố mẹ đuổi gần hơn
  state.chase = Math.min(4, (state.chase || 0) + 1);
  updateChaseHud(); sfxAlarm();
  if (state.chase < 4) {
    bubble(Math.random() < 0.5 ? G.dad : G.mom, pick(Math.random() < 0.5 ? DAD_LINES : MOM_LINES), 2200);
  }
  if (state.chase >= 4) { caught(); return true; }
  return false;
}
function chaseBack() {                         // trả lời đúng → bố mẹ tụt lại, có khi trượt vỏ chuối
  if (!state.chase) return;
  state.chase = Math.max(CHASE_MIN, state.chase - 1); updateChaseHud();
  const who = Math.random() < 0.5 ? "dad" : "mom", P = G[who];
  if (Math.random() < 0.6) {
    G.fall[who] = 1.8;
    const peel = emojiSprite("🍌", 0.9); peel.position.set(P.position.x + 0.4, 0, P.position.z); G.level.add(peel);
    G.debris.push({ m: peel, v: new THREE.Vector3(0, 0, 0), r: new THREE.Vector3(), t: 0, life: 2.2, still: true });
    bubble(P, pick(["Ối giời ơi! 🍌", "Á á á! Trơn quá!", "Úi da! 😵"]), 2000);
    sfxSlip();
  } else {
    bubble(P, pick(["Hự hự... mệt quá!", "Con chạy nhanh thế!", "Đợi bố mẹ với!"]), 2000);
  }
}
function caught() {                            // bị bắt → bị cù lét
  G.tickle = 2.9;
  const wasQuiz = $("quizOverlay").classList.contains("show") && !state.answered;
  stopTimer();
  $("quizOverlay").classList.remove("show");
  const banner = $("caught"); banner.textContent = "🤣 BỊ BẮT RỒI! CÙ LÉT NÀO!"; banner.classList.remove("show"); void banner.offsetWidth; banner.classList.add("show");
  bubble(G.player, "Hi hi hi! Nhột quá! 🤣", 2600, "kid", 2.6);
  setTimeout(() => G.dad && bubble(G.dad, "Cù cù cù! 😆", 1800), 300);
  setTimeout(() => G.mom && bubble(G.mom, "Bắt được rồi nhé! 😝", 1800), 700);
  sfxGiggle(); confetti(120);
  setTimeout(() => {
    state.chase = 2; updateChaseHud();
    G.fall.dad = 1.4; G.fall.mom = 1.6; G.parentRel = -7;
    bubble(G.player, "Thoát rồi! 😎", 1500, "kid", 2.6);
    sfxBoing();
    if (wasQuiz && state.running) {
      $("quizOverlay").classList.add("show");
      $("qMessage").style.color = "#1971c2"; $("qMessage").textContent = "😎 Thoát rồi! Trả lời lại nào!";
      startTimer();
    }
  }, 2900);
}
function throwSandal() {                       // bố ném dép – lúc nào cũng trượt
  const from = new THREE.Vector3(); G.dad.userData.prop.getWorldPosition(from);
  const m = new THREE.Group();
  const sole = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.07, 0.24), mat("#4dabf7")); m.add(sole);
  const st = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.025, 6, 12), mat("#fff")); st.rotation.x = Math.PI / 2; st.position.y = 0.05; m.add(st);
  m.position.copy(from); G.level.add(m);
  const miss = (G.pz > 0 ? -1 : 1) * rand(1.3, 2.0);
  const to = new THREE.Vector3(state.pos + rand(1.5, 3.5), 0.05, Math.max(-3, Math.min(3, G.pz + miss)));
  G.flyers.push({ m, from, to, t: 0, dur: 0.9 });
  bubble(G.dad, pick(["Dép bay đây! 🩴", "Đỡ này! 🩴", "Vèo!"]), 1300);
  sweep(900, 400, 0.4, "sine", 0.08);
}

/* ----- Mỗi khung hình ----- */
function renderLoop(t) {
  requestAnimationFrame(renderLoop);
  if (!$("gameScreen").classList.contains("active")) { G.lastT = t; return; }
  const dt = Math.min((t - (G.lastT || t)) / 1000, 0.05); G.lastT = t; G.clock += dt;
  if (state.running && !state.paused && G.tickle <= 0) gameStep(dt);
  animate3D(dt);
  G.renderer.render(G.scene, G.camera);
}
function gameStep(dt) {
  state.pos += SPEED3D[state.char] * dt * (G.boostT > 0 ? 1.7 : 1);
  state.coinList.forEach(c => {
    if (!c.got && Math.abs(c.x - state.pos) < 0.9 && c.lane === state.lane) {
      c.got = true; state.coins++; state.score += COIN_POINTS; collectFx(c); updateHud();
    }
  });
  if (state.chase >= 1) {
    G.nextThrow -= dt * (state.chase >= 2 ? 1 : 0.5);   // càng gần càng ném dép nhiều
    if (G.nextThrow <= 0 && G.fall.dad <= 0) { throwSandal(); G.nextThrow = rand(3.5, 5.5); }
  }
  if (state.chase >= 1) {
    G.nextTalk -= dt;
    if (G.nextTalk <= 0) { bubble(Math.random() < 0.5 ? G.dad : G.mom, pick(Math.random() < 0.5 ? DAD_LINES : MOM_LINES), 1800); G.nextTalk = rand(4, 7); }
  }
  const ob = state.obstacles[state.idx];
  if (ob && !ob.cleared && ob.x - state.pos <= 2.4) {
    state.paused = true; playerClass(""); openQuestion();
  } else if (!ob && state.finishX - state.pos <= 1.5) {
    state.running = false; playerClass("");
    if (state.chase) bubble(G.mom, "Con giỏi quá, bố mẹ chịu thua! 🥰", 3000);
    finishLevel();
  }
}
function breakGate(ob) {                        // trả lời đúng → cửa ải vỡ tung
  const g = ob.gate;
  g.userData.parts.forEach(p => {
    const wp = new THREE.Vector3(); p.getWorldPosition(wp); g.remove(p); p.position.copy(wp); G.level.add(p);
    G.debris.push({ m: p, v: new THREE.Vector3(rand(3, 7), rand(5, 9), rand(-4, 4)), r: new THREE.Vector3(rand(-6, 6), rand(-6, 6), rand(-6, 6)), t: 0, life: 1.6 });
  });
  const s = g.userData.sprite; s.material = s.material.clone(); s.material.map = emojiTex(CHARS[state.char].breakFx);
  G.debris.push({ m: s, v: new THREE.Vector3(0, 0, 0), r: new THREE.Vector3(), t: 0, life: 0.9, grow: true });
  G.jumpT = 0.7;
}
function animate3D(dt) {
  const t = G.clock, P = G.player; if (!P) return;
  const moving = state.running && !state.paused && G.tickle <= 0;
  G.pz += (LANES[state.lane] - G.pz) * Math.min(1, dt * 9);
  const lean = (LANES[state.lane] - G.pz) * 0.25;
  P.position.set(state.pos, 0, G.pz);
  let y = 0;
  if (G.jumpT > 0) { G.jumpT -= dt; const k = 1 - G.jumpT / 0.7; y = Math.sin(k * Math.PI) * 2.2; }
  if (state.char === "lucas") {
    P.userData.wheels.forEach(w => { if (moving) w.rotation.z -= SPEED3D.lucas * dt / 0.33; });
    P.position.y = y + (moving ? Math.sin(t * 40) * 0.015 : 0);
    P.userData.steer.rotation.z = -lean * 3; P.userData.head.rotation.z = Math.sin(t * 6) * 0.05 - lean * 0.6;
    P.rotation.x = -lean; P.rotation.z = G.jumpT > 0 ? Math.sin((1 - G.jumpT / 0.7) * Math.PI * 2) * 0.3 : 0;
    if (moving && Math.random() < 0.5) {               // khói xe
      const s = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 }));
      s.position.set(state.pos - 1.2, 0.35, G.pz + rand(-0.3, 0.3)); G.level.add(s); G.smoke.push({ m: s, t: 0 });
    }
  } else {
    const k = Math.sin(t * 9);
    P.position.y = y + (moving ? Math.abs(k) * 0.12 : 0);
    const sw = moving ? k * 0.04 : 0; P.userData.dress.scale.set(1 + sw, 1, 1 - sw);
    const run = moving ? 1 : 0.1, u = P.userData;
    u.legs[0].rotation.z = k * 0.75 * run; u.legs[1].rotation.z = -k * 0.75 * run;
    u.arms[0].rotation.z = -k * 0.8 * run;
    u.arms[1].rotation.z = 0.9 + Math.sin(t * 4) * 0.35;          // giơ đũa thần vẫy vẫy
    u.head.rotation.z = Math.sin(t * 4.5) * 0.06; u.head.position.y = 1.98 + Math.abs(k) * 0.03;
    P.rotation.x = -lean;
    if (G.bear) {
      G.bear.position.set(state.pos - 1.3, (moving ? Math.abs(Math.sin(t * 9 + 1)) * 0.28 : 0) + y * 0.6, Math.min(3, G.pz + 1.1));
    }
  }
  if (G.tickle > 0) {                                     // bị cù: lắc lư cười
    G.tickle -= dt;
    P.rotation.z = Math.sin(t * 30) * 0.18; P.position.y = Math.abs(Math.sin(t * 18)) * 0.3;
    if (Math.random() < 0.25) bubbleHeart();
  } else if (state.char === "lucie") P.rotation.z = 0;

  // Bố mẹ
  const ch = state.chase || 0;
  const target = G.tickle > 0 ? state.pos - 0.9 : (ch ? state.pos - CHASE_GAP[ch] : state.pos - 32);
  // bố mẹ chạy cùng tốc độ với bé, cộng thêm phần đuổi gần / tụt lại
  const relBefore = G.parentRel;
  G.parentRel += ((target - state.pos) - G.parentRel) * Math.min(1, dt * (G.tickle > 0 ? 6 : 2.2));
  G.parentX = state.pos + G.parentRel;
  const speedP = Math.abs(G.parentRel - relBefore) / Math.max(dt, 0.001);
  [["dad", -1.05, 0], ["mom", 1.05, 0.35]].forEach(([k, dz, ph]) => {
    const M = G[k]; if (!M) return;
    M.visible = G.parentX > state.pos - 26;
    if (G.fall[k] > 0) {                                  // trượt chân ngã ngửa
      G.fall[k] -= dt;
      const f = G.fall[k], down = f > 0.5 ? Math.min(1, (1.8 - f) * 3) : f * 2;
      M.rotation.z = down * Math.PI / 2; M.position.y = 0;
      if (Math.random() < 0.15) bubble(M, "💫", 500, "stars", 1.0);
      return;
    }
    M.rotation.z = 0;
    const runK = (moving || speedP > 0.4) ? 1 : 0.15;
    const x = G.parentX - (k === "dad" ? 1.7 : 0);
    M.position.set(M.position.x + (x - M.position.x) * Math.min(1, dt * 8), Math.abs(Math.sin(t * 13 + ph)) * 0.18 * runK, Math.max(-3, Math.min(3, G.pz + dz)));
    const u = M.userData, s = Math.sin(t * 13 + ph);
    u.legs[0].rotation.z = s * 0.8 * runK; u.legs[1].rotation.z = -s * 0.8 * runK;
    u.arms[0].rotation.z = -s * 0.7 * runK;
    u.arms[1].rotation.z = Math.PI * 0.85 + Math.sin(t * (G.tickle > 0 ? 30 : 11) + ph) * 0.55;   // vung chổi / dép
    if (G.tickle > 0) u.arms[0].rotation.z = Math.PI * 0.6 + Math.sin(t * 30) * 0.5;
    u.head.rotation.z = s * 0.07 * runK; u.head.position.y = 2.6 + Math.abs(s) * 0.04;
    if (!runK || runK < 1) u.body.scale.y = 1 + Math.sin(t * 6) * 0.04;   // thở hổn hển
  });

  // Xu
  state.coinList.forEach(c => {
    if (c.got) {
      if (c.mesh.visible) {                            // bay vọt lên, xoay tít, phình to rồi biến mất
        c.t += dt; c.mesh.position.y += dt * 6; c.mesh.rotation.y += dt * 25;
        c.mesh.scale.setScalar(c.t < 0.15 ? 1 + c.t * 5 : Math.max(0.01, 1.75 - (c.t - 0.15) * 4));
        if (c.t > 0.6) c.mesh.visible = false;
      }
    } else {
      c.mesh.rotation.y += dt * 2.4;
      c.mesh.position.y = 0.85 + Math.sin(G.clock * 3 + c.x) * 0.12;             // nhún nhảy
      if (c.spark && Math.random() < 0.02) { c.spark.material.opacity = 1; c.spark.scale.setScalar(0.5); }
      if (c.spark) { c.spark.material.opacity *= 0.93; c.spark.scale.multiplyScalar(1.02); }
    }
  });
  // Mảnh vỡ, vỏ chuối, dép bay, khói
  G.debris = G.debris.filter(d => {
    d.t += dt;
    if (d.grow) { d.m.scale.setScalar(2.4 + d.t * 4); d.m.material.opacity = Math.max(0, 1 - d.t / d.life); }
    else if (d.ring) { d.m.scale.setScalar(1 + d.t * 9); d.m.material.opacity = Math.max(0, 0.9 - d.t / d.life); }
    else if (d.spark) { d.v.y -= 6 * dt; d.m.position.addScaledVector(d.v, dt); d.m.rotation.x += 8 * dt; d.m.material.opacity = Math.max(0, 1 - d.t / d.life); d.m.scale.setScalar(1 - d.t / d.life * 0.6); }
    else if (!d.still) { d.v.y -= 18 * dt; d.m.position.addScaledVector(d.v, dt); d.m.rotation.x += d.r.x * dt; d.m.rotation.y += d.r.y * dt; d.m.rotation.z += d.r.z * dt; }
    if (d.t > d.life) { G.level.remove(d.m); return false; }
    return true;
  });
  G.flyers = G.flyers.filter(f => {
    f.t += dt; const k = Math.min(1, f.t / f.dur);
    if (k < 1) { f.m.position.lerpVectors(f.from, f.to, k); f.m.position.y += Math.sin(k * Math.PI) * 3; f.m.rotation.z += dt * 14; f.m.rotation.x += dt * 6; return true; }
    if (!f.landed) {
      f.landed = true; f.m.position.copy(f.to); f.m.rotation.set(0, rand(0, 3), 0);
      bubble(f.to.clone(), pick(["BỘP! Trượt rồi 😜", "Hụt! 😝", "Hí hí, không trúng!"]), 1500, "pop", 0.6); sfxThud();
    }
    if (f.t > f.dur + 2) { G.level.remove(f.m); return false; }
    return true;
  });
  G.smoke = G.smoke.filter(s => {
    s.t += dt;
    if (s.line) { s.m.position.x -= dt * 22; s.m.material.opacity = Math.max(0, 0.8 - s.t * 2.5); if (s.t > 0.35) { G.level.remove(s.m); s.m.geometry.dispose(); s.m.material.dispose(); return false; } return true; } s.m.scale.setScalar(1 + s.t * 4); s.m.material.opacity = Math.max(0, 0.7 - s.t * 1.6); s.m.position.y += dt * 0.6;
    if (s.t > 0.45) { G.level.remove(s.m); s.m.geometry.dispose(); s.m.material.dispose(); return false; }
    return true;
  });

  // Máy quay
  const chs = Math.min(1, ch);                            // có bố mẹ đuổi: lùi máy quay để thấy cả phía sau
  const cp = G.tickle > 0 ? new THREE.Vector3(state.pos - 2.5, 3.6, G.pz + 7)
                          : new THREE.Vector3(state.pos - 1.6, 5.6, G.pz * 0.35 + 12);
  const cl = G.tickle > 0 ? new THREE.Vector3(state.pos - 0.6, 1.3, G.pz)
                          : new THREE.Vector3(state.pos + 1.0, 1.4, G.pz * 0.35 - 1);
  if (moving) { const v = SPEED3D[state.char] * (G.boostT > 0 ? 1.7 : 1); cp.x += v / 4; cl.x += v / 5; }   // bù độ trễ khi máy quay bám theo
  if (G.camera.aspect < 1 && G.tickle <= 0) { cp.z += 6; cp.y += 2.2; cl.x -= 2.5 + chs * 1.5; }   // điện thoại dựng đứng
  G.camPos.lerp(cp, Math.min(1, dt * 4)); G.camLook.lerp(cl, Math.min(1, dt * 5));
  G.camera.position.copy(G.camPos); G.camera.lookAt(G.camLook);
  if (G.deco) G.deco.position.set(G.camPos.x + 45, 16, -70);
  updateScenery(dt);
  updateBubbles();
}
function bubbleHeart() {
  const v = new THREE.Vector3(state.pos + rand(-1, 1), rand(1.5, 2.8), G.pz + rand(-0.5, 0.5));
  bubble(v, pick(["😆", "🤣", "💕", "Hi hi", "Ha ha"]), 600, "float", 0);
}

/* =====================================================================
   CẢNH VẬT 3D PHONG PHÚ: núi non, vượt sông, đồi cát, đảo mây, hành tinh…
   cùng hiệu ứng trên đường: cờ dây, cột đèn, viền đường phát sáng,
   miếng tăng tốc, hạt bay theo thời tiết (đom đóm, tuyết, bọt nước, cát…)
   ===================================================================== */
const BIOME_KIND = ["forest", "ocean", "snow", "desert", "sky", "space"];
const FX = { water: [], floaters: [], spin: [], blink: [] };
function softDotTex(color) {
  const key = "dot" + color; if (texCache[key]) return texCache[key];
  const c = document.createElement("canvas"); c.width = c.height = 64;
  const x = c.getContext("2d"), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.35, color); g.addColorStop(1, "rgba(0,0,0,0)");
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  return (texCache[key] = new THREE.CanvasTexture(c));
}
function waterTex(deep, light) {
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const x = c.getContext("2d"); x.fillStyle = deep; x.fillRect(0, 0, 128, 128);
  x.strokeStyle = light; x.lineWidth = 3;
  for (let i = 0; i < 9; i++) { const y = i * 14 + 6; x.beginPath(); for (let k = 0; k <= 128; k += 8) x.lineTo(k, y + Math.sin(k / 10 + i) * 3); x.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return t;
}
function plankTex() {
  if (texCache.plank) return texCache.plank;
  const c = document.createElement("canvas"); c.width = 128; c.height = 128;
  const x = c.getContext("2d");
  for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? "#a0703c" : "#b9864b"; x.fillRect(i * 16, 0, 16, 128); x.fillStyle = "#6b4423"; x.fillRect(i * 16, 0, 2, 128); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; return (texCache.plank = t);
}

/* ----- Núi, đồi, đảo ở xa ----- */
function mountain(x, z, h, r, col, cap) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, 6 + Math.floor(Math.random() * 3)), new THREE.MeshLambertMaterial({ color: col, flatShading: true }));
  m.position.y = h / 2 - 0.5; m.rotation.y = Math.random() * 3; g.add(m);
  if (cap) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(r * 0.36, h * 0.36, 7), new THREE.MeshLambertMaterial({ color: "#ffffff", flatShading: true }));
    c.position.y = h - h * 0.18 - 0.5; c.rotation.y = m.rotation.y; g.add(c);
  }
  g.position.set(x, 0, z); G.level.add(g);
}
function tree(x, z, s, leaf, snow) {
  const g = new THREE.Group();
  const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.15 * s, 0.2 * s, 0.8 * s, 6), mat("#7a4b25")); tr.position.y = 0.4 * s; g.add(tr);
  for (let i = 0; i < 3; i++) {
    const c = new THREE.Mesh(new THREE.ConeGeometry((1.1 - i * 0.25) * s, 1.1 * s, 7), new THREE.MeshLambertMaterial({ color: snow && i === 2 ? "#ffffff" : leaf, flatShading: true }));
    c.position.y = (1.0 + i * 0.6) * s; g.add(c);
  }
  g.position.set(x, 0, z); g.rotation.y = Math.random() * 3; G.level.add(g);
}
function cactus(x, z, s) {
  const g = new THREE.Group(), m = new THREE.MeshLambertMaterial({ color: "#2f9e44", flatShading: true });
  const b = new THREE.Mesh(new THREE.CylinderGeometry(0.25 * s, 0.28 * s, 2 * s, 8), m); b.position.y = s; g.add(b);
  [[-1, 1.1], [1, 0.8]].forEach(([d, y]) => {
    const a = new THREE.Mesh(new THREE.CylinderGeometry(0.15 * s, 0.15 * s, 0.7 * s, 7), m); a.position.set(0, y * s, d * 0.45 * s); g.add(a);
    const h = new THREE.Mesh(new THREE.CylinderGeometry(0.15 * s, 0.15 * s, 0.5 * s, 7), m); h.rotation.x = Math.PI / 2; h.position.set(0, (y - 0.3) * s, d * 0.25 * s); g.add(h);
  });
  g.position.set(x, 0, z); G.level.add(g);
}
function pyramid(x, z, s) {
  const p = new THREE.Mesh(new THREE.ConeGeometry(s, s * 1.1, 4), new THREE.MeshLambertMaterial({ color: "#e9b55c", flatShading: true }));
  p.position.set(x, s * 0.55 - 0.1, z); p.rotation.y = Math.PI / 4; G.level.add(p);
}
function cloudPuff(x, y, z, s) {
  const g = new THREE.Group(), m = new THREE.MeshLambertMaterial({ color: "#ffffff", flatShading: true });
  for (let i = 0; i < 5; i++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(s * rand(0.5, 0.9), 0), m); b.position.set(rand(-s, s), rand(-0.2, 0.3) * s, rand(-0.4, 0.4) * s); g.add(b); }
  g.position.set(x, y, z); G.level.add(g); FX.floaters.push({ m: g, base: y, ph: Math.random() * 6, amp: 0.4 });
  return g;
}
function planet(x, y, z, r, col, ring) {
  const p = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), new THREE.MeshLambertMaterial({ color: col, emissive: col, emissiveIntensity: 0.25 }));
  p.position.set(x, y, z); G.level.add(p); FX.spin.push({ m: p, s: 0.2 });
  if (ring) { const rg = new THREE.Mesh(new THREE.TorusGeometry(r * 1.6, r * 0.12, 6, 40), mat("#ffe066")); rg.rotation.x = 1.2; p.add(rg); }
}
function coral(x, z) {
  const cols = ["#ff6b6b", "#f783ac", "#ffa94d", "#be4bdb"], g = new THREE.Group();
  for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, rand(0.6, 1.4), 5), mat(pick(cols))); b.position.set(rand(-0.3, 0.3), 0.4, rand(-0.3, 0.3)); b.rotation.set(rand(-0.5, 0.5), 0, rand(-0.5, 0.5)); g.add(b); }
  g.position.set(x, 0, z); G.level.add(g);
}
function crystal(x, z, col) {
  const c = new THREE.Mesh(new THREE.OctahedronGeometry(rand(0.4, 0.9)), new THREE.MeshPhongMaterial({ color: col, emissive: col, emissiveIntensity: 0.5, flatShading: true, shininess: 100 }));
  c.scale.y = 2; c.position.set(x, 0.8, z); G.level.add(c); FX.spin.push({ m: c, s: 0.6 });
}

/* ----- Sông và cây cầu bắc qua đường ----- */
function riverCrossing(x, kind) {
  const deep = kind === "space" ? "#3b2a6b" : kind === "snow" ? "#74c0fc" : kind === "desert" ? "#1c9fb4" : "#1c7ed6";
  const light = kind === "space" ? "#e599f7" : "#d0ebff";
  const wt = waterTex(deep, light); wt.repeat.set(2, 30);
  const water = new THREE.Mesh(new THREE.PlaneGeometry(9, 160), new THREE.MeshLambertMaterial({ map: wt, transparent: true, opacity: 0.95 }));
  water.rotation.x = -Math.PI / 2; water.position.set(x, 0.03, -40); G.level.add(water);
  FX.water.push(wt);
  [-4.6, 4.6].forEach(dx => {                                   // bờ sông
    const bank = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 160), mat(kind === "snow" ? "#e9ecef" : "#c9a36a")); bank.position.set(x + dx, 0.1, -40); G.level.add(bank);
  });
  const pt = plankTex().clone(); pt.needsUpdate = true; pt.repeat.set(6, 1);
  const deck = new THREE.Mesh(new THREE.BoxGeometry(10, 0.25, 6.8), new THREE.MeshLambertMaterial({ map: pt })); deck.position.set(x, 0.12, 0); G.level.add(deck);
  [-3.4, 3.4].forEach(z => {                                    // lan can cầu
    const rail = new THREE.Mesh(new THREE.BoxGeometry(10, 0.12, 0.12), mat("#8d5524")); rail.position.set(x, 1.0, z); G.level.add(rail);
    for (let i = 0; i <= 5; i++) { const p = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.0, 0.14), mat("#6b4423")); p.position.set(x - 5 + i * 2, 0.5, z); G.level.add(p); }
  });
  const boats = kind === "space" ? ["🛸", "🚀"] : kind === "snow" ? ["🐧", "🧊"] : ["🦆", "⛵", "🐟", "🚣"];
  for (let i = 0; i < 4; i++) {                                 // vịt, thuyền trôi trên sông
    const b = emojiSprite(pick(boats), rand(1.0, 1.8)); b.position.set(x + rand(-2.5, 2.5), 0.05, rand(-30, -6)); G.level.add(b);
    FX.floaters.push({ m: b, base: 0.05, ph: Math.random() * 6, amp: 0.12, drift: rand(0.4, 1.1) });
  }
  return x;
}

/* ----- Trang trí dọc đường ----- */
function roadDecor(len, kind, startX) {
  const flagCols = ["#ff6b6b", "#ffd43b", "#51cf66", "#4dabf7", "#cc5de8"];
  const glow = kind === "space" ? "#e599f7" : kind === "sky" ? "#ffffff" : kind === "ocean" ? "#66d9e8" : "#ffd43b";
  [-3.35, 3.35].forEach(z => {                                   // viền đường phát sáng
    const e = new THREE.Mesh(new THREE.BoxGeometry(len + 60, 0.08, 0.14), new THREE.MeshBasicMaterial({ color: glow }));
    e.position.set(len / 2 - 30, 0.05, z); G.level.add(e);
  });
  for (let x = 8; x < len - 20; x += 16) {                         // cột đèn + dây cờ đuôi nheo bên xa
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 3.6, 6), mat("#495057")); pole.position.set(x, 1.8, -4.2); G.level.add(pole);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), new THREE.MeshBasicMaterial({ color: glow })); lamp.position.set(x, 3.65, -4.2); G.level.add(lamp);
    FX.blink.push({ m: lamp, ph: x });
    for (let k = 1; k < 8; k++) {
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.45, 3), mat(flagCols[k % flagCols.length]));
      f.rotation.x = Math.PI; f.position.set(x + k * 2, 3.35 - Math.sin(k / 8 * Math.PI) * 0.6, -4.2); G.level.add(f);
    }
  }
  // Mũi tên vàng trên mặt đường
  for (let x = startX - 14; x < len - 20; x += 22) {
    for (let k = 0; k < 3; k++) {
      const a = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.7, 3), new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.55 }));
      a.rotation.set(-Math.PI / 2, 0, -Math.PI / 2); a.position.set(x + k * 0.9, 0.03, 0); G.level.add(a);
    }
  }
}
/* Miếng tăng tốc: chạy qua đúng làn → vụt nhanh, có vệt gió */
function boostPads(gap, startX, total) {
  state.boosts = [];
  for (let i = 0; i < total; i++) {
    const x = startX + i * gap - gap * 0.45, lane = 1;
    if (x < 8) continue;
    const g = new THREE.Group();
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 1.4), new THREE.MeshBasicMaterial({ color: "#ff922b" })); g.add(base);
    for (let k = 0; k < 3; k++) {
      const ch = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.5, 3), new THREE.MeshBasicMaterial({ color: "#fff3bf" }));
      ch.rotation.set(-Math.PI / 2, 0, -Math.PI / 2); ch.position.set(-0.7 + k * 0.7, 0.05, 0); g.add(ch);
    }
    g.position.set(x, 0.04, LANES[lane]); G.level.add(g);
    state.boosts.push({ x, lane, g, used: false });
  }
}

/* ----- Hạt bay theo thời tiết ----- */
const WEATHER = {
  forest: { col: "rgba(255,230,90,1)", n: 70, size: 0.35, fall: -0.1, wob: 1.2 },   // đom đóm
  ocean:  { col: "rgba(180,240,255,1)", n: 80, size: 0.3, fall: -0.8, wob: 0.6 },   // bọt nước bay lên
  snow:   { col: "rgba(255,255,255,1)", n: 160, size: 0.28, fall: 1.4, wob: 0.8 },  // tuyết rơi
  desert: { col: "rgba(240,200,120,1)", n: 120, size: 0.18, fall: 0.2, wob: 2.5 },  // cát bay
  sky:    { col: "rgba(255,180,230,1)", n: 80, size: 0.32, fall: 0.5, wob: 1.0 },   // cánh hoa
  space:  { col: "rgba(255,255,255,1)", n: 220, size: 0.22, fall: 0, wob: 0.2 }     // sao lấp lánh
};
function makeWeather(kind) {
  const W = WEATHER[kind], n = W.n, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { pos[i * 3] = rand(-15, 30); pos[i * 3 + 1] = rand(0.5, 12); pos[i * 3 + 2] = rand(-14, 8); }
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: W.size * 2.2, map: softDotTex(W.col), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  pts.userData = { W, seeds: Array.from({ length: n }, () => Math.random() * 6) };
  G.level.add(pts); G.weather = pts;
}
function updateWeather(dt) {
  const P = G.weather; if (!P) return;
  const a = P.geometry.attributes.position, W = P.userData.W, s = P.userData.seeds, cx = state.pos;
  for (let i = 0; i < a.count; i++) {
    let x = a.getX(i), y = a.getY(i), z = a.getZ(i);
    y -= W.fall * dt; x += Math.sin(G.clock * W.wob + s[i]) * dt * 0.6; z += Math.cos(G.clock * W.wob * 0.8 + s[i]) * dt * 0.4;
    if (y < 0.2) y = 12; if (y > 12) y = 0.3;
    if (x < cx - 15) x += 45; if (x > cx + 30) x -= 45;
    a.setXYZ(i, x, y, z);
  }
  a.needsUpdate = true;
  if (G.weather.userData.W === WEATHER.space || G.weather.userData.W === WEATHER.forest) P.material.opacity = 0.7 + Math.sin(G.clock * 3) * 0.3;
}

/* ----- Chia level thành các chặng, mỗi chặng (tới mỗi cửa ải) là một vùng đất khác ----- */
function planSegments(char, L, total, gap, startX, len) {
  const others = [0, 1, 2, 3, 4, 5].filter(b => b !== L.biome), r = L.biome * 7 + state.level;
  for (let k = others.length - 1; k > 0; k--) { const j = (r * (k + 3)) % (k + 1); [others[k], others[j]] = [others[j], others[k]]; }
  const order = [L.biome, ...others];
  G.segs = [];
  for (let i = 0; i < total; i++) {
    const bi = order[i % order.length];
    const x0 = i === 0 ? -80 : startX + (i - 1) * gap, x1 = i === total - 1 ? len + 80 : startX + i * gap;
    const sky = skyTex(BIOMES[bi].sky);
    G.segs.push({ bi, kind: BIOME_KIND[bi], x0, x1, sky: sky.tex, fog: sky.bottom });
  }
}
function setSegment(i, quiet) {
  if (i === G.segIdx || !G.segs[i]) return;
  G.segIdx = i; const sg = G.segs[i], B = BIOMES[sg.bi];
  G.scene.background = sg.sky;
  G.scene.fog = new THREE.Fog(sg.fog, 45, 150);
  if (G.deco) G.level.remove(G.deco);
  G.deco = emojiSprite(B.deco, 9); G.level.add(G.deco);
  Object.entries(G.weathers || {}).forEach(([k, P]) => { P.visible = k === sg.kind; });
  G.weather = (G.weathers || {})[sg.kind];
  if (!quiet) { showBanner(B.icon + " " + B.name); sweep(400, 1200, 0.35, "sine", 0.06); }
}
function decorateLevel(L, len, gap, startX, total) {
  FX.water = []; FX.floaters = []; FX.spin = []; FX.blink = [];
  G.weathers = {};
  G.segs.forEach((sg, si) => decorateSegment(sg.kind, sg.x0, sg.x1, si));
  // sông với cây cầu: 2 lần mỗi màn
  if (total > 2) { riverCrossing(startX + gap * 0.5, G.segs[0].kind); riverCrossing(startX + gap * 2.5, G.segs[Math.min(3, total - 1)].kind); }
  roadDecor(len, BIOME_KIND[L.biome] || "forest", startX);
  boostPads(gap, startX, total);
  G.segs.forEach(sg => { if (!G.weathers[sg.kind]) { makeWeather(sg.kind); G.weathers[sg.kind] = G.weather; } });
  G.segIdx = -1; setSegment(0, true);
}
function decorateSegment(kind, X0, X1, si) {
  const W = X1 - X0, cx = (X0 + X1) / 2;
  // dãy núi / phông nền xa
  for (let x = X0; x < X1; x += rand(10, 18)) {
    const z = rand(-38, -70);
    if (kind === "forest") mountain(x, z, rand(10, 20), rand(7, 12), pick(["#2b8a3e", "#37b24d", "#2f9e44"]), false);
    if (kind === "snow") mountain(x, z, rand(16, 28), rand(8, 13), pick(["#adb5bd", "#868e96", "#a5d8ff"]), true);
    if (kind === "desert") { if (Math.random() < 0.4) pyramid(x, z, rand(6, 11)); else { const d = new THREE.Mesh(new THREE.SphereGeometry(rand(6, 10), 10, 6), new THREE.MeshLambertMaterial({ color: "#f4c430", flatShading: true })); d.scale.y = 0.3; d.position.set(x, 0, z); G.level.add(d); } }
    if (kind === "ocean") { const is = new THREE.Mesh(new THREE.SphereGeometry(rand(4, 7), 10, 6), new THREE.MeshLambertMaterial({ color: "#ffe8a3", flatShading: true })); is.scale.y = 0.35; is.position.set(x, 0, z); G.level.add(is); const pm = emojiSprite("🌴", rand(4, 6)); pm.position.set(x, 1, z + 2); G.level.add(pm); }
    if (kind === "sky") cloudPuff(x, rand(-1, 5), z, rand(3, 6));
    if (kind === "space") { if (Math.random() < 0.35) planet(x, rand(6, 20), z - 20, rand(2, 6), pick(["#ff922b", "#74c0fc", "#b197fc", "#63e6be", "#ffa8a8"]), Math.random() < 0.4); }
  }
  if (kind === "ocean") {                                         // biển hai bên đường
    const wt = waterTex("#1098ad", "#99e9f2"); wt.repeat.set(W / 6, 12); FX.water.push(wt);
    const sea = new THREE.Mesh(new THREE.PlaneGeometry(W, 70), new THREE.MeshLambertMaterial({ map: wt })); sea.rotation.x = -Math.PI / 2; sea.position.set(cx, 0.01, -40); G.level.add(sea);
    const sand = new THREE.Mesh(new THREE.PlaneGeometry(W, 3), mat("#ffe8a3")); sand.rotation.x = -Math.PI / 2; sand.position.set(cx, 0.02, -4.8); G.level.add(sand);
  }
  if (kind === "space") {                                         // đường lơ lửng giữa vũ trụ
    const bg = new THREE.Mesh(new THREE.PlaneGeometry(W, 160), new THREE.MeshBasicMaterial({ color: "#14102e" })); bg.rotation.x = -Math.PI / 2; bg.position.set(cx, -0.03, -20); G.level.add(bg);
  }
  // cảnh gần đường hai bên
  for (let x = X0 + 2; x < X1; x += rand(3.5, 6.5)) {
    const zf = rand(-5.5, -11), zn = rand(4.6, 6.5);
    if (kind === "forest") { tree(x, zf, rand(0.9, 1.6), pick(["#2f9e44", "#40c057", "#2b8a3e"])); if (Math.random() < 0.3) tree(x + 1, zn, rand(0.6, 0.9), "#37b24d"); }
    if (kind === "snow") { tree(x, zf, rand(0.9, 1.5), "#2b8a3e", true); if (Math.random() < 0.25) { const sm = new THREE.Mesh(new THREE.SphereGeometry(rand(0.5, 1), 8, 6), mat("#ffffff")); sm.scale.y = 0.5; sm.position.set(x, 0, zn); G.level.add(sm); } }
    if (kind === "desert") { if (Math.random() < 0.6) cactus(x, zf, rand(0.7, 1.3)); if (Math.random() < 0.2) cactus(x, zn, 0.6); }
    if (kind === "ocean") { if (Math.random() < 0.5) coral(x, zn); }
    if (kind === "sky" && Math.random() < 0.5) cloudPuff(x, rand(0.5, 2), zf, rand(0.8, 1.5));
    if (kind === "space" && Math.random() < 0.5) crystal(x, zf, pick(["#e599f7", "#66d9e8", "#ffd43b"]));
  }
  if (kind === "sky") {                                           // cầu vồng 3D vắt ngang trời
    ["#ff6b6b", "#ffa94d", "#ffd43b", "#69db7c", "#4dabf7", "#9775fa"].forEach((c, i) => {
      const r = new THREE.Mesh(new THREE.TorusGeometry(26 - i * 0.9, 0.45, 6, 48, Math.PI), new THREE.MeshBasicMaterial({ color: c }));
      r.position.set(cx, 0, -45); G.level.add(r);
    });
  }
  // cổng chào vùng đất mới ở đầu chặng
  if (si > 0) { const B = BIOMES[BIOME_KIND.indexOf(kind)]; const sg = emojiSprite(B.icon, 2.6); sg.position.set(X0 + 3, 0, -4.4); G.level.add(sg); }
}
function updateScenery(dt) {
  if (G.segs) { const i = G.segs.findIndex(sg => state.pos >= sg.x0 && state.pos < sg.x1); if (i >= 0) setSegment(i); }
  FX.water.forEach(t => { t.offset.y -= dt * 0.25; t.offset.x += dt * 0.03; });
  FX.floaters.forEach(f => { f.m.position.y = f.base + Math.sin(G.clock * 1.5 + f.ph) * f.amp; if (f.drift) f.m.position.z += f.drift * dt; });
  FX.spin.forEach(s => { s.m.rotation.y += s.s * dt; });
  FX.blink.forEach(b => { b.m.scale.setScalar(1 + Math.sin(G.clock * 4 + b.ph) * 0.2); });
  updateWeather(dt);
  // tăng tốc
  if (state.boosts && state.running && !state.paused) state.boosts.forEach(b => {
    b.g.children.forEach((c, i) => { if (i) c.material.opacity = 1; c.position.y = 0.05 + Math.abs(Math.sin(G.clock * 6 + i)) * 0.05; });
    if (!b.used && b.lane === state.lane && Math.abs(b.x - state.pos) < 1.3) {
      b.used = true; G.boostT = 1.6; sweep(300, 1400, 0.5, "sawtooth", 0.06);
      bubble(G.player, "VÚT! 🚀", 1000, "kid", 2.6);
    }
  });
  if (G.boostT > 0) {                                             // vệt gió khi tăng tốc
    G.boostT -= dt;
    for (let i = 0; i < 2; i++) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(rand(1.5, 3), 0.04, 0.04), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 }));
      l.position.set(state.pos + rand(-1, 6), rand(0.3, 2.5), G.pz + rand(-2, 2)); G.level.add(l);
      G.smoke.push({ m: l, t: 0, line: true });
    }
  }
}

/* ----- Viên kim cương giác cắt (dáng kim cương thật) và đồng xu vàng ----- */
let GEM_GEO = null, GEM_MAT = null, COIN_PARTS = null;
function makeGem() {
  if (!GEM_GEO) {
    // mặt cắt: đỉnh nhọn phía dưới → đai rộng → mặt bàn phẳng phía trên, xoay 8 giác
    const pts = [[0, -0.42], [0.44, 0.02], [0.46, 0.08], [0.3, 0.26], [0, 0.27]].map(([x, y]) => new THREE.Vector2(x, y));
    GEM_GEO = new THREE.LatheGeometry(pts, 8);
    GEM_MAT = new THREE.MeshPhongMaterial({ color: 0x7fe3ff, emissive: 0x0b4f6c, specular: 0xffffff, shininess: 160,
                                            flatShading: true, transparent: true, opacity: 0.93 });
  }
  const g = new THREE.Group();
  const gem = new THREE.Mesh(GEM_GEO, GEM_MAT); g.add(gem);
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.16), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 }));
  core.position.y = 0.02; g.add(core);
  const spark = emojiSprite("✨", 0.5); spark.center.set(0.5, 0.5); spark.position.set(0.25, 0.3, 0.2);
  spark.material = spark.material.clone(); spark.material.opacity = 0; g.add(spark);
  g.userData.spark = spark;
  g.scale.setScalar(1.1);
  return g;
}
function makeCoin() {
  if (!COIN_PARTS) COIN_PARTS = { geo: new THREE.CylinderGeometry(0.38, 0.38, 0.1, 28), rim: new THREE.TorusGeometry(0.38, 0.04, 8, 28),
    mat: new THREE.MeshPhongMaterial({ color: 0xfcc419, specular: 0xfff3bf, shininess: 90, emissive: 0x5c3d00 }) };
  const g = new THREE.Group();
  const face = new THREE.Mesh(COIN_PARTS.geo, COIN_PARTS.mat); face.rotation.x = Math.PI / 2; g.add(face);
  const rim = new THREE.Mesh(COIN_PARTS.rim, COIN_PARTS.mat); g.add(rim);
  const star = emojiSprite("⭐", 0.42); star.center.set(0.5, 0.5); star.position.z = 0.07; g.add(star);
  return g;
}
/* Hiệu ứng khi nhặt: vòng sáng loé, tia lấp lánh bắn ra, chữ +2 bay lên */
function collectFx(c) {
  const at = c.mesh.position.clone(), gem = state.char === "lucie";
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.42, 32), new THREE.MeshBasicMaterial({ color: gem ? 0x99e9f2 : 0xffe066, transparent: true, opacity: 0.9, side: THREE.DoubleSide }));
  ring.position.copy(at); ring.lookAt(G.camera.position); G.level.add(ring);
  G.debris.push({ m: ring, v: new THREE.Vector3(), r: new THREE.Vector3(), t: 0, life: 0.45, ring: true });
  for (let i = 0; i < 12; i++) {
    const a = i / 12 * Math.PI * 2;
    const sp = new THREE.Mesh(new THREE.OctahedronGeometry(0.07), new THREE.MeshBasicMaterial({ color: i % 3 ? (gem ? 0xc5f6fa : 0xfff3bf) : 0xffffff, transparent: true }));
    sp.position.copy(at); G.level.add(sp);
    G.debris.push({ m: sp, v: new THREE.Vector3(Math.cos(a) * rand(2, 4), rand(2, 5), Math.sin(a) * rand(2, 4)),
                    r: new THREE.Vector3(8, 8, 0), t: 0, life: 0.7, spark: true });
  }
  bubble(at.clone(), "+" + COIN_POINTS + (gem ? " 💎" : " 🪙"), 700, "float plus", 0.4);
  const box = $("coins").parentElement; box.classList.remove("bump"); void box.offsetWidth; box.classList.add("bump");
  gem ? sfxGem() : sfxCoin();
}
function sfxGem() { [1568, 2093, 2637, 3136].forEach((f, i) => tone(f, i * 0.05, 0.35, "sine", 0.09)); tone(4186, 0.22, 0.4, "triangle", 0.04); }

/* ----- Âm thanh vui ----- */
function sfxTick(fast) { tone(fast ? 1500 : 1150, 0, 0.05, "square", 0.045); tone(fast ? 1000 : 800, 0.06, 0.04, "square", 0.03); }
function sfxAlarm() { tone(880, 0, 0.12, "square", 0.05); tone(660, 0.14, 0.12, "square", 0.05); }
function sfxSlip()  { sweep(1500, 200, 0.7, "sine", 0.14); setTimeout(sfxThud, 650); }
function sfxThud()  { tone(90, 0, 0.18, "sine", 0.35); tone(60, 0.02, 0.2, "triangle", 0.15); }
function sfxBoing() { sweep(180, 620, 0.16, "sine", 0.18); setTimeout(() => sweep(620, 160, 0.25, "sine", 0.15), 160); }
function sfxGiggle() { for (let i = 0; i < 16; i++) tone(650 + Math.random() * 600, i * 0.12, 0.09, "triangle", 0.11); }

/* ---------- Bản đồ các cửa ải trong level ---------- */
function buildMap() {
  const m = $("map"), L = LEVELS[state.char][state.level - 1];
  m.innerHTML = `<span class="lvName">${L.icon} Level ${state.level}</span>`;
  const total = state.questions.length;
  for (let i = 0; i < total; i++) {
    if (i > 0) { const l = document.createElement("div"); l.className = "line"; m.appendChild(l); }
    const n = document.createElement("div");
    n.className = "node" + (i === total - 1 ? " bossNode" : "");
    n.textContent = i === total - 1 ? L.boss : (G.segs && G.segs[i] ? BIOMES[G.segs[i].bi].icon : i + 1);
    if (G.segs && G.segs[i] && i < total - 1) n.title = BIOMES[G.segs[i].bi].name;
    m.appendChild(n);
  }
}
function updateMap() {
  const nodes = $("map").querySelectorAll(".node"), lines = $("map").querySelectorAll(".line");
  nodes.forEach((n, i) => {
    n.classList.toggle("done", i < state.idx);
    n.classList.toggle("now", i === state.idx);
    if (i < state.idx) n.textContent = "✓";
  });
  lines.forEach((l, i) => l.classList.toggle("done", i < state.idx));
}
function showBanner(text) { const b = $("zoneBanner"); b.textContent = text; b.classList.remove("show"); void b.offsetWidth; b.classList.add("show"); }

function updateHud() {
  $("score").textContent = state.score;
  $("combo").textContent = state.combo;
  $("coins").textContent = state.coins;
  const m = multiplier();
  $("mult").textContent = m > 1 ? "(x" + m + ")" : "";
  $("comboBox").classList.toggle("hot", m > 1);
  updateMap();
}
// Combo nhân điểm: đúng liên tiếp 3 câu → x2, liên tiếp 5 câu → x3
function multiplier() { return state.combo >= 5 ? 3 : state.combo >= 3 ? 2 : 1; }

/* ---------- Đồng hồ đếm ngược ----------
   Thời gian = tối thiểu 10 giây; câu dài thì cộng thêm (số chữ × 0,25 giây). Lucas được gấp đôi. */
let timerId = null, timeLeft = 0, timeMax = 0, lastTickAt = 99;
function startTimer() {
  const q = state.questions[state.idx];
  timeMax = Math.max(10, Math.ceil(q.question.length * 0.25)) * (state.char === "lucas" ? 2 : 1);
  timeLeft = timeMax; lastTickAt = 99;
  clearInterval(timerId); renderTimer();
  timerId = setInterval(tickTimer, 100);
}
function stopTimer() { clearInterval(timerId); timerId = null; }
function tickTimer() {
  if (state.answered || !$("quizOverlay").classList.contains("show")) return;
  timeLeft = Math.max(0, timeLeft - 0.1);
  renderTimer();
  if (timeLeft < 4 && timeLeft > 0) {                         // tích tắc, 2 giây cuối dồn dập gấp đôi
    const gap = timeLeft < 2 ? 0.25 : 0.5;
    if (lastTickAt - timeLeft >= gap - 0.001) { sfxTick(timeLeft < 2); lastTickAt = timeLeft; }
  }
  if (timeLeft <= 0) { stopTimer(); timeUp(); }
}
function renderTimer() {
  const r = timeLeft / timeMax, f = $("timerFill"), n = $("timerNum");
  f.style.width = (r * 100) + "%";
  f.style.background = r > 0.6 ? "linear-gradient(90deg,#69db7c,#2f9e44)" : r > 0.3 ? "linear-gradient(90deg,#ffe066,#f59f00)" : "linear-gradient(90deg,#ff8787,#e03131)";
  n.textContent = "⏱ " + Math.ceil(timeLeft);
  n.className = "timerNum" + (r <= 0.3 ? " hot" : r <= 0.6 ? " warn" : "");
}
function timeUp() {                                          // hết giờ: mất combo, được thử lại câu đó
  state.combo = 0; streak[state.char] = 0; state.wrongThis = true;
  updateHud(); sfxWrong();
  $("qMessage").style.color = "#e03131";
  $("qMessage").textContent = "⏰ Hết giờ rồi! Con thử lại nhé!";
  shake($("quizCard")); shake($("world"));
  if (chaseCloser()) return;                                // bị bắt: cảnh cù lét tự mở lại câu hỏi
  setTimeout(() => { if ($("quizOverlay").classList.contains("show") && !state.answered) { $("qMessage").textContent = ""; startTimer(); } }, 1600);
}

/* ---------- Pop-up câu hỏi ---------- */
function openQuestion() {
  const q = state.questions[state.idx];
  const total = state.questions.length;
  const isBoss = state.idx === total - 1;
  const L = LEVELS[state.char][state.level - 1];
  state.answered = false;
  state.wrongThis = false;
  $("quizCard").classList.toggle("bossCard", isBoss);
  $("qStage").textContent = (q.review ? "🔁 Ôn lại · " : "") + (isBoss ? L.boss + " Trùm cuối Level " + state.level + "!" : "🚩 Câu " + (state.idx + 1) + "/" + total);
  $("qSubject").textContent = q.subject;
  $("qSubject").style.background = SUBJECT_COLORS[q.subject] || "#888";
  $("qText").textContent = q.question;
  $("qMessage").textContent = "";
  const box = $("qOptions"); box.innerHTML = "";
  q.options.forEach((opt, i) => {
    const b = document.createElement("button");
    b.className = "opt";
    b.textContent = "ABCD"[i] + ". " + opt;
    b.onclick = () => answer(i, b);
    box.appendChild(b);
  });
  $("quizOverlay").classList.add("show");
  startTimer();
  if (state.char === "lucas") setTimeout(() => { if (!state.answered) docCauHoi(false); }, 400);   // Lucas lớp 1: tự đọc câu hỏi
}

// Đọc câu hỏi và đáp án bằng giọng tự nhiên (giong-noi.js thay giọng máy bằng giọng VieNeu nếu đã có)
function docCauHoi(bam) {
  if (!("speechSynthesis" in window)) return;
  const q = state.questions[state.idx]; if (!q) return;
  const anh = q.subject === "Tiếng Anh";
  const u = new SpeechSynthesisUtterance(q.question + ". " + q.options.map((o, i) => "ABCD"[i] + ". " + o).join(". "));
  u.lang = anh ? "en-US" : "vi-VN"; u.rate = anh ? 0.85 : 1;
  speechSynthesis.cancel(); speechSynthesis.speak(u);
}

function answer(i, btn) {
  if (state.answered) return;
  try { speechSynthesis.cancel(); } catch (e) {}
  const q = state.questions[state.idx];
  if (i === q.correctIndex) {
    state.answered = true;
    stopTimer();
    recordQ(q.base || q, !state.wrongThis);
    btn.classList.add("right");
    state.combo++;
    state.maxCombo = Math.max(state.maxCombo, state.combo);
    if (!state.wrongThis) state.firstTry++;
    streak[state.char]++;
    const cup = streak[state.char] % COMBO_CUP === 0 ? unlockTrophy(state.char) : null;
    const gain = 10 * multiplier();
    state.score += gain;
    updateHud();
    sfxCorrect();
    confetti(160);
    showPraise("Tuyệt vời! +" + gain);
    $("qMessage").style.color = "#2f9e44";
    const praise = PRAISES[Math.floor(Math.random() * PRAISES.length)];
    $("qMessage").textContent = "🎉 " + praise;
    const goOn = () => {
      $("quizOverlay").classList.remove("show");
      const ob = state.obstacles[state.idx];
      breakGate(ob);
      ob.cleared = true;
      chaseBack();
      state.idx++;
      updateHud();
      playerClass("jump");
      sfxJump();
      setTimeout(() => { state.paused = false; state.last = performance.now(); playerClass(CHARS[state.char].move); }, 700);
    };
    if (cup !== null) setTimeout(() => showCupPopup(cup, goOn), 1100);
    else setTimeout(goOn, 1400);
  } else {
    state.combo = 0;
    streak[state.char] = 0;
    state.wrongThis = true;
    updateHud();
    btn.classList.add("wrong");
    sfxWrong();
    $("qMessage").style.color = "#e8590c";
    const enc = ENCOURAGE[Math.floor(Math.random() * ENCOURAGE.length)];
    $("qMessage").textContent = enc + " 💪";
    shake($("quizCard")); shake($("world"));
    chaseCloser();
  }
}

/* ---------- Cúp vinh quang ---------- */
function trophySVG(t, id) {
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="tg${id}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="${t.c1}"/><stop offset="1" stop-color="${t.c2}"/></radialGradient>
  <linearGradient id="tr${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.c2}"/><stop offset="1" stop-color="#862e9c"/></linearGradient></defs>
  <path d="M38 78 L26 116 L42 108 L50 120 L58 84Z" fill="url(#tr${id})"/><path d="M82 78 L94 116 L78 108 L70 120 L62 84Z" fill="url(#tr${id})"/>
  <circle cx="60" cy="56" r="46" fill="#fff" opacity=".9"/>
  <circle cx="60" cy="56" r="42" fill="url(#tg${id})" stroke="#fff" stroke-width="4"/>
  <circle cx="60" cy="56" r="34" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2" stroke-dasharray="3 4"/>
  <text x="60" y="70" text-anchor="middle" font-size="38">${t.icon}</text>
  <path class="shine" d="M30 34 Q40 18 58 16" stroke="#fff" stroke-width="6" stroke-linecap="round" fill="none"/>
  <path class="shine" d="M98 22 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="#fff"/>
</svg>`;
}
function unlockTrophy(char) {
  const p = loadProg(char), n = p.trophies || 0;
  if (n >= TROPHIES.length) return null;                     // đã có đủ cúp
  p.trophies = n + 1; saveProg(char, p);
  return n;
}
function showCupPopup(idx, done) {
  const t = TROPHIES[idx], o = $("cupOverlay");
  o.innerHTML = `<div class="card cupPop"><h2>🎉 Con mở được cúp mới!</h2>
    <div class="cupBig">${trophySVG(t, "pop")}</div>
    <p><b>${t.name}</b></p><p>Đúng liên tiếp ${streak[state.char]} câu! (${idx + 1}/${TROPHIES.length} cúp)</p>
    <button id="cupOk">Tuyệt quá! ▶</button></div>`;
  o.classList.add("show");
  sfxFanfare(true); confetti(260); setTimeout(() => confetti(200), 500);
  $("cupOk").onclick = () => { o.classList.remove("show"); if (done) done(); };
}
function openCups() {
  const p = loadProg(currentChar), n = p.trophies || 0, o = $("cupOverlay");
  o.innerHTML = `<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap">
      <h2 style="font-size:32px;color:#e8590c">🏆 Phòng cúp của ${CHARS[currentChar].name} (${n}/${TROPHIES.length})</h2>
      <button class="btn" onclick="$('cupOverlay').classList.remove('show')">✖ Đóng</button></div>
    <p style="font-size:20px;color:#555;margin-top:6px">Cứ trả lời đúng liên tiếp ${COMBO_CUP} câu là được thêm 1 cúp!</p>
    <div class="cupGrid">${TROPHIES.map((t, i) => `<div class="cupCell${i < n ? "" : " locked"}">${trophySVG(t, "r" + i)}
      <div class="cn">${i < n ? t.name : "❓ Chưa mở"}</div></div>`).join("")}</div></div>`;
  o.classList.add("show");
}

function shake(el) { el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); }
function showPraise(text) { const p = $("praise"); p.textContent = text; p.classList.remove("show"); void p.offsetWidth; p.classList.add("show"); }

/* ---------- Hoàn thành level ---------- */
function finishLevel() {
  const C = CHARS[state.char], total = state.questions.length, lv = state.level;
  const ratio = state.firstTry / total;
  const stars = ratio >= 0.9 ? 3 : ratio >= 0.6 ? 2 : 1;      // sao theo số câu đúng ngay lần đầu
  const isFinal = lv === LEVELS[state.char].length;

  const p = loadProg(state.char);
  const oldBest = p.best[lv] || 0;
  p.stars[lv] = Math.max(p.stars[lv] || 0, stars);
  p.best[lv] = Math.max(oldBest, state.score);
  p.unlocked = Math.max(p.unlocked, Math.min(lv + 1, LEVELS[state.char].length));
  saveProg(state.char, p);

  $("winBig").innerHTML = `<img class="winFace" src="${FACES[state.char]}" alt=""> ` + (isFinal ? C.finalIcon : (state.char === "lucie" ? "🏰" : "🏁"));
  $("winTitle").textContent = isFinal ? C.finalTitle : "🎉 Hoàn thành Level " + lv + "!";
  $("winStars").innerHTML = [0, 1, 2].map(i => `<span style="animation-delay:${i * .3}s">${i < stars ? "⭐" : "☆"}</span>`).join("");
  $("winScore").textContent = "Điểm: " + state.score;
  $("winDetail").textContent = "Đúng ngay lần đầu: " + state.firstTry + "/" + total + " • " + C.collect + " " + state.coins + " • 🔥 Combo: " + state.maxCombo;
  $("winRecord").textContent = state.score > oldBest ? "🏅 KỶ LỤC MỚI!" : "🏅 Kỷ lục level này: " + oldBest + " điểm";
  $("nextBtn").style.display = isFinal ? "none" : "";
  $("winOverlay").classList.add("show");
  sfxWin();
  confetti(250); setTimeout(() => confetti(200), 600); setTimeout(() => confetti(200), 1200);
  if (isFinal) { setTimeout(() => confetti(300), 1800); setTimeout(() => confetti(300), 2400); }
}

/* ---------- Giọng đọc: đã tắt theo yêu cầu (chỉ dùng hiệu ứng âm thanh) ---------- */
function speak() {}
function toast(text) {
  const d = document.createElement("div"); d.className = "toast"; d.textContent = text;
  document.body.appendChild(d); setTimeout(() => d.remove(), 2200);
}

/* ---------- Âm thanh hiệu ứng (tự tạo, không cần file) ---------- */
let actx = null;
function getAudio() {
  if (!actx) actx = new (window.AudioContext || window.webkitAudioContext)();
  if (actx.state === "suspended") actx.resume();
  return actx;
}
function tone(freq, start, dur, type = "sine", vol = 0.2) {
  const c = getAudio(), o = c.createOscillator(), g = c.createGain(), t0 = c.currentTime + start;
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(c.destination);
  o.start(t0); o.stop(t0 + dur + 0.05);
}
function sweep(f1, f2, dur, type, vol) {
  const c = getAudio(), o = c.createOscillator(), g = c.createGain(), t = c.currentTime;
  o.type = type; o.frequency.setValueAtTime(f1, t); o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.05);
  o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.08);
}
/* ---------- TIẾNG VỖ TAY (mô phỏng nhiều người vỗ tay thật trong phòng có tiếng vang) ---------- */
let noiseBuf = null, fxBus = null, lastCheer = -1;
function getNoise() {
  if (noiseBuf) return noiseBuf;
  const c = getAudio(); noiseBuf = c.createBuffer(1, Math.floor(c.sampleRate * 0.3), c.sampleRate);
  const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noiseBuf;
}
function getBus() {                                        // đường âm chung: tiếng gốc + tiếng vang của căn phòng
  if (fxBus) return fxBus;
  const c = getAudio(), len = Math.floor(c.sampleRate * 1.8), ir = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
  const input = c.createGain(), dry = c.createGain(), wet = c.createGain(), rev = c.createConvolver(), comp = c.createDynamicsCompressor();
  rev.buffer = ir; dry.gain.value = 0.9; wet.gain.value = 0.32;
  input.connect(dry).connect(comp); input.connect(rev).connect(wet).connect(comp); comp.connect(c.destination);
  fxBus = input; return fxBus;
}
/* 1 cái vỗ tay: 2 nhát rất sát nhau (2 lòng bàn tay chạm nhau) qua bộ lọc tạo "độ bốp" của lòng bàn tay */
function clap(at, vol, pan, tone_) {
  const c = getAudio(), t0 = c.currentTime + at, bus = getBus();
  const hp = c.createBiquadFilter(), pk = c.createBiquadFilter(), g = c.createGain(), p = c.createStereoPanner ? c.createStereoPanner() : null;
  hp.type = "highpass"; hp.frequency.value = 600;
  pk.type = "peaking"; pk.frequency.value = tone_ || (1000 + Math.random() * 1400); pk.Q.value = 1.4; pk.gain.value = 10;
  hp.connect(pk).connect(g);
  if (p) { p.pan.value = pan; g.connect(p).connect(bus); } else g.connect(bus);
  g.gain.setValueAtTime(0.0001, t0);
  [0, 0.004 + Math.random() * 0.006].forEach((d, k) => {     // 2 nhát
    const s = c.createBufferSource(); s.buffer = getNoise(); s.connect(hp);
    s.start(t0 + d, Math.random() * 0.25, 0.06);
    g.gain.setValueAtTime(vol * (k ? 0.75 : 1), t0 + d + 0.0015);
    g.gain.exponentialRampToValueAtTime(vol * 0.05, t0 + d + 0.022);
  });
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.09);
}
/* Đám đông vỗ tay: mỗi người một nhịp riêng, vỗ to dần rồi nhỏ dần */
function crowd(people, len, loud = 1) {
  for (let k = 0; k < people; k++) {
    const rate = 4.5 + Math.random() * 3, vol = (0.05 + Math.random() * 0.09) * loud, pan = Math.random() * 1.6 - 0.8, tn = 900 + Math.random() * 1600;
    for (let t = Math.random() * 0.25; t < len; t += 1 / rate + (Math.random() - 0.5) * 0.03) {
      const env = Math.min(1, t / 0.35) * (t > len * 0.55 ? Math.max(0.05, 1 - (t - len * 0.55) / (len * 0.45)) : 1);
      clap(t, vol * env, pan, tn);
    }
  }
}
/* Vỗ tay theo nhịp kiểu cổ vũ: "bốp bốp – bốp bốp bốp" */
function rhythmClap() {
  [0, 0.26, 0.62, 0.86, 1.1].forEach(t => { for (let k = 0; k < 10; k++) clap(t + Math.random() * 0.018, 0.12, Math.random() * 1.4 - 0.7); });
  crowd(8, 1.9, 0.6);
}
/* Huýt sáo cổ vũ */
function whistle(at, up) {
  const c = getAudio(), o = c.createOscillator(), lfo = c.createOscillator(), lg = c.createGain(), g = c.createGain(), t = c.currentTime + at;
  o.type = "sine"; lfo.frequency.value = 6; lg.gain.value = 25; lfo.connect(lg).connect(o.frequency);
  o.frequency.setValueAtTime(up ? 1500 : 2300, t);
  o.frequency.exponentialRampToValueAtTime(up ? 2700 : 2800, t + 0.22);
  o.frequency.exponentialRampToValueAtTime(up ? 2400 : 1700, t + 0.5);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 0.04); g.gain.setValueAtTime(0.05, t + 0.4); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
  o.connect(g).connect(getBus()); o.start(t); lfo.start(t); o.stop(t + 0.6); lfo.stop(t + 0.6);
}
/* Chuông chiến thắng lấp lánh */
function bell(freq, at, dur, vol) {
  [1, 2.01, 3.02].forEach((h, k) => tone(freq * h, at, dur * (1 - k * 0.25), "sine", vol / (k + 1)));
}
function chimeUp(big) {
  const notes = big ? [784, 988, 1175, 1568, 1976] : [1047, 1319, 1568];
  notes.forEach((f, i) => bell(f, i * 0.09, 0.7, 0.09));
}
/* ---------- ÂM THANH THẬT: nhạc nền + tiếng vỗ tay (đã nhúng sẵn trong SOUNDS) ---------- */
const BUFS = {};
function b64ToBuf(uri) {
  const bin = atob(uri.slice(uri.indexOf(",") + 1)), u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u.buffer;
}
function loadSound(name) {
  if (BUFS[name]) return BUFS[name];
  BUFS[name] = new Promise((res, rej) => {
    try { getAudio().decodeAudioData(b64ToBuf(SOUNDS[name]), res, rej); } catch (e) { rej(e); }
  });
  return BUFS[name];
}
function preloadSounds() { Object.keys(SOUNDS).forEach(n => loadSound(n).catch(() => {})); }

/* Nhạc nền: "Are you sleeping" bản nhẹ nhàng, lặp liền mạch, tự chuyển bài có làm mờ dần */
const MUSIC_FOR = { menu: "music1", lucie: "music1", lucas: "music2" };   // music1 = bản cổ điển, music2 = bản thiếu nhi
const MUSIC_VOLUME = 0.32;
let musicOn = true, music = null, musicWant = "menu";
function setMusic(where) {
  musicWant = where || "menu";
  if (musicOn) startMusic();
}
async function startMusic() {
  const name = MUSIC_FOR[musicWant] || "music1";
  if (music && music.name === name) return;
  let buf; try { buf = await loadSound(name); } catch (e) { return; }
  if (!musicOn || (MUSIC_FOR[musicWant] || "music1") !== name || (music && music.name === name)) return;
  stopMusic();
  const c = getAudio(), src = c.createBufferSource(), g = c.createGain();
  src.buffer = buf; src.loop = true;
  g.gain.setValueAtTime(0.0001, c.currentTime); g.gain.exponentialRampToValueAtTime(MUSIC_VOLUME, c.currentTime + 1.5);
  src.connect(g).connect(c.destination); src.start();
  music = { name, src, g };
}
function stopMusic() {
  if (!music) return;
  const c = getAudio(), m = music; music = null;
  try { m.g.gain.cancelScheduledValues(c.currentTime); m.g.gain.setValueAtTime(m.g.gain.value, c.currentTime);
        m.g.gain.linearRampToValueAtTime(0, c.currentTime + 0.6); m.src.stop(c.currentTime + 0.7); } catch (e) {}
}
function duckMusic(sec) {                                   // nhạc nhỏ đi một chút khi có tiếng vỗ tay
  if (!music) return;
  const c = getAudio(), g = music.g.gain, t = c.currentTime;
  g.cancelScheduledValues(t); g.setValueAtTime(g.value, t);
  g.linearRampToValueAtTime(MUSIC_VOLUME * 0.35, t + 0.2); g.setValueAtTime(MUSIC_VOLUME * 0.35, t + sec);
  g.linearRampToValueAtTime(MUSIC_VOLUME, t + sec + 1);
}

/* Tiếng vỗ tay thật (40 người). Mỗi lần lấy một đoạn khác nhau, tốc độ hơi khác nhau, nên không bị nhàm. */
let lastClapAt = -1;
async function playApplause(big) {
  let buf; try { buf = await loadSound("applause"); } catch (e) { crowd(big ? 30 : 14, big ? 3 : 1.8); return; }
  const c = getAudio(), src = c.createBufferSource(), g = c.createGain(), t = c.currentTime;
  const len = big ? Math.min(7, buf.duration - 0.5) : 2.6;
  let off;
  if (big) off = 0;
  else { do { off = 1 + Math.random() * Math.max(0.5, buf.duration - len - 1.5); } while (Math.abs(off - lastClapAt) < 1.5 && buf.duration > 8); lastClapAt = off; }
  src.buffer = buf; src.playbackRate.value = 0.94 + Math.random() * 0.12;
  const vol = big ? 1.0 : 0.85;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + (big ? 0.3 : 0.08));
  g.gain.setValueAtTime(vol, t + len - (big ? 2 : 0.8));
  g.gain.exponentialRampToValueAtTime(0.0001, t + len);
  src.connect(g).connect(c.destination); src.start(t, off, len + 0.1);
  duckMusic(len);
}
function sfxFanfare(big) {
  chimeUp(big);
  playApplause(big);
  if (big) { whistle(0.5, true); whistle(1.4, false); }
}
function sfxCorrect() { sfxFanfare(false); }

function sfxWrong()   { tone(260, 0, 0.25, "square", 0.06); tone(200, 0.18, 0.35, "square", 0.06); }
function sfxCoin()    { tone(988, 0, 0.1, "square", 0.07); tone(1319, 0.08, 0.25, "square", 0.07); }
function sfxJump()    { sweep(300, 900, 0.25, "sine", 0.15); }
function sfxEngine()  { sweep(70, 260, 0.9, "sawtooth", 0.07); }                      // "brừm brừm"
function sfxMagic()   { [1046, 1318, 1568, 2093].forEach((f, i) => tone(f, i * 0.09, 0.4, "sine", 0.12)); }
function sfxWin()     { sfxFanfare(true); }

/* ---------- Nhạc nền ---------- */
/* ---------- Toàn màn hình ---------- */
function canFull() { const d = document.documentElement; return !!(d.requestFullscreen || d.webkitRequestFullscreen); }
function isFull() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
function goFull() {
  const d = document.documentElement;
  try { const r = (d.requestFullscreen || d.webkitRequestFullscreen).call(d); if (r && r.catch) r.catch(() => {}); } catch (e) {}
}
function toggleFull() {
  if (isFull()) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {} }
  else goFull();
}
if (!canFull() || navigator.standalone || window.IS_APP) document.querySelectorAll(".fsBtn").forEach(b => b.hidden = true);
function autoStartSound() {
  try {
    const c = getAudio(); preloadSounds();
    const go = () => { if (c.state === "running" && musicOn) startMusic(); };
    c.onstatechange = go; go();
  } catch (e) {}
}

function tapToStart() {
  getAudio();
  if (canFull() && !navigator.standalone) goFull();
  $("tapStart").remove();
  preloadSounds();
  if (musicOn) startMusic();
  updateMusicBtns();
  chimeUp(true);
}
function updateMusicBtns() {
  const label = musicOn ? "🔇 Tắt nhạc" : "🎵 Bật nhạc";
  $("musicBtn").textContent = label; $("musicBtn2").textContent = label;
}
function toggleMusic() {
  getAudio();
  musicOn = !musicOn;
  musicOn ? startMusic() : stopMusic();
  const label = musicOn ? "🔇 Tắt nhạc" : "🎵 Bật nhạc";
  $("musicBtn").textContent = label; $("musicBtn2").textContent = label;
}

/* ---------- Pháo hoa giấy (confetti) ---------- */
const cv = $("confetti"), cx = cv.getContext("2d");
let bits = [], confettiRunning = false;
function resizeCanvas() { cv.width = innerWidth; cv.height = innerHeight; }
addEventListener("resize", resizeCanvas); resizeCanvas();
function confetti(n) {
  const colors = ["#ff6b6b", "#ffd43b", "#51cf66", "#4dabf7", "#b57edc", "#ff8fc8"];
  for (let i = 0; i < n; i++) {
    bits.push({ x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight * 0.45,
      vx: (Math.random() - 0.5) * 18, vy: -Math.random() * 17 - 5, s: Math.random() * 9 + 6,
      c: colors[i % colors.length], r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, life: 150 });
  }
  if (!confettiRunning) drawConfetti();
}
function drawConfetti() {
  confettiRunning = true;
  cx.clearRect(0, 0, cv.width, cv.height);
  bits.forEach(p => {
    p.vy += 0.35; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.r); cx.fillStyle = p.c;
    cx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.6); cx.restore();
  });
  bits = bits.filter(p => p.life > 0 && p.y < innerHeight + 40);
  if (bits.length) requestAnimationFrame(drawConfetti);
  else { confettiRunning = false; cx.clearRect(0, 0, cv.width, cv.height); }
}

/* ---------- Bàn phím: bấm 1-4 hoặc A-D để chọn đáp án ---------- */
addEventListener("keydown", e => {
  if (!$("quizOverlay").classList.contains("show")) return;
  const k = "1234".indexOf(e.key) >= 0 ? "1234".indexOf(e.key) : "abcd".indexOf(e.key.toLowerCase());
  const btns = $("qOptions").children;
  if (k >= 0 && btns[k]) btns[k].click();
});
</script>
<script>
/* NHẠC NỀN VÀ TIẾNG VỖ TAY THẬT — đã nhúng sẵn, KHÔNG CẦN SỬA
   music1: "Are you sleeping" bản cổ điển nhẹ nhàng • music2: bản thiếu nhi • applause: 40 người vỗ tay (BigSoundBank, CC0) */
const SOUNDS = {
  music1: "data:...BASE64_BO_BOT...",
  music2: "data:...BASE64_BO_BOT...",
  applause: "data:...BASE64_BO_BOT..."
};
autoStartSound();
</script>
<script src="../anh-chung/anh-that.js" defer></script>
<script src="../anh-chung/nhac-nen.js" data-ten="Lucie & Lucas phiêu lưu" data-bpm="124" data-goc="F" data-kieu="xylophone" data-not="F5 G5 A5 C6 A5 G5 F5 D5 G5 A5 Bb5 A5 G5 C5 F5"></script>
</body>
</html>
