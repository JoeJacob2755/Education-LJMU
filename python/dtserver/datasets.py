import os
import itertools
import numpy as np
import deeptrack as dt
import glob

EXTENSIONS = ["bmp", "png", "npy", "jpg", "jpeg", "tif", "tiff"]


# ============================================================
# CLASSES
# ============================================================


class DataIterator:
    def __init__(self, path, axis=0):
        self.path = path
        self.axis = axis

    def __iter__(self):
        pass

    def __next__(self):

        # Iterate forever
        while True:

            images = dt.LoadImage(path=self.path).resolve()
            images = np.moveaxis(images, self.axis, 0)
            images = [image for image in images]

            # By popping the first index in list, we free memory continuously
            while image := images.pop(0):
                yield image


class Dataset:
    def __init__(self, *args, **kwargs):
        self.iterators = {}
        super().__init__(*args, **kwargs)

    def _as_iterator(self, path, axis=None):
        if path in self.iterators:
            iterator = self.iterators[path]
        else:
            if axis is None:
                iterator = (dt.LoadImage(path=path).resolve() for _ in iter(int, 1))
            else:
                iterator = DataIterator(path, axis)
            self.iterators[path] = iterator
        return iterator


class ImageDataset(dt.Feature, Dataset):
    """Loads a dataset file by file.
    Dataset loader for image-to-image networks, where each sample is in its own file.
    Expects a file structure like

    .. code-block::
       root_path/
       . . path_to_data/
       . . . . file_1...
       . . . . file_2...
       . . path_to_label/
       . . . . label_of_file_1...
       . . . . label_of_file_2...

    root_path can be any path and is set by the property `root_path`
    The files are expected to be ordered such that they will be loaded in
    order by the glob module. A good way to guarantee this is to name the
    data file and the label file is the same, just in different folder, or
    just a different prefix, with the same suffix (such as a numbering 0,
    1...).
    Note that the data and the label do not be in different folders. The
    following is also a valid structure:

    .. code-block::
       root_path/
       . . file_1...
       . . file_2...
       ...
       . . label_of_file_1...
       . . label_of_file_2...

    Parameters
    ----------
    root_path : str
        The base path of the dataset
    data_selector : str
        A selector identifying the data files. Does not need to specify root_path.
        Follows the syntax of the glob module, where * is a wildcard. For
        example `'data/*'` matches all files in the folder data. Regex is
        in large parts supported.
    label_selector : str
        A selector identifying the label files. Does not need to specify root_path.
        Follows the syntax of the glob module, where * is a wildcard. For
        example `'label/*'` matches all files in the folder label. Regex is
        in large parts supported.
    sort_results : bool
        Sorts the lists of files. This is only useful if the glob module does not
        orders the files on some other metric than alphabetical ordering.
    """

    __distributed__ = False

    def __init__(self, paths=[], axis=None, **kwargs):
        def get_next_of_data_iterator(path, axis):
            return self._as_iterator(path, axis)

        super().__init__(
            path=itertools.cycle(paths),
            data=get_next_of_data_iterator,
            axis=axis,
            **kwargs,
        )

    def get(self, *args, data, **kwargs):
        return next(data)


# ============================================================
# UTILS
# ============================================================


def is_file(file):
    return os.path.isfile(file)


def valid_extension(file: str):
    extension = file.split(os.path.extsep)[-1]
    return extension in EXTENSIONS


def parse_data_config(files, axis):

    # Validate files
    for file in files:
        assert is_file(file), "File does not exist: {0}".format(file)
        assert (
            valid_extension
        ), "File extension not supported, valid extensions are: {0}".format(
            ", ".join(EXTENSIONS)
        )

    return ImageDataset(files, axis)


def get_file_from_dataset(file, dataset):

    file = dataset.resolve(file)
