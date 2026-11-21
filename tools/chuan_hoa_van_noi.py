# -*- coding: utf-8 -*-
"""Bộ chuẩn hóa văn nói tiếng Việt (đồng nhất 100% logic với chuan-hoa-van-noi.js).
Dùng trong pipeline sinh file MP3 VieNeu-TTS và kiểm tra thiếu MP3 trước khi push.
"""
import re
import unicodedata

EMOJI_RE = re.compile(r"[\U0001F300-\U0001FAFF\u2600-\u27BF\uFE0F\u200D]")
THOUSAND_RE = re.compile(r"(^|[^\d])(\d{1,3}(?:\.\d{3})+)(?!\d)")

TU_DIEN = [
    (re.compile(r"(?<![^\W_])Fun\s+for\s+Flyers(?![^\W_])", re.I), "Phăn pho Flai ơ"),
    (re.compile(r"(?<![^\W_])Lucie(?![^\W_])", re.I), "Lu Xi"),
    (re.compile(r"(?<![^\W_])Lucas(?![^\W_])", re.I), "Lu Cát"),
    (re.compile(r"(?<![^\W_])CIECAS(?![^\W_])", re.I), "Xi Cát"),
    (re.compile(r"(?<![^\W_])do_kho(?![^\W_])", re.I), "độ khó"),
    (re.compile(r"(?<![^\W_])level\s*(\d+)(?!\d)", re.I), r"màn \1"),
    (re.compile(r"(?<![^\W_])lv\.?\s*(\d+)(?!\d)", re.I), r"màn \1"),
    (re.compile(r"(?<![^\W_])level(?![^\W_])", re.I), "màn"),
    (re.compile(r"(?<![^\W_])game(?![^\W_])", re.I), "trò chơi"),
    (re.compile(r"(?<![^\W_])combo(?![^\W_])", re.I), "chuỗi đúng liên tiếp"),
    (re.compile(r"(?<![^\W_])HK1(?![^\W_])"), "học kỳ một"),
    (re.compile(r"(?<![^\W_])HK2(?![^\W_])"), "học kỳ hai"),
]


def chuan_hoa_van_noi(text: str) -> str:
    if not text:
        return ""
    s = unicodedata.normalize("NFC", str(text))

    # 1. Bỏ emoji / ký hiệu trang trí
    s = EMOJI_RE.sub(" ", s)

    # 2. Dấu ngăn cách hàng nghìn kiểu Việt (3.600 -> 3600, 12.000đ -> 12000đ)
    s = THOUSAND_RE.sub(lambda m: m.group(1) + m.group(2).replace(".", ""), s)

    # 3. Mũi tên và khoảng số
    s = re.sub(r"(\d+)\s*[→➡]\s*(\d+)", r"từ \1 đến \2", s)
    s = re.sub(r"\s*[→➡]\s*", ", suy ra ", s)
    s = re.sub(r"(\d+)\s*[–—]\s*(\d+)", r"từ \1 đến \2", s)

    # 4. Đơn vị đo & tiền tệ (Unicode-safe)
    s = re.sub(r"(\d+)\s*°\s*C(?![^\W_])", r"\1 độ xê", s, flags=re.I)
    s = re.sub(r"(\d+)\s*%", r"\1 phần trăm", s)
    s = re.sub(r"(\d+)\s*km(?![^\W_])", r"\1 ki lô mét", s, flags=re.I)
    s = re.sub(r"(\d+)\s*dm(?![^\W_])", r"\1 đề xi mét", s, flags=re.I)
    s = re.sub(r"(\d+)\s*cm(?![^\W_])", r"\1 xăng ti mét", s, flags=re.I)
    s = re.sub(r"(\d+)\s*mm(?![^\W_])", r"\1 mi li mét", s, flags=re.I)
    s = re.sub(r"(\d+)\s*kg(?![^\W_])", r"\1 ki lô gam", s, flags=re.I)
    s = re.sub(r"(\d+)\s*ml(?![^\W_])", r"\1 mi li lít", s, flags=re.I)
    s = re.sub(r"(\d+)\s*m(?![^\W_])", r"\1 mét", s)
    s = re.sub(r"(\d+)\s*g(?![^\W_])", r"\1 gam", s)
    s = re.sub(r"(\d+)\s*l(?![^\W_])", r"\1 lít", s)
    s = re.sub(r"(\d+)\s*h\s*(\d{1,2})(?!\d)", r"\1 giờ \2 phút", s, flags=re.I)
    s = re.sub(r"(\d+)\s*h(?![^\W_])", r"\1 giờ", s, flags=re.I)
    s = re.sub(r"(\d+)\s*(?:VNĐ|VND|đ)(?![^\W_])", r"\1 đồng", s, flags=re.I)

    # 5. Phép tính & ký hiệu toán học
    s = re.sub(r"(\d+)\s*[×xX\*]\s*(\d+)", r"\1 nhân \2", s)
    s = re.sub(r"(\d+)\s*[÷:]\s*(\d+)", r"\1 chia \2", s)
    s = re.sub(r"(\d+)\s*\+\s*(\d+)", r"\1 cộng \2", s)
    s = re.sub(r"(\d+)\s*[\-−]\s*(\d+)", r"\1 trừ \2", s)
    s = re.sub(r"\s*=\s*\?", " bằng mấy?", s)
    s = re.sub(r"\s*=\s*(?:_{2,}|\.{3,})", " bằng mấy", s)
    s = re.sub(r"\s*=\s*", " bằng ", s)
    s = re.sub(r"\s*>\s*", " lớn hơn ", s)
    s = re.sub(r"\s*<\s*", " bé hơn ", s)
    s = re.sub(r"_{2,}", " chỗ trống ", s)

    # 6. Tên riêng & thuật ngữ game
    for pat, rep in TU_DIEN:
        s = pat.sub(rep, s)

    # 7. Ngoặc & ký tự kỹ thuật
    s = s.replace("_", " ")
    s = re.sub(r"\s*\(\s*", ", ", s)
    s = re.sub(r"\s*\)\s*", ", ", s)
    s = re.sub(r'["“”\'‘’\[\]«»*]', "", s)

    # 8. Dọn dấu phẩy/khoảng trắng thừa
    s = re.sub(r"\s+([.,!?;:])", r"\1", s)
    s = re.sub(r",\s*([.,!?;:])", r"\1", s)
    s = re.sub(r"([.!?;:])\s*,", r"\1 ", s)
    s = re.sub(r"\s+", " ", s).strip()
    s = re.sub(r"^,\s*|\s*,$", "", s).strip()
    return s


if __name__ == "__main__":
    samples = [
        "Em đã kiểm tra sâu lại toàn bộ 7 game còn lại (13–19, bỏ qua Fun for Flyers): toàn bộ 3.600 câu hỏi đều chuẩn xác (0 lỗi phép tính, 0 đáp án trùng, 0 số âm, 0 câu vượt lớp của Lucas), và em vừa sửa nốt 1 lỗi nhỏ về thứ tự độ khó ở gói Đảo Kho Báu Toán Học (do_kho ở level 5 bị tụt từ 3 xuống 1 ở level 6 → đã chỉnh tăng đều 1→5)",
        "Lucie có 15 CIECAS, mua 2kg táo hết 12.000đ. Tính 24 × 3 = ?",
        "Lucas chạy 500m trong 5 phút, sau đó đi thêm 1km. Hỏi 84 ÷ 4 = ___?",
        "Nhiệt độ ngoài trời là 25°C, độ ẩm 80%, chai nước 500ml và bình 2l."
    ]
    for t in samples:
        print("OUT:", chuan_hoa_van_noi(t))
