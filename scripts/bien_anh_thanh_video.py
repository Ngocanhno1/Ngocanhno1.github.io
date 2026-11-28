# -*- coding: utf-8 -*-
"""Biến đổi TOÀN BỘ ảnh tĩnh (.webp/.png/.jpg) của các dự án Sách Truyện & Kiến Thức
(games/sach-truyen, games/ky-nang và mọi game có thư mục anh/) thành video MP4 mượt mà
chuẩn TV LG webOS & iPhone (H.264 main, 640x480, 24fps, 5 giây, ~250-450 KB/clip, tắt tiếng gốc).
- Không ghi đè file .mp4 đã tồn tại (giữ nguyên mọi clip hoạt hình AI cử động thật!).
- Mặc định chuyển TOÀN BỘ ảnh còn thiếu (VIDEO_BATCH_SIZE=0) bằng đa luồng song song,
  có giới hạn thời gian an toàn VIDEO_MAX_SECONDS (mặc định 480s) để GitHub Actions luôn kịp commit.
- Tự xuất file video/danh-sach-video.json cho từng dự án để hoat-hinh-truyen.js tự phát ngay.
"""
from concurrent.futures import ThreadPoolExecutor, as_completed
import json
import os
import re
import shutil
import subprocess
import time
from pathlib import Path

MAX_PER_RUN = int(os.environ.get("VIDEO_BATCH_SIZE", "0"))  # 0 = không giới hạn, chuyển toàn bộ
MAX_SECONDS = int(os.environ.get("VIDEO_MAX_SECONDS", "480"))
WORKERS = max(1, min(4, int(os.environ.get("VIDEO_WORKERS", str(os.cpu_count() or 2)))))

PRIORITY_TARGETS = [
    Path("games/sach-truyen"),
    Path("games/ky-nang"),
]

IMAGE_EXTS = {".webp", ".png", ".jpg", ".jpeg"}
SKIP_NAME_RE = re.compile(r"^(lucie|lucas|icon-|xu-ciecas)", re.I)

# 4 hiệu ứng chuyển động camera điện ảnh mượt mà (zoompan 24fps * 5s = 120 frames)
MOTIONS = [
    "scale=1280:-2,zoompan=z='min(zoom+0.0009,1.12)':d=120:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=640x480:fps=24",
    "scale=1280:-2,zoompan=z='1.10':d=120:x='(iw-iw/zoom)*on/120':y='ih/2-(ih/zoom/2)':s=640x480:fps=24",
    "scale=1280:-2,zoompan=z='if(lte(zoom,1.0),1.12,max(1.001,zoom-0.0009))':d=120:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=640x480:fps=24",
    "scale=1280:-2,zoompan=z='1.10':d=120:x='(iw-iw/zoom)*(1-on/120)':y='ih/2-(ih/zoom/2)':s=640x480:fps=24",
]


def discover_targets():
    seen = set()
    targets = []
    for t in PRIORITY_TARGETS:
        if (t / "anh").is_dir():
            targets.append(t)
            seen.add(t.resolve())
    games_root = Path("games")
    if games_root.is_dir():
        for sub in sorted(games_root.iterdir()):
            if not sub.is_dir() or sub.name == "anh-chung":
                continue
            if (sub / "anh").is_dir() and sub.resolve() not in seen:
                targets.append(sub)
                seen.add(sub.resolve())
    return targets


def convert_one(ffmpeg: str, img: Path, dst: Path, vf: str):
    tmp = dst.with_suffix(".tmp.mp4")
    try:
        subprocess.run(
            [
                ffmpeg, "-y", "-loglevel", "error",
                "-loop", "1", "-i", str(img),
                "-t", "5", "-an",
                "-vf", vf,
                "-c:v", "libx264", "-profile:v", "main", "-level", "3.1",
                "-pix_fmt", "yuv420p", "-crf", "28", "-preset", "veryfast",
                "-movflags", "+faststart", str(tmp),
            ],
            check=True,
        )
        if tmp.exists() and tmp.stat().st_size > 10000:
            tmp.replace(dst)
            return True, dst, dst.stat().st_size // 1024, ""
        if tmp.exists():
            tmp.unlink()
        return False, dst, 0, "file MP4 đầu ra quá nhỏ"
    except Exception as e:
        if tmp.exists():
            tmp.unlink()
        return False, dst, 0, str(e)


def main():
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        print("Chua co ffmpeg, bo qua buoc tao video.")
        return

    start_ts = time.monotonic()
    targets = discover_targets()
    if not targets:
        print("Khong tim thay thu muc games/*/anh nao.")
        return

    jobs = []
    for base in targets:
        anh_dir = base / "anh"
        vid_dir = base / "video"
        vid_dir.mkdir(parents=True, exist_ok=True)
        imgs = sorted(
            p for p in anh_dir.iterdir()
            if p.is_file()
            and p.suffix.lower() in IMAGE_EXTS
            and p.stat().st_size > 1000
            and not SKIP_NAME_RE.match(p.name)
        )
        for idx, img in enumerate(imgs):
            dst = vid_dir / (img.stem + ".mp4")
            if dst.exists() and dst.stat().st_size > 10000:
                continue
            jobs.append((img, dst, MOTIONS[idx % len(MOTIONS)]))

    if MAX_PER_RUN > 0:
        jobs = jobs[:MAX_PER_RUN]

    total_jobs = len(jobs)
    print(f"Tim thay {total_jobs} anh can bien doi sang MP4 tren {len(targets)} du an (workers={WORKERS}).")

    converted = 0
    failed = 0
    if total_jobs > 0:
        with ThreadPoolExecutor(max_workers=WORKERS) as ex:
            future_map = {}
            for img, dst, vf in jobs:
                if time.monotonic() - start_ts >= MAX_SECONDS:
                    print(f"Dat nguong thoi gian an toan {MAX_SECONDS}s, dung nhan them job de kip commit.")
                    break
                fut = ex.submit(convert_one, ffmpeg, img, dst, vf)
                future_map[fut] = img

            for fut in as_completed(future_map):
                ok, dst, kb, err = fut.result()
                if ok:
                    converted += 1
                    print(f"  [OK {converted}/{total_jobs}] {dst} ({kb} KB)")
                else:
                    failed += 1
                    print(f"  [LOI] {future_map[fut].name}: {err}")

    for base in targets:
        vid_dir = base / "video"
        if not vid_dir.is_dir():
            continue
        vids = sorted(p.stem for p in vid_dir.glob("*.mp4") if p.stat().st_size > 10000)
        (vid_dir / "danh-sach-video.json").write_text(
            json.dumps(vids, ensure_ascii=False), encoding="utf-8"
        )
        print(f"Cap nhat {vid_dir / 'danh-sach-video.json'}: {len(vids)} video MP4.")

    elapsed = int(time.monotonic() - start_ts)
    print(f"Hoan tat trong {elapsed}s: bien doi thanh cong {converted}, loi {failed}.")


if __name__ == "__main__":
    main()
