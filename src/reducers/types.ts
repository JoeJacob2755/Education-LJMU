export type Project =
    | {
          id: string;
          name: string;
          path: string;
          template: string;
          created: Date;
          pages: string[];
          version: number;
      }
    | Record<string, never>;

export interface State {
    project: Project | Record<string, never>;
    createProjectModalOpen: boolean;
}

export const CREATE_AND_SET_PROJECT = 'CREATE_AND_SET_PROJECT';
export type CreateAndSetProjectPayload = {
    name: string;
    path: string;
    template: string;
};
export interface CreateAndSetProjectAction {
    type: 'CREATE_AND_SET_PROJECT';
    payload: CreateAndSetProjectPayload;
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

export const ADD_PAGE_TO_PROJECT = 'ADD_PAGE_TO_PROJECT';
export type AddPageToProjectPayload = {
    page: string;
};
export interface AddPageToProject {
    type: 'ADD_PAGE_TO_PROJECT';
    payload: AddPageToProjectPayload;
}

export type Action = SetProjectAction | OpenCreateProjectModal | CloseCreateProjectModal | AddPageToProject;
