"""Máy chủ tự NGHE LẠI giọng VieNeu của Sách truyện nói và đọc lại câu bị lỗi.

VieNeu thỉnh thoảng đọc lắp, nuốt chữ, đọc lí nhí. Với mỗi câu trong truyện:
  1. Nhận dạng giọng nói (faster-whisper) file mp3 đã đọc, so với chữ gốc.
  2. Khớp dưới NGUONG thì đọc lại (nhiệt độ thấp, ổn định hơn), tối đa SO_LAN lần, giữ bản khớp nhất.
Kết quả lưu ở games/anh-chung/giong/kiem-tra.json ({mã: điểm}) để lần sau không nghe lại câu đã đạt.
"""
import difflib, glob, json, os, re, subprocess, sys, time, unicodedata

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import doc_giong as dg

KQ = f"{dg.RA}/kiem-tra.json"
NGUONG = float(os.environ.get("NGUONG", "0.85"))
SO_LAN = int(os.environ.get("SO_LAN", "5"))
HAN = float(os.environ.get("HAN_PHUT_KIEM", "150")) * 60
NHIET = [0.4, 0.5, 0.3, 0.6, 0.45]
TEN = {"lu", "xi", "cát", "cat", "lucy", "lucie", "lucas", "luca", "xì", "lúc", "lu-xi", "lu-cát", "lu-xi", "lux"}


def tu(s):
    s = unicodedata.normalize("NFC", s).lower()
    s = re.sub(r"[^\w\s]", " ", s)
    return [w for w in s.split() if w not in TEN]


def diem(goc, nghe):
    a, b = tu(goc), tu(nghe)
    if not a:
        return 1.0
    return difflib.SequenceMatcher(None, a, b).ratio()


def main():
    cau = {}
    for f in sorted(glob.glob("games/sach-truyen/truyen/tuan-*.json")):   # truyện phát sớm nghe trước
        for p in dg.cau_truyen(f):
            cau.setdefault(dg.ma(dg.chuan(p)), p)
    kq = json.load(open(KQ)) if os.path.exists(KQ) else {}
    can = [(k, v) for k, v in cau.items()
           if os.path.exists(f"{dg.RA}/{k}.mp3") and kq.get(k, 0) < NGUONG and len(tu(v)) >= 2 and k not in kq]
    print(f"{len(cau)} câu truyện, cần nghe lại {len(can)}", flush=True)
    if not can:
        return
    from faster_whisper import WhisperModel
    try:
        asr = WhisperModel("large-v3-turbo", device="cpu", compute_type="int8")
    except Exception as e:
        print("không tải được turbo, dùng medium:", e, flush=True)
        asr = WhisperModel("medium", device="cpu", compute_type="int8")

    def nghe(f):
        seg, _ = asr.transcribe(f, language="vi", beam_size=1, vad_filter=False, condition_on_previous_text=False)
        return " ".join(s.text for s in seg)

    tts = None
    bd, sua, hong = time.time(), 0, []
    for i, (k, v) in enumerate(can):
        if time.time() - bd > HAN:
            print("Hết giờ, lần sau nghe tiếp", flush=True); break
        f = f"{dg.RA}/{k}.mp3"
        tot = diem(v, nghe(f))
        if tot < NGUONG:
            if tts is None:
                from vieneu import Vieneu
                tts = Vieneu()
            doc = v if re.search(r"[.!?…]$", v) else v + "."
            for lan in range(SO_LAN):
                try:
                    wav = tts.infer(doc, voice=dg.GIONG, temperature=NHIET[lan % len(NHIET)])
                    tts.save(wav, "/tmp/k.wav")
                    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", "/tmp/k.wav", "-ac", "1", "-ar", "24000", "-b:a", "40k", "/tmp/k.mp3"], check=True)
                except Exception as e:
                    print("  lỗi đọc", k, e, flush=True); continue
                d = diem(v, nghe("/tmp/k.mp3"))
                if d > tot:
                    tot = d; os.replace("/tmp/k.mp3", f)
                if tot >= NGUONG:
                    break
            sua += 1
            print(f"  đọc lại {k} -> {tot:.2f}: {v[:70]}", flush=True)
            if tot < NGUONG:
                hong.append(v)
        kq[k] = round(tot, 3)
        if (i + 1) % 60 == 0:
            json.dump(kq, open(KQ, "w"), indent=0)
            if os.environ.get("GITHUB_ACTIONS"):
                dg.luu(f"Giọng truyện: đã nghe lại {i + 1}/{len(can)} câu")
    json.dump(kq, open(KQ, "w"), indent=0)
    print(f"Nghe {len(can)} câu, đọc lại {sua}, còn chưa đạt {len(hong)}", flush=True)
    for v in hong:
        print("  CHƯA ĐẠT:", v, flush=True)
    if os.environ.get("GITHUB_ACTIONS"):
        dg.luu("Giọng truyện: nghe lại và đọc lại câu lỗi")


if __name__ == "__main__":
    main()
