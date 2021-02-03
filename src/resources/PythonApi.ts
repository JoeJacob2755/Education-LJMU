const zerorpc = window.require('zerorpc');
const util = window.require('util');
const pythonClient = new zerorpc.Client();
pythonClient.connect('tcp://127.0.0.1:2000');

console.log(pythonClient);
// Types

export type ApiError = Record<string, unknown> | null;

export type ImageDataType = { data: Buffer; vmin: number; vmax: number }[];
export type PropertyType = {
    type: 'property';
    default: string;
    annotation: string;
    description: string;
};
export type FeatureType = {
    type: 'feature';
    package: string;
    name: string;
    description: string;
    properties: Record<string, PropertyType>;
};

export type SetActiveDatasetPayload = [files: string[], axis: number | null];
export type SetActiveDatasetResponse = null;

export type GetDataByPathFromActiveDatasetPayload = [file: string];
export type GetDataByPathFromActiveDatasetResponse = ImageDataType;

export type GetAvailableFeaturesPayload = [];
export type GetAvailableFeaturesResponse = Record<string, Record<string, FeatureType>>;

// type ApiCallback = (error: Record<string, unknown> | null, res: Record<string, unknown> | null) => void;

function PromiseInvoke<T>(...args: any[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        pythonClient.invoke(...args, (err: any, data: T) => {
            if (err) return reject(err);
            resolve(data);
        });
    });
}

export default {
    setActiveDataset: (action: SetActiveDatasetPayload) => {
        return PromiseInvoke<SetActiveDatasetResponse>('set_active_dataset', ...action);
    },

    getDataByPathFromActiveDataset: (action: GetDataByPathFromActiveDatasetPayload) => {
        return PromiseInvoke<ImageDataType>('get_data_by_path_from_active_dataset', ...action);
    },

    getAvailableFeatures: (action: GetAvailableFeaturesPayload) => {
        return PromiseInvoke<GetAvailableFeaturesResponse>('get_available_features', ...action);
    },
};
