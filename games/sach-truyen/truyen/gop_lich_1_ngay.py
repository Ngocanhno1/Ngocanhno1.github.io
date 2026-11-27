# -*- coding: utf-8 -*-
"""Tự động gộp toàn bộ truyện (tuan-01..30) trong games/sach-truyen/truyen/ vào danh-sach.json
và đặt lịch phát hành MỖI NGÀY 1 CÂU CHUYỆN (tuan-01..15 mở sẵn đến hôm nay 2026-11-27,
tuan-16..30 mở mỗi ngày 1 truyện từ 2026-11-28 đến 2026-12-12).
"""
import json
from datetime import date, timedelta
from pathlib import Path

t_dir = Path("games/sach-truyen/truyen")
ds_path = t_dir / "danh-sach.json"

# Đọc toàn bộ tệp tuan-*.json hiện có trong kho
items = []
for fp in sorted(t_dir.glob("tuan-*.json")):
    try:
        d = json.loads(fp.read_text(encoding="utf-8"))
        so = int(d.get("so") or fp.stem.split("-")[1])
        ma = d.get("ma") or fp.stem
        tieu_de = d.get("tieu_de") or ma
        trang = len(d.get("trang") or []) or 6
        items.append((so, ma, tieu_de, trang, fp, d))
    except Exception as e:
        print("Bo qua", fp, e)

items.sort(key=lambda x: x[0])
# Xếp lịch 1 ngày/truyện: để truyện số 15 rơi đúng hôm nay 2026-11-27 (nếu có >=15 truyện)
# -> tuan-01 (2026-11-13) ... tuan-15 (2026-11-27) đã mở sẵn; tuan-16 (2026-11-28) ... mỗi ngày 1 truyện!
anchor_so = min(15, len(items))
base_day = date(2026, 11, 27) - timedelta(days=anchor_so - 1)

ds = []
for idx, (so, ma, tieu_de, trang, fp, d) in enumerate(items):
    ngay = (base_day + timedelta(days=idx)).isoformat()
    if d.get("ngay") != ngay:
        d["ngay"] = ngay
        fp.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding="utf-8")
    ds.append({
        "ma": ma,
        "so": so,
        "tieu_de": tieu_de,
        "ngay": ngay,
        "trang": trang,
    })

# Sắp xếp mới nhất lên đầu giống cấu trúc chuẩn của danh-sach.json
ds.sort(key=lambda x: x["so"], reverse=True)
ds_path.write_text(json.dumps(ds, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"DA CAP NHAT danh-sach.json: tong {len(ds)} truyen (moi ngay 1 truyen, tuan-{ds[-1]['so']:02d} {ds[-1]['ngay']} -> tuan-{ds[0]['so']:02d} {ds[0]['ngay']})")
