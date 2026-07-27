#!/usr/bin/env python3
"""Extract the AO/OTA 2018 compendium plates used by the fracture module.

The illustrations in the compendium are vector artwork sitting inside a text
page. This script therefore frames a plate around the *drawing* rather than
around a horizontal slice of ink, which is what produced page-crop plates with
headings, paragraphs and empty gutters in them.

For every entry in MANIFEST the script:

1. clusters the page's vector paths and groups the clusters into figure rows;
2. selects the row(s) named by the manifest (by text anchor or by index);
3. keeps the callouts that sit inside the artwork (``a``, ``b``, ``78``) and the
   short classification code printed above it (``31A``), then redacts every
   other text line — redaction is applied with PDF_REDACT_LINE_ART_NONE so the
   drawing itself is untouched;
4. re-renders that clip straight from the vector source at DPI and writes a PNG
   plus the exact aspect ratio needed by ``src/modules/fracture/illustrations.ts``.

Usage:  python scripts/extract-fracture-illustrations.py [--out DIR] [--only NAME ...]
Requires: pymupdf, pillow (dev-only dependencies, not bundled in the app).
"""

from __future__ import annotations

import argparse
import json
import re
import unicodedata
from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "references" / "AOOTA_Classification_2018_Compendium.pdf"
DEFAULT_OUT = ROOT / "assets" / "fracture" / "aoota-2018"

DPI = 300
MAX_EDGE_PX = 1800
"""The printed supplement page (S1) is the 4th page of the PDF."""
PAGE_OFFSET = 3

"""Running heads and feet never belong to a plate."""
HEAD_LIMIT_PT = 66.0
FOOT_LIMIT_PT = 58.0
"""Resolution used to measure the artwork; the plates themselves render at DPI."""
GEOMETRY_DPI = 150
"""Anything lighter than this counts as ink, including the pale bone fills."""
INK_THRESHOLD = 245
"""Vertical whitespace that separates one figure row from the next."""
ROW_GAP_PT = 22.0
"""Rows shorter than this are rules and stray marks, not figures."""
MIN_ROW_HEIGHT_PT = 24.0
"""A callout has to sit this close to the artwork to be kept."""
CALLOUT_PAD_PT = 12.0
CALLOUT_MAX_CHARS = 4
"""Codes are printed above the artwork, flush with the text column margin."""
CAPTION_REACH_PT = 26.0
CAPTION_X_PAD_PT = 64.0
CAPTION_MAX_CHARS = 12
CODE_RE = re.compile(r"^[0-9IVX][0-9A-Za-z._/()\-]*$")
"""Uniform breathing room around the finished plate."""
MARGIN_PT = 10.0


@dataclass(frozen=True)
class Item:
    out: str
    page: int
    """Text a line must contain; the plate is the first figure row below it."""
    anchor: str | None = None
    """1-based match to use when the anchor appears more than once on the page."""
    occurrence: int = 1
    """Number of consecutive figure rows to include, starting at the selected one."""
    rows: int = 1
    """Select the nth figure row directly (1-based), for plates with no anchor."""
    row_index: int | None = None
    """Drop the classification codes; a few plates label their parts inline."""
    captions: bool = True
    """Keep every word inside the plate — for the OTA-OFC and UCPF tables, whose
    content *is* text sitting in a ruled grid rather than a drawing."""
    tabular: bool = False


MANIFEST: list[Item] = [
    # --- Adult, upper limb -------------------------------------------------
    Item("adult-humerus-proximal", 14, anchor="Types:"),
    Item("adult-humerus-shaft", 18, anchor="Types:"),
    Item("adult-humerus-distal", 20, anchor="Types:"),
    Item("adult-radius-proximal", 24, anchor="Types:"),
    Item("adult-ulna-proximal", 24, anchor="Ulna, proximal end segment,"),
    Item("adult-radius-shaft", 27, anchor="Types:"),
    Item("adult-ulna-shaft", 27, anchor="Ulna, diaphyseal segment,"),
    Item("adult-radius-distal", 31, anchor="Types:"),
    Item("adult-ulna-distal", 31, anchor="Ulna, distal end segment,"),
    # Region-level plates: the app lists codes from every segment, so the
    # "Locations" overview matches the picker better than a single type row.
    Item("adult-scapula", 104, anchor="Locations:"),
    Item("adult-clavicle", 108, anchor="Locations:"),
    # --- Adult, pelvis and lower limb --------------------------------------
    Item("adult-femur-proximal", 36, anchor="Types:"),
    Item("adult-femur-shaft", 40, anchor="Types:"),
    Item("adult-femur-distal", 43, anchor="Types:"),
    Item("adult-patella", 48, anchor="Types:"),
    Item("adult-tibia-proximal", 52, anchor="Types:"),
    Item("adult-tibia-shaft", 56, anchor="Types:"),
    Item("adult-tibia-distal", 59, anchor="Types:"),
    Item("adult-fibula-proximal", 64, anchor="Types:"),
    Item("adult-fibula-shaft", 65, anchor="Types:"),
    Item("adult-fibula-distal", 66, anchor="Types:"),
    Item("adult-malleolar", 68, anchor="Types:"),
    Item("adult-pelvic-ring", 74, anchor="Types:"),
    Item("adult-acetabulum", 80, anchor="Types:"),
    # --- Adult, hand and foot ----------------------------------------------
    Item("adult-hand-carpus", 86, row_index=1, captions=False),
    Item("adult-foot", 92, row_index=1, captions=False),
    # --- Adult, axial ------------------------------------------------------
    Item("adult-cervical-spine", 149, row_index=1),
    Item("adult-thoracolumbar-spine", 154, anchor="Types:"),
    Item("adult-sacrum", 158, row_index=1),
    Item("adult-ribs", 164, anchor="Locations:"),
    Item("adult-sternum", 166, anchor="Locations:"),
    # --- Pediatric ---------------------------------------------------------
    Item("pediatric-epiphyseal", 122, anchor="Salter-Harris (SH) type I"),
    Item("pediatric-metaphyseal", 122, anchor="Incomplete: torus/buckle,"),
    Item("pediatric-diaphyseal", 123, anchor="Bowing"),
    # --- Dislocations (file names carry the PDF page) ----------------------
    Item("dislocation-110", 110, anchor="Anatomical region: Shoulder girdle", rows=2),
    Item("dislocation-111", 111, anchor="Anatomical region: Elbow"),
    Item("dislocation-112", 112, anchor="Anatomical region: Hip joint"),
    Item("dislocation-113", 113, anchor="Anatomical region: Knee"),
    Item("dislocation-114", 114, anchor="Anatomical region: Hand and wrist", rows=2),
    Item("dislocation-115", 115, anchor="Location: Hand and wrist, carpal-metacarpal"),
    Item("dislocation-116", 116, anchor="Location: Hand and wrist, phalangeal"),
    Item("dislocation-117", 117, anchor="Anatomical region: Foot and ankle", rows=2),
    Item("dislocation-118", 118, anchor="Location: Foot and ankle, midfoot"),
    Item("dislocation-119", 119, anchor="Location: Foot and ankle, forefoot"),
    # --- Periprosthetic and open fracture ----------------------------------
    Item("periprosthetic-upper", 145, row_index=1, tabular=True),
    Item("periprosthetic-lower", 146, row_index=1, tabular=True),
    Item("open-fracture", 109, row_index=1, tabular=True),
]


def normalize(text: str) -> str:
    return unicodedata.normalize("NFKC", text).replace("−", "-").strip()


def text_lines(page: pymupdf.Page) -> list[tuple[pymupdf.Rect, str]]:
    lines = []
    for block in page.get_text("dict")["blocks"]:
        if block["type"] != 0:
            continue
        for line in block["lines"]:
            raw = normalize("".join(span["text"] for span in line["spans"]))
            if raw:
                lines.append((pymupdf.Rect(line["bbox"]), raw))
    return lines


def body_rect(page: pymupdf.Page) -> pymupdf.Rect:
    return pymupdf.Rect(0, HEAD_LIMIT_PT, page.rect.x1, page.rect.y1 - FOOT_LIMIT_PT)


def strip_text(page: pymupdf.Page, keep: list[pymupdf.Rect] | None = None) -> None:
    """Redact text off the page, leaving the vector artwork untouched."""
    kept = keep or []
    for rect, _ in text_lines(page):
        if any(rect in keeper for keeper in kept):
            continue
        page.add_redact_annot(rect)
    page.apply_redactions(
        images=pymupdf.PDF_REDACT_IMAGE_NONE,
        graphics=pymupdf.PDF_REDACT_LINE_ART_NONE,
        text=pymupdf.PDF_REDACT_TEXT_REMOVE,
    )


def artwork_rows(page: pymupdf.Page) -> list[pymupdf.Rect]:
    """The figure rows on a page, measured off a text-free render of it.

    The compendium draws a whole column of bones as one compound path, so vector
    cluster boxes routinely span several figures and cannot be separated
    geometrically. Rasterising the artwork on its own and reading the ink back
    splits the page the way a reader sees it.
    """
    scale = GEOMETRY_DPI / 72
    body = body_rect(page)
    pix = page.get_pixmap(dpi=GEOMETRY_DPI, clip=body, alpha=False)
    samples = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, 3)
    ink = samples.min(axis=2) < INK_THRESHOLD

    filled_rows = ink.any(axis=1)
    gap = max(1, int(ROW_GAP_PT * scale))
    bands: list[tuple[int, int]] = []
    start: int | None = None
    blank = 0
    for y, filled in enumerate(filled_rows):
        if filled:
            if start is None:
                start = y
            blank = 0
            continue
        if start is None:
            continue
        blank += 1
        if blank >= gap:
            bands.append((start, y - blank))
            start = None
            blank = 0
    if start is not None:
        bands.append((start, len(filled_rows) - 1))

    rows = []
    for y0, y1 in bands:
        if (y1 - y0) < MIN_ROW_HEIGHT_PT * scale:
            continue
        columns = ink[y0:y1 + 1].any(axis=0).nonzero()[0]
        if not len(columns):
            continue
        rows.append(pymupdf.Rect(
            body.x0 + columns[0] / scale,
            body.y0 + y0 / scale,
            body.x0 + (columns[-1] + 1) / scale,
            body.y0 + (y1 + 1) / scale,
        ))
    return rows


def select(
    item: Item,
    lines: list[tuple[pymupdf.Rect, str]],
    rows: list[pymupdf.Rect],
) -> pymupdf.Rect:
    if item.row_index is not None:
        first = item.row_index - 1
    else:
        matches = sorted(
            (rect for rect, text in lines if item.anchor in text),
            key=lambda rect: rect.y0,
        )
        if len(matches) < item.occurrence:
            raise SystemExit(f"{item.out}: anchor {item.anchor!r} not found on page {item.page}")
        anchor_top = matches[item.occurrence - 1].y0
        first = next((i for i, rect in enumerate(rows) if rect.y1 > anchor_top), -1)
        if first < 0:
            raise SystemExit(f"{item.out}: no figure row below anchor {item.anchor!r}")
    last = first + item.rows - 1
    if first < 0 or last >= len(rows):
        raise SystemExit(f"{item.out}: page {item.page} has {len(rows)} figure rows, wanted {last + 1}")
    box = +rows[first]
    for rect in rows[first + 1:last + 1]:
        box |= rect
    return box


def keep_text(item: Item, page: pymupdf.Page, art: pymupdf.Rect) -> list[pymupdf.Rect]:
    """Callouts inside the artwork, plus the classification code printed above it."""
    if item.tabular:
        return [rect for rect, _ in text_lines(page) if inside(rect, art)]

    callout_zone = +art
    callout_zone += (-CALLOUT_PAD_PT, -CALLOUT_PAD_PT, CALLOUT_PAD_PT, CALLOUT_PAD_PT)
    # The code of the leftmost drawing is set flush with the text column, well left
    # of the artwork it labels, so the caption strip spans the full body width.
    body = body_rect(page)
    caption_zone = pymupdf.Rect(
        body.x0, art.y0 - CAPTION_REACH_PT, art.x1 + CAPTION_X_PAD_PT, art.y0,
    )

    kept = []
    for rect, text in text_lines(page):
        if len(text) <= CALLOUT_MAX_CHARS and inside(rect, callout_zone):
            kept.append(rect)
        elif (
            item.captions
            and len(text) <= CAPTION_MAX_CHARS
            and CODE_RE.match(text)
            and inside(rect, caption_zone)
        ):
            kept.append(rect)
    return kept


def inside(rect: pymupdf.Rect, zone: pymupdf.Rect, ratio: float = 0.7) -> bool:
    overlap = rect & zone
    return not overlap.is_empty and rect.get_area() > 0 and overlap.get_area() / rect.get_area() >= ratio


def build(item: Item) -> Image.Image:
    """Locate the plate on a text-free copy of the page, then render it."""
    geometry = pymupdf.open(PDF)
    geometry_page = geometry[item.page - 1]
    lines = text_lines(geometry_page)
    strip_text(geometry_page)
    art = select(item, lines, artwork_rows(geometry_page))
    geometry.close()

    output = pymupdf.open(PDF)
    page = output[item.page - 1]
    kept = keep_text(item, page, art)
    box = +art
    for rect in kept:
        box |= rect
    box += (-MARGIN_PT, -MARGIN_PT, MARGIN_PT, MARGIN_PT)
    box &= page.rect
    strip_text(page, keep=kept)

    pix = page.get_pixmap(clip=box, dpi=DPI, alpha=False)
    image = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
    output.close()

    longest = max(image.size)
    if longest > MAX_EDGE_PX:
        ratio = MAX_EDGE_PX / longest
        image = image.resize((round(image.width * ratio), round(image.height * ratio)), Image.LANCZOS)
    return image


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", type=Path, default=DEFAULT_OUT)
    parser.add_argument("--only", nargs="*", default=None, help="plate names to rebuild")
    args = parser.parse_args()
    args.out.mkdir(parents=True, exist_ok=True)

    items = MANIFEST if args.only is None else [i for i in MANIFEST if i.out in args.only]
    report = []
    for item in items:
        image = build(item)
        path = args.out / f"{item.out}.png"
        image.save(path, optimize=True)
        entry = {
            "name": item.out,
            "printedPage": item.page - PAGE_OFFSET,
            "width": image.width,
            "height": image.height,
            "aspectRatio": round(image.width / image.height, 3),
            "kb": round(path.stat().st_size / 1024),
        }
        report.append(entry)
        print(
            f"{entry['name']:<28} S{entry['printedPage']:<4} "
            f"{entry['width']}x{entry['height']}  ar={entry['aspectRatio']:<6} {entry['kb']} kB"
        )

    if args.only is None:
        (args.out / "plates.json").write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"\n{len(report)} plates, {sum(e['kb'] for e in report) / 1024:.1f} MB total")


if __name__ == "__main__":
    main()
