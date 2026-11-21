/* Bộ chuẩn hóa văn nói tiếng Việt trước khi đọc (VieNeu-TTS & Web Speech)
   Dùng chung cho mọi game & sách truyện của Lucie & Lucas.
   Nguyên tắc: Mọi chuỗi tiếng Việt đều đi qua chuanHoaVanNoi(text) TRƯỚC KHI
   tách câu, tính mã hash FNV-1a tra danh-sach.json, hoặc phát âm thanh.
*/
(function (root) {
  function chuanHoaVanNoi(text) {
    if (!text) return "";
    var s = String(text).normalize("NFC");

    // 1. Bỏ emoji / ký hiệu trang trí không đọc được
    s = s.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\uFE0F\u200D]/gu, " ");

    // 2. Dấu ngăn cách hàng nghìn kiểu Việt (VD: 3.600 -> 3600, 12.000đ -> 12000đ)
    s = s.replace(/(^|[^\d])(\d{1,3}(?:\.\d{3})+)(?!\d)/g, function (_, pre, num) {
      return pre + num.replace(/\./g, "");
    });

    // 3. Mũi tên và khoảng số (VD: 13–19 -> từ 13 đến 19, 1→5 -> từ 1 đến 5)
    s = s.replace(/(\d+)\s*[→➡]\s*(\d+)/g, "từ $1 đến $2");
    s = s.replace(/\s*[→➡]\s*/g, ", suy ra ");
    s = s.replace(/(\d+)\s*[–—]\s*(\d+)/g, "từ $1 đến $2");

    // 4. Đơn vị đo & tiền tệ đi sau số (Unicode-safe, không dính chữ có dấu như "lỗi", "mét")
    s = s.replace(/(\d+)\s*°\s*C(?![\p{L}\p{N}])/giu, "$1 độ xê");
    s = s.replace(/(\d+)\s*%/g, "$1 phần trăm");
    s = s.replace(/(\d+)\s*km(?![\p{L}\p{N}])/giu, "$1 ki lô mét");
    s = s.replace(/(\d+)\s*dm(?![\p{L}\p{N}])/giu, "$1 đề xi mét");
    s = s.replace(/(\d+)\s*cm(?![\p{L}\p{N}])/giu, "$1 xăng ti mét");
    s = s.replace(/(\d+)\s*mm(?![\p{L}\p{N}])/giu, "$1 mi li mét");
    s = s.replace(/(\d+)\s*kg(?![\p{L}\p{N}])/giu, "$1 ki lô gam");
    s = s.replace(/(\d+)\s*ml(?![\p{L}\p{N}])/giu, "$1 mi li lít");
    s = s.replace(/(\d+)\s*m(?![\p{L}\p{N}])/gu, "$1 mét");
    s = s.replace(/(\d+)\s*g(?![\p{L}\p{N}])/gu, "$1 gam");
    s = s.replace(/(\d+)\s*l(?![\p{L}\p{N}])/gu, "$1 lít");
    s = s.replace(/(\d+)\s*h\s*(\d{1,2})(?!\d)/giu, "$1 giờ $2 phút");
    s = s.replace(/(\d+)\s*h(?![\p{L}\p{N}])/giu, "$1 giờ");
    s = s.replace(/(\d+)\s*(?:VNĐ|VND|đ)(?![\p{L}\p{N}])/giu, "$1 đồng");

    // 5. Phép tính & ký hiệu toán học
    s = s.replace(/(\d+)\s*[×xX\*]\s*(\d+)/g, "$1 nhân $2");
    s = s.replace(/(\d+)\s*[÷:]\s*(\d+)/g, "$1 chia $2");
    s = s.replace(/(\d+)\s*\+\s*(\d+)/g, "$1 cộng $2");
    s = s.replace(/(\d+)\s*[\-−]\s*(\d+)/g, "$1 trừ $2");
    s = s.replace(/\s*=\s*\?/g, " bằng mấy?");
    s = s.replace(/\s*=\s*(?:_{2,}|\.{3,})/g, " bằng mấy");
    s = s.replace(/\s*=\s*/g, " bằng ");
    s = s.replace(/\s*>\s*/g, " lớn hơn ");
    s = s.replace(/\s*<\s*/g, " bé hơn ");
    s = s.replace(/_{2,}/g, " chỗ trống ");

    // 6. Tên riêng, thuật ngữ game & từ viết tắt sang văn nói tiếng Việt
    var tuDien = [
      [/(?<![\p{L}\p{N}])Fun\s+for\s+Flyers(?![\p{L}\p{N}])/giu, "Phăn pho Flai ơ"],
      [/(?<![\p{L}\p{N}])Lucie(?![\p{L}\p{N}])/giu, "Lu Xi"],
      [/(?<![\p{L}\p{N}])Lucas(?![\p{L}\p{N}])/giu, "Lu Cát"],
      [/(?<![\p{L}\p{N}])CIECAS(?![\p{L}\p{N}])/giu, "Xi Cát"],
      [/(?<![\p{L}\p{N}])do_kho(?![\p{L}\p{N}])/giu, "độ khó"],
      [/(?<![\p{L}\p{N}])level\s*(\d+)(?!\d)/giu, "màn $1"],
      [/(?<![\p{L}\p{N}])lv\.?\s*(\d+)(?!\d)/giu, "màn $1"],
      [/(?<![\p{L}\p{N}])level(?![\p{L}\p{N}])/giu, "màn"],
      [/(?<![\p{L}\p{N}])game(?![\p{L}\p{N}])/giu, "trò chơi"],
      [/(?<![\p{L}\p{N}])combo(?![\p{L}\p{N}])/giu, "chuỗi đúng liên tiếp"],
      [/(?<![\p{L}\p{N}])HK1(?![\p{L}\p{N}])/gu, "học kỳ một"],
      [/(?<![\p{L}\p{N}])HK2(?![\p{L}\p{N}])/gu, "học kỳ hai"]
    ];
    for (var i = 0; i < tuDien.length; i++) {
      s = s.replace(tuDien[i][0], tuDien[i][1]);
    }

    // 7. Làm mượt dấu ngoặc & dấu gạch dưới kỹ thuật thành nhịp nghỉ tự nhiên
    s = s.replace(/_/g, " ");
    s = s.replace(/\s*\(\s*/g, ", ");
    s = s.replace(/\s*\)\s*/g, ", ");
    s = s.replace(/["“”'‘’\[\]«»*]/g, "");

    // 8. Dọn dấu phẩy/khoảng trắng thừa
    s = s.replace(/\s+([.,!?;:])/g, "$1");
    s = s.replace(/,\s*([.,!?;:])/g, "$1");
    s = s.replace(/([.!?;:])\s*,/g, "$1 ");
    s = s.replace(/\s+/g, " ").trim();
    s = s.replace(/^,\s*|\s*,$/g, "").trim();

    return s;
  }

  root.chuanHoaVanNoi = chuanHoaVanNoi;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { chuanHoaVanNoi: chuanHoaVanNoi };
  }
})(typeof window !== "undefined" ? window : globalThis);
