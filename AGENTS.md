# BẢN BÀN GIAO ĐẦY ĐỦ cho trợ lý AI (Gemini / Jules / Claude) làm việc trên kho này

Trang game học tập của hai bé, chạy trên GitHub Pages: https://ngocanhno1.github.io
Chủ kho: anh Nguyễn Hoàng Ngọc Anh. Xưng "em", gọi "anh". Anh rất ít rành kỹ thuật: tự làm trọn vẹn, không bắt anh bấm,
không hỏi lại điều tự quyết được; chỉ hỏi trước việc tốn tiền, xóa dữ liệu, không làm lại được. Báo cáo ngắn, tiếng Việt, kèm link.

## 1. Hai bé
- Lucie = Nguyễn Ngọc Tường San (gọi Tường San), lớp 3A6. Lucas = Nguyễn Ngọc Tường Minh (gọi Tường Minh), lớp 1A5.
  Trường TH&THCS Chu Văn An. Bố Ngọc Anh, mẹ Thu Hà. Luôn lấy từ games/anh-chung/thong-tin.js (window.HS), không ghi cứng.
- Nội dung: Lucie lớp 3 (GDPT 2018, Kết nối tri thức; Tiếng Anh Global Success 3, Fun for Flyers); Lucas lớp 1 (câu rất ngắn, tự đọc to).
- Nhân vật luôn là mặt thật: img/lucie.webp, img/lucas.webp (games/anh-chung/mat-that.js: MatThat.url(c), MatThat.dan(head, c, opts)).
- Tiền thưởng trong nhà là "CIECAS" (đọc "ci cát"), đổi quà ở games/cua-hang/ (bố mẹ duyệt ở games/cua-hang/bo-me/).

## 2. Cấu trúc kho
- index.html: trang chủ. Mảng `GAMES` (game mới thêm lên ĐẦU, `isNew: true`, bỏ isNew của game trước), bảng `CUPS` (đếm cúp mỗi game).
  Lưới 3 ô mỗi hàng; Cửa hàng luôn ở cuối mảng.
- thanh-tich/index.html: Bảng thành tích (đọc `giaDinh_nhatKy`, bảng tên game `duaxe: "...", ...`), chỉnh giới hạn giờ chơi.
- games/<ten-game>/index.html: MỖI GAME MỘT TỆP (HTML + CSS + JS). Hiện có: lucie-lucas, dao-kho-bau-toan-hoc, tho-mo-nhi, dua-xe,
  lucas-racing, rung-chuong-vang, duoi-hinh-bat-chu, hoi-lang-ca-dao, fun-for-flyers, sach-truyen, ky-nang, dua-thuyen, cua-hang.
- tc/index.html: tay cầm điện thoại cho game Đua Thuyền (chơi trên TV, mỗi bé một điện thoại).
- theo-doi-gemini/index.html: trang theo dõi token Claude và Gemini, lượt dùng từng tài khoản.
- tools/tv-lg/: mã app TV LG (webOS) chỉ mở trang chủ; không cần sửa khi thêm game.
- manifest.webmanifest, sw.js: ứng dụng cài được (mọi trang có link manifest + đăng ký /sw.js).

## 3. Tệp dùng chung games/anh-chung/ (game nào cũng phải nạp)
- dong-bo.js: ĐẦU <head>. Đồng bộ localStorage giữa các máy qua Google Apps Script (mã nguồn tools/dong-bo-apps-script.gs).
- dem-gio.js (defer): đồng hồ giờ chơi mỗi ngày (mặc định Lucie 45, Lucas 30 phút), hết giờ màn "nghỉ mắt", bố mẹ giải phép nhân để thêm 15 phút.
  Game cho hai bé chơi cùng lúc thì đặt `window.DEM_GIO_HAI_BE = true` trước khi nạp.
- giong-noi.js: thay giọng máy bằng giọng VieNeu-TTS đọc sẵn. Cứ gọi speechSynthesis bình thường (vi-VN; câu tiếng Anh en-US).
  Câu tiếng Việt nằm sẵn trong mã game sẽ được máy chủ đọc trước (workflow doc-giong.yml). Câu ghép động thì tạm dùng giọng máy.
- nhac-nen.js: nhạc nền (data-ten, data-bpm, data-goc, data-kieu, data-not, data-vitri).
- anh-that.js: đổi emoji thành ảnh thật (bảng anh-nguon.json); phần tử có data-giu-icon thì giữ nguyên.
- mat-that.js, thong-tin.js.

## 4. Quy tắc làm game
- Chơi tốt trên TV (màn ngang, phím mũi tên/OK, phím 1-4 chọn đáp án) và điện thoại (chạm).
- Mỗi câu hỏi có nút "🔊 Đọc"; lượt của Lucas tự đọc.
- Ghi kết quả: localStorage `giaDinh_nhatKy` mảng {t, g: mã game, c: "lucie"|"lucas", s: môn, q: câu hỏi, ok}. Cúp: `<maGame>_<lucie|lucas>`.
- Lưu ván đang dở, vào lại tự chơi tiếp (hoặc nút "Chơi tiếp").
- Kiểm tra kỹ phép tính, mỗi câu đúng 1 đáp án, đáp án sai hợp lý, câu hợp lứa tuổi. Không nhân vật/thương hiệu có bản quyền. Không ghi "Sách Cánh Diều".
- Tranh minh họa: ghi games/<ten-game>/anh-nguon.json ({"mã": {"ai": "mô tả tiếng Anh", "seed": n}} hoặc {"t": "bài Wikipedia"});
  máy chủ (lay-anh.yml) tự vẽ/tải về anh/<mã>.webp. Trong game luôn có đường lui khi chưa có ảnh (không để khung trống).
- Tự chạy thử trước khi đưa lên (mở trang, chơi hết một ván, không lỗi console).

## 5. Việc tự động trên máy chủ GitHub (.github/workflows) — không cần ai bật máy
- doc-giong.yml: đọc giọng VieNeu cho mọi câu trong game và truyện (mỗi đêm + khi sửa game).
- lay-anh.yml: lấy/vẽ ảnh minh họa theo anh-nguon.json (mỗi đêm).
- ve-tranh.yml: vẽ bù tranh Sách truyện bằng FLUX miễn phí (mỗi đêm).
- nhan-tranh.yml: 20 phút/lần kéo tranh Gemini (tab vẽ gửi qua Firebase) về kho; có GEMINI_API_KEY thì soát lỗi trước, tranh lỗi ghi vào *-ve-lai.
- xuong-gemini.yml: gọi Gemini API làm việc theo tệp xuong/viec/*.json (cần secret GEMINI_API_KEY).
- gia-han-tv.yml: thứ Hai hằng tuần gia hạn Developer Mode của TV LG (để app không bị xóa).

## 6. Dữ liệu trên Firebase Realtime Database
Gốc: https://lucie-lucas-ciecas-default-rtdb.asia-southeast1.firebasedatabase.app/gd_hh1g8b83gym1g74zmily/
- argon/lan (sổ lượt Gemini: e, t, tok, viec, phien, kq), argon/tk (tài khoản: tt, ve:"duoc"), argon/claude (sổ token Claude).
- phong/dt_<mã> (tay cầm Đua Thuyền), sach-truyen-tai / ky-nang-tai (tranh chờ nhận), sach-truyen-ve-lai / ky-nang-ve-lai (tranh cần vẽ lại), ví CIECAS của cửa hàng.

## 7. Sách truyện nói và Trường Kỹ Năng
- Sách truyện: games/sach-truyen/truyen/tuan-XX.json. Thêm truyện bằng tools/them_truyen.py (định dạng ghi ở đầu tệp đó); 2 ngày phát 1 truyện,
  luôn làm sẵn trước ~10 truyện. Mỗi truyện: tiêu đề, bìa, 5-8 trang, bài học, 3 câu hỏi riêng Lucie, 3 câu riêng Lucas, lời chúc ngủ ngon.
- Tranh có hai bé: vẽ bằng Nano Banana Pro trong AI Studio (tools/gemini-trinh-duyet.js, tools/gemini-ky-nang.js chạy trong Chrome),
  theo bảng nhân vật games/sach-truyen/anh/nhan-vat.webp. Lỗi hay gặp: vẽ Lucas hai lần, Lucas đeo kính (chỉ Lucie đeo kính hồng).
- Trường Kỹ Năng (games/ky-nang): bài học kỹ năng mềm, mỗi bài 5 trang tranh + câu hỏi kiểm tra, nhận CIECAS.

## 8. Đưa lên
- Commit thẳng vào main (anh không duyệt PR), tác giả "Nguyễn Hoàng Ngọc Anh" <ngocanhbtg88@gmail.com>, lời commit tiếng Việt.
- Không xóa tệp trong games/anh-chung/giong/, anh/, games/*/anh/ (máy chủ tạo).
- GitHub Pages cập nhật sau ~1 phút; TV, điện thoại tự thấy bản mới.
