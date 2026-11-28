# -*- coding: utf-8 -*-
"""Tự động nâng cấp TOÀN BỘ ảnh truyện & kiến thức (games/sach-truyen/anh/, games/ky-nang/anh/, ...)
thành Video hoạt hình AI cử động thật bằng Google Gemini Veo API (Image-to-Video) ngay trên GitHub Actions.
- Không cần cài thêm thư viện ngoài (chỉ dùng thư viện chuẩn Python + ffmpeg).
- Dùng tệp video/veo-done.json để đánh dấu các cảnh ĐÃ là video AI Veo thật:
  * Ghi đè thay thế các clip zoom/pan cũ từ ffmpeg.
  * Tuyệt đối KHÔNG ghi đè các clip AI Veo thật đã làm (bao gồm bộ tuan-30 có sẵn).
- Mặc định mỗi vòng chạy VEO_BATCH_SIZE=15 clip (tổng ~18 vòng cho ~270 ảnh),
  có trần thời gian an toàn VEO_MAX_SECONDS=1500s để GitHub Actions luôn kịp lưu & commit.
- Cần biến môi trường GEMINI_API_KEY (từ Google AI Studio có bật Veo API).
"""
import base64
import json
import os
import re
import shutil
import subprocess
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
VEO_MODEL = os.environ.get("VEO_MODEL", "veo-2.0-generate-001").strip()
BATCH_SIZE = int(os.environ.get("VEO_BATCH_SIZE", "15"))
MAX_SECONDS = int(os.environ.get("VEO_MAX_SECONDS", "1500"))
POLL_INTERVAL = int(os.environ.get("VEO_POLL_INTERVAL", "10"))
MAX_POLL_SECONDS = int(os.environ.get("VEO_MAX_POLL_SECONDS", "360"))

API_BASE = "https://generativelanguage.googleapis.com/v1beta"
IMAGE_EXTS = {".webp", ".png", ".jpg", ".jpeg"}
SKIP_NAME_RE = re.compile(r"^(lucie|lucas|icon-|xu-ciecas)", re.I)

# Các clip hoạt hình AI cử động thật đã có sẵn trước khi chạy pipeline này
PRESEEDED_VEO = {
    "tuan-30-bia", "tuan-30-1", "tuan-30-2", "tuan-30-3",
    "tuan-30-4", "tuan-30-5", "tuan-30-6",
}

PRIORITY_TARGETS = [
    Path("games/sach-truyen"),
    Path("games/ky-nang"),
]

PROMPT_STORY = (
    "Animate this Pixar 3D pastel children's storybook illustration gently and joyfully. "
    "Keep every character's exact appearance and outfit unchanged (the older sister keeps her pink glasses, "
    "the younger brother has no glasses). Add subtle natural life: blinking eyes, warm smiles, gentle head nods, "
    "soft hand gestures, light breeze moving leaves, hair, and background elements. Smooth cinematic camera drift, "
    "cozy warm lighting, kid-friendly, no text, no subtitles, no watermarks."
)

PROMPT_SKILL = (
    "Animate this Pixar 3D children's life-skills comic scene smoothly and naturally. "
    "Preserve the exact characters, faces, clothing, and setting from the image (older sister wears pink glasses, "
    "younger brother wears no glasses). Bring the scene to life with gentle expressive movement, blinking, friendly smiles, "
    "and soft ambient motion. Bright cheerful lighting, smooth camera, no text, no speech bubbles, no watermarks."
)


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


def natural_key(p: Path):
    return [int(x) if x.isdigit() else x.lower() for x in re.split(r"(\d+)", p.stem)]


def load_veo_done(vid_dir: Path, is_story: bool) -> set:
    done_file = vid_dir / "veo-done.json"
    done = set()
    if done_file.exists():
        try:
            data = json.loads(done_file.read_text(encoding="utf-8"))
            if isinstance(data, list):
                done.update(str(x).lower() for x in data)
        except Exception:
            pass
    if is_story:
        for s in PRESEEDED_VEO:
            if (vid_dir / f"{s}.mp4").exists():
                done.add(s)
    return done


def save_manifests(vid_dir: Path, veo_done: set):
    (vid_dir / "veo-done.json").write_text(
        json.dumps(sorted(veo_done), ensure_ascii=False, indent=2), encoding="utf-8"
    )
    vids = sorted(p.stem for p in vid_dir.glob("*.mp4") if p.stat().st_size > 10000)
    (vid_dir / "danh-sach-video.json").write_text(
        json.dumps(vids, ensure_ascii=False), encoding="utf-8"
    )


def img_to_jpeg_b64(ffmpeg: str, img_path: Path) -> str:
    with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as tf:
        tmp_jpg = Path(tf.name)
    try:
        subprocess.run(
            [ffmpeg, "-y", "-loglevel", "error", "-i", str(img_path), "-q:v", "2", str(tmp_jpg)],
            check=True,
        )
        return base64.b64encode(tmp_jpg.read_bytes()).decode("ascii")
    finally:
        if tmp_jpg.exists():
            tmp_jpg.unlink()


def http_json(url: str, payload=None):
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"} if data else {},
        method="POST" if data else "GET",
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        return json.loads(resp.read().decode("utf-8"))


def generate_veo_clip(ffmpeg: str, img_path: Path, dst_mp4: Path, prompt: str):
    b64 = img_to_jpeg_b64(ffmpeg, img_path)
    start_url = f"{API_BASE}/models/{VEO_MODEL}:predictLongRunning?key={API_KEY}"
    payload = {
        "instances": [
            {
                "prompt": prompt,
                "image": {
                    "bytesBase64Encoded": b64,
                    "mimeType": "image/jpeg",
                },
            }
        ],
        "parameters": {
            "aspectRatio": "16:9",
            "durationSeconds": 5,
            "personGeneration": "allow_all",
        },
    }
    op = http_json(start_url, payload)
    op_name = op.get("name")
    if not op_name:
        raise RuntimeError(f"Khong nhan duoc operation name tu Veo API: {op}")

    poll_url = f"{API_BASE}/{op_name}?key={API_KEY}"
    t0 = time.monotonic()
    while True:
        if time.monotonic() - t0 > MAX_POLL_SECONDS:
            raise TimeoutError(f"Qua thoi gian cho Veo API ({MAX_POLL_SECONDS}s)")
        time.sleep(POLL_INTERVAL)
        status = http_json(poll_url)
        if status.get("done"):
            if "error" in status:
                raise RuntimeError(f"Veo API bao loi: {status['error']}")
            resp = status.get("response", {})
            samples = (
                resp.get("generateVideoResponse", {}).get("generatedSamples")
                or resp.get("predictions")
                or []
            )
            if not samples:
                raise RuntimeError(f"Khong co video tra ve: {resp}")
            vid_uri = (samples[0].get("video") or {}).get("uri")
            if not vid_uri:
                raise RuntimeError(f"Thieu video uri: {samples[0]}")
            break

    sep = "&" if "?" in vid_uri else "?"
    dl_url = f"{vid_uri}{sep}key={API_KEY}" if "key=" not in vid_uri else vid_uri

    with tempfile.NamedTemporaryFile(suffix=".raw.mp4", delete=False) as tf:
        raw_mp4 = Path(tf.name)
    tmp_out = dst_mp4.with_suffix(".veo.tmp.mp4")
    try:
        urllib.request.urlretrieve(dl_url, str(raw_mp4))
        # Nen chuan TV LG webOS & iPhone (H.264 main, 640px, 24fps, tat tieng goc de giong Hoai My doc ro)
        subprocess.run(
            [
                ffmpeg, "-y", "-loglevel", "error",
                "-i", str(raw_mp4),
                "-an",
                "-vf", "scale=640:-2:flags=lanczos,fps=24",
                "-c:v", "libx264", "-profile:v", "main", "-level", "3.1",
                "-pix_fmt", "yuv420p", "-crf", "26", "-preset", "veryfast",
                "-movflags", "+faststart", str(tmp_out),
            ],
            check=True,
        )
        if tmp_out.exists() and tmp_out.stat().st_size > 10000:
            tmp_out.replace(dst_mp4)
            return dst_mp4.stat().st_size // 1024
        raise RuntimeError("File MP4 sau khi nen qua nho")
    finally:
        if raw_mp4.exists():
            raw_mp4.unlink()
        if tmp_out.exists():
            tmp_out.unlink()


def main():
    dry_run = os.environ.get("VEO_DRY_RUN", "0") == "1"
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        print("Chua co ffmpeg, khong the xu ly video.")
        return
    if not API_KEY and not dry_run:
        print("Chua co GEMINI_API_KEY trong GitHub Secrets -> bo qua buoc Veo API.")
        return

    start_ts = time.monotonic()
    targets = discover_targets()
    if not targets:
        print("Khong tim thay thu muc games/*/anh nao.")
        return

    queue = []
    done_maps = {}
    for base in targets:
        anh_dir = base / "anh"
        vid_dir = base / "video"
        vid_dir.mkdir(parents=True, exist_ok=True)
        is_story = base.name == "sach-truyen"
        veo_done = load_veo_done(vid_dir, is_story)
        done_maps[base] = (vid_dir, veo_done)

        imgs = sorted(
            (
                p for p in anh_dir.iterdir()
                if p.is_file()
                and p.suffix.lower() in IMAGE_EXTS
                and p.stat().st_size > 1000
                and not SKIP_NAME_RE.match(p.name)
            ),
            key=natural_key,
        )
        for img in imgs:
            stem = img.stem.lower()
            if stem in veo_done:
                continue
            prompt = PROMPT_STORY if is_story else PROMPT_SKILL
            queue.append((base, img, vid_dir / f"{img.stem}.mp4", stem, prompt))

    total_remaining = len(queue)
    batch = queue if BATCH_SIZE <= 0 else queue[:BATCH_SIZE]
    rounds_est = (total_remaining + max(1, BATCH_SIZE) - 1) // max(1, BATCH_SIZE) if BATCH_SIZE > 0 else 1
    print(
        f"Veo API ({VEO_MODEL}) | Con lai: {total_remaining} anh (~{rounds_est} vong x {BATCH_SIZE}) "
        f"| Dot nay: {len(batch)} clip."
    )

    if dry_run:
        for idx, (base, img, dst, stem, _) in enumerate(batch[:10], 1):
            print(f"  [DRY {idx}/{len(batch)}] {base.name}/{img.name} -> {dst}")
        return

    ok_cnt = 0
    fail_cnt = 0
    for idx, (base, img, dst, stem, prompt) in enumerate(batch, 1):
        if time.monotonic() - start_ts >= MAX_SECONDS:
            print(f"Dat nguong thoi gian an toan {MAX_SECONDS}s, dung som de kip commit.")
            break
        try:
            kb = generate_veo_clip(ffmpeg, img, dst, prompt)
            vid_dir, veo_done = done_maps[base]
            veo_done.add(stem)
            save_manifests(vid_dir, veo_done)
            ok_cnt += 1
            print(f"  [VEO OK {ok_cnt}/{len(batch)}] {dst} ({kb} KB)")
        except Exception as e:
            fail_cnt += 1
            print(f"  [VEO LOI {idx}/{len(batch)}] {img.name}: {e}")

    for base, (vid_dir, veo_done) in done_maps.items():
        save_manifests(vid_dir, veo_done)
        print(f"Cap nhat {base.name}: {len(veo_done)} video AI Veo da hoan thanh.")

    left_after = max(0, total_remaining - ok_cnt)
    print(f"Hoan tat vong nay trong {int(time.monotonic() - start_ts)}s: +{ok_cnt} clip Veo, loi {fail_cnt}, con lai {left_after} anh.")


if __name__ == "__main__":
    main()
