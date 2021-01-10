export type Project = Record<string, never>;

export interface State {
    project: Project | Record<string, never>;
    createProjectModalOpen: boolean;
}

export const SET_PROJECT = 'SET_PROJECT';
export interface SetProjectAction {
    type: 'SET_PROJECT';
    payload: Project;
}

export const OPEN_CREATE_PROJECT_MODAL = 'OPEN_CREATE_PROJECT_MODAL';
export interface OpenCreateProjectModal {
    type: 'OPEN_CREATE_PROJECT_MODAL';
}

export const CLOSE_CREATE_PROJECT_MODAL = 'CLOSE_CREATE_PROJECT_MODAL';
export interface CloseCreateProjectModal {
    type: 'CLOSE_CREATE_PROJECT_MODAL';
}

export type Action = SetProjectAction | OpenCreateProjectModal | CloseCreateProjectModal;
