"""Máy chủ GitHub đọc sẵn mọi câu tiếng Việt trong các game bằng giọng VieNeu-TTS (mã nguồn mở, miễn phí).
- Lấy câu chữ từ mã các game có dùng giọng đọc (speechSynthesis), cắt thành từng câu ngắn.
- Mỗi câu lưu thành games/anh-chung/giong/<mã>.mp3; câu đã có thì bỏ qua (chạy lại chỉ đọc câu mới).
- games/anh-chung/giong/danh-sach.json: các mã đã có, để giong-noi.js trong game biết câu nào phát được.
Cách cắt câu và tính mã PHẢI giống hệt giong-noi.js.
Mỗi chuỗi đi qua chuan_hoa_van_noi() TRƯỚC khi cắt câu (×, ÷, =, km, °C, Lucie → Lu Xi...), như trình duyệt."""
import glob, json, os, re, subprocess, sys, time, unicodedata
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from chuan_hoa_van_noi import chuan_hoa_van_noi   # PHẢI giống hệt games/anh-chung/chuan-hoa-van-noi.js

GIONG = os.environ.get("GIONG", "Quỳnh Anh")
# Giọng mặc định (lưu ở giong/) + các giọng phụ để game xáo trộn cho đỡ nhàm (lưu ở giong/<thư mục>/)
GIONG_PHU = []   # 20/11/2026: chỉ một giọng (Hoài My), không xáo giọng phụ
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
        if not VN.search(x) or re.search(r"[{}\\]|<\/?[a-z]|https?:|\.(js|css|png|webp|mp3)\b", x):
            continue
        x = chuan_hoa_van_noi(x)
        for p in CAT.split(x):
            k = chuan(p)
            if 1 < len(k) <= 220 and VN.search(k):
                ra.append(p.strip())
    return ra


def cau_truyen(f):
    """Câu của Sách truyện nói: lấy các trường "doc..." (đã đổi tên Lucie/Lucas sang cách đọc tiếng Việt)."""
    t = json.load(open(f, encoding="utf-8"))
    tho = [t.get("doc_tieu_de", ""), t.get("doc_bai_hoc", ""), t.get("doc_chuc", "")]
    tho += [p.get("doc", "") for p in t.get("trang", [])]
    for h in t.get("hoi", []) + t.get("hoi_lucie", []) + t.get("hoi_lucas", []):
        tho += [h.get("doc", "")] + h.get("doc_dap", [])
    ra = []
    for x in tho:
        for p in CAT.split(chuan_hoa_van_noi(x or "")):
            k = chuan(p)
            if 1 < len(k) <= 220 and re.search(r"[\w]", k):
                ra.append(p.strip())
    return ra


def ghi_danh_sach():
    """danh-sach.json: mã có giọng mặc định; giong.json: mã có ở từng giọng phụ (để game xáo trộn giọng)."""
    co = sorted(f[:-4] for f in os.listdir(RA) if f.endswith(".mp3"))
    json.dump(co, open(f"{RA}/danh-sach.json", "w"))
    phu = {}
    for thu, ten in GIONG_PHU:
        d = f"{RA}/{thu}"
        phu[thu] = {"ten": ten, "co": sorted(f[:-4] for f in os.listdir(d) if f.endswith(".mp3")) if os.path.isdir(d) else []}
    json.dump(phu, open(f"{RA}/giong.json", "w", encoding="utf-8"), ensure_ascii=False)


def luu(tin):
    """Lưu dần lên trang trong lúc đọc, để giọng mới xuất hiện sớm."""
    ghi_danh_sach()
    sh = lambda *c: subprocess.run(c, check=False)
    for _ in range(4):   # lấy bản mới nhất trên kho rồi ghi đè phần giọng của mình lên, tránh xung đột
        subprocess.run(["git", "fetch", "-q", "origin", "main"])
        subprocess.run(["git", "reset", "-q", "--mixed", "origin/main"])   # chỉ mục lấy đúng bản mới nhất trên kho, không đè lên file người khác vừa sửa
        subprocess.run(["git", "add", "--ignore-removal", RA])   # không bao giờ xóa file giọng đã có
        if subprocess.run(["git", "diff", "--cached", "--quiet"]).returncode == 0:
            return
        subprocess.run(["git", "commit", "-q", "-m", tin])
        if subprocess.run(["git", "push", "-q", "origin", "HEAD:main"]).returncode == 0:
            return
        time.sleep(10)


def cau_trong_json(f):
    """Lời truyện, câu hỏi... nằm trong file dữ liệu .json của game (vd sach-truyen/truyen/*.json)."""
    try:
        d = json.load(open(f, encoding="utf-8"))
    except Exception:
        return []
    tho = []
    def duyet(x):
        if isinstance(x, str): tho.append(x)
        elif isinstance(x, list): [duyet(y) for y in x]
        elif isinstance(x, dict): [duyet(y) for y in x.values()]
    duyet(d)
    ra = []
    for x in tho:
        if not VN.search(x) or re.search(r"https?:|\.(js|css|png|webp|mp3)\b", x):
            continue
        x = chuan_hoa_van_noi(x)
        for p in CAT.split(x):
            k = chuan(p)
            if 1 < len(k) <= 220 and VN.search(k):
                ra.append(p.strip())
    return ra


def gan_giong(game):
    """Game nào có đọc mà thiếu giong-noi.js (vd bị bản cập nhật ghi đè) thì tự gắn lại."""
    sua = []
    for f in game:
        s = open(f, encoding="utf-8").read()
        if "giong-noi.js" in s or "</head>" not in s:
            continue
        s = s.replace("</head>", '<script src="../anh-chung/giong-noi.js"></script>\n</head>', 1)
        open(f, "w", encoding="utf-8").write(s)
        sua.append(f)
        print("  gắn lại giọng VieNeu cho", f, flush=True)
    return sua


def main():
    os.makedirs(RA, exist_ok=True)
    game = [f for f in sorted(glob.glob("games/*/index.html")) if "speechSynthesis" in open(f, encoding="utf-8").read()]
    sua = gan_giong(game)
    if sua and os.environ.get("GITHUB_ACTIONS"):
        subprocess.run(["git", "add"] + sua)
        luu("Tự gắn lại giọng VieNeu cho game bị thiếu")
    uu_tien = ["hoi-lang-ca-dao", "rung-chuong-vang", "tho-mo-nhi", "dao-kho-bau-toan-hoc", "duoi-hinh-bat-chu"]
    game.sort(key=lambda f: next((i for i, g in enumerate(uu_tien) if g in f), 99))
    can = {}
    for x in ["A", "B", "C", "D"] + [str(i) for i in range(0, 101)]:
        can.setdefault(ma(chuan(x)), x)
    for f in sorted(glob.glob("games/sach-truyen/truyen/tuan-*.json"), reverse=True):   # truyện mới nhất đọc trước
        for p in cau_truyen(f):
            can.setdefault(ma(chuan(p)), p)
    for f in game:
        doi_ten = "docTen(" in open(f, encoding="utf-8").read()   # game tự đổi Lucie → Lu Xi... trước khi đọc
        for p in cau_trong(f):
            if doi_ten:
                p = re.sub(r"(?i)ciecas", "Ci Cát", p.replace("Lucie", "Lu Xi").replace("Lucas", "Lu Cát"))
            can.setdefault(ma(chuan(p)), p)
        thu_muc = os.path.dirname(f)   # file dữ liệu của game: truyện, câu hỏi để riêng
        if thu_muc.endswith("sach-truyen"):   # truyện đã lấy riêng ở trên (câu đã đổi tên sang cách đọc)
            continue
        for j in sorted(glob.glob(thu_muc + "/du-lieu*.js")):   # file bài học dạng JS (vd ky-nang/du-lieu.js); tên đọc kiểu Việt như game
            for p in cau_trong(j):
                p = re.sub(r"(?i)ciecas", "Ci Cát", p.replace("Lucie", "Lu Xi").replace("Lucas", "Lu Cát"))
                can.setdefault(ma(chuan(p)), p)
        for j in sorted(glob.glob(thu_muc + "/**/*.json", recursive=True)):
            if re.search(r"(anh-nguon|nguon-anh|danh-sach|manifest)\.json$", j) or "/anh/" in j or "/nhap/" in j:
                continue
            for p in cau_trong_json(j):
                can.setdefault(ma(chuan(p)), p)
    cau_chinh = dict(can)   # câu trọn vẹn (để đọc bằng các giọng phụ)
    for v in list(can.values()):   # thư viện từng chữ: câu ghép lúc chơi chưa có sẵn thì game ghép chữ để đọc
        for t in re.findall(r"[\wÀ-ỹ]+", chuan(v)):
            can.setdefault(ma(chuan(t)), t)
    for i in range(0, 1001):
        can.setdefault(ma(str(i)), str(i))
    viec = [(RA, GIONG, can)] + [(f"{RA}/{thu}", ten, cau_chinh) for thu, ten in GIONG_PHU]
    tts, bd = None, time.time()
    for thu, ten, ds in viec:
        os.makedirs(thu, exist_ok=True)
        co = {f[:-4] for f in os.listdir(thu) if f.endswith(".mp3")}
        thieu = [(k, v) for k, v in ds.items() if k not in co]
        print(f"[{ten}] {len(ds)} mục, đã có {len(co & set(ds))}, cần đọc {len(thieu)}", flush=True)
        if not thieu:
            continue
        if tts is None:
            from vieneu import Vieneu
            tts = Vieneu()
        xong = 0
        for k, v in thieu:
            if time.time() - bd > HAN_GIO:
                print("Hết giờ, lần sau đọc tiếp", flush=True); break
            doc = v if re.search(r"[.!?…]$", v) else v + "."
            try:
                wav = tts.infer(doc, voice=ten)
                tts.save(wav, "/tmp/c.wav")
                subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", "/tmp/c.wav", "-ac", "1", "-ar", "24000", "-b:a", "40k", f"{thu}/{k}.mp3"], check=True)
                xong += 1
                if xong % 50 == 0:
                    print(f"  đã đọc {xong}/{len(thieu)} ({int(time.time() - bd)} giây)", flush=True)
                if xong % 150 == 0 and os.environ.get("GITHUB_ACTIONS"):
                    luu(f"Giọng VieNeu {ten}: đã đọc {xong}/{len(thieu)}")
            except Exception as e:
                print("  lỗi", k, v[:60], e, flush=True)
        print(f"Đọc xong {xong} câu trong {int(time.time() - bd)} giây", flush=True)
    ghi_danh_sach()
    if os.environ.get("GITHUB_ACTIONS"):
        luu("Giọng VieNeu: đọc xong đợt này")


if __name__ == "__main__":
    main()
