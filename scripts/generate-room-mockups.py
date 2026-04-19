#!/usr/bin/env python3
"""
generate-room-mockups.py
Composites Amalia's artwork into blank-frame room mockup templates.

Usage:
  python3 scripts/generate-room-mockups.py

Templates expected at:
  frontend/public/assets/mockup-templates/room-teepee.jpg
  frontend/public/assets/mockup-templates/room-blue-shelf.jpg
  frontend/public/assets/mockup-templates/room-nursery.jpg

Outputs one -wall.jpg per artwork per template, kept in:
  frontend/public/assets/artwork/{slug}-wall.jpg   ← primary (teepee, most playful)
  frontend/public/assets/artwork/{slug}-wall-2.jpg ← blue-shelf variant
  frontend/public/assets/artwork/{slug}-wall-3.jpg ← nursery variant
"""

from PIL import Image, ImageFilter, ImageEnhance
import numpy as np
import os

REPO     = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARTWORK  = os.path.join(REPO, "frontend/public/assets/artwork")
PREVIEW  = os.path.join(REPO, "frontend/public/assets/artwork")
TEMPLATES = os.path.join(REPO, "frontend/public/assets/mockup-templates")

# ── Template frame regions ────────────────────────────────────────────────────
# (x0, y0, x1, y1) = pixel coords of the *inner* printable area in the blank frame
# Tune these after first run if the artwork lands slightly off.
TEMPLATES_CONFIG = {
    "room-teepee.jpg": {
        "suffix": "-wall.jpg",
        "frame": (432, 62, 668, 487),   # portrait frame, centre-left of image
        "output_size": (1260, 840),
    },
    "room-blue-shelf.jpg": {
        "suffix": "-wall-2.jpg",
        "frame": (660, 148, 900, 455),  # white-framed portrait, right side
        "output_size": (1260, 840),
    },
    "room-nursery.jpg": {
        "suffix": "-wall-3.jpg",
        "frame": (295, 32, 755, 535),   # large wood-framed portrait, centre
        "output_size": (1260, 840),
    },
}

# Artwork slugs → preview source file
ARTWORKS = [
    "playful-cat",
    "happy-dog",
    "house-with-garden",
    "ice-cream-faces",
    "easter-bunny",
    "easter-card",
    "unicorn-with-butterflies",
    "colorful-cupcakes",
]


def auto_detect_frame(template_img, hint_region=None):
    """
    Attempt to auto-detect the largest bright (near-white) rectangle
    in the image. Returns (x0, y0, x1, y1) or None if detection fails.
    Useful for tuning — compare against hardcoded values.
    """
    arr = np.array(template_img.convert("L"))
    bright = (arr > 220).astype(np.uint8)

    # Row/col coverage
    row_sum = bright.sum(axis=1)
    col_sum = bright.sum(axis=0)

    # Find contiguous bright spans
    def largest_span(vec, threshold=0.6):
        width = len(vec)
        in_span, best_start, best_len, cur_start = False, 0, 0, 0
        for i, v in enumerate(vec):
            if v / width >= threshold:
                if not in_span:
                    cur_start, in_span = i, True
            else:
                if in_span:
                    span_len = i - cur_start
                    if span_len > best_len:
                        best_start, best_len = cur_start, span_len
                    in_span = False
        return best_start, best_len

    img_w, img_h = template_img.size
    row_thresh = img_w * 0.25
    col_thresh = img_h * 0.20

    y0, h = largest_span(row_sum, threshold=row_thresh / img_w)
    x0, w = largest_span(col_sum, threshold=col_thresh / img_h)

    if w > 50 and h > 50:
        return x0, y0, x0 + w, y0 + h
    return None


def composite_artwork_into_frame(template_path, artwork_path, frame_box, output_size):
    """Paste artwork into the frame_box region of the template."""
    template = Image.open(template_path).convert("RGB")
    artwork  = Image.open(artwork_path).convert("RGB")

    # Resize template to output_size
    template = template.resize(output_size, Image.LANCZOS)

    # Scale frame_box to match output_size
    t_w, t_h = Image.open(template_path).size
    sx = output_size[0] / t_w
    sy = output_size[1] / t_h
    fx0 = int(frame_box[0] * sx)
    fy0 = int(frame_box[1] * sy)
    fx1 = int(frame_box[2] * sx)
    fy1 = int(frame_box[3] * sy)

    fw = fx1 - fx0
    fh = fy1 - fy0

    # Fit artwork into frame, preserving aspect ratio, with small white mat padding
    pad = max(2, int(min(fw, fh) * 0.04))
    art_w = fw - 2 * pad
    art_h = fh - 2 * pad

    src_ratio = artwork.width / artwork.height
    dst_ratio = art_w / art_h
    if src_ratio > dst_ratio:
        fit_w = art_w
        fit_h = int(art_w / src_ratio)
    else:
        fit_h = art_h
        fit_w = int(art_h * src_ratio)

    artwork = artwork.resize((fit_w, fit_h), Image.LANCZOS)

    # Centre within the padded frame area
    paste_x = fx0 + pad + (art_w - fit_w) // 2
    paste_y = fy0 + pad + (art_h - fit_h) // 2

    # Fill frame area with white mat first
    from PIL import ImageDraw
    draw = ImageDraw.Draw(template)
    draw.rectangle([fx0, fy0, fx1, fy1], fill="white")

    template.paste(artwork, (paste_x, paste_y))

    # Very subtle vignette to blend edges
    return template


def main():
    missing = []
    for tmpl_name in TEMPLATES_CONFIG:
        p = os.path.join(TEMPLATES, tmpl_name)
        if not os.path.exists(p):
            missing.append(p)

    if missing:
        print("⚠  Missing template files — place them at:")
        for m in missing:
            print(f"   {m}")
        print("\nWill skip missing templates and process available ones.\n")

    for slug in ARTWORKS:
        preview_path = os.path.join(PREVIEW, f"{slug}-preview.jpg")
        if not os.path.exists(preview_path):
            print(f"  skip {slug} — no preview found")
            continue

        for tmpl_name, cfg in TEMPLATES_CONFIG.items():
            tmpl_path = os.path.join(TEMPLATES, tmpl_name)
            if not os.path.exists(tmpl_path):
                continue

            output_path = os.path.join(ARTWORK, f"{slug}{cfg['suffix']}")

            result = composite_artwork_into_frame(
                template_path=tmpl_path,
                artwork_path=preview_path,
                frame_box=cfg["frame"],
                output_size=cfg["output_size"],
            )
            result.save(output_path, "JPEG", quality=88, optimize=True)
            size_kb = os.path.getsize(output_path) // 1024
            print(f"  ✓ {slug}{cfg['suffix']}  ({size_kb}KB)")

    print("\nDone.")


if __name__ == "__main__":
    main()
