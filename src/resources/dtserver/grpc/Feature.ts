// Original file: proto/grpc_routing.proto

import type { Property as _dtserver_grpc_Property, Property__Output as _dtserver_grpc_Property__Output } from '../../dtserver/grpc/Property';

export interface Feature {
  'name'?: (string);
  'package'?: (string);
  'description'?: (string);
  'properties'?: (_dtserver_grpc_Property)[];
}

export interface Feature__Output {
  'name': (string);
  'package': (string);
  'description': (string);
  'properties': (_dtserver_grpc_Property__Output)[];
}
