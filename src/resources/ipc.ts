import { openCreateProjectModal } from '../reducers/actions';
import store from '../reducers/store';
import { newFile, openProject } from '../utils';

const { ipcRenderer } = require('electron');

ipcRenderer.on('new-project', () => {
    store.dispatch(openCreateProjectModal());
});

ipcRenderer.on('open-project', () => {
    openProject();
});

ipcRenderer.on('new-file', () => {
    newFile();
});

export default {};
