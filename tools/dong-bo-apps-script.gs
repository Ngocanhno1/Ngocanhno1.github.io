/** Đồng bộ bản lưu game Lucie & Lucas giữa các máy (không cần cấp quyền Google).
 *  Lưu trong Script Properties: 'm|<khóa>' = {"t":thời điểm,"n":số mảnh (-1 = đã xóa)}, 'c|<khóa>|<i>' = mảnh giá trị.
 *  GET  -> {ok, luu:{khóa:{v,t}}}     POST {muc:[{k,v,t}]} -> ghi mục mới hơn. */
var MANH = 8000;
function P_() { return PropertiesService.getScriptProperties(); }
function traVe_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function docHet_() {
  var all = P_().getProperties(), out = {};
  Object.keys(all).forEach(function (mk) {
    if (mk.indexOf('m|') !== 0) return;
    var k = mk.slice(2), m = JSON.parse(all[mk]), v = null;
    if (m.n >= 0) { v = ''; for (var i = 0; i < m.n; i++) v += all['c|' + k + '|' + i] || ''; }
    out[k] = { v: v, t: m.t };
  });
  return out;
}
function doGet(e) { return traVe_({ ok: true, luu: docHet_() }); }
function doPost(e) {
  var lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    var body = JSON.parse(e.postData.contents || '{}'), p = P_(), ghi = 0;
    (body.muc || []).forEach(function (it) {
      if (!it || !it.k) return;
      var k = String(it.k), t = Number(it.t) || Date.now(), cu = p.getProperty('m|' + k), mc = cu ? JSON.parse(cu) : null;
      if (mc && mc.t >= t) return;
      if (mc) for (var i = 0; i < mc.n; i++) p.deleteProperty('c|' + k + '|' + i);
      var moi = {}, n = -1;
      if (it.v !== null && it.v !== undefined) {
        var v = String(it.v); n = Math.max(1, Math.ceil(v.length / MANH));
        for (var j = 0; j < n; j++) moi['c|' + k + '|' + j] = v.substr(j * MANH, MANH);
      }
      moi['m|' + k] = JSON.stringify({ t: t, n: n });
      p.setProperties(moi); ghi++;
    });
    return traVe_({ ok: true, ghi: ghi });
  } finally { lock.releaseLock(); }
}
