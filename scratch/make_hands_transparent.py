import os
from PIL import Image

src_path = r'C:\Users\prans\.gemini\antigravity-ide\brain\3c88633d-bc46-486a-b7a3-29d0e47a497e\hands_cutout_1792526740931.jpg'
out_path = 'assets/shiva_parvati_hands_cutout.png'

im = Image.open(src_path).convert('RGBA')
w, h = im.size

pix = im.load()
for y in range(h):
    for x in range(w):
        r, g, b, a = pix[x, y]
        # Check white background
        # In this image, the background is pure neutral white
        # If r, g, b are all high and difference between them is small (gray/white)
        min_c = min(r, g, b)
        max_diff = max(r, g, b) - min_c
        
        # Pure white background:
        if min_c >= 250 and max_diff <= 8:
            pix[x, y] = (r, g, b, 0)
        elif min_c >= 238 and max_diff <= 12:
            # anti-aliased edge
            alpha = int(((250 - min_c) / 12.0) * 255)
            pix[x, y] = (r, g, b, max(0, min(255, alpha)))
        elif min_c >= 220 and max_diff <= 8:
            alpha = int(((250 - min_c) / 30.0) * 255)
            pix[x, y] = (r, g, b, max(0, min(255, alpha)))

# Crop to transparent bounding box with slight margin
alpha = im.split()[3]
bbox = alpha.getbbox()
print("Alpha bbox:", bbox)
cropped = im.crop(bbox)
cropped.save(out_path, 'PNG')
print(f"Saved {out_path} with size {cropped.size}!")
