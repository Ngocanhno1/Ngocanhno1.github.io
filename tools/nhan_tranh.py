"""Kéo tranh Sách truyện mà tab vẽ (Chrome) đã gửi lên Firebase về kho, rồi xóa khỏi Firebase.
Tab vẽ gọi window.__guiFB(['tuan-05']) (tools/gemini-trinh-duyet.js). Không cần mở GitHub trên Chrome."""
import base64, json, os, urllib.request

FB = 'https://lucie-lucas-ciecas-default-rtdb.asia-southeast1.firebasedatabase.app/gd_hh1g8b83gym1g74zmily/sach-truyen-tai'
THU_MUC = 'games/sach-truyen/anh'


def lay(url):
    with urllib.request.urlopen(url, timeout=60) as r:
        return json.loads(r.read() or b'null')


ds = lay(FB + '.json?shallow=true') or {}
moi, da = [], []
for ten in sorted(ds):
    v = lay(f'{FB}/{ten}.json')
    if not v or not v.get('b'):
        continue
    du_lieu = base64.b64decode(v['b'])
    da.append(ten)
    if du_lieu[:4] != b'RIFF' or len(du_lieu) < 5000:
        print('bỏ qua tệp hỏng', ten)
        continue
    with open(f'{THU_MUC}/{ten}.webp', 'wb') as f:
        f.write(du_lieu)
    if ten != 'nhan-vat':
        moi.append(ten + '.webp')
    print('nhận', ten, len(du_lieu))

if moi:
    p = f'{THU_MUC}/co-nhan-vat.json'
    cu = json.load(open(p)) if os.path.exists(p) else []
    json.dump(sorted(set(cu) | set(moi)), open(p, 'w'))
with open('/tmp/da-nhan.txt', 'w') as f:
    f.write(' '.join(da))
