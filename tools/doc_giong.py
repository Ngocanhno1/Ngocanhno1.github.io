"""Máy chủ GitHub đọc sẵn mọi câu tiếng Việt trong các game bằng giọng VieNeu-TTS (mã nguồn mở, miễn phí).
- Lấy câu chữ từ mã các game có dùng giọng đọc (speechSynthesis), cắt thành từng câu ngắn.
- Mỗi câu lưu thành games/anh-chung/giong/<mã>.mp3; câu đã có thì bỏ qua (chạy lại chỉ đọc câu mới).
- games/anh-chung/giong/danh-sach.json: các mã đã có, để giong-noi.js trong game biết câu nào phát được.
Cách cắt câu và tính mã PHẢI giống hệt giong-noi.js."""
import glob, json, os, re, subprocess, sys, time, unicodedata

GIONG = os.environ.get("GIONG", "Quỳnh Anh")
RA = "games/anh-chung/giong"
HAN_GIO = float(os.environ.get("HAN_PHUT", "290")) * 60   # dừng trước giới hạn 6 giờ của GitHub
VN = re.compile(r"[ăâđêôơưáàảãạấầẩẫậắằẳẵặéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]", re.I)
CAT = re.compile(r"[.!?…;:\n]+|\s/\s|\s[-–—]\s")


def chuan(s):
    s = unicodedata.normalize("NFC", s).lower()
    s = re.sub(r"[\"“”'‘’()\[\]«»*_]", "", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip(" .,!?…;:-–—")


def ma(s):
    h = 0x811C9DC5
    for b in s.encode("utf-8"):
        h ^= b
        h = (h * 0x01000193) & 0xFFFFFFFF
    return format(h, "08x")


def cau_trong(f):
    s = open(f, encoding="utf-8").read()
    s = re.sub(r"data:[a-z]+/[a-z0-9+.-]+;base64,[A-Za-z0-9+/=]+", "", s)
    s = re.sub(r"<style[\s\S]*?</style>", "", s)
    tho = []
    for a, b, c in re.findall(r'"([^"\\\n]{2,600})"|\'([^\'\\\n]{2,600})\'|`([^`\\]{2,600})`', s):
        x = a or b or c
        tho += re.split(r"\$\{[^}]*\}", x)
    tho += re.findall(r">([^<>]{2,600})<", s)
    them = []
    for i, x in enumerate(tho):   # câu khuyết "[...]": game đọc thành "... gì nhỉ" hoặc câu đầy đủ với đáp án ngay sau
        if "[...]" in x:
            them.append(x.replace("[...]", " gì nhỉ "))
            if i + 1 < len(tho):
                them.append(x.replace("[...]", tho[i + 1]))
    tho = [y for x in tho + them for y in x.split("|")]
    ra = []
    for x in tho:
        if not VN.search(x) or re.search(r"[{}<>=\\]|https?:|\.(js|css|png|webp|mp3)\b", x):
            continue
        for p in CAT.split(x):
            k = chuan(p)
            if 1 < len(k) <= 220 and VN.search(k):
                ra.append(p.strip())
    return ra


def main():
    os.makedirs(RA, exist_ok=True)
    game = [f for f in sorted(glob.glob("games/*/index.html")) if "speechSynthesis" in open(f, encoding="utf-8").read()]
    uu_tien = ["hoi-lang-ca-dao", "rung-chuong-vang", "tho-mo-nhi", "dao-kho-bau-toan-hoc", "duoi-hinh-bat-chu"]
    game.sort(key=lambda f: next((i for i, g in enumerate(uu_tien) if g in f), 99))
    can = {}
    for x in ["A", "B", "C", "D"] + [str(i) for i in range(0, 101)]:
        can.setdefault(ma(chuan(x)), x)
    for f in game:
        for p in cau_trong(f):
            can.setdefault(ma(chuan(p)), p)
    co = {f[:-4] for f in os.listdir(RA) if f.endswith(".mp3")}
    thieu = [(k, v) for k, v in can.items() if k not in co]
    print(f"{len(game)} game, {len(can)} câu, đã có {len(co & set(can))}, cần đọc {len(thieu)}", flush=True)
    if thieu:
        from vieneu import Vieneu
        tts = Vieneu()
        bd, xong = time.time(), 0
        for k, v in thieu:
            if time.time() - bd > HAN_GIO:
                print("Hết giờ, lần sau đọc tiếp", flush=True); break
            doc = v if re.search(r"[.!?…]$", v) else v + "."
            try:
                wav = tts.infer(doc, voice=GIONG)
                tts.save(wav, "/tmp/c.wav")
                subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", "/tmp/c.wav", "-ac", "1", "-ar", "24000", "-b:a", "40k", f"{RA}/{k}.mp3"], check=True)
                xong += 1
                if xong % 50 == 0:
                    print(f"  đã đọc {xong}/{len(thieu)} ({int(time.time() - bd)} giây)", flush=True)
            except Exception as e:
                print("  lỗi", k, v[:60], e, flush=True)
        print(f"Đọc xong {xong} câu trong {int(time.time() - bd)} giây", flush=True)
        if not os.path.exists(f"{RA}/mau"):   # vài giọng mẫu để bố mẹ nghe thử, chọn giọng
            os.makedirs(f"{RA}/mau", exist_ok=True)
            for ten in ["Quỳnh Anh", "Trúc Ly", "Ngọc Huyền", "Thiện Minh", "Mỹ Duyên"]:
                try:
                    tts.save(tts.infer("Chào Tường San và Tường Minh! Hôm nay hai chị em cùng vào hội làng đoán ca dao nhé.", voice=ten), "/tmp/m.wav")
                    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", "/tmp/m.wav", "-ac", "1", "-ar", "24000", "-b:a", "48k", f"{RA}/mau/{ten}.mp3"], check=True)
                except Exception as e:
                    print("  lỗi giọng mẫu", ten, e)
    co = sorted(f[:-4] for f in os.listdir(RA) if f.endswith(".mp3"))
    json.dump(co, open(f"{RA}/danh-sach.json", "w"))


if __name__ == "__main__":
    main()
