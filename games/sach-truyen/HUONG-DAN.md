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
4. **Tranh: máy chủ GitHub tự vẽ** bằng mô hình mở FLUX.1-schnell chạy stable-diffusion.cpp (`.github/workflows/ve-tranh.yml`,
   `tools/ve_tranh_flux.py`): miễn phí, không giới hạn lượt, không chữ in mờ. Đẩy truyện lên là tự vẽ (mỗi truyện 1 máy, song song,
   khoảng 12-15 phút/tranh), đêm nào 0h41 cũng vẽ bù tranh còn thiếu. Tranh đã có (kể cả tranh Gemini vẽ) thì giữ nguyên.
   Kéo về, ghép bảng xem; tranh có người/chữ hoặc sai cảnh thì `git rm` để máy chủ vẽ lại.
   Tranh FLUX mang dấu "FLUX.1-schnell" trong tệp. **Mỗi chiều 15h37, Claude giao Gemini Nano Banana Pro vẽ lại** các tranh mang dấu
   này cho đẹp hơn (`tools/gemini-trinh-duyet.js`, truyện phát sớm làm trước, hết lượt trong ngày thì hôm sau làm tiếp).
   Tóm lại: FLUX lo cho đủ tranh ngay, Gemini thay dần bằng tranh đẹp hơn.
5. Máy chủ GitHub tự đọc giọng VieNeu (doc-giong.yml), rồi **tự nghe lại bằng Whisper và đọc lại câu bị lỗi** (tools/kiem_giong.py).
6. Báo anh 2-3 dòng: tên các truyện mới, ngày phát.
