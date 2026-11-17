/* Ví sao của Lucie & Lucas — dùng chung cho trang chủ, Bảng thành tích và Cửa hàng đổi sao.
   - Sao kiếm từ MỌI game: cứ N câu trả lời đúng (nhật ký giaDinh_nhatKy) = 1 sao; mỗi cúp mới giành = M sao.
   - Đếm dần (nhớ mốc thời gian đã đếm), nên nhật ký có bị cắt bớt thì sao đã kiếm vẫn còn nguyên.
   - Cúp: chỉ cộng phần cúp MỚI so với số cúp cao nhất từng thấy, xoá tiến độ game cũng không mất sao.
   - Đổi quà: con gửi yêu cầu → sao bị giữ lại → bố mẹ duyệt (trao quà) hoặc từ chối (trả sao).
   Mọi thứ lưu ở localStorage["cuaHang_v1"] trên chính máy đang chơi. */
(function () {
  if (window.ViSao) return;
  var KEY = "cuaHang_v1";
  var KIDS = ["lucie", "lucas"];
  var QUA_MAC_DINH = [
    { id: "q1", icon: "🎡", ten: "Một buổi đi công viên", gia: 50, cho: "ca" },
    { id: "q2", icon: "📚", ten: "Một cuốn truyện mới", gia: 100, cho: "ca" },
    { id: "q3", icon: "🍦", ten: "Một que kem", gia: 20, cho: "ca" },
    { id: "q4", icon: "📺", ten: "Thêm 15 phút xem hoạt hình", gia: 15, cho: "ca" },
    { id: "q5", icon: "🍕", ten: "Cả nhà đi ăn pizza", gia: 80, cho: "ca" },
    { id: "q6", icon: "🏊", ten: "Một buổi đi bơi", gia: 60, cho: "ca" },
    { id: "q7", icon: "🎬", ten: "Đi xem phim ở rạp", gia: 120, cho: "ca" },
    { id: "q8", icon: "🧸", ten: "Một món đồ chơi con chọn", gia: 150, cho: "ca" }
  ];
  function rd(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function dayKey(t) { var d = new Date(t); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate(); }

  // Số cúp hiện có của từng bé trong mỗi game (giống bảng CUPS ở trang chủ)
  var CUP = {
    phieuluu: function (c) { return (rd("lucieLucas_v3_" + c) || {}).trophies || 0; },
    rungchuong: function (c) { return (rd("rcv_thanhTich_" + c) || {}).thang || 0; },
    cadao: function (c) { return (rd("cadao_" + c) || {}).cup || 0; },
    daokhobau: function (c) { return ((rd("daoKhoBauToanHoc_v1") || {})[c] || {}).wins || 0; },
    flyers: function (c) { return (rd("flyers_" + c) || {}).khien || 0; },
    thomo: function (c) { return Object.keys(rd("thomo_cup_" + c) || {}).length; },
    duoihinh: function (c) { return Math.floor(((rd("dhbc_" + c) || {}).giai || []).length / 10); }
  };

  function moi() {
    var vi = {};
    KIDS.forEach(function (c) { vi[c] = { mocT: 0, du: 0, kiem: 0, cupMax: {}, ngay: {}, mucTieu: null }; });
    return { phienBan: 1, cauHinh: { cauMoiSao: 5, saoMoiCup: 2, pin: null }, qua: QUA_MAC_DINH.slice(), vi: vi, don: [], dieuChinh: [] };
  }
  function doc() {
    var s = rd(KEY);
    if (!s || !s.vi) s = moi();
    KIDS.forEach(function (c) { if (!s.vi[c]) s.vi[c] = moi().vi[c]; });
    s.don = s.don || []; s.dieuChinh = s.dieuChinh || []; s.qua = s.qua || [];
    return s;
  }
  function luu(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function congNgay(v, t, n) { var k = dayKey(t); v.ngay[k] = (v.ngay[k] || 0) + n;
    var ks = Object.keys(v.ngay); if (ks.length > 60) ks.slice(0, ks.length - 60).forEach(function (x) { delete v.ngay[x]; }); }

  // Đếm câu đúng và cúp mới kể từ lần trước, quy ra sao
  function dongBo() {
    var s = doc(), ch = s.cauHinh, log = rd("giaDinh_nhatKy") || [], now = Date.now();
    KIDS.forEach(function (c) {
      var v = s.vi[c], moc = v.mocT || 0, maxT = moc;
      log.forEach(function (e) {
        if (!e || e.c !== c || !e.t || e.t <= moc) return;
        if (e.t > maxT) maxT = e.t;
        if (!e.ok) return;
        v.du += 1;
        if (v.du >= ch.cauMoiSao) { var n = Math.floor(v.du / ch.cauMoiSao); v.du -= n * ch.cauMoiSao; v.kiem += n; congNgay(v, e.t, n); }
      });
      v.mocT = maxT;
      Object.keys(CUP).forEach(function (g) {
        var n = 0; try { n = CUP[g](c) || 0; } catch (e) {}
        var cu = v.cupMax[g] || 0;
        if (n > cu) { var them = (n - cu) * ch.saoMoiCup; v.kiem += them; congNgay(v, now, them); v.cupMax[g] = n; }
      });
    });
    luu(s);
    return s;
  }

  function soDu(s, c) {
    var v = s.vi[c], tieu = 0, cong = 0;
    s.don.forEach(function (d) { if (d.c === c && d.tt !== "tuchoi") tieu += d.gia; });
    s.dieuChinh.forEach(function (d) { if (d.c === c) cong += d.n; });
    return v.kiem + cong - tieu;
  }
  function homNay(s, c) { return s.vi[c].ngay[dayKey(Date.now())] || 0; }
  function quaCua(s, c) { return s.qua.filter(function (q) { return q.cho === "ca" || q.cho === c; }); }
  function mucTieu(s, c) { var id = s.vi[c].mucTieu; return s.qua.filter(function (q) { return q.id === id; })[0] || null; }

  window.ViSao = { KEY: KEY, KIDS: KIDS, doc: doc, luu: luu, dongBo: dongBo, soDu: soDu, homNay: homNay, quaCua: quaCua, mucTieu: mucTieu, dayKey: dayKey };
})();
