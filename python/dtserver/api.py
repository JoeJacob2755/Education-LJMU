import numpy as np
import functools

from . import datasets, translation, deeptrack_wrapper
from .. import grpc_routing_pb2_grpc, grpc_routing_pb2


class PyAPI(grpc_routing_pb2_grpc.RoutingServicerServicer):
    def __init__(self):
        self.active_dataset = None

    # ==============================================
    # Utils
    # ==============================================
    def _assert_active_dataset(self):
        assert self.active_dataset is not None, "Active dataset not yet set."

    # ==============================================
    # API
    # ==============================================

    # DATASET
    def set_active_dataset(self, files, axis):
        self.active_dataset = datasets.parse_data_config(files=files, axis=axis)

    def get_next_from_active_dataset(self):
        self._assert_active_dataset()
        return translation.format_data_as_image(self.active_dataset.update().resolve())

    def get_data_by_path_from_active_dataset(self, path):
        self._assert_active_dataset()
        image = translation.format_data_as_image(
            self.active_dataset.update(path=path).resolve()
        )
        return image

    # FEATURES
    def GetFeatures(
        self, request: grpc_routing_pb2.NoneLike, unused_context
    ) -> grpc_routing_pb2.AsyncIterable[grpc_routing_pb2.Feature]:
        return deeptrack_wrapper.get_all_features_for_frontend()
