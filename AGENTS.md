# Hướng dẫn cho trợ lý AI làm việc trên kho này (Jules / Gemini / Claude)

Trang game học tập của hai bé, chạy trên GitHub Pages: https://ngocanhno1.github.io
Chủ kho: anh Nguyễn Hoàng Ngọc Anh (gọi là "anh", rất ít rành kỹ thuật: làm hết, báo ngắn gọn bằng tiếng Việt).

## Hai bé (lấy từ games/anh-chung/thong-tin.js, không ghi cứng)
- Lucie = Nguyễn Ngọc Tường San, lớp 3A6. Lucas = Nguyễn Ngọc Tường Minh, lớp 1A5. Trường TH&THCS Chu Văn An.
- Câu hỏi: Lucie theo chương trình lớp 3 (GDPT 2018, Kết nối tri thức; Tiếng Anh Global Success 3 / Fun for Flyers), Lucas lớp 1.
- Nhân vật luôn là mặt thật của hai bé: img/lucie.webp, img/lucas.webp (dùng games/anh-chung/mat-that.js). Không dùng chân dung AI khác cho hai bé.

## Cấu trúc
- index.html: trang chủ, mảng `GAMES` (game mới thêm lên đầu, `isNew: true`), bảng `CUPS` (cúp từng game).
- thanh-tich/index.html: Bảng thành tích (đọc localStorage `giaDinh_nhatKy`, bảng tên game).
- games/<ten-game>/index.html: mỗi game MỘT tệp HTML (HTML + CSS + JS). Three.js r128 từ cdnjs nếu cần 3D, luôn có bản 2D dự phòng.
- games/anh-chung/: tệp dùng chung, mọi game phải nạp:
  - dong-bo.js (đặt đầu <head>): đồng bộ bản lưu giữa các máy.
  - dem-gio.js (defer): đồng hồ giờ chơi mỗi ngày.
  - giong-noi.js: giọng đọc tiếng Việt tự nhiên (VieNeu-TTS đọc sẵn trên máy chủ). Cứ gọi speechSynthesis như thường.
  - nhac-nen.js: nhạc nền (data-ten, data-bpm, data-goc, data-kieu, data-not).
  - anh-that.js: đổi emoji thành ảnh thật; mat-that.js; thong-tin.js.
- Mỗi trang có link manifest.webmanifest và đăng ký /sw.js.
- tools/: kịch bản máy chủ (doc_giong.py, lay_anh.py, nhan_tranh.py...). .github/workflows/: việc tự động (giọng đọc, ảnh, nhận tranh, gia hạn TV).

## Quy tắc khi làm game
- Giao diện cho TV (màn ngang, điều khiển bằng phím mũi tên/OK, phím 1-4 chọn đáp án) và điện thoại.
- Mỗi câu hỏi có nút "🔊 Đọc"; lượt của Lucas tự đọc.
- Ghi kết quả: localStorage `giaDinh_nhatKy` mảng {t, g: mã game, c: "lucie"|"lucas", s: môn, q: câu hỏi, ok}. Cúp lưu riêng `<maGame>_<lucie|lucas>`.
- Có lưu ván đang dở và tự chơi tiếp khi vào lại.
- Kiểm tra kỹ mọi phép tính, mỗi câu đúng 1 đáp án, đáp án sai hợp lý. Không dùng nhân vật/thương hiệu có bản quyền.
- Không dùng tên "Sách Cánh Diều" trong game.

## Đưa lên
- Commit trực tiếp vào nhánh main (anh không duyệt PR được), tác giả "Nguyễn Hoàng Ngọc Anh" <ngocanhbtg88@gmail.com>, lời commit tiếng Việt.
- Không xóa tệp trong games/anh-chung/giong/ và anh/ (do máy chủ tạo).
- Sau khi đưa lên: game mới chơi ở https://ngocanhno1.github.io/games/<ten-game>/ (GitHub Pages cập nhật sau ~1 phút).
