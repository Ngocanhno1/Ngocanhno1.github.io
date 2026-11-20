"""Đọc giọng bằng Gemini TTS (gọi API, chạy trên máy chủ GitHub).
Chế độ THỬ: đọc các câu trong giong-gemini/thu.txt -> giong-gemini/thu/<mã>.mp3 và trang so sánh giong-gemini/index.html.
Chế độ TRUYỆN: python tools/giong_gemini.py truyen -> đọc mọi câu Sách truyện, ghi đè games/anh-chung/giong/<mã>.mp3 (cùng mã với VieNeu)."""
import base64, json, os, subprocess, sys, time, urllib.request, glob
sys.path.insert(0, os.path.dirname(__file__))
import doc_giong as G

KEY = os.environ["GEMINI_API_KEY"]
API = "https://generativelanguage.googleapis.com/v1beta/"
GIONG = os.environ.get("GIONG", "Leda")
LOI = "Đọc to bằng tiếng Việt chuẩn giọng miền Bắc, như cô giáo kể chuyện cho bé trước giờ ngủ: ấm áp, chậm rãi, liền mạch, tự nhiên, không ngắt từng từ:\n"


def goi(url, body=None):
    req = urllib.request.Request(API + url + ("&" if "?" in url else "?") + "key=" + KEY,
                                 data=json.dumps(body).encode() if body else None,
                                 headers={"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=120))


def chon_mo_hinh():
    ten = [m["name"].split("/")[-1] for m in goi("models?pageSize=200").get("models", [])
           if "tts" in m["name"] and "generateContent" in m.get("supportedGenerationMethods", [])]
    print("Mô hình TTS:", ten)
    uu = sorted(ten, key=lambda n: (("pro" not in n), ("preview" in n), n), )
    return uu[0]


def doc(mh, cau, ra):
    body = {"contents": [{"parts": [{"text": LOI + cau}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": GIONG}}}}}
    for lan in range(6):
        try:
            r = goi(f"models/{mh}:generateContent", body)
            pcm = base64.b64decode(r["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", "-",
                            "-af", "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse",
                            "-b:a", "64k", ra], input=pcm, check=True)
            return True
        except Exception as e:
            print("  lỗi", lan, str(e)[:160]); time.sleep(20 * (lan + 1))
    return False


def main():
    mh = os.environ.get("MO_HINH") or chon_mo_hinh()
    print("Dùng", mh, "giọng", GIONG)
    if len(sys.argv) > 1 and sys.argv[1] == "truyen":
        cau = []
        for f in sorted(glob.glob("games/sach-truyen/truyen/tuan-*.json")):
            cau += G.cau_truyen(f)
        cau = list(dict.fromkeys(cau))
        so = 0
        for c in cau:
            ra = f"games/anh-chung/giong/{G.ma(G.chuan(c))}.mp3"
            if os.path.exists(ra + ".gemini"): continue
            if doc(mh, c, ra):
                open(ra + ".gemini", "w").close(); so += 1
            if so and so % 100 == 0:
                subprocess.run("git add -A games/anh-chung/giong && git commit -qm 'Giọng Gemini: đọc dần truyện' && git pull -q --rebase origin main && git push -q", shell=True)
        print("Đã đọc", so, "/", len(cau))
        return
    os.makedirs("giong-gemini/thu", exist_ok=True)
    hang = []
    for c in [x.strip() for x in open("giong-gemini/thu.txt", encoding="utf-8") if x.strip()]:
        m = G.ma(G.chuan(c))
        ok = doc(mh, c, f"giong-gemini/thu/{m}.mp3")
        hang.append((c, m, ok))
    h = ['<!DOCTYPE html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
         '<title>So sánh giọng đọc</title><style>body{font-family:system-ui;max-width:900px;margin:20px auto;padding:0 12px;font-size:19px}',
         '.c{border:1px solid #ddd;border-radius:12px;padding:12px;margin:12px 0}audio{width:100%}b{color:#d90479}</style>',
         f'<h2>So sánh giọng đọc truyện</h2><p>Mỗi câu nghe 2 giọng: <b>A = VieNeu (đang dùng)</b>, <b>B = Gemini ({mh}, giọng {GIONG})</b>.</p>']
    for c, m, ok in hang:
        h.append(f'<div class="c"><p>{c}</p><b>A · VieNeu</b><audio controls src="../games/anh-chung/giong/{m}.mp3"></audio>'
                 f'<b>B · Gemini</b>' + (f'<audio controls src="thu/{m}.mp3"></audio>' if ok else ' (lỗi)') + '</div>')
    open("giong-gemini/index.html", "w", encoding="utf-8").write("\n".join(h))


main()
