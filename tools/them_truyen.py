"""Thêm truyện mới vào Sách truyện nói Lucie & Lucas.

Dùng: python tools/them_truyen.py <tệp truyện> [số truyện đầu] [ngày phát truyện đầu YYYY-MM-DD]
Tệp có thể chứa NHIỀU truyện, mỗi truyện mở đầu bằng dòng ===TRUYEN <số>===, mỗi mục 1 dòng ngăn bằng |:
  TIEUDE|tên truyện
  BIA|mô tả tranh bìa tiếng Anh
  TRANG|lời kể|mô tả tranh tiếng Anh        (5-8 dòng)
  BAIHOC|bài học
  HOI_LUCIE|câu hỏi|đúng|sai 1|sai 2       (3 dòng, lớp 3)
  HOI_LUCAS|câu hỏi|đúng|sai 1|sai 2       (3 dòng, lớp 1)
  CHUC|lời chúc ngủ ngon
Cứ 2 ngày phát 1 truyện: truyện chưa tới ngày phát thì trang không hiện (máy chủ có đủ thời gian vẽ tranh, đọc giọng).
Kết quả: games/sach-truyen/truyen/tuan-XX.json và truyen/danh-sach.json.
Tranh: Gemini (Nano Banana Pro trên AI Studio) vẽ theo trường "bia"/"anh", lưu ở games/sach-truyen/anh/tuan-XX-bia.webp, tuan-XX-1.webp...
"""
import datetime, json, os, re, sys, unicodedata

TM = "games/sach-truyen"
CACH = 2   # số ngày giữa hai truyện
DOC_TEN = [(r"\bLucie\b", "Lu Xi"), (r"\bLucas\b", "Lu Cát")]   # giọng đọc tiếng Việt đọc tên cho đúng
LA = re.compile(r"[\u0400-\u04ff\u0e00-\u0e7f\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]")


def doc(s):
    for a, b in DOC_TEN:
        s = re.sub(a, b, s)
    return s


def tach_nhieu(text):
    khoi, cur, so = [], None, None
    for dong in text.splitlines():
        m = re.match(r"=+\s*TRUYEN\s*(\d+)\s*=+", dong.strip(), re.I)
        if m:
            if cur is not None: khoi.append((so, "\n".join(cur)))
            cur, so = [], int(m.group(1)); continue
        if cur is None: cur = []
        cur.append(dong)
    if cur: khoi.append((so, "\n".join(cur)))
    return [(s, k) for s, k in khoi if "TIEUDE" in k.upper()]


def tach(text):
    t = {"trang": [], "hoi_lucie": [], "hoi_lucas": []}
    for dong in text.splitlines():
        dong = unicodedata.normalize("NFC", dong.strip())
        if not dong or dong.startswith("===") or "|" not in dong:
            continue
        p = [x.strip() for x in dong.split("|")]
        k = p[0].upper()
        if k == "TIEUDE": t["tieu_de"] = p[1]
        elif k == "BIA": t["bia"] = p[1].rstrip(". ")
        elif k == "TRANG" and len(p) >= 3: t["trang"].append({"loi": p[1], "anh": p[2].rstrip(". ")})
        elif k == "BAIHOC": t["bai_hoc"] = p[1]
        elif k in ("HOI_LUCIE", "HOI_LUCAS", "HOI") and len(p) >= 5:
            h = {"cau": p[1], "dung": p[2], "sai": p[3:5]}
            if k == "HOI": t["hoi_lucie"].append(h); t["hoi_lucas"].append(h)
            else: t[k.lower()].append(h)
        elif k == "CHUC": t["chuc"] = p[1]
    return t


def kiem_tra(t):
    loi = []
    for k in ["tieu_de", "bia", "bai_hoc", "chuc"]:
        if not t.get(k): loi.append("thiếu " + k)
    if not 5 <= len(t["trang"]) <= 8: loi.append(f"có {len(t['trang'])} trang (cần 5-8)")
    for ai in ("hoi_lucie", "hoi_lucas"):
        if len(t[ai]) < 3: loi.append(f"{ai} có {len(t[ai])} câu (cần 3)")
        for h in t[ai]:
            if h["dung"] in h["sai"] or len(set(h["sai"])) < 2: loi.append("đáp án trùng: " + h["cau"])
    cau = [h["cau"].lower() for h in t["hoi_lucie"] + t["hoi_lucas"]]
    if len(set(cau)) < len(cau): loi.append("câu hỏi của hai bé bị trùng")
    if LA.search(json.dumps(t, ensure_ascii=False)): loi.append("có chữ lạ (Trung/Nhật/Hàn/Nga/Thái)")
    for i, p in enumerate(t["trang"], 1):
        n = len(p["loi"].split())
        if n > 90: loi.append(f"trang {i} quá dài ({n} chữ)")
        if re.search(r"\b(child|children|boy|girl|kid|kids|face|faces|person|people|man|woman|mom|dad|grandma|grandpa)\b", p["anh"], re.I) \
                and not re.search(r"\b(no people|without people|no faces?)\b", p["anh"], re.I):
            loi.append(f"tranh trang {i} có thể vẽ người: {p['anh']}")
    return loi


def ghi(t, so, ngay):
    ma = f"tuan-{so:02d}"
    t["doc_tieu_de"] = doc(t["tieu_de"])
    for p in t["trang"]: p["doc"] = doc(p["loi"])
    t["doc_bai_hoc"] = doc(t["bai_hoc"]); t["doc_chuc"] = doc(t["chuc"])
    for ai in ("hoi_lucie", "hoi_lucas"):
        for h in t[ai]:
            h["doc"] = doc(h["cau"]); h["doc_dap"] = [doc(x) for x in [h["dung"]] + h["sai"]]
    t.update({"so": so, "ma": ma, "ngay": ngay})
    os.makedirs(f"{TM}/truyen", exist_ok=True)
    json.dump(t, open(f"{TM}/truyen/{ma}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    return {"so": so, "ma": ma, "tieu_de": t["tieu_de"], "ngay": ngay, "trang": len(t["trang"])}


def main():
    text = open(sys.argv[1], encoding="utf-8").read()
    ds_p = f"{TM}/truyen/danh-sach.json"
    ds = json.load(open(ds_p, encoding="utf-8")) if os.path.exists(ds_p) else []
    cuoi = max(ds, key=lambda x: x["so"]) if ds else None
    khoi = tach_nhieu(text) or [(None, text)]
    so0 = int(sys.argv[2]) if len(sys.argv) > 2 else (khoi[0][0] or ((cuoi["so"] + 1) if cuoi else 1))
    if len(sys.argv) > 3:
        ngay0 = datetime.date.fromisoformat(sys.argv[3])
    else:   # tiếp nối truyện cuối: cách 2 ngày, không sớm hơn hôm nay
        ngay0 = max(datetime.date.today(), datetime.date.fromisoformat(cuoi["ngay"]) + datetime.timedelta(CACH)) if cuoi else datetime.date.today()
    tat_ca, hong = [], False
    for i, (so, k) in enumerate(khoi):
        so = so or so0 + i
        t = tach(k)
        loi = kiem_tra(t)
        if loi:
            hong = True; print(f"Truyện {so} CHƯA ĐẠT:\n- " + "\n- ".join(loi))
        tat_ca.append((so, t))
    if hong:
        sys.exit(1)
    for i, (so, t) in enumerate(tat_ca):
        cu = next((x for x in ds if x["so"] == so), None)
        ngay = cu["ngay"] if cu else (ngay0 + datetime.timedelta(CACH * i)).isoformat()
        moi = ghi(t, so, ngay)
        ds = [x for x in ds if x["so"] != so] + [moi]
        print(f"Đã thêm {moi['ma']}: {moi['tieu_de']} — phát ngày {ngay}")
    ds.sort(key=lambda x: -x["so"])
    json.dump(ds, open(ds_p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)


if __name__ == "__main__":
    main()
