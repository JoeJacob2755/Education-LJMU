import * as grpc from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';
import { promisify } from 'util';
import { ProtoGrpcType } from './grpc_routing';

const path = require('path');

const PROTO_PATH = './proto/grpc_routing.proto';
console.log(path.resolve(PROTO_PATH));
var _ = require('lodash');

var packageDefinition = loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});

const Router = (grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType).dtserver.grpc;

var client = new Router.Routing('localhost:50051', grpc.credentials.createInsecure());

export default {
    ...client,
    getFeaturesPromise: promisify(client.getFeatures.bind(client)),
};
