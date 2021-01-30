import { PythonActions } from './PythonApiActions';

const zerorpc = window.require('zerorpc');
const pythonClient = new zerorpc.Client();

export default {
    dispatch: (action: PythonActions) => {
        pythonClient.dispatch(action.type, ...action.payload);
    },
};
