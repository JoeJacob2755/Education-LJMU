import { join } from 'path';
import { Project } from './reducers/types';
import { CONFIG_NAME } from './resources/constants';

const { dialog } = window.require('electron').remote;
const fs = window.require('fs');

function generateUUID(): string {
    // Public Domain/MIT
    var d = new Date().getTime(); //Timestamp
    var d2 = (performance && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
            //Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            //Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}

export function openProjectPicker(): string[] | undefined {
    return dialog.showOpenDialogSync({ properties: ['openDirectory'] });
}

export function openProjectFilePicker(): string[] | undefined {
    const split_config = CONFIG_NAME.split('.');
    const ext = split_config[split_config.length - 1];
    return dialog.showOpenDialogSync({
        filters: [{ name: 'Project Config File', extensions: [ext] }],
    });
}

export function getProjectConfigPath(folder: string): string {
    return join(folder, CONFIG_NAME);
}

export function createProjectConfig(project: Project): string {
    let id = generateUUID();
    while (localStorage.getItem(id)) {
        id = generateUUID();
    }

    writeProjectConfig(id, project);

    return id;
}

export function writeProjectConfig(id: string, project: Project) {
    const out_string = JSON.stringify({
        name: project.name,
        id: id,
    });

    const out_path = getProjectConfigPath(project.path);

    fs.writeFileSync(out_path, out_string);
}
export async function saveProjectToLS(project: Project) {
    localStorage.setItem(project.id, JSON.stringify(project));
}

export function loadProject(path: string): Project | null {
    const json = fs.readFileSync(path);
    if (json) {
        const config = JSON.parse(json);
        const storage_response = localStorage.getItem(config.id || '');
        if (storage_response) {
            return JSON.parse(storage_response) as Project;
        }
    }
    return null;
}
