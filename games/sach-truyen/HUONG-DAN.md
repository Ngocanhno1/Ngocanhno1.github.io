# Quy trình Sách truyện nói (Claude chạy theo lịch hằng tuần, anh không cần làm gì)

Nhịp phát: **2 ngày 1 truyện** (trường "ngay" trong truyen/danh-sach.json; trang chỉ hiện truyện đã tới ngày, bố mẹ xem trước bằng `?xem=tat`).
Mục tiêu: luôn có sẵn **ít nhất 8 truyện chưa phát** (truyện viết trước ít nhất 1 tuần để máy chủ kịp đọc giọng và nghe lại).

Mỗi lần chạy:
1. Đếm truyện chưa tới ngày phát. Thiếu bao nhiêu so với 10 thì viết bấy nhiêu (thường 3-4 truyện).
   Chủ đề: lấy các dòng đầu chưa đánh [x] trong `chu-de.md` (bỏ chủ đề không hợp mùa).
2. **Gemini 4 Argon viết** (Chrome "Browser 1", AI Studio `.../prompts/new_chat?authuser=ngocanh220788@gmail.com&model=gemini-4-argon`),
   lệnh mẫu `nhap/LENH-GEMINI.txt` (thay số truyện và chủ đề). Không dùng Gemini Flash. Không có Chrome thì Claude tự viết đúng định dạng.
   Chuyển kết quả về kho KHÔNG qua máy chủ Claude: tách đoạn trả lời của Gemini thành window.__out, rồi làm như bước 4
   với nội dung `{"gemini-moi.txt": {"t": __out}}` và thư mục tải lên `games/sach-truyen/nhap`.
3. **Claude DUYỆT** (bắt buộc): chính tả, logic trước sau, an toàn cho trẻ (không việc nguy hiểm, không đáng sợ trước giờ ngủ),
   3 câu hỏi Lucie (lớp 3) và 3 câu hỏi Lucas (lớp 1) KHÁC NHAU, mỗi câu đúng 1 đáp án có trong truyện; tranh không vẽ người.
   Sửa vào `nhap/truyen-XX-YY.txt`, chạy `python3 tools/them_truyen.py nhap/... ` (tự xếp ngày phát nối tiếp, tự kiểm tra lỗi).
   Đánh [x] chủ đề trong `chu-de.md`. Commit tác giả "Nguyễn Hoàng Ngọc Anh" <ngocanhbtg88@gmail.com>, rebase rồi push.
4. **Gemini Nano Banana Pro vẽ tranh** (không dùng trang vẽ miễn phí vì có chữ in mờ): làm theo `tools/gemini-trinh-duyet.js`
   (mỗi truyện 1 cuộc trò chuyện mới, 7 tranh: bìa + 6 trang; chạy được 2 tab song song). Tranh tải thẳng lên
   `games/sach-truyen/anh/tuan-XX-bia.webp`, `tuan-XX-1.webp`... qua trang Upload của GitHub (Chrome đã đăng nhập Ngocanhno1).
   Kéo về, ghép bảng xem từng tranh (PIL) để loại tranh có người/chữ, vẽ lại tranh hỏng.
5. Máy chủ GitHub tự đọc giọng VieNeu (doc-giong.yml), rồi **tự nghe lại bằng Whisper và đọc lại câu bị lỗi** (tools/kiem_giong.py).
6. Báo anh 2-3 dòng: tên các truyện mới, ngày phát.
