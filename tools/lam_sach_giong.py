"""Làm sạch file giọng Gemini TTS (WAV 24kHz mono): bỏ tiếng xẹt ở cuối, cắt khoảng lặng thừa, vuốt nhỏ đầu/cuối."""
import array, math, sys, wave


def lam_sach(f):
    w = wave.open(f); sr = w.getframerate(); a = array.array("h", w.readframes(w.getnframes())); w.close()
    win = sr // 20  # 50 ms
    e = [math.sqrt(sum(x * x for x in a[j:j + win]) / win) for j in range(0, len(a) - win + 1, win)]
    # tiếng xẹt cuối: đoạn ồn ngắn (<0.5 s) đứng sau khoảng lặng >=0.15 s ở sát cuối file
    k = len(e)
    while k > 0 and e[k - 1] >= 300: k -= 1
    if 0 < len(e) - k <= 10:
        lang = 0
        while k - lang - 1 >= 0 and e[k - lang - 1] < 300: lang += 1
        if lang >= 3: a = a[:(k - lang) * win]; e = e[:k - lang]
    # cắt lặng hai đầu
    i = 0
    while i < len(e) and e[i] < 300: i += 1
    j = len(e)
    while j > i and e[j - 1] < 300: j -= 1
    a = a[max(0, i * win - win):min(len(a), j * win + 2 * win)]
    # vuốt 20 ms đầu, 120 ms cuối
    fi, fo = sr // 50, sr * 12 // 100
    for n in range(min(fi, len(a))): a[n] = int(a[n] * n / fi)
    for n in range(min(fo, len(a))): a[-1 - n] = int(a[-1 - n] * n / fo)
    o = wave.open(f, "wb"); o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr); o.writeframes(a.tobytes()); o.close()
    return len(a) / sr


if __name__ == "__main__":
    for f in sys.argv[1:]: print(f, round(lam_sach(f), 2), "s")
