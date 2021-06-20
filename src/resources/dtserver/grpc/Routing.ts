// Original file: proto/grpc_routing.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Feature as _dtserver_grpc_Feature, Feature__Output as _dtserver_grpc_Feature__Output } from '../../dtserver/grpc/Feature';
import type { NoneLike as _dtserver_grpc_NoneLike, NoneLike__Output as _dtserver_grpc_NoneLike__Output } from '../../dtserver/grpc/NoneLike';

export interface RoutingClient extends grpc.Client {
  GetFeatures(argument: _dtserver_grpc_NoneLike, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_dtserver_grpc_Feature__Output>;
  GetFeatures(argument: _dtserver_grpc_NoneLike, options?: grpc.CallOptions): grpc.ClientReadableStream<_dtserver_grpc_Feature__Output>;
  getFeatures(argument: _dtserver_grpc_NoneLike, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_dtserver_grpc_Feature__Output>;
  getFeatures(argument: _dtserver_grpc_NoneLike, options?: grpc.CallOptions): grpc.ClientReadableStream<_dtserver_grpc_Feature__Output>;
  
}

export interface RoutingHandlers extends grpc.UntypedServiceImplementation {
  GetFeatures: grpc.handleServerStreamingCall<_dtserver_grpc_NoneLike__Output, _dtserver_grpc_Feature>;
  
}

export interface RoutingDefinition extends grpc.ServiceDefinition {
  GetFeatures: MethodDefinition<_dtserver_grpc_NoneLike, _dtserver_grpc_Feature, _dtserver_grpc_NoneLike__Output, _dtserver_grpc_Feature__Output>
}
