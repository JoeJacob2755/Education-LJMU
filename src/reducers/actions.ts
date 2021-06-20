/**
 * Actions operating on the store should be defined here.
 */

import { PROJECT_VERSION } from '../resources/constants';
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
    AddPageToProject,
    ADD_PAGE_TO_PROJECT,
    AddPageToProjectPayload,
} from './types';

export function createAndSetProject(newProject: CreateAndSetProjectPayload): SetProjectAction {
    const project: Project = { ...newProject, created: new Date(), id: '', pages: [], version: PROJECT_VERSION };
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

export function addPageToProject(page: AddPageToProjectPayload): AddPageToProject {
    return {
        type: ADD_PAGE_TO_PROJECT,
        payload: page,
    };
}
