/**
 * Actions operating on the store should be defined here.
 */

import { Project, SetProjectAction, SET_PROJECT } from './types';

export function setProject(newProject: Project): SetProjectAction {
    return {
        type: SET_PROJECT,
        payload: newProject,
    };
}
