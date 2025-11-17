from PIL import Image
from io import BytesIO


def convert_png(file) :
    image = Image.open(file)
    image = image.convert("RGBA")
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    file_bytes = buffer.read()

    return file_bytes

