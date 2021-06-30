// Original file: proto/grpc_routing.proto


export interface Image {
  'data'?: (Buffer | Uint8Array | string)[];
  'vmin'?: (number | string);
  'vmax'?: (number | string);
  'height'?: (number);
  'width'?: (number);
  'nchannels'?: (number);
}

export interface Image__Output {
  'data': (Buffer)[];
  'vmin': (number);
  'vmax': (number);
  'height': (number);
  'width': (number);
  'nchannels': (number);
}
