"""Thêm một truyện mới vào Sách truyện nói Lucie & Lucas.

Dùng: python tools/them_truyen.py <tệp truyện do Gemini viết> [số tuần]
Tệp truyện theo đúng định dạng dòng (mỗi mục 1 dòng, ngăn bằng dấu |):
  TIEUDE|tên truyện
  BIA|mô tả tranh bìa tiếng Anh
  TRANG|lời kể|mô tả tranh tiếng Anh        (5-8 dòng)
  BAIHOC|bài học
  HOI|câu hỏi|đáp án đúng|sai 1|sai 2       (3 dòng)
  CHUC|lời chúc ngủ ngon
Kết quả:
  games/sach-truyen/truyen/tuan-XX.json   (nội dung truyện + câu để giọng VieNeu đọc)
  games/sach-truyen/truyen/danh-sach.json (giá sách)
  games/sach-truyen/anh-nguon.json        (tranh để máy chủ GitHub vẽ)
Kiểm tra lỗi trước khi ghi: thiếu mục, số trang, chữ lạ (Trung, Nhật...), đáp án trùng.
"""
import datetime, json, os, re, sys, unicodedata

TM = "games/sach-truyen"
# tên nước ngoài: giọng VieNeu đọc theo cách viết tiếng Việt cho đúng
DOC_TEN = [(r"\bLucie\b", "Lu Xi"), (r"\bLucas\b", "Lu Cát")]
LA = re.compile(r"[\u0400-\u04ff\u0e00-\u0e7f\u3040-\u30ff\u3400-\u9fff\uac00-\ud7af]")


def doc(s):
    for a, b in DOC_TEN:
        s = re.sub(a, b, s)
    return s


def tach(text):
    t = {"trang": [], "hoi": []}
    for dong in text.splitlines():
        dong = unicodedata.normalize("NFC", dong.strip())
        if not dong or dong.startswith("===") or "|" not in dong:
            continue
        p = [x.strip() for x in dong.split("|")]
        k = p[0].upper()
        if k == "TIEUDE": t["tieu_de"] = p[1]
        elif k == "BIA": t["bia"] = p[1]
        elif k == "TRANG" and len(p) >= 3: t["trang"].append({"loi": p[1], "anh": p[2]})
        elif k == "BAIHOC": t["bai_hoc"] = p[1]
        elif k == "HOI" and len(p) >= 5: t["hoi"].append({"cau": p[1], "dung": p[2], "sai": p[3:5]})
        elif k == "CHUC": t["chuc"] = p[1]
    return t


def kiem_tra(t):
    loi = []
    for k in ["tieu_de", "bia", "bai_hoc", "chuc"]:
        if not t.get(k): loi.append("thiếu " + k)
    if not 5 <= len(t["trang"]) <= 8: loi.append(f"có {len(t['trang'])} trang (cần 5-8)")
    if len(t["hoi"]) < 3: loi.append(f"có {len(t['hoi'])} câu hỏi (cần 3)")
    for h in t["hoi"]:
        if h["dung"] in h["sai"] or len(set(h["sai"])) < 2: loi.append("đáp án trùng: " + h["cau"])
    if LA.search(json.dumps(t, ensure_ascii=False)): loi.append("có chữ lạ (Trung/Nhật/Hàn/Nga/Thái)")
    for i, p in enumerate(t["trang"], 1):
        n = len(p["loi"].split())
        if n > 90: loi.append(f"trang {i} quá dài ({n} chữ)")
        if re.search(r"\b(child|children|boy|girl|kid|kids|face|person|people|man|woman|father|mother of)\b", p["anh"], re.I) \
                and not re.search(r"\b(no people|without people)\b", p["anh"], re.I):
            loi.append(f"tranh trang {i} có thể vẽ người: {p['anh']}")
    return loi


def main():
    text = open(sys.argv[1], encoding="utf-8").read()
    t = tach(text)
    loi = kiem_tra(t)
    if loi:
        print("CHƯA ĐẠT:\n- " + "\n- ".join(loi)); sys.exit(1)
    os.makedirs(f"{TM}/truyen", exist_ok=True)
    ds_p = f"{TM}/truyen/danh-sach.json"
    ds = json.load(open(ds_p, encoding="utf-8")) if os.path.exists(ds_p) else []
    so = int(sys.argv[2]) if len(sys.argv) > 2 else (max([x["so"] for x in ds], default=0) + 1)
    ma = f"tuan-{so:02d}"
    # câu để đọc: bỏ tên tiếng nước ngoài sang cách đọc tiếng Việt
    t["doc_tieu_de"] = doc(t["tieu_de"])
    for p in t["trang"]: p["doc"] = doc(p["loi"])
    t["doc_bai_hoc"] = doc(t["bai_hoc"]); t["doc_chuc"] = doc(t["chuc"])
    for h in t["hoi"]: h["doc"] = doc(h["cau"]); h["doc_dap"] = [doc(x) for x in [h["dung"]] + h["sai"]]
    t.update({"so": so, "ma": ma, "ngay": datetime.date.today().isoformat()})
    json.dump(t, open(f"{TM}/truyen/{ma}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    ds = [x for x in ds if x["so"] != so] + [{"so": so, "ma": ma, "tieu_de": t["tieu_de"], "ngay": t["ngay"], "trang": len(t["trang"])}]
    ds.sort(key=lambda x: -x["so"])
    json.dump(ds, open(ds_p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    an_p = f"{TM}/anh-nguon.json"
    an = json.load(open(an_p, encoding="utf-8")) if os.path.exists(an_p) else {}
    kieu = ", soft watercolor picture-book style, warm gentle colors, no people, no text"
    an[f"{ma}-bia"] = {"ai": t["bia"].rstrip(". "), "kieu": kieu, "w": 768, "h": 512, "seed": so * 100}
    for i, p in enumerate(t["trang"], 1):
        an[f"{ma}-{i}"] = {"ai": p["anh"].rstrip(". "), "kieu": kieu, "w": 768, "h": 512, "seed": so * 100 + i}
    json.dump(an, open(an_p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"Đã thêm {ma}: {t['tieu_de']} ({len(t['trang'])} trang)")


if __name__ == "__main__":
    main()
