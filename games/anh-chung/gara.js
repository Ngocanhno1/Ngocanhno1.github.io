/* Gara nâng cấp xe & thuyền của Lucie và Lucas — dùng chung cho các game đua.
   Điểm mỗi lượt đua được cộng vào "ví điểm" của từng bé (chung cho xe và thuyền).
   Dùng điểm để đổi xe/thuyền cấp cao hơn: to hơn, hoành tráng hơn, nhanh hơn.
   API: Gara.cong(be, diem) · Gara.hienTai(be, loai) · Gara.heSo(be, loai) · Gara.mo(be, loai, xong) · Gara.svg(be, loai, cap) */
(function () {
  const GIA = [0, 800, 1600, 2600, 3800, 5200, 6800, 8600, 10600, 13000];
  const TEN = {
    lucas: {
      xe: ["Xe Kart Tí Hon", "Xe Đua Sấm Xanh", "Xe Đua Ngọn Lửa", "Xe Thể Thao Rồng Lục", "Siêu Xe Tia Laze", "Xe Đua Vàng Ánh Kim", "Siêu Xe Bão Tố", "Siêu Xe Có Cánh", "Xe Tên Lửa Vũ Trụ", "Siêu Xe Huyền Thoại"],
      thuyen: ["Thuyền Phao Nhỏ", "Ca Nô Sóng Xanh", "Xuồng Máy Ngọn Lửa", "Tàu Lướt Cá Mập", "Tàu Cao Tốc Tia Chớp", "Tàu Phản Lực Vàng", "Siêu Tàu Hai Thân", "Siêu Tàu Có Cánh", "Tàu Tên Lửa Đại Dương", "Siêu Hạm Huyền Thoại"]
    },
    lucie: {
      xe: ["Xe Hoa Nhỏ Xinh", "Xe Công Chúa Hồng", "Xe Bướm Lấp Lánh", "Xe Ngọc Trai", "Cỗ Xe Vương Miện", "Cỗ Xe Pha Lê", "Xe Thiên Nga Trắng", "Xe Cánh Tiên", "Xe Kỳ Lân Cầu Vồng", "Lâu Đài Nữ Hoàng"],
      thuyen: ["Thuyền Lá Sen", "Thuyền Vỏ Sò", "Thuyền Hoa Hồng", "Thuyền Ngọc Trai", "Thuyền Vương Miện", "Du Thuyền Pha Lê", "Thuyền Thiên Nga", "Thuyền Cánh Tiên", "Thuyền Kỳ Lân", "Cung Điện Nổi Nữ Hoàng"]
    }
  };
  const MAU = {
    lucas: [["#64748b", "#e2e8f0"], ["#2563eb", "#93c5fd"], ["#ea580c", "#fde047"], ["#16a34a", "#bbf7d0"], ["#0891b2", "#f0abfc"], ["#ca8a04", "#fef08a"], ["#4f46e5", "#22d3ee"], ["#dc2626", "#fbbf24"], ["#111827", "#38bdf8"], ["#7c3aed", "#facc15"]],
    lucie: [["#f9a8d4", "#ffffff"], ["#ec4899", "#fde68a"], ["#a855f7", "#f5d0fe"], ["#e0e7ff", "#f9a8d4"], ["#f472b6", "#facc15"], ["#67e8f9", "#ffffff"], ["#fafafa", "#f9a8d4"], ["#c084fc", "#a7f3d0"], ["#fb7185", "#93c5fd"], ["#d946ef", "#fde047"]]
  };
  const DAC_BIET = [
    "Xe khởi đầu",
    "Sọc đua, nhanh hơn một chút",
    "Cánh gió sau, bám đường hơn",
    "Hoa văn rực rỡ, tăng tốc mạnh hơn",
    "Vương miện/đèn neon, khởi đầu với thêm Nitro",
    "Bánh xe phát sáng",
    "Có vệt sao lấp lánh phía sau",
    "Mọc đôi cánh lớn",
    "Gắn động cơ tên lửa, Nitro đầy hơn",
    "Hào quang cầu vồng — nhanh nhất!"
  ];
  const be = b => (b === "lucie" ? "lucie" : "lucas");
  const KEY = b => "gara_" + be(b);
  function doc(b) {
    let o; try { o = JSON.parse(localStorage.getItem(KEY(b))); } catch (e) {}
    o = o || {}; o.diem = o.diem || 0; o.tong = o.tong || 0;
    ["xe", "thuyen"].forEach(l => { o[l] = o[l] || { mo: 0, dung: 0 }; });
    return o;
  }
  function ghi(b, o) { try { localStorage.setItem(KEY(b), JSON.stringify(o)); } catch (e) {} }
  function spec(b, loai, cap) {
    b = be(b); loai = loai === "thuyen" ? "thuyen" : "xe";
    const [mau, mau2] = MAU[b][cap];
    return { cap, ten: TEN[b][loai][cap], gia: GIA[cap], mau, mau2, to: 1 + cap * 0.05, toc: 1 + cap * 0.04, nitro: 0.35 + cap * 0.06, dacBiet: DAC_BIET[cap], be: b, loai };
  }
  function hienTai(b, loai) { const o = doc(b); return spec(b, loai, Math.min(9, o[loai === "thuyen" ? "thuyen" : "xe"].dung || 0)); }

  /* ----- tranh vẽ SVG (nhìn ngang) ----- */
  function svg(b, loai, cap, w) {
    const s = spec(b, loai, cap), L = s.be === "lucie", c = s.mau, c2 = s.mau2;
    const W = 200, H = 120; let g = "";
    const sao = (x, y, r, col) => { let p = ""; for (let i = 0; i < 10; i++) { const a = Math.PI / 5 * i - Math.PI / 2, rr = i % 2 ? r * 0.45 : r; p += (i ? "L" : "M") + (x + rr * Math.cos(a)).toFixed(1) + " " + (y + rr * Math.sin(a)).toFixed(1); } return `<path d="${p}Z" fill="${col}"/>`; };
    const tim = (x, y, r, col) => `<path d="M${x} ${y + r * .9}C${x - r * 1.6} ${y - r * .2} ${x - r * .6} ${y - r * 1.3} ${x} ${y - r * .4}C${x + r * .6} ${y - r * 1.3} ${x + r * 1.6} ${y - r * .2} ${x} ${y + r * .9}Z" fill="${col}"/>`;
    const k = 0.72 + cap * 0.03; // xe to dần
    if (cap >= 9) g += `<defs><linearGradient id="cv${b}${loai}" x1="0" x2="1"><stop offset="0" stop-color="#f87171"/><stop offset=".25" stop-color="#facc15"/><stop offset=".5" stop-color="#4ade80"/><stop offset=".75" stop-color="#60a5fa"/><stop offset="1" stop-color="#c084fc"/></linearGradient></defs><ellipse cx="100" cy="64" rx="96" ry="50" fill="none" stroke="url(#cv${b}${loai})" stroke-width="6" opacity=".8"/>`;
    g += `<g transform="translate(100 66) scale(${k}) translate(-100 -66)">`;
    if (cap >= 6) for (let i = 0; i < 4; i++) g += sao(8 + i * 9, 52 + (i % 2) * 14, 4.5 - i * 0.6, "#fde047");
    if (cap >= 7) g += `<path d="M95 52 Q70 8 30 14 Q55 30 60 52Z" fill="${c2}" stroke="#fff" stroke-width="2" opacity=".95"/><path d="M110 52 Q92 18 62 22 Q80 36 82 52Z" fill="#fff" opacity=".6"/>`;
    if (cap >= 8) g += `<rect x="18" y="58" width="24" height="12" rx="5" fill="#94a3b8"/><path d="M18 60 L2 64 L18 68Z" fill="#fb923c"/><path d="M18 62 L8 64 L18 66Z" fill="#fde047"/>`;
    if (loai !== "thuyen") {
      const den = cap >= 5 ? c2 : "#111827";
      if (L) {
        g += `<path d="M30 78 Q30 50 60 46 Q78 22 110 22 Q142 22 152 46 Q178 50 176 78Z" fill="${c}" stroke="#fff" stroke-width="3"/>`;
        g += `<path d="M78 46 Q86 30 108 30 Q130 30 136 46Z" fill="#bfdbfe" stroke="#fff" stroke-width="2"/>`;
        if (cap >= 1) g += `<path d="M34 70 H172" stroke="${c2}" stroke-width="5" stroke-linecap="round"/>`;
        if (cap >= 2) g += `<path d="M150 40 q14 -12 20 2 q-14 6 -20 -2Z" fill="${c2}"/><path d="M150 40 q14 12 22 2" fill="none" stroke="#fff" stroke-width="2"/>`;
        if (cap >= 3) [56, 100, 144].forEach(x => g += tim(x, 60, 6, cap >= 5 ? "#fde047" : "#fff"));
        if (cap >= 4) g += `<path d="M92 22 L96 8 L104 16 L110 4 L116 16 L124 8 L128 22Z" fill="#facc15" stroke="#ca8a04" stroke-width="1.5"/><circle cx="110" cy="6" r="2.5" fill="#f472b6"/>`;
      } else {
        g += `<path d="M22 80 L26 62 Q40 56 70 54 L92 36 Q110 32 130 38 L150 54 Q176 56 182 66 L184 80Z" fill="${c}" stroke="#fff" stroke-width="3"/>`;
        g += `<path d="M96 40 Q110 36 126 41 L140 54 H88Z" fill="#bfdbfe" stroke="#fff" stroke-width="2"/>`;
        if (cap >= 1) g += `<path d="M26 68 H182" stroke="${c2}" stroke-width="6"/>`;
        if (cap >= 2) g += `<path d="M22 60 V44 H46 V50 H30 V60Z" fill="${c2}" stroke="#fff" stroke-width="2"/>`;
        if (cap >= 3) g += `<path d="M150 58 q-12 -10 -24 0 q8 -2 10 6 q-10 -6 -18 2 q14 0 32 -8Z" fill="#fde047"/><path d="M168 60 q-10 -8 -18 0 q8 -2 10 5Z" fill="#fb923c"/>`;
        if (cap >= 4) g += `<path d="M60 76 H160" stroke="#22d3ee" stroke-width="3" opacity=".9"/>`;
      }
      [[58, 82], [150, 82]].forEach(([x, y]) => { g += `<circle cx="${x}" cy="${y}" r="${15 + cap * 0.6}" fill="#1f2937"/><circle cx="${x}" cy="${y}" r="${7 + cap * 0.3}" fill="${cap >= 5 ? c2 : "#e5e7eb"}"/>`; if (cap >= 5) g += `<circle cx="${x}" cy="${y}" r="${18 + cap * 0.6}" fill="none" stroke="${c2}" stroke-width="2" opacity=".6"/>`; });
      void den;
    } else {
      g += `<path d="M10 96 Q100 110 190 96" stroke="#7dd3fc" stroke-width="5" fill="none"/>`;
      if (L) {
        g += `<path d="M24 70 Q100 104 182 70 Q170 92 100 96 Q36 92 24 70Z" fill="${c}" stroke="#fff" stroke-width="3"/>`;
        if (cap >= 2) g += `<path d="M168 70 Q186 46 172 34 Q160 40 168 52" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`;
        if (cap >= 1) g += `<path d="M100 72 V22" stroke="#a16207" stroke-width="4"/><path d="M102 24 Q138 44 102 66Z" fill="${c2}" stroke="#fff" stroke-width="2"/>`;
        if (cap >= 3) [60, 140].forEach(x => g += tim(x, 82, 6, "#fff"));
        if (cap >= 4) g += `<path d="M90 22 L93 12 L98 18 L102 8 L106 18 L111 12 L114 22Z" fill="#facc15"/>`;
        if (cap >= 5) g += `<rect x="54" y="56" width="36" height="18" rx="8" fill="#fff" opacity=".85"/><circle cx="64" cy="64" r="4" fill="#93c5fd"/><circle cx="78" cy="64" r="4" fill="#93c5fd"/>`;
      } else {
        g += `<path d="M18 66 H186 L172 90 Q100 100 34 90Z" fill="${c}" stroke="#fff" stroke-width="3"/>`;
        if (cap >= 1) g += `<path d="M22 76 H180" stroke="${c2}" stroke-width="5"/>`;
        g += `<path d="M70 66 L84 46 H130 L144 66Z" fill="#e2e8f0" stroke="#fff" stroke-width="2"/><path d="M90 50 H126 L134 62 H84Z" fill="#93c5fd"/>`;
        if (cap >= 2) g += `<path d="M112 46 V28" stroke="#475569" stroke-width="3"/><path d="M112 28 L132 33 L112 38Z" fill="${c2}"/>`;
        if (cap >= 3) g += `<rect x="10" y="58" width="12" height="22" rx="3" fill="#334155"/><path d="M4 90 q-6 -6 0 -10" stroke="#fff" stroke-width="3" fill="none"/>`;
        if (cap >= 5) g += `<path d="M86 46 L94 34 H124 L130 46Z" fill="${c2}" stroke="#fff" stroke-width="2"/>`;
        if (cap >= 6) g += `<path d="M30 92 Q100 104 172 92" stroke="#fff" stroke-width="3" fill="none"/>`;
      }
    }
    g += `</g>`;
    return `<svg viewBox="0 0 ${W} ${H}" width="${w || W}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${g}</svg>`;
  }

  /* ----- cộng điểm sau mỗi lượt đua ----- */
  function cong(b, diem) {
    diem = Math.max(0, Math.round(diem || 0));
    const o = doc(b); o.diem += diem; o.tong += diem; ghi(b, o);
    return { diem: o.diem, them: diem, coTheDoi: ["xe", "thuyen"].some(l => o[l].mo < 9 && o.diem >= GIA[o[l].mo + 1]) };
  }
  function the(b, diem) { // dòng chữ ngắn để chèn vào màn kết thúc
    const o = doc(b), l = o.xe.mo <= o.thuyen.mo ? "xe" : "thuyen", n = Math.min(9, o[l].mo + 1);
    const con = o[l].mo >= 9 ? "" : (o.diem >= GIA[n] ? " · Đủ điểm đổi " + TEN[be(b)][l][n] + "!" : " · Còn " + (GIA[n] - o.diem) + " điểm nữa đổi " + TEN[be(b)][l][n]);
    return `🏁 +${diem} điểm vào Gara · Đang có ${o.diem} điểm${con}`;
  }

  /* ----- cửa sổ Gara ----- */
  let css = false;
  function moCss() {
    if (css) return; css = true;
    const st = document.createElement("style");
    st.textContent = `#garaNen{position:fixed;inset:0;z-index:99999;background:rgba(15,23,42,.92);display:flex;flex-direction:column;align-items:center;font-family:system-ui,sans-serif;color:#fff;overflow:auto;padding:2vh 2vw}
#garaNen h2{margin:.4em 0 .1em;font-size:clamp(22px,3vw,40px)}#garaNen .vi{font-size:clamp(16px,2vw,26px);margin-bottom:1vh}
#garaNen .tab{display:flex;gap:10px;margin-bottom:1.2vh}#garaNen .tab button,#garaNen .dong{font:inherit;font-size:clamp(15px,1.8vw,22px);border:0;border-radius:14px;padding:.4em 1em;background:#334155;color:#fff;cursor:pointer}
#garaNen .tab button.on{background:#f59e0b;color:#111}
#garaNen .luoi{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:1.2vw;width:min(1500px,96vw)}
#garaNen .o{background:#1e293b;border:4px solid #334155;border-radius:18px;padding:.6vw;text-align:center;font:inherit;color:#fff;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:2px}
#garaNen .o svg{width:100%;height:auto}#garaNen .o b{font-size:clamp(13px,1.3vw,19px)}#garaNen .o small{font-size:clamp(11px,1vw,14px);opacity:.85;min-height:2.4em}
#garaNen .o .gia{font-weight:800;font-size:clamp(13px,1.2vw,18px)}#garaNen .o.khoa{filter:grayscale(.85) brightness(.6)}#garaNen .o.co{border-color:#22c55e}#garaNen .o.dung{border-color:#f59e0b;box-shadow:0 0 18px #f59e0b}
#garaNen .o:focus,#garaNen button:focus{outline:5px solid #fde047;outline-offset:2px}
#garaNen .tb{min-height:1.6em;font-size:clamp(15px,1.8vw,24px);margin:1vh 0;color:#fde047;text-align:center}
@media (max-width:700px){#garaNen .luoi{grid-template-columns:repeat(2,1fr)}}`;
    document.head.appendChild(st);
  }
  function noi(t) { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(t); u.lang = "vi-VN"; speechSynthesis.speak(u); } catch (e) {} }
  function amThanh(ok) { try { const A = new (window.AudioContext || window.webkitAudioContext)(); (ok ? [523, 659, 784, 1047] : [220, 180]).forEach((f, i) => { const o = A.createOscillator(), g = A.createGain(); o.type = "triangle"; o.frequency.value = f; g.gain.setValueAtTime(.15, A.currentTime + i * .12); g.gain.exponentialRampToValueAtTime(.001, A.currentTime + i * .12 + .3); o.connect(g).connect(A.destination); o.start(A.currentTime + i * .12); o.stop(A.currentTime + i * .12 + .35); }); setTimeout(() => A.close(), 1500); } catch (e) {} }

  function mo(b, loai, xong) {
    moCss(); b = be(b); loai = loai === "thuyen" ? "thuyen" : "xe";
    const cu = document.getElementById("garaNen"); if (cu) cu.remove();
    const nen = document.createElement("div"); nen.id = "garaNen"; document.body.appendChild(nen);
    const tenBe = (window.HS && HS[b] && (HS[b].goi || HS[b].ten)) || (b === "lucie" ? "Lucie" : "Lucas");
    function ve(tb) {
      const o = doc(b), st = o[loai];
      nen.innerHTML = `<h2>🔧 Gara của ${tenBe}</h2><div class="vi">⭐ Ví điểm: <b>${o.diem}</b> điểm</div>
<div class="tab"><button data-l="xe" class="${loai === "xe" ? "on" : ""}">🏎️ Xe đua</button><button data-l="thuyen" class="${loai === "thuyen" ? "on" : ""}">🚤 Thuyền</button></div>
<div class="luoi">${GIA.map((g, i) => { const s = spec(b, loai, i), da = i <= st.mo, ke = i === st.mo + 1, du = ke && o.diem >= g;
        return `<button class="o ${i === st.dung ? "dung" : da ? "co" : "khoa"}" data-i="${i}">${svg(b, loai, i)}<b>${i + 1}. ${s.ten}</b><small>${s.dacBiet} · Tốc độ +${Math.round((s.toc - 1) * 100)}%</small><span class="gia">${i === st.dung ? "✅ Đang dùng" : da ? "Bấm để dùng" : ke ? (du ? "🔓 Đổi " + g + " điểm" : "🔒 " + g + " điểm") : "🔒 Mở xe trước đã"}</span></button>`; }).join("")}</div>
<div class="tb">${tb || ""}</div><button class="dong">⬅ Quay lại</button>`;
      nen.querySelectorAll(".tab button").forEach(x => x.onclick = () => { loai = x.dataset.l; ve(); nen.querySelector(".tab .on").focus(); });
      nen.querySelector(".dong").onclick = dong;
      nen.querySelectorAll(".o").forEach(x => x.onclick = () => chon(+x.dataset.i));
      const f = nen.querySelector(`.o[data-i="${Math.min(9, st.mo + 1)}"]`) || nen.querySelector(".o"); f && f.focus();
    }
    function chon(i) {
      const o = doc(b), st = o[loai], s = spec(b, loai, i);
      if (i <= st.mo) { st.dung = i; ghi(b, o); ve("Đã chọn " + s.ten + "!"); noi(tenBe + " lái " + s.ten); return; }
      if (i > st.mo + 1) { amThanh(false); ve("Con cần mở lần lượt từng chiếc nhé!"); return; }
      if (o.diem < s.gia) { amThanh(false); const t = "Con cần thêm " + (s.gia - o.diem) + " điểm nữa. Đua tiếp nào!"; ve(t); noi(t); return; }
      o.diem -= s.gia; st.mo = i; st.dung = i; ghi(b, o); amThanh(true);
      const t = "Tuyệt vời! " + tenBe + " đã đổi được " + s.ten + "!"; ve("🎉 " + t); noi(t);
    }
    function dong() { removeEventListener("keydown", phim, true); nen.remove(); if (xong) try { xong(hienTai(b, loai)); } catch (e) {} }
    function phim(e) {
      if (!document.getElementById("garaNen")) return;
      const ds = [...nen.querySelectorAll("button")], i = ds.indexOf(document.activeElement);
      if (e.key === "Escape" || e.key === "Backspace" || e.keyCode === 10009 || e.keyCode === 461) { e.preventDefault(); e.stopPropagation(); dong(); return; }
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); if (i >= 0) ds[i].click(); return; }
      if (!e.key.startsWith("Arrow")) return;
      e.preventDefault(); e.stopPropagation();
      if (i < 0) { ds[0].focus(); return; }
      const r = ds[i].getBoundingClientRect(), dx = { ArrowLeft: -1, ArrowRight: 1 }[e.key] || 0, dy = { ArrowUp: -1, ArrowDown: 1 }[e.key] || 0;
      let best = null, bd = 1e9;
      ds.forEach((x, j) => { if (j === i) return; const q = x.getBoundingClientRect(), vx = (q.left + q.width / 2) - (r.left + r.width / 2), vy = (q.top + q.height / 2) - (r.top + r.height / 2);
        if ((dx && Math.sign(vx) === dx && Math.abs(vy) < r.height * .6) || (dy && Math.sign(vy) === dy)) { const d = Math.abs(vx) * (dy ? 3 : 1) + Math.abs(vy) * (dx ? 3 : 1); if (d < bd) { bd = d; best = x; } } });
      if (best) best.focus();
    }
    addEventListener("keydown", phim, true);
    ve();
  }

  window.Gara = { GIA, spec, hienTai, heSo: (b, l) => hienTai(b, l).toc, cong, the, mo, svg, doc };
})();
