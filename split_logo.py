from PIL import Image

img = Image.open('src/imports/Main_logo_cropped.png').convert("RGBA")
width, height = img.size
alpha = img.split()[3]

row_is_empty = []
for y in range(height):
    empty = True
    for x in range(width):
        if alpha.getpixel((x, y)) > 0:
            empty = False
            break
    row_is_empty.append(empty)

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

# We want to keep block 0 (graphic) and block 1 (SOCAL)
# Let's crop from y=0 to the end of block 1
end_y = blocks[1][1]
combined = img.crop((0, 0, width, end_y))

# find true width
alpha_c = combined.split()[3]
cw, ch = combined.size
min_x, max_x = cw, 0
for cy in range(ch):
    for cx in range(cw):
        if alpha_c.getpixel((cx, cy)) > 0:
            if cx < min_x: min_x = cx
            if cx > max_x: max_x = cx

if min_x <= max_x:
    combined = combined.crop((min_x, 0, max_x+1, ch))

combined.save('src/imports/Main_logo_socal.png')
print("Saved Main_logo_socal.png")
