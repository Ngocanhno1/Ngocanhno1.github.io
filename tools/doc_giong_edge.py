"""Đọc lại TOÀN BỘ giọng game và truyện bằng edge-tts (giọng Hoài My), thay giọng VieNeu bị ngắt quãng.
Dùng lại đúng cách gom câu của tools/doc_giong.py (cùng mã file), chia nhiều máy: MANH=<i> SO_MANH=<n>.
Bỏ qua câu truyện đã đọc bằng Gemini (giong-gemini/da-doc.json). Nhớ tiến độ ở games/anh-chung/giong/edge-xong-<i>.txt."""
import asyncio, json, os, re, sys, types
sys.path.insert(0, os.path.dirname(__file__))
import doc_giong as G

MANH, SO = int(os.environ.get("MANH", "0")), int(os.environ.get("SO_MANH", "1"))
GIONG = "vi-VN-HoaiMyNeural"
SO_FILE = f"{G.RA}/edge-xong-{MANH}.txt"
xong = set(open(SO_FILE).read().split()) if os.path.exists(SO_FILE) else set()
try:
    cau = json.load(open("giong-gemini/cau.json", encoding="utf-8"))
    for m in json.load(open("giong-gemini/da-doc.json")):
        xong.update(k for k, _ in cau.get(m, []))
except Exception as e:
    print("không đọc được sổ Gemini", e)


class EdgeTTS:
    def infer(self, text, voice=None):
        return text

    def save(self, text, path):
        import edge_tts
        for lan in range(4):
            try:
                asyncio.run(edge_tts.Communicate(text, GIONG, rate="-5%").save("/tmp/c.mp3"))
                os.replace("/tmp/c.mp3", path); return
            except Exception as e:
                print("  thử lại", lan, e, flush=True); import time; time.sleep(3 * (lan + 1))
        raise RuntimeError("edge-tts lỗi")


m = types.ModuleType("vieneu"); m.Vieneu = EdgeTTS; sys.modules["vieneu"] = m
G.GIONG_PHU = []          # chỉ một giọng chính
ffmpeg_goc = G.subprocess.run


def run_moi(cmd, *a, **k):   # bước đổi wav->mp3 của doc_giong: ta đã có mp3, chỉ chuẩn hóa lại
    if isinstance(cmd, list) and cmd[:1] == ["ffmpeg"] and "/tmp/c.wav" in cmd:
        out = cmd[-1]
        r = ffmpeg_goc(["ffmpeg", "-loglevel", "error", "-y", "-i", out, "-ac", "1", "-ar", "24000", "-b:a", "48k", "/tmp/d.mp3"], check=True)
        os.replace("/tmp/d.mp3", out)
        k_ = os.path.basename(out)[:-4]; xong.add(k_)
        with open(SO_FILE, "a") as f: f.write(k_ + "\n")
        return r
    return ffmpeg_goc(cmd, *a, **k)


G.subprocess.run = run_moi
# coi như "chưa có" mọi câu thuộc mảnh này mà edge chưa đọc; câu mảnh khác coi như đã có
nguon = open(G.__file__, encoding="utf-8").read()
nguon = nguon.replace('co = {f[:-4] for f in os.listdir(thu) if f.endswith(".mp3")}',
                      'co = {k for k in ds if k in XONG or int(k, 16) % SO_MANH != MANH}')
nguon = nguon.replace('tts.save(wav, "/tmp/c.wav")', 'tts.save(wav, f"{thu}/{k}.mp3")')
nguon = re.sub(r'GIONG_PHU = \[.*?\]\n', 'GIONG_PHU = []\n', nguon, flags=re.S)
nguon = nguon.replace('Giọng VieNeu', 'Giọng Hoài My').replace('if __name__ == "__main__":\n    main()', '')
ns = vars(G); ns.update(XONG=xong, SO_MANH=SO, MANH=MANH)
exec(compile(nguon, G.__file__, "exec"), ns)
ns["subprocess"].run = run_moi
ns["main"]()
