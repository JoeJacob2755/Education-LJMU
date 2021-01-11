/**
 * Actions operating on the store should be defined here.
 */

import { createProjectConfig, saveProjectToLS } from '../utils';
import {
    Project,
    SetProjectAction,
    SET_PROJECT,
    OPEN_CREATE_PROJECT_MODAL,
    CLOSE_CREATE_PROJECT_MODAL,
    CloseCreateProjectModal,
    OpenCreateProjectModal,
    CreateAndSetProjectPayload,
} from './types';

export function createAndSetProject(newProject: CreateAndSetProjectPayload): SetProjectAction {
    const project: Project = { ...newProject, created: new Date(), id: '' };
    project.id = createProjectConfig(project);
    saveProjectToLS(project);
    return setProject(project);
}

export function setProject(newProject: Project): SetProjectAction {
    return {
        type: SET_PROJECT,
        payload: newProject,
    };
}

export function openCreateProjectModal(): OpenCreateProjectModal {
    return {
        type: OPEN_CREATE_PROJECT_MODAL,
    };
}

export function closeCreateProjectModal(): CloseCreateProjectModal {
    return {
        type: CLOSE_CREATE_PROJECT_MODAL,
    };
}
