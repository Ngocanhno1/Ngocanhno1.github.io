"""Tách bản đọc cả truyện của Gemini TTS (PCM 24 kHz) thành từng câu theo khoảng lặng, làm sạch, ghi mp3 đè giọng cũ.
Dùng: python tools/tach_giong_gemini.py <tệp.pcm> <mã truyện, vd tuan-26> [--thu]"""
import json, subprocess, sys
import numpy as np

SR = 24000


def tach(pcm, cau):
    a = np.frombuffer(open(pcm, "rb").read(), dtype="<i2").astype(np.float32)
    win = SR // 50
    e = np.sqrt(np.mean(a[:len(a) // win * win].reshape(-1, win) ** 2, axis=1))
    im = e < 250
    gaps = []  # (độ dài, giữa)
    i = 0
    while i < len(im):
        if im[i]:
            j = i
            while j < len(im) and im[j]: j += 1
            if j - i >= 12 and i > 0 and j < len(im): gaps.append((j - i, (i + j) // 2))
            i = j
        else: i += 1
    # Ghép câu bằng quy hoạch động: chọn n-1 khoảng lặng sao cho độ dài từng đoạn gần với số chữ của câu
    n = len(cau); w = np.array([max(1, len(c.split())) + 1.5 for c in cau], dtype=float)
    best = None
    for bo_dau in (0, 1):
        m = n + bo_dau
        G = [0] + [g[1] for g in sorted(gaps, key=lambda g: g[1])] + [len(e)]
        L = [0] + [g[0] for g in sorted(gaps, key=lambda g: g[1])] + [0]
        if len(G) - 2 < m - 1: continue
        ww = np.concatenate([[8.0], w]) if bo_dau else w
        rate = len(e) / ww.sum()
        INF = 1e18; P = len(G)
        dp = np.full((m + 1, P), INF); bk = np.zeros((m + 1, P), dtype=int); dp[0][0] = 0
        for k in range(1, m + 1):
            for j in range(1, P):
                if k == m and j != P - 1: continue
                if k < m and j == P - 1: continue
                exp = ww[k - 1] * rate
                for i in range(max(0, j - 40), j):
                    if dp[k - 1][i] >= INF: continue
                    d = G[j] - G[i]
                    c = dp[k - 1][i] + (np.log(d / exp)) ** 2 - (0.004 * L[j] if k < m else 0)
                    if c < dp[k][j]: dp[k][j] = c; bk[k][j] = i
        if dp[m][P - 1] >= INF: continue
        cut = []; j = P - 1
        for k in range(m, 0, -1): i = bk[k][j]; cut.append((G[i], G[j])); j = i
        cut = cut[::-1][bo_dau:]
        seg = [(x * win, y * win) for x, y in cut]
        r = [((b - a_) / SR) / max(1, len(c.split())) for (a_, b), c in zip(seg, cau)]
        diem = dp[m][P - 1] / m
        if best is None or diem < best[0]: best = (diem, seg, r)
    return a, best


def sach(x):
    win = SR // 50
    e = np.sqrt(np.mean(x[:len(x) // win * win].reshape(-1, win) ** 2, axis=1))
    on = np.where(e >= 250)[0]
    if len(on): x = x[max(0, on[0] - 2) * win:min(len(x), (on[-1] + 4) * win)]
    fi, fo = SR // 50, SR * 12 // 100
    x = x.copy(); x[:fi] *= np.linspace(0, 1, fi); x[-fo:] *= np.linspace(1, 0, fo)
    return x


def main():
    pcm, ma = sys.argv[1], sys.argv[2]
    cau = json.load(open("giong-gemini/cau.json", encoding="utf-8"))[ma]
    a, best = tach(pcm, [c for _, c in cau])
    if best is None: sys.exit("không đủ khoảng lặng để tách")
    diem, seg, r = best
    lech = [i for i, (v, c) in enumerate(zip(r, cau)) if len(c[1].split()) > 4 and (v < 0.18 or v > 0.6)]
    print(ma, "câu", len(cau), "độ lệch", round(float(diem), 2), "câu nghi lệch", lech)
    if diem > 0.25 or len(lech) > 3: sys.exit("tách không khớp, giữ giọng cũ")
    for (h, c), (s, t) in zip(cau, seg):
        x = sach(a[s:t]).astype("<i2").tobytes()
        ra = ("giong-gemini/thu/" if "--thu" in sys.argv else "games/anh-chung/giong/") + h + ".mp3"
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", "-b:a", "64k", ra], input=x, check=True)
    print("đã ghi", len(cau), "câu")


main()
