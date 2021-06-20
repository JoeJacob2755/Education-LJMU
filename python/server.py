import asyncio
import logging
import grpc

import grpc_routing_pb2_grpc
from dtserver import PyAPI


async def serve():
    server = grpc.aio.server()
    grpc_routing_pb2_grpc.add_RouteGuideServicer_to_server(PyAPI(), server)
    server.add_insecure_port("[::]:50051")
    await server.start()
    await server.wait_for_termination()


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.get_event_loop().run_until_complete(serve())