/* Hệ thống 36 Cúp (Trophies) & Nâng cấp Tiến Độ Toàn Kho Game cho Lucie & Lucas */
(function (root) {
  if (root.TienDoVaCup) return;

  var DATA = null;
  var BASE = "/games/anh-chung/";
  var sanSang = fetch(BASE + "huy-chuong-va-tien-do.json")
    .then(function (r) { return r.json(); })
    .then(function (d) { DATA = d; return d; })
    .catch(function () { return null; });

  function khoa(be) { return "ll_tiendo_cup_" + (be || "lucie"); }

  function tai(be) {
    var def = {
      man_cao_nhat: {},
      combo_max: 0,
      streak: 0,
      truyen_da_doc: 0,
      nhiem_vu_cho: 0,
      dung_cong_cu: 0,
      tong_ciecas: 0,
      cup_da_mo: {}
    };
    try {
      var raw = JSON.parse(localStorage.getItem(khoa(be)) || "null");
      if (raw) return Object.assign(def, raw);
    } catch (e) {}
    return def;
  }

  function luu(be, st) {
    localStorage.setItem(khoa(be), JSON.stringify(st));
  }

  function tinhTongMan(st) {
    var t = 0;
    Object.keys(st.man_cao_nhat || {}).forEach(function (g) { t += (st.man_cao_nhat[g] || 0); });
    return t;
  }

  function kiemTraCup(be, st) {
    if (!DATA || !DATA.trophies) return [];
    var moi = [];
    var tongMan = tinhTongMan(st);
    var soGame50 = Object.keys(st.man_cao_nhat || {}).filter(function (g) { return (st.man_cao_nhat[g] || 0) >= 50; }).length;

    DATA.trophies.forEach(function (tr) {
      if (st.cup_da_mo[tr.id]) return;
      var dk = tr.dieu_kien, dat = false;
      if (dk.loai === "tong_man") dat = tongMan >= dk.gia_tri;
      else if (dk.loai === "man_game") dat = (st.man_cao_nhat[dk.game] || 0) >= dk.gia_tri;
      else if (dk.loai === "combo_max") dat = (st.combo_max || 0) >= dk.gia_tri;
      else if (dk.loai === "streak") dat = (st.streak || 0) >= dk.gia_tri;
      else if (dk.loai === "truyen_da_doc") dat = (st.truyen_da_doc || 0) >= dk.gia_tri;
      else if (dk.loai === "nhiem_vu_cho") dat = (st.nhiem_vu_cho || 0) >= dk.gia_tri;
      else if (dk.loai === "dung_cong_cu") dat = (st.dung_cong_cu || 0) >= dk.gia_tri;
      else if (dk.loai === "tong_ciecas") dat = (st.tong_ciecas || 0) >= dk.gia_tri;
      else if (dk.loai === "so_game_dat_50") dat = soGame50 >= dk.gia_tri;
      else if (dk.loai === "so_cup") dat = Object.keys(st.cup_da_mo).length >= dk.gia_tri;

      if (dat) {
        st.cup_da_mo[tr.id] = Date.now();
        moi.push(tr);
      }
    });
    return moi;
  }

  root.TienDoVaCup = {
    sanSang: sanSang,
    capNhatMan: function (be, maGame, soMan, comboDatDuoc) {
      var st = tai(be);
      if (!st.man_cao_nhat[maGame] || soMan > st.man_cao_nhat[maGame]) {
        st.man_cao_nhat[maGame] = soMan;
      }
      if (comboDatDuoc && comboDatDuoc > st.combo_max) st.combo_max = comboDatDuoc;
      var moi = kiemTraCup(be, st);
      luu(be, st);
      return { cupMoi: moi, tongMan: tinhTongMan(st) };
    },
    ghiChiSo: function (be, truong, congThem, ghiDe) {
      var st = tai(be);
      st[truong] = ghiDe ? congThem : (st[truong] || 0) + (congThem || 1);
      var moi = kiemTraCup(be, st);
      luu(be, st);
      return { cupMoi: moi };
    },
    tomTat: function (be) {
      var st = tai(be);
      var tongMan = tinhTongMan(st);
      var tongMucTieu = 400; // 100 (Thợ Mỏ) + 6*50 (6 game)
      var capHienTai = { cap: 1, ten: "Tân Binh Nhí", mau: "#64748b" };
      if (DATA && DATA.cap_bac) {
        DATA.cap_bac.forEach(function (c) {
          if (tongMan >= c.man_toi_thieu) capHienTai = c;
        });
      }
      return {
        tongMan: tongMan,
        phanTramTong: Math.min(100, Math.round((tongMan / tongMucTieu) * 100)),
        soCupDaMo: Object.keys(st.cup_da_mo).length,
        tongSoCup: DATA && DATA.trophies ? DATA.trophies.length : 36,
        capBac: capHienTai,
        manTheoGame: st.man_cao_nhat
      };
    }
  };
})(window);
