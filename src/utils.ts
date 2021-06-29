import { basename, join } from 'path';
import { addPageToProject, setProject } from './reducers/actions';
import store from './reducers/store';
import { Project } from './reducers/types';
import {
    CONFIG_NAME,
    CONTENT_DIR_NAME,
    PAGE_EXTENSION,
    PLUGIN_DIR_NAME,
    PYTHON_HEADER_DISCLAIMER,
    PYTHON_IMPORTS,
    SOURCE_DIR_NAME,
} from './resources/constants';

const { dialog } = window.require('electron').remote;
import { sync } from 'glob';
import * as fs from 'fs';
import { Data } from 'rete/types/core/data';
import { createPythonDefinitions, prepareData } from './resources/stringbuilder';

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

// PROJECT -----------------------------------------------------

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
    writeProjectSource(id, project);
    writeProjectPlugin(id, project);
    writeProjectContent(id, project);

    return id;
}

export function writeProjectConfig(id: string, project: Project) {
    const out_string = JSON.stringify({
        version: 1,
        name: project.name,
        id: id,
    });

    const out_path = getProjectConfigPath(project.path);

    fs.writeFileSync(out_path, out_string);
}

export function writeProjectSource(_: string, project: Project) {
    const out_path = join(project.path, SOURCE_DIR_NAME);

    fs.mkdir(out_path, (err) => {
        if (err) {
            console.error('unable to create source folder:', err);
        }
    });
}

export function writeProjectPlugin(_: string, project: Project) {
    const out_path = join(project.path, PLUGIN_DIR_NAME);

    fs.mkdir(out_path, (err) => {
        if (err) {
            console.error('unable to create plugin folder:', err);
        }
    });
}

export function writeProjectContent(_: string, project: Project) {
    const out_path = join(project.path, CONTENT_DIR_NAME);

    fs.mkdir(out_path, (err) => {
        if (err) {
            console.error('unable to create content folder:', err);
        }
    });
}

export async function saveProjectToLS(project: Project) {
    localStorage.setItem(project.id, JSON.stringify(project));
}

export function loadProjectFromPath(path: string): Project | null {
    const json = fs.readFileSync(path);
    if (json) {
        const config = JSON.parse(json);
        const storage_response = localStorage.getItem(config.id || '');
        if (storage_response) {
            const project = JSON.parse(storage_response) as Project;
            updateProject(project);
            return project;
        }
    }
    return null;
}

export const openProject = () => {
    const results = openProjectFilePicker();
    if (results) {
        const project = loadProjectFromPath(results[0]);
        if (project) {
            store.dispatch(setProject(project));
        }
    }
};

function updateProject(project: Project) {
    if (!project.version) {
        project.version = 0;
    }

    return updateProjectToOne(project);
}

function updateProjectToOne(project: Project) {
    if (project.version >= 1) return project;

    project.pages = [];
    project.version = 1;
    return project;
}

// PAGES -------------------------------------------------------

export function openAndAddFileToPages() {
    const ext = PAGE_EXTENSION;
    const results = dialog.showOpenDialogSync({
        filters: [{ name: 'DeepTrack page', extensions: [ext] }],
    });

    store.dispatch();
}

export function newFile() {
    const project = store.getState().project;
    if (project.id) {
        const pages = findAllProjectPages(project.path).map((path) => basename(path));
        const ext = PAGE_EXTENSION;
        let idx = 0;

        let _name = 'page';
        let name = _name;

        while (fs.existsSync(join(project.path, name + '.' + ext))) {
            idx++;
            name = _name + idx;
        }
        const path = join(project.path, CONTENT_DIR_NAME, name + '.' + ext);

        fs.writeFileSync(path, '{}');
        store.dispatch(addPageToProject({ page: path }));
    }
}

export function findAllProjectPages(dir: string): string[] {
    const query = join(dir, '**', '*.' + PAGE_EXTENSION);
    return sync(query);
}
// DATASET -----------------------------------------------------

export function openDatasetPicker(): string[] | undefined {
    return dialog.showOpenDialogSync({ properties: ['multiSelections'] });
}

// UTILS -------------------------------------------------------

// PYTHON ------------------------------------------------------

export function writePython(data: Data, path: string) {
    fs.writeFileSync(path, '');

    fs.appendFileSync(path, PYTHON_HEADER_DISCLAIMER);
    fs.appendFileSync(path, PYTHON_IMPORTS);

    const refs = prepareData(data.nodes);
    const python_defs = createPythonDefinitions(data.nodes, refs);
    console.log(python_defs);
}
export function featureToString(data: Data) {}
export function propertyToString(data: Data) {}
