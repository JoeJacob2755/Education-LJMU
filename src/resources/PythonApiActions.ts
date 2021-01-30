type SetActiveDataset = {
    type: 'set_active_dataset';
    payload: [files: string[], axis: number];
};

type Echo = {
    type: 'echo';
    payload: [value: string];
};

type Data = {
    type: 'data';
    payload: [value: number];
};

export type PythonActions = Echo | Data | SetActiveDataset;
