export type Project =
    | {
          id: string;
          name: string;
          path: string;
          goal: string;
          created: Date;
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
    goal: string;
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

export type Action = SetProjectAction | OpenCreateProjectModal | CloseCreateProjectModal;
