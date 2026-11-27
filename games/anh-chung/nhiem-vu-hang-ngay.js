/* Hệ thống Nhiệm vụ Hằng ngày & Chuỗi Ngày Chăm Chỉ (Streak) cho Lucie & Lucas
   Tăng hứng thú quay lại chơi mỗi ngày và liên thông thưởng xu CIECAS.
*/
(function (root) {
  if (root.NhiemVuNgay) return;

  function homNay() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }

  function khoa(be) { return "ll_nv_ngay_" + (be || "lucie"); }

  var MAU_NV = [
    { id: "choi_1_man", ten: "Hoàn thành 1 màn chơi bất kỳ", mucTieu: 1, thuong: 5 },
    { id: "dung_5_cau", ten: "Trả lời đúng 5 câu hỏi", mucTieu: 5, thuong: 5 },
    { id: "doc_1_bai",  ten: "Nghe 1 truyện hoặc 1 bài kỹ năng", mucTieu: 1, thuong: 10 }
  ];

  function tai(be) {
    var ngay = homNay();
    var raw = null;
    try { raw = JSON.parse(localStorage.getItem(khoa(be)) || "null"); } catch (e) {}
    if (!raw || raw.ngay !== ngay) {
      var streak = (raw && raw.streak) ? raw.streak : 0;
      if (raw && raw.ngay) {
        var diff = Math.round((new Date(ngay) - new Date(raw.ngay)) / 86400000);
        // Cho phép nghỉ tối đa 2 ngày (khiên bảo vệ cuối tuần) không bị mất chuỗi!
        if (diff > 2) streak = 0;
      }
      raw = {
        ngay: ngay,
        streak: streak,
        daTangStreakHomNay: false,
        tienDo: { choi_1_man: 0, dung_5_cau: 0, doc_1_bai: 0 },
        daNhan: {}
      };
      localStorage.setItem(khoa(be), JSON.stringify(raw));
    }
    return raw;
  }

  function luu(be, data) {
    localStorage.setItem(khoa(be), JSON.stringify(data));
  }

  root.NhiemVuNgay = {
    danhSach: function (be) {
      var st = tai(be);
      return MAU_NV.map(function (m) {
        var ht = st.tienDo[m.id] || 0;
        return {
          id: m.id,
          ten: m.ten,
          hienTai: Math.min(ht, m.mucTieu),
          mucTieu: m.mucTieu,
          thuong: m.thuong,
          xong: ht >= m.mucTieu,
          daNhan: !!st.daNhan[m.id]
        };
      });
    },
    layStreak: function (be) { return tai(be).streak; },
    ghiNhan: function (be, loai, soLuong) {
      var st = tai(be);
      st.tienDo[loai] = (st.tienDo[loai] || 0) + (soLuong || 1);
      var vuaXong = [];
      MAU_NV.forEach(function (m) {
        if ((st.tienDo[m.id] || 0) >= m.mucTieu && !st.daNhan[m.id]) {
          st.daNhan[m.id] = true;
          vuaXong.push(m);
        }
      });
      if (!st.daTangStreakHomNay) {
        st.streak += 1;
        st.daTangStreakHomNay = true;
      }
      luu(be, st);
      return { vuaXong: vuaXong, streak: st.streak };
    }
  };
})(window);
