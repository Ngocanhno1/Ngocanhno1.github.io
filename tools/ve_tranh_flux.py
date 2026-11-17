"""Máy chủ GitHub tự vẽ tranh cho Sách truyện nói, miễn phí, không giới hạn lượt, không chữ in mờ.

Dùng mô hình mở FLUX.1-schnell (giấy phép Apache 2.0, bản nén GGUF của second-state trên Hugging Face)
chạy bằng stable-diffusion.cpp (github.com/leejet/stable-diffusion.cpp) trên CPU của GitHub Actions.

  python tools/ve_tranh_flux.py liet-ke          -> in danh sách mã truyện còn thiếu tranh (JSON, cho matrix)
  python tools/ve_tranh_flux.py ve tuan-05       -> vẽ các tranh còn thiếu của truyện tuan-05, vẽ xong tranh nào đẩy lên ngay tranh đó
Tranh đã có (kể cả tranh Gemini vẽ) thì giữ nguyên, không vẽ lại.
Tranh FLUX mang dấu "FLUX.1-schnell" trong tệp: việc Gemini hằng ngày (tools/gemini-trinh-duyet.js) sẽ vẽ lại đẹp hơn rồi thay thế.
"""
import glob, json, os, subprocess, sys, time

TM = "games/sach-truyen"
SD = os.environ.get("SD_BIN", "sd")
MD = os.environ.get("MODELS", "/tmp/models")
KIEU = ("Children's picture-book illustration, soft watercolor painting on textured paper, warm gentle pastel colors, "
        "cozy and peaceful, simple clean composition. No people, no humans, no faces, no text, no letters, no signature. ")


DAU = "FLUX.1-schnell"   # dấu ghi trong tệp ảnh: Gemini nhìn dấu này để vẽ lại tranh đẹp hơn


def dau_flux():
    from PIL import Image
    e = Image.Exif(); e[0x0131] = DAU   # thẻ Software
    return e.tobytes()


def danh_dau():
    """Gắn dấu FLUX cho tranh do máy vẽ trước khi có dấu (nhận ra qua lời commit "Tranh FLUX vẽ")."""
    from PIL import Image
    sua = []
    for f in sorted(glob.glob(f"{TM}/anh/*.webp")):
        if DAU.encode() in open(f, "rb").read():
            continue
        tin = subprocess.run(["git", "log", "-1", "--format=%s", "--", f], capture_output=True, text=True).stdout.strip()
        if tin.startswith("Tranh FLUX"):
            im = Image.open(f).convert("RGB"); im.save(f, "WEBP", quality=90, method=6, exif=dau_flux()); sua.append(f)
    print("gắn dấu", len(sua), "tranh", flush=True)
    if sua and os.environ.get("GITHUB_ACTIONS"):
        subprocess.run(["git", "add"] + sua, check=True)
        subprocess.run(["git", "commit", "-q", "-m", "Gắn dấu tranh FLUX (để Gemini vẽ lại đẹp hơn)"], check=True)
        for _ in range(8):
            subprocess.run(["git", "pull", "-q", "--rebase", "origin", "main"])
            if subprocess.run(["git", "push", "-q", "origin", "HEAD:main"]).returncode == 0:
                break
            time.sleep(15)


def thieu(ma):
    t = json.load(open(f"{TM}/truyen/{ma}.json", encoding="utf-8"))
    ds = [(f"{ma}-bia", t["bia"])] + [(f"{ma}-{i}", p["anh"]) for i, p in enumerate(t["trang"], 1)]
    return t, [(ten, mt) for ten, mt in ds if not os.path.exists(f"{TM}/anh/{ten}.webp")]


def liet_ke():
    ds = []
    for f in glob.glob(f"{TM}/truyen/tuan-*.json"):
        ma = os.path.basename(f)[:-5]
        t, th = thieu(ma)
        if th:
            ds.append((t.get("ngay", ""), ma))
    ds.sort()
    print(json.dumps([m for _, m in ds][:12]))


def day_len(tep, tin):
    subprocess.run(["git", "add", tep], check=True)
    subprocess.run(["git", "commit", "-q", "-m", tin], check=True)
    for _ in range(8):
        subprocess.run(["git", "pull", "-q", "--rebase", "origin", "main"])
        if subprocess.run(["git", "push", "-q", "origin", "HEAD:main"]).returncode == 0:
            return
        time.sleep(15)


def ve(ma):
    from PIL import Image
    t, th = thieu(ma)
    seed0 = int(t.get("so", 1)) * 1000
    print(f"{ma}: còn thiếu {len(th)} tranh", flush=True)
    for i, (ten, mt) in enumerate(th):
        bd = time.time()
        r = subprocess.run([SD, "--diffusion-model", f"{MD}/flux1-schnell-Q4_0.gguf", "--vae", f"{MD}/ae.safetensors",
                            "--clip_l", f"{MD}/clip_l.safetensors", "--t5xxl", f"{MD}/t5xxl-Q4_K.gguf",
                            "-p", KIEU + mt.rstrip(". ") + ".", "--cfg-scale", "1.0", "--sampling-method", "euler",
                            "--steps", os.environ.get("BUOC", "4"), "-W", "768", "-H", "512", "--seed", str(seed0 + i),
                            "-t", str(os.cpu_count() or 4), "-o", "/tmp/ve.png"], capture_output=True, text=True)
        if r.returncode != 0 or not os.path.exists("/tmp/ve.png"):
            print("  LỖI", ten, (r.stderr or r.stdout)[-1500:], flush=True)
            continue
        im = Image.open("/tmp/ve.png").convert("RGB").resize((960, 640), Image.LANCZOS)
        os.makedirs(f"{TM}/anh", exist_ok=True)
        im.save(f"{TM}/anh/{ten}.webp", "WEBP", quality=82, method=6, exif=dau_flux())
        os.remove("/tmp/ve.png")
        print(f"  vẽ xong {ten} trong {int(time.time() - bd)} giây", flush=True)
        if os.environ.get("GITHUB_ACTIONS"):
            day_len(f"{TM}/anh/{ten}.webp", f"Tranh FLUX vẽ: {ten}")


if __name__ == "__main__":
    if sys.argv[1] == "liet-ke":
        liet_ke()
    elif sys.argv[1] == "danh-dau":
        danh_dau()
    else:
        ve(sys.argv[2])
