# -*- coding: utf-8 -*-
"""Tự động sinh toàn bộ giọng đọc MP3 tiếng Việt bằng DUY NHẤT giọng Hoài My (vi-VN-HoaiMyNeural)
qua Edge Neural TTS ngay trên GitHub Actions, khớp 100% mã hash FNV-1a với giong-noi.js.
- Quét cả tệp .json lẫn các tệp du-lieu.js (Sách Truyện, Trường Kỹ Năng và các game kiến thức).
- Mặc định TTS_MAX_PER_RUN=0 (sinh toàn bộ câu còn thiếu trong 1 lượt, có trần thời gian an toàn 420s).
"""
import asyncio
import json
import os
import re
import time
import unicodedata
from pathlib import Path

import edge_tts
from chuan_hoa_van_noi import chuan_hoa_van_noi

CAT_RE = re.compile(r"[.!?…;\n]+\s|\s[—–]\s")
STRIP_QUOTES_RE = re.compile(r'["“”\'‘’()\[\]«»*_]')
EDGE_PUNCT_RE = re.compile(r"^[\s.,!?…;:\-—–]+|[\s.,!?…;:\-—–]+$")
HAS_WORD_RE = re.compile(r"[\w\d]", re.UNICODE)
VN_RE = re.compile(r"[àáâãèéêìíòóôõùúýăđĩũơưạảấầẩẫậắằẳẵặẹẻẽếềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]", re.I)

VOICE = "vi-VN-HoaiMyNeural"
RATE = os.environ.get("TTS_RATE", "-4%")
MAX_PER_RUN = int(os.environ.get("TTS_MAX_PER_RUN", "0"))  # 0 = sinh toàn bộ
MAX_SECONDS = int(os.environ.get("TTS_MAX_SECONDS", "420"))

JS_FIELD_RE = re.compile(
    r'(?:doc|doc_tieu_de|doc_bai_hoc|doc_chuc|loi|cau|giai_thich|thong_diep|tieu_de)\s*:\s*"((?:[^"\\]|\\.)*)"'
)


def chuan_hash(s: str) -> str:
    s = unicodedata.normalize("NFC", s).lower()
    s = STRIP_QUOTES_RE.sub("", s)
    s = re.sub(r"\s+", " ", s)
    return EDGE_PUNCT_RE.sub("", s)


def ma_fnv1a(s: str) -> str:
    b = s.encode("utf-8")
    h = 0x811C9DC5
    for byte in b:
        h ^= byte
        h = (h * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}"


def tach_cau(raw_text: str):
    if not raw_text or not isinstance(raw_text, str):
        return []
    text = chuan_hoa_van_noi(raw_text)
    if not VN_RE.search(text):
        return []
    out = []
    for seg in CAT_RE.split(text):
        seg = seg.strip()
        if not seg or not HAS_WORD_RE.search(seg):
            continue
        c = chuan_hash(seg)
        if c:
            out.append((ma_fnv1a(c), seg))
    return out


def gom_tu_json(obj, bucket: list):
    if isinstance(obj, dict):
        for k, v in obj.items():
            if k in ("doc", "doc_tieu_de", "doc_bai_hoc", "doc_chuc", "loi", "cau", "giai_thich", "thong_diep") and isinstance(v, str):
                bucket.append(v)
            elif k in ("doc_dap", "dieu") and isinstance(v, list):
                bucket.extend([x for x in v if isinstance(x, str)])
            elif isinstance(v, (dict, list)):
                gom_tu_json(v, bucket)
    elif isinstance(obj, list):
        if len(obj) >= 6 and isinstance(obj[0], str) and isinstance(obj[1], (str, int)):
            if isinstance(obj[1], str) and VN_RE.search(obj[1]):
                bucket.append(obj[1])
            elif len(obj) >= 8 and isinstance(obj[2], str):
                bucket.append(obj[2])
                if isinstance(obj[7], str):
                    bucket.append(obj[7])
            return
        for item in obj:
            if isinstance(item, str) and "|" in item:
                parts = item.split("|")
                if len(parts) >= 8:
                    bucket.append(parts[2])
                    bucket.append(parts[7])
            elif isinstance(item, (dict, list)):
                gom_tu_json(item, bucket)


def gom_tu_js(js_text: str, bucket: list):
    for m in JS_FIELD_RE.finditer(js_text):
        try:
            val = json.loads('"' + m.group(1) + '"')
            if isinstance(val, str) and VN_RE.search(val):
                bucket.append(val)
        except Exception:
            pass


async def sinh_1_cau(sem, text: str, dst: Path, start_ts: float):
    if time.monotonic() - start_ts >= MAX_SECONDS:
        return False
    async with sem:
        if time.monotonic() - start_ts >= MAX_SECONDS:
            return False
        tmp = dst.with_suffix(".tmp.mp3")
        try:
            comm = edge_tts.Communicate(text, VOICE, rate=RATE)
            await comm.save(str(tmp))
            if tmp.exists() and tmp.stat().st_size >= 512:
                tmp.replace(dst)
                return True
        except Exception:
            if tmp.exists():
                tmp.unlink()
    return False


async def main():
    start_ts = time.monotonic()
    repo = Path(".").resolve()
    giong_dir = repo / "games" / "anh-chung" / "giong"
    giong_dir.mkdir(parents=True, exist_ok=True)

    raw_texts = []
    skip = {"danh-sach.json", "giong.json", "package.json", "manifest.json", "danh-sach-video.json"}
    for jf in sorted((repo / "games").rglob("*.json")):
        if jf.name in skip or "anh-chung/giong" in str(jf).replace("\\", "/"):
            continue
        try:
            gom_tu_json(json.loads(jf.read_text(encoding="utf-8")), raw_texts)
        except Exception:
            pass

    for jsf in sorted((repo / "games").rglob("du-lieu.js")):
        try:
            gom_tu_js(jsf.read_text(encoding="utf-8"), raw_texts)
        except Exception:
            pass

    sentences = {}
    for rt in raw_texts:
        for h, seg in tach_cau(rt):
            sentences.setdefault(h, seg)

    todo = [
        (h, seg, giong_dir / f"{h}.mp3")
        for h, seg in sentences.items()
        if not (giong_dir / f"{h}.mp3").exists() or (giong_dir / f"{h}.mp3").stat().st_size < 512
    ]
    batch = todo if MAX_PER_RUN <= 0 else todo[:MAX_PER_RUN]
    print(f"Giong: {VOICE} | Tong cau: {len(sentences)} | Con thieu: {len(todo)} | Sinh dot nay: {len(batch)}")

    sem = asyncio.Semaphore(8)
    if batch:
        results = await asyncio.gather(
            *(sinh_1_cau(sem, seg, dst, start_ts) for _, seg, dst in batch),
            return_exceptions=True,
        )
        ok_cnt = sum(1 for r in results if r is True)
        print(f"Da sinh thanh cong: {ok_cnt}/{len(batch)} file MP3 Hoai My.")

    all_hashes = sorted(
        p.stem for p in giong_dir.glob("*.mp3")
        if len(p.stem) == 8 and p.stat().st_size >= 512
    )
    (giong_dir / "danh-sach.json").write_text(json.dumps(all_hashes, ensure_ascii=False), encoding="utf-8")
    print(f"Da cap nhat danh-sach.json: {len(all_hashes)} file MP3 (100% Hoai My).")


if __name__ == "__main__":
    asyncio.run(main())
