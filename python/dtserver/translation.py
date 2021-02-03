import io
import numpy as np
from PIL import Image


def normalize_data(data, normalization):

    # Ensure is array
    data = np.array(data)[..., 0]
    if data.ndim == 2:
        data = np.expand_dim(data, axis=-1)

    if normalization == "grayscale":

        for z in range(data.shape[-1]):
            channel = data[..., z]
            channel_min = np.min(channel)
            channel_max = np.max(channel)
            channel = (channel - channel_min) / (channel_min - channel_max)
            channel[np.isnan(channel)] = 0
            yield channel * 255, channel_min, channel_max


def format_data_as_image(data, normalization="grayscale"):

    output = []

    for channel, vmin, vmax in normalize_data(data, normalization):
        channel = Image.fromarray(channel.astype(np.uint8))
        tmpfile = io.BytesIO()
        channel.save(tmpfile, format="bmp")

        tmpfile.seek(0)
        output.append(
            {"data": tmpfile.getvalue(), "vmin": float(vmin), "vmax": float(vmax)}
        )

    return output