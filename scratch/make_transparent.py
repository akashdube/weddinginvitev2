import os
from PIL import Image, ImageFilter, ImageOps

gen_path = r'C:\Users\prans\.gemini\antigravity-ide\brain\3c88633d-bc46-486a-b7a3-29d0e47a497e\wax_seal_ap_1792504529735.jpg'
orig_png_path = r'assets/wax_seal_pa.png'
out_path = r'assets/wax_seal_pa.png' # will replace
test_out_path = r'assets/wax_seal_ap_test.png'

gen = Image.open(gen_path).convert('RGB')
w, h = gen.size # 1024, 1024

# Let's inspect background: the background is light/white.
# Let's create an alpha mask by:
# 1. Start with floodfill from corners or color difference from white (255, 255, 255)
# In gen, corners are around (253, 253, 253).
# Gold seal rim has color like (160, 133, 106) or (200, 170, 120) which has strong saturation and darker luminance.

# Let's calculate difference from pure white/cream:
# or let's inspect the orig_alpha resized to 1024x1024:
orig = Image.open(orig_png_path).resize((w, h), Image.Resampling.LANCZOS)
orig_alpha = orig.split()[3]

# Let's refine the mask:
# Check edge pixels
alpha = Image.new('L', (w, h), 0)
gen_pixels = gen.load()
alpha_pixels = alpha.load()
orig_alpha_pixels = orig_alpha.load()

for y in range(h):
    for x in range(w):
        r, g, b = gen_pixels[x, y]
        # Brightness / distance from white
        # If very close to pure white and orig_alpha is low:
        # Distance from (254, 253, 254)
        dist = ((254 - r)**2 + (253 - g)**2 + (254 - b)**2) ** 0.5
        
        # If orig_alpha is 0 and it's white, it's definitely 0
        if orig_alpha_pixels[x, y] == 0:
            alpha_pixels[x, y] = 0
        elif orig_alpha_pixels[x, y] == 255 and dist > 20:
            alpha_pixels[x, y] = 255
        else:
            # Transition zone:
            # If dist is large, it's gold seal
            if dist > 35:
                alpha_pixels[x, y] = orig_alpha_pixels[x, y]
            elif dist < 10:
                alpha_pixels[x, y] = 0
            else:
                factor = (dist - 10) / 25.0
                alpha_pixels[x, y] = int(orig_alpha_pixels[x, y] * factor)

# Smooth the alpha slightly for natural soft edge like the original
# Let's check test output
gen_rgba = gen.copy()
gen_rgba.putalpha(alpha)

# Resize to 512x512 with LANCZOS to match original dimensions and crisp rendering
gen_rgba_512 = gen_rgba.resize((512, 512), Image.Resampling.LANCZOS)
gen_rgba_512.save(test_out_path, 'PNG')
print("Saved test_out_path successfully!")
