"""Tự tải ảnh thật từ Wikipedia / Wikimedia Commons cho các game.

Chạy trên máy chủ GitHub (GitHub Actions), không cần máy tính ở nhà.
Đầu vào: games/<tên game>/anh-nguon.json, dạng {"mã": {"t": "Tên bài Wikipedia tiếng Anh"} hoặc {"f": "Tên file trên Commons"}
         hoặc {"ai": "mô tả tiếng Anh", "seed": số} để máy chủ vẽ tranh AI (Pollinations); tranh AI đã có thì không vẽ lại}
Đầu ra:  games/<tên game>/anh/<mã>.webp, anh/nguon-anh.json (ghi công tác giả), anh/bang-kiem-tra.jpg (bảng ảnh để duyệt)
"""
import io, json, os, sys, time, urllib.parse, urllib.request
from PIL import Image, ImageDraw

UA = {"User-Agent": "LucieLucasGames/1.0 (https://ngocanhno1.github.io; gia dinh tu hoc)"}
API = {"t": "https://en.wikipedia.org/w/api.php", "f": "https://commons.wikimedia.org/w/api.php"}


def get(url, tries=4):
    for i in range(tries):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40) as r:
                return r.read()
        except Exception as e:  # mạng chập chờn hoặc bị giới hạn tốc độ: đợi rồi thử lại
            if i == tries - 1:
                raise
            time.sleep(3 * (i + 1))


AI_STYLE = ", Cute Pixar 3D Disney style vibrant illustration for kids, high quality, clear subject"


def tim_anh(src):
    """Trả về (đường dẫn ảnh thu nhỏ, tên file trên Commons)."""
    if "ai" in src:
        w, h = src.get("w", 512), src.get("h", 512)   # tranh truyện: khổ ngang, kiểu vẽ riêng ("kieu")
        return ("https://image.pollinations.ai/prompt/" + urllib.parse.quote(src["ai"] + src.get("kieu", AI_STYLE))
                + f"?width={w}&height={h}&nologo=true&seed=" + str(src.get("seed", 1))), ""
    if "t" in src:
        q = {"action": "query", "format": "json", "redirects": 1, "titles": src["t"],
             "prop": "pageimages", "piprop": "thumbnail|name", "pithumbsize": 520}
        pages = json.loads(get(API["t"] + "?" + urllib.parse.urlencode(q)))["query"]["pages"]
        p = next(iter(pages.values()))
        if "thumbnail" not in p:
            raise ValueError("bài không có ảnh đại diện")
        return p["thumbnail"]["source"], p.get("pageimage", "")
    q = {"action": "query", "format": "json", "titles": "File:" + src["f"], "prop": "imageinfo",
         "iiprop": "url", "iiurlwidth": 520}
    pages = json.loads(get(API["f"] + "?" + urllib.parse.urlencode(q)))["query"]["pages"]
    p = next(iter(pages.values()))
    if "imageinfo" not in p:
        raise ValueError("file không tồn tại trên Commons")
    return p["imageinfo"][0]["thumburl"], src["f"]


def lam_game(thu_muc):
    nguon = json.load(open(os.path.join(thu_muc, "anh-nguon.json"), encoding="utf-8"))
    ra = os.path.join(thu_muc, "anh")
    os.makedirs(ra, exist_ok=True)
    ghi_cong, loi, xong = {}, {}, []
    ai_hong_lien = 0                          # số tranh AI hỏng liên tiếp: máy vẽ đang lỗi thì dừng sớm
    for ma, src in nguon.items():
        if ma.startswith("_"):
            continue
        dich = os.path.join(ra, ma + ".webp")
        if "ai" in src and os.path.exists(dich):   # tranh AI đã vẽ rồi: giữ nguyên, khỏi vẽ lại
            continue
        if "ai" in src and ai_hong_lien >= 6:
            loi[ma] = "bỏ qua: máy vẽ tranh AI đang lỗi"
            continue
        try:
            url, ten = tim_anh(src)
            im = Image.open(io.BytesIO(get(url, tries=3 if "ai" in src else 4))).convert("RGB")
            w, h = im.size
            if "w" in src:                    # tranh truyện: giữ khổ ngang
                W, H = src["w"], src["h"]; k = max(W / w, H / h)
                im = im.resize((round(w * k), round(h * k)), Image.LANCZOS)
                w, h = im.size
                im = im.crop(((w - W) // 2, (h - H) // 2, (w - W) // 2 + W, (h - H) // 2 + H))
            else:
                s = min(w, h)                 # cắt vuông ở giữa cho vừa khung
                im = im.crop(((w - s) // 2, (h - s) // 2, (w + s) // 2, (h + s) // 2)).resize((360, 360), Image.LANCZOS)
            im.save(dich, "WEBP", quality=82, method=6)
            if "ai" in src:
                ghi_cong[ma] = {"file": "Tranh AI Pollinations", "trang": "https://pollinations.ai"}
            else:
                ghi_cong[ma] = {"file": ten, "trang": "https://commons.wikimedia.org/wiki/File:" + urllib.parse.quote(ten.replace(" ", "_"))}
            xong.append((ma, src, im))
            if "ai" in src:
                ai_hong_lien = 0
                print("  vẽ xong", ma, flush=True)
        except Exception as e:
            loi[ma] = f"{src}: {e}"
            if "ai" in src:
                ai_hong_lien += 1
                print("  hỏng", ma, e, flush=True)
        time.sleep(6 if "ai" in src else 0.3)   # máy vẽ tranh miễn phí giới hạn tốc độ: vẽ từ từ
    json.dump({"anh": ghi_cong, "loi": loi}, open(os.path.join(ra, "nguon-anh.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    # danh sách ảnh icon (e-<mã>.webp) đang có, để anh-that.js biết icon nào đã có ảnh
    icon = sorted(f[2:-5] for f in os.listdir(ra) if f.startswith("e-") and f.endswith(".webp"))
    if icon:
        json.dump(icon, open(os.path.join(ra, "danh-sach.json"), "w", encoding="utf-8"))
    # bảng kiểm tra: mọi ảnh thu nhỏ kèm nhãn để Claude duyệt nhanh
    S, C = 120, 12
    sheet = Image.new("RGB", (C * S, ((len(xong) + C - 1) // C) * S or S), "white")
    d = ImageDraw.Draw(sheet)
    for i, (ma, src, im) in enumerate(xong):
        x, y = (i % C) * S, (i // C) * S
        sheet.paste(im.resize((S - 4, S - 4)), (x + 2, y + 2))  # tranh ngang cũng thu về ô vuông để duyệt
        nhan = (ma + " " + (src.get("t") or src.get("f") or src.get("ai") or ""))[:18]
        d.rectangle([x + 2, y + S - 18, x + S - 2, y + S - 2], fill="white")
        d.text((x + 4, y + S - 17), nhan, fill="black")
    sheet.save(os.path.join(ra, "bang-kiem-tra.jpg"), quality=80)
    print(f"{thu_muc}: tải được {len(xong)} ảnh, lỗi {len(loi)}")
    for k, v in loi.items():
        print("  LỖI", k, v)


if __name__ == "__main__":
    for tm in sys.argv[1:]:
        lam_game(tm)
