import type * as grpc from '@grpc/grpc-js';
import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { RoutingClient as _dtserver_grpc_RoutingClient, RoutingDefinition as _dtserver_grpc_RoutingDefinition } from './dtserver/grpc/Routing';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  dtserver: {
    grpc: {
      Feature: MessageTypeDefinition
      FeatureList: MessageTypeDefinition
      NoneLike: MessageTypeDefinition
      Property: MessageTypeDefinition
      Routing: SubtypeConstructor<typeof grpc.Client, _dtserver_grpc_RoutingClient> & { service: _dtserver_grpc_RoutingDefinition }
    }
  }
}
