# Quy trình truyện mới hằng tuần (Claude chạy theo lịch, anh không cần làm gì)

1. Lấy chủ đề đầu tiên chưa đánh [x] trong `chu-de.md`. Số tuần = số truyện lớn nhất trong `truyen/danh-sach.json` + 1.
2. Giao Gemini 4 Argon viết (Chrome "Browser 1", AI Studio
   `https://aistudio.google.com/prompts/new_chat?authuser=ngocanh220788@gmail.com&model=gemini-4-argon`;
   dán lệnh vào textarea bằng JavaScript, bấm Run, chờ hết nút Stop, lấy chữ bằng get_page_text).
   Lệnh mẫu: đúng như `nhap/LENH-GEMINI.txt` (thay SỐ TUẦN và CHỦ ĐỀ). Không có Chrome thì Claude tự viết, đúng định dạng đó.
   Không dùng Gemini Flash.
3. Claude DUYỆT trước khi đưa lên (bắt buộc): chính tả, logic trước sau từng trang, an toàn cho trẻ (không khuyến khích việc nguy hiểm,
   không bạo lực, không sợ hãi trước giờ ngủ), câu hỏi có đúng 1 đáp án đúng và đáp án nằm trong truyện, tranh không vẽ người,
   không chữ lạ, không nhân vật có bản quyền. Sửa thẳng vào bản nháp `nhap/tuan-XX.txt`.
4. `python3 tools/them_truyen.py games/sach-truyen/nhap/tuan-XX.txt XX` (script tự kiểm tra lần nữa; báo CHƯA ĐẠT thì sửa rồi chạy lại).
5. Đánh [x] chủ đề trong `chu-de.md`. Commit tác giả "Nguyễn Hoàng Ngọc Anh" <ngocanhbtg88@gmail.com>, rebase rồi push.
   Máy chủ GitHub tự vẽ tranh (lay-anh.yml) và đọc giọng VieNeu (doc-giong.yml).
6. Báo anh 2-3 dòng: tên truyện, bài học, link https://ngocanhno1.github.io/games/sach-truyen/
