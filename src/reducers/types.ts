export type Project = Record<string, never>;

export interface State {
  project: Project | Record<string, never>;
}

export const SET_PROJECT = "SET_PROJECT";
export interface SetProjectAction {
  type: "SET_PROJECT";
  payload: Project;
}

export type Action = SetProjectAction;
