"""Xưởng Gemini: chạy trên máy chủ GitHub, không cần Chrome, không cần máy anh bật.

Cách dùng (Claude làm):
  1. Ghi một tệp việc vào xuong/viec/<ten-viec>.json rồi đẩy lên GitHub:
       {
         "viec": "Game đua thuyền",           # tên việc, trùng tên Claude ghi sổ để trang so sánh ngang
         "de": "Đề bài đầy đủ cho Gemini...",   # hoặc "de_tep": "xuong/de/ten.md"
         "ra": "games/dua-thuyen/index.html",   # nơi lưu kết quả
         "loai": "html",                        # "html" (chạy thử tự động) hoặc "chu" (văn bản, JSON)
         "sua_toi_da": 2                        # số lần tự gửi lỗi lại cho Gemini sửa
       }
  2. Máy chủ GitHub tự gọi Gemini Argon qua API, lưu kết quả, chạy thử (với html),
     gặp lỗi thì tự gửi lỗi lại cho Gemini sửa, rồi ghi sổ token chính xác lên trang theo dõi.
  3. Kết quả: tệp ở "ra" và biên bản ở xuong/xong/<ten-viec>.json.

Cần khóa GEMINI_API_KEY (đã bật thanh toán) cất trong Secrets của kho.
"""
import json, os, re, subprocess, sys, time, urllib.request, pathlib

KHOA = os.environ.get("GEMINI_API_KEY", "")
MO_HINH = os.environ.get("GEMINI_MODEL", "gemini-4-argon")
SO_SACH = "https://lucie-lucas-ciecas-default-rtdb.asia-southeast1.firebasedatabase.app/gd_hh1g8b83gym1g74zmily/argon"
GOC = pathlib.Path(__file__).resolve().parent.parent
QUY_TAC_HTML = ("QUY TẮC TRẢ LỜI: chỉ trả về MỘT khối mã HTML hoàn chỉnh (từ <!DOCTYPE html> đến </html>), "
                "không giải thích, không rút gọn, không viết '...'. Mã phải chạy ngay, không lỗi console.\n\n")


def goi_gemini(noi_dung):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MO_HINH}:generateContent?key={KHOA}"
    than = json.dumps({"contents": [{"role": "user", "parts": [{"text": noi_dung}]}]}).encode()
    for lan in range(4):
        try:
            req = urllib.request.Request(url, than, {"Content-Type": "application/json"})
            with urllib.request.urlopen(req, timeout=900) as r:
                d = json.load(r)
            chu = "".join(p.get("text", "") for p in d["candidates"][0]["content"]["parts"] if not p.get("thought"))
            u = d.get("usageMetadata", {})
            return chu, {
                "vao": u.get("promptTokenCount", 0),
                "ra": u.get("candidatesTokenCount", 0) + u.get("thoughtsTokenCount", 0),
                "tong": u.get("totalTokenCount", 0),
            }
        except Exception as e:  # lỗi mạng hay quá tải thì chờ rồi thử lại
            print("Gemini lỗi:", e, file=sys.stderr)
            time.sleep(30 * (lan + 1))
    raise SystemExit("Gemini không trả lời sau 4 lần thử")


def lay_ma(chu, loai):
    if loai != "html":
        m = re.search(r"```(?:json|\w+)?\n(.*?)```", chu, re.S)
        return m.group(1) if m else chu
    m = re.search(r"<!DOCTYPE html>.*</html>", chu, re.S | re.I)
    return m.group(0) if m else chu


def chay_thu(tep):
    """Mở trang bằng trình duyệt ảo 8 giây, trả về danh sách lỗi."""
    kq = subprocess.run(["node", str(GOC / "tools/xuong_chay_thu.js"), str(tep)], capture_output=True, text=True, timeout=180)
    try:
        return json.loads(kq.stdout.strip().splitlines()[-1])
    except Exception:
        return [kq.stderr[-500:] or "Không chạy thử được"]


def ghi_so(viec, tok, ket_qua):
    ban_ghi = {"e": "api@gemini", "t": int(time.time() * 1000), "tok": tok["tong"], "vao": tok["vao"], "ra": tok["ra"],
               "viec": viec, "phien": viec, "kq": ket_qua, "nguon": "api"}
    try:
        req = urllib.request.Request(SO_SACH + "/lan.json", json.dumps(ban_ghi).encode(), method="POST")
        urllib.request.urlopen(req, timeout=30).read()
    except Exception as e:
        print("Không ghi được sổ:", e, file=sys.stderr)


def lam_viec(tep_viec):
    v = json.loads(tep_viec.read_text(encoding="utf-8"))
    ten = tep_viec.stem
    loai = v.get("loai", "html")
    de = v.get("de") or (GOC / v["de_tep"]).read_text(encoding="utf-8")
    ra = GOC / v["ra"]
    ra.parent.mkdir(parents=True, exist_ok=True)
    tong = {"vao": 0, "ra": 0, "tong": 0}
    loi = []
    chu, tok = goi_gemini((QUY_TAC_HTML if loai == "html" else "") + de)
    for k in tong: tong[k] += tok[k]
    ma = lay_ma(chu, loai)
    for lan_sua in range(int(v.get("sua_toi_da", 2)) + 1):
        ra.write_text(ma, encoding="utf-8")
        if loai != "html":
            break
        loi = chay_thu(ra)
        print(f"{ten}: lần {lan_sua + 1}, {len(loi)} lỗi")
        if not loi or lan_sua == int(v.get("sua_toi_da", 2)):
            break
        chu, tok = goi_gemini(QUY_TAC_HTML + "Mã dưới đây có lỗi khi chạy:\n" + "\n".join(loi[:15]) +
                              "\n\nSửa hết lỗi, trả lại TOÀN BỘ file đã sửa.\n\n" + ma)
        for k in tong: tong[k] += tok[k]
        ma = lay_ma(chu, loai)
    ghi_so(v.get("viec", ten), tong, "ok")
    xong = GOC / "xuong/xong" / f"{ten}.json"
    xong.parent.mkdir(parents=True, exist_ok=True)
    xong.write_text(json.dumps({"viec": v.get("viec", ten), "ra": v["ra"], "token": tong, "loi_con_lai": loi,
                                "luc": time.strftime("%Y-%m-%d %H:%M UTC", time.gmtime())}, ensure_ascii=False, indent=2),
                    encoding="utf-8")


if __name__ == "__main__":
    if not KHOA:
        raise SystemExit("Chưa có GEMINI_API_KEY trong Secrets của kho")
    for tep in sorted((GOC / "xuong/viec").glob("*.json")):
        if not (GOC / "xuong/xong" / tep.name).exists():
            lam_viec(tep)
