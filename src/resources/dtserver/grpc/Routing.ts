// Original file: proto/grpc_routing.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { FeatureList as _dtserver_grpc_FeatureList, FeatureList__Output as _dtserver_grpc_FeatureList__Output } from '../../dtserver/grpc/FeatureList';
import type { NoneLike as _dtserver_grpc_NoneLike, NoneLike__Output as _dtserver_grpc_NoneLike__Output } from '../../dtserver/grpc/NoneLike';

export interface RoutingClient extends grpc.Client {
  GetFeatures(argument: _dtserver_grpc_NoneLike, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _dtserver_grpc_FeatureList__Output) => void): grpc.ClientUnaryCall;
  GetFeatures(argument: _dtserver_grpc_NoneLike, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _dtserver_grpc_FeatureList__Output) => void): grpc.ClientUnaryCall;
  GetFeatures(argument: _dtserver_grpc_NoneLike, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _dtserver_grpc_FeatureList__Output) => void): grpc.ClientUnaryCall;
  GetFeatures(argument: _dtserver_grpc_NoneLike, callback: (error?: grpc.ServiceError, result?: _dtserver_grpc_FeatureList__Output) => void): grpc.ClientUnaryCall;
  getFeatures(argument: _dtserver_grpc_NoneLike, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _dtserver_grpc_FeatureList__Output) => void): grpc.ClientUnaryCall;
  getFeatures(argument: _dtserver_grpc_NoneLike, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _dtserver_grpc_FeatureList__Output) => void): grpc.ClientUnaryCall;
  getFeatures(argument: _dtserver_grpc_NoneLike, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _dtserver_grpc_FeatureList__Output) => void): grpc.ClientUnaryCall;
  getFeatures(argument: _dtserver_grpc_NoneLike, callback: (error?: grpc.ServiceError, result?: _dtserver_grpc_FeatureList__Output) => void): grpc.ClientUnaryCall;
  
}

export interface RoutingHandlers extends grpc.UntypedServiceImplementation {
  GetFeatures: grpc.handleUnaryCall<_dtserver_grpc_NoneLike__Output, _dtserver_grpc_FeatureList>;
  
}

export interface RoutingDefinition extends grpc.ServiceDefinition {
  GetFeatures: MethodDefinition<_dtserver_grpc_NoneLike, _dtserver_grpc_FeatureList, _dtserver_grpc_NoneLike__Output, _dtserver_grpc_FeatureList__Output>
}
