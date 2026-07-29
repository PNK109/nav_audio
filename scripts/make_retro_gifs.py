from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "gif"
OUT.mkdir(parents=True, exist_ok=True)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    name = "DejaVuSansMono-Bold.ttf" if bold else "DejaVuSansMono.ttf"
    return ImageFont.truetype(f"/usr/share/fonts/truetype/dejavu/{name}", size)


def ui_font(size: int, bold: bool = False, italic: bool = False) -> ImageFont.FreeTypeFont:
    if bold or italic:
        name = "DejaVuSans-Bold.ttf"
    else:
        name = "DejaVuSans.ttf"
    return ImageFont.truetype(f"/usr/share/fonts/truetype/dejavu/{name}", size)


def save_gif(frames, name, duration=160):
    frames[0].save(
        OUT / name,
        save_all=True,
        append_images=frames[1:],
        duration=duration,
        loop=0,
        disposal=2,
        transparency=0,
        optimize=False,
    )


def transparent(size):
    return Image.new("RGBA", size, (0, 0, 0, 0))


def make_spark():
    frames = []
    shapes = [
        [(12, 3, 12, 21), (3, 12, 21, 12)],
        [(12, 1, 12, 23), (1, 12, 23, 12), (5, 5, 19, 19), (19, 5, 5, 19)],
        [(12, 5, 12, 19), (5, 12, 19, 12)],
        [(12, 8, 12, 16), (8, 12, 16, 12)],
    ]
    colors = ["#ffd51e", "#ffffff", "#b9ff55", "#ff8a19"]
    for index, lines in enumerate(shapes):
        image = transparent((24, 24))
        draw = ImageDraw.Draw(image)
        for line in lines:
            draw.line(line, fill=colors[index], width=2)
        draw.rectangle((10, 10, 14, 14), fill="#ffffff", outline="#202018")
        frames.append(image)
    save_gif(frames, "spark.gif", 130)


def make_disc():
    frames = []
    rainbow = ["#ec3f4f", "#ffa61e", "#f7ee55", "#63cf7c", "#5ab2ef", "#8b67d5"]
    for phase in range(8):
        image = transparent((36, 36))
        draw = ImageDraw.Draw(image)
        draw.ellipse((2, 2, 33, 33), fill="#d7d7d0", outline="#1c1c1c", width=1)
        draw.ellipse((5, 5, 30, 30), outline="#ffffff", width=2)
        for index, color in enumerate(rainbow):
            y = 8 + index * 3
            offset = (phase + index) % 7
            draw.line((7 + offset, y, 28, y), fill=color, width=1)
        draw.ellipse((13, 13, 22, 22), fill="#f5f2df", outline="#343434")
        draw.ellipse((16, 16, 19, 19), fill="#505050")
        frames.append(image)
    save_gif(frames, "disc.gif", 95)


def make_camera():
    frames = []
    for phase in range(4):
        image = transparent((56, 32))
        draw = ImageDraw.Draw(image)
        draw.rectangle((4, 9, 38, 27), fill="#d8d8cf", outline="#161616", width=2)
        draw.polygon([(38, 13), (51, 8), (51, 28), (38, 23)], fill="#93968c", outline="#161616")
        draw.rectangle((10, 5, 23, 9), fill="#aeb0a8", outline="#161616")
        draw.ellipse((11, 13, 25, 27), fill="#242424", outline="#ffffff")
        draw.ellipse((15, 17, 21, 23), fill="#6d84a5")
        draw.ellipse((30, 13, 34, 17), fill="#ff2828" if phase % 2 == 0 else "#5f1e1e")
        draw.text((4, 0), "REC", font=font(7, True), fill="#8d1010")
        frames.append(image)
    save_gif(frames, "camera.gif", 230)


def make_new():
    frames = []
    for phase in range(4):
        image = transparent((31, 15))
        draw = ImageDraw.Draw(image)
        fill = "#f4ff39" if phase % 2 == 0 else "#ff4d88"
        draw.rectangle((0, 0, 30, 14), fill=fill, outline="#121212")
        draw.text((3, 3), "NEW!", font=font(8, True), fill="#151515")
        frames.append(image)
    save_gif(frames, "new.gif", 220)


def make_write_me():
    frames = []
    for phase in range(4):
        image = Image.new("RGBA", (88, 31), "#cecec4")
        draw = ImageDraw.Draw(image)
        draw.line((0, 0, 87, 0), fill="#ffffff", width=2)
        draw.line((0, 0, 0, 30), fill="#ffffff", width=2)
        draw.line((1, 30, 87, 30), fill="#5f5f5b", width=2)
        draw.line((87, 1, 87, 30), fill="#5f5f5b", width=2)
        draw.rectangle((6, 7, 25, 22), fill="#faf8e9", outline="#202020")
        draw.line((6, 7, 15, 15, 25, 7), fill="#202020", width=1)
        color = "#1a248c" if phase % 2 == 0 else "#8b175e"
        draw.text((30, 9), "WRITE", font=font(10, True), fill=color)
        frames.append(image)
    save_gif(frames, "write-me.gif", 260)


def make_banner():
    frames = []
    for phase in range(8):
        image = Image.new("RGBA", (468, 60), "#9a009a")
        draw = ImageDraw.Draw(image)
        shift = phase * 7
        for x in range(-70 + shift, 530, 52):
            draw.polygon([(x, 0), (x + 28, 0), (x - 4, 35), (x - 32, 35)], fill="#bd00bd")
        draw.rectangle((0, 35, 467, 59), fill="#111111")
        draw.rectangle((1, 1, 466, 58), outline="#ffffff")
        draw.text((17, 5), "KINEMATOGRAF LICHNOSTI", font=ui_font(21, True, True), fill="#50ff18")
        draw.text((17, 39), "6 MODULES  /  ONE AUTHOR PROJECT  /  ENTER", font=ui_font(11, True), fill="#ffffff")
        pulse = "#fff94a" if phase % 2 == 0 else "#ff4bc8"
        draw.rectangle((421, 8, 456, 28), fill=pulse, outline="#ffffff")
        draw.polygon([(433, 12), (447, 18), (433, 24)], fill="#111111")
        frames.append(image)
    save_gif(frames, "kl-banner.gif", 120)


def draw_bevel(draw, box, fill="#d4d0c8"):
    x0, y0, x1, y1 = box
    draw.rectangle(box, fill=fill, outline="#111111")
    draw.line((x0 + 1, y0 + 1, x1 - 1, y0 + 1), fill="#ffffff")
    draw.line((x0 + 1, y0 + 1, x0 + 1, y1 - 1), fill="#ffffff")
    draw.line((x0 + 1, y1 - 1, x1 - 1, y1 - 1), fill="#777777")
    draw.line((x1 - 1, y0 + 1, x1 - 1, y1 - 1), fill="#777777")


def icon_canvas():
    return transparent((56, 56))


def make_class_icons():
    for kind, name in [
        ("collector", "class-collector.gif"),
        ("architect", "class-architect.gif"),
        ("guide", "class-guide.gif"),
        ("keeper", "class-keeper.gif"),
    ]:
        frames = []
        for phase in range(4):
            image = icon_canvas()
            draw = ImageDraw.Draw(image)
            if kind == "collector":
                draw.rectangle((8, 17, 48, 46), fill="#f3d23f", outline="#111111", width=2)
                draw.rectangle((11, 12, 29, 20), fill="#fff078", outline="#111111")
                draw.rectangle((14, 23, 31, 39), fill="#ffffff", outline="#000080")
                draw.line((17, 27, 28, 27), fill="#000080")
                draw.line((17, 31, 27, 31), fill="#000080")
                draw.polygon([(39, 22 - phase % 2), (42, 29), (49, 30), (44, 35), (45, 43), (39, 39), (33, 43), (34, 35), (29, 30), (36, 29)], fill="#ff39ad", outline="#111111")
            elif kind == "architect":
                draw_bevel(draw, (7, 9, 49, 47), "#eeeeee")
                draw.rectangle((10, 12, 46, 43), fill="#1839a6", outline="#111111")
                for pos in range(14, 46, 7):
                    draw.line((pos, 13, pos, 42), fill="#668dff")
                for pos in range(14, 43, 7):
                    draw.line((11, pos, 45, pos), fill="#668dff")
                draw.line((16, 35, 25, 23, 39, 23, 43, 31), fill="#ffffff", width=2)
                draw.rectangle((12 + phase % 2, 38, 34 + phase % 2, 41), fill="#fff03e", outline="#111111")
            elif kind == "guide":
                draw.ellipse((8, 8, 48, 48), fill="#d7f6ff", outline="#111111", width=2)
                draw.ellipse((13, 13, 43, 43), outline="#000080", width=2)
                draw.line((28, 12, 28, 44), fill="#777777")
                draw.line((12, 28, 44, 28), fill="#777777")
                offset = phase % 2
                draw.polygon([(28 + offset, 14), (34 + offset, 30), (28 + offset, 27), (22 + offset, 42), (23 + offset, 25)], fill="#e02020", outline="#111111")
                draw.ellipse((25, 25, 31, 31), fill="#fff73d", outline="#111111")
            else:
                draw.rectangle((10, 10, 43, 45), fill="#506bb8", outline="#111111", width=2)
                draw.rectangle((15, 12, 36, 25), fill="#d8d8d8", outline="#111111")
                draw.rectangle((16, 31, 38, 42), fill="#eeeeee", outline="#111111")
                draw.rectangle((20, 32, 34, 37), fill="#ffffff")
                shield = [(36, 24), (48, 28), (46, 42), (36, 49), (27, 42), (25, 28)]
                draw.polygon(shield, fill="#35b85a" if phase % 2 == 0 else "#45d46c", outline="#111111")
                draw.line((31, 36, 35, 40, 42, 32), fill="#ffffff", width=2)
            frames.append(image)
        save_gif(frames, name, 220)


def make_module_icons():
    for index in range(1, 7):
        frames = []
        for phase in range(4):
            image = icon_canvas()
            draw = ImageDraw.Draw(image)
            if index == 1:
                draw_bevel(draw, (8, 8, 47, 47), "#efefef")
                draw.rectangle((12, 12, 43, 39), fill="#d7efff", outline="#000080")
                draw.ellipse((16, 20, 39, 32), fill="#ffffff", outline="#111111")
                draw.ellipse((23, 20, 33, 32), fill="#3457b8", outline="#111111")
                draw.ellipse((27, 23, 30, 27), fill="#ffffff")
                draw.rectangle((14, 42, 35, 45), fill="#3457b8")
                draw.rectangle((35, 9 + phase % 2, 46, 13 + phase % 2), fill="#fff23e", outline="#111111")
            elif index == 2:
                draw.rectangle((10, 7, 42, 48), fill="#ffffff", outline="#111111", width=2)
                draw.polygon([(34, 7), (42, 15), (34, 15)], fill="#c7c7c7", outline="#111111")
                for y in (21, 27, 33, 39):
                    draw.line((15, y, 36, y), fill="#000080")
                draw.line((16, 43, 40, 19), fill="#e0297d", width=4)
                draw.polygon([(39, 17), (45, 13), (42, 21)], fill="#fff03e", outline="#111111")
            elif index == 3:
                draw.rectangle((7, 16, 49, 44), fill="#d6d6ce", outline="#111111", width=2)
                draw.rectangle((12, 11, 28, 17), fill="#9b9b94", outline="#111111")
                draw.ellipse((16, 20, 40, 44), fill="#222222", outline="#ffffff")
                draw.ellipse((21, 25, 35, 39), fill="#4567bd", outline="#111111")
                draw.ellipse((25 + phase % 2, 28, 30 + phase % 2, 33), fill="#8fe9ff")
                draw.rectangle((42, 20, 46, 24), fill="#ff2020")
            elif index == 4:
                draw.ellipse((8, 9, 44, 45), fill="#67cbe8", outline="#111111", width=2)
                draw.arc((14, 10, 38, 44), 80, 280, fill="#ffffff", width=2)
                draw.arc((14, 10, 38, 44), 260, 100, fill="#ffffff", width=2)
                draw.line((9, 27, 43, 27), fill="#ffffff", width=2)
                draw.line((27, 10, 27, 44), fill="#ffffff", width=2)
                for ring in range(3):
                    radius = 5 + ring * 5 + phase % 2
                    draw.arc((40 - radius, 5 - radius, 40 + radius, 5 + radius), 20, 160, fill="#e32365", width=2)
            elif index == 5:
                draw.ellipse((9, 9, 45, 45), fill="#f1f1e9", outline="#111111", width=2)
                draw.line((27, 27, 27, 15), fill="#000080", width=3)
                draw.line((27, 27, 37 - phase % 2, 32), fill="#e02222", width=3)
                draw.ellipse((24, 24, 30, 30), fill="#fff239", outline="#111111")
                draw.polygon([(5, 43), (17, 35), (26, 42), (38, 31), (51, 36)], fill=None, outline="#35a552")
            else:
                draw.rectangle((7, 13, 49, 44), fill="#202020", outline="#111111")
                for x in range(10, 48, 9):
                    draw.rectangle((x, 15, x + 5, 19), fill="#ffffff")
                    draw.rectangle((x, 38, x + 5, 42), fill="#ffffff")
                draw.rectangle((12, 22, 44, 35), fill="#df58b8" if phase % 2 == 0 else "#3dd5dd")
                draw.line((16, 49, 39, 25), fill="#777777", width=3)
                draw.line((39, 49, 16, 25), fill="#777777", width=3)
                draw.ellipse((11, 44, 20, 53), fill="#d8d8d8", outline="#111111")
                draw.ellipse((35, 44, 44, 53), fill="#d8d8d8", outline="#111111")
            frames.append(image)
        save_gif(frames, f"module-{index}.gif", 240)


def make_network_icon():
    frames = []
    for phase in range(6):
        image = transparent((128, 96))
        draw = ImageDraw.Draw(image)
        draw_bevel(draw, (12, 11, 98, 72), "#d4d0c8")
        draw.rectangle((20, 19, 90, 62), fill="#000080", outline="#111111")
        draw.ellipse((39, 23, 72, 56), fill="#52c7e8", outline="#ffffff")
        draw.line((42, 40, 69, 40), fill="#ffffff")
        draw.line((56, 25, 56, 54), fill="#ffffff")
        draw.rectangle((38, 74, 73, 81), fill="#777777", outline="#111111")
        draw.rectangle((27, 82, 84, 87), fill="#d4d0c8", outline="#111111")
        color = "#ff2d77" if phase % 2 == 0 else "#fff329"
        for x, y in [(7, 22), (110, 19), (111, 68), (12, 82)]:
            draw.ellipse((x, y, x + 7, y + 7), fill=color, outline="#111111")
            draw.line((x + 7, y + 3, 50, 42), fill="#000080")
        frames.append(image)
    save_gif(frames, "network.gif", 170)


def make_route_arrow():
    frames = []
    for phase in range(8):
        image = transparent((225, 40))
        draw = ImageDraw.Draw(image)
        draw.line((8, 20, 199, 20), fill="#000080", width=4)
        draw.polygon([(199, 10), (220, 20), (199, 30)], fill="#000080")
        for x in range(18 + phase * 7, 190, 55):
            draw.rectangle((x, 15, x + 10, 25), fill="#ff2c99", outline="#111111")
        draw.rectangle((80, 7, 145, 33), fill="#fff239", outline="#111111")
        draw.text((94, 13), "COURSE", font=ui_font(10, True), fill="#000000")
        frames.append(image)
    save_gif(frames, "route.gif", 130)


def make_ad_banner(name, title, subtitle, palette):
    frames = []
    bg, stripe, title_color, accent = palette
    for phase in range(8):
        image = Image.new("RGBA", (468, 60), bg)
        draw = ImageDraw.Draw(image)
        for x in range(-60 + phase * 9, 520, 48):
            draw.polygon([(x, 0), (x + 25, 0), (x - 15, 60), (x - 40, 60)], fill=stripe)
        for y in range(2, 60, 4):
            draw.line((0, y, 467, y), fill="#000000", width=1)
        draw.rectangle((1, 1, 466, 58), outline="#ffffff")
        draw.rectangle((5, 5, 462, 54), outline="#111111")
        draw.text((14, 7), title, font=ui_font(19, True, True), fill=title_color)
        draw.rectangle((13, 36, 455, 53), fill="#111111")
        draw.text((20, 38), subtitle, font=ui_font(10, True), fill="#ffffff")
        pulse = accent if phase % 2 == 0 else "#ffffff"
        draw.ellipse((431, 10, 451, 30), fill=pulse, outline="#111111")
        draw.polygon([(438, 14), (447, 20), (438, 26)], fill="#111111")
        frames.append(image)
    save_gif(frames, name, 130)


if __name__ == "__main__":
    make_spark()
    make_disc()
    make_camera()
    make_new()
    make_write_me()
    make_banner()
    make_class_icons()
    make_module_icons()
    make_network_icon()
    make_route_arrow()
    make_ad_banner(
        "game-banner.gif",
        "DEMO DISC 109",
        "NEW LEVELS / MEMORY CARD READY / SUMMER 1999",
        ("#1841c5", "#1b88e8", "#fff43b", "#ff45bd"),
    )
    make_ad_banner(
        "anime-banner.gif",
        "MIDNIGHT ANIME NETWORK",
        "TOKYO VIDEO TRANSMISSION / ON AIR NOW",
        ("#8e008c", "#ca00a0", "#63ffca", "#fff238"),
    )
    make_ad_banner(
        "web-banner.gif",
        "PERSONAL WEB RING",
        "CONNECT / CREATE / PUBLISH / 56K FRIENDLY",
        ("#ef5b19", "#ff9a24", "#ffffff", "#4ef5ff"),
    )
    print(f"Created retro GIF assets in {OUT}")
