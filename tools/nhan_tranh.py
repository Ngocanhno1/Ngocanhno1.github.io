"""Kéo tranh mà tab vẽ (Chrome, AI Studio) đã gửi lên Firebase về kho, SOÁT LỖI bằng Gemini trước khi nhận, rồi xóa khỏi Firebase.
Tab vẽ (tools/gemini-trinh-duyet.js, tools/gemini-ky-nang.js) gửi ngay từng tranh lên:
  sach-truyen-tai/<ten>  -> games/sach-truyen/anh/<ten>.webp  (+ co-nhan-vat.json)
  ky-nang-tai/<ten>      -> games/ky-nang/anh/<ten>.webp      (+ da-ve.json)
Tranh bị loại (vẽ trùng người, có chữ, tay chân dị dạng...) không vào kho mà ghi vào <nhanh>-ve-lai/<ten> = {ly_do, t};
tab vẽ đọc danh sách đó để tự vẽ lại, kèm lý do. Không có GEMINI_API_KEY hoặc gọi API lỗi thì nhận luôn (không chặn việc)."""
import base64, json, os, time, urllib.request

GOC = 'https://lucie-lucas-ciecas-default-rtdb.asia-southeast1.firebasedatabase.app/gd_hh1g8b83gym1g74zmily/'
NHANH = {
    'sach-truyen': ('games/sach-truyen/anh', 'co-nhan-vat.json'),
    'ky-nang': ('games/ky-nang/anh', 'da-ve.json'),
}
KHOA = os.environ.get('GEMINI_API_KEY', '')
MO_HINH = os.environ.get('GEMINI_MODEL', 'gemini-4-argon')
NHAN_VAT = 'games/sach-truyen/anh/nhan-vat.webp'
LENH = ("You are checking an illustration for a Vietnamese children's picture book (soft watercolor style). "
        "Image 1 is the character reference sheet of the family: LUCIE (8-year-old girl, clear pink glasses, long black hair with bangs), "
        "LUCAS (6-year-old boy, round cheeks, short black hair, NO glasses), MOM and DAD. Image 2 is the new illustration. "
        "Reject image 2 only for clear problems: the same family member drawn twice in one picture; Lucas wearing glasses or Lucie without glasses; "
        "the children's faces clearly not matching the reference; any visible text, letters, numbers or speech bubbles; "
        "deformed hands, extra limbs or broken faces; anything not suitable for young children. Minor style differences are fine. "
        'Reply JSON only: {"ok": true or false, "ly_do": "short reason in Vietnamese, empty if ok"}')


def goi(url, du_lieu=None, cach='GET'):
    req = urllib.request.Request(url, data=None if du_lieu is None else json.dumps(du_lieu).encode(), method=cach,
                                 headers={'Content-Type': 'application/json'})
    with urllib.request.urlopen(req, timeout=120) as r:
        return json.loads(r.read() or b'null')


def soat(ten, du_lieu):
    """Trả (ok, ly_do). Lỗi gọi API -> coi như đạt."""
    if not KHOA or not os.path.exists(NHAN_VAT):
        return True, ''
    anh = lambda b: {'inline_data': {'mime_type': 'image/webp', 'data': base64.b64encode(b).decode()}}
    than = {'contents': [{'parts': [{'text': LENH}, anh(open(NHAN_VAT, 'rb').read()), anh(du_lieu)]}],
            'generationConfig': {'responseMimeType': 'application/json', 'temperature': 0}}
    try:
        kq = goi(f'https://generativelanguage.googleapis.com/v1beta/models/{MO_HINH}:generateContent?key={KHOA}', than, 'POST')
        tok = (kq.get('usageMetadata') or {}).get('totalTokenCount', 0)
        try:
            goi(GOC + 'argon/lan.json', {'e': 'API máy chủ', 't': int(time.time() * 1000), 'tok': tok, 'viec': 'Soát tranh ' + ten,
                                        'phien': 'Soát tranh tự động', 'kq': 'ok'}, 'POST')
        except Exception:
            pass
        chu = kq['candidates'][0]['content']['parts'][0]['text']
        j = json.loads(chu[chu.find('{'):chu.rfind('}') + 1])
        return bool(j.get('ok', True)), str(j.get('ly_do', ''))[:200]
    except Exception as e:
        print('  soát lỗi (vẫn nhận):', ten, str(e)[:120])
        return True, ''


da_xu_ly, tom_tat = [], []
for nhanh, (thu_muc, tep_ds) in NHANH.items():
    try:
        ds = goi(GOC + nhanh + '-tai.json?shallow=true') or {}
    except Exception as e:
        print('không đọc được', nhanh, e)
        continue
    moi = []
    for ten in sorted(ds):
        v = goi(f'{GOC}{nhanh}-tai/{ten}.json')
        if not v or not v.get('b'):
            continue
        da_xu_ly.append(f"{nhanh}-tai/{ten}|{v.get('t', '')}")
        du_lieu = base64.b64decode(v['b'])
        if du_lieu[:4] != b'RIFF' or len(du_lieu) < 5000:
            print('bỏ qua tệp hỏng', nhanh, ten)
            continue
        ok, ly_do = (True, '') if ten == 'nhan-vat' else soat(ten, du_lieu)
        if not ok:
            goi(f'{GOC}{nhanh}-ve-lai/{ten}.json', {'ly_do': ly_do or 'không đạt', 't': int(time.time() * 1000)}, 'PUT')
            tom_tat.append(f'loại {ten}')
            print('LOẠI', nhanh, ten, '-', ly_do)
            continue
        os.makedirs(thu_muc, exist_ok=True)
        with open(f'{thu_muc}/{ten}.webp', 'wb') as f:
            f.write(du_lieu)
        if ten != 'nhan-vat':
            moi.append(ten + '.webp')
        tom_tat.append(ten)
        print('nhận', nhanh, ten, len(du_lieu))
    if moi:
        p = f'{thu_muc}/{tep_ds}'
        cu = json.load(open(p)) if os.path.exists(p) else []
        json.dump(sorted(set(cu) | set(moi)), open(p, 'w'), ensure_ascii=False)

with open('/tmp/da-nhan.txt', 'w') as f:
    f.write('\n'.join(da_xu_ly))
with open('/tmp/tom-tat.txt', 'w') as f:
    f.write(' '.join(tom_tat)[:200])
print('Tổng:', len(da_xu_ly), 'tranh;', sum(1 for x in tom_tat if x.startswith('loại')), 'bị loại')
