/* Bộ 6 Công Cụ Trợ Giúp dùng chung cho mọi game Lucie & Lucas
   Tích hợp kho đồ riêng từng bé, trừ/cộng số lượng và liên thông ví xu CIECAS.
*/
(function (root) {
  if (root.CongCuGame) return;

  var MAC_DINH = {
    nam_muoi: 3,
    kinh_lup: 3,
    dong_bang: 2,
    khien_combo: 2,
    nhan_doi_xu: 1,
    bua_khoan_vang: 2
  };

  function khoa(be) { return "ll_cong_cu_" + (be || "lucie"); }

  function tai(be) {
    try {
      var raw = JSON.parse(localStorage.getItem(khoa(be)) || "null");
      if (raw) return Object.assign({}, MAC_DINH, raw);
    } catch (e) {}
    return Object.assign({}, MAC_DINH);
  }

  function luu(be, kho) {
    localStorage.setItem(khoa(be), JSON.stringify(kho));
  }

  root.CongCuGame = {
    xemKho: function (be) { return tai(be); },
    soLuong: function (be, id) { return tai(be)[id] || 0; },
    tangThem: function (be, id, sl) {
      var kho = tai(be);
      kho[id] = (kho[id] || 0) + (sl || 1);
      luu(be, kho);
      return kho[id];
    },
    dung: function (be, id) {
      var kho = tai(be);
      if (!kho[id] || kho[id] <= 0) return false;
      kho[id] -= 1;
      luu(be, kho);
      if (root.TienDoVaCup) root.TienDoVaCup.ghiChiSo(be, "dung_cong_cu", 1);
      if (root.AmThanhChung) root.AmThanhChung.xu();
      return true;
    },
    // Hàm tiện ích: thực hiện 50/50 trực tiếp trên mảng 4 nút đáp án (trả về 2 chỉ số cần ẩn)
    tinh5050: function (tongSoDapAn, chiSoDung) {
      var sai = [];
      for (var i = 0; i < tongSoDapAn; i++) {
        if (i !== chiSoDung) sai.push(i);
      }
      // Xáo trộn nhẹ và lấy 2 đáp án sai để ẩn
      for (var j = sai.length - 1; j > 0; j--) {
        var k = Math.floor(Math.random() * (j + 1));
        var tmp = sai[j]; sai[j] = sai[k]; sai[k] = tmp;
      }
      return sai.slice(0, 2);
    }
  };
})(window);
