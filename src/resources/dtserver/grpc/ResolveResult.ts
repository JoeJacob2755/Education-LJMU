// Original file: proto/grpc_routing.proto

import type { Resolved as _dtserver_grpc_Resolved, Resolved__Output as _dtserver_grpc_Resolved__Output } from '../../dtserver/grpc/Resolved';
import type { Image as _dtserver_grpc_Image, Image__Output as _dtserver_grpc_Image__Output } from '../../dtserver/grpc/Image';

export interface ResolveResult {
  'id'?: (number);
  'resolved'?: (_dtserver_grpc_Resolved | null);
  'image'?: (_dtserver_grpc_Image | null);
  'result'?: "resolved"|"image";
}

export interface ResolveResult__Output {
  'id': (number);
  'resolved'?: (_dtserver_grpc_Resolved__Output | null);
  'image'?: (_dtserver_grpc_Image__Output | null);
  'result': "resolved"|"image";
}
