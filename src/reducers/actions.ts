/**
 * Actions operating on the store should be defined here.
 */

import {
    Project,
    SetProjectAction,
    SET_PROJECT,
    OPEN_CREATE_PROJECT_MODAL,
    CLOSE_CREATE_PROJECT_MODAL,
    CloseCreateProjectModal,
    OpenCreateProjectModal,
} from './types';

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
