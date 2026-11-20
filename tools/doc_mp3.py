# Đọc giọng tiếng Việt: biến mọi tệp .txt trong thư mục này thành .mp3 (giọng Hoài My của Microsoft, miễn phí).
# Tự chuẩn hóa chữ trước khi đọc: bỏ ký hiệu lập trình, đổi →, 13–19, %, dấu gạch dưới... thành văn nói.
import asyncio, glob, os, re, sys

GIONG = "vi-VN-HoaiMyNeural"   # đổi thành "vi-VN-NamMinhNeural" nếu muốn giọng nam
TOC_DO = "-5%"                  # chậm hơn một chút cho dễ nghe

THAY = [
    (r"\s*(→|->|=>)\s*", ", "), (r"\s*(←|<-)\s*", " từ "),
    (r"(\d+)\s*[–—-]\s*(\d+)", r"\1 đến \2"),
    (r"(\d+(?:[.,]\d+)?)\s*%", r"\1 phần trăm"),
    (r"(\d+)\s*/\s*(\d+)", r"\1 trên \2"),
    (r"\bvs\.?\b", "so với"), (r"&", " và "), (r"\+", " cộng "), (r"(?<=\d)\s*[x×]\s*(?=\d)", " nhân "),
    (r"\btr\.?\s?đ\b", "triệu đồng"), (r"\bđ\b", "đồng"),
    (r"\bTW\b", "Trung ương"), (r"\bBTGTW\b", "Ban Tuyên giáo Trung ương"), (r"\bTP\.?\b", "thành phố"),
    (r"https?://\S+", ""), (r"[`*#_~|<>{}\[\]\\]", " "),
    (r"^\s*[-•▪●◦]\s*", ""), (r"\.{3,}|…", ", "), (r"[ \t]+", " "),
]


def chuan_hoa(s):
    out = []
    for dong in s.splitlines():
        for a, b in THAY:
            dong = re.sub(a, b, dong, flags=re.M)
        dong = dong.strip()
        if dong:
            out.append(dong if dong[-1] in ".!?:;," else dong + ".")
    return "\n".join(out)


async def doc(f):
    import edge_tts
    s = open(f, encoding="utf-8-sig", errors="ignore").read()
    s = chuan_hoa(s)
    os.makedirs("doc-mp3/ra", exist_ok=True)
    ra = os.path.join("doc-mp3/ra", os.path.basename(f)[:-4] + ".mp3")
    await edge_tts.Communicate(s, GIONG, rate=TOC_DO).save(ra)
    os.remove(f)
    print("  Xong:", ra)


def main():
    ds = [a for a in sys.argv[1:] if a.lower().endswith(".txt")] or \
         glob.glob("doc-mp3/vao/*.txt")
    if not ds:
        print("Chưa có tệp .txt nào. Dán chữ vào một tệp .txt trong thư mục này rồi bấm đúp lại.")
        return
    for f in ds:
        print("Đang đọc:", os.path.basename(f))
        asyncio.run(doc(f))


main()
