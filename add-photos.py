"""
add-photos.py — bring new photos into the website
=================================================

WHAT IT DOES
    Takes every image in  D:\\Work\\Claude code\\photos-to-add
    and produces a web-ready copy in  assets/img/ :
      - rotates it the right way up (uses the camera's EXIF tag)
      - shrinks it to a sensible size for a web page
      - compresses it so the page stays fast
      - reports whether each one is portrait or landscape,
        which decides the shape of its cell in the gallery

    Your originals are never modified or moved.

HOW TO RUN IT
    Open a terminal in the syedmarjuk-portfolio folder and run:

        python add-photos.py

REQUIREMENT
    Pillow, the image library. If it complains, run:

        python -m pip install pillow

AFTER RUNNING
    It prints a ready-made GALLERY block. Paste that into
    assets/js/data.js and edit the captions.
"""

import os
import sys

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is not installed. Run:  python -m pip install pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(os.path.dirname(HERE), "photos-to-add")
DEST = os.path.join(HERE, "assets", "img")

MAX_WIDTH = 1300          # plenty for a web page, keeps files small
QUALITY = 79              # visually clean, good compression
TARGET_KB = 420           # nudge quality down if a file lands above this
EXTS = (".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tif", ".tiff")


def slugify(name):
    """Turn 'IMG_2023 CTD cast.jpg' into 'img-2023-ctd-cast'."""
    base = os.path.splitext(os.path.basename(name))[0].lower()
    out = []
    for ch in base:
        out.append(ch if (ch.isalnum()) else "-")
    slug = "".join(out)
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug.strip("-") or "photo"


def save_web(im, path, quality):
    im.save(path, "JPEG", quality=quality, optimize=True, progressive=True)
    return os.path.getsize(path) / 1024


def main():
    if not os.path.isdir(SRC):
        sys.exit(f"Folder not found:\n  {SRC}\nCreate it and put your photos inside.")

    os.makedirs(DEST, exist_ok=True)

    files = sorted(
        f for f in os.listdir(SRC)
        if f.lower().endswith(EXTS) and os.path.isfile(os.path.join(SRC, f))
    )

    if not files:
        print(f"No images found in:\n  {SRC}\n")
        print("Copy your photos into that folder, then run this again.")
        return

    print(f"Found {len(files)} image(s) in photos-to-add\n")
    print(f"{'output file':30} {'size':>12}  {'shape':10} {'KB':>7}")
    print("-" * 64)

    entries = []
    for f in files:
        src_path = os.path.join(SRC, f)
        try:
            im = ImageOps.exif_transpose(Image.open(src_path)).convert("RGB")
        except Exception as e:
            print(f"  SKIPPED {f}: {e}")
            continue

        if im.width > MAX_WIDTH:
            new_h = round(im.height * MAX_WIDTH / im.width)
            im = im.resize((MAX_WIDTH, new_h), Image.LANCZOS)

        name = slugify(f) + ".jpg"
        out_path = os.path.join(DEST, name)

        q = QUALITY
        kb = save_web(im, out_path, q)
        # if it is still heavy, step the quality down a little
        while kb > TARGET_KB and q > 62:
            q -= 6
            kb = save_web(im, out_path, q)

        portrait = im.height > im.width * 1.15
        shape = "portrait" if portrait else "landscape"
        print(f"{name:30} {im.width:>5}x{im.height:<6} {shape:10} {kb:7.0f}")

        entries.append((name, portrait))

    # ---- print a ready-to-paste GALLERY block ----
    print("\n" + "=" * 64)
    print("Paste this into assets/js/data.js, replacing the GALLERY list.")
    print("Then change each caption and alt to describe the photo.")
    print("=" * 64 + "\n")
    print("const GALLERY = [")
    for name, portrait in entries:
        print("  {")
        print(f'    src: "assets/img/{name}",')
        print('    alt: "DESCRIBE WHAT THE PHOTO SHOWS",')
        print('    caption: "SHORT CAPTION",')
        if portrait:
            print('    shape: "tall"')
        else:
            print('    span: "wide"   // remove this line for a normal-width cell')
        print("  },")
    print("];")
    print("\nDone. Nothing in photos-to-add was changed.")


if __name__ == "__main__":
    main()
