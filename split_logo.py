import sys
from PIL import Image

def find_gaps_and_crop():
    img = Image.open('src/imports/Main_logo_cropped.png')
    img = img.convert("RGBA")
    width, height = img.size
    
    # We will look for horizontal rows where all alpha values are 0
    # Let's get the alpha channel
    alpha = img.split()[3]
    
    row_is_empty = []
    for y in range(height):
        # Check if all pixels in this row have alpha == 0
        empty = True
        for x in range(width):
            if alpha.getpixel((x, y)) > 0:
                empty = False
                break
        row_is_empty.append(empty)
    
    # Find continuous blocks of non-empty rows
    blocks = []
    in_block = False
    start_y = 0
    for y in range(height):
        if not row_is_empty[y] and not in_block:
            in_block = True
            start_y = y
        elif row_is_empty[y] and in_block:
            in_block = False
            blocks.append((start_y, y))
            
    if in_block:
        blocks.append((start_y, height))
        
    print(f"Found {len(blocks)} blocks of content:")
    for i, (sy, ey) in enumerate(blocks):
        print(f"Block {i}: y={sy} to y={ey} (height {ey-sy})")
        
    if len(blocks) >= 2:
        # Assuming first block is graphic and rest is text, or vice versa
        # Let's save the largest block just in case, or just save each block
        for i, (sy, ey) in enumerate(blocks):
            box = (0, sy, width, ey)
            cropped = img.crop(box)
            # Find true width of this block
            alpha_c = cropped.split()[3]
            cw, ch = cropped.size
            min_x, max_x = cw, 0
            for cy in range(ch):
                for cx in range(cw):
                    if alpha_c.getpixel((cx, cy)) > 0:
                        if cx < min_x: min_x = cx
                        if cx > max_x: max_x = cx
            if min_x <= max_x:
                cropped = cropped.crop((min_x, 0, max_x+1, ch))
            cropped.save(f'src/imports/logo_block_{i}.png')
            print(f"Saved block {i} as logo_block_{i}.png (size: {cropped.size})")

find_gaps_and_crop()
