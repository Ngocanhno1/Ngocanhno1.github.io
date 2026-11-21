Em là lập trình viên game web giàu kinh nghiệm. Dưới đây là TOÀN BỘ mã game "rung-chuong-vang" (games/rung-chuong-vang/index.html) — game học tập cho hai bé Lucie (lớp 3) và Lucas (lớp 1), chơi trên TV LG webOS (phím mũi tên/OK, phím 1-4) và iPad/điện thoại (chạm). Anh (bố) báo: các con chơi vẫn còn NHIỀU LỖI.

KIỂM THỬ TỰ ĐỘNG CỦA CLAUDE: mở trang rồi bấm phím/chạm liên tục như trẻ chơi thì trang BỊ TREO (trình duyệt không phản hồi sau ~90 giây). Tìm vòng lặp vô hạn, đệ quy, hoặc việc nặng chạy mỗi khung hình.

NHIỆM VỤ: đọc kỹ toàn bộ mã như một người kiểm thử, tìm và SỬA mọi lỗi thật: kẹt màn/không sang câu tiếp, nút không bấm được trên TV hoặc iPad, đếm điểm/cúp/CIECAS sai, đáp án sai hoặc trùng, câu hỏi lặp, lưu ván dở lỗi, âm thanh/giọng đọc chồng nhau, giật/rò bộ nhớ (setInterval, requestAnimationFrame, listener, phần tử tạo mới không xóa), lỗi khi tải ảnh thất bại, lỗi giao diện tràn màn hình TV 1920x1080 và iPad dọc. Không đổi luật chơi, nội dung câu hỏi đúng, mặt thật hai bé, các tệp dùng chung (../anh-chung/*.js).

CÁCH TRẢ LỜI (bắt buộc): MỘT khối ```json là mảng [{"cu": "đoạn mã gốc copy NGUYÊN VĂN, đủ dài để duy nhất trong tệp", "moi": "đoạn thay"}]. Nếu không có lỗi thì trả về []. Sau khối json, liệt kê ngắn từng lỗi đã sửa (1 dòng/lỗi).

===== MÃ GỐC =====
<!DOCTYPE html>
<html lang="vi">
<head>
<script src="/games/anh-chung/dong-bo.js"></script>
<script src="/games/anh-chung/dem-gio.js" defer></script>
<meta name="robots" content="noindex, nofollow">
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="author" content="Nguyễn Hoàng Ngọc Anh">
<meta name="keywords" content="Ban Tuyên giáo Trung ương">
<meta name="title" content="Ban Tuyên giáo Trung ương">
<link rel="icon" href="data:...BASE64_BO_BOT...">
<title>Rung Chuông Vàng – Lucie &amp; Lucas</title>
<script src="https://cdn.tailwindcss.com"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="../anh-chung/che-do-tv.js"></script>
<style>
  html, body { margin: 0; height: 100%; overflow: hidden; background: #140c33; }
  body { font-family: "Baloo 2", "Segoe UI", Arial, sans-serif; -webkit-tap-highlight-color: transparent; user-select: none; }
  .chu-vang {
    background: linear-gradient(180deg, #fff7c2 0%, #ffd43b 45%, #f59f00 70%, #ffe066 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
    filter: drop-shadow(0 4px 0 #7a3d00) drop-shadow(0 10px 18px rgba(0,0,0,.45));
  }
  .chu-vang-dam {
    background: linear-gradient(180deg, #f59f00 0%, #d9480f 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .the-chon {
    transition: transform .25s cubic-bezier(.2,1.4,.4,1), box-shadow .25s;
    backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  }
  .the-chon:hover { transform: translateY(-8px) scale(1.04); }
  .the-chon:active { transform: scale(.97); }
  .avatar {
    width: 112px; height: 112px; border-radius: 9999px; display: flex; align-items: center; justify-content: center;
    font-size: 54px; position: relative; margin: 0 auto; box-shadow: inset 0 -8px 0 rgba(0,0,0,.08), 0 8px 20px rgba(0,0,0,.25);
  }
  .avatar .huy-hieu { position: absolute; right: -6px; top: -6px; font-size: 34px; filter: drop-shadow(0 2px 2px rgba(0,0,0,.3)); }
  .nut-dap-an {
    display: flex; align-items: center; gap: 14px; width: 100%; text-align: left;
    padding: 12px 16px; border-radius: 20px; border: 3px solid #c7d2fe; background: #eef2ff;
    font-weight: 700; color: #1e1b4b; transition: transform .15s, background .15s, border-color .15s, box-shadow .15s;
    box-shadow: 0 5px 0 #a5b4fc;
  }
  .nut-dap-an:hover:not(:disabled) { transform: translateY(-3px); background: #e0e7ff; border-color: #818cf8; }
  .nut-dap-an:active:not(:disabled) { transform: translateY(2px); box-shadow: 0 2px 0 #a5b4fc; }
  .nut-dap-an .chu-cai {
    flex: none; width: 46px; height: 46px; border-radius: 14px; display: flex; align-items: center; justify-content: center;
    font-size: 26px; font-weight: 800; color: #fff;
  }
  .nut-dap-an.da-chon { background: #fff3bf; border-color: #fab005; box-shadow: 0 5px 0 #f59f00; }
  .nut-dap-an:disabled { cursor: default; }
  .nut-dap-an.mo:disabled { opacity: .45; }
  .hop-hien { animation: hopHien .45s cubic-bezier(.2,1.5,.4,1) both; }
  @keyframes hopHien { from { opacity: 0; transform: scale(.7) translateY(30px); } to { opacity: 1; transform: none; } }
  .truot-len { animation: truotLen .45s cubic-bezier(.2,1.2,.4,1) both; }
  @keyframes truotLen { from { opacity: 0; transform: translateY(80px); } to { opacity: 1; transform: none; } }
  .nhip-dap { animation: nhipDap .6s ease-in-out infinite alternate; }
  @keyframes nhipDap { from { transform: scale(1); } to { transform: scale(1.08); } }
  .rung-nhe { animation: rungNhe .5s ease-in-out infinite; }
  @keyframes rungNhe { 0%,100% { transform: rotate(0); } 25% { transform: rotate(-4deg); } 75% { transform: rotate(4deg); } }
  .o-thong-ke { border-radius: 18px; padding: 12px 10px; text-align: center; }
  .o-thong-ke .so { font-size: 38px; line-height: 1; font-weight: 800; }
  .chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 9999px; font-weight: 700; }
  #thanhGio { transition: width .1s linear, background-color .3s; }
  .an { display: none !important; }
  .bay-diem {
    position: absolute; left: 50%; top: 34%; transform: translateX(-50%); white-space: nowrap;
    font-weight: 800; font-size: clamp(28px, 5vw, 60px);
    text-shadow: 0 4px 0 rgba(0,0,0,.35), 0 0 24px rgba(255,255,255,.5);
    animation: bayDiem 1.7s ease-out forwards;
  }
  @keyframes bayDiem {
    0% { opacity: 0; transform: translate(-50%, 40px) scale(.5); }
    15% { opacity: 1; transform: translate(-50%, 0) scale(1.2); }
    30% { transform: translate(-50%, 0) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -110px) scale(1); }
  }
  .dap-vao { animation: dapVao 1.7s cubic-bezier(.2,1.3,.4,1) both; }
  @keyframes dapVao {
    0% { opacity: 0; transform: scale(3) rotate(-8deg); }
    18% { opacity: 1; transform: scale(.92) rotate(2deg); }
    28% { transform: scale(1.05) rotate(0); }
    80% { opacity: 1; transform: scale(1); }
    100% { opacity: 0; transform: scale(.8) translateY(-40px); }
  }
  .hien-dan { animation: hienDan .45s cubic-bezier(.2,1.5,.4,1) both; }
  @keyframes hienDan { from { opacity: 0; transform: translateY(24px) scale(.9); } to { opacity: 1; transform: none; } }
  .nut-dap-an.gap { animation: gapGap .45s ease-in-out infinite alternate; }
  @keyframes gapGap { from { box-shadow: 0 5px 0 #a5b4fc; } to { box-shadow: 0 0 0 5px rgba(239,68,68,.75), 0 5px 0 #a5b4fc; } }
</style>
<link rel="manifest" href="/manifest.webmanifest"><meta name="theme-color" content="#7c4dff"><link rel="apple-touch-icon" href="/img/icon-192.png"><script>if("serviceWorker" in navigator)addEventListener("load",function(){navigator.serviceWorker.register("/sw.js").catch(function(){})});</script>
<script src="../anh-chung/thong-tin.js"></script>
<script src="../anh-chung/giong-noi.js"></script>
</head>
<body>

<!-- KHUNG 3D -->
<div id="khung3d" class="fixed inset-0"></div>

<!-- PHÁO GIẤY 2D -->
<canvas id="phaoGiay" class="fixed inset-0 pointer-events-none" style="z-index:55"></canvas>

<!-- MÀN TẢI -->
<div id="manTai" class="fixed inset-0 flex flex-col items-center justify-center text-white text-center p-6" style="z-index:60;background:radial-gradient(circle at 50% 40%,#3b1e8f,#140c33)">
  <div class="text-7xl rung-nhe">🔔</div>
  <div class="text-2xl md:text-3xl font-extrabold mt-4">Đang dựng sân khấu Rung Chuông Vàng...</div>
  <div id="manTaiPhu" class="text-indigo-200 mt-2">Chờ con một chút nhé!</div>
</div>

<!-- NÚT ÂM THANH (luôn hiện) -->
<button id="nutNhac" title="Bật/tắt nhạc nền" class="fixed top-3 right-[4.25rem] w-12 h-12 rounded-2xl bg-white/90 hover:bg-white text-2xl shadow-lg" style="z-index:45">🎵</button>
<button id="nutAmThanh" title="Bật/tắt âm thanh" class="fixed top-3 right-3 w-12 h-12 rounded-2xl bg-white/90 hover:bg-white text-2xl shadow-lg" style="z-index:45">🔊</button>

<!-- MÀN HÌNH MỞ ĐẦU -->
<div id="manBatDau" class="fixed inset-0 pointer-events-none" style="z-index:30">
  <div class="absolute top-0 inset-x-0 pt-5 md:pt-8 pb-20 text-center bg-gradient-to-b from-indigo-950/85 via-indigo-950/40 to-transparent">
    <div class="chip bg-white/10 text-amber-200 text-xs md:text-sm tracking-widest">GAMESHOW KIẾN THỨC · TRƯỜNG TH&amp;THCS CHU VĂN AN</div>
    <h1 class="mt-2 text-5xl md:text-7xl font-extrabold leading-none"><span>🔔</span> <span class="chu-vang">RUNG CHUÔNG VÀNG</span></h1>
    <p class="text-indigo-100 text-base md:text-xl mt-2 font-semibold px-4">Chọn Lucie hoặc Lucas để thi tài cùng 99 bạn – ai sẽ rung được chuông vàng?</p>
    <p class="text-amber-200 mt-2 text-base md:text-lg font-bold">👇 Chọn nhân vật chính của con</p>
  </div>

  <button id="theLucie" class="the-chon pointer-events-auto absolute bottom-3 left-2 w-[48%] md:w-80 md:left-8 lg:left-14 md:bottom-auto md:top-1/2 md:-translate-y-1/3 rounded-[28px] p-4 md:p-6 text-center text-white border-4 border-pink-200/80 shadow-2xl" style="background:linear-gradient(160deg,rgba(255,143,190,.92),rgba(214,51,132,.92))">
    <div class="avatar" style="background:#ffe3ef"><img data-anh="lucie" alt="Lucie" class="w-full h-full rounded-full object-cover border-4 border-white"><span class="huy-hieu">🎀</span></div>
    <div class="text-xs md:text-sm tracking-[.3em] mt-3 opacity-90 font-bold">CHỊ GÁI</div>
    <div class="text-3xl md:text-5xl font-extrabold leading-none mt-1 drop-shadow">LUCIE</div>
    <div class="chip bg-white text-pink-600 mt-2 text-sm md:text-base">📘 Lớp 3A6</div>
    <div class="text-xs md:text-sm font-bold mt-1 opacity-95">Trường TH&amp;THCS Chu Văn An</div>
    <ul class="hidden md:block text-left text-base mt-3 space-y-1 font-semibold">
      <li>👗 Váy hồng pastel, nơ xinh</li>
      <li>⏱️ 15 giây cho mỗi câu</li>
      <li>🏆 Một mình chinh phục 99 đối thủ</li>
    </ul>
    <div class="mt-3 rounded-2xl bg-white text-pink-600 font-extrabold py-2 text-lg md:text-xl shadow">Chọn Lucie ➜</div>
  </button>

  <button id="theLucas" class="the-chon pointer-events-auto absolute bottom-3 right-2 w-[48%] md:w-80 md:right-8 lg:right-14 md:bottom-auto md:top-1/2 md:-translate-y-1/3 rounded-[28px] p-4 md:p-6 text-center text-white border-4 border-sky-200/80 shadow-2xl" style="background:linear-gradient(160deg,rgba(96,178,255,.92),rgba(29,95,214,.92))">
    <div class="avatar" style="background:#e0f0ff"><img data-anh="lucas" alt="Lucas" class="w-full h-full rounded-full object-cover border-4 border-white"><span class="huy-hieu">🧢</span></div>
    <div class="text-xs md:text-sm tracking-[.3em] mt-3 opacity-90 font-bold">EM TRAI</div>
    <div class="text-3xl md:text-5xl font-extrabold leading-none mt-1 drop-shadow">LUCAS</div>
    <div class="chip bg-white text-blue-600 mt-2 text-sm md:text-base">📗 Lớp 1A5</div>
    <div class="text-xs md:text-sm font-bold mt-1 opacity-95">Trường TH&amp;THCS Chu Văn An</div>
    <ul class="hidden md:block text-left text-base mt-3 space-y-1 font-semibold">
      <li>👕 Áo xanh, mũ lưỡi trai</li>
      <li>⏱️ 20 giây + đọc to câu hỏi</li>
      <li>🏆 Một mình chinh phục 99 đối thủ</li>
    </ul>
    <div class="mt-3 rounded-2xl bg-white text-blue-600 font-extrabold py-2 text-lg md:text-xl shadow">Chọn Lucas ➜</div>
  </button>
</div>

<!-- HUD -->
<div id="hud" class="an fixed top-3 left-3 right-32 flex flex-wrap gap-2 pointer-events-none" style="z-index:20">
  <div class="chip bg-indigo-600 text-white shadow-lg text-base md:text-lg">❓ <span id="hudCau">Câu 1/10</span></div>
  <div class="chip bg-white/95 text-indigo-900 shadow-lg text-base md:text-lg">👥 Trên sàn: <span id="hudConLai" class="text-emerald-600">100</span>/100</div>
  <div class="chip bg-amber-300 text-amber-900 shadow-lg text-base md:text-lg">🛟 Phao cứu trợ: <span id="hudPhao">1</span></div>
  <div class="chip bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-950 shadow-lg text-base md:text-lg">⭐ Điểm: <span id="hudDiem">0</span></div>
  <div id="hudChuoi" class="an chip bg-orange-500 text-white shadow-lg text-base md:text-lg nhip-dap">🔥 Chuỗi x<span id="hudChuoiSo">2</span></div>
  <div id="hudNhanVat" class="chip bg-pink-500 text-white shadow-lg text-base md:text-lg">⭐ Lucie · Ô 45</div>
</div>

<!-- LÓE SÁNG, CHỮ BAY, TIÊU ĐỀ CÂU HỎI -->
<div id="choiSang" class="fixed inset-0 pointer-events-none" style="z-index:50;opacity:0"></div>
<div id="lopNoi" class="fixed inset-0 pointer-events-none" style="z-index:46"></div>
<div id="bangTieuDeCau" class="an fixed inset-0 flex items-center justify-center pointer-events-none" style="z-index:44">
  <div class="flex flex-col items-center">
    <div id="btdChu" class="chu-vang text-7xl md:text-9xl font-extrabold leading-none">CÂU 1</div>
    <div id="btdPhu" class="mt-3 chip bg-white text-indigo-700 text-xl md:text-2xl shadow-xl"></div>
  </div>
</div>

<!-- THÔNG BÁO NHANH -->
<div id="thongBao" class="an fixed left-1/2 top-[22%] -translate-x-1/2 px-6 py-3 rounded-3xl bg-white text-indigo-900 text-xl md:text-3xl font-extrabold shadow-2xl text-center border-4 border-amber-300 max-w-[92vw]" style="z-index:42"></div>

<!-- BẢNG CÂU HỎI -->
<div id="bangCauHoi" class="an fixed left-0 right-0 bottom-0 p-2 md:p-4" style="z-index:20">
  <div class="max-w-5xl mx-auto rounded-[28px] bg-white/95 shadow-2xl p-4 md:p-6 border-4 border-indigo-200">
    <div class="flex items-center gap-2 md:gap-3 mb-3">
      <div id="nhanCau" class="chip bg-indigo-600 text-white text-base md:text-lg">CÂU 1</div>
      <div id="nhanMon" class="chip text-white text-sm md:text-base">Toán</div>
      <div class="flex-1 h-4 md:h-5 bg-slate-200 rounded-full overflow-hidden"><div id="thanhGio" class="h-full rounded-full" style="width:100%;background:#22c55e"></div></div>
      <div id="soGiay" class="w-12 h-12 md:w-14 md:h-14 rounded-full bg-indigo-950 text-white flex items-center justify-center text-2xl md:text-3xl font-extrabold">15</div>
      <button id="nutDoc" class="chip bg-sky-100 hover:bg-sky-200 text-sky-700 text-sm md:text-base">🔊 Đọc</button>
    </div>
    <div id="noiDungCau" class="text-xl md:text-3xl font-extrabold text-indigo-950 mb-3 md:mb-4 leading-snug"></div>
    <div id="luoiDapAn" class="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 text-lg md:text-2xl"></div>
  </div>
</div>

<!-- BẢNG THỐNG KÊ -->
<div id="bangThongKe" class="an fixed inset-0 items-center justify-center lg:justify-end lg:pr-12 p-3 bg-indigo-950/25" style="z-index:40">
  <div class="hop-hien max-w-xl w-full rounded-[28px] bg-white p-5 md:p-6 shadow-2xl border-4 border-indigo-200 max-h-[94vh] overflow-y-auto">
    <div class="text-center">
      <div id="tkTieuDe" class="text-sm md:text-base tracking-[.25em] text-indigo-500 font-extrabold">KẾT QUẢ CÂU 1</div>
      <div class="mt-2 rounded-2xl bg-emerald-50 border-4 border-emerald-400 p-3">
        <div class="text-xs md:text-sm font-bold text-emerald-600 tracking-widest">✅ ĐÁP ÁN ĐÚNG</div>
        <div id="tkDapAn" class="text-2xl md:text-3xl font-extrabold text-emerald-700"></div>
      </div>
      <div id="tkBanChon" class="mt-2 text-base md:text-lg font-bold text-slate-600"></div>
    </div>
    <div class="grid grid-cols-3 gap-2 md:gap-3 mt-3">
      <div class="o-thong-ke bg-rose-50 border-2 border-rose-200">
        <div class="text-xs md:text-sm font-bold text-rose-500 leading-tight">Số thí sinh bị loại ở câu này</div>
        <div class="so text-rose-600 mt-1"><span id="tkLoaiCau">0</span></div>
        <div class="text-sm font-bold text-rose-400">người</div>
      </div>
      <div class="o-thong-ke bg-slate-50 border-2 border-slate-200">
        <div class="text-xs md:text-sm font-bold text-slate-500 leading-tight">Tổng số thí sinh đã bị loại</div>
        <div class="so text-slate-700 mt-1"><span id="tkTongLoai">0</span><span class="text-lg text-slate-400">/100</span></div>
        <div class="text-sm font-bold text-slate-400">người</div>
      </div>
      <div class="o-thong-ke bg-emerald-50 border-2 border-emerald-200">
        <div class="text-xs md:text-sm font-bold text-emerald-600 leading-tight">Số thí sinh còn lại trên sàn đấu</div>
        <div class="so text-emerald-600 mt-1"><span id="tkConLai">100</span></div>
        <div class="text-sm font-bold text-emerald-500">người</div>
      </div>
    </div>
    <div class="mt-3 space-y-2">
      <div id="tkChinh" class="rounded-2xl px-4 py-3 font-bold text-base md:text-lg"></div>
      <div id="tkDongHanh" class="rounded-2xl px-4 py-3 font-bold text-base md:text-lg"></div>
    </div>
    <div class="mt-4 flex flex-col sm:flex-row gap-3">
      <button id="nutPhao" class="an flex-1 rounded-2xl bg-amber-400 hover:bg-amber-300 text-amber-950 font-extrabold text-xl py-3 shadow-[0_5px_0_#d97706] nhip-dap">🛟 Dùng Phao Cứu Trợ</button>
      <button id="nutTiepTheo" class="flex-1 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xl py-3 shadow-[0_5px_0_#3730a3]">Bước vào câu hỏi tiếp theo ➜</button>
    </div>
  </div>
</div>

<!-- MÀN CHIẾN THẮNG -->
<div id="manThang" class="an fixed inset-0 items-end md:items-center justify-center md:justify-end md:pr-12 p-3 pointer-events-none" style="z-index:41">
  <div class="hop-hien pointer-events-auto max-w-md w-full text-center rounded-[28px] p-5 md:p-7 shadow-2xl border-4 border-amber-300" style="background:linear-gradient(180deg,#fff8db,#ffffff)">
    <div class="relative w-28 h-28 md:w-32 md:h-32 mx-auto"><img id="anhThang" alt="" class="w-full h-full rounded-full object-cover border-4 border-amber-300 shadow-xl"><span class="absolute -right-3 -bottom-1 text-5xl rung-nhe">🔔</span><span class="absolute -left-3 -top-2 text-4xl">👑</span></div>
    <div id="thangTieuDe" class="chu-vang-dam text-3xl md:text-4xl font-extrabold leading-tight mt-1">CHÚC MỪNG LUCIE!</div>
    <p id="thangNoiDung" class="text-lg md:text-xl font-bold text-slate-700 mt-2"></p>
    <div class="grid grid-cols-3 gap-2 mt-4">
      <div class="o-thong-ke bg-emerald-50"><div class="so text-emerald-600" id="thangDung">10</div><div class="text-xs md:text-sm font-bold text-emerald-700">câu trả lời đúng</div></div>
      <div class="o-thong-ke bg-amber-50"><div class="so text-amber-600" id="thangPhao">0</div><div class="text-xs md:text-sm font-bold text-amber-700">phao đã dùng</div></div>
      <div class="o-thong-ke bg-indigo-50"><div class="so text-indigo-600" id="thangDiem">0</div><div class="text-xs md:text-sm font-bold text-indigo-700">⭐ điểm thưởng</div></div>
    </div>
    <button id="nutChoiLaiThang" class="mt-5 w-full rounded-2xl bg-pink-500 hover:bg-pink-400 text-white font-extrabold text-xl py-3 shadow-[0_5px_0_#be185d]">🔄 Chơi lại từ đầu</button>
  </div>
</div>

<!-- MÀN DỪNG BƯỚC -->
<div id="manThua" class="an fixed inset-0 items-center justify-center p-3 bg-indigo-950/40" style="z-index:41">
  <div class="hop-hien max-w-md w-full text-center rounded-[28px] p-6 md:p-7 bg-white shadow-2xl border-4 border-sky-200">
    <div class="relative w-28 h-28 md:w-32 md:h-32 mx-auto"><img id="anhThua" alt="" class="w-full h-full rounded-full object-cover border-4 border-sky-200 shadow-xl"><span class="absolute -right-3 -bottom-1 text-5xl">💪</span></div>
    <div id="thuaTieuDe" class="text-3xl md:text-4xl font-extrabold text-indigo-900 leading-tight mt-1">Lucie giỏi lắm!</div>
    <p id="thuaNoiDung" class="text-lg md:text-xl font-bold text-slate-600 mt-2"></p>
    <div class="grid grid-cols-3 gap-2 mt-4">
      <div class="o-thong-ke bg-emerald-50"><div class="so text-emerald-600" id="thuaDung">0</div><div class="text-sm font-bold text-emerald-700">câu trả lời đúng</div></div>
      <div class="o-thong-ke bg-indigo-50"><div class="so text-indigo-600" id="thuaCau">1</div><div class="text-sm font-bold text-indigo-700">câu đã vượt qua</div></div>
      <div class="o-thong-ke bg-amber-50"><div class="so text-amber-600" id="thuaDiem">0</div><div class="text-sm font-bold text-amber-700">⭐ điểm thưởng</div></div>
    </div>
    <button id="nutChoiLaiThua" class="mt-5 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xl py-3 shadow-[0_5px_0_#3730a3]">🔄 Chơi lại – lần này sẽ rung chuông!</button>
  </div>
</div>

<script>
/* =====================================================================
   RUNG CHUÔNG VÀNG – LUCIE & LUCAS
   Game 3D gameshow kiến thức cho Lucie (lớp 3A6) và Lucas (lớp 1A5) – Trường TH&THCS Chu Văn An
   ===================================================================== */

if (typeof THREE === 'undefined') {
  document.getElementById('manTaiPhu').innerHTML =
    'Không tải được thư viện đồ hoạ 3D.<br>Máy cần kết nối Internet khi mở game. Hãy kiểm tra mạng rồi mở lại file này nhé!';
  throw new Error('Không tải được Three.js');
}


/* ẢNH VÀ KHUÔN MẶT 3D CỦA LUCIE, LUCAS – nhúng sẵn từ game "Lucie và Lucas phiêu lưu" */
const ANH_MAT = { lucie: "data:...BASE64_BO_BOT...", lucas: "data:...BASE64_BO_BOT..." };
const MAT_3D = {"lucie":{"v":[0.0082,-0.2309,-0.1498,0.0146,-0.111,-0.0,0.0122,-0.1369,-0.1225,-0.0198,0.0184,-0.0221,0.0153,-0.0742,0.0233,0.0155,-0.022,0.0194,0.0162,0.1135,-0.0535,-0.2681,0.17,-0.217,0.0146,0.2284,-0.0541,0.0152,0.2861,-0.0284,0.0168,0.5226,-0.0109,0.008,-0.2425,-0.1598,0.0079,-0.2521,-0.1764,0.0066,-0.2599,-0.2016,0.006,-0.2643,-0.206,0.0056,-0.2814,-0.2072,0.0056,-0.3015,-0.2034,0.0046,-0.3218,-0.215,0.0021,-0.3646,-0.2631,0.014,-0.1272,-0.0266,-0.0215,-0.1216,-0.0861,-0.4635,0.3691,-0.3602,-0.1655,0.1249,-0.1818,-0.2063,0.1249,-0.1856,-0.2459,0.1297,-0.1965,-0.2913,0.1575,-0.2282,-0.1315,0.1305,-0.1846,-0.2326,0.2443,-0.1445,-0.1829,0.2371,-0.1433,-0.2758,0.2383,-0.1603,-0.3009,0.2239,-0.1798,-0.3408,0.1348,-0.2559,-0.1441,-0.4196,-0.3352,-0.282,0.1817,-0.2283,-0.4823,0.1851,-0.4351,-0.3946,0.1686,-0.289,-0.2055,-0.0466,-0.1913,-0.0401,-0.2212,-0.1531,-0.0397,-0.2486,-0.1825,-0.0864,-0.2273,-0.1813,-0.1217,-0.229,-0.218,-0.0792,-0.2455,-0.2003,-0.1125,-0.2413,-0.2326,-0.1871,-0.2678,-0.3067,-0.0173,-0.1093,-0.0033,-0.0232,-0.0728,0.0184,-0.3736,0.2591,-0.1771,-0.1112,0.0495,-0.1566,-0.1073,-0.0848,-0.1052,-0.1111,-0.0613,-0.1131,-0.342,-0.0306,-0.243,-0.0218,-0.024,0.0062,-0.2736,0.2899,-0.095,-0.3325,0.282,-0.1303,-0.4153,0.4329,-0.2569,-0.0804,0.2439,-0.0654,-0.14,0.2161,-0.1587,-0.2214,-0.2281,-0.3051,-0.4241,-0.191,-0.6702,-0.0751,-0.1084,-0.1262,-0.0475,-0.1191,-0.1284,-0.1771,-0.2266,-0.3013,-0.1688,-0.2291,-0.2898,-0.3581,0.3121,-0.1416,-0.1089,-0.0976,-0.1335,-0.1915,0.2809,-0.0714,-0.1998,0.3157,-0.0521,-0.2379,0.5091,-0.0706,-0.3874,0.3726,-0.1892,-0.2166,0.4136,-0.0565,-0.4019,0.2833,-0.2063,-0.435,0.3236,-0.2774,-0.0408,-0.236,-0.1635,-0.0826,-0.2367,-0.1898,-0.1169,-0.2341,-0.2224,-0.0675,-0.1148,-0.1375,-0.1726,-0.2278,-0.295,-0.1486,-0.2423,-0.2741,-0.1638,-0.2311,-0.2887,-0.0575,-0.1007,-0.0632,-0.1083,-0.2465,-0.2432,-0.0752,-0.2513,-0.2225,-0.0373,-0.2562,-0.2063,-0.0527,-0.3596,-0.2654,-0.0461,-0.3145,-0.2177,-0.0453,-0.2942,-0.2073,-0.0423,-0.2758,-0.2121,-0.0382,-0.259,-0.2111,-0.1091,-0.2452,-0.2468,-0.1159,-0.2507,-0.2457,-0.1224,-0.2594,-0.2443,-0.1267,-0.2695,-0.2552,-0.1685,-0.1836,-0.2203,-0.4828,0.0198,-0.6678,0.0131,-0.1334,-0.0872,-0.1338,-0.239,-0.2711,-0.1414,-0.2413,-0.2715,-0.0401,-0.1323,-0.1339,-0.0994,-0.1173,-0.1721,-0.0437,-0.1262,-0.1293,-0.1587,0.031,-0.1786,-0.2361,0.0084,-0.1975,-0.1185,-0.0754,-0.142,-0.3427,0.4802,-0.1561,-0.3167,0.4031,-0.118,-0.2901,0.325,-0.0907,-0.1502,-0.3038,-0.2918,-0.0957,0.299,-0.0331,-0.1076,0.4119,-0.0239,-0.1201,0.5221,-0.0224,-0.2748,0.1403,-0.2133,-0.3931,0.1109,-0.2863,-0.1094,0.1386,-0.1874,-0.3448,0.21,-0.2166,-0.081,0.0695,-0.1349,-0.0862,-0.0761,-0.0593,-0.441,0.0899,-0.3421,-0.3637,0.0773,-0.2572,-0.3093,0.0562,-0.2228,-0.2241,0.0566,-0.203,-0.1611,0.069,-0.1894,-0.1158,0.0823,-0.1722,-0.0242,0.107,-0.072,-0.4335,0.0022,-0.3554,-0.3858,0.2186,-0.2317,-0.0048,-0.1253,-0.0288,-0.1047,0.0062,-0.1502,-0.5,0.2071,-0.5742,-0.0813,0.099,-0.1586,-0.1236,-0.0732,-0.1864,-0.3096,0.1828,-0.2374,-0.0881,-0.0479,-0.0691,-0.4606,-0.0834,-0.6797,-0.1095,0.1532,-0.1926,-0.0572,-0.0318,-0.0227,-0.3165,-0.3034,-0.4703,-0.3108,-0.339,-0.5601,-0.4705,0.0078,-0.5106,-0.3758,-0.2464,-0.5073,-0.4621,0.2614,-0.3655,-0.1476,-0.4571,-0.3727,-0.0011,-0.132,-0.0902,-0.1454,-0.0185,-0.1743,-0.4352,0.169,-0.3319,-0.2357,0.1523,-0.1948,-0.2048,0.1465,-0.1849,-0.1538,-0.2474,-0.283,-0.4224,-0.0795,-0.3955,-0.0771,-0.5122,-0.4,-0.1896,-0.441,-0.4683,-0.2422,-0.3976,-0.5086,0.0155,0.4083,-0.0141,-0.001,-0.5226,-0.3892,-0.1723,0.147,-0.182,-0.1411,0.1499,-0.187,-0.1196,0.1509,-0.193,-0.4214,0.2347,-0.271,-0.1452,0.1881,-0.1705,-0.1802,0.2026,-0.1617,-0.214,0.2057,-0.1636,-0.2449,0.2015,-0.1758,-0.2631,0.1941,-0.1917,-0.4896,0.2972,-0.4737,-0.2548,0.161,-0.2068,0.0101,-0.1692,-0.1415,-0.1218,-0.1705,-0.1888,-0.0742,-0.1038,-0.107,-0.0441,-0.1678,-0.1463,0.0155,0.1716,-0.0693,-0.2552,-0.3605,-0.4441,-0.2023,-0.4072,-0.412,-0.0807,-0.4907,-0.3378,-0.3706,-0.2753,-0.6216,-0.1204,0.1669,-0.1827,-0.0512,0.0456,-0.0784,-0.0004,-0.5033,-0.3295,-0.1368,-0.4814,-0.4265,-0.4519,-0.0837,-0.5325,-0.0758,-0.2528,-0.2269,-0.0826,-0.2629,-0.226,-0.0874,-0.2775,-0.224,-0.0905,-0.2959,-0.2344,-0.1064,-0.3368,-0.2746,-0.1402,-0.2351,-0.2618,-0.1458,-0.2313,-0.2614,-0.1501,-0.228,-0.2592,-0.2046,-0.2022,-0.2595,-0.3718,-0.1111,-0.3138,-0.0523,0.0907,-0.106,-0.0784,0.1809,-0.1547,-0.1046,0.1791,-0.1719,-0.1343,-0.2401,-0.2688,-0.366,-0.1985,-0.4079,-0.0355,0.17,-0.0999,-0.1283,-0.378,-0.3071,0.0161,0.0222,-0.0062,-0.0218,0.0594,-0.0415,0.0156,0.0644,-0.0304,-0.0791,-0.0117,-0.0963,-0.0003,-0.4669,-0.2938,0.001,-0.4155,-0.2796,-0.0659,-0.4062,-0.2879,-0.219,-0.2876,-0.3352,-0.1658,-0.0992,-0.205,-0.1762,-0.3382,-0.3251,-0.2795,-0.0895,-0.2219,-0.2135,-0.1346,-0.2263,-0.3134,-0.1461,-0.2752,-0.0778,-0.4558,-0.3037,-0.1013,-0.0276,-0.1338,-0.2484,-0.3198,-0.3831,-0.195,-0.3721,-0.3676,-0.2579,-0.2385,-0.3239,-0.4065,-0.1466,-0.4315,-0.3068,-0.2445,-0.3652,-0.4242,-0.169,-0.5413,-0.2505,-0.1754,-0.2613,-0.0771,0.027,-0.1169,-0.071,-0.0946,-0.0526,-0.0937,-0.0992,-0.1035,-0.0562,-0.0724,-0.0177,-0.1142,0.2224,-0.1325,-0.1859,0.2521,-0.121,-0.2485,0.2601,-0.1255,-0.2983,0.2538,-0.1456,-0.3302,0.2372,-0.1748,-0.3476,0.176,-0.256,-0.482,0.0973,-0.4752,-0.3155,0.1149,-0.239,-0.2747,0.0984,-0.2165,-0.2167,0.0941,-0.2002,-0.1625,0.0991,-0.19,-0.1218,0.1085,-0.1842,-0.0941,0.1179,-0.1782,-0.4941,0.1169,-0.6336,-0.0928,-0.1066,-0.1272,-0.051,0.0062,-0.0563,-0.0433,-0.1,-0.0216,-0.0239,-0.116,-0.0446,-0.0424,-0.1035,-0.0435,-0.0845,-0.1166,-0.1453,-0.0172,-0.1217,-0.0348,-0.013,-0.1273,-0.0885,-0.0957,0.1498,-0.1873,-0.0719,0.1377,-0.1644,-0.0558,0.1256,-0.1381,-0.2737,0.1876,-0.2079,-0.3144,0.2064,-0.2077,0.0498,0.0178,-0.0224,0.287,0.166,-0.2193,0.048,-0.1225,-0.0866,0.4698,0.3606,-0.3657,0.1878,0.1246,-0.183,0.225,0.1235,-0.1871,0.2635,0.1274,-0.1987,0.308,0.1526,-0.2307,0.1557,0.1304,-0.1853,0.2533,0.237,-0.146,0.2066,0.2305,-0.1444,0.2939,0.2311,-0.1627,0.318,0.2175,-0.1825,0.3542,0.1294,-0.2583,0.146,-0.4222,-0.3361,0.3001,0.1772,-0.2306,0.4859,0.1754,-0.4403,0.4073,0.1605,-0.2921,0.2209,-0.0509,-0.1922,0.0555,-0.2212,-0.1532,0.0524,-0.2486,-0.1826,0.0975,-0.2272,-0.1817,0.1308,-0.2298,-0.2183,0.0892,-0.2465,-0.2005,0.121,-0.2416,-0.233,0.1907,-0.2731,-0.3074,0.0453,-0.1099,-0.0036,0.0523,-0.0744,0.0183,0.3888,0.2501,-0.1802,0.1332,0.0474,-0.1574,0.1296,-0.0864,-0.1062,0.1319,-0.0634,-0.114,0.3527,-0.0366,-0.2446,0.0511,-0.024,0.0061,0.2923,0.2786,-0.0957,0.3496,0.2712,-0.1322,0.4273,0.4245,-0.2618,0.1074,0.2377,-0.065,0.1659,0.2122,-0.1595,0.227,-0.2331,-0.3056,0.4272,-0.2005,-0.6735,0.097,-0.1097,-0.1279,0.0708,-0.1198,-0.1292,0.1801,-0.2297,-0.3019,0.172,-0.2321,-0.29,0.3741,0.3003,-0.1443,0.1299,-0.0988,-0.1343,0.2132,0.2706,-0.072,0.2221,0.3047,-0.0529,0.2624,0.5029,-0.0726,0.3995,0.3643,-0.1932,0.2389,0.4071,-0.0585,0.4156,0.2741,-0.2095,0.4436,0.3157,-0.2819,0.0547,-0.2366,-0.1637,0.0935,-0.237,-0.1902,0.1262,-0.2356,-0.2227,0.0899,-0.1154,-0.1383,0.1771,-0.2308,-0.2955,0.1541,-0.2458,-0.2746,0.1682,-0.2342,-0.2889,0.0832,-0.1017,-0.064,0.1159,-0.2467,-0.2436,0.0855,-0.252,-0.2229,0.0493,-0.2568,-0.2066,0.0563,-0.3595,-0.266,0.0551,-0.3157,-0.2179,0.055,-0.2961,-0.2078,0.0534,-0.2764,-0.2122,0.0492,-0.2614,-0.2113,0.117,-0.2475,-0.2473,0.1234,-0.2528,-0.2461,0.1291,-0.2623,-0.2444,0.1337,-0.2721,-0.2552,0.1796,-0.187,-0.2209,0.4822,0.008,-0.6718,0.1407,-0.2415,-0.2716,0.1467,-0.2438,-0.2718,0.0628,-0.1334,-0.1344,0.1181,-0.1191,-0.1725,0.0666,-0.1277,-0.13,0.1775,0.029,-0.1796,0.2512,0.0044,-0.1986,0.1385,-0.0769,-0.1429,0.3614,0.4724,-0.1599,0.3343,0.3952,-0.1208,0.3086,0.3127,-0.0921,0.1539,-0.3073,-0.2923,0.1218,0.291,-0.0333,0.1347,0.4082,-0.0242,0.1499,0.519,-0.0236,0.2922,0.1375,-0.216,0.4029,0.103,-0.2894,0.1366,0.1373,-0.188,0.3607,0.2025,-0.2194,0.1046,0.0679,-0.1356,0.1101,-0.0782,-0.0602,0.4496,0.0822,-0.3463,0.3742,0.071,-0.2598,0.3216,0.0509,-0.2245,0.2409,0.0536,-0.2039,0.181,0.067,-0.19,0.138,0.0817,-0.173,0.0538,0.1066,-0.072,0.4413,-0.0071,-0.3588,0.3994,0.2098,-0.2357,0.0314,-0.1253,-0.029,0.1266,0.0041,-0.151,0.5,0.1963,-0.5785,0.1071,0.0985,-0.1589,0.1431,-0.0751,-0.1863,0.3264,0.1771,-0.2399,0.1121,-0.0497,-0.0699,0.4613,-0.0949,-0.6841,0.1366,0.1518,-0.1934,0.0839,-0.0331,-0.0232,0.3253,-0.3125,-0.4717,0.3167,-0.347,-0.5621,0.4752,-0.0018,-0.5154,0.3851,-0.2563,-0.5097,0.468,0.2526,-0.3709,0.149,-0.4595,-0.3733,0.0274,-0.1317,-0.0903,0.1647,-0.0211,-0.1751,0.4445,0.16,-0.3363,0.2541,0.1518,-0.1965,0.2254,0.1469,-0.1864,0.1596,-0.2492,-0.2834,0.4318,-0.0887,-0.398,0.0754,-0.5142,-0.4002,0.1904,-0.4456,-0.4698,0.2455,-0.4034,-0.5105,0.1937,0.1472,-0.1835,0.1657,0.1494,-0.1876,0.1469,0.1506,-0.1941,0.4338,0.2252,-0.2753,0.1679,0.1857,-0.1721,0.2,0.1992,-0.1631,0.2333,0.2013,-0.1655,0.262,0.1967,-0.1782,0.2811,0.1887,-0.1939,0.4928,0.2881,-0.4791,0.2732,0.1584,-0.2091,0.1363,-0.1728,-0.1894,0.0974,-0.1051,-0.1077,0.0632,-0.169,-0.1467,0.2598,-0.3659,-0.4459,0.2047,-0.4116,-0.4135,0.0801,-0.4931,-0.3383,0.3766,-0.2851,-0.6243,0.1465,0.1659,-0.1838,0.0779,0.0442,-0.0788,0.1361,-0.4847,-0.427,0.4576,-0.0944,-0.5362,0.0865,-0.2546,-0.2271,0.0919,-0.2658,-0.2266,0.0968,-0.2808,-0.224,0.0986,-0.2974,-0.2344,0.1103,-0.3387,-0.2752,0.1466,-0.2378,-0.2629,0.1516,-0.2331,-0.2622,0.1562,-0.2305,-0.2601,0.213,-0.2078,-0.2603,0.3816,-0.119,-0.3165,0.0786,0.0898,-0.1068,0.1063,0.1787,-0.1555,0.1323,0.177,-0.1721,0.1394,-0.2415,-0.2693,0.3761,-0.2081,-0.4105,0.0646,0.1676,-0.0997,0.1313,-0.38,-0.3076,0.0518,0.0586,-0.0417,0.1032,-0.0126,-0.0971,0.0679,-0.4081,-0.2878,0.2255,-0.2936,-0.336,0.1823,-0.1021,-0.2058,0.1806,-0.3408,-0.3256,0.2923,-0.0953,-0.223,0.2277,-0.1387,-0.2272,0.3239,-0.1521,-0.2762,0.079,-0.4575,-0.3042,0.1231,-0.0297,-0.1344,0.2536,-0.3257,-0.3845,0.1994,-0.3754,-0.3685,0.2651,-0.2439,-0.325,0.4163,-0.1557,-0.4345,0.3168,-0.2526,-0.367,0.4325,-0.1795,-0.5447,0.2599,-0.1811,-0.2625,0.1016,0.0258,-0.1175,0.095,-0.0956,-0.0534,0.1153,-0.1012,-0.1044,0.0832,-0.0736,-0.0189,0.1409,0.2174,-0.1335,0.2093,0.2448,-0.1221,0.2685,0.251,-0.1265,0.3161,0.2451,-0.1474,0.3466,0.2301,-0.1771,0.362,0.1688,-0.2589,0.485,0.0872,-0.4802,0.3301,0.1095,-0.2412,0.2894,0.0948,-0.2183,0.2343,0.0918,-0.2015,0.1829,0.0981,-0.1908,0.1458,0.1079,-0.1848,0.1188,0.117,-0.1785,0.4939,0.1055,-0.6383,0.114,-0.1078,-0.1277,0.0786,0.0059,-0.057,0.0704,-0.1008,-0.0219,0.0504,-0.1165,-0.0451,0.0688,-0.105,-0.0439,0.1055,-0.118,-0.146,0.0432,-0.1217,-0.0348,0.0391,-0.1288,-0.0886,0.1228,0.1488,-0.1879,0.0992,0.1367,-0.1644,0.0842,0.1244,-0.1382,0.2917,0.1824,-0.2102,0.3322,0.2001,-0.2104],"uv":[0.507,0.3028,0.5125,0.4052,0.5104,0.383,0.4831,0.5157,0.5131,0.4366,0.5132,0.4812,0.5138,0.5969,0.2709,0.6453,0.5125,0.6951,0.513,0.7444,0.5143,0.9464,0.5069,0.2929,0.5067,0.2846,0.5056,0.278,0.5051,0.2742,0.5048,0.2596,0.5048,0.2424,0.5039,0.2251,0.5018,0.1885,0.512,0.3913,0.4816,0.3961,0.1041,0.8154,0.3586,0.6067,0.3238,0.6067,0.2899,0.6108,0.2511,0.6346,0.3877,0.6115,0.3013,0.7087,0.3437,0.7025,0.2644,0.7036,0.243,0.6912,0.2089,0.6151,0.3769,0.1415,0.2591,0.6553,0.0879,0.6582,0.1629,0.644,0.3245,0.4602,0.4657,0.3111,0.4661,0.2876,0.4262,0.3058,0.396,0.3043,0.4324,0.2902,0.4039,0.2939,0.3402,0.2712,0.4852,0.4066,0.4802,0.4378,0.1809,0.7213,0.405,0.5423,0.4083,0.4275,0.405,0.4476,0.2078,0.4738,0.4814,0.4795,0.2663,0.7476,0.2159,0.7409,0.1452,0.8699,0.4313,0.7084,0.3804,0.6846,0.3109,0.3051,0.1377,0.3368,0.4358,0.4074,0.4594,0.3982,0.3487,0.3064,0.3558,0.3043,0.1941,0.7666,0.407,0.4166,0.3364,0.74,0.3293,0.7697,0.2967,0.935,0.1691,0.8183,0.3149,0.8533,0.1566,0.742,0.1283,0.7765,0.4651,0.2984,0.4295,0.2978,0.4001,0.3,0.4423,0.4019,0.3526,0.3054,0.3731,0.293,0.3601,0.3026,0.4509,0.4139,0.4075,0.2894,0.4357,0.2853,0.4681,0.2811,0.4549,0.1928,0.4606,0.2313,0.4613,0.2486,0.4639,0.2643,0.4674,0.2788,0.4068,0.2905,0.401,0.2858,0.3955,0.2784,0.3918,0.2698,0.3561,0.3432,0.0875,0.5169,0.5112,0.386,0.3857,0.2958,0.3792,0.2939,0.4658,0.3869,0.4151,0.3998,0.4626,0.3922,0.3644,0.5265,0.2983,0.5072,0.3987,0.4356,0.2072,0.9103,0.2294,0.8444,0.2522,0.7776,0.3717,0.2404,0.4182,0.7554,0.408,0.8519,0.3974,0.9461,0.2653,0.6198,0.1642,0.5947,0.4065,0.6184,0.2055,0.6794,0.4308,0.5594,0.4263,0.4349,0.1232,0.5768,0.1893,0.5661,0.2358,0.548,0.3085,0.5483,0.3624,0.5589,0.4011,0.5703,0.4793,0.5914,0.1297,0.5019,0.1704,0.6867,0.4959,0.393,0.4105,0.5053,0.0728,0.6769,0.4306,0.5845,0.3944,0.4375,0.2355,0.6562,0.4247,0.4591,0.1065,0.4287,0.4064,0.6309,0.4512,0.4728,0.2296,0.2408,0.2345,0.2104,0.0981,0.5067,0.179,0.2895,0.1053,0.7233,0.3739,0.1095,0.499,0.3872,0.3758,0.4842,0.1282,0.6444,0.2986,0.6301,0.325,0.6251,0.3686,0.2886,0.1391,0.4321,0.4341,0.0624,0.338,0.1233,0.2931,0.1603,0.5133,0.8488,0.4992,0.0536,0.3528,0.6256,0.3794,0.6281,0.3978,0.6289,0.14,0.7005,0.3759,0.6607,0.3461,0.6731,0.3172,0.6757,0.2908,0.6721,0.2753,0.6658,0.0817,0.7539,0.2824,0.6375,0.5086,0.3555,0.3959,0.3544,0.4366,0.4113,0.4623,0.3567,0.5132,0.6466,0.282,0.1921,0.3272,0.1521,0.431,0.0808,0.1834,0.2648,0.3971,0.6426,0.4562,0.539,0.4997,0.07,0.3831,0.0887,0.1139,0.4285,0.4353,0.2841,0.4294,0.2754,0.4253,0.263,0.4227,0.2472,0.4091,0.2123,0.3802,0.2992,0.3755,0.3024,0.3718,0.3052,0.3252,0.3272,0.1824,0.4051,0.4553,0.5775,0.4331,0.6545,0.4106,0.653,0.3852,0.2949,0.1873,0.3304,0.4697,0.6452,0.3904,0.1771,0.5138,0.519,0.4813,0.5507,0.5133,0.555,0.4324,0.49,0.4998,0.1012,0.5009,0.1451,0.4437,0.153,0.3129,0.2543,0.3583,0.4152,0.3495,0.2111,0.2612,0.4235,0.3176,0.385,0.2323,0.3752,0.4335,0.1106,0.4135,0.4764,0.2878,0.2268,0.3334,0.1821,0.2797,0.2962,0.1527,0.3747,0.2379,0.2911,0.1376,0.3556,0.286,0.3501,0.4342,0.5231,0.4394,0.4192,0.4199,0.4153,0.452,0.4381,0.4024,0.69,0.3412,0.7154,0.2877,0.7222,0.2451,0.7168,0.2179,0.7027,0.203,0.6504,0.0882,0.5831,0.2305,0.5981,0.2653,0.5841,0.3149,0.5804,0.3612,0.5846,0.3959,0.5927,0.4196,0.6007,0.0779,0.5998,0.4207,0.409,0.4565,0.5053,0.463,0.4146,0.4796,0.4009,0.4637,0.4116,0.4278,0.4004,0.4853,0.3961,0.4889,0.3912,0.4183,0.628,0.4385,0.6176,0.4523,0.6073,0.2662,0.6603,0.2314,0.6763,0.5425,0.5152,0.7452,0.6418,0.541,0.3954,0.9013,0.8081,0.6604,0.6064,0.6922,0.6055,0.7252,0.6088,0.7631,0.6303,0.633,0.6114,0.7164,0.7025,0.6765,0.6969,0.7511,0.6974,0.7717,0.6858,0.8026,0.6105,0.6247,0.1393,0.7564,0.6514,0.9151,0.6498,0.8479,0.6371,0.6887,0.4565,0.5474,0.311,0.5447,0.2876,0.5833,0.3059,0.6117,0.3037,0.5762,0.2894,0.6033,0.2936,0.663,0.2667,0.5387,0.4061,0.5447,0.4364,0.8322,0.7136,0.6138,0.5405,0.6107,0.4262,0.6127,0.4458,0.8014,0.4687,0.5436,0.4795,0.7497,0.7381,0.7987,0.7316,0.8651,0.8627,0.5917,0.703,0.6417,0.6813,0.6939,0.3008,0.865,0.3287,0.5829,0.4063,0.5605,0.3977,0.6538,0.3037,0.647,0.3017,0.8196,0.7566,0.6109,0.4156,0.6821,0.7312,0.6897,0.7603,0.7242,0.9296,0.8413,0.8112,0.7041,0.8478,0.8551,0.7341,0.8789,0.7697,0.5467,0.2978,0.5799,0.2976,0.6078,0.2987,0.5768,0.4014,0.6513,0.3028,0.6317,0.29,0.6437,0.2999,0.5711,0.4131,0.599,0.2893,0.573,0.2847,0.5421,0.2806,0.5481,0.1929,0.5471,0.2303,0.547,0.2471,0.5456,0.2638,0.542,0.2767,0.6,0.2885,0.6054,0.284,0.6103,0.2759,0.6142,0.2676,0.6535,0.3403,0.912,0.5068,0.6202,0.2937,0.6253,0.2917,0.5537,0.386,0.6009,0.3983,0.5569,0.3909,0.6517,0.5248,0.7146,0.5037,0.6183,0.4343,0.8088,0.9036,0.7856,0.8376,0.7636,0.7671,0.6315,0.2375,0.6041,0.7486,0.6151,0.8487,0.6281,0.9434,0.7496,0.6175,0.8442,0.588,0.6167,0.6173,0.8081,0.673,0.5894,0.558,0.594,0.4332,0.8841,0.5702,0.8197,0.5606,0.7747,0.5435,0.7058,0.5458,0.6546,0.5572,0.6179,0.5698,0.546,0.5911,0.877,0.494,0.8412,0.6792,0.5269,0.393,0.6082,0.5035,0.9272,0.6677,0.5915,0.5842,0.6223,0.4358,0.7789,0.6513,0.5957,0.4576,0.8941,0.419,0.6167,0.6297,0.5716,0.4717,0.7779,0.2331,0.7706,0.2035,0.906,0.4985,0.829,0.2811,0.8998,0.7158,0.6273,0.1074,0.5234,0.3875,0.6407,0.482,0.8797,0.6367,0.7171,0.6297,0.6926,0.6255,0.6363,0.2871,0.8689,0.4242,0.5644,0.0607,0.6627,0.1193,0.7097,0.1554,0.6655,0.6258,0.6416,0.6276,0.6255,0.6286,0.8706,0.6924,0.6435,0.6587,0.6709,0.6701,0.6993,0.6719,0.7238,0.6681,0.7402,0.6612,0.921,0.7462,0.7334,0.6353,0.6164,0.3523,0.5832,0.4102,0.554,0.3557,0.722,0.1874,0.6749,0.1483,0.5684,0.0787,0.8218,0.2565,0.6251,0.6417,0.5666,0.5378,0.6163,0.086,0.891,0.4193,0.5739,0.2825,0.5785,0.2729,0.5827,0.2601,0.5843,0.2459,0.5942,0.2106,0.6253,0.2968,0.6295,0.3008,0.6335,0.3031,0.6819,0.3225,0.826,0.3984,0.5672,0.5767,0.5908,0.6527,0.613,0.6512,0.6191,0.2937,0.8213,0.3222,0.5552,0.6432,0.6122,0.1753,0.5443,0.5501,0.5881,0.4892,0.558,0.1513,0.6926,0.2491,0.6558,0.4128,0.6543,0.2088,0.7497,0.4186,0.6945,0.3815,0.7767,0.37,0.5675,0.1091,0.6051,0.4747,0.7167,0.2217,0.6704,0.1793,0.7265,0.2916,0.8556,0.367,0.7707,0.2842,0.8695,0.3466,0.722,0.3453,0.5868,0.5221,0.5812,0.4183,0.5985,0.4135,0.5711,0.4371,0.6204,0.6857,0.6788,0.7091,0.7294,0.7144,0.77,0.7094,0.7961,0.6966,0.8092,0.6442,0.9144,0.5745,0.782,0.5935,0.7473,0.581,0.7001,0.5784,0.6563,0.5838,0.6245,0.5922,0.6015,0.6,0.9219,0.5901,0.5974,0.4079,0.5671,0.505,0.5602,0.4139,0.543,0.4005,0.5588,0.4103,0.5901,0.3992,0.5369,0.396,0.5334,0.39,0.6049,0.6271,0.5847,0.6168,0.5719,0.6062,0.7492,0.6558,0.7838,0.6709],"i":[251,298,284,71,162,21,162,139,127,71,139,162,139,71,70,104,54,103,333,332,284,298,333,284,332,333,297,333,299,297,299,333,334,389,301,251,301,298,251,299,338,297,296,299,334,148,175,152,447,323,345,454,447,345,447,454,323,347,280,330,361,366,323,156,124,143,156,139,70,105,69,66,69,105,104,71,63,70,105,63,104,111,31,117,226,124,113,93,137,132,301,293,298,333,293,334,293,333,298,9,285,8,9,107,151,285,417,8,296,337,299,337,338,299,10,337,151,338,337,10,454,264,356,372,454,345,340,372,345,372,340,265,372,264,454,263,466,260,175,377,152,200,199,208,280,376,411,350,277,343,253,450,451,55,9,8,9,55,107,347,449,448,139,34,127,156,34,139,34,156,143,67,104,103,67,69,104,69,67,109,108,107,66,69,108,66,108,69,109,107,108,151,108,10,151,108,109,10,52,105,66,68,63,71,54,68,21,68,71,21,104,68,54,63,68,104,53,63,105,52,53,105,31,228,117,111,35,31,35,226,31,35,111,143,124,35,143,226,35,124,236,134,198,51,236,3,134,236,51,136,135,210,135,212,210,172,135,136,137,123,132,293,283,334,300,293,301,399,412,343,417,168,8,336,337,296,9,336,285,336,9,151,337,336,151,282,296,334,282,443,296,283,282,334,443,295,296,295,336,296,258,386,385,347,346,280,346,340,345,346,347,448,170,32,149,170,211,32,211,194,32,171,176,208,176,171,148,199,171,208,171,175,148,171,199,175,140,32,208,176,140,208,32,140,149,140,176,149,428,199,200,288,397,367,288,435,361,435,433,361,376,433,411,288,433,435,329,348,330,449,348,450,348,347,330,348,449,347,349,329,277,350,349,277,349,350,451,349,348,329,450,349,451,348,349,450,365,379,394,430,365,394,433,416,411,416,288,367,416,433,288,253,254,450,254,449,450,124,46,113,46,156,70,156,46,124,63,46,70,53,46,63,224,52,29,224,53,52,30,224,29,111,116,143,116,111,117,123,116,117,227,116,93,116,137,93,116,123,137,234,34,143,116,234,143,234,116,227,34,234,127,234,227,93,228,118,117,118,228,229,118,229,119,25,228,31,229,230,119,212,202,210,215,58,132,172,58,138,135,214,212,214,172,138,214,135,172,213,147,187,276,283,293,300,276,293,368,301,389,368,300,301,368,389,356,419,412,399,419,399,248,195,419,248,419,195,197,193,55,8,168,193,8,6,168,417,6,193,168,413,417,285,336,441,285,441,413,285,413,441,414,444,282,283,257,295,443,257,386,258,346,352,280,352,376,280,352,346,345,323,352,345,366,352,323,211,169,210,169,136,210,204,194,211,204,211,210,202,204,210,201,200,208,32,201,208,194,201,32,400,369,378,400,428,369,428,396,199,396,377,175,199,396,175,396,400,377,400,396,428,433,401,361,401,433,376,352,401,376,401,366,361,401,352,366,252,253,451,252,380,253,256,252,451,380,384,385,441,384,414,273,287,422,365,364,397,430,364,365,373,254,253,46,225,113,225,46,53,224,225,53,225,224,30,147,50,187,50,147,123,50,123,117,118,50,117,247,226,113,225,247,113,247,225,30,33,247,30,226,130,31,130,25,31,247,130,226,130,33,25,33,130,247,24,230,229,57,186,61,57,202,212,214,216,212,216,214,207,216,57,212,57,216,186,186,216,206,43,146,106,204,43,106,43,204,202,43,57,61,57,43,202,177,215,132,177,213,215,177,147,213,123,177,132,147,177,123,192,214,138,214,192,207,58,192,138,207,192,187,192,213,187,213,192,215,192,58,215,276,445,283,444,445,260,445,444,283,383,276,300,368,383,300,372,383,264,264,383,356,383,368,356,193,189,55,351,6,417,419,351,412,351,419,197,6,351,197,413,464,417,350,452,451,452,256,451,286,258,385,384,286,385,286,384,441,282,259,443,444,259,282,259,444,260,259,257,443,442,257,258,257,442,295,286,442,258,295,442,336,442,441,336,442,286,441,261,359,446,261,346,448,346,261,340,340,261,265,261,446,265,170,150,211,150,169,211,150,170,149,169,150,136,83,201,194,18,83,17,201,83,200,83,18,200,431,430,394,379,431,394,381,384,380,252,381,380,381,252,256,52,223,29,223,27,29,223,52,66,107,65,66,222,65,107,65,223,66,65,222,27,223,65,27,5,4,51,4,5,281,5,51,3,195,5,3,5,195,248,281,5,248,275,4,281,45,134,51,4,45,51,277,437,343,437,399,343,456,281,248,456,437,420,399,456,248,437,456,399,45,220,134,146,91,106,91,181,106,186,92,61,92,186,206,78,77,146,77,78,185,416,427,411,425,427,436,280,425,330,425,266,330,425,280,411,427,425,411,287,410,436,322,391,423,432,287,436,287,432,422,432,430,422,432,364,430,387,373,386,257,387,386,259,387,257,263,249,466,373,374,386,386,374,385,374,380,385,380,374,253,374,373,253,216,205,206,205,216,207,205,207,187,50,205,187,110,24,229,228,110,229,25,110,228,27,160,29,160,27,159,342,445,276,189,221,55,55,221,107,221,222,107,351,465,412,465,351,417,464,465,417,463,413,414,463,464,413,421,428,200,182,83,194,181,182,106,182,204,106,204,182,194,424,273,422,430,424,422,431,424,430,395,379,378,395,431,379,424,418,406,418,424,431,384,398,414,381,398,384,237,220,45,355,437,277,437,355,420,329,355,277,371,355,329,371,329,330,266,371,330,209,49,142,49,129,142,129,203,142,203,92,206,88,89,42,89,88,80,43,62,146,62,78,146,62,92,185,78,62,185,96,91,146,77,96,146,426,425,436,426,322,423,266,426,423,425,426,266,410,426,436,426,410,322,86,180,179,91,180,181,179,180,80,180,89,80,83,84,17,84,182,181,182,84,83,273,291,287,291,410,287,410,291,322,391,327,423,427,434,436,434,432,436,434,427,416,434,416,367,432,434,364,397,434,367,364,434,397,387,390,373,373,390,254,255,261,448,261,255,359,359,255,263,255,249,263,101,205,50,101,118,119,101,50,118,110,163,24,359,467,446,467,342,446,467,263,260,467,359,263,445,467,260,342,467,445,383,353,276,353,342,276,353,372,265,353,383,372,446,353,265,342,353,446,221,56,222,157,56,221,190,221,189,190,157,221,24,23,230,244,189,193,217,236,198,196,195,3,195,196,197,465,357,412,357,350,343,412,357,343,315,15,316,18,313,200,313,421,200,313,18,17,314,313,17,313,314,406,418,313,406,313,418,421,335,424,406,335,321,273,424,335,273,395,262,431,262,418,431,262,395,378,369,262,378,428,262,369,421,262,428,418,262,421,362,463,414,398,362,414,220,79,218,237,79,220,44,45,4,44,237,45,363,275,281,363,440,275,363,360,440,360,363,420,456,363,281,363,456,420,131,49,209,134,131,198,131,209,198,220,131,134,203,165,92,98,165,203,92,165,185,165,40,185,183,40,95,183,96,77,40,74,95,74,89,95,89,74,42,88,73,80,92,76,61,62,76,92,76,43,61,76,62,43,96,90,91,90,180,91,180,90,89,72,37,0,72,73,37,87,15,86,15,85,86,85,84,181,180,85,181,85,180,86,269,391,270,327,294,423,388,390,387,390,388,249,249,388,466,388,387,259,466,388,260,388,259,260,339,390,249,255,339,249,390,339,254,254,339,449,449,339,448,339,255,448,101,36,205,205,36,206,36,203,206,203,36,142,163,161,160,160,161,29,161,30,29,7,110,25,7,163,110,33,7,25,7,161,163,56,28,222,27,28,159,222,28,27,163,144,24,144,23,24,144,160,159,144,163,160,23,153,22,245,244,193,243,190,189,244,243,189,209,126,198,126,217,198,126,209,142,114,121,128,114,174,217,217,174,236,236,174,3,174,196,3,453,452,350,357,453,350,463,453,464,453,465,464,453,357,465,15,317,316,315,16,15,16,85,15,16,314,17,16,315,314,84,16,17,85,16,84,314,405,406,315,405,314,405,335,406,335,405,321,164,267,0,37,164,0,167,164,37,382,381,256,382,398,381,382,362,398,429,371,279,360,429,279,371,429,355,355,429,420,429,360,420,49,102,129,48,102,49,131,115,49,115,48,49,115,220,218,115,131,220,240,59,75,167,240,75,240,165,98,165,240,167,166,79,75,59,166,75,79,166,218,40,184,185,183,184,40,184,77,185,184,183,77,39,165,167,39,167,37,73,39,37,165,39,40,39,74,40,74,39,42,39,88,42,39,73,88,191,90,96,191,183,95,183,191,96,89,191,95,90,191,89,87,38,82,269,303,267,304,269,270,321,375,273,294,358,423,371,358,279,358,266,423,358,371,266,440,457,275,269,393,391,393,269,267,164,393,267,246,7,33,7,246,161,246,33,30,161,246,30,153,158,157,28,158,159,158,56,157,158,28,56,144,145,23,145,153,23,145,144,159,158,145,159,145,158,153,245,188,128,188,114,128,188,174,114,174,188,196,233,243,244,233,245,128,245,233,244,121,233,128,154,153,157,153,154,22,230,120,119,452,341,256,453,341,452,341,382,256,382,341,362,362,341,463,341,453,463,14,317,15,87,14,15,14,87,82,303,302,267,302,303,271,267,302,0,317,402,316,402,403,316,403,402,271,404,405,315,404,315,316,403,404,316,405,404,321,404,320,321,320,404,403,370,164,2,393,370,462,370,393,164,97,167,75,97,242,167,240,235,59,235,166,59,235,240,98,81,38,87,38,81,72,310,303,269,303,310,271,310,403,271,403,310,318,310,272,318,304,272,269,272,310,269,391,409,270,409,391,322,439,278,294,460,327,391,393,460,391,326,393,462,326,460,393,122,188,245,6,122,193,122,245,193,188,122,196,122,6,197,196,122,197,232,233,121,47,120,121,126,47,217,47,114,217,47,121,114,317,13,12,14,13,317,12,13,82,13,14,82,302,11,0,11,72,0,11,38,72,11,12,82,38,11,82,268,11,302,319,403,318,319,320,403,272,319,318,354,461,462,370,354,462,125,141,242,164,141,2,141,164,167,242,141,167,79,60,75,97,20,242,64,235,98,64,98,203,64,102,48,64,203,129,102,64,129,166,219,218,235,219,166,219,115,218,115,219,48,219,64,48,64,219,235,178,87,86,178,81,87,178,86,179,72,41,73,81,41,72,178,41,81,41,178,179,41,179,80,73,41,80,415,272,304,415,304,270,415,319,272,319,415,320,307,308,375,308,307,409,307,375,321,331,358,294,278,331,294,358,331,279,331,278,279,309,457,440,438,309,440,457,309,459,344,438,440,360,344,440,344,278,439,438,344,439,344,360,279,278,344,279,392,438,439,392,309,438,290,458,459,309,290,459,290,309,305,250,461,458,461,250,462,250,326,462,243,133,190,155,26,154,154,26,22,120,231,121,231,232,121,231,120,230,26,231,22,231,26,232,23,231,230,231,23,22,47,100,120,100,126,142,100,47,126,36,100,142,100,36,101,100,101,119,120,100,119,311,268,302,311,302,271,402,311,271,311,402,317,11,312,12,268,312,11,312,317,12,312,311,317,311,312,268,1,44,4,1,125,44,99,97,75,60,99,75,99,20,97,239,79,237,239,60,79,44,239,237,20,241,242,125,241,44,241,125,242,308,306,375,306,291,273,375,306,273,291,306,322,407,415,270,415,407,324,455,392,439,460,455,327,455,294,327,455,439,294,289,460,305,309,289,305,392,289,309,289,455,460,455,289,392,290,328,458,328,250,458,250,328,326,328,290,305,460,328,305,326,328,460,133,173,190,173,133,155,190,173,157,173,154,157,173,155,154,133,112,155,112,26,155,233,112,243,112,133,243,232,112,233,26,112,232,354,274,461,1,274,354,461,274,458,458,274,459,275,274,4,274,1,4,274,457,459,457,274,275,94,370,2,141,94,2,19,354,370,19,1,354,94,19,370,1,19,125,19,141,125,19,94,141,238,239,44,241,238,44,238,241,20,239,238,60,238,99,60,99,238,20,292,308,409,292,306,308,292,409,322,306,292,322,407,325,324,325,407,307,325,415,324,415,325,320,320,325,321,325,307,321,307,408,409,407,408,307,409,408,270,408,407,270],"tex":"data:...BASE64_BO_BOT...","skin":"#dfafab","ring":[10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109],"hgt":1.045},"lucas":{"v":[-0.0659,-0.1613,-0.1128,-0.0521,-0.0492,-0.0,-0.0561,-0.0872,-0.1096,-0.0651,0.0888,-0.066,-0.0457,-0.0071,0.0135,-0.0367,0.0451,-0.0059,-0.013,0.1701,-0.1312,-0.2979,0.2559,-0.3187,0.0055,0.2756,-0.1677,0.0151,0.3298,-0.1629,0.0483,0.5221,-0.2159,-0.0676,-0.1732,-0.1177,-0.0687,-0.1839,-0.13,-0.0701,-0.1913,-0.1474,-0.079,-0.2771,-0.1804,-0.0814,-0.2908,-0.1723,-0.0839,-0.3098,-0.1638,-0.0872,-0.3287,-0.1735,-0.0973,-0.3752,-0.2138,-0.0553,-0.0722,-0.0215,-0.0928,-0.0648,-0.0824,-0.4232,0.4223,-0.5364,-0.1902,0.209,-0.2688,-0.2283,0.215,-0.2735,-0.2683,0.2193,-0.2869,-0.3217,0.2421,-0.3251,-0.1592,0.2037,-0.2724,-0.2425,0.315,-0.2596,-0.1948,0.3002,-0.2586,-0.2886,0.3165,-0.2748,-0.3188,0.3059,-0.293,-0.3612,0.222,-0.3457,-0.2732,-0.3879,-0.2718,-0.3141,0.2614,-0.334,-0.4654,0.2539,-0.5448,-0.4031,0.2547,-0.3926,-0.2605,0.037,-0.2173,-0.1251,-0.1438,-0.1208,-0.1251,-0.1725,-0.1394,-0.183,-0.1433,-0.1517,-0.2222,-0.1496,-0.1949,-0.1708,-0.1661,-0.1633,-0.2055,-0.1669,-0.2026,-0.292,-0.2234,-0.2802,-0.0867,-0.0427,-0.0048,-0.0852,0.0004,0.0068,-0.3692,0.3475,-0.3091,-0.1512,0.116,-0.213,-0.1753,-0.0067,-0.1161,-0.175,0.0162,-0.1304,-0.3875,0.0686,-0.2777,-0.0748,0.0484,-0.0215,-0.2693,0.3682,-0.2309,-0.3274,0.3671,-0.2671,-0.3734,0.4835,-0.4533,-0.0899,0.298,-0.1845,-0.1558,0.2739,-0.2694,-0.3154,-0.166,-0.2848,-0.4976,-0.1464,-0.6416,-0.1469,-0.0384,-0.1307,-0.1184,-0.0564,-0.1244,-0.2636,-0.1758,-0.2823,-0.2507,-0.1782,-0.2709,-0.3435,0.396,-0.2905,-0.1798,-0.022,-0.1396,-0.193,0.349,-0.2026,-0.1948,0.3848,-0.1949,-0.1982,0.5441,-0.2822,-0.3573,0.4415,-0.3622,-0.1905,0.4676,-0.2368,-0.3876,0.3699,-0.3471,-0.4052,0.3945,-0.4383,-0.1266,-0.1585,-0.126,-0.177,-0.1554,-0.1563,-0.214,-0.1576,-0.1954,-0.139,-0.0468,-0.1394,-0.2569,-0.177,-0.2761,-0.2425,-0.2096,-0.2552,-0.2453,-0.1799,-0.27,-0.129,-0.0342,-0.0705,-0.1974,-0.1718,-0.2079,-0.1638,-0.1723,-0.1788,-0.1215,-0.1799,-0.1564,-0.1651,-0.3576,-0.219,-0.1476,-0.3114,-0.1805,-0.1431,-0.2922,-0.1739,-0.1371,-0.2759,-0.183,-0.1299,-0.2633,-0.1898,-0.2013,-0.2287,-0.2329,-0.2103,-0.2319,-0.2269,-0.2215,-0.2393,-0.2223,-0.2304,-0.2485,-0.2311,-0.2575,-0.1068,-0.2082,-0.4957,0.0739,-0.7119,-0.0564,-0.0828,-0.0788,-0.2221,-0.21,-0.2576,-0.2322,-0.2095,-0.254,-0.1123,-0.0721,-0.1229,-0.1711,-0.0455,-0.1705,-0.1153,-0.065,-0.1224,-0.2002,0.1048,-0.2283,-0.278,0.0951,-0.2417,-0.1862,0.0005,-0.155,-0.3015,0.5257,-0.3632,-0.2884,0.4671,-0.2962,-0.2789,0.4029,-0.2405,-0.2655,-0.2722,-0.2602,-0.095,0.3522,-0.1701,-0.0867,0.4509,-0.2015,-0.0849,0.5414,-0.2316,-0.3015,0.2294,-0.3067,-0.4074,0.2032,-0.3702,-0.1391,0.2046,-0.2782,-0.3591,0.295,-0.3317,-0.1177,0.1329,-0.1968,-0.1511,0.0002,-0.0727,-0.4526,0.177,-0.4176,-0.3874,0.1737,-0.3288,-0.3408,0.1512,-0.2861,-0.2584,0.1416,-0.2636,-0.1949,0.1442,-0.2523,-0.15,0.1496,-0.24,-0.0552,0.1685,-0.15,-0.4647,0.095,-0.4026,-0.3884,0.3054,-0.3536,-0.0757,-0.0669,-0.0249,-0.1541,0.0758,-0.1908,-0.4764,0.2579,-0.6882,-0.1151,0.161,-0.2335,-0.1911,0.0009,-0.2002,-0.339,0.2643,-0.3425,-0.1472,0.0279,-0.0903,-0.5,-0.0301,-0.6878,-0.1399,0.2164,-0.2909,-0.1118,0.0426,-0.0479,-0.4373,-0.2566,-0.4247,-0.4427,-0.3118,-0.4934,-0.4918,0.0833,-0.558,-0.4784,-0.1932,-0.4727,-0.4366,0.331,-0.5044,-0.2867,-0.4316,-0.2926,-0.0721,-0.079,-0.082,-0.1984,0.0562,-0.2069,-0.4336,0.2536,-0.4364,-0.2573,0.248,-0.2912,-0.2251,0.2425,-0.2795,-0.2512,-0.2138,-0.2618,-0.4754,0.0089,-0.4139,-0.2159,-0.5087,-0.2976,-0.3386,-0.4224,-0.3859,-0.3884,-0.3754,-0.4344,0.0317,0.429,-0.1867,-0.1239,-0.5355,-0.2822,-0.1953,0.2362,-0.2763,-0.1676,0.2276,-0.2817,-0.1488,0.2198,-0.2904,-0.4126,0.3183,-0.3989,-0.1701,0.2395,-0.277,-0.2008,0.2535,-0.2706,-0.2324,0.2617,-0.274,-0.2651,0.2652,-0.2855,-0.2877,0.2643,-0.2997,-0.4547,0.3495,-0.6226,-0.2804,0.252,-0.3058,-0.0597,-0.1146,-0.1215,-0.2072,-0.0949,-0.1755,-0.1455,-0.0333,-0.1149,-0.1214,-0.1019,-0.129,-0.0036,0.2211,-0.166,-0.3881,-0.3208,-0.3871,-0.3409,-0.375,-0.3426,-0.2134,-0.4782,-0.2483,-0.4778,-0.2422,-0.5685,-0.1497,0.2248,-0.2854,-0.0919,0.1134,-0.134,-0.1199,-0.5076,-0.2353,-0.2837,-0.4678,-0.3343,-0.4985,-0.0124,-0.5481,-0.1701,-0.2475,-0.2095,-0.1793,-0.2539,-0.2033,-0.1885,-0.2671,-0.1981,-0.196,-0.2841,-0.2058,-0.2249,-0.32,-0.2366,-0.2317,-0.1708,-0.239,-0.2405,-0.166,-0.2407,-0.2478,-0.1607,-0.2404,-0.2942,-0.1293,-0.248,-0.433,-0.0179,-0.3251,-0.0858,0.1528,-0.1763,-0.101,0.2363,-0.2579,-0.1284,0.237,-0.2775,-0.224,-0.1745,-0.2421,-0.4545,-0.1249,-0.3931,-0.0602,0.2247,-0.1983,-0.251,-0.3505,-0.2571,-0.0286,0.0877,-0.0496,-0.0602,0.1266,-0.104,-0.0218,0.1266,-0.0926,-0.1306,0.0601,-0.1317,-0.1136,-0.4649,-0.2162,-0.1049,-0.4168,-0.217,-0.183,-0.3933,-0.2289,-0.3274,-0.235,-0.3036,-0.2347,-0.0224,-0.2151,-0.2964,-0.2978,-0.2838,-0.3387,0.0026,-0.2381,-0.2853,-0.0536,-0.2301,-0.3822,-0.0564,-0.278,-0.2023,-0.4376,-0.2305,-0.158,0.0448,-0.1627,-0.3675,-0.2677,-0.341,-0.3231,-0.3309,-0.3124,-0.3523,-0.17,-0.3027,-0.4806,-0.0678,-0.4287,-0.4082,-0.1762,-0.3427,-0.4985,-0.1067,-0.5281,-0.3272,-0.0942,-0.2571,-0.1217,0.0946,-0.1646,-0.1406,-0.0229,-0.0624,-0.1643,-0.024,-0.1096,-0.1199,0.0019,-0.0316,-0.1291,0.2796,-0.2487,-0.1935,0.3186,-0.2443,-0.2537,0.336,-0.2492,-0.305,0.3367,-0.2688,-0.3406,0.3234,-0.2968,-0.3671,0.2595,-0.3602,-0.4823,0.1704,-0.5538,-0.341,0.2042,-0.3223,-0.3,0.1869,-0.2948,-0.2438,0.1794,-0.275,-0.1911,0.1769,-0.2649,-0.152,0.1773,-0.2623,-0.1246,0.1806,-0.2587,-0.487,0.168,-0.7149,-0.1647,-0.0332,-0.1312,-0.0986,0.0779,-0.0968,-0.1137,-0.0318,-0.0274,-0.0955,-0.057,-0.0431,-0.1142,-0.04,-0.0483,-0.1566,-0.0461,-0.1453,-0.0889,-0.0621,-0.0314,-0.0844,-0.0721,-0.0825,-0.1246,0.211,-0.2825,-0.101,0.196,-0.2534,-0.0868,0.1835,-0.2203,-0.3028,0.2627,-0.3146,-0.3376,0.289,-0.3182,0.0061,0.0762,-0.0625,0.2864,0.1465,-0.2941,-0.0144,-0.0781,-0.0799,0.4903,0.259,-0.4985,0.1751,0.1395,-0.2527,0.2113,0.1318,-0.2543,0.2509,0.1228,-0.2649,0.3066,0.1246,-0.299,0.1434,0.1462,-0.2598,0.2609,0.226,-0.2389,0.2108,0.2294,-0.2424,0.3044,0.2094,-0.2513,0.3294,0.1874,-0.2677,0.3439,0.0921,-0.318,0.0642,-0.4502,-0.2609,0.3036,0.1467,-0.3081,0.4732,0.0833,-0.5067,0.4006,0.1068,-0.3615,0.1836,-0.0431,-0.2012,-0.0037,-0.1639,-0.1164,-0.0115,-0.191,-0.1354,0.0531,-0.1831,-0.1431,0.0914,-0.2026,-0.1833,0.0351,-0.2012,-0.1556,0.0707,-0.2126,-0.1926,0.1365,-0.2989,-0.2657,-0.0173,-0.0547,-0.0026,-0.0058,-0.0146,0.0096,0.3972,0.2103,-0.2797,0.1048,0.0698,-0.2024,0.0857,-0.0516,-0.1062,0.0926,-0.0306,-0.12,0.3186,-0.0587,-0.2517,0.0004,0.0357,-0.0181,0.3057,0.2719,-0.2113,0.3619,0.2468,-0.2421,0.4588,0.3367,-0.4192,0.1066,0.2669,-0.1784,0.1654,0.2181,-0.256,0.1776,-0.251,-0.2675,0.3824,-0.3077,-0.6068,0.0476,-0.0713,-0.1234,0.0143,-0.0783,-0.1207,0.1272,-0.2409,-0.2673,0.1151,-0.2393,-0.2573,0.3896,0.2679,-0.2634,0.0861,-0.0675,-0.1298,0.2232,0.2806,-0.1891,0.2372,0.3144,-0.181,0.2967,0.4588,-0.2624,0.4217,0.3042,-0.3317,0.2604,0.3906,-0.2205,0.4252,0.2238,-0.318,0.4567,0.2401,-0.4037,-0.0067,-0.1787,-0.1218,0.0442,-0.1926,-0.1482,0.0814,-0.2079,-0.1846,0.0382,-0.076,-0.1336,0.1222,-0.2402,-0.2621,0.0988,-0.2685,-0.2431,0.1106,-0.2395,-0.257,0.0307,-0.0611,-0.0639,0.0618,-0.2146,-0.1985,0.0278,-0.2046,-0.1716,-0.016,-0.1979,-0.1522,-0.0285,-0.3806,-0.2151,-0.0238,-0.3336,-0.1757,-0.0226,-0.3148,-0.169,-0.0232,-0.2961,-0.178,-0.0269,-0.2837,-0.1852,0.0534,-0.2737,-0.2234,0.061,-0.2794,-0.2172,0.0691,-0.2911,-0.212,0.0754,-0.303,-0.2204,0.1351,-0.175,-0.195,0.4554,-0.1002,-0.6722,0.08,-0.2614,-0.2461,0.0886,-0.2642,-0.2423,0.0032,-0.0916,-0.1194,0.0698,-0.0869,-0.1628,0.0082,-0.0862,-0.1189,0.1487,0.0426,-0.2145,0.2204,0.0051,-0.2233,0.0994,-0.049,-0.1443,0.3976,0.4042,-0.3351,0.36,0.3553,-0.2717,0.3273,0.301,-0.2194,0.095,-0.3367,-0.2479,0.1289,0.3175,-0.1636,0.153,0.4097,-0.193,0.1833,0.4955,-0.2219,0.2849,0.121,-0.2822,0.3856,0.0566,-0.3398,0.1248,0.1535,-0.2667,0.3662,0.1615,-0.3035,0.0771,0.0978,-0.1884,0.0617,-0.037,-0.0648,0.4277,0.0169,-0.3844,0.3529,0.0378,-0.2998,0.2981,0.0345,-0.2615,0.216,0.0552,-0.245,0.1563,0.0798,-0.238,0.1142,0.1018,-0.2292,0.0269,0.1541,-0.1465,0.4098,-0.0646,-0.3679,0.4015,0.1612,-0.3227,-0.034,-0.0736,-0.0232,0.094,0.0319,-0.1803,0.4945,0.0824,-0.6468,0.0849,0.1252,-0.2255,0.1052,-0.051,-0.1894,0.3318,0.1389,-0.3157,0.0683,-0.0097,-0.0822,0.4248,-0.2003,-0.6505,0.1291,0.1646,-0.2789,0.0362,0.0164,-0.0421,0.272,-0.3887,-0.3991,0.2643,-0.4433,-0.4669,0.4438,-0.0872,-0.5202,0.3353,-0.3428,-0.4424,0.4683,0.1674,-0.4677,0.0647,-0.4973,-0.2803,-0.0397,-0.0838,-0.081,0.1311,-0.0023,-0.1941,0.4343,0.094,-0.4035,0.2467,0.1536,-0.2696,0.2168,0.1588,-0.2602,0.1065,-0.2742,-0.2488,0.3943,-0.1491,-0.3798,-0.0284,-0.5441,-0.2905,0.1198,-0.5094,-0.3691,0.1861,-0.4836,-0.413,0.1868,0.163,-0.26,0.1592,0.1645,-0.2677,0.1397,0.1643,-0.2777,0.4346,0.1637,-0.365,0.1683,0.1805,-0.2622,0.2023,0.1852,-0.2534,0.2347,0.1812,-0.2538,0.2632,0.1719,-0.263,0.2827,0.161,-0.2759,0.5,0.1785,-0.5825,0.2688,0.1492,-0.2825,0.0891,-0.146,-0.1654,0.0476,-0.0661,-0.1078,0.0033,-0.1229,-0.1247,0.2001,-0.43,-0.3664,0.1362,-0.4649,-0.3264,-0.0227,-0.5144,-0.2415,0.3267,-0.3907,-0.5367,0.1427,0.1712,-0.272,0.043,0.089,-0.1282,0.0505,-0.5311,-0.3216,0.4191,-0.181,-0.5113,0.0178,-0.2816,-0.2019,0.0237,-0.2916,-0.1957,0.0291,-0.3077,-0.1897,0.0311,-0.3248,-0.1972,0.041,-0.3675,-0.2272,0.0974,-0.2268,-0.227,0.1064,-0.224,-0.2277,0.1149,-0.2221,-0.2267,0.1664,-0.2102,-0.2321,0.3385,-0.1577,-0.2967,0.0517,0.1285,-0.1706,0.0985,0.2009,-0.2498,0.1256,0.1906,-0.2659,0.089,-0.2264,-0.2305,0.3286,-0.2679,-0.3641,0.0523,0.2058,-0.1935,0.0553,-0.4059,-0.2471,0.0157,0.113,-0.101,0.0637,0.0264,-0.1238,-0.0239,-0.423,-0.224,0.1682,-0.3243,-0.2871,0.1404,-0.0886,-0.2019,0.117,-0.3718,-0.2702,0.2491,-0.1037,-0.2177,0.1807,-0.1364,-0.214,0.2744,-0.1747,-0.2547,-0.0202,-0.4714,-0.2242,0.0868,0.0019,-0.153,0.1954,-0.3712,-0.3216,0.1327,-0.4147,-0.2973,0.2119,-0.2698,-0.2825,0.3749,-0.2231,-0.3962,0.2655,-0.299,-0.3185,0.3871,-0.269,-0.4932,0.209,-0.1898,-0.2382,0.0675,0.0613,-0.1564,0.0436,-0.0544,-0.0553,0.0683,-0.0642,-0.1013,0.0301,-0.0244,-0.0256,0.1403,0.2334,-0.2377,0.2152,0.249,-0.2292,0.2781,0.2426,-0.2298,0.3267,0.2233,-0.2451,0.3566,0.1971,-0.2704,0.3615,0.124,-0.3318,0.462,-0.0019,-0.5149,0.3168,0.0824,-0.296,0.2715,0.0821,-0.272,0.2151,0.0944,-0.2562,0.1642,0.1107,-0.25,0.1274,0.1249,-0.2512,0.101,0.1382,-0.2494,0.4781,-0.0074,-0.674,0.0668,-0.0724,-0.1227,0.0364,0.0546,-0.091,0.0137,-0.0538,-0.0226,-0.0102,-0.0714,-0.0406,0.0127,-0.0621,-0.0435,0.0558,-0.0823,-0.1384,-0.0197,-0.0735,-0.0291,-0.0255,-0.0828,-0.0805,0.1123,0.1659,-0.2724,0.084,0.1618,-0.2465,0.0652,0.1564,-0.2143,0.2947,0.1528,-0.2899,0.3415,0.1634,-0.2917],"uv":[0.4459,0.3677,0.4572,0.4596,0.454,0.4285,0.4466,0.5729,0.4625,0.4942,0.4699,0.537,0.4893,0.6396,0.2556,0.71,0.5045,0.7261,0.5124,0.7706,0.5396,0.9283,0.4445,0.3579,0.4436,0.3491,0.4425,0.3431,0.4352,0.2727,0.4333,0.2614,0.4312,0.2458,0.4285,0.2303,0.4201,0.1922,0.4547,0.4408,0.4238,0.4469,0.1528,0.8465,0.3439,0.6714,0.3127,0.6764,0.2799,0.6799,0.236,0.6986,0.3694,0.6671,0.301,0.7585,0.3402,0.7463,0.2632,0.7597,0.2384,0.751,0.2037,0.6822,0.2759,0.1817,0.2423,0.7145,0.1181,0.7083,0.1693,0.7089,0.2863,0.5304,0.3974,0.382,0.3973,0.3585,0.3499,0.3825,0.3177,0.3772,0.3598,0.3637,0.3314,0.3631,0.2604,0.3167,0.4288,0.465,0.4301,0.5004,0.1971,0.7851,0.376,0.5952,0.3562,0.4945,0.3564,0.5133,0.1821,0.5563,0.4386,0.5397,0.2791,0.8021,0.2314,0.8012,0.1936,0.8967,0.4262,0.7445,0.3722,0.7247,0.2413,0.3638,0.0917,0.3799,0.3794,0.4685,0.4029,0.4537,0.2837,0.3557,0.2943,0.3538,0.2182,0.825,0.3525,0.482,0.3417,0.7864,0.3402,0.8157,0.3374,0.9464,0.2068,0.8622,0.3437,0.8837,0.182,0.8035,0.1675,0.8237,0.3962,0.3699,0.3548,0.3725,0.3244,0.3707,0.3859,0.4616,0.2892,0.3548,0.3011,0.3281,0.2987,0.3524,0.3941,0.472,0.3381,0.359,0.3656,0.3586,0.4003,0.3524,0.3646,0.2066,0.3789,0.2445,0.3826,0.2602,0.3875,0.2736,0.3935,0.284,0.3348,0.3123,0.3274,0.3097,0.3183,0.3037,0.311,0.2961,0.2887,0.4124,0.0933,0.5606,0.4538,0.4321,0.3178,0.3277,0.3095,0.3281,0.4079,0.4408,0.3596,0.4627,0.4054,0.4466,0.3358,0.586,0.2719,0.5781,0.3473,0.5004,0.2526,0.9314,0.2634,0.8832,0.2712,0.8306,0.2822,0.2766,0.4221,0.789,0.4289,0.87,0.4303,0.9442,0.2526,0.6882,0.1657,0.6667,0.3859,0.6679,0.2054,0.7421,0.4034,0.609,0.376,0.5002,0.1287,0.6452,0.1821,0.6425,0.2204,0.624,0.288,0.6162,0.3401,0.6183,0.3769,0.6228,0.4547,0.6383,0.1188,0.578,0.1813,0.7506,0.4379,0.4451,0.3736,0.5622,0.1091,0.7116,0.4056,0.6321,0.3432,0.5007,0.2219,0.7168,0.3793,0.5229,0.0898,0.4753,0.3852,0.6775,0.4083,0.535,0.1412,0.2894,0.1368,0.2442,0.0965,0.5684,0.1075,0.3414,0.1418,0.7716,0.2647,0.1459,0.4409,0.4352,0.3373,0.5461,0.1442,0.7081,0.2889,0.7035,0.3153,0.699,0.2939,0.3246,0.11,0.5073,0.3229,0.0826,0.2222,0.1534,0.1814,0.192,0.526,0.852,0.3984,0.0607,0.3398,0.6938,0.3625,0.6868,0.3779,0.6803,0.1615,0.7612,0.3604,0.6965,0.3353,0.708,0.3093,0.7148,0.2825,0.7176,0.2639,0.7169,0.1269,0.7868,0.27,0.7068,0.451,0.406,0.33,0.4221,0.3806,0.4727,0.4004,0.4164,0.497,0.6814,0.1815,0.2368,0.2203,0.1923,0.3249,0.1077,0.108,0.3013,0.3772,0.6844,0.4246,0.593,0.4016,0.0835,0.2672,0.1162,0.091,0.4898,0.3604,0.297,0.3529,0.2917,0.3454,0.2808,0.3392,0.2669,0.3154,0.2375,0.3099,0.3599,0.3027,0.3638,0.2967,0.3681,0.2586,0.3939,0.1447,0.4853,0.4296,0.6253,0.4171,0.6939,0.3947,0.6945,0.3162,0.3569,0.1271,0.3975,0.4506,0.6844,0.2941,0.2124,0.4765,0.572,0.4506,0.6039,0.4821,0.6038,0.3928,0.5493,0.4068,0.1185,0.414,0.1581,0.3499,0.1773,0.2314,0.3072,0.3074,0.4816,0.2568,0.2557,0.2221,0.5021,0.2659,0.456,0.1864,0.4538,0.334,0.141,0.3704,0.5368,0.1985,0.2804,0.2349,0.2285,0.211,0.3605,0.1057,0.4443,0.1651,0.3554,0.091,0.4125,0.2315,0.4227,0.4001,0.5776,0.3846,0.4812,0.3652,0.4803,0.4016,0.5015,0.3941,0.7294,0.3413,0.7614,0.2919,0.7757,0.2498,0.7763,0.2205,0.7653,0.1988,0.7129,0.1043,0.6398,0.2202,0.6675,0.2539,0.6534,0.3,0.6472,0.3432,0.6451,0.3753,0.6455,0.3977,0.6482,0.1005,0.6378,0.3649,0.4728,0.4191,0.5639,0.4067,0.4739,0.4216,0.4533,0.4063,0.4672,0.3715,0.4621,0.4271,0.4491,0.4308,0.4409,0.3977,0.6732,0.4171,0.6608,0.4288,0.6505,0.2516,0.7155,0.223,0.7372,0.505,0.5625,0.735,0.6202,0.4881,0.436,0.9023,0.7125,0.6436,0.6145,0.6734,0.6081,0.7059,0.6007,0.7516,0.6023,0.6176,0.6199,0.7141,0.6854,0.673,0.6882,0.7498,0.6718,0.7702,0.6538,0.7821,0.5756,0.5527,0.1306,0.7491,0.6204,0.8882,0.5683,0.8287,0.5876,0.6506,0.4646,0.4969,0.3655,0.4906,0.3433,0.5436,0.3498,0.575,0.3338,0.5288,0.3349,0.558,0.3256,0.612,0.2548,0.4858,0.4551,0.4953,0.488,0.8259,0.6726,0.586,0.5573,0.5703,0.4577,0.576,0.4749,0.7614,0.4519,0.5003,0.5293,0.7508,0.7231,0.7969,0.7025,0.8764,0.7762,0.5875,0.719,0.6357,0.6789,0.6457,0.294,0.8138,0.2475,0.539,0.4415,0.5117,0.4358,0.6044,0.3023,0.5944,0.3036,0.8197,0.7198,0.5706,0.4446,0.6831,0.7302,0.6946,0.7579,0.7434,0.8764,0.846,0.7496,0.7136,0.8205,0.8489,0.6836,0.8747,0.697,0.4945,0.3534,0.5363,0.342,0.5668,0.3294,0.5313,0.4376,0.6002,0.3029,0.581,0.2797,0.5908,0.3035,0.5252,0.4498,0.5507,0.3239,0.5228,0.3321,0.4869,0.3377,0.4766,0.1878,0.4805,0.2263,0.4814,0.2418,0.481,0.2571,0.478,0.2672,0.5438,0.2754,0.55,0.2708,0.5567,0.2612,0.5619,0.2514,0.6109,0.3564,0.8737,0.4178,0.5656,0.2855,0.5727,0.2833,0.5026,0.4248,0.5572,0.4287,0.5067,0.4293,0.622,0.5349,0.6808,0.5042,0.5816,0.4598,0.8262,0.8316,0.7954,0.7915,0.7686,0.747,0.578,0.2238,0.6057,0.7605,0.6255,0.8362,0.6504,0.9065,0.7338,0.5993,0.8164,0.5465,0.6024,0.6259,0.8004,0.6325,0.5632,0.5802,0.5506,0.4696,0.8509,0.5139,0.7896,0.5311,0.7446,0.5283,0.6773,0.5453,0.6283,0.5655,0.5937,0.5835,0.522,0.6264,0.8362,0.447,0.8294,0.6322,0.4721,0.4396,0.5772,0.5261,0.9058,0.5676,0.5696,0.6027,0.5863,0.4581,0.7722,0.6139,0.5561,0.4921,0.8486,0.3357,0.6059,0.635,0.5297,0.5134,0.7231,0.1811,0.7169,0.1363,0.8642,0.4285,0.7751,0.2188,0.8843,0.6374,0.5531,0.092,0.4674,0.4312,0.6075,0.4981,0.8563,0.5771,0.7024,0.6261,0.6779,0.6303,0.5874,0.275,0.8235,0.3777,0.4767,0.0536,0.5983,0.0821,0.6527,0.1032,0.6532,0.6338,0.6306,0.635,0.6146,0.6348,0.8566,0.6343,0.6381,0.6481,0.666,0.6519,0.6926,0.6487,0.716,0.6411,0.732,0.6321,0.9102,0.6464,0.7205,0.6224,0.5731,0.3802,0.5391,0.4458,0.5027,0.3991,0.6642,0.1472,0.6118,0.1186,0.4814,0.078,0.7681,0.1794,0.6171,0.6404,0.5353,0.5731,0.5414,0.0643,0.8438,0.3515,0.5146,0.2689,0.5195,0.2608,0.5239,0.2475,0.5255,0.2335,0.5336,0.1985,0.5799,0.3139,0.5873,0.3162,0.5943,0.3178,0.6365,0.3276,0.7778,0.3706,0.5424,0.6054,0.5808,0.6648,0.6031,0.6564,0.573,0.3142,0.7696,0.2802,0.5429,0.6689,0.5454,0.167,0.5129,0.5927,0.5523,0.5216,0.4804,0.1529,0.638,0.2339,0.6152,0.4273,0.596,0.195,0.7044,0.4149,0.6483,0.3881,0.7252,0.3567,0.4834,0.1132,0.5712,0.5016,0.6603,0.1954,0.6089,0.1597,0.6738,0.2787,0.8076,0.3169,0.7178,0.2547,0.8176,0.2793,0.6715,0.3443,0.5554,0.5503,0.5358,0.4554,0.556,0.4473,0.5247,0.48,0.6151,0.6915,0.6765,0.7043,0.7282,0.6991,0.768,0.6832,0.7926,0.6617,0.7966,0.6017,0.8791,0.4984,0.76,0.5676,0.7228,0.5673,0.6765,0.5775,0.6347,0.5908,0.6046,0.6025,0.5829,0.6134,0.8923,0.4939,0.5548,0.4406,0.5298,0.5448,0.5112,0.4559,0.4916,0.4414,0.5104,0.4491,0.5458,0.4325,0.4839,0.4397,0.4791,0.432,0.5921,0.6361,0.569,0.6327,0.5535,0.6283,0.7418,0.6253,0.7802,0.634],"i":[58,138,172,135,138,214,138,135,172,135,136,172,137,234,123,93,137,123,137,93,234,116,117,123,54,68,21,176,171,148,192,207,214,138,192,214,192,138,58,251,298,284,444,445,260,10,108,109,108,10,151,445,467,260,262,395,369,395,394,379,234,227,123,227,116,123,127,227,234,46,70,63,68,71,21,71,68,63,70,71,63,34,143,116,34,227,127,227,34,116,139,34,127,34,139,143,406,335,424,175,152,148,171,175,148,152,175,377,170,149,150,170,32,149,210,135,214,147,187,132,147,93,123,213,187,207,192,213,207,187,213,132,298,301,293,301,300,293,301,298,251,301,251,389,276,300,383,300,276,293,283,334,293,444,283,445,276,283,293,283,276,445,333,298,293,334,333,293,333,332,284,298,333,284,332,333,297,67,104,103,104,54,103,104,68,54,266,426,423,376,411,280,433,411,376,352,376,280,353,276,383,265,353,383,356,368,389,368,301,389,300,368,383,301,368,300,397,365,364,394,365,379,365,394,364,367,397,364,434,367,364,397,367,288,335,422,424,378,400,369,395,378,369,378,395,379,395,431,394,431,395,262,31,228,117,162,139,127,71,162,21,162,71,70,139,162,70,50,147,123,147,50,187,117,50,123,229,230,119,158,159,28,418,406,424,431,418,424,418,431,262,405,321,335,406,405,335,149,140,176,32,140,149,169,136,135,210,169,135,136,169,150,169,170,150,93,177,132,177,147,132,147,177,93,215,192,58,215,213,192,213,215,132,68,105,63,104,105,68,69,67,109,108,69,109,69,104,67,69,105,104,391,327,423,275,363,440,363,275,281,457,275,440,275,457,274,322,391,423,426,322,423,425,426,266,411,425,280,425,411,427,425,330,280,330,425,266,435,361,288,361,435,433,416,434,427,411,416,427,416,411,433,435,416,433,416,367,434,367,416,288,416,435,288,342,467,445,276,342,445,353,342,276,273,422,335,273,321,375,321,273,335,430,434,364,430,422,434,394,430,364,431,430,394,422,430,424,430,431,424,111,31,117,116,111,117,143,111,116,53,46,63,105,53,63,139,156,143,124,156,46,46,156,70,156,139,70,31,226,130,113,226,124,130,113,247,226,113,130,205,50,101,205,216,207,216,205,206,187,205,207,50,205,187,216,92,186,92,216,206,118,50,117,50,118,101,228,118,117,118,228,229,118,229,119,101,118,119,107,108,151,107,222,65,159,27,28,27,222,28,65,27,223,222,27,65,228,110,229,145,159,158,456,363,281,193,55,8,465,351,417,218,115,220,242,167,97,324,319,318,405,404,321,199,175,171,314,405,406,208,140,32,208,171,176,140,208,176,208,199,171,207,212,214,216,212,207,259,444,260,259,443,444,443,259,257,285,417,8,285,413,417,413,285,441,224,52,223,53,52,224,52,53,105,460,327,391,371,330,266,309,457,440,4,275,274,275,4,281,311,318,402,311,402,312,322,270,391,270,269,391,436,425,427,425,436,426,261,265,340,385,286,258,401,433,376,401,361,433,372,265,383,265,372,340,372,345,340,368,372,383,53,225,46,225,53,224,225,124,46,225,113,124,113,225,247,226,35,124,156,35,143,35,156,124,35,111,143,111,35,31,35,226,31,115,48,49,203,64,98,203,92,206,29,224,223,27,29,223,24,230,229,110,24,229,456,420,363,456,248,399,248,456,281,209,49,142,100,101,119,101,100,142,222,56,28,56,158,28,193,189,55,417,168,8,168,193,8,168,6,193,351,6,417,6,168,417,412,351,465,238,239,44,461,354,274,239,237,44,79,237,239,237,218,220,237,79,218,310,324,318,311,310,318,310,311,271,321,307,375,404,320,321,320,404,319,320,307,321,320,325,307,324,320,319,325,320,324,319,403,318,404,403,319,318,403,402,175,396,377,199,396,175,396,400,377,400,396,369,200,83,18,315,404,405,314,315,405,315,403,404,201,208,32,200,201,83,208,201,199,201,200,199,61,146,43,146,106,43,170,211,32,169,211,170,211,169,210,204,211,210,202,204,210,106,202,43,202,106,204,202,210,214,212,202,214,464,465,417,413,464,417,9,285,8,9,107,151,55,9,8,107,9,55,66,52,105,69,66,105,66,65,223,52,66,223,66,69,108,107,66,108,66,107,65,393,460,391,269,393,391,393,269,267,393,267,164,460,393,305,327,294,423,460,455,327,455,294,327,294,455,439,358,371,266,358,266,423,294,358,423,358,294,331,252,380,253,1,4,274,354,1,274,1,354,19,4,1,44,1,125,44,125,1,19,45,4,44,45,237,220,237,45,44,4,5,281,5,248,281,248,5,195,290,309,305,268,311,312,11,268,312,311,302,271,268,302,311,302,268,11,409,270,322,410,322,426,436,410,426,410,409,322,451,252,253,252,451,256,346,261,340,345,346,340,346,352,280,346,345,352,261,446,265,446,353,265,446,342,353,257,386,258,386,385,258,414,413,441,286,414,441,401,323,361,323,401,376,372,264,345,264,368,356,264,372,368,48,219,64,218,219,115,219,48,115,205,36,206,36,203,206,36,205,101,36,101,142,203,129,64,49,129,142,129,36,142,36,129,203,30,225,224,29,30,224,225,30,247,160,27,159,160,29,27,437,420,456,437,456,399,248,419,399,419,412,399,412,419,351,419,248,195,115,131,220,131,115,49,209,131,49,5,3,195,174,114,188,114,217,47,217,114,174,230,120,119,120,100,119,100,120,47,56,157,158,114,128,188,190,157,56,3,196,195,196,174,188,196,3,174,412,343,399,343,437,399,437,343,277,238,60,239,79,60,75,60,79,239,241,125,242,241,238,44,125,241,44,94,141,19,141,125,19,125,141,242,141,94,2,164,141,2,141,164,167,242,141,167,79,166,218,166,219,218,59,166,75,166,79,75,267,0,164,302,0,267,0,302,11,0,11,82,310,415,324,415,325,324,415,270,407,303,310,271,310,303,269,269,303,267,303,302,267,302,303,271,11,12,82,12,11,312,418,421,406,421,418,262,200,421,199,403,316,402,315,316,403,57,61,43,202,57,43,57,202,212,61,57,186,57,216,186,57,212,216,92,185,186,185,61,186,37,39,167,164,37,167,0,37,164,95,80,88,39,165,167,165,203,98,203,165,92,91,146,90,91,106,146,91,181,106,211,194,32,194,211,204,194,201,32,282,296,334,443,282,444,295,282,443,282,295,296,282,283,444,283,282,334,299,333,334,296,299,334,333,299,297,299,338,297,337,10,338,10,337,151,299,337,338,337,299,296,442,443,257,442,295,443,442,257,258,286,442,258,442,286,441,295,442,441,462,393,164,462,250,326,393,462,326,250,462,461,462,354,461,294,278,331,278,294,439,278,439,344,455,392,439,309,392,305,279,429,371,279,358,331,358,279,371,278,279,331,279,278,344,355,429,420,355,437,277,437,355,420,429,355,371,381,380,252,381,252,256,45,51,4,51,5,4,51,3,5,250,328,326,328,290,305,393,328,305,328,393,326,458,328,250,328,458,290,458,461,274,458,250,461,270,408,407,409,408,270,307,308,375,308,408,409,408,308,407,325,308,307,308,415,407,415,308,325,422,432,434,434,432,427,432,436,427,343,350,277,350,349,277,350,451,349,348,329,349,349,329,277,371,329,330,329,348,330,329,355,277,355,329,371,348,450,449,450,451,253,451,450,349,450,348,349,348,347,330,347,348,449,330,347,280,347,346,280,448,255,261,448,347,449,346,448,261,347,448,346,255,339,249,339,448,449,448,339,255,466,263,249,263,255,249,467,263,260,263,466,260,359,446,261,255,359,261,342,359,467,446,359,342,359,263,467,263,359,255,254,450,253,450,254,449,254,339,449,259,387,257,387,386,257,464,463,453,463,464,413,414,463,413,352,366,376,366,323,376,366,454,323,64,235,98,219,235,64,235,166,59,166,235,219,48,102,49,102,129,49,102,48,64,129,102,64,145,144,159,144,160,159,121,114,47,120,121,47,121,128,114,217,126,47,126,100,47,126,209,142,100,126,142,231,120,230,121,231,232,231,121,120,244,189,193,221,190,56,221,107,55,189,221,55,190,221,189,107,221,222,221,56,222,173,190,133,190,173,157,122,196,188,6,122,193,197,6,351,419,197,351,197,122,6,122,197,196,197,419,195,196,197,195,357,343,412,357,412,465,350,357,453,357,350,343,464,357,465,357,464,453,99,60,238,60,99,75,167,99,97,99,167,75,20,242,97,20,241,242,241,20,238,99,20,97,20,99,238,415,304,270,270,304,269,179,178,86,178,179,88,313,200,18,313,421,200,17,313,18,313,17,314,313,314,406,421,313,406,428,396,199,421,428,199,428,421,262,428,262,369,396,428,369,402,317,312,316,317,402,16,316,315,16,315,314,17,16,314,185,76,61,61,76,146,146,77,90,95,89,90,89,95,88,179,89,88,178,81,82,80,81,88,81,178,88,191,80,95,83,84,18,84,17,18,84,16,17,85,84,181,84,85,16,180,91,90,180,181,91,89,180,90,180,89,179,180,85,181,180,179,86,85,180,86,182,84,83,84,182,181,201,182,83,194,182,201,181,182,106,106,182,204,182,194,204,9,336,285,336,337,296,336,9,151,337,336,151,295,336,296,285,336,441,336,295,441,370,164,2,370,462,164,462,370,354,94,370,2,370,94,19,354,370,19,289,455,460,289,392,455,289,460,305,392,289,305,439,438,344,392,438,439,438,392,309,344,438,440,438,309,440,360,279,344,279,360,429,363,360,440,360,344,440,420,360,363,429,360,420,380,384,385,381,384,380,384,286,385,384,381,398,414,384,398,384,414,286,51,236,3,3,236,174,236,217,174,458,459,290,309,459,457,290,459,309,457,459,274,459,458,274,410,291,409,291,273,375,451,452,256,350,452,451,452,350,453,386,374,385,380,374,253,374,380,385,388,466,249,388,387,259,388,259,260,466,388,260,373,254,253,374,373,253,387,373,386,373,374,386,382,381,256,381,382,398,345,447,352,447,366,352,366,447,454,264,447,345,447,264,356,454,447,356,235,240,98,240,235,59,240,59,75,167,240,75,240,165,98,165,240,167,25,7,110,25,110,228,31,25,228,25,31,130,160,161,29,161,30,29,23,231,230,24,23,230,23,144,145,144,23,24,233,244,128,112,233,232,233,121,232,121,233,128,243,112,133,244,243,189,243,233,112,233,243,244,190,243,133,243,190,189,23,22,231,245,244,193,122,245,193,245,122,188,128,245,188,244,245,128,272,415,310,272,304,415,272,310,269,304,272,269,15,317,316,16,15,316,15,85,86,85,15,16,76,62,146,77,62,78,62,77,146,62,76,185,96,77,78,191,96,78,96,191,95,96,95,90,77,96,90,72,37,0,37,73,39,183,191,78,40,165,39,40,185,92,165,40,92,198,126,217,236,198,217,126,198,209,198,131,209,291,306,409,306,291,375,287,291,410,287,410,436,432,287,436,291,287,273,273,287,422,287,432,422,463,341,453,341,452,453,452,341,256,341,382,256,388,390,387,390,373,387,390,388,249,373,390,254,339,390,249,254,390,339,33,25,130,25,33,7,33,130,247,30,33,247,161,163,7,163,144,24,144,163,160,163,161,160,163,24,110,7,163,110,173,154,157,153,23,145,153,22,23,153,145,158,157,153,158,154,153,157,153,154,22,15,14,317,317,14,312,38,0,82,38,72,0,81,38,82,72,38,81,72,41,37,41,73,37,41,72,81,41,81,80,73,41,80,74,40,39,183,74,191,40,74,183,40,184,185,184,40,183,184,183,78,62,184,78,184,62,185,134,236,51,134,198,236,134,45,220,134,51,45,131,134,220,198,134,131,292,308,409,306,292,409,308,292,375,292,306,375,362,341,463,341,362,382,362,463,414,362,414,398,382,362,398,246,161,7,33,246,7,161,246,30,246,33,30,154,26,22,26,112,232,231,26,232,22,26,231,13,12,312,14,13,312,12,13,82,87,15,86,87,14,15,87,178,82,178,87,86,13,87,82,87,13,14,191,42,80,74,42,191,42,74,39,73,42,39,42,73,80,155,154,173,155,26,154,155,173,133,112,155,133,26,155,112],"tex":"data:...BASE64_BO_BOT...","skin":"#dc9894","ring":[10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109],"hgt":1.088},"bo":{"v":[-0.0186,-0.2318,-0.1251,-0.0253,-0.0955,-0.0,-0.0212,-0.1354,-0.1156,-0.0588,0.0547,-0.0465,-0.0258,-0.0501,0.0184,-0.0251,0.0103,0.0061,-0.0204,0.1581,-0.0936,-0.2976,0.1931,-0.279,-0.018,0.2579,-0.1099,-0.0167,0.318,-0.0936,-0.0134,0.57,-0.1189,-0.0188,-0.2487,-0.1325,-0.0184,-0.2651,-0.148,-0.0189,-0.277,-0.1687,-0.0198,-0.2765,-0.1731,-0.0205,-0.2953,-0.1676,-0.0206,-0.3182,-0.16,-0.0215,-0.3428,-0.1669,-0.0213,-0.3875,-0.2106,-0.0242,-0.1181,-0.0237,-0.0601,-0.1155,-0.0849,-0.4709,0.3689,-0.4703,-0.1952,0.1442,-0.2341,-0.2345,0.1438,-0.2383,-0.2729,0.1474,-0.251,-0.3179,0.1749,-0.288,-0.1618,0.1498,-0.2353,-0.2485,0.2669,-0.2101,-0.2032,0.2588,-0.208,-0.2904,0.2615,-0.2262,-0.3174,0.2466,-0.246,-0.361,0.1446,-0.3133,-0.175,-0.4636,-0.2742,-0.3098,0.2042,-0.2926,-0.4902,0.1712,-0.5106,-0.4106,0.1745,-0.3549,-0.2313,-0.0445,-0.2096,-0.07,-0.2207,-0.1316,-0.0655,-0.2635,-0.156,-0.1201,-0.2346,-0.1605,-0.1532,-0.2484,-0.1963,-0.1056,-0.2638,-0.1754,-0.1374,-0.2656,-0.2078,-0.2096,-0.3096,-0.2726,-0.0596,-0.0944,-0.0045,-0.0652,-0.0495,0.0119,-0.3816,0.28,-0.2535,-0.1429,0.0665,-0.1895,-0.1527,-0.0774,-0.1146,-0.1555,-0.0523,-0.1263,-0.3585,-0.0346,-0.269,-0.0625,0.0065,-0.0094,-0.2824,0.3214,-0.1682,-0.3403,0.3092,-0.2053,-0.4283,0.4483,-0.3735,-0.1015,0.2665,-0.1268,-0.1651,0.2378,-0.2212,-0.244,-0.2681,-0.2809,-0.4423,-0.2612,-0.6703,-0.1205,-0.1041,-0.1326,-0.0872,-0.1169,-0.1274,-0.197,-0.2685,-0.276,-0.1877,-0.2683,-0.2634,-0.3647,0.3398,-0.2248,-0.1549,-0.0958,-0.1404,-0.2035,0.3095,-0.1409,-0.211,0.3483,-0.1279,-0.2555,0.5504,-0.1879,-0.3977,0.3961,-0.2874,-0.2309,0.4552,-0.1534,-0.4084,0.301,-0.2898,-0.4423,0.3328,-0.3739,-0.069,-0.2436,-0.1391,-0.1126,-0.2502,-0.1662,-0.1454,-0.2562,-0.1985,-0.111,-0.1122,-0.1407,-0.1921,-0.2683,-0.2691,-0.1713,-0.2778,-0.2418,-0.1818,-0.2689,-0.2617,-0.1008,-0.0911,-0.0696,-0.1308,-0.2717,-0.2152,-0.0987,-0.2722,-0.1935,-0.0611,-0.2748,-0.1755,-0.0761,-0.3863,-0.2144,-0.0715,-0.3383,-0.1715,-0.07,-0.3131,-0.1653,-0.0668,-0.292,-0.1742,-0.0625,-0.2735,-0.1799,-0.1323,-0.2711,-0.2185,-0.1396,-0.2784,-0.2121,-0.1466,-0.289,-0.2078,-0.1519,-0.3015,-0.2171,-0.1974,-0.2018,-0.2071,-0.4892,-0.0312,-0.715,-0.023,-0.1276,-0.0831,-0.1561,-0.2707,-0.2437,-0.1637,-0.2748,-0.2403,-0.0753,-0.1331,-0.1287,-0.1406,-0.1208,-0.1742,-0.0811,-0.1258,-0.1265,-0.1875,0.0416,-0.2089,-0.2574,0.0143,-0.226,-0.1631,-0.0714,-0.153,-0.3588,0.5104,-0.2739,-0.3293,0.4389,-0.2165,-0.2977,0.3595,-0.1728,-0.1743,-0.3386,-0.2508,-0.1144,0.3268,-0.1033,-0.1301,0.4555,-0.1165,-0.1445,0.5682,-0.1356,-0.3017,0.1575,-0.2704,-0.4102,0.1135,-0.3419,-0.1401,0.1585,-0.2394,-0.3614,0.2283,-0.2854,-0.1134,0.0944,-0.17,-0.1285,-0.0627,-0.0695,-0.4566,0.0816,-0.3961,-0.3817,0.0808,-0.3048,-0.3283,0.0616,-0.2642,-0.2475,0.0651,-0.2406,-0.189,0.0808,-0.2275,-0.1456,0.0984,-0.2111,-0.0601,0.1483,-0.1135,-0.452,-0.0143,-0.3931,-0.3986,0.2325,-0.3054,-0.0445,-0.1162,-0.0271,-0.1403,0.0202,-0.1761,-0.5,0.1774,-0.6596,-0.1125,0.1207,-0.2007,-0.1662,-0.0724,-0.1983,-0.3332,0.2013,-0.3019,-0.1296,-0.0324,-0.0838,-0.4724,-0.1441,-0.7046,-0.1394,0.1733,-0.2489,-0.0972,-0.0076,-0.0382,-0.3536,-0.3633,-0.4407,-0.3466,-0.415,-0.5243,-0.4868,-0.0254,-0.554,-0.4083,-0.3051,-0.4927,-0.4679,0.2596,-0.4537,-0.1815,-0.5074,-0.3044,-0.0386,-0.1262,-0.0863,-0.1787,-0.0117,-0.1965,-0.4482,0.1683,-0.4013,-0.2658,0.1759,-0.2531,-0.2348,0.1701,-0.2414,-0.1768,-0.2853,-0.2506,-0.444,-0.1076,-0.416,-0.1049,-0.5631,-0.3183,-0.2266,-0.5092,-0.4074,-0.2813,-0.4714,-0.4592,-0.0157,0.4518,-0.1022,-0.0225,-0.57,-0.3022,-0.2026,0.17,-0.2376,-0.172,0.1718,-0.2418,-0.1503,0.1713,-0.2489,-0.4306,0.2431,-0.35,-0.1735,0.2079,-0.2321,-0.2063,0.2231,-0.2245,-0.2393,0.2281,-0.2276,-0.2709,0.2247,-0.2402,-0.2899,0.2172,-0.2563,-0.4921,0.2835,-0.5743,-0.285,0.1844,-0.2671,-0.0205,-0.1698,-0.1293,-0.1557,-0.1809,-0.1791,-0.1197,-0.0971,-0.1142,-0.0777,-0.1699,-0.1348,-0.0186,0.21,-0.1189,-0.2944,-0.4215,-0.3989,-0.2397,-0.4647,-0.3543,-0.1096,-0.5357,-0.2597,-0.3981,-0.351,-0.6028,-0.15,0.1872,-0.2415,-0.0875,0.0784,-0.1099,-0.0231,-0.5424,-0.2457,-0.1701,-0.5405,-0.3546,-0.4721,-0.1274,-0.5565,-0.1,-0.2724,-0.1973,-0.1071,-0.2845,-0.1903,-0.1124,-0.3015,-0.1848,-0.1164,-0.3233,-0.1923,-0.1304,-0.3665,-0.2277,-0.1636,-0.2663,-0.2369,-0.1713,-0.2628,-0.2373,-0.1775,-0.2589,-0.2367,-0.2296,-0.2312,-0.2432,-0.3925,-0.1321,-0.3255,-0.086,0.1246,-0.1447,-0.1063,0.2052,-0.2119,-0.1326,0.2009,-0.2307,-0.1554,-0.2704,-0.2418,-0.3941,-0.2401,-0.4024,-0.07,0.2024,-0.1527,-0.1549,-0.4158,-0.2534,-0.0234,0.0606,-0.0292,-0.0598,0.0998,-0.075,-0.0227,0.1077,-0.0628,-0.1165,0.0077,-0.1185,-0.0236,-0.4993,-0.2165,-0.0221,-0.4421,-0.2135,-0.091,-0.4381,-0.2249,-0.2481,-0.3324,-0.2995,-0.2013,-0.1048,-0.2125,-0.2041,-0.3814,-0.2792,-0.3003,-0.0948,-0.2338,-0.2419,-0.1463,-0.2269,-0.3365,-0.1653,-0.2777,-0.1055,-0.4944,-0.2321,-0.1407,-0.0164,-0.1533,-0.2829,-0.3694,-0.3442,-0.2281,-0.42,-0.3155,-0.2855,-0.2786,-0.3014,-0.4322,-0.1859,-0.4381,-0.3377,-0.2863,-0.3464,-0.4498,-0.2219,-0.5456,-0.2766,-0.2001,-0.2543,-0.1127,0.05,-0.1455,-0.1142,-0.0833,-0.0605,-0.1394,-0.0929,-0.1101,-0.0987,-0.0537,-0.0264,-0.1361,0.2444,-0.196,-0.2018,0.2763,-0.1879,-0.2607,0.2862,-0.1929,-0.3102,0.2793,-0.2136,-0.3441,0.2606,-0.2439,-0.3673,0.1886,-0.3208,-0.4941,0.0738,-0.5353,-0.3373,0.1252,-0.2922,-0.2969,0.1094,-0.265,-0.2422,0.1072,-0.2453,-0.1907,0.1142,-0.2357,-0.151,0.1257,-0.229,-0.1235,0.1377,-0.2241,-0.4958,0.0748,-0.702,-0.1386,-0.1039,-0.1327,-0.0889,0.0358,-0.0804,-0.0866,-0.0866,-0.0261,-0.0637,-0.1081,-0.0445,-0.0851,-0.0935,-0.0477,-0.1275,-0.117,-0.1481,-0.0576,-0.1129,-0.0335,-0.0516,-0.1213,-0.0859,-0.1255,0.1705,-0.2412,-0.1018,0.161,-0.2143,-0.0881,0.153,-0.183,-0.3009,0.2105,-0.2723,-0.3343,0.2276,-0.2738,0.012,0.0534,-0.0435,0.2662,0.1778,-0.2567,0.0156,-0.1164,-0.0829,0.4645,0.3556,-0.4354,0.1632,0.1357,-0.2194,0.2018,0.1332,-0.2208,0.2414,0.1361,-0.2309,0.2876,0.1598,-0.2642,0.1284,0.1436,-0.2237,0.2195,0.2555,-0.1913,0.174,0.25,-0.1932,0.2612,0.2472,-0.2049,0.2885,0.2309,-0.2232,0.3351,0.1305,-0.2876,0.1312,-0.469,-0.2639,0.2792,0.1883,-0.2689,0.4809,0.1554,-0.4762,0.3902,0.1582,-0.3263,0.1957,-0.0522,-0.1951,0.0333,-0.2206,-0.1283,0.0279,-0.2629,-0.1532,0.0829,-0.2348,-0.1539,0.1171,-0.2484,-0.187,0.0686,-0.2641,-0.1697,0.1017,-0.2645,-0.2002,0.1701,-0.3148,-0.2597,0.009,-0.0954,-0.0026,0.0142,-0.0518,0.0144,0.3559,0.2617,-0.2263,0.1069,0.0614,-0.1801,0.1112,-0.0815,-0.1064,0.1144,-0.057,-0.1177,0.3297,-0.046,-0.245,0.0123,0.0058,-0.0065,0.2507,0.3076,-0.1488,0.3114,0.2919,-0.1813,0.4169,0.4365,-0.3419,0.0667,0.2619,-0.1201,0.1354,0.2323,-0.2092,0.2063,-0.2727,-0.2646,0.4374,-0.2769,-0.6383,0.0776,-0.1071,-0.1266,0.0443,-0.1176,-0.1244,0.1614,-0.2679,-0.2625,0.1521,-0.2677,-0.2516,0.3379,0.3213,-0.1992,0.1145,-0.0993,-0.1324,0.17,0.2996,-0.1274,0.1786,0.3378,-0.1143,0.2341,0.5435,-0.1691,0.3764,0.3827,-0.2594,0.2021,0.4478,-0.1381,0.3856,0.2821,-0.2607,0.4263,0.3178,-0.3426,0.0317,-0.2438,-0.136,0.0756,-0.2502,-0.1601,0.1097,-0.2566,-0.1901,0.0693,-0.1137,-0.1359,0.158,-0.2677,-0.2567,0.1352,-0.2784,-0.2319,0.147,-0.2685,-0.2504,0.0561,-0.0934,-0.0641,0.095,-0.2703,-0.2081,0.0626,-0.2719,-0.1884,0.024,-0.2751,-0.1728,0.0327,-0.3866,-0.2117,0.0301,-0.3392,-0.1688,0.0288,-0.3144,-0.1629,0.0271,-0.2914,-0.1717,0.0231,-0.2748,-0.1776,0.0957,-0.2708,-0.2117,0.1025,-0.2781,-0.2052,0.109,-0.2903,-0.2005,0.1147,-0.3033,-0.2091,0.1577,-0.2058,-0.1961,0.4908,-0.0488,-0.6781,0.121,-0.27,-0.2344,0.1271,-0.2743,-0.2308,0.0321,-0.1338,-0.1257,0.0995,-0.124,-0.168,0.0378,-0.1271,-0.1236,0.1533,0.0361,-0.1964,0.2248,0.0059,-0.2088,0.1234,-0.0755,-0.1443,0.3429,0.5008,-0.2477,0.3048,0.4282,-0.1937,0.2674,0.3445,-0.1526,0.1326,-0.3433,-0.2406,0.0801,0.3215,-0.0964,0.0998,0.4515,-0.1081,0.1199,0.5649,-0.1263,0.2716,0.1449,-0.2481,0.3882,0.0977,-0.3138,0.107,0.1525,-0.2289,0.335,0.2109,-0.2593,0.0755,0.0903,-0.1624,0.0834,-0.0668,-0.0628,0.4404,0.0663,-0.3638,0.3557,0.0671,-0.2782,0.2981,0.0502,-0.2416,0.2155,0.0567,-0.2233,0.1555,0.074,-0.2143,0.11,0.0939,-0.2013,0.0195,0.147,-0.11,0.4341,-0.0303,-0.3613,0.3751,0.2147,-0.2771,-0.0043,-0.1161,-0.0256,0.1033,0.0155,-0.1672,0.5,0.1624,-0.6213,0.0767,0.1173,-0.1929,0.1281,-0.0768,-0.1895,0.3041,0.1846,-0.2772,0.0865,-0.0364,-0.0769,0.4727,-0.1619,-0.6698,0.1063,0.1672,-0.238,0.05,-0.0106,-0.0332,0.3264,-0.3763,-0.4158,0.3229,-0.427,-0.4991,0.4798,-0.042,-0.5197,0.3886,-0.3191,-0.4641,0.4559,0.2441,-0.4209,0.1387,-0.5132,-0.2927,-0.007,-0.1257,-0.0854,0.1433,-0.0172,-0.1854,0.4319,0.1513,-0.3697,0.2324,0.1644,-0.2333,0.2021,0.16,-0.2237,0.1415,-0.2846,-0.2395,0.4276,-0.1229,-0.3851,0.0602,-0.5666,-0.3118,0.189,-0.5175,-0.3914,0.2493,-0.4811,-0.4388,0.1689,0.1611,-0.2226,0.139,0.1642,-0.2287,0.1182,0.1653,-0.2372,0.4126,0.2252,-0.3193,0.1412,0.2012,-0.2188,0.1746,0.2147,-0.2089,0.2089,0.2171,-0.2095,0.2392,0.2114,-0.22,0.2591,0.2019,-0.2347,0.4896,0.2701,-0.5376,0.2522,0.1707,-0.2459,0.1146,-0.1838,-0.1708,0.0765,-0.1004,-0.1084,0.0361,-0.1708,-0.1315,0.2597,-0.431,-0.379,0.2005,-0.4731,-0.3388,0.0631,-0.5399,-0.2533,0.3843,-0.3652,-0.5733,0.1175,0.1817,-0.2294,0.0453,0.0752,-0.1047,0.128,-0.5467,-0.3425,0.4645,-0.1452,-0.5233,0.063,-0.2717,-0.1927,0.0685,-0.2856,-0.1857,0.0738,-0.3038,-0.1797,0.0768,-0.3246,-0.1867,0.088,-0.3695,-0.2208,0.1286,-0.2667,-0.227,0.1352,-0.2623,-0.2261,0.142,-0.2593,-0.2247,0.1917,-0.2368,-0.2288,0.3683,-0.1453,-0.2996,0.0462,0.122,-0.1394,0.0732,0.2014,-0.2049,0.1009,0.1961,-0.2204,0.1196,-0.2695,-0.2323,0.3707,-0.2539,-0.3757,0.0337,0.2001,-0.1484,0.1119,-0.4199,-0.2447,0.0158,0.0982,-0.0723,0.0752,0.0045,-0.1122,0.0464,-0.4412,-0.2203,0.2112,-0.3401,-0.2841,0.1637,-0.1103,-0.2014,0.1638,-0.3864,-0.2671,0.2678,-0.105,-0.2149,0.2064,-0.1531,-0.2126,0.306,-0.176,-0.256,0.0596,-0.4979,-0.2261,0.1021,-0.0208,-0.1452,0.2463,-0.3787,-0.3257,0.1885,-0.4268,-0.3012,0.2498,-0.2857,-0.2824,0.4144,-0.2005,-0.4088,0.3075,-0.2981,-0.3237,0.4386,-0.2383,-0.5142,0.2408,-0.2079,-0.237,0.0732,0.0465,-0.1383,0.0678,-0.0862,-0.0544,0.0962,-0.0972,-0.1032,0.0503,-0.0564,-0.0211,0.1047,0.2389,-0.1862,0.1715,0.2677,-0.1736,0.2303,0.2733,-0.1742,0.2806,0.2637,-0.1913,0.3154,0.2441,-0.2191,0.3415,0.1718,-0.2945,0.4856,0.0569,-0.5001,0.3094,0.1113,-0.2681,0.2665,0.0986,-0.2439,0.2103,0.0978,-0.228,0.1575,0.1068,-0.2221,0.1175,0.12,-0.2189,0.088,0.133,-0.2157,0.498,0.0587,-0.6644,0.0967,-0.107,-0.1257,0.0443,0.0338,-0.0754,0.0381,-0.0884,-0.0219,0.0174,-0.1088,-0.0424,0.0384,-0.0959,-0.0436,0.0864,-0.1196,-0.1426,0.0093,-0.113,-0.0314,0.0064,-0.1227,-0.0842,0.0916,0.1657,-0.2322,0.0669,0.1573,-0.2077,0.0525,0.15,-0.1773,0.2703,0.1946,-0.2497,0.3067,0.2107,-0.2496],"uv":[0.4854,0.3185,0.4802,0.4252,0.4834,0.3939,0.4539,0.5428,0.4798,0.4607,0.4804,0.5081,0.484,0.6238,0.2669,0.6512,0.4859,0.702,0.4869,0.7491,0.4895,0.9464,0.4853,0.3053,0.4856,0.2924,0.4852,0.2831,0.4845,0.2835,0.484,0.2688,0.4839,0.2508,0.4832,0.2315,0.4833,0.1965,0.481,0.4075,0.4529,0.4095,0.1312,0.7889,0.3471,0.6129,0.3163,0.6126,0.2863,0.6154,0.251,0.637,0.3732,0.6173,0.3053,0.709,0.3409,0.7027,0.2726,0.7048,0.2514,0.6931,0.2173,0.6133,0.363,0.1369,0.2573,0.6599,0.1161,0.6341,0.1784,0.6367,0.3188,0.4651,0.4452,0.3271,0.4487,0.2936,0.4059,0.3163,0.3801,0.3055,0.4173,0.2934,0.3924,0.2919,0.3358,0.2576,0.4533,0.426,0.4489,0.4613,0.2011,0.7193,0.3881,0.5521,0.3804,0.4394,0.3782,0.4591,0.2192,0.4729,0.451,0.5051,0.2789,0.7517,0.2335,0.7421,0.1645,0.8511,0.4205,0.7087,0.3707,0.6863,0.3089,0.29,0.1536,0.2954,0.4056,0.4185,0.4317,0.4085,0.3457,0.2897,0.353,0.2899,0.2144,0.7661,0.3787,0.425,0.3406,0.7424,0.3348,0.7728,0.2999,0.9311,0.1885,0.8102,0.3191,0.8565,0.1801,0.7358,0.1536,0.7607,0.446,0.3092,0.4118,0.3041,0.3861,0.2993,0.4131,0.4121,0.3496,0.2899,0.3659,0.2825,0.3576,0.2894,0.4211,0.4286,0.3976,0.2872,0.4227,0.2868,0.4522,0.2848,0.4404,0.1975,0.444,0.235,0.4452,0.2547,0.4477,0.2713,0.451,0.2858,0.3963,0.2876,0.3906,0.282,0.3852,0.2737,0.381,0.2639,0.3454,0.342,0.1169,0.4756,0.482,0.4,0.3778,0.288,0.3718,0.2848,0.441,0.3957,0.3899,0.4054,0.4365,0.4015,0.3531,0.5326,0.2984,0.5112,0.3723,0.4441,0.219,0.8997,0.2421,0.8438,0.2668,0.7816,0.3635,0.2348,0.4104,0.7559,0.3981,0.8567,0.3869,0.945,0.2637,0.6234,0.1788,0.5889,0.3903,0.6241,0.2169,0.6788,0.4111,0.5739,0.3994,0.4509,0.1424,0.5639,0.201,0.5633,0.2429,0.5482,0.3062,0.551,0.352,0.5633,0.386,0.5771,0.453,0.6162,0.146,0.4888,0.1878,0.6821,0.4652,0.409,0.3901,0.5158,0.1084,0.6389,0.4119,0.5945,0.3698,0.4433,0.239,0.6576,0.3985,0.4747,0.13,0.3872,0.3908,0.6357,0.4238,0.4941,0.223,0.2155,0.2286,0.175,0.1187,0.4801,0.1802,0.261,0.1335,0.7033,0.3578,0.1026,0.4698,0.4012,0.36,0.4908,0.1489,0.6318,0.2918,0.6378,0.3161,0.6332,0.3615,0.2765,0.1523,0.4157,0.4178,0.059,0.3225,0.1012,0.2797,0.1308,0.4877,0.8539,0.4824,0.0536,0.3413,0.6331,0.3653,0.6345,0.3823,0.6342,0.1627,0.6904,0.3641,0.6628,0.3384,0.6747,0.3126,0.6786,0.2879,0.676,0.2729,0.6701,0.1146,0.722,0.2768,0.6444,0.4839,0.367,0.378,0.3584,0.4063,0.424,0.4392,0.367,0.4854,0.6645,0.2694,0.1699,0.3123,0.136,0.4142,0.0805,0.1882,0.2251,0.3825,0.6466,0.4314,0.5614,0.4819,0.0752,0.3667,0.0767,0.1303,0.4002,0.4216,0.2867,0.4162,0.2772,0.412,0.2639,0.4089,0.2468,0.3979,0.2129,0.3719,0.2914,0.3659,0.2941,0.361,0.2972,0.3202,0.3189,0.1926,0.3965,0.4327,0.5976,0.4168,0.6607,0.3961,0.6573,0.3783,0.2882,0.1913,0.312,0.4452,0.6585,0.3787,0.1743,0.4817,0.5475,0.4532,0.5782,0.4822,0.5843,0.4088,0.506,0.4815,0.1089,0.4827,0.1538,0.4287,0.1569,0.3057,0.2396,0.3423,0.4179,0.3402,0.2013,0.2648,0.4257,0.3105,0.3854,0.2364,0.3705,0.4173,0.1128,0.3898,0.4872,0.2784,0.2107,0.3214,0.1711,0.2764,0.2818,0.1615,0.3544,0.2355,0.2758,0.1477,0.3262,0.2834,0.3433,0.4117,0.5392,0.4106,0.4348,0.3908,0.4273,0.4227,0.4579,0.3934,0.6914,0.3419,0.7164,0.2959,0.7242,0.257,0.7188,0.2305,0.7041,0.2123,0.6477,0.113,0.5578,0.2359,0.5981,0.2675,0.5857,0.3103,0.584,0.3507,0.5894,0.3817,0.5984,0.4033,0.6079,0.1117,0.5586,0.3915,0.4186,0.4304,0.528,0.4322,0.4322,0.4501,0.4153,0.4334,0.4268,0.4001,0.4083,0.4549,0.4115,0.4596,0.405,0.4017,0.6335,0.4203,0.6261,0.431,0.6199,0.2644,0.6649,0.2382,0.6782,0.5094,0.5418,0.7085,0.6392,0.5122,0.4089,0.8638,0.7785,0.6278,0.6063,0.658,0.6044,0.6891,0.6066,0.7252,0.6252,0.6005,0.6124,0.6719,0.7001,0.6362,0.6958,0.7045,0.6936,0.7259,0.6808,0.7625,0.6022,0.6028,0.1327,0.7187,0.6475,0.8767,0.6217,0.8056,0.6239,0.6533,0.4591,0.5261,0.3273,0.5219,0.2941,0.5649,0.3161,0.5917,0.3055,0.5537,0.2931,0.5796,0.2928,0.6332,0.2535,0.507,0.4253,0.5111,0.4594,0.7787,0.7049,0.5837,0.5481,0.5871,0.4361,0.5896,0.4554,0.7583,0.464,0.5096,0.5046,0.6964,0.7409,0.7439,0.7286,0.8265,0.8419,0.5523,0.7051,0.6061,0.6819,0.6616,0.2864,0.8426,0.2831,0.5608,0.4161,0.5347,0.4079,0.6264,0.2902,0.6191,0.2903,0.7647,0.7516,0.5897,0.4222,0.6331,0.7346,0.6398,0.7646,0.6834,0.9257,0.7948,0.7997,0.6583,0.8507,0.802,0.7209,0.8339,0.7489,0.5248,0.3091,0.5592,0.304,0.5859,0.299,0.5543,0.4109,0.6237,0.2904,0.6059,0.2819,0.6152,0.2897,0.544,0.4268,0.5744,0.2883,0.5491,0.2871,0.5188,0.2845,0.5256,0.1972,0.5235,0.2344,0.5226,0.2537,0.5212,0.2718,0.5181,0.2847,0.5749,0.2879,0.5803,0.2822,0.5854,0.2727,0.5898,0.2625,0.6235,0.3388,0.8844,0.4618,0.5947,0.2885,0.5995,0.2852,0.5251,0.3952,0.5779,0.4029,0.5296,0.4005,0.62,0.5283,0.676,0.5046,0.5966,0.4409,0.7686,0.8922,0.7387,0.8354,0.7094,0.7698,0.6039,0.2311,0.5628,0.7518,0.5781,0.8536,0.5939,0.9424,0.7127,0.6135,0.804,0.5765,0.5838,0.6195,0.7623,0.6652,0.5591,0.5707,0.5653,0.4477,0.8449,0.552,0.7786,0.5526,0.7335,0.5393,0.6688,0.5444,0.6218,0.5579,0.5862,0.5735,0.5153,0.6151,0.84,0.4763,0.7938,0.6681,0.4967,0.4091,0.5809,0.5121,0.8916,0.6272,0.5601,0.5919,0.6003,0.4399,0.7382,0.6446,0.5677,0.4715,0.8702,0.3732,0.5833,0.6309,0.5391,0.4917,0.7556,0.2053,0.7529,0.1656,0.8758,0.4671,0.8044,0.2501,0.8571,0.6912,0.6086,0.0981,0.4945,0.4015,0.6122,0.4865,0.8382,0.6185,0.682,0.6287,0.6583,0.6253,0.6108,0.2771,0.8349,0.4038,0.5472,0.0563,0.6481,0.0947,0.6952,0.1232,0.6323,0.6262,0.6089,0.6286,0.5925,0.6295,0.8231,0.6764,0.6106,0.6576,0.6368,0.6682,0.6636,0.67,0.6874,0.6655,0.7029,0.6582,0.8835,0.7116,0.6975,0.6337,0.5898,0.3561,0.5599,0.4214,0.5283,0.3662,0.7034,0.1625,0.657,0.1295,0.5494,0.0771,0.801,0.2139,0.592,0.6423,0.5355,0.5589,0.6003,0.0718,0.8638,0.3863,0.5493,0.2872,0.5536,0.2764,0.5578,0.2621,0.5602,0.2458,0.5689,0.2106,0.6007,0.2911,0.6059,0.2945,0.6112,0.297,0.6502,0.3145,0.7884,0.3862,0.5362,0.5956,0.5573,0.6578,0.579,0.6536,0.5937,0.289,0.7903,0.3011,0.5264,0.6567,0.5876,0.1711,0.5124,0.5769,0.5589,0.5035,0.5363,0.1544,0.6654,0.2336,0.6282,0.4136,0.6283,0.1973,0.7098,0.4177,0.6616,0.3801,0.7396,0.3622,0.5467,0.1101,0.5799,0.4837,0.6929,0.2034,0.6476,0.1657,0.6957,0.2762,0.8245,0.343,0.7408,0.2665,0.8435,0.3134,0.6886,0.3372,0.5573,0.5364,0.5531,0.4325,0.5753,0.4239,0.5394,0.4558,0.582,0.6871,0.6343,0.7096,0.6804,0.714,0.7198,0.7066,0.747,0.6912,0.7674,0.6345,0.8804,0.5446,0.7424,0.5872,0.7088,0.5772,0.6647,0.5766,0.6234,0.5837,0.592,0.594,0.5689,0.6041,0.89,0.546,0.5757,0.4162,0.5347,0.5265,0.5298,0.4308,0.5137,0.4148,0.53,0.4249,0.5677,0.4063,0.5073,0.4115,0.505,0.4039,0.5717,0.6298,0.5524,0.6232,0.5411,0.6174,0.7117,0.6524,0.7402,0.665],"i":[54,68,21,298,284,251,162,139,127,389,301,251,301,298,251,58,215,192,71,162,21,71,139,162,68,71,21,109,69,67,108,109,10,108,69,109,368,389,356,368,301,389,366,454,323,454,366,447,288,397,367,434,416,367,416,288,367,205,207,187,207,205,206,93,137,123,234,137,93,215,213,192,213,207,192,207,213,187,147,93,123,147,177,93,213,147,187,138,58,192,58,138,172,200,201,83,67,104,103,69,104,67,104,54,103,104,68,54,333,297,332,284,333,332,298,333,284,338,337,10,366,352,447,352,345,447,376,366,323,376,352,366,352,376,280,435,416,433,416,435,288,207,214,192,214,138,192,138,214,172,50,205,187,50,147,123,147,50,187,137,227,123,227,137,234,147,132,177,132,147,213,132,213,215,58,132,215,177,132,93,176,171,148,175,377,152,377,175,396,148,175,152,171,175,148,201,199,208,200,199,201,199,171,208,199,175,171,141,164,167,391,269,393,270,269,391,436,434,432,84,17,83,18,200,83,17,18,83,139,34,127,34,234,127,368,300,301,346,352,280,352,346,345,337,299,296,333,299,297,299,338,297,299,337,338,151,108,10,337,151,10,151,107,108,361,435,433,435,361,288,365,364,397,397,364,367,364,434,367,116,143,111,227,116,123,116,227,234,34,116,234,116,34,143,43,204,202,201,182,83,182,84,83,136,169,150,32,201,208,214,135,172,135,136,172,400,377,396,421,199,200,164,37,167,0,37,164,164,326,393,274,4,275,4,274,1,2,370,164,141,2,164,236,3,51,236,174,3,205,203,206,363,440,275,278,331,294,329,348,330,269,267,393,267,164,393,267,0,164,287,436,432,270,322,409,322,270,391,376,411,280,411,376,433,416,411,433,427,416,434,436,427,434,427,411,416,425,330,280,411,425,280,427,425,411,181,180,85,84,181,85,182,181,84,180,181,91,313,17,314,313,18,17,406,313,314,421,313,406,18,313,200,313,421,200,71,70,139,143,35,111,35,31,111,31,35,226,52,66,65,108,66,69,66,107,65,107,66,108,104,63,68,70,63,46,63,71,68,63,70,71,299,334,296,334,299,333,264,368,356,264,372,368,372,264,345,345,264,447,454,264,356,264,454,447,372,383,368,383,300,368,340,372,345,346,340,345,330,347,280,347,346,280,348,347,330,195,419,248,122,193,6,193,244,189,441,286,414,336,151,337,336,337,296,376,401,433,401,361,433,401,376,323,361,401,323,179,178,81,43,106,204,106,182,204,181,106,91,106,181,182,57,43,202,212,57,202,216,207,206,216,214,207,216,212,214,57,216,186,216,57,212,92,216,206,216,92,186,37,39,167,204,210,202,210,135,214,210,169,136,135,210,136,210,212,202,212,210,214,211,210,204,210,211,169,182,194,204,194,211,204,211,194,32,194,182,201,32,194,201,369,400,396,400,369,378,375,273,321,273,335,321,335,405,321,406,405,335,405,404,321,405,406,314,428,421,262,428,369,396,369,428,262,421,428,199,175,428,396,199,428,175,421,418,262,418,421,406,418,431,262,394,364,365,379,394,365,15,16,85,16,84,85,84,16,17,17,16,314,274,354,1,1,354,19,354,370,19,326,328,393,97,141,167,44,4,1,94,141,19,94,2,141,370,94,19,2,94,370,217,126,47,236,217,174,203,64,98,64,203,129,134,236,51,457,274,275,440,457,275,348,349,450,329,349,348,279,278,344,278,279,331,355,429,420,437,355,420,403,319,404,316,403,404,404,320,321,319,320,404,408,270,409,267,302,0,291,273,375,273,291,287,425,266,330,426,427,436,426,425,427,327,455,294,305,328,290,328,305,393,50,101,205,118,101,50,107,222,65,114,217,47,217,114,174,174,114,188,114,128,188,35,124,226,31,117,111,117,116,111,116,117,123,117,50,123,117,118,50,25,31,226,105,63,104,105,104,69,66,105,69,105,66,52,63,53,46,224,53,52,53,105,52,105,53,63,334,282,296,340,265,372,353,265,446,383,265,353,265,383,372,449,348,450,449,347,348,5,195,248,5,4,51,3,5,51,195,5,3,122,196,188,196,174,188,174,196,3,196,195,3,245,122,188,128,245,188,245,193,122,193,245,244,363,456,420,456,437,420,285,336,441,151,9,107,336,9,151,285,9,336,39,165,167,165,240,167,240,165,98,165,203,98,165,40,92,40,165,39,165,92,206,203,165,206,73,39,37,92,185,186,40,185,92,149,140,176,140,149,32,140,32,208,171,140,208,176,140,171,170,211,32,149,170,32,170,149,150,169,170,150,211,170,169,422,287,432,422,273,287,418,424,431,424,406,335,424,418,406,273,424,335,422,424,273,395,379,378,431,395,262,394,395,431,395,394,379,369,395,378,395,369,262,86,15,85,86,82,15,86,87,82,87,86,81,86,179,81,180,86,85,179,86,180,82,14,15,315,16,15,316,315,15,16,315,314,315,316,404,315,405,314,405,315,404,250,328,326,125,44,1,125,1,19,141,125,19,99,75,60,99,97,167,240,99,167,75,99,240,452,451,350,451,349,350,349,451,450,360,279,344,279,360,429,440,360,344,360,440,363,360,363,420,429,360,420,277,355,437,277,343,350,343,277,437,355,277,329,349,277,350,277,349,329,310,403,271,311,403,316,311,302,271,304,269,270,304,272,269,307,375,321,320,307,321,303,267,269,303,302,267,302,303,271,303,310,271,272,303,269,310,303,272,307,308,375,308,408,409,308,307,408,291,410,287,287,410,436,322,410,409,410,291,409,410,426,436,426,410,322,371,279,429,371,355,329,355,371,429,371,329,330,266,371,330,423,322,391,423,426,322,327,423,391,423,327,294,423,266,425,426,423,425,439,278,294,455,439,294,278,439,344,305,309,392,309,305,290,309,457,440,460,455,327,305,460,393,460,391,393,460,327,391,119,118,229,119,101,118,221,222,107,27,222,28,222,27,65,121,114,47,114,121,128,156,35,143,156,124,35,156,34,139,34,156,143,70,156,139,156,70,46,124,156,46,247,225,30,225,224,30,53,225,46,225,53,224,124,113,226,113,225,247,113,124,46,225,113,46,130,25,226,113,130,226,130,113,247,25,228,31,118,228,229,117,228,118,228,117,31,442,286,441,254,449,450,197,122,6,197,196,122,197,419,195,196,197,195,374,380,385,413,464,417,413,441,414,285,413,417,413,285,441,464,465,417,281,5,248,456,281,248,281,456,363,281,363,275,4,281,275,5,281,4,357,452,350,343,357,350,456,399,437,399,343,437,399,456,248,419,399,248,8,285,417,8,9,285,178,41,81,41,178,179,74,40,39,73,74,39,61,57,186,185,61,186,57,61,43,430,394,431,424,430,431,430,424,422,394,430,364,364,430,434,434,430,432,430,422,432,72,37,0,72,73,37,72,41,73,41,72,81,302,11,0,11,72,0,14,13,15,461,354,274,457,459,274,459,309,290,309,459,457,99,20,97,198,209,126,134,198,236,217,198,126,198,217,236,203,36,129,36,203,205,101,36,205,44,45,4,4,45,51,45,134,51,45,220,134,220,131,134,131,198,134,198,131,209,209,131,49,403,318,319,310,318,403,318,272,319,318,310,272,403,402,271,402,311,271,311,402,403,311,268,302,268,11,302,415,304,270,272,415,319,304,415,272,415,320,319,308,292,375,292,308,409,423,358,266,358,371,266,331,358,294,358,423,294,279,358,331,371,358,279,309,438,392,439,438,344,438,439,392,438,440,344,438,309,440,289,305,392,289,460,305,460,289,455,439,289,392,289,439,455,142,36,101,209,142,126,142,209,49,142,49,129,36,142,129,190,221,189,222,56,28,221,56,222,158,56,157,56,158,28,56,190,157,190,56,221,145,24,144,27,159,160,145,159,158,158,159,28,159,27,28,160,159,144,159,145,144,223,52,65,27,223,65,223,224,52,29,27,160,224,29,30,223,29,224,29,223,27,26,231,22,233,245,128,245,233,244,246,247,30,228,110,229,110,228,25,110,24,229,282,295,296,295,336,296,336,295,441,295,442,441,276,383,353,383,276,300,254,253,373,253,374,373,253,254,450,451,253,450,252,253,451,374,253,380,253,252,380,380,384,385,384,286,385,286,384,414,351,197,6,197,351,419,417,351,6,465,351,417,453,465,464,453,357,465,357,453,452,357,412,465,351,412,419,412,351,465,412,399,419,412,357,343,399,412,343,168,417,6,168,8,417,193,168,6,8,168,193,55,8,193,55,193,189,221,55,189,55,221,107,9,55,107,8,55,9,41,80,73,80,41,179,80,179,180,90,180,91,74,183,40,61,146,43,106,146,91,146,106,43,11,38,72,87,38,82,38,87,81,72,38,81,12,13,14,12,14,82,268,12,11,38,12,82,12,38,11,458,461,274,461,458,250,459,458,274,458,459,290,328,458,290,250,458,328,462,461,250,462,250,326,354,462,370,461,462,354,370,462,164,462,326,164,75,79,60,79,239,60,235,240,98,64,235,98,219,235,64,48,64,129,48,219,64,125,241,44,242,125,141,97,242,141,20,242,97,242,241,125,241,242,20,131,115,49,115,48,49,115,220,218,115,131,220,219,115,218,48,115,219,252,381,380,381,384,380,307,407,408,408,407,270,407,415,270,306,291,375,292,306,375,291,306,409,306,292,409,126,100,47,142,100,126,119,100,101,100,142,101,145,23,24,231,23,22,153,158,157,153,145,158,23,153,22,153,23,145,121,232,128,232,233,128,231,232,121,232,231,26,130,33,25,33,130,247,246,33,247,161,246,30,29,161,30,161,29,160,386,374,385,374,386,373,386,387,373,283,282,334,254,339,449,347,448,346,449,448,347,339,448,449,448,339,255,384,398,414,398,381,382,381,398,384,463,453,464,463,413,414,413,463,464,42,74,73,80,42,73,184,185,40,183,184,40,76,61,185,76,146,61,12,317,13,317,12,268,317,316,15,13,317,15,79,237,239,45,237,220,220,237,218,237,79,218,239,237,44,237,45,44,166,219,218,166,235,219,79,166,218,166,79,75,49,102,129,102,48,129,48,102,49,241,238,44,238,241,20,238,239,44,239,238,60,238,99,60,238,20,99,256,381,252,256,451,452,256,252,451,381,256,382,325,407,307,325,307,320,100,120,47,120,121,47,120,231,121,120,100,119,230,23,231,230,120,119,120,230,231,230,119,229,24,230,229,23,230,24,154,153,157,154,26,22,153,154,22,233,243,244,244,243,189,243,190,189,243,133,190,112,232,26,232,112,233,112,243,233,243,112,133,33,7,25,7,33,246,161,7,246,387,257,259,386,257,387,283,444,282,293,283,334,293,333,298,293,334,333,301,293,298,300,293,301,276,293,300,283,293,276,261,340,346,448,261,346,265,261,446,261,265,340,261,255,446,261,448,255,387,390,373,390,254,373,390,339,254,444,260,259,342,353,446,342,276,353,463,341,453,256,341,382,453,341,452,341,256,452,89,80,180,90,89,180,77,184,183,146,77,91,312,268,311,312,317,268,312,311,316,317,312,316,235,59,240,166,59,235,59,75,240,59,166,75,407,324,415,325,324,407,415,324,320,324,325,320,173,154,157,190,173,157,133,173,190,112,155,133,155,173,133,173,155,154,154,155,26,155,112,26,163,7,161,163,160,144,163,161,160,24,163,144,110,163,24,163,110,25,7,163,25,257,258,442,258,257,386,258,386,385,286,258,385,442,258,286,257,443,259,444,443,282,443,444,259,443,295,282,295,443,442,443,257,442,388,390,387,388,260,466,388,387,259,260,388,259,339,249,255,390,249,339,249,388,466,388,249,390,445,444,283,445,260,444,445,283,276,342,445,276,260,467,466,445,467,260,467,445,342,341,362,382,362,341,463,362,398,382,398,362,414,362,463,414,88,42,80,89,88,80,88,89,42,89,191,42,191,183,74,42,191,74,191,89,90,76,62,146,62,76,185,255,359,446,359,342,446,359,467,342,95,191,90,191,95,183,77,78,184,184,78,185,78,62,185,78,77,146,62,78,146,467,263,466,359,263,467,263,249,466,249,263,255,263,359,255,96,77,183,95,96,183,96,95,90,96,90,91,77,96,91],"tex":"data:...BASE64_BO_BOT...","skin":"#d4a08b","ring":[10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109],"hgt":1.14},"me":{"v":[-0.004,-0.2895,-0.1541,-0.0048,-0.1622,-0.0,-0.0037,-0.1959,-0.1268,-0.0403,0.0086,-0.0268,-0.0047,-0.1134,0.0238,-0.0042,-0.0448,0.0186,-0.0009,0.1292,-0.0629,-0.3015,0.1838,-0.2373,0.0003,0.2636,-0.0684,0.0014,0.333,-0.0429,0.0044,0.6072,-0.0294,-0.0042,-0.3073,-0.1641,-0.0042,-0.3251,-0.181,-0.0054,-0.3386,-0.2057,-0.0052,-0.3381,-0.2057,-0.0057,-0.3611,-0.205,-0.0058,-0.3878,-0.2,-0.0071,-0.4144,-0.2109,-0.0068,-0.4479,-0.2606,-0.0043,-0.1839,-0.027,-0.0443,-0.1764,-0.0895,-0.4762,0.4046,-0.3976,-0.1892,0.1335,-0.1972,-0.2308,0.1334,-0.2018,-0.272,0.1368,-0.2142,-0.3234,0.1661,-0.2494,-0.1541,0.1376,-0.2004,-0.2561,0.2738,-0.1622,-0.2046,0.2641,-0.1603,-0.3024,0.2668,-0.1795,-0.3309,0.2486,-0.2002,-0.3665,0.1378,-0.2785,-0.1602,-0.5033,-0.3373,-0.3169,0.1962,-0.2503,-0.4922,0.188,-0.4699,-0.4183,0.1762,-0.3157,-0.2287,-0.0745,-0.2016,-0.0594,-0.2768,-0.1579,-0.0571,-0.3204,-0.1878,-0.1118,-0.2831,-0.1875,-0.1472,-0.2875,-0.2256,-0.1004,-0.314,-0.2066,-0.1339,-0.3081,-0.2403,-0.2059,-0.337,-0.3148,-0.0401,-0.1599,-0.0036,-0.0455,-0.1107,0.0183,-0.3969,0.2917,-0.2027,-0.133,0.0405,-0.1684,-0.1378,-0.1251,-0.1108,-0.1407,-0.0961,-0.1195,-0.3652,-0.0531,-0.2595,-0.0435,-0.0473,0.004,-0.2958,0.3333,-0.1157,-0.3559,0.3222,-0.1541,-0.4376,0.4859,-0.2911,-0.0998,0.2738,-0.0812,-0.161,0.238,-0.1753,-0.2419,-0.2897,-0.3146,-0.4337,-0.2529,-0.7024,-0.1049,-0.1552,-0.1323,-0.0711,-0.1711,-0.1342,-0.1979,-0.29,-0.3112,-0.1883,-0.2935,-0.2993,-0.3809,0.3584,-0.1676,-0.1401,-0.1407,-0.14,-0.2125,0.3203,-0.0895,-0.22,0.3649,-0.0703,-0.2611,0.5893,-0.095,-0.4098,0.4234,-0.2188,-0.2367,0.4799,-0.0776,-0.4227,0.319,-0.2338,-0.4516,0.359,-0.3094,-0.0597,-0.2994,-0.1684,-0.106,-0.2987,-0.196,-0.1406,-0.2965,-0.2299,-0.0957,-0.1631,-0.1437,-0.1928,-0.2916,-0.3048,-0.1706,-0.3118,-0.2814,-0.1826,-0.2961,-0.2982,-0.0851,-0.1488,-0.0665,-0.1282,-0.3166,-0.2502,-0.0941,-0.3245,-0.2284,-0.0532,-0.3332,-0.2111,-0.0664,-0.4441,-0.2642,-0.0635,-0.4061,-0.2149,-0.0617,-0.3792,-0.2052,-0.0579,-0.3541,-0.211,-0.0532,-0.3321,-0.2119,-0.1286,-0.3158,-0.2521,-0.1366,-0.3234,-0.2494,-0.1445,-0.3346,-0.2472,-0.15,-0.3472,-0.2585,-0.1922,-0.2386,-0.2295,-0.4844,-0.0099,-0.7069,-0.0042,-0.1919,-0.0908,-0.1536,-0.3073,-0.2794,-0.1625,-0.3103,-0.2786,-0.0598,-0.1887,-0.1392,-0.1278,-0.1645,-0.1794,-0.0652,-0.1808,-0.1349,-0.1807,0.0174,-0.1911,-0.2574,-0.008,-0.2116,-0.1489,-0.1129,-0.1491,-0.3694,0.5491,-0.1859,-0.3416,0.4657,-0.1436,-0.3122,0.3775,-0.1124,-0.1691,-0.3771,-0.2971,-0.1144,0.3414,-0.049,-0.1258,0.4778,-0.0417,-0.1401,0.6068,-0.0427,-0.3041,0.1476,-0.233,-0.4164,0.1082,-0.3104,-0.1311,0.1453,-0.2035,-0.3735,0.2302,-0.2405,-0.1023,0.0672,-0.1463,-0.1137,-0.1156,-0.0631,-0.4599,0.0824,-0.3694,-0.3881,0.0707,-0.2781,-0.3328,0.0476,-0.24,-0.2466,0.0482,-0.2182,-0.1833,0.0624,-0.2034,-0.1375,0.0787,-0.1858,-0.0436,0.1198,-0.0825,-0.4552,-0.0189,-0.3799,-0.4098,0.2395,-0.2581,-0.0256,-0.1812,-0.0297,-0.1282,-0.0127,-0.1599,-0.5,0.2075,-0.6159,-0.1028,0.1005,-0.1721,-0.1535,-0.1101,-0.1946,-0.3436,0.1951,-0.2605,-0.1147,-0.08,-0.0737,-0.4654,-0.1285,-0.716,-0.131,0.1616,-0.2095,-0.0807,-0.0585,-0.0258,-0.339,-0.3788,-0.4862,-0.3284,-0.4231,-0.5812,-0.4842,-0.0177,-0.5428,-0.3984,-0.3144,-0.5284,-0.4739,0.2813,-0.3996,-0.1632,-0.5427,-0.3758,-0.0208,-0.1901,-0.0935,-0.17,-0.0425,-0.1844,-0.4542,0.174,-0.3613,-0.2647,0.1666,-0.2125,-0.2312,0.1617,-0.2018,-0.1763,-0.3179,-0.2909,-0.4454,-0.1152,-0.4184,-0.0887,-0.5982,-0.4015,-0.205,-0.5307,-0.4786,-0.2591,-0.4866,-0.5239,0.0024,0.4732,-0.0302,-0.0105,-0.6072,-0.3887,-0.1973,0.1619,-0.1987,-0.1648,0.1626,-0.2035,-0.1418,0.1605,-0.2103,-0.4408,0.2557,-0.3003,-0.1696,0.2022,-0.1875,-0.2064,0.2211,-0.1791,-0.2427,0.2268,-0.1816,-0.2766,0.2223,-0.1948,-0.2965,0.2127,-0.2113,-0.4943,0.3162,-0.5143,-0.2863,0.1748,-0.2261,-0.004,-0.2282,-0.1463,-0.1456,-0.2248,-0.197,-0.1039,-0.1501,-0.1122,-0.0637,-0.2248,-0.1518,0.0001,0.199,-0.0814,-0.2751,-0.4424,-0.4563,-0.22,-0.4917,-0.4198,-0.0931,-0.5772,-0.337,-0.3853,-0.3512,-0.6492,-0.143,0.177,-0.1998,-0.0727,0.0413,-0.0864,-0.0102,-0.5865,-0.3268,-0.1507,-0.5698,-0.4318,-0.468,-0.1244,-0.5621,-0.0941,-0.325,-0.2298,-0.1017,-0.3389,-0.2271,-0.108,-0.3583,-0.2241,-0.1125,-0.382,-0.2346,-0.124,-0.4164,-0.2768,-0.1614,-0.3004,-0.2713,-0.1686,-0.2946,-0.2709,-0.1743,-0.2892,-0.2687,-0.2273,-0.2597,-0.2693,-0.3968,-0.1494,-0.3311,-0.0725,0.0966,-0.117,-0.0987,0.1973,-0.1701,-0.125,0.193,-0.1885,-0.1541,-0.3074,-0.2775,-0.3916,-0.2549,-0.426,-0.0588,0.193,-0.1129,-0.1445,-0.4592,-0.309,-0.0029,0.0136,-0.0102,-0.042,0.0612,-0.0487,-0.0028,0.0681,-0.0369,-0.1026,-0.0333,-0.1031,-0.0099,-0.5492,-0.2907,-0.008,-0.4971,-0.2767,-0.0787,-0.4902,-0.2862,-0.2385,-0.3586,-0.3437,-0.1928,-0.1397,-0.2141,-0.1941,-0.4149,-0.3306,-0.3032,-0.1231,-0.2329,-0.2381,-0.1791,-0.236,-0.3386,-0.1899,-0.2868,-0.0906,-0.5413,-0.3022,-0.1271,-0.0547,-0.1416,-0.269,-0.3942,-0.3934,-0.2133,-0.4514,-0.3736,-0.28,-0.3005,-0.3341,-0.4306,-0.195,-0.4535,-0.3314,-0.3069,-0.3782,-0.4431,-0.2245,-0.5683,-0.2745,-0.2263,-0.2716,-0.0994,0.0151,-0.1258,-0.0987,-0.1401,-0.0558,-0.124,-0.1434,-0.1087,-0.0812,-0.1117,-0.0204,-0.1341,0.2458,-0.149,-0.2072,0.2832,-0.139,-0.2716,0.2943,-0.1447,-0.324,0.2866,-0.1666,-0.3585,0.2657,-0.1976,-0.3762,0.1863,-0.2806,-0.4932,0.0856,-0.509,-0.3415,0.1154,-0.2594,-0.2979,0.0976,-0.2347,-0.2393,0.094,-0.2164,-0.1847,0.1,-0.2046,-0.1433,0.1103,-0.199,-0.1149,0.1215,-0.1924,-0.4937,0.1016,-0.6748,-0.1232,-0.1522,-0.1332,-0.073,-0.0083,-0.0621,-0.069,-0.1486,-0.0231,-0.0476,-0.1702,-0.0463,-0.069,-0.1537,-0.0457,-0.1132,-0.1646,-0.1518,-0.0401,-0.1769,-0.0359,-0.0347,-0.1837,-0.0918,-0.1165,0.1578,-0.2034,-0.0925,0.1462,-0.1787,-0.0773,0.1352,-0.1513,-0.308,0.2042,-0.2286,-0.3469,0.226,-0.2294,0.0337,0.0072,-0.0261,0.3008,0.1694,-0.2331,0.0364,-0.178,-0.0893,0.4784,0.3859,-0.3909,0.1887,0.1249,-0.1941,0.2292,0.1227,-0.1983,0.2705,0.1253,-0.2104,0.3213,0.1514,-0.2447,0.1526,0.1312,-0.198,0.2574,0.2635,-0.1581,0.2061,0.2557,-0.1571,0.3028,0.2543,-0.1753,0.3311,0.2349,-0.1957,0.3647,0.1229,-0.2733,0.1439,-0.5079,-0.3355,0.3153,0.1817,-0.2457,0.4892,0.1679,-0.4633,0.4165,0.1592,-0.31,0.223,-0.0844,-0.1987,0.0513,-0.2784,-0.1571,0.0464,-0.3217,-0.1872,0.1009,-0.2863,-0.1862,0.1365,-0.2921,-0.2235,0.0884,-0.318,-0.2055,0.1224,-0.312,-0.2389,0.1942,-0.3455,-0.3121,0.0299,-0.1613,-0.0032,0.0363,-0.1135,0.019,0.3986,0.279,-0.1977,0.1297,0.0347,-0.1664,0.1301,-0.1313,-0.1094,0.1327,-0.1024,-0.1179,0.3608,-0.0674,-0.2546,0.0344,-0.0481,0.0049,0.2992,0.3246,-0.1124,0.3591,0.3108,-0.1499,0.4417,0.4692,-0.285,0.1023,0.2706,-0.0802,0.1625,0.2322,-0.1727,0.2318,-0.2988,-0.3112,0.433,-0.2715,-0.6967,0.096,-0.16,-0.1313,0.0631,-0.1731,-0.1337,0.1845,-0.2977,-0.3085,0.175,-0.3009,-0.2967,0.3837,0.3464,-0.163,0.1322,-0.1467,-0.1385,0.2159,0.3136,-0.0872,0.2248,0.3578,-0.068,0.269,0.5791,-0.0912,0.4105,0.4091,-0.2136,0.2413,0.4716,-0.0751,0.4238,0.3052,-0.2283,0.4513,0.3426,-0.3035,0.0501,-0.3015,-0.1678,0.0949,-0.3022,-0.1948,0.13,-0.3019,-0.2282,0.0879,-0.1666,-0.1431,0.181,-0.2992,-0.3023,0.1581,-0.3192,-0.2793,0.1703,-0.3034,-0.2957,0.0773,-0.1523,-0.0657,0.1155,-0.3199,-0.2489,0.0825,-0.3279,-0.2274,0.0418,-0.3354,-0.2106,0.0526,-0.4449,-0.2637,0.0501,-0.4086,-0.2143,0.0492,-0.3822,-0.2048,0.0469,-0.3555,-0.2104,0.042,-0.3356,-0.2115,0.1166,-0.3205,-0.2509,0.1245,-0.3282,-0.248,0.1321,-0.3407,-0.2456,0.138,-0.3533,-0.2568,0.1821,-0.246,-0.2272,0.4866,-0.0322,-0.6992,0.1418,-0.3129,-0.2775,0.1491,-0.3163,-0.2766,0.0515,-0.1903,-0.1387,0.1185,-0.1705,-0.1783,0.0568,-0.1834,-0.1345,0.1774,0.0108,-0.1888,0.2538,-0.0185,-0.2081,0.1412,-0.1191,-0.1476,0.376,0.5352,-0.1809,0.3447,0.4545,-0.1393,0.3162,0.3678,-0.1091,0.1564,-0.3837,-0.2949,0.1177,0.3375,-0.0482,0.131,0.473,-0.0399,0.1489,0.6017,-0.0411,0.303,0.1353,-0.2287,0.4131,0.0905,-0.3047,0.1306,0.139,-0.2011,0.3733,0.2151,-0.2355,0.0983,0.0629,-0.1447,0.1051,-0.1211,-0.0619,0.4574,0.064,-0.3622,0.3855,0.0548,-0.2725,0.3309,0.034,-0.2353,0.2457,0.0384,-0.2147,0.1818,0.0547,-0.2006,0.135,0.0736,-0.1838,0.0408,0.1185,-0.0818,0.4518,-0.0385,-0.3733,0.4087,0.2239,-0.2528,0.0162,-0.1813,-0.0294,0.1241,-0.0182,-0.1581,0.5,0.1866,-0.6076,0.1015,0.0968,-0.1707,0.1463,-0.1167,-0.1928,0.3419,0.1795,-0.2557,0.1075,-0.085,-0.0725,0.4675,-0.1499,-0.7096,0.1294,0.1555,-0.2071,0.0726,-0.0619,-0.0248,0.3294,-0.3929,-0.481,0.3195,-0.4359,-0.5758,0.4836,-0.0383,-0.5363,0.3916,-0.3307,-0.5228,0.4722,0.2625,-0.3935,0.1459,-0.5471,-0.3732,0.0125,-0.1898,-0.0933,0.1655,-0.0497,-0.1822,0.4509,0.1558,-0.3545,0.2629,0.1558,-0.2087,0.2307,0.1519,-0.1981,0.1647,-0.3236,-0.2883,0.4432,-0.1341,-0.4117,0.0685,-0.6008,-0.4,0.1887,-0.538,-0.4757,0.2457,-0.4958,-0.5199,0.1954,0.153,-0.1956,0.1636,0.1547,-0.2006,0.1416,0.1543,-0.2078,0.4405,0.239,-0.2939,0.1663,0.1956,-0.1846,0.2028,0.2129,-0.1757,0.2406,0.216,-0.1777,0.2735,0.2093,-0.1907,0.2947,0.198,-0.2071,0.4952,0.2967,-0.5071,0.2849,0.1617,-0.2223,0.1357,-0.2306,-0.1952,0.0956,-0.155,-0.1111,0.0556,-0.227,-0.1511,0.2612,-0.4516,-0.4523,0.2043,-0.4992,-0.4167,0.0735,-0.5806,-0.3356,0.381,-0.3676,-0.643,0.1413,0.1718,-0.1971,0.0674,0.0381,-0.0853,0.1321,-0.5747,-0.4293,0.4667,-0.1456,-0.5555,0.0837,-0.3282,-0.2288,0.09,-0.3439,-0.2263,0.0966,-0.3642,-0.223,0.0997,-0.3861,-0.2335,0.111,-0.4203,-0.2751,0.1495,-0.3071,-0.2694,0.156,-0.3004,-0.2687,0.1623,-0.2959,-0.2663,0.2177,-0.2697,-0.2665,0.3923,-0.1661,-0.3259,0.0686,0.0939,-0.1161,0.0991,0.1934,-0.1686,0.1255,0.188,-0.1859,0.1406,-0.3124,-0.2757,0.3846,-0.2718,-0.4206,0.0586,0.1905,-0.1121,0.1301,-0.4631,-0.3073,0.0371,0.0595,-0.0482,0.0966,-0.0369,-0.102,0.0631,-0.4933,-0.2849,0.2281,-0.3681,-0.3407,0.185,-0.1479,-0.212,0.1814,-0.4205,-0.3279,0.2981,-0.136,-0.2291,0.2313,-0.1887,-0.2332,0.3318,-0.2034,-0.2823,0.0732,-0.5444,-0.3011,0.1215,-0.06,-0.1401,0.2558,-0.404,-0.3896,0.1998,-0.4579,-0.3707,0.2699,-0.3105,-0.3305,0.4265,-0.2127,-0.4477,0.3229,-0.3209,-0.3734,0.4407,-0.2437,-0.5621,0.2653,-0.2375,-0.2681,0.0948,0.0113,-0.1243,0.0892,-0.144,-0.0547,0.115,-0.1498,-0.1075,0.0725,-0.1151,-0.0191,0.1362,0.2409,-0.147,0.2101,0.2763,-0.1363,0.274,0.2838,-0.1412,0.3258,0.2741,-0.1624,0.3592,0.2526,-0.193,0.3744,0.1697,-0.2756,0.4905,0.0644,-0.5019,0.3404,0.1005,-0.2544,0.2962,0.0857,-0.2304,0.2379,0.0838,-0.2129,0.183,0.0923,-0.2018,0.142,0.1045,-0.1971,0.1121,0.1166,-0.1907,0.4959,0.08,-0.6671,0.1148,-0.1575,-0.1317,0.0666,-0.0103,-0.0612,0.0601,-0.1512,-0.0221,0.0391,-0.1715,-0.0461,0.0602,-0.1573,-0.0449,0.1051,-0.1696,-0.1508,0.0303,-0.1774,-0.0353,0.0265,-0.1858,-0.0914,0.1151,0.1528,-0.2014,0.091,0.1422,-0.1775,0.0769,0.1316,-0.1501,0.3065,0.1892,-0.2243,0.3476,0.2111,-0.2248],"uv":[0.4971,0.2871,0.4965,0.3807,0.4973,0.356,0.4704,0.5063,0.4965,0.4166,0.4969,0.4671,0.4993,0.595,0.2783,0.6351,0.5002,0.6938,0.501,0.7448,0.5033,0.9464,0.4969,0.274,0.4969,0.261,0.496,0.251,0.4962,0.2514,0.4958,0.2345,0.4957,0.2149,0.4948,0.1953,0.495,0.1707,0.4968,0.3648,0.4674,0.3703,0.1499,0.7975,0.3609,0.5981,0.3303,0.5981,0.3,0.6006,0.2622,0.6221,0.3867,0.6012,0.3117,0.7013,0.3496,0.6942,0.2776,0.6961,0.2567,0.6828,0.2305,0.6013,0.3822,0.13,0.267,0.6443,0.1381,0.6382,0.1925,0.6296,0.3318,0.4453,0.4563,0.2965,0.458,0.2644,0.4178,0.2918,0.3918,0.2886,0.4262,0.2691,0.4016,0.2735,0.3486,0.2522,0.4705,0.3824,0.4666,0.4186,0.2082,0.7145,0.4022,0.5298,0.3987,0.408,0.3966,0.4293,0.2315,0.4609,0.468,0.4652,0.2825,0.7451,0.2383,0.7369,0.1782,0.8572,0.4266,0.7013,0.3816,0.675,0.3221,0.287,0.1811,0.314,0.4229,0.3859,0.4477,0.3742,0.3545,0.2868,0.3615,0.2842,0.2199,0.7635,0.397,0.3965,0.3437,0.7355,0.3382,0.7683,0.308,0.9333,0.1987,0.8113,0.3259,0.8528,0.1892,0.7345,0.168,0.764,0.4561,0.2799,0.4221,0.2804,0.3966,0.282,0.4296,0.3801,0.3583,0.2856,0.3746,0.2708,0.3658,0.2823,0.4374,0.3906,0.4058,0.2673,0.4308,0.2614,0.4609,0.255,0.4512,0.1735,0.4533,0.2014,0.4546,0.2212,0.4574,0.2397,0.4609,0.2559,0.4055,0.2678,0.3996,0.2622,0.3938,0.254,0.3897,0.2447,0.3587,0.3246,0.1439,0.4927,0.4969,0.3589,0.3871,0.274,0.3805,0.2718,0.4561,0.3613,0.4061,0.3791,0.4521,0.367,0.3671,0.5128,0.3107,0.4941,0.3905,0.417,0.2284,0.9038,0.2489,0.8424,0.2704,0.7776,0.3756,0.2227,0.4159,0.751,0.4075,0.8513,0.397,0.9461,0.2764,0.6085,0.1939,0.5796,0.4036,0.6068,0.2254,0.6693,0.4248,0.5494,0.4164,0.415,0.1619,0.5606,0.2147,0.552,0.2553,0.535,0.3187,0.5355,0.3652,0.5459,0.3989,0.5579,0.4679,0.5881,0.1653,0.4861,0.1987,0.6761,0.4811,0.3668,0.4057,0.4907,0.1324,0.6526,0.4244,0.5739,0.3871,0.4191,0.2474,0.6434,0.4157,0.4412,0.1578,0.4055,0.4037,0.6188,0.4407,0.457,0.2507,0.2215,0.2585,0.1889,0.144,0.487,0.2071,0.2689,0.1516,0.7068,0.38,0.101,0.4847,0.3602,0.375,0.4687,0.1661,0.628,0.3054,0.6225,0.33,0.6189,0.3704,0.2662,0.1725,0.4153,0.4348,0.0602,0.3493,0.1098,0.3095,0.1422,0.5018,0.848,0.4923,0.0536,0.3549,0.619,0.3788,0.6195,0.3957,0.618,0.1759,0.688,0.3753,0.6487,0.3483,0.6626,0.3216,0.6667,0.2966,0.6634,0.282,0.6564,0.1366,0.7325,0.2895,0.6285,0.497,0.3322,0.3929,0.3347,0.4236,0.3896,0.4531,0.3347,0.5001,0.6463,0.2977,0.1747,0.3382,0.1385,0.4315,0.0756,0.2167,0.2418,0.3948,0.6302,0.4465,0.5304,0.4925,0.0687,0.3892,0.0811,0.1559,0.4085,0.4308,0.261,0.4252,0.2508,0.4206,0.2366,0.4173,0.2191,0.4088,0.1938,0.3813,0.2791,0.376,0.2834,0.3718,0.2874,0.3329,0.3091,0.2082,0.3901,0.4467,0.5711,0.4274,0.645,0.4081,0.6419,0.3867,0.274,0.2121,0.3125,0.4568,0.6419,0.3938,0.1624,0.4978,0.51,0.4691,0.545,0.498,0.5501,0.4246,0.4755,0.4927,0.0962,0.4942,0.1345,0.4421,0.1396,0.3246,0.2363,0.3582,0.3973,0.3573,0.1949,0.2771,0.4095,0.3249,0.3683,0.251,0.3604,0.4334,0.102,0.4066,0.4598,0.3022,0.2102,0.3431,0.1681,0.2941,0.279,0.1834,0.3566,0.2563,0.2743,0.1742,0.335,0.2982,0.3336,0.4269,0.5111,0.4274,0.397,0.4088,0.3945,0.4403,0.4178,0.4014,0.6807,0.3477,0.7082,0.3003,0.7164,0.2617,0.7107,0.2364,0.6954,0.2234,0.6369,0.1374,0.563,0.2489,0.5849,0.281,0.5718,0.3241,0.5691,0.3642,0.5735,0.3946,0.5811,0.4155,0.5894,0.137,0.5747,0.4094,0.3881,0.4464,0.4939,0.4493,0.3907,0.465,0.3749,0.4493,0.387,0.4168,0.379,0.4705,0.3699,0.4745,0.3649,0.4144,0.616,0.432,0.6075,0.4431,0.5994,0.2735,0.6501,0.2449,0.6661,0.5248,0.5053,0.7211,0.6246,0.5268,0.3691,0.8517,0.7837,0.6388,0.5919,0.6685,0.5902,0.6989,0.5921,0.7362,0.6113,0.6122,0.5964,0.6893,0.6938,0.6515,0.688,0.7226,0.687,0.7435,0.6727,0.7681,0.5904,0.6058,0.1266,0.7319,0.6336,0.8597,0.6235,0.8062,0.617,0.664,0.438,0.5378,0.2953,0.5341,0.2634,0.5742,0.2895,0.6004,0.2852,0.565,0.2662,0.59,0.2706,0.6428,0.246,0.522,0.3814,0.5267,0.4165,0.793,0.7051,0.5953,0.5255,0.5957,0.4035,0.5976,0.4247,0.7653,0.4504,0.5253,0.4646,0.72,0.7387,0.764,0.7285,0.8248,0.845,0.5752,0.6989,0.6195,0.6708,0.6704,0.2803,0.8184,0.3004,0.5706,0.3823,0.5464,0.3727,0.6356,0.2811,0.6286,0.2788,0.7822,0.7547,0.5972,0.3922,0.6587,0.7306,0.6653,0.7631,0.6978,0.9258,0.8018,0.8008,0.6774,0.8468,0.8116,0.7244,0.8318,0.7519,0.5368,0.2783,0.5698,0.2778,0.5956,0.278,0.5647,0.3775,0.6331,0.28,0.6163,0.2653,0.6252,0.2769,0.5568,0.388,0.585,0.2648,0.5606,0.2589,0.5308,0.2534,0.5387,0.1729,0.5368,0.1996,0.5362,0.219,0.5345,0.2386,0.5309,0.2532,0.5858,0.2644,0.5915,0.2587,0.5971,0.2495,0.6014,0.2402,0.6339,0.3191,0.8577,0.4763,0.6042,0.2699,0.6096,0.2674,0.5379,0.3601,0.5871,0.3746,0.5418,0.3652,0.6304,0.5079,0.6866,0.4864,0.6038,0.4124,0.7765,0.8935,0.7534,0.8341,0.7325,0.7704,0.615,0.2179,0.5865,0.7482,0.5963,0.8478,0.6095,0.9424,0.7228,0.5995,0.8037,0.5665,0.596,0.6022,0.7745,0.6581,0.5723,0.5462,0.5772,0.411,0.8363,0.547,0.7834,0.5403,0.7433,0.525,0.6806,0.5282,0.6337,0.5402,0.5992,0.5541,0.53,0.5872,0.8322,0.4717,0.8005,0.6646,0.5119,0.3667,0.5912,0.4866,0.8676,0.6372,0.5746,0.5712,0.6076,0.4142,0.7514,0.632,0.579,0.4375,0.8437,0.3898,0.5951,0.6143,0.5534,0.4545,0.7422,0.2111,0.7349,0.1795,0.8556,0.4718,0.788,0.2568,0.8472,0.693,0.6073,0.0977,0.5092,0.3605,0.6217,0.4635,0.8315,0.6145,0.6933,0.6146,0.6697,0.6117,0.6211,0.262,0.8258,0.4014,0.5503,0.0582,0.6388,0.1044,0.6807,0.1355,0.6437,0.6125,0.6203,0.6137,0.6041,0.6135,0.8239,0.6757,0.6223,0.6438,0.6491,0.6565,0.6769,0.6588,0.7011,0.6539,0.7167,0.6456,0.8641,0.7182,0.7095,0.6189,0.5997,0.3304,0.5703,0.386,0.5408,0.3331,0.6921,0.1679,0.6502,0.133,0.5541,0.0731,0.7801,0.2297,0.6039,0.6263,0.5496,0.528,0.5972,0.0775,0.8431,0.393,0.5615,0.2587,0.5662,0.2472,0.571,0.2322,0.5733,0.2161,0.5816,0.191,0.6099,0.2742,0.6147,0.2791,0.6193,0.2824,0.6601,0.3017,0.7885,0.3779,0.5505,0.5691,0.5728,0.6422,0.5923,0.6382,0.6034,0.2703,0.7828,0.3001,0.5431,0.6401,0.5957,0.1595,0.5273,0.5437,0.571,0.4729,0.5464,0.1373,0.6677,0.2293,0.636,0.3913,0.6334,0.1908,0.7192,0.4,0.6701,0.3613,0.744,0.3505,0.5538,0.0997,0.5893,0.4559,0.6881,0.2029,0.6469,0.1633,0.6985,0.2717,0.8136,0.3436,0.7374,0.2641,0.824,0.3208,0.6951,0.3254,0.5697,0.5083,0.5656,0.3941,0.5846,0.3899,0.5533,0.4154,0.6001,0.6771,0.6544,0.7032,0.7015,0.7086,0.7395,0.7015,0.7641,0.6857,0.7753,0.6248,0.8607,0.5474,0.7503,0.5739,0.7178,0.563,0.6749,0.5616,0.6345,0.5678,0.6044,0.5768,0.5824,0.5857,0.8646,0.5588,0.5844,0.3842,0.549,0.4925,0.5442,0.3888,0.5287,0.3739,0.5443,0.3844,0.5773,0.3753,0.5223,0.3695,0.5195,0.3634,0.5846,0.6123,0.5669,0.6046,0.5565,0.5968,0.7254,0.6391,0.7556,0.6552],"i":[54,68,21,298,284,251,71,162,21,68,71,21,162,139,127,109,69,67,299,338,297,323,361,366,395,378,262,67,104,103,69,104,67,104,54,103,104,68,54,63,71,68,338,337,10,299,337,338,107,65,66,147,123,50,187,147,50,200,199,201,136,169,150,175,377,152,175,171,199,347,280,330,280,347,346,352,280,346,352,323,366,280,376,411,352,376,280,376,352,366,218,220,79,218,115,220,395,379,378,364,397,365,424,335,422,220,237,79,4,1,44,105,69,66,105,104,69,63,105,53,104,105,68,105,63,68,70,63,53,46,70,53,63,70,71,71,70,162,70,139,162,108,109,10,108,69,109,69,108,66,108,107,66,389,301,251,301,298,251,454,264,356,372,264,454,264,372,356,281,4,5,4,281,275,137,147,177,147,137,123,234,227,127,227,234,116,149,140,176,199,208,201,171,208,199,208,171,176,140,208,176,171,148,176,148,175,152,175,148,171,83,200,201,214,172,138,172,135,136,135,172,214,142,36,101,142,129,36,132,215,177,132,213,215,147,132,177,132,147,187,213,132,187,213,192,215,192,214,138,435,433,361,376,433,411,433,376,361,416,433,435,352,345,323,345,352,346,345,372,454,361,401,366,401,376,366,376,401,361,91,180,181,98,203,64,203,129,64,129,203,36,203,206,36,205,187,50,206,205,36,101,205,50,36,205,101,212,214,216,212,135,214,40,39,74,203,92,206,379,394,365,434,416,367,434,364,432,397,434,367,364,434,397,416,288,367,288,416,435,288,397,367,288,435,361,434,427,416,433,427,411,427,433,416,421,428,199,200,421,199,428,421,262,421,418,262,335,273,422,418,406,424,406,335,424,0,11,72,11,268,12,423,266,426,266,371,330,223,65,27,124,156,46,70,156,139,156,70,46,139,156,127,337,151,10,151,108,10,108,151,107,151,9,107,158,28,56,301,293,298,293,334,298,334,293,283,334,333,298,284,333,332,298,333,284,333,334,299,333,297,332,333,299,297,348,450,449,348,347,330,347,348,449,450,254,449,347,448,346,448,261,346,448,347,449,261,446,265,281,363,275,363,440,275,441,413,285,334,296,299,296,337,299,123,93,116,137,93,123,93,227,116,93,137,227,396,400,377,400,396,428,175,396,377,428,396,199,396,175,199,369,428,262,369,400,428,378,369,262,400,369,378,210,169,136,135,210,136,204,210,202,210,212,202,212,210,135,169,211,150,210,211,169,211,210,204,100,142,101,142,100,126,51,3,5,4,51,5,58,192,138,192,58,215,172,58,138,447,454,323,345,447,323,447,345,454,340,261,265,372,340,265,345,340,372,261,340,346,340,345,346,166,218,79,129,102,64,102,48,64,73,41,80,41,72,81,41,73,72,86,179,178,179,86,180,41,179,80,178,179,81,179,41,81,207,206,216,207,205,206,205,207,187,207,213,187,207,192,213,214,207,216,192,207,214,106,43,91,106,182,204,106,204,202,43,106,202,106,91,181,182,106,181,95,40,74,40,95,183,43,146,91,57,212,216,43,57,61,57,43,202,212,57,202,185,92,40,165,203,98,165,92,203,165,167,39,40,165,39,92,165,40,206,186,216,92,186,206,186,57,216,186,92,61,57,186,61,431,418,424,431,379,395,431,394,379,431,395,262,418,431,262,430,424,422,430,431,424,431,430,394,432,430,422,364,430,432,430,364,365,394,430,365,436,434,432,436,427,434,427,436,426,436,410,426,322,270,391,410,322,426,423,322,391,322,423,426,321,273,335,287,436,432,436,287,410,287,432,422,273,287,422,164,393,267,0,164,267,37,0,72,167,37,39,37,164,0,164,37,167,73,37,72,37,73,39,274,4,275,4,274,1,269,270,304,270,269,391,269,393,391,393,269,267,268,302,311,302,0,267,302,11,0,11,302,268,425,427,426,266,425,426,425,280,411,427,425,411,280,425,330,425,266,330,52,105,66,65,52,66,223,52,65,224,52,223,105,52,53,52,224,53,156,143,127,143,156,124,35,143,124,65,222,27,222,28,27,222,65,107,28,222,56,368,389,356,300,293,301,300,276,283,293,300,283,300,301,389,368,300,389,371,329,330,329,348,330,253,254,450,448,255,261,263,255,249,255,446,261,359,255,263,255,359,446,355,329,371,277,355,437,329,355,277,343,277,437,350,343,357,343,350,277,412,419,351,343,412,357,248,281,5,6,197,122,419,197,351,197,6,351,222,221,56,221,222,107,157,158,56,190,189,243,190,221,189,221,190,56,190,157,56,390,388,249,276,445,283,445,444,283,282,296,334,282,334,283,444,282,283,296,336,337,9,336,285,336,151,337,151,336,9,336,441,285,336,442,441,83,18,200,17,18,83,84,17,83,84,182,181,182,84,83,15,316,315,170,149,150,211,170,150,182,194,204,194,211,204,194,83,201,194,182,83,174,217,114,217,198,126,47,100,120,217,47,114,100,47,126,47,217,126,134,45,220,51,45,134,45,51,4,45,237,220,237,45,44,45,4,44,209,142,126,198,209,126,209,198,134,218,219,115,166,219,218,48,219,64,219,48,115,42,95,74,39,42,74,73,42,39,146,90,91,90,180,91,90,179,180,96,90,146,184,40,183,184,185,40,406,405,335,405,321,335,321,375,273,307,375,320,375,321,320,291,287,273,287,291,410,291,322,410,164,141,2,141,164,167,242,141,167,240,165,98,165,240,167,60,75,79,75,166,79,166,75,59,75,240,59,240,75,167,237,239,79,239,60,79,239,237,44,354,19,1,274,354,1,294,358,423,358,266,423,371,358,279,266,358,371,325,307,320,319,325,320,325,319,324,318,319,310,269,303,267,303,302,267,38,11,12,87,38,12,11,38,72,72,38,81,38,178,81,38,87,178,268,312,12,225,124,46,225,46,53,224,225,53,29,223,27,29,224,223,34,234,127,143,34,127,34,143,234,111,143,35,234,111,116,143,111,234,300,383,276,383,300,368,372,383,356,383,368,356,348,349,450,329,349,348,349,329,277,350,349,277,380,253,252,339,448,449,339,255,448,254,339,449,390,339,254,255,339,249,339,390,249,446,467,342,359,467,446,467,359,263,467,445,342,355,420,437,399,343,437,399,248,419,412,399,419,399,412,343,6,417,351,464,417,413,413,417,285,248,195,419,195,197,419,3,195,5,195,248,5,221,55,189,9,55,107,55,221,107,154,173,155,157,173,154,190,173,157,386,258,257,258,442,257,442,295,257,282,295,296,295,336,296,336,295,442,313,421,200,18,313,200,313,18,17,421,313,418,313,406,418,13,87,12,13,15,86,15,85,86,85,84,181,180,85,181,86,85,180,16,15,315,16,85,15,84,16,17,85,16,84,32,170,211,194,32,211,170,32,149,32,140,149,32,208,140,208,32,201,32,194,201,174,196,3,196,195,3,195,196,197,197,196,122,217,236,198,51,236,3,236,174,3,236,217,174,236,51,134,198,236,134,47,121,114,121,47,120,121,120,231,232,121,231,142,49,129,209,49,142,49,102,129,48,49,115,102,49,48,235,166,59,235,219,166,240,235,59,235,240,98,235,98,64,219,235,64,179,89,80,90,89,179,42,89,95,89,90,95,95,191,183,191,96,183,90,191,95,96,191,90,62,76,185,92,76,61,185,76,92,76,43,61,76,146,43,76,62,146,77,96,146,96,77,183,77,184,183,184,78,185,78,62,185,77,78,184,62,78,146,78,77,146,321,404,320,405,404,321,316,404,315,404,405,315,375,306,273,306,291,273,306,375,292,141,94,2,94,141,19,19,125,1,141,125,19,125,141,242,241,125,242,1,125,44,125,241,44,241,238,44,238,239,44,239,238,60,97,242,167,358,331,279,331,358,294,393,460,391,305,460,393,327,455,294,327,423,391,327,294,423,460,327,391,327,460,455,322,409,270,409,306,292,291,409,322,306,409,291,318,272,319,272,318,310,303,272,310,272,269,304,272,303,269,15,317,316,312,317,15,316,317,311,317,268,311,317,312,268,30,225,224,29,30,224,31,111,35,123,117,50,117,31,228,31,117,111,117,123,116,111,117,116,120,230,231,383,353,276,445,353,342,353,445,276,446,353,265,353,446,342,353,372,265,353,383,372,451,349,350,349,451,450,451,253,450,253,451,252,385,380,384,385,258,386,380,374,253,374,385,386,385,374,380,466,467,263,466,263,249,388,466,249,420,456,437,456,399,437,399,456,248,248,456,281,456,363,281,456,420,363,363,360,440,417,465,351,465,417,464,465,412,351,412,465,357,168,417,6,465,453,357,453,465,464,451,256,252,380,381,384,381,380,252,256,381,252,463,464,413,463,453,464,453,463,341,133,190,243,133,173,190,173,133,155,112,133,243,133,112,155,443,282,444,259,443,444,443,259,257,295,443,257,443,295,282,387,386,257,259,387,257,387,259,388,387,388,390,467,260,445,445,260,444,260,259,444,259,260,388,260,466,388,466,260,467,314,313,17,314,16,315,16,314,17,405,314,315,314,405,406,313,314,406,312,14,12,14,13,12,14,312,15,13,14,15,82,13,86,13,82,87,82,86,178,87,82,178,196,188,122,188,245,122,188,174,114,188,196,174,233,112,243,112,233,232,26,154,155,112,26,155,26,112,232,26,232,231,49,131,115,131,49,209,131,209,134,115,131,220,131,134,220,89,88,80,88,89,42,88,73,80,88,42,73,271,303,310,402,271,310,271,402,311,302,271,311,303,271,302,403,319,320,404,403,320,319,403,310,403,402,310,402,403,311,403,316,311,403,404,316,354,370,19,370,94,19,94,370,2,370,164,2,164,370,393,75,99,167,99,97,167,99,75,60,238,99,60,20,238,241,20,241,242,97,20,242,20,99,238,99,20,97,440,457,275,457,274,275,457,459,274,344,360,279,344,438,440,360,344,440,308,409,292,375,308,292,308,375,307,325,407,307,407,325,324,270,407,304,319,415,324,272,415,319,415,272,304,407,415,304,415,407,324,225,113,124,110,229,228,161,30,29,229,118,228,118,117,228,118,101,50,117,118,50,119,230,120,119,100,101,100,119,120,230,119,229,118,119,101,119,118,229,22,26,231,26,22,154,385,286,258,442,286,441,258,286,442,286,385,384,253,373,254,374,373,253,373,390,254,373,387,390,373,374,386,387,373,386,420,429,363,429,360,363,429,355,371,429,420,355,429,371,279,360,429,279,193,6,122,193,168,6,245,193,122,55,193,189,417,8,285,168,8,417,8,9,285,8,55,9,8,193,55,193,8,168,452,453,341,256,452,341,452,350,357,453,452,357,452,451,350,452,256,451,414,463,413,414,413,441,414,286,384,286,414,441,244,233,243,233,244,245,189,244,243,193,244,189,244,193,245,128,121,232,233,128,232,121,128,114,128,188,114,188,128,245,128,233,245,457,309,459,438,309,440,309,457,440,290,309,305,309,290,459,309,392,305,392,309,438,278,331,294,331,278,279,278,344,279,344,439,438,392,439,455,439,392,438,278,439,344,455,439,294,439,278,294,462,370,354,326,462,250,370,462,393,462,326,393,461,354,274,461,462,354,462,461,250,290,458,459,459,458,274,458,461,274,461,458,250,460,289,455,289,392,455,289,460,305,392,289,305,409,408,270,408,407,270,308,408,409,408,308,307,407,408,307,226,35,124,113,226,124,226,113,130,226,31,35,30,247,225,247,113,225,113,247,130,31,25,228,25,110,228,25,226,130,226,25,31,24,230,229,110,24,229,160,29,27,160,161,29,381,398,384,398,414,384,328,326,250,458,328,250,328,458,290,328,290,305,328,305,393,326,328,393,247,33,130,33,25,130,161,246,30,246,247,30,246,33,247,24,23,230,230,23,231,23,22,231,414,362,463,398,362,414,463,362,341,163,24,110,163,144,24,160,163,161,144,163,160,23,153,22,22,153,154,157,153,158,153,157,154,145,23,24,144,145,24,145,153,23,153,145,158,362,382,341,382,256,341,382,381,256,382,398,381,382,362,398,33,7,25,25,7,110,7,163,110,246,7,33,7,246,161,163,7,161,159,144,160,159,145,144,145,159,158,159,160,27,28,159,27,159,28,158],"tex":"data:...BASE64_BO_BOT...","skin":"#cf9486","ring":[10,338,297,332,284,251,389,356,454,323,361,288,397,365,379,378,400,377,152,148,176,149,150,136,172,58,132,93,234,127,162,21,54,103,67,109],"hgt":1.214}};
const ANH_BO_ME = { bo: "data:...BASE64_BO_BOT...", me: "data:...BASE64_BO_BOT..." };

/* ---------------------------------------------------------------------
   1. NGÂN HÀNG CÂU HỎI LỚP 3 VÀ LỚP 1 – MỖI LỚP 100 CÂU
   Mỗi câu: [Môn, Câu hỏi, Đáp án A, Đáp án B, Đáp án C, Đáp án D, vị trí đáp án đúng (0 = A, 1 = B, 2 = C, 3 = D)]
   Mỗi ván lấy 10 câu chưa ra ở các ván trước; ra hết thì tự quay vòng lại từ đầu.
   --------------------------------------------------------------------- */
const DU_LIEU_LOP_3 = [
  // ===== TOÁN (40 câu) =====
  ['Toán', 'Kết quả của phép tính 8 × 7 là bao nhiêu?', '48', '54', '56', '64', 2],
  ['Toán', 'Hình vuông có cạnh dài 6 cm. Chu vi hình vuông đó là bao nhiêu?', '12 cm', '24 cm', '36 cm', '18 cm', 1],
  ['Toán', 'Số gồm 5 trăm, 0 chục và 8 đơn vị viết là:', '580', '508', '805', '58', 1],
  ['Toán', 'Chữ số La Mã IX biểu thị số mấy?', 'Số 4', 'Số 6', 'Số 9', 'Số 11', 2],
  ['Toán', 'Có 45 quả cam xếp đều vào 5 đĩa. Mỗi đĩa có mấy quả cam?', '7 quả', '8 quả', '9 quả', '10 quả', 2],
  ['Toán', '1 kg bằng bao nhiêu gam (g)?', '10 g', '100 g', '1000 g', '500 g', 2],
  ['Toán', 'Kết quả của phép tính 6 × 9 là bao nhiêu?', '54', '56', '45', '63', 0],
  ['Toán', 'Kết quả của phép chia 72 : 8 là bao nhiêu?', '8', '9', '7', '6', 1],
  ['Toán', 'Số liền sau của số 9 999 là số nào?', '9 998', '10 000', '10 001', '1 000', 1],
  ['Toán', 'Làm tròn số 4 728 đến hàng nghìn ta được số nào?', '4 000', '5 000', '4 700', '4 800', 1],
  ['Toán', 'Hình chữ nhật có chiều dài 8 cm, chiều rộng 5 cm. Chu vi hình chữ nhật đó là:', '13 cm', '26 cm', '40 cm', '18 cm', 1],
  ['Toán', 'Hình chữ nhật có chiều dài 7 cm, chiều rộng 4 cm. Diện tích hình chữ nhật đó là:', '11 cm²', '22 cm²', '28 cm²', '24 cm²', 2],
  ['Toán', 'Hình vuông có cạnh 5 cm. Diện tích hình vuông đó là:', '20 cm²', '25 cm²', '10 cm²', '15 cm²', 1],
  ['Toán', '1 m bằng bao nhiêu xăng-ti-mét (cm)?', '10 cm', '100 cm', '1000 cm', '50 cm', 1],
  ['Toán', '1 giờ bằng bao nhiêu phút?', '30 phút', '100 phút', '60 phút', '24 phút', 2],
  ['Toán', 'Một năm có bao nhiêu tháng?', '10 tháng', '11 tháng', '12 tháng', '13 tháng', 2],
  ['Toán', 'Tháng nào trong năm chỉ có 28 hoặc 29 ngày?', 'Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 1],
  ['Toán', 'Số lớn nhất trong các số 5 432; 5 423; 5 342; 5 324 là:', '5 432', '5 423', '5 342', '5 324', 0],
  ['Toán', 'Chữ số La Mã XII biểu thị số mấy?', 'Số 7', 'Số 12', 'Số 17', 'Số 11', 1],
  ['Toán', '1/4 của 20 kg là bao nhiêu?', '4 kg', '5 kg', '16 kg', '80 kg', 1],
  ['Toán', 'Tìm số thích hợp: ? × 6 = 42', '6', '7', '8', '36', 1],
  ['Toán', 'Tìm số thích hợp: ? : 4 = 9', '36', '13', '5', '32', 0],
  ['Toán', 'Giá trị của biểu thức 20 + 5 × 3 là:', '75', '35', '45', '28', 1],
  ['Toán', 'Giá trị của biểu thức (20 + 5) × 3 là:', '75', '35', '45', '60', 0],
  ['Toán', 'Kết quả của phép nhân 123 × 3 là:', '369', '366', '396', '339', 0],
  ['Toán', 'Kết quả của phép chia 96 : 3 là:', '32', '33', '23', '30', 0],
  ['Toán', 'Phép chia 29 : 4 có số dư là bao nhiêu?', '1', '2', '3', '4', 0],
  ['Toán', '1 lít bằng bao nhiêu mi-li-lít (ml)?', '10 ml', '100 ml', '1000 ml', '500 ml', 2],
  ['Toán', 'Đồng hồ có kim giờ chỉ số 3, kim phút chỉ số 12. Đồng hồ chỉ mấy giờ?', '12 giờ 15 phút', '3 giờ', '3 giờ 12 phút', '12 giờ 3 phút', 1],
  ['Toán', 'Nhiệt độ của nước đá đang tan khoảng bao nhiêu độ C?', '0 °C', '100 °C', '37 °C', '50 °C', 0],
  ['Toán', 'Số gồm 3 chục nghìn, 5 nghìn, 7 chục và 2 đơn vị viết là:', '35 072', '3 572', '35 702', '30 572', 0],
  ['Toán', 'Số tròn chục lớn nhất có hai chữ số là:', '99', '90', '100', '80', 1],
  ['Toán', 'Gấp số 7 lên 4 lần ta được:', '11', '28', '3', '24', 1],
  ['Toán', 'Giảm số 36 đi 6 lần ta được:', '30', '6', '42', '216', 1],
  ['Toán', 'Hình tam giác có mấy cạnh?', '2 cạnh', '3 cạnh', '4 cạnh', '5 cạnh', 1],
  ['Toán', 'Hình tròn có bán kính 3 cm thì đường kính dài bao nhiêu?', '3 cm', '6 cm', '9 cm', '12 cm', 1],
  ['Toán', 'Một tuần lễ có mấy ngày?', '5 ngày', '6 ngày', '7 ngày', '8 ngày', 2],
  ['Toán', '1 km bằng bao nhiêu mét (m)?', '100 m', '1000 m', '10 m', '10 000 m', 1],
  ['Toán', 'Kết quả của phép tính 9 × 9 là bao nhiêu?', '81', '72', '99', '90', 0],
  ['Toán', 'Trong các số 345; 568; 791; 203, số chẵn là:', '345', '568', '791', '203', 1],

  // ===== TIẾNG VIỆT (30 câu) =====
  ['Tiếng Việt', 'Trong câu "Mặt trời đỏ rực như hòn lửa", từ nào chỉ đặc điểm?', 'Mặt trời', 'Đỏ rực', 'Hòn lửa', 'Như', 1],
  ['Tiếng Việt', 'Câu nào dưới đây có hình ảnh so sánh?', 'Bầu trời rất xanh', 'Chú mèo lông trắng muốt', 'Trăng tròn như quả bóng', 'Em yêu trường em', 2],
  ['Tiếng Việt', 'Từ nào dưới đây viết đúng chính tả?', 'Dành dụm', 'Rành rụm', 'Giành dụm', 'Dành rụm', 0],
  ['Tiếng Việt', 'Từ nào dưới đây là từ chỉ hoạt động?', 'Học bài', 'Quyển sách', 'Xanh biếc', 'Ngôi nhà', 0],
  ['Tiếng Việt', 'Từ nào dưới đây là từ chỉ sự vật?', 'Chạy nhảy', 'Cái bàn', 'Đỏ thắm', 'Vui vẻ', 1],
  ['Tiếng Việt', 'Từ nào dưới đây là từ chỉ đặc điểm?', 'Hoa hồng', 'Bay lượn', 'Thơm ngát', 'Cánh đồng', 2],
  ['Tiếng Việt', 'Từ nào trái nghĩa với "chăm chỉ"?', 'Siêng năng', 'Lười biếng', 'Cần cù', 'Chịu khó', 1],
  ['Tiếng Việt', 'Từ nào có nghĩa giống với "to lớn"?', 'Nhỏ bé', 'Khổng lồ', 'Bé xíu', 'Tí hon', 1],
  ['Tiếng Việt', 'Cuối câu hỏi, em đặt dấu câu nào?', 'Dấu chấm', 'Dấu chấm hỏi', 'Dấu chấm than', 'Dấu phẩy', 1],
  ['Tiếng Việt', 'Câu "Ôi, bông hoa đẹp quá!" là kiểu câu gì?', 'Câu kể', 'Câu hỏi', 'Câu cảm', 'Câu khiến', 2],
  ['Tiếng Việt', 'Câu "Em hãy mở cửa sổ ra." là kiểu câu gì?', 'Câu kể', 'Câu hỏi', 'Câu cảm', 'Câu khiến', 3],
  ['Tiếng Việt', 'Điền chữ thích hợp vào chỗ chấm: "...âu chuỗi hạt"', 's', 'x', 'ch', 'tr', 1],
  ['Tiếng Việt', 'Từ nào viết đúng chính tả?', 'Chung thu', 'Trung thu', 'Trung thư', 'Chung thư', 1],
  ['Tiếng Việt', 'Từ nào viết đúng chính tả?', 'Giản dị', 'Dản dị', 'Rản dị', 'Giản rị', 0],
  ['Tiếng Việt', 'Điền chữ thích hợp vào chỗ chấm: "...o lắng"', 'l', 'n', 'nh', 'd', 0],
  ['Tiếng Việt', 'Câu "Bạn Lan học rất giỏi." thuộc mẫu câu nào?', 'Ai là gì?', 'Ai làm gì?', 'Ai thế nào?', 'Khi nào?', 2],
  ['Tiếng Việt', 'Câu "Bố em là bác sĩ." thuộc mẫu câu nào?', 'Ai là gì?', 'Ai làm gì?', 'Ai thế nào?', 'Ở đâu?', 0],
  ['Tiếng Việt', 'Câu "Đàn chim bay về tổ." thuộc mẫu câu nào?', 'Ai là gì?', 'Ai làm gì?', 'Ai thế nào?', 'Vì sao?', 1],
  ['Tiếng Việt', 'Trong câu "Chùm hoa phượng đỏ như lửa", chùm hoa phượng được so sánh với gì?', 'Hoa phượng', 'Lửa', 'Màu đỏ', 'Cây phượng', 1],
  ['Tiếng Việt', 'Từ nào chỉ tình cảm trong gia đình?', 'Yêu thương', 'Học tập', 'Chạy nhảy', 'Vẽ tranh', 0],
  ['Tiếng Việt', 'Trong câu "Chim hót líu lo trên cành cây.", bộ phận nào trả lời câu hỏi "Ở đâu?"', 'Chim', 'Hót líu lo', 'Trên cành cây', 'Líu lo', 2],
  ['Tiếng Việt', 'Trong câu "Sáng sớm, bà em đi chợ.", bộ phận nào trả lời câu hỏi "Khi nào?"', 'Sáng sớm', 'Bà em', 'Đi chợ', 'Chợ', 0],
  ['Tiếng Việt', 'Câu nào đặt dấu phẩy đúng?', 'Nhà em nuôi chó, mèo và gà.', 'Nhà em, nuôi chó mèo và gà.', 'Nhà em nuôi, chó mèo và gà.', 'Nhà, em nuôi chó mèo và gà.', 0],
  ['Tiếng Việt', 'Từ nào KHÔNG cùng nhóm với các từ còn lại?', 'Bút chì', 'Thước kẻ', 'Cặp sách', 'Chăm chỉ', 3],
  ['Tiếng Việt', 'Từ "lấp lánh" là từ chỉ gì?', 'Sự vật', 'Hoạt động', 'Đặc điểm', 'Người', 2],
  ['Tiếng Việt', 'Từ nào viết đúng chính tả?', 'Rực rỡ', 'Dực rỡ', 'Rực dỡ', 'Giực rỡ', 0],
  ['Tiếng Việt', 'Điền chữ thích hợp vào chỗ chấm: "...ăm sóc cây xanh"', 'tr', 'ch', 'gi', 's', 1],
  ['Tiếng Việt', 'Từ nào chỉ nghề nghiệp?', 'Bác sĩ', 'Bệnh viện', 'Chữa bệnh', 'Ống nghe', 0],
  ['Tiếng Việt', 'Câu "Chị ngã em nâng" nói về điều gì?', 'Tình cảm anh chị em', 'Việc học tập', 'Thiên nhiên', 'Thời tiết', 0],
  ['Tiếng Việt', 'Trong câu "Trăng tròn như quả bóng", từ nào dùng để so sánh?', 'Trăng', 'Tròn', 'Như', 'Quả bóng', 2],

  // ===== TỰ NHIÊN VÀ XÃ HỘI (16 câu) =====
  ['TN&XH', 'Cơ quan nào làm nhiệm vụ bơm máu đi nuôi cơ thể?', 'Phổi', 'Dạ dày', 'Tim', 'Thận', 2],
  ['TN&XH', 'Bộ phận nào của cây giúp hút nước và chất khoáng từ đất?', 'Lá cây', 'Thân cây', 'Hoa', 'Rễ cây', 3],
  ['TN&XH', 'Trên la bàn, chữ N chỉ hướng nào?', 'Hướng Đông', 'Hướng Tây', 'Hướng Nam', 'Hướng Bắc', 3],
  ['TN&XH', 'Bộ phận nào thuộc cơ quan tiêu hoá?', 'Dạ dày', 'Phổi', 'Tim', 'Não', 0],
  ['TN&XH', 'Bộ phận nào điều khiển mọi hoạt động của cơ thể?', 'Tim', 'Não', 'Dạ dày', 'Gan', 1],
  ['TN&XH', 'Mặt Trời mọc ở hướng nào?', 'Hướng Tây', 'Hướng Đông', 'Hướng Nam', 'Hướng Bắc', 1],
  ['TN&XH', 'Mặt Trời lặn ở hướng nào?', 'Hướng Đông', 'Hướng Tây', 'Hướng Nam', 'Hướng Bắc', 1],
  ['TN&XH', 'Trái Đất có dạng hình gì?', 'Hình vuông', 'Hình cầu', 'Hình tam giác', 'Hình chữ nhật', 1],
  ['TN&XH', 'Bộ phận nào của cây làm nhiệm vụ quang hợp (tạo chất dinh dưỡng nuôi cây)?', 'Lá', 'Rễ', 'Hoa', 'Quả', 0],
  ['TN&XH', 'Con vật nào dưới đây đẻ trứng?', 'Con gà', 'Con chó', 'Con mèo', 'Con trâu', 0],
  ['TN&XH', 'Khi phát hiện có cháy, em cần gọi số điện thoại nào?', '114', '113', '115', '111', 0],
  ['TN&XH', 'Số điện thoại gọi cấp cứu y tế là số nào?', '113', '114', '115', '116', 2],
  ['TN&XH', 'Bố của bố em gọi là gì?', 'Ông nội', 'Ông ngoại', 'Bác', 'Chú', 0],
  ['TN&XH', 'Mẹ của mẹ em gọi là gì?', 'Bà nội', 'Bà ngoại', 'Cô', 'Dì', 1],
  ['TN&XH', 'Hoạt động nào là hoạt động sản xuất nông nghiệp?', 'Trồng lúa', 'Dệt vải', 'Lắp ráp ô tô', 'Làm bánh kẹo trong nhà máy', 0],
  ['TN&XH', 'Con vật nào dưới đây ăn cỏ?', 'Con bò', 'Con hổ', 'Con sư tử', 'Con cá mập', 0],

  // ===== TIẾNG ANH (14 câu) =====
  ['Tiếng Anh', 'Từ "Hello" nghĩa là gì?', 'Tạm biệt', 'Xin chào', 'Cảm ơn', 'Xin lỗi', 1],
  ['Tiếng Anh', 'Từ "Goodbye" nghĩa là gì?', 'Tạm biệt', 'Xin chào', 'Cảm ơn', 'Xin lỗi', 0],
  ['Tiếng Anh', '"Thank you" nghĩa là gì?', 'Tạm biệt', 'Xin chào', 'Cảm ơn', 'Xin lỗi', 2],
  ['Tiếng Anh', 'Màu đỏ trong tiếng Anh là từ nào?', 'Blue', 'Red', 'Green', 'Yellow', 1],
  ['Tiếng Anh', 'Từ "yellow" là màu gì?', 'Xanh lá', 'Vàng', 'Đỏ', 'Tím', 1],
  ['Tiếng Anh', 'Số 5 trong tiếng Anh là từ nào?', 'Four', 'Five', 'Six', 'Nine', 1],
  ['Tiếng Anh', 'Từ "ten" là số mấy?', 'Số 2', 'Số 10', 'Số 12', 'Số 20', 1],
  ['Tiếng Anh', 'Từ "pen" nghĩa là gì?', 'Cái bút', 'Quyển sách', 'Cái thước', 'Cái cặp', 0],
  ['Tiếng Anh', 'Từ "book" nghĩa là gì?', 'Cái bút', 'Quyển sách', 'Cái bàn', 'Cái ghế', 1],
  ['Tiếng Anh', 'Từ "cat" nghĩa là con gì?', 'Con chó', 'Con mèo', 'Con cá', 'Con chim', 1],
  ['Tiếng Anh', 'Từ "dog" nghĩa là con gì?', 'Con chó', 'Con mèo', 'Con gà', 'Con vịt', 0],
  ['Tiếng Anh', 'Từ "mother" nghĩa là ai?', 'Bố', 'Mẹ', 'Anh trai', 'Em gái', 1],
  ['Tiếng Anh', 'Câu "What\'s your name?" dùng để hỏi về điều gì?', 'Tuổi', 'Tên', 'Màu sắc', 'Trường học', 1],
  ['Tiếng Anh', 'Câu "How old are you?" dùng để hỏi về điều gì?', 'Tên', 'Tuổi', 'Sức khoẻ', 'Ngôi nhà', 1],
  // Gemini thêm HK1 tuần 11-18
  ["Toán", "Kết quả của phép tính 7 x 6 là bao nhiêu?", "42", "36", "48", "49", 0],
  ["Toán", "Kết quả của phép tính 8 x 7 là bao nhiêu?", "54", "56", "64", "48", 1],
  ["Toán", "Kết quả của phép tính 9 x 8 là bao nhiêu?", "63", "81", "72", "64", 2],
  ["Toán", "Kết quả của phép tính 63 : 7 là bao nhiêu?", "8", "7", "6", "9", 3],
  ["Toán", "Kết quả của phép tính 72 : 8 là bao nhiêu?", "9", "8", "7", "6", 0],
  ["Toán", "Kết quả của phép tính 81 : 9 là bao nhiêu?", "8", "9", "7", "10", 1],
  ["Toán", "Gấp 12 lên 4 lần ta được số nào?", "16", "36", "48", "52", 2],
  ["Toán", "Giảm 54 đi 6 lần ta được số nào?", "48", "8", "7", "9", 3],
  ["Toán", "Giá trị của biểu thức 25 + 15 x 2 là bao nhiêu?", "55", "80", "50", "45", 0],
  ["Toán", "Giá trị của biểu thức (40 - 16) : 3 là bao nhiêu?", "12", "8", "6", "9", 1],
  ["Toán", "1 m bằng bao nhiêu mi-li-mét (mm)?", "100 mm", "10 mm", "1000 mm", "10000 mm", 2],
  ["Toán", "Chu vi hình vuông có cạnh dài 9 cm là bao nhiêu?", "18 cm", "81 cm", "27 cm", "36 cm", 3],
  ["Toán", "Chu vi hình chữ nhật có chiều dài 12 cm, chiều rộng 8 cm là bao nhiêu?", "40 cm", "20 cm", "96 cm", "32 cm", 0],
  ["Toán", "Số dư của phép chia 38 : 5 là bao nhiêu?", "2", "3", "4", "1", 1],
  ["Tiếng Việt", "Trong câu “Trăng tròn như chiếc đĩa bạc”, hình ảnh so sánh là gì?", "Trăng với bầu trời", "Chiếc đĩa với ngôi sao", "Trăng với chiếc đĩa bạc", "Tròn với màu trắng", 2],
  ["Tiếng Việt", "Từ nào dưới đây là từ chỉ hoạt động?", "Xanh biếc", "Quyển vở", "Ngọt ngào", "Chạy nhảy", 3],
  ["Tiếng Việt", "Từ nào dưới đây là từ chỉ đặc điểm?", "Dịu dàng", "Đọc sách", "Bàn học", "Quét nhà", 0],
  ["Tiếng Việt", "Cuối câu hỏi phải đặt dấu câu nào?", "Dấu chấm (.)", "Dấu chấm hỏi (?)", "Dấu phẩy (,)", "Dấu hai chấm (:)", 1],
  ["Tiếng Việt", "Từ nào viết đúng chính tả?", "Chống trường", "Trống chường", "Trống trường", "Chống chường", 2],
  ["Tiếng Việt", "Từ nào viết đúng chính tả?", "Xạch xẽ", "Sạch xẽ", "Xạch sẽ", "Sạch sẽ", 3],
  ["Tiếng Việt", "Từ nào cùng nghĩa với từ “chăm chỉ”?", "Siêng năng", "Lười biếng", "Vội vàng", "Nhút nhát", 0],
  ["Tiếng Việt", "Từ nào trái nghĩa với từ “dũng cảm”?", "Gan dạ", "Nhút nhát", "Kiên cường", "Tự tin", 1],
  ["Tiếng Anh", "Câu “Open your book, please!” nghĩa là gì?", "Hãy gấp sách lại!", "Hãy đứng lên!", "Hãy mở sách của bạn ra!", "Hãy ngồi xuống!", 2],
  ["Tiếng Anh", "Đồ dùng học tập “pencil case” là gì?", "Cục tẩy", "Thước kẻ", "Cặp sách", "Hộp bút", 3],
  ["Tiếng Anh", "Từ tiếng Anh nào có nghĩa là “cục tẩy”?", "eraser", "ruler", "notebook", "school bag", 0],
  ["Tiếng Anh", "Hỏi màu sắc của nhiều đồ vật, em dùng câu nào?", "What colour is it?", "What colour are they?", "How old are you?", "Who is that?", 1],
  ["Tiếng Anh", "Hoạt động giờ ra chơi “play badminton” là chơi môn gì?", "Chơi bóng đá", "Chơi cờ vua", "Chơi cầu lông", "Nhảy dây", 2],
  ["Tiếng Anh", "Trò chơi “skipping” trong giờ ra chơi là gì?", "Chơi trốn tìm", "Đá cầu", "Chơi bóng rổ", "Nhảy dây", 3],
  ["Tiếng Anh", "Trả lời cho câu hỏi “Do you have a ruler?” (Có), em nói thế nào?", "Yes, I do.", "Yes, I am.", "No, I do.", "Yes, it is.", 0],
  ["Tiếng Anh", "Từ “white” là màu gì?", "Màu đen", "Màu trắng", "Màu cam", "Màu nâu", 1]
];

const DU_LIEU_LOP_1 = [
  // ===== TOÁN (40 câu) =====
  ['Toán', 'Kết quả của phép cộng 4 + 5 bằng mấy?', '8', '9', '10', '7', 1],
  ['Toán', 'Trong các số 3, 9, 5, 7, số nào lớn nhất?', 'Số 3', 'Số 9', 'Số 5', 'Số 7', 1],
  ['Toán', 'Khối rubik vuông vức có dạng hình khối gì?', 'Khối cầu', 'Khối hộp chữ nhật', 'Khối lập phương', 'Hình tròn', 2],
  ['Toán', 'Lucas có 10 cái kẹo, cho chị Lucie 3 cái. Lucas còn mấy cái kẹo?', '6 cái', '7 cái', '8 cái', '5 cái', 1],
  ['Toán', 'Số liền sau của số 9 là số mấy?', 'Số 8', 'Số 10', 'Số 7', 'Số 11', 1],
  ['Toán', 'Kết quả của phép cộng 3 + 4 bằng mấy?', '6', '7', '8', '5', 1],
  ['Toán', 'Kết quả của phép trừ 8 − 2 bằng mấy?', '5', '6', '7', '10', 1],
  ['Toán', 'Kết quả của phép cộng 2 + 6 bằng mấy?', '7', '8', '9', '6', 1],
  ['Toán', 'Kết quả của phép trừ 10 − 5 bằng mấy?', '4', '5', '6', '15', 1],
  ['Toán', 'Kết quả của phép cộng 5 + 5 bằng mấy?', '9', '10', '11', '0', 1],
  ['Toán', 'Trong các số 4, 1, 8, 6, số nào bé nhất?', 'Số 4', 'Số 1', 'Số 8', 'Số 6', 1],
  ['Toán', 'Số liền trước của số 10 là số mấy?', 'Số 8', 'Số 9', 'Số 11', 'Số 1', 1],
  ['Toán', 'Chọn dấu thích hợp: 7 ... 5', '>', '<', '=', '+', 0],
  ['Toán', 'Chọn dấu thích hợp: 4 ... 4', '>', '<', '=', '−', 2],
  ['Toán', 'Số 15 gồm mấy chục và mấy đơn vị?', '1 chục và 5 đơn vị', '5 chục và 1 đơn vị', '15 chục', '1 chục và 1 đơn vị', 0],
  ['Toán', '2 chục bằng bao nhiêu?', '2', '12', '20', '22', 2],
  ['Toán', 'Kết quả của phép cộng 20 + 30 bằng mấy?', '50', '40', '23', '5', 0],
  ['Toán', 'Kết quả của phép cộng 45 + 3 bằng mấy?', '48', '75', '42', '49', 0],
  ['Toán', 'Kết quả của phép trừ 67 − 5 bằng mấy?', '62', '17', '61', '72', 0],
  ['Toán', 'Số nào là số tròn chục?', '35', '40', '47', '52', 1],
  ['Toán', 'Số lớn nhất có hai chữ số là số nào?', '90', '99', '100', '98', 1],
  ['Toán', 'Hình nào có 3 cạnh?', 'Hình tròn', 'Hình vuông', 'Hình tam giác', 'Hình chữ nhật', 2],
  ['Toán', 'Hình nào không có cạnh nào?', 'Hình vuông', 'Hình tròn', 'Hình tam giác', 'Hình chữ nhật', 1],
  ['Toán', 'Viên gạch xây nhà thường có dạng khối gì?', 'Khối lập phương', 'Khối hộp chữ nhật', 'Hình tròn', 'Hình tam giác', 1],
  ['Toán', 'Một tuần lễ có mấy ngày?', '5 ngày', '6 ngày', '7 ngày', '10 ngày', 2],
  ['Toán', 'Hôm nay là thứ Hai thì ngày mai là thứ mấy?', 'Chủ nhật', 'Thứ Ba', 'Thứ Tư', 'Thứ Bảy', 1],
  ['Toán', 'Đồng hồ có kim ngắn chỉ số 7, kim dài chỉ số 12. Đồng hồ chỉ mấy giờ?', '7 giờ', '12 giờ', '12 giờ 7 phút', '5 giờ', 0],
  ['Toán', 'Chiếc bút chì dài 15 ... Chọn đơn vị thích hợp:', 'cm', 'kg', 'lít', 'giờ', 0],
  ['Toán', 'An có 5 bông hoa, Bình có 4 bông hoa. Cả hai bạn có mấy bông hoa?', '8 bông', '9 bông', '10 bông', '1 bông', 1],
  ['Toán', 'Trên cành có 8 con chim, 3 con bay đi. Trên cành còn mấy con chim?', '4 con', '5 con', '6 con', '11 con', 1],
  ['Toán', 'Có 6 quả táo, mẹ mua thêm 4 quả. Có tất cả mấy quả táo?', '9 quả', '10 quả', '2 quả', '11 quả', 1],
  ['Toán', 'Số "mười bảy" viết là:', '71', '17', '107', '7', 1],
  ['Toán', 'Số 50 đọc là:', 'Năm mươi', 'Năm không', 'Năm mười', 'Lăm mươi', 0],
  ['Toán', 'Số tiếp theo trong dãy 2, 4, 6, ... là số mấy?', '7', '8', '10', '9', 1],
  ['Toán', 'Số tiếp theo trong dãy 10, 20, 30, ... là số mấy?', '31', '40', '50', '35', 1],
  ['Toán', 'Kết quả của phép trừ 9 − 0 bằng mấy?', '0', '9', '8', '90', 1],
  ['Toán', 'Kết quả của phép cộng 0 + 7 bằng mấy?', '0', '7', '70', '1', 1],
  ['Toán', 'Kết quả của phép tính 3 + 2 + 1 bằng mấy?', '5', '6', '7', '4', 1],
  ['Toán', 'Trong các số 47, 65, 39, 56, số nào lớn nhất?', '47', '65', '39', '56', 1],
  ['Toán', 'Chọn dấu thích hợp: 38 ... 83', '<', '>', '=', '+', 0],

  // ===== TIẾNG VIỆT (35 câu) =====
  ['Tiếng Việt', 'Tiếng nào dưới đây có chứa âm "ch"?', 'Cá rô', 'Con chó', 'Quả cam', 'Cái ca', 1],
  ['Tiếng Việt', 'Điền chữ thích hợp vào chỗ chấm: "...ế gỗ" (g hay gh)?', 'g', 'gh', 'ng', 'kh', 1],
  ['Tiếng Việt', 'Điền c hoặc k vào chỗ chấm: "Con ...iến"?', 'c', 'k', 'q', 'ch', 1],
  ['Tiếng Việt', 'Từ nào dưới đây chỉ người thân trong gia đình?', 'Cái bàn', 'Quyển vở', 'Bà ngoại', 'Cây bàng', 2],
  ['Tiếng Việt', 'Điền chữ thích hợp vào chỗ chấm: "...ỉ hè" (ng hay ngh)?', 'ng', 'ngh', 'g', 'gh', 1],
  ['Tiếng Việt', 'Điền chữ thích hợp vào chỗ chấm: "...à voi" (ng hay ngh)?', 'ng', 'ngh', 'g', 'gh', 0],
  ['Tiếng Việt', 'Điền chữ thích hợp vào chỗ chấm: "Quả ...am"', 'c', 'k', 'q', 'g', 0],
  ['Tiếng Việt', 'Tiếng "mẹ" có dấu thanh gì?', 'Dấu sắc', 'Dấu nặng', 'Dấu huyền', 'Dấu hỏi', 1],
  ['Tiếng Việt', 'Tiếng "bà" có dấu thanh gì?', 'Dấu sắc', 'Dấu huyền', 'Dấu ngã', 'Dấu nặng', 1],
  ['Tiếng Việt', 'Tiếng "cá" có dấu thanh gì?', 'Dấu sắc', 'Dấu huyền', 'Dấu hỏi', 'Dấu nặng', 0],
  ['Tiếng Việt', 'Tiếng "bố" có âm đầu là âm gì?', 'b', 'ô', 'bô', 'ố', 0],
  ['Tiếng Việt', 'Tiếng "hoa" có vần gì?', 'oa', 'ho', 'a', 'h', 0],
  ['Tiếng Việt', 'Tiếng nào có vần "an"?', 'Cái bàn', 'Con mèo', 'Quả na', 'Cây tre', 0],
  ['Tiếng Việt', 'Tiếng nào có vần "ong"?', 'Con ong', 'Con cá', 'Quả cam', 'Cái ca', 0],
  ['Tiếng Việt', 'Từ nào chỉ con vật?', 'Con mèo', 'Cái bút', 'Quả chuối', 'Bông hoa', 0],
  ['Tiếng Việt', 'Từ nào chỉ đồ dùng học tập?', 'Bút chì', 'Con gà', 'Cây bàng', 'Quả táo', 0],
  ['Tiếng Việt', 'Từ nào chỉ một loại quả?', 'Quả xoài', 'Con trâu', 'Cái ghế', 'Ông bà', 0],
  ['Tiếng Việt', 'Chữ cái đầu câu phải viết như thế nào?', 'Viết chữ thường', 'Viết hoa', 'Viết nghiêng', 'Viết thật nhỏ', 1],
  ['Tiếng Việt', 'Cuối câu kể, em đặt dấu câu nào?', 'Dấu chấm', 'Dấu chấm hỏi', 'Dấu phẩy', 'Dấu gạch ngang', 0],
  ['Tiếng Việt', 'Sắp xếp các từ "em / yêu / mẹ" thành câu đúng:', 'Em yêu mẹ.', 'Mẹ em yêu.', 'Yêu em mẹ.', 'Em mẹ yêu.', 0],
  ['Tiếng Việt', 'Tiếng nào có âm "kh"?', 'Quả khế', 'Con gà', 'Cái ca', 'Quả na', 0],
  ['Tiếng Việt', 'Tiếng nào có âm "nh"?', 'Ngôi nhà', 'Con dê', 'Cái mũ', 'Quả bí', 0],
  ['Tiếng Việt', 'Tiếng nào có âm "qu"?', 'Quả cam', 'Cá rô', 'Bé Hà', 'Cái ô', 0],
  ['Tiếng Việt', 'Tiếng nào có âm "tr"?', 'Cây tre', 'Con cá', 'Cái nơ', 'Quả bí', 0],
  ['Tiếng Việt', 'Từ nào viết đúng chính tả?', 'Cái ghế', 'Cái gế', 'Cái ngế', 'Cái kế', 0],
  ['Tiếng Việt', 'Từ nào viết đúng chính tả?', 'Nghỉ ngơi', 'Ngỉ ngơi', 'Nghỉ nghơi', 'Ngỉ nghơi', 0],
  ['Tiếng Việt', 'Từ nào viết đúng chính tả?', 'Con kiến', 'Con ciến', 'Kon kiến', 'Con quiến', 0],
  ['Tiếng Việt', 'Từ nào trái nghĩa với "to"?', 'Lớn', 'Nhỏ', 'Cao', 'Dài', 1],
  ['Tiếng Việt', 'Từ nào trái nghĩa với "cao"?', 'Thấp', 'Dài', 'To', 'Rộng', 0],
  ['Tiếng Việt', 'Từ nào chỉ màu sắc?', 'Xanh', 'Chạy', 'Cái bàn', 'Con mèo', 0],
  ['Tiếng Việt', 'Từ nào chỉ hoạt động?', 'Đọc sách', 'Quyển vở', 'Bông hoa', 'Con chó', 0],
  ['Tiếng Việt', 'Khi gặp cô giáo, em chào thế nào cho lễ phép?', 'Em chào cô ạ!', 'Chào nhé!', 'Ê cô!', 'Không cần chào', 0],
  ['Tiếng Việt', 'Tiếng nào có vần "uôi"?', 'Quả chuối', 'Con cá', 'Cái bàn', 'Ngôi nhà', 0],
  ['Tiếng Việt', 'Tiếng nào có âm "ph"?', 'Phố cổ', 'Bờ hồ', 'Cá cờ', 'Lá đa', 0],
  ['Tiếng Việt', 'Tiếng nào có âm "gi"?', 'Cái giỏ', 'Con dê', 'Cái rổ', 'Cái mũ', 0],

  // ===== TỰ NHIÊN VÀ XÃ HỘI (25 câu) =====
  ['TN&XH', 'Khi qua đường, đèn giao thông màu gì bật sáng thì được phép đi?', 'Đèn đỏ', 'Đèn vàng', 'Đèn xanh', 'Đèn tím', 2],
  ['TN&XH', 'Để răng trắng sạch không bị sâu, em cần đánh răng khi nào?', 'Chỉ buổi sáng', 'Tối trước khi ngủ và sáng thức dậy', 'Khi đau răng', 'Mỗi tuần 1 lần', 1],
  ['TN&XH', 'Bộ phận nào giúp em nghe được tiếng chuông reo?', 'Đôi mắt', 'Cái mũi', 'Đôi tai', 'Làn da', 2],
  ['TN&XH', 'Đôi mắt giúp em làm gì?', 'Nhìn', 'Nghe', 'Ngửi', 'Nếm', 0],
  ['TN&XH', 'Cái mũi giúp em làm gì?', 'Nhìn', 'Nghe', 'Ngửi', 'Sờ', 2],
  ['TN&XH', 'Cái lưỡi giúp em làm gì?', 'Nếm vị thức ăn', 'Nghe', 'Nhìn', 'Ngửi', 0],
  ['TN&XH', 'Em cần rửa tay khi nào?', 'Trước khi ăn và sau khi đi vệ sinh', 'Chỉ khi tay dính bùn', 'Mỗi tuần một lần', 'Không cần rửa tay', 0],
  ['TN&XH', 'Khi ngồi sau xe máy, em cần làm gì?', 'Đội mũ bảo hiểm', 'Đứng lên yên xe', 'Buông tay ra', 'Đùa nghịch', 0],
  ['TN&XH', 'Gặp đèn đỏ, người đi đường phải làm gì?', 'Dừng lại', 'Đi thật nhanh', 'Chạy qua đường', 'Bấm còi', 0],
  ['TN&XH', 'Bộ phận nào của cây thường nằm dưới đất?', 'Rễ', 'Lá', 'Hoa', 'Quả', 0],
  ['TN&XH', 'Con vật nào sống dưới nước?', 'Con cá', 'Con mèo', 'Con gà', 'Con chó', 0],
  ['TN&XH', 'Con vật nào biết bay?', 'Con chim', 'Con lợn', 'Con bò', 'Con cá', 0],
  ['TN&XH', 'Trời mưa, khi ra ngoài em cần mang theo gì?', 'Áo mưa', 'Quạt điện', 'Kính bơi', 'Khăn tắm', 0],
  ['TN&XH', 'Ban đêm, trên bầu trời ta thường nhìn thấy gì?', 'Mặt Trăng và các vì sao', 'Mặt Trời chói chang', 'Cầu vồng', 'Đàn chim bay', 0],
  ['TN&XH', 'Ở trường, em mượn sách đọc ở đâu?', 'Thư viện', 'Nhà ăn', 'Sân trường', 'Phòng y tế', 0],
  ['TN&XH', 'Khi bị mệt, ốm ở trường, em đến đâu?', 'Thư viện', 'Phòng y tế', 'Sân bóng', 'Căng tin', 1],
  ['TN&XH', 'Ai là người dạy em học ở trường?', 'Thầy giáo, cô giáo', 'Bác sĩ', 'Chú công an', 'Đầu bếp', 0],
  ['TN&XH', 'Ngày Nhà giáo Việt Nam là ngày nào?', '20 tháng 11', '1 tháng 6', '2 tháng 9', '8 tháng 3', 0],
  ['TN&XH', 'Ngày Quốc tế Thiếu nhi là ngày nào?', '20 tháng 11', '1 tháng 6', '2 tháng 9', '8 tháng 3', 1],
  ['TN&XH', 'Con vật nào được nuôi trong nhà?', 'Con mèo', 'Con hổ', 'Con sư tử', 'Con voi rừng', 0],
  ['TN&XH', 'Ăn nhiều rau xanh và hoa quả giúp em thế nào?', 'Khoẻ mạnh', 'Bị sâu răng', 'Mệt mỏi', 'Buồn ngủ', 0],
  ['TN&XH', 'Khi đọc sách, em nên ngồi như thế nào?', 'Ngồi thẳng lưng, đủ ánh sáng', 'Nằm sấp để đọc', 'Đọc trong bóng tối', 'Để sách sát mắt', 0],
  ['TN&XH', 'Khi đi bộ qua đường, em đi ở đâu?', 'Trên vạch kẻ đường dành cho người đi bộ', 'Giữa đường', 'Chỗ nào cũng được', 'Chạy chéo qua đường', 0],
  ['TN&XH', 'Bố của mẹ em gọi là gì?', 'Ông nội', 'Ông ngoại', 'Chú', 'Bác', 1],
  ['TN&XH', 'Cây cần gì để sống và lớn lên?', 'Nước và ánh sáng', 'Bóng tối', 'Muối', 'Kẹo ngọt', 0],
  // Gemini thêm HK1 tuần 11-18
  ["Toán", "4 + 5 bằng mấy?", "9", "8", "10", "7", 0],
  ["Toán", "3 + 7 bằng mấy?", "9", "10", "8", "6", 1],
  ["Toán", "6 + 2 bằng mấy?", "7", "9", "8", "5", 2],
  ["Toán", "9 - 4 bằng mấy?", "4", "6", "3", "5", 3],
  ["Toán", "10 - 3 bằng mấy?", "7", "6", "8", "5", 0],
  ["Toán", "8 - 5 bằng mấy?", "2", "3", "4", "5", 1],
  ["Toán", "7 + 0 bằng mấy?", "0", "8", "7", "6", 2],
  ["Toán", "6 - 6 bằng mấy?", "1", "6", "12", "0", 3],
  ["Toán", "Số nào lớn nhất trong các số: 4, 9, 2, 7?", "9", "7", "4", "2", 0],
  ["Toán", "Số nào bé nhất trong các số: 8, 3, 6, 5?", "5", "3", "6", "8", 1],
  ["Toán", "Số liền sau của số 8 là số mấy?", "7", "10", "9", "6", 2],
  ["Toán", "Số liền trước của số 6 là số mấy?", "7", "4", "8", "5", 3],
  ["Toán", "Hình tam giác có mấy cạnh?", "3 cạnh", "4 cạnh", "2 cạnh", "5 cạnh", 0],
  ["Toán", "Có 5 quả táo, thêm 4 quả nữa. Có tất cả mấy quả?", "8 quả", "9 quả", "10 quả", "7 quả", 1],
  ["Tiếng Việt", "Điền c hay k vào chỗ trống: “...on cá”?", "k", "g", "c", "d", 2],
  ["Tiếng Việt", "Điền c hay k vào chỗ trống: “cái ...éo”?", "c", "t", "n", "k", 3],
  ["Tiếng Việt", "Điền g hay gh vào chỗ trống: “cái ...ế”?", "gh", "g", "ng", "c", 0],
  ["Tiếng Việt", "Điền g hay gh vào chỗ trống: “con ...à”?", "gh", "g", "k", "ngh", 1],
  ["Tiếng Việt", "Điền ng hay ngh vào chỗ trống: “lắng ...e”?", "ng", "g", "ngh", "gh", 2],
  ["Tiếng Việt", "Từ nào viết đúng chính tả?", "Mặt chời", "Mặc trời", "Mặc chời", "Mặt trời", 3],
  ["Tiếng Việt", "Từ nào viết đúng chính tả?", "Bông hoa", "Bông hoan", "Pông hoa", "Bông hỏa", 0],
  ["Tiếng Việt", "Con vật nào biết gáy “ò ó o” buổi sáng?", "Con mèo", "Con gà trống", "Con cá", "Con rùa", 1],
  ["Tiếng Anh", "Số 5 tiếng Anh là gì?", "four", "six", "five", "two", 2],
  ["Tiếng Anh", "Số 8 tiếng Anh là gì?", "seven", "nine", "ten", "eight", 3],
  ["Tiếng Anh", "Màu vàng tiếng Anh là gì?", "yellow", "blue", "red", "green", 0],
  ["Tiếng Anh", "Màu xanh lá tiếng Anh là gì?", "pink", "green", "black", "white", 1],
  ["Tiếng Anh", "Con mèo tiếng Anh là gì?", "dog", "bird", "cat", "fish", 2],
  ["Tiếng Anh", "Con chó tiếng Anh là gì?", "cat", "duck", "pig", "dog", 3],
  ["Tiếng Anh", "Quyển sách tiếng Anh là gì?", "book", "pen", "bag", "desk", 0],
  ["Tiếng Anh", "Quả táo tiếng Anh là gì?", "banana", "apple", "orange", "milk", 1]
];

function chuyenNganHang(duLieu) {
  return duLieu.map(function (d) { return { mon: d[0], cau: d[1], dapAn: [d[2], d[3], d[4], d[5]], dung: d[6] }; });
}
const NGAN_HANG_LOP_3 = chuyenNganHang(DU_LIEU_LOP_3);
const NGAN_HANG_LOP_1 = chuyenNganHang(DU_LIEU_LOP_1);

/* ---------------------------------------------------------------------
   2. CẤU HÌNH TRÒ CHƠI
   --------------------------------------------------------------------- */
const CAU_HINH = {
  soCau: 10,
  soPhao: 1,
  thoiGian: { lucie: 15, lucas: 20 },   // số giây suy nghĩ mỗi câu
  khoangCachO: 2.0,
  oChinh: 44                            // chỉ số mảng của ô số 45
};
// Tỷ lệ thí sinh AI (trên 98 bạn) còn trụ lại sau mỗi câu – giảm dần đến cuối chỉ còn 0–1 bạn
// Tỷ lệ áp dụng trên 99 bạn AI
const TY_LE_CON_LAI = [0.87, 0.74, 0.61, 0.49, 0.38, 0.27, 0.17, 0.09, 0.04, 0.0];

const THONG_TIN = {
  lucie: { ten: 'Lucie', danhXung: 'Chị Lucie', lop: 3, tenLop: '3A6', nganHang: NGAN_HANG_LOP_3, mauNhan: '#ec4899' },
  lucas: { ten: 'Lucas', danhXung: 'Em Lucas', lop: 1, tenLop: '1A5', nganHang: NGAN_HANG_LOP_1, mauNhan: '#3b82f6' }
};
const MAU_MON = { 'Toán': '#0ea5e9', 'Tiếng Việt': '#f43f5e', 'TN&XH': '#10b981', 'Tiếng Anh': '#8b5cf6' };
const CHU_CAI = ['A', 'B', 'C', 'D'];
const MAU_CHU_CAI = { A: '#ef4444', B: '#3b82f6', C: '#22c55e', D: '#f59e0b', '?': '#94a3b8' };

const TRO_CHOI = {
  phien: 0,
  giaiDoan: 'chon',        // chon | gioiThieu | traLoi | congBo | thongKe | chienThang | ketThuc
  chinh: null,
  dongHanh: null,
  cauHoi: [],
  chiSo: 0,
  phao: CAU_HINH.soPhao,
  soPhaoDaDung: 0,
  soCauDung: 0,
  dangDemGio: false,
  thoiGianConLai: 0,
  thoiGianToiDa: 15,
  giayDaTich: -1,
  daChot: false,
  luaChon: -1,
  hanhDongTiep: null,
  phu: null,
  diem: 0,
  chuoi: 0,
  chuoiMax: 0,
  giayKhiChot: 0,
  maPhaoHoa: null,
  lichGiaiLao: [],
  tongLoaiTruoc: 0,
  conLaiTruoc: 100
};

/* ---------------------------------------------------------------------
   3. HÀM TIỆN ÍCH
   --------------------------------------------------------------------- */
const V3 = THREE.Vector3;
function ngauNhien(a, b) { return a + Math.random() * (b - a); }
function soNguyen(a, b) { return Math.floor(ngauNhien(a, b + 1)); }
function tronMang(mang) {
  const banSao = mang.slice();
  for (let i = banSao.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tam = banSao[i]; banSao[i] = banSao[j]; banSao[j] = tam;
  }
  return banSao;
}
function cho(ms) { return new Promise(function (xong) { setTimeout(xong, ms); }); }
function eMuot(p) { return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
function eRa(p) { return 1 - Math.pow(1 - p, 3); }
function $(id) { return document.getElementById(id); }
function hien(id, kieu) { const el = $(id); el.classList.remove('an'); if (kieu) el.style.display = kieu; }
function anDi(id) { const el = $(id); el.classList.add('an'); el.style.display = ''; }
function veHinhBoGoc(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
const PHONG_CHU = '"Baloo 2", "Arial Rounded MT Bold", Arial, sans-serif';

/* Kết cấu vẽ bằng canvas – được vẽ lại khi phông chữ tải xong */
const DANH_SACH_KET_CAU = [];
function taoKetCau(rong, cao, hamVe) {
  const canvas = document.createElement('canvas');
  canvas.width = rong; canvas.height = cao;
  const ctx = canvas.getContext('2d');
  hamVe(ctx, rong, cao);
  const ketCau = new THREE.CanvasTexture(canvas);
  ketCau.encoding = THREE.sRGBEncoding;
  ketCau.anisotropy = 4;
  DANH_SACH_KET_CAU.push({ ctx: ctx, rong: rong, cao: cao, hamVe: hamVe, ketCau: ketCau });
  return ketCau;
}
function veLaiTatCaKetCau() {
  DANH_SACH_KET_CAU.forEach(function (muc) {
    muc.ctx.clearRect(0, 0, muc.rong, muc.cao);
    muc.hamVe(muc.ctx, muc.rong, muc.cao);
    muc.ketCau.needsUpdate = true;
  });
}

/* Hệ thống chuyển động (tween) */
const DANH_SACH_TWEEN = [];
function taoTween(giay, capNhat, xong, nhan) {
  if (nhan) huyTween(nhan);
  DANH_SACH_TWEEN.push({ t: 0, d: Math.max(0.0001, giay), capNhat: capNhat, xong: xong, nhan: nhan });
}
function huyTween(nhan) {
  for (let i = DANH_SACH_TWEEN.length - 1; i >= 0; i--) {
    if (DANH_SACH_TWEEN[i].nhan === nhan) {
      const tw = DANH_SACH_TWEEN[i];
      DANH_SACH_TWEEN.splice(i, 1);
      if (tw.xong) tw.xong();
    }
  }
}
function capNhatTween(dt) {
  for (let i = DANH_SACH_TWEEN.length - 1; i >= 0; i--) {
    const tw = DANH_SACH_TWEEN[i];
    if (!tw) continue;
    tw.t += dt;
    const p = Math.min(1, tw.t / tw.d);
    tw.capNhat(p);
    if (p >= 1) {
      const viTri = DANH_SACH_TWEEN.indexOf(tw);
      if (viTri >= 0) DANH_SACH_TWEEN.splice(viTri, 1);
      if (tw.xong) tw.xong();
    }
  }
}

/* ---------------------------------------------------------------------
   4. ÂM THANH (WEB AUDIO API)
   --------------------------------------------------------------------- */
const AM_THANH = {
  ctx: null,
  tong: null,
  bat: true,
  boDemOn: null,
  khoiTao: function () {
    if (!this.ctx) {
      const LopAudio = window.AudioContext || window.webkitAudioContext;
      if (!LopAudio) return;
      this.ctx = new LopAudio();
      this.tong = this.ctx.createGain();
      this.tong.gain.value = 0.55;
      this.tong.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    batDauNhac();
  },
  not: function (tanSo, batDau, doDai, kieuSong, amLuong) {
    if (!this.ctx || !this.bat) return;
    const t = this.ctx.currentTime + batDau;
    const daoDong = this.ctx.createOscillator();
    const khuech = this.ctx.createGain();
    daoDong.type = kieuSong || 'sine';
    daoDong.frequency.setValueAtTime(tanSo, t);
    khuech.gain.setValueAtTime(0.0001, t);
    khuech.gain.exponentialRampToValueAtTime(amLuong || 0.25, t + 0.015);
    khuech.gain.exponentialRampToValueAtTime(0.0001, t + doDai);
    daoDong.connect(khuech); khuech.connect(this.tong);
    daoDong.start(t); daoDong.stop(t + doDai + 0.05);
  },
  quet: function (tu, den, batDau, doDai, kieuSong, amLuong) {
    if (!this.ctx || !this.bat) return;
    const t = this.ctx.currentTime + batDau;
    const daoDong = this.ctx.createOscillator();
    const khuech = this.ctx.createGain();
    daoDong.type = kieuSong || 'sine';
    daoDong.frequency.setValueAtTime(tu, t);
    daoDong.frequency.exponentialRampToValueAtTime(den, t + doDai);
    khuech.gain.setValueAtTime(0.0001, t);
    khuech.gain.exponentialRampToValueAtTime(amLuong || 0.2, t + 0.03);
    khuech.gain.exponentialRampToValueAtTime(0.0001, t + doDai);
    daoDong.connect(khuech); khuech.connect(this.tong);
    daoDong.start(t); daoDong.stop(t + doDai + 0.05);
  },
  bam: function () { this.not(700, 0, 0.12, 'triangle', 0.22); this.not(1050, 0.05, 0.12, 'triangle', 0.15); },
  tich: function (gap) { this.not(gap ? 1250 : 880, 0, 0.07, 'square', 0.07); },
  dung: function () {
    const self = this;
    [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) { self.not(f, i * 0.09, 0.4, 'triangle', 0.24); });
  },
  sai: function () { this.not(233, 0, 0.3, 'sawtooth', 0.12); this.not(175, 0.2, 0.55, 'sawtooth', 0.12); },
  loai: function () { this.quet(900, 120, 0, 0.7, 'sine', 0.16); this.quet(600, 90, 0.12, 0.7, 'triangle', 0.1); },
  hoiHop: function () {
    for (let i = 0; i < 8; i++) this.not(392 + i * 40, i * 0.1, 0.12, 'triangle', 0.08 + i * 0.012);
  },
  phao: function () {
    const self = this;
    [392, 523.25, 659.25, 783.99, 1046.5, 1318.5].forEach(function (f, i) { self.not(f, i * 0.07, 0.35, 'sine', 0.22); });
  },
  chuong: function () {
    const tanSoGoc = 587.33;
    const self = this;
    [[1, 0.42, 3.8], [2.0, 0.2, 2.6], [2.76, 0.15, 2.0], [4.07, 0.09, 1.4], [5.4, 0.06, 1.1], [0.5, 0.18, 4.2]].forEach(function (thanhPhan) {
      self.not(tanSoGoc * thanhPhan[0], 0, thanhPhan[2], 'sine', thanhPhan[1]);
    });
  },
  tiengNo: function () {
    if (!this.ctx || !this.bat) return;
    const ctx = this.ctx;
    if (!this.boDemOn) {
      const doDai = ctx.sampleRate;
      const boDem = ctx.createBuffer(1, doDai, ctx.sampleRate);
      const duLieu = boDem.getChannelData(0);
      for (let i = 0; i < doDai; i++) duLieu[i] = Math.random() * 2 - 1;
      this.boDemOn = boDem;
    }
    const nguon = ctx.createBufferSource();
    nguon.buffer = this.boDemOn;
    const loc = ctx.createBiquadFilter();
    loc.type = 'lowpass'; loc.frequency.value = ngauNhien(700, 1400);
    const khuech = ctx.createGain();
    const t = ctx.currentTime;
    khuech.gain.setValueAtTime(0.3, t);
    khuech.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    nguon.connect(loc); loc.connect(khuech); khuech.connect(this.tong);
    nguon.start(t); nguon.stop(t + 1);
    for (let k = 0; k < 6; k++) this.not(ngauNhien(2200, 4200), 0.12 + k * 0.07, 0.05, 'square', 0.015);
  },
  phongLen: function () { this.quet(260, 1100, 0, 0.75, 'triangle', 0.04); },
  kenTieuDe: function () {
    this.quet(220, 1400, 0, 0.35, 'sawtooth', 0.05);
    this.not(784, 0.32, 0.25, 'triangle', 0.18); this.not(1046.5, 0.42, 0.4, 'triangle', 0.18);
  },
  lapLanh: function () {
    const self = this;
    [1568, 2093, 2637, 3136].forEach(function (f, i) { self.not(f, i * 0.06, 0.25, 'sine', 0.06); });
  },
  buon: function () {
    const self = this;
    [392, 370, 349.23, 329.63].forEach(function (f, i) { self.not(f, i * 0.35, i === 3 ? 0.9 : 0.4, 'triangle', 0.16); });
  },
  chienThang: function () {
    const giai = [
      [523.25, 0, 0.18], [523.25, 0.2, 0.18], [523.25, 0.4, 0.18], [659.25, 0.6, 0.5],
      [587.33, 1.15, 0.18], [659.25, 1.35, 0.18], [783.99, 1.55, 0.7],
      [659.25, 2.3, 0.18], [783.99, 2.5, 0.18], [1046.5, 2.7, 1.2]
    ];
    const self = this;
    giai.forEach(function (n) {
      self.not(n[0], n[1], n[2] + 0.2, 'triangle', 0.22);
      self.not(n[0] / 2, n[1], n[2] + 0.2, 'sine', 0.12);
    });
    [261.63, 329.63, 392].forEach(function (f) { self.not(f, 2.7, 1.6, 'sine', 0.1); });
  }
};
document.addEventListener('pointerdown', function () { AM_THANH.khoiTao(); }, { once: false });
document.addEventListener('keydown', function () { AM_THANH.khoiTao(); }, { once: false });
$('nutNhac').addEventListener('click', function () {
  AM_THANH.khoiTao();
  NHAC.bat = !NHAC.bat;
  $('nutNhac').textContent = NHAC.bat ? '🎵' : '🔕';
});
$('nutAmThanh').addEventListener('click', function () {
  AM_THANH.khoiTao();
  AM_THANH.bat = !AM_THANH.bat;
  $('nutAmThanh').textContent = AM_THANH.bat ? '🔊' : '🔇';
  if (!AM_THANH.bat && 'speechSynthesis' in window) window.speechSynthesis.cancel();
});

/* Đọc câu hỏi bằng giọng nói tiếng Việt (nếu máy có) */
function docCauHoi() {
  if (!('speechSynthesis' in window) || !AM_THANH.bat) return;
  const q = TRO_CHOI.cauHoi[TRO_CHOI.chiSo];
  if (!q) return;
  window.speechSynthesis.cancel();
  const vanBan = q.cau.replace('×', 'nhân') + '. ' + q.dapAnTron.map(function (d, i) { return 'Đáp án ' + CHU_CAI[i] + ': ' + d; }).join('. ');
  const loi = new SpeechSynthesisUtterance(vanBan);
  loi.lang = 'vi-VN';
  const giong = window.speechSynthesis.getVoices().find(function (g) { return g.lang && g.lang.toLowerCase().indexOf('vi') === 0; });
  if (giong) loi.voice = giong;
  loi.rate = 0.9;
  giamNhac(0.12);
  loi.onend = khoiPhucNhac; loi.onerror = khoiPhucNhac;
  window.speechSynthesis.speak(loi);
}
if ('speechSynthesis' in window) { window.speechSynthesis.getVoices(); } else { $('nutDoc').classList.add('an'); }

/* ---------------------------------------------------------------------
   5. DỰNG CẢNH 3D
   --------------------------------------------------------------------- */
const khung = $('khung3d');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.NoToneMapping;
khung.appendChild(renderer.domElement);

const canh = new THREE.Scene();
canh.background = new THREE.Color(0x140c33);
canh.fog = new THREE.Fog(0x140c33, 45, 95);

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 220);
const camViTri = new V3(0, 3.5, -21.4);
const camNhin = new V3(0, 2.6, -15.2);

/* Bản đồ phản chiếu cho kim loại vàng */
const boTaoPMREM = new THREE.PMREMGenerator(renderer);
const canhPhanChieu = new THREE.Scene();
canhPhanChieu.background = new THREE.Color(0x2a1d66);
(function () {
  const tamTren = new THREE.Mesh(new THREE.BoxGeometry(60, 1, 60), new THREE.MeshBasicMaterial({ color: 0xfff2d0 }));
  tamTren.position.set(0, 30, 0); canhPhanChieu.add(tamTren);
  const tamHong = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 30), new THREE.MeshBasicMaterial({ color: 0xff6fb5 }));
  tamHong.position.set(-30, 8, 0); canhPhanChieu.add(tamHong);
  const tamXanh = new THREE.Mesh(new THREE.BoxGeometry(1, 20, 30), new THREE.MeshBasicMaterial({ color: 0x5ad1ff }));
  tamXanh.position.set(30, 8, 0); canhPhanChieu.add(tamXanh);
  const tamCam = new THREE.Mesh(new THREE.BoxGeometry(30, 14, 1), new THREE.MeshBasicMaterial({ color: 0xffb347 }));
  tamCam.position.set(0, 6, -30); canhPhanChieu.add(tamCam);
  const tamTim = new THREE.Mesh(new THREE.BoxGeometry(30, 14, 1), new THREE.MeshBasicMaterial({ color: 0x7c5cff }));
  tamTim.position.set(0, 6, 30); canhPhanChieu.add(tamTim);
})();
const banDoPhanChieu = boTaoPMREM.fromScene(canhPhanChieu, 0.04).texture;

/* Ánh sáng sân khấu */
canh.add(new THREE.HemisphereLight(0xd6dcff, 0x3a2a6a, 0.5));
const denChinh = new THREE.DirectionalLight(0xfff3e0, 0.85);
denChinh.position.set(-10, 26, -18);
denChinh.castShadow = true;
denChinh.shadow.mapSize.set(2048, 2048);
denChinh.shadow.camera.left = -24; denChinh.shadow.camera.right = 24;
denChinh.shadow.camera.top = 24; denChinh.shadow.camera.bottom = -24;
denChinh.shadow.camera.near = 1; denChinh.shadow.camera.far = 80;
denChinh.shadow.bias = -0.0006;
denChinh.target.position.set(0, 0, -3);
canh.add(denChinh); canh.add(denChinh.target);
const denPhu = new THREE.DirectionalLight(0xb9c8ff, 0.45);
denPhu.position.set(14, 14, 18); canh.add(denPhu);
const denHong = new THREE.PointLight(0xff5fb0, 1.1, 40); denHong.position.set(-15, 7, 4); canh.add(denHong);
const denLam = new THREE.PointLight(0x48c8ff, 1.1, 40); denLam.position.set(15, 7, 4); canh.add(denLam);
const denChuong = new THREE.PointLight(0xffd36b, 1.6, 20); denChuong.position.set(0, 5, -12); canh.add(denChuong);

/* Sàn sân khấu */
const san = new THREE.Mesh(
  new THREE.CylinderGeometry(36, 36, 0.4, 72),
  new THREE.MeshStandardMaterial({ color: 0x1d1552, roughness: 0.35, metalness: 0.25 })
);
san.position.y = -0.2; san.receiveShadow = true; canh.add(san);
[14.5, 17, 24].forEach(function (banKinh, i) {
  const vong = new THREE.Mesh(
    new THREE.TorusGeometry(banKinh, 0.08, 8, 120),
    new THREE.MeshBasicMaterial({ color: i === 1 ? 0xffc94d : 0x6b5cff })
  );
  vong.rotation.x = -Math.PI / 2; vong.position.y = 0.02; canh.add(vong);
});
const nenLuoi = new THREE.Mesh(
  new THREE.BoxGeometry(21.6, 0.12, 21.6),
  new THREE.MeshStandardMaterial({ color: 0x2a2170, roughness: 0.4, metalness: 0.2, emissive: 0x150b4d, emissiveIntensity: 0.6 })
);
nenLuoi.position.y = 0.06; nenLuoi.receiveShadow = true; canh.add(nenLuoi);
const vatLieuDenLED = new THREE.MeshBasicMaterial({ color: 0x5ee7ff });
[[0, -10.85, 21.8, 0.18], [0, 10.85, 21.8, 0.18], [-10.85, 0, 0.18, 21.8], [10.85, 0, 0.18, 21.8]].forEach(function (c) {
  const thanh = new THREE.Mesh(new THREE.BoxGeometry(c[2], 0.16, c[3]), vatLieuDenLED);
  thanh.position.set(c[0], 0.13, c[1]); canh.add(thanh);
});

/* Màn hình LED phía sau sân khấu */
function veManHinhNen(ctx, w, h) {
  const nen = ctx.createLinearGradient(0, 0, 0, h);
  nen.addColorStop(0, '#2b1170'); nen.addColorStop(0.6, '#1b2b93'); nen.addColorStop(1, '#0b3a8c');
  ctx.fillStyle = nen; ctx.fillRect(0, 0, w, h);
  ctx.save(); ctx.translate(w / 2, h * 1.15);
  for (let i = 0; i < 28; i++) {
    ctx.rotate(Math.PI * 2 / 28);
    ctx.fillStyle = i % 2 ? 'rgba(255,255,255,0.05)' : 'rgba(255,215,90,0.06)';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-80, -h * 2); ctx.lineTo(80, -h * 2); ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  for (let i = 0; i < 140; i++) {
    const x = (i * 197) % w, y = (i * 89) % h, r = (i % 3) + 1;
    ctx.fillStyle = 'rgba(255,255,255,' + (0.25 + (i % 5) * 0.12) + ')';
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.font = '800 200px ' + PHONG_CHU;
  const vang = ctx.createLinearGradient(0, h * 0.35, 0, h * 0.7);
  vang.addColorStop(0, '#fff7c2'); vang.addColorStop(0.5, '#ffd43b'); vang.addColorStop(1, '#f59f00');
  ctx.lineWidth = 16; ctx.strokeStyle = '#6b2f00'; ctx.strokeText('RUNG CHUÔNG VÀNG', w / 2, h * 0.5);
  ctx.fillStyle = vang; ctx.fillText('RUNG CHUÔNG VÀNG', w / 2, h * 0.5);
  ctx.font = '700 68px ' + PHONG_CHU; ctx.fillStyle = '#ffe9a8';
  ctx.fillText('★ GAMESHOW CỦA HAI CHỊ EM LUCIE & LUCAS ★', w / 2, h * 0.8);
  for (let i = 0; i < 40; i++) {
    ctx.fillStyle = i % 2 ? '#ffd43b' : '#ff7ac2';
    ctx.beginPath(); ctx.arc(30 + i * (w - 60) / 39, 26, 12, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(30 + i * (w - 60) / 39, h - 26, 12, 0, Math.PI * 2); ctx.fill();
  }
}
const manHinhNen = new THREE.Mesh(new THREE.PlaneGeometry(44, 16.5), new THREE.MeshBasicMaterial({ map: taoKetCau(2048, 768, veManHinhNen) }));
manHinhNen.position.set(0, 9, 17); manHinhNen.rotation.y = Math.PI; canh.add(manHinhNen);
const khungManHinh = new THREE.Mesh(new THREE.BoxGeometry(45.4, 17.9, 0.5), new THREE.MeshStandardMaterial({ color: 0xffc94d, metalness: 0.7, roughness: 0.3, envMap: banDoPhanChieu }));
khungManHinh.position.set(0, 9, 17.3); canh.add(khungManHinh);

/* Chùm đèn quét sân khấu */
const CHUM_SANG = [];
[[-12, -6, 0xff6fb5], [12, -6, 0x5ee7ff], [-12, 8, 0xffd43b], [12, 8, 0xa78bfa], [0, 12, 0xffffff]].forEach(function (c, i) {
  const hinhNon = new THREE.ConeGeometry(2.4, 24, 28, 1, true);
  hinhNon.translate(0, -12, 0);
  const non = new THREE.Mesh(hinhNon, new THREE.MeshBasicMaterial({
    color: c[2], transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide
  }));
  non.position.set(c[0], 24, c[1]);
  non.userData.pha = i * 1.3;
  canh.add(non); CHUM_SANG.push(non);
});

/* Bầu trời sao */
(function () {
  const soSao = 500; const viTriSao = new Float32Array(soSao * 3);
  for (let i = 0; i < soSao; i++) {
    const goc = Math.random() * Math.PI * 2, cao = ngauNhien(8, 60), banKinh = ngauNhien(55, 80);
    viTriSao[i * 3] = Math.cos(goc) * banKinh; viTriSao[i * 3 + 1] = cao; viTriSao[i * 3 + 2] = Math.sin(goc) * banKinh;
  }
  const hinhSao = new THREE.BufferGeometry();
  hinhSao.setAttribute('position', new THREE.BufferAttribute(viTriSao, 3));
  canh.add(new THREE.Points(hinhSao, new THREE.PointsMaterial({ color: 0xffffff, size: 0.35, fog: false })));
})();

/* ---------------------------------------------------------------------
   6. LƯỚI 10x10 BỤC THÍ SINH
   --------------------------------------------------------------------- */
const MAU_BUC = { macDinh: 0x5b7cff, dung: 0x22e06b, sai: 0xff3030, canhBao: 0xff9f1a, vang: 0xffd23f, tat: 0x40121e };
const DANH_SACH_BUC = [];
const hinhThanBuc = new THREE.BoxGeometry(1.7, 0.5, 1.7);
const vatLieuThanBuc = new THREE.MeshStandardMaterial({ color: 0x3a3f96, roughness: 0.45, metalness: 0.2 });
const hinhMatBuc = new THREE.BoxGeometry(1.62, 0.07, 1.62);
const hinhSoTruoc = new THREE.PlaneGeometry(1.0, 0.43);
const hinhSoTren = new THREE.PlaneGeometry(0.72, 0.31);
function viTriO(chiSo) {
  const hang = Math.floor(chiSo / 10), cot = chiSo % 10;
  return new V3((4.5 - cot) * CAU_HINH.khoangCachO, 0, -9 + hang * CAU_HINH.khoangCachO);
}
for (let i = 0; i < 100; i++) {
  const nhom = new THREE.Group();
  const viTri = viTriO(i);
  nhom.position.copy(viTri);
  const than = new THREE.Mesh(hinhThanBuc, vatLieuThanBuc);
  than.position.y = 0.25; than.castShadow = true; than.receiveShadow = true; nhom.add(than);
  const vatLieuMat = new THREE.MeshStandardMaterial({ color: 0x1c1c28, emissive: MAU_BUC.macDinh, emissiveIntensity: 0.8, roughness: 0.3 });
  const mat = new THREE.Mesh(hinhMatBuc, vatLieuMat);
  mat.position.y = 0.535; mat.receiveShadow = true; nhom.add(mat);
  const so = i + 1;
  const ketCauSo = taoKetCau(256, 110, function (ctx, w, h) {
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = '800 92px ' + PHONG_CHU;
    ctx.lineWidth = 12; ctx.strokeStyle = 'rgba(12,10,48,0.9)'; ctx.strokeText(String(so), w / 2, h / 2 + 6);
    ctx.fillStyle = '#ffffff'; ctx.fillText(String(so), w / 2, h / 2 + 6);
  });
  const vatLieuSo = new THREE.MeshBasicMaterial({ map: ketCauSo, transparent: true, depthWrite: false });
  const soTruoc = new THREE.Mesh(hinhSoTruoc, vatLieuSo);
  soTruoc.position.set(0, 0.25, -0.852); soTruoc.rotation.y = Math.PI; nhom.add(soTruoc);
  const soTren = new THREE.Mesh(hinhSoTren, vatLieuSo);
  soTren.position.set(0, 0.575, -0.62); soTren.rotation.set(-Math.PI / 2, 0, Math.PI); nhom.add(soTren);
  canh.add(nhom);
  DANH_SACH_BUC.push({ nhom: nhom, vatLieuMat: vatLieuMat, viTri: viTri });
}
function datMauBuc(chiSo, kieu) {
  const buc = DANH_SACH_BUC[chiSo];
  buc.vatLieuMat.emissive.setHex(MAU_BUC[kieu]);
  buc.vatLieuMat.emissiveIntensity = kieu === 'tat' ? 0.5 : (kieu === 'macDinh' ? 0.8 : 1.15);
  buc.vatLieuMat.color.setHex(kieu === 'tat' ? 0x2a1018 : 0x1c1c28);
}

/* ---------------------------------------------------------------------
   7. BỤC VINH QUANG & CHIẾC CHUÔNG VÀNG
   --------------------------------------------------------------------- */
const vatLieuVang = new THREE.MeshStandardMaterial({
  color: 0xffb300, metalness: 0.9, roughness: 0.22, emissive: 0x6a3a00, emissiveIntensity: 0.4,
  envMap: banDoPhanChieu, side: THREE.DoubleSide
});
const vatLieuVangDam = new THREE.MeshStandardMaterial({ color: 0xe69500, metalness: 0.85, roughness: 0.3, envMap: banDoPhanChieu });
const vatLieuDo = new THREE.MeshStandardMaterial({ color: 0xd61f3c, metalness: 0.2, roughness: 0.4, envMap: banDoPhanChieu, envMapIntensity: 0.4 });
const nhomChuong = new THREE.Group();
nhomChuong.position.set(0, 0, -14);
canh.add(nhomChuong);
(function () {
  const tang1 = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.9, 0.6, 48), vatLieuDo);
  tang1.position.y = 0.3; tang1.castShadow = true; tang1.receiveShadow = true; nhomChuong.add(tang1);
  const tang2 = new THREE.Mesh(new THREE.CylinderGeometry(3.05, 3.3, 0.6, 48), vatLieuVangDam);
  tang2.position.y = 0.9; tang2.castShadow = true; tang2.receiveShadow = true; nhomChuong.add(tang2);
  const vienDen = new THREE.Mesh(new THREE.TorusGeometry(3.3, 0.07, 8, 80), new THREE.MeshBasicMaterial({ color: 0xfff3a0 }));
  vienDen.rotation.x = -Math.PI / 2; vienDen.position.y = 0.62; nhomChuong.add(vienDen);
  for (let i = 0; i < 3; i++) {
    const bac = new THREE.Mesh(new THREE.BoxGeometry(2.6 - i * 0.3, 0.3, 0.7), i % 2 ? vatLieuVangDam : vatLieuDo);
    bac.position.set(0, 0.15 + i * 0.3, 3.9 - i * 0.55); bac.castShadow = true; bac.receiveShadow = true;
    nhomChuong.add(bac);
  }
  [-2.6, 2.6].forEach(function (x) {
    const cot = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 5.7, 18), vatLieuDo);
    cot.position.set(x, 1.2 + 2.85, 0); cot.castShadow = true; nhomChuong.add(cot);
    const daiCot = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.06, 8, 24), vatLieuVang);
    daiCot.rotation.x = Math.PI / 2; daiCot.position.set(x, 1.4, 0); nhomChuong.add(daiCot);
    const quaCau = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 16), vatLieuVang);
    quaCau.position.set(x, 7.1, 0); nhomChuong.add(quaCau);
  });
  const xaNgang = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 5.6, 18), vatLieuVang);
  xaNgang.rotation.z = Math.PI / 2; xaNgang.position.y = 6.75; xaNgang.castShadow = true; nhomChuong.add(xaNgang);
})();
const truChuong = new THREE.Group();   // điểm treo để chuông lắc lư
truChuong.position.set(0, 6.6, 0);
nhomChuong.add(truChuong);
const xoayChuong = new THREE.Group();  // nhóm xoay nhẹ quanh trục đứng
truChuong.add(xoayChuong);
(function () {
  const day = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.62, 10), vatLieuVangDam);
  day.position.y = -0.31; xoayChuong.add(day);
  const diem = [[1.45, 0], [1.52, 0.06], [1.44, 0.15], [1.22, 0.32], [1.04, 0.62], [0.93, 1.0], [0.87, 1.4], [0.79, 1.75], [0.61, 1.98], [0.36, 2.09], [0.001, 2.13]];
  const hinhChuong = new THREE.LatheGeometry(diem.map(function (d) { return new THREE.Vector2(d[0], d[1]); }), 56);
  const chuong = new THREE.Mesh(hinhChuong, vatLieuVang);
  chuong.position.y = -0.6 - 2.13; chuong.castShadow = true; xoayChuong.add(chuong);
  [[0.34, 1.24], [1.62, 0.84]].forEach(function (d) {
    const dai = new THREE.Mesh(new THREE.TorusGeometry(d[1], 0.05, 8, 56), vatLieuVangDam);
    dai.rotation.x = Math.PI / 2; dai.position.y = chuong.position.y + d[0]; xoayChuong.add(dai);
  });
  const quai = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.07, 10, 24), vatLieuVangDam);
  quai.position.y = -0.5; xoayChuong.add(quai);
  const quaLac = new THREE.Mesh(new THREE.SphereGeometry(0.24, 18, 14), vatLieuVangDam);
  quaLac.position.y = chuong.position.y + 0.12; xoayChuong.add(quaLac);
  const ngoiSao = new THREE.Mesh(new THREE.OctahedronGeometry(0.3, 0), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  ngoiSao.position.set(0, chuong.position.y + 1.1, 1.0); ngoiSao.scale.set(1, 1.4, 0.3); xoayChuong.add(ngoiSao);
})();
const vatLieuHaoQuang = new THREE.SpriteMaterial({
  map: taoKetCau(256, 256, function (ctx, w, h) {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,240,170,1)'); g.addColorStop(0.3, 'rgba(255,200,60,0.55)'); g.addColorStop(1, 'rgba(255,170,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }),
  blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.85
});
const haoQuang = new THREE.Sprite(vatLieuHaoQuang);
haoQuang.position.set(0, 5.0, -0.6); haoQuang.scale.set(7, 7, 1);
nhomChuong.add(haoQuang);

/* ---------------------------------------------------------------------
   8. NHÂN VẬT CHIBI 3D
   --------------------------------------------------------------------- */
const HINH = {
  chan: new THREE.CylinderGeometry(0.11, 0.12, 0.34, 10),
  than: new THREE.CylinderGeometry(0.3, 0.4, 0.62, 16),
  thanTren: new THREE.CylinderGeometry(0.26, 0.3, 0.42, 16),
  vay: new THREE.ConeGeometry(0.56, 0.7, 18),
  dau: new THREE.SphereGeometry(0.45, 22, 18),
  toc: new THREE.SphereGeometry(0.48, 22, 16, 0, Math.PI * 2, 0, Math.PI * 0.56),
  tocSau: new THREE.SphereGeometry(0.42, 16, 12),
  mat: new THREE.SphereGeometry(0.065, 10, 8),
  dom: new THREE.SphereGeometry(0.075, 10, 8),
  mieng: new THREE.TorusGeometry(0.075, 0.02, 6, 14, Math.PI),
  tay: new THREE.CylinderGeometry(0.075, 0.08, 0.46, 8),
  bang: new THREE.BoxGeometry(0.8, 0.58, 0.04),
  chuBang: new THREE.PlaneGeometry(0.7, 0.5),
  buiToc: new THREE.SphereGeometry(0.16, 12, 10),
  noCanh: new THREE.ConeGeometry(0.17, 0.32, 12),
  noGiua: new THREE.SphereGeometry(0.09, 10, 8),
  mu: new THREE.SphereGeometry(0.5, 22, 12, 0, Math.PI * 2, 0, Math.PI * 0.5),
  vanhMu: new THREE.CylinderGeometry(0.38, 0.38, 0.05, 22, 1, false, -Math.PI / 2, Math.PI)
};
const BO_NHO_VAT_LIEU = {};
function vatLieu(mau) {
  if (!BO_NHO_VAT_LIEU[mau]) BO_NHO_VAT_LIEU[mau] = new THREE.MeshStandardMaterial({ color: mau, roughness: 0.55, metalness: 0.05 });
  return BO_NHO_VAT_LIEU[mau];
}
const MAU_DA = 0xffd9b8, MAU_MAT = 0x2b1d1d, MAU_MA = 0xff9fb3;
const VAT_LIEU_BANG = {};
['', 'A', 'B', 'C', 'D', '?'].forEach(function (chu) {
  VAT_LIEU_BANG[chu] = new THREE.MeshBasicMaterial({
    map: taoKetCau(256, 184, function (ctx, w, h) {
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
      if (chu === '') {
        ctx.strokeStyle = '#d5dcea'; ctx.lineWidth = 6;
        for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(40, 55 + k * 38); ctx.lineTo(w - 40, 55 + k * 38); ctx.stroke(); }
      } else {
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.font = '800 160px ' + PHONG_CHU;
        ctx.fillStyle = MAU_CHU_CAI[chu]; ctx.fillText(chu, w / 2, h / 2 + 12);
      }
    })
  });
});


/* ---------------------------------------------------------------------
   8b. KHUÔN MẶT THẬT CỦA LUCIE VÀ LUCAS (lấy từ game "Lucie và Lucas phiêu lưu")
   --------------------------------------------------------------------- */
function vatLieuCat(goc) {
  const m = goc.clone();
  m.onBeforeCompile = function (sh) {
    sh.vertexShader = 'attribute float aKeep;\nvarying float vKeep;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\nvKeep = aKeep;');
    sh.fragmentShader = 'varying float vKeep;\n' + sh.fragmentShader.replace('void main() {', 'void main() {\nif (vKeep < 0.0) discard;');
  };
  m.customProgramCacheKey = function () { return 'catCau'; };
  return m;
}
function cauCat(banKinh, giuLai, vatLieuGoc, sx, sy, sz, dichY) {
  const hinh = new THREE.SphereGeometry(banKinh, 72, 54);
  hinh.scale(sx || 1, sy || 1, sz || 1);
  const p = hinh.attributes.position, giu = new Float32Array(p.count);
  for (let i = 0; i < p.count; i++) giu[i] = giuLai(p.getX(i) / banKinh, p.getY(i) / banKinh, p.getZ(i) / banKinh);
  hinh.setAttribute('aKeep', new THREE.BufferAttribute(giu, 1));
  if (dichY) hinh.translate(0, dichY, 0);
  return new THREE.Mesh(hinh, vatLieuCat(vatLieuGoc));
}
function chuyenMuot(a, b, x) { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); }
function luoiMat3D(F, r) {
  const hinh = new THREE.BufferGeometry(), W = r * 1.55, n0 = F.v.length / 3, R = F.ring, n = n0 + R.length;
  const pos = new Float32Array(n * 3), uv = new Float32Array(n * 2);
  for (let i = 0; i < n0; i++) {
    pos[i * 3] = F.v[i * 3] * W; pos[i * 3 + 1] = F.v[i * 3 + 1] * W - r * 0.12; pos[i * 3 + 2] = F.v[i * 3 + 2] * W * 0.85 + r * 1.0;
    uv[i * 2] = F.uv[i * 2]; uv[i * 2 + 1] = F.uv[i * 2 + 1];
  }
  const chiSo = F.i.slice();
  R.forEach(function (k, j) {
    const q = n0 + j;
    pos[q * 3] = pos[k * 3] * 1.07; pos[q * 3 + 1] = pos[k * 3 + 1] * 1.04 - r * 0.004; pos[q * 3 + 2] = pos[k * 3 + 2] - r * 0.4;
    uv[q * 2] = F.uv[k * 2]; uv[q * 2 + 1] = F.uv[k * 2 + 1];
    const k2 = R[(j + 1) % R.length], q2 = n0 + (j + 1) % R.length;
    chiSo.push(k, k2, q, k2, q2, q);
  });
  hinh.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  hinh.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  hinh.setIndex(chiSo); hinh.computeVertexNormals();
  const phapTuyen = hinh.attributes.normal; let tong = 0;
  for (let i = 0; i < n; i++) tong += phapTuyen.getZ(i);
  if (tong < 0) {
    const mang = hinh.index.array;
    for (let i = 0; i < mang.length; i += 3) { const t = mang[i + 1]; mang[i + 1] = mang[i + 2]; mang[i + 2] = t; }
    hinh.computeVertexNormals();
  }
  const ketCau = new THREE.TextureLoader().load(F.tex);
  ketCau.encoding = THREE.sRGBEncoding;
  const mesh = new THREE.Mesh(hinh, new THREE.MeshLambertMaterial({ map: ketCau, color: 0xffffff }));
  return { mesh: mesh, vien: R.map(function (k) { return [pos[k * 3], pos[k * 3 + 1]]; }) };
}
function khoetSo(r, vien, vatLieuDa) {
  const pr = vien.map(function (d) { return [d[0] / r * 0.92, d[1] / r * 0.92]; });
  function khoangCach(x, y) {
    let trong = false, d = 1e9;
    for (let i = 0, j = pr.length - 1; i < pr.length; j = i++) {
      const xi = pr[i][0], yi = pr[i][1], xj = pr[j][0], yj = pr[j][1];
      if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) trong = !trong;
      const ex = xj - xi, ey = yj - yi, t = Math.max(0, Math.min(1, ((x - xi) * ex + (y - yi) * ey) / (ex * ex + ey * ey)));
      d = Math.min(d, Math.hypot(x - xi - ex * t, y - yi - ey * t));
    }
    return trong ? -d : d;
  }
  return cauCat(r, function (x, y, z) { return z <= 0 ? 1 : Math.max(khoangCach(x, y), -z); }, vatLieuDa, 0.96, 1.0, 0.98);
}
/* Dựng cái đầu có khuôn mặt thật: kieuToc = 'girl' (tóc dài, buộc 2 bên, băng đô hồng) hoặc 'boy' */
function taoDauThat(ten, r, kieuToc, vatLieuDa) {
  const nhom = new THREE.Group();
  const F = MAT_3D[ten];
  vatLieuDa.color.set(F.skin).convertSRGBToLinear().multiplyScalar(0.95);
  const mat = luoiMat3D(F, r);
  nhom.add(mat.mesh);
  const daSo = new THREE.MeshLambertMaterial({ color: vatLieuDa.color.clone(), side: THREE.DoubleSide });
  nhom.add(khoetSo(r, mat.vien, daSo));
  [-1, 1].forEach(function (s) {
    const tai = new THREE.Mesh(new THREE.SphereGeometry(r * 0.2, 10, 8), vatLieuDa);
    tai.scale.set(0.5, 1, 0.8); tai.position.set(s * r * 0.98, -r * 0.05, -r * 0.05); nhom.add(tai);
  });
  const toc = new THREE.MeshLambertMaterial({ color: 0x1b1310 });
  function vo(rr, giuLai, sy, oy) { const m = cauCat(rr, giuLai, toc, 1, sy || 1, 1, oy || 0); nhom.add(m); return m; }
  if (kieuToc === 'woman') toc.color.setHex(0x2a1a12);
  const duongToc = kieuToc === 'boy' ? 0.6 : (kieuToc === 'man' ? 0.66 : 0.62);
  vo(r * 1.06, function (x, y, z) { return Math.max(y - (duongToc - Math.abs(x) * 0.3), 0.15 + 0.27 * chuyenMuot(-0.35, -0.05, y) - z); });
  if (kieuToc === 'woman') {
    vo(r * 1.07, function (x, y, z) { return Math.min(-0.05 - z, 0.6 - y); }, 1.5, -r * 0.42);
    const buiToc = new THREE.Mesh(new THREE.SphereGeometry(r * 0.38, 14, 10), toc);
    buiToc.position.set(0, r * 0.8, -r * 0.7); nhom.add(buiToc);
  }
  if (kieuToc === 'girl') {
    vo(r * 1.07, function (x, y, z) { return Math.min(-0.05 - z, 0.6 - y); }, 1.35, -r * 0.42);
    [-1, 1].forEach(function (s) {
      const buoi = new THREE.Mesh(new THREE.SphereGeometry(r * 0.3, 12, 10), toc);
      buoi.scale.set(0.8, 1.4, 0.8); buoi.position.set(s * r * 1.02, -r * 0.3, -r * 0.35); nhom.add(buoi);
    });
    const bangDo = new THREE.Mesh(new THREE.TorusGeometry(r * 1.08, r * 0.07, 6, 30, Math.PI - 1.1), new THREE.MeshLambertMaterial({ color: 0xf06595 }));
    bangDo.rotation.y = Math.PI / 2; nhom.add(bangDo);
  }
  nhom.traverse(function (m) { if (m.isMesh) m.castShadow = true; });
  return nhom;
}

function taoMesh(hinh, mau, x, y, z, boBong) {
  const m = new THREE.Mesh(hinh, typeof mau === 'number' ? vatLieu(mau) : mau);
  m.position.set(x, y, z);
  if (boBong !== false) m.castShadow = true;
  return m;
}

/* Tạo một nhân vật chibi (dựng hướng mặt về +z, sau đó xoay về phía chuông vàng) */
function taoNhanVat(tuyChon) {
  const nhom = new THREE.Group();
  const coVay = tuyChon.kieu === 'lucie' || tuyChon.vay;
  nhom.add(taoMesh(HINH.chan, tuyChon.mauQuan, -0.13, 0.17, 0));
  nhom.add(taoMesh(HINH.chan, tuyChon.mauQuan, 0.13, 0.17, 0));
  if (coVay) {
    nhom.add(taoMesh(HINH.vay, tuyChon.mauVay || tuyChon.mauAo, 0, 0.62, 0));
    nhom.add(taoMesh(HINH.thanTren, tuyChon.mauAo, 0, 0.98, 0));
  } else {
    nhom.add(taoMesh(HINH.than, tuyChon.mauAo, 0, 0.66, 0));
  }
  const KIEU_TOC = { lucie: 'girl', lucas: 'boy', bo: 'man', me: 'woman' };
  const laNhanVatThat = !!KIEU_TOC[tuyChon.kieu];
  const vatLieuDa = laNhanVatThat ? new THREE.MeshLambertMaterial({ color: MAU_DA }) : MAU_DA;
  if (laNhanVatThat) {
    // Đầu có khuôn mặt thật của bé
    const dauThat = taoDauThat(tuyChon.kieu, 0.45, KIEU_TOC[tuyChon.kieu], vatLieuDa);
    dauThat.position.y = 1.42;
    nhom.add(dauThat);
  } else {
    nhom.add(taoMesh(HINH.dau, MAU_DA, 0, 1.4, 0));
    const toc = taoMesh(HINH.toc, tuyChon.mauToc, 0, 1.42, 0);
    toc.rotation.x = -0.28; nhom.add(toc);
    nhom.add(taoMesh(HINH.mat, MAU_MAT, -0.15, 1.42, 0.41, false));
    nhom.add(taoMesh(HINH.mat, MAU_MAT, 0.15, 1.42, 0.41, false));
    const ma1 = taoMesh(HINH.dom, MAU_MA, -0.26, 1.3, 0.36, false); ma1.scale.set(1, 0.6, 0.4); nhom.add(ma1);
    const ma2 = taoMesh(HINH.dom, MAU_MA, 0.26, 1.3, 0.36, false); ma2.scale.set(1, 0.6, 0.4); nhom.add(ma2);
    const mieng = taoMesh(HINH.mieng, 0xc2410c, 0, 1.27, 0.43, false); mieng.rotation.z = Math.PI; nhom.add(mieng);
  }
  const tayTrai = taoMesh(HINH.tay, vatLieuDa, -0.3, 0.86, 0.2); tayTrai.rotation.x = -1.2; nhom.add(tayTrai);
  const tayPhai = taoMesh(HINH.tay, vatLieuDa, 0.3, 0.86, 0.2); tayPhai.rotation.x = -1.2; nhom.add(tayPhai);
  const nhomBang = new THREE.Group();
  nhomBang.position.set(0, 0.86, 0.44); nhomBang.rotation.x = -0.18;
  const bang = taoMesh(HINH.bang, 0xffffff, 0, 0, 0); nhomBang.add(bang);
  const chuBang = new THREE.Mesh(HINH.chuBang, VAT_LIEU_BANG['']);
  chuBang.position.z = 0.022; nhomBang.add(chuBang);
  nhom.add(nhomBang);

  if (tuyChon.kieu === 'lucie') {
    const noTrai = taoMesh(HINH.noCanh, 0xff4f9a, 0.14, 1.95, -0.05); noTrai.rotation.z = Math.PI / 2; nhom.add(noTrai);
    const noPhai = taoMesh(HINH.noCanh, 0xff4f9a, 0.48, 1.95, -0.05); noPhai.rotation.z = -Math.PI / 2; nhom.add(noPhai);
    nhom.add(taoMesh(HINH.noGiua, 0xff86bd, 0.31, 1.95, -0.05));
    nhom.add(taoMesh(HINH.noGiua, 0xffffff, 0, 0.66, 0.5, false));
  } else if (tuyChon.kieu === 'lucas') {
    const mu = taoMesh(HINH.mu, 0x1e63d6, 0, 1.6, -0.03); mu.scale.set(1.0, 0.85, 1.0); nhom.add(mu);
    nhom.add(taoMesh(HINH.vanhMu, 0x1e63d6, 0, 1.67, 0.24));
    nhom.add(taoMesh(HINH.noGiua, 0xffd43b, 0, 2.05, -0.03));
  } else if (tuyChon.buiToc) {
    nhom.add(taoMesh(HINH.buiToc, tuyChon.mauToc, -0.46, 1.5, -0.05));
    nhom.add(taoMesh(HINH.buiToc, tuyChon.mauToc, 0.46, 1.5, -0.05));
  }
  nhom.rotation.y = Math.PI;   // quay mặt về phía chuông vàng
  return { nhom: nhom, chuBang: chuBang };
}

const MAU_AO_AI = [0xff8a5b, 0x7bdff2, 0xb2f7ef, 0xf7d6e0, 0xffd166, 0x06d6a0, 0x9b5de5, 0xf15bb5, 0x00bbf9, 0x80ed99, 0xff9f1c, 0xa0c4ff, 0xffadad, 0xcaffbf];
const MAU_QUAN_AI = [0x334155, 0x1e3a8a, 0x4c1d95, 0x065f46, 0x7c2d12, 0x374151];
const MAU_TOC_AI = [0x3b2314, 0x1c1c1c, 0x6b3e1e, 0x8a5a2b, 0x2d1b0e];

const THI_SINH = new Array(100);   // THI_SINH[chiSoO] = đối tượng thí sinh đang đứng ở ô đó
const TAT_CA = [];
const DAC_BIET = {};
function taoThiSinh(loai, chiSoO) {
  let tuyChon;
  if (loai === 'lucie') tuyChon = { kieu: 'lucie', mauAo: 0xffb3d1, mauVay: 0xffa6cb, mauQuan: 0xffe1ee, mauToc: 0x5a3216 };
  else if (loai === 'lucas') tuyChon = { kieu: 'lucas', mauAo: 0x4aa3ff, mauQuan: 0x1f3a8a, mauToc: 0x2d1b0e };
  else {
    const laBanGai = Math.random() < 0.5;
    tuyChon = {
      kieu: 'ai',
      mauAo: MAU_AO_AI[soNguyen(0, MAU_AO_AI.length - 1)],
      mauQuan: MAU_QUAN_AI[soNguyen(0, MAU_QUAN_AI.length - 1)],
      mauToc: MAU_TOC_AI[soNguyen(0, MAU_TOC_AI.length - 1)],
      vay: laBanGai && Math.random() < 0.5,
      buiToc: laBanGai
    };
  }
  const nv = taoNhanVat(tuyChon);
  const tyLe = loai === 'ai' ? ngauNhien(0.92, 1.03) : 1.12;
  nv.nhom.scale.setScalar(tyLe);
  canh.add(nv.nhom);
  const thiSinh = {
    loai: loai, nhom: nv.nhom, chuBang: nv.chuBang, tyLe: tyLe,
    chiSoO: chiSoO, oGoc: chiSoO, conSong: true, dangBay: false, y0: 0.57,
    pha: Math.random() * Math.PI * 2, vuiTu: 0, vuiDen: 0, nhanTen: null, cauBiLoai: 0
  };
  TAT_CA.push(thiSinh);
  datVaoO(thiSinh, chiSoO);
  return thiSinh;
}
function datVaoO(thiSinh, chiSoO) {
  thiSinh.chiSoO = chiSoO;
  THI_SINH[chiSoO] = thiSinh;
  const vt = viTriO(chiSoO);
  thiSinh.y0 = 0.57;
  thiSinh.nhom.position.set(vt.x, thiSinh.y0, vt.z);
}
for (let i = 0; i < 100; i++) {
  if (i === CAU_HINH.oChinh) continue;   // ô 45 dành cho nhân vật chính
  if (window.CHE_DO_TV && i % 3 !== 0) continue;   // TV yếu: chỉ 1/3 số thí sinh để đỡ giật
  taoThiSinh('ai', i);
}
DAC_BIET.lucie = taoThiSinh('lucie', CAU_HINH.oChinh);
DAC_BIET.lucas = taoThiSinh('lucas', CAU_HINH.oChinh);
const VI_TRI_TRUNG_BAY = { lucie: new V3(1.25, 0, -15.3), lucas: new V3(-1.25, 0, -15.3) };
function datLenBucTrungBay() {
  ['lucie', 'lucas'].forEach(function (ten) {
    const ts = DAC_BIET[ten];
    if (THI_SINH[ts.chiSoO] === ts) THI_SINH[ts.chiSoO] = null;
    ts.chiSoO = -1;
    ts.y0 = 1.2;
    ts.nhom.position.set(VI_TRI_TRUNG_BAY[ten].x, 1.2, VI_TRI_TRUNG_BAY[ten].z);
  });
}
datLenBucTrungBay();
function datChuBang(thiSinh, chu) { thiSinh.chuBang.material = VAT_LIEU_BANG[chu]; }

/* Nhãn tên nổi trên đầu */
function taoNhanTen(chu, mauNen, mauVien) {
  const ketCau = taoKetCau(640, 150, function (ctx, w, h) {
    veHinhBoGoc(ctx, 8, 8, w - 16, h - 16, 60);
    ctx.fillStyle = mauNen; ctx.fill();
    ctx.lineWidth = 10; ctx.strokeStyle = mauVien; ctx.stroke();
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    let coChu = 70;
    ctx.font = '800 ' + coChu + 'px ' + PHONG_CHU;
    while (ctx.measureText(chu).width > w - 70 && coChu > 30) { coChu -= 2; ctx.font = '800 ' + coChu + 'px ' + PHONG_CHU; }
    ctx.fillStyle = '#ffffff';
    ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.strokeText(chu, w / 2, h / 2 + 6);
    ctx.fillText(chu, w / 2, h / 2 + 6);
  });
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: ketCau, depthTest: false, transparent: true }));
  sprite.scale.set(2.3, 0.54, 1);
  sprite.renderOrder = 10;
  return sprite;
}
function ganNhanTen(thiSinh, chu, mauNen, mauVien, doCao) {
  if (thiSinh.nhanTen) { thiSinh.nhom.remove(thiSinh.nhanTen); thiSinh.nhanTen.material.map.dispose(); thiSinh.nhanTen.material.dispose(); }
  const nhan = taoNhanTen(chu, mauNen, mauVien);
  nhan.position.set(0, doCao || 2.45, 0);
  thiSinh.nhom.add(nhan);
  thiSinh.nhanTen = nhan;
}
function goNhanTen(thiSinh) {
  if (thiSinh.nhanTen) { thiSinh.nhom.remove(thiSinh.nhanTen); thiSinh.nhanTen = null; }
}

/* Vòng sáng vàng kim, mũi tên chỉ dẫn, cột sáng cho nhân vật chính; vòng sáng bạc cho người đồng hành */
function taoVongSang(mau, banKinh) {
  const nhom = new THREE.Group();
  const vong = new THREE.Mesh(new THREE.TorusGeometry(banKinh, 0.07, 10, 48), new THREE.MeshStandardMaterial({ color: mau, emissive: mau, emissiveIntensity: 1.2, metalness: 0.6, roughness: 0.3 }));
  vong.rotation.x = -Math.PI / 2; nhom.add(vong);
  const quang = new THREE.Mesh(new THREE.RingGeometry(banKinh - 0.25, banKinh + 0.35, 48), new THREE.MeshBasicMaterial({ color: mau, transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  quang.rotation.x = -Math.PI / 2; quang.position.y = 0.01; nhom.add(quang);
  for (let i = 0; i < 6; i++) {
    const hat = new THREE.Mesh(new THREE.OctahedronGeometry(0.08, 0), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const goc = i / 6 * Math.PI * 2;
    hat.position.set(Math.cos(goc) * banKinh, 0.12, Math.sin(goc) * banKinh);
    nhom.add(hat);
  }
  nhom.visible = false;
  canh.add(nhom);
  return nhom;
}
const vongVang = taoVongSang(0xffcc33, 0.92);
const vongBac = taoVongSang(0x9fdcff, 0.86);
const muiTen = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.6, 4), new THREE.MeshStandardMaterial({ color: 0xffd43b, emissive: 0xffaa00, emissiveIntensity: 0.9, metalness: 0.5, roughness: 0.3 }));
muiTen.rotation.x = Math.PI; muiTen.visible = false; canh.add(muiTen);
const hinhCotSang = new THREE.ConeGeometry(1.25, 14, 28, 1, true); hinhCotSang.translate(0, -7, 0);
const cotSang = new THREE.Mesh(hinhCotSang, new THREE.MeshBasicMaterial({ color: 0xffd36b, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
cotSang.visible = false; canh.add(cotSang);

/* ---------------------------------------------------------------------
   9. PHÁO GIẤY 3D & 2D
   --------------------------------------------------------------------- */
const SO_PHAO_3D = 500;
const phaoGiay3D = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.18, 0.28), new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), SO_PHAO_3D);
phaoGiay3D.frustumCulled = false; phaoGiay3D.visible = false;
const PG3 = { bat: false, vt: [], vd: [], xoay: [], toc: [], hinhMau: new THREE.Object3D() };
(function () {
  const bangMau = [0xff4f9a, 0xffd43b, 0x4dabf7, 0x51cf66, 0xff922b, 0xcc5de8, 0xffffff];
  const mauTam = new THREE.Color();
  for (let i = 0; i < SO_PHAO_3D; i++) {
    PG3.vt.push(new V3(0, -10, 0)); PG3.vd.push(new V3()); PG3.xoay.push(new V3(Math.random() * 6, Math.random() * 6, Math.random() * 6));
    PG3.toc.push(new V3(ngauNhien(-6, 6), ngauNhien(-6, 6), ngauNhien(-6, 6)));
    mauTam.setHex(bangMau[i % bangMau.length]);
    phaoGiay3D.setColorAt(i, mauTam);
    PG3.hinhMau.position.set(0, -10, 0); PG3.hinhMau.updateMatrix(); phaoGiay3D.setMatrixAt(i, PG3.hinhMau.matrix);
  }
  if (phaoGiay3D.instanceColor) phaoGiay3D.instanceColor.needsUpdate = true;
})();
canh.add(phaoGiay3D);
function banPhaoGiay3D() {
  PG3.bat = true; phaoGiay3D.visible = true;
  for (let i = 0; i < SO_PHAO_3D; i++) {
    PG3.vt[i].set(ngauNhien(-1.5, 1.5), ngauNhien(5, 7), -14 + ngauNhien(-1.5, 1.5));
    PG3.vd[i].set(ngauNhien(-7, 7), ngauNhien(4, 12), ngauNhien(-7, 7));
  }
}
function capNhatPhaoGiay3D(dt) {
  if (!phaoGiay3D.visible) return;
  for (let i = 0; i < SO_PHAO_3D; i++) {
    const vt = PG3.vt[i], vd = PG3.vd[i];
    vd.y -= 7 * dt;
    vd.x *= (1 - 0.8 * dt); vd.z *= (1 - 0.8 * dt);
    if (vd.y < -2.2) vd.y = -2.2;
    vt.addScaledVector(vd, dt);
    if (vt.y < 0.15) {
      if (PG3.bat) { vt.set(ngauNhien(-9, 9), ngauNhien(12, 16), -14 + ngauNhien(-7, 6)); vd.set(ngauNhien(-1, 1), 0, ngauNhien(-1, 1)); }
      else { vt.y = -10; vd.set(0, 0, 0); }
    }
    PG3.xoay[i].addScaledVector(PG3.toc[i], dt);
    PG3.hinhMau.position.copy(vt);
    PG3.hinhMau.rotation.set(PG3.xoay[i].x, PG3.xoay[i].y, PG3.xoay[i].z);
    PG3.hinhMau.updateMatrix();
    phaoGiay3D.setMatrixAt(i, PG3.hinhMau.matrix);
  }
  phaoGiay3D.instanceMatrix.needsUpdate = true;
}

const canvasPhao = $('phaoGiay');
const ctxPhao = canvasPhao.getContext('2d');
const DANH_SACH_PHAO_2D = [];
function chinhCoCanvasPhao() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvasPhao.width = window.innerWidth * dpr; canvasPhao.height = window.innerHeight * dpr;
  ctxPhao.setTransform(dpr, 0, 0, dpr, 0, 0);
}
chinhCoCanvasPhao();
function banPhaoGiay2D(soLuong) {
  const mau = ['#ff4f9a', '#ffd43b', '#4dabf7', '#51cf66', '#ff922b', '#cc5de8', '#ffffff', '#ff6b6b'];
  const w = window.innerWidth, h = window.innerHeight;
  for (let i = 0; i < soLuong; i++) {
    const kieu = i % 3;
    let x, y, vx, vy;
    if (kieu === 0) { x = 0; y = h; vx = ngauNhien(250, 900); vy = ngauNhien(-1300, -700); }
    else if (kieu === 1) { x = w; y = h; vx = ngauNhien(-900, -250); vy = ngauNhien(-1300, -700); }
    else { x = ngauNhien(0, w); y = ngauNhien(-200, -20); vx = ngauNhien(-60, 60); vy = ngauNhien(50, 200); }
    DANH_SACH_PHAO_2D.push({
      x: x, y: y, vx: vx, vy: vy, rong: ngauNhien(8, 14), cao: ngauNhien(12, 20),
      goc: Math.random() * 6, tocGoc: ngauNhien(-8, 8), lat: Math.random() * 6, tocLat: ngauNhien(4, 10),
      mau: mau[soNguyen(0, mau.length - 1)]
    });
  }
}
function capNhatPhaoGiay2D(dt) {
  ctxPhao.clearRect(0, 0, window.innerWidth, window.innerHeight);
  for (let i = DANH_SACH_PHAO_2D.length - 1; i >= 0; i--) {
    const p = DANH_SACH_PHAO_2D[i];
    p.vy += 900 * dt; p.vx *= (1 - 1.2 * dt);
    if (p.vy > 260) p.vy = 260;
    p.x += p.vx * dt + Math.sin(p.lat) * 0.6; p.y += p.vy * dt;
    p.goc += p.tocGoc * dt; p.lat += p.tocLat * dt;
    if (p.y > window.innerHeight + 40) { DANH_SACH_PHAO_2D.splice(i, 1); continue; }
    ctxPhao.save(); ctxPhao.translate(p.x, p.y); ctxPhao.rotate(p.goc);
    ctxPhao.scale(Math.cos(p.lat), 1);
    ctxPhao.fillStyle = p.mau; ctxPhao.fillRect(-p.rong / 2, -p.cao / 2, p.rong, p.cao);
    ctxPhao.restore();
  }
}

/* ---------------------------------------------------------------------
   10. CAMERA
   --------------------------------------------------------------------- */
function heSoKhung() {
  const tyLe = window.innerWidth / window.innerHeight;
  return tyLe < 1.25 ? 1.25 / tyLe : 1;
}
function rongManHinh() { return window.innerWidth >= 1024; }
function gocChon() { const k = heSoKhung(); const nhin = new V3(0, 3.0, -15.2); return [nhin.clone().add(new V3(0, 0.7, -6.6).multiplyScalar(k)), nhin]; }
function gocCauHoi() { const k = heSoKhung(); const nhin = new V3(0, -1.6, 0.5); return [nhin.clone().add(new V3(6.5, 10, -13.5).multiplyScalar(k)), nhin]; }
function gocToanCanh() {
  const k = heSoKhung(); const lech = rongManHinh() ? -6.5 : 0;
  const nhin = new V3(lech, 0, rongManHinh() ? -0.5 : 1.5);
  return [nhin.clone().add(new V3(0, 31, -10.5).multiplyScalar(k)), nhin];
}
function gocChuongXa() { return [new V3(9, 8, -24), new V3(0, 3, -11)]; }
function gocChuongGan() {
  const lech = rongManHinh() ? -2.2 : 0; const k = heSoKhung();
  const nhin = new V3(lech + 0.3, rongManHinh() ? 3.4 : 2.6, -14);
  return [nhin.clone().add(new V3(0, 1.0, -9.5).multiplyScalar(k)), nhin];
}
function bayCamera(goc, giay) {
  return new Promise(function (xong) {
    const viTriDau = camViTri.clone(), nhinDau = camNhin.clone();
    taoTween(giay, function (p) {
      const e = eMuot(p);
      camViTri.lerpVectors(viTriDau, goc[0], e);
      camNhin.lerpVectors(nhinDau, goc[1], e);
    }, xong, 'camera');
  });
}
function capNhatCamera(t) {
  let lacX = 0, lacY = 0;
  if (TRO_CHOI.giaiDoan === 'chon' || TRO_CHOI.giaiDoan === 'traLoi' || TRO_CHOI.giaiDoan === 'chienThang') {
    lacX = Math.sin(t * 0.35) * 0.45; lacY = Math.sin(t * 0.5) * 0.18;
  }
  if (doRungCamera > 0) {
    lacX += (Math.random() - 0.5) * doRungCamera * 2;
    lacY += (Math.random() - 0.5) * doRungCamera * 2;
  }
  camera.position.set(camViTri.x + lacX, camViTri.y + lacY, camViTri.z);
  camera.lookAt(camNhin);
}

/* ---------------------------------------------------------------------
   11. CHUYỂN ĐỘNG NHÂN VẬT
   --------------------------------------------------------------------- */
let dongHo = 0;
function vuiMung(thiSinh, giay) { thiSinh.vuiTu = dongHo; thiSinh.vuiDen = dongHo + giay; }
function nhayToi(thiSinh, dich, yDich, doCao, giay) {
  return new Promise(function (xong) {
    thiSinh.dangBay = true;
    const dau = thiSinh.nhom.position.clone();
    const yDau = thiSinh.y0;
    taoTween(giay, function (p) {
      const e = eMuot(p);
      thiSinh.nhom.position.x = dau.x + (dich.x - dau.x) * e;
      thiSinh.nhom.position.z = dau.z + (dich.z - dau.z) * e;
      thiSinh.nhom.position.y = yDau + (yDich - yDau) * e + Math.sin(Math.PI * p) * doCao;
      thiSinh.nhom.rotation.y = Math.PI + Math.sin(Math.PI * p) * Math.PI * 2 * (p < 1 ? 1 : 0);
    }, function () {
      thiSinh.nhom.position.set(dich.x, yDich, dich.z);
      thiSinh.nhom.rotation.y = Math.PI;
      thiSinh.y0 = yDich; thiSinh.dangBay = false; xong();
    });
  });
}
function loaiNhanVat(thiSinh, tre, chiSoCau) {
  thiSinh.conSong = false;
  thiSinh.cauBiLoai = chiSoCau + 1;
  setTimeout(function () {
    thiSinh.dangBay = true;
    phatHat(thiSinh.nhom.position.clone().add(new V3(0, 1.0, 0)), 12, [0xff6b6b, 0xffffff, 0xffa8a8], { tocDo: [1, 2.6], trongLuc: 1.5, tuoi: [0.5, 1.0], kichThuoc: 1.0 });
    const yDau = thiSinh.nhom.position.y;
    taoTween(1.0, function (p) {
      thiSinh.nhom.position.y = yDau + Math.sin(p * Math.PI) * 0.35 - 2.4 * p * p;
      thiSinh.nhom.scale.setScalar(thiSinh.tyLe * (1 - 0.85 * p));
      thiSinh.nhom.rotation.y = Math.PI + p * 4;
    }, function () { thiSinh.nhom.visible = false; });
  }, tre * 1000);
}
function capNhatNhanVat() {
  for (let i = 0; i < TAT_CA.length; i++) {
    const ts = TAT_CA[i];
    if (!ts.nhom.visible || ts.dangBay) continue;
    if (ts.vuiDen > dongHo) {
      const t = dongHo - ts.vuiTu;
      ts.nhom.position.y = ts.y0 + Math.abs(Math.sin(t * 8 + ts.pha * 0.2)) * 0.6;
      ts.nhom.rotation.y = Math.PI + Math.sin(t * 6) * 0.35;
      ts.nhom.rotation.z = 0;
    } else {
      ts.nhom.position.y = ts.y0 + Math.max(0, Math.sin(dongHo * 2.2 + ts.pha)) * 0.04;
      ts.nhom.rotation.y = Math.PI + Math.sin(dongHo * 0.8 + ts.pha) * 0.08;
      ts.nhom.rotation.z = Math.sin(dongHo * 1.6 + ts.pha) * 0.03;
    }
  }
}

/* ---------------------------------------------------------------------
   12. HIỆU ỨNG SÂN KHẤU MỖI KHUNG HÌNH
   --------------------------------------------------------------------- */
let thoiDiemRung = -1;
function capNhatSanKhau(dt) {
  xoayChuong.rotation.y += dt * 0.55;
  if (thoiDiemRung >= 0) {
    const t = dongHo - thoiDiemRung;
    const bienDo = 0.12 + 0.45 * Math.exp(-t * 0.18);
    truChuong.rotation.z = Math.sin(t * 5.2) * bienDo;
    truChuong.rotation.x = Math.sin(t * 3.1) * bienDo * 0.25;
    const nhip = 1 + Math.sin(t * 10) * 0.12;
    haoQuang.scale.set(11 * nhip, 11 * nhip, 1);
    denChuong.intensity = 3.2 + Math.sin(t * 10) * 0.8;
  } else {
    truChuong.rotation.z = Math.sin(dongHo * 1.1) * 0.04;
    truChuong.rotation.x = 0;
    const nhip = 1 + Math.sin(dongHo * 2.4) * 0.07;
    haoQuang.scale.set(7 * nhip, 7 * nhip, 1);
    denChuong.intensity = 1.6 + Math.sin(dongHo * 2.4) * 0.3;
  }
  for (let i = 0; i < CHUM_SANG.length; i++) {
    const c = CHUM_SANG[i];
    c.rotation.x = Math.sin(dongHo * 0.5 + c.userData.pha) * 0.35;
    c.rotation.z = Math.cos(dongHo * 0.4 + c.userData.pha) * 0.35;
  }
  vatLieuDenLED.color.setHSL((dongHo * 0.05) % 1, 0.8, 0.62);

  const chinh = TRO_CHOI.chinh ? DAC_BIET[TRO_CHOI.chinh] : null;
  const dongHanh = TRO_CHOI.dongHanh ? DAC_BIET[TRO_CHOI.dongHanh] : null;
  if (chinh && chinh.nhom.visible && (chinh.conSong || TRO_CHOI.giaiDoan === 'thongKe') && TRO_CHOI.giaiDoan !== 'chon') {
    const vt = chinh.nhom.position;
    vongVang.visible = chinh.conSong; muiTen.visible = chinh.conSong; cotSang.visible = chinh.conSong;
    vongVang.position.set(vt.x, chinh.y0 + 0.03, vt.z); vongVang.rotation.y += dt * 1.5;
    const s = 1 + Math.sin(dongHo * 4) * 0.06; vongVang.scale.set(s, 1, s);
    muiTen.position.set(vt.x, vt.y + 3.95 + Math.sin(dongHo * 4) * 0.15, vt.z); muiTen.rotation.y += dt * 3;
    cotSang.position.set(vt.x, chinh.y0 + 14, vt.z);
  } else { vongVang.visible = false; muiTen.visible = false; cotSang.visible = false; }
  if (dongHanh && dongHanh.nhom.visible && dongHanh.conSong && TRO_CHOI.giaiDoan !== 'chon') {
    vongBac.visible = true;
    vongBac.position.set(dongHanh.nhom.position.x, dongHanh.y0 + 0.03, dongHanh.nhom.position.z);
    vongBac.rotation.y -= dt * 1.2;
  } else vongBac.visible = false;
}

/* ---------------------------------------------------------------------
   12b. HIỆU ỨNG ĐẶC BIỆT: HẠT LẤP LÁNH, PHÁO HOA, SÓNG SÁNG, BIỂU CẢM
   --------------------------------------------------------------------- */
const SO_HAT = 1600;
const hatMesh = new THREE.InstancedMesh(
  new THREE.OctahedronGeometry(0.09, 0),
  new THREE.MeshBasicMaterial({ transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
  SO_HAT
);
hatMesh.frustumCulled = false;
const DANH_SACH_HAT = [];
const hinhMauHat = new THREE.Object3D();
(function () {
  const trang = new THREE.Color(0xffffff);
  hinhMauHat.scale.setScalar(0.0001); hinhMauHat.updateMatrix();
  for (let i = 0; i < SO_HAT; i++) {
    DANH_SACH_HAT.push({ chiSo: i, song: false, vt: new V3(), vd: new V3(), tuoi: 0, tuoiMax: 1, kichThuoc: 1, trongLuc: 0, can: 1, xoay: Math.random() * 6 });
    hatMesh.setColorAt(i, trang);
    hatMesh.setMatrixAt(i, hinhMauHat.matrix);
  }
  if (hatMesh.instanceColor) hatMesh.instanceColor.needsUpdate = true;
})();
canh.add(hatMesh);
let conTroHat = 0;
const mauTamHat = new THREE.Color();
function phatHat(viTri, soLuong, bangMau, tuyChon) {
  const tc = tuyChon || {};
  const tocDo = tc.tocDo || [1, 3];
  const tuoi = tc.tuoi || [0.6, 1.2];
  for (let n = 0; n < soLuong; n++) {
    const h = DANH_SACH_HAT[conTroHat];
    conTroHat = (conTroHat + 1) % SO_HAT;
    h.song = true;
    h.vt.set(viTri.x + ngauNhien(-0.1, 0.1), viTri.y + ngauNhien(-0.1, 0.1), viTri.z + ngauNhien(-0.1, 0.1));
    const theta = Math.random() * Math.PI * 2, phi = Math.acos(ngauNhien(-1, 1));
    const v = ngauNhien(tocDo[0], tocDo[1]);
    h.vd.set(Math.sin(phi) * Math.cos(theta) * v, Math.cos(phi) * v + (tc.huongLen || 0), Math.sin(phi) * Math.sin(theta) * v);
    h.tuoi = 0; h.tuoiMax = ngauNhien(tuoi[0], tuoi[1]);
    h.kichThuoc = (tc.kichThuoc || 1) * ngauNhien(0.7, 1.3);
    h.trongLuc = tc.trongLuc === undefined ? 4 : tc.trongLuc;
    h.can = tc.can === undefined ? 1 : tc.can;
    mauTamHat.setHex(bangMau[soNguyen(0, bangMau.length - 1)]);
    hatMesh.setColorAt(h.chiSo, mauTamHat);
  }
  if (hatMesh.instanceColor) hatMesh.instanceColor.needsUpdate = true;
}
function capNhatHat(dt) {
  let coThayDoi = false;
  for (let i = 0; i < SO_HAT; i++) {
    const h = DANH_SACH_HAT[i];
    if (!h.song) continue;
    coThayDoi = true;
    h.tuoi += dt;
    if (h.tuoi >= h.tuoiMax) {
      h.song = false;
      hinhMauHat.position.set(0, -50, 0); hinhMauHat.scale.setScalar(0.0001); hinhMauHat.updateMatrix();
      hatMesh.setMatrixAt(i, hinhMauHat.matrix);
      continue;
    }
    h.vd.y -= h.trongLuc * dt;
    h.vd.multiplyScalar(Math.max(0, 1 - h.can * dt));
    h.vt.addScaledVector(h.vd, dt);
    h.xoay += dt * 6;
    const conLai = 1 - h.tuoi / h.tuoiMax;
    const nhapNhay = 0.75 + 0.25 * Math.sin(h.tuoi * 30 + i);
    hinhMauHat.position.copy(h.vt);
    hinhMauHat.rotation.set(h.xoay, h.xoay * 0.7, 0);
    hinhMauHat.scale.setScalar(h.kichThuoc * Math.sqrt(conLai) * nhapNhay);
    hinhMauHat.updateMatrix();
    hatMesh.setMatrixAt(i, hinhMauHat.matrix);
  }
  if (coThayDoi) hatMesh.instanceMatrix.needsUpdate = true;
}

/* Pháo hoa bắn lên trời rồi nổ tung */
const hinhTenLua = new THREE.SphereGeometry(0.13, 8, 6);
const MAU_PHAO_HOA = [0xff4f9a, 0xffd43b, 0x4dabf7, 0x51cf66, 0xcc5de8, 0xff922b, 0x66f2ff];
function banPhaoHoa(x, z, mau, doCao) {
  const mauNo = mau || MAU_PHAO_HOA[soNguyen(0, MAU_PHAO_HOA.length - 1)];
  const vatLieuTL = new THREE.MeshBasicMaterial({ color: 0xfff1c1 });
  const tenLua = new THREE.Mesh(hinhTenLua, vatLieuTL);
  tenLua.position.set(x, 0.5, z);
  canh.add(tenLua);
  const cao = doCao || ngauNhien(10, 15);
  AM_THANH.phongLen();
  taoTween(0.85, function (p) {
    tenLua.position.y = 0.5 + (cao - 0.5) * eRa(p);
    if (Math.random() < 0.7) phatHat(tenLua.position, 1, [0xffd27a, 0xffffff], { tocDo: [0.1, 0.5], trongLuc: 1, tuoi: [0.3, 0.6], kichThuoc: 0.7 });
  }, function () {
    canh.remove(tenLua); vatLieuTL.dispose();
    phatHat(tenLua.position, 120, [mauNo, mauNo, mauNo, 0xffffff], { tocDo: [4.5, 8], trongLuc: 2.5, tuoi: [1.2, 2.0], kichThuoc: 1.6, can: 1.3 });
    AM_THANH.tiengNo();
  });
}

/* Sóng sáng lan toả trên mặt sàn */
const hinhSongXung = new THREE.RingGeometry(0.55, 0.8, 48);
function songXung(viTri, mau, kichThuoc) {
  const vl = new THREE.MeshBasicMaterial({ color: mau, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
  const vong = new THREE.Mesh(hinhSongXung, vl);
  vong.rotation.x = -Math.PI / 2;
  vong.position.copy(viTri);
  canh.add(vong);
  const lon = kichThuoc || 6;
  taoTween(1.0, function (p) {
    const s = 1 + (lon - 1) * eRa(p);
    vong.scale.set(s, s, s);
    vl.opacity = 0.9 * (1 - p);
  }, function () { canh.remove(vong); vl.dispose(); });
}

/* Bong bóng biểu cảm trên đầu nhân vật */
const BO_NHO_EMOJI = {};
function ketCauEmoji(emoji) {
  if (!BO_NHO_EMOJI[emoji]) {
    BO_NHO_EMOJI[emoji] = taoKetCau(160, 160, function (ctx, w, h) {
      ctx.beginPath(); ctx.arc(w / 2, h / 2, 72, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff'; ctx.fill();
      ctx.lineWidth = 8; ctx.strokeStyle = '#ffd43b'; ctx.stroke();
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '92px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif';
      ctx.fillText(emoji, w / 2, h / 2 + 6);
    });
  }
  return BO_NHO_EMOJI[emoji];
}
function eNay(p) { const c = 1.70158; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); }
function goBongCamXuc(thiSinh) {
  if (thiSinh.bongHienTai) {
    thiSinh.nhom.remove(thiSinh.bongHienTai);
    thiSinh.bongHienTai.material.dispose();
    thiSinh.bongHienTai = null;
  }
}
function bongCamXuc(thiSinh, emoji, giay) {
  goBongCamXuc(thiSinh);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: ketCauEmoji(emoji), depthTest: false, transparent: true }));
  sprite.renderOrder = 12;
  sprite.position.set(1.0, 3.3, 0);
  sprite.scale.set(0.01, 0.01, 1);
  thiSinh.nhom.add(sprite);
  thiSinh.bongHienTai = sprite;
  taoTween(0.4, function (p) { const s = 0.95 * Math.max(0.01, eNay(p)); sprite.scale.set(s, s, 1); });
  setTimeout(function () {
    if (thiSinh.bongHienTai !== sprite) return;
    taoTween(0.25, function (p) { const s = 0.95 * Math.max(0.01, 1 - p); sprite.scale.set(s, s, 1); }, function () {
      if (thiSinh.bongHienTai === sprite) goBongCamXuc(thiSinh);
    });
  }, giay * 1000);
}

/* Lấp lánh quanh chuông vàng */
const ketCauTron = taoKetCau(64, 64, function (ctx, w, h) {
  const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,230,140,0.8)'); g.addColorStop(1, 'rgba(255,200,60,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
});
const lapLanhChuong = (function () {
  const soDiem = 160; const mang = new Float32Array(soDiem * 3);
  for (let i = 0; i < soDiem; i++) {
    const goc = Math.random() * Math.PI * 2, r = ngauNhien(1.6, 3.2);
    mang[i * 3] = Math.cos(goc) * r; mang[i * 3 + 1] = ngauNhien(0, 5); mang[i * 3 + 2] = Math.sin(goc) * r;
  }
  const hinh = new THREE.BufferGeometry();
  hinh.setAttribute('position', new THREE.BufferAttribute(mang, 3));
  const diem = new THREE.Points(hinh, new THREE.PointsMaterial({ size: 0.28, map: ketCauTron, color: 0xffe08a, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  diem.position.set(0, 1.4, 0);
  nhomChuong.add(diem);
  return diem;
})();

/* Lóe sáng toàn màn hình, rung camera, đổi màu đèn quét, chữ bay */
function chopSang(mau, doManh) {
  const el = $('choiSang');
  el.style.transition = 'none';
  el.style.background = mau;
  el.style.opacity = String(doManh);
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { el.style.transition = 'opacity .7s ease-out'; el.style.opacity = '0'; });
  });
}
let doRungCamera = 0;
function lacCamera(cuongDo) { doRungCamera = Math.max(doRungCamera, cuongDo); }
CHUM_SANG.forEach(function (c) { c.userData.mauGoc = c.material.color.getHex(); });
let maHenDen = null;
function chumDoiMau(mau, giay) {
  CHUM_SANG.forEach(function (c) { c.material.color.setHex(mau); c.material.opacity = 0.16; });
  clearTimeout(maHenDen);
  maHenDen = setTimeout(function () {
    CHUM_SANG.forEach(function (c) { c.material.color.setHex(c.userData.mauGoc); c.material.opacity = 0.07; });
  }, giay * 1000);
}
function noiChu(noiDung, mau, tre) {
  setTimeout(function () {
    const el = document.createElement('div');
    el.className = 'bay-diem';
    el.style.color = mau;
    el.innerHTML = noiDung;
    $('lopNoi').appendChild(el);
    setTimeout(function () { el.remove(); }, 1700);
  }, (tre || 0) * 1000);
}
function bannerCau(chu, phu) {
  const khung = $('bangTieuDeCau');
  $('btdChu').textContent = chu;
  $('btdPhu').textContent = phu;
  khung.classList.remove('an');
  const trong = khung.firstElementChild;
  trong.classList.remove('dap-vao'); void trong.offsetWidth; trong.classList.add('dap-vao');
  clearTimeout(khung.maHen);
  khung.maHen = setTimeout(function () { khung.classList.add('an'); }, 1700);
}

/* Nhạc nền suốt trò chơi: vui tươi ở sảnh/thống kê, hồi hộp khi suy nghĩ, trống dồn khi công bố, rộn ràng khi chiến thắng */
const NHAC = { bat: true, dangChay: false, buoc: 0, thoiDiemTiep: 0, gain: null, tamTrang: 'vui', mucGoc: 0.55 };
function layBoDemOn() {
  const ctx = AM_THANH.ctx;
  if (!AM_THANH.boDemOn) {
    const doDai = ctx.sampleRate;
    const boDem = ctx.createBuffer(1, doDai, ctx.sampleRate);
    const duLieu = boDem.getChannelData(0);
    for (let i = 0; i < doDai; i++) duLieu[i] = Math.random() * 2 - 1;
    AM_THANH.boDemOn = boDem;
  }
  return AM_THANH.boDemOn;
}
function batDauNhac() {
  if (!AM_THANH.ctx) return;
  if (!NHAC.gain) {
    NHAC.gain = AM_THANH.ctx.createGain();
    NHAC.gain.gain.value = NHAC.mucGoc;
    NHAC.gain.connect(AM_THANH.tong);
  }
  if (!NHAC.dangChay) {
    NHAC.dangChay = true;
    NHAC.buoc = 0;
    NHAC.thoiDiemTiep = AM_THANH.ctx.currentTime + 0.1;
  }
}
function giamNhac(muc) { if (NHAC.gain) NHAC.gain.gain.setTargetAtTime(muc, AM_THANH.ctx.currentTime, 0.15); }
function khoiPhucNhac() { if (NHAC.gain) NHAC.gain.gain.setTargetAtTime(NHAC.mucGoc, AM_THANH.ctx.currentTime, 0.4); }
function tanSoMidi(m) { return 440 * Math.pow(2, (m - 69) / 12); }
function nhacNot(midi, t, doDai, kieu, amLuong) {
  const ctx = AM_THANH.ctx;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = kieu;
  o.frequency.setValueAtTime(tanSoMidi(midi), t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(amLuong, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + doDai);
  o.connect(g); g.connect(NHAC.gain);
  o.start(t); o.stop(t + doDai + 0.05);
}
function nhacTrongCai(t, amLuong) {
  const ctx = AM_THANH.ctx;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(150, t);
  o.frequency.exponentialRampToValueAtTime(45, t + 0.15);
  g.gain.setValueAtTime(amLuong, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
  o.connect(g); g.connect(NHAC.gain);
  o.start(t); o.stop(t + 0.25);
}
function nhacOn(t, amLuong, tanSoLoc, doDai) {
  const ctx = AM_THANH.ctx;
  const nguon = ctx.createBufferSource();
  nguon.buffer = layBoDemOn();
  const loc = ctx.createBiquadFilter();
  loc.type = 'highpass'; loc.frequency.value = tanSoLoc;
  const g = ctx.createGain();
  g.gain.setValueAtTime(amLuong, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + doDai);
  nguon.connect(loc); loc.connect(g); g.connect(NHAC.gain);
  nguon.start(t, Math.random() * 0.5); nguon.stop(t + doDai + 0.02);
}
const BAI_VUI = {
  goc: [48, 45, 41, 43],
  hop: [[0, 4, 7], [0, 3, 7], [0, 4, 7], [0, 4, 7]],
  giai: [
    [72, 76, 79, 76, 77, 76, 74, 72],
    [72, 69, 72, 76, 74, 72, 69, null],
    [69, 72, 77, 76, 74, 72, 74, 77],
    [79, 77, 76, 74, 71, 74, 79, null]
  ]
};
const BAI_HOI_HOP = { goc: [45, 41, 43, 40], hop: [[0, 3, 7], [0, 4, 7], [0, 4, 7], [0, 4, 7]] };
function tamTrangNhac() {
  const gd = TRO_CHOI.giaiDoan;
  if (gd === 'traLoi') return 'hoiHop';
  if (gd === 'congBo') return 'trong';
  if (gd === 'chienThang' || gd === 'giaiLao') return 'chienThang';
  return 'vui';
}
function nhipNhac(tt) {
  if (tt === 'hoiHop') return (TRO_CHOI.dangDemGio && TRO_CHOI.thoiGianConLai <= 5) ? 136 : 100;
  if (tt === 'chienThang') return 132;
  if (tt === 'trong') return 126;
  return 112;
}
function phatBuocNhac(buoc, t, tt, nhip) {
  const nuaPhach = 60 / nhip / 2;
  const o = buoc % 8;
  const o_nhip = Math.floor(buoc / 8) % 4;
  if (tt === 'vui' || tt === 'chienThang') {
    const goc = BAI_VUI.goc[o_nhip], hop = BAI_VUI.hop[o_nhip];
    if (o === 0 || o === 3 || o === 4 || o === 6) nhacNot(goc, t, 0.24, 'triangle', 0.22);
    if (o === 0 || o === 4) hop.forEach(function (k) { nhacNot(goc + 12 + k, t, nuaPhach * 3.5, 'sine', 0.045); });
    const n = BAI_VUI.giai[o_nhip][o];
    if (n) { nhacNot(n, t, nuaPhach * 0.9, 'triangle', 0.09); nhacNot(n + 12, t, nuaPhach * 0.6, 'sine', 0.02); }
    if (o === 0 || o === 4 || (tt === 'chienThang' && (o === 2 || o === 6))) nhacTrongCai(t, 0.35);
    if (o === 2 || o === 6) nhacOn(t, 0.1, 1500, 0.12);
    nhacOn(t, o % 2 ? 0.045 : 0.025, 7000, 0.04);
  } else if (tt === 'hoiHop') {
    const goc = BAI_HOI_HOP.goc[o_nhip], hop = BAI_HOI_HOP.hop[o_nhip];
    nhacNot(goc + (o % 2 ? 12 : 0), t, 0.13, 'triangle', 0.16);
    if (o % 2 === 0) nhacNot(goc + 24 + hop[[0, 2, 1, 2][o / 2]], t, nuaPhach * 1.6, 'sine', 0.05);
    if (o === 0) hop.forEach(function (k) { nhacNot(goc + 12 + k, t, nuaPhach * 7.5, 'sine', 0.025); });
    if (o === 0 || o === 4) nhacTrongCai(t, 0.25);
    nhacOn(t, 0.028, 8000, 0.03);
  } else if (tt === 'trong') {
    nhacOn(t, 0.04 + 0.015 * o, 2500, 0.09);
    if (o === 0) nhacTrongCai(t, 0.3);
  }
}
function capNhatNhacNen() {
  if (!NHAC.dangChay || !AM_THANH.ctx || !NHAC.gain) return;
  const ctx = AM_THANH.ctx;
  if (!NHAC.bat || !AM_THANH.bat) { NHAC.thoiDiemTiep = ctx.currentTime + 0.05; return; }
  const tt = tamTrangNhac();
  if (tt !== NHAC.tamTrang) { NHAC.tamTrang = tt; NHAC.buoc = 0; }
  if (NHAC.thoiDiemTiep < ctx.currentTime - 0.1) NHAC.thoiDiemTiep = ctx.currentTime + 0.05;
  while (NHAC.thoiDiemTiep < ctx.currentTime + 0.2) {
    const nhip = nhipNhac(tt);
    phatBuocNhac(NHAC.buoc, NHAC.thoiDiemTiep, tt, nhip);
    NHAC.thoiDiemTiep += 60 / nhip / 2;
    NHAC.buoc = (NHAC.buoc + 1) % 32;
  }
}

function capNhatHieuUng(dt) {
  lapLanhChuong.rotation.y += dt * 0.45;
  lapLanhChuong.material.size = 0.24 + Math.sin(dongHo * 5) * 0.07;
  doRungCamera *= Math.exp(-dt * 5);
  if (doRungCamera < 0.002) doRungCamera = 0;
}

/* ---------------------------------------------------------------------
   12c. GIỜ GIẢI LAO: BỐ NGỌC ANH VÀ MẸ THU HÀ LÊN SÂN KHẤU NHẢY CỔ VŨ
   Diễn ra sau 2 câu trả lời đúng bất kỳ ở giữa chương trình (ví dụ câu 3 và câu 6)
   --------------------------------------------------------------------- */
function taoVatLieuBangChu(chu, mau) {
  return new THREE.MeshBasicMaterial({
    map: taoKetCau(256, 184, function (ctx, w, h) {
      ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      let co = 64;
      ctx.font = '800 ' + co + 'px ' + PHONG_CHU;
      while (ctx.measureText(chu).width > w - 24 && co > 24) { co -= 2; ctx.font = '800 ' + co + 'px ' + PHONG_CHU; }
      ctx.fillStyle = mau; ctx.fillText(chu, w / 2, h / 2 + 6);
    })
  });
}
const BO_ME = (function () {
  const danhSach = [];
  [
    { kieu: 'bo', ten: '👨 BỐ NGỌC ANH', mauNhan: '#0ea5e9', chuBang: 'CỐ LÊN!', mauChu: '#e8590c', mauAo: 0x2f9e44, mauQuan: 0x343a40, x: 1.7 },
    { kieu: 'me', ten: '👩 MẸ THU HÀ', mauNhan: '#e64980', chuBang: 'GIỎI QUÁ!', mauChu: '#d6336c', mauAo: 0xe03131, mauVay: 0xff6b6b, mauQuan: 0xffd8a8, x: -1.7 }
  ].forEach(function (c, i) {
    const nv = taoNhanVat({ kieu: c.kieu, mauAo: c.mauAo, mauVay: c.mauVay, mauQuan: c.mauQuan, mauToc: 0x1b1310, vay: c.kieu === 'me' });
    nv.chuBang.material = taoVatLieuBangChu(c.chuBang, c.mauChu);
    nv.nhom.scale.setScalar(1.3);
    nv.nhom.visible = false;
    canh.add(nv.nhom);
    const nguoi = { nhom: nv.nhom, x: c.x, pha: i * 1.7, nhanTen: null, bongHienTai: null };
    ganNhanTen(nguoi, c.ten, c.mauNhan, '#ffffff', 2.55);
    danhSach.push(nguoi);
  });
  return { danhSach: danhSach, dangNhay: false, batDau: 0 };
})();
function capNhatBoMe() {
  if (!BO_ME.dangNhay) return;
  const t = dongHo - BO_ME.batDau;
  BO_ME.danhSach.forEach(function (n, i) {
    const k = (t + i * 0.5) % 4;
    n.nhom.position.y = 1.2 + Math.abs(Math.sin(t * 7 + n.pha)) * 0.55;
    n.nhom.rotation.z = Math.sin(t * 7 + n.pha) * 0.18;
    if (k < 3) n.nhom.rotation.y = Math.PI + Math.sin(t * 3.5 + n.pha) * 0.7;
    else n.nhom.rotation.y = Math.PI + (k - 3) * Math.PI * 2;
    n.nhom.position.x = n.x + Math.sin(t * 1.8 + n.pha) * 0.5;
  });
}
function voTay(giay) {
  if (!AM_THANH.ctx || !AM_THANH.bat) return;
  for (let i = 0; i < giay * 14; i++) {
    const t = AM_THANH.ctx.currentTime + Math.random() * giay;
    const nguon = AM_THANH.ctx.createBufferSource();
    nguon.buffer = layBoDemOn();
    const loc = AM_THANH.ctx.createBiquadFilter(); loc.type = 'bandpass'; loc.frequency.value = ngauNhien(1200, 2400); loc.Q.value = 1.2;
    const g = AM_THANH.ctx.createGain();
    g.gain.setValueAtTime(ngauNhien(0.08, 0.2), t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
    nguon.connect(loc); loc.connect(g); g.connect(AM_THANH.tong);
    nguon.start(t, Math.random() * 0.5); nguon.stop(t + 0.08);
  }
}
async function giaiLaoBoMe(phien) {
  TRO_CHOI.giaiDoan = 'giaiLao';
  anDi('hud');
  bannerCau('🎉 GIỜ GIẢI LAO 🎉', 'Bố Ngọc Anh và mẹ Thu Hà lên nhảy cổ vũ!');
  AM_THANH.kenTieuDe();
  await bayCamera([new V3(0, 3.8, -23.5), new V3(0, 3.0, -15)], 1.6);
  if (phien !== TRO_CHOI.phien) return;
  BO_ME.danhSach.forEach(function (n) {
    n.nhom.visible = true;
    n.nhom.position.set(n.x, 1.2, -15.4);
    n.nhom.rotation.set(0, Math.PI, 0);
    phatHat(new V3(n.x, 2.4, -15.4), 60, [0xffd43b, 0xffffff, 0xff8fc7, 0x74c0fc], { tocDo: [2, 5], trongLuc: 2, tuoi: [0.7, 1.4], kichThuoc: 1.3 });
    songXung(new V3(n.x, 1.25, -15.4), 0xffd43b, 4);
  });
  chopSang('#ffffff', 0.45);
  banPhaoHoa(-6, -10); setTimeout(function () { banPhaoHoa(6, -10); }, 350);
  BO_ME.dangNhay = true; BO_ME.batDau = dongHo;
  bongCamXuc(BO_ME.danhSach[0], '🕺', 6);
  bongCamXuc(BO_ME.danhSach[1], '💃', 6);
  thongBao('<div class="flex items-center justify-center gap-3"><img src="' + ANH_BO_ME.bo + '" style="width:64px;height:64px;border-radius:9999px;border:4px solid #74c0fc;object-fit:cover">' +
    '<img src="' + ANH_BO_ME.me + '" style="width:64px;height:64px;border-radius:9999px;border:4px solid #faa2c1;object-fit:cover"></div>' +
    'Bố mẹ khen ' + THONG_TIN[TRO_CHOI.chinh].ten + ' giỏi quá! 👏', 3000);
  voTay(2.5);
  banPhaoGiay2D(140);
  TAT_CA.forEach(function (t) { if (t.conSong) vuiMung(t, 6); });
  setTimeout(function () { if (phien === TRO_CHOI.phien) { banPhaoGiay2D(120); voTay(2); } }, 2600);
  await cho(6500);
  if (phien !== TRO_CHOI.phien) return;
  BO_ME.danhSach.forEach(function (n) { bongCamXuc(n, '👋', 1.2); });
  await cho(1100);
  BO_ME.dangNhay = false;
  BO_ME.danhSach.forEach(function (n) {
    phatHat(n.nhom.position.clone().add(new V3(0, 1.5, 0)), 40, [0xffffff, 0xd0bfff, 0xffd43b], { tocDo: [1, 3], trongLuc: 0.5, tuoi: [0.5, 1.1], kichThuoc: 1.2 });
    n.nhom.visible = false;
  });
  if (phien !== TRO_CHOI.phien) return;
  hien('hud', 'flex');
  TRO_CHOI.giaiDoan = 'congBo';
  await bayCamera(gocToanCanh(), 1.4);
}
function anBoMe() {
  BO_ME.dangNhay = false;
  BO_ME.danhSach.forEach(function (n) { n.nhom.visible = false; goBongCamXuc(n); });
}
/* Chọn ngẫu nhiên 2 câu ở giữa chương trình: một câu trong số 3–5, một câu trong số 6–8 */
function lapLichGiaiLao() { return [soNguyen(2, 4), soNguyen(5, 7)]; }

/* ---------------------------------------------------------------------
   13. GIAO DIỆN & LUỒNG TRÒ CHƠI
   --------------------------------------------------------------------- */
let maHenThongBao = null;
function thongBao(noiDung, ms) {
  const el = $('thongBao');
  el.innerHTML = noiDung;
  el.classList.remove('an', 'hop-hien'); void el.offsetWidth; el.classList.add('hop-hien');
  clearTimeout(maHenThongBao);
  maHenThongBao = setTimeout(function () { el.classList.add('an'); }, ms || 1800);
}
function demSo(el, tu, den, ms) {
  const batDau = performance.now();
  function buoc(bayGio) {
    const p = Math.min(1, (bayGio - batDau) / ms);
    el.textContent = Math.round(tu + (den - tu) * eRa(p));
    if (p < 1) requestAnimationFrame(buoc);
  }
  requestAnimationFrame(buoc);
}
function demConSong() { return TAT_CA.filter(function (t) { return t.conSong; }).length; }
function viTriTrenDau(thiSinh, doCao) { return thiSinh.nhom.position.clone().add(new V3(0, doCao, 0)); }
function capNhatHud() {
  $('hudCau').textContent = tenCau(TRO_CHOI.chiSo);
  $('hudConLai').textContent = demConSong();
  $('hudPhao').textContent = TRO_CHOI.phao;
  $('hudDiem').textContent = TRO_CHOI.diem;
  const chuoi = $('hudChuoi');
  if (TRO_CHOI.chuoi >= 2) { chuoi.classList.remove('an'); $('hudChuoiSo').textContent = TRO_CHOI.chuoi; }
  else chuoi.classList.add('an');
  if (TRO_CHOI.chinh) {
    const tt = THONG_TIN[TRO_CHOI.chinh];
    $('hudNhanVat').innerHTML = '<img src="' + ANH_MAT[TRO_CHOI.chinh] + '" alt="" style="width:30px;height:30px;border-radius:9999px;border:2px solid #fff;object-fit:cover;margin:-4px 2px -4px -8px"> ' + tt.ten + ' · Lớp ' + tt.tenLop + ' · Ô 45';
    $('hudNhanVat').style.background = tt.mauNhan;
  }
}

/* Chuẩn bị bộ 10 câu hỏi: ưu tiên câu chưa ra ở các ván trước (ghi nhớ trên máy), trộn cả thứ tự đáp án */
function khoaDaDung(ten) { return 'rung-chuong-vang-da-dung-lop-' + THONG_TIN[ten].lop; }
function docDaDung(ten) { try { return JSON.parse(localStorage.getItem(khoaDaDung(ten)) || '[]'); } catch (e) { return []; } }
function ghiDaDung(ten, danhSach) { try { localStorage.setItem(khoaDaDung(ten), JSON.stringify(danhSach)); } catch (e) { /* trình duyệt không cho lưu thì bỏ qua */ } }
function khoaCau(q) { return q.cau + '|' + q.dapAn.join('|'); }
function tronDapAn(q) {
  const thuTu = tronMang([0, 1, 2, 3]);
  return { mon: q.mon, cau: q.cau, dapAnTron: thuTu.map(function (k) { return q.dapAn[k]; }), dung: thuTu.indexOf(q.dung) };
}
const VONG_RCV = [{"ten": "Sân Trường Khởi Động", "tg": 25, "c3": [["Toán", "Kết quả của phép tính 147 + 124 là bao nhiêu?", "281", "261", "271", "272", 2], ["Toán", "Kết quả của phép tính 375 - 127 là bao nhiêu?", "258", "238", "250", "248", 3], ["Toán", "Tính nhanh: 3 x 5 = ?", "15", "18", "12", "17", 0], ["Toán", "Tính nhanh: 15 : 3 = ?", "6", "5", "4", "7", 1], ["Toán", "Gấp 20 lên 2 lần được số nào?", "42", "38", "40", "50", 2], ["Tiếng Việt", "Từ nào dưới đây là từ chỉ sự vật?", "Chạy bộ", "Xanh biếc", "Chăm chỉ", "Quyển sách", 3], ["Tiếng Anh", "Nghĩa tiếng Việt của 'library' là gì?", "Thư viện", "Phòng học", "Sân chơi", "Phòng nhạc", 0], ["TNXH", "Bộ phận nào của cây giúp hút nước và muối khoáng từ đất?", "Lá cây", "Rễ cây", "Hoa", "Quả", 1], ["Tiếng Việt", "Từ nào dưới đây là từ chỉ hoạt động?", "Bông hoa", "Dịu dàng", "Tưới cây", "Chiếc bàn", 2], ["Tiếng Anh", "Nghĩa tiếng Việt của 'playground' là gì?", "Phòng tin học", "Cổng trường", "Nhà ăn", "Sân chơi", 3]], "c1": [["Toán", "1 + 2 bằng mấy?", "4", "2", "3", "5", 2], ["Toán", "5 - 1 bằng mấy?", "5", "3", "6", "4", 3], ["Toán", "Có 2 quả táo, thêm 3 quả nữa là mấy quả?", "5 quả", "6 quả", "4 quả", "7 quả", 0], ["Toán", "Có 6 chiếc kẹo, ăn mất 2 chiếc. Còn mấy chiếc?", "5 chiếc", "4 chiếc", "3 chiếc", "6 chiếc", 1], ["Toán", "Số liền sau của số 1 là số mấy?", "3", "1", "2", "4", 2], ["Tiếng Việt", "Điền c hay k: '...on mèo'?", "k", "g", "t", "c", 3], ["Tiếng Anh", "Số 1 tiếng Anh là gì?", "one", "two", "three", "four", 0], ["TNXH", "Mặt Trời chiếu sáng vào buổi nào?", "Ban đêm", "Ban ngày", "Nửa đêm", "Lúc ngủ", 1], ["Tiếng Việt", "Điền c hay k: 'cái ...éo'?", "c", "d", "k", "n", 2], ["Tiếng Anh", "Số 2 tiếng Anh là gì?", "one", "four", "six", "two", 3]]}, {"ten": "Góc Vườn Chim Hót", "tg": 25, "c3": [["Toán", "Kết quả của phép tính 182 + 138 là bao nhiêu?", "320", "330", "310", "321", 0], ["Toán", "Kết quả của phép tính 410 - 139 là bao nhiêu?", "281", "271", "261", "273", 1], ["Toán", "Tính nhanh: 4 x 6 = ?", "28", "20", "24", "26", 2], ["Toán", "Tính nhanh: 24 : 4 = ?", "7", "5", "8", "6", 3], ["Toán", "Gấp 25 lên 2 lần được số nào?", "50", "52", "48", "60", 0], ["TNXH", "Bộ phận nào của cây chủ yếu thực hiện quang hợp dưới ánh nắng?", "Rễ cây", "Lá cây", "Vỏ cây", "Hạt", 1], ["Tiếng Việt", "Từ nào dưới đây là từ chỉ đặc điểm?", "Học bài", "Con mèo", "Thơm ngát", "Quét sân", 2], ["Tiếng Anh", "Từ tiếng Anh nào có nghĩa là 'phòng mỹ thuật'?", "music room", "gym", "computer room", "art room", 3], ["TNXH", "Cơ quan nào giúp cơ thể con người hít thở không khí?", "Cơ quan hô hấp (phổi)", "Cơ quan tiêu hóa", "Cơ quan bài tiết", "Cơ quan vận động", 0], ["Tiếng Việt", "Trong câu 'Mặt trời đỏ rực như hòn lửa', sự vật nào được so sánh?", "Mặt trời với bầu trời", "Mặt trời với hòn lửa", "Hòn lửa với đám mây", "Đỏ rực với màu vàng", 1]], "c1": [["Toán", "2 + 3 bằng mấy?", "5", "6", "4", "7", 0], ["Toán", "6 - 2 bằng mấy?", "5", "4", "3", "6", 1], ["Toán", "Có 3 quả táo, thêm 5 quả nữa là mấy quả?", "9 quả", "7 quả", "8 quả", "10 quả", 2], ["Toán", "Có 7 chiếc kẹo, ăn mất 3 chiếc. Còn mấy chiếc?", "5 chiếc", "3 chiếc", "6 chiếc", "4 chiếc", 3], ["Toán", "Số liền sau của số 2 là số mấy?", "3", "4", "2", "5", 0], ["TNXH", "Trăng và sao thường thấy rõ vào lúc nào?", "Buổi trưa", "Ban đêm", "Buổi sáng", "Giữa trưa", 1], ["Tiếng Việt", "Điền c hay k: 'quả ...am'?", "k", "m", "c", "p", 2], ["Tiếng Anh", "Số 3 tiếng Anh là gì?", "two", "five", "seven", "three", 3], ["TNXH", "Đèn giao thông màu đỏ báo hiệu điều gì?", "Dừng lại", "Đi nhanh", "Chạy qua", "Quay đầu", 0], ["Tiếng Việt", "Điền c hay k: 'con ...iến'?", "c", "k", "g", "b", 1]]}, {"ten": "Lớp Học Thân Thương", "tg": 25, "c3": [["Toán", "Kết quả của phép tính 217 + 152 là bao nhiêu?", "379", "359", "369", "370", 2], ["Toán", "Kết quả của phép tính 445 - 151 là bao nhiêu?", "304", "284", "296", "294", 3], ["Toán", "Tính nhanh: 5 x 7 = ?", "35", "40", "30", "37", 0], ["Toán", "Tính nhanh: 35 : 5 = ?", "8", "7", "6", "9", 1], ["Toán", "Gấp 30 lên 2 lần được số nào?", "62", "58", "60", "70", 2], ["Tiếng Anh", "Câu 'May I come in?' dùng để xin phép điều gì?", "Xin phép ra ngoài", "Xin phép ngồi xuống", "Xin phép mở sách", "Xin phép vào lớp", 3], ["TNXH", "Cơ quan nào bơm máu đi nuôi khắp cơ thể?", "Tim", "Dạ dày", "Phổi", "Thận", 0], ["Tiếng Việt", "Từ nào viết đúng chính tả?", "Sinh sắn", "Xinh xắn", "Xinh sắn", "Sinh xắn", 1], ["Tiếng Anh", "Từ tiếng Anh nào có nghĩa là 'thước kẻ'?", "rubber", "pencil", "ruler", "notebook", 2], ["TNXH", "Hành tinh chúng ta đang sống tên là gì?", "Sao Hỏa", "Mặt Trăng", "Mặt Trời", "Trái Đất", 3]], "c1": [["Toán", "3 + 4 bằng mấy?", "8", "6", "7", "9", 2], ["Toán", "7 - 3 bằng mấy?", "5", "3", "6", "4", 3], ["Toán", "Có 4 quả táo, thêm 2 quả nữa là mấy quả?", "6 quả", "7 quả", "5 quả", "8 quả", 0], ["Toán", "Có 8 chiếc kẹo, ăn mất 2 chiếc. Còn mấy chiếc?", "7 chiếc", "6 chiếc", "5 chiếc", "8 chiếc", 1], ["Toán", "Số liền sau của số 3 là số mấy?", "5", "3", "4", "6", 2], ["Tiếng Anh", "Số 4 tiếng Anh là gì?", "one", "three", "nine", "four", 3], ["TNXH", "Đèn giao thông màu xanh báo hiệu điều gì?", "Được phép đi", "Dừng lại", "Đứng yên", "Quay về", 0], ["Tiếng Việt", "Điền g hay gh: 'con ...à'?", "gh", "g", "c", "k", 1], ["Tiếng Anh", "Số 6 tiếng Anh là gì?", "five", "seven", "six", "ten", 2], ["TNXH", "Đội mũ bảo hiểm khi nào?", "Khi đi ngủ", "Khi ăn cơm", "Khi tắm", "Khi đi xe máy, xe đạp", 3]]}, {"ten": "Thư Viện Rực Rỡ", "tg": 25, "c3": [["Toán", "Kết quả của phép tính 252 + 166 là bao nhiêu?", "418", "428", "408", "419", 0], ["Toán", "Kết quả của phép tính 480 - 163 là bao nhiêu?", "327", "317", "307", "319", 1], ["Toán", "Tính nhanh: 2 x 8 = ?", "18", "14", "16", "17", 2], ["Toán", "Tính nhanh: 16 : 2 = ?", "9", "7", "10", "8", 3], ["Toán", "Gấp 35 lên 2 lần được số nào?", "70", "72", "68", "80", 0], ["Tiếng Việt", "Từ nào viết đúng chính tả?", "Chắng chẻo", "Trắng trẻo", "Trắng chẻo", "Chắng trẻo", 1], ["Tiếng Anh", "Từ tiếng Anh nào có nghĩa là 'cặp sách'?", "pencil case", "bookcase", "school bag", "classroom", 2], ["TNXH", "Trái Đất quay quanh thiên thể nào?", "Mặt Trăng", "Sao Mộc", "Sao Kim", "Mặt Trời", 3], ["Tiếng Anh", "Màu 'purple' là màu gì?", "Màu hồng", "Màu tím", "Màu cam", "Màu xám", 1]], "c1": [["Toán", "4 + 5 bằng mấy?", "9", "10", "8", "11", 0], ["Toán", "8 - 4 bằng mấy?", "5", "4", "3", "6", 1], ["Toán", "Có 5 quả táo, thêm 4 quả nữa là mấy quả?", "10 quả", "8 quả", "9 quả", "11 quả", 2], ["Toán", "Có 9 chiếc kẹo, ăn mất 4 chiếc. Còn mấy chiếc?", "6 chiếc", "4 chiếc", "7 chiếc", "5 chiếc", 3], ["Toán", "Số liền sau của số 4 là số mấy?", "5", "6", "4", "7", 0], ["Tiếng Việt", "Điền g hay gh: 'cái ...ế'?", "g", "gh", "ng", "c", 1], ["Tiếng Anh", "Số 7 tiếng Anh là gì?", "six", "eight", "seven", "nine", 2], ["TNXH", "Em dùng bộ phận nào để nghe tiếng cô giáo giảng bài?", "Đôi mắt", "Cái mũi", "Bàn tay", "Đôi tai", 3], ["Tiếng Việt", "Điền g hay gh: '...i chép'?", "gh", "g", "k", "ngh", 0], ["Tiếng Anh", "Số 9 tiếng Anh là gì?", "eight", "nine", "ten", "four", 1]]}, {"ten": "Vườn Hoa Trí Tuệ", "tg": 25, "c3": [["Toán", "Kết quả của phép tính 287 + 180 là bao nhiêu?", "477", "457", "467", "468", 2], ["Toán", "Kết quả của phép tính 515 - 175 là bao nhiêu?", "350", "330", "342", "340", 3], ["Toán", "Tính nhanh: 3 x 4 = ?", "12", "15", "9", "14", 0], ["Toán", "Tính nhanh: 12 : 3 = ?", "5", "4", "3", "6", 1], ["Toán", "Gấp 40 lên 2 lần được số nào?", "82", "78", "80", "90", 2], ["TNXH", "Mặt Trời mọc ở hướng nào?", "Hướng Tây", "Hướng Nam", "Hướng Bắc", "Hướng Đông", 3], ["Tiếng Việt", "Từ nào viết đúng chính tả?", "Sáng sủa", "Xáng xủa", "Sáng xủa", "Xáng sủa", 0], ["Tiếng Anh", "Màu 'brown' là màu gì?", "Màu đen", "Màu nâu", "Màu trắng", "Màu xanh", 1], ["TNXH", "Mặt Trời lặn ở hướng nào?", "Hướng Đông", "Hướng Bắc", "Hướng Tây", "Hướng Nam", 2], ["Tiếng Việt", "Từ nào cùng nghĩa với 'dũng cảm'?", "Nhút nhát", "Lo lắng", "Lười biếng", "Gan dạ", 3]], "c1": [["Toán", "5 + 2 bằng mấy?", "8", "6", "7", "9", 2], ["Toán", "9 - 5 bằng mấy?", "5", "3", "6", "4", 3], ["Toán", "Có 6 quả táo, thêm 1 quả nữa là mấy quả?", "7 quả", "8 quả", "6 quả", "9 quả", 0], ["Toán", "Có 10 chiếc kẹo, ăn mất 5 chiếc. Còn mấy chiếc?", "6 chiếc", "5 chiếc", "4 chiếc", "7 chiếc", 1], ["Toán", "Số liền sau của số 5 là số mấy?", "7", "5", "6", "8", 2], ["TNXH", "Em dùng bộ phận nào để nhìn thấy màu sắc?", "Đôi tai", "Cái mũi", "Bàn chân", "Đôi mắt", 3], ["Tiếng Việt", "Điền g hay gh: 'củ ...ừng'?", "g", "gh", "ng", "ngh", 0], ["Tiếng Anh", "Số 10 tiếng Anh là gì?", "two", "ten", "six", "eight", 1], ["TNXH", "Em dùng bộ phận nào để ngửi mùi thơm của hoa?", "Đôi tai", "Đôi mắt", "Cái mũi", "Cánh tay", 2], ["Tiếng Việt", "Điền ng hay ngh: 'con ...é'?", "ng", "g", "gh", "ngh", 3]]}, {"ten": "Cầu Vồng Sau Mưa", "tg": 25, "c3": [["Toán", "Kết quả của phép tính 322 + 194 là bao nhiêu?", "516", "526", "506", "517", 0], ["Toán", "Kết quả của phép tính 550 - 187 là bao nhiêu?", "373", "363", "353", "365", 1], ["Toán", "Tính nhanh: 4 x 5 = ?", "24", "16", "20", "22", 2], ["Toán", "Tính nhanh: 20 : 4 = ?", "6", "4", "7", "5", 3], ["Toán", "Gấp 45 lên 2 lần được số nào?", "90", "92", "88", "100", 0], ["Tiếng Anh", "Môn thể thao 'table tennis' là môn gì?", "Bóng đá", "Bóng bàn", "Cầu lông", "Bóng rổ", 1], ["TNXH", "La bàn dùng để làm gì?", "Đo nhiệt độ", "Đo chiều dài", "Xác định phương hướng", "Xem giờ", 2], ["Tiếng Việt", "Từ nào cùng nghĩa với 'hiền lành'?", "Hung dữ", "Nóng nảy", "Kiêu ngạo", "Hiền hậu", 3], ["Tiếng Anh", "Hoạt động 'play chess' nghĩa là gì?", "Chơi cờ vua", "Chơi trốn tìm", "Nhảy dây", "Đá bóng", 0], ["TNXH", "Kim màu đỏ của la bàn luôn chỉ về hướng nào?", "Hướng Đông", "Hướng Bắc", "Hướng Tây", "Hướng Nam", 1]], "c1": [["Toán", "6 + 3 bằng mấy?", "9", "10", "8", "11", 0], ["Toán", "10 - 3 bằng mấy?", "8", "7", "6", "9", 1], ["Toán", "Có 3 quả táo, thêm 4 quả nữa là mấy quả?", "8 quả", "6 quả", "7 quả", "9 quả", 2], ["Toán", "Có 8 chiếc kẹo, ăn mất 3 chiếc. Còn mấy chiếc?", "6 chiếc", "4 chiếc", "7 chiếc", "5 chiếc", 3], ["Toán", "Số liền sau của số 6 là số mấy?", "7", "8", "6", "9", 0], ["Tiếng Anh", "Màu đỏ tiếng Anh là gì?", "blue", "red", "green", "pink", 1], ["TNXH", "Rác sau khi ăn bánh nên bỏ vào đâu?", "Sân trường", "Gầm bàn", "Thùng rác", "Đường phố", 2], ["Tiếng Việt", "Điền ng hay ngh: 'cá ...ừ'?", "ngh", "g", "c", "ng", 3], ["Tiếng Anh", "Màu xanh dương tiếng Anh là gì?", "blue", "red", "yellow", "black", 0], ["TNXH", "Cây xanh cần gì để lớn lên?", "Bánh kẹo", "Nước và ánh sáng mặt trời", "Đồ chơi", "Quần áo", 1]]}, {"ten": "Bến Cảng Tri Thức", "tg": 22, "c3": [["Toán", "Tính tích: 7 x 5 = ?", "42", "28", "35", "37", 2], ["Toán", "Tính thương: 32 : 8 = ?", "5", "3", "6", "4", 3], ["Toán", "Tính tổng: 237 + 164 = ?", "401", "411", "391", "501", 0], ["Toán", "Tìm x biết: x + 252 = 701", "459", "449", "439", "450", 1], ["Toán", "Gấp 13 lên 4 lần ta được số nào?", "56", "48", "52", "62", 2], ["Tiếng Việt", "Từ nào trái nghĩa với 'chăm chỉ'?", "Siêng năng", "Cần cù", "Ngoan ngoãn", "Lười biếng", 3], ["Tiếng Anh", "Trò chơi 'hide-and-seek' là trò chơi gì?", "Trốn tìm", "Nhảy dây", "Kéo co", "Cờ vua", 0], ["TNXH", "Trong 4 phương chính, phương đối diện với phương Bắc là phương nào?", "Phương Đông", "Phương Nam", "Phương Tây", "Phương Đông Bắc", 1], ["Tiếng Việt", "Từ nào trái nghĩa với 'khổng lồ'?", "To lớn", "Vĩ đại", "Tí hon", "Rộng lớn", 2], ["Tiếng Anh", "Từ tiếng Anh nào chỉ 'bố'?", "mother", "brother", "sister", "father", 3]], "c1": [["Toán", "7 + 2 bằng mấy?", "10", "8", "9", "11", 2], ["Toán", "9 - 2 bằng mấy?", "8", "6", "9", "7", 3], ["Toán", "Có 2 quả táo, thêm 6 quả nữa là mấy quả?", "8 quả", "9 quả", "7 quả", "10 quả", 0], ["Toán", "Có 9 chiếc kẹo, ăn mất 6 chiếc. Còn mấy chiếc?", "4 chiếc", "3 chiếc", "2 chiếc", "5 chiếc", 1], ["Toán", "Số liền sau của số 7 là số mấy?", "9", "7", "8", "10", 2], ["Tiếng Việt", "Điền ng hay ngh: '...e nhạc'?", "ng", "g", "gh", "ngh", 3], ["Tiếng Anh", "Màu hồng tiếng Anh là gì?", "pink", "green", "white", "orange", 0], ["TNXH", "Mùa đông trời lạnh, bé nên mặc gì?", "Áo ba lỗ", "Áo ấm và quàng khăn", "Quần đùi mỏng", "Không mặc áo", 1], ["Tiếng Việt", "Điền ng hay ngh: 'quả ...ọt'?", "ngh", "gh", "ng", "k", 2], ["Tiếng Anh", "Màu cam tiếng Anh là gì?", "blue", "black", "purple", "orange", 3]]}, {"ten": "Khu Rừng Cổ Tích", "tg": 22, "c3": [["Toán", "Tính tích: 8 x 6 = ?", "48", "56", "40", "50", 0], ["Toán", "Tính thương: 45 : 9 = ?", "6", "5", "4", "7", 1], ["Toán", "Tính tổng: 264 + 183 = ?", "457", "437", "447", "547", 2], ["Toán", "Tìm x biết: x + 269 = 722", "463", "443", "454", "453", 3], ["Toán", "Gấp 15 lên 5 lần ta được số nào?", "75", "80", "70", "85", 0], ["TNXH", "Nước ở thể rắn gọi là gì?", "Hơi nước", "Nước đá (băng)", "Nước mưa", "Sương mù", 1], ["Tiếng Việt", "Từ nào trái nghĩa với 'sạch sẽ'?", "Gọn gàng", "Ngăn nắp", "Bẩn thỉu", "Tinh tươm", 2], ["Tiếng Anh", "Từ tiếng Anh nào chỉ 'chị/em gái'?", "brother", "uncle", "grandfather", "sister", 3], ["TNXH", "Để phòng tránh cháy nổ trong gia đình, ta nên làm gì?", "Tắt bếp, rút phích cắm điện khi không dùng", "Để giấy báo sát bếp lửa", "Nghịch bật lửa gần rèm cửa", "Cắm nhiều thiết bị quá tải vào 1 ổ", 0], ["Tiếng Việt", "Cuối câu cảm thán thường đặt dấu câu nào?", "Dấu chấm hỏi (?)", "Dấu chấm than (!)", "Dấu phẩy (,)", "Dấu chấm phẩy (;)", 1]], "c1": [["Toán", "3 + 6 bằng mấy?", "9", "10", "8", "11", 0], ["Toán", "8 - 5 bằng mấy?", "4", "3", "2", "5", 1], ["Toán", "Có 5 quả táo, thêm 3 quả nữa là mấy quả?", "9 quả", "7 quả", "8 quả", "10 quả", 2], ["Toán", "Có 7 chiếc kẹo, ăn mất 2 chiếc. Còn mấy chiếc?", "6 chiếc", "4 chiếc", "7 chiếc", "5 chiếc", 3], ["Toán", "Số liền sau của số 8 là số mấy?", "9", "10", "8", "11", 0], ["TNXH", "Khi trời mưa, bé mang theo gì khi ra ngoài?", "Kính râm", "Áo mưa hoặc ô", "Quạt giấy", "Bóng bay", 1], ["Tiếng Việt", "Con vật nào kêu 'meo meo'?", "Con chó", "Con gà", "Con mèo", "Con vịt", 2], ["Tiếng Anh", "Màu đen tiếng Anh là gì?", "white", "yellow", "pink", "black", 3], ["TNXH", "Con vật nào sống trong nhà giúp trông nhà?", "Con chó", "Con hổ", "Con voi", "Con cá mập", 0], ["Tiếng Việt", "Con vật nào kêu 'gâu gâu'?", "Con mèo", "Con chó", "Con cá", "Con chim", 1]]}, {"ten": "Đảo Gió Mùa Xuân", "tg": 22, "c3": [["Toán", "Tính tích: 9 x 7 = ?", "72", "54", "63", "65", 2], ["Toán", "Tính thương: 36 : 6 = ?", "7", "5", "8", "6", 3], ["Toán", "Tính tổng: 291 + 202 = ?", "493", "503", "483", "593", 0], ["Toán", "Tìm x biết: x + 286 = 743", "467", "457", "447", "458", 1], ["Toán", "Gấp 17 lên 3 lần ta được số nào?", "54", "48", "51", "61", 2], ["Tiếng Anh", "Nghề nghiệp 'doctor' là nghề gì?", "Giáo viên", "Nông dân", "Lái xe", "Bác sĩ", 3], ["TNXH", "Số điện thoại gọi cứu hỏa khẩn cấp ở Việt Nam là số nào?", "114", "113", "115", "111", 0], ["Tiếng Việt", "Cuối câu kể thường đặt dấu câu nào?", "Dấu chấm hỏi (?)", "Dấu chấm (.)", "Dấu phẩy (,)", "Dấu gạch ngang (-)", 1], ["Tiếng Anh", "Nghề nghiệp 'teacher' là nghề gì?", "Y tá", "Công nhân", "Giáo viên", "Đầu bếp", 2], ["TNXH", "Số điện thoại gọi cấp cứu y tế khẩn cấp ở Việt Nam là số nào?", "113", "114", "112", "115", 3]], "c1": [["Toán", "4 + 4 bằng mấy?", "9", "7", "8", "10", 2], ["Toán", "7 - 4 bằng mấy?", "4", "2", "5", "3", 3], ["Toán", "Có 4 quả táo, thêm 6 quả nữa là mấy quả?", "10 quả", "11 quả", "9 quả", "12 quả", 0], ["Toán", "Có 10 chiếc kẹo, ăn mất 4 chiếc. Còn mấy chiếc?", "7 chiếc", "6 chiếc", "5 chiếc", "8 chiếc", 1], ["Toán", "Số liền sau của số 9 là số mấy?", "11", "9", "10", "12", 2], ["Tiếng Anh", "Màu trắng tiếng Anh là gì?", "black", "red", "green", "white", 3], ["TNXH", "Con vật nào cho chúng ta trứng để ăn?", "Con gà mái", "Con mèo", "Con chó", "Con thỏ", 0], ["Tiếng Việt", "Con vật nào kêu 'cạp cạp'?", "Con gà", "Con vịt", "Con lợn", "Con bò", 1], ["Tiếng Anh", "Con chim tiếng Anh là gì?", "fish", "cat", "bird", "dog", 2], ["TNXH", "Con vật nào cho chúng ta sữa tươi?", "Con gà", "Con cá", "Con chim", "Con bò sữa", 3]]}, {"ten": "Quảng Trường Mặt Trời", "tg": 22, "c3": [["Toán", "Tính tích: 6 x 8 = ?", "48", "54", "42", "50", 0], ["Toán", "Tính thương: 49 : 7 = ?", "8", "7", "6", "9", 1], ["Toán", "Tính tổng: 318 + 221 = ?", "549", "529", "539", "639", 2], ["Toán", "Tìm x biết: x + 303 = 764", "471", "451", "462", "461", 3], ["Toán", "Gấp 19 lên 4 lần ta được số nào?", "76", "80", "72", "86", 0], ["Tiếng Việt", "Dấu hai chấm (:) đứng trước dấu ngoặc kép dùng để làm gì?", "Kết thúc đoạn văn", "Báo hiệu lời nói trực tiếp của nhân vật", "Ngăn cách hai câu hỏi", "Thay cho dấu phẩy", 1], ["Tiếng Anh", "Nghề nghiệp 'farmer' là nghề gì?", "Ca sĩ", "Bác sĩ", "Nông dân", "Họa sĩ", 2], ["TNXH", "Số điện thoại tổng đài quốc gia bảo vệ trẻ em là số nào?", "113", "114", "115", "111", 3], ["Tiếng Việt", "Bộ phận trả lời cho câu hỏi 'Ai?' trong câu 'Chị Lucie đang đọc sách' là gì?", "Chị Lucie", "Đang đọc sách", "Đọc sách", "Sách", 0], ["Tiếng Anh", "Phòng 'kitchen' trong nhà là phòng nào?", "Phòng ngủ", "Phòng bếp", "Phòng khách", "Phòng tắm", 1]], "c1": [["Toán", "5 + 5 bằng mấy?", "10", "11", "9", "12", 0], ["Toán", "10 - 6 bằng mấy?", "5", "4", "3", "6", 1], ["Toán", "Có 7 quả táo, thêm 3 quả nữa là mấy quả?", "11 quả", "9 quả", "10 quả", "12 quả", 2], ["Toán", "Có 9 chiếc kẹo, ăn mất 3 chiếc. Còn mấy chiếc?", "7 chiếc", "5 chiếc", "8 chiếc", "6 chiếc", 3], ["Toán", "Số liền sau của số 10 là số mấy?", "11", "12", "10", "13", 0], ["Tiếng Việt", "Con vật nào kêu 'ò ó o'?", "Con vịt", "Con gà trống", "Con mèo", "Con thỏ", 1], ["Tiếng Anh", "Con cá tiếng Anh là gì?", "bird", "duck", "fish", "pig", 2], ["TNXH", "Hoa đào nở vào dịp lễ nào?", "Tết Trung Thu", "Ngày khai giảng", "Mùa hè", "Tết Nguyên Đán", 3], ["Tiếng Việt", "Con vật nào thích ăn cà rốt và có tai dài?", "Con thỏ", "Con cá", "Con rùa", "Con chim", 0], ["Tiếng Anh", "Con vịt tiếng Anh là gì?", "dog", "duck", "cat", "cow", 1]]}, {"ten": "Hành Tinh Xanh", "tg": 22, "c3": [["Toán", "Tính tích: 7 x 9 = ?", "70", "56", "63", "65", 2], ["Toán", "Tính thương: 64 : 8 = ?", "9", "7", "10", "8", 3], ["Toán", "Tính tổng: 345 + 240 = ?", "585", "595", "575", "685", 0], ["Toán", "Tìm x biết: x + 320 = 785", "475", "465", "455", "466", 1], ["Toán", "Gấp 21 lên 5 lần ta được số nào?", "110", "100", "105", "115", 2], ["TNXH", "Thức ăn nào giàu vitamin và chất xơ tốt cho sức khỏe?", "Kẹo ngọt", "Nước ngọt có ga", "Đồ ăn quá mặn", "Rau xanh và hoa quả tươi", 3], ["Tiếng Việt", "Bộ phận trả lời cho câu hỏi 'Làm gì?' trong câu 'Bạn Lucas tưới cây ngoài sân' là gì?", "Tưới cây ngoài sân", "Bạn Lucas", "Ngoài sân", "Cây", 0], ["Tiếng Anh", "Phòng 'bedroom' trong nhà là phòng nào?", "Phòng bếp", "Phòng ngủ", "Phòng ăn", "Sân vườn", 1], ["TNXH", "Hành động nào giúp tiết kiệm điện ở nhà?", "Bật tivi cả ngày không xem", "Mở tủ lạnh liên tục", "Tắt đèn, quạt khi ra khỏi phòng", "Bật đèn giữa trưa nắng", 2], ["Tiếng Việt", "Câu 'Ôi, bông hoa hồng này đẹp quá!' thuộc kiểu câu gì?", "Câu hỏi", "Câu khiến", "Câu kể", "Câu cảm", 3]], "c1": [["Toán", "Tính: 10 + 2 = ?", "13", "11", "12", "14", 2], ["Toán", "Tính: 14 - 2 = ?", "13", "11", "14", "12", 3], ["Toán", "Tính nhẩm: 10 + 20 = ?", "30", "40", "20", "50", 0], ["Toán", "Tính nhẩm: 50 - 10 = ?", "50", "40", "30", "60", 1], ["Toán", "Số gồm 1 chục và 1 đơn vị là số nào?", "12", "10", "11", "13", 2], ["TNXH", "Đèn ông sao và bánh nướng có vào dịp nào?", "Tết Nguyên Đán", "Mùa xuân", "Ngày lạnh", "Tết Trung Thu", 3], ["Tiếng Việt", "Con vật nào sống dưới nước và biết bơi?", "Con cá", "Con gà", "Con mèo", "Con chim sẻ", 0], ["Tiếng Anh", "Con lợn tiếng Anh là gì?", "bird", "pig", "fish", "bee", 1], ["TNXH", "Mỗi tối trước khi đi ngủ, bé cần làm gì cho răng khỏe?", "Ăn thật nhiều kẹo", "Uống nước ngọt", "Đánh răng sạch sẽ", "Không súc miệng", 2], ["Tiếng Việt", "Con vật nào có vòi dài và tai to?", "Con chuột", "Con thỏ", "Con gà", "Con voi", 3]]}, {"ten": "Chuyến Tàu Tốc Hành", "tg": 22, "c3": [["Toán", "Tính tích: 8 x 4 = ?", "32", "40", "24", "34", 0], ["Toán", "Tính thương: 81 : 9 = ?", "10", "9", "8", "11", 1], ["Toán", "Tính tổng: 372 + 259 = ?", "641", "621", "631", "731", 2], ["Toán", "Tìm x biết: x + 337 = 806", "479", "459", "470", "469", 3], ["Toán", "Gấp 23 lên 3 lần ta được số nào?", "69", "72", "66", "79", 0], ["Tiếng Anh", "Đồ ăn 'chicken' là món gì?", "Cá", "Thịt gà", "Bánh mì", "Trứng", 1], ["TNXH", "Loại rác nào có thể tái chế thành sản phẩm mới?", "Thức ăn thừa ôi thiu", "Vỏ trái cây thối", "Giấy vụn, chai nhựa sạch, lon nhôm", "Lá cây khô mục", 2], ["Tiếng Việt", "Câu 'Em hãy giữ gìn sách vở cẩn thận nhé!' thuộc kiểu câu gì?", "Câu hỏi", "Câu cảm", "Câu kể", "Câu khiến", 3], ["Tiếng Anh", "Đồ uống 'orange juice' là gì?", "Nước ép cam", "Sữa tươi", "Nước lọc", "Trà nóng", 0], ["TNXH", "Để bảo vệ mắt khi học bài, em cần ngồi thế nào?", "Nằm sấp đọc sách", "Ngồi thẳng lưng, đủ ánh sáng, mắt cách vở 25–30 cm", "Cúi sát mặt xuống bàn", "Đọc sách trong phòng tối", 1]], "c1": [["Toán", "Tính: 11 + 3 = ?", "14", "15", "13", "16", 0], ["Toán", "Tính: 15 - 3 = ?", "13", "12", "11", "14", 1], ["Toán", "Tính nhẩm: 20 + 30 = ?", "60", "40", "50", "70", 2], ["Toán", "Tính nhẩm: 60 - 20 = ?", "50", "30", "60", "40", 3], ["Toán", "Số gồm 1 chục và 2 đơn vị là số nào?", "12", "13", "11", "14", 0], ["Tiếng Anh", "Con bò tiếng Anh là gì?", "cat", "cow", "duck", "hen", 1], ["TNXH", "Khi muốn sang đường, bé cần làm gì?", "Tự chạy vọt qua đường", "Vừa đi vừa đá bóng", "Nắm tay người lớn và đi đúng vạch kẻ", "Nhắm mắt đi", 2], ["Tiếng Việt", "Con vật nào có cổ rất cao?", "Con vịt", "Con mèo", "Con lợn", "Hươu cao cổ", 3], ["Tiếng Anh", "Con ong tiếng Anh là gì?", "bee", "pig", "dog", "fox", 0], ["TNXH", "Đồ vật nào nguy hiểm, bé không được tự nghịch?", "Gấu bông", "Bật lửa và ổ cắm điện", "Bút sáp màu", "Quyển truyện tranh", 1]]}, {"ten": "Lâu Đài Sách Hay", "tg": 19, "c3": [["Toán", "Tính tích: 9 x 5 = ?", "54", "36", "45", "47", 2], ["Toán", "Tính thương: 18 : 6 = ?", "4", "2", "5", "3", 3], ["Toán", "Tính tổng: 399 + 278 = ?", "677", "687", "667", "777", 0], ["Toán", "Tìm x biết: x + 354 = 827", "483", "473", "463", "474", 1], ["Toán", "Gấp 25 lên 4 lần ta được số nào?", "104", "96", "100", "110", 2], ["Tiếng Việt", "Câu 'Hôm nay bạn có đi học không?' thuộc kiểu câu gì?", "Câu kể", "Câu cảm", "Câu khiến", "Câu hỏi", 3], ["Tiếng Anh", "Con vật 'rabbit' là con gì?", "Con thỏ", "Con vẹt", "Con mèo", "Con cá vàng", 0], ["TNXH", "Động vật nào sau đây đẻ trứng?", "Con mèo", "Con gà", "Con chó", "Con bò", 1], ["Tiếng Việt", "Từ nào chỉ người thân trong gia đình?", "Thầy giáo", "Hàng xóm", "Ông bà", "Bác sĩ", 2], ["Tiếng Anh", "Con vật 'parrot' là con gì?", "Con chó", "Con thỏ", "Con vịt", "Con vẹt", 3]], "c1": [["Toán", "Tính: 12 + 4 = ?", "17", "15", "16", "18", 2], ["Toán", "Tính: 16 - 4 = ?", "13", "11", "14", "12", 3], ["Toán", "Tính nhẩm: 30 + 40 = ?", "70", "80", "60", "90", 0], ["Toán", "Tính nhẩm: 70 - 30 = ?", "50", "40", "30", "60", 1], ["Toán", "Số gồm 1 chục và 3 đơn vị là số nào?", "14", "12", "13", "15", 2], ["Tiếng Việt", "Đồ vật nào dùng để viết chữ vào vở?", "Cái bát", "Cái gối", "Đôi dép", "Cái bút", 3], ["Tiếng Anh", "Quả chuối tiếng Anh là gì?", "banana", "apple", "cake", "milk", 0], ["TNXH", "Nước nào uống an toàn cho sức khỏe?", "Nước ao hồ", "Nước đun sôi để nguội hoặc nước lọc sạch", "Nước mưa ngoài sân", "Nước xà phòng", 1], ["Tiếng Việt", "Đồ vật nào dùng để tẩy nét bút chì sai?", "Thước kẻ", "Cái thìa", "Cục tẩy", "Cái kéo", 2], ["Tiếng Anh", "Quả cam tiếng Anh là gì?", "apple", "bread", "egg", "orange", 3]]}, {"ten": "Phòng Thí Nghiệm Nhí", "tg": 19, "c3": [["Toán", "Tính tích: 6 x 6 = ?", "36", "42", "30", "38", 0], ["Toán", "Tính thương: 28 : 7 = ?", "5", "4", "3", "6", 1], ["Toán", "Tính tổng: 426 + 297 = ?", "733", "713", "723", "823", 2], ["Toán", "Tìm x biết: x + 371 = 848", "487", "467", "478", "477", 3], ["Toán", "Gấp 27 lên 5 lần ta được số nào?", "135", "140", "130", "145", 0], ["TNXH", "Động vật nào sau đây thuộc lớp cá và thở bằng mang?", "Cá voi", "Cá chép", "Ếch", "Rùa", 1], ["Tiếng Việt", "Từ nào không cùng nhóm với các từ còn lại: bút chì, thước kẻ, tẩy, quả táo?", "Bút chì", "Thước kẻ", "Quả táo", "Tẩy", 2], ["Tiếng Anh", "Đồ chơi 'kite' là món gì?", "Ô tô đồ chơi", "Búp bê", "Tàu hỏa", "Cái diều", 3], ["TNXH", "Mùa nào ở miền Bắc nước ta thường có thời tiết lạnh nhất?", "Mùa đông", "Mùa hạ", "Mùa xuân", "Mùa thu", 0], ["Tiếng Việt", "Từ nào không cùng nhóm: mùa xuân, mùa hạ, mùa thu, buổi sáng?", "Mùa xuân", "Buổi sáng", "Mùa hạ", "Mùa thu", 1]], "c1": [["Toán", "Tính: 13 + 5 = ?", "18", "19", "17", "20", 0], ["Toán", "Tính: 17 - 5 = ?", "13", "12", "11", "14", 1], ["Toán", "Tính nhẩm: 40 + 50 = ?", "100", "80", "90", "110", 2], ["Toán", "Tính nhẩm: 80 - 40 = ?", "50", "30", "60", "40", 3], ["Toán", "Số gồm 1 chục và 4 đơn vị là số nào?", "14", "15", "13", "16", 0], ["TNXH", "Nên ngủ đủ giấc để cơ thể thế nào?", "Mệt mỏi", "Khỏe mạnh và lớn nhanh", "Buồn ngủ ở lớp", "Đau bụng", 1], ["Tiếng Việt", "Đồ vật nào dùng để kẻ đường thẳng?", "Cục tẩy", "Quyển sách", "Thước kẻ", "Cái cốc", 2], ["Tiếng Anh", "Quả trứng tiếng Anh là gì?", "milk", "cake", "fish", "egg", 3], ["TNXH", "Ai là người dạy dỗ em ở trường học?", "Thầy cô giáo", "Chú lái tàu", "Cô bán hoa", "Chú công nhân", 0], ["Tiếng Việt", "Đồ vật nào dùng để xem giờ?", "Cái quạt", "Đồng hồ", "Cái bàn", "Đôi giày", 1]]}, {"ten": "Đỉnh Đồi Ngôi Sao", "tg": 19, "c3": [["Toán", "Giá trị biểu thức 18 + 5 x 6 là bao nhiêu?", "58", "38", "48", "54", 2], ["Toán", "Giá trị biểu thức (15 + 6) : 3 là bao nhiêu?", "8", "6", "9", "7", 3], ["Toán", "Chu vi hình vuông có cạnh 6 cm là bao nhiêu?", "24 cm", "28 cm", "20 cm", "26 cm", 0], ["Toán", "Chu vi hình chữ nhật dài 10 cm, rộng 5 cm là bao nhiêu?", "32 cm", "30 cm", "28 cm", "34 cm", 1], ["Toán", "Số dư của phép chia 26 : 6 là bao nhiêu?", "3", "1", "2", "4", 2], ["Tiếng Anh", "Đồ chơi 'ship' là món gì?", "Máy bay", "Xe tải", "Quả bóng", "Con tàu thủy", 3], ["TNXH", "Khi đi xe máy cùng bố mẹ, em bắt buộc phải làm gì để an toàn?", "Đội mũ bảo hiểm cài quai đúng quy cách", "Đứng lên trên yên xe", "Bỏ hai tay ra hai bên", "Quay ngược mặt về phía sau", 0], ["Tiếng Việt", "Trong câu 'Cánh đồng lúa chín vàng ươm', từ chỉ đặc điểm là từ nào?", "Cánh đồng", "Vàng ươm", "Lúa", "Chín", 1], ["Tiếng Anh", "Câu 'What are you doing?' hỏi về điều gì?", "Bạn tên là gì?", "Bạn bao nhiêu tuổi?", "Bạn đang làm gì?", "Bạn sống ở đâu?", 2], ["TNXH", "Loài cây nào là biểu tượng quen thuộc của ngày Tết miền Bắc?", "Hoa phượng", "Hoa bằng lăng", "Hoa sữa", "Hoa đào", 3]], "c1": [["Toán", "Tính: 14 + 3 = ?", "18", "16", "17", "19", 2], ["Toán", "Tính: 18 - 3 = ?", "16", "14", "17", "15", 3], ["Toán", "Tính nhẩm: 20 + 40 = ?", "60", "70", "50", "80", 0], ["Toán", "Tính nhẩm: 90 - 50 = ?", "50", "40", "30", "60", 1], ["Toán", "Số gồm 1 chục và 5 đơn vị là số nào?", "16", "14", "15", "17", 2], ["Tiếng Anh", "Sữa tiếng Anh là gì?", "water", "egg", "apple", "milk", 3], ["TNXH", "Khi ốm hoặc sốt, em cần gặp ai để khám bệnh?", "Bác sĩ", "Đầu bếp", "Họa sĩ", "Ca sĩ", 0], ["Tiếng Việt", "Đồ vật nào dùng để che mưa, che nắng?", "Cái lược", "Cái ô", "Cái bát", "Cục tẩy", 1], ["Tiếng Anh", "Nước lọc tiếng Anh là gì?", "milk", "cake", "water", "rice", 2], ["TNXH", "Ai là người trồng lúa tạo ra hạt gạo?", "Phi công", "Nhạc sĩ", "Thủ thư", "Bác nông dân", 3]]}, {"ten": "Thung Lũng Biểu Thức", "tg": 19, "c3": [["Toán", "Giá trị biểu thức 21 + 6 x 7 là bao nhiêu?", "63", "73", "53", "70", 0], ["Toán", "Giá trị biểu thức (18 + 6) : 3 là bao nhiêu?", "9", "8", "7", "10", 1], ["Toán", "Chu vi hình vuông có cạnh 7 cm là bao nhiêu?", "32 cm", "24 cm", "28 cm", "30 cm", 2], ["Toán", "Chu vi hình chữ nhật dài 11 cm, rộng 6 cm là bao nhiêu?", "36 cm", "32 cm", "38 cm", "34 cm", 3], ["Toán", "Số dư của phép chia 38 : 7 là bao nhiêu?", "3", "4", "2", "5", 0], ["Tiếng Việt", "Thành ngữ 'Chị ngã em nâng' khuyên chúng ta điều gì?", "Đi đường cẩn thận", "Anh chị em yêu thương, giúp đỡ nhau", "Tập thể dục mỗi sáng", "Học thuộc bảng cửu chương", 1], ["Tiếng Anh", "Động từ 'cycling' có nghĩa là gì?", "Bơi lội", "Vẽ tranh", "Đạp xe đạp", "Nghe nhạc", 2], ["TNXH", "Hành động nào giúp bảo vệ nguồn nước sạch?", "Đổ nước thải ra mương", "Xả vòi nước chảy tràn", "Vứt túi ni-lông xuống biển", "Không vứt rác xuống ao, hồ, sông suối", 3], ["Tiếng Việt", "Tục ngữ 'Uống nước nhớ nguồn' nhắc nhở điều gì?", "Biết ơn ông bà, cha mẹ và người đi trước", "Uống đủ nước mỗi ngày", "Tiết kiệm nước sạch", "Bảo vệ sông ngòi", 0], ["Tiếng Anh", "Động từ 'skating' có nghĩa là gì?", "Nhảy dây", "Trượt pa-tanh", "Đọc sách", "Hát", 1]], "c1": [["Toán", "Tính: 15 + 4 = ?", "19", "20", "18", "21", 0], ["Toán", "Tính: 19 - 4 = ?", "16", "15", "14", "17", 1], ["Toán", "Tính nhẩm: 30 + 50 = ?", "90", "70", "80", "100", 2], ["Toán", "Tính nhẩm: 70 - 20 = ?", "60", "40", "70", "50", 3], ["Toán", "Số gồm 1 chục và 6 đơn vị là số nào?", "16", "17", "15", "18", 0], ["Tiếng Việt", "Quả nào có vỏ màu vàng, ăn rất thơm ngọt?", "Quả cà tím", "Quả chuối", "Củ cải trắng", "Quả ớt", 1], ["Tiếng Anh", "Cái bánh ngọt tiếng Anh là gì?", "book", "pen", "cake", "bag", 2], ["TNXH", "Phương tiện nào bay trên bầu trời?", "Tàu thủy", "Xe đạp", "Ô tô", "Máy bay", 3], ["Tiếng Việt", "Quả nào có vỏ xanh, ruột đỏ, nhiều hạt đen?", "Quả dưa hấu", "Quả chanh", "Quả chuối", "Quả lê", 0], ["Tiếng Anh", "Cây bút mực tiếng Anh là gì?", "book", "pen", "bag", "ball", 1]]}, {"ten": "Con Đường Lịch Sử", "tg": 19, "c3": [["Toán", "Giá trị biểu thức 24 + 7 x 8 là bao nhiêu?", "90", "70", "80", "88", 2], ["Toán", "Giá trị biểu thức (21 + 6) : 3 là bao nhiêu?", "10", "8", "11", "9", 3], ["Toán", "Chu vi hình vuông có cạnh 8 cm là bao nhiêu?", "32 cm", "36 cm", "28 cm", "34 cm", 0], ["Toán", "Chu vi hình chữ nhật dài 12 cm, rộng 7 cm là bao nhiêu?", "40 cm", "38 cm", "36 cm", "42 cm", 1], ["Toán", "Số dư của phép chia 52 : 8 là bao nhiêu?", "5", "3", "4", "6", 2], ["TNXH", "Nên đánh răng ít nhất mấy lần mỗi ngày?", "1 lần mỗi tuần", "Chỉ khi đau răng", "Không cần đánh răng", "2 lần (sáng sau khi ngủ dậy và tối trước khi đi ngủ)", 3], ["Tiếng Việt", "Câu tục ngữ 'Gần mực thì đen, gần đèn thì sáng' nói về điều gì?", "Ảnh hưởng của môi trường và bạn bè xung quanh", "Cách giữ tay sạch khi viết", "Cách bật đèn học bài", "Màu sắc của mực viết", 0], ["Tiếng Anh", "Động từ 'cooking' có nghĩa là gì?", "Rửa bát", "Nấu ăn", "Quét nhà", "Trồng cây", 1], ["TNXH", "Khi qua đường có đèn tín hiệu, người đi bộ đi khi đèn dành cho người đi bộ có màu gì?", "Màu đỏ", "Màu vàng", "Màu xanh", "Khi đèn tắt", 2], ["Tiếng Việt", "Từ nào viết đúng chính tả?", "Ngỉ ngơi", "Nghĩ ngơi", "Ngĩ ngơi", "Nghỉ ngơi", 3]], "c1": [["Toán", "Tính: 12 + 6 = ?", "19", "17", "18", "20", 2], ["Toán", "Tính: 17 - 6 = ?", "12", "10", "13", "11", 3], ["Toán", "Tính nhẩm: 10 + 60 = ?", "70", "80", "60", "90", 0], ["Toán", "Tính nhẩm: 80 - 30 = ?", "60", "50", "40", "70", 1], ["Toán", "Số gồm 1 chục và 7 đơn vị là số nào?", "18", "16", "17", "19", 2], ["TNXH", "Phương tiện nào chạy trên mặt nước?", "Máy bay", "Xe máy", "Tàu hỏa", "Tàu thủy", 3], ["Tiếng Việt", "Từ nào viết đúng: 'bông hoa' hay 'pông hoa'?", "bông hoa", "pông hoa", "bông hỏa", "pông hỏa", 0], ["Tiếng Anh", "Cây bút chì tiếng Anh là gì?", "desk", "pencil", "chair", "hat", 1], ["TNXH", "Phương tiện nào chạy trên đường ray?", "Xe đạp", "Thuyền buồm", "Tàu hỏa", "Máy bay", 2], ["Tiếng Việt", "Từ nào viết đúng: 'ngôi sao' hay 'ngôi xao'?", "ngôi xao", "gôi sao", "ngôi sảo", "ngôi sao", 3]]}, {"ten": "Vườn Ươm Tài Năng", "tg": 19, "c3": [["Toán", "Giá trị biểu thức 27 + 8 x 5 là bao nhiêu?", "67", "77", "57", "72", 0], ["Toán", "Giá trị biểu thức (24 + 6) : 3 là bao nhiêu?", "11", "10", "9", "12", 1], ["Toán", "Chu vi hình vuông có cạnh 9 cm là bao nhiêu?", "40 cm", "32 cm", "36 cm", "38 cm", 2], ["Toán", "Chu vi hình chữ nhật dài 13 cm, rộng 4 cm là bao nhiêu?", "36 cm", "32 cm", "38 cm", "34 cm", 3], ["Toán", "Số dư của phép chia 36 : 5 là bao nhiêu?", "1", "2", "0", "3", 0], ["Tiếng Anh", "Trả lời 'How old is your brother?' (6 tuổi), câu nào đúng?", "She is six years old.", "He is six years old.", "They are six years old.", "I am six years old.", 1], ["TNXH", "Ngày Nhà giáo Việt Nam là ngày nào hằng năm?", "1 tháng 6", "2 tháng 9", "20 tháng 11", "8 tháng 3", 2], ["Tiếng Việt", "Từ nào viết đúng chính tả?", "Dữ dìn", "Rữ rìn", "Giữ dìn", "Giữ gìn", 3], ["Tiếng Anh", "Chọn câu đúng ngữ pháp: 'My mother ___ a nurse.'", "is", "am", "are", "be", 0], ["TNXH", "Ngày Quốc tế Thiếu nhi là ngày nào hằng năm?", "20 tháng 11", "1 tháng 6", "19 tháng 5", "1 tháng 5", 1]], "c1": [["Toán", "Tính: 11 + 7 = ?", "18", "19", "17", "20", 0], ["Toán", "Tính: 18 - 5 = ?", "14", "13", "12", "15", 1], ["Toán", "Tính nhẩm: 20 + 70 = ?", "100", "80", "90", "110", 2], ["Toán", "Tính nhẩm: 90 - 40 = ?", "60", "40", "70", "50", 3], ["Toán", "Số gồm 1 chục và 8 đơn vị là số nào?", "18", "19", "17", "20", 0], ["Tiếng Anh", "Cái cặp sách tiếng Anh là gì?", "ball", "bag", "car", "cup", 1], ["TNXH", "Khi chơi xong đồ chơi ở nhà, bé nên làm gì?", "Vứt khắp sàn nhà", "Đá ra ngoài cửa", "Cất gọn gàng vào giỏ", "Để mẹ dọn hộ", 2], ["Tiếng Việt", "Từ nào viết đúng: 'mặt trời' hay 'mặt chời'?", "mặt chời", "mặc trời", "mặc chời", "mặt trời", 3], ["Tiếng Anh", "Quả bóng tiếng Anh là gì?", "ball", "book", "bed", "box", 0], ["TNXH", "Khi ra khỏi phòng không có ai, bé nên làm gì?", "Bật hết đèn lên", "Tắt đèn và quạt", "Mở cửa sổ thật to", "Bật tivi thật to", 1]]}, {"ten": "Sân Khấu Ánh Sáng", "tg": 16, "c3": [["Toán", "Giá trị biểu thức 30 + 4 x 6 là bao nhiêu?", "64", "44", "54", "60", 2], ["Toán", "Giá trị biểu thức (27 + 6) : 3 là bao nhiêu?", "12", "10", "13", "11", 3], ["Toán", "Chu vi hình vuông có cạnh 10 cm là bao nhiêu?", "40 cm", "44 cm", "36 cm", "42 cm", 0], ["Toán", "Chu vi hình chữ nhật dài 14 cm, rộng 5 cm là bao nhiêu?", "40 cm", "38 cm", "36 cm", "42 cm", 1], ["Toán", "Số dư của phép chia 49 : 6 là bao nhiêu?", "2", "0", "1", "3", 2], ["Tiếng Việt", "Biện pháp nhân hóa trong câu 'Chú gà trống gọi ông mặt trời dậy' là gì?", "So sánh gà với mặt trời", "Tả màu sắc của gà", "Kể tên các con vật", "Gọi gà là chú, mặt trời là ông và biết gọi dậy", 3], ["Tiếng Anh", "Chọn từ đúng: 'I have two ___.' (2 quyển vở)", "notebooks", "notebook", "a notebook", "book", 0], ["TNXH", "Cơ quan nào giúp nghiền nát và tiêu hóa thức ăn thành chất dinh dưỡng?", "Cơ quan hô hấp", "Cơ quan tiêu hóa", "Cơ quan thần kinh", "Cơ quan tuần hoàn", 1], ["Tiếng Việt", "Câu nào dưới đây có hình ảnh so sánh?", "Hôm nay trời nắng ấm", "Em đi học lúc 7 giờ", "Tiếng suối trong như tiếng hát xa", "Mẹ mua cho em chiếc cặp mới", 2], ["Tiếng Anh", "Câu 'Where is the living room?' hỏi gì?", "Phòng khách có đẹp không?", "Phòng khách màu gì?", "Ai ở trong phòng khách?", "Phòng khách ở đâu?", 3]], "c1": [["Toán", "Tính: 13 + 6 = ?", "20", "18", "19", "21", 2], ["Toán", "Tính: 19 - 7 = ?", "13", "11", "14", "12", 3], ["Toán", "Tính nhẩm: 40 + 40 = ?", "80", "90", "70", "100", 0], ["Toán", "Tính nhẩm: 60 - 30 = ?", "40", "30", "20", "50", 1], ["Toán", "Số gồm 1 chục và 9 đơn vị là số nào?", "20", "18", "19", "21", 2], ["Tiếng Việt", "Từ nào viết đúng: 'trường học' hay 'chường học'?", "chường học", "trường hộc", "chường hộc", "trường học", 3], ["Tiếng Anh", "Chiếc ô tô tiếng Anh là gì?", "car", "bus", "cat", "cup", 0], ["TNXH", "Loại quả nào có nhiều nước, uống rất mát?", "Củ khoai", "Quả dừa", "Hạt đậu", "Củ lạc", 1], ["Tiếng Việt", "Từ nào viết đúng: 'bàn ghế' hay 'pàn ghế'?", "pàn ghế", "bàn gế", "bàn ghế", "pàn gế", 2], ["Tiếng Anh", "Cái mũ tiếng Anh là gì?", "cat", "mat", "bat", "hat", 3]]}, {"ten": "Bến Đỗ Vinh Quang", "tg": 16, "c3": [["Toán", "Giá trị biểu thức 33 + 5 x 7 là bao nhiêu?", "68", "78", "58", "75", 0], ["Toán", "Giá trị biểu thức (30 + 6) : 3 là bao nhiêu?", "13", "12", "11", "14", 1], ["Toán", "Chu vi hình vuông có cạnh 11 cm là bao nhiêu?", "48 cm", "40 cm", "44 cm", "46 cm", 2], ["Toán", "Chu vi hình chữ nhật dài 15 cm, rộng 6 cm là bao nhiêu?", "44 cm", "40 cm", "46 cm", "42 cm", 3], ["Toán", "Số dư của phép chia 64 : 7 là bao nhiêu?", "1", "2", "0", "3", 0], ["TNXH", "Khi trời có sấm sét ngoài trời, ta tuyệt đối không nên làm gì?", "Vào trong nhà kín an toàn", "Trú mưa dưới gốc cây to", "Tránh xa cột điện cao thế", "Tắt các thiết bị điện không cần thiết", 1], ["Tiếng Việt", "Từ nào chỉ đồ dùng học tập?", "Cái chảo", "Chiếc gối", "Compa", "Bàn chải", 2], ["Tiếng Anh", "Từ trái nghĩa với 'big' (to lớn) là gì?", "tall", "long", "old", "small", 3], ["TNXH", "Con vật nào có ích giúp nhà nông bắt chuột bảo vệ mùa màng?", "Con mèo", "Con muỗi", "Con ruồi", "Con gián", 0], ["Tiếng Việt", "Từ nào chỉ nghề nghiệp?", "Trường học", "Kỹ sư", "Bệnh viện", "Thư viện", 1]], "c1": [["Toán", "Tính: 16 + 3 = ?", "19", "20", "18", "21", 0], ["Toán", "Tính: 16 - 5 = ?", "12", "11", "10", "13", 1], ["Toán", "Tính nhẩm: 30 + 60 = ?", "100", "80", "90", "110", 2], ["Toán", "Tính nhẩm: 90 - 20 = ?", "80", "60", "90", "70", 3], ["Toán", "Số gồm 2 chục và 0 đơn vị là số nào?", "20", "21", "19", "22", 0], ["TNXH", "Con vật nào biết bay trên trời?", "Con cá", "Con chim", "Con rùa", "Con lợn", 1], ["Tiếng Việt", "Từ nào có vần 'an'?", "Cái cốc", "Con mèo", "Bàn học", "Cây tre", 2], ["Tiếng Anh", "Mặt trời tiếng Anh là gì?", "moon", "star", "sky", "sun", 3], ["TNXH", "Con vật nào có cái mai cứng trên lưng?", "Con rùa", "Con mèo", "Con gà", "Con thỏ", 0], ["Tiếng Việt", "Từ nào có vần 'ông'?", "Quả cam", "Bông hoa", "Cái bút", "Con cá", 1]]}, {"ten": "Đài Quan Sát Vũ Trụ", "tg": 16, "c3": [["Toán", "Giá trị biểu thức 36 + 6 x 8 là bao nhiêu?", "94", "74", "84", "92", 2], ["Toán", "Giá trị biểu thức (33 + 6) : 3 là bao nhiêu?", "14", "12", "15", "13", 3], ["Toán", "Chu vi hình vuông có cạnh 12 cm là bao nhiêu?", "48 cm", "52 cm", "44 cm", "50 cm", 0], ["Toán", "Chu vi hình chữ nhật dài 16 cm, rộng 7 cm là bao nhiêu?", "48 cm", "46 cm", "44 cm", "50 cm", 1], ["Toán", "Số dư của phép chia 81 : 8 là bao nhiêu?", "2", "0", "1", "3", 2], ["Tiếng Anh", "Từ trái nghĩa với 'new' (mới) là gì?", "young", "short", "nice", "old", 3], ["TNXH", "Việt Nam nằm ở châu lục nào?", "Châu Á", "Châu Âu", "Châu Phi", "Châu Mỹ", 0], ["Tiếng Việt", "Từ nào chỉ hoạt động học tập?", "Đá cầu", "Thảo luận nhóm", "Nấu cơm", "Tưới hoa", 1], ["Tiếng Anh", "Thời tiết 'sunny' nghĩa là trời thế nào?", "Trời mưa", "Trời có gió", "Trời nắng", "Trời có mây", 2], ["TNXH", "Thủ đô của nước Việt Nam là thành phố nào?", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Hà Nội", 3]], "c1": [["Toán", "Tính: 24 + 21 = ?", "55", "35", "45", "46", 2], ["Toán", "Tính: 58 - 23 = ?", "45", "25", "36", "35", 3], ["Toán", "Số gồm 3 chục và 3 đơn vị là số nào?", "33", "43", "23", "34", 0], ["Toán", "Băng giấy dài 12 cm, nối thêm 4 cm thì dài mấy cm?", "17 cm", "16 cm", "15 cm", "18 cm", 1], ["Toán", "Trong rổ có 22 quả bóng, thêm 20 quả nữa. Có tất cả mấy quả?", "52 quả", "32 quả", "42 quả", "43 quả", 2], ["Tiếng Anh", "Mặt trăng tiếng Anh là gì?", "sun", "tree", "rain", "moon", 3], ["TNXH", "Lá cây khỏe mạnh thường có màu gì?", "Màu xanh lá", "Màu tím", "Màu đen", "Màu xanh dương", 0], ["Tiếng Việt", "Từ nào có vần 'anh'?", "Cái bát", "Bánh chưng", "Con gà", "Quyển vở", 1], ["Tiếng Anh", "Ngôi sao tiếng Anh là gì?", "sun", "car", "star", "hat", 2], ["TNXH", "Mây trên trời nắng đẹp thường có màu gì?", "Màu đỏ", "Màu xanh lá", "Màu tím", "Màu trắng", 3]]}, {"ten": "Học Viện Thông Thái", "tg": 16, "c3": [["Toán", "Giá trị biểu thức 39 + 7 x 5 là bao nhiêu?", "74", "84", "64", "79", 0], ["Toán", "Giá trị biểu thức (36 + 6) : 3 là bao nhiêu?", "15", "14", "13", "16", 1], ["Toán", "Chu vi hình vuông có cạnh 13 cm là bao nhiêu?", "56 cm", "48 cm", "52 cm", "54 cm", 2], ["Toán", "Chu vi hình chữ nhật dài 17 cm, rộng 4 cm là bao nhiêu?", "44 cm", "40 cm", "46 cm", "42 cm", 3], ["Toán", "Số dư của phép chia 56 : 5 là bao nhiêu?", "1", "2", "0", "3", 0], ["Tiếng Việt", "Từ nào viết đúng chính tả?", "Nấp nánh", "Lấp lánh", "Lấp nánh", "Nấp lánh", 1], ["Tiếng Anh", "Thời tiết 'rainy' nghĩa là trời thế nào?", "Trời nắng", "Trời tuyết", "Trời mưa", "Trời ấm", 2], ["TNXH", "Màu nền của lá cờ Tổ quốc Việt Nam là màu gì?", "Màu xanh, ngôi sao trắng", "Màu vàng, ngôi sao đỏ", "Màu trắng, ngôi sao xanh", "Màu đỏ, ở giữa có ngôi sao vàng năm cánh", 3], ["Tiếng Anh", "Con vật 'elephant' là con gì?", "Con hổ", "Con voi", "Con khỉ", "Con công", 1]], "c1": [["Toán", "Tính: 27 + 32 = ?", "59", "69", "49", "60", 0], ["Toán", "Tính: 61 - 31 = ?", "40", "30", "20", "31", 1], ["Toán", "Số gồm 4 chục và 6 đơn vị là số nào?", "56", "36", "46", "47", 2], ["Toán", "Băng giấy dài 13 cm, nối thêm 5 cm thì dài mấy cm?", "19 cm", "17 cm", "20 cm", "18 cm", 3], ["Toán", "Trong rổ có 24 quả bóng, thêm 30 quả nữa. Có tất cả mấy quả?", "54 quả", "64 quả", "44 quả", "55 quả", 0], ["Tiếng Việt", "Từ nào có vần 'oi'?", "Con mèo", "Con voi", "Con cá", "Con vịt", 1], ["Tiếng Anh", "Cái cây tiếng Anh là gì?", "flower", "grass", "tree", "leaf", 2], ["TNXH", "Bé học lớp 1 ở bậc học nào?", "Mầm non", "Đại học", "Trung học", "Tiểu học", 3], ["Tiếng Việt", "Từ nào có vần 'ao'?", "Ngôi sao", "Cái bàn", "Quả cam", "Đôi dép", 0], ["Tiếng Anh", "Bông hoa tiếng Anh là gì?", "tree", "flower", "star", "bird", 1]]}, {"ten": "Cung Điện Diện Tích", "tg": 16, "c3": [["Toán", "Diện tích hình chữ nhật dài 8 cm, rộng 5 cm là bao nhiêu?", "48 cm²", "32 cm²", "40 cm²", "42 cm²", 2], ["Toán", "Tính tổng: 1550 + 1325 = ?", "2975", "2775", "2885", "2875", 3], ["Toán", "Tính hiệu: 7700 - 2500 = ?", "5200", "5300", "5100", "5250", 0], ["Toán", "Tính tích: 125 x 4 = ?", "510", "500", "490", "504", 1], ["Toán", "Có 4 hộp bánh, mỗi hộp 7 chiếc. Đã ăn 5 chiếc. Còn lại bao nhiêu chiếc bánh?", "25 chiếc", "21 chiếc", "23 chiếc", "27 chiếc", 2], ["TNXH", "Loài hoa nào thường nở đỏ rực vào mùa hè trên sân trường?", "Hoa đào", "Hoa mai", "Hoa cúc họa mi", "Hoa phượng", 3], ["Tiếng Việt", "Trong câu 'Chú chim sẻ hót líu lo trên cành bưởi', bộ phận trả lời câu hỏi 'Ở đâu?' là gì?", "Trên cành bưởi", "Chú chim sẻ", "Hót líu lo", "Cành bưởi", 0], ["Tiếng Anh", "Con vật 'monkey' là con gì?", "Con gấu", "Con khỉ", "Con ngựa", "Con hươu", 1], ["TNXH", "Khi gặp người bị thương nhẹ chảy máu tay, việc đầu tiên nên làm là gì?", "Bôi đất cát vào vết thương", "Lờ đi không nói ai", "Báo ngay cho người lớn hoặc thầy cô giúp sơ cứu", "Tự ý uống thuốc lạ", 2], ["Tiếng Việt", "Trong câu 'Sáng chủ nhật, hai chị em đi thăm bà ngoại', bộ phận trả lời câu hỏi 'Khi nào?' là gì?", "Hai chị em", "Đi thăm bà ngoại", "Bà ngoại", "Sáng chủ nhật", 3]], "c1": [["Toán", "Tính: 30 + 43 = ?", "83", "63", "73", "74", 2], ["Toán", "Tính: 64 - 12 = ?", "62", "42", "53", "52", 3], ["Toán", "Số gồm 5 chục và 9 đơn vị là số nào?", "59", "69", "49", "60", 0], ["Toán", "Băng giấy dài 14 cm, nối thêm 6 cm thì dài mấy cm?", "21 cm", "20 cm", "19 cm", "22 cm", 1], ["Toán", "Trong rổ có 26 quả bóng, thêm 10 quả nữa. Có tất cả mấy quả?", "46 quả", "26 quả", "36 quả", "37 quả", 2], ["TNXH", "Ngày khai giảng năm học mới ở Việt Nam là ngày nào?", "1 tháng 1", "20 tháng 10", "8 tháng 3", "5 tháng 9", 3], ["Tiếng Việt", "Từ nào có thanh sắc (´)?", "Con cá", "Con gà", "Con thỏ", "Con mèo", 0], ["Tiếng Anh", "Bố tiếng Anh là gì?", "mom", "dad", "cat", "dog", 1], ["TNXH", "Buổi sáng ngủ dậy, bé nên làm gì đầu tiên?", "Xem tivi ngay", "Ăn kẹo ngay", "Đánh răng, rửa mặt và tập thể dục", "Nằm lì trên giường", 2], ["Tiếng Việt", "Từ nào có thanh huyền (`)?", "Con cá", "Con khỉ", "Con ngựa", "Con mèo", 3]]}, {"ten": "Bức Tường Thử Thách", "tg": 16, "c3": [["Toán", "Diện tích hình chữ nhật dài 9 cm, rộng 6 cm là bao nhiêu?", "54 cm²", "63 cm²", "45 cm²", "56 cm²", 0], ["Toán", "Tính tổng: 1900 + 1550 = ?", "3550", "3450", "3350", "3460", 1], ["Toán", "Tính hiệu: 7900 - 2650 = ?", "5350", "5150", "5250", "5300", 2], ["Toán", "Tính tích: 140 x 5 = ?", "710", "690", "705", "700", 3], ["Toán", "Có 5 hộp bánh, mỗi hộp 8 chiếc. Đã ăn 6 chiếc. Còn lại bao nhiêu chiếc bánh?", "34 chiếc", "36 chiếc", "32 chiếc", "38 chiếc", 0], ["Tiếng Anh", "Hoạt động 'singing' có nghĩa là gì?", "Đang múa", "Đang hát", "Đang vẽ", "Đang viết", 1], ["TNXH", "Một năm thường có bao nhiêu tháng?", "10 tháng", "14 tháng", "12 tháng", "8 tháng", 2], ["Tiếng Việt", "Từ nào cùng nghĩa với 'nhanh nhẹn'?", "Chậm chạp", "Lề mề", "Uể oải", "Thoăn thoắt", 3], ["Tiếng Anh", "Hoạt động 'drawing' có nghĩa là gì?", "Đang vẽ", "Đang đọc", "Đang chạy", "Đang bơi", 0], ["TNXH", "Trong một ngày, buổi nào ánh nắng mặt trời gay gắt nhất?", "Buổi sáng sớm", "Buổi trưa", "Buổi chiều muộn", "Buổi tối", 1]], "c1": [["Toán", "Tính: 33 + 14 = ?", "47", "57", "37", "48", 0], ["Toán", "Tính: 67 - 23 = ?", "54", "44", "34", "45", 1], ["Toán", "Số gồm 6 chục và 2 đơn vị là số nào?", "72", "52", "62", "63", 2], ["Toán", "Băng giấy dài 15 cm, nối thêm 3 cm thì dài mấy cm?", "19 cm", "17 cm", "20 cm", "18 cm", 3], ["Toán", "Trong rổ có 28 quả bóng, thêm 20 quả nữa. Có tất cả mấy quả?", "48 quả", "58 quả", "38 quả", "49 quả", 0], ["Tiếng Anh", "Mẹ tiếng Anh là gì?", "dad", "mom", "sun", "pen", 1], ["TNXH", "Ăn nhiều rau xanh và hoa quả giúp bé điều gì?", "Sâu răng", "Đau bụng", "Khỏe mạnh, ít bị ốm", "Mệt mỏi", 2], ["Tiếng Việt", "Từ nào có thanh hỏi (̉)?", "Con cá", "Con gà", "Con voi", "Con thỏ", 3], ["Tiếng Anh", "Lời chào 'Hello' nghĩa là gì?", "Xin chào", "Tạm biệt", "Cảm ơn", "Xin lỗi", 0], ["TNXH", "Khi bị lạc ở siêu thị, bé nhờ ai giúp đỡ?", "Đi theo người lạ", "Cô nhân viên hoặc chú bảo vệ mặc đồng phục", "Chạy ra đường lớn", "Ngồi khóc một mình", 1]]}, {"ten": "Ngọn Tháp Đồng Hồ", "tg": 13, "c3": [["Toán", "Diện tích hình chữ nhật dài 10 cm, rộng 7 cm là bao nhiêu?", "80 cm²", "60 cm²", "70 cm²", "72 cm²", 2], ["Toán", "Tính tổng: 2250 + 1775 = ?", "4125", "3925", "4035", "4025", 3], ["Toán", "Tính hiệu: 8100 - 2800 = ?", "5300", "5400", "5200", "5350", 0], ["Toán", "Tính tích: 155 x 3 = ?", "475", "465", "455", "468", 1], ["Toán", "Có 6 hộp bánh, mỗi hộp 9 chiếc. Đã ăn 7 chiếc. Còn lại bao nhiêu chiếc bánh?", "49 chiếc", "45 chiếc", "47 chiếc", "51 chiếc", 2], ["Tiếng Việt", "Từ nào trái nghĩa với 'thật thà'?", "Trung thực", "Chân thật", "Ngay thẳng", "Gian dối", 3], ["Tiếng Anh", "Từ 'breakfast' là bữa ăn nào trong ngày?", "Bữa sáng", "Bữa trưa", "Bữa tối", "Bữa phụ", 0], ["TNXH", "Động vật nào biết thụ phấn cho hoa và làm mật ngọt?", "Con kiến", "Con ong", "Con nhện", "Con ốc sên", 1], ["Tiếng Việt", "Câu 'Mẹ là ngọn gió của con suốt đời' sử dụng biện pháp gì?", "Câu hỏi", "Liệt kê", "So sánh", "Câu khiến", 2], ["Tiếng Anh", "Từ 'lunch' là bữa ăn nào trong ngày?", "Bữa sáng", "Bữa tối", "Bữa khuya", "Bữa trưa", 3]], "c1": [["Toán", "Tính: 36 + 20 = ?", "66", "46", "56", "57", 2], ["Toán", "Tính: 70 - 30 = ?", "50", "30", "41", "40", 3], ["Toán", "Số gồm 7 chục và 5 đơn vị là số nào?", "75", "85", "65", "76", 0], ["Toán", "Băng giấy dài 16 cm, nối thêm 4 cm thì dài mấy cm?", "21 cm", "20 cm", "19 cm", "22 cm", 1], ["Toán", "Trong rổ có 30 quả bóng, thêm 30 quả nữa. Có tất cả mấy quả?", "70 quả", "50 quả", "60 quả", "61 quả", 2], ["Tiếng Việt", "Từ nào có thanh nặng (.)?", "Con mèo", "Con cá", "Con thỏ", "Con ngựa", 3], ["Tiếng Anh", "Lời chào 'Goodbye' nghĩa là gì?", "Tạm biệt", "Xin chào", "Chúc ngủ ngon", "Cảm ơn", 0], ["TNXH", "Bàn tay sạch giúp phòng tránh bệnh gì?", "Cận thị", "Đau bụng và cảm cúm", "Mỏi chân", "Buồn ngủ", 1], ["Tiếng Việt", "Từ nào trái nghĩa với 'cao'?", "To", "Dài", "Thấp", "Lớn", 2], ["Tiếng Anh", "Đôi mắt tiếng Anh là gì?", "ears", "nose", "hand", "eyes", 3]]}, {"ten": "Đấu Trường Siêu Sao", "tg": 13, "c3": [["Toán", "Diện tích hình chữ nhật dài 11 cm, rộng 8 cm là bao nhiêu?", "88 cm²", "99 cm²", "77 cm²", "90 cm²", 0], ["Toán", "Tính tổng: 2600 + 2000 = ?", "4700", "4600", "4500", "4610", 1], ["Toán", "Tính hiệu: 8300 - 2950 = ?", "5450", "5250", "5350", "5400", 2], ["Toán", "Tính tích: 170 x 4 = ?", "690", "670", "684", "680", 3], ["Toán", "Có 3 hộp bánh, mỗi hộp 6 chiếc. Đã ăn 8 chiếc. Còn lại bao nhiêu chiếc bánh?", "10 chiếc", "12 chiếc", "8 chiếc", "14 chiếc", 0], ["TNXH", "Cây xanh nhả ra khí gì vào ban ngày giúp không khí trong lành?", "Khí khói bụi", "Khí ô-xi", "Khí ga", "Khí thải xe", 1], ["Tiếng Việt", "Từ nào viết đúng chính tả?", "Chân trọng", "Trân chọng", "Trân trọng", "Chân chọng", 2], ["Tiếng Anh", "Từ 'twenty' là số mấy?", "12", "2", "18", "20", 3], ["TNXH", "Trước khi ăn hoa quả tươi, em cần làm gì?", "Rửa thật sạch dưới vòi nước và gọt vỏ nếu cần", "Ăn ngay khi vừa hái ngoài vườn", "Chỉ lau qua bằng tay áo", "Ngâm vào nước xà phòng", 0]], "c1": [["Toán", "Tính: 39 + 30 = ?", "69", "79", "59", "70", 0], ["Toán", "Tính: 73 - 12 = ?", "71", "61", "51", "62", 1], ["Toán", "Số gồm 8 chục và 8 đơn vị là số nào?", "98", "78", "88", "89", 2], ["Toán", "Băng giấy dài 17 cm, nối thêm 5 cm thì dài mấy cm?", "23 cm", "21 cm", "24 cm", "22 cm", 3], ["Toán", "Trong rổ có 32 quả bóng, thêm 10 quả nữa. Có tất cả mấy quả?", "42 quả", "52 quả", "32 quả", "43 quả", 0], ["TNXH", "Khi ho hoặc hắt hơi, bé nên làm gì cho lịch sự?", "Ho thẳng vào mặt bạn", "Che miệng bằng khăn giấy hoặc khuỷu tay", "Không che miệng", "Cười thật to", 1], ["Tiếng Việt", "Từ nào trái nghĩa với 'nóng'?", "Ấm", "Đỏ", "Lạnh", "Sáng", 2], ["Tiếng Anh", "Cái mũi tiếng Anh là gì?", "eyes", "mouth", "foot", "nose", 3], ["TNXH", "Thức ăn nào giúp xương và răng chắc khỏe?", "Sữa và cá", "Kẹo mút", "Nước ngọt", "Khoai tây chiên", 0], ["Tiếng Việt", "Từ nào trái nghĩa với 'nhanh'?", "Vui", "Chậm", "Gần", "Cao", 1]]}, {"ten": "Cổng Vàng Trí Tuệ", "tg": 13, "c3": [["Toán", "Diện tích hình chữ nhật dài 12 cm, rộng 4 cm là bao nhiêu?", "60 cm²", "36 cm²", "48 cm²", "50 cm²", 2], ["Toán", "Tính tổng: 2950 + 2225 = ?", "5275", "5075", "5185", "5175", 3], ["Toán", "Tính hiệu: 8500 - 3100 = ?", "5400", "5500", "5300", "5450", 0], ["Toán", "Tính tích: 185 x 5 = ?", "935", "925", "915", "930", 1], ["Toán", "Có 4 hộp bánh, mỗi hộp 7 chiếc. Đã ăn 9 chiếc. Còn lại bao nhiêu chiếc bánh?", "21 chiếc", "17 chiếc", "19 chiếc", "23 chiếc", 2], ["Tiếng Anh", "Từ 'fifteen' là số mấy?", "5", "14", "50", "15", 3], ["TNXH", "Để phòng bệnh cảm lạnh mùa đông, em nên làm gì?", "Mặc đủ ấm, quàng khăn, uống nước ấm", "Ăn thật nhiều kem lạnh", "Mặc áo cộc ra gió rét", "Đi chân trần trên sàn lạnh", 0], ["Tiếng Việt", "Từ nào chỉ cảm xúc vui mừng?", "Buồn bã", "Hân hoan", "Lo âu", "Giận dữ", 1], ["Tiếng Anh", "Từ 'eighteen' là số mấy?", "8", "16", "18", "80", 2], ["TNXH", "Đồ vật nào sau đây dẫn điện nguy hiểm, không được chọc vào ổ cắm?", "Thước nhựa khô", "Cục tẩy cao su", "Tờ giấy khô", "Chiếc kéo hoặc thìa kim loại", 3]], "c1": [["Toán", "Tính: 42 + 42 = ?", "94", "74", "84", "85", 2], ["Toán", "Tính: 76 - 23 = ?", "63", "43", "54", "53", 3], ["Toán", "Số gồm 2 chục và 1 đơn vị là số nào?", "21", "31", "11", "22", 0], ["Toán", "Băng giấy dài 18 cm, nối thêm 6 cm thì dài mấy cm?", "25 cm", "24 cm", "23 cm", "26 cm", 1], ["Toán", "Trong rổ có 34 quả bóng, thêm 20 quả nữa. Có tất cả mấy quả?", "64 quả", "44 quả", "54 quả", "55 quả", 2], ["Tiếng Anh", "Bàn tay tiếng Anh là gì?", "head", "leg", "ear", "hand", 3], ["TNXH", "Cây lúa cho chúng ta hạt gì để nấu cơm?", "Hạt gạo", "Hạt đỗ xanh", "Hạt lạc", "Hạt ngô", 0], ["Tiếng Việt", "Từ nào trái nghĩa với 'sáng'?", "Đẹp", "Tối", "Sạch", "Mới", 1], ["Tiếng Anh", "Đôi tai tiếng Anh là gì?", "eyes", "nose", "ears", "hand", 2], ["TNXH", "Con ong làm ra thứ gì rất ngọt?", "Sữa tươi", "Nước cam", "Bánh mì", "Mật ong", 3]]}, {"ten": "Đỉnh Cao Bách Khoa", "tg": 13, "c3": [["Toán", "Diện tích hình chữ nhật dài 13 cm, rộng 5 cm là bao nhiêu?", "65 cm²", "78 cm²", "52 cm²", "67 cm²", 0], ["Toán", "Tính tổng: 3300 + 2450 = ?", "5850", "5750", "5650", "5760", 1], ["Toán", "Tính hiệu: 8700 - 3250 = ?", "5550", "5350", "5450", "5500", 2], ["Toán", "Tính tích: 200 x 3 = ?", "610", "590", "603", "600", 3], ["Toán", "Có 5 hộp bánh, mỗi hộp 8 chiếc. Đã ăn 10 chiếc. Còn lại bao nhiêu chiếc bánh?", "30 chiếc", "32 chiếc", "28 chiếc", "34 chiếc", 0], ["Tiếng Việt", "Dấu phẩy (,) trong câu 'Em thích học Toán, Tiếng Việt và Tiếng Anh' dùng để làm gì?", "Kết thúc câu", "Ngăn cách các từ ngữ cùng chức vụ liệt kê", "Báo hiệu câu hỏi", "Thay cho dấu chấm than", 1], ["Tiếng Anh", "Câu 'Would you like some milk?' dùng để làm gì?", "Hỏi giá hộp sữa", "Hỏi màu của sữa", "Mời ai đó uống sữa", "Xin lỗi bạn", 2], ["TNXH", "Con vật nào có thể sống cả trên cạn lẫn dưới nước?", "Con cá vàng", "Con gà", "Con mèo", "Con ếch", 3], ["Tiếng Việt", "Trong câu 'Vì chăm chỉ luyện tập, Lucas đã biết đi xe đạp', bộ phận chỉ nguyên nhân là gì?", "Vì chăm chỉ luyện tập", "Lucas đã biết đi xe đạp", "Đi xe đạp", "Chăm chỉ", 0], ["Tiếng Anh", "Đáp lại lời cảm ơn 'Thank you!', em nói thế nào cho lịch sự?", "Goodbye!", "You're welcome!", "Good night!", "See you later!", 1]], "c1": [["Toán", "Tính: 45 + 13 = ?", "58", "68", "48", "59", 0], ["Toán", "Tính: 79 - 34 = ?", "55", "45", "35", "46", 1], ["Toán", "Số gồm 3 chục và 4 đơn vị là số nào?", "44", "24", "34", "35", 2], ["Toán", "Băng giấy dài 19 cm, nối thêm 3 cm thì dài mấy cm?", "23 cm", "21 cm", "24 cm", "22 cm", 3], ["Toán", "Trong rổ có 36 quả bóng, thêm 30 quả nữa. Có tất cả mấy quả?", "66 quả", "76 quả", "56 quả", "67 quả", 0], ["Tiếng Việt", "Từ nào trái nghĩa với 'to'?", "Cao", "Nhỏ", "Dài", "Nặng", 1], ["Tiếng Anh", "Cái bàn học tiếng Anh là gì?", "bed", "door", "desk", "cup", 2], ["TNXH", "Khi ngồi học, lưng bé cần giữ như thế nào?", "Cúi gập sát bàn", "Nằm ra bàn", "Nghiêng sang một bên", "Ngồi thẳng lưng", 3], ["Tiếng Việt", "Khi gặp ông bà, bé nên làm gì?", "Khoanh tay chào lễ phép", "Chạy đi ngay", "Quay mặt đi", "Không nói gì", 0], ["Tiếng Anh", "Cái ghế tiếng Anh là gì?", "desk", "chair", "book", "bag", 1]]}, {"ten": "Bán Kết Rực Lửa", "tg": 13, "c3": [["Toán", "Diện tích hình chữ nhật dài 14 cm, rộng 6 cm là bao nhiêu?", "98 cm²", "70 cm²", "84 cm²", "86 cm²", 2], ["Toán", "Tính tổng: 3650 + 2675 = ?", "6425", "6225", "6335", "6325", 3], ["Toán", "Tính hiệu: 8900 - 3400 = ?", "5500", "5600", "5400", "5550", 0], ["Toán", "Tính tích: 215 x 4 = ?", "870", "860", "850", "864", 1], ["Toán", "Có 6 hộp bánh, mỗi hộp 9 chiếc. Đã ăn 11 chiếc. Còn lại bao nhiêu chiếc bánh?", "45 chiếc", "41 chiếc", "43 chiếc", "47 chiếc", 2], ["TNXH", "Trên bản đồ, màu xanh dương thường dùng để chỉ gì?", "Núi cao", "Sa mạc", "Thành phố", "Sông, hồ, biển và đại dương", 3], ["Tiếng Việt", "Từ nào chỉ thiên nhiên?", "Bầu trời", "Cái bàn", "Xe đạp", "Bút mực", 0], ["Tiếng Anh", "Từ 'autumn' chỉ mùa nào trong năm?", "Mùa xuân", "Mùa thu", "Mùa hạ", "Mùa đông", 1], ["TNXH", "Khi tham gia giao thông bằng ô tô, em cần làm gì để an toàn?", "Thò đầu ra ngoài cửa sổ", "Mở cửa xe khi xe đang chạy", "Ngồi ngay ngắn và thắt dây an toàn", "Nhảy múa trên ghế xe", 2], ["Tiếng Việt", "Từ nào viết đúng chính tả?", "Rịu ràng", "Giịu giàng", "Dịu ràng", "Dịu dàng", 3]], "c1": [["Toán", "Tính: 48 + 21 = ?", "79", "59", "69", "70", 2], ["Toán", "Tính: 82 - 12 = ?", "80", "60", "71", "70", 3], ["Toán", "Số gồm 4 chục và 7 đơn vị là số nào?", "47", "57", "37", "48", 0], ["Toán", "Băng giấy dài 20 cm, nối thêm 4 cm thì dài mấy cm?", "25 cm", "24 cm", "23 cm", "26 cm", 1], ["Toán", "Trong rổ có 38 quả bóng, thêm 10 quả nữa. Có tất cả mấy quả?", "58 quả", "38 quả", "48 quả", "49 quả", 2], ["TNXH", "Màu của bầu trời trong xanh ngày nắng là màu gì?", "Màu đen", "Màu đỏ", "Màu nâu", "Màu xanh dương", 3], ["Tiếng Việt", "Khi nhận quà từ người lớn, bé nói gì?", "Con cảm ơn ạ", "Con không biết", "Thôi đi", "Mặc kệ", 0], ["Tiếng Anh", "Ngôi nhà tiếng Anh là gì?", "tree", "house", "car", "ball", 1], ["TNXH", "Cầu vồng thường xuất hiện khi nào?", "Giữa đêm tối", "Trong phòng kín", "Sau cơn mưa có nắng", "Khi trời đầy sương", 2], ["Tiếng Việt", "Khi lỡ làm bạn đau, bé cần nói gì?", "Kệ bạn", "Không phải tớ", "Chào bạn", "Tớ xin lỗi bạn", 3]]}, {"ten": "Chung Kết Rung Chuông Vàng", "tg": 13, "c3": [["Toán", "Diện tích hình chữ nhật dài 15 cm, rộng 7 cm là bao nhiêu?", "105 cm²", "120 cm²", "90 cm²", "107 cm²", 0], ["Toán", "Tính tổng: 4000 + 2900 = ?", "7000", "6900", "6800", "6910", 1], ["Toán", "Tính hiệu: 9100 - 3550 = ?", "5650", "5450", "5550", "5600", 2], ["Toán", "Tính tích: 230 x 5 = ?", "1160", "1140", "1155", "1150", 3], ["Toán", "Có 3 hộp bánh, mỗi hộp 6 chiếc. Đã ăn 12 chiếc. Còn lại bao nhiêu chiếc bánh?", "6 chiếc", "8 chiếc", "4 chiếc", "10 chiếc", 0], ["Tiếng Anh", "Từ 'winter' chỉ mùa nào trong năm?", "Mùa xuân", "Mùa đông", "Mùa hạ", "Mùa thu", 1], ["TNXH", "Cơ quan nào điều khiển mọi suy nghĩ và hoạt động của cơ thể?", "Dạ dày", "Phổi", "Não (cơ quan thần kinh)", "Gan", 2], ["Tiếng Việt", "Thành ngữ 'Học một biết mười' khen ngợi người như thế nào?", "Học rất nhiều môn", "Đếm giỏi từ một đến mười", "Chép bài rất nhanh", "Thông minh, tiếp thu nhanh và biết suy rộng", 3], ["Tiếng Anh", "Từ 'spring' chỉ mùa nào trong năm?", "Mùa xuân", "Mùa hạ", "Mùa thu", "Mùa đông", 0], ["TNXH", "Việc làm nào thể hiện nếp sống văn minh nơi công cộng?", "Chen lấn xô đẩy", "Xếp hàng ngay ngắn và giữ trật tự", "Nói chuyện thật to trong thư viện", "Xả rác bừa bãi", 1]], "c1": [["Toán", "Tính: 51 + 30 = ?", "81", "91", "71", "82", 0], ["Toán", "Tính: 85 - 23 = ?", "72", "62", "52", "63", 1], ["Toán", "Số gồm 5 chục và 0 đơn vị là số nào?", "60", "40", "50", "51", 2], ["Toán", "Băng giấy dài 21 cm, nối thêm 5 cm thì dài mấy cm?", "27 cm", "25 cm", "28 cm", "26 cm", 3], ["Toán", "Trong rổ có 40 quả bóng, thêm 20 quả nữa. Có tất cả mấy quả?", "60 quả", "70 quả", "50 quả", "61 quả", 0], ["Tiếng Anh", "Cái giường tiếng Anh là gì?", "bag", "bed", "box", "bus", 1], ["TNXH", "Khi bạn bị ngã ở sân trường, bé nên làm gì?", "Cười trêu bạn", "Bỏ chạy đi chơi", "Đỡ bạn dậy và hỏi thăm bạn", "Lờ đi", 2], ["Tiếng Việt", "Trước khi ăn cơm, bé cần làm gì?", "Chạy nhảy quanh bàn", "Bốc thức ăn ngay", "Đi ngủ", "Rửa tay sạch bằng xà phòng", 3], ["Tiếng Anh", "Cái cốc tiếng Anh là gì?", "cup", "cap", "cat", "car", 0], ["TNXH", "Gia đình hạnh phúc là khi mọi người biết làm gì?", "Tranh giành đồ nhau", "Yêu thương và giúp đỡ lẫn nhau", "Không nói chuyện", "Cãi nhau mỗi ngày", 1]]}];
function vongHienTai(ten) { return Math.min(VONG_RCV.length, Math.max(1, +localStorage.getItem('rcv_vong_' + ten) || 1)); }
function chuanBiCauHoi(tenNhanVat) {
  const v = VONG_RCV[vongHienTai(tenNhanVat) - 1];
  const rieng = chuyenNganHang(THONG_TIN[tenNhanVat].lop === 3 ? v.c3 : v.c1);
  if (rieng.length >= CAU_HINH.soCau) return tronMang(rieng).slice(0, CAU_HINH.soCau).map(tronDapAn);
  return chuanBiCauHoiCu(tenNhanVat);
}
function chuanBiCauHoiCu(tenNhanVat) {
  const nganHang = THONG_TIN[tenNhanVat].nganHang;
  let daDung = docDaDung(tenNhanVat);
  let chuaDung = nganHang.filter(function (q) { return daDung.indexOf(khoaCau(q)) < 0; });
  if (chuaDung.length < CAU_HINH.soCau + 5) { daDung = []; chuaDung = nganHang.slice(); }
  const tron = tronMang(chuaDung);
  const bo = tron.slice(0, CAU_HINH.soCau);
  ghiDaDung(tenNhanVat, daDung.concat(bo.map(khoaCau)));
  return bo.map(tronDapAn);
}
function tenCau(chiSo) { return 'Vòng ' + vongHienTai(TRO_CHOI.chinh) + '/30 · Câu ' + (chiSo + 1) + '/' + CAU_HINH.soCau; }

document.querySelectorAll('img[data-anh]').forEach(function (anh) { anh.src = ANH_MAT[anh.getAttribute('data-anh')]; });
/* Màn chọn nhân vật: rê chuột để nhân vật chào */
$('theLucie').addEventListener('mouseenter', function () {
  if (TRO_CHOI.giaiDoan !== 'chon') return;
  vuiMung(DAC_BIET.lucie, 1.3); bongCamXuc(DAC_BIET.lucie, '👋', 1.2);
  phatHat(viTriTrenDau(DAC_BIET.lucie, 1.2), 18, [0xff8fc7, 0xffffff], { tocDo: [1, 2.5], trongLuc: 1.5, tuoi: [0.5, 1], kichThuoc: 0.8 });
});
$('theLucas').addEventListener('mouseenter', function () {
  if (TRO_CHOI.giaiDoan !== 'chon') return;
  vuiMung(DAC_BIET.lucas, 1.3); bongCamXuc(DAC_BIET.lucas, '👋', 1.2);
  phatHat(viTriTrenDau(DAC_BIET.lucas, 1.2), 18, [0x74c0fc, 0xffffff], { tocDo: [1, 2.5], trongLuc: 1.5, tuoi: [0.5, 1], kichThuoc: 0.8 });
});
['lucie', 'lucas'].forEach(function (t) { const c = $(t === 'lucie' ? 'theLucie' : 'theLucas').querySelector('.chip'); if (c) c.insertAdjacentHTML('afterend', '<div class="chip bg-yellow-300 text-amber-900 mt-2 text-sm md:text-base">🔔 Vòng ' + vongHienTai(t) + '/30: ' + VONG_RCV[vongHienTai(t) - 1].ten + '</div>'); });
$('theLucie').addEventListener('click', function () { chonNhanVat('lucie'); });
$('theLucas').addEventListener('click', function () { chonNhanVat('lucas'); });

async function chonNhanVat(ten) {
  if (TRO_CHOI.giaiDoan !== 'chon') return;
  AM_THANH.khoiTao(); AM_THANH.bam();
  const phien = TRO_CHOI.phien;
  TRO_CHOI.giaiDoan = 'gioiThieu';
  TRO_CHOI.chinh = ten;
  TRO_CHOI.dongHanh = null;
  TRO_CHOI.phu = ten === 'lucie' ? 'lucas' : 'lucie';
  TRO_CHOI.cauHoi = chuanBiCauHoi(ten);
  TRO_CHOI.chiSo = 0; TRO_CHOI.phao = CAU_HINH.soPhao; TRO_CHOI.soPhaoDaDung = 0; TRO_CHOI.soCauDung = 0;
  TRO_CHOI.diem = 0; TRO_CHOI.chuoi = 0; TRO_CHOI.chuoiMax = 0;
  TRO_CHOI.lichGiaiLao = lapLichGiaiLao();
  TRO_CHOI.thoiGianToiDa = VONG_RCV[vongHienTai(ten) - 1].tg || CAU_HINH.thoiGian[ten];
  TRO_CHOI.tongLoaiTruoc = 0; TRO_CHOI.conLaiTruoc = 100;
  anDi('manBatDau');
  chopSang('#ffffff', 0.55);
  const chinh = DAC_BIET[ten], phu = DAC_BIET[TRO_CHOI.phu];
  const ttChinh = THONG_TIN[ten];
  phu.conSong = false;   // chỉ một nhân vật chính bước vào sàn đấu
  vuiMung(chinh, 1.4);
  bongCamXuc(chinh, '😍', 1.6);
  bongCamXuc(phu, '👋', 1.2);
  phatHat(viTriTrenDau(chinh, 1.0), 50, [0xffd43b, 0xffffff, ten === 'lucie' ? 0xff8fc7 : 0x74c0fc], { tocDo: [2, 4.5], trongLuc: 2, tuoi: [0.7, 1.4], kichThuoc: 1.1 });
  songXung(new V3(chinh.nhom.position.x, 1.25, chinh.nhom.position.z), 0xffd43b, 4);
  AM_THANH.phao();
  await cho(900);
  if (phien !== TRO_CHOI.phien) return;
  // Nhân vật còn lại vẫy tay chào rồi lui vào hậu trường
  const viTriPhu = phu.nhom.position.clone();
  nhayToi(phu, new V3(viTriPhu.x * 4, 0, -21), 0, 2.4, 1.1).then(function () {
    phatHat(viTriTrenDau(phu, 0.8), 30, [0xffffff, 0xd0bfff], { tocDo: [1, 2.5], trongLuc: 0.5, tuoi: [0.5, 1], kichThuoc: 1.2 });
    phu.nhom.visible = false;
  });
  bayCamera(gocCauHoi(), 2.4);
  await nhayToi(chinh, viTriO(CAU_HINH.oChinh), 0.57, 3.4, 2.0);
  if (phien !== TRO_CHOI.phien) return;
  datVaoO(chinh, CAU_HINH.oChinh);
  ganNhanTen(chinh, '⭐ ' + ttChinh.ten.toUpperCase() + ' · LỚP ' + ttChinh.tenLop, '#f59f00', '#fff3bf', 2.6);
  datMauBuc(CAU_HINH.oChinh, 'vang');
  songXung(new V3(chinh.nhom.position.x, 0.6, chinh.nhom.position.z), 0xffd43b, 7);
  phatHat(viTriTrenDau(chinh, 0.3), 60, [0xffd43b, 0xffffff], { tocDo: [2, 5], trongLuc: 3, tuoi: [0.6, 1.2], kichThuoc: 1 });
  lacCamera(0.25);
  vuiMung(chinh, 1.6);
  AM_THANH.dung();
  capNhatHud(); hien('hud', 'flex');
  thongBao('🎉 ' + ttChinh.danhXung + ' đứng ở <span class="text-amber-500">ô số 45</span>!<br><span class="text-lg md:text-xl text-slate-500">Cùng 99 bạn thí sinh tranh tài</span>', 2400);
  await cho(1500);
  if (phien !== TRO_CHOI.phien) return;
  TAT_CA.forEach(function (t) { if (t.conSong) vuiMung(t, ngauNhien(1.2, 2.2)); });
  await bayCamera(gocToanCanh(), 2.2);
  if (phien !== TRO_CHOI.phien) return;
  banPhaoHoa(-8, 4); setTimeout(function () { banPhaoHoa(8, 4); }, 300); setTimeout(function () { banPhaoHoa(0, 8); }, 650);
  thongBao('Chào mừng <span class="text-indigo-600">100 thí sinh</span> đến với<br><span class="chu-vang-dam">RUNG CHUÔNG VÀNG!</span>', 2200);
  await cho(2300);
  if (phien !== TRO_CHOI.phien) return;
  batDauCauHoi(0);
}

async function batDauCauHoi(chiSo) {
  const phien = TRO_CHOI.phien;
  TRO_CHOI.chiSo = chiSo;
  TRO_CHOI.giaiDoan = 'gioiThieu';
  TRO_CHOI.daChot = false; TRO_CHOI.luaChon = -1;
  anDi('bangThongKe');
  TAT_CA.forEach(function (t) {
    if (t.chiSoO < 0) return;
    if (t.conSong) { datChuBang(t, ''); datMauBuc(t.chiSoO, 'macDinh'); }
    else datMauBuc(t.chiSoO, 'tat');
  });
  if (DAC_BIET[TRO_CHOI.chinh].conSong) datMauBuc(CAU_HINH.oChinh, 'vang');
  capNhatHud();
  const q = TRO_CHOI.cauHoi[chiSo];
  const laCauCuoi = chiSo === CAU_HINH.soCau - 1;
  bannerCau('CÂU ' + (chiSo + 1), laCauCuoi ? '🔥 CÂU HỎI CUỐI CÙNG!' : ('📚 Môn ' + q.mon));
  AM_THANH.kenTieuDe();
  chumDoiMau(laCauCuoi ? 0xff4f4f : parseInt((MAU_MON[q.mon] || '#6366f1').slice(1), 16), 1.8);
  if (laCauCuoi) lacCamera(0.2);
  await bayCamera(gocCauHoi(), 1.6);
  if (phien !== TRO_CHOI.phien) return;
  hienCauHoi();
  TRO_CHOI.giaiDoan = 'traLoi';
  TRO_CHOI.thoiGianConLai = TRO_CHOI.thoiGianToiDa;
  TRO_CHOI.giayDaTich = -1;
  TRO_CHOI.dangDemGio = true;
  if (TRO_CHOI.chinh === 'lucas') setTimeout(function () { if (TRO_CHOI.giaiDoan === 'traLoi' && phien === TRO_CHOI.phien) docCauHoi(); }, 500);
}

function hienCauHoi() {
  const q = TRO_CHOI.cauHoi[TRO_CHOI.chiSo];
  $('nhanCau').textContent = tenCau(TRO_CHOI.chiSo).toUpperCase();
  $('nhanMon').textContent = q.mon;
  $('nhanMon').style.background = MAU_MON[q.mon] || '#6366f1';
  $('noiDungCau').textContent = q.cau;
  $('soGiay').textContent = TRO_CHOI.thoiGianToiDa;
  $('thanhGio').style.width = '100%';
  const luoi = $('luoiDapAn');
  luoi.innerHTML = '';
  q.dapAnTron.forEach(function (noiDung, i) {
    const nut = document.createElement('button');
    nut.className = 'nut-dap-an hien-dan';
    nut.style.animationDelay = (0.08 * i) + 's';
    nut.innerHTML = '<span class="chu-cai" style="background:' + MAU_CHU_CAI[CHU_CAI[i]] + '">' + CHU_CAI[i] + '</span><span></span>';
    nut.lastChild.textContent = noiDung;
    nut.addEventListener('mouseenter', function () { if (!nut.disabled) AM_THANH.not(880 + i * 110, 0, 0.06, 'sine', 0.05); });
    nut.addEventListener('click', function () { chotDapAn(i); });
    luoi.appendChild(nut);
  });
  const bang = $('bangCauHoi');
  bang.classList.remove('an', 'truot-len'); void bang.offsetWidth; bang.classList.add('truot-len');
}

function capNhatDongHoDem(dt) {
  if (!TRO_CHOI.dangDemGio) return;
  TRO_CHOI.thoiGianConLai -= dt;
  const conLai = Math.max(0, TRO_CHOI.thoiGianConLai);
  const tyLe = conLai / TRO_CHOI.thoiGianToiDa;
  const thanh = $('thanhGio');
  thanh.style.width = (tyLe * 100) + '%';
  thanh.style.backgroundColor = tyLe > 0.5 ? '#22c55e' : (tyLe > 0.25 ? '#f59e0b' : '#ef4444');
  const giay = Math.ceil(conLai);
  const oSo = $('soGiay');
  oSo.textContent = giay;
  oSo.style.background = giay <= 5 ? '#ef4444' : '#1e1b4b';
  if (giay !== TRO_CHOI.giayDaTich) {
    TRO_CHOI.giayDaTich = giay;
    if (giay <= 5 && giay > 0) {
      AM_THANH.tich(giay <= 3);
      oSo.classList.remove('hop-hien'); void oSo.offsetWidth; oSo.classList.add('hop-hien');
      $('luoiDapAn').querySelectorAll('button').forEach(function (nut) { if (!nut.disabled) nut.classList.add('gap'); });
    }
  }
  if (TRO_CHOI.thoiGianConLai <= 0) {
    TRO_CHOI.dangDemGio = false;
    thongBao('⏰ Hết giờ rồi!', 1400);
    chotDapAn(-1);
  }
}

async function chotDapAn(luaChon) {
  if (TRO_CHOI.giaiDoan !== 'traLoi' || TRO_CHOI.daChot) return;
  const phien = TRO_CHOI.phien;
  TRO_CHOI.daChot = true; TRO_CHOI.dangDemGio = false; TRO_CHOI.luaChon = luaChon;
  TRO_CHOI.giayKhiChot = Math.max(0, TRO_CHOI.thoiGianConLai);
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  khoiPhucNhac();
  AM_THANH.bam();
  const cacNut = $('luoiDapAn').querySelectorAll('button');
  cacNut.forEach(function (nut, i) { nut.disabled = true; nut.classList.remove('gap'); if (i === luaChon) nut.classList.add('da-chon'); else nut.classList.add('mo'); });
  if (luaChon >= 0) {
    const chinh = DAC_BIET[TRO_CHOI.chinh];
    datChuBang(chinh, CHU_CAI[luaChon]);
    bongCamXuc(chinh, '🤔', 1.3);
    thongBao('✍️ Đã chốt đáp án <span style="color:' + MAU_CHU_CAI[CHU_CAI[luaChon]] + '">' + CHU_CAI[luaChon] + '</span>!<br><span class="text-lg text-slate-500">Cùng chờ công bố kết quả nhé...</span>', 1500);
  }
  await cho(1300);
  if (phien !== TRO_CHOI.phien) return;
  congBoKetQua(luaChon);
}

function ghiNhatKy(game, child, subject, question, ok) { try { const k = 'giaDinh_nhatKy', a = JSON.parse(localStorage.getItem(k) || '[]'); a.push({ t: Date.now(), g: game, c: child, s: subject, q: String(question).slice(0, 140), ok: !!ok }); if (a.length > 6000) a.splice(0, a.length - 6000); localStorage.setItem(k, JSON.stringify(a)); } catch (e) {} }
async function congBoKetQua(luaChon) {
  const phien = TRO_CHOI.phien;
  TRO_CHOI.giaiDoan = 'congBo';
  const chiSo = TRO_CHOI.chiSo;
  const laCauCuoi = chiSo === CAU_HINH.soCau - 1;
  const q = TRO_CHOI.cauHoi[chiSo];
  const chuDung = CHU_CAI[q.dung];
  const chinhDung = luaChon === q.dung;
  ghiNhatKy('rungchuong', TRO_CHOI.chinh, q.mon, q.cau, chinhDung);
  const chinh = DAC_BIET[TRO_CHOI.chinh];

  // Thí sinh AI: chọn ngẫu nhiên những bạn trả lời sai theo tỷ lệ loại tăng dần
  // Câu 10 loại hết các bạn còn lại: chỉ một người duy nhất được rung chuông vàng
  const aiConSong = TAT_CA.filter(function (t) { return t.loai === 'ai' && t.conSong; });
  let mucTieu = laCauCuoi ? 0 : Math.round(99 * TY_LE_CON_LAI[chiSo]) + soNguyen(-2, 2);
  mucTieu = Math.max(laCauCuoi ? 0 : 1, Math.min(aiConSong.length, mucTieu));
  const aiSai = new Set(tronMang(aiConSong).slice(0, aiConSong.length - mucTieu));

  function chuSai() { const cacChu = CHU_CAI.filter(function (c) { return c !== chuDung; }); return cacChu[soNguyen(0, 2)]; }
  TAT_CA.forEach(function (t) {
    if (!t.conSong) return;
    if (t === chinh) datChuBang(t, luaChon >= 0 ? CHU_CAI[luaChon] : '?');
    else datChuBang(t, aiSai.has(t) ? chuSai() : chuDung);
  });

  anDi('bangCauHoi');
  thongBao('📢 Tất cả giơ bảng lên nào!', 1400);
  await bayCamera(gocToanCanh(), 1.7);
  if (phien !== TRO_CHOI.phien) return;
  AM_THANH.hoiHop();
  await cho(950);
  if (phien !== TRO_CHOI.phien) return;

  let soLoaiCau = 0;
  let chinhBiLoai = false, coTheDungPhao = false, diemCong = 0;
  TAT_CA.forEach(function (t) {
    if (!t.conSong || t === chinh) return;
    if (aiSai.has(t)) {
      soLoaiCau++;
      datMauBuc(t.chiSoO, 'sai');
      loaiNhanVat(t, ngauNhien(0.2, 0.9), chiSo);
    } else {
      datMauBuc(t.chiSoO, 'dung');
      vuiMung(t, ngauNhien(1.6, 2.4));
      phatHat(viTriTrenDau(t, 1.0), 4, [0x51ff8a, 0xffffff], { tocDo: [1, 2.5], trongLuc: 2, tuoi: [0.5, 0.9], kichThuoc: 0.8 });
    }
  });
  const viTriChinh = chinh.nhom.position.clone();
  if (chinhDung) {
    TRO_CHOI.soCauDung++;
    TRO_CHOI.chuoi++;
    TRO_CHOI.chuoiMax = Math.max(TRO_CHOI.chuoiMax, TRO_CHOI.chuoi);
    diemCong = 100 + Math.round(TRO_CHOI.giayKhiChot * 10) + (TRO_CHOI.chuoi - 1) * 50;
    TRO_CHOI.diem += diemCong;
    datMauBuc(chinh.chiSoO, 'dung');
    vuiMung(chinh, 2.6);
    bongCamXuc(chinh, TRO_CHOI.chuoi >= 3 ? '🔥' : '😄', 2.2);
    AM_THANH.dung();
    setTimeout(function () { AM_THANH.lapLanh(); }, 250);
    chopSang('#22e06b', 0.3);
    songXung(new V3(viTriChinh.x, 0.62, viTriChinh.z), 0x51ff8a, 8);
    phatHat(new V3(viTriChinh.x, 1.6, viTriChinh.z), 70, [0xffd43b, 0x51ff8a, 0xffffff], { tocDo: [2.5, 5.5], trongLuc: 3, tuoi: [0.8, 1.5], kichThuoc: 1.2 });
    banPhaoHoa(viTriChinh.x, viTriChinh.z, 0xffd43b, 9);
    noiChu('+' + diemCong + ' điểm ⭐', '#fde047', 0.2);
    if (TRO_CHOI.chuoi >= 2) noiChu('🔥 ' + TRO_CHOI.chuoi + ' câu đúng liên tiếp!', '#fb923c', 0.9);
  } else {
    TRO_CHOI.chuoi = 0;
    chopSang('#ff3030', 0.3);
    lacCamera(0.35);
    bongCamXuc(chinh, '😮', 2.2);
    if (TRO_CHOI.phao > 0 && !laCauCuoi) {
      coTheDungPhao = true;
      datMauBuc(chinh.chiSoO, 'canhBao');
      AM_THANH.sai();
    } else {
      chinhBiLoai = true; soLoaiCau++;
      datMauBuc(chinh.chiSoO, 'sai');
      loaiNhanVat(chinh, 0.8, chiSo);
      AM_THANH.buon();
    }
  }
  chumDoiMau(chinhDung ? 0x51ff8a : 0xff4f4f, 1.6);
  if (soLoaiCau > 0) { setTimeout(function () { AM_THANH.loai(); lacCamera(Math.min(0.3, 0.05 + soLoaiCau * 0.015)); }, 350); }
  capNhatHud();
  await cho(1900);
  if (phien !== TRO_CHOI.phien) return;
  if (chinhDung && TRO_CHOI.lichGiaiLao.length && TRO_CHOI.lichGiaiLao[0] <= chiSo && chiSo < CAU_HINH.soCau - 1) {
    TRO_CHOI.lichGiaiLao.shift();
    await giaiLaoBoMe(phien);
    if (phien !== TRO_CHOI.phien) return;
  }
  hienThongKe({ q: q, luaChon: luaChon, chinhDung: chinhDung, soLoaiCau: soLoaiCau, chinhBiLoai: chinhBiLoai, coTheDungPhao: coTheDungPhao, laCauCuoi: laCauCuoi, diemCong: diemCong });
}

function datTrangThai(id, noiDung, kieu) {
  const el = $(id);
  const bang = {
    an: 'background:#ecfdf5;color:#047857;border:2px solid #6ee7b7',
    canhBao: 'background:#fff7ed;color:#c2410c;border:2px solid #fdba74',
    phao: 'background:#fffbeb;color:#b45309;border:2px solid #fcd34d',
    loai: 'background:#fff1f2;color:#be123c;border:2px solid #fda4af',
    nhat: 'background:#eef2ff;color:#3730a3;border:2px solid #c7d2fe'
  };
  el.setAttribute('style', bang[kieu]);
  el.innerHTML = noiDung;
}
function capNhatDongThanhTich() {
  datTrangThai('tkDongHanh', '⭐ Điểm: <b>' + TRO_CHOI.diem + '</b> &nbsp;·&nbsp; 🔥 Chuỗi đúng: <b>' + TRO_CHOI.chuoi + '</b> &nbsp;·&nbsp; 🛟 Phao còn: <b>' + TRO_CHOI.phao + '</b>', 'nhat');
}

function hienThongKe(kq) {
  TRO_CHOI.giaiDoan = 'thongKe';
  const chiSo = TRO_CHOI.chiSo;
  const ttChinh = THONG_TIN[TRO_CHOI.chinh];
  const conLai = demConSong();
  const tongLoai = 100 - conLai;

  $('tkTieuDe').textContent = 'KẾT QUẢ ' + tenCau(chiSo).toUpperCase();
  $('tkDapAn').textContent = CHU_CAI[kq.q.dung] + '. ' + kq.q.dapAnTron[kq.q.dung];
  $('tkBanChon').textContent = kq.luaChon >= 0
    ? ttChinh.ten + ' đã chọn: ' + CHU_CAI[kq.luaChon] + '. ' + kq.q.dapAnTron[kq.luaChon] + (kq.chinhDung ? ' 🎯 (+' + kq.diemCong + ' điểm)' : '')
    : ttChinh.ten + ' chưa kịp chọn đáp án ⏰';
  demSo($('tkLoaiCau'), 0, kq.soLoaiCau, 1200);
  demSo($('tkTongLoai'), TRO_CHOI.tongLoaiTruoc, tongLoai, 1400);
  demSo($('tkConLai'), TRO_CHOI.conLaiTruoc, conLai, 1400);
  TRO_CHOI.tongLoaiTruoc = tongLoai; TRO_CHOI.conLaiTruoc = conLai;

  if (kq.chinhDung) datTrangThai('tkChinh', '⭐ ' + ttChinh.danhXung + ' (ô 45): ✅ An toàn – giỏi quá!', 'an');
  else if (kq.coTheDungPhao) datTrangThai('tkChinh', '⭐ ' + ttChinh.danhXung + ' (ô 45): ⚠️ Chưa đúng rồi! Bấm <b>Phao Cứu Trợ</b> để chơi tiếp nhé 🛟', 'canhBao');
  else datTrangThai('tkChinh', '⭐ ' + ttChinh.danhXung + ' (ô 45): 💪 Dừng bước ở câu ' + (chiSo + 1), 'loai');
  capNhatDongThanhTich();

  const nutPhao = $('nutPhao'), nutTiep = $('nutTiepTheo');
  nutPhao.classList.toggle('an', !kq.coTheDungPhao);
  nutTiep.disabled = false; nutTiep.style.opacity = '1'; nutTiep.style.cursor = 'pointer';
  if (kq.coTheDungPhao) {
    nutTiep.disabled = true; nutTiep.style.opacity = '0.45'; nutTiep.style.cursor = 'not-allowed';
    nutTiep.textContent = 'Bước vào câu hỏi tiếp theo ➜';
    TRO_CHOI.hanhDongTiep = function () { batDauCauHoi(chiSo + 1); };
  } else if (kq.chinhBiLoai) {
    nutTiep.textContent = 'Xem kết quả của ' + ttChinh.ten + ' ➜';
    TRO_CHOI.hanhDongTiep = function () { hienManThua(); };
  } else if (kq.laCauCuoi) {
    nutTiep.textContent = '🔔 Lên bục Rung Chuông Vàng!';
    TRO_CHOI.hanhDongTiep = function () { chienThang(); };
  } else {
    nutTiep.textContent = 'Bước vào câu hỏi tiếp theo ➜';
    TRO_CHOI.hanhDongTiep = function () { batDauCauHoi(chiSo + 1); };
  }
  const bang = $('bangThongKe');
  bang.classList.remove('an'); bang.style.display = 'flex';
  const the = bang.firstElementChild; the.classList.remove('hop-hien'); void the.offsetWidth; the.classList.add('hop-hien');
}

$('nutPhao').addEventListener('click', function () {
  if (TRO_CHOI.giaiDoan !== 'thongKe' || TRO_CHOI.phao <= 0) return;
  TRO_CHOI.phao--; TRO_CHOI.soPhaoDaDung++;
  const chinh = DAC_BIET[TRO_CHOI.chinh];
  const vt = chinh.nhom.position.clone();
  datMauBuc(chinh.chiSoO, 'vang');
  vuiMung(chinh, 2.2);
  bongCamXuc(chinh, '🛟', 2.0);
  AM_THANH.phao();
  chopSang('#ffd23f', 0.4);
  songXung(new V3(vt.x, 0.62, vt.z), 0xffd23f, 7);
  phatHat(new V3(vt.x, 1.5, vt.z), 80, [0xffd23f, 0xffffff, 0xff922b], { tocDo: [2, 5], trongLuc: 2.5, tuoi: [0.8, 1.5], kichThuoc: 1.2 });
  banPhaoGiay2D(70);
  noiChu('🛟 Phao Cứu Trợ!', '#fcd34d', 0);
  capNhatHud();
  datTrangThai('tkChinh', '⭐ ' + THONG_TIN[TRO_CHOI.chinh].danhXung + ' (ô 45): 🛟 Đã dùng Phao Cứu Trợ – tiếp tục chiến đấu nào!', 'phao');
  capNhatDongThanhTich();
  $('nutPhao').classList.add('an');
  const nutTiep = $('nutTiepTheo');
  nutTiep.disabled = false; nutTiep.style.opacity = '1'; nutTiep.style.cursor = 'pointer';
});
$('nutTiepTheo').addEventListener('click', function () {
  if (TRO_CHOI.giaiDoan !== 'thongKe' || $('nutTiepTheo').disabled) return;
  AM_THANH.bam();
  anDi('bangThongKe');
  const hanhDong = TRO_CHOI.hanhDongTiep;
  TRO_CHOI.hanhDongTiep = null;
  if (hanhDong) hanhDong();
});

function rungMotTiengChuong(phien) {
  if (phien !== TRO_CHOI.phien) return;
  AM_THANH.chuong();
  const viTriChuong = new V3(0, 3.9, -14);
  songXung(new V3(0, 1.25, -14), 0xffd43b, 9);
  phatHat(viTriChuong, 70, [0xffd43b, 0xfff3bf, 0xffffff], { tocDo: [2.5, 6], trongLuc: 2, tuoi: [0.9, 1.6], kichThuoc: 1.3 });
  lacCamera(0.28);
  chopSang('#ffe066', 0.35);
}

function ghiThanhTich(ten, thang, soCau) { try { const k = 'rcv_thanhTich_' + ten, o = JSON.parse(localStorage.getItem(k) || '{}'); o.luot = (o.luot || 0) + 1; if (thang) o.thang = (o.thang || 0) + 1; o.xaNhat = Math.max(o.xaNhat || 0, soCau); o.lanCuoi = Date.now(); localStorage.setItem(k, JSON.stringify(o)); } catch (e) {} }
async function chienThang() {
  ghiThanhTich(TRO_CHOI.chinh, true, CAU_HINH.soCau);
  try { localStorage.setItem('rcv_vong_' + TRO_CHOI.chinh, Math.min(30, vongHienTai(TRO_CHOI.chinh) + 1)); } catch (e) {}
  const phien = TRO_CHOI.phien;
  TRO_CHOI.giaiDoan = 'chienThang';
  anDi('hud'); anDi('bangThongKe');
  const chinh = DAC_BIET[TRO_CHOI.chinh];
  const ttChinh = THONG_TIN[TRO_CHOI.chinh];
  await bayCamera(gocChuongXa(), 1.8);
  if (phien !== TRO_CHOI.phien) return;
  thongBao('🏆 ' + ttChinh.danhXung + ' tiến lên bục vinh quang!', 2000);
  AM_THANH.kenTieuDe();
  await nhayToi(chinh, new V3(0.9, 0, -15.5), 1.2, 4.0, 2.0);
  if (phien !== TRO_CHOI.phien) return;
  songXung(new V3(0.9, 1.25, -15.5), 0xffd43b, 5);
  await bayCamera(gocChuongGan(), 1.5);
  if (phien !== TRO_CHOI.phien) return;
  thoiDiemRung = dongHo;
  rungMotTiengChuong(phien);
  setTimeout(function () { rungMotTiengChuong(phien); }, 1200);
  setTimeout(function () { if (phien === TRO_CHOI.phien) { giamNhac(0.15); AM_THANH.chienThang(); setTimeout(khoiPhucNhac, 4500); } }, 1900);
  setTimeout(function () { rungMotTiengChuong(phien); }, 5200);
  banPhaoGiay3D();
  banPhaoGiay2D(260);
  setTimeout(function () { if (phien === TRO_CHOI.phien) banPhaoGiay2D(200); }, 1600);
  setTimeout(function () { if (phien === TRO_CHOI.phien) banPhaoGiay2D(200); }, 3400);
  clearInterval(TRO_CHOI.maPhaoHoa);
  TRO_CHOI.maPhaoHoa = setInterval(function () {
    if (phien !== TRO_CHOI.phien) { clearInterval(TRO_CHOI.maPhaoHoa); return; }
    banPhaoHoa(ngauNhien(-13, 13), ngauNhien(-6, 12));
  }, 420);
  setTimeout(function () { clearInterval(TRO_CHOI.maPhaoHoa); }, 14000);
  bongCamXuc(chinh, '🥳', 5);
  TAT_CA.forEach(function (t) { if (t.conSong) vuiMung(t, 9999); });
  await cho(2200);
  if (phien !== TRO_CHOI.phien) return;
  $('thangTieuDe').textContent = 'CHÚC MỪNG ' + ttChinh.ten.toUpperCase() + '!';
  $('thangNoiDung').innerHTML = ttChinh.danhXung + ' đã vượt qua cả 10 câu hỏi' +
    ', trở thành người <b>duy nhất</b> <b class="text-amber-600">RUNG CHUÔNG VÀNG</b>! 🔔✨' +
    '<br><span class="text-base text-slate-500">Chuỗi đúng dài nhất: ' + TRO_CHOI.chuoiMax + ' câu</span>';
  $('anhThang').src = ANH_MAT[TRO_CHOI.chinh];
  $('thangDung').textContent = TRO_CHOI.soCauDung;
  $('thangPhao').textContent = TRO_CHOI.soPhaoDaDung;
  demSo($('thangDiem'), 0, TRO_CHOI.diem, 1800);
  hien('manThang', 'flex');
}

function hienManThua() {
  ghiThanhTich(TRO_CHOI.chinh, false, TRO_CHOI.chiSo);
  TRO_CHOI.giaiDoan = 'ketThuc';
  anDi('hud');
  const tt = THONG_TIN[TRO_CHOI.chinh];
  $('thuaTieuDe').textContent = tt.ten + ' giỏi lắm!';
  $('thuaNoiDung').innerHTML = tt.danhXung + ' đã dũng cảm đi tới <b>câu ' + (TRO_CHOI.chiSo + 1) + '</b> trong số 10 câu.' +
    '<br>Ôn lại một chút rồi mình thử lại nhé – lần sau chắc chắn rung được chuông! 🔔';
  $('anhThua').src = ANH_MAT[TRO_CHOI.chinh];
  $('thuaDung').textContent = TRO_CHOI.soCauDung;
  $('thuaCau').textContent = TRO_CHOI.chiSo;
  $('thuaDiem').textContent = TRO_CHOI.diem;
  hien('manThua', 'flex');
}

function choiLai() {
  AM_THANH.bam();
  TRO_CHOI.phien++;
  clearInterval(TRO_CHOI.maPhaoHoa);
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  DANH_SACH_TWEEN.length = 0;
  ['manThang', 'manThua', 'bangThongKe', 'bangCauHoi', 'hud', 'thongBao', 'bangTieuDeCau'].forEach(anDi);
  TRO_CHOI.giaiDoan = 'chon';
  TRO_CHOI.chinh = null; TRO_CHOI.dongHanh = null; TRO_CHOI.phu = null;
  TRO_CHOI.dangDemGio = false; TRO_CHOI.daChot = false;
  thoiDiemRung = -1; truChuong.rotation.set(0, 0, 0);
  PG3.bat = false;
  doRungCamera = 0;
  anBoMe();
  TAT_CA.forEach(function (t) {
    t.conSong = true; t.dangBay = false; t.vuiDen = 0; t.cauBiLoai = 0;
    t.nhom.visible = true; t.nhom.scale.setScalar(t.tyLe); t.nhom.rotation.set(0, Math.PI, 0);
    datChuBang(t, '');
    goNhanTen(t);
    goBongCamXuc(t);
  });
  TAT_CA.forEach(function (t) { if (t.loai === 'ai') datVaoO(t, t.oGoc); });
  THI_SINH[CAU_HINH.oChinh] = null;
  datLenBucTrungBay();
  for (let i = 0; i < 100; i++) datMauBuc(i, 'macDinh');
  hien('manBatDau');
  bayCamera(gocChon(), 1.6);
}
$('nutChoiLaiThang').addEventListener('click', choiLai);
$('nutChoiLaiThua').addEventListener('click', choiLai);
$('nutDoc').addEventListener('click', function () { AM_THANH.khoiTao(); docCauHoi(); });

/* Bàn phím: phím 1–4 hoặc A–D để chọn đáp án; Enter để sang bước tiếp */
window.addEventListener('keydown', function (e) {
  const phim = e.key.toLowerCase();
  if (TRO_CHOI.giaiDoan === 'traLoi') {
    const viTri = ['1', '2', '3', '4'].indexOf(phim) >= 0 ? ['1', '2', '3', '4'].indexOf(phim) : ['a', 'b', 'c', 'd'].indexOf(phim);
    if (viTri >= 0) chotDapAn(viTri);
  } else if (TRO_CHOI.giaiDoan === 'thongKe' && phim === 'enter') {
    $('nutTiepTheo').click();
  }
});

/* ---------------------------------------------------------------------
   14. VÒNG LẶP CHÍNH
   --------------------------------------------------------------------- */
const dongHoThree = new THREE.Clock();
function vongLap() {
  requestAnimationFrame(vongLap);
  const dt = Math.min(0.05, dongHoThree.getDelta());
  dongHo += dt;
  capNhatTween(dt);
  capNhatNhanVat();
  capNhatSanKhau(dt);
  capNhatDongHoDem(dt);
  capNhatPhaoGiay3D(dt);
  capNhatPhaoGiay2D(dt);
  capNhatHat(dt);
  capNhatBoMe();
  capNhatHieuUng(dt);
  capNhatNhacNen(dt);
  capNhatCamera(dongHo);
  renderer.render(canh, camera);
}
window.addEventListener('resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  chinhCoCanvasPhao();
  if (TRO_CHOI.giaiDoan === 'chon') { const g = gocChon(); camViTri.copy(g[0]); camNhin.copy(g[1]); }
});

(function khoiDong() {
  const g = gocChon(); camViTri.copy(g[0]); camNhin.copy(g[1]);
  vongLap();
  setTimeout(function () {
    const manTai = $('manTai');
    manTai.style.transition = 'opacity .6s'; manTai.style.opacity = '0';
    setTimeout(function () { manTai.style.display = 'none'; }, 650);
  }, 400);
  if (document.fonts && document.fonts.ready) {
    document.fonts.load('800 60px "Baloo 2"').then(function () { veLaiTatCaKetCau(); }).catch(function () {});
  }
})();
</script>
<script src="../anh-chung/anh-that.js" defer></script>
<script src="../anh-chung/nhac-nen.js" data-ngoai="1" data-ten="Rung Chuông Vàng"></script>
</body>
</html>
