Viết MỘT tệp JavaScript thuần (không thư viện, không import) tên boss.js cho game giáo dục khối vuông "Thợ Mỏ Nhí" của trẻ em (chơi trên TV bằng phím mũi tên/OK/phím 1-4 và trên điện thoại bằng chạm). Chỉ trả về MỘT khối ```javascript ... ``` chứa toàn bộ mã, không giải thích, không viết "...".

Mã tạo đối tượng toàn cục window.BossFight với hàm:
BossFight.start(opts) với opts = {
  child: "lucie" | "lucas",
  faceUrl: chuỗi URL ảnh khuôn mặt thật của bé (dán lên đầu nhân vật khối vuông),
  man: số màn 1-10, bai: số bài 1-20,
  soCau: số câu phải trả lời (3 đến 22),
  cauHoi: mảng soCau phần tử {mon, q, dung, sai:[3 chuỗi], giai},
  mauAo: mã màu CSS áo nhân vật, mauCuoc: mã màu CSS cây cuốc/kiếm,
  noi: function(text, lang) đọc to (lang "vi-VN" hoặc "en-US"),
  amThanh: {hit(), hurt(), win(), wrong()} (có thể thiếu hàm, phải kiểm tra trước khi gọi),
  tuDoc: true/false (true thì tự đọc câu hỏi khi hiện),
  onDone: function(ketQua) với ketQua = {thang: true/false, dung: số câu đúng, tong: soCau, ds: [{q, ok}]}
}

YÊU CẦU GIAO DIỆN (một lớp phủ toàn màn hình, z-index 9000, phông 'Baloo 2', system-ui):
- NỬA TRÊN (khoảng 50% chiều cao, trên điện thoại 42%): một <canvas> vẽ cảnh đấu trường kiểu khối vuông pixel: nền trời và nền đất đổi màu theo màn (10 bảng màu: rừng xanh, sa mạc, núi tuyết, rừng rậm, đáy biển, núi lửa, xứ kẹo, hang pha lê, mặt trăng, thiên hà). Bên trái là nhân vật bé (khối vuông: thân áo mauAo, chân, tay cầm cuốc màu mauCuoc, đầu khối vuông có dán ảnh faceUrl bo góc). Bên phải là QUÁI VẬT khối vuông TỰ THIẾT KẾ (KHÔNG dùng quái vật, nhân vật, tên của game có bản quyền), mỗi màn một con khác nhau, con sau to hơn và ngầu hơn nhưng dễ thương, không đáng sợ: 1 Slime Lá Xanh, 2 Bọ Cạp Cát, 3 Người Tuyết Khổng Lồ, 4 Khỉ Đá Rừng Rậm, 5 Bạch Tuộc Biển Sâu, 6 Rồng Dung Nham Con, 7 Gấu Kẹo Dẻo, 8 Golem Pha Lê, 9 Robot Mặt Trăng, 10 Vua Thiên Hà (boss cuối có vương miện). Vẽ bằng các ô vuông pixel, có mắt chớp, nhún nhảy liên tục.
- Mỗi bên có thanh máu (tim) với tên. Máu quái = soCau. Máu bé = 3 tim (Lucas 4 tim).
- Hoạt cảnh (dùng thời gian thật performance.now, requestAnimationFrame): trả lời ĐÚNG → nhân vật lao tới vung cuốc, tia sáng, số "-1" bay lên, quái rung và chớp trắng, hạt vụn khối vuông bắn ra, rung màn nhẹ. Trả lời SAI → quái lao tới húc, bé mất 1 tim, chớp đỏ. Hết máu quái → quái nổ thành nhiều khối nhỏ, pháo hoa, chữ "CHIẾN THẮNG!". Hết tim bé → chữ "Thử lại nhé!" (onDone thang false). Trả lời sai không đổi câu: chuyển câu tiếp theo; nếu hết mảng câu hỏi mà quái còn máu thì quay vòng lại các câu đã sai.
- NỬA DƯỚI: khung câu hỏi kiểu gỗ khối vuông (nền #3b2a1a, viền #1b120a): nhãn môn (Toán xanh dương, Tiếng Việt đỏ, Tiếng Anh xanh lá), tiến độ "Câu x/soCau", câu hỏi chữ to (clamp 18px-34px), 4 nút đáp án lưới 2x2 có số 1-4, nút "🔊 Đọc". Đáp án xáo trộn. Bấm đúng: nút xanh; sai: nút đỏ, nút đúng xanh, hiện dòng giải thích 1,6 giây rồi sang câu.
- Điều khiển: phím 1-4 chọn; mũi tên di chuyển ô đang chọn (viền vàng) trong lưới 2x2; Enter/OK chọn; chạm cũng được. Câu hỏi có chữ Latin nhiều (Tiếng Anh) thì đọc phần tiếng Anh bằng "en-US".
- Màn mở đầu 1,5 giây: chữ to "BOSS MÀN {man}: {tên quái}" trượt vào, quái gầm (hiệu ứng rung).
- Co giãn theo cửa sổ (resize), canvas sắc nét theo devicePixelRatio (tối đa 2), vẽ pixel không làm mờ.
- Sau onDone thì tự gỡ lớp phủ và bỏ mọi sự kiện phím đã gắn.
- Không ghi localStorage. Không lỗi console. Không dùng emoji làm hình (chỉ trong nút Đọc).
- Cuối tệp thêm: window.__bossTest = function(){ BossFight.start({child:"lucie",faceUrl:"",man:6,bai:20,soCau:3,cauHoi:[{mon:"Toán",q:"2 + 3 = ?",dung:"5",sai:["4","6","7"],giai:"2 + 3 = 5"},{mon:"Tiếng Việt",q:"Từ nào chỉ màu sắc?",dung:"Xanh",sai:["Chạy","Bàn","Nhanh"],giai:"Xanh là màu"},{mon:"Tiếng Anh",q:"'cat' là con gì?",dung:"Con mèo",sai:["Con chó","Con gà","Con cá"],giai:"cat = con mèo"}],mauAo:"#ff5fa8",mauCuoc:"#5decf5",noi:function(){},amThanh:{},tuDoc:false,onDone:function(k){window.__bossKQ=k}}) };
