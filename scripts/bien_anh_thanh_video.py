# -*- coding: utf-8 -*-
"""Biến đổi dần toàn bộ ảnh tĩnh (.webp) của Sách Truyện & Trường Kỹ Năng thành video MP4 mượt mà
chuẩn TV LG webOS & iPhone (H.264 main, 640px, 24fps, 5 giây, ~300-450 KB/clip, tắt tiếng gốc).
- Không ghi đè file .mp4 đã tồn tại (giữ nguyên mọi clip hoạt hình AI cử động thật!).
- Mỗi lượt chạy chuyển tối đa MAX_PER_RUN ảnh (mặc định 25 ảnh) để chạy nhanh ~35s trên GitHub Actions.
- Tự xuất file video/danh-sach-video.json để hoat-hinh-truyen.js tự phát ngay không cần sửa HTML.
"""
import json
import os
import shutil
import subprocess
from pathlib import Path

MAX_PER_RUN = int(os.environ.get("VIDEO_BATCH_SIZE", "25"))
TARGETS = [
    Path("games/sach-truyen"),
    Path("games/ky-nang"),
]

# 4 hiệu ứng chuyển động camera điện ảnh mượt mà (zoompan 24fps * 5s = 120 frames)
MOTIONS = [
    "scale=1280:-2,zoompan=z='min(zoom+0.0009,1.12)':d=120:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=640x480:fps=24",
    "scale=1280:-2,zoompan=z='1.10':d=120:x='(iw-iw/zoom)*on/120':y='ih/2-(ih/zoom/2)':s=640x480:fps=24",
    "scale=1280:-2,zoompan=z='if(lte(zoom,1.0),1.12,max(1.001,zoom-0.0009))':d=120:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=640x480:fps=24",
    "scale=1280:-2,zoompan=z='1.10':d=120:x='(iw-iw/zoom)*(1-on/120)':y='ih/2-(ih/zoom/2)':s=640x480:fps=24",
]

def main():
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        print("Chua co ffmpeg, bo qua buoc tao video.")
        return

    converted = 0
    for base in TARGETS:
        anh_dir = base / "anh"
        vid_dir = base / "video"
        if not anh_dir.exists():
            continue
        vid_dir.mkdir(parents=True, exist_ok=True)

        imgs = sorted(p for p in anh_dir.glob("*.webp") if p.stat().st_size > 1000)
        for idx, img in enumerate(imgs):
            if converted >= MAX_PER_RUN:
                break
            dst = vid_dir / (img.stem + ".mp4")
            if dst.exists() and dst.stat().st_size > 10000:
                continue
            vf = MOTIONS[idx % len(MOTIONS)]
            try:
                subprocess.run([
                    ffmpeg, "-y", "-loglevel", "error",
                    "-loop", "1", "-i", str(img),
                    "-t", "5", "-an",
                    "-vf", vf,
                    "-c:v", "libx264", "-profile:v", "main", "-level", "3.1",
                    "-pix_fmt", "yuv420p", "-crf", "28", "-preset", "veryfast",
                    "-movflags", "+faststart", str(dst)
                ], check=True)
                converted += 1
                print(f"  [OK {converted}/{MAX_PER_RUN}] {dst} ({dst.stat().st_size // 1024} KB)")
            except Exception as e:
                print(f"  [LOI] {img.name}: {e}")
                if dst.exists():
                    dst.unlink()

        # Cập nhật danh-sach-video.json để trình duyệt biết ngay ảnh nào đã có MP4
        vids = sorted(p.stem for p in vid_dir.glob("*.mp4") if p.stat().st_size > 10000)
        (vid_dir / "danh-sach-video.json").write_text(json.dumps(vids, ensure_ascii=False), encoding="utf-8")
        print(f"Cap nhat {vid_dir / 'danh-sach-video.json'}: {len(vids)} video MP4.")

    print(f"Hoan tat dot nay: da bien doi them {converted} video MP4.")

if __name__ == "__main__":
    main()
