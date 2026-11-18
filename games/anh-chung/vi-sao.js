/* Ví sao của Lucie & Lucas — dùng chung cho trang chủ, Bảng thành tích và Cửa hàng đổi sao.
   - Sao kiếm từ MỌI game: cứ N câu trả lời đúng (nhật ký giaDinh_nhatKy) = 1 sao; mỗi cúp mới giành = M sao.
   - Đếm dần (nhớ mốc thời gian đã đếm), nên nhật ký có bị cắt bớt thì sao đã kiếm vẫn còn nguyên.
   - Cúp: chỉ cộng phần cúp MỚI so với số cúp cao nhất từng thấy, xoá tiến độ game cũng không mất sao.
   - Đổi quà: con gửi yêu cầu → sao bị giữ lại → bố mẹ duyệt (trao quà) hoặc từ chối (trả sao).
   Lưu ở localStorage["cuaHang_v1"] và đồng bộ lên Firebase (kho chung của gia đình), nên TV, điện thoại,
   máy tính đều thấy cùng một ví: con xin đổi quà trên TV, bố mẹ duyệt trên điện thoại.
   Mỗi máy chỉ ghi phần CIECAS mình đếm được (thietBi/<mã máy>), yêu cầu và điều chỉnh ghi theo từng mã riêng,
   nên hai máy cùng lúc không đè lên nhau. Mất mạng thì vẫn chạy bằng bản trên máy, có mạng lại tự gộp. */
(function () {
  if (window.ViSao) return;
  var KEY = "cuaHang_v1";
  var KIDS = ["lucie", "lucas"];
  var QUA_MAC_DINH = [
    { id: "q1", icon: "🎡", ten: "Một buổi đi công viên", gia: 100, cho: "ca" },
    { id: "q2", icon: "📚", ten: "Một cuốn truyện mới", gia: 200, cho: "ca" },
    { id: "q3", icon: "🍦", ten: "Một que kem", gia: 30, cho: "ca" },
    { id: "q4", icon: "📺", ten: "Thêm 15 phút xem hoạt hình", gia: 25, cho: "ca" },
    { id: "q5", icon: "🍕", ten: "Cả nhà đi ăn pizza", gia: 160, cho: "ca" },
    { id: "q6", icon: "🏊", ten: "Một buổi đi bơi", gia: 120, cho: "ca" },
    { id: "q7", icon: "🎬", ten: "Đi xem phim ở rạp", gia: 240, cho: "ca" },
    { id: "q8", icon: "🧸", ten: "Một món đồ chơi con chọn", gia: 300, cho: "ca" }
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
    duaxe: function (c) { return (rd("duaXe_" + c) || {}).vang || 0; },
    kynang: function (c) { return (rd("kynang_" + c) || {}).cup || 0; },
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
    var v = s.vi[c], tieu = 0, cong = 0, may = s.mayKhac || {};
    Object.keys(may).forEach(function (k) { cong += (may[k] && +may[k][c]) || 0; });
    s.don.forEach(function (d) { if (d.c === c && d.tt !== "tuchoi") tieu += d.gia; });
    s.dieuChinh.forEach(function (d) { if (d.c === c) cong += d.n; });
    return v.kiem + cong - tieu;
  }
  function homNay(s, c) { return s.vi[c].ngay[dayKey(Date.now())] || 0; }
  function quaCua(s, c) { return s.qua.filter(function (q) { return q.cho === "ca" || q.cho === c; }); }
  function mucTieu(s, c) { var id = s.vi[c].mucTieu; return s.qua.filter(function (q) { return q.id === id; })[0] || null; }

  /* ---------- Đồng bộ Firebase (Realtime Database, REST) ---------- */
  var MAY_CHU = "https://lucie-lucas-ciecas-default-rtdb.asia-southeast1.firebasedatabase.app/gd_hh1g8b83gym1g74zmily/cuaHang";
  var MAY = localStorage.getItem("cuaHang_may");
  if (!MAY) { MAY = "m" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); try { localStorage.setItem("cuaHang_may", MAY); } catch (e) {} }
  var nghe = [], dangDong = false, henGio = null, lanCuoi = "";
  function moc(x) { return (x && (x.sua || x.t)) || 0; }
  function dcId(d) { return d.id || ("dc" + d.t + d.c); }
  function obj(a) { var o = {}; (a || []).forEach(function (x) { if (x && x.id) o[x.id] = x; }); return o; }
  function mang(o) { if (!o) return []; return (Array.isArray(o) ? o : Object.keys(o).map(function (k) { return o[k]; })).filter(Boolean); }

  function dongBoMay() {
    if (dangDong) { henGio = henGio || setTimeout(function () { henGio = null; dongBoMay(); }, 1500); return Promise.resolve(); }
    dangDong = true;
    return fetch(MAY_CHU + ".json", { cache: "no-store" }).then(function (r) { if (!r.ok) throw r.status; return r.json(); }).then(function (C) {
      C = C || {};
      var s = doc(), vua = {}, doi = false;
      // yêu cầu đổi quà: lấy bản sửa sau cùng
      var dL = obj(s.don), dC = C.don || {};
      Object.keys(dC).forEach(function (id) { if (!dL[id] || moc(dC[id]) > moc(dL[id])) { dL[id] = dC[id]; doi = true; } });
      Object.keys(dL).forEach(function (id) { if (!dC[id] || moc(dL[id]) > moc(dC[id])) vua["don/" + id] = dL[id]; });
      s.don = mang(dL).sort(function (a, b) { return a.t - b.t; });
      // bố mẹ thưởng / bớt
      var cL = {}; s.dieuChinh.forEach(function (d) { d.id = dcId(d); cL[d.id] = d; });
      var cC = C.dieuChinh || {};
      Object.keys(cC).forEach(function (id) { if (!cL[id]) { cL[id] = cC[id]; doi = true; } });
      Object.keys(cL).forEach(function (id) { if (!cC[id]) vua["dieuChinh/" + id] = cL[id]; });
      s.dieuChinh = mang(cL).sort(function (a, b) { return a.t - b.t; });
      // danh sách quà, cách tính, mã số bố mẹ: bản sửa sau cùng thắng
      if (C.qua && (C.qua.sua || 0) > (s.suaQua || 0)) { s.qua = mang(C.qua.ds); s.suaQua = C.qua.sua; doi = true; }
      else if (!C.qua || (s.suaQua || 0) > (C.qua.sua || 0)) { s.suaQua = s.suaQua || 1; vua.qua = { sua: s.suaQua, ds: s.qua }; }
      if (C.cauHinh && (C.cauHinh.sua || 0) > (s.suaCH || 0)) { s.cauHinh = C.cauHinh.v; s.suaCH = C.cauHinh.sua; doi = true; }
      else if (!C.cauHinh || (s.suaCH || 0) > (C.cauHinh.sua || 0)) { s.suaCH = s.suaCH || 1; vua.cauHinh = { sua: s.suaCH, v: s.cauHinh }; }
      KIDS.forEach(function (c) {
        var mt = (C.mucTieu || {})[c], v = s.vi[c];
        if (mt && (mt.sua || 0) > (v.suaMt || 0)) { v.mucTieu = mt.id || null; v.suaMt = mt.sua; doi = true; }
        else if ((v.suaMt || 0) > ((mt && mt.sua) || 0)) vua["mucTieu/" + c] = { id: v.mucTieu || null, sua: v.suaMt };
      });
      // CIECAS các máy khác đếm được
      var tb = C.thietBi || {}, khac = {};
      Object.keys(tb).forEach(function (k) { if (k !== MAY && tb[k]) khac[k] = { lucie: +tb[k].lucie || 0, lucas: +tb[k].lucas || 0 }; });
      if (JSON.stringify(khac) !== JSON.stringify(s.mayKhac || {})) doi = true;
      s.mayKhac = khac;
      var cua = tb[MAY] || {};
      if (cua.lucie !== s.vi.lucie.kiem || cua.lucas !== s.vi.lucas.kiem)
        vua["thietBi/" + MAY] = { lucie: s.vi.lucie.kiem, lucas: s.vi.lucas.kiem, t: Date.now(), ua: (navigator.userAgent || "").slice(0, 60) };
      luuTho(s);
      var gui = Object.keys(vua).length ? fetch(MAY_CHU + ".json", { method: "PATCH", body: JSON.stringify(vua) }) : null;
      var dau = JSON.stringify([s.don, s.dieuChinh, s.qua, s.cauHinh, s.mayKhac, s.vi.lucie.mucTieu, s.vi.lucas.mucTieu]);
      if (doi || dau !== lanCuoi) { lanCuoi = dau; nghe.forEach(function (f) { try { f(s); } catch (e) {} }); }
      window.ViSao.daNoi = true;
      return gui;
    }).catch(function () { window.ViSao.daNoi = false; }).then(function () { dangDong = false; });
  }
  function luuTho(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  // Lưu trên máy rồi đẩy lên kho chung (gom lại, 0,8 giây/lần)
  var hen2 = null;
  function luuVaGui(s) { luuTho(s); clearTimeout(hen2); hen2 = setTimeout(dongBoMay, 800); }
  function khiDoi(f) { nghe.push(f); }
  function tuDong(giay) { dongBoMay(); setInterval(function () { if (!document.hidden) dongBoMay(); }, (giay || 15) * 1000);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) dongBoMay(); }); }

  window.ViSao = { KEY: KEY, KIDS: KIDS, MAY: MAY, doc: doc, luu: luuVaGui, dongBo: dongBo, dongBoMay: dongBoMay, khiDoi: khiDoi, tuDong: tuDong,
    soDu: soDu, homNay: homNay, quaCua: quaCua, mucTieu: mucTieu, dayKey: dayKey };
})();
