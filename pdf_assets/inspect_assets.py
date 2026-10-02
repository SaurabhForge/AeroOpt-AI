import re
import base64
import os
from PIL import Image
import io

backup_path = r'c:\Users\Saurabh Kumar\OneDrive\Desktop\TrustForge\TrustForge_SIH_2026_Deck.backup.html'
with open(backup_path, 'r', encoding='utf-8') as f:
    html = f.read()

pattern = re.compile(r'<!--\s*=+\s*PAGE (\d+):\s*([^=]+?)\s*=+ -->', re.DOTALL)
matches = list(pattern.finditer(html))
print(f"Total pages in backup: {len(matches)}")

out_dir = r'c:\Users\Saurabh Kumar\OneDrive\Desktop\AeroOpt AI\pdf_assets\extracted'
os.makedirs(out_dir, exist_ok=True)

# Find all base64 images and save them
img_pattern = re.compile(r'src="data:image/([^;]+);base64,([^"]+)"')
for i, m in enumerate(img_pattern.finditer(html)):
    ext = m.group(1)
    b64_data = m.group(2)
    data = base64.b64decode(b64_data)
    fname = os.path.join(out_dir, f'img_{i+1}.{ext}')
    with open(fname, 'wb') as img_f:
        img_f.write(data)
    try:
        im = Image.open(io.BytesIO(data))
        print(f"img_{i+1}: format={im.format}, size={im.size}, mode={im.mode}")
    except Exception as e:
        print(f"img_{i+1}: raw bytes len={len(data)}")

print("Extracted all images!")
